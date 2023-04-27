package com.gantang.dbmt.service;

import cn.hutool.core.util.IdUtil;
import com.gantang.dbmt.base.BaseAction;
import com.gantang.dbmt.dao.entity.BackupConfigEntity;
import com.gantang.dbmt.dao.repository.BackupConfigRepository;
import com.gantang.dbmt.enumeration.StatusItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class BackupConfigService implements BaseAction<BackupConfigEntity> {
    @Autowired
    private BackupConfigRepository backupConfigRepository;

    @Override
    public Boolean add(BackupConfigEntity backupConfigEntity) {
        backupConfigEntity.setId(IdUtil.fastSimpleUUID());
        backupConfigRepository.save(backupConfigEntity);
        return true;
    }

    @Override
    public Boolean remove(BackupConfigEntity backupConfigEntity) {
        backupConfigRepository.deleteById(backupConfigEntity.getId());
        return true;
    }

    @Override
    public Boolean update(BackupConfigEntity backupConfigEntity) {
        backupConfigRepository.save(backupConfigEntity);
        return true;
    }

    @Override
    public Boolean enable(BackupConfigEntity backupConfigEntity) {
        backupConfigEntity.setStatus(StatusItem.ENABLE.getValue());
        backupConfigRepository.save(backupConfigEntity);
        return true;
    }

    @Override
    public Boolean disable(BackupConfigEntity backupConfigEntity) {
        backupConfigEntity.setStatus(StatusItem.DISABLE.getValue());
        backupConfigRepository.save(backupConfigEntity);
        return true;
    }

    @Override
    public List<BackupConfigEntity> list() {
        return backupConfigRepository.findAll();
    }
}
