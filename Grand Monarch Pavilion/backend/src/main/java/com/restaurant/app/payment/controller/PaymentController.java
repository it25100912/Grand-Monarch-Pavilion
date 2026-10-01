package com.restaurant.app.payment.controller;

import com.restaurant.app.common.response.ApiResponse;
import com.restaurant.app.payment.dto.PaymentRequest;
import com.restaurant.app.payment.dto.PaymentResponse;
import com.restaurant.app.payment.entity.Invoice;
import com.restaurant.app.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // --- Invoices Endpoints ---

    @GetMapping({"/api/invoices", "/api/billing/invoices"})
    public ResponseEntity<List<Invoice>> getAllInvoices(@RequestParam(required = false) Integer customerId) {
        if (customerId != null) {
            return ResponseEntity.ok(paymentService.getInvoicesByCustomer(customerId));
        }
        return ResponseEntity.ok(paymentService.getAllInvoices());
    }

    @GetMapping({"/api/invoices/{id}", "/api/billing/invoices/{id}"})
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable int id) {
        return ResponseEntity.ok(paymentService.getInvoiceById(id));
    }

    @PostMapping({"/api/invoices", "/api/billing/invoices"})
    public ResponseEntity<ApiResponse<Invoice>> createInvoice(@RequestBody Invoice invoice) {
        Invoice created = paymentService.createInvoice(invoice);
        return ResponseEntity.ok(ApiResponse.ok("Invoice created successfully", created));
    }

    @PutMapping({"/api/invoices/{id}/status", "/api/billing/invoices/{id}/status", "/api/invoices/{id}", "/api/billing/invoices/{id}"})
    public ResponseEntity<ApiResponse<Invoice>> updateInvoiceStatus(
            @PathVariable int id, @RequestBody Map<String, Object> body) {
        String status = body.get("status") != null ? body.get("status").toString() : "PAID";
        Invoice updated = paymentService.updateInvoiceStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Invoice status updated", updated));
    }

    @PutMapping({"/api/invoices", "/api/billing/invoices"})
    public ResponseEntity<ApiResponse<Invoice>> updateInvoiceFromBody(@RequestBody Map<String, Object> body) {
        int id = body.get("id") != null ? Integer.parseInt(body.get("id").toString()) : -1;
        String status = body.get("status") != null ? body.get("status").toString() : "PAID";
        Invoice updated = paymentService.updateInvoiceStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Invoice status updated", updated));
    }

    @DeleteMapping({"/api/invoices/{id}", "/api/billing/invoices/{id}"})
    public ResponseEntity<ApiResponse<Void>> deleteInvoice(@PathVariable int id) {
        paymentService.deleteInvoice(id);
        return ResponseEntity.ok(ApiResponse.ok("Invoice deleted successfully", null));
    }

    // --- Payments Endpoints ---

    @GetMapping({"/api/payments", "/api/billing/payments"})
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping({"/api/payments/{id}", "/api/billing/payments/{id}"})
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable int id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @PostMapping({"/api/payments", "/api/billing/payments"})
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.processPayment(request);
        return ResponseEntity.ok(ApiResponse.ok("Payment processed successfully", response));
    }

    @PostMapping({"/api/payments/{id}/refund", "/api/billing/payments/{id}/refund"})
    public ResponseEntity<ApiResponse<PaymentResponse>> processRefund(
            @PathVariable int id, @RequestBody(required = false) Map<String, Object> body) {
        String reason = body != null && body.get("reason") != null ? body.get("reason").toString() : "Customer refund request";
        PaymentResponse refunded = paymentService.processRefund(id, reason);
        return ResponseEntity.ok(ApiResponse.ok("Refund processed successfully", refunded));
    }

    @GetMapping({"/api/payments/pending-verification", "/api/billing/payments/pending-verification"})
    public ResponseEntity<List<PaymentResponse>> getPendingVerificationPayments() {
        return ResponseEntity.ok(paymentService.getPendingVerificationPayments());
    }

    @PostMapping({"/api/payments/{id}/approve", "/api/billing/payments/{id}/approve"})
    public ResponseEntity<ApiResponse<PaymentResponse>> approvePayment(
            @PathVariable int id, @RequestBody(required = false) Map<String, Object> body) {
        String verifiedBy = body != null && body.get("verifiedBy") != null ? body.get("verifiedBy").toString() : "Finance Officer";
        PaymentResponse approved = paymentService.approvePayment(id, verifiedBy);
        return ResponseEntity.ok(ApiResponse.ok("Payment approved & booking confirmed", approved));
    }

    @PostMapping({"/api/payments/{id}/reject", "/api/billing/payments/{id}/reject"})
    public ResponseEntity<ApiResponse<PaymentResponse>> rejectPayment(
            @PathVariable int id, @RequestBody(required = false) Map<String, Object> body) {
        String reason = body != null && body.get("reason") != null ? body.get("reason").toString() : "Bank deposit slip could not be verified.";
        String verifiedBy = body != null && body.get("verifiedBy") != null ? body.get("verifiedBy").toString() : "Finance Officer";
        PaymentResponse rejected = paymentService.rejectPayment(id, reason, verifiedBy);
        return ResponseEntity.ok(ApiResponse.ok("Payment rejected with notification to client", rejected));
    }

    // --- Reports Endpoints ---

    @GetMapping({"/api/payments/reports", "/api/billing/reports"})
    public ResponseEntity<Map<String, Object>> getFinancialReports(
            @RequestParam(defaultValue = "all") String period,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(paymentService.getFinancialReports(period, startDate, endDate));
    }

    // --- Payment Feature Dashboard ---

    @GetMapping({"/api/payments/dashboard", "/api/billing/dashboard"})
    public ResponseEntity<Map<String, Object>> getPaymentDashboard() {
        return ResponseEntity.ok(paymentService.getPaymentDashboardStats());
    }
}
