package com.gantang.dbmt.dao.entity;

import com.gantang.dbmt.base.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name="flashback_policy")
@Data
public class FlashbackPolicyEntity extends BaseEntity {
    private String policyName; // 策略名称
    private String sourceConnectionId; // 源连接id
    private String targetConnectionId; // 目标连接id
    private String tempTargetConnectionId; // 临时测试目标连接id
    private String currentConnectionId; // 当前连接id (可以在 target和test之间切换)
    private String backupId; // 备份id
    private String restoreId; // 恢复id

    private String lastBackupLogId; // 最后一次备份日志id
    private String lastRestoreLogId; // 最后一次恢复日志id

    private Integer backupCnt; // 备份次数
    private Integer restoreCnt; // 恢复次数

}
