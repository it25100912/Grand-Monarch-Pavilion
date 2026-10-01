package com.restaurant.app.reservation.entity;

public class Restaurant {
    private String name = "Grand Monarch Pavilion";
    private String address = "100 Grand Monarch Boulevard, Colombo 07, Sri Lanka";
    private String phone = "+94 11 234 5678";
    private String email = "concierge@grandmonarch.lk";
    private String openingHours = "10:00 AM - 11:30 PM";
    private int totalCapacity = 250;

    public Restaurant() {}

    public Restaurant(String name, String address, String phone, String email, String openingHours, int totalCapacity) {
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.openingHours = openingHours;
        this.totalCapacity = totalCapacity;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOpeningHours() { return openingHours; }
    public void setOpeningHours(String openingHours) { this.openingHours = openingHours; }

    public int getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(int totalCapacity) { this.totalCapacity = totalCapacity; }
}
