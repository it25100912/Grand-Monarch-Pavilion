package com.restaurant.app.venue.dto;

import com.restaurant.app.venue.entity.Venue;

public class VenueResponse {
    private Integer id;
    private String name;
    private String location;
    private String description;
    private String imageUrl;
    private String facilities;
    private Integer capacity;
    private Double pricePerHour;
    private String status;

    public VenueResponse() {}

    public VenueResponse(Venue venue) {
        if (venue != null) {
            this.id = venue.getId();
            this.name = venue.getName();
            this.location = venue.getLocation();
            this.description = venue.getDescription();
            this.imageUrl = venue.getImageUrl();
            this.facilities = venue.getFacilities();
            this.capacity = venue.getCapacity();
            this.pricePerHour = venue.getPricePerHour();
            this.status = venue.getStatus();
        }
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

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
