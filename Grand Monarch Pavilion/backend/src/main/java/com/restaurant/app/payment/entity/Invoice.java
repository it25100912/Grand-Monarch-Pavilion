package com.restaurant.app.payment.entity;

import com.restaurant.app.customerstaff.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 50)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(name = "booking_type", nullable = false, length = 50)
    private String bookingType; // RESERVATION, EVENT

    @Column(name = "booking_id", nullable = false)
    private Integer bookingId;

    @Column(nullable = false)
    private Double subtotal;

    @Column(name = "tax_amount", nullable = false)
    private Double taxAmount = 0.0;

    @Column(name = "discount_amount", nullable = false)
    private Double discountAmount = 0.0;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(nullable = false, length = 50)
    private String status = "UNPAID"; // UNPAID, PARTIALLY_PAID, PAID, CANCELLED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Invoice() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public String getBookingType() { return bookingType; }
    public void setBookingType(String bookingType) { this.bookingType = bookingType; }

    public Integer getBookingId() { return bookingId; }
    public void setBookingId(Integer bookingId) { this.bookingId = bookingId; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getTaxAmount() { return taxAmount; }
    public void setTaxAmount(Double taxAmount) { this.taxAmount = taxAmount; }

    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Transient
    private Integer customerId;

    @Transient
    private String customerName;

    @Transient
    public Integer getCustomerId() {
        if (this.customerId != null) return this.customerId;
        return customer != null ? customer.getId() : null;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    @Transient
    public String getCustomerName() {
        if (this.customerName != null) return this.customerName;
        return customer != null ? customer.getFullName() : null;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    @Transient
    public Double getDiscount() {
        return this.discountAmount;
    }

    public void setDiscount(Double discount) {
        if (discount != null) {
            this.discountAmount = discount;
        }
    }
}
