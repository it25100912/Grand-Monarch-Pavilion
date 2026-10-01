package com.restaurant.app.event.service;

import com.restaurant.app.event.dto.EventPackageRequest;
import com.restaurant.app.event.dto.EventPackageResponse;

import java.util.List;

public interface EventPackageService {
    List<EventPackageResponse> getAllPackages();
    List<EventPackageResponse> getActivePackages();
    EventPackageResponse getPackageById(int id);
    EventPackageResponse createPackage(EventPackageRequest request);
    EventPackageResponse updatePackage(int id, EventPackageRequest request);
    void deletePackage(int id);
}
