package com.restaurant.app.customerstaff.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_tasks")
public class StaffTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "assigned_staff_id")
    private Integer assignedStaffId;

    @Column(name = "assigned_staff_name", length = 100)
    private String assignedStaffName;

    @Column(name = "booking_ref", length = 50)
    private String bookingRef; // e.g. "EVT-2026-0009" or "RES-104" or "GENERAL"

    @Column(name = "branch_name", length = 100)
    private String branchName = "Grand Monarch Pavilion (Main)";

    @Column(name = "due_date_time")
    private String dueDateTime;

    @Column(nullable = false, length = 30)
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH

    @Column(nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, IN_PROGRESS, COMPLETED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public StaffTask() {}

    public StaffTask(String title, String description, Integer assignedStaffId, String assignedStaffName,
                     String bookingRef, String branchName, String dueDateTime, String priority, String status) {
        this.title = title;
        this.description = description;
        this.assignedStaffId = assignedStaffId;
        this.assignedStaffName = assignedStaffName;
        this.bookingRef = bookingRef;
        this.branchName = branchName;
        this.dueDateTime = dueDateTime;
        this.priority = priority;
        this.status = status;
        this.createdAt = LocalDateTime.now();
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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
