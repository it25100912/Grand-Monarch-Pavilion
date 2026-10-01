package com.restaurant.app.customerstaff.service;

import com.restaurant.app.common.exception.BadRequestException;
import com.restaurant.app.common.exception.ResourceNotFoundException;
import com.restaurant.app.customerstaff.dto.StaffTaskRequest;
import com.restaurant.app.customerstaff.dto.StaffTaskResponse;
import com.restaurant.app.customerstaff.entity.StaffTask;
import com.restaurant.app.customerstaff.entity.User;
import com.restaurant.app.customerstaff.repository.StaffTaskRepository;
import com.restaurant.app.customerstaff.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StaffTaskServiceImpl implements StaffTaskService {

    private final StaffTaskRepository taskRepository;
    private final UserRepository userRepository;

    public StaffTaskServiceImpl(StaffTaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void seedTasksIfEmpty() {
        // Sample staff tasks seeding disabled for clean production deployment
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffTaskResponse> getAllTasks(Integer staffId, String status, String priority) {
        List<StaffTask> list = taskRepository.findAllByOrderByCreatedAtDesc();

        return list.stream()
                .filter(t -> staffId == null || (t.getAssignedStaffId() != null && t.getAssignedStaffId().equals(staffId)))
                .filter(t -> status == null || status.equalsIgnoreCase("ALL") || t.getStatus().equalsIgnoreCase(status))
                .filter(t -> priority == null || priority.equalsIgnoreCase("ALL") || t.getPriority().equalsIgnoreCase(priority))
                .map(StaffTaskResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StaffTaskResponse getTaskById(int id) {
        StaffTask task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff Task not found with id: " + id));
        return new StaffTaskResponse(task);
    }

    @Override
    public StaffTaskResponse createTask(StaffTaskRequest request) {
        StaffTask task = new StaffTask();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setAssignedStaffId(request.getAssignedStaffId());

        if (request.getAssignedStaffId() != null) {
            userRepository.findById(request.getAssignedStaffId()).ifPresent(u ->
                task.setAssignedStaffName(u.getFullName() + " (" + u.getRole() + ")")
            );
        }
        if (task.getAssignedStaffName() == null || task.getAssignedStaffName().isBlank()) {
            task.setAssignedStaffName(request.getAssignedStaffName() != null ? request.getAssignedStaffName() : "General Duty Staff");
        }

        task.setBookingRef(request.getBookingRef() != null ? request.getBookingRef() : "GENERAL");
        task.setBranchName(request.getBranchName() != null ? request.getBranchName() : "Grand Monarch Pavilion (Main)");
        if (request.getDueDateTime() != null && !request.getDueDateTime().isBlank()) {
            try {
                String dtStr = request.getDueDateTime().replace("T", " ");
                if (dtStr.length() == 10) dtStr += " 23:59:59";
                else if (dtStr.length() == 16) dtStr += ":00";
                java.time.LocalDateTime due = java.time.LocalDateTime.parse(dtStr.replace(" ", "T"));
                if (due.isBefore(java.time.LocalDateTime.now())) {
                    throw new BadRequestException("Task deadline cannot be in the past. Please select a future date.");
                }
            } catch (BadRequestException e) {
                throw e;
            } catch (Exception ignored) {}
        }
        task.setDueDateTime(request.getDueDateTime());
        task.setPriority(request.getPriority() != null ? request.getPriority().toUpperCase() : "MEDIUM");
        task.setStatus(request.getStatus() != null ? request.getStatus().toUpperCase() : "PENDING");

        StaffTask saved = taskRepository.save(task);
        return new StaffTaskResponse(saved);
    }

    @Override
    public StaffTaskResponse updateTask(int id, StaffTaskRequest request) {
        StaffTask task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff Task not found with id: " + id));

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getAssignedStaffId() != null) {
            task.setAssignedStaffId(request.getAssignedStaffId());
            userRepository.findById(request.getAssignedStaffId()).ifPresent(u ->
                task.setAssignedStaffName(u.getFullName() + " (" + u.getRole() + ")")
            );
        }
        if (request.getBookingRef() != null) task.setBookingRef(request.getBookingRef());
        if (request.getBranchName() != null) task.setBranchName(request.getBranchName());
        if (request.getDueDateTime() != null && !request.getDueDateTime().isBlank()) {
            try {
                String dtStr = request.getDueDateTime().replace("T", " ");
                if (dtStr.length() == 10) dtStr += " 23:59:59";
                else if (dtStr.length() == 16) dtStr += ":00";
                java.time.LocalDateTime due = java.time.LocalDateTime.parse(dtStr.replace(" ", "T"));
                if (due.isBefore(java.time.LocalDateTime.now())) {
                    throw new BadRequestException("Task deadline cannot be in the past. Please select a future date.");
                }
            } catch (BadRequestException e) {
                throw e;
            } catch (Exception ignored) {}
            task.setDueDateTime(request.getDueDateTime());
        }
        if (request.getPriority() != null) task.setPriority(request.getPriority().toUpperCase());
        if (request.getStatus() != null) task.setStatus(request.getStatus().toUpperCase());

        StaffTask updated = taskRepository.save(task);
        return new StaffTaskResponse(updated);
    }

    @Override
    public StaffTaskResponse updateTaskStatus(int id, String status) {
        StaffTask task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff Task not found with id: " + id));

        task.setStatus(status.toUpperCase());
        StaffTask updated = taskRepository.save(task);
        return new StaffTaskResponse(updated);
    }

    @Override
    public void deleteTask(int id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Staff Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }
}
