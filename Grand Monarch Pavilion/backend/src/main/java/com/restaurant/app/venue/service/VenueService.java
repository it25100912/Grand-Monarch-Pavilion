package com.restaurant.app.venue.service;

import com.restaurant.app.venue.dto.VenueRequest;
import com.restaurant.app.venue.dto.VenueResponse;
import com.restaurant.app.venue.entity.Venue;

import java.util.List;
import java.util.Map;

public interface VenueService {

    List<VenueResponse> getAllVenues();

    VenueResponse getVenueById(int id);

    VenueResponse createVenue(VenueRequest request);

    VenueResponse updateVenue(int id, VenueRequest request);

    void deleteVenue(int id);

    Map<String, Object> getVenueDashboardStats();
}
