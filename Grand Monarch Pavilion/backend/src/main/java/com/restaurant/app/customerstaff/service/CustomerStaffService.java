package com.restaurant.app.customerstaff.service;

import com.restaurant.app.customerstaff.dto.CustomerRequest;
import com.restaurant.app.customerstaff.dto.StaffRequest;
import com.restaurant.app.customerstaff.dto.UserResponse;
import com.restaurant.app.customerstaff.entity.User;

import java.util.List;
import java.util.Map;

public interface CustomerStaffService {

    List<UserResponse> getAllUsers();

    UserResponse getUserById(int id);

    UserResponse getUserByUsername(String username);

    List<UserResponse> getCustomers();

    List<UserResponse> getStaffMembers();

    UserResponse createCustomer(CustomerRequest request);

    UserResponse createStaff(StaffRequest request);

    UserResponse updateUser(int id, User userDetails);

    void deleteUser(int id);

    Map<String, Object> getCustomerStaffDashboardStats();
}
