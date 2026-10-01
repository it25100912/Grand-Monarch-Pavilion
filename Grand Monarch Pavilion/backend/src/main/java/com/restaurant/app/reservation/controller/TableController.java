package com.restaurant.app.reservation.controller;

import com.restaurant.app.reservation.entity.RestaurantTable;
import com.restaurant.app.reservation.service.ReservationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Deprecated: Table endpoints are fully handled by ReservationController.
 */
public class TableController {
    private final ReservationService reservationService;

    public TableController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public List<RestaurantTable> getAllTables() {
        return reservationService.getAllTables();
    }
}
