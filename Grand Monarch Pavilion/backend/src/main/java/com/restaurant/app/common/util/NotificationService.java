package com.restaurant.app.common.util;

import com.restaurant.app.config.DBConnectionManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * Observer Pattern — dispatches automated system notifications.
 */
public class NotificationService {
    private static NotificationService instance;

    private NotificationService() {}

    public static synchronized NotificationService getInstance() {
        if (instance == null) {
            instance = new NotificationService();
        }
        return instance;
    }

    public void notifyUser(int userId, String title, String message) {
        String sql = "INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setString(2, title);
            stmt.setString(3, message);
            stmt.executeUpdate();
            System.out.println("[Observer Notification] User #" + userId + " -> " + title + ": " + message);
        } catch (SQLException e) {
            System.err.println("[NotificationService] Failed to send notification: " + e.getMessage());
        }
    }
}
