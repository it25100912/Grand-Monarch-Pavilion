package com.restaurant.app.resource.dto;

import jakarta.validation.constraints.*;

public class ResourceRequest {

    @NotBlank(message = "Resource / equipment name is required")
    @Size(min = 2, max = 100, message = "Equipment name must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s.']+$",
             message = "Equipment name can only contain letters and spaces. Numbers (e.g. 123) and special symbols (e.g. /-+#) are not allowed.")
    private String name;

    @NotBlank(message = "Category is required")
    @Size(min = 2, max = 50, message = "Category must be between 2 and 50 characters")
    private String category;

    @NotNull(message = "Total quantity is required")
    @Min(value = 1, message = "Total quantity must be at least 1")
    @Max(value = 10000, message = "Total quantity cannot exceed 10,000 units")
    private Integer totalQuantity;

    @Min(value = 0, message = "Allocated quantity cannot be negative")
    private Integer allocatedQuantity = 0;

    @DecimalMin(value = "0.0", inclusive = true, message = "Unit rental price must be 0 or more (LKR)")
    private Double unitPrice = 0.0;

    @Pattern(regexp = "AVAILABLE|MAINTENANCE|OUT_OF_STOCK",
             message = "Status must be one of: AVAILABLE, MAINTENANCE, OUT_OF_STOCK")
    private String status = "AVAILABLE";

    public ResourceRequest() {}

    public ResourceRequest(String name, String category, Integer totalQuantity, Integer allocatedQuantity, Double unitPrice, String status) {
        this.name = name;
        this.category = category;
        this.totalQuantity = totalQuantity;
        this.allocatedQuantity = allocatedQuantity;
        this.unitPrice = unitPrice;
        this.status = status;
    }

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
}
