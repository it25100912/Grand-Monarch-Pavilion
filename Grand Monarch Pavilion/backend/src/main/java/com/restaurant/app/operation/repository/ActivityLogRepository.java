package com.restaurant.app.operation.repository;

import com.restaurant.app.operation.entity.ActivityLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLogEntity, Integer> {

    List<ActivityLogEntity> findTop20ByOrderByTimestampDesc();
}
