package com.gantang.dbmt.dao.entity;

import com.gantang.dbmt.base.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name="backup_execute_log")
@Data
public class BackupExecuteLogEntity extends BaseEntity {
    private String flashbackPolicyId; // 闪回策略id

    private String sourceConnectionId; // 源库连接配置id
    private String sourceConnectionSnapshot; // 源库连接配置快照
    private String backupConfigId; // 备份配置id
    private String backupConfigSnapshot; // 备份配置快照

    private String backupName; // 备份名称
    private String backupFilePath; // 备份文件路径
    private Long backupFileSize; // 备份文件大小
    private String opMode; // 操作模式(定时备份,手动备份)
    private Long startTime; // 开始时间
    private Long endTime; // 结束时间
    private Boolean isSuccess; // 是否成功
}
