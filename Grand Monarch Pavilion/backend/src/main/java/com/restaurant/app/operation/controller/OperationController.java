package com.restaurant.app.operation.controller;

import com.restaurant.app.common.response.ApiResponse;
import com.restaurant.app.operation.entity.ActivityLogEntity;
import com.restaurant.app.operation.entity.BranchEntity;
import com.restaurant.app.operation.entity.RestaurantEntity;
import com.restaurant.app.operation.service.OperationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/operations")
@CrossOrigin(origins = "*")
public class OperationController {

    private final OperationService operationService;

    public OperationController(OperationService operationService) {
        this.operationService = operationService;
    }

    // --- Overview & KPI Metrics ---

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        return ResponseEntity.ok(operationService.getOperationsOverview());
    }

    // --- Restaurant Management Endpoints ---

    @GetMapping("/restaurants")
    public ResponseEntity<List<RestaurantEntity>> getRestaurants(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(operationService.getAllRestaurants(status, search));
    }

    @GetMapping("/restaurants/{id}")
    public ResponseEntity<RestaurantEntity> getRestaurantById(@PathVariable int id) {
        return ResponseEntity.ok(operationService.getRestaurantById(id));
    }

    @PostMapping("/restaurants")
    public ResponseEntity<ApiResponse<RestaurantEntity>> createRestaurant(
            @RequestBody RestaurantEntity restaurant,
            @RequestParam(defaultValue = "Operations Supervisor") String actor) {
        RestaurantEntity created = operationService.createRestaurant(restaurant, actor);
        return ResponseEntity.ok(ApiResponse.ok("Restaurant brand registered successfully", created));
    }

    @PutMapping("/restaurants/{id}")
    public ResponseEntity<ApiResponse<RestaurantEntity>> updateRestaurant(
            @PathVariable int id,
            @RequestBody RestaurantEntity restaurant,
            @RequestParam(defaultValue = "Operations Supervisor") String actor) {
        RestaurantEntity updated = operationService.updateRestaurant(id, restaurant, actor);
        return ResponseEntity.ok(ApiResponse.ok("Restaurant details updated successfully", updated));
    }

    @PatchMapping("/restaurants/{id}/status")
    public ResponseEntity<ApiResponse<RestaurantEntity>> toggleRestaurantStatus(
            @PathVariable int id,
            @RequestParam(defaultValue = "Operations Supervisor") String actor) {
        RestaurantEntity updated = operationService.toggleRestaurantStatus(id, actor);
        return ResponseEntity.ok(ApiResponse.ok("Restaurant status toggled successfully", updated));
    }

    @DeleteMapping("/restaurants/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRestaurant(
            @PathVariable int id,
            @RequestParam(defaultValue = "Operations Supervisor") String actor) {
        operationService.deleteRestaurant(id, actor);
        return ResponseEntity.ok(ApiResponse.ok("Restaurant removed successfully", null));
    }

    // --- Branch Management Endpoints ---

    @GetMapping("/branches")
    public ResponseEntity<List<BranchEntity>> getBranches(
            @RequestParam(required = false) Integer restaurantId,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(operationService.getAllBranches(restaurantId, city, status));
    }

    @GetMapping("/branches/{id}")
    public ResponseEntity<BranchEntity> getBranchById(@PathVariable int id) {
        return ResponseEntity.ok(operationService.getBranchById(id));
    }

    @PostMapping("/branches")
    public ResponseEntity<ApiResponse<BranchEntity>> createBranch(
            @RequestBody BranchEntity branch,
            @RequestParam(defaultValue = "Operations Supervisor") String actor) {
        BranchEntity created = operationService.createBranch(branch, actor);
        return ResponseEntity.ok(ApiResponse.ok("Branch operationalized successfully", created));
    }

    @PutMapping("/branches/{id}")
    public ResponseEntity<ApiResponse<BranchEntity>> updateBranch(
            @PathVariable int id,
            @RequestBody BranchEntity branch,
            @RequestParam(defaultValue = "Operations Supervisor") String actor) {
        BranchEntity updated = operationService.updateBranch(id, branch, actor);
        return ResponseEntity.ok(ApiResponse.ok("Branch details updated successfully", updated));
    }

    @PatchMapping("/branches/{id}/status")
    public ResponseEntity<ApiResponse<BranchEntity>> updateBranchStatus(
            @PathVariable int id,
            @RequestBody(required = false) Map<String, String> body,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "Operations Supervisor") String actor) {
        String targetStatus = status;
        if (body != null && body.containsKey("status") && body.get("status") != null) {
            targetStatus = body.get("status");
        }
        if (targetStatus == null || targetStatus.trim().isEmpty()) {
            targetStatus = "OPEN";
        }
        BranchEntity updated = operationService.updateBranchStatus(id, targetStatus.trim(), actor);
        return ResponseEntity.ok(ApiResponse.ok("Branch status shifted successfully", updated));
    }

    @DeleteMapping("/branches/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBranch(
            @PathVariable int id,
            @RequestParam(defaultValue = "Operations Supervisor") String actor) {
        operationService.deleteBranch(id, actor);
        return ResponseEntity.ok(ApiResponse.ok("Branch removed successfully", null));
    }

    // --- Operational Activity Feed ---

    @GetMapping("/activities")
    public ResponseEntity<List<ActivityLogEntity>> getActivities() {
        return ResponseEntity.ok(operationService.getRecentActivities());
    }
}
