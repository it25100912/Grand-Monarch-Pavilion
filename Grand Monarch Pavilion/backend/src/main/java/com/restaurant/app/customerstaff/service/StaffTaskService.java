package com.restaurant.app.customerstaff.service;

import com.restaurant.app.customerstaff.dto.StaffTaskRequest;
import com.restaurant.app.customerstaff.dto.StaffTaskResponse;

import java.util.List;

public interface StaffTaskService {
    List<StaffTaskResponse> getAllTasks(Integer staffId, String status, String priority);
    StaffTaskResponse getTaskById(int id);
    StaffTaskResponse createTask(StaffTaskRequest request);
    StaffTaskResponse updateTask(int id, StaffTaskRequest request);
    StaffTaskResponse updateTaskStatus(int id, String status);
    void deleteTask(int id);
}
