/*
 * Copyright (c) 2015—2030 GantSoftware.Co.Ltd. All rights reserved.
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * is not allowed to be distributed or copied without the license from
 * GantSoftware.Co.Ltd. Please contact the company for more information.
 */

package com.gantang.dbmt.dao.repository;

import com.gantang.dbmt.dao.entity.FlashbackPolicyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface FlashbackPolicyRepository extends JpaRepository<FlashbackPolicyEntity, String> {
}
