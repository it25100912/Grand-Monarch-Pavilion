package com.restaurant.app.customerstaff.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class StaffTaskRequest {

    @NotBlank(message = "Task title is required")
    @Size(min = 3, max = 150, message = "Task title must be between 3 and 150 characters")
    private String title;

    private String description;

    private Integer assignedStaffId;

    private String assignedStaffName;

    private String bookingRef;

    private String branchName;

    private String dueDateTime;

    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH

    private String status = "PENDING"; // PENDING, IN_PROGRESS, COMPLETED

    public StaffTaskRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getAssignedStaffId() { return assignedStaffId; }
    public void setAssignedStaffId(Integer assignedStaffId) { this.assignedStaffId = assignedStaffId; }

    public String getAssignedStaffName() { return assignedStaffName; }
    public void setAssignedStaffName(String assignedStaffName) { this.assignedStaffName = assignedStaffName; }

    public String getBookingRef() { return bookingRef; }
    public void setBookingRef(String bookingRef) { this.bookingRef = bookingRef; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public String getDueDateTime() { return dueDateTime; }
    public void setDueDateTime(String dueDateTime) { this.dueDateTime = dueDateTime; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
