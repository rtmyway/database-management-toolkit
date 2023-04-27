/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.enumeration;

public enum EnvItem {
    /**
     * 生产环境模式
     */
    PROD("PROD", "生产环境"),
    /**
     * 测试环境模式
     */
    TEST("POSTGRES", "测试环境"),
    /**
     * 开发环境模式
     */
    DEV("DEV", "开发环境"),
    /**
     * 未知
     */
    UNKNOWN("UNKNOWN", "");


    private String code;
    private String text;

    EnvItem(String code, String text) {
        this.code = code;
        this.text = text;
    }

    public static EnvItem getByCode(String code) {
        EnvItem result = EnvItem.UNKNOWN;
        for (EnvItem item : EnvItem.values()) {
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

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
