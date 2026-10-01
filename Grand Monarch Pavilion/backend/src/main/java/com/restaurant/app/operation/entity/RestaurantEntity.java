package com.restaurant.app.operation.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "restaurants")
public class RestaurantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String detailedBio;

    private String cuisines; // Comma-separated: "Fine Dining, Seafood, Sri Lankan Fusion"

    private String logoUrl;

    private String coverImageUrl;

    private String email;

    private String phone;

    private String website;

    private String openingHours; // e.g. "10:00 AM"

    private String closingHours; // e.g. "11:30 PM"

    @Column(nullable = false)
    private String status = "ACTIVE"; // "ACTIVE" or "INACTIVE"

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Transient
    private Integer branchCount = 0;

    public RestaurantEntity() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = "ACTIVE";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public String getDetailedBio() { return detailedBio; }
    public void setDetailedBio(String detailedBio) { this.detailedBio = detailedBio; }

    public String getCuisines() { return cuisines; }
    public void setCuisines(String cuisines) { this.cuisines = cuisines; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getOpeningHours() { return openingHours; }
    public void setOpeningHours(String openingHours) { this.openingHours = openingHours; }

    public String getClosingHours() { return closingHours; }
    public void setClosingHours(String closingHours) { this.closingHours = closingHours; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Integer getBranchCount() { return branchCount; }
    public void setBranchCount(Integer branchCount) { this.branchCount = branchCount; }
}
