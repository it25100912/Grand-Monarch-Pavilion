package com.restaurant.app.customerstaff.service;

import com.restaurant.app.common.exception.BadRequestException;
import com.restaurant.app.common.exception.ResourceNotFoundException;
import com.restaurant.app.customerstaff.dto.CustomerRequest;
import com.restaurant.app.customerstaff.dto.StaffRequest;
import com.restaurant.app.customerstaff.dto.UserResponse;
import com.restaurant.app.customerstaff.entity.Customer;
import com.restaurant.app.customerstaff.entity.Staff;
import com.restaurant.app.customerstaff.entity.User;
import com.restaurant.app.customerstaff.repository.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerStaffServiceImpl implements CustomerStaffService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerStaffServiceImpl(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return new UserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return new UserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getCustomers() {
        return userRepository.findByRole("CUSTOMER").stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getStaffMembers() {
        return userRepository.findByRoleNot("CUSTOMER").stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse createCustomer(CustomerRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists: " + request.getEmail());
        }

        Customer customer = new Customer();
        customer.setUsername(request.getUsername());
        customer.setPassword(passwordEncoder != null && request.getPassword() != null && !request.getPassword().startsWith("$2a$")
                ? passwordEncoder.encode(request.getPassword()) : request.getPassword());
        customer.setFullName(request.getFullName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        customer.setRole("CUSTOMER");
        customer.setStatus("ACTIVE");

        User saved = userRepository.save(customer);
        return new UserResponse(saved);
    }

    @Override
    public UserResponse createStaff(StaffRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists: " + request.getEmail());
        }

        Staff staff = new Staff();
        staff.setUsername(request.getUsername());
        staff.setPassword(passwordEncoder != null && request.getPassword() != null && !request.getPassword().startsWith("$2a$")
                ? passwordEncoder.encode(request.getPassword()) : request.getPassword());
        staff.setFullName(request.getFullName());
        staff.setEmail(request.getEmail());
        staff.setPhone(request.getPhone());
        staff.setRole(request.getRole() != null ? request.getRole() : "CUSTOMER_SERVICE");
        staff.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        staff.setJobPosition(request.getJobPosition());
        staff.setDepartment(request.getDepartment());
        staff.setBranch(request.getBranch() != null ? request.getBranch() : "Grand Monarch Pavilion (Main)");
        staff.setWorkingHours(request.getWorkingHours() != null ? request.getWorkingHours() : "09:00 - 18:00");
        staff.setAvatarUrl(request.getAvatarUrl() != null ? request.getAvatarUrl() : "");

        User saved = userRepository.save(staff);
        return new UserResponse(saved);
    }

    @Override
    public UserResponse updateUser(int id, User details) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (details.getFullName() != null) user.setFullName(details.getFullName());
        if (details.getEmail() != null) user.setEmail(details.getEmail());
        if (details.getPhone() != null) user.setPhone(details.getPhone());
        if (details.getRole() != null) user.setRole(details.getRole());
        if (details.getStatus() != null) user.setStatus(details.getStatus());
        if (details.getAddress() != null) user.setAddress(details.getAddress());
        if (details.getJobPosition() != null) user.setJobPosition(details.getJobPosition());
        if (details.getDepartment() != null) user.setDepartment(details.getDepartment());
        if (details.getBranch() != null) user.setBranch(details.getBranch());
        if (details.getWorkingHours() != null) user.setWorkingHours(details.getWorkingHours());
        if (details.getAvatarUrl() != null) user.setAvatarUrl(details.getAvatarUrl());

        if (details.getPassword() != null && !details.getPassword().isBlank()) {
            user.setPassword(passwordEncoder != null && !details.getPassword().startsWith("$2a$")
                    ? passwordEncoder.encode(details.getPassword()) : details.getPassword());
        }

        User updated = userRepository.save(user);
        return new UserResponse(updated);
    }

    @Override
    public void deleteUser(int id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getCustomerStaffDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.countByRole("CUSTOMER");
        long totalStaff = userRepository.countByRoleNot("CUSTOMER");

        stats.put("totalUsers", totalUsers);
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalStaff", totalStaff);
        stats.put("activeStaff", userRepository.findByRoleNot("CUSTOMER").stream()
                .filter(u -> "ACTIVE".equalsIgnoreCase(u.getStatus()))
                .count());

        return stats;
    }
}
