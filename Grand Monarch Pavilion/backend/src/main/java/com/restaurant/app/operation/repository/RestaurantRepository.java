package com.restaurant.app.operation.repository;

import com.restaurant.app.operation.entity.RestaurantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<RestaurantEntity, Integer> {

    List<RestaurantEntity> findByStatus(String status);

    List<RestaurantEntity> findByNameContainingIgnoreCase(String name);

    long countByStatus(String status);
}
