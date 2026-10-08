package com.restaurant.app.common.observer;

import com.restaurant.app.common.util.NotificationService;
import org.springframework.stereotype.Component;

/**
 * Concrete Observer: Dispatches real-time alerts to the administrative dashboard.
 */
@Component
public class DashboardNotificationObserver implements BookingObserver {

    @Override
    public void onStatusChanged(String reference, String eventType, String status, String recipientEmail, String details) {
        String alertTitle = eventType + " " + status + " (" + reference + ")";
        String alertMessage = details != null ? details : "Status changed to " + status;

        try {
            NotificationService.getInstance().notifyUser(1, alertTitle, alertMessage);
        } catch (Exception ignored) {
            // gracefully fallback if db notification logging fails
        }

        System.out.println("[DashboardObserver] Broadcasted live alert: " + alertTitle + " -> " + alertMessage);
    }
}
