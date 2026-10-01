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
        if (request.getReservationDate() == null || request.getReservationDate().isBlank()) {
            throw new BadRequestException("Reservation date is required.");
        }
        LocalDate resDate = DateTimeUtil.parseDate(request.getReservationDate());
        if (resDate == null) {
            throw new BadRequestException("Invalid reservation date format.");
        }
        if (resDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!");
        }

        LocalTime resTime = DateTimeUtil.parseTime(request.getReservationTime());
        if (resDate.isEqual(LocalDate.now()) && resTime != null && resTime.isBefore(LocalTime.now().minusMinutes(5))) {
            throw new BadRequestException("Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!");
        }

        // Daily limit rule: prevent over-booking on the same day (max 30 active reservations per day)
        List<Reservation> dateReservations = reservationRepository.findByReservationDate(resDate);
        long activeOnDate = dateReservations.stream()
                .filter(r -> !"CANCELLED".equalsIgnoreCase(r.getStatus()) && !"REJECTED".equalsIgnoreCase(r.getStatus()))
                .count();
        if (activeOnDate >= 30) {
            throw new BadRequestException("Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!");
        }

        // Double-booking rule: prevent booking the same table on the same date/time slot (+/- 90 min dining window)
        boolean tableBooked = dateReservations.stream()
                .filter(r -> !"CANCELLED".equalsIgnoreCase(r.getStatus()) && !"REJECTED".equalsIgnoreCase(r.getStatus()))
                .filter(r -> r.getTable() != null && r.getTable().getId() == request.getTableId())
                .anyMatch(r -> {
                    if (r.getReservationTime() == null || resTime == null) return true;
                    long diffMinutes = Math.abs(Duration.between(r.getReservationTime(), resTime).toMinutes());
                    return diffMinutes < 90;
                });
        if (tableBooked) {
            throw new BadRequestException("Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!");
        }

        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new BadRequestException("Customer not found with id: " + request.getCustomerId()));

        RestaurantTable table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new BadRequestException("Table not found with id: " + request.getTableId()));

        Reservation r = new Reservation();
        r.setCustomer(customer);
        r.setTable(table);
        r.setReservationDate(resDate);
        r.setReservationTime(resTime);
        r.setPartySize(request.getPartySize() != null ? request.getPartySize() : 2);
        r.setSpecialRequest(request.getSpecialRequest());
        r.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");

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
