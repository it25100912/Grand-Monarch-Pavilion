package com.restaurant.app.billing.repository;

import com.restaurant.app.billing.entity.Invoice;
import com.restaurant.app.billing.entity.Payment;
import com.restaurant.app.billing.entity.Receipt;
import com.restaurant.app.common.config.DBConnectionManager;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Repository for Invoicing, Payment Processing & Financial Reports Persistence.
 */
@Repository
public class BillingRepository {

    // ==================== INVOICES ====================

    public List<Invoice> getAllInvoices() {
        List<Invoice> list = new ArrayList<>();
        String sql = "SELECT i.*, u.full_name as customer_name FROM invoices i " +
                     "JOIN users u ON i.customer_id = u.id ORDER BY i.id DESC";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapResultSetToInvoice(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<Invoice> getInvoicesByCustomer(int customerId) {
        List<Invoice> list = new ArrayList<>();
        String sql = "SELECT i.*, u.full_name as customer_name FROM invoices i " +
                     "JOIN users u ON i.customer_id = u.id WHERE i.customer_id = ? ORDER BY i.id DESC";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, customerId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToInvoice(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Invoice getInvoiceById(int id) {
        String sql = "SELECT i.*, u.full_name as customer_name FROM invoices i " +
                     "JOIN users u ON i.customer_id = u.id WHERE i.id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToInvoice(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean createInvoice(Invoice inv) {
        String invNum = "INV-" + System.currentTimeMillis() % 1000000;
        inv.setInvoiceNumber(invNum);

        String bType = inv.getBookingType();
        if (bType == null || bType.toUpperCase().contains("RESERV") || bType.toUpperCase().contains("TABLE")) {
            bType = "RESERVATION";
        } else {
            bType = "EVENT";
        }

        String sql = "INSERT INTO invoices (invoice_number, customer_id, booking_type, booking_id, subtotal, tax_amount, discount_amount, total_amount, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, inv.getInvoiceNumber());
            stmt.setInt(2, inv.getCustomerId());
            stmt.setString(3, bType);
            stmt.setInt(4, inv.getBookingId());
            stmt.setDouble(5, inv.getSubtotal());
            stmt.setDouble(6, inv.getTaxAmount());
            stmt.setDouble(7, inv.getDiscountAmount());
            stmt.setDouble(8, inv.getTotalAmount());
            stmt.setString(9, inv.getStatus() != null ? inv.getStatus() : "UNPAID");

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                try (ResultSet keys = stmt.getGeneratedKeys()) {
                    if (keys.next()) {
                        inv.setId(keys.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateInvoiceStatus(int invoiceId, String status) {
        String sql = "UPDATE invoices SET status = ? WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setInt(2, invoiceId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteInvoice(int id) {
        String sql = "DELETE FROM invoices WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // ==================== PAYMENTS ====================

    public List<Payment> getAllPayments() {
        List<Payment> list = new ArrayList<>();
        String sql = "SELECT p.*, i.invoice_number, i.customer_id, u.full_name as customer_name, i.booking_type, i.booking_id FROM payments p " +
                     "JOIN invoices i ON p.invoice_id = i.id " +
                     "JOIN users u ON i.customer_id = u.id ORDER BY p.id DESC";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapResultSetToPayment(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<Payment> getPaymentsByInvoice(int invoiceId) {
        List<Payment> list = new ArrayList<>();
        String sql = "SELECT p.*, i.invoice_number, i.customer_id, u.full_name as customer_name, i.booking_type, i.booking_id FROM payments p " +
                     "JOIN invoices i ON p.invoice_id = i.id " +
                     "JOIN users u ON i.customer_id = u.id WHERE p.invoice_id = ? ORDER BY p.id DESC";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, invoiceId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToPayment(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean recordPayment(Payment p) {
        if (p.getTransactionRef() == null || p.getTransactionRef().isEmpty()) {
            p.setTransactionRef("TXN-" + System.currentTimeMillis() % 1000000);
        }

        String method = p.getPaymentMethod();
        if (method == null || method.trim().isEmpty()) method = "CASH";
        method = method.trim().toUpperCase();
        if (method.contains("POS") || method.contains("CARD")) {
            if (method.contains("DEBIT")) method = "DEBIT_CARD";
            else method = "CREDIT_CARD";
        } else if (method.contains("BANK") || method.contains("TRANSFER") || method.contains("CHEQUE")) {
            method = "BANK_TRANSFER";
        } else if (method.contains("ONLINE")) {
            method = "ONLINE";
        } else {
            method = "CASH";
        }

        String sql = "INSERT INTO payments (invoice_id, payment_method, amount_paid, transaction_ref, status) " +
                     "VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, p.getInvoiceId());
            stmt.setString(2, method);
            stmt.setDouble(3, p.getAmountPaid());
            stmt.setString(4, p.getTransactionRef());
            stmt.setString(5, p.getStatus() != null ? p.getStatus() : "SUCCESS");

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                try (ResultSet keys = stmt.getGeneratedKeys()) {
                    if (keys.next()) {
                        p.setId(keys.getInt(1));
                    }
                }
                updateInvoicePaymentStatus(p.getInvoiceId());
                autoGenerateReceipt(p);
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private void autoGenerateReceipt(Payment p) {
        String query = "SELECT i.invoice_number, i.customer_id, i.booking_type, i.booking_id FROM invoices i WHERE i.id = ?";
        String insSql = "INSERT INTO receipts (receipt_number, payment_id, invoice_id, customer_id, amount, payment_method, notes) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnectionManager.getInstance().getConnection()) {
            int customerId = 0;
            String invNum = "";
            String bType = "";
            int bId = 0;
            try (PreparedStatement qStmt = conn.prepareStatement(query)) {
                qStmt.setInt(1, p.getInvoiceId());
                try (ResultSet rs = qStmt.executeQuery()) {
                    if (rs.next()) {
                        invNum = rs.getString("invoice_number");
                        customerId = rs.getInt("customer_id");
                        bType = rs.getString("booking_type");
                        bId = rs.getInt("booking_id");
                    }
                }
            }
            if (customerId > 0) {
                String recNum = "REC-" + (1000 + p.getId());
                try (PreparedStatement insStmt = conn.prepareStatement(insSql)) {
                    insStmt.setString(1, recNum);
                    insStmt.setInt(2, p.getId());
                    insStmt.setInt(3, p.getInvoiceId());
                    insStmt.setInt(4, customerId);
                    insStmt.setDouble(5, p.getAmountPaid());
                    insStmt.setString(6, p.getPaymentMethod());
                    insStmt.setString(7, "Settlement for " + bType + " #" + bId + " (" + invNum + ")");
                    insStmt.executeUpdate();
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public boolean updatePaymentStatus(int paymentId, String status) {
        String sql = "UPDATE payments SET status = ? WHERE id = ?";
        String invQuery = "SELECT invoice_id FROM payments WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection()) {
            int invoiceId = 0;
            try (PreparedStatement qStmt = conn.prepareStatement(invQuery)) {
                qStmt.setInt(1, paymentId);
                try (ResultSet rs = qStmt.executeQuery()) {
                    if (rs.next()) invoiceId = rs.getInt("invoice_id");
                }
            }

            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, status);
                stmt.setInt(2, paymentId);
                int rows = stmt.executeUpdate();
                if (rows > 0 && invoiceId > 0) {
                    updateInvoicePaymentStatus(invoiceId);
                    return true;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deletePayment(int id) {
        String invQuery = "SELECT invoice_id FROM payments WHERE id = ?";
        String delSql = "DELETE FROM payments WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection()) {
            int invoiceId = 0;
            try (PreparedStatement qStmt = conn.prepareStatement(invQuery)) {
                qStmt.setInt(1, id);
                try (ResultSet rs = qStmt.executeQuery()) {
                    if (rs.next()) invoiceId = rs.getInt("invoice_id");
                }
            }

            try (PreparedStatement stmt = conn.prepareStatement(delSql)) {
                stmt.setInt(1, id);
                int rows = stmt.executeUpdate();
                if (rows > 0 && invoiceId > 0) {
                    updateInvoicePaymentStatus(invoiceId);
                    return true;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // ==================== RECEIPTS ====================

    public List<Receipt> getAllReceipts() {
        List<Receipt> list = new ArrayList<>();
        String sql = "SELECT r.*, i.invoice_number, u.full_name as customer_name, i.booking_type, i.booking_id " +
                     "FROM receipts r " +
                     "JOIN invoices i ON r.invoice_id = i.id " +
                     "JOIN users u ON r.customer_id = u.id " +
                     "ORDER BY r.id DESC";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                String bookingDesc = rs.getString("booking_type") + " #" + rs.getInt("booking_id");
                list.add(new Receipt(
                    rs.getInt("id"),
                    rs.getString("receipt_number"),
                    rs.getInt("payment_id"),
                    rs.getInt("invoice_id"),
                    rs.getString("invoice_number"),
                    rs.getInt("customer_id"),
                    rs.getString("customer_name"),
                    bookingDesc,
                    rs.getDouble("amount"),
                    rs.getString("payment_method"),
                    rs.getTimestamp("receipt_date") != null ? rs.getTimestamp("receipt_date").toString() : "",
                    rs.getString("notes")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Receipt getReceiptById(int id) {
        String sql = "SELECT r.*, i.invoice_number, u.full_name as customer_name, i.booking_type, i.booking_id " +
                     "FROM receipts r " +
                     "JOIN invoices i ON r.invoice_id = i.id " +
                     "JOIN users u ON r.customer_id = u.id " +
                     "WHERE r.id = ? OR r.payment_id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.setInt(2, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String bookingDesc = rs.getString("booking_type") + " #" + rs.getInt("booking_id");
                    return new Receipt(
                        rs.getInt("id"),
                        rs.getString("receipt_number"),
                        rs.getInt("payment_id"),
                        rs.getInt("invoice_id"),
                        rs.getString("invoice_number"),
                        rs.getInt("customer_id"),
                        rs.getString("customer_name"),
                        bookingDesc,
                        rs.getDouble("amount"),
                        rs.getString("payment_method"),
                        rs.getTimestamp("receipt_date") != null ? rs.getTimestamp("receipt_date").toString() : "",
                        rs.getString("notes")
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // ==================== FINANCIAL REPORTS ====================

    public Map<String, Object> getFinancialReports(String period, String startDate, String endDate) {
        Map<String, Object> report = new HashMap<>();
        try (Connection conn = DBConnectionManager.getInstance().getConnection()) {
            double totalRevenue = 0;
            int totalPaymentsCount = 0;
            double pendingPayments = 0;
            double refunds = 0;
            double invoiceTotals = 0;

            String revSql = "SELECT COALESCE(SUM(amount_paid), 0) as rev, COUNT(*) as cnt FROM payments WHERE status = 'SUCCESS'";
            try (Statement st = conn.createStatement(); ResultSet rs = st.executeQuery(revSql)) {
                if (rs.next()) {
                    totalRevenue = rs.getDouble("rev");
                    totalPaymentsCount = rs.getInt("cnt");
                }
            }

            String pendSql = "SELECT COALESCE(SUM(amount_paid), 0) FROM payments WHERE status = 'PENDING'";
            try (Statement st = conn.createStatement(); ResultSet rs = st.executeQuery(pendSql)) {
                if (rs.next()) pendingPayments = rs.getDouble(1);
            }

            String refSql = "SELECT COALESCE(SUM(amount_paid), 0) FROM payments WHERE status = 'REFUNDED'";
            try (Statement st = conn.createStatement(); ResultSet rs = st.executeQuery(refSql)) {
                if (rs.next()) refunds = rs.getDouble(1);
            }

            String invSql = "SELECT COALESCE(SUM(total_amount), 0) FROM invoices WHERE status != 'CANCELLED'";
            try (Statement st = conn.createStatement(); ResultSet rs = st.executeQuery(invSql)) {
                if (rs.next()) invoiceTotals = rs.getDouble(1);
            }

            report.put("totalRevenue", totalRevenue);
            report.put("totalPayments", totalPaymentsCount);
            report.put("pendingPayments", pendingPayments);
            report.put("refunds", refunds);
            report.put("invoiceTotals", invoiceTotals);

            List<Map<String, Object>> byMethod = new ArrayList<>();
            String methSql = "SELECT payment_method, SUM(amount_paid) as total, COUNT(*) as count FROM payments WHERE status = 'SUCCESS' GROUP BY payment_method";
            try (Statement st = conn.createStatement(); ResultSet rs = st.executeQuery(methSql)) {
                while (rs.next()) {
                    Map<String, Object> m = new HashMap<>();
                    m.put("method", rs.getString("payment_method"));
                    m.put("total", rs.getDouble("total"));
                    m.put("count", rs.getInt("count"));
                    byMethod.add(m);
                }
            }
            report.put("revenueByMethod", byMethod);

            List<Map<String, Object>> byDate = new ArrayList<>();
            String dateSql = "SELECT DATE(payment_date) as pdate, SUM(amount_paid) as total, COUNT(*) as count FROM payments WHERE status = 'SUCCESS' GROUP BY DATE(payment_date) ORDER BY pdate DESC LIMIT 15";
            try (Statement st = conn.createStatement(); ResultSet rs = st.executeQuery(dateSql)) {
                while (rs.next()) {
                    Map<String, Object> d = new HashMap<>();
                    d.put("date", rs.getString("pdate"));
                    d.put("total", rs.getDouble("total"));
                    d.put("count", rs.getInt("count"));
                    byDate.add(d);
                }
            }
            report.put("revenueByDate", byDate);

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return report;
    }

    private void updateInvoicePaymentStatus(int invoiceId) {
        String sumSql = "SELECT SUM(amount_paid) as total_paid FROM payments WHERE invoice_id = ? AND status = 'SUCCESS'";
        String invSql = "SELECT total_amount FROM invoices WHERE id = ?";
        try (Connection conn = DBConnectionManager.getInstance().getConnection()) {
            double totalPaid = 0;
            double totalAmount = 0;

            try (PreparedStatement sStmt = conn.prepareStatement(sumSql)) {
                sStmt.setInt(1, invoiceId);
                try (ResultSet rs = sStmt.executeQuery()) {
                    if (rs.next()) totalPaid = rs.getDouble("total_paid");
                }
            }

            try (PreparedStatement iStmt = conn.prepareStatement(invSql)) {
                iStmt.setInt(1, invoiceId);
                try (ResultSet rs = iStmt.executeQuery()) {
                    if (rs.next()) totalAmount = rs.getDouble("total_amount");
                }
            }

            String newStatus = "UNPAID";
            if (totalPaid >= totalAmount && totalAmount > 0) {
                newStatus = "PAID";
            } else if (totalPaid > 0) {
                newStatus = "PARTIALLY_PAID";
            }

            String updateSql = "UPDATE invoices SET status = ? WHERE id = ?";
            try (PreparedStatement uStmt = conn.prepareStatement(updateSql)) {
                uStmt.setString(1, newStatus);
                uStmt.setInt(2, invoiceId);
                uStmt.executeUpdate();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Invoice mapResultSetToInvoice(ResultSet rs) throws SQLException {
        Invoice inv = new Invoice();
        inv.setId(rs.getInt("id"));
        inv.setInvoiceNumber(rs.getString("invoice_number"));
        inv.setCustomerId(rs.getInt("customer_id"));
        inv.setCustomerName(rs.getString("customer_name"));
        inv.setBookingType(rs.getString("booking_type"));
        inv.setBookingId(rs.getInt("booking_id"));
        inv.setSubtotal(rs.getDouble("subtotal"));
        inv.setTaxAmount(rs.getDouble("tax_amount"));
        inv.setDiscountAmount(rs.getDouble("discount_amount"));
        inv.setTotalAmount(rs.getDouble("total_amount"));
        inv.setStatus(rs.getString("status"));
        inv.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toString() : "");
        return inv;
    }

    private Payment mapResultSetToPayment(ResultSet rs) throws SQLException {
        Payment p = new Payment();
        p.setId(rs.getInt("id"));
        p.setInvoiceId(rs.getInt("invoice_id"));
        p.setInvoiceNumber(rs.getString("invoice_number"));
        p.setPaymentMethod(rs.getString("payment_method"));
        p.setAmountPaid(rs.getDouble("amount_paid"));
        p.setPaymentDate(rs.getTimestamp("payment_date") != null ? rs.getTimestamp("payment_date").toString() : "");
        p.setTransactionRef(rs.getString("transaction_ref"));
        p.setStatus(rs.getString("status"));
        try {
            p.setCustomerId(rs.getInt("customer_id"));
            p.setCustomerName(rs.getString("customer_name"));
            String bDesc = rs.getString("booking_type") + " #" + rs.getInt("booking_id");
            p.setBookingDetails(bDesc);
        } catch (SQLException ignored) {}
        return p;
    }
}
