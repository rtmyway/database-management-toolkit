package com.gantang.dbmt.dao.entity;

import com.gantang.dbmt.base.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name="restore_execute_log")
@Data
public class RestoreExecuteLogEntity extends BaseEntity {
    private String sourceConnectionConfigId; // 源库连接id
    private String sourceConnectionConfigSnapshot; // 源库连接信息快照
    private String targetConnectionConfigId; // 目标库连接id
    private String targetConnectionConfigSnapshot; // 目标库连接信息快照
    private String backupLogId; // 备份id
    private String opMode; // 操作模式(定时备份,手动备份)
    private Long startTime; // 开始时间
    private Long endTime; // 结束时间
    private Boolean isSuccess; // 是否成功
}
