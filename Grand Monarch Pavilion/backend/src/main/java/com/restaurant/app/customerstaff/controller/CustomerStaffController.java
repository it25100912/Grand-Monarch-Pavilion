package com.restaurant.app.customerstaff.controller;

import com.restaurant.app.common.exception.BadRequestException;
import com.restaurant.app.common.response.ApiResponse;
import com.restaurant.app.customerstaff.dto.CustomerRequest;
import com.restaurant.app.customerstaff.dto.StaffRequest;
import com.restaurant.app.customerstaff.dto.UserResponse;
import com.restaurant.app.customerstaff.entity.User;
import com.restaurant.app.customerstaff.service.CustomerStaffService;
import com.restaurant.app.event.service.EventService;
import com.restaurant.app.payment.service.PaymentService;
import com.restaurant.app.reservation.service.ReservationService;
import com.restaurant.app.resource.service.ResourceService;
import com.restaurant.app.venue.service.VenueService;
import jakarta.validation.Valid;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class CustomerStaffController {

    private final CustomerStaffService customerStaffService;
    private final ReservationService reservationService;
    private final EventService eventService;
    private final PaymentService paymentService;
    private final VenueService venueService;
    private final ResourceService resourceService;

    public CustomerStaffController(CustomerStaffService customerStaffService,
                                   @Lazy ReservationService reservationService,
                                   @Lazy EventService eventService,
                                   @Lazy PaymentService paymentService,
                                   @Lazy VenueService venueService,
                                   @Lazy ResourceService resourceService) {
        this.customerStaffService = customerStaffService;
        this.reservationService = reservationService;
        this.eventService = eventService;
        this.paymentService = paymentService;
        this.venueService = venueService;
        this.resourceService = resourceService;
    }

    // --- Customer & Staff Endpoints (/api/customerstaff and /api/users) ---

    @GetMapping({"/api/customerstaff", "/api/users"})
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(customerStaffService.getAllUsers());
    }

    @GetMapping({"/api/customerstaff/{id:\\d+}", "/api/users/{id:\\d+}"})
    public ResponseEntity<UserResponse> getUserById(@PathVariable int id) {
        return ResponseEntity.ok(customerStaffService.getUserById(id));
    }

    @GetMapping({"/api/customerstaff/customers", "/api/users/customers"})
    public ResponseEntity<List<UserResponse>> getCustomers() {
        return ResponseEntity.ok(customerStaffService.getCustomers());
    }

    @GetMapping({"/api/customerstaff/staff", "/api/users/staff"})
    public ResponseEntity<List<UserResponse>> getStaffMembers() {
        return ResponseEntity.ok(customerStaffService.getStaffMembers());
    }

    @PostMapping({"/api/customerstaff/customers", "/api/users/customers"})
    public ResponseEntity<ApiResponse<UserResponse>> createCustomer(@Valid @RequestBody CustomerRequest request) {
        UserResponse response = customerStaffService.createCustomer(request);
        return ResponseEntity.ok(ApiResponse.ok("Customer created successfully", response));
    }

    @PostMapping({"/api/customerstaff/staff", "/api/users/staff"})
    public ResponseEntity<ApiResponse<UserResponse>> createStaff(@Valid @RequestBody StaffRequest request) {
        UserResponse response = customerStaffService.createStaff(request);
        return ResponseEntity.ok(ApiResponse.ok("Staff member created successfully", response));
    }

    @PostMapping({"/api/customerstaff", "/api/users"})
    public ResponseEntity<ApiResponse<UserResponse>> createGenericUser(@RequestBody Map<String, Object> data) {
        String role = data.containsKey("role") && data.get("role") != null ? data.get("role").toString().toUpperCase() : "CUSTOMER";

        // --- Service-layer validation for phone and email in generic endpoint ---
        String phone = data.get("phone") != null ? data.get("phone").toString() : "";
        String email = data.get("email") != null ? data.get("email").toString() : "";
        String username = data.get("username") != null ? data.get("username").toString() : "";
        String password = data.get("password") != null ? data.get("password").toString() : "";
        String fullName = data.get("fullName") != null ? data.get("fullName").toString() : "";

        if (fullName.isBlank()) throw new BadRequestException("Full name is required");
        if (username.isBlank() || username.length() < 3)
            throw new BadRequestException("Username must be at least 3 characters");
        if (!username.matches("^[a-zA-Z0-9_]+$"))
            throw new BadRequestException("Username must contain only letters, numbers, or underscores (no spaces)");
        if (password.isBlank() || password.length() < 6)
            throw new BadRequestException("Password must be at least 6 characters");
        if (email.isBlank() || !email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"))
            throw new BadRequestException("Please provide a valid email address (e.g. user@example.com)");
        if (phone.isBlank() || !phone.matches("^0\\d{9}$"))
            throw new BadRequestException("Phone number must be exactly 10 digits starting with 0 (e.g. 0771234567)");

        if ("CUSTOMER".equals(role)) {
            CustomerRequest req = new CustomerRequest();
            req.setUsername(username);
            req.setPassword(password);
            req.setFullName(fullName);
            req.setEmail(email);
            req.setPhone(phone);
            if (data.get("address") != null) req.setAddress(data.get("address").toString());
            UserResponse res = customerStaffService.createCustomer(req);
            return ResponseEntity.ok(ApiResponse.ok("Customer created successfully", res));
        } else {
            StaffRequest req = new StaffRequest();
            req.setUsername(username);
            req.setPassword(password);
            req.setFullName(fullName);
            req.setEmail(email);
            req.setPhone(phone);
            req.setRole(role);
            if (data.get("jobPosition") != null) req.setJobPosition(data.get("jobPosition").toString());
            if (data.get("department") != null) req.setDepartment(data.get("department").toString());
            UserResponse res = customerStaffService.createStaff(req);
            return ResponseEntity.ok(ApiResponse.ok("Staff member created successfully", res));
        }
    }

    @RequestMapping(value = {"/api/customerstaff/profile", "/api/users/profile"}, method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@RequestBody Map<String, Object> data) {
        int userId = data.containsKey("id") ? Integer.parseInt(data.get("id").toString()) : -1;
        User user = new User();
        if (data.get("fullName") != null) {
            String fn = data.get("fullName").toString().trim();
            if (fn.length() < 2) {
                throw new BadRequestException("Full name must be at least 2 characters.");
            }
            if (fn.matches(".*\\d.*")) {
                throw new BadRequestException("Full name cannot contain numbers (e.g. 123). Please enter letters only.");
            }
            user.setFullName(fn);
        }
        if (data.get("email") != null) {
            String em = data.get("email").toString().trim().toLowerCase();
            if (!em.endsWith("@gmail.com")) {
                throw new BadRequestException("Email address must be a valid @gmail.com account.");
            }
            user.setEmail(em);
        }
        if (data.get("phone") != null) user.setPhone(data.get("phone").toString());
        if (data.get("address") != null) user.setAddress(data.get("address").toString());
        UserResponse response = customerStaffService.updateUser(userId, user);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", response));
    }

    @PutMapping({"/api/customerstaff/{id:\\d+}", "/api/users/{id:\\d+}"})
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable int id, @RequestBody User user) {
        UserResponse response = customerStaffService.updateUser(id, user);
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", response));
    }

    @PutMapping({"/api/customerstaff", "/api/users"})
    public ResponseEntity<ApiResponse<UserResponse>> updateUserFromBody(@RequestBody Map<String, Object> data) {
        int id = data.get("id") != null ? Integer.parseInt(data.get("id").toString()) : -1;
        User user = new User();
        if (data.get("fullName") != null) user.setFullName(data.get("fullName").toString());
        if (data.get("email") != null) user.setEmail(data.get("email").toString());
        if (data.get("phone") != null) user.setPhone(data.get("phone").toString());
        if (data.get("role") != null) user.setRole(data.get("role").toString());
        if (data.get("status") != null) user.setStatus(data.get("status").toString());
        if (data.get("branch") != null) user.setBranch(data.get("branch").toString());
        if (data.get("workingHours") != null) user.setWorkingHours(data.get("workingHours").toString());
        UserResponse response = customerStaffService.updateUser(id, user);
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", response));
    }

    @PutMapping({"/api/customerstaff/{id:\\d+}/status", "/api/users/{id:\\d+}/status"})
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable int id, @RequestBody Map<String, Object> body) {
        String status = body.get("status") != null ? body.get("status").toString().toUpperCase() : "ACTIVE";
        User user = new User();
        user.setStatus(status);
        UserResponse response = customerStaffService.updateUser(id, user);
        return ResponseEntity.ok(ApiResponse.ok("User status updated successfully", response));
    }

    @DeleteMapping({"/api/customerstaff/{id:\\d+}", "/api/users/{id:\\d+}", "/api/customerstaff", "/api/users"})
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable(required = false) Integer id,
            @RequestParam(required = false) Integer queryId,
            @RequestParam(value = "id", required = false) Integer paramId) {
        int targetId = id != null ? id : (queryId != null ? queryId : (paramId != null ? paramId : -1));
        customerStaffService.deleteUser(targetId);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", null));
    }

    // --- Feature-Specific Dashboard ---

    @GetMapping({"/api/customerstaff/dashboard", "/api/users/dashboard"})
    public ResponseEntity<Map<String, Object>> getCustomerStaffDashboard() {
        return ResponseEntity.ok(customerStaffService.getCustomerStaffDashboardStats());
    }

    // --- Aggregated System Dashboard (Backwards Compatible with Frontend) ---

    @GetMapping({"/api/dashboard", "/api/dashboard/stats"})
    public ResponseEntity<Map<String, Object>> getAggregatedDashboard() {
        Map<String, Object> stats = new HashMap<>();

        // Customer & Staff stats
        Map<String, Object> userStats = customerStaffService.getCustomerStaffDashboardStats();
        stats.put("totalUsers", userStats.get("totalCustomers"));
        stats.put("totalStaff", userStats.get("totalStaff"));
        stats.put("activeStaff", userStats.get("activeStaff"));

        // Reservation stats
        if (reservationService != null) {
            Map<String, Object> resStats = reservationService.getReservationDashboardStats();
            stats.put("diningReservations", resStats.get("activeReservations"));
            stats.put("totalReservations", resStats.get("activeReservations"));
            stats.put("activeReservations", resStats.get("activeReservations"));
            stats.put("allReservations", resStats.get("allReservations"));
            stats.put("confirmedReservations", resStats.get("confirmedReservations"));
            stats.put("seatedReservations", resStats.get("seatedReservations"));
            stats.put("cancelledReservations", resStats.get("cancelledReservations"));
            stats.put("availableTables", resStats.get("availableTables"));
        }

        // Event stats
        if (eventService != null) {
            Map<String, Object> evtStats = eventService.getEventDashboardStats();
            stats.put("totalEvents", evtStats.get("totalEvents"));
            stats.put("upcomingEvents", evtStats.get("upcomingEvents"));
            stats.put("approvedEvents", evtStats.get("approvedEvents"));
        }

        // Payment stats
        if (paymentService != null) {
            Map<String, Object> payStats = paymentService.getPaymentDashboardStats();
            stats.put("totalRevenue", payStats.get("totalRevenue"));
            stats.put("pendingPayments", payStats.get("pendingPayments"));
            stats.put("pendingAmount", payStats.get("pendingPayments"));
            stats.put("totalInvoiced", payStats.get("totalRevenue"));
            stats.put("totalPaymentsCount", payStats.get("totalTransactions"));
            stats.put("paidPaymentsCount", payStats.get("paidInvoices"));
        }

        // Venue stats
        if (venueService != null) {
            Map<String, Object> venStats = venueService.getVenueDashboardStats();
            stats.put("totalVenues", venStats.get("totalVenues"));
            stats.put("availableVenues", venStats.get("availableVenues"));
        }

        // Resource stats
        if (resourceService != null) {
            Map<String, Object> resStats = resourceService.getResourceDashboardStats();
            stats.put("totalEquipment", resStats.get("totalEquipment"));
            stats.put("availableEquipment", resStats.get("availableEquipment"));
        }

        return ResponseEntity.ok(stats);
    }
}
