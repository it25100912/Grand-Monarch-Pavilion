package com.restaurant.app.payment.strategy;

import com.restaurant.app.payment.dto.PaymentRequest;
import com.restaurant.app.payment.entity.Invoice;
import com.restaurant.app.payment.entity.Payment;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Concrete Strategy: Credit Card / Debit Card Payment Processing
 */
@Component
public class CreditCardPaymentStrategy implements PaymentStrategy {

    @Override
    public void process(Payment payment, PaymentRequest request, Invoice invoice) {
        payment.setPaymentMethod("CREDIT_CARD");
        if (payment.getTransactionRef() == null || payment.getTransactionRef().isBlank()) {
            payment.setTransactionRef("CC-TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (request.getStatus() == null || request.getStatus().isBlank()) {
            payment.setStatus("PAID");
        }
    }

    @Override
    public String getPaymentType() {
        return "CREDIT_CARD";
    }
}
