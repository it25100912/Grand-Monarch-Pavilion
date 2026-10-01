package com.restaurant.app.operation.service;

import com.restaurant.app.operation.entity.ActivityLogEntity;
import com.restaurant.app.operation.entity.BranchEntity;
import com.restaurant.app.operation.entity.RestaurantEntity;

import java.util.List;
import java.util.Map;

public interface OperationService {

    // Overview & Metrics
    Map<String, Object> getOperationsOverview();

    // Restaurants CRUD & Status
    List<RestaurantEntity> getAllRestaurants(String status, String search);

    RestaurantEntity getRestaurantById(int id);

    RestaurantEntity createRestaurant(RestaurantEntity restaurant, String actor);

    RestaurantEntity updateRestaurant(int id, RestaurantEntity restaurant, String actor);

    RestaurantEntity toggleRestaurantStatus(int id, String actor);

    void deleteRestaurant(int id, String actor);

    // Branches CRUD & Status
    List<BranchEntity> getAllBranches(Integer restaurantId, String city, String status);

    BranchEntity getBranchById(int id);

    BranchEntity createBranch(BranchEntity branch, String actor);

    BranchEntity updateBranch(int id, BranchEntity branch, String actor);

    BranchEntity updateBranchStatus(int id, String status, String actor);

    void deleteBranch(int id, String actor);

    // Activity Log Feed
    List<ActivityLogEntity> getRecentActivities();

    void logActivity(String title, String description, String type, String actor);

    void initDefaultSeedData();
}
