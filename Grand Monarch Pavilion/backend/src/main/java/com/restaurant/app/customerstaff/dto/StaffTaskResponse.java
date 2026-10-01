package com.restaurant.app.customerstaff.dto;

import com.restaurant.app.common.util.DateTimeUtil;
import com.restaurant.app.customerstaff.entity.StaffTask;

public class StaffTaskResponse {
    private Integer id;
    private String title;
    private String description;
    private Integer assignedStaffId;
    private String assignedStaffName;
    private String bookingRef;
    private String branchName;
    private String dueDateTime;
    private String priority;
    private String status;
    private String createdAt;

    public StaffTaskResponse() {}

    public StaffTaskResponse(StaffTask t) {
        if (t != null) {
            this.id = t.getId();
            this.title = t.getTitle();
            this.description = t.getDescription();
            this.assignedStaffId = t.getAssignedStaffId();
            this.assignedStaffName = t.getAssignedStaffName();
            this.bookingRef = t.getBookingRef();
            this.branchName = t.getBranchName();
            this.dueDateTime = t.getDueDateTime();
            this.priority = t.getPriority();
            this.status = t.getStatus();
            this.createdAt = DateTimeUtil.formatDateTime(t.getCreatedAt());
        }
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

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

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
