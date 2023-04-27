package com.gantang.dbmt.service;

import cn.hutool.core.util.IdUtil;
import com.gantang.dbmt.base.BaseAction;
import com.gantang.dbmt.dao.entity.ConnectionConfigEntity;
import com.gantang.dbmt.dao.repository.ConnectionConfigRepository;
import com.gantang.dbmt.enumeration.StatusItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ConnectionConfigService implements BaseAction<ConnectionConfigEntity> {
    @Autowired
    private ConnectionConfigRepository connectionConfigRepository;

    @Override
    public Boolean add(ConnectionConfigEntity connectionConfigEntity) {
        // 主机+端口+数据库名称是否重复
        List<ConnectionConfigEntity> list = connectionConfigRepository.findAllByHostAndPortAndDatabaseName(connectionConfigEntity.getHost(), connectionConfigEntity.getPort(), connectionConfigEntity.getDatabaseName());
        if (!list.isEmpty()) {
            log.error("主机+端口+数据库名称重复, entity={}", connectionConfigEntity);
            return false;
        }

        connectionConfigEntity.setId(IdUtil.fastSimpleUUID());
        connectionConfigEntity.setConnectionName(this.generateConnectionName(connectionConfigEntity));
        connectionConfigRepository.save(connectionConfigEntity);
        return true;
    }

    @Override
    public Boolean delete(ConnectionConfigEntity connectionConfigEntity) {
        connectionConfigRepository.deleteById(connectionConfigEntity.getId());
        return true;
    }

    @Override
    public Boolean update(ConnectionConfigEntity connectionConfigEntity) {
        connectionConfigRepository.save(connectionConfigEntity);
        return true;
    }

    @Override
    public Boolean enable(ConnectionConfigEntity connectionConfigEntity) {
        connectionConfigEntity.setStatus(StatusItem.ENABLE.getValue());
        connectionConfigRepository.save(connectionConfigEntity);
        return true;
    }

    @Override
    public Boolean disable(ConnectionConfigEntity connectionConfigEntity) {
        connectionConfigEntity.setStatus(StatusItem.DISABLE.getValue());
        connectionConfigRepository.save(connectionConfigEntity);
        return true;
    }

    @Override
    public List<ConnectionConfigEntity> list() {
        return connectionConfigRepository.findAll();
    }



    private String generateConnectionName(ConnectionConfigEntity connectionConfigEntity) {
        final String JOIN_STR = ":";
        StringBuilder sb = new StringBuilder();
        sb.append(connectionConfigEntity.getHost()).append(JOIN_STR)
                .append(connectionConfigEntity.getPort()).append(JOIN_STR)
                .append(connectionConfigEntity.getDatabaseName());
        return sb.toString();
    }
}
