package com.restaurant.app.common.observer;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Observer Pattern — Subject (Observable)
 * Maintains a list of registered observers and broadcasts status change updates.
 */
@Component
public class BookingSubject {

    private final List<BookingObserver> observers = new ArrayList<>();

    public BookingSubject(List<BookingObserver> initialObservers) {
        if (initialObservers != null) {
            this.observers.addAll(initialObservers);
        }
    }

    public synchronized void attachObserver(BookingObserver observer) {
        if (observer != null && !observers.contains(observer)) {
            observers.add(observer);
        }
    }

    public synchronized void detachObserver(BookingObserver observer) {
        observers.remove(observer);
    }

    public void notifyObservers(String reference, String eventType, String status, String recipientEmail, String details) {
        for (BookingObserver observer : observers) {
            try {
                observer.onStatusChanged(reference, eventType, status, recipientEmail, details);
            } catch (Exception e) {
                System.err.println("[BookingSubject] Error notifying observer: " + e.getMessage());
            }
        }
    }
}
