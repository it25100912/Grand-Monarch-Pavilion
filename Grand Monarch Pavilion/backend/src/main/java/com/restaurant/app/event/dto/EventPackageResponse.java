package com.restaurant.app.event.dto;

import com.restaurant.app.common.util.DateTimeUtil;
import com.restaurant.app.event.entity.EventPackage;

public class EventPackageResponse {
    private Integer id;
    private String name;
    private String tier;
    private String eventType;
    private Double price;
    private Integer maxGuests;
    private String services;
    private String description;
    private String status;
    private String createdAt;

    public EventPackageResponse() {}

    public EventPackageResponse(EventPackage p) {
        if (p != null) {
            this.id = p.getId();
            this.name = p.getName();
            this.tier = p.getTier();
            this.eventType = p.getEventType();
            this.price = p.getPrice();
            this.maxGuests = p.getMaxGuests();
            this.services = p.getServices();
            this.description = p.getDescription();
            this.status = p.getStatus();
            this.createdAt = DateTimeUtil.formatDateTime(p.getCreatedAt());
        }
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

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

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
