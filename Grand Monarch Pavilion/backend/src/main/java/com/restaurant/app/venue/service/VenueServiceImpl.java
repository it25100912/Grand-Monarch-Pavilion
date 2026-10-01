package com.restaurant.app.venue.service;

import com.restaurant.app.common.exception.BadRequestException;
import com.restaurant.app.common.exception.ResourceNotFoundException;
import com.restaurant.app.venue.dto.VenueRequest;
import com.restaurant.app.venue.dto.VenueResponse;
import com.restaurant.app.venue.entity.Venue;
import com.restaurant.app.venue.repository.VenueRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class VenueServiceImpl implements VenueService {

    private final VenueRepository venueRepository;

    public VenueServiceImpl(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    @PostConstruct
    public void seedVenuesIfEmpty() {
        // Sample venues seeding disabled for clean production deployment
    }

    @Override
    @Transactional(readOnly = true)
    public List<VenueResponse> getAllVenues() {
        return venueRepository.findAll().stream()
                .map(VenueResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VenueResponse getVenueById(int id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));
        return new VenueResponse(venue);
    }

    @Override
    public VenueResponse createVenue(VenueRequest request) {
        if (venueRepository.findByName(request.getName()).isPresent()) {
            throw new BadRequestException("Venue name already exists: " + request.getName());
        }

        Venue venue = new Venue();
        venue.setName(request.getName());
        venue.setLocation(request.getLocation() != null ? request.getLocation() : "Grand Monarch Pavilion");
        venue.setDescription(request.getDescription());
        venue.setImageUrl(request.getImageUrl());
        venue.setFacilities(request.getFacilities());
        venue.setCapacity(request.getCapacity() != null ? request.getCapacity() : 100);
        venue.setPricePerHour(request.getPricePerHour() != null ? request.getPricePerHour() : 5000.0);
        venue.setStatus(request.getStatus() != null ? request.getStatus() : "AVAILABLE");

        Venue saved = venueRepository.save(venue);
        return new VenueResponse(saved);
    }

    @Override
    public VenueResponse updateVenue(int id, VenueRequest request) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));

        if (request.getName() != null) venue.setName(request.getName());
        if (request.getLocation() != null) venue.setLocation(request.getLocation());
        if (request.getDescription() != null) venue.setDescription(request.getDescription());
        if (request.getImageUrl() != null) venue.setImageUrl(request.getImageUrl());
        if (request.getFacilities() != null) venue.setFacilities(request.getFacilities());
        if (request.getCapacity() != null) venue.setCapacity(request.getCapacity());
        if (request.getPricePerHour() != null) venue.setPricePerHour(request.getPricePerHour());
        if (request.getStatus() != null) venue.setStatus(request.getStatus());

        Venue updated = venueRepository.save(venue);
        return new VenueResponse(updated);
    }

    @Override
    public void deleteVenue(int id) {
        if (!venueRepository.existsById(id)) {
            throw new ResourceNotFoundException("Venue not found with id: " + id);
        }
        venueRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getVenueDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalVenues = venueRepository.count();
        long available = venueRepository.countByStatus("AVAILABLE");
        long booked = venueRepository.countByStatus("BOOKED");
        long maintenance = venueRepository.countByStatus("MAINTENANCE");

        stats.put("totalVenues", totalVenues);
        stats.put("availableVenues", available);
        stats.put("bookedVenues", booked);
        stats.put("maintenanceVenues", maintenance);
        stats.put("occupancyRate", totalVenues > 0 ? Math.round(((double) booked / totalVenues) * 100) : 0);

        return stats;
    }
}
