/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.util;

import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

/**
 * @ClassName FileTool
 * @Description 文件工具类
 * @Author taozhen
 * @Date 2022/6/27
 */
@Slf4j
public class FileTool {
    private final ObjectMapper om = new ObjectMapper();

    public static List readFromFile(String filePath, Class classType) {
        List list = new ArrayList<>();
        if (!isExist(filePath)) {
            return list;
        }

        String jsonStr = read(filePath);
        if (StrUtil.isBlank(jsonStr)) {
            return list;
        }
        list = JsonTool.toList(jsonStr, classType);
        return list;
    }

    public static void writeToFile(String filePath, List list) {
        if (list == null) {
            list = new ArrayList<>();
        }
        if (!isExist(filePath)) {
            return;
        }
        String jsonStr = JsonTool.toJson(list);
        write(filePath, jsonStr);
    }

    /**
     * 获取文件绝对路径
     * @param filePath
     * @return
     */
    public static boolean isExist(String filePath) {
        File file = new File(filePath);
        if (file == null || !file.exists()) {
            return false;
        }
        return true;
    }

    /**
     * 获取文件大小
     * @param filePath
     * @return
     */
    public static long getFileSize(String filePath) {
        File file = new File(filePath);
        if (file == null || !file.exists()) {
            return 0;
        }
        return file.length();
    }

    public static String read(String filePath) {
        String json = null;
        File file = new File(filePath);
        try {
            json = FileUtils.readFileToString(file, "UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return json;
    }

    public static void write(String filePath, String json) {
        FileWriter fileWriter;
        try {
            fileWriter = new FileWriter(filePath);
            PrintWriter out = new PrintWriter(fileWriter);
            out.write(json);
            out.println();
            fileWriter.close();
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String fileToStr(MultipartFile file) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        byte buff[] = new byte[1024];
        int len;
        String content = "";
        try {
            InputStream in = file.getInputStream();
            while ((len = in.read(buff)) != -1) {
                outputStream.write(buff, 0, len);
            }
            content = new String(outputStream.toByteArray(), "UTF-8");
        } catch (Exception e) {
        }
        return content;
    }
}
