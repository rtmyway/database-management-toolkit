/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.thread;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessTaskLoopConfig {
    /**
     * 循环次数,0表示无限次
     */
    private int loopCnt;

    /**
     * 间隔时间,单位: 秒
     */
    private int interval;

    /**
     * 执行成功后是否退出
     */
    boolean exitWithSuccess;

    /**
     * 执行失败后是否退出
     */
    boolean exitWithFailure;
}
