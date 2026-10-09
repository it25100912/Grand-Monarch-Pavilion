package com.restaurant.app.venue.dto;

import jakarta.validation.constraints.*;

public class VenueRequest {

    @NotBlank(message = "Venue name is required")
    @Size(min = 3, max = 100, message = "Venue name must be between 3 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Venue name can only contain letters and spaces. Numbers and symbols are not allowed")
    private String name;

    @Size(max = 150, message = "Location must not exceed 150 characters")
    private String location;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;

    private String facilities;

    @NotNull(message = "Venue capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1 guest")
    @Max(value = 10000, message = "Capacity cannot exceed 10,000 guests")
    private Integer capacity;

    @NotNull(message = "Price per hour is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price per hour must be a positive number (0 or more)")
    private Double pricePerHour;

    @Pattern(regexp = "AVAILABLE|BOOKED|MAINTENANCE",
             message = "Status must be one of: AVAILABLE, BOOKED, MAINTENANCE")
    private String status = "AVAILABLE";

    public VenueRequest() {}

    public VenueRequest(String name, String location, String description, String imageUrl, String facilities, Integer capacity, Double pricePerHour, String status) {
        this.name = name;
        this.location = location;
        this.description = description;
        this.imageUrl = imageUrl;
        this.facilities = facilities;
        this.capacity = capacity;
        this.pricePerHour = pricePerHour;
        this.status = status;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getFacilities() { return facilities; }
    public void setFacilities(String facilities) { this.facilities = facilities; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Double getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(Double pricePerHour) { this.pricePerHour = pricePerHour; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
