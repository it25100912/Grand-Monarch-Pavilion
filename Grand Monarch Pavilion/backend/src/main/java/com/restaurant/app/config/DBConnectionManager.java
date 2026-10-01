package com.restaurant.app.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Singleton Pattern implementation for centralized MySQL Database Connection Management.
 * SE2030 Design Pattern #1: Singleton Pattern
 */
public class DBConnectionManager {
    private static DBConnectionManager instance;
    private static final String URL = "jdbc:mysql://localhost:3306/restaurant_event_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "root";

    private DBConnectionManager() {
        try {
            // Register MySQL JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("[DBConnectionManager] MySQL JDBC Driver not found: " + e.getMessage());
        }
    }

    public static synchronized DBConnectionManager getInstance() {
        if (instance == null) {
            instance = new DBConnectionManager();
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
