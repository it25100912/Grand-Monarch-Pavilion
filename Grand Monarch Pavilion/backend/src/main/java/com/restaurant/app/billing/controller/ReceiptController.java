package com.restaurant.app.billing.controller;

import com.restaurant.app.billing.entity.Receipt;
import com.restaurant.app.billing.service.BillingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/receipts")
@CrossOrigin(origins = "*")
public class ReceiptController {
    private final BillingService billingService;

    public ReceiptController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping
    public List<Receipt> getAllReceipts() {
        return billingService.getAllReceipts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReceiptById(@PathVariable int id) {
        Receipt r = billingService.getReceiptById(id);
        if (r != null) {
            return ResponseEntity.ok(r);
        }
        Map<String, Object> err = new HashMap<>();
        err.put("error", "Receipt not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
    }
}
