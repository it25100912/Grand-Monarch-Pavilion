package com.restaurant.app.payment.dto;

import com.restaurant.app.common.util.DateTimeUtil;
import com.restaurant.app.payment.entity.Payment;

public class PaymentResponse {
    private Integer id;
    private Integer invoiceId;
    private String invoiceNumber;
    private String bookingRef;
    private Integer customerId;
    private String customerName;
    private String paymentMethod;
    private Double totalAmount;
    private Double amountPaid;
    private Double depositAmount;
    private Double balanceAmount;
    private String paymentDate;
    private String transactionRef;
    private String status;
    private String refundReason;
    private String slipUrl;
    private String slipFileName;
    private String rejectionReason;
    private String verifiedBy;
    private String verifiedAt;

    public PaymentResponse() {}

    public PaymentResponse(Payment p) {
        if (p != null) {
            this.id = p.getId();
            this.invoiceId = p.getInvoiceId();
            this.invoiceNumber = p.getInvoiceNumber();
            this.bookingRef = p.getBookingRef() != null ? p.getBookingRef() : (p.getInvoice() != null ? (p.getInvoice().getBookingType() + "-" + p.getInvoice().getBookingId()) : ("TXN-" + p.getId()));
            this.customerId = p.getCustomerId();
            this.customerName = p.getCustomerName();
            this.paymentMethod = p.getPaymentMethod();
            this.totalAmount = p.getTotalAmount();
            this.amountPaid = p.getAmountPaid();
            this.depositAmount = p.getDepositAmount() != null ? p.getDepositAmount() : 0.0;
            this.balanceAmount = p.getBalanceAmount() != null ? p.getBalanceAmount() : 0.0;
            this.paymentDate = DateTimeUtil.formatDateTime(p.getPaymentDate());
            this.transactionRef = p.getTransactionRef();
            this.status = p.getStatus();
            this.refundReason = p.getRefundReason();
            this.slipUrl = p.getSlipUrl();
            this.slipFileName = p.getSlipFileName();
            this.rejectionReason = p.getRejectionReason();
            this.verifiedBy = p.getVerifiedBy();
            this.verifiedAt = p.getVerifiedAt() != null ? DateTimeUtil.formatDateTime(p.getVerifiedAt()) : null;
        }
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getInvoiceId() { return invoiceId; }
    public void setInvoiceId(Integer invoiceId) { this.invoiceId = invoiceId; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public String getBookingRef() { return bookingRef; }
    public void setBookingRef(String bookingRef) { this.bookingRef = bookingRef; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }

    public Double getDepositAmount() { return depositAmount; }
    public void setDepositAmount(Double depositAmount) { this.depositAmount = depositAmount; }

    public Double getBalanceAmount() { return balanceAmount; }
    public void setBalanceAmount(Double balanceAmount) { this.balanceAmount = balanceAmount; }

    public String getPaymentDate() { return paymentDate; }
    public void setPaymentDate(String paymentDate) { this.paymentDate = paymentDate; }

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

    public String getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(String verifiedAt) { this.verifiedAt = verifiedAt; }
}
