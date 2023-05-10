package com.gantang.dbmt.task;

import lombok.Data;
import org.springframework.stereotype.Component;

@Data
@Component
public class TaskProcessInfo {
    private TaskItem taskItem;
    private String taskId;
    private boolean processing = false;
    private long startTime = 0L;
    private long endTime = 0L;
    private String processMemo = "";

    public synchronized void doStart(TaskItem taskItem, String taskId, String processMemo) {
        this.taskItem = taskItem;
        this.taskId = taskId;
        this.processing = true;
        this.startTime = System.currentTimeMillis();
        this.endTime = 0L;
        this.processMemo = processMemo;
    }

    public synchronized void doEnd() {
        this.processing = false;
        this.endTime = System.currentTimeMillis();
    }
}
