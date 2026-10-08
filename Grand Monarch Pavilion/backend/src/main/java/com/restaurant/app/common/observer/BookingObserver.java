package com.restaurant.app.common.observer;

/**
 * Observer Pattern — Observer Interface
 * SE2030 Behavioral Design Pattern: Observer Pattern
 * Objects implementing this interface get notified whenever a booking, reservation, or payment status changes.
 */
public interface BookingObserver {

    void onStatusChanged(String reference, String eventType, String status, String recipientEmail, String details);
}
