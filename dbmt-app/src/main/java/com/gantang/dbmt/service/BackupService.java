package com.gantang.dbmt.service;

import com.gantang.dbmt.base.BaseAction;
import com.gantang.dbmt.dao.entity.BackupExecuteLogEntity;
import com.gantang.dbmt.execption.DbmtException;

public interface BackupService extends BaseAction<BackupExecuteLogEntity> {
    Boolean cancel(BackupExecuteLogEntity backupExecuteLogEntity) throws DbmtException;
}
