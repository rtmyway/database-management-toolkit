/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.enumeration;

public enum StatusItem {
    /**
     * 生产环境模式
     */
    ENABLE("ENABLE", 1),
    /**
     * 测试环境模式
     */
    DISABLE("DISABLE", 0),
    /**
     * 未知
     */
    UNKNOWN("UNKNOWN", Integer.MAX_VALUE);


    private String code;
    private Integer value;

    StatusItem(String code, Integer value) {
        this.code = code;
        this.value = value;
    }

    public static StatusItem getByCode(String code) {
        StatusItem result = StatusItem.UNKNOWN;
        for (StatusItem item : StatusItem.values()) {
            if (item.getCode().equalsIgnoreCase(code)) {
                result = item;
                break;
            }
        }
        return result;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }
}
