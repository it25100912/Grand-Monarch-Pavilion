package com.restaurant.app.user.service;

import com.restaurant.app.user.entity.User;

/**
 * Factory Pattern — instantiates role-specific User objects.
 */
public class UserFactory {

    public static User createUser(String role, String username, String password,
                                   String fullName, String email, String phone) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setStatus("ACTIVE");

        String normalizedRole = (role != null) ? role.toUpperCase().trim() : "CUSTOMER";
        switch (normalizedRole) {
            case "ADMIN":                user.setRole("ADMIN"); break;
            case "EVENT_COORDINATOR":    user.setRole("EVENT_COORDINATOR"); break;
            case "FINANCE_OFFICER":      user.setRole("FINANCE_OFFICER"); break;
            case "OPERATIONS_SUPERVISOR": user.setRole("OPERATIONS_SUPERVISOR"); break;
            case "CUSTOMER_SERVICE":     user.setRole("CUSTOMER_SERVICE"); break;
            default:                     user.setRole("CUSTOMER"); break;
        }
        return user;
    }
}
