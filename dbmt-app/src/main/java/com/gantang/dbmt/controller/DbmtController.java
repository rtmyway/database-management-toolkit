package com.gantang.dbmt.controller;

import com.gantang.dbmt.task.TaskProcessInfo;
import com.gantang.dbmt.vo.R;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("dbmt")
@Slf4j
public class DbmtController {
    @Autowired
    private TaskProcessInfo taskProcessInfo;

    @GetMapping("test")
    public String test() {
        return "Hello world!";
    }

    @PostMapping("load-task")
    public R<TaskProcessInfo> loadTask() {
        return R.success(taskProcessInfo);
    }

    @PostMapping("release-task")
    public R<TaskProcessInfo> releaseTask() {
        taskProcessInfo.doEnd();
        return R.success(taskProcessInfo);
    }
}
