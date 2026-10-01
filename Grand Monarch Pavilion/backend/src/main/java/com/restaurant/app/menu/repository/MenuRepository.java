package com.restaurant.app.menu.repository;

import com.restaurant.app.config.DBConnectionManager;
import com.restaurant.app.menu.entity.MenuItem;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Repository for Restaurant Culinary Menu Items Persistence with rich attributes.
 */
@Repository
public class MenuRepository {

    public List<MenuItem> getAllMenuItems() {
        List<MenuItem> list = new ArrayList<>();
        String sql = "SELECT * FROM menu_items ORDER BY is_featured DESC, category ASC, name ASC";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapRow(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public MenuItem getMenuItemById(int id) {
        String sql = "SELECT * FROM menu_items WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean createMenuItem(MenuItem item) {
        String sql = "INSERT INTO menu_items (name, category, category_id, description, price, image_url, is_vegetarian, is_spicy, spicy_level, is_featured, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, item.getName());
            stmt.setString(2, item.getCategory());
            if (item.getCategoryId() != null) stmt.setInt(3, item.getCategoryId()); else stmt.setNull(3, Types.INTEGER);
            stmt.setString(4, item.getDescription());
            stmt.setDouble(5, item.getPrice());
            stmt.setString(6, item.getImageUrl() != null ? item.getImageUrl() : "images/gourmet_feast.jpg");
            stmt.setBoolean(7, item.isVegetarian());
            stmt.setBoolean(8, item.isSpicy());
            stmt.setInt(9, item.getSpicyLevel());
            stmt.setBoolean(10, item.isFeatured());
            stmt.setBoolean(11, item.isAvailable());

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                try (ResultSet keys = stmt.getGeneratedKeys()) {
                    if (keys.next()) {
                        item.setId(keys.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateMenuItem(MenuItem item) {
        String sql = "UPDATE menu_items SET name = ?, category = ?, category_id = ?, description = ?, price = ?, image_url = ?, is_vegetarian = ?, is_spicy = ?, spicy_level = ?, is_featured = ?, is_available = ? WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, item.getName());
            stmt.setString(2, item.getCategory());
            if (item.getCategoryId() != null) stmt.setInt(3, item.getCategoryId()); else stmt.setNull(3, Types.INTEGER);
            stmt.setString(4, item.getDescription());
            stmt.setDouble(5, item.getPrice());
            stmt.setString(6, item.getImageUrl() != null ? item.getImageUrl() : "images/gourmet_feast.jpg");
            stmt.setBoolean(7, item.isVegetarian());
            stmt.setBoolean(8, item.isSpicy());
            stmt.setInt(9, item.getSpicyLevel());
            stmt.setBoolean(10, item.isFeatured());
            stmt.setBoolean(11, item.isAvailable());
            stmt.setInt(12, item.getId());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean toggleAvailability(int id, boolean isAvailable) {
        String sql = "UPDATE menu_items SET is_available = ? WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setBoolean(1, isAvailable);
            stmt.setInt(2, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteMenuItem(int id) {
        String sql = "DELETE FROM menu_items WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public long countByCategoryId(int categoryId) {
        String sql = "SELECT COUNT(*) FROM menu_items WHERE category_id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, categoryId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return rs.getLong(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public long countByCategoryName(String categoryName) {
        String sql = "SELECT COUNT(*) FROM menu_items WHERE LOWER(category) = LOWER(?)";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, categoryName);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return rs.getLong(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    private MenuItem mapRow(ResultSet rs) throws SQLException {
        MenuItem item = new MenuItem();
        item.setId(rs.getInt("id"));
        item.setName(rs.getString("name"));
        item.setCategory(rs.getString("category"));
        item.setDescription(rs.getString("description"));
        item.setPrice(rs.getDouble("price"));
        item.setAvailable(rs.getBoolean("is_available"));

        try {
            item.setImageUrl(rs.getString("image_url"));
            int catId = rs.getInt("category_id");
            if (!rs.wasNull()) item.setCategoryId(catId);
            item.setVegetarian(rs.getBoolean("is_vegetarian"));
            item.setSpicy(rs.getBoolean("is_spicy"));
            item.setSpicyLevel(rs.getInt("spicy_level"));
            item.setFeatured(rs.getBoolean("is_featured"));
        } catch (SQLException ignored) {}

        if (item.getImageUrl() == null || item.getImageUrl().isBlank()) {
            item.setImageUrl("images/gourmet_feast.jpg");
        }
        return item;
    }
}
