/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.thread;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.function.Function;

@Data
@NoArgsConstructor
/**
 * 业务任务配置
 */
public class BusinessTaskConfig {
    /**
     * 任务名称
     */
    private String taskName;

    /**
     * 执行函数, 返回true表示执行成功, 返回false表示执行失败
     */
    private Function<Object[], Boolean> executeFunction;

    /**
     * 执行函数参数
     */
    private Object[] functionArgs;

    /**
     * 是否输出进出日志
     */
    boolean printLog;

    /**
     * 延迟执行时间,单位: 秒
     */
    private Integer delaySeconds;

    /**
     * 循环配置
     */
    private BusinessTaskLoopConfig loopConfig;

    /**
     * 错误重试配置
     */
    private BusinessTaskRetryConfig retryConfig;

    /**
     * 锁配置
     */
    private BusinessTaskLockConfig lockConfig;

    public BusinessTaskConfig(String taskName, Function<Object[], Boolean> executeFunction, Object[] functionArgs, boolean printLog) {
        this(taskName, executeFunction, functionArgs, printLog, null, null, null);
    }


    public BusinessTaskConfig(String taskName, Function<Object[], Boolean> executeFunction, Object[] functionArgs, boolean printLog,
                              BusinessTaskLoopConfig loopConfig,
                              BusinessTaskRetryConfig retryConfig,
                              BusinessTaskLockConfig lockConfig) {
        this.taskName = taskName;
        this.executeFunction = executeFunction;
        this.functionArgs = functionArgs;
        this.printLog = printLog;
        this.loopConfig = loopConfig;
        this.retryConfig = retryConfig;
        this.lockConfig = lockConfig;
    }

    /**
     * 设置循环配置(定义任务循环次数,间隔时间,退出条件)
     * @param loopConfig
     * @return
     */
    public BusinessTaskConfig setLoopConfig(BusinessTaskLoopConfig loopConfig) {
        this.loopConfig = loopConfig;
        return this;
    }

    /**
     * 设置错误重试配置(定义重试次数,缩小重试间隔时间)
     * @param retryConfig
     * @return
     */
    public BusinessTaskConfig setRetryConfig(BusinessTaskRetryConfig retryConfig) {
        this.retryConfig = retryConfig;
        return this;
    }

    /**
     * 设置锁配置(用于分布式任务)
     * @param lockConfig
     * @return
     */
    public BusinessTaskConfig setLockConfig(BusinessTaskLockConfig lockConfig) {
        this.lockConfig = lockConfig;
        return this;
    }
}
