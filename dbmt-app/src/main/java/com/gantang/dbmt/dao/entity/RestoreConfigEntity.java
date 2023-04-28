package com.gantang.dbmt.dao.entity;

import com.gantang.dbmt.base.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name="backup_policy")
@Data
public class RestoreConfigEntity extends BaseEntity {
    private String restoreName;
    private String schemaExpression; // sourceSchema1:targetSchema1,sourceSchema2:targetSchema2
    private String tableExpression; // sourceTable1:targetTable1,sourceTable2:targetTable2
    private Boolean isRestoreDdl; // 是否恢复ddl
    private Boolean isRestoreDml; // 是否恢复dml
}
