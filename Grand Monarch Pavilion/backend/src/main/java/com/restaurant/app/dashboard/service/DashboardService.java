package com.restaurant.app.dashboard.service;

import com.restaurant.app.billing.service.BillingService;
import com.restaurant.app.dashboard.dto.DashboardStats;
import com.restaurant.app.event.service.EventService;
import com.restaurant.app.reservation.service.ReservationService;
import com.restaurant.app.resource.service.ResourceService;
import com.restaurant.app.user.service.UserService;
import com.restaurant.app.venue.service.VenueService;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DashboardService {
    private final UserService userService;
    private final ReservationService reservationService;
    private final EventService eventService;
    private final BillingService billingService;
    private final VenueService venueService;
    private final ResourceService resourceService;

    public DashboardService(UserService userService, ReservationService reservationService,
                            EventService eventService, BillingService billingService,
                            VenueService venueService, ResourceService resourceService) {
        this.userService = userService;
        this.reservationService = reservationService;
        this.eventService = eventService;
        this.billingService = billingService;
        this.venueService = venueService;
        this.resourceService = resourceService;
    }

    public DashboardStats getDashboardStats() {
        var users = userService.getAllUsers();
        int totalUsers = (int) users.stream().filter(u -> "CUSTOMER".equals(u.getRole())).count();
        int totalStaff = (int) users.stream().filter(u -> !"CUSTOMER".equals(u.getRole())).count();

        var reservations = reservationService.getAllReservations();
        int diningReservations = reservations.size();

        var events = eventService.getAllEvents();
        int totalEvents = events.size();
        int upcomingEvents = (int) events.stream().filter(e -> "APPROVED".equals(e.getStatus()) || "SCHEDULED".equals(e.getStatus())).count();

        var venues = venueService.getAllVenues();
        int totalVenues = venues.size();
        int availableVenues = (int) venues.stream().filter(v -> "AVAILABLE".equalsIgnoreCase(v.getStatus())).count();

        var resources = resourceService.getAllResources();
        int totalEquipment = 0;
        int availableEquipment = 0;
        for (var r : resources) {
            totalEquipment += r.getTotalQuantity();
            availableEquipment += (r.getTotalQuantity() - r.getAllocatedQuantity());
        }

        Map<String, Object> finReport = billingService.getFinancialReports("all", null, null);
        double totalRevenue = 0.0;
        double pendingPayments = 0.0;
        if (finReport != null) {
            Object rev = finReport.get("totalRevenue");
            if (rev instanceof Number) totalRevenue = ((Number) rev).doubleValue();
            Object pend = finReport.get("pendingPayments");
            if (pend instanceof Number) pendingPayments = ((Number) pend).doubleValue();
        }

        DashboardStats dto = new DashboardStats();
        dto.setTotalUsers(totalUsers);
        dto.setTotalStaff(totalStaff);
        dto.setTotalEvents(totalEvents);
        dto.setUpcomingEvents(upcomingEvents);
        dto.setDiningReservations(diningReservations);
        dto.setAvailableVenues(availableVenues);
        dto.setTotalVenues(totalVenues);
        dto.setTotalEquipment(totalEquipment);
        dto.setAvailableEquipment(availableEquipment);
        dto.setTotalRevenue(totalRevenue);
        dto.setPendingPayments(pendingPayments);

        return dto;
    }
}
