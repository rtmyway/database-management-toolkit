package com.gantang.dbmt.service.impl;

import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.gantang.dbmt.config.FlashbackConfig;
import com.gantang.dbmt.dao.entity.BackupExecuteLogEntity;
import com.gantang.dbmt.dao.entity.ConnectionConfigEntity;
import com.gantang.dbmt.dao.entity.RestoreExecuteLogEntity;
import com.gantang.dbmt.dao.repository.BackupExecuteLogRepository;
import com.gantang.dbmt.dao.repository.ConnectionConfigRepository;
import com.gantang.dbmt.dao.repository.RestoreExecuteLogRepository;
import com.gantang.dbmt.dto.PageDto;
import com.gantang.dbmt.enumeration.DatabaseItem;
import com.gantang.dbmt.enumeration.OpModeItem;
import com.gantang.dbmt.execption.DbmtException;
import com.gantang.dbmt.service.QueryCommonService;
import com.gantang.dbmt.service.RestoreService;
import com.gantang.dbmt.task.TaskItem;
import com.gantang.dbmt.task.TaskProcessInfo;
import com.gantang.dbmt.util.FileTool;
import com.gantang.dbmt.util.JsonTool;
import com.gantang.dbmt.util.ShellTool;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Callable;
import java.util.concurrent.Future;
import java.util.function.Function;

@Service
@Slf4j
public class RestoreServiceImpl implements RestoreService {
    @Autowired
    private FlashbackConfig flashbackConfig;
    @Autowired
    private ConnectionConfigRepository connectionConfigRepository;
    @Autowired
    private BackupExecuteLogRepository backupExecuteLogRepository;
    @Autowired
    private RestoreExecuteLogRepository restoreExecuteLogRepository;
    @Autowired
    private QueryCommonService queryCommonService;
    @Autowired
    private TaskProcessInfo taskProcessInfo;
    @Autowired
    @Qualifier("businessThreadPoolTaskExecutor")
    private ThreadPoolTaskExecutor businessThreadPoolTaskExecutor;

    private Future futureTask;

    @Override
    public Boolean add(RestoreExecuteLogEntity restoreExecuteLogEntity) throws DbmtException {
        if (futureTask != null) {
            if (!(futureTask.isCancelled() || futureTask.isDone())) {
                throw new DbmtException("当前有恢复任务正在执行, 请稍后再试");
            }
        }

        // 1.获得备份信息
        BackupExecuteLogEntity backupExecuteLogEntity = getBackupExecuteLog(restoreExecuteLogEntity.getBackupLogId());
        if (backupExecuteLogEntity == null) {
            log.error("数据库备份信息不存在, id:{}", restoreExecuteLogEntity.getBackupLogId());
            throw new DbmtException("数据库备份信息不存在");
        }

        // 2.获得源库连接信息
        ConnectionConfigEntity sourceConnectionConfig = JsonTool.toObject(backupExecuteLogEntity.getSourceConnectionSnapshot(), ConnectionConfigEntity.class);

        // 3.获得目标库连接信息
        ConnectionConfigEntity targetConnectionConfig = null;
        if (StrUtil.isBlank(restoreExecuteLogEntity.getTargetConnectionId())) {
            // targetConnectionId为空的话，恢复到源库
            targetConnectionConfig = JsonTool.toObject(backupExecuteLogEntity.getSourceConnectionSnapshot(), ConnectionConfigEntity.class);
        } else {
            // targetConnectionId为空的话，恢复到指定目标库
            targetConnectionConfig = getConnectionConfigEntity(restoreExecuteLogEntity.getTargetConnectionId());
        }
        if (targetConnectionConfig == null) {
            log.error("目标数据库连接信息不存在, id:{}", restoreExecuteLogEntity.getTargetConnectionId());
            throw new DbmtException("目标数据库连接信息不存在");
        }

        // 4.设置恢复任务信息
        restoreExecuteLogEntity.setId(IdUtil.fastSimpleUUID());
        if (StrUtil.isBlank(restoreExecuteLogEntity.getOpMode())) {
            restoreExecuteLogEntity.setOpMode(OpModeItem.MANUAL.getText());
        }
        restoreExecuteLogEntity.setStartTime(System.currentTimeMillis());
        restoreExecuteLogEntity.setCreatedAt(restoreExecuteLogEntity.getStartTime());
        // 设置源库连接信息
        restoreExecuteLogEntity.setSourceConnectionId(backupExecuteLogEntity.getSourceConnectionId());
        restoreExecuteLogEntity.setSourceConnectionSnapshot(backupExecuteLogEntity.getSourceConnectionSnapshot());
        // 设置目标库连接信息
        restoreExecuteLogEntity.setTargetConnectionId(targetConnectionConfig.getId());
        restoreExecuteLogEntity.setTargetConnectionSnapshot(JsonTool.toJson(targetConnectionConfig));
        // 设置备份信息
        restoreExecuteLogEntity.setBackupFileName(backupExecuteLogEntity.getBackupFileName());


        ConnectionConfigEntity finalTargetConnectionConfig = targetConnectionConfig;
        futureTask = businessThreadPoolTaskExecutor.submit(new Callable<Object>() {
            @Override
            public Object call() throws Exception {
                return getRestoreFunc().apply(new Object[] {backupExecuteLogEntity, restoreExecuteLogEntity, sourceConnectionConfig, finalTargetConnectionConfig});
            }
        });
        return true;
    }

    @Override
    public Boolean remove(RestoreExecuteLogEntity restoreExecuteLogEntity) throws DbmtException {
        // 获得恢复信息
        RestoreExecuteLogEntity restoreEntity = getRestoreExecuteLog(restoreExecuteLogEntity.getId());
        if (restoreEntity == null) {
            log.error("恢复信息不存在, id:{}", restoreExecuteLogEntity.getId());
            throw new DbmtException("恢复信息不存在");
        }


        // 获得备份信息
        BackupExecuteLogEntity backupEntity = getBackupExecuteLog(restoreExecuteLogEntity.getBackupLogId());
        if (backupEntity == null) {
            log.error("备份信息不存在, id:{}", restoreExecuteLogEntity.getBackupLogId());
            throw new DbmtException("备份信息不存在");
        }

        try {
            this.delete(backupEntity, restoreEntity.getId());
        } catch (Exception e) {
            log.warn("删除恢复文件标识异常, backupEntity:{}", backupEntity, e);
        }

        // 删除恢复记录
        restoreExecuteLogRepository.deleteById(restoreEntity.getId());
        return true;
    }

    @Override
    public Boolean update(RestoreExecuteLogEntity restoreExecuteLogEntity) throws DbmtException {
        return null;
    }

    @Override
    public Boolean enable(RestoreExecuteLogEntity restoreExecuteLogEntity) throws DbmtException {
        return null;
    }

    @Override
    public Boolean disable(RestoreExecuteLogEntity restoreExecuteLogEntity) throws DbmtException {
        return null;
    }

    @Override
    public List<RestoreExecuteLogEntity> list() throws DbmtException {
        return restoreExecuteLogRepository.findAll();
    }

    @Override
    public PageDto listPage(PageDto pageDto) throws DbmtException {
        StringBuilder sb = new StringBuilder();
        sb.append("select * from restore_execute_log where 1=1");
        String sourceConnectionId = null;
        String targetConnectionId = null;
        try {
            Object sourceConnectIdObj = pageDto.getParams().get("sourceConnectionId");
            Object targetConnectIdObj = pageDto.getParams().get("targetConnectionId");
            if (sourceConnectIdObj != null) {
                sourceConnectionId = String.valueOf(sourceConnectIdObj);
            }
            if (targetConnectIdObj != null) {
                targetConnectionId = String.valueOf(targetConnectIdObj);
            }
        } catch (Exception e) {
        }

        if (StrUtil.isNotBlank(sourceConnectionId)) {
            sb.append(" and source_connection_id = '").append(sourceConnectionId).append("'");
        }
        if (StrUtil.isNotBlank(targetConnectionId)) {
            sb.append(" and target_connection_id = '").append(targetConnectionId).append("'");
        }
        sb.append(" order by created_at desc ");
        PageDto resultDto = null;
        try {
            resultDto = queryCommonService.loadListPage(sb.toString(), pageDto.getPageNum(), pageDto.getPageSize(), RestoreExecuteLogEntity.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return resultDto;
    }

    @Override
    public Boolean cancel(RestoreExecuteLogEntity restoreExecuteLogEntity) throws DbmtException {
        if (!restoreExecuteLogEntity.getId().equals(taskProcessInfo.getTaskId())) {
            throw new DbmtException("任务不存在");
        }

        if (!taskProcessInfo.isProcessing()) {
            throw new DbmtException("任务未执行或已完成");
        }

        taskProcessInfo.doEnd();
        if (futureTask != null) {
            futureTask.cancel(true);
        }

        // 更新恢复记录
        RestoreExecuteLogEntity entity = this.getRestoreExecuteLog(restoreExecuteLogEntity.getId());
        entity.setIsSuccess(false);
        entity.setEndTime(System.currentTimeMillis());
        entity.setUpdatedAt(entity.getEndTime());
        restoreExecuteLogRepository.save(entity);
        return true;
    }

    /**
     * 删除备份文件
     * @param logEntity
     * @param restoreId
     * @return
     */
    private boolean delete(BackupExecuteLogEntity logEntity, String restoreId) {
        String dirPath = flashbackConfig.getDataDir().concat(logEntity.getBackupDir());
        String successFilePath = dirPath.concat("/").concat("1.").concat(restoreId);
        String failureFilePath = dirPath.concat("/").concat("9.").concat(restoreId);


        // 删除成功标志
        File successFile = new File(successFilePath);
        if (successFile != null && successFile.exists() && successFile.isFile()) {
            successFile.delete();
        }

        // 删除失败标志
        File failureFile = new File(failureFilePath);
        if (failureFile != null && failureFile.exists() && failureFile.isFile()) {
            failureFile.delete();
        }
        return true;
    }


    private Function getRestoreFunc() {
        Function<Object[], Boolean> triggerFunc = (p) -> {
            BackupExecuteLogEntity backupExecuteLogEntity = (BackupExecuteLogEntity) p[0];
            RestoreExecuteLogEntity restoreExecuteLogEntity = (RestoreExecuteLogEntity) p[1];
            ConnectionConfigEntity sourceConnectionConfig = (ConnectionConfigEntity) p[2];
            ConnectionConfigEntity targetConnectionConfig = (ConnectionConfigEntity) p[3];

            // 锁住任务
            taskProcessInfo.doStart(TaskItem.RESTORE, restoreExecuteLogEntity.getId(), "");
            try {
                // 新增一条恢复记录
                restoreExecuteLogRepository.save(restoreExecuteLogEntity);

                // 调用shell
                String backupDir = flashbackConfig.getDataDir().concat(backupExecuteLogEntity.getBackupDir());
                String backupFilePath = backupDir.concat("/").concat(backupExecuteLogEntity.getBackupFileName());
                String[] restoreShellArgs = new String[]{
                        "-d".concat(sourceConnectionConfig.getDatabaseName()),
                        "-h".concat(targetConnectionConfig.getHost()),
                        "-p".concat(targetConnectionConfig.getPort()),
                        "-u".concat(targetConnectionConfig.getUserName()),
                        "-P".concat(targetConnectionConfig.getPassword()),
                        "-f".concat(backupFilePath),
                        "-a".concat(targetConnectionConfig.getDatabaseName()),
                        "-i".concat(restoreExecuteLogEntity.getId())  // 指定标识恢复的id
                };

                // 根据不同数据库获得不同的shell执行用户
                String executeUser = "";
                DatabaseItem databaseItem = DatabaseItem.getByCode(sourceConnectionConfig.getDatabaseItem());
                if (databaseItem != null) {
                    executeUser = databaseItem.getExecuteUser();
                }

                // 执行备份脚本
                ShellTool.execute(executeUser, flashbackConfig.getRestoreShellPath(), restoreShellArgs);

                // 恢复文件成功标识
                String successFilePath = backupDir.concat("/1.").concat(restoreExecuteLogEntity.getId());

                // 更新记录
                restoreExecuteLogEntity.setEndTime(System.currentTimeMillis());
                restoreExecuteLogEntity.setUpdatedAt(restoreExecuteLogEntity.getEndTime());
                restoreExecuteLogEntity.setIsSuccess(FileTool.isExist(successFilePath));
                restoreExecuteLogRepository.save(restoreExecuteLogEntity);

                // 日志输出
                log.info("restore sourceConnectionConfig={}, targetConnectionConfig={} restoreExecuteLog={}",
                        sourceConnectionConfig, targetConnectionConfig, restoreExecuteLogEntity);
            } catch (Exception e) {

            } finally {
                // 解锁任务
                taskProcessInfo.doEnd();
            }
            return true;
        };
        return triggerFunc;
    }


    /**
     * 根据连接id获得连接信息
     * @param connectionId
     * @return
     */
    private ConnectionConfigEntity getConnectionConfigEntity(String connectionId) {
        Optional<ConnectionConfigEntity> connectionConfigEntityObj = connectionConfigRepository.findById(connectionId);
        return connectionConfigEntityObj.isPresent() ? connectionConfigEntityObj.get() : null;
    }


    /**
     * 根据备份id获得备份信息
     * @param backupLogId
     * @return
     */
    private BackupExecuteLogEntity getBackupExecuteLog(String backupLogId) {
        Optional<BackupExecuteLogEntity> backupExecuteLogObj = backupExecuteLogRepository.findById(backupLogId);
        return backupExecuteLogObj.isPresent() ? backupExecuteLogObj.get() : null;
    }

    /**
     * 根据备份id获得恢复信息
     * @param restoreLogId
     * @return
     */
    private RestoreExecuteLogEntity getRestoreExecuteLog(String restoreLogId) {
        Optional<RestoreExecuteLogEntity> restoreExecuteLogObj = restoreExecuteLogRepository.findById(restoreLogId);
        return restoreExecuteLogObj.isPresent() ? restoreExecuteLogObj.get() : null;
    }


}
