package com.restaurant.app.payment.repository;

import com.restaurant.app.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    @Query("SELECT p FROM Payment p WHERE p.invoice.id = :invoiceId")
    List<Payment> findByInvoiceId(@org.springframework.data.repository.query.Param("invoiceId") int invoiceId);

    List<Payment> findByStatus(String status);

    List<Payment> findByStatusOrderByIdDesc(String status);

    @Query("SELECT COALESCE(SUM(p.amountPaid), 0.0) FROM Payment p WHERE p.status = 'SUCCESS'")
    Double sumSuccessfulPayments();

    long countByStatus(String status);
}
