package com.restaurant.app.dashboard.dto;

public class DashboardStats {
    private int totalUsers;
    private int totalStaff;
    private int totalEvents;
    private int upcomingEvents;
    private int diningReservations;
    private int availableVenues;
    private int totalVenues;
    private int totalEquipment;
    private int availableEquipment;
    private double totalRevenue;
    private double pendingPayments;

    public DashboardStats() {}

    public int getTotalUsers() { return totalUsers; }
    public void setTotalUsers(int totalUsers) { this.totalUsers = totalUsers; }

    public int getTotalStaff() { return totalStaff; }
    public void setTotalStaff(int totalStaff) { this.totalStaff = totalStaff; }

    public int getTotalEvents() { return totalEvents; }
    public void setTotalEvents(int totalEvents) { this.totalEvents = totalEvents; }

    public int getUpcomingEvents() { return upcomingEvents; }
    public void setUpcomingEvents(int upcomingEvents) { this.upcomingEvents = upcomingEvents; }

    public int getDiningReservations() { return diningReservations; }
    public void setDiningReservations(int diningReservations) { this.diningReservations = diningReservations; }

    public int getAvailableVenues() { return availableVenues; }
    public void setAvailableVenues(int availableVenues) { this.availableVenues = availableVenues; }

    public int getTotalVenues() { return totalVenues; }
    public void setTotalVenues(int totalVenues) { this.totalVenues = totalVenues; }

    public int getTotalEquipment() { return totalEquipment; }
    public void setTotalEquipment(int totalEquipment) { this.totalEquipment = totalEquipment; }

    public int getAvailableEquipment() { return availableEquipment; }
    public void setAvailableEquipment(int availableEquipment) { this.availableEquipment = availableEquipment; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public double getPendingPayments() { return pendingPayments; }
    public void setPendingPayments(double pendingPayments) { this.pendingPayments = pendingPayments; }
}
