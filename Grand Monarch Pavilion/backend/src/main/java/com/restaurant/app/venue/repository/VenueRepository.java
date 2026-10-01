package com.restaurant.app.venue.repository;

import com.restaurant.app.venue.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Integer> {

    Optional<Venue> findByName(String name);

    List<Venue> findByStatus(String status);

    long countByStatus(String status);
}
