package com.restaurant.app.event.repository;

import com.restaurant.app.event.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    @Query("SELECT e FROM Event e WHERE e.customer.id = :customerId")
    List<Event> findByCustomerId(@org.springframework.data.repository.query.Param("customerId") int customerId);

    @Query("SELECT e FROM Event e WHERE e.venue.id = :venueId")
    List<Event> findByVenueId(@org.springframework.data.repository.query.Param("venueId") int venueId);

    List<Event> findByStatus(String status);

    List<Event> findByEventDate(LocalDate eventDate);

    List<Event> findByEventDateGreaterThanEqual(LocalDate eventDate);

    long countByStatus(String status);

    @Query("SELECT COUNT(e) FROM Event e WHERE e.eventDate >= :today AND e.status IN ('APPROVED', 'SCHEDULED')")
    long countUpcomingEvents(LocalDate today);
}
