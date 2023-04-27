/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.enumeration;

public enum DatabaseItem {
    /**
     * ORACLE数据库
     */
    ORACLE("ORACLE", ""),
    /**
     * POSTGRES数据库
     */
    POSTGRES("POSTGRES", ""),
    /**
     * MYSQL数据库
     */
    MYSQL("MYSQL", ""),
    /**
     * 未知数据库
     */
    UNKNOWN("UNKNOWN", "");


    private String code;
    private String text;

    DatabaseItem(String code, String text) {
        this.code = code;
        this.text = text;
    }

    public static DatabaseItem getByCode(String code) {
        DatabaseItem result = DatabaseItem.UNKNOWN;
        for (DatabaseItem item : DatabaseItem.values()) {
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
