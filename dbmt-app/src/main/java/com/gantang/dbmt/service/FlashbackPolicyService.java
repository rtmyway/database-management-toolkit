package com.gantang.dbmt.service;

import cn.hutool.core.util.IdUtil;
import com.gantang.dbmt.base.BaseAction;
import com.gantang.dbmt.dao.entity.FlashbackPolicyEntity;
import com.gantang.dbmt.dao.repository.FlashbackPolicyRepository;
import com.gantang.dbmt.enumeration.StatusItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class FlashbackPolicyService implements BaseAction<FlashbackPolicyEntity> {
    @Autowired
    private FlashbackPolicyRepository flashbackPolicyRepository;


    @Override
    public Boolean add(FlashbackPolicyEntity flashbackPolicyEntity) {
        flashbackPolicyEntity.setId(IdUtil.fastSimpleUUID());
        flashbackPolicyRepository.save(flashbackPolicyEntity);
        return true;
    }

    @Override
    public Boolean delete(FlashbackPolicyEntity flashbackPolicyEntity) {
        flashbackPolicyRepository.deleteById(flashbackPolicyEntity.getId());
        return true;
    }

    @Override
    public Boolean update(FlashbackPolicyEntity flashbackPolicyEntity) {
        flashbackPolicyRepository.save(flashbackPolicyEntity);
        return true;
    }

    @Override
    public Boolean enable(FlashbackPolicyEntity flashbackPolicyEntity) {
        flashbackPolicyEntity.setStatus(StatusItem.ENABLE.getValue());
        flashbackPolicyRepository.save(flashbackPolicyEntity);
        return true;
    }

    @Override
    public Boolean disable(FlashbackPolicyEntity flashbackPolicyEntity) {
        flashbackPolicyEntity.setStatus(StatusItem.DISABLE.getValue());
        flashbackPolicyRepository.save(flashbackPolicyEntity);
        return true;
    }

    @Override
    public List<FlashbackPolicyEntity> list() {
        return flashbackPolicyRepository.findAll();
    }
}
