package com.restaurant.app.reservation.dto;

import com.restaurant.app.common.util.DateTimeUtil;
import com.restaurant.app.reservation.entity.Reservation;

public class ReservationResponse {
    private Integer id;
    private Integer customerId;
    private String customerName;
    private Integer tableId;
    private String tableNumber;
    private String reservationDate;
    private String reservationTime;
    private Integer partySize;
    private String specialRequest;
    private String status;
    private String createdAt;

    public ReservationResponse() {}

    public ReservationResponse(Reservation r) {
        if (r != null) {
            this.id = r.getId();
            this.customerId = r.getCustomerId();
            this.customerName = r.getCustomerName();
            this.tableId = r.getTableId();
            this.tableNumber = r.getTableNumber();
            this.reservationDate = DateTimeUtil.formatDate(r.getReservationDate());
            this.reservationTime = DateTimeUtil.formatTime(r.getReservationTime());
            this.partySize = r.getPartySize();
            this.specialRequest = r.getSpecialRequest();
            this.status = r.getStatus();
            this.createdAt = DateTimeUtil.formatDateTime(r.getCreatedAt());
        }
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Integer getTableId() { return tableId; }
    public void setTableId(Integer tableId) { this.tableId = tableId; }

    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }

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

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
