/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.dao.repository;

import com.gantang.dbmt.dao.entity.ConnectionConfigEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ConnectionConfigRepository extends JpaRepository<ConnectionConfigEntity, String> {
    List<ConnectionConfigEntity> findAllByHostAndPortAndDatabaseName(String host, String port, String databaseName);
}
