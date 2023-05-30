package com.gantang.dbmt.thread;

import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

@Component
public class BusinessThreadPool {
    /**
     * 默认线程池
     * @return
     */
    @Bean
    public ThreadPoolTaskExecutor businessThreadPoolTaskExecutor() {
        ThreadPoolTaskExecutor threadPoolTaskExecutor = new ThreadPoolTaskExecutor();
        threadPoolTaskExecutor.setCorePoolSize(20);
        threadPoolTaskExecutor.setQueueCapacity(10);
        threadPoolTaskExecutor.setMaxPoolSize(100);
        threadPoolTaskExecutor.setAllowCoreThreadTimeOut(true);
        threadPoolTaskExecutor.setKeepAliveSeconds(20);
        return threadPoolTaskExecutor;
    }
}
