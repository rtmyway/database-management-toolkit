package com.gantang.dbmt.service;

import cn.hutool.core.util.IdUtil;
import com.gantang.dbmt.base.BaseAction;
import com.gantang.dbmt.dao.entity.RestoreConfigEntity;
import com.gantang.dbmt.dao.repository.RestoreConfigRepository;
import com.gantang.dbmt.enumeration.StatusItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class RestoreConfigService implements BaseAction<RestoreConfigEntity> {
    @Autowired
    private RestoreConfigRepository restoreConfigRepository;

    @Override
    public Boolean add(RestoreConfigEntity restoreConfigEntity) {
        restoreConfigEntity.setId(IdUtil.fastSimpleUUID());
        restoreConfigRepository.save(restoreConfigEntity);
        return true;
    }

    @Override
    public Boolean remove(RestoreConfigEntity restoreConfigEntity) {
        restoreConfigRepository.deleteById(restoreConfigEntity.getId());
        return true;
    }

    @Override
    public Boolean update(RestoreConfigEntity restoreConfigEntity) {
        restoreConfigRepository.save(restoreConfigEntity);
        return true;
    }

    @Override
    public Boolean enable(RestoreConfigEntity restoreConfigEntity) {
        restoreConfigEntity.setStatus(StatusItem.ENABLE.getValue());
        restoreConfigRepository.save(restoreConfigEntity);
        return true;
    }

    @Override
    public Boolean disable(RestoreConfigEntity restoreConfigEntity) {
        restoreConfigEntity.setStatus(StatusItem.DISABLE.getValue());
        restoreConfigRepository.save(restoreConfigEntity);
        return true;
    }

    @Override
    public List<RestoreConfigEntity> list() {
        return restoreConfigRepository.findAll();
    }
}
