package com.restaurant.app.event.dto;

import com.restaurant.app.common.util.DateTimeUtil;
import com.restaurant.app.event.entity.Event;

public class EventResponse {
    private Integer id;
    private String bookingCode;
    private Integer customerId;
    private String customerName;
    private String clientPhone;
    private String clientEmail;
    private Integer venueId;
    private String venueName;
    private Integer packageId;
    private String packageName;
    private Double totalPrice;
    private Double advancePayment;
    private String eventTitle;
    private String eventType;
    private String eventDate;
    private String startTime;
    private String endTime;
    private Integer expectedGuests;
    private String specialRequirements;
    private String status;
    private String createdAt;

    public EventResponse() {}

    public EventResponse(Event e) {
        if (e != null) {
            this.id = e.getId();
            this.bookingCode = e.getBookingCode() != null ? e.getBookingCode() : ("EVT-" + String.format("%04d", e.getId()));
            this.customerId = e.getCustomerId();
            this.customerName = e.getCustomerName();
            this.clientPhone = e.getClientPhone() != null ? e.getClientPhone() : (e.getCustomer() != null ? e.getCustomer().getPhone() : null);
            this.clientEmail = e.getClientEmail() != null ? e.getClientEmail() : (e.getCustomer() != null ? e.getCustomer().getEmail() : null);
            this.venueId = e.getVenueId();
            this.venueName = e.getVenueName();
            this.packageId = e.getPackageId();
            this.packageName = e.getPackageName();
            this.totalPrice = e.getTotalPrice() != null ? e.getTotalPrice() : 0.0;
            this.advancePayment = e.getAdvancePayment() != null ? e.getAdvancePayment() : 0.0;
            this.eventTitle = e.getEventTitle();
            this.eventType = e.getEventType();
            this.eventDate = DateTimeUtil.formatDate(e.getEventDate());
            this.startTime = DateTimeUtil.formatTime(e.getStartTime());
            this.endTime = DateTimeUtil.formatTime(e.getEndTime());
            this.expectedGuests = e.getExpectedGuests();
            this.specialRequirements = e.getSpecialRequirements();
            this.status = e.getStatus();
            this.createdAt = DateTimeUtil.formatDateTime(e.getCreatedAt());
        }
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getBookingCode() { return bookingCode; }
    public void setBookingCode(String bookingCode) { this.bookingCode = bookingCode; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getClientPhone() { return clientPhone; }
    public void setClientPhone(String clientPhone) { this.clientPhone = clientPhone; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public Integer getVenueId() { return venueId; }
    public void setVenueId(Integer venueId) { this.venueId = venueId; }

    public String getVenueName() { return venueName; }
    public void setVenueName(String venueName) { this.venueName = venueName; }

    public Integer getPackageId() { return packageId; }
    public void setPackageId(Integer packageId) { this.packageId = packageId; }

    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public Double getAdvancePayment() { return advancePayment; }
    public void setAdvancePayment(Double advancePayment) { this.advancePayment = advancePayment; }

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

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
