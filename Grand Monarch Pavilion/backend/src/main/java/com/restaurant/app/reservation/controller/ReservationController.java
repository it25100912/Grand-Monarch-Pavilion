package com.restaurant.app.reservation.controller;

import com.restaurant.app.common.response.ApiResponse;
import com.restaurant.app.reservation.dto.ReservationRequest;
import com.restaurant.app.reservation.dto.ReservationResponse;
import com.restaurant.app.reservation.entity.Restaurant;
import com.restaurant.app.reservation.entity.RestaurantTable;
import com.restaurant.app.reservation.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // --- Reservation Endpoints (/api/reservations) ---

    @GetMapping({"/api/reservations", "/api/reservations/customer/{customerId}"})
    public ResponseEntity<List<ReservationResponse>> getAllReservations(
            @RequestParam(required = false) Integer customerId,
            @PathVariable(name = "customerId", required = false) Integer customerIdPath) {
        Integer target = customerId != null ? customerId : customerIdPath;
        if (target != null) {
            return ResponseEntity.ok(reservationService.getReservationsByCustomer(target));
        }
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/api/reservations/{id}")
    public ResponseEntity<ReservationResponse> getReservationById(@PathVariable int id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @PostMapping("/api/reservations")
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(@Valid @RequestBody ReservationRequest request) {
        ReservationResponse created = reservationService.createReservation(request);
        return ResponseEntity.ok(ApiResponse.ok("Reservation confirmed successfully", created));
    }

    @PutMapping({"/api/reservations/{id}/status", "/api/reservations/{id}"})
    public ResponseEntity<ApiResponse<ReservationResponse>> updateStatus(
            @PathVariable int id, @RequestBody Map<String, Object> body) {
        ReservationRequest req = new ReservationRequest();
        if (body.containsKey("reservationDate") && body.get("reservationDate") != null) {
            req.setReservationDate(body.get("reservationDate").toString());
        }
        if (body.containsKey("reservationTime") && body.get("reservationTime") != null) {
            req.setReservationTime(body.get("reservationTime").toString());
        }
        if (body.containsKey("partySize") && body.get("partySize") != null) {
            req.setPartySize(Integer.parseInt(body.get("partySize").toString()));
        }
        if (body.containsKey("tableId") && body.get("tableId") != null) {
            req.setTableId(Integer.parseInt(body.get("tableId").toString()));
        }
        if (body.containsKey("specialRequest") && body.get("specialRequest") != null) {
            req.setSpecialRequest(body.get("specialRequest").toString());
        }
        if (body.containsKey("status") && body.get("status") != null) {
            req.setStatus(body.get("status").toString());
        } else {
            req.setStatus("CONFIRMED");
        }

        ReservationResponse updated = reservationService.updateReservation(id, req);
        return ResponseEntity.ok(ApiResponse.ok("Reservation updated successfully", updated));
    }

    @PutMapping("/api/reservations")
    public ResponseEntity<ApiResponse<ReservationResponse>> updateReservationFromBody(@RequestBody Map<String, Object> body) {
        int id = body.get("id") != null ? Integer.parseInt(body.get("id").toString()) : -1;
        ReservationRequest req = new ReservationRequest();
        if (body.containsKey("reservationDate") && body.get("reservationDate") != null) {
            req.setReservationDate(body.get("reservationDate").toString());
        }
        if (body.containsKey("reservationTime") && body.get("reservationTime") != null) {
            req.setReservationTime(body.get("reservationTime").toString());
        }
        if (body.containsKey("partySize") && body.get("partySize") != null) {
            req.setPartySize(Integer.parseInt(body.get("partySize").toString()));
        }
        if (body.containsKey("tableId") && body.get("tableId") != null) {
            req.setTableId(Integer.parseInt(body.get("tableId").toString()));
        }
        if (body.containsKey("specialRequest") && body.get("specialRequest") != null) {
            req.setSpecialRequest(body.get("specialRequest").toString());
        }
        if (body.containsKey("status") && body.get("status") != null) {
            req.setStatus(body.get("status").toString());
        } else {
            req.setStatus("CONFIRMED");
        }

        ReservationResponse updated = reservationService.updateReservation(id, req);
        return ResponseEntity.ok(ApiResponse.ok("Reservation updated successfully", updated));
    }

    @DeleteMapping("/api/reservations/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelReservation(@PathVariable int id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.ok(ApiResponse.ok("Reservation cancelled successfully", null));
    }

    // --- Table Endpoints (/api/tables) ---

    @GetMapping("/api/tables")
    public ResponseEntity<List<RestaurantTable>> getAllTables() {
        return ResponseEntity.ok(reservationService.getAllTables());
    }

    @GetMapping("/api/tables/{id}")
    public ResponseEntity<RestaurantTable> getTableById(@PathVariable int id) {
        return ResponseEntity.ok(reservationService.getTableById(id));
    }

    @PostMapping("/api/tables")
    public ResponseEntity<ApiResponse<RestaurantTable>> createTable(@RequestBody RestaurantTable table) {
        RestaurantTable created = reservationService.createTable(table);
        return ResponseEntity.ok(ApiResponse.ok("Table created successfully", created));
    }

    @RequestMapping(value = {"/api/tables/{id}/status", "/api/tables/{id}"}, method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<ApiResponse<RestaurantTable>> updateTable(
            @PathVariable int id, @RequestBody(required = false) Map<String, Object> body,
            @RequestParam(required = false) String status) {
        String targetStatus = status;
        if (body != null && body.containsKey("status") && body.get("status") != null) {
            targetStatus = body.get("status").toString();
        }
        if (targetStatus != null && (body == null || body.size() <= 1)) {
            RestaurantTable updated = reservationService.updateTableStatus(id, targetStatus);
            return ResponseEntity.ok(ApiResponse.ok("Table status updated", updated));
        }
        RestaurantTable table = new RestaurantTable();
        if (body.containsKey("tableNumber")) table.setTableNumber(body.get("tableNumber").toString());
        if (body.containsKey("capacity")) table.setCapacity(Integer.parseInt(body.get("capacity").toString()));
        if (body.containsKey("location")) table.setLocation(body.get("location").toString());
        if (body.containsKey("status")) table.setStatus(body.get("status").toString());
        RestaurantTable updated = reservationService.updateTable(id, table);
        return ResponseEntity.ok(ApiResponse.ok("Table updated successfully", updated));
    }

    @PutMapping("/api/tables")
    public ResponseEntity<ApiResponse<RestaurantTable>> updateTableFromBody(@RequestBody Map<String, Object> body) {
        int id = body.get("id") != null ? Integer.parseInt(body.get("id").toString()) : -1;
        RestaurantTable table = new RestaurantTable();
        if (body.containsKey("tableNumber")) table.setTableNumber(body.get("tableNumber").toString());
        if (body.containsKey("capacity")) table.setCapacity(Integer.parseInt(body.get("capacity").toString()));
        if (body.containsKey("location")) table.setLocation(body.get("location").toString());
        if (body.containsKey("status")) table.setStatus(body.get("status").toString());
        RestaurantTable updated = reservationService.updateTable(id, table);
        return ResponseEntity.ok(ApiResponse.ok("Table updated successfully", updated));
    }

    @DeleteMapping("/api/tables/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTable(@PathVariable int id) {
        reservationService.deleteTable(id);
        return ResponseEntity.ok(ApiResponse.ok("Table deleted successfully", null));
    }

    // --- Restaurant Metadata ---

    @GetMapping("/api/restaurant/info")
    public ResponseEntity<Restaurant> getRestaurantInfo() {
        return ResponseEntity.ok(reservationService.getRestaurantDetails());
    }

    // --- Reservation Feature Dashboard ---

    @GetMapping({"/api/reservations/dashboard", "/api/tables/dashboard"})
    public ResponseEntity<Map<String, Object>> getReservationDashboard() {
        return ResponseEntity.ok(reservationService.getReservationDashboardStats());
    }
}
