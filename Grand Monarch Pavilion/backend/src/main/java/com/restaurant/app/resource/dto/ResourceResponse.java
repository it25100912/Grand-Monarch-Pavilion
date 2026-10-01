package com.restaurant.app.resource.dto;

import com.restaurant.app.resource.entity.Resource;

public class ResourceResponse {
    private Integer id;
    private String name;
    private String category;
    private Integer totalQuantity;
    private Integer allocatedQuantity;
    private Integer availableQuantity;
    private Double unitPrice;
    private String status;

    public ResourceResponse() {}

    public ResourceResponse(Resource r) {
        if (r != null) {
            this.id = r.getId();
            this.name = r.getName();
            this.category = r.getCategory();
            this.totalQuantity = r.getTotalQuantity();
            this.allocatedQuantity = r.getAllocatedQuantity();
            this.availableQuantity = r.getAvailableQuantity();
            this.unitPrice = r.getUnitPrice();
            this.status = r.getStatus();
        }
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

    public Integer getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(Integer availableQuantity) { this.availableQuantity = availableQuantity; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
