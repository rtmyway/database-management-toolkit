package com.gantang.dbmt.service.impl;

import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.gantang.dbmt.base.BaseAction;
import com.gantang.dbmt.config.FlashbackConfig;
import com.gantang.dbmt.dao.entity.BackupExecuteLogEntity;
import com.gantang.dbmt.dao.entity.ConnectionConfigEntity;
import com.gantang.dbmt.dao.entity.RestoreExecuteLogEntity;
import com.gantang.dbmt.dao.repository.BackupExecuteLogRepository;
import com.gantang.dbmt.dao.repository.ConnectionConfigRepository;
import com.gantang.dbmt.dao.repository.RestoreExecuteLogRepository;
import com.gantang.dbmt.dto.PageDto;
import com.gantang.dbmt.enumeration.DatabaseItem;
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
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.Optional;

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


    @Override
    @Async
    public Boolean add(RestoreExecuteLogEntity restoreExecuteLogEntity) throws DbmtException {
        // backupId不能为空
        // targetConnectionId为空的话，源库=目标库

        // 获得需要备份的日志信息
        Optional<BackupExecuteLogEntity> backupExecuteLogObj = backupExecuteLogRepository.findById(restoreExecuteLogEntity.getBackupLogId());
        if (!backupExecuteLogObj.isPresent()) {
            log.error("数据库备份信息不存在, id:{}", restoreExecuteLogEntity.getBackupLogId());
            throw new DbmtException("数据库备份信息不存在");
        }
        BackupExecuteLogEntity backupExecuteLog = backupExecuteLogObj.get();

        // 获得源数据库连接信息
        ConnectionConfigEntity sourceConnectionConfig = JsonTool.toObject(backupExecuteLog.getSourceConnectionSnapshot(), ConnectionConfigEntity.class);

        // 获得目标数据库连接信息
        ConnectionConfigEntity targetConnectionConfig = null;
        if (StrUtil.isBlank(restoreExecuteLogEntity.getTargetConnectionId())) {
            targetConnectionConfig = JsonTool.toObject(backupExecuteLog.getSourceConnectionSnapshot(), ConnectionConfigEntity.class);
        } else {
            Optional<ConnectionConfigEntity> targetConnectionConfigObj =
                    connectionConfigRepository.findById(restoreExecuteLogEntity.getTargetConnectionId());
            if (!targetConnectionConfigObj.isPresent()) {
                log.error("目标数据库连接信息不存在, id:{}", restoreExecuteLogEntity.getTargetConnectionId());
                return false;
            }
            targetConnectionConfig = targetConnectionConfigObj.get();
        }

        // 补充备份日志信息
        restoreExecuteLogEntity.setId(IdUtil.fastSimpleUUID());
        restoreExecuteLogEntity.setStartTime(System.currentTimeMillis());
        // 设置源库连接信息
        restoreExecuteLogEntity.setSourceConnectionId(backupExecuteLog.getSourceConnectionId());
        restoreExecuteLogEntity.setSourceConnectionSnapshot(backupExecuteLog.getSourceConnectionSnapshot());
        // 设置目标库连接信息
        restoreExecuteLogEntity.setTargetConnectionId(targetConnectionConfig.getId());
        restoreExecuteLogEntity.setTargetConnectionSnapshot(JsonTool.toJson(targetConnectionConfig));

        // 锁住任务
        taskProcessInfo.doStart(TaskItem.RESTORE, restoreExecuteLogEntity.getId(), "");

        // 创建记录
        restoreExecuteLogRepository.save(restoreExecuteLogEntity);

        // 调用shell
        String backupDir = flashbackConfig.getDataDir().concat(backupExecuteLog.getBackupDir());
        String backupFilePath = backupDir.concat("/").concat(backupExecuteLog.getBackupFileName());
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

        String executeUser = "";
        DatabaseItem databaseItem = DatabaseItem.getByCode(sourceConnectionConfig.getDatabaseItem());
        if (databaseItem != null) {
            executeUser = databaseItem.getExecuteUser();
        }

        int status = ShellTool.execute(executeUser, flashbackConfig.getRestoreShellPath(), restoreShellArgs);
        // 恢复文件成功标识
        String successFilePath = backupDir.concat("/1.").concat(restoreExecuteLogEntity.getId());
        restoreExecuteLogEntity.setEndTime(System.currentTimeMillis());
        restoreExecuteLogEntity.setIsSuccess(FileTool.isExist(successFilePath));


        // 日志输出
        log.info("restore sourceConnectionConfig={}, targetConnectionConfig={} restoreExecuteLog={}",
                sourceConnectionConfig, targetConnectionConfig, restoreExecuteLogEntity);

        // 更新记录
        restoreExecuteLogRepository.save(restoreExecuteLogEntity);

        // 解锁任务
        taskProcessInfo.doEnd();
        return true;
    }

    @Override
    public Boolean remove(RestoreExecuteLogEntity restoreExecuteLogEntity) throws DbmtException {
        // 获得恢复信息
        Optional<RestoreExecuteLogEntity> restoreObj = restoreExecuteLogRepository.findById(restoreExecuteLogEntity.getId());
        if (!restoreObj.isPresent()) {
            log.error("恢复信息不存在, id:{}", restoreExecuteLogEntity.getId());
            return false;
        }
        RestoreExecuteLogEntity restoreEntity = restoreObj.get();

        // 获得备份信息
        Optional<BackupExecuteLogEntity> backupObj = backupExecuteLogRepository.findById(restoreExecuteLogEntity.getBackupLogId());
        if (!backupObj.isPresent()) {
            log.error("备份信息不存在, id:{}", restoreExecuteLogEntity.getBackupLogId());
            return false;
        }
        BackupExecuteLogEntity backupEntity = backupObj.get();


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
            sourceConnectionId = String.valueOf(pageDto.getParams().get("sourceConnectionId"));
            targetConnectionId = String.valueOf(pageDto.getParams().get("targetConnectionId"));
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
}
