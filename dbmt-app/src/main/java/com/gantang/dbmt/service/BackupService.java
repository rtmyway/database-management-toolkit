package com.gantang.dbmt.service;

import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.gantang.dbmt.base.BaseAction;
import com.gantang.dbmt.config.FlashbackConfig;
import com.gantang.dbmt.dao.entity.BackupExecuteLogEntity;
import com.gantang.dbmt.dao.entity.ConnectionConfigEntity;
import com.gantang.dbmt.dao.repository.BackupExecuteLogRepository;
import com.gantang.dbmt.dao.repository.ConnectionConfigRepository;
import com.gantang.dbmt.dto.PageDto;
import com.gantang.dbmt.enumeration.DatabaseItem;
import com.gantang.dbmt.util.FileTool;
import com.gantang.dbmt.util.ShellTool;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class BackupService implements BaseAction<BackupExecuteLogEntity> {
    @Autowired
    private FlashbackConfig flashbackConfig;
    @Autowired
    private ConnectionConfigRepository connectionConfigRepository;
    @Autowired
    private BackupExecuteLogRepository backupExecuteLogRepository;
    @Autowired
    private QueryCommonService queryCommonService;

    @Override
    public Boolean add(BackupExecuteLogEntity backupExecuteLogEntity) {
        // 获得需要备份的数据库连接信息
        Optional<ConnectionConfigEntity> connectionConfigObj = connectionConfigRepository.findById(backupExecuteLogEntity.getSourceConnectionId());
        if (!connectionConfigObj.isPresent()) {
            log.error("数据库连接信息不存在, id:{}", backupExecuteLogEntity.getSourceConnectionId());
            return false;
        }

        ConnectionConfigEntity sourceConnectionConfig = connectionConfigObj.get();
        backupExecuteLogEntity.setId(IdUtil.fastSimpleUUID());
        backupExecuteLogEntity.setStartTime(System.currentTimeMillis());

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

        // 备份文件成功标识
        String successFileFullPath = flashbackConfig.getDataDir()
                .concat("/").concat(sourceConnectionConfig.getHost())
                .concat("/").concat(sourceConnectionConfig.getDatabaseName())
                .concat("/1.").concat(backupExecuteLogEntity.getId());
        // 备份文件短路径
        String backupFilePath = "/".concat(sourceConnectionConfig.getHost())
                .concat("/").concat(sourceConnectionConfig.getDatabaseName())
                .concat("/").concat(backupExecuteLogEntity.getId()).concat(".tar");
        String backupFileFullPath = flashbackConfig.getDataDir().concat(backupFilePath);

        backupExecuteLogEntity.setEndTime(System.currentTimeMillis());
        backupExecuteLogEntity.setIsSuccess(FileTool.isExist(successFileFullPath));

        if (backupExecuteLogEntity.getIsSuccess()) {
            backupExecuteLogEntity.setIsSuccess(true);
            if (FileTool.isExist(backupFileFullPath)) {
                backupExecuteLogEntity.setBackupFileSize(FileTool.getFileSize(backupFileFullPath));
                backupExecuteLogEntity.setBackupFilePath(backupFilePath); // 仅记录短路径
            }
        }

        // 日志输出
        log.info("backup ConnectionConfig={}, backupExecuteLog={}", sourceConnectionConfig, backupExecuteLogEntity);
        backupExecuteLogRepository.save(backupExecuteLogEntity);
        return true;
    }

    @Override
    public Boolean remove(BackupExecuteLogEntity backupExecuteLogEntity) {
        return null;
    }

    @Override
    public Boolean update(BackupExecuteLogEntity backupExecuteLogEntity) {
        return null;
    }

    @Override
    public Boolean enable(BackupExecuteLogEntity backupExecuteLogEntity) {
        return null;
    }

    @Override
    public Boolean disable(BackupExecuteLogEntity backupExecuteLogEntity) {
        return null;
    }

    @Override
    public List<BackupExecuteLogEntity> list() {
        return backupExecuteLogRepository.findAll();
    }

    public PageDto listPage(PageDto pageDto) {
        StringBuilder sb = new StringBuilder();
        sb.append("select * from backup_execute_log where 1=1");
        String sourceConnectionId = null;

        try {
            sourceConnectionId = String.valueOf(pageDto.getParams().get("sourceConnectionId"));
        } catch (Exception e) {
            log.error("参数转换异常", e);
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
}
