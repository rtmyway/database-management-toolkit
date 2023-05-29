/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.thread;

import com.gantang.framework.lock.ResourceLock;
import com.gantang.framework.lock.service.ResourceLockService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;
import java.util.function.Function;

@Component
@Slf4j
public class BusinessTaskExecutor {
    @Autowired
    @Qualifier("businessThreadPoolTaskExecutor")
    protected ThreadPoolTaskExecutor businessThreadPoolTaskExecutor;

    @Autowired
    private ResourceLockService resourceLockService;

    /**
     * 默认线程池
     * @return
     */
    @Bean
    public ThreadPoolTaskExecutor businessThreadPoolTaskExecutor() {
        ThreadPoolTaskExecutor threadPoolTaskExecutor = new ThreadPoolTaskExecutor();
        threadPoolTaskExecutor.setCorePoolSize(100);
        threadPoolTaskExecutor.setQueueCapacity(50);
        threadPoolTaskExecutor.setMaxPoolSize(300);
        threadPoolTaskExecutor.setAllowCoreThreadTimeOut(true);
        threadPoolTaskExecutor.setKeepAliveSeconds(60);
        return threadPoolTaskExecutor;
    }

    /**
     * 执行任务(使用默认线程池,仅执行一次)
     * @param func 执行函数
     */
    public void execute(Function<Object[], Boolean> func) {
        BusinessTaskConfig config = new BusinessTaskConfig("线程任务", func, null, true);
        execute(this.businessThreadPoolTaskExecutor, config);
    }


    /**
     * 执行任务(使用默认线程池)
     * @param config 任务参数
     */
    public void execute(BusinessTaskConfig config) {
        execute(this.businessThreadPoolTaskExecutor, config);
    }

    /**
     * 执行任务(可指定线程池)
     * @param threadPoolTaskExecutor 线程池
     * @param config 任务参数
     */
    public void execute(ThreadPoolTaskExecutor threadPoolTaskExecutor, BusinessTaskConfig config) {
        if (config == null) {
            return;
        }

        threadPoolTaskExecutor.execute(() -> {
            if (config.getDelaySeconds() != null && config.getDelaySeconds() > 0) {
                if (config.isPrintLog()) {
                    log.info("{},延迟{}秒后开始执行", config.getTaskName(), config.getDelaySeconds());
                }
                sleep(config.getDelaySeconds());
            }

            int interval = 600; // 默认10分钟
            int cnt = 0;
            int retryCnt = 0;
            while (true) {
                cnt++;

                // 执行一次任务
                boolean result = this.doExecute(config, cnt, retryCnt);

                // 是否重试
                if (this.isRetry(config, result, retryCnt)) {
                    // 重试(相比默认间隔时间更短，近乎立即执行)
                    interval = config.getRetryConfig().getRetryInterval();
                    cnt--;
                    retryCnt++;
                    sleep(interval);
                    continue;
                }

                // 是否退出
                if (this.isExist(config, result, cnt)) {
                    break;
                }

                // 重试计数归零
                retryCnt = 0;
                sleep(config.getLoopConfig().getInterval());
            }
        });
    }

    /**
     * 执行一次任务
     * @param config
     * @param cnt
     * @param retryCnt
     * @return
     */
    private boolean doExecute(BusinessTaskConfig config, int cnt, int retryCnt) {
        // 执行结果
        boolean result = false;

        // 是否分布式任务
        boolean isDistributed = config.getLockConfig() != null;

        // 执行前日志
        if (config.isPrintLog()) {
            if (retryCnt == 0) {
                log.info("{},第{}次任务执行开始,执行参数={}", config.getTaskName(), cnt, config.getFunctionArgs());
            } else {
                log.info("{},第{}次任务执行开始(第{}次重试),执行参数={}", config.getTaskName(), cnt, retryCnt, config.getFunctionArgs());
            }
        }

        try {
            if (isDistributed) {
                BusinessTaskLockConfig lockConfig = config.getLockConfig();
                // 获取分布式锁
                ResourceLock resourceLock = resourceLockService.getLock(lockConfig.getLockKey(), 1, lockConfig.getLockSeconds());
                if (resourceLock.tryLock()) {
                    log.info("{},第{}次任务执行时获取分布式锁成功,lockKey={}", config.getTaskName(), cnt, lockConfig.getLockKey());
                    result = config.getExecuteFunction().apply(config.getFunctionArgs());
                    resourceLock.unLock();
                } else {
                    log.info("{},第{}次任务执行时获取分布式锁失败,lockKey={}", config.getTaskName(), cnt, lockConfig.getLockKey());
                }
            } else {
                result = config.getExecuteFunction().apply(config.getFunctionArgs());
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        // 执行后日志
        if (config.isPrintLog()) {
            if (retryCnt == 0) {
                log.info("{},第{}次任务执行结束,执行结果={}", config.getTaskName(), cnt, result);
            } else {
                log.info("{},第{}次任务执行结束(第{}次重试),执行结果={}", config.getTaskName(), cnt, retryCnt, result);
            }
        }
        return result;
    }


    /**
     * 根据循环规则和任务执行情况，判断是否要退出
     * @param config 循环执行规则
     * @param executeResult 本次执行结果
     * @param executeCnt 累积执行次数
     * @return
     */
    private boolean isExist(BusinessTaskConfig config, boolean executeResult, int executeCnt) {
        BusinessTaskLoopConfig loopConfig = config.getLoopConfig();
        if (loopConfig == null) {
            // 没有循环配置,默认不循环,退出
            return true;
        }

        if (executeResult && loopConfig.exitWithSuccess) {
            // 设置了执行成功后退出
            return true;
        }

        if (!executeResult && loopConfig.exitWithFailure) {
            // 设置了执行失败后退出
            return true;
        }

        if (loopConfig.getLoopCnt() == 0) {
            // 循环=0代表无限循环不退出
            return false;
        }

        // 是否达到了循环次数
        return executeCnt >= loopConfig.getLoopCnt();
    }


    /**
     * 根据重试规则判断是否要重试
     * @param config 循环执行规则
     * @param result 本次执行结果
     * @param retryCnt 已重试次数
     * @return
     */
    private boolean isRetry(BusinessTaskConfig config, boolean result, int retryCnt) {
        // 执行成功,不重试
        if (result) {
            return false;
        }

        BusinessTaskRetryConfig retryConfig = config.getRetryConfig();
        // 没有重试配置,不重试
        if (retryConfig == null) {
            return false;
        }

        // 已到极限,不重试
        if (retryCnt == Integer.MAX_VALUE) {
            return false;
        }

        // 设置为0,无限重试
        if (retryConfig.getRetryCnt() == 0) {
            return true;
        }


        // 重试次数未到上限，重试
        if (retryCnt < retryConfig.getRetryCnt()) {
            return true;
        }

        // 不重试
        return false;
    }

    /**
     * 暂停处理
     * @param seconds 秒数
     */
    private void sleep(int seconds) {
        try {
            TimeUnit.SECONDS.sleep(seconds);
        } catch (InterruptedException e) {
            log.warn(e.getMessage());
        }
    }
}
