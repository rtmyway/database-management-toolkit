package com.gantang.dbmt.controller;

import com.gantang.dbmt.dao.entity.RestoreExecuteLogEntity;
import com.gantang.dbmt.dto.PageDto;
import com.gantang.dbmt.execption.DbmtException;
import com.gantang.dbmt.service.RestoreService;
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
@RequestMapping("restore")
@Slf4j
public class RestoreController {
    @Autowired
    private RestoreService restoreService;

    @PostMapping("list")
    public R<List<RestoreExecuteLogEntity>> list(@RequestBody RestoreExecuteLogEntity restoreExecuteLogEntity) throws DbmtException {
        return R.success(restoreService.list());
    }

    @PostMapping("list-page")
    public R<PageDto> listPage(@RequestBody PageDto pageDto) throws DbmtException {
        return R.success(restoreService.listPage(pageDto));
    }

    @PostMapping("add")
    @TaskLock
    public R<Boolean> add(@RequestBody RestoreExecuteLogEntity restoreExecuteLogEntity) throws DbmtException {
        return R.success(restoreService.add(restoreExecuteLogEntity));
    }

    @PostMapping("remove")
    public R<Boolean> remove(@RequestBody RestoreExecuteLogEntity restoreExecuteLogEntity) throws DbmtException {
        return R.success(restoreService.remove(restoreExecuteLogEntity));
    }
}
