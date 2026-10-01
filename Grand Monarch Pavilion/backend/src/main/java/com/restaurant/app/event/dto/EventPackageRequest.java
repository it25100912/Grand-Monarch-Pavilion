package com.restaurant.app.event.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class EventPackageRequest {

    @NotBlank(message = "Package name is required")
    @Size(min = 3, max = 150, message = "Package name must be between 3 and 150 characters")
    private String name;

    private String tier = "GOLD";

    private String eventType = "ALL";

    @NotNull(message = "Package price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
    private Double price;

    private Integer maxGuests = 200;

    private String services;

    private String description;

    private String status = "ACTIVE";

    public EventPackageRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getMaxGuests() { return maxGuests; }
    public void setMaxGuests(Integer maxGuests) { this.maxGuests = maxGuests; }

    public String getServices() { return services; }
    public void setServices(String services) { this.services = services; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
