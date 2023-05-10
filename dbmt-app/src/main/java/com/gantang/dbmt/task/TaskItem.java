package com.gantang.dbmt.task;

/**
 * @Classname TaskEnum
 * @Description
 * @Date 2021/8/16
 * @Created by taozhen
 */
public enum TaskItem {
    BACKUP("BACKUP", "备份任务进行中"),
    RESTORE("RESTORE", "还原任务进行中");
    private String code;
    private String text;

    TaskItem(String code, String text) {
        this.code = code;
        this.text = text;
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
