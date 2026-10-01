package com.restaurant.app.event.service;

import com.restaurant.app.event.dto.EventRequest;
import com.restaurant.app.event.dto.EventResponse;

import java.util.List;
import java.util.Map;

public interface EventService {
    List<EventResponse> getAllEvents();
    EventResponse getEventById(int id);
    List<EventResponse> getEventsByCustomer(int customerId);
    EventResponse createEvent(EventRequest request);
    EventResponse updateEvent(int id, EventRequest request);
    EventResponse updateEventStatus(int id, String status);
    void cancelEvent(int id);
    Map<String, Object> getEventDashboardStats();
}
