/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

/**
 * @ClassName JsonTool
 * @Description
 * @Author taozhen
 * @Date 2022/6/30
 */
@Slf4j
public class JsonTool {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    static {
        OBJECT_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                OBJECT_MAPPER.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
    }

    /**
     * json转List
     * @param jsonStr
     * @param classType
     * @return
     */
    public static List toList(String jsonStr, Class classType) {
        List list = new ArrayList<>();
        JavaType javaType = OBJECT_MAPPER.getTypeFactory().constructParametricType(ArrayList.class, classType);
        try {
            list = OBJECT_MAPPER.readValue(jsonStr, javaType);
        } catch (JsonProcessingException e) {
            System.out.println(e.getMessage());
        }
        return list;
    }

    /**
     * json转对象
     * @param jsonStr
     * @param classType
     * @return
     */
    public static <T> T toObject(String jsonStr, Class<T> classType) {
        T object = null;
        try {
            object = OBJECT_MAPPER.readValue(jsonStr, classType);
        } catch (JsonProcessingException e) {
            log.error(e.getMessage());
        }
        return object;
    }

    /**
     * 对象转json
     * @param object
     * @return
     */
    public static String toJson(Object object) {
        String jsonStr;
        try {
            jsonStr = OBJECT_MAPPER.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            jsonStr = "";
        }
        return jsonStr;
    }
    public static void main(String[] args) {

    }
}
