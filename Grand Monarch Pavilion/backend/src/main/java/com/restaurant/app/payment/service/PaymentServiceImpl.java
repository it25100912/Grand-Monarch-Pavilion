package com.restaurant.app.payment.service;

import com.restaurant.app.common.exception.ResourceNotFoundException;
import com.restaurant.app.customerstaff.entity.User;
import com.restaurant.app.customerstaff.repository.UserRepository;
import com.restaurant.app.payment.dto.PaymentRequest;
import com.restaurant.app.payment.dto.PaymentResponse;
import com.restaurant.app.payment.entity.Invoice;
import com.restaurant.app.payment.entity.Payment;
import com.restaurant.app.payment.repository.InvoiceRepository;
import com.restaurant.app.payment.repository.PaymentRepository;
import com.restaurant.app.event.repository.EventRepository;
import com.restaurant.app.reservation.repository.ReservationRepository;
import com.restaurant.app.common.observer.BookingSubject;
import com.restaurant.app.payment.strategy.PaymentStrategy;
import com.restaurant.app.payment.strategy.PaymentStrategyFactory;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final EventRepository eventRepository;
    private final PaymentStrategyFactory paymentStrategyFactory;
    private final BookingSubject bookingSubject;

    public PaymentServiceImpl(InvoiceRepository invoiceRepository,
                              PaymentRepository paymentRepository,
                              UserRepository userRepository,
                              ReservationRepository reservationRepository,
                              EventRepository eventRepository,
                              PaymentStrategyFactory paymentStrategyFactory,
                              BookingSubject bookingSubject) {
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.reservationRepository = reservationRepository;
        this.eventRepository = eventRepository;
        this.paymentStrategyFactory = paymentStrategyFactory;
        this.bookingSubject = bookingSubject;
    }

    @PostConstruct
    public void seedInitialFinancialsIfEmpty() {
        // Sample financial records seeding disabled for clean production deployment
    }

    @Override
    @Transactional(readOnly = true)
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Invoice getInvoiceById(int id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Invoice> getInvoicesByCustomer(int customerId) {
        return invoiceRepository.findByCustomerId(customerId);
    }

    @Override
    public Invoice createInvoice(Invoice invoice) {
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isBlank()) {
            invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (invoice.getTaxAmount() == null) invoice.setTaxAmount(0.0);
        if (invoice.getDiscountAmount() == null) invoice.setDiscountAmount(0.0);
        if (invoice.getTotalAmount() == null) {
            invoice.setTotalAmount(invoice.getSubtotal() + invoice.getTaxAmount() - invoice.getDiscountAmount());
        }
        return invoiceRepository.save(invoice);
    }

    @Override
    public Invoice updateInvoiceStatus(int id, String status) {
        Invoice invoice = getInvoiceById(id);
        invoice.setStatus(status.toUpperCase());
        return invoiceRepository.save(invoice);
    }

    @Override
    public void deleteInvoice(int id) {
        Invoice invoice = getInvoiceById(id);
        invoiceRepository.delete(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(PaymentResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(int id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return new PaymentResponse(payment);
    }

    @Override
    public PaymentResponse processPayment(PaymentRequest request) {
        Payment payment = new Payment();

        Invoice invoice = null;
        if (request.getInvoiceId() != null && request.getInvoiceId() > 0) {
            invoice = invoiceRepository.findById(request.getInvoiceId()).orElse(null);
        }
        if (invoice == null) {
            invoice = new Invoice();
            invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            String bRef = request.getBookingRef() != null ? request.getBookingRef().trim() : "";
            invoice.setBookingType(bRef.startsWith("RES-") ? "RESERVATION" : "EVENT");
            
            User invCustomer = null;
            int derivedBookingId = 1;
            try {
                if (bRef.startsWith("RES-")) {
                    int rId = Integer.parseInt(bRef.replace("RES-", "").trim());
                    derivedBookingId = rId;
                    var rOpt = reservationRepository.findById(rId);
                    if (rOpt.isPresent() && rOpt.get().getCustomer() != null) {
                        invCustomer = rOpt.get().getCustomer();
                    }
                } else if (bRef.startsWith("EVT-")) {
                    String numPart = bRef.replaceAll("[^0-9]", "");
                    if (!numPart.isEmpty()) {
                        int eId = Integer.parseInt(numPart);
                        derivedBookingId = eId;
                        var eOpt = eventRepository.findById(eId);
                        if (eOpt.isPresent() && eOpt.get().getCustomer() != null) {
                            invCustomer = eOpt.get().getCustomer();
                        }
                    }
                }
            } catch (Exception ignored) {}

            if (invCustomer == null) {
                invCustomer = userRepository.findByUsername("admin")
                        .orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
            }
            invoice.setCustomer(invCustomer);
            invoice.setBookingId(derivedBookingId);

            double amt = request.getAmountPaid() != null ? request.getAmountPaid() : 0.0;
            invoice.setSubtotal(amt);
            invoice.setTaxAmount(0.0);
            invoice.setDiscountAmount(0.0);
            invoice.setTotalAmount(amt);
            invoice.setStatus("PENDING_VERIFICATION".equalsIgnoreCase(request.getStatus()) ? "UNPAID" : "PAID");
            invoice = invoiceRepository.save(invoice);
        }
        payment.setInvoice(invoice);

        payment.setBookingRef(request.getBookingRef() != null && !request.getBookingRef().isBlank()
                ? request.getBookingRef()
                : (invoice != null ? (invoice.getBookingType() + "-" + invoice.getBookingId()) : "GEN-" + System.currentTimeMillis()));

        payment.setCustomerName(request.getCustomerName() != null && !request.getCustomerName().isBlank()
                ? request.getCustomerName()
                : invoice.getCustomerName());

        // SE2030 Design Pattern #2: Strategy Pattern
        // Select and execute interchangeable payment algorithm at runtime
        PaymentStrategy paymentStrategy = paymentStrategyFactory.getStrategy(request.getPaymentMethod());
        paymentStrategy.process(payment, request, invoice);

        payment.setAmountPaid(request.getAmountPaid() != null ? request.getAmountPaid() : (invoice != null ? invoice.getTotalAmount() : 0.0));
        payment.setDepositAmount(request.getDepositAmount() != null ? request.getDepositAmount() : payment.getAmountPaid());
        payment.setBalanceAmount(request.getBalanceAmount() != null ? request.getBalanceAmount() : 0.0);

        if (request.getTransactionRef() != null && !request.getTransactionRef().isBlank()) {
            payment.setTransactionRef(request.getTransactionRef());
        }

        String status = (request.getStatus() != null && !request.getStatus().isBlank())
                ? request.getStatus().toUpperCase()
                : payment.getStatus();

        if (payment.getBalanceAmount() > 0 && !"REFUNDED".equals(status) && !"PENDING".equals(status) && !"FAILED".equals(status) && !"PENDING_VERIFICATION".equals(status) && !"REJECTED".equals(status)) {
            status = "PARTIALLY_PAID";
        }
        payment.setStatus(status);
        payment.setRefundReason(request.getRefundReason());
        if (request.getSlipUrl() != null && !request.getSlipUrl().isBlank()) {
            payment.setSlipUrl(request.getSlipUrl());
            payment.setSlipFileName(request.getSlipFileName());
        }
        payment.setRejectionReason(request.getRejectionReason());
        payment.setVerifiedBy(request.getVerifiedBy());
        if ("PAID".equals(status) && request.getVerifiedBy() != null) {
            payment.setVerifiedAt(LocalDateTime.now());
        }
        payment.setPaymentDate(LocalDateTime.now());

        Payment saved = paymentRepository.save(payment);

        if (invoice != null) {
            invoice.setStatus(status.equals("PAID") ? "PAID" : (status.equals("PARTIALLY_PAID") ? "PARTIALLY_PAID" : "UNPAID"));
            invoiceRepository.save(invoice);
        }

        // SE2030 Design Pattern #3: Observer Pattern
        // Broadcast payment processed event to registered observers
        String customerEmail = (invoice != null && invoice.getCustomer() != null) ? invoice.getCustomer().getEmail() : null;
        bookingSubject.notifyObservers(
                saved.getBookingRef(),
                "PAYMENT_" + saved.getPaymentMethod(),
                saved.getStatus(),
                customerEmail,
                "Payment of LKR " + saved.getAmountPaid() + " recorded via " + saved.getPaymentMethod() + " (" + saved.getStatus() + ")"
        );

        return new PaymentResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPendingVerificationPayments() {
        return paymentRepository.findByStatusOrderByIdDesc("PENDING_VERIFICATION").stream()
                .map(PaymentResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentResponse approvePayment(int id, String verifiedBy) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        String status = (payment.getBalanceAmount() != null && payment.getBalanceAmount() > 0) ? "PARTIALLY_PAID" : "PAID";
        payment.setStatus(status);
        payment.setVerifiedBy(verifiedBy != null && !verifiedBy.isBlank() ? verifiedBy : "Finance Officer");
        payment.setVerifiedAt(LocalDateTime.now());
        payment.setRejectionReason(null);

        if (payment.getInvoice() != null) {
            Invoice inv = payment.getInvoice();
            inv.setStatus(status);
            invoiceRepository.save(inv);
        }

        confirmLinkedBooking(payment.getBookingRef());

        Payment updated = paymentRepository.save(payment);

        // Notify observers of payment approval
        String customerEmail = (updated.getInvoice() != null && updated.getInvoice().getCustomer() != null)
                ? updated.getInvoice().getCustomer().getEmail() : null;
        bookingSubject.notifyObservers(
                updated.getBookingRef(),
                "PAYMENT_APPROVAL",
                updated.getStatus(),
                customerEmail,
                "Payment #" + updated.getId() + " was approved by " + updated.getVerifiedBy()
        );

        return new PaymentResponse(updated);
    }

    @Override
    public PaymentResponse rejectPayment(int id, String reason, String verifiedBy) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        payment.setStatus("REJECTED");
        payment.setRejectionReason(reason != null && !reason.isBlank() ? reason : "Bank transfer slip could not be validated against bank records.");
        payment.setVerifiedBy(verifiedBy != null && !verifiedBy.isBlank() ? verifiedBy : "Finance Officer");
        payment.setVerifiedAt(LocalDateTime.now());

        if (payment.getInvoice() != null) {
            Invoice inv = payment.getInvoice();
            inv.setStatus("UNPAID");
            invoiceRepository.save(inv);
        }

        Payment updated = paymentRepository.save(payment);

        // Notify observers of payment rejection
        String customerEmail = (updated.getInvoice() != null && updated.getInvoice().getCustomer() != null)
                ? updated.getInvoice().getCustomer().getEmail() : null;
        bookingSubject.notifyObservers(
                updated.getBookingRef(),
                "PAYMENT_REJECTION",
                "REJECTED",
                customerEmail,
                "Payment #" + updated.getId() + " was rejected. Reason: " + updated.getRejectionReason()
        );

        return new PaymentResponse(updated);
    }

    private void confirmLinkedBooking(String bookingRef) {
        if (bookingRef == null || bookingRef.isBlank()) return;
        try {
            String cleanRef = bookingRef.trim().toUpperCase();
            if (cleanRef.startsWith("RES-")) {
                int resId = Integer.parseInt(cleanRef.substring(4).replaceAll("[^0-9]", ""));
                reservationRepository.findById(resId).ifPresent(res -> {
                    res.setStatus("CONFIRMED");
                    reservationRepository.save(res);
                });
            } else if (cleanRef.startsWith("EVT-")) {
                String numPart = cleanRef.substring(4);
                if (numPart.contains("-")) {
                    numPart = numPart.substring(numPart.lastIndexOf("-") + 1);
                }
                int evtId = Integer.parseInt(numPart.replaceAll("[^0-9]", ""));
                eventRepository.findById(evtId).ifPresent(evt -> {
                    evt.setStatus("CONFIRMED");
                    eventRepository.save(evt);
                });
            }
        } catch (Exception ignored) {
            // Silently skip if ref format is non-standard
        }
    }

    @Override
    public PaymentResponse processRefund(int id, String reason) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        payment.setStatus("REFUNDED");
        payment.setRefundReason(reason != null && !reason.isBlank() ? reason : "Administrative refund processed by management");

        if (payment.getInvoice() != null) {
            Invoice inv = payment.getInvoice();
            inv.setStatus("REFUNDED");
            invoiceRepository.save(inv);
        }

        Payment updated = paymentRepository.save(payment);
        return new PaymentResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getFinancialReports(String period, String startDate, String endDate) {
        Map<String, Object> report = new HashMap<>();
        double totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> "PAID".equalsIgnoreCase(p.getStatus()) || "PARTIALLY_PAID".equalsIgnoreCase(p.getStatus()))
                .mapToDouble(Payment::getAmountPaid)
                .sum();

        double refundedTotal = paymentRepository.findAll().stream()
                .filter(p -> "REFUNDED".equalsIgnoreCase(p.getStatus()))
                .mapToDouble(Payment::getAmountPaid)
                .sum();

        report.put("totalRevenue", totalRevenue);
        report.put("refundedTotal", refundedTotal);
        report.put("totalTransactions", paymentRepository.count());
        report.put("paidInvoices", invoiceRepository.countByStatus("PAID"));
        report.put("unpaidInvoices", invoiceRepository.countByStatus("UNPAID"));
        report.put("period", period);

        return report;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getPaymentDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalPayments = paymentRepository.count();
        long paid = paymentRepository.findAll().stream().filter(p -> "PAID".equalsIgnoreCase(p.getStatus())).count();
        long partiallyPaid = paymentRepository.findAll().stream().filter(p -> "PARTIALLY_PAID".equalsIgnoreCase(p.getStatus())).count();
        long pending = paymentRepository.findAll().stream().filter(p -> "PENDING".equalsIgnoreCase(p.getStatus())).count();
        long refunded = paymentRepository.findAll().stream().filter(p -> "REFUNDED".equalsIgnoreCase(p.getStatus())).count();
        long failed = paymentRepository.findAll().stream().filter(p -> "FAILED".equalsIgnoreCase(p.getStatus())).count();

        double totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> "PAID".equalsIgnoreCase(p.getStatus()) || "PARTIALLY_PAID".equalsIgnoreCase(p.getStatus()))
                .mapToDouble(Payment::getAmountPaid)
                .sum();

        stats.put("totalPayments", totalPayments);
        stats.put("paidPayments", paid);
        stats.put("partiallyPaidPayments", partiallyPaid);
        stats.put("pendingPayments", pending);
        stats.put("refundedPayments", refunded);
        stats.put("failedPayments", failed);
        stats.put("totalRevenue", totalRevenue);

        return stats;
    }
}
