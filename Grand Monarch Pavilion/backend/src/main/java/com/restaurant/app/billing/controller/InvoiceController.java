package com.restaurant.app.billing.controller;

import com.restaurant.app.billing.dto.InvoiceRequest;
import com.restaurant.app.billing.entity.Invoice;
import com.restaurant.app.billing.service.BillingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {
    private final BillingService billingService;

    public InvoiceController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping
    public List<Invoice> getAllInvoices(@RequestParam(value = "customerId", required = false) Integer customerId) {
        if (customerId != null) {
            return billingService.getInvoicesByCustomer(customerId);
        }
        return billingService.getAllInvoices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInvoiceById(@PathVariable int id) {
        Invoice inv = billingService.getInvoiceById(id);
        if (inv != null) {
            return ResponseEntity.ok(inv);
        }
        Map<String, Object> err = new HashMap<>();
        err.put("error", "Invoice not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createInvoice(@RequestBody InvoiceRequest dto) {
        Invoice invoice = dto.toEntity();
        Map<String, Object> res = new HashMap<>();
        if (billingService.createInvoice(invoice)) {
            res.put("success", true);
            res.put("message", "Invoice created successfully!");
            res.put("invoice", invoice);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } else {
            res.put("success", false);
            res.put("message", "Failed to create invoice.");
            return ResponseEntity.badRequest().body(res);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateInvoiceStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> body) {
        String status = body != null ? body.get("status") : null;
        Map<String, Object> res = new HashMap<>();
        if (status != null && billingService.updateInvoiceStatus(id, status)) {
            res.put("success", true);
            res.put("message", "Invoice status updated to " + status);
            return ResponseEntity.ok(res);
        } else {
            res.put("success", false);
            res.put("message", "Failed to update invoice status.");
            return ResponseEntity.badRequest().body(res);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteInvoice(@PathVariable int id) {
        Map<String, Object> res = new HashMap<>();
        if (billingService.deleteInvoice(id)) {
            res.put("success", true);
            res.put("message", "Invoice deleted successfully!");
            return ResponseEntity.ok(res);
        } else {
            res.put("success", false);
            res.put("message", "Failed to delete invoice.");
            return ResponseEntity.badRequest().body(res);
        }
    }
}
