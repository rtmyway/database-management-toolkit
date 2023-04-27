package com.gantang.dbmt.controller;

import com.gantang.dbmt.dao.entity.ConnectionConfigEntity;
import com.gantang.dbmt.service.ConnectionConfigService;
import com.gantang.dbmt.vo.R;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("connection-config")
@Slf4j
public class ConnectionConfigController {
    @Autowired
    private ConnectionConfigService connectionConfigService;

    @PostMapping("add")
    public R<Boolean> add(@RequestBody ConnectionConfigEntity entity) {
        return R.success(connectionConfigService.add(entity));
    }

    @PostMapping("update")
    public R<Boolean> update(@RequestBody ConnectionConfigEntity entity) {
        return R.success(connectionConfigService.update(entity));
    }

    @PostMapping("delete")
    public R<Boolean> delete(@RequestBody ConnectionConfigEntity entity) {
        return R.success(connectionConfigService.delete(entity));
    }

    @PostMapping("list")
    public R<List<ConnectionConfigEntity>> list() {
        return R.success(connectionConfigService.list());
    }
}
