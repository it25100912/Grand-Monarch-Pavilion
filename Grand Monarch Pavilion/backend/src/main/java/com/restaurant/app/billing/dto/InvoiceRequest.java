package com.restaurant.app.billing.dto;

import com.restaurant.app.billing.entity.Invoice;
import jakarta.validation.constraints.*;

public class InvoiceRequest {

    @Min(value = 1, message = "A valid customer ID is required")
    private int customerId;

    @NotBlank(message = "Booking type is required")
    @Pattern(regexp = "RESERVATION|EVENT",
             message = "Booking type must be either RESERVATION or EVENT")
    private String bookingType;

    @Min(value = 1, message = "A valid booking ID is required")
    private int bookingId;

    @DecimalMin(value = "0.0", inclusive = true, message = "Subtotal must be 0 or more (LKR)")
    private double subtotal;

    @DecimalMin(value = "0.0", inclusive = true, message = "Tax amount must be 0 or more (LKR)")
    private double taxAmount;

    @DecimalMin(value = "0.0", inclusive = true, message = "Discount amount must be 0 or more (LKR)")
    private double discountAmount;

    @DecimalMin(value = "0.0", inclusive = true, message = "Total amount must be 0 or more (LKR)")
    private double totalAmount;

    @Pattern(regexp = "UNPAID|PAID|PARTIALLY_PAID|OVERDUE|CANCELLED",
             message = "Invoice status must be one of: UNPAID, PAID, PARTIALLY_PAID, OVERDUE, CANCELLED")
    private String status;

    public InvoiceRequest() {}

    public int getCustomerId() { return customerId; }
    public void setCustomerId(int customerId) { this.customerId = customerId; }

    public String getBookingType() { return bookingType; }
    public void setBookingType(String bookingType) { this.bookingType = bookingType; }

    public int getBookingId() { return bookingId; }
    public void setBookingId(int bookingId) { this.bookingId = bookingId; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getTaxAmount() { return taxAmount; }
    public void setTaxAmount(double taxAmount) { this.taxAmount = taxAmount; }

    public double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(double discountAmount) { this.discountAmount = discountAmount; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Invoice toEntity() {
        Invoice inv = new Invoice();
        inv.setCustomerId(customerId);
        inv.setBookingType(bookingType);
        inv.setBookingId(bookingId);
        inv.setSubtotal(subtotal);
        inv.setTaxAmount(taxAmount);
        inv.setDiscountAmount(discountAmount);
        inv.setTotalAmount(totalAmount > 0 ? totalAmount : (subtotal + taxAmount - discountAmount));
        inv.setStatus(status != null ? status : "UNPAID");
        return inv;
    }
}
