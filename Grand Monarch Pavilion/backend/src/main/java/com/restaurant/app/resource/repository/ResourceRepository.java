package com.restaurant.app.resource.repository;

import com.restaurant.app.resource.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Integer> {

    Optional<Resource> findByName(String name);

    List<Resource> findByCategory(String category);

    List<Resource> findByStatus(String status);

    long countByStatus(String status);
}
