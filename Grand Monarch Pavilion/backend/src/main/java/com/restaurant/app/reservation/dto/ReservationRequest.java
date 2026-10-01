package com.restaurant.app.reservation.dto;

import jakarta.validation.constraints.*;

public class ReservationRequest {

    @NotNull(message = "Customer ID is required")
    private Integer customerId;

    @NotNull(message = "Table selection is required")
    private Integer tableId;

    @NotBlank(message = "Reservation date is required")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Reservation date must be in YYYY-MM-DD format")
    private String reservationDate;

    @NotBlank(message = "Reservation time is required")
    @Pattern(regexp = "\\d{2}:\\d{2}(:\\d{2})?", message = "Reservation time must be in HH:MM format (e.g. 18:30)")
    private String reservationTime;

    @NotNull(message = "Party size is required")
    @Min(value = 1, message = "Party size must be at least 1 guest")
    @Max(value = 50, message = "Party size cannot exceed 50 guests")
    private Integer partySize;

    @Size(max = 300, message = "Special request notes must not exceed 300 characters")
    private String specialRequest;

    @Pattern(regexp = "PENDING|CONFIRMED|CANCELLED|COMPLETED",
             message = "Status must be one of: PENDING, CONFIRMED, CANCELLED, COMPLETED")
    private String status = "PENDING";

    public ReservationRequest() {}

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public Integer getTableId() { return tableId; }
    public void setTableId(Integer tableId) { this.tableId = tableId; }

    public String getReservationDate() { return reservationDate; }
    public void setReservationDate(String reservationDate) { this.reservationDate = reservationDate; }

    public String getReservationTime() { return reservationTime; }
    public void setReservationTime(String reservationTime) { this.reservationTime = reservationTime; }

    public Integer getPartySize() { return partySize; }
    public void setPartySize(Integer partySize) { this.partySize = partySize; }

    public String getSpecialRequest() { return specialRequest; }
    public void setSpecialRequest(String specialRequest) { this.specialRequest = specialRequest; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
