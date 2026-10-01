package com.restaurant.app.reservation.entity;

import com.restaurant.app.customerstaff.entity.User;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "table_id", nullable = false)
    private RestaurantTable table;

    @Column(name = "reservation_date", nullable = false)
    private LocalDate reservationDate;

    @Column(name = "reservation_time", nullable = false)
    private LocalTime reservationTime;

    @Column(name = "party_size", nullable = false)
    private Integer partySize;

    @Column(name = "special_request", columnDefinition = "TEXT")
    private String specialRequest;

    @Column(nullable = false, length = 50)
    private String status = "PENDING"; // PENDING, CONFIRMED, SEATED, COMPLETED, CANCELLED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Reservation() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public RestaurantTable getTable() { return table; }
    public void setTable(RestaurantTable table) { this.table = table; }

    public LocalDate getReservationDate() { return reservationDate; }
    public void setReservationDate(LocalDate reservationDate) { this.reservationDate = reservationDate; }

    public LocalTime getReservationTime() { return reservationTime; }
    public void setReservationTime(LocalTime reservationTime) { this.reservationTime = reservationTime; }

    public Integer getPartySize() { return partySize; }
    public void setPartySize(Integer partySize) { this.partySize = partySize; }

    public String getSpecialRequest() { return specialRequest; }
    public void setSpecialRequest(String specialRequest) { this.specialRequest = specialRequest; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Helper compatibility accessors
    @Transient
    public Integer getCustomerId() {
        return customer != null ? customer.getId() : null;
    }

    @Transient
    public String getCustomerName() {
        return customer != null ? customer.getFullName() : null;
    }

    @Transient
    public Integer getTableId() {
        return table != null ? table.getId() : null;
    }

    @Transient
    public String getTableNumber() {
        return table != null ? table.getTableNumber() : null;
    }
}
