package com.restaurant.app.billing.controller;

import com.restaurant.app.billing.dto.PaymentRequest;
import com.restaurant.app.billing.entity.Payment;
import com.restaurant.app.billing.service.BillingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    private final BillingService billingService;

    public PaymentController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping
    public List<Payment> getAllPayments(@RequestParam(value = "invoiceId", required = false) Integer invoiceId) {
        if (invoiceId != null) {
            return billingService.getPaymentsByInvoice(invoiceId);
        }
        return billingService.getAllPayments();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> recordPayment(@RequestBody PaymentRequest dto) {
        Payment payment = dto.toEntity();
        Map<String, Object> res = new HashMap<>();
        if (billingService.recordPayment(payment)) {
            res.put("success", true);
            res.put("message", "Payment recorded successfully!");
            res.put("payment", payment);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } else {
            res.put("success", false);
            res.put("message", "Failed to record payment.");
            return ResponseEntity.badRequest().body(res);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updatePaymentStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> body) {
        String status = body != null ? body.get("status") : null;
        Map<String, Object> res = new HashMap<>();
        if (status != null && billingService.updatePaymentStatus(id, status)) {
            res.put("success", true);
            res.put("message", "Payment status updated to " + status);
            return ResponseEntity.ok(res);
        } else {
            res.put("success", false);
            res.put("message", "Failed to update payment status.");
            return ResponseEntity.badRequest().body(res);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePayment(@PathVariable int id) {
        Map<String, Object> res = new HashMap<>();
        if (billingService.deletePayment(id)) {
            res.put("success", true);
            res.put("message", "Payment deleted successfully!");
            return ResponseEntity.ok(res);
        } else {
            res.put("success", false);
            res.put("message", "Failed to delete payment.");
            return ResponseEntity.badRequest().body(res);
        }
    }
}
