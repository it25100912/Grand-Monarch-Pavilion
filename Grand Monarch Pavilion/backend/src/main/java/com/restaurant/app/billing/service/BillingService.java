package com.restaurant.app.billing.service;

import com.restaurant.app.billing.entity.Invoice;
import com.restaurant.app.billing.entity.Payment;
import com.restaurant.app.billing.entity.Receipt;
import com.restaurant.app.billing.repository.BillingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Service for Invoicing, Payment Tracking & Financial Reporting.
 */
@Service
public class BillingService {
    private final BillingRepository billingRepository;

    public BillingService(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    public List<Invoice> getAllInvoices() {
        return billingRepository.getAllInvoices();
    }

    public List<Invoice> getInvoicesByCustomer(int customerId) {
        return billingRepository.getInvoicesByCustomer(customerId);
    }

    public Invoice getInvoiceById(int id) {
        return billingRepository.getInvoiceById(id);
    }

    public boolean createInvoice(Invoice invoice) {
        if (invoice == null) return false;
        return billingRepository.createInvoice(invoice);
    }

    public boolean updateInvoiceStatus(int invoiceId, String status) {
        return billingRepository.updateInvoiceStatus(invoiceId, status);
    }

    public boolean deleteInvoice(int id) {
        return billingRepository.deleteInvoice(id);
    }

    public List<Payment> getAllPayments() {
        return billingRepository.getAllPayments();
    }

    public List<Payment> getPaymentsByInvoice(int invoiceId) {
        return billingRepository.getPaymentsByInvoice(invoiceId);
    }

    public boolean recordPayment(Payment payment) {
        if (payment == null || payment.getInvoiceId() <= 0) return false;
        return billingRepository.recordPayment(payment);
    }

    public boolean updatePaymentStatus(int paymentId, String status) {
        if (paymentId <= 0 || status == null) return false;
        return billingRepository.updatePaymentStatus(paymentId, status);
    }

    public boolean deletePayment(int id) {
        if (id <= 0) return false;
        return billingRepository.deletePayment(id);
    }

    public List<Receipt> getAllReceipts() {
        return billingRepository.getAllReceipts();
    }

    public Receipt getReceiptById(int id) {
        return billingRepository.getReceiptById(id);
    }

    public Map<String, Object> getFinancialReports(String period, String startDate, String endDate) {
        return billingRepository.getFinancialReports(period, startDate, endDate);
    }

    public double calculateTotalRevenue() {
        Map<String, Object> rep = billingRepository.getFinancialReports("all", null, null);
        Object rev = rep.get("totalRevenue");
        return rev instanceof Number ? ((Number) rev).doubleValue() : 0.0;
    }
}
