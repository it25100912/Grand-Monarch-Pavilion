package com.restaurant.app.payment.strategy;

import com.restaurant.app.payment.dto.PaymentRequest;
import com.restaurant.app.payment.entity.Invoice;
import com.restaurant.app.payment.entity.Payment;

/**
 * Strategy Design Pattern — PaymentStrategy Interface
 * SE2030 Behavioral Design Pattern: Strategy Pattern
 * Defines a family of algorithms for processing different payment methods interchangeably.
 */
public interface PaymentStrategy {

    void process(Payment payment, PaymentRequest request, Invoice invoice);

    String getPaymentType();
}
