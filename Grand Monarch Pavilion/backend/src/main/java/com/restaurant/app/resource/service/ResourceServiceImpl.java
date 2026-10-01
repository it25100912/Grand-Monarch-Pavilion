package com.restaurant.app.resource.service;

import com.restaurant.app.common.exception.BadRequestException;
import com.restaurant.app.common.exception.ResourceNotFoundException;
import com.restaurant.app.resource.dto.ResourceRequest;
import com.restaurant.app.resource.dto.ResourceResponse;
import com.restaurant.app.resource.entity.Resource;
import com.restaurant.app.resource.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceServiceImpl(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findAll().stream()
                .map(ResourceResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceResponse getResourceById(int id) {
        Resource r = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return new ResourceResponse(r);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponse> getResourcesByCategory(String category) {
        return resourceRepository.findByCategory(category).stream()
                .map(ResourceResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public ResourceResponse createResource(ResourceRequest request) {
        if (resourceRepository.findByName(request.getName()).isPresent()) {
            throw new BadRequestException("Resource already exists with name: " + request.getName());
        }

        Resource r = new Resource();
        r.setName(request.getName());
        r.setCategory(request.getCategory());
        r.setTotalQuantity(request.getTotalQuantity() != null ? request.getTotalQuantity() : 0);
        r.setAllocatedQuantity(request.getAllocatedQuantity() != null ? request.getAllocatedQuantity() : 0);
        r.setUnitPrice(request.getUnitPrice() != null ? request.getUnitPrice() : 0.0);
        r.setStatus(request.getStatus() != null ? request.getStatus() : "AVAILABLE");

        Resource saved = resourceRepository.save(r);
        return new ResourceResponse(saved);
    }

    @Override
    public ResourceResponse updateResource(int id, ResourceRequest request) {
        Resource r = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        if (request.getName() != null) r.setName(request.getName());
        if (request.getCategory() != null) r.setCategory(request.getCategory());
        if (request.getTotalQuantity() != null) r.setTotalQuantity(request.getTotalQuantity());
        if (request.getAllocatedQuantity() != null) r.setAllocatedQuantity(request.getAllocatedQuantity());
        if (request.getUnitPrice() != null) r.setUnitPrice(request.getUnitPrice());
        if (request.getStatus() != null) r.setStatus(request.getStatus());

        Resource updated = resourceRepository.save(r);
        return new ResourceResponse(updated);
    }

    @Override
    public ResourceResponse allocateQuantity(int id, int quantity) {
        Resource r = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        if (r.getAvailableQuantity() < quantity) {
            throw new BadRequestException("Insufficient available quantity. Available: " + r.getAvailableQuantity());
        }

        r.setAllocatedQuantity(r.getAllocatedQuantity() + quantity);
        if (r.getAvailableQuantity() == 0) {
            r.setStatus("OUT_OF_STOCK");
        } else if (r.getAvailableQuantity() < 5) {
            r.setStatus("LIMITED");
        }

        Resource saved = resourceRepository.save(r);
        return new ResourceResponse(saved);
    }

    @Override
    public ResourceResponse releaseQuantity(int id, int quantity) {
        Resource r = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        r.setAllocatedQuantity(Math.max(0, r.getAllocatedQuantity() - quantity));
        if (r.getAvailableQuantity() > 5) {
            r.setStatus("AVAILABLE");
        } else if (r.getAvailableQuantity() > 0) {
            r.setStatus("LIMITED");
        }

        Resource saved = resourceRepository.save(r);
        return new ResourceResponse(saved);
    }

    @Override
    public void deleteResource(int id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getResourceDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        List<Resource> all = resourceRepository.findAll();

        int totalEquipment = 0;
        int totalAllocated = 0;
        for (Resource r : all) {
            totalEquipment += (r.getTotalQuantity() != null ? r.getTotalQuantity() : 0);
            totalAllocated += (r.getAllocatedQuantity() != null ? r.getAllocatedQuantity() : 0);
        }
        int availableEquipment = Math.max(0, totalEquipment - totalAllocated);

        stats.put("totalResourceItems", all.size());
        stats.put("totalEquipment", totalEquipment);
        stats.put("allocatedEquipment", totalAllocated);
        stats.put("availableEquipment", availableEquipment);
        stats.put("availableItems", resourceRepository.countByStatus("AVAILABLE"));
        stats.put("limitedItems", resourceRepository.countByStatus("LIMITED"));
        stats.put("outOfStockItems", resourceRepository.countByStatus("OUT_OF_STOCK"));
        stats.put("allocationRate", totalEquipment > 0 ? Math.round(((double) totalAllocated / totalEquipment) * 100) : 0);

        return stats;
    }
}
