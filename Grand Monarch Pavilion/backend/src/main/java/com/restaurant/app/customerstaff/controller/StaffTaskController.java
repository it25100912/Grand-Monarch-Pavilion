package com.restaurant.app.customerstaff.controller;

import com.restaurant.app.common.response.ApiResponse;
import com.restaurant.app.customerstaff.dto.StaffTaskRequest;
import com.restaurant.app.customerstaff.dto.StaffTaskResponse;
import com.restaurant.app.customerstaff.service.StaffTaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class StaffTaskController {

    private final StaffTaskService taskService;

    public StaffTaskController(StaffTaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<StaffTaskResponse>> getAllTasks(
            @RequestParam(required = false) Integer staffId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority) {
        return ResponseEntity.ok(taskService.getAllTasks(staffId, status, priority));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffTaskResponse> getTaskById(@PathVariable int id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StaffTaskResponse>> createTask(@Valid @RequestBody StaffTaskRequest request) {
        StaffTaskResponse created = taskService.createTask(request);
        return ResponseEntity.ok(ApiResponse.ok("Staff task created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StaffTaskResponse>> updateTask(
            @PathVariable int id, @Valid @RequestBody StaffTaskRequest request) {
        StaffTaskResponse updated = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Staff task updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<StaffTaskResponse>> updateStatus(
            @PathVariable int id, @RequestBody Map<String, Object> body) {
        String status = body.get("status") != null ? body.get("status").toString() : "COMPLETED";
        StaffTaskResponse updated = taskService.updateTaskStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Task status updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable int id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.ok("Staff task removed successfully", null));
    }
}
