package com.restaurant.app.menu.entity;

public class MenuItem {
    private int id;
    private String name;
    private String category;
    private Integer categoryId;
    private String description;
    private double price;
    private String imageUrl = "images/gourmet_feast.jpg";
    private boolean isVegetarian = false;
    private boolean isSpicy = false;
    private int spicyLevel = 0; // 0 = None/Mild, 1 = Medium, 2 = Hot, 3 = Extra Hot
    private boolean isFeatured = false;
    private boolean isAvailable = true;

    public MenuItem() {}

    public MenuItem(int id, String name, String category, String description, double price, boolean isAvailable) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.price = price;
        this.isAvailable = isAvailable;
    }

    public MenuItem(int id, String name, String category, Integer categoryId, String description,
                    double price, String imageUrl, boolean isVegetarian, boolean isSpicy,
                    int spicyLevel, boolean isFeatured, boolean isAvailable) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.categoryId = categoryId;
        this.description = description;
        this.price = price;
        this.imageUrl = (imageUrl != null && !imageUrl.isBlank()) ? imageUrl : "images/gourmet_feast.jpg";
        this.isVegetarian = isVegetarian;
        this.isSpicy = isSpicy;
        this.spicyLevel = spicyLevel;
        this.isFeatured = isFeatured;
        this.isAvailable = isAvailable;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isVegetarian() { return isVegetarian; }
    public void setVegetarian(boolean vegetarian) { isVegetarian = vegetarian; }

    public boolean isSpicy() { return isSpicy; }
    public void setSpicy(boolean spicy) { isSpicy = spicy; }

    public int getSpicyLevel() { return spicyLevel; }
    public void setSpicyLevel(int spicyLevel) { this.spicyLevel = spicyLevel; }

    public boolean isFeatured() { return isFeatured; }
    public void setFeatured(boolean featured) { isFeatured = featured; }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }
}
