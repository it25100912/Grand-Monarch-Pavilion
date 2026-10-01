package com.restaurant.app.customerstaff.dto;

import com.restaurant.app.customerstaff.entity.User;
import java.time.LocalDateTime;

public class UserResponse {
    private Integer id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String status;
    private String address;
    private String jobPosition;
    private String department;
    private String branch;
    private String workingHours;
    private String avatarUrl;
    private LocalDateTime createdAt;

    public UserResponse() {}

    public UserResponse(User user) {
        if (user != null) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.fullName = user.getFullName();
            this.email = user.getEmail();
            this.phone = user.getPhone();
            this.role = user.getRole();
            this.status = user.getStatus();
            this.address = user.getAddress();
            this.jobPosition = user.getJobPosition();
            this.department = user.getDepartment();
            this.branch = user.getBranch();
            this.workingHours = user.getWorkingHours();
            this.avatarUrl = user.getAvatarUrl();
            this.createdAt = user.getCreatedAt();
        }
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getJobPosition() { return jobPosition; }
    public void setJobPosition(String jobPosition) { this.jobPosition = jobPosition; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getWorkingHours() { return workingHours; }
    public void setWorkingHours(String workingHours) { this.workingHours = workingHours; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
