package com.restaurant.app.customerstaff.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Transient;

@Entity
@DiscriminatorValue("CUSTOMER")
public class Customer extends User {

    @Transient
    private int totalBookings;

    @Transient
    private double totalSpent;

    public Customer() {
        super();
        setRole("CUSTOMER");
    }

    public Customer(Integer id, String username, String password, String fullName,
                    String email, String phone, String address) {
        super(id, username, password, fullName, email, phone, "CUSTOMER", "ACTIVE");
        setAddress(address);
    }

    public int getTotalBookings() { return totalBookings; }
    public void setTotalBookings(int totalBookings) { this.totalBookings = totalBookings; }

    public double getTotalSpent() { return totalSpent; }
    public void setTotalSpent(double totalSpent) { this.totalSpent = totalSpent; }
}
