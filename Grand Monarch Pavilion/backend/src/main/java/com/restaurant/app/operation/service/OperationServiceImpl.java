package com.restaurant.app.operation.service;

import com.restaurant.app.common.exception.BadRequestException;
import com.restaurant.app.common.exception.ResourceNotFoundException;
import com.restaurant.app.operation.entity.ActivityLogEntity;
import com.restaurant.app.operation.entity.BranchEntity;
import com.restaurant.app.operation.entity.RestaurantEntity;
import com.restaurant.app.operation.repository.ActivityLogRepository;
import com.restaurant.app.operation.repository.BranchRepository;
import com.restaurant.app.operation.repository.RestaurantRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class OperationServiceImpl implements OperationService {

    private final RestaurantRepository restaurantRepository;
    private final BranchRepository branchRepository;
    private final ActivityLogRepository activityLogRepository;

    public OperationServiceImpl(RestaurantRepository restaurantRepository,
                                BranchRepository branchRepository,
                                ActivityLogRepository activityLogRepository) {
        this.restaurantRepository = restaurantRepository;
        this.branchRepository = branchRepository;
        this.activityLogRepository = activityLogRepository;
    }

    @PostConstruct
    public void initDefaultSeedData() {
        // Sample data seeding disabled for clean production deployment
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getOperationsOverview() {
        Map<String, Object> metrics = new HashMap<>();

        long totalRestaurants = restaurantRepository.count();
        long activeRestaurants = restaurantRepository.countByStatus("ACTIVE");
        long totalBranches = branchRepository.count();
        long openBranches = branchRepository.countByStatus("OPEN");
        long maintenanceBranches = branchRepository.countByStatus("UNDER_MAINTENANCE");
        long closedBranches = branchRepository.countByStatus("TEMPORARILY_CLOSED");
        Integer totalCapacity = branchRepository.sumTotalSeatingCapacity();

        double operationalRate = totalBranches > 0 ? ((double) openBranches / totalBranches) * 100.0 : 100.0;

        metrics.put("totalRestaurants", totalRestaurants);
        metrics.put("activeRestaurants", activeRestaurants);
        metrics.put("totalBranches", totalBranches);
        metrics.put("openBranches", openBranches);
        metrics.put("maintenanceBranches", maintenanceBranches);
        metrics.put("closedBranches", closedBranches);
        metrics.put("totalCapacity", totalCapacity != null ? totalCapacity : 0);
        metrics.put("operationalRate", Math.round(operationalRate * 10.0) / 10.0);
        metrics.put("operationalStatus", openBranches == totalBranches ? "100% OPERATIONAL" : (openBranches + "/" + totalBranches + " ACTIVE"));

        metrics.put("recentActivities", getRecentActivities());

        return metrics;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RestaurantEntity> getAllRestaurants(String status, String search) {
        List<RestaurantEntity> list;
        if (search != null && !search.isBlank()) {
            list = restaurantRepository.findByNameContainingIgnoreCase(search.trim());
        } else if (status != null && !status.equalsIgnoreCase("ALL")) {
            list = restaurantRepository.findByStatus(status.toUpperCase());
        } else {
            list = restaurantRepository.findAll();
        }

        // Attach branch counts
        for (RestaurantEntity r : list) {
            long count = branchRepository.countByRestaurantId(r.getId());
            r.setBranchCount((int) count);
        }

        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public RestaurantEntity getRestaurantById(int id) {
        RestaurantEntity r = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        r.setBranchCount((int) branchRepository.countByRestaurantId(r.getId()));
        return r;
    }

    @Override
    public RestaurantEntity createRestaurant(RestaurantEntity r, String actor) {
        if (r.getName() == null || r.getName().isBlank()) {
            throw new BadRequestException("Restaurant name is required.");
        }
        RestaurantEntity saved = restaurantRepository.save(r);
        logActivity("Restaurant Created", "New dining brand '" + saved.getName() + "' added to system.", "RESTAURANT_CREATED", actor);
        return saved;
    }

    @Override
    public RestaurantEntity updateRestaurant(int id, RestaurantEntity updated, String actor) {
        RestaurantEntity existing = getRestaurantById(id);
        existing.setName(updated.getName());
        existing.setShortDescription(updated.getShortDescription());
        existing.setDetailedBio(updated.getDetailedBio());
        existing.setCuisines(updated.getCuisines());
        existing.setLogoUrl(updated.getLogoUrl());
        existing.setCoverImageUrl(updated.getCoverImageUrl());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setWebsite(updated.getWebsite());
        existing.setOpeningHours(updated.getOpeningHours());
        existing.setClosingHours(updated.getClosingHours());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());

        RestaurantEntity saved = restaurantRepository.save(existing);
        logActivity("Restaurant Updated", "Brand profile '" + saved.getName() + "' updated.", "RESTAURANT_UPDATED", actor);
        return saved;
    }

    @Override
    public RestaurantEntity toggleRestaurantStatus(int id, String actor) {
        RestaurantEntity r = getRestaurantById(id);
        String newStatus = "ACTIVE".equalsIgnoreCase(r.getStatus()) ? "INACTIVE" : "ACTIVE";
        r.setStatus(newStatus);
        RestaurantEntity saved = restaurantRepository.save(r);
        logActivity("Restaurant Status Changed", "'" + r.getName() + "' marked as " + newStatus + ".", "STATUS_CHANGED", actor);
        return saved;
    }

    @Override
    public void deleteRestaurant(int id, String actor) {
        RestaurantEntity r = getRestaurantById(id);
        long linkedBranches = branchRepository.countByRestaurantId(id);
        if (linkedBranches > 0) {
            throw new BadRequestException("Cannot delete restaurant '" + r.getName() + "' because it has " + linkedBranches + " operational branch(es). Please reassign or delete branches first.");
        }
        restaurantRepository.delete(r);
        logActivity("Restaurant Deleted", "Brand '" + r.getName() + "' removed from network.", "RESTAURANT_DELETED", actor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchEntity> getAllBranches(Integer restaurantId, String city, String status) {
        List<BranchEntity> list = branchRepository.findAll();

        if (restaurantId != null && restaurantId > 0) {
            list = list.stream().filter(b -> b.getRestaurantId().equals(restaurantId)).toList();
        }
        if (city != null && !city.isBlank() && !city.equalsIgnoreCase("ALL")) {
            list = list.stream().filter(b -> b.getCity() != null && b.getCity().equalsIgnoreCase(city.trim())).toList();
        }
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            list = list.stream().filter(b -> b.getStatus() != null && b.getStatus().equalsIgnoreCase(status.trim())).toList();
        }

        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public BranchEntity getBranchById(int id) {
        return branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + id));
    }

    @Override
    public BranchEntity createBranch(BranchEntity branch, String actor) {
        if (branch.getRestaurantId() == null) {
            throw new BadRequestException("Parent Restaurant is required.");
        }
        RestaurantEntity parent = getRestaurantById(branch.getRestaurantId());
        branch.setRestaurantName(parent.getName());

        if (branch.getBranchCode() == null || branch.getBranchCode().isBlank()) {
            branch.setBranchCode("BR-" + System.currentTimeMillis() % 100000);
        } else {
            branch.setBranchCode(branch.getBranchCode().trim().toUpperCase());
            if (branchRepository.existsByBranchCode(branch.getBranchCode())) {
                throw new BadRequestException("Branch code '" + branch.getBranchCode() + "' is already in use.");
            }
        }

        if (branch.getSeatingCapacity() == null || branch.getSeatingCapacity() < 1) {
            branch.setSeatingCapacity(50);
        }

        BranchEntity saved = branchRepository.save(branch);
        logActivity("Branch Created", "New branch '" + saved.getBranchName() + "' (" + saved.getBranchCode() + ") created under " + parent.getName() + ".", "BRANCH_CREATED", actor);
        return saved;
    }

    @Override
    public BranchEntity updateBranch(int id, BranchEntity updated, String actor) {
        BranchEntity existing = getBranchById(id);

        if (updated.getRestaurantId() != null && !updated.getRestaurantId().equals(existing.getRestaurantId())) {
            RestaurantEntity parent = getRestaurantById(updated.getRestaurantId());
            existing.setRestaurantId(parent.getId());
            existing.setRestaurantName(parent.getName());
        }

        existing.setBranchName(updated.getBranchName());
        existing.setStreetAddress(updated.getStreetAddress());
        existing.setCity(updated.getCity());
        existing.setRegionState(updated.getRegionState());
        existing.setZipCode(updated.getZipCode());
        existing.setPhone(updated.getPhone());
        existing.setBranchManager(updated.getBranchManager());
        if (updated.getSeatingCapacity() != null) existing.setSeatingCapacity(updated.getSeatingCapacity());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());

        BranchEntity saved = branchRepository.save(existing);
        logActivity("Branch Updated", "Branch details for '" + saved.getBranchName() + "' updated.", "BRANCH_UPDATED", actor);
        return saved;
    }

    @Override
    public BranchEntity updateBranchStatus(int id, String status, String actor) {
        BranchEntity b = getBranchById(id);
        String upperStatus = status.trim().toUpperCase();
        if (!Arrays.asList("OPEN", "TEMPORARILY_CLOSED", "UNDER_MAINTENANCE").contains(upperStatus)) {
            throw new BadRequestException("Invalid branch status. Must be OPEN, TEMPORARILY_CLOSED, or UNDER_MAINTENANCE.");
        }
        b.setStatus(upperStatus);
        BranchEntity saved = branchRepository.save(b);
        logActivity("Branch Status Shift", "'" + b.getBranchName() + "' shifted to " + upperStatus + ".", "STATUS_CHANGED", actor);
        return saved;
    }

    @Override
    public void deleteBranch(int id, String actor) {
        BranchEntity b = getBranchById(id);
        branchRepository.delete(b);
        logActivity("Branch Deleted", "Branch '" + b.getBranchName() + "' (" + b.getBranchCode() + ") decommissioned.", "BRANCH_DELETED", actor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityLogEntity> getRecentActivities() {
        return activityLogRepository.findTop20ByOrderByTimestampDesc();
    }

    @Override
    public void logActivity(String title, String description, String type, String actor) {
        ActivityLogEntity log = new ActivityLogEntity(title, description, type, actor != null ? actor : "Operations Supervisor");
        activityLogRepository.save(log);
    }
}
