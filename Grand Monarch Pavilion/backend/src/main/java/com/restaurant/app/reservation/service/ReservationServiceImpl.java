package com.restaurant.app.reservation.service;

import com.restaurant.app.common.exception.BadRequestException;
import com.restaurant.app.common.exception.ResourceNotFoundException;
import com.restaurant.app.common.util.DateTimeUtil;
import com.restaurant.app.customerstaff.entity.User;
import com.restaurant.app.customerstaff.repository.UserRepository;
import com.restaurant.app.reservation.dto.ReservationRequest;
import com.restaurant.app.reservation.dto.ReservationResponse;
import com.restaurant.app.reservation.entity.Reservation;
import com.restaurant.app.reservation.entity.Restaurant;
import com.restaurant.app.reservation.entity.RestaurantTable;
import com.restaurant.app.reservation.repository.ReservationRepository;
import com.restaurant.app.reservation.repository.TableRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final TableRepository tableRepository;
    private final UserRepository userRepository;

    public ReservationServiceImpl(ReservationRepository reservationRepository,
                                  TableRepository tableRepository,
                                  UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void seedTablesIfEmpty() {
        if (tableRepository.count() == 0) {
            List<RestaurantTable> initialTables = List.of(
                new RestaurantTable(null, "T-01", 2, "Main Dining Indoor Hall", "AVAILABLE"),
                new RestaurantTable(null, "T-02", 2, "Main Dining Indoor Hall", "AVAILABLE"),
                new RestaurantTable(null, "T-03", 4, "Main Dining Indoor Hall", "AVAILABLE"),
                new RestaurantTable(null, "T-04", 4, "Main Dining Indoor Hall", "AVAILABLE"),
                new RestaurantTable(null, "T-05", 6, "Main Dining Indoor Hall", "AVAILABLE"),
                new RestaurantTable(null, "T-06", 8, "Main Dining Indoor Hall", "AVAILABLE"),
                new RestaurantTable(null, "G-01", 4, "Outdoor Garden Terrace", "AVAILABLE"),
                new RestaurantTable(null, "G-02", 4, "Outdoor Garden Terrace", "AVAILABLE"),
                new RestaurantTable(null, "G-03", 6, "Outdoor Garden Terrace", "AVAILABLE"),
                new RestaurantTable(null, "R-01", 2, "Rooftop Panoramic Deck", "AVAILABLE"),
                new RestaurantTable(null, "R-02", 4, "Rooftop Panoramic Deck", "AVAILABLE"),
                new RestaurantTable(null, "VIP-01", 10, "VIP Private Lounge", "AVAILABLE"),
                new RestaurantTable(null, "VIP-02", 12, "VIP Private Lounge", "AVAILABLE"),
                new RestaurantTable(null, "P-01", 4, "Poolside Deck", "AVAILABLE"),
                new RestaurantTable(null, "P-02", 6, "Poolside Deck", "AVAILABLE")
            );
            tableRepository.saveAll(initialTables);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(ReservationResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ReservationResponse getReservationById(int id) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        return new ReservationResponse(r);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationResponse> getReservationsByCustomer(int customerId) {
        return reservationRepository.findByCustomerId(customerId).stream()
                .map(ReservationResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public ReservationResponse createReservation(ReservationRequest request) {
        String inDateStr = request.getCheckInDate() != null && !request.getCheckInDate().isBlank()
                ? request.getCheckInDate() : request.getReservationDate();
        if (inDateStr == null || inDateStr.isBlank()) {
            throw new BadRequestException("Check-in date is required.");
        }
        LocalDate resDate = DateTimeUtil.parseDate(inDateStr);
        if (resDate == null) {
            throw new BadRequestException("Invalid check-in date format (YYYY-MM-DD required).");
        }
        if (resDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Check-in date cannot be in the past.");
        }

        LocalDate checkOutDate = null;
        if (request.getCheckOutDate() != null && !request.getCheckOutDate().isBlank()) {
            checkOutDate = DateTimeUtil.parseDate(request.getCheckOutDate());
            if (checkOutDate == null) {
                throw new BadRequestException("Invalid check-out date format (YYYY-MM-DD required).");
            }
            if (!checkOutDate.isAfter(resDate)) {
                throw new BadRequestException("Check-out date must be after check-in date.");
            }
        } else {
            checkOutDate = resDate.plusDays(1);
        }

        String timeStr = request.getReservationTime();
        if (timeStr == null || timeStr.isBlank()) {
            timeStr = "12:00:00";
        }
        LocalTime resTime = DateTimeUtil.parseTime(timeStr);
        if (resTime == null) {
            resTime = LocalTime.of(12, 0);
        }

        if (resDate.isEqual(LocalDate.now()) && resTime.isBefore(LocalTime.now().minusMinutes(5))) {
            throw new BadRequestException("Reservation time cannot be in the past for today's date.");
        }

        if (request.getTableId() == null) {
            throw new BadRequestException("Please select a room or table.");
        }

        RestaurantTable table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new BadRequestException("Room/Table not found with id: " + request.getTableId()));

        final LocalDate reqCheckIn = resDate;
        final LocalDate reqCheckOut = checkOutDate;
        final LocalTime reqTime = resTime;

        List<Reservation> allReservations = reservationRepository.findAll();
        boolean conflict = allReservations.stream()
                .filter(other -> other.getTable() != null && other.getTable().getId().equals(table.getId()))
                .filter(other -> !"CANCELLED".equalsIgnoreCase(other.getStatus())
                              && !"REJECTED".equalsIgnoreCase(other.getStatus())
                              && !"NO_SHOW".equalsIgnoreCase(other.getStatus()))
                .anyMatch(other -> {
                    LocalDate otherIn = other.getReservationDate();
                    LocalDate otherOut = other.getCheckOutDate() != null ? other.getCheckOutDate() : otherIn;

                    if (otherIn.isEqual(otherOut) && reqCheckIn.isEqual(reqCheckOut)) {
                        if (otherIn.isEqual(reqCheckIn)) {
                            if (other.getReservationTime() == null || reqTime == null) return true;
                            long diffMinutes = Math.abs(Duration.between(other.getReservationTime(), reqTime).toMinutes());
                            return diffMinutes < 90;
                        }
                        return false;
                    }
                    return reqCheckIn.isBefore(otherOut) && reqCheckOut.isAfter(otherIn);
                });

        if (conflict) {
            throw new BadRequestException("The selected room/table (" + table.getTableNumber() + ") is already booked for the selected period. Please choose another date or room/table.");
        }

        User customer = null;
        if (request.getCustomerId() != null && request.getCustomerId() > 0) {
            customer = userRepository.findById(request.getCustomerId()).orElse(null);
        }
        if (customer == null && request.getEmail() != null && !request.getEmail().isBlank()) {
            customer = userRepository.findByEmail(request.getEmail().trim()).orElse(null);
        }
        if (customer == null) {
            String fullName = (request.getCustomerName() != null && !request.getCustomerName().isBlank())
                    ? request.getCustomerName().trim() : "Guest Customer";
            String email = (request.getEmail() != null && !request.getEmail().isBlank())
                    ? request.getEmail().trim() : ("guest_" + System.currentTimeMillis() + "@grandmonarch.lk");
            String phone = (request.getContactNumber() != null && !request.getContactNumber().isBlank())
                    ? request.getContactNumber().trim() : "0771234567";

            customer = userRepository.findByEmail(email).orElse(null);
            if (customer == null) {
                String baseUsername = email.contains("@")
                        ? email.substring(0, email.indexOf("@")).replaceAll("[^a-zA-Z0-9_]", "")
                        : "guest";
                if (baseUsername.length() < 3) baseUsername = "guest_" + (System.currentTimeMillis() % 10000);
                String username = baseUsername;
                int suffix = 1;
                while (userRepository.findByUsername(username).isPresent()) {
                    username = baseUsername + "_" + suffix++;
                }
                customer = new User();
                customer.setUsername(username);
                customer.setFullName(fullName);
                customer.setEmail(email);
                customer.setPhone(phone);
                customer.setRole("CUSTOMER");
                customer.setStatus("ACTIVE");
                customer.setPassword("$2a$10$SSe4laUVTt6b0VfpoS4.we.Sn9euar66vtknewFSJlhCyBIvUoEMe");
                customer = userRepository.save(customer);
            }
        }

        Reservation r = new Reservation();
        r.setCustomer(customer);
        r.setTable(table);
        r.setReservationDate(resDate);
        r.setCheckOutDate(checkOutDate);
        r.setReservationTime(resTime);
        r.setPartySize(request.getPartySize() != null ? request.getPartySize() : 2);
        r.setSpecialRequest(request.getSpecialRequest());

        String paymentStatus = (request.getPaymentStatus() != null && !request.getPaymentStatus().isBlank())
                ? request.getPaymentStatus().trim() : "Pending";
        r.setPaymentStatus(paymentStatus);

        String status = request.getStatus();
        if (status == null || status.isBlank() || "PENDING".equalsIgnoreCase(status)) {
            status = "Paid".equalsIgnoreCase(paymentStatus) ? "CONFIRMED" : "PENDING";
        }
        r.setStatus(status.toUpperCase());

        Reservation saved = reservationRepository.save(r);
        return new ReservationResponse(saved);
    }

    @Override
    public ReservationResponse updateReservation(int id, ReservationRequest request) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        LocalDate resDate = r.getReservationDate();
        if (request.getReservationDate() != null && !request.getReservationDate().isBlank()) {
            LocalDate parsed = DateTimeUtil.parseDate(request.getReservationDate());
            if (parsed == null) {
                throw new BadRequestException("Invalid reservation date format.");
            }
            if (parsed.isBefore(LocalDate.now())) {
                throw new BadRequestException("Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!");
            }
            resDate = parsed;
            r.setReservationDate(resDate);
        }

        LocalTime resTime = r.getReservationTime();
        if (request.getReservationTime() != null && !request.getReservationTime().isBlank()) {
            resTime = DateTimeUtil.parseTime(request.getReservationTime());
            if (resDate.isEqual(LocalDate.now()) && resTime != null && resTime.isBefore(LocalTime.now().minusMinutes(5))) {
                throw new BadRequestException("Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!");
            }
            r.setReservationTime(resTime);
        }

        int targetTableId = (request.getTableId() != null && request.getTableId() > 0) ? request.getTableId() : (r.getTable() != null ? r.getTable().getId() : 0);
        if (targetTableId > 0 && resDate != null) {
            List<Reservation> dateReservations = reservationRepository.findByReservationDate(resDate);
            final LocalTime checkTime = resTime;
            boolean tableConflict = dateReservations.stream()
                    .filter(other -> other.getId() != id)
                    .filter(other -> !"CANCELLED".equalsIgnoreCase(other.getStatus()) && !"REJECTED".equalsIgnoreCase(other.getStatus()))
                    .filter(other -> other.getTable() != null && other.getTable().getId() == targetTableId)
                    .anyMatch(other -> {
                        if (other.getReservationTime() == null || checkTime == null) return true;
                        long diff = Math.abs(Duration.between(other.getReservationTime(), checkTime).toMinutes());
                        return diff < 90;
                    });
            if (tableConflict) {
                throw new BadRequestException("Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!");
            }
        }

        if (request.getTableId() != null && request.getTableId() > 0) {
            RestaurantTable table = tableRepository.findById(request.getTableId())
                    .orElseThrow(() -> new BadRequestException("Table not found with id: " + request.getTableId()));
            r.setTable(table);
        }

        if (request.getPartySize() != null && request.getPartySize() > 0) {
            r.setPartySize(request.getPartySize());
        }

        if (request.getSpecialRequest() != null) {
            r.setSpecialRequest(request.getSpecialRequest());
        }

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            r.setStatus(request.getStatus().toUpperCase());
        }

        if (request.getCheckOutDate() != null && !request.getCheckOutDate().isBlank()) {
            LocalDate parsedOut = DateTimeUtil.parseDate(request.getCheckOutDate());
            if (parsedOut != null && resDate != null && parsedOut.isAfter(resDate)) {
                r.setCheckOutDate(parsedOut);
            }
        }

        if (request.getPaymentStatus() != null && !request.getPaymentStatus().isBlank()) {
            r.setPaymentStatus(request.getPaymentStatus());
        }

        Reservation updated = reservationRepository.save(r);
        return new ReservationResponse(updated);
    }

    @Override
    public ReservationResponse updateReservationStatus(int id, String status) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        r.setStatus(status.toUpperCase());
        Reservation updated = reservationRepository.save(r);
        return new ReservationResponse(updated);
    }

    @Override
    public void cancelReservation(int id) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        r.setStatus("CANCELLED");
        reservationRepository.save(r);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public RestaurantTable getTableById(int id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));
    }

    @Override
    public RestaurantTable createTable(RestaurantTable table) {
        if (tableRepository.findByTableNumber(table.getTableNumber()).isPresent()) {
            throw new BadRequestException("Table number already exists: " + table.getTableNumber());
        }
        return tableRepository.save(table);
    }

    @Override
    public RestaurantTable updateTableStatus(int id, String status) {
        RestaurantTable table = getTableById(id);
        table.setStatus(status.toUpperCase());
        return tableRepository.save(table);
    }

    @Override
    public RestaurantTable updateTable(int id, RestaurantTable updated) {
        RestaurantTable existing = getTableById(id);
        if (updated.getTableNumber() != null && !updated.getTableNumber().isBlank()) {
            existing.setTableNumber(updated.getTableNumber());
        }
        if (updated.getCapacity() > 0) {
            existing.setCapacity(updated.getCapacity());
        }
        if (updated.getLocation() != null && !updated.getLocation().isBlank()) {
            existing.setLocation(updated.getLocation());
        }
        if (updated.getStatus() != null && !updated.getStatus().isBlank()) {
            existing.setStatus(updated.getStatus().toUpperCase());
        }
        return tableRepository.save(existing);
    }

    @Override
    public void deleteTable(int id) {
        RestaurantTable table = getTableById(id);
        tableRepository.delete(table);
    }

    @Override
    public Restaurant getRestaurantDetails() {
        return new Restaurant();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getReservationDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalReservations = reservationRepository.count();
        long activeReservations = reservationRepository.countActiveReservations();
        long pending = reservationRepository.countByStatus("PENDING");
        long confirmed = reservationRepository.countByStatus("CONFIRMED");
        long seated = reservationRepository.countByStatus("SEATED");
        long completed = reservationRepository.countByStatus("COMPLETED");
        long cancelled = reservationRepository.countByStatus("CANCELLED");

        long totalTables = tableRepository.count();
        long availableTables = tableRepository.countByStatus("AVAILABLE");
        long occupiedTables = tableRepository.countByStatus("OCCUPIED");
        long reservedTables = tableRepository.countByStatus("RESERVED");

        stats.put("totalReservations", activeReservations); // Active reservations count
        stats.put("allReservations", totalReservations);
        stats.put("activeReservations", activeReservations);
        stats.put("pendingReservations", pending);
        stats.put("confirmedReservations", confirmed);
        stats.put("seatedReservations", seated);
        stats.put("completedReservations", completed);
        stats.put("cancelledReservations", cancelled);
        stats.put("todayReservations", reservationRepository.countByReservationDate(LocalDate.now()));

        stats.put("totalTables", totalTables);
        stats.put("availableTables", availableTables);
        stats.put("occupiedTables", occupiedTables);
        stats.put("reservedTables", reservedTables);
        stats.put("occupancyRate", totalTables > 0 ? Math.round(((double) (occupiedTables + reservedTables) / totalTables) * 100) : 0);

        return stats;
    }
}
