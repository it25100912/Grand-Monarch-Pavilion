package com.restaurant.app.billing.controller;

import com.restaurant.app.billing.service.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {
    private final BillingService billingService;

    public ReportController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/financial")
    public ResponseEntity<Map<String, Object>> getFinancialReports(
            @RequestParam(value = "period", defaultValue = "monthly") String period,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate) {
        Map<String, Object> report = billingService.getFinancialReports(period, startDate, endDate);
        return ResponseEntity.ok(report);
    }
}
