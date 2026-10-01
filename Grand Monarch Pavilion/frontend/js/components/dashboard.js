/**
 * Dashboard Component
 * Renders real-time operational, financial, and customer metrics from MySQL.
 */

const DashboardComponent = {
    clockTimer: null,

    async load() {
        this.initClock();
        try {
            const stats = await ApiService.dashboard.getStats();
            this.renderKPIs(stats);
            this.renderRoleViews(stats);
            await this.renderRecentTables();
        } catch (error) {
            console.error('[Dashboard Error]', error);
        }
    },

    initClock() {
        const update = () => {
            const now = new Date();
            const timeEl = document.getElementById('dashClockTime');
            const dateEl = document.getElementById('dashClockDate');
            if (timeEl) timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            if (dateEl) dateEl.textContent = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        };
        update();
        if (!this.clockTimer) {
            this.clockTimer = setInterval(update, 1000);
        }
    },

    renderKPIs(stats) {
        if (!stats) return;

        // Admin Stats Grid
        const userEls = [document.getElementById('statUsers'), document.getElementById('statTotalUsers')].filter(Boolean);
        userEls.forEach(el => el.textContent = stats.totalUsers ?? 0);

        const resEls = [document.getElementById('statReservations'), document.getElementById('statTotalReservations')].filter(Boolean);
        resEls.forEach(el => el.textContent = stats.diningReservations ?? (stats.totalReservations ?? 0));

        const evtEls = [document.getElementById('statEvents'), document.getElementById('statTotalEvents')].filter(Boolean);
        evtEls.forEach(el => el.textContent = stats.totalEvents ?? 0);

        const revEls = [document.getElementById('statRevenue'), document.getElementById('statTotalRevenue')].filter(Boolean);
        revEls.forEach(el => el.textContent = Utils.formatCurrency(stats.totalRevenue ?? 0));

        // Finance Stats Grid
        const finSales = document.getElementById('finTotalSales');
        const finPayments = document.getElementById('finTotalPayments');
        const finPaid = document.getElementById('finPaidPayments');
        const finPending = document.getElementById('finPendingPayments');
        const finInvoiced = document.getElementById('finTotalInvoiced');
        const finOutstanding = document.getElementById('finOutstandingAmount');

        if (finSales) finSales.textContent = Utils.formatCurrency(stats.totalRevenue ?? 0);
        if (finPayments) finPayments.textContent = stats.totalPaymentsCount ?? 1;
        if (finPaid) finPaid.textContent = stats.paidPaymentsCount ?? 1;
        if (finPending) finPending.textContent = Utils.formatCurrency(stats.pendingAmount ?? 0);
        if (finInvoiced) finInvoiced.textContent = Utils.formatCurrency(stats.totalInvoiced ?? stats.totalRevenue ?? 0);
        if (finOutstanding) finOutstanding.textContent = Utils.formatCurrency(stats.pendingAmount ?? 0);
    },

    renderRoleViews(stats) {
        const user = AuthManager.currentUser;
        if (!user) return;

        const role = (user.role || 'CUSTOMER').toUpperCase();
        const roleBannerEl = document.getElementById('dashboardRoleBanner');
        if (roleBannerEl) {
            roleBannerEl.textContent = role === 'CUSTOMER' ? 'VIP GUEST PORTAL' : `${role.replace(/_/g, ' ')} EXECUTIVE CONSOLE`;
        }

        const titleEl = document.getElementById('dashTitle');
        const subEl = document.getElementById('dashSub');
        if (titleEl) {
            titleEl.textContent = role === 'CUSTOMER' 
                ? `Welcome, ${user.fullName || user.username}` 
                : `Enterprise Operations Overview`;
        }
        if (subEl) {
            subEl.textContent = role === 'CUSTOMER' 
                ? `Grand Monarch Pavilion • VIP Guest Console • Member #CUST-${user.id}` 
                : `Real-time analytics for restaurant reservations, event bookings, and revenue tracking`;
        }

        const adminGrid = document.getElementById('adminStatsGrid');
        const adminPanel = document.getElementById('adminRecentPanel');
        const finGrid = document.getElementById('finStatsGrid');
        const finPanel = document.getElementById('finRecentPanel');
        const opsGrid = document.getElementById('opsStatsGrid');
        const opsPanel = document.getElementById('opsRecentPanel');
        const custGrid = document.getElementById('custStatsGrid');
        const custPanel = document.getElementById('custRecentPanel');
        const custBanner = document.getElementById('custQuickActionsBanner');

        // Hide all views first
        [adminGrid, adminPanel, finGrid, finPanel, opsGrid, opsPanel, custGrid, custPanel, custBanner].forEach(el => {
            if (el) el.style.display = 'none';
        });

        if (role === 'CUSTOMER') {
            if (custBanner) custBanner.style.display = 'flex';
            if (custGrid) custGrid.style.display = 'grid';
            if (custPanel) custPanel.style.display = 'flex';
        } else if (role === 'FINANCE_OFFICER') {
            if (finGrid) finGrid.style.display = 'grid';
            if (finPanel) finPanel.style.display = 'flex';
        } else if (role === 'OPERATIONS_SUPERVISOR') {
            if (opsGrid) opsGrid.style.display = 'grid';
            if (opsPanel) opsPanel.style.display = 'flex';
        } else {
            // ADMIN / COORDINATOR
            if (adminGrid) adminGrid.style.display = 'grid';
            if (adminPanel) adminPanel.style.display = 'block';
        }
    },

    async renderRecentTables() {
        try {
            const user = AuthManager.currentUser;
            const role = (user?.role || 'CUSTOMER').toUpperCase();

            // 1. Customer-Specific Portal Dashboard View
            if (role === 'CUSTOMER' && user) {
                const [custRes, custEvt, custInv] = await Promise.all([
                    ApiService.reservations.getByCustomer(user.id).catch(() => []),
                    ApiService.events.getByCustomer(user.id).catch(() => []),
                    ApiService.billing.getInvoices(user.id).catch(() => [])
                ]);

                // Update customer stats KPI cards
                const statResEl = document.getElementById('custStatRes');
                const statEvtEl = document.getElementById('custStatEvt');
                const statPendingEl = document.getElementById('custStatPending');
                const statConfirmedEl = document.getElementById('custStatConfirmed');
                const statUnpaidEl = document.getElementById('custStatUnpaid');

                const pendingCount = custRes.filter(r => (r.status || '').toUpperCase() === 'PENDING').length +
                                     custEvt.filter(e => (e.status || '').toUpperCase() === 'PENDING').length;

                const confirmedCount = custRes.filter(r => ['CONFIRMED', 'SEATED'].includes((r.status || '').toUpperCase())).length +
                                       custEvt.filter(e => ['APPROVED', 'SCHEDULED'].includes((e.status || '').toUpperCase())).length;

                const unpaidTotal = custInv.filter(i => (i.status || '').toUpperCase() !== 'PAID')
                                           .reduce((sum, i) => sum + (parseFloat(i.totalAmount) || 0), 0);

                if (statResEl) statResEl.textContent = custRes.length;
                if (statEvtEl) statEvtEl.textContent = custEvt.length;
                if (statPendingEl) statPendingEl.textContent = pendingCount;
                if (statConfirmedEl) statConfirmedEl.textContent = confirmedCount;
                if (statUnpaidEl) statUnpaidEl.textContent = Utils.formatCurrency(unpaidTotal);

                // Render Customer Upcoming Reservations Table
                const custResBody = document.getElementById('custDashReservationsBody');
                if (custResBody) {
                    if (custRes.length === 0) {
                        custResBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:24px; color:#d1d5d0;"><i class="fa-solid fa-chair" style="font-size:1.8rem; margin-bottom:8px; display:block; opacity:0.5;"></i>No upcoming reservations found.<br><button class="btn-primary" style="margin-top:10px; padding:6px 16px; font-size:0.8rem;" onclick="openModal(\'reservationModal\')"><i class="fa-solid fa-plus"></i> Reserve a Table Now</button></td></tr>';
                    } else {
                        custResBody.innerHTML = custRes.map(r => `
                            <tr>
                                <td class="text-center"><strong>#RES-${r.id}</strong></td>
                                <td class="text-center">${Utils.formatDate(r.reservationDate)}</td>
                                <td class="text-center"><strong>${r.reservationTime ? r.reservationTime.substring(0, 5) : '-'}</strong></td>
                                <td class="text-center"><span class="badge" style="background:rgba(212, 175, 55, 0.15); color:#e6dfd5; font-weight:700;">Table ${Utils.escapeHtml(r.tableNumber || '-')}</span></td>
                                <td class="text-center">${r.partySize} Guests</td>
                                <td class="text-center"><span class="badge badge-${r.status === 'CONFIRMED' ? 'success' : (r.status === 'SEATED' ? 'info' : (r.status === 'CANCELLED' ? 'danger' : 'warning'))}">${r.status}</span></td>
                                <td class="text-center" style="white-space:nowrap;">
                                    ${['PENDING', 'CONFIRMED'].includes((r.status || '').toUpperCase()) ? `
                                        <button class="btn-secondary" style="padding:4px 8px; font-size:0.72rem; color:#dc2626;" onclick="ReservationsComponent.updateStatus(${r.id}, 'CANCELLED')" title="Cancel Reservation">
                                            <i class="fa-solid fa-ban"></i> Cancel
                                        </button>
                                    ` : '<span style="color:#d1d5d0; font-size:0.75rem;">-</span>'}
                                </td>
                            </tr>
                        `).join('');
                    }
                }

                // Render Customer Upcoming Events Table
                const custEvtBody = document.getElementById('custDashEventsBody');
                if (custEvtBody) {
                    if (custEvt.length === 0) {
                        custEvtBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:24px; color:#d1d5d0;"><i class="fa-solid fa-champagne-glasses" style="font-size:1.8rem; margin-bottom:8px; display:block; opacity:0.5;"></i>No events booked yet.<br><button class="btn-primary" style="margin-top:10px; padding:6px 16px; font-size:0.8rem; background:linear-gradient(135deg, #1e293b, #0f172a);" onclick="openModal(\'eventModal\')"><i class="fa-solid fa-plus"></i> Request an Event Booking</button></td></tr>';
                    } else {
                        custEvtBody.innerHTML = custEvt.map(e => `
                            <tr>
                                <td class="text-center"><strong>#EVT-${e.id}</strong></td>
                                <td class="text-left"><strong>${Utils.escapeHtml(e.eventTitle)}</strong></td>
                                <td class="text-center"><span class="badge" style="background:#e0f2fe; color:#0369a1;">${e.eventType}</span></td>
                                <td class="text-center">${Utils.formatDate(e.eventDate)} (${e.startTime ? e.startTime.substring(0, 5) : ''} - ${e.endTime ? e.endTime.substring(0, 5) : ''})</td>
                                <td class="text-center">${Utils.escapeHtml(e.venueName || 'Venue #' + e.venueId)}</td>
                                <td class="text-center">${e.expectedGuests} Guests</td>
                                <td class="text-center"><span class="badge badge-${e.status === 'APPROVED' ? 'success' : (e.status === 'CANCELLED' ? 'danger' : 'warning')}">${e.status}</span></td>
                            </tr>
                        `).join('');
                    }
                }

                // Render Customer Payment Overview Widget
                const custPaymentEl = document.getElementById('custPaymentOverviewContent');
                if (custPaymentEl) {
                    if (custInv.length === 0) {
                        custPaymentEl.innerHTML = '<div style="text-align:center; padding:20px; color:#d1d5d0;">No billing statements yet.</div>';
                    } else {
                        custPaymentEl.innerHTML = `
                            <div style="display:flex; flex-direction:column; gap:10px;">
                                ${custInv.slice(0, 4).map(inv => `
                                    <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:10px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                                        <div>
                                            <div style="font-weight:700; font-size:0.88rem; color:#e6dfd5;">${Utils.escapeHtml(inv.invoiceNumber)}</div>
                                            <div style="font-size:0.75rem; color:#b0b8b4;">${inv.bookingType} • Total: <strong style="color:var(--text-gold);">${Utils.formatCurrency(inv.totalAmount)}</strong></div>
                                        </div>
                                        <div style="display:flex; gap:8px; align-items:center;">
                                            <span class="badge badge-${inv.status === 'PAID' ? 'success' : 'warning'}">${inv.status}</span>
                                            ${inv.status !== 'PAID' ? `
                                                <button class="btn-primary" style="padding:5px 12px; font-size:0.75rem; background:linear-gradient(135deg, #d4af37, #b8860b);" onclick="BillingComponent.openRecordPaymentModal(${inv.id})">
                                                    <i class="fa-solid fa-credit-card"></i> Pay Now
                                                </button>
                                            ` : `
                                                <button class="btn-secondary" style="padding:5px 10px; font-size:0.75rem;" onclick="BillingComponent.viewPrintableInvoice(${inv.id})">
                                                    <i class="fa-solid fa-receipt"></i> View Receipt
                                                </button>
                                            `}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `;
                    }
                }

                // Render Customer Recent Notifications Log
                const custNotifEl = document.getElementById('custNotificationsLogContent');
                if (custNotifEl) {
                    custNotifEl.innerHTML = `
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-left:4px solid #22c55e; padding:10px 14px; border-radius:6px; font-size:0.82rem;">
                                <div style="font-weight:700; color:#e6dfd5;"><i class="fa-solid fa-crown" style="color:var(--text-gold);"></i> VIP Guest Access Active</div>
                                <div style="color:#b0b8b4; font-size:0.75rem;">Welcome to Grand Monarch Pavilion. You have priority access to reservation confirmations and culinary discounts.</div>
                            </div>
                            ${custRes.length > 0 ? `
                                <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-left:4px solid var(--text-gold); padding:10px 14px; border-radius:6px; font-size:0.82rem;">
                                    <div style="font-weight:700; color:#e6dfd5;"><i class="fa-solid fa-chair" style="color:var(--text-gold);"></i> Reservation: Table ${custRes[0].tableNumber || 'Selected'}</div>
                                    <div style="color:#b0b8b4; font-size:0.75rem;">Scheduled on ${Utils.formatDate(custRes[0].reservationDate)} at ${custRes[0].reservationTime ? custRes[0].reservationTime.substring(0, 5) : '-'}. Status: ${custRes[0].status}.</div>
                                </div>
                            ` : ''}
                            ${custEvt.length > 0 ? `
                                <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-left:4px solid #3b82f6; padding:10px 14px; border-radius:6px; font-size:0.82rem;">
                                    <div style="font-weight:700; color:#e6dfd5;"><i class="fa-solid fa-champagne-glasses" style="color:#3b82f6;"></i> Event Booking: ${custEvt[0].eventTitle}</div>
                                    <div style="color:#b0b8b4; font-size:0.75rem;">Date: ${Utils.formatDate(custEvt[0].eventDate)}. Venue: ${custEvt[0].venueName || 'Assigned'}. Status: ${custEvt[0].status}.</div>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }
                return;
            }

            // 2. Staff / Finance / Admin Operations View
            const [invoices, payments, events, reservations] = await Promise.all([
                ApiService.billing.getInvoices().catch(() => []),
                ApiService.billing.getPayments().catch(() => []),
                ApiService.events.getAll().catch(() => []),
                ApiService.reservations.getAll().catch(() => [])
            ]);

            // Recent Invoices in Finance Dash
            const finInvBody = document.getElementById('finDashRecentInvoicesBody');
            if (finInvBody) {
                finInvBody.innerHTML = invoices.slice(0, 5).map(i => `
                    <tr>
                        <td><strong>${Utils.escapeHtml(i.invoiceNumber)}</strong></td>
                        <td>${Utils.escapeHtml(i.customerName || 'Customer #' + i.customerId)}</td>
                        <td><strong>${Utils.formatCurrency(i.totalAmount)}</strong></td>
                        <td><span class="badge badge-${i.status === 'PAID' ? 'success' : 'warning'}">${i.status}</span></td>
                    </tr>
                `).join('') || '<tr><td colspan="4" class="text-center" style="padding:12px; color:#d1d5d0;">No invoices.</td></tr>';
            }

            // Recent Payments in Finance Dash
            const finPayBody = document.getElementById('finDashRecentPaymentsBody');
            if (finPayBody) {
                finPayBody.innerHTML = payments.slice(0, 5).map(p => `
                    <tr>
                        <td><strong>#PAY-${p.id}</strong></td>
                        <td>${p.invoiceNumber || 'INV #' + p.invoiceId}</td>
                        <td><span class="badge" style="background:#e0f2fe; color:#0369a1;">${p.paymentMethod}</span></td>
                        <td><strong style="color:#16a34a;">${Utils.formatCurrency(p.amountPaid)}</strong></td>
                        <td>${Utils.formatDate(p.paymentDate)}</td>
                    </tr>
                `).join('') || '<tr><td colspan="5" class="text-center" style="padding:12px; color:#d1d5d0;">No payments.</td></tr>';
            }

            // Recent Activities in Admin Dash
            const recentTbody = document.querySelector('#recentTable tbody') || document.getElementById('adminRecentTableBody');
            if (recentTbody) {
                recentTbody.innerHTML = events.slice(0, 5).map(e => `
                    <tr>
                        <td><strong>#EVT-${e.id}</strong></td>
                        <td><strong>${Utils.escapeHtml(e.eventTitle)}</strong></td>
                        <td>${Utils.escapeHtml(e.customerName || 'Customer #' + e.customerId)}</td>
                        <td>${Utils.formatDate(e.eventDate)}</td>
                        <td><span class="badge badge-info">${e.status}</span></td>
                    </tr>
                `).join('') || '<tr><td colspan="5" class="text-center" style="padding:12px; color:#d1d5d0;">No recent activity.</td></tr>';
            }
        } catch (err) {
            console.error('[Recent Tables Error]', err);
        }
    }
};

window.DashboardComponent = DashboardComponent;
window.loadDashboardStats = DashboardComponent.load.bind(DashboardComponent);
