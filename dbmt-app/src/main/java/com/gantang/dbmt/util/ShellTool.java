/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;


/**
 * @ClassName ShellTool
 * @Description shell工具
 * @Author taozhen
 * @Date 2022/6/28
 */
@Slf4j
public class ShellTool {
    public static int execute(String executeUser, String shellPath, String... args) {
        log.info("【shell】 {} {} {} start", executeUser, shellPath, args);

        List<String> cmdList = new ArrayList<>();
        if (StringUtils.isNotBlank(executeUser)) {
            cmdList.add("sudo");
            cmdList.add("-u");
            cmdList.add(executeUser);
        }
        cmdList.add(shellPath);
        if (args != null && args.length > 0) {
            for (String arg : args) {
                cmdList.add(arg);
            }
        }

        int status = -1;
        ProcessBuilder pb = new ProcessBuilder(cmdList);
        try {
            Process p = pb.start();
            consumeInputStream(p.getInputStream());
            consumeInputStream(p.getErrorStream());

            status = p.waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
        log.info("【shell】 {} end, result = {}", shellPath, status);
        return status;
    }

    public static String consumeInputStream(InputStream is) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(is));
        String s;
        StringBuilder sb = new StringBuilder();
        while(((s = br.readLine()) != null)) {
            log.info(s);
            sb.append(s);
        }
        return sb.toString();
    }

    public static void main(String[] args) {
    }
}
