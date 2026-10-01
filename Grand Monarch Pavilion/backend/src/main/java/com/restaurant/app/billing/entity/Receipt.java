package com.restaurant.app.billing.entity;

public class Receipt {
    private int id;
    private String receiptNumber;
    private int paymentId;
    private int invoiceId;
    private String invoiceNumber;
    private int customerId;
    private String customerName;
    private String bookingDetails;
    private double amount;
    private String paymentMethod;
    private String receiptDate;
    private String notes;

    public Receipt() {}

    public Receipt(int id, String receiptNumber, int paymentId, int invoiceId, String invoiceNumber, int customerId, String customerName, String bookingDetails, double amount, String paymentMethod, String receiptDate, String notes) {
        this.id = id;
        this.receiptNumber = receiptNumber;
        this.paymentId = paymentId;
        this.invoiceId = invoiceId;
        this.invoiceNumber = invoiceNumber;
        this.customerId = customerId;
        this.customerName = customerName;
        this.bookingDetails = bookingDetails;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.receiptDate = receiptDate;
        this.notes = notes;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

    public int getPaymentId() { return paymentId; }
    public void setPaymentId(int paymentId) { this.paymentId = paymentId; }

    public int getInvoiceId() { return invoiceId; }
    public void setInvoiceId(int invoiceId) { this.invoiceId = invoiceId; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public int getCustomerId() { return customerId; }
    public void setCustomerId(int customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getBookingDetails() { return bookingDetails; }
    public void setBookingDetails(String bookingDetails) { this.bookingDetails = bookingDetails; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getReceiptDate() { return receiptDate; }
    public void setReceiptDate(String receiptDate) { this.receiptDate = receiptDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
