package com.restaurant.app.event.service;

import com.restaurant.app.common.exception.BadRequestException;
import com.restaurant.app.common.exception.ResourceNotFoundException;
import com.restaurant.app.common.util.DateTimeUtil;
import com.restaurant.app.customerstaff.entity.User;
import com.restaurant.app.customerstaff.repository.UserRepository;
import com.restaurant.app.event.dto.EventRequest;
import com.restaurant.app.event.dto.EventResponse;
import com.restaurant.app.event.entity.Event;
import com.restaurant.app.event.entity.EventPackage;
import com.restaurant.app.event.repository.EventPackageRepository;
import com.restaurant.app.event.repository.EventRepository;
import com.restaurant.app.venue.entity.Venue;
import com.restaurant.app.venue.repository.VenueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final EventPackageRepository packageRepository;

    public EventServiceImpl(EventRepository eventRepository,
                            UserRepository userRepository,
                            VenueRepository venueRepository,
                            EventPackageRepository packageRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.venueRepository = venueRepository;
        this.packageRepository = packageRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(EventResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EventResponse getEventById(int id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return new EventResponse(event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByCustomer(int customerId) {
        return eventRepository.findByCustomerId(customerId).stream()
                .map(EventResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public EventResponse createEvent(EventRequest request) {
        if (request.getEventDate() == null || request.getEventDate().isBlank()) {
            throw new BadRequestException("Event date is required.");
        }
        LocalDate evtDate = DateTimeUtil.parseDate(request.getEventDate());
        if (evtDate == null) {
            throw new BadRequestException("Invalid event date format.");
        }
        if (evtDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!");
        }

        LocalTime startTime = DateTimeUtil.parseTime(request.getStartTime());
        LocalTime endTime = DateTimeUtil.parseTime(request.getEndTime());
        if (evtDate.isEqual(LocalDate.now()) && startTime != null && startTime.isBefore(LocalTime.now().minusMinutes(5))) {
            throw new BadRequestException("Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!");
        }

        // Daily limit rule: prevent over-booking on the same day (max 10 active events per day)
        List<Event> dateEvents = eventRepository.findByEventDate(evtDate);
        long activeEventsOnDate = dateEvents.stream()
                .filter(e -> !"CANCELLED".equalsIgnoreCase(e.getStatus()) && !"REJECTED".equalsIgnoreCase(e.getStatus()))
                .count();
        if (activeEventsOnDate >= 10) {
            throw new BadRequestException("Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!");
        }

        // Double-booking rule: prevent booking the same venue on overlapping time slot
        if (request.getVenueId() != null) {
            boolean venueBooked = dateEvents.stream()
                    .filter(e -> !"CANCELLED".equalsIgnoreCase(e.getStatus()) && !"REJECTED".equalsIgnoreCase(e.getStatus()))
                    .filter(e -> e.getVenue() != null && e.getVenue().getId() == request.getVenueId())
                    .anyMatch(e -> {
                        if (e.getStartTime() == null || e.getEndTime() == null || startTime == null || endTime == null) {
                            return true;
                        }
                        return startTime.isBefore(e.getEndTime()) && e.getStartTime().isBefore(endTime);
                    });
            if (venueBooked) {
                throw new BadRequestException("Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!");
            }
        }

        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new BadRequestException("Customer not found with id: " + request.getCustomerId()));

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new BadRequestException("Venue not found with id: " + request.getVenueId()));

        Event event = new Event();
        event.setCustomer(customer);
        event.setVenue(venue);
        event.setEventTitle(request.getEventTitle());
        event.setEventType(request.getEventType() != null ? request.getEventType() : "OTHER");
        event.setEventDate(evtDate);
        event.setStartTime(startTime);
        event.setEndTime(endTime);
        event.setExpectedGuests(request.getExpectedGuests() != null ? request.getExpectedGuests() : 50);
        event.setSpecialRequirements(request.getSpecialRequirements());
        event.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");

        event.setClientPhone(request.getClientPhone() != null ? request.getClientPhone() : customer.getPhone());
        event.setClientEmail(request.getClientEmail() != null ? request.getClientEmail() : customer.getEmail());

        // Link package if provided
        if (request.getPackageId() != null) {
            Optional<EventPackage> pkgOpt = packageRepository.findById(request.getPackageId());
            if (pkgOpt.isPresent()) {
                EventPackage pkg = pkgOpt.get();
                event.setPackageId(pkg.getId());
                event.setPackageName(pkg.getName());
                if (request.getTotalPrice() == null || request.getTotalPrice() <= 0) {
                    event.setTotalPrice(pkg.getPrice());
                } else {
                    event.setTotalPrice(request.getTotalPrice());
                }
            } else {
                event.setPackageId(request.getPackageId());
                event.setPackageName(request.getPackageName());
                event.setTotalPrice(request.getTotalPrice() != null ? request.getTotalPrice() : 0.0);
            }
        } else {
            event.setPackageName(request.getPackageName());
            event.setTotalPrice(request.getTotalPrice() != null ? request.getTotalPrice() : 0.0);
        }

        event.setAdvancePayment(request.getAdvancePayment() != null ? request.getAdvancePayment() : 0.0);

        Event saved = eventRepository.save(event);
        if (saved.getBookingCode() == null || saved.getBookingCode().isBlank()) {
            saved.setBookingCode(String.format("EVT-%d-%04d", LocalDate.now().getYear(), saved.getId()));
            saved = eventRepository.save(saved);
        }

        return new EventResponse(saved);
    }

    @Override
    public EventResponse updateEvent(int id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        LocalDate evtDate = event.getEventDate();
        if (request.getEventDate() != null && !request.getEventDate().isBlank()) {
            LocalDate parsed = DateTimeUtil.parseDate(request.getEventDate());
            if (parsed == null) {
                throw new BadRequestException("Invalid event date format.");
            }
            if (parsed.isBefore(LocalDate.now())) {
                throw new BadRequestException("Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!");
            }
            evtDate = parsed;
            event.setEventDate(evtDate);
        }

        LocalTime startTime = event.getStartTime();
        if (request.getStartTime() != null && !request.getStartTime().isBlank()) {
            startTime = DateTimeUtil.parseTime(request.getStartTime());
            if (evtDate != null && evtDate.isEqual(LocalDate.now()) && startTime != null && startTime.isBefore(LocalTime.now().minusMinutes(5))) {
                throw new BadRequestException("Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!");
            }
            event.setStartTime(startTime);
        }

        LocalTime endTime = event.getEndTime();
        if (request.getEndTime() != null && !request.getEndTime().isBlank()) {
            endTime = DateTimeUtil.parseTime(request.getEndTime());
            event.setEndTime(endTime);
        }

        Integer targetVenueId = request.getVenueId() != null ? request.getVenueId() : (event.getVenue() != null ? event.getVenue().getId() : null);
        if (targetVenueId != null && evtDate != null) {
            List<Event> dateEvents = eventRepository.findByEventDate(evtDate);
            final LocalTime sTime = startTime;
            final LocalTime eTime = endTime;
            boolean venueConflict = dateEvents.stream()
                    .filter(other -> other.getId() != id)
                    .filter(other -> !"CANCELLED".equalsIgnoreCase(other.getStatus()) && !"REJECTED".equalsIgnoreCase(other.getStatus()))
                    .filter(other -> other.getVenue() != null && other.getVenue().getId() == targetVenueId)
                    .anyMatch(other -> {
                        if (other.getStartTime() == null || other.getEndTime() == null || sTime == null || eTime == null) {
                            return true;
                        }
                        return sTime.isBefore(other.getEndTime()) && other.getStartTime().isBefore(eTime);
                    });
            if (venueConflict) {
                throw new BadRequestException("Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!");
            }
        }

        if (request.getCustomerId() != null) {
            User customer = userRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new BadRequestException("Customer not found with id: " + request.getCustomerId()));
            event.setCustomer(customer);
        }

        if (request.getVenueId() != null) {
            Venue venue = venueRepository.findById(request.getVenueId())
                    .orElseThrow(() -> new BadRequestException("Venue not found with id: " + request.getVenueId()));
            event.setVenue(venue);
        }

        if (request.getEventTitle() != null) event.setEventTitle(request.getEventTitle());
        if (request.getEventType() != null) event.setEventType(request.getEventType());
        if (request.getExpectedGuests() != null) event.setExpectedGuests(request.getExpectedGuests());
        if (request.getSpecialRequirements() != null) event.setSpecialRequirements(request.getSpecialRequirements());
        if (request.getStatus() != null) event.setStatus(request.getStatus().toUpperCase());

        if (request.getClientPhone() != null) event.setClientPhone(request.getClientPhone());
        if (request.getClientEmail() != null) event.setClientEmail(request.getClientEmail());

        if (request.getPackageId() != null) {
            event.setPackageId(request.getPackageId());
            packageRepository.findById(request.getPackageId()).ifPresent(pkg -> event.setPackageName(pkg.getName()));
        } else if (request.getPackageName() != null) {
            event.setPackageName(request.getPackageName());
        }

        if (request.getTotalPrice() != null) event.setTotalPrice(request.getTotalPrice());
        if (request.getAdvancePayment() != null) event.setAdvancePayment(request.getAdvancePayment());

        Event updated = eventRepository.save(event);
        return new EventResponse(updated);
    }

    @Override
    public EventResponse updateEventStatus(int id, String status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        event.setStatus(status.toUpperCase());
        Event updated = eventRepository.save(event);
        return new EventResponse(updated);
    }

    @Override
    public void cancelEvent(int id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        eventRepository.delete(event);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getEventDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalEvents = eventRepository.count();
        long pending = eventRepository.countByStatus("PENDING");
        long approved = eventRepository.countByStatus("APPROVED");
        long confirmed = eventRepository.countByStatus("CONFIRMED");
        long scheduled = eventRepository.countByStatus("SCHEDULED");
        long inProgress = eventRepository.countByStatus("IN_PROGRESS");
        long completed = eventRepository.countByStatus("COMPLETED");
        long cancelled = eventRepository.countByStatus("CANCELLED");
        long upcoming = eventRepository.countUpcomingEvents(LocalDate.now());

        // Calculate total revenue from completed/confirmed events
        double totalRevenue = eventRepository.findAll().stream()
                .filter(e -> !"CANCELLED".equalsIgnoreCase(e.getStatus()))
                .mapToDouble(e -> e.getTotalPrice() != null ? e.getTotalPrice() : 0.0)
                .sum();

        stats.put("totalEvents", totalEvents);
        stats.put("pendingEvents", pending);
        stats.put("approvedEvents", approved);
        stats.put("confirmedEvents", confirmed);
        stats.put("scheduledEvents", scheduled);
        stats.put("inProgressEvents", inProgress);
        stats.put("completedEvents", completed);
        stats.put("cancelledEvents", cancelled);
        stats.put("upcomingEvents", upcoming);
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalPackages", packageRepository.count());
        stats.put("totalVenues", venueRepository.count());

        return stats;
    }
}
