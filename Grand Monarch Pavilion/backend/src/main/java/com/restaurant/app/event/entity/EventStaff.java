package com.restaurant.app.event.entity;

public class EventStaff {
    private int id;
    private int eventId;
    private int staffId;
    private String staffName;
    private String staffEmail;
    private String staffRole;
    private String roleDescription;
    private String assignedAt;

    public EventStaff() {}

    public EventStaff(int id, int eventId, int staffId, String staffName, String staffEmail,
                      String staffRole, String roleDescription, String assignedAt) {
        this.id = id; this.eventId = eventId; this.staffId = staffId;
        this.staffName = staffName; this.staffEmail = staffEmail;
        this.staffRole = staffRole; this.roleDescription = roleDescription;
        this.assignedAt = assignedAt;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getEventId() { return eventId; }
    public void setEventId(int eventId) { this.eventId = eventId; }
    public int getStaffId() { return staffId; }
    public void setStaffId(int staffId) { this.staffId = staffId; }
    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }
    public String getStaffEmail() { return staffEmail; }
    public void setStaffEmail(String staffEmail) { this.staffEmail = staffEmail; }
    public String getStaffRole() { return staffRole; }
    public void setStaffRole(String staffRole) { this.staffRole = staffRole; }
    public String getRoleDescription() { return roleDescription; }
    public void setRoleDescription(String roleDescription) { this.roleDescription = roleDescription; }
    public String getAssignedAt() { return assignedAt; }
    public void setAssignedAt(String assignedAt) { this.assignedAt = assignedAt; }
}
