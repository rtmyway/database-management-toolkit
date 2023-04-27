package com.gantang.dbmt.dao.entity;

import com.gantang.dbmt.base.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name="backup_config")
@Data
public class BackupConfigEntity extends BaseEntity {
    private Integer retentionDays; // 保留天数
    private String frequency; // 备份频率
    private String description; // 描述
    private String timeSlots; // 执行时间段,多个时间段用逗号分隔
    private String effectiveStartDate; // 生效开始日(YYYY-MM-DD)
    private String effectiveEndDate; // 生效开始日(YYYY-MM-DD)
    private String cronExpression; // cron表达式
}
