package com.restaurant.app.user.entity;

/**
 * User entity — covers both Customers and Staff members.
 * Roles: ADMIN, EVENT_COORDINATOR, FINANCE_OFFICER, OPERATIONS_SUPERVISOR, CUSTOMER_SERVICE, CUSTOMER
 */
public class User {
    private int id;
    private String username;
    private String password;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String status; // ACTIVE, INACTIVE, SUSPENDED
    private String createdAt = "";
    private String address = "";
    private String jobPosition = "";
    private String department = "";

    public User() {}

    public User(int id, String username, String password, String fullName, String email,
                String phone, String role, String status, String createdAt) {
        this.id = id; this.username = username; this.password = password;
        this.fullName = fullName; this.email = email; this.phone = phone;
        this.role = role; this.status = status; this.createdAt = createdAt;
    }

    public User(int id, String username, String password, String fullName, String email,
                String phone, String role, String status, String createdAt,
                String address, String jobPosition, String department) {
        this(id, username, password, fullName, email, phone, role, status, createdAt);
        this.address = address; this.jobPosition = jobPosition; this.department = department;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

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

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getJobPosition() { return jobPosition; }
    public void setJobPosition(String jobPosition) { this.jobPosition = jobPosition; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
