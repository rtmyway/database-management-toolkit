/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.enumeration;

public enum OpModeItem {
    /**
     * 自动
     */
    AUTO("AUTO", "自动"),
    /**
     * 手动
     */
    MANUAL("MANUAL", "手动"),
    /**
     * 未知
     */
    UNKNOWN("UNKNOWN", "");


    private String code;
    private String text;

    OpModeItem(String code, String text) {
        this.code = code;
        this.text = text;
    }

    public static OpModeItem getByCode(String code) {
        OpModeItem result = OpModeItem.UNKNOWN;
        for (OpModeItem item : OpModeItem.values()) {
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
