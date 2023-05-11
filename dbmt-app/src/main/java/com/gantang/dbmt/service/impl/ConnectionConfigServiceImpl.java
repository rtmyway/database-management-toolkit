package com.gantang.dbmt.service.impl;

import cn.hutool.core.util.IdUtil;
import com.gantang.dbmt.dao.entity.ConnectionConfigEntity;
import com.gantang.dbmt.dao.repository.ConnectionConfigRepository;
import com.gantang.dbmt.dto.PageDto;
import com.gantang.dbmt.enumeration.StatusItem;
import com.gantang.dbmt.execption.DbmtException;
import com.gantang.dbmt.service.ConnectionConfigService;
import com.gantang.dbmt.service.QueryCommonService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class ConnectionConfigServiceImpl implements ConnectionConfigService {
    @Autowired
    private QueryCommonService queryCommonService;
    @Autowired
    private ConnectionConfigRepository connectionConfigRepository;

    @Override
    public Boolean add(ConnectionConfigEntity connectionConfigEntity) throws DbmtException  {
        // 主机+端口+数据库名称是否重复
        List<ConnectionConfigEntity> list = connectionConfigRepository.findAllByHostAndPortAndDatabaseName(connectionConfigEntity.getHost(), connectionConfigEntity.getPort(), connectionConfigEntity.getDatabaseName());
        if (!list.isEmpty()) {
            log.error("主机+端口+数据库名称重复, entity={}", connectionConfigEntity);
            return false;
        }

        connectionConfigEntity.setId(IdUtil.fastSimpleUUID());
        connectionConfigEntity.setConnectionName(this.generateConnectionName(connectionConfigEntity));
        connectionConfigEntity.setCreatedAt(System.currentTimeMillis());
        connectionConfigRepository.save(connectionConfigEntity);
        return true;
    }

    @Override
    public Boolean remove(ConnectionConfigEntity connectionConfigEntity) throws DbmtException {
        connectionConfigRepository.deleteById(connectionConfigEntity.getId());
        return true;
    }

    @Override
    public Boolean update(ConnectionConfigEntity connectionConfigEntity) throws DbmtException {
        connectionConfigEntity.setConnectionName(this.generateConnectionName(connectionConfigEntity));
        connectionConfigEntity.setUpdatedAt(System.currentTimeMillis());
        connectionConfigRepository.save(connectionConfigEntity);
        return true;
    }

    @Override
    public Boolean enable(ConnectionConfigEntity connectionConfigEntity) throws DbmtException {
        connectionConfigEntity.setStatus(StatusItem.ENABLE.getValue());
        connectionConfigRepository.save(connectionConfigEntity);
        return true;
    }

    @Override
    public Boolean disable(ConnectionConfigEntity connectionConfigEntity) throws DbmtException {
        connectionConfigEntity.setStatus(StatusItem.DISABLE.getValue());
        connectionConfigRepository.save(connectionConfigEntity);
        return true;
    }

    @Override
    public List<ConnectionConfigEntity> list() throws DbmtException {
        return connectionConfigRepository.findAll();
    }

    @Override
    public PageDto listPage(PageDto pageDto) throws DbmtException {
        StringBuilder sb = new StringBuilder();
        sb.append("select * from connection_config where 1=1");
        sb.append(" order by created_at desc ");
        PageDto resultDto = null;
        try {
            resultDto = queryCommonService.loadListPage(sb.toString(), pageDto.getPageNum(), pageDto.getPageSize(), ConnectionConfigEntity.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return resultDto;
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
