package com.restaurant.app.event.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_packages")
public class EventPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 50)
    private String tier = "GOLD"; // SILVER, GOLD, PLATINUM, ROYAL

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType = "ALL"; // WEDDING, CORPORATE, BIRTHDAY, ALL

    @Column(nullable = false)
    private Double price;

    @Column(name = "max_guests", nullable = false)
    private Integer maxGuests = 200;

    @Column(columnDefinition = "TEXT")
    private String services; // Comma-separated or JSON list of services

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public EventPackage() {}

    public EventPackage(String name, String tier, String eventType, Double price, Integer maxGuests, String services, String description) {
        this.name = name;
        this.tier = tier;
        this.eventType = eventType;
        this.price = price;
        this.maxGuests = maxGuests;
        this.services = services;
        this.description = description;
        this.status = "ACTIVE";
        this.createdAt = LocalDateTime.now();
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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
