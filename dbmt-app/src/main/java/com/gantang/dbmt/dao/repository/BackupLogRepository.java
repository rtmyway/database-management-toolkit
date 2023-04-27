/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.dao.repository;

import com.gantang.dbmt.dao.entity.BackupExecuteLogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface BackupLogRepository extends JpaRepository<BackupExecuteLogEntity, String> {
//    @Query("select * from backup_execute_log t where t.flashback_policy_id = :flashbackPolicyId")
//    Page<BackupExecuteLogEntity> selectListPage(@Param("flashbackPolicyId") String flashbackPolicyId, Pageable pageable);
}
