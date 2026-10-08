package com.restaurant.app.customerstaff.service;

import com.restaurant.app.customerstaff.entity.Customer;
import com.restaurant.app.customerstaff.entity.Staff;
import com.restaurant.app.customerstaff.entity.User;

/**
 * Factory Design Pattern — UserAccountFactory
 * SE2030 Creational Design Pattern: Factory Pattern
 * Centralizes instantiation logic for User sub-types (Customer vs Staff).
 * Hides object creation details and promotes loose coupling.
 */
public class UserAccountFactory {

    public static User createAccount(String roleType) {
        if (roleType == null || "CUSTOMER".equalsIgnoreCase(roleType.trim())) {
            return new Customer();
        } else {
            Staff staff = new Staff();
            staff.setRole(roleType.trim().toUpperCase());
            return staff;
        }
    }
}
