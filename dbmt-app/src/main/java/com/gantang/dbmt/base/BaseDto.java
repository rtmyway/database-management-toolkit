/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.base;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public abstract class BaseDto implements Serializable {
    private String id;
    private int status; // 1:有效 0:无效
    private Date createdAt;
    private Date updatedAt;
}
