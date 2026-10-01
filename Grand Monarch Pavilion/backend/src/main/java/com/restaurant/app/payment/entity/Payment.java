package com.restaurant.app.payment.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "invoice_id", nullable = true)
    private Invoice invoice;

    @Column(name = "booking_ref", length = 50)
    private String bookingRef; // e.g. "EVT-2026-0009" or "RES-104"

    @Column(name = "customer_name", length = 100)
    private String customerName;

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod; // CASH, CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER, ONLINE

    @Column(name = "amount_paid", nullable = false)
    private Double amountPaid;

    @Column(name = "deposit_amount")
    private Double depositAmount = 0.0;

    @Column(name = "balance_amount")
    private Double balanceAmount = 0.0;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate = LocalDateTime.now();

    @Column(name = "transaction_ref", length = 100)
    private String transactionRef;

    @Column(nullable = false, length = 50)
    private String status = "PAID"; // PAID, PARTIALLY_PAID, PENDING, PENDING_VERIFICATION, REJECTED, FAILED, REFUNDED

    @Column(name = "refund_reason", columnDefinition = "TEXT")
    private String refundReason;

    @Column(name = "slip_url", columnDefinition = "LONGTEXT")
    private String slipUrl;

    @Column(name = "slip_file_name", length = 255)
    private String slipFileName;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "verified_by", length = 100)
    private String verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    public Payment() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }

    public String getBookingRef() { return bookingRef; }
    public void setBookingRef(String bookingRef) { this.bookingRef = bookingRef; }

    public String getCustomerName() {
        if (customerName != null && !customerName.isBlank()) return customerName;
        return invoice != null ? invoice.getCustomerName() : null;
    }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }

    public Double getDepositAmount() { return depositAmount; }
    public void setDepositAmount(Double depositAmount) { this.depositAmount = depositAmount; }

    public Double getBalanceAmount() { return balanceAmount; }
    public void setBalanceAmount(Double balanceAmount) { this.balanceAmount = balanceAmount; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRefundReason() { return refundReason; }
    public void setRefundReason(String refundReason) { this.refundReason = refundReason; }

    public String getSlipUrl() { return slipUrl; }
    public void setSlipUrl(String slipUrl) { this.slipUrl = slipUrl; }

    public String getSlipFileName() { return slipFileName; }
    public void setSlipFileName(String slipFileName) { this.slipFileName = slipFileName; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    @Transient
    public Integer getInvoiceId() {
        return invoice != null ? invoice.getId() : null;
    }

    @Transient
    public String getInvoiceNumber() {
        return invoice != null ? invoice.getInvoiceNumber() : null;
    }

    @Transient
    public Integer getCustomerId() {
        return invoice != null ? invoice.getCustomerId() : null;
    }

    @Transient
    public Double getTotalAmount() {
        if (invoice != null && invoice.getTotalAmount() != null) return invoice.getTotalAmount();
        return (amountPaid != null ? amountPaid : 0.0) + (balanceAmount != null ? balanceAmount : 0.0);
    }
}
