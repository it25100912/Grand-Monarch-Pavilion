package com.restaurant.app.payment.dto;

import jakarta.validation.constraints.*;

public class PaymentRequest {

    private Integer invoiceId;

    private String bookingRef;

    private String customerName;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // CASH, BANK_TRANSFER, CARD_POS, CHEQUE, CREDIT_CARD, DEBIT_CARD, ONLINE

    @NotNull(message = "Payment amount is required")
    @DecimalMin(value = "0.0", message = "Payment amount must be at least LKR 0.00")
    private Double amountPaid;

    private Double depositAmount;

    private Double balanceAmount;

    private String transactionRef;

    private String status = "PAID";

    private String refundReason;

    private String slipUrl;

    private String slipFileName;

    private String rejectionReason;

    private String verifiedBy;

    public PaymentRequest() {}

    public Integer getInvoiceId() { return invoiceId; }
    public void setInvoiceId(Integer invoiceId) { this.invoiceId = invoiceId; }

    public String getBookingRef() { return bookingRef; }
    public void setBookingRef(String bookingRef) { this.bookingRef = bookingRef; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }

    public Double getDepositAmount() { return depositAmount; }
    public void setDepositAmount(Double depositAmount) { this.depositAmount = depositAmount; }

    public Double getBalanceAmount() { return balanceAmount; }
    public void setBalanceAmount(Double balanceAmount) { this.balanceAmount = balanceAmount; }

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
}
