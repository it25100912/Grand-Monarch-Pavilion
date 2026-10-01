package com.restaurant.app.menu.dto;

import com.restaurant.app.menu.entity.MenuItem;
import jakarta.validation.constraints.*;

public class MenuItemRequest {

    @NotBlank(message = "Dish name is required")
    @Size(min = 2, max = 100, message = "Dish name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Category is required")
    @Size(min = 2, max = 50, message = "Category must be between 2 and 50 characters")
    private String category;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @DecimalMin(value = "0.01", message = "Price must be greater than 0 (minimum LKR 0.01)")
    private double price;

    private boolean isAvailable = true;

    public MenuItemRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }

    public MenuItem toEntity() {
        return new MenuItem(0, name, category, description, price, isAvailable);
    }
}
