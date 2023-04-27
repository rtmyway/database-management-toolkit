package com.gantang.dbmt.dao.entity;

import com.gantang.dbmt.base.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name="connection_config")
@Data
public class ConnectionConfigEntity extends BaseEntity {
    private String connectionName; // 连接名称
    private String env;
    private String databaseItem; // 数据库类型
    private String host; // 主机
    private String port; // 端口
    private String databaseName; // 数据库名称
    private String subDatabaseName; // 子数据库名称(主要用在oracle中的pdb)
    private String userName; // 用户名
    private String password; // 密码
    private String description; // 描述
}
