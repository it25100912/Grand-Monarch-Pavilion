package com.restaurant.app.event.controller;

import com.restaurant.app.common.response.ApiResponse;
import com.restaurant.app.event.dto.EventRequest;
import com.restaurant.app.event.dto.EventResponse;
import com.restaurant.app.event.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping({"", "/customer/{customerId}"})
    public ResponseEntity<List<EventResponse>> getAllEvents(
            @RequestParam(required = false) Integer customerId,
            @PathVariable(name = "customerId", required = false) Integer customerIdPath) {
        Integer target = customerId != null ? customerId : customerIdPath;
        if (target != null) {
            return ResponseEntity.ok(eventService.getEventsByCustomer(target));
        }
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable int id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(@Valid @RequestBody EventRequest request) {
        EventResponse created = eventService.createEvent(request);
        return ResponseEntity.ok(ApiResponse.ok("Event booked successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable int id, @RequestBody EventRequest request) {
        EventResponse updated = eventService.updateEvent(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Event updated successfully", updated));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<EventResponse>> updateStatus(
            @PathVariable int id, @RequestBody Map<String, Object> body) {
        String status = body.get("status") != null ? body.get("status").toString() : "APPROVED";
        EventResponse updated = eventService.updateEventStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Event status updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelEvent(@PathVariable int id) {
        eventService.cancelEvent(id);
        return ResponseEntity.ok(ApiResponse.ok("Event deleted successfully", null));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getEventDashboard() {
        return ResponseEntity.ok(eventService.getEventDashboardStats());
    }
}
