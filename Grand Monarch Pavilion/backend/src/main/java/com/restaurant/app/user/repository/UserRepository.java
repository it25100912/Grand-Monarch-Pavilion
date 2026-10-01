package com.restaurant.app.user.repository;

import com.restaurant.app.common.config.DBConnectionManager;
import com.restaurant.app.user.entity.User;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Repository for Customer & Staff Account Persistence.
 */
@Repository
public class UserRepository {

    public User authenticate(String username, String password) {
        String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, username);
            stmt.setString(2, password);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return mapRow(rs);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    public List<User> getAllUsers() {
        List<User> list = new ArrayList<>();
        String sql = "SELECT * FROM users ORDER BY id DESC";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) list.add(mapRow(rs));
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public User getUserById(int id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return mapRow(rs);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    public boolean createUser(User user) {
        String sql = "INSERT INTO users (username, password, full_name, email, phone, role, status, address, job_position, department) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, user.getUsername());
            stmt.setString(2, user.getPassword());
            stmt.setString(3, user.getFullName());
            stmt.setString(4, user.getEmail());
            stmt.setString(5, user.getPhone() != null ? user.getPhone() : "");
            stmt.setString(6, user.getRole());
            stmt.setString(7, user.getStatus() != null ? user.getStatus() : "ACTIVE");
            stmt.setString(8, user.getAddress() != null ? user.getAddress() : "");
            stmt.setString(9, user.getJobPosition() != null ? user.getJobPosition() : "");
            stmt.setString(10, user.getDepartment() != null ? user.getDepartment() : "");
            int rows = stmt.executeUpdate();
            if (rows > 0) {
                try (ResultSet keys = stmt.getGeneratedKeys()) {
                    if (keys.next()) user.setId(keys.getInt(1));
                }
                return true;
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean updateUser(User user) {
        String sql = "UPDATE users SET full_name = ?, email = ?, phone = ?, role = ?, status = ?, address = ?, job_position = ?, department = ? WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, user.getFullName());
            stmt.setString(2, user.getEmail());
            stmt.setString(3, user.getPhone() != null ? user.getPhone() : "");
            stmt.setString(4, user.getRole() != null ? user.getRole() : "CUSTOMER");
            stmt.setString(5, user.getStatus() != null ? user.getStatus() : "ACTIVE");
            stmt.setString(6, user.getAddress() != null ? user.getAddress() : "");
            stmt.setString(7, user.getJobPosition() != null ? user.getJobPosition() : "");
            stmt.setString(8, user.getDepartment() != null ? user.getDepartment() : "");
            stmt.setInt(9, user.getId());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean updateProfile(int id, String fullName, String email, String phone, String address) {
        String sql = "UPDATE users SET full_name = ?, email = ?, phone = ?, address = ? WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, fullName);
            stmt.setString(2, email);
            stmt.setString(3, phone != null ? phone : "");
            stmt.setString(4, address != null ? address : "");
            stmt.setInt(5, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean changePassword(int id, String oldPassword, String newPassword) {
        String checkSql = "SELECT password FROM users WHERE id = ?";
        String updateSql = "UPDATE users SET password = ? WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection()) {
            try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                checkStmt.setInt(1, id);
                try (ResultSet rs = checkStmt.executeQuery()) {
                    if (rs.next() && !rs.getString("password").equals(oldPassword)) return false;
                    if (!rs.isBeforeFirst()) return false;
                }
            }
            try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
                updateStmt.setString(1, newPassword);
                updateStmt.setInt(2, id);
                return updateStmt.executeUpdate() > 0;
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean updateStatus(int id, String status) {
        String sql = "UPDATE users SET status = ? WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setInt(2, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean deleteUser(int id) {
        String sql = "DELETE FROM users WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    private User mapRow(ResultSet rs) throws SQLException {
        User u = new User(
            rs.getInt("id"), rs.getString("username"), rs.getString("password"),
            rs.getString("full_name"), rs.getString("email"), rs.getString("phone"),
            rs.getString("role"), rs.getString("status"),
            rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toString() : ""
        );
        try {
            u.setAddress(rs.getString("address") != null ? rs.getString("address") : "");
            u.setJobPosition(rs.getString("job_position") != null ? rs.getString("job_position") : "");
            u.setDepartment(rs.getString("department") != null ? rs.getString("department") : "");
        } catch (SQLException ignored) {}
        return u;
    }
}
