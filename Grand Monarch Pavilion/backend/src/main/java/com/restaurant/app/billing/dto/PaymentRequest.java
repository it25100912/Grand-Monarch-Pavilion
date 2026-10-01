package com.restaurant.app.billing.dto;

import com.restaurant.app.billing.entity.Payment;
import jakarta.validation.constraints.*;

public class PaymentRequest {

    @Min(value = 1, message = "Invoice ID is required and must be a valid invoice")
    private int invoiceId;

    @NotBlank(message = "Payment method is required")
    @Pattern(regexp = "CASH|BANK_TRANSFER|CARD_POS|CHEQUE|CREDIT_CARD|DEBIT_CARD|ONLINE",
             message = "Payment method must be one of: CASH, BANK_TRANSFER, CARD_POS, CHEQUE, CREDIT_CARD, DEBIT_CARD, ONLINE")
    private String paymentMethod;

    @DecimalMin(value = "1.0", message = "Payment amount must be at least LKR 1.00")
    private double amountPaid;

    @NotBlank(message = "Payment reference / transaction reference is required")
    @Size(min = 3, max = 50, message = "Transaction reference must be between 3 and 50 characters")
    private String transactionRef;

    private String status;

    public PaymentRequest() {}

    public int getInvoiceId() { return invoiceId; }
    public void setInvoiceId(int invoiceId) { this.invoiceId = invoiceId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(double amountPaid) { this.amountPaid = amountPaid; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Payment toEntity() {
        Payment p = new Payment();
        p.setInvoiceId(invoiceId);
        p.setPaymentMethod(paymentMethod != null ? paymentMethod : "CASH");
        p.setAmountPaid(amountPaid);
        p.setTransactionRef(transactionRef);
        p.setStatus(status != null ? status : "SUCCESS");
        return p;
    }
}
