package com.gantang.dbmt.service.impl;

import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.gantang.dbmt.config.FlashbackConfig;
import com.gantang.dbmt.dao.entity.BackupExecuteLogEntity;
import com.gantang.dbmt.dao.entity.ConnectionConfigEntity;
import com.gantang.dbmt.dao.repository.BackupExecuteLogRepository;
import com.gantang.dbmt.dao.repository.ConnectionConfigRepository;
import com.gantang.dbmt.dto.PageDto;
import com.gantang.dbmt.enumeration.DatabaseItem;
import com.gantang.dbmt.execption.DbmtException;
import com.gantang.dbmt.service.BackupService;
import com.gantang.dbmt.service.QueryCommonService;
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
public class BackupServiceImpl implements BackupService {
    @Autowired
    private FlashbackConfig flashbackConfig;
    @Autowired
    private ConnectionConfigRepository connectionConfigRepository;
    @Autowired
    private BackupExecuteLogRepository backupExecuteLogRepository;
    @Autowired
    private QueryCommonService queryCommonService;
    @Autowired
    private TaskProcessInfo taskProcessInfo;

    @Override
    @Async
    public Boolean add(BackupExecuteLogEntity backupExecuteLogEntity) throws DbmtException {


        // 获得需要备份的数据库连接信息
        Optional<ConnectionConfigEntity> connectionConfigObj = connectionConfigRepository.findById(backupExecuteLogEntity.getSourceConnectionId());
        if (!connectionConfigObj.isPresent()) {
            log.error("数据库连接信息不存在, id:{}", backupExecuteLogEntity.getSourceConnectionId());
            return false;
        }


        ConnectionConfigEntity sourceConnectionConfig = connectionConfigObj.get();
        backupExecuteLogEntity.setId(IdUtil.fastSimpleUUID());
        backupExecuteLogEntity.setStartTime(System.currentTimeMillis());

        // 源库配置快照
        backupExecuteLogEntity.setSourceConnectionSnapshot(JsonTool.toJson(sourceConnectionConfig));

        // 锁住任务
        taskProcessInfo.doStart(TaskItem.BACKUP, backupExecuteLogEntity.getId(), "");

        // 创建记录
        backupExecuteLogRepository.save(backupExecuteLogEntity);

        // 调用shell
        String[] backupShellArgs = new String[]{
                "-d".concat(sourceConnectionConfig.getDatabaseName()),
                "-h".concat(sourceConnectionConfig.getHost()),
                "-p".concat(sourceConnectionConfig.getPort()),
                "-D".concat(flashbackConfig.getDataDir()),
                "-P".concat(sourceConnectionConfig.getPassword()),
                "-i".concat(backupExecuteLogEntity.getId())  // 指定标识备份的id
        };

        String executeUser = "";
        DatabaseItem databaseItem = DatabaseItem.getByCode(sourceConnectionConfig.getDatabaseItem());
        if (databaseItem != null) {
            executeUser = databaseItem.getExecuteUser();
        }

        int status = ShellTool.execute(executeUser, flashbackConfig.getBackupShellPath(), backupShellArgs);

        // 备份目录(相对路径)
        String backupDirPath = "/".concat(sourceConnectionConfig.getHost()).concat("/").concat(sourceConnectionConfig.getDatabaseName());
        // 备份文件名称
        String backupFileName = backupExecuteLogEntity.getId().concat(".tar");
        // 备份文件成功标识
        String successFileName = ("1.").concat(backupExecuteLogEntity.getId());

        String successFileFullPath = flashbackConfig.getDataDir().concat(backupDirPath).concat("/").concat(successFileName);
        String backupFileFullPath = flashbackConfig.getDataDir().concat(backupDirPath).concat("/").concat(backupFileName);

        backupExecuteLogEntity.setEndTime(System.currentTimeMillis());
        backupExecuteLogEntity.setIsSuccess(FileTool.isExist(successFileFullPath));

        if (backupExecuteLogEntity.getIsSuccess()) {
            backupExecuteLogEntity.setIsSuccess(true);
            if (FileTool.isExist(backupFileFullPath)) {
                backupExecuteLogEntity.setBackupFileSize(FileTool.getFileSize(backupFileFullPath));
                backupExecuteLogEntity.setBackupDir(backupDirPath);
                backupExecuteLogEntity.setBackupFileName(backupFileName);
            }
        }

        // 日志输出
        log.info("backup ConnectionConfig={}, backupExecuteLog={}", sourceConnectionConfig, backupExecuteLogEntity);

        // 更新记录
        backupExecuteLogRepository.save(backupExecuteLogEntity);

        // 解锁任务
        taskProcessInfo.doEnd();

        return true;
    }

    @Override
    public Boolean remove(BackupExecuteLogEntity backupExecuteLogEntity) throws DbmtException {
        // 获得备份信息
        Optional<BackupExecuteLogEntity> logObj = backupExecuteLogRepository.findById(backupExecuteLogEntity.getId());
        if (!logObj.isPresent()) {
            log.error("备份信息不存在, id:{}", backupExecuteLogEntity.getId());
            return false;
        }

        BackupExecuteLogEntity logEntity = logObj.get();
        try {
            // 删除备份文件
            this.delete(logEntity);
        } catch (Exception e) {
            log.warn("删除备份文件异常, logEntity:{}", logEntity, e);
        }

        // 删除备份记录
        backupExecuteLogRepository.deleteById(logEntity.getId());
        return true;
    }

    @Override
    public Boolean update(BackupExecuteLogEntity backupExecuteLogEntity) throws DbmtException {
        return null;
    }

    @Override
    public Boolean enable(BackupExecuteLogEntity backupExecuteLogEntity) throws DbmtException {
        return null;
    }

    @Override
    public Boolean disable(BackupExecuteLogEntity backupExecuteLogEntity) throws DbmtException {
        return null;
    }

    @Override
    public List<BackupExecuteLogEntity> list() throws DbmtException {
        return backupExecuteLogRepository.findAll();
    }

    @Override
    public PageDto listPage(PageDto pageDto) throws DbmtException {
        StringBuilder sb = new StringBuilder();
        sb.append("select * from backup_execute_log where 1=1");
        String sourceConnectionId = null;

        try {
            sourceConnectionId = String.valueOf(pageDto.getParams().get("sourceConnectionId"));
        } catch (Exception e) {
        }


        if (StrUtil.isNotBlank(sourceConnectionId)) {
            sb.append(" and source_connection_id = '").append(sourceConnectionId).append("'");
        }
        sb.append(" order by created_at desc ");
        PageDto resultDto = null;
        try {
            resultDto = queryCommonService.loadListPage(sb.toString(), pageDto.getPageNum(), pageDto.getPageSize(), BackupExecuteLogEntity.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return resultDto;
    }


    /**
     * 删除备份文件
     * @param logEntity
     * @return
     */
    private boolean delete(BackupExecuteLogEntity logEntity) {
        String dirPath = flashbackConfig.getDataDir().concat(logEntity.getBackupDir());
        String backupFilePath = dirPath.concat("/").concat(logEntity.getBackupFileName());
        String successFilePath = dirPath.concat("/").concat("1.").concat(logEntity.getId());
        String failureFilePath = dirPath.concat("/").concat("9.").concat(logEntity.getId());


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

        // 删除备份文件
        File backupFile = new File(backupFilePath);
        if (backupFile != null && backupFile.exists() && backupFile.isFile()) {
            backupFile.delete();
        }
        return true;
    }
}
