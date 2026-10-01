package com.restaurant.app.payment.repository;

import com.restaurant.app.payment.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    @Query("SELECT i FROM Invoice i WHERE i.customer.id = :customerId")
    List<Invoice> findByCustomerId(@org.springframework.data.repository.query.Param("customerId") int customerId);

    List<Invoice> findByStatus(String status);

    List<Invoice> findByBookingTypeAndBookingId(String bookingType, int bookingId);

    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0.0) FROM Invoice i WHERE i.status = :status")
    Double sumTotalAmountByStatus(String status);
}
