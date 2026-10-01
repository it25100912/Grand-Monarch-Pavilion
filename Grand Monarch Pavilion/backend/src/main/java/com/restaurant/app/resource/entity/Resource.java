package com.restaurant.app.resource.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity;

    @Column(name = "allocated_quantity", nullable = false)
    private Integer allocatedQuantity = 0;

    @Column(name = "unit_price", nullable = false)
    private Double unitPrice = 0.0;

    @Column(nullable = false, length = 50)
    private String status = "AVAILABLE"; // AVAILABLE, LIMITED, OUT_OF_STOCK

    public Resource() {}

    public Resource(Integer id, String name, String category, Integer totalQuantity, Integer allocatedQuantity, Double unitPrice, String status) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.totalQuantity = totalQuantity;
        this.allocatedQuantity = allocatedQuantity;
        this.unitPrice = unitPrice;
        this.status = status;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; }

    public Integer getAllocatedQuantity() { return allocatedQuantity; }
    public void setAllocatedQuantity(Integer allocatedQuantity) { this.allocatedQuantity = allocatedQuantity; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Transient
    public int getAvailableQuantity() {
        int total = totalQuantity != null ? totalQuantity : 0;
        int alloc = allocatedQuantity != null ? allocatedQuantity : 0;
        return Math.max(0, total - alloc);
    }
}
