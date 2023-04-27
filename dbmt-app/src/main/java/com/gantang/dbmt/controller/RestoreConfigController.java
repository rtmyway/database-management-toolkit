package com.gantang.dbmt.controller;

import com.gantang.dbmt.dao.entity.RestoreConfigEntity;
import com.gantang.dbmt.service.RestoreConfigService;
import com.gantang.dbmt.vo.R;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("restore-config")
@Slf4j
public class RestoreConfigController {
    @Autowired
    private RestoreConfigService restoreConfigService;

    @PostMapping("add")
    public R<Boolean> add(@RequestBody RestoreConfigEntity entity) {
        return R.success(restoreConfigService.add(entity));
    }

    @PostMapping("update")
    public R<Boolean> update(@RequestBody RestoreConfigEntity entity) {
        return R.success(restoreConfigService.update(entity));
    }

    @PostMapping("remove")
    public R<Boolean> remove(@RequestBody RestoreConfigEntity entity) {
        return R.success(restoreConfigService.remove(entity));
    }

    @PostMapping("list")
    public R<List<RestoreConfigEntity>> list() {
        return R.success(restoreConfigService.list());
    }
}
