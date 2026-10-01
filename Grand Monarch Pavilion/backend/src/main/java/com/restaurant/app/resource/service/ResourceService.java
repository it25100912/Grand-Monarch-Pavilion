package com.restaurant.app.resource.service;

import com.restaurant.app.resource.dto.ResourceRequest;
import com.restaurant.app.resource.dto.ResourceResponse;

import java.util.List;
import java.util.Map;

public interface ResourceService {

    List<ResourceResponse> getAllResources();

    ResourceResponse getResourceById(int id);

    List<ResourceResponse> getResourcesByCategory(String category);

    ResourceResponse createResource(ResourceRequest request);

    ResourceResponse updateResource(int id, ResourceRequest request);

    ResourceResponse allocateQuantity(int id, int quantity);

    ResourceResponse releaseQuantity(int id, int quantity);

    void deleteResource(int id);

    Map<String, Object> getResourceDashboardStats();
}
