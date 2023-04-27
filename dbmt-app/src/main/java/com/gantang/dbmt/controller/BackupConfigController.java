package com.gantang.dbmt.controller;

import com.gantang.dbmt.dao.entity.BackupConfigEntity;
import com.gantang.dbmt.service.BackupConfigService;
import com.gantang.dbmt.vo.R;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("backup-config")
@Slf4j
public class BackupConfigController {
    @Autowired
    private BackupConfigService backupConfigService;

    @PostMapping("add")
    public R<Boolean> add(@RequestBody BackupConfigEntity entity) {
        return R.success(backupConfigService.add(entity));
    }

    @PostMapping("update")
    public R<Boolean> update(@RequestBody BackupConfigEntity entity) {
        return R.success(backupConfigService.update(entity));
    }

    @PostMapping("delete")
    public R<Boolean> delete(@RequestBody BackupConfigEntity entity) {
        return R.success(backupConfigService.delete(entity));
    }

    @PostMapping("list")
    public R<List<BackupConfigEntity>> list() {
        return R.success(backupConfigService.list());
    }
}
