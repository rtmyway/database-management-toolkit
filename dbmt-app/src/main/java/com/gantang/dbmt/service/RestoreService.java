package com.gantang.dbmt.service;

import com.gantang.dbmt.base.BaseAction;
import com.gantang.dbmt.dao.entity.RestoreExecuteLogEntity;
import com.gantang.dbmt.execption.DbmtException;

public interface RestoreService extends BaseAction<RestoreExecuteLogEntity> {
    Boolean cancel(RestoreExecuteLogEntity restoreExecuteLogEntity) throws DbmtException;
}
