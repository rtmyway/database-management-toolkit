/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.base;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;
import java.util.Date;
@Data
@MappedSuperclass
public abstract class BaseEntity implements Serializable {
    @Id
    private String id; // 主键
    private int status; // 1:有效 0:无效
    @CreatedDate
    @Column(name = "created_at")
    private Date createdAt;
    @CreatedDate
    @LastModifiedDate
    @Column(name = "updated_at")
    private Date updatedAt;
}
