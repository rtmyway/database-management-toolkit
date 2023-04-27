package com.gantang.dbmt.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("version")
@Slf4j
public class VersionController {
    @PostMapping("load")
    public String load() {
        return "1.0.0";
    }
}
