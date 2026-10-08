package com.restaurant.app.payment.strategy;

import com.restaurant.app.payment.dto.PaymentRequest;
import com.restaurant.app.payment.entity.Invoice;
import com.restaurant.app.payment.entity.Payment;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Concrete Strategy: Bank Transfer with receipt slip upload & verification
 */
@Component
public class BankTransferPaymentStrategy implements PaymentStrategy {

    @Override
    public void process(Payment payment, PaymentRequest request, Invoice invoice) {
        payment.setPaymentMethod("BANK_TRANSFER");
        if (payment.getTransactionRef() == null || payment.getTransactionRef().isBlank()) {
            payment.setTransactionRef("BANK-REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        payment.setSlipUrl(request.getSlipUrl());
        payment.setSlipFileName(request.getSlipFileName());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            payment.setStatus(request.getStatus().toUpperCase());
        } else if (payment.getSlipUrl() != null && !payment.getSlipUrl().isBlank()) {
            payment.setStatus("PENDING_VERIFICATION");
        }
    }

    @Override
    public String getPaymentType() {
        return "BANK_TRANSFER";
    }
}
