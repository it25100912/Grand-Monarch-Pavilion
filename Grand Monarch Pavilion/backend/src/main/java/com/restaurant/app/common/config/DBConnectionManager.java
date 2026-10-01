package com.restaurant.app.common.config;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * Backward compatibility delegation to com.restaurant.app.config.DBConnectionManager.
 */
public class DBConnectionManager {

    private DBConnectionManager() {}

    public static DBConnectionManager getInstance() {
        return Holder.INSTANCE;
    }

    private static class Holder {
        private static final DBConnectionManager INSTANCE = new DBConnectionManager();
    }

    public Connection getConnection() throws SQLException {
        return com.restaurant.app.config.DBConnectionManager.getInstance().getConnection();
    }
}
