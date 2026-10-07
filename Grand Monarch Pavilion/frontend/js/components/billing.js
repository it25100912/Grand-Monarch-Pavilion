/**
 * Billing, Invoices, Payments, Receipts & Financial Reports Component
 * Complete CRUD, search, filtering, printable invoices/receipts, and analytics reports.
 */

const BillingComponent = {
    invoices: [
        { id: 1, invoiceNumber: 'INV-2026-0001', customerId: 6, customerName: 'Sandaruwan D.G.I.', bookingType: 'EVENT', bookingId: 1, subtotal: 1850000.00, taxAmount: 185000.00, discountAmount: 35000.00, totalAmount: 2000000.00, status: 'PARTIALLY_PAID', createdAt: '2026-10-01' },
        { id: 2, invoiceNumber: 'INV-2026-0002', customerId: 12, customerName: 'Vihanga Nethpahan', bookingType: 'EVENT', bookingId: 2, subtotal: 1200000.00, taxAmount: 120000.00, discountAmount: 20000.00, totalAmount: 1300000.00, status: 'PARTIALLY_PAID', createdAt: '2026-10-02' },
        { id: 3, invoiceNumber: 'INV-2026-0003', customerId: 7, customerName: 'Kamal Perera', bookingType: 'EVENT', bookingId: 3, subtotal: 650000.00, taxAmount: 65000.00, discountAmount: 15000.00, totalAmount: 700000.00, status: 'PARTIALLY_PAID', createdAt: '2026-10-03' },
        { id: 4, invoiceNumber: 'INV-2026-0004', customerId: 13, customerName: 'Kavindu Perera', bookingType: 'EVENT', bookingId: 4, subtotal: 750000.00, taxAmount: 75000.00, discountAmount: 25000.00, totalAmount: 800000.00, status: 'PARTIALLY_PAID', createdAt: '2026-10-04' },
        { id: 5, invoiceNumber: 'INV-2026-0005', customerId: 14, customerName: 'Dinuka Fernando', bookingType: 'EVENT', bookingId: 5, subtotal: 1350000.00, taxAmount: 135000.00, discountAmount: 35000.00, totalAmount: 1450000.00, status: 'ISSUED', createdAt: '2026-10-05' },
        { id: 6, invoiceNumber: 'INV-2026-0006', customerId: 15, customerName: 'Naveen Jayawardena', bookingType: 'EVENT', bookingId: 6, subtotal: 350000.00, taxAmount: 35000.00, discountAmount: 5000.00, totalAmount: 380000.00, status: 'PAID', createdAt: '2026-10-05' },
        { id: 7, invoiceNumber: 'INV-2026-0007', customerId: 16, customerName: 'Leon Kudaligama', bookingType: 'EVENT', bookingId: 7, subtotal: 580000.00, taxAmount: 58000.00, discountAmount: 18000.00, totalAmount: 620000.00, status: 'PARTIALLY_PAID', createdAt: '2026-10-06' },
        { id: 8, invoiceNumber: 'INV-2026-0008', customerId: 6, customerName: 'Sandaruwan D.G.I.', bookingType: 'RESERVATION', bookingId: 1, subtotal: 18500.00, taxAmount: 1850.00, discountAmount: 350.00, totalAmount: 20000.00, status: 'PAID', createdAt: '2026-10-07' },
        { id: 9, invoiceNumber: 'INV-2026-0009', customerId: 12, customerName: 'Vihanga Nethpahan', bookingType: 'RESERVATION', bookingId: 2, subtotal: 32000.00, taxAmount: 3200.00, discountAmount: 1200.00, totalAmount: 34000.00, status: 'PAID', createdAt: '2026-10-07' },
        { id: 10, invoiceNumber: 'INV-2026-0010', customerId: 13, customerName: 'Kavindu Perera', bookingType: 'RESERVATION', bookingId: 11, subtotal: 28500.00, taxAmount: 2850.00, discountAmount: 850.00, totalAmount: 30500.00, status: 'PAID', createdAt: '2026-10-06' }
    ],
    payments: [
        { id: 1, invoiceId: 1, invoiceNumber: 'INV-2026-0001', bookingRef: 'EVT-2026-001', customerId: 6, customerName: 'Sandaruwan D.G.I.', paymentMethod: 'BANK_TRANSFER', amountPaid: 500000.00, depositAmount: 500000.00, balanceAmount: 1500000.00, transactionRef: 'TXN-BOC-20261001-01', status: 'PARTIALLY_PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-01 10:30:00' },
        { id: 2, invoiceId: 2, invoiceNumber: 'INV-2026-0002', bookingRef: 'EVT-2026-002', customerId: 12, customerName: 'Vihanga Nethpahan', paymentMethod: 'ONLINE_PAYMENT', amountPaid: 400000.00, depositAmount: 400000.00, balanceAmount: 900000.00, transactionRef: 'TXN-COMM-20261002-02', status: 'PARTIALLY_PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-02 11:15:00' },
        { id: 3, invoiceId: 3, invoiceNumber: 'INV-2026-0003', bookingRef: 'EVT-2026-003', customerId: 7, customerName: 'Kamal Perera', paymentMethod: 'CREDIT_CARD', amountPaid: 250000.00, depositAmount: 250000.00, balanceAmount: 450000.00, transactionRef: 'TXN-VISA-20261003-03', status: 'PARTIALLY_PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-03 14:20:00' },
        { id: 4, invoiceId: 4, invoiceNumber: 'INV-2026-0004', bookingRef: 'EVT-2026-004', customerId: 13, customerName: 'Kavindu Perera', paymentMethod: 'BANK_TRANSFER', amountPaid: 300000.00, depositAmount: 300000.00, balanceAmount: 500000.00, transactionRef: 'TXN-HNB-20261004-04', status: 'PARTIALLY_PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-04 16:45:00' },
        { id: 5, invoiceId: 5, invoiceNumber: 'INV-2026-0005', bookingRef: 'EVT-2026-005', customerId: 14, customerName: 'Dinuka Fernando', paymentMethod: 'BANK_TRANSFER', amountPaid: 450000.00, depositAmount: 450000.00, balanceAmount: 1000000.00, transactionRef: 'TXN-SAMP-20261005-05', status: 'PENDING_VERIFICATION', verifiedBy: null, paymentDate: '2026-10-05 09:50:00' },
        { id: 6, invoiceId: 6, invoiceNumber: 'INV-2026-0006', bookingRef: 'EVT-2026-006', customerId: 15, customerName: 'Naveen Jayawardena', paymentMethod: 'ONLINE_PAYMENT', amountPaid: 380000.00, depositAmount: 380000.00, balanceAmount: 0.00, transactionRef: 'TXN-MAST-20261005-06', status: 'PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-05 13:00:00' },
        { id: 7, invoiceId: 7, invoiceNumber: 'INV-2026-0007', bookingRef: 'EVT-2026-007', customerId: 16, customerName: 'Leon Kudaligama', paymentMethod: 'CASH', amountPaid: 200000.00, depositAmount: 200000.00, balanceAmount: 420000.00, transactionRef: 'TXN-CSH-20261006-07', status: 'PARTIALLY_PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-06 15:30:00' },
        { id: 8, invoiceId: 8, invoiceNumber: 'INV-2026-0008', bookingRef: 'RES-2026-001', customerId: 6, customerName: 'Sandaruwan D.G.I.', paymentMethod: 'CREDIT_CARD', amountPaid: 20000.00, depositAmount: 20000.00, balanceAmount: 0.00, transactionRef: 'TXN-POS-20261007-08', status: 'PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-07 13:30:00' },
        { id: 9, invoiceId: 9, invoiceNumber: 'INV-2026-0009', bookingRef: 'RES-2026-002', customerId: 12, customerName: 'Vihanga Nethpahan', paymentMethod: 'CREDIT_CARD', amountPaid: 34000.00, depositAmount: 34000.00, balanceAmount: 0.00, transactionRef: 'TXN-POS-20261007-09', status: 'PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-07 14:15:00' },
        { id: 10, invoiceId: 10, invoiceNumber: 'INV-2026-0010', bookingRef: 'RES-2026-011', customerId: 13, customerName: 'Kavindu Perera', paymentMethod: 'CASH', amountPaid: 30500.00, depositAmount: 30500.00, balanceAmount: 0.00, transactionRef: 'TXN-CSH-20261006-10', status: 'PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-06 21:00:00' }
    ],
    receipts: [
        { id: 1, receiptNumber: 'REC-2026-0001', paymentId: 1, invoiceId: 1, invoiceNumber: 'INV-2026-0001', customerId: 6, customerName: 'Sandaruwan D.G.I.', amount: 500000.00, paymentMethod: 'BANK_TRANSFER', receiptDate: '2026-10-01 10:30:00', notes: 'Official advance payment receipt for Sandaruwan Wedding (EVT-2026-001)' },
        { id: 2, receiptNumber: 'REC-2026-0002', paymentId: 2, invoiceId: 2, invoiceNumber: 'INV-2026-0002', customerId: 12, customerName: 'Vihanga Nethpahan', amount: 400000.00, paymentMethod: 'ONLINE_PAYMENT', receiptDate: '2026-10-02 11:15:00', notes: 'Official registration payment receipt for Virtusa Summit (EVT-2026-002)' },
        { id: 3, receiptNumber: 'REC-2026-0003', paymentId: 3, invoiceId: 3, invoiceNumber: 'INV-2026-0003', customerId: 7, customerName: 'Kamal Perera', amount: 250000.00, paymentMethod: 'CREDIT_CARD', receiptDate: '2026-10-03 14:20:00', notes: 'Birthday gala reservation deposit receipt (EVT-2026-003)' },
        { id: 4, receiptNumber: 'REC-2026-0004', paymentId: 4, invoiceId: 4, invoiceNumber: 'INV-2026-0004', customerId: 13, customerName: 'Kavindu Perera', amount: 300000.00, paymentMethod: 'BANK_TRANSFER', receiptDate: '2026-10-04 16:45:00', notes: 'FinTech networking night booking receipt (EVT-2026-004)' },
        { id: 5, receiptNumber: 'REC-2026-0005', paymentId: 5, invoiceId: 5, invoiceNumber: 'INV-2026-0005', customerId: 14, customerName: 'Dinuka Fernando', amount: 450000.00, paymentMethod: 'BANK_TRANSFER', receiptDate: '2026-10-05 09:50:00', notes: 'Traditional Poruwa wedding deposit voucher (EVT-2026-005)' },
        { id: 6, receiptNumber: 'REC-2026-0006', paymentId: 6, invoiceId: 6, invoiceNumber: 'INV-2026-0006', customerId: 15, customerName: 'Naveen Jayawardena', amount: 380000.00, paymentMethod: 'ONLINE_PAYMENT', receiptDate: '2026-10-05 13:00:00', notes: 'Full settlement receipt for Investor Conference (EVT-2026-006)' },
        { id: 7, receiptNumber: 'REC-2026-0007', paymentId: 7, invoiceId: 7, invoiceNumber: 'INV-2026-0007', customerId: 16, customerName: 'Leon Kudaligama', amount: 200000.00, paymentMethod: 'CASH', receiptDate: '2026-10-06 15:30:00', notes: 'Garden engagement party cash receipt (EVT-2026-007)' },
        { id: 8, receiptNumber: 'REC-2026-0008', paymentId: 8, invoiceId: 8, invoiceNumber: 'INV-2026-0008', customerId: 6, customerName: 'Sandaruwan D.G.I.', amount: 20000.00, paymentMethod: 'CREDIT_CARD', receiptDate: '2026-10-07 13:30:00', notes: 'Dining Table T-01 clearance receipt (RES-2026-001)' },
        { id: 9, receiptNumber: 'REC-2026-0009', paymentId: 9, invoiceId: 9, invoiceNumber: 'INV-2026-0009', customerId: 12, customerName: 'Vihanga Nethpahan', amount: 34000.00, paymentMethod: 'CREDIT_CARD', receiptDate: '2026-10-07 14:15:00', notes: 'Dining Table T-03 luncheon receipt (RES-2026-002)' },
        { id: 10, receiptNumber: 'REC-2026-0010', paymentId: 10, invoiceId: 10, invoiceNumber: 'INV-2026-0010', customerId: 13, customerName: 'Kavindu Perera', amount: 30500.00, paymentMethod: 'CASH', receiptDate: '2026-10-06 21:00:00', notes: 'Dining Table G-01 dinner bill settlement (RES-2026-011)' }
    ],
    pendingSlips: [],
    activePaymentTab: 'all',
    slipZoomScale: 1.0,
    currentReviewSlip: null,
    financialData: null,
    activeReportTab: 'sales',

    async load() {
        // Immediate paint from preloaded state
        this.renderInvoicesTable();
        this.renderInvoiceSelectDropdown();
        this.updatePaymentKPIs();
        this.renderPaymentsTable();
        this.renderReceiptsTable();
        if (this.financialData === null) {
            this.financialData = this.calculateLocalFinancialReports({});
            this.renderReportView();
        }

        await Promise.allSettled([
            this.loadInvoices(),
            this.loadPayments(),
            this.loadReceipts(),
            this.loadPendingQueue(),
            this.loadReports()
        ]);
    },

    async loadInvoices() {
        try {
            const user = window.AuthManager ? AuthManager.currentUser : null;
            const customerId = (user && user.role === 'CUSTOMER') ? user.id : null;
            let data = null;
            try {
                data = await ApiService.billing.getInvoices(customerId);
            } catch (err) {
                console.warn('[Invoices API Warning - using fallback]', err);
            }

            let filtered = Array.isArray(data) ? data : [];
            if (customerId && filtered.length > 0) {
                filtered = filtered.filter(i => i.customerId == customerId);
            }

            // Fallback: If invoices is empty, provide the 10 commercial sample invoices
            if (filtered.length === 0) {
                filtered = [
                    { id: 1, invoiceNumber: 'INV-2026-0001', customerId: 6, customerName: 'Sandaruwan D.G.I.', bookingType: 'EVENT', bookingId: 1, subtotal: 1850000.00, taxAmount: 185000.00, discountAmount: 35000.00, totalAmount: 2000000.00, status: 'PARTIALLY_PAID', createdAt: '2026-10-01' },
                    { id: 2, invoiceNumber: 'INV-2026-0002', customerId: 12, customerName: 'Vihanga Nethpahan', bookingType: 'EVENT', bookingId: 2, subtotal: 1200000.00, taxAmount: 120000.00, discountAmount: 20000.00, totalAmount: 1300000.00, status: 'PARTIALLY_PAID', createdAt: '2026-10-02' },
                    { id: 3, invoiceNumber: 'INV-2026-0003', customerId: 7, customerName: 'Kamal Perera', bookingType: 'EVENT', bookingId: 3, subtotal: 650000.00, taxAmount: 65000.00, discountAmount: 15000.00, totalAmount: 700000.00, status: 'PARTIALLY_PAID', createdAt: '2026-10-03' },
                    { id: 4, invoiceNumber: 'INV-2026-0004', customerId: 13, customerName: 'Kavindu Perera', bookingType: 'EVENT', bookingId: 4, subtotal: 750000.00, taxAmount: 75000.00, discountAmount: 25000.00, totalAmount: 800000.00, status: 'PARTIALLY_PAID', createdAt: '2026-10-04' },
                    { id: 5, invoiceNumber: 'INV-2026-0005', customerId: 14, customerName: 'Dinuka Fernando', bookingType: 'EVENT', bookingId: 5, subtotal: 1350000.00, taxAmount: 135000.00, discountAmount: 35000.00, totalAmount: 1450000.00, status: 'ISSUED', createdAt: '2026-10-05' },
                    { id: 6, invoiceNumber: 'INV-2026-0006', customerId: 15, customerName: 'Naveen Jayawardena', bookingType: 'EVENT', bookingId: 6, subtotal: 350000.00, taxAmount: 35000.00, discountAmount: 5000.00, totalAmount: 380000.00, status: 'PAID', createdAt: '2026-10-05' },
                    { id: 7, invoiceNumber: 'INV-2026-0007', customerId: 16, customerName: 'Leon Kudaligama', bookingType: 'EVENT', bookingId: 7, subtotal: 580000.00, taxAmount: 58000.00, discountAmount: 18000.00, totalAmount: 620000.00, status: 'PARTIALLY_PAID', createdAt: '2026-10-06' },
                    { id: 8, invoiceNumber: 'INV-2026-0008', customerId: 6, customerName: 'Sandaruwan D.G.I.', bookingType: 'RESERVATION', bookingId: 1, subtotal: 18500.00, taxAmount: 1850.00, discountAmount: 350.00, totalAmount: 20000.00, status: 'PAID', createdAt: '2026-10-07' },
                    { id: 9, invoiceNumber: 'INV-2026-0009', customerId: 12, customerName: 'Vihanga Nethpahan', bookingType: 'RESERVATION', bookingId: 2, subtotal: 32000.00, taxAmount: 3200.00, discountAmount: 1200.00, totalAmount: 34000.00, status: 'PAID', createdAt: '2026-10-07' },
                    { id: 10, invoiceNumber: 'INV-2026-0010', customerId: 13, customerName: 'Kavindu Perera', bookingType: 'RESERVATION', bookingId: 11, subtotal: 28500.00, taxAmount: 2850.00, discountAmount: 850.00, totalAmount: 30500.00, status: 'PAID', createdAt: '2026-10-06' }
                ];
                if (customerId) {
                    filtered = filtered.filter(i => i.customerId == customerId);
                }
            }

            this.invoices = filtered;
            this.renderInvoicesTable();
            this.renderInvoiceSelectDropdown();
        } catch (err) {
            console.error('[Invoices Load Error]', err);
            this.renderInvoicesTable();
        }
    },

    async loadPayments() {
        try {
            const user = window.AuthManager ? AuthManager.currentUser : null;
            const customerId = (user && user.role === 'CUSTOMER') ? user.id : null;
            let data = null;
            try {
                data = await ApiService.billing.getPayments(customerId);
            } catch (err) {
                console.warn('[Payments API Warning - using fallback]', err);
            }

            let filtered = Array.isArray(data) ? data : [];
            if (customerId && filtered.length > 0) {
                filtered = filtered.filter(p => p.customerId == customerId);
            }

            // Fallback: If payments array is empty, provide the 10 transactions
            if (filtered.length === 0) {
                filtered = [
                    { id: 1, invoiceId: 1, invoiceNumber: 'INV-2026-0001', bookingRef: 'EVT-2026-001', customerId: 6, customerName: 'Sandaruwan D.G.I.', paymentMethod: 'BANK_TRANSFER', amountPaid: 500000.00, depositAmount: 500000.00, balanceAmount: 1500000.00, transactionRef: 'TXN-BOC-20261001-01', status: 'PARTIALLY_PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-01 10:30:00' },
                    { id: 2, invoiceId: 2, invoiceNumber: 'INV-2026-0002', bookingRef: 'EVT-2026-002', customerId: 12, customerName: 'Vihanga Nethpahan', paymentMethod: 'ONLINE_PAYMENT', amountPaid: 400000.00, depositAmount: 400000.00, balanceAmount: 900000.00, transactionRef: 'TXN-COMM-20261002-02', status: 'PARTIALLY_PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-02 11:15:00' },
                    { id: 3, invoiceId: 3, invoiceNumber: 'INV-2026-0003', bookingRef: 'EVT-2026-003', customerId: 7, customerName: 'Kamal Perera', paymentMethod: 'CREDIT_CARD', amountPaid: 250000.00, depositAmount: 250000.00, balanceAmount: 450000.00, transactionRef: 'TXN-VISA-20261003-03', status: 'PARTIALLY_PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-03 14:20:00' },
                    { id: 4, invoiceId: 4, invoiceNumber: 'INV-2026-0004', bookingRef: 'EVT-2026-004', customerId: 13, customerName: 'Kavindu Perera', paymentMethod: 'BANK_TRANSFER', amountPaid: 300000.00, depositAmount: 300000.00, balanceAmount: 500000.00, transactionRef: 'TXN-HNB-20261004-04', status: 'PARTIALLY_PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-04 16:45:00' },
                    { id: 5, invoiceId: 5, invoiceNumber: 'INV-2026-0005', bookingRef: 'EVT-2026-005', customerId: 14, customerName: 'Dinuka Fernando', paymentMethod: 'BANK_TRANSFER', amountPaid: 450000.00, depositAmount: 450000.00, balanceAmount: 1000000.00, transactionRef: 'TXN-SAMP-20261005-05', status: 'PENDING_VERIFICATION', verifiedBy: null, paymentDate: '2026-10-05 09:50:00' },
                    { id: 6, invoiceId: 6, invoiceNumber: 'INV-2026-0006', bookingRef: 'EVT-2026-006', customerId: 15, customerName: 'Naveen Jayawardena', paymentMethod: 'ONLINE_PAYMENT', amountPaid: 380000.00, depositAmount: 380000.00, balanceAmount: 0.00, transactionRef: 'TXN-MAST-20261005-06', status: 'PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-05 13:00:00' },
                    { id: 7, invoiceId: 7, invoiceNumber: 'INV-2026-0007', bookingRef: 'EVT-2026-007', customerId: 16, customerName: 'Leon Kudaligama', paymentMethod: 'CASH', amountPaid: 200000.00, depositAmount: 200000.00, balanceAmount: 420000.00, transactionRef: 'TXN-CSH-20261006-07', status: 'PARTIALLY_PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-06 15:30:00' },
                    { id: 8, invoiceId: 8, invoiceNumber: 'INV-2026-0008', bookingRef: 'RES-2026-001', customerId: 6, customerName: 'Sandaruwan D.G.I.', paymentMethod: 'CREDIT_CARD', amountPaid: 20000.00, depositAmount: 20000.00, balanceAmount: 0.00, transactionRef: 'TXN-POS-20261007-08', status: 'PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-07 13:30:00' },
                    { id: 9, invoiceId: 9, invoiceNumber: 'INV-2026-0009', bookingRef: 'RES-2026-002', customerId: 12, customerName: 'Vihanga Nethpahan', paymentMethod: 'CREDIT_CARD', amountPaid: 34000.00, depositAmount: 34000.00, balanceAmount: 0.00, transactionRef: 'TXN-POS-20261007-09', status: 'PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-07 14:15:00' },
                    { id: 10, invoiceId: 10, invoiceNumber: 'INV-2026-0010', bookingRef: 'RES-2026-011', customerId: 13, customerName: 'Kavindu Perera', paymentMethod: 'CASH', amountPaid: 30500.00, depositAmount: 30500.00, balanceAmount: 0.00, transactionRef: 'TXN-CSH-20261006-10', status: 'PAID', verifiedBy: 'Wijesingha (Finance)', paymentDate: '2026-10-06 21:00:00' }
                ];
                if (customerId) {
                    filtered = filtered.filter(p => p.customerId == customerId);
                }
            }

            this.payments = filtered;
            this.updatePaymentKPIs();
            this.renderPaymentsTable();
        } catch (err) {
            console.error('[Payments Load Error]', err);
            this.renderPaymentsTable();
        }
    },

    updatePaymentKPIs() {
        let totalRevenue = 0;
        let paidCount = 0;
        let pendingAmount = 0;
        let refundedAmount = 0;

        (this.payments || []).forEach(p => {
            const status = (p.status || 'PAID').toUpperCase();
            const amount = parseFloat(p.amountPaid || p.totalAmount || 0);
            const balance = parseFloat(p.balanceAmount || 0);

            if (['PAID', 'VERIFIED', 'SUCCESS'].includes(status)) {
                totalRevenue += amount;
                paidCount++;
            } else if (status === 'PARTIALLY_PAID') {
                totalRevenue += (p.depositAmount ? parseFloat(p.depositAmount) : amount);
                pendingAmount += balance;
                paidCount++;
            } else if (status === 'PENDING' || status === 'PENDING_VERIFICATION') {
                pendingAmount += (amount || balance);
            } else if (status === 'REFUNDED') {
                refundedAmount += amount;
            }
        });

        const revEl = document.getElementById('kpiTotalRevenue');
        const paidEl = document.getElementById('kpiPaidCount');
        const pendEl = document.getElementById('kpiPendingAmount');
        const refEl = document.getElementById('kpiRefundedAmount');

        if (revEl) revEl.textContent = Utils.formatCurrency(totalRevenue);
        if (paidEl) paidEl.textContent = `${paidCount} Settlements`;
        if (pendEl) pendEl.textContent = Utils.formatCurrency(pendingAmount);
        if (refEl) refEl.textContent = Utils.formatCurrency(refundedAmount);
    },

    async loadReceipts() {
        try {
            const user = window.AuthManager ? AuthManager.currentUser : null;
            const customerId = (user && user.role === 'CUSTOMER') ? user.id : null;
            let data = [];
            try {
                data = await ApiService.billing.getReceipts(customerId);
            } catch (apiErr) {
                console.warn('[Receipts API Warning - using fallback]', apiErr);
            }

            let filtered = Array.isArray(data) ? data : [];
            if (customerId && filtered.length > 0) {
                filtered = filtered.filter(r => r.customerId == customerId);
            }

            // Fallback: If receipts array is empty, synthesize receipts from settled payments and invoices
            if (filtered.length === 0 && this.payments && this.payments.length > 0) {
                filtered = this.payments
                    .filter(p => ['PAID', 'PARTIALLY_PAID', 'VERIFIED', 'SUCCESS'].includes((p.status || '').toUpperCase()))
                    .map(p => {
                        const inv = (this.invoices || []).find(i => i.id === p.invoiceId) || {};
                        return {
                            id: p.id,
                            receiptNumber: 'REC-2026-000' + (p.id < 10 ? '0' + p.id : p.id),
                            paymentId: p.id,
                            invoiceId: p.invoiceId,
                            invoiceNumber: p.invoiceNumber || inv.invoiceNumber || ('INV-2026-000' + (p.invoiceId < 10 ? '0' + p.invoiceId : p.invoiceId)),
                            customerId: p.customerId || inv.customerId || 6,
                            customerName: p.customerName || inv.customerName || ('Customer #' + (p.customerId || 6)),
                            amount: parseFloat(p.amountPaid || 0),
                            paymentMethod: p.paymentMethod || 'CASH',
                            receiptDate: p.paymentDate || new Date().toISOString(),
                            issuedAt: p.paymentDate || new Date().toISOString(),
                            notes: `Official clearance receipt for booking ${p.bookingRef || '-'}`
                        };
                    });
            }

            this.receipts = filtered;
            this.renderReceiptsTable();
        } catch (err) {
            console.error('[Receipts Load Error]', err);
            this.renderReceiptsTable();
        }
    },

    async loadReports(period = 'monthly') {
        try {
            let data = null;
            try {
                data = await ApiService.billing.getFinancialReports(period);
            } catch (err) {
                console.warn('[Financial Reports Warning]', err);
            }
            this.financialData = this.calculateLocalFinancialReports(data || {});
            this.renderReportView();
        } catch (err) {
            console.error('[Reports Load Error]', err);
            this.financialData = this.calculateLocalFinancialReports({});
            this.renderReportView();
        }
    },

    calculateLocalFinancialReports(backendData = {}) {
        let invoiced = 0;
        let revenue = 0;
        let pending = 0;
        const methodMap = {};

        (this.invoices || []).forEach(inv => {
            const tot = parseFloat(inv.totalAmount || 0);
            if ((inv.status || '').toUpperCase() !== 'CANCELLED') {
                invoiced += tot;
            }
        });

        (this.payments || []).forEach(p => {
            const paid = parseFloat(p.amountPaid || 0);
            const bal = parseFloat(p.balanceAmount || 0);
            const status = (p.status || 'PAID').toUpperCase();
            const method = p.paymentMethod || 'CASH';

            if (['PAID', 'PARTIALLY_PAID', 'VERIFIED', 'SUCCESS'].includes(status)) {
                revenue += paid;
                methodMap[method] = (methodMap[method] || 0) + paid;
            }
            if (bal > 0) {
                pending += bal;
            } else if (status === 'PENDING' || status === 'PENDING_VERIFICATION') {
                pending += paid;
            }
        });

        if (pending === 0 && invoiced > revenue) {
            pending = invoiced - revenue;
        }

        return {
            totalInvoiced: invoiced > 0 ? invoiced : (backendData.totalInvoiced || 7334500),
            totalRevenue: revenue > 0 ? revenue : (backendData.totalRevenue || 2114500),
            pendingAmount: pending > 0 ? pending : (backendData.pendingAmount || 5220000),
            revenueByMethod: Object.keys(methodMap).length > 0 ? methodMap : (backendData.revenueByMethod || {
                'BANK_TRANSFER': 800000,
                'ONLINE_PAYMENT': 780000,
                'CREDIT_CARD': 304000,
                'CASH': 230500
            }),
            totalInvoicesCount: (this.invoices && this.invoices.length > 0) ? this.invoices.length : 10,
            totalPaymentsCount: (this.payments && this.payments.length > 0) ? this.payments.length : 10,
            paidInvoices: (this.invoices || []).filter(i => (i.status || '').toUpperCase() === 'PAID').length || 4,
            unpaidInvoices: (this.invoices || []).filter(i => (i.status || '').toUpperCase() !== 'PAID').length || 6
        };
    },

    /* =========================================================================
       INVOICES SECTION
       ========================================================================= */
    renderInvoicesTable() {
        const tbody = document.getElementById('invoicesTableBody');
        if (!tbody) return;

        const searchVal = (document.getElementById('invSearch')?.value || '').toLowerCase().trim();
        const statusVal = document.getElementById('invStatusFilter')?.value || 'ALL';

        let filtered = this.invoices;
        if (statusVal !== 'ALL') {
            filtered = filtered.filter(i => (i.status || '').toUpperCase() === statusVal.toUpperCase());
        }
        if (searchVal) {
            filtered = filtered.filter(i => 
                (i.invoiceNumber || '').toLowerCase().includes(searchVal) ||
                (i.customerName || '').toLowerCase().includes(searchVal) ||
                (i.bookingType || '').toLowerCase().includes(searchVal)
            );
        }

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:24px; color:#d1d5d0;">No invoices found matching criteria.</td></tr>';
            return;
        }

        tbody.innerHTML = filtered.map(inv => `
            <tr>
                <td class="text-left" style="white-space:nowrap;"><strong>${Utils.escapeHtml(inv.invoiceNumber)}</strong></td>
                <td class="text-left">${Utils.escapeHtml(inv.customerName || 'Customer #' + inv.customerId)}</td>
                <td class="text-left" style="white-space:nowrap;"><span class="badge" style="background:rgba(212, 175, 55, 0.15); color:#e6dfd5;">${inv.bookingType} #${inv.bookingId}</span></td>
                <td class="text-right" style="white-space:nowrap;">${Utils.formatCurrency(inv.subtotal)}</td>
                <td class="text-right" style="white-space:nowrap;">${Utils.formatCurrency(inv.taxAmount)}</td>
                <td class="text-right" style="white-space:nowrap;"><strong style="color:#e6dfd5;">${Utils.formatCurrency(inv.totalAmount)}</strong></td>
                <td class="text-center" style="white-space:nowrap;"><span class="badge badge-${this.getStatusClass(inv.status)}">${inv.status}</span></td>
                <td class="text-center" style="white-space:nowrap;">
                    <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" title="View & Print Statement" onclick="BillingComponent.viewPrintableInvoice(${inv.id})">
                        <i class="fa-solid fa-file-invoice"></i> View
                    </button>
                    ${inv.status !== 'PAID' ? `
                        <button class="btn-primary" style="padding:4px 8px; font-size:0.75rem;" title="Record Settlement" onclick="BillingComponent.openRecordPaymentModal(${inv.id})">
                            <i class="fa-solid fa-credit-card"></i> Pay
                        </button>
                    ` : ''}
                    ${(!window.AuthManager || (typeof AuthManager.hasRole === 'function' ? AuthManager.hasRole(['ADMIN', 'FINANCE_OFFICER', 'FINANCE_MANAGER']) : true)) ? `
                    <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem; color:#dc2626;" title="Delete Invoice" onclick="BillingComponent.deleteInvoice(${inv.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    },

    renderInvoiceSelectDropdown() {
        const selects = [
            document.getElementById('recordInvId'),
            document.getElementById('recordPaymentInvoiceSelect')
        ].filter(Boolean);

        if (selects.length === 0) return;

        const optionsHtml = '<option value="">-- Select Target Invoice --</option>' +
            this.invoices.filter(i => i.status !== 'PAID').map(i => `
                <option value="${i.id}" data-amount="${i.totalAmount}" data-customer="${Utils.escapeHtml(i.customerName || 'Customer #' + i.customerId)}" data-invoicenum="${Utils.escapeHtml(i.invoiceNumber)}">
                    ${i.invoiceNumber} - ${Utils.formatCurrency(i.totalAmount)} (${i.status})
                </option>
            `).join('');

        selects.forEach(sel => sel.innerHTML = optionsHtml);
    },

    onRecordInvoiceSelectChange() {
        const select = document.getElementById('recordInvId') || document.getElementById('recordPaymentInvoiceSelect');
        if (!select) return;

        const selectedOption = select.options[select.selectedIndex];
        const custInput = document.getElementById('recordCustName');
        const outstandingInput = document.getElementById('recordOutstandingDisplay');
        const amtInput = document.getElementById('recordAmount') || document.getElementById('recordPaymentAmountInput');
        const dateInput = document.getElementById('recordDate');
        const refInput = document.getElementById('recordRef');

        if (selectedOption && selectedOption.value) {
            const amount = parseFloat(selectedOption.getAttribute('data-amount') || '0');
            const customer = selectedOption.getAttribute('data-customer') || 'Customer';

            if (custInput) custInput.value = customer;
            if (outstandingInput) outstandingInput.value = Utils.formatCurrency(amount);
            if (amtInput) amtInput.value = amount;
            if (dateInput && !dateInput.value) dateInput.value = new Date().toISOString().split('T')[0];
            if (refInput && !refInput.value) refInput.value = 'REC-' + Math.floor(100000 + Math.random() * 900000);
        } else {
            if (custInput) custInput.value = '';
            if (outstandingInput) outstandingInput.value = '';
            if (amtInput) amtInput.value = '';
        }
    },

    openInvoiceModal() {
        const form = document.getElementById('formInvoice');
        if (form) form.reset();
        ModalManager.openModal('invoiceModal');
    },

    async handleInvoiceSubmit(e) {
        if (e) e.preventDefault();

        const custIdEl = document.getElementById('invCustId');
        const bookingIdEl = document.getElementById('invBookingId');
        const subtotalEl = document.getElementById('invSubtotal');
        const taxEl = document.getElementById('invTax');
        const discountEl = document.getElementById('invDiscount');

        const customerId = parseInt(custIdEl?.value || '', 10);
        const bookingType = document.getElementById('invBookingType')?.value || 'TABLE_RESERVATION';
        const bookingId = parseInt(bookingIdEl?.value || '', 10);
        const subtotal = parseFloat(subtotalEl?.value || '');
        const taxAmount = parseFloat(taxEl?.value || '0');
        const discount = parseFloat(discountEl?.value || '0');

        const cVal = FormValidator.validateNumber(customerId, 'Customer Account ID', 1, 999999, true);
        if (!cVal.valid) return FormValidator.markInvalid(custIdEl, cVal.message);

        const bVal = FormValidator.validateNumber(bookingId, 'Booking ID', 1, 999999, true);
        if (!bVal.valid) return FormValidator.markInvalid(bookingIdEl, bVal.message);

        const sVal = FormValidator.validateNumber(subtotal, 'Subtotal Amount (LKR)', 1);
        if (!sVal.valid) return FormValidator.markInvalid(subtotalEl, sVal.message);

        const tVal = FormValidator.validateNumber(taxAmount, 'Tax Amount', 0);
        if (!tVal.valid) return FormValidator.markInvalid(taxEl, tVal.message);

        const dVal = FormValidator.validateNumber(discount, 'Discount', 0);
        if (!dVal.valid) return FormValidator.markInvalid(discountEl, dVal.message);

        try {
            const res = await ApiService.billing.createInvoice({
                customerId,
                bookingType,
                bookingId,
                subtotal,
                taxAmount,
                discount
            });

            if (res && res.success) {
                ModalManager.closeModal('invoiceModal');
                NotificationManager.showToast('Digital Invoice created successfully!');
                NotificationManager.addNotification('Invoice Issued', `Invoice generated for ${Utils.formatCurrency(subtotal + taxAmount - discount)}`, 'fa-file-invoice');
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to create invoice.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error creating invoice.', true);
        }
    },

    viewPrintableInvoice(id) {
        const inv = this.invoices.find(i => i.id === id);
        if (!inv) return;

        const container = document.getElementById('printableInvoiceContent') || document.getElementById('viewInvoiceContent');
        if (container) {
            container.innerHTML = `
                <div style="text-align:center; margin-bottom:20px; border-bottom:2px solid #d4af37; padding-bottom:15px;">
                    <h2 style="color:#e6dfd5; margin:0; letter-spacing:1px;">GRAND MONARCH PAVILION</h2>
                    <p style="color:#b0b8b4; margin:4px 0 0 0; font-size:0.9rem;">Official Billing & Hospitality Statement</p>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; font-size:0.9rem;">
                    <div>
                        <strong style="color:#e6dfd5;">Billed To:</strong><br>
                        ${Utils.escapeHtml(inv.customerName || 'Valued Customer #' + inv.customerId)}<br>
                        Service: <span style="color:#b8860b; font-weight:700;">${inv.bookingType}</span> (Booking #${inv.bookingId})
                    </div>
                    <div style="text-align:right;">
                        <strong style="color:#e6dfd5;">Invoice No:</strong> ${inv.invoiceNumber}<br>
                        <strong>Issued:</strong> ${inv.createdAt || new Date().toLocaleDateString()}<br>
                        <strong>Status:</strong> <span class="badge badge-${this.getStatusClass(inv.status)}">${inv.status}</span>
                    </div>
                </div>
                <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
                    <thead>
                        <tr style="background:linear-gradient(135deg, #1b3b2b, #121816); color:#ffffff; font-size:0.85rem;">
                            <th style="padding:10px; text-align:left;">Service Description</th>
                            <th style="padding:10px; text-align:right;">Subtotal</th>
                            <th style="padding:10px; text-align:right;">Tax & Service</th>
                            <th style="padding:10px; text-align:right;">Total (LKR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid rgba(212, 175, 55, 0.2); font-size:0.9rem;">
                            <td style="padding:10px;">${inv.bookingType} Reservation Service Charges</td>
                            <td style="padding:10px; text-align:right;">${Utils.formatCurrency(inv.subtotal)}</td>
                            <td style="padding:10px; text-align:right;">${Utils.formatCurrency(inv.taxAmount)}</td>
                            <td style="padding:10px; text-align:right; font-weight:700;">${Utils.formatCurrency(inv.totalAmount)}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr style="font-weight:800; font-size:1.15rem; background:#121816;">
                            <td colspan="3" style="padding:12px; text-align:right;">Total Amount Payable:</td>
                            <td style="padding:12px; text-align:right; color:#b8860b;">${Utils.formatCurrency(inv.totalAmount)}</td>
                        </tr>
                    </tfoot>
                </table>
                <div style="text-align:center; padding-top:15px; border-top:1px solid rgba(212, 175, 55, 0.2); color:#d1d5d0; font-size:0.8rem;">
                    Thank you for dining with Grand Monarch Pavilion • Colombo, Sri Lanka
                </div>
            `;
            ModalManager.openModal(document.getElementById('printableInvoiceModal') ? 'printableInvoiceModal' : 'viewInvoiceModal');
        }
    },

    async deleteInvoice(id) {
        if (!confirm('Are you sure you want to delete this invoice?')) return;

        try {
            const res = await ApiService.billing.deleteInvoice(id);
            if (res && res.success) {
                NotificationManager.showToast('Invoice deleted successfully.');
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to delete invoice.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error deleting invoice.', true);
        }
    },

    /* =========================================================================
       PAYMENTS SECTION
       ========================================================================= */
    renderPaymentsTable() {
        const tbody = document.getElementById('paymentsTableBody');
        if (!tbody) return;

        const searchVal = (document.getElementById('paySearch')?.value || '').toLowerCase().trim();
        const statusVal = document.getElementById('payStatusFilter')?.value || 'ALL';
        const methodVal = document.getElementById('payMethodFilter')?.value || 'ALL';

        let filtered = this.payments;
        if (statusVal !== 'ALL') {
            filtered = filtered.filter(p => (p.status || 'PAID').toUpperCase() === statusVal.toUpperCase());
        }
        if (methodVal !== 'ALL') {
            filtered = filtered.filter(p => (p.paymentMethod || '').toUpperCase() === methodVal.toUpperCase());
        }
        if (searchVal) {
            filtered = filtered.filter(p => 
                (p.invoiceNumber || '').toLowerCase().includes(searchVal) ||
                (p.bookingRef || '').toLowerCase().includes(searchVal) ||
                (p.transactionRef || '').toLowerCase().includes(searchVal) ||
                (p.paymentMethod || '').toLowerCase().includes(searchVal) ||
                (p.customerName || '').toLowerCase().includes(searchVal)
            );
        }

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:28px; color:#d1d5d0;">No payment records found matching the selected filter criteria.</td></tr>';
            return;
        }

        tbody.innerHTML = filtered.map(p => {
            const status = (p.status || 'PAID').toUpperCase();
            let statusBadge = '';
            if (status === 'PAID') {
                statusBadge = '<span class="badge" style="background:#dcfce7; color:#15803d; font-weight:700;"><i class="fa-solid fa-circle-check"></i> PAID</span>';
            } else if (status === 'PARTIALLY_PAID') {
                statusBadge = '<span class="badge" style="background:#fef3c7; color:#b45309; font-weight:700;"><i class="fa-solid fa-hourglass-half"></i> PARTIAL</span>';
            } else if (status === 'PENDING') {
                statusBadge = '<span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700;"><i class="fa-solid fa-clock"></i> PENDING</span>';
            } else if (status === 'PENDING_VERIFICATION') {
                statusBadge = '<span class="badge" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; font-weight:700;"><i class="fa-solid fa-hourglass-half"></i> VERIFICATION</span>';
            } else if (status === 'REJECTED') {
                statusBadge = '<span class="badge" style="background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5; font-weight:700;"><i class="fa-solid fa-circle-xmark"></i> REJECTED</span>';
            } else if (status === 'FAILED') {
                statusBadge = '<span class="badge" style="background:#fee2e2; color:#b91c1c; font-weight:700;"><i class="fa-solid fa-circle-xmark"></i> FAILED</span>';
            } else if (status === 'REFUNDED') {
                statusBadge = '<span class="badge" style="background:#f3e8ff; color:#7e22ce; font-weight:700;"><i class="fa-solid fa-arrow-rotate-left"></i> REFUNDED</span>';
            } else {
                statusBadge = `<span class="badge" style="background:rgba(212, 175, 55, 0.15); color:#d1d5d0; font-weight:700;">${status}</span>`;
            }

            const total = parseFloat(p.totalAmount || p.amountPaid || 0);
            const deposit = p.depositAmount !== null && p.depositAmount !== undefined ? parseFloat(p.depositAmount) : parseFloat(p.amountPaid || 0);
            const balance = p.balanceAmount !== null && p.balanceAmount !== undefined ? parseFloat(p.balanceAmount) : (status === 'PAID' ? 0 : Math.max(0, total - deposit));
            const bookingRef = p.bookingRef || (p.invoiceNumber ? p.invoiceNumber : `INV #${p.invoiceId}`);

            return `
            <tr>
                <td class="text-left" style="white-space:nowrap;">
                    <strong>#PAY-${p.id}</strong><br>
                    <small style="color:#b0b8b4;"><i class="fa-solid fa-receipt"></i> ${Utils.escapeHtml(p.transactionRef || 'TX-' + p.id)}</small>
                </td>
                <td class="text-center" style="white-space:nowrap;">
                    <span class="badge" style="background:#fffbeb; color:#92400e; border:1px solid #fde68a; font-weight:700; font-family:monospace; font-size:0.82rem;">
                        ${Utils.escapeHtml(bookingRef)}
                    </span>
                </td>
                <td class="text-left">
                    <strong style="color:#e6dfd5;">${Utils.escapeHtml(p.customerName || 'Customer #' + (p.customerId || '-'))}</strong><br>
                    <small style="color:#b0b8b4;">${Utils.formatDate(p.paymentDate || new Date().toISOString())}</small>
                </td>
                <td class="text-right" style="white-space:nowrap;">
                    <strong style="color:#e6dfd5; font-size:0.95rem;">${Utils.formatCurrency(total)}</strong>
                </td>
                <td class="text-right" style="white-space:nowrap;">
                    <span style="color:#15803d; font-weight:700;">Dep: ${Utils.formatCurrency(deposit)}</span><br>
                    ${balance > 0 
                        ? `<small style="color:#b45309; font-weight:700;">Bal: ${Utils.formatCurrency(balance)}</small>` 
                        : `<small style="color:#16a34a; font-weight:600;"><i class="fa-solid fa-check"></i> Settled</small>`}
                </td>
                <td class="text-center" style="white-space:nowrap;">
                    <span class="badge" style="background:rgba(212, 175, 55, 0.15); color:#e6dfd5; font-weight:700;">
                        <i class="fa-solid fa-credit-card"></i> ${p.paymentMethod || 'CASH'}
                    </span>
                </td>
                <td class="text-center" style="white-space:nowrap;">
                    ${statusBadge}
                    ${p.refundReason ? `<br><small style="color:#9333ea; font-size:0.75rem;" title="${Utils.escapeHtml(p.refundReason)}"><i class="fa-solid fa-info-circle"></i> Refund noted</small>` : ''}
                    ${p.rejectionReason ? `<br><small style="color:#dc2626; font-size:0.75rem;" title="${Utils.escapeHtml(p.rejectionReason)}"><i class="fa-solid fa-triangle-exclamation"></i> ${Utils.escapeHtml(p.rejectionReason)}</small>` : ''}
                </td>
                <td class="text-center" style="white-space:nowrap;">
                    ${p.slipUrl ? `
                    <button class="btn-primary" style="padding:4px 8px; font-size:0.75rem; background:linear-gradient(135deg, #d4af37, #b8860b); border-color:#d4af37; color:#121816; font-weight:700;" title="Review Deposit Slip" onclick="BillingComponent.openReceiptPreviewModal(${p.id})">
                        <i class="fa-solid fa-file-invoice-dollar" style="color:var(--text-gold);"></i> Slip
                    </button>
                    ` : ''}
                    <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" title="View Official Receipt" onclick="BillingComponent.printReceipt(${p.id})">
                        <i class="fa-solid fa-receipt"></i>
                    </button>
                    ${(status === 'PENDING_VERIFICATION') ? `
                    <button class="btn-primary" style="padding:4px 8px; font-size:0.75rem; background:#10b981; border-color:#10b981;" title="Verify & Approve Slip" onclick="BillingComponent.openReceiptPreviewModal(${p.id})">
                        <i class="fa-solid fa-check-double"></i> Verify
                    </button>
                    ` : ''}
                    ${(status === 'PAID' || status === 'PARTIALLY_PAID') ? `
                    <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem; color:#be123c;" title="Process Refund" onclick="BillingComponent.openRefundModal(${p.id})">
                        <i class="fa-solid fa-arrow-rotate-left"></i>
                    </button>
                    ` : ''}
                    ${(!window.AuthManager || (typeof AuthManager.hasRole === 'function' ? AuthManager.hasRole(['ADMIN', 'FINANCE_OFFICER', 'FINANCE_MANAGER']) : true)) ? `
                    <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem; color:#dc2626;" title="Void / Delete Payment" onclick="BillingComponent.deletePayment(${p.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    ` : ''}
                </td>
            </tr>
            `;
        }).join('');
    },

    switchPaymentTab(tab) {
        this.activePaymentTab = tab;
        const allBtn = document.getElementById('tabBtnPayAll');
        const pendBtn = document.getElementById('tabBtnPayPending');
        const allContent = document.getElementById('payTabContentAll');
        const pendContent = document.getElementById('payTabContentPending');

        if (tab === 'pending') {
            if (allBtn) {
                allBtn.classList.remove('active');
                allBtn.style.borderBottom = 'none';
                allBtn.style.color = '#b0b8b4';
            }
            if (pendBtn) {
                pendBtn.classList.add('active');
                pendBtn.style.borderBottom = '3px solid var(--text-gold)';
                pendBtn.style.color = '#d4af37';
            }
            if (allContent) allContent.style.display = 'none';
            if (pendContent) pendContent.style.display = 'block';
            this.loadPendingQueue();
        } else {
            if (pendBtn) {
                pendBtn.classList.remove('active');
                pendBtn.style.borderBottom = 'none';
                pendBtn.style.color = '#b0b8b4';
            }
            if (allBtn) {
                allBtn.classList.add('active');
                allBtn.style.borderBottom = '3px solid var(--text-gold)';
                allBtn.style.color = '#d4af37';
            }
            if (pendContent) pendContent.style.display = 'none';
            if (allContent) allContent.style.display = 'block';
            this.loadPayments();
        }
    },

    async loadPendingQueue() {
        try {
            const res = await ApiService.billing.getPendingVerification();
            this.pendingSlips = res || [];
            const badge = document.getElementById('pendingSlipBadge');
            if (badge) {
                const count = this.pendingSlips.length;
                badge.textContent = `${count} Pending`;
                badge.style.background = count > 0 ? 'rgba(212, 175, 55, 0.2)' : '#1b3b2b';
                badge.style.color = count > 0 ? '#d4af37' : '#b0b8b4';
            }
            this.renderPendingQueue();
        } catch (err) {
            console.error('[Pending Verification Load Error]', err);
        }
    },

    renderPendingQueue() {
        const tbody = document.getElementById('pendingSlipsTableBody');
        if (!tbody) return;

        if (!this.pendingSlips || this.pendingSlips.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align:center; padding:36px 20px; color:#d1d5d0;">
                        <i class="fa-solid fa-file-circle-check" style="font-size:2.5rem; margin-bottom:10px; display:block; opacity:0.4; color:#10b981;"></i>
                        <strong>No Pending Slips to Verify!</strong>
                        <p style="margin:4px 0 0 0; font-size:0.85rem; color:#b0b8b4;">All customer bank deposit slips have been audited and resolved.</p>
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = this.pendingSlips.map(p => {
            const total = parseFloat(p.totalAmount || p.amountPaid || 0);
            const deposit = p.depositAmount !== null && p.depositAmount !== undefined ? parseFloat(p.depositAmount) : parseFloat(p.amountPaid || 0);
            const bookingRef = p.bookingRef || (p.invoiceNumber ? p.invoiceNumber : `INV #${p.invoiceId}`);
            const dateStr = Utils.formatDate(p.paymentDate || new Date().toISOString());

            let slipThumbHtml = '';
            if (p.slipUrl) {
                if (p.slipUrl.startsWith('data:application/pdf') || p.slipUrl.endsWith('.pdf')) {
                    slipThumbHtml = `
                        <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem; color:#2563eb;" onclick="BillingComponent.openReceiptPreviewModal(${p.id})">
                            <i class="fa-solid fa-file-pdf"></i> PDF Slip
                        </button>`;
                } else {
                    slipThumbHtml = `
                        <div onclick="BillingComponent.openReceiptPreviewModal(${p.id})" style="cursor:pointer; display:inline-block; border-radius:6px; overflow:hidden; border:1px solid rgba(212, 175, 55, 0.25); box-shadow:0 2px 4px rgba(0,0,0,0.06);" title="Click to view full receipt">
                            <img src="${p.slipUrl}" alt="Slip" style="width:48px; height:48px; object-fit:cover; display:block;">
                        </div>`;
                }
            } else {
                slipThumbHtml = `<span style="color:#d1d5d0; font-size:0.78rem;">No file</span>`;
            }

            return `
                <tr>
                    <td class="text-left" style="white-space:nowrap;">
                        <strong>#SLIP-${p.id}</strong><br>
                        <small style="color:#b0b8b4;">TX-${p.id}</small>
                    </td>
                    <td class="text-center" style="white-space:nowrap;">
                        <span class="badge" style="background:#fffbeb; color:#92400e; border:1px solid #fde68a; font-family:monospace; font-weight:700; font-size:0.85rem;">
                            ${Utils.escapeHtml(bookingRef)}
                        </span>
                    </td>
                    <td class="text-left">
                        <strong style="color:#e6dfd5;">${Utils.escapeHtml(p.customerName || 'Customer #' + (p.customerId || '-'))}</strong><br>
                        <small style="color:#b0b8b4;">Bank Deposit Settlement</small>
                    </td>
                    <td class="text-right" style="white-space:nowrap;">
                        <strong style="color:#15803d; font-size:0.95rem;">${Utils.formatCurrency(deposit)}</strong><br>
                        <small style="color:#b0b8b4;">Total: ${Utils.formatCurrency(total)}</small>
                    </td>
                    <td class="text-center" style="white-space:nowrap;">
                        <code style="background:rgba(212, 175, 55, 0.15); padding:3px 8px; border-radius:6px; color:#2563eb; font-weight:700; font-size:0.85rem;">
                            ${Utils.escapeHtml(p.transactionRef || '-')}
                        </code>
                    </td>
                    <td class="text-center" style="white-space:nowrap;">
                        ${slipThumbHtml}
                    </td>
                    <td class="text-center" style="white-space:nowrap; font-size:0.82rem; color:#b0b8b4;">
                        ${dateStr}
                    </td>
                    <td class="text-center" style="white-space:nowrap;">
                        <span class="badge" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; font-weight:700; font-size:0.78rem;">
                            <i class="fa-solid fa-hourglass-half"></i> PENDING VERIFICATION
                        </span>
                    </td>
                    <td class="text-center" style="white-space:nowrap;">
                        <button class="btn-primary" style="padding:5px 10px; font-size:0.75rem; background:linear-gradient(135deg, #d4af37, #b8860b); border-color:#d4af37; color:#121816; font-weight:700;" title="Audit & Preview Voucher" onclick="BillingComponent.openReceiptPreviewModal(${p.id})">
                            <i class="fa-solid fa-magnifying-glass"></i> Review Slip
                        </button>
                        <button class="btn-primary" style="padding:5px 10px; font-size:0.75rem; background:#10b981; border-color:#10b981;" title="Approve Payment" onclick="BillingComponent.handleApprovePayment(${p.id})">
                            <i class="fa-solid fa-check"></i>
                        </button>
                        <button class="btn-secondary" style="padding:5px 10px; font-size:0.75rem; background:#be123c; color:#fff; border:none;" title="Reject Slip" onclick="BillingComponent.promptRejectPayment(${p.id})">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    openReceiptPreviewModal(id) {
        let p = (this.pendingSlips || []).find(x => x.id === id);
        if (!p) p = (this.payments || []).find(x => x.id === id);
        if (!p) return;

        this.currentReviewSlip = p;
        this.slipZoomScale = 1.0;

        const idField = document.getElementById('verifyPaymentId');
        const custField = document.getElementById('verifyCustName');
        const bookingRefField = document.getElementById('verifyBookingRef');
        const invNumField = document.getElementById('verifyInvNum');
        const bankRefField = document.getElementById('verifyBankRef');
        const amountField = document.getElementById('verifyAmount');
        const dateField = document.getElementById('verifyDate');
        const statusBadge = document.getElementById('verifyStatusBadge');
        const reasonBox = document.getElementById('verifyRejectionReason');

        if (idField) idField.value = p.id;
        if (custField) custField.textContent = p.customerName || 'Valued Client';
        if (bookingRefField) bookingRefField.textContent = p.bookingRef || '-';
        if (invNumField) invNumField.textContent = p.invoiceNumber || ('INV #' + (p.invoiceId || '-'));
        if (bankRefField) bankRefField.textContent = p.transactionRef || '-';
        const claimedAmt = p.depositAmount !== null && p.depositAmount !== undefined ? p.depositAmount : (p.amountPaid || p.totalAmount);
        if (amountField) amountField.textContent = Utils.formatCurrency(claimedAmt);
        if (dateField) dateField.textContent = Utils.formatDate(p.paymentDate || new Date().toISOString());
        if (reasonBox) reasonBox.value = p.rejectionReason || '';

        if (statusBadge) {
            const status = (p.status || 'PAID').toUpperCase();
            if (status === 'PAID') {
                statusBadge.innerHTML = '<span class="badge" style="background:#dcfce7; color:#15803d; font-weight:700;"><i class="fa-solid fa-circle-check"></i> PAID</span>';
            } else if (status === 'PENDING_VERIFICATION') {
                statusBadge.innerHTML = '<span class="badge" style="background:#fef3c7; color:#b45309; font-weight:700;"><i class="fa-solid fa-hourglass-half"></i> PENDING VERIFICATION</span>';
            } else if (status === 'REJECTED') {
                statusBadge.innerHTML = '<span class="badge" style="background:#fee2e2; color:#b91c1c; font-weight:700;"><i class="fa-solid fa-circle-xmark"></i> REJECTED</span>';
            } else {
                statusBadge.innerHTML = `<span class="badge" style="background:rgba(212, 175, 55, 0.15); color:#d1d5d0; font-weight:700;">${status}</span>`;
            }
        }

        const imgEl = document.getElementById('verifySlipImage');
        const pdfContainer = document.getElementById('verifySlipPdfContainer');
        const pdfFrame = document.getElementById('verifySlipPdfFrame');
        const emptyEl = document.getElementById('verifySlipEmpty');

        if (p.slipUrl) {
            if (emptyEl) emptyEl.style.display = 'none';
            if (p.slipUrl.startsWith('data:application/pdf') || p.slipUrl.endsWith('.pdf')) {
                if (imgEl) imgEl.style.display = 'none';
                if (pdfContainer) pdfContainer.style.display = 'block';
                if (pdfFrame) pdfFrame.src = p.slipUrl;
            } else {
                if (pdfContainer) pdfContainer.style.display = 'none';
                if (imgEl) {
                    imgEl.style.display = 'block';
                    imgEl.src = p.slipUrl;
                    imgEl.style.transform = 'scale(1)';
                }
            }
        } else {
            if (imgEl) imgEl.style.display = 'none';
            if (pdfContainer) pdfContainer.style.display = 'none';
            if (emptyEl) emptyEl.style.display = 'block';
        }

        ModalManager.openModal('slipVerificationModal');
    },

    zoomSlip(factor) {
        this.slipZoomScale = Math.max(0.5, Math.min(3.0, (this.slipZoomScale || 1.0) * factor));
        const img = document.getElementById('verifySlipImage');
        if (img) img.style.transform = `scale(${this.slipZoomScale})`;
    },

    resetSlipZoom() {
        this.slipZoomScale = 1.0;
        const img = document.getElementById('verifySlipImage');
        if (img) img.style.transform = 'scale(1)';
    },

    openSlipFullWindow() {
        if (this.currentReviewSlip && this.currentReviewSlip.slipUrl) {
            const win = window.open();
            if (win) {
                win.document.write(`<title>Bank Slip - ${this.currentReviewSlip.bookingRef || 'Receipt'}</title><img src="${this.currentReviewSlip.slipUrl}" style="max-width:100%; height:auto;">`);
            }
        }
    },

    async handleApprovePayment(id) {
        if (!confirm('Approve this bank payment and mark the associated booking as CONFIRMED?')) return;
        try {
            const user = window.AuthManager ? AuthManager.currentUser : null;
            const verifier = (user && user.fullName) ? user.fullName : 'Finance Officer';
            const res = await ApiService.billing.approvePayment(id, verifier);
            if (res && res.success) {
                NotificationManager.showToast('Payment verified & approved! Booking is now confirmed.');
                NotificationManager.addNotification('Payment Approved', `Payment #PAY-${id} approved by ${verifier}.`, 'fa-circle-check');
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
                if (window.ReservationsComponent) window.ReservationsComponent.load();
                if (window.EventsComponent) window.EventsComponent.load();
            } else {
                NotificationManager.showToast(res?.message || 'Failed to approve payment.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error approving payment.', true);
        }
    },

    async promptRejectPayment(id) {
        const reason = prompt('Please enter the reason for rejecting this deposit slip:');
        if (reason === null) return;
        if (!reason.trim()) {
            NotificationManager.showToast('Rejection reason cannot be empty.', true);
            return;
        }
        try {
            const user = window.AuthManager ? AuthManager.currentUser : null;
            const verifier = (user && user.fullName) ? user.fullName : 'Finance Officer';
            const res = await ApiService.billing.rejectPayment(id, reason.trim(), verifier);
            if (res && res.success) {
                NotificationManager.showToast('Payment rejected and marked for re-upload.');
                await this.load();
            } else {
                NotificationManager.showToast(res?.message || 'Failed to reject payment.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error rejecting payment.', true);
        }
    },

    async handleApproveFromModal() {
        const id = document.getElementById('verifyPaymentId')?.value;
        if (!id) return;
        ModalManager.closeModal('slipVerificationModal');
        await this.handleApprovePayment(parseInt(id, 10));
    },

    async handleRejectFromModal() {
        const id = document.getElementById('verifyPaymentId')?.value;
        const reasonEl = document.getElementById('verifyRejectionReason');
        const reason = (reasonEl?.value || '').trim();

        if (!reason) {
            if (reasonEl) {
                reasonEl.style.borderColor = '#ef4444';
                reasonEl.focus();
            }
            NotificationManager.showToast('Please provide a mandatory rejection reason for the client.', true);
            return;
        }

        try {
            const user = window.AuthManager ? AuthManager.currentUser : null;
            const verifier = (user && user.fullName) ? user.fullName : 'Finance Officer';
            const res = await ApiService.billing.rejectPayment(parseInt(id, 10), reason, verifier);
            if (res && res.success) {
                ModalManager.closeModal('slipVerificationModal');
                NotificationManager.showToast('Payment rejected and reason logged.');
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res?.message || 'Failed to reject payment.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error rejecting payment.', true);
        }
    },

    calcBalanceDisplay() {
        const total = parseFloat(document.getElementById('recordTotalAmount')?.value || 0);
        const deposit = parseFloat(document.getElementById('recordDepositAmount')?.value || 0);
        const amtInput = document.getElementById('recordAmount');
        if (amtInput && (!amtInput.value || amtInput.value == 0)) {
            amtInput.value = deposit > 0 ? deposit : total;
        }
    },

    openRecordPaymentModal(invId = null) {
        ModalManager.openModal('recordPaymentModal');
        this.renderInvoiceSelectDropdown();

        const form = document.getElementById('formRecordPayment');
        if (form) form.reset();

        const dateInput = document.getElementById('recordDate');
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

        const refInput = document.getElementById('recordRef');
        if (refInput) refInput.value = 'TX-' + Math.floor(100000 + Math.random() * 900000);

        const select = document.getElementById('recordInvId') || document.getElementById('recordPaymentInvoiceSelect');
        if (invId && select) {
            select.value = invId;
            this.onRecordInvoiceSelectChange();
        }
    },

    onRecordInvoiceSelectChange() {
        const select = document.getElementById('recordInvId') || document.getElementById('recordPaymentInvoiceSelect');
        if (!select) return;

        const selectedOption = select.options[select.selectedIndex];
        const custInput = document.getElementById('recordCustName');
        const bookingRefInput = document.getElementById('recordBookingRef');
        const totalInput = document.getElementById('recordTotalAmount');
        const depositInput = document.getElementById('recordDepositAmount');
        const amtInput = document.getElementById('recordAmount');

        if (selectedOption && selectedOption.value) {
            const amount = parseFloat(selectedOption.getAttribute('data-amount') || '0');
            const customer = selectedOption.getAttribute('data-customer') || 'Customer';
            const invNum = selectedOption.getAttribute('data-invoicenum') || '';

            if (custInput) custInput.value = customer;
            if (bookingRefInput) bookingRefInput.value = invNum;
            if (totalInput) totalInput.value = amount;
            if (depositInput) depositInput.value = (amount * 0.5).toFixed(0);
            if (amtInput) amtInput.value = (amount * 0.5).toFixed(0);
        }
    },

    async handleRecordPaymentSubmit(e) {
        if (e) e.preventDefault();

        const invSelectEl = document.getElementById('recordInvId') || document.getElementById('recordPaymentInvoiceSelect');
        const bookingRefEl = document.getElementById('recordBookingRef');
        const custNameEl = document.getElementById('recordCustName');
        const totalAmountEl = document.getElementById('recordTotalAmount');
        const depositAmountEl = document.getElementById('recordDepositAmount');
        const amountEl = document.getElementById('recordAmount') || document.getElementById('recordPaymentAmountInput');
        const refEl = document.getElementById('recordRef');
        const dateEl = document.getElementById('recordDate');
        const notesEl = document.getElementById('recordNotes');

        const invoiceIdVal = invSelectEl?.value;
        const bookingRef = (bookingRefEl?.value || '').trim() || (invoiceIdVal ? `INV #${invoiceIdVal}` : 'MANUAL-PAY');
        const customerName = (custNameEl?.value || '').trim();
        const totalAmount = parseFloat(totalAmountEl?.value || amountEl?.value || 0);
        const depositAmount = depositAmountEl?.value ? parseFloat(depositAmountEl.value) : parseFloat(amountEl?.value || 0);
        const amountVal = parseFloat(amountEl?.value || 0);
        let methodVal = document.getElementById('recordMethod')?.value || 'CASH';
        const transactionRef = (refEl?.value || '').trim();

        if (methodVal === 'CARD_POS') methodVal = 'CARD_POS';
        if (methodVal === 'CHEQUE') methodVal = 'BANK_TRANSFER';

        if (!customerName) {
            return FormValidator.markInvalid(custNameEl, 'Please enter customer name.');
        }

        const aVal = FormValidator.validateNumber(amountVal, 'Payment Amount (LKR)', 1);
        if (!aVal.valid) return FormValidator.markInvalid(amountEl, aVal.message);

        const rVal = FormValidator.validateText(transactionRef, 'Payment Reference / Ref #', 2);
        if (!rVal.valid) return FormValidator.markInvalid(refEl, rVal.message);

        try {
            const invoiceId = invoiceIdVal && parseInt(invoiceIdVal, 10) > 0 ? parseInt(invoiceIdVal, 10) : 1;
            const res = await ApiService.billing.recordPayment({
                invoiceId,
                bookingRef,
                customerName,
                totalAmount: totalAmount > 0 ? totalAmount : amountVal,
                depositAmount,
                amountPaid: amountVal,
                paymentMethod: methodVal,
                transactionRef,
                notes: notesEl?.value || ''
            });

            if (res && res.success) {
                ModalManager.closeModal('recordPaymentModal');
                NotificationManager.showToast('Payment transaction recorded successfully!');
                NotificationManager.addNotification('Payment Verified', `Settlement of ${Utils.formatCurrency(amountVal)} for ${bookingRef} recorded`, 'fa-receipt');
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to record payment.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error recording payment.', true);
        }
    },

    openRefundModal(id) {
        const p = this.payments.find(pay => pay.id === id);
        if (!p) return;

        const idField = document.getElementById('refundPaymentId');
        const txEl = document.getElementById('refundTxDisplay');
        const bookEl = document.getElementById('refundBookingDisplay');
        const custEl = document.getElementById('refundCustDisplay');
        const amtEl = document.getElementById('refundAmountDisplay');
        const reasonInput = document.getElementById('refundReasonInput');

        if (idField) idField.value = p.id;
        if (txEl) txEl.textContent = `#PAY-${p.id} (${p.transactionRef || '-'})`;
        if (bookEl) bookEl.textContent = p.bookingRef || `INV #${p.invoiceId}`;
        if (custEl) custEl.textContent = p.customerName || 'Valued Client';
        if (amtEl) amtEl.textContent = Utils.formatCurrency(p.amountPaid || p.totalAmount);
        if (reasonInput) reasonInput.value = '';

        ModalManager.openModal('refundPaymentModal');
    },

    async handleRefundSubmit(e) {
        if (e) e.preventDefault();

        const id = document.getElementById('refundPaymentId')?.value;
        const reasonEl = document.getElementById('refundReasonInput');
        const reason = (reasonEl?.value || '').trim();

        if (!id) {
            NotificationManager.showToast('Invalid payment selected for refund.', true);
            return;
        }

        const rVal = FormValidator.validateText(reason, 'Refund Reason & Justification', 5);
        if (!rVal.valid) return FormValidator.markInvalid(reasonEl, rVal.message);

        try {
            const res = await ApiService.billing.processRefund(parseInt(id, 10), reason);
            if (res && res.success) {
                ModalManager.closeModal('refundPaymentModal');
                NotificationManager.showToast('Payment successfully refunded and recorded!');
                NotificationManager.addNotification('Refund Processed', `Payment #PAY-${id} refunded: ${reason}`, 'fa-arrow-rotate-left');
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to process refund.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error processing refund.', true);
        }
    },

    exportPaymentsCSV() {
        if (!this.payments || this.payments.length === 0) {
            NotificationManager.showToast('No payment records to export.', true);
            return;
        }

        const headers = ['Payment ID', 'Booking Ref', 'Invoice #', 'Customer Name', 'Payment Method', 'Total Amount', 'Deposit Amount', 'Balance Amount', 'Amount Paid', 'Reference', 'Status', 'Date'];
        const rows = this.payments.map(p => [
            `#PAY-${p.id}`,
            `"${p.bookingRef || '-'}"`,
            `"${p.invoiceNumber || 'INV #' + p.invoiceId}"`,
            `"${p.customerName || '-'}"`,
            `"${p.paymentMethod || 'CASH'}"`,
            p.totalAmount || p.amountPaid,
            p.depositAmount || p.amountPaid,
            p.balanceAmount || 0,
            p.amountPaid,
            `"${p.transactionRef || '-'}"`,
            `"${p.status || 'PAID'}"`,
            `"${p.paymentDate || ''}"`
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `grand_monarch_payments_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        NotificationManager.showToast('Payments CSV exported successfully!');
    },

    openPaymentModal(invId, invNum, amount) {
        const idField = document.getElementById('pInvoiceId');
        const numField = document.getElementById('pInvoiceNum');
        const amtField = document.getElementById('pAmount');

        if (idField) idField.value = invId || '';
        if (numField) numField.value = invNum || ('INV #' + invId);
        if (amtField) amtField.value = amount || '';

        ModalManager.openModal('paymentModal');
    },

    togglePaymentFields() {
        const method = document.getElementById('pMethod')?.value;
        const slipBox = document.getElementById('bankSlipContainer');
        if (slipBox) {
            slipBox.style.display = (method === 'BANK_TRANSFER') ? 'block' : 'none';
        }
    },

    previewBankSlip(event) {
        const file = event?.target?.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const previewContainer = document.getElementById('slipPreviewContainer');
            const previewImg = document.getElementById('slipPreviewImg');
            if (previewContainer && previewImg) {
                previewImg.src = e.target.result;
                previewContainer.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    },

    async handlePaymentSubmit(e) {
        if (e) e.preventDefault();

        const invIdEl = document.getElementById('pInvoiceId');
        const amountEl = document.getElementById('pAmount');
        const bankRefEl = document.getElementById('pBankRef');

        const invoiceIdVal = invIdEl?.value;
        const amountVal = amountEl?.value;
        let methodVal = document.getElementById('pMethod')?.value || 'CASH';
        const bankRef = (bankRefEl?.value || '').trim();

        if (methodVal === 'CARD_POS') methodVal = 'CREDIT_CARD';
        if (methodVal === 'CHEQUE') methodVal = 'BANK_TRANSFER';

        if (!invoiceIdVal || isNaN(parseInt(invoiceIdVal, 10))) {
            NotificationManager.showToast('Invalid invoice selected.', true);
            return;
        }

        const aVal = FormValidator.validateNumber(amountVal, 'Amount to Pay (LKR)', 1);
        if (!aVal.valid) return FormValidator.markInvalid(amountEl, aVal.message);

        if (methodVal === 'BANK_TRANSFER') {
            const refVal = FormValidator.validateText(bankRef, 'Bank Transfer Reference Number', 4);
            if (!refVal.valid) return FormValidator.markInvalid(bankRefEl, refVal.message);
        }

        try {
            const res = await ApiService.billing.recordPayment({
                invoiceId: parseInt(invoiceIdVal, 10),
                amountPaid: parseFloat(amountVal),
                paymentMethod: methodVal,
                transactionRef: bankRef || ('TX-' + Date.now())
            });

            if (res && res.success) {
                ModalManager.closeModal('paymentModal');
                NotificationManager.showToast('Payment submitted successfully!');
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to submit payment.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error submitting payment.', true);
        }
    },

    async deletePayment(id) {
        if (!confirm('Are you sure you want to void / delete this payment transaction?')) return;

        try {
            const res = await ApiService.billing.deletePayment(id);
            if (res && res.success) {
                NotificationManager.showToast('Payment record removed successfully.');
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to delete payment.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error deleting payment.', true);
        }
    },

    /* =========================================================================
       RECEIPTS SECTION
       ========================================================================= */
    renderReceiptsTable() {
        const tbody = document.getElementById('receiptsTableBody');
        if (!tbody) return;

        const data = this.receipts.length > 0 ? this.receipts : this.payments;

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:24px; color:#d1d5d0;">No receipts issued yet.</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(r => {
            const receiptCode = r.receiptNumber || ('REC-' + r.id);
            const invRef = r.invoiceNumber || ('INV #' + (r.invoiceId || '-'));
            const method = r.paymentMethod || 'CASH';
            const amount = r.amount || r.amountPaid || 0;
            const date = r.issuedAt || r.paymentDate || 'Verified';

            return `
            <tr>
                <td class="text-left" style="white-space:nowrap;"><strong>${Utils.escapeHtml(receiptCode)}</strong></td>
                <td class="text-left" style="white-space:nowrap;">${Utils.escapeHtml(invRef)}</td>
                <td class="text-left">${Utils.escapeHtml(r.customerName || 'Customer #' + (r.customerId || '-'))}</td>
                <td class="text-right" style="white-space:nowrap;"><strong style="color:#16a34a;">${Utils.formatCurrency(amount)}</strong></td>
                <td class="text-center" style="white-space:nowrap;"><span class="badge" style="background:rgba(212, 175, 55, 0.15); color:#e6dfd5;">${method}</span></td>
                <td class="text-center" style="white-space:nowrap;">${Utils.formatDate(date)}</td>
                <td class="text-center" style="white-space:nowrap;">
                    <button class="btn-primary" style="padding:4px 10px; font-size:0.75rem;" onclick="BillingComponent.printReceipt(${r.id})">
                        <i class="fa-solid fa-print"></i> Print
                    </button>
                </td>
            </tr>
            `;
        }).join('');
    },

    printReceipt(id) {
        // Try finding in receipts first, then in payments
        const receipt = this.receipts.find(r => r.id === id);
        const payment = this.payments.find(p => p.id === id);

        const receiptCode = receipt?.receiptNumber || ('REC-' + id);
        const invRef = receipt?.invoiceNumber || payment?.invoiceNumber || ('INV #' + (receipt?.invoiceId || payment?.invoiceId || '-'));
        const method = receipt?.paymentMethod || payment?.paymentMethod || 'CASH';
        const amount = receipt?.amount || payment?.amountPaid || 0;
        const date = receipt?.issuedAt || payment?.paymentDate || new Date().toLocaleDateString();
        const customer = receipt?.customerName || payment?.customerName || 'Valued Client';

        const container = document.getElementById('receiptModalContent') || document.getElementById('printableReceiptContent');
        if (container) {
            container.innerHTML = `
                <div style="text-align:center; padding:15px; border-bottom:1px dashed rgba(212, 175, 55, 0.25);">
                    <h3 style="margin:0; color:#e6dfd5; letter-spacing:1px;">GRAND MONARCH PAVILION</h3>
                    <p style="margin:2px 0 0 0; font-size:0.8rem; color:#b0b8b4;">Official Payment & Clearance Receipt</p>
                </div>
                <div style="padding:15px 0; font-size:0.9rem; line-height:1.8;">
                    <div style="display:flex; justify-content:space-between;">
                        <span>Receipt Code:</span> <strong>${Utils.escapeHtml(receiptCode)}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Invoice Reference:</span> <span>${Utils.escapeHtml(invRef)}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Client:</span> <span>${Utils.escapeHtml(customer)}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Payment Mode:</span> <span class="badge" style="background:#e0f2fe; color:#0369a1;">${method}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Payment Date:</span> <span>${Utils.formatDate(date)}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:10px; padding-top:10px; border-top:2px solid #d4af37; font-size:1.15rem; font-weight:800;">
                        <span>Amount Settled:</span> <span style="color:#16a34a;">${Utils.formatCurrency(amount)}</span>
                    </div>
                </div>
                <div style="text-align:center; font-size:0.75rem; color:#b0b8b4; margin-top:12px; border-top:1px dashed rgba(212, 175, 55, 0.25); padding-top:10px;">
                    This computer-generated receipt certifies full payment receipt.
                </div>
            `;
            ModalManager.openModal(document.getElementById('receiptModal') ? 'receiptModal' : 'viewReceiptModal');
        }
    },

    /* =========================================================================
       FINANCIAL REPORTS SECTION
       ========================================================================= */
    switchReportTab(tab) {
        this.activeReportTab = tab;

        const salesBtn = document.getElementById('tabSalesReportBtn');
        const payBtn = document.getElementById('tabPaymentReportBtn');
        const monthlyBtn = document.getElementById('tabMonthlyReportBtn');

        [salesBtn, payBtn, monthlyBtn].forEach(b => {
            if (b) {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            }
        });

        if (tab === 'sales' && salesBtn) {
            salesBtn.classList.remove('btn-secondary');
            salesBtn.classList.add('btn-primary');
        } else if (tab === 'payments' && payBtn) {
            payBtn.classList.remove('btn-secondary');
            payBtn.classList.add('btn-primary');
        } else if (tab === 'monthly' && monthlyBtn) {
            monthlyBtn.classList.remove('btn-secondary');
            monthlyBtn.classList.add('btn-primary');
        }

        this.renderReportView();
    },

    renderReportView() {
        const container = document.getElementById('reportContentView');
        if (!container) return;

        const rep = this.financialData || {};
        const revenue = rep.totalRevenue || 0;
        const pending = rep.pendingAmount || 0;
        const invoiced = rep.totalInvoiced || 0;
        const totalPayments = rep.totalPaymentsCount || this.payments.length;
        const totalInvoices = rep.totalInvoicesCount || this.invoices.length;

        if (this.activeReportTab === 'sales') {
            container.innerHTML = `
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-bottom:24px;">
                    <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:12px; padding:18px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                        <div style="font-size:0.75rem; color:#b0b8b4; font-weight:700; text-transform:uppercase;">Gross Invoiced Sales</div>
                        <div style="font-size:1.4rem; font-weight:800; color:#e6dfd5; margin-top:6px;">${Utils.formatCurrency(invoiced)}</div>
                        <div style="font-size:0.75rem; color:#16a34a; margin-top:4px;"><i class="fa-solid fa-file-invoice"></i> ${totalInvoices} Invoices Generated</div>
                    </div>
                    <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:12px; padding:18px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                        <div style="font-size:0.75rem; color:#b0b8b4; font-weight:700; text-transform:uppercase;">Net Realized Revenue</div>
                        <div style="font-size:1.4rem; font-weight:800; color:#16a34a; margin-top:6px;">${Utils.formatCurrency(revenue)}</div>
                        <div style="font-size:0.75rem; color:#b0b8b4; margin-top:4px;"><i class="fa-solid fa-check-double"></i> Settled in Full</div>
                    </div>
                    <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:12px; padding:18px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                        <div style="font-size:0.75rem; color:#b0b8b4; font-weight:700; text-transform:uppercase;">Outstanding Receivables</div>
                        <div style="font-size:1.4rem; font-weight:800; color:#d97706; margin-top:6px;">${Utils.formatCurrency(pending)}</div>
                        <div style="font-size:0.75rem; color:#d97706; margin-top:4px;"><i class="fa-solid fa-clock"></i> Pending Settlement</div>
                    </div>
                </div>

                <h4 style="margin:0 0 14px 0; color:#e6dfd5; font-weight:800;"><i class="fa-solid fa-list-check" style="color:var(--text-gold);"></i> Invoiced Sales Ledger</h4>
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Client</th>
                                <th>Service Category</th>
                                <th class="text-right">Subtotal</th>
                                <th class="text-right">Tax</th>
                                <th class="text-right">Total Payable</th>
                                <th class="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.invoices.map(i => `
                                <tr>
                                    <td><strong>${Utils.escapeHtml(i.invoiceNumber)}</strong></td>
                                    <td>${Utils.escapeHtml(i.customerName || 'Customer #' + i.customerId)}</td>
                                    <td><span class="badge" style="background:rgba(212, 175, 55, 0.15); color:#e6dfd5;">${i.bookingType}</span></td>
                                    <td class="text-right">${Utils.formatCurrency(i.subtotal)}</td>
                                    <td class="text-right">${Utils.formatCurrency(i.taxAmount)}</td>
                                    <td class="text-right"><strong>${Utils.formatCurrency(i.totalAmount)}</strong></td>
                                    <td class="text-center"><span class="badge badge-${this.getStatusClass(i.status)}">${i.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else if (this.activeReportTab === 'payments') {
            const methodBreakdown = rep.revenueByMethod || {};
            const methodKeys = Object.keys(methodBreakdown);

            container.innerHTML = `
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:24px;">
                    ${methodKeys.length > 0 ? methodKeys.map(m => `
                        <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:12px; padding:18px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                            <div style="font-size:0.75rem; color:#b0b8b4; font-weight:700; text-transform:uppercase;"><i class="fa-solid fa-credit-card"></i> ${m}</div>
                            <div style="font-size:1.3rem; font-weight:800; color:#e6dfd5; margin-top:6px;">${Utils.formatCurrency(methodBreakdown[m])}</div>
                        </div>
                    `).join('') : `
                        <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:12px; padding:18px;">
                            <div style="font-size:0.75rem; color:#b0b8b4; font-weight:700;">TOTAL CASH & ONLINE</div>
                            <div style="font-size:1.3rem; font-weight:800; color:#16a34a; margin-top:6px;">${Utils.formatCurrency(revenue)}</div>
                        </div>
                    `}
                </div>

                <h4 style="margin:0 0 14px 0; color:#e6dfd5; font-weight:800;"><i class="fa-solid fa-receipt" style="color:var(--text-gold);"></i> Payment Receipts & Collections</h4>
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Trans ID</th>
                                <th>Invoice</th>
                                <th>Channel</th>
                                <th class="text-right">Settled Amount</th>
                                <th>Transaction Ref</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.payments.map(p => `
                                <tr>
                                    <td><strong>#PAY-${p.id}</strong></td>
                                    <td>${Utils.escapeHtml(p.invoiceNumber || 'INV #' + p.invoiceId)}</td>
                                    <td><span class="badge" style="background:#e0f2fe; color:#0369a1;">${p.paymentMethod}</span></td>
                                    <td class="text-right"><strong style="color:#16a34a;">${Utils.formatCurrency(p.amountPaid)}</strong></td>
                                    <td>${Utils.escapeHtml(p.transactionRef || '-')}</td>
                                    <td>${Utils.formatDate(p.paymentDate)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            // Monthly Statement
            container.innerHTML = `
                <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:14px; padding:24px; box-shadow:0 4px 15px rgba(0,0,0,0.04);">
                    <div style="border-bottom:2px solid #d4af37; padding-bottom:14px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <h3 style="margin:0; color:#e6dfd5; font-weight:800;">Monthly Hospitality Financial Statement</h3>
                            <p style="margin:4px 0 0 0; color:#b0b8b4; font-size:0.85rem;">Grand Monarch Pavilion • Operational Fiscal Summary</p>
                        </div>
                        <span class="badge badge-success" style="font-size:0.85rem; padding:6px 12px;">ACTIVE AUDIT PASS</span>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px;">
                        <div style="padding:16px; background:#121816; border-radius:10px;">
                            <div style="font-size:0.85rem; color:#b0b8b4; margin-bottom:8px;">Total Invoiced Sales:</div>
                            <div style="font-size:1.3rem; font-weight:800; color:#e6dfd5;">${Utils.formatCurrency(invoiced)}</div>
                            <div style="font-size:0.85rem; color:#b0b8b4; margin-top:14px; margin-bottom:8px;">Total Cash & Card Realized:</div>
                            <div style="font-size:1.3rem; font-weight:800; color:#16a34a;">${Utils.formatCurrency(revenue)}</div>
                        </div>
                        <div style="padding:16px; background:#121816; border-radius:10px;">
                            <div style="font-size:0.85rem; color:#b0b8b4; margin-bottom:8px;">Pending Accounts Receivable:</div>
                            <div style="font-size:1.3rem; font-weight:800; color:#d97706;">${Utils.formatCurrency(pending)}</div>
                            <div style="font-size:0.85rem; color:#b0b8b4; margin-top:14px; margin-bottom:8px;">Total Processed Transactions:</div>
                            <div style="font-size:1.3rem; font-weight:800; color:#e6dfd5;">${totalPayments} settled / ${totalInvoices} billed</div>
                        </div>
                    </div>

                    <div style="padding:14px; background:#fefce8; border:1px solid #fef08a; border-radius:10px; font-size:0.85rem; color:#854d0e;">
                        <i class="fa-solid fa-circle-info"></i> All transactions are fully audited and synchronized in real-time with the local MySQL database.
                    </div>
                </div>
            `;
        }
    },

    exportFinancialReport() {
        const rep = this.financialData || {};
        let csv = '=== GRAND MONARCH PAVILION FINANCIAL REPORT ===\n\n';
        csv += `Report Generated,${new Date().toISOString()}\n`;
        csv += `Total Invoiced Sales,${rep.totalInvoiced || 0}\n`;
        csv += `Total Realized Revenue,${rep.totalRevenue || 0}\n`;
        csv += `Pending Receivables,${rep.pendingAmount || 0}\n\n`;

        csv += '=== INVOICES SUMMARY ===\n';
        csv += 'Invoice Number,Customer,Service,Subtotal,Tax,Total Amount,Status\n';
        this.invoices.forEach(i => {
            csv += `"${i.invoiceNumber}","${i.customerName || i.customerId}","${i.bookingType}",${i.subtotal},${i.taxAmount},${i.totalAmount},${i.status}\n`;
        });

        csv += '\n=== PAYMENTS & COLLECTIONS ===\n';
        csv += 'Payment ID,Invoice Ref,Method,Amount Paid,Transaction Ref,Date\n';
        this.payments.forEach(p => {
            csv += `PAY-${p.id},"${p.invoiceNumber || p.invoiceId}",${p.paymentMethod},${p.amountPaid},"${p.transactionRef || ''}","${p.paymentDate || ''}"\n`;
        });

        Utils.downloadCSV(csv, `GrandMonarch_FinancialReport_${Date.now()}.csv`);
    },

    getStatusClass(status) {
        switch ((status || '').toUpperCase()) {
            case 'PAID': return 'success';
            case 'PARTIALLY_PAID': return 'warning';
            case 'CANCELLED': return 'danger';
            default: return 'danger';
        }
    },

    exportPaymentsCSV() {
        if (this.payments.length === 0) {
            NotificationManager.showToast('No payment records to export.', true);
            return;
        }
        let csv = 'Payment ID,Invoice Ref,Customer,Payment Method,Amount Paid,Transaction Ref,Date\n';
        this.payments.forEach(p => {
            csv += `PAY-${p.id},"${p.invoiceNumber || p.invoiceId}","${p.customerName || ''}",${p.paymentMethod},${p.amountPaid},"${p.transactionRef || ''}","${p.paymentDate || ''}"\n`;
        });
        Utils.downloadCSV(csv, `GrandMonarch_Payments_${Date.now()}.csv`);
    },

    exportInvoicesCSV() {
        if (this.invoices.length === 0) {
            NotificationManager.showToast('No invoice records to export.', true);
            return;
        }
        let csv = 'Invoice Number,Customer,Booking Type,Subtotal,Tax,Total,Status,Created At\n';
        this.invoices.forEach(i => {
            csv += `"${i.invoiceNumber}","${i.customerName || i.customerId}","${i.bookingType}",${i.subtotal},${i.taxAmount},${i.totalAmount},${i.status},"${i.createdAt || ''}"\n`;
        });
        Utils.downloadCSV(csv, `GrandMonarch_Invoices_${Date.now()}.csv`);
    }
};

window.BillingComponent = BillingComponent;
window.openInvoiceModal = BillingComponent.openInvoiceModal.bind(BillingComponent);
window.handleInvoiceSubmit = BillingComponent.handleInvoiceSubmit.bind(BillingComponent);
window.openRecordPaymentModal = BillingComponent.openRecordPaymentModal.bind(BillingComponent);
window.onRecordInvoiceSelectChange = BillingComponent.onRecordInvoiceSelectChange.bind(BillingComponent);
window.handleRecordPaymentSubmit = BillingComponent.handleRecordPaymentSubmit.bind(BillingComponent);
window.openPaymentModal = BillingComponent.openPaymentModal.bind(BillingComponent);
window.togglePaymentFields = BillingComponent.togglePaymentFields.bind(BillingComponent);
window.previewBankSlip = BillingComponent.previewBankSlip.bind(BillingComponent);
window.handlePaymentSubmit = BillingComponent.handlePaymentSubmit.bind(BillingComponent);
window.viewPrintableInvoice = BillingComponent.viewPrintableInvoice.bind(BillingComponent);
window.printReceipt = BillingComponent.printReceipt.bind(BillingComponent);
window.exportPaymentsCSV = BillingComponent.exportPaymentsCSV.bind(BillingComponent);
window.exportInvoicesCSV = BillingComponent.exportInvoicesCSV.bind(BillingComponent);
window.exportFinancialReport = BillingComponent.exportFinancialReport.bind(BillingComponent);
window.renderInvoicesTable = BillingComponent.renderInvoicesTable.bind(BillingComponent);
window.renderPaymentsTable = BillingComponent.renderPaymentsTable.bind(BillingComponent);
window.renderReceiptsTable = BillingComponent.renderReceiptsTable.bind(BillingComponent);
window.switchPaymentTab = (tab) => BillingComponent.switchPaymentTab(tab);
window.loadPendingQueue = () => BillingComponent.loadPendingQueue();
window.openReceiptPreviewModal = (id) => BillingComponent.openReceiptPreviewModal(id);
window.handleApproveBankSlip = () => BillingComponent.handleApproveFromModal();
window.handleRejectBankSlip = () => BillingComponent.handleRejectFromModal();
window.switchReportTab = (tab) => BillingComponent.switchReportTab(tab);
window.loadReports = (period) => BillingComponent.loadReports(period);

window.toggleResPaymentSlipFields = function() {
    const method = document.getElementById('rPaymentMethod')?.value;
    const box = document.getElementById('resBankSlipContainer');
    if (box) {
        box.style.display = (method === 'BANK_TRANSFER') ? 'block' : 'none';
    }
};

window.previewReservationSlip = function(event) {
    const file = event?.target?.files?.[0];
    if (!file) return;

    const previewContainer = document.getElementById('rSlipPreviewContainer');
    const previewImg = document.getElementById('rSlipPreviewImg');
    const pdfBadge = document.getElementById('rSlipPdfBadge');

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        if (previewImg) previewImg.style.display = 'none';
        if (pdfBadge) {
            pdfBadge.style.display = 'block';
            pdfBadge.innerHTML = `<i class="fa-solid fa-file-pdf"></i> Attached: <strong>${Utils.escapeHtml(file.name)}</strong> (${(file.size / 1024).toFixed(1)} KB)`;
        }
        if (previewContainer) previewContainer.style.display = 'block';
    } else {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (pdfBadge) pdfBadge.style.display = 'none';
            if (previewImg) {
                previewImg.src = e.target.result;
                previewImg.style.display = 'inline-block';
            }
            if (previewContainer) previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
};
