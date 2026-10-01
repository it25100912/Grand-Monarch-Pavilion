package com.restaurant.app.event.dto;

import jakarta.validation.constraints.*;

public class EventRequest {

    @NotNull(message = "Customer ID is required")
    private Integer customerId;

    private Integer venueId;

    private Integer packageId;

    private String packageName;

    private Double totalPrice;

    private Double advancePayment;

    private String clientPhone;

    private String clientEmail;

    @NotBlank(message = "Event title is required")
    @Size(min = 3, max = 150, message = "Event title must be between 3 and 150 characters")
    private String eventTitle;

    @NotBlank(message = "Event type is required")
    private String eventType; // WEDDING, BIRTHDAY, CORPORATE, PARTY, OTHER

    @NotBlank(message = "Event date is required")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Event date must be in YYYY-MM-DD format")
    private String eventDate;

    @NotBlank(message = "Start time is required")
    @Pattern(regexp = "\\d{2}:\\d{2}(:\\d{2})?", message = "Start time must be in HH:MM format (e.g. 18:00)")
    private String startTime;

    @NotBlank(message = "End time is required")
    @Pattern(regexp = "\\d{2}:\\d{2}(:\\d{2})?", message = "End time must be in HH:MM format (e.g. 23:00)")
    private String endTime;

    @NotNull(message = "Expected number of guests is required")
    @Min(value = 1, message = "Expected guests must be at least 1")
    @Max(value = 5000, message = "Expected guests cannot exceed 5000")
    private Integer expectedGuests;

    @Size(max = 1000, message = "Special requirements must not exceed 1000 characters")
    private String specialRequirements;

    private String status = "PENDING";

    public EventRequest() {}

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public Integer getVenueId() { return venueId; }
    public void setVenueId(Integer venueId) { this.venueId = venueId; }

    public Integer getPackageId() { return packageId; }
    public void setPackageId(Integer packageId) { this.packageId = packageId; }

    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public Double getAdvancePayment() { return advancePayment; }
    public void setAdvancePayment(Double advancePayment) { this.advancePayment = advancePayment; }

    public String getClientPhone() { return clientPhone; }
    public void setClientPhone(String clientPhone) { this.clientPhone = clientPhone; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public Integer getExpectedGuests() { return expectedGuests; }
    public void setExpectedGuests(Integer expectedGuests) { this.expectedGuests = expectedGuests; }

    public String getSpecialRequirements() { return specialRequirements; }
    public void setSpecialRequirements(String specialRequirements) { this.specialRequirements = specialRequirements; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
