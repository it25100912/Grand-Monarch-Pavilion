package com.restaurant.app.reservation.repository;

import com.restaurant.app.reservation.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TableRepository extends JpaRepository<RestaurantTable, Integer> {

    Optional<RestaurantTable> findByTableNumber(String tableNumber);

    List<RestaurantTable> findByStatus(String status);

    long countByStatus(String status);
}
