package com.gantang.dbmt.controller;

import com.gantang.dbmt.dao.entity.BackupExecuteLogEntity;
import com.gantang.dbmt.dto.PageDto;
import com.gantang.dbmt.execption.DbmtException;
import com.gantang.dbmt.service.BackupService;
import com.gantang.dbmt.task.TaskLock;
import com.gantang.dbmt.vo.R;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("backup")
@Slf4j
public class BackupController {
    @Autowired
    private BackupService backupService;

    @PostMapping("list")
    public R<List<BackupExecuteLogEntity>> list(@RequestBody BackupExecuteLogEntity backupExecuteLogEntity) throws DbmtException {
        return R.success(backupService.list());
    }

    @PostMapping("list-page")
    public R<PageDto> listPage(@RequestBody PageDto pageDto) throws DbmtException {
        return R.success(backupService.listPage(pageDto));
    }

    @PostMapping("add")
    @TaskLock
    public R<Boolean> add(@RequestBody BackupExecuteLogEntity backupExecuteLogEntity) throws DbmtException {
        return R.success(backupService.add(backupExecuteLogEntity));
    }

    @PostMapping("remove")
    public R<Boolean> remove(@RequestBody BackupExecuteLogEntity backupExecuteLogEntity) throws DbmtException {
        return R.success(backupService.remove(backupExecuteLogEntity));
    }

    @PostMapping("cancel")
    public R<Boolean> cancel(@RequestBody BackupExecuteLogEntity backupExecuteLogEntity) throws DbmtException {
        return R.success(backupService.cancel(backupExecuteLogEntity));
    }
}
