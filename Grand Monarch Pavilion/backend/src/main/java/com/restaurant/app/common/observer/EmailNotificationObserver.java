package com.restaurant.app.common.observer;

import org.springframework.stereotype.Component;

/**
 * Concrete Observer: Dispatches email confirmation alerts to customers.
 */
@Component
public class EmailNotificationObserver implements BookingObserver {

    @Override
    public void onStatusChanged(String reference, String eventType, String status, String recipientEmail, String details) {
        String target = (recipientEmail != null && !recipientEmail.isBlank()) ? recipientEmail : "customer@grandmonarch.com";
        System.out.println("[EmailObserver] Automated notification dispatched to: " + target
                + " | Ref: " + reference
                + " | Event: " + eventType
                + " | Status: " + status
                + " | Details: " + details);
    }
}
