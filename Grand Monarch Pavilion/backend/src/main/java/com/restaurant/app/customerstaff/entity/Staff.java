package com.restaurant.app.customerstaff.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("STAFF")
public class Staff extends User {

    public Staff() {
        super();
    }

    public Staff(Integer id, String username, String password, String fullName,
                 String email, String phone, String role, String status,
                 String jobPosition, String department) {
        super(id, username, password, fullName, email, phone, role, status, "", jobPosition, department);
    }
}
