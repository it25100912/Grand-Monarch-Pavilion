package com.restaurant.app.resource.controller;

import com.restaurant.app.common.response.ApiResponse;
import com.restaurant.app.resource.dto.ResourceRequest;
import com.restaurant.app.resource.dto.ResourceResponse;
import com.restaurant.app.resource.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponse>> getAllResources(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(resourceService.getResourcesByCategory(category));
        }
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponse> getResourceById(@PathVariable int id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResourceResponse>> createResource(@Valid @RequestBody ResourceRequest request) {
        ResourceResponse created = resourceService.createResource(request);
        return ResponseEntity.ok(ApiResponse.ok("Resource created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> updateResource(
            @PathVariable int id, @Valid @RequestBody ResourceRequest request) {
        ResourceResponse updated = resourceService.updateResource(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Resource updated successfully", updated));
    }

    @PostMapping("/{id}/allocate")
    public ResponseEntity<ApiResponse<ResourceResponse>> allocateResource(
            @PathVariable int id, @RequestBody Map<String, Integer> body) {
        int qty = body.getOrDefault("quantity", 1);
        ResourceResponse allocated = resourceService.allocateQuantity(id, qty);
        return ResponseEntity.ok(ApiResponse.ok("Resource allocated successfully", allocated));
    }

    @PostMapping("/{id}/release")
    public ResponseEntity<ApiResponse<ResourceResponse>> releaseResource(
            @PathVariable int id, @RequestBody Map<String, Integer> body) {
        int qty = body.getOrDefault("quantity", 1);
        ResourceResponse released = resourceService.releaseQuantity(id, qty);
        return ResponseEntity.ok(ApiResponse.ok("Resource released successfully", released));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResource(@PathVariable int id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok(ApiResponse.ok("Resource deleted successfully", null));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getResourceDashboard() {
        return ResponseEntity.ok(resourceService.getResourceDashboardStats());
    }
}
