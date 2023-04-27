/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.enumeration;

public enum FrequencyItem {
    /**
     * 每小时
     */
    HOUR("HOUR", "每小时"),
    /**
     * 每天
     */
    DAY("DAY", "每天"),
    /**
     * 每周
     */
    WEEK("WEEK", "每周"),
    /**
     * 每月
     */
    MONTH("MONTH", "每月"),
    /**
     * 未知
     */
    UNKNOWN("UNKNOWN", "");


    private String code;
    private String text;

    FrequencyItem(String code, String text) {
        this.code = code;
        this.text = text;
    }

    public static FrequencyItem getByCode(String code) {
        FrequencyItem result = FrequencyItem.UNKNOWN;
        for (FrequencyItem item : FrequencyItem.values()) {
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
