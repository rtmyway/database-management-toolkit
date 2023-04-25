package com.gantang.dbmt.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("dbmt")
@Slf4j
public class DbmtController {
    @GetMapping("test")
    public String test() {
        return "Hello world!";
    }
}
