
/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.vo;
import lombok.Data;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletResponse;

@Data
public class R<T> {
    public static final String PROCESS_RESULT_SUCCESS = "success";
    public static final String PROCESS_RESULT_ERROR = "error";
    public static final String HTTP_HEADER_PROCESS_RESULT = "X-G-PROCESS-RESULT";
    public static final String HTTP_HEADER_SERVICE_ID = "X-G-SERVICE-ID";

    private String state;
    private String message;
    private T data;

    public static <T> R<T> success(T dto) {
        R<T> response = new R<>();
        response.setMessage("");
        response.setState(PROCESS_RESULT_SUCCESS);
        setResponseHeader(PROCESS_RESULT_SUCCESS);
        response.setData(dto);
        return response;
    }

    public static R error(String errorInfo) {
        R<Void> response = new R<>();
        response.setMessage(errorInfo);
        response.setState(PROCESS_RESULT_ERROR);
        setResponseHeader(PROCESS_RESULT_ERROR);
        return response;
    }

    private static void setResponseHeader(String processResult) {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletResponse response = servletRequestAttributes.getResponse();
        response.setHeader(HTTP_HEADER_PROCESS_RESULT, processResult);
        response.setHeader(HTTP_HEADER_SERVICE_ID, "ddm-app");
    }
}
