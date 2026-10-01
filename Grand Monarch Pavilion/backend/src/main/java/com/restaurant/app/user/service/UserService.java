package com.restaurant.app.user.service;

import com.restaurant.app.user.entity.User;
import com.restaurant.app.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for Customer & Staff Management.
 */
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() { return userRepository.getAllUsers(); }

    public User getUserById(int id) { return userRepository.getUserById(id); }

    public boolean createUser(User user) {
        if (user == null || user.getUsername() == null) return false;
        return userRepository.createUser(user);
    }

    public boolean updateUser(User user) {
        if (user == null || user.getId() <= 0) return false;
        return userRepository.updateUser(user);
    }

    public boolean updateProfile(int id, String fullName, String email, String phone, String address) {
        if (id <= 0 || fullName == null || email == null) return false;
        return userRepository.updateProfile(id, fullName, email, phone, address);
    }

    public boolean changePassword(int id, String oldPassword, String newPassword) {
        if (id <= 0 || oldPassword == null || newPassword == null || newPassword.length() < 4) return false;
        return userRepository.changePassword(id, oldPassword, newPassword);
    }

    public boolean updateStatus(int id, String status) {
        if (id <= 0 || status == null) return false;
        return userRepository.updateStatus(id, status);
    }

    public boolean deleteUser(int id) {
        if (id <= 0) return false;
        return userRepository.deleteUser(id);
    }
}
