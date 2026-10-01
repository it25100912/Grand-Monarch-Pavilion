package com.restaurant.app.venue.controller;

import com.restaurant.app.common.response.ApiResponse;
import com.restaurant.app.venue.dto.VenueRequest;
import com.restaurant.app.venue.dto.VenueResponse;
import com.restaurant.app.venue.service.VenueService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/venues")
@CrossOrigin(origins = "*")
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @GetMapping
    public ResponseEntity<List<VenueResponse>> getAllVenues() {
        return ResponseEntity.ok(venueService.getAllVenues());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VenueResponse> getVenueById(@PathVariable int id) {
        return ResponseEntity.ok(venueService.getVenueById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VenueResponse>> createVenue(@Valid @RequestBody VenueRequest request) {
        VenueResponse created = venueService.createVenue(request);
        return ResponseEntity.ok(ApiResponse.ok("Venue created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VenueResponse>> updateVenue(
            @PathVariable int id, @Valid @RequestBody VenueRequest request) {
        VenueResponse updated = venueService.updateVenue(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Venue updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVenue(@PathVariable int id) {
        venueService.deleteVenue(id);
        return ResponseEntity.ok(ApiResponse.ok("Venue deleted successfully", null));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getVenueDashboard() {
        return ResponseEntity.ok(venueService.getVenueDashboardStats());
    }
}
