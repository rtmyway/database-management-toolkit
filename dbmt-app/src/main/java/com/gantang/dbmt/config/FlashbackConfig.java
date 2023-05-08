package com.gantang.dbmt.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "flashback")
@Data
public class FlashbackConfig {
    @Value("${flashback.data-dir}")
    private String dataDir;
    @Value("${flashback.backup-shell-path}")
    private String backupShellPath;
    @Value("${flashback.restore-shell-path}")
    private String restoreShellPath;
}
