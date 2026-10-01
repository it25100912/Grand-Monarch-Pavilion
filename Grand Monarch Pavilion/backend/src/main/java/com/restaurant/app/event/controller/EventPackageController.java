package com.restaurant.app.event.controller;

import com.restaurant.app.common.response.ApiResponse;
import com.restaurant.app.event.dto.EventPackageRequest;
import com.restaurant.app.event.dto.EventPackageResponse;
import com.restaurant.app.event.service.EventPackageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-packages")
@CrossOrigin(origins = "*")
public class EventPackageController {

    private final EventPackageService packageService;

    public EventPackageController(EventPackageService packageService) {
        this.packageService = packageService;
    }

    @GetMapping
    public ResponseEntity<List<EventPackageResponse>> getAllPackages(@RequestParam(required = false) Boolean activeOnly) {
        if (Boolean.TRUE.equals(activeOnly)) {
            return ResponseEntity.ok(packageService.getActivePackages());
        }
        return ResponseEntity.ok(packageService.getAllPackages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventPackageResponse> getPackageById(@PathVariable int id) {
        return ResponseEntity.ok(packageService.getPackageById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventPackageResponse>> createPackage(@Valid @RequestBody EventPackageRequest request) {
        EventPackageResponse created = packageService.createPackage(request);
        return ResponseEntity.ok(ApiResponse.ok("Event package created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventPackageResponse>> updatePackage(
            @PathVariable int id, @Valid @RequestBody EventPackageRequest request) {
        EventPackageResponse updated = packageService.updatePackage(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Event package updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePackage(@PathVariable int id) {
        packageService.deletePackage(id);
        return ResponseEntity.ok(ApiResponse.ok("Event package deleted successfully", null));
    }
}
