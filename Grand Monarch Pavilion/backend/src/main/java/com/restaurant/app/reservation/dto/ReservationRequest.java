package com.restaurant.app.reservation.dto;

import jakarta.validation.constraints.*;

public class ReservationRequest {

    private Integer customerId;
    private String customerName;
    private String contactNumber;
    private String email;

    @NotNull(message = "Table selection is required")
    private Integer tableId;

    private String checkInDate;

    private String reservationDate;

    private String checkOutDate;

    private String reservationTime;

    @NotNull(message = "Party size is required")
    @Min(value = 1, message = "Party size must be at least 1 guest")
    @Max(value = 50, message = "Party size cannot exceed 50 guests")
    private Integer partySize = 2;

    @Size(max = 300, message = "Special request notes must not exceed 300 characters")
    private String specialRequest;

    private String status = "PENDING";

    private String paymentStatus = "Pending";

    public ReservationRequest() {}

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getPhone() { return contactNumber; }
    public void setPhone(String phone) { this.contactNumber = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getTableId() { return tableId; }
    public void setTableId(Integer tableId) { this.tableId = tableId; }

    public String getCheckInDate() { return checkInDate != null ? checkInDate : reservationDate; }
    public void setCheckInDate(String checkInDate) {
        this.checkInDate = checkInDate;
        if (this.reservationDate == null || this.reservationDate.isBlank()) {
            this.reservationDate = checkInDate;
        }
    }

    public String getReservationDate() { return reservationDate != null ? reservationDate : checkInDate; }
    public void setReservationDate(String reservationDate) {
        this.reservationDate = reservationDate;
        if (this.checkInDate == null || this.checkInDate.isBlank()) {
            this.checkInDate = reservationDate;
        }
    }

    public String getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(String checkOutDate) { this.checkOutDate = checkOutDate; }

    public String getReservationTime() {
        return (reservationTime != null && !reservationTime.isBlank()) ? reservationTime : "12:00:00";
    }
    public void setReservationTime(String reservationTime) { this.reservationTime = reservationTime; }

    public Integer getPartySize() { return partySize; }
    public void setPartySize(Integer partySize) { this.partySize = partySize; }

    public String getSpecialRequest() { return specialRequest; }
    public void setSpecialRequest(String specialRequest) { this.specialRequest = specialRequest; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
