package com.restaurant.app.customerstaff.repository;

import com.restaurant.app.customerstaff.entity.StaffTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffTaskRepository extends JpaRepository<StaffTask, Integer> {
    List<StaffTask> findByAssignedStaffId(Integer staffId);
    List<StaffTask> findByStatus(String status);
    List<StaffTask> findByPriority(String priority);
    List<StaffTask> findAllByOrderByCreatedAtDesc();
}
