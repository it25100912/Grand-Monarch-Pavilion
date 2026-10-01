package com.restaurant.app.payment.service;

import com.restaurant.app.payment.dto.PaymentRequest;
import com.restaurant.app.payment.dto.PaymentResponse;
import com.restaurant.app.payment.entity.Invoice;

import java.util.List;
import java.util.Map;

public interface PaymentService {

    List<Invoice> getAllInvoices();

    Invoice getInvoiceById(int id);

    List<Invoice> getInvoicesByCustomer(int customerId);

    Invoice createInvoice(Invoice invoice);

    Invoice updateInvoiceStatus(int id, String status);

    void deleteInvoice(int id);

    List<PaymentResponse> getAllPayments();

    PaymentResponse getPaymentById(int id);

    PaymentResponse processPayment(PaymentRequest request);

    PaymentResponse processRefund(int id, String reason);

    List<PaymentResponse> getPendingVerificationPayments();

    PaymentResponse approvePayment(int id, String verifiedBy);

    PaymentResponse rejectPayment(int id, String reason, String verifiedBy);

    Map<String, Object> getFinancialReports(String period, String startDate, String endDate);

    Map<String, Object> getPaymentDashboardStats();
}
