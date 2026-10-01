package com.restaurant.app.event.repository;

import com.restaurant.app.event.entity.EventPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventPackageRepository extends JpaRepository<EventPackage, Integer> {
    List<EventPackage> findByStatusOrderByPriceAsc(String status);
    List<EventPackage> findByEventTypeAndStatus(String eventType, String status);
    Optional<EventPackage> findByName(String name);
}
