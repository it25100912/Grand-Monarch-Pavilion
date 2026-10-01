package com.restaurant.app.reservation.service;

import com.restaurant.app.reservation.dto.ReservationRequest;
import com.restaurant.app.reservation.dto.ReservationResponse;
import com.restaurant.app.reservation.entity.Restaurant;
import com.restaurant.app.reservation.entity.RestaurantTable;

import java.util.List;
import java.util.Map;

public interface ReservationService {

    List<ReservationResponse> getAllReservations();

    ReservationResponse getReservationById(int id);

    List<ReservationResponse> getReservationsByCustomer(int customerId);

    ReservationResponse createReservation(ReservationRequest request);

    ReservationResponse updateReservation(int id, ReservationRequest request);

    ReservationResponse updateReservationStatus(int id, String status);

    void cancelReservation(int id);

    // Table operations
    List<RestaurantTable> getAllTables();

    RestaurantTable getTableById(int id);

    RestaurantTable createTable(RestaurantTable table);

    RestaurantTable updateTableStatus(int id, String status);

    RestaurantTable updateTable(int id, RestaurantTable table);

    void deleteTable(int id);

    // Restaurant metadata
    Restaurant getRestaurantDetails();

    // Feature-specific dashboard statistics
    Map<String, Object> getReservationDashboardStats();
}
