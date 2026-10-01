package com.restaurant.app.reservation.repository;

import com.restaurant.app.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    @Query("SELECT r FROM Reservation r WHERE r.customer.id = :customerId")
    List<Reservation> findByCustomerId(@org.springframework.data.repository.query.Param("customerId") int customerId);

    @Query("SELECT r FROM Reservation r WHERE r.table.id = :tableId")
    List<Reservation> findByTableId(@org.springframework.data.repository.query.Param("tableId") int tableId);

    List<Reservation> findByStatus(String status);

    List<Reservation> findByReservationDate(LocalDate reservationDate);

    long countByStatus(String status);

    long countByStatusNot(String status);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.status <> 'CANCELLED'")
    long countActiveReservations();

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.reservationDate = :date")
    long countByReservationDate(LocalDate date);
}
