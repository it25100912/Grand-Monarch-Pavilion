package com.restaurant.app.event.service;

import com.restaurant.app.common.exception.BadRequestException;
import com.restaurant.app.common.exception.ResourceNotFoundException;
import com.restaurant.app.event.dto.EventPackageRequest;
import com.restaurant.app.event.dto.EventPackageResponse;
import com.restaurant.app.event.entity.EventPackage;
import com.restaurant.app.event.repository.EventPackageRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventPackageServiceImpl implements EventPackageService {

    private final EventPackageRepository packageRepository;

    public EventPackageServiceImpl(EventPackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    @PostConstruct
    public void seedPackagesIfEmpty() {
        // Sample event packages seeding disabled for clean production deployment
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventPackageResponse> getAllPackages() {
        return packageRepository.findAll().stream()
                .map(EventPackageResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventPackageResponse> getActivePackages() {
        return packageRepository.findByStatusOrderByPriceAsc("ACTIVE").stream()
                .map(EventPackageResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EventPackageResponse getPackageById(int id) {
        EventPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event Package not found with id: " + id));
        return new EventPackageResponse(pkg);
    }

    @Override
    public EventPackageResponse createPackage(EventPackageRequest request) {
        if (packageRepository.findByName(request.getName()).isPresent()) {
            throw new BadRequestException("Package with name '" + request.getName() + "' already exists");
        }

        EventPackage pkg = new EventPackage();
        pkg.setName(request.getName());
        pkg.setTier(request.getTier() != null ? request.getTier().toUpperCase() : "GOLD");
        pkg.setEventType(request.getEventType() != null ? request.getEventType().toUpperCase() : "ALL");
        pkg.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);
        pkg.setMaxGuests(request.getMaxGuests() != null ? request.getMaxGuests() : 200);
        pkg.setServices(request.getServices());
        pkg.setDescription(request.getDescription());
        pkg.setStatus(request.getStatus() != null ? request.getStatus().toUpperCase() : "ACTIVE");

        EventPackage saved = packageRepository.save(pkg);
        return new EventPackageResponse(saved);
    }

    @Override
    public EventPackageResponse updatePackage(int id, EventPackageRequest request) {
        EventPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event Package not found with id: " + id));

        if (request.getName() != null) pkg.setName(request.getName());
        if (request.getTier() != null) pkg.setTier(request.getTier().toUpperCase());
        if (request.getEventType() != null) pkg.setEventType(request.getEventType().toUpperCase());
        if (request.getPrice() != null) pkg.setPrice(request.getPrice());
        if (request.getMaxGuests() != null) pkg.setMaxGuests(request.getMaxGuests());
        if (request.getServices() != null) pkg.setServices(request.getServices());
        if (request.getDescription() != null) pkg.setDescription(request.getDescription());
        if (request.getStatus() != null) pkg.setStatus(request.getStatus().toUpperCase());

        EventPackage updated = packageRepository.save(pkg);
        return new EventPackageResponse(updated);
    }

    @Override
    public void deletePackage(int id) {
        if (!packageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event Package not found with id: " + id);
        }
        packageRepository.deleteById(id);
    }
}
