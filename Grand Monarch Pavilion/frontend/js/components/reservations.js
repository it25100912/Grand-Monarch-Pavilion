/**
 * Grand Monarch Pavilion — Reservation Management Component
 * Production-ready CRUD with status workflow, filters, search & validation
 *
 * Statuses: PENDING | CONFIRMED | CHECKED_IN | COMPLETED | CANCELLED | REJECTED | NO_SHOW
 */

const ReservationsComponent = {
    // State
    reservations: [],
    tables: [],
    customers: [],
    filteredReservations: [],

    // Filter state
    filters: {
        search: '',
        status: 'ALL',
        date: '',
        tableId: ''
    },

    // Currently viewing/editing
    viewingReservation: null,
    editingReservation: null,

    // ============================================================
    // DATA LOADERS
    // ============================================================
    async load() {
        this.showLoadingSkeleton();
        await Promise.allSettled([
            this.loadReservations(),
            this.loadTables(),
            this.loadCustomers()
        ]);
        this.renderMetrics();
        this.updateToolbar();
    },

    showLoadingSkeleton() {
        const tbody = document.getElementById('reservationsTableBody');
        if (!tbody) return;
        tbody.innerHTML = Array(5).fill('').map(() => `
            <tr>
                ${Array(9).fill('').map(() => `
                    <td style="padding:14px;">
                        <div style="height:16px; background:linear-gradient(90deg, #1b3b2b 25%, #233a30 50%, #1b3b2b 75%); background-size:200% 100%; border-radius:6px; animation:shimmer 1.5s infinite;"></div>
                    </td>
                `).join('')}
            </tr>
        `).join('');
    },

    async loadReservations() {
        try {
            const user = window.AuthManager ? AuthManager.currentUser : null;
            let data;
            if (user && user.role === 'CUSTOMER') {
                data = await ApiService.reservations.getByCustomer(user.id);
            } else {
                data = await ApiService.reservations.getAll();
            }
            // unwrap {value: [...]} response
            if (data && data.value) data = data.value;
            this.reservations = Array.isArray(data) ? data : [];
            this.applyFiltersAndRender();
        } catch (err) {
            console.error('[ReservationsLoad]', err);
            this.reservations = [];
            this.applyFiltersAndRender();
        }
    },

    async loadTables() {
        try {
            const data = await ApiService.tables.getAll();
            const arr = data && data.value ? data.value : (Array.isArray(data) ? data : []);
            this.tables = arr;
            this.populateTableDropdowns();
        } catch (err) {
            console.warn('[TablesLoad]', err);
            this.tables = [];
        }
    },

    async loadCustomers() {
        try {
            const data = await ApiService.users.getAll();
            const arr = data && data.value ? data.value : (Array.isArray(data) ? data : []);
            this.customers = arr.filter(u => u.role === 'CUSTOMER' || !u.role);
            this.populateCustomerDropdown();
        } catch (err) {
            console.warn('[CustomersLoad]', err);
            this.customers = [];
        }
    },

    populateTableDropdowns() {
        const selects = [
            document.getElementById('rTableId'),
            document.getElementById('newResTableId'),
            document.getElementById('editResTableId')
        ];

        const options = '<option value="">— Select Dining Table —</option>' +
            this.tables.map(t => {
                const status = (t.status || 'AVAILABLE').toUpperCase();
                const statusLabel = status !== 'AVAILABLE' ? ` (${status})` : ' ✓ Available';
                return `<option value="${t.id}" ${status !== 'AVAILABLE' ? 'style="color:#d1d5d0;"' : ''}>${Utils.escapeHtml(t.tableNumber || 'Table #' + t.id)} — ${Utils.escapeHtml(t.location || 'Main Hall')} | Cap: ${t.capacity}${statusLabel}</option>`;
            }).join('');

        selects.forEach(sel => { if (sel) sel.innerHTML = options; });

        // Also populate the table filter dropdown in the search bar
        const filterSel = document.getElementById('resTableFilter');
        if (filterSel) {
            filterSel.innerHTML = '<option value="">All Tables</option>' +
                this.tables.map(t => `<option value="${t.id}">${Utils.escapeHtml(t.tableNumber || 'T-#' + t.id)} — ${Utils.escapeHtml(t.location || '')}</option>`).join('');
        }
    },


    populateCustomerDropdown() {
        const sel = document.getElementById('newResCustomerId');
        if (!sel) return;
        sel.innerHTML = '<option value="">— Select Customer —</option>' +
            this.customers.map(c => `<option value="${c.id}">${Utils.escapeHtml(c.fullName || c.username)} (${Utils.escapeHtml(c.phone || '')})</option>`).join('');
    },

    // ============================================================
    // METRICS
    // ============================================================
    renderMetrics() {
        const total = this.reservations.length;
        const pending = this.reservations.filter(r => (r.status || '').toUpperCase() === 'PENDING').length;
        const confirmed = this.reservations.filter(r => (r.status || '').toUpperCase() === 'CONFIRMED').length;
        const checkedIn = this.reservations.filter(r => ['CHECKED_IN', 'SEATED'].includes((r.status || '').toUpperCase())).length;
        const completed = this.reservations.filter(r => (r.status || '').toUpperCase() === 'COMPLETED').length;
        const cancelled = this.reservations.filter(r => ['CANCELLED', 'REJECTED', 'NO_SHOW'].includes((r.status || '').toUpperCase())).length;

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
        set('resMetricTotal', total);
        set('resMetricPending', pending);
        set('resMetricConfirmed', confirmed);
        set('resMetricCheckedIn', checkedIn);
        set('resMetricCompleted', completed);
        set('resMetricCancelled', cancelled);

        // Today's reservations
        const today = new Date().toISOString().split('T')[0];
        const todayCount = this.reservations.filter(r => r.reservationDate === today).length;
        set('resMetricToday', todayCount);
    },

    updateToolbar() {
        const user = window.AuthManager ? AuthManager.currentUser : null;
        const isStaff = user && ['ADMIN', 'EVENT_COORDINATOR', 'OPERATIONS_SUPERVISOR', 'STAFF', 'CUSTOMER_SERVICE'].includes(user.role);
        const toolbar = document.getElementById('resStaffToolbar');
        if (toolbar) toolbar.style.display = isStaff ? 'flex' : 'none';
    },

    // ============================================================
    // FILTER & RENDER
    // ============================================================
    setFilter(key, value) {
        this.filters[key] = value;
        this.applyFiltersAndRender();
    },

    applyFiltersAndRender() {
        let list = [...this.reservations];
        const { search, status, date, tableId } = this.filters;

        if (status && status !== 'ALL') {
            list = list.filter(r => {
                const s = (r.status || '').toUpperCase();
                if (status === 'SEATED') return ['CHECKED_IN', 'SEATED'].includes(s);
                return s === status;
            });
        }

        if (date) {
            list = list.filter(r => r.reservationDate === date);
        }

        if (tableId) {
            list = list.filter(r => String(r.tableId) === String(tableId));
        }

        if (search) {
            const q = search.toLowerCase();
            list = list.filter(r =>
                (r.customerName || '').toLowerCase().includes(q) ||
                (r.tableNumber || '').toLowerCase().includes(q) ||
                String(r.id).includes(q) ||
                (r.specialRequest || '').toLowerCase().includes(q)
            );
        }

        this.filteredReservations = list;
        this.renderTable(list);
    },

    // ============================================================
    // TABLE RENDER
    // ============================================================
    renderTable(list = this.filteredReservations) {
        const tbody = document.getElementById('reservationsTableBody');
        if (!tbody) return;

        const user = window.AuthManager ? AuthManager.currentUser : null;
        const isStaff = user && ['ADMIN', 'EVENT_COORDINATOR', 'OPERATIONS_SUPERVISOR', 'STAFF', 'CUSTOMER_SERVICE', 'FINANCE_OFFICER'].includes(user.role);

        if (list.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="padding:48px 20px; text-align:center;">
                        <div style="max-width:360px; margin:0 auto;">
                            <div style="width:64px; height:64px; background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.3); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto; font-size:1.8rem; color:#d1d5d0;">
                                <i class="fa-solid fa-calendar-xmark"></i>
                            </div>
                            <h4 style="font-size:1.05rem; font-weight:800; color:#e6dfd5; margin-bottom:8px;">No Reservations Found</h4>
                            <p style="font-size:0.88rem; color:#b0b8b4; margin:0 0 18px 0; line-height:1.5;">No dining reservations match the selected filters. Try adjusting the search or date criteria.</p>
                            <button type="button" class="btn-secondary" style="font-size:0.82rem; padding:7px 14px;" onclick="ReservationsComponent.clearFilters()">
                                <i class="fa-solid fa-rotate-left"></i> Clear All Filters
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = list.map(r => {
            const statusCfg = this.getStatusConfig(r.status);
            const dateFormatted = Utils.formatDate(r.reservationDate);
            const timeFormatted = Utils.formatTime ? Utils.formatTime(r.reservationTime) : (r.reservationTime || '—').substring(0, 5);
            const isUpcoming = r.reservationDate >= new Date().toISOString().split('T')[0];

            return `
            <tr style="transition:background 0.15s;" onmouseover="this.style.background='rgba(212, 175, 55, 0.08)'" onmouseout="this.style.background=''">
                <td class="text-center" style="width:90px;">
                    <div style="font-weight:900; font-size:0.9rem; color:#e6dfd5;">#RES-${r.id}</div>
                    <div style="font-size:0.68rem; color:#d1d5d0; margin-top:2px;">${r.createdAt ? r.createdAt.substring(0, 10) : ''}</div>
                </td>
                <td>
                    <div style="font-weight:800; color:#e6dfd5; font-size:0.9rem;">${Utils.escapeHtml(r.customerName || 'Customer #' + r.customerId)}</div>
                    <div style="font-size:0.75rem; color:#b0b8b4; margin-top:2px;">
                        <i class="fa-solid fa-id-badge" style="color:#d1d5d0;"></i> ID: ${r.customerId || '—'}
                    </div>
                </td>
                <td class="text-center">
                    <span style="background:rgba(212, 175, 55, 0.15); color:#e6dfd5; font-size:0.8rem; font-weight:800; padding:4px 10px; border-radius:8px; display:inline-flex; align-items:center; gap:6px; white-space:nowrap;">
                        <i class="fa-solid fa-chair" style="color:#b8860b;"></i>
                        ${Utils.escapeHtml(r.tableNumber || 'T-#' + r.tableId)}
                    </span>
                </td>
                <td class="text-center">
                    <div style="font-weight:700; color:#e6dfd5; font-size:0.9rem;">${dateFormatted}</div>
                    <div style="font-size:0.75rem; color:#b0b8b4;">${timeFormatted}</div>
                </td>
                <td class="text-center">
                    <div style="font-weight:800; font-size:1.1rem; color:#e6dfd5;">${r.partySize || '—'}</div>
                    <div style="font-size:0.7rem; color:#b0b8b4;">Guests</div>
                </td>
                <td>
                    <div style="max-width:220px; font-size:0.8rem; color:#d1d5d0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${Utils.escapeHtml(r.specialRequest || '')}">
                        ${r.specialRequest ? '<i class="fa-solid fa-comment" style="color:#d1d5d0; margin-right:4px;"></i>' + Utils.escapeHtml(r.specialRequest) : '<span style="color:#cbd5e1; font-style:italic;">No special requests</span>'}
                    </div>
                </td>
                <td class="text-center">
                    <span style="background:${statusCfg.bg}; color:${statusCfg.text}; border:1px solid ${statusCfg.border}; padding:4px 10px; border-radius:8px; font-size:0.75rem; font-weight:800; display:inline-flex; align-items:center; gap:5px; white-space:nowrap;">
                        <i class="fa-solid ${statusCfg.icon}"></i> ${statusCfg.label}
                    </span>
                </td>
                <td class="text-center" style="white-space:nowrap; width:180px;">
                    ${this.buildActionButtons(r, isStaff)}
                </td>
            </tr>
            `;
        }).join('');
    },

    buildActionButtons(r, isStaff) {
        const status = (r.status || '').toUpperCase();
        let buttons = '';

        // View details — always visible
        buttons += `<button type="button" class="btn-secondary" style="padding:5px 9px; font-size:0.75rem; margin:2px;" title="View Full Details" onclick="ReservationsComponent.openViewModal(${r.id})">
            <i class="fa-solid fa-eye"></i>
        </button>`;

        if (!isStaff) {
            // Customers: only cancel if pending/confirmed
            if (['PENDING', 'CONFIRMED'].includes(status)) {
                buttons += `<button type="button" class="btn-secondary" style="padding:5px 9px; font-size:0.75rem; color:#ef4444; margin:2px;" title="Cancel Reservation" onclick="ReservationsComponent.promptCancel(${r.id})">
                    <i class="fa-solid fa-ban"></i>
                </button>`;
            }
            return buttons;
        }

        // Staff action buttons
        buttons += `<button type="button" class="btn-secondary" style="padding:5px 9px; font-size:0.75rem; margin:2px;" title="Edit Reservation" onclick="ReservationsComponent.openEditModal(${r.id})">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>`;

        if (status === 'PENDING') {
            buttons += `<button type="button" style="padding:5px 9px; font-size:0.75rem; margin:2px; background:#dbeafe; border:1px solid #93c5fd; border-radius:7px; cursor:pointer; color:#1d4ed8; font-weight:700;" title="Confirm Reservation" onclick="ReservationsComponent.quickStatus(${r.id}, 'CONFIRMED')">
                <i class="fa-solid fa-check"></i>
            </button>`;
        }
        if (['PENDING', 'CONFIRMED'].includes(status)) {
            buttons += `<button type="button" style="padding:5px 9px; font-size:0.75rem; margin:2px; background:#dcfce7; border:1px solid #86efac; border-radius:7px; cursor:pointer; color:#15803d; font-weight:700;" title="Check-In Customer" onclick="ReservationsComponent.quickStatus(${r.id}, 'SEATED')">
                <i class="fa-solid fa-utensils"></i>
            </button>`;
            buttons += `<button type="button" style="padding:5px 9px; font-size:0.75rem; margin:2px; background:#fee2e2; border:1px solid #fca5a5; border-radius:7px; cursor:pointer; color:#b91c1c; font-weight:700;" title="Reject/Cancel" onclick="ReservationsComponent.promptCancel(${r.id})">
                <i class="fa-solid fa-ban"></i>
            </button>`;
        }
        if (status === 'SEATED') {
            buttons += `<button type="button" style="padding:5px 9px; font-size:0.75rem; margin:2px; background:#f3e8ff; border:1px solid #d8b4fe; border-radius:7px; cursor:pointer; color:#7e22ce; font-weight:700;" title="Mark Completed" onclick="ReservationsComponent.quickStatus(${r.id}, 'COMPLETED')">
                <i class="fa-solid fa-flag-checkered"></i>
            </button>`;
            buttons += `<button type="button" style="padding:5px 9px; font-size:0.75rem; margin:2px; background:#ffedd5; border:1px solid #fdba74; border-radius:7px; cursor:pointer; color:#c2410c; font-weight:700;" title="Mark No-Show" onclick="ReservationsComponent.quickStatus(${r.id}, 'NO_SHOW')">
                <i class="fa-solid fa-user-slash"></i>
            </button>`;
        }
        if (['COMPLETED', 'CANCELLED', 'REJECTED', 'NO_SHOW'].includes(status)) {
            buttons += `<button type="button" style="padding:5px 9px; font-size:0.75rem; margin:2px; background:rgba(212, 175, 55, 0.15); border:1px solid rgba(212, 175, 55, 0.25); border-radius:7px; cursor:pointer; color:#dc2626; font-weight:700;" title="Permanently Delete" onclick="ReservationsComponent.confirmDelete(${r.id})">
                <i class="fa-solid fa-trash"></i>
            </button>`;
        }

        return buttons;
    },

    clearFilters() {
        this.filters = { search: '', status: 'ALL', date: '', tableId: '' };
        const el = id => document.getElementById(id);
        if (el('resSearchInput')) el('resSearchInput').value = '';
        if (el('resStatusFilter')) el('resStatusFilter').value = 'ALL';
        if (el('resDateFilter')) el('resDateFilter').value = '';
        if (el('resTableFilter')) el('resTableFilter').value = '';
        this.applyFiltersAndRender();
    },

    // ============================================================
    // STATUS UTILITIES
    // ============================================================
    getStatusConfig(status) {
        const configs = {
            'PENDING':    { label:'PENDING',    bg:'#fef3c7', text:'#b45309', border:'#fcd34d', icon:'fa-clock' },
            'CONFIRMED':  { label:'CONFIRMED',  bg:'#dbeafe', text:'#1d4ed8', border:'#93c5fd', icon:'fa-circle-check' },
            'SEATED':     { label:'CHECKED IN', bg:'#dcfce7', text:'#15803d', border:'#86efac', icon:'fa-utensils' },
            'CHECKED_IN': { label:'CHECKED IN', bg:'#dcfce7', text:'#15803d', border:'#86efac', icon:'fa-utensils' },
            'COMPLETED':  { label:'COMPLETED',  bg:'rgba(212, 175, 55, 0.15)', text:'#d4af37', border:'rgba(212, 175, 55, 0.3)', icon:'fa-flag-checkered' },
            'CANCELLED':  { label:'CANCELLED',  bg:'#fee2e2', text:'#b91c1c', border:'#fca5a5', icon:'fa-circle-xmark' },
            'REJECTED':   { label:'REJECTED',   bg:'#fee2e2', text:'#b91c1c', border:'#fca5a5', icon:'fa-circle-xmark' },
            'NO_SHOW':    { label:'NO-SHOW',    bg:'#ffedd5', text:'#c2410c', border:'#fdba74', icon:'fa-user-slash' },
        };
        return configs[(status || '').toUpperCase()] || configs['PENDING'];
    },

    // ============================================================
    // REAL-TIME AVAILABILITY CHECK
    // ============================================================
    checkRealtimeTableAvailability(prefix = 'r') {
        const tableId = document.getElementById(`${prefix}TableId`)?.value || document.getElementById('rTableId')?.value;
        const date = document.getElementById(`${prefix}Date`)?.value || document.getElementById('rDate')?.value;
        const time = document.getElementById(`${prefix}Time`)?.value || document.getElementById('rTime')?.value;
        const excludeId = document.getElementById('editResId')?.value;
        const statusBox = document.getElementById(`${prefix}AvailabilityStatus`) || document.getElementById('rAvailabilityStatus');
        const submitBtn = document.getElementById(`btn${prefix.charAt(0).toUpperCase() + prefix.slice(1)}ConfirmReservation`);

        if (!statusBox) return;

        if (!tableId || !date) {
            statusBox.style.cssText = 'padding:10px; border-radius:8px; background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); color:#b0b8b4; font-weight:600; font-size:0.85rem; display:flex; align-items:center; gap:8px;';
            statusBox.innerHTML = '<i class="fa-solid fa-info-circle"></i> Select table and date to check availability.';
            return;
        }

        const todayStr = new Date().toISOString().split('T')[0];
        if (date < todayStr) {
            statusBox.style.cssText = 'padding:10px; border-radius:8px; background:#fef2f2; border:1px solid #fecaca; color:#dc2626; font-weight:700; font-size:0.85rem; display:flex; align-items:center; gap:8px;';
            statusBox.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!';
            if (submitBtn) submitBtn.disabled = true;
            return false;
        }

        if (date === todayStr && time) {
            const now = new Date();
            const [th, tm] = time.split(':').map(Number);
            const slotTime = new Date();
            slotTime.setHours(th, tm, 0, 0);
            if (slotTime < new Date(now.getTime() - 5 * 60000)) {
                statusBox.style.cssText = 'padding:10px; border-radius:8px; background:#fef2f2; border:1px solid #fecaca; color:#dc2626; font-weight:700; font-size:0.85rem; display:flex; align-items:center; gap:8px;';
                statusBox.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!';
                if (submitBtn) submitBtn.disabled = true;
                return false;
            }
        }

        const activeOnDate = this.reservations.filter(r =>
            r.reservationDate === date &&
            !['CANCELLED', 'REJECTED', 'NO_SHOW'].includes((r.status || '').toUpperCase()) &&
            (!excludeId || String(r.id) !== String(excludeId))
        ).length;
        if (activeOnDate >= 30) {
            statusBox.style.cssText = 'padding:10px; border-radius:8px; background:#fef2f2; border:1px solid #fecaca; color:#dc2626; font-weight:700; font-size:0.85rem; display:flex; align-items:center; gap:8px;';
            statusBox.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!';
            if (submitBtn) submitBtn.disabled = true;
            return false;
        }

        const conflict = this.reservations.find(r => {
            if (String(r.tableId) !== String(tableId)) return false;
            if (r.reservationDate !== date) return false;
            if (['CANCELLED', 'REJECTED', 'NO_SHOW'].includes((r.status || '').toUpperCase())) return false;
            if (excludeId && String(r.id) === String(excludeId)) return false;
            if (!time || !r.reservationTime) return true;
            const [rh, rm] = (r.reservationTime || '00:00').split(':').map(Number);
            const [th, tm] = time.split(':').map(Number);
            const diffMin = Math.abs((rh * 60 + rm) - (th * 60 + tm));
            return diffMin < 90;
        });

        if (conflict) {
            statusBox.style.cssText = 'padding:10px; border-radius:8px; background:#fef2f2; border:1px solid #fecaca; color:#dc2626; font-weight:700; font-size:0.85rem; display:flex; align-items:center; gap:8px;';
            statusBox.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!';
            if (submitBtn) submitBtn.disabled = true;
            return false;
        } else {
            statusBox.style.cssText = 'padding:10px; border-radius:8px; background:#f0fdf4; border:1px solid #bbf7d0; color:#166534; font-weight:700; font-size:0.85rem; display:flex; align-items:center; gap:8px;';
            statusBox.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> Table is available for the selected date & time.';
            if (submitBtn) submitBtn.disabled = false;
            return true;
        }
    },

    // ============================================================
    // QUICK STATUS UPDATE
    // ============================================================
    async quickStatus(id, newStatus) {
        try {
            const res = await ApiService.reservations.updateStatus(id, newStatus);
            if (res && res.success) {
                const cfg = this.getStatusConfig(newStatus);
                NotificationManager.showToast(`Reservation #RES-${id} marked as ${cfg.label}.`);
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res?.message || 'Failed to update status.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error updating status.', true);
        }
    },

    // ============================================================
    // PROMPT CANCEL WITH REASON
    // ============================================================
    promptCancel(id) {
        const r = this.reservations.find(x => x.id === id);
        if (!r) return;

        const modalBody = document.getElementById('cancelReasonBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <div style="margin-bottom:16px; background:#fef3c7; border:1px solid #fcd34d; border-radius:10px; padding:12px 14px; display:flex; align-items:flex-start; gap:10px;">
                    <i class="fa-solid fa-triangle-exclamation" style="color:#b45309; margin-top:2px; flex-shrink:0;"></i>
                    <div>
                        <div style="font-weight:800; color:#92400e; font-size:0.9rem;">Cancellation Confirmation</div>
                        <div style="font-size:0.82rem; color:#78350f; margin-top:4px;">
                            Cancelling reservation <strong>#RES-${id}</strong> for <strong>${Utils.escapeHtml(r.customerName || 'Customer')}</strong> on <strong>${Utils.formatDate(r.reservationDate)}</strong>.
                        </div>
                    </div>
                </div>
                <div>
                    <label style="font-size:0.85rem; font-weight:700; color:#e6dfd5; display:block; margin-bottom:6px;">Cancellation Reason <span style="color:#ef4444;">*</span></label>
                    <select id="cancelReasonSelect" class="form-control" style="margin-bottom:10px;" onchange="ReservationsComponent.handleCancelReasonChange()">
                        <option value="">Select reason...</option>
                        <option value="Customer requested cancellation">Customer requested cancellation</option>
                        <option value="No show — guest did not arrive">No show — guest did not arrive</option>
                        <option value="Table unavailable due to operational issue">Table unavailable due to operational issue</option>
                        <option value="Double-booking conflict">Double-booking conflict</option>
                        <option value="Violation of booking policy">Violation of booking policy</option>
                        <option value="other">Other reason...</option>
                    </select>
                    <textarea id="cancelReasonNote" class="form-control" rows="2" placeholder="Additional notes (optional)..." style="display:none;"></textarea>
                </div>
            `;
            document.getElementById('btnConfirmCancel').onclick = () => this.executeCancel(id);
            ModalManager.openModal('cancelReasonModal');
        } else {
            if (!confirm(`Are you sure you want to cancel reservation #RES-${id}?`)) return;
            this.executeCancel(id);
        }
    },

    handleCancelReasonChange() {
        const sel = document.getElementById('cancelReasonSelect');
        const note = document.getElementById('cancelReasonNote');
        if (!sel || !note) return;
        note.style.display = sel.value === 'other' ? 'block' : 'none';
    },

    async executeCancel(id) {
        const reasonSel = document.getElementById('cancelReasonSelect');
        const reasonNote = document.getElementById('cancelReasonNote');

        if (reasonSel && !reasonSel.value) {
            reasonSel.style.borderColor = '#ef4444';
            NotificationManager.showToast('Please select a cancellation reason.', true);
            return;
        }

        ModalManager.closeModal('cancelReasonModal');

        try {
            const res = await ApiService.reservations.updateStatus(id, 'CANCELLED');
            if (res && res.success) {
                NotificationManager.showToast(`Reservation #RES-${id} cancelled successfully.`);
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                // Try DELETE if updateStatus not available
                const delRes = await ApiService.reservations.delete(id);
                if (delRes && delRes.success) {
                    NotificationManager.showToast(`Reservation #RES-${id} cancelled.`);
                    await this.load();
                    if (window.DashboardComponent) window.DashboardComponent.load();
                } else {
                    NotificationManager.showToast('Failed to cancel reservation.', true);
                }
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error cancelling reservation.', true);
        }
    },

    // ============================================================
    // CONFIRM PERMANENT DELETE
    // ============================================================
    confirmDelete(id) {
        const r = this.reservations.find(x => x.id === id);
        if (!r) return;

        if (!confirm(`PERMANENTLY DELETE reservation #RES-${id} for ${r.customerName || 'this customer'}?\n\nThis action cannot be undone.`)) return;

        this.permanentlyDelete(id);
    },

    async permanentlyDelete(id) {
        try {
            const res = await ApiService.reservations.delete(id);
            if (res && res.success) {
                NotificationManager.showToast(`Reservation #RES-${id} permanently deleted.`);
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res?.message || 'Failed to delete reservation.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error deleting reservation.', true);
        }
    },

    // ============================================================
    // VIEW DETAILS MODAL
    // ============================================================
    openViewModal(id) {
        const r = this.reservations.find(x => x.id === id);
        if (!r) return;
        this.viewingReservation = r;

        const statusCfg = this.getStatusConfig(r.status);
        const body = document.getElementById('resViewModalBody');
        if (!body) return;

        body.innerHTML = `
            <!-- Status Banner -->
            <div style="background:${statusCfg.bg}; border:1px solid ${statusCfg.border}; border-radius:12px; padding:14px 18px; display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <i class="fa-solid ${statusCfg.icon}" style="color:${statusCfg.text}; font-size:1.3rem;"></i>
                    <div>
                        <div style="font-size:1.2rem; font-weight:900; color:${statusCfg.text};">${statusCfg.label}</div>
                        <div style="font-size:0.75rem; color:${statusCfg.text}; opacity:0.8;">Current Booking Status</div>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:1.35rem; font-weight:900; color:#e6dfd5;">#RES-${r.id}</div>
                    <div style="font-size:0.72rem; color:#b0b8b4;">Booking Reference</div>
                </div>
            </div>

            <!-- Grid Details -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
                <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:12px; padding:14px;">
                    <div style="font-size:0.72rem; text-transform:uppercase; font-weight:800; color:#d1d5d0; letter-spacing:0.5px; margin-bottom:6px;"><i class="fa-solid fa-user"></i> Customer</div>
                    <div style="font-size:1rem; font-weight:800; color:#e6dfd5;">${Utils.escapeHtml(r.customerName || 'Customer #' + r.customerId)}</div>
                    <div style="font-size:0.78rem; color:#b0b8b4; margin-top:4px;">ID: ${r.customerId}</div>
                </div>
                <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:12px; padding:14px;">
                    <div style="font-size:0.72rem; text-transform:uppercase; font-weight:800; color:#d1d5d0; letter-spacing:0.5px; margin-bottom:6px;"><i class="fa-solid fa-chair"></i> Dining Table</div>
                    <div style="font-size:1rem; font-weight:800; color:#e6dfd5;">${Utils.escapeHtml(r.tableNumber || 'Table #' + r.tableId)}</div>
                    <div style="font-size:0.78rem; color:#b0b8b4; margin-top:4px;">Table ID: ${r.tableId}</div>
                </div>
                <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:12px; padding:14px;">
                    <div style="font-size:0.72rem; text-transform:uppercase; font-weight:800; color:#d1d5d0; letter-spacing:0.5px; margin-bottom:6px;"><i class="fa-solid fa-calendar-day"></i> Date</div>
                    <div style="font-size:1rem; font-weight:800; color:#e6dfd5;">${Utils.formatDate(r.reservationDate)}</div>
                    <div style="font-size:0.78rem; color:#b0b8b4; margin-top:4px;">at ${(r.reservationTime || '').substring(0, 5)}</div>
                </div>
                <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:12px; padding:14px;">
                    <div style="font-size:0.72rem; text-transform:uppercase; font-weight:800; color:#d1d5d0; letter-spacing:0.5px; margin-bottom:6px;"><i class="fa-solid fa-users"></i> Party Size</div>
                    <div style="font-size:1.4rem; font-weight:900; color:#e6dfd5;">${r.partySize || '—'}</div>
                    <div style="font-size:0.78rem; color:#b0b8b4; margin-top:2px;">Dining Guests</div>
                </div>
            </div>

            <!-- Special Requests -->
            <div style="background:${r.specialRequest ? '#1b3b2b' : '#121816'}; border:1px solid ${r.specialRequest ? '#d4af37' : 'rgba(212, 175, 55, 0.2)'}; border-radius:12px; padding:14px; margin-bottom:20px;">
                <div style="font-size:0.72rem; text-transform:uppercase; font-weight:800; color:#d1d5d0; letter-spacing:0.5px; margin-bottom:6px;"><i class="fa-solid fa-comment-dots"></i> Special Requests</div>
                <div style="font-size:0.9rem; color:${r.specialRequest ? '#e6dfd5' : '#b0b8b4'}; font-style:${r.specialRequest ? 'normal' : 'italic'}; line-height:1.5;">
                    ${r.specialRequest ? Utils.escapeHtml(r.specialRequest) : 'No special requests provided'}
                </div>
            </div>

            <!-- Booking History -->
            <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:12px; padding:14px;">
                <div style="font-size:0.72rem; text-transform:uppercase; font-weight:800; color:#d1d5d0; letter-spacing:0.5px; margin-bottom:8px;"><i class="fa-solid fa-clock-rotate-left"></i> Booking Timeline</div>
                <div style="display:flex; align-items:center; gap:10px; font-size:0.82rem; color:#d1d5d0;">
                    <div style="width:8px; height:8px; border-radius:50%; background:#b8860b; flex-shrink:0;"></div>
                    <span><strong>Created:</strong> ${r.createdAt || 'Unknown'}</span>
                </div>
                <div style="display:flex; align-items:center; gap:10px; font-size:0.82rem; color:#d1d5d0; margin-top:8px;">
                    <div style="width:8px; height:8px; border-radius:50%; background:${statusCfg.text}; flex-shrink:0;"></div>
                    <span><strong>Current Status:</strong> ${statusCfg.label}</span>
                </div>
            </div>
        `;

        ModalManager.openModal('resViewModal');
    },

    // ============================================================
    // NEW RESERVATION MODAL (Staff)
    // ============================================================
    async openNewReservationModal() {
        const form = document.getElementById('formNewReservation');
        if (form) form.reset();

        const today = new Date().toISOString().split('T')[0];
        const dateEl = document.getElementById('newResDate');
        if (dateEl) {
            dateEl.min = today;
            dateEl.value = today;
        }

        if (!this.tables || this.tables.length === 0) {
            await this.loadTables();
        } else {
            this.populateTableDropdowns();
        }

        if (!this.customers || this.customers.length === 0) {
            await this.loadCustomers();
        } else {
            this.populateCustomerDropdown();
        }

        ModalManager.openModal('newReservationModal');
    },

    async handleNewReservationSubmit(e) {
        if (e) e.preventDefault();

        const user = window.AuthManager ? AuthManager.currentUser : null;

        const custEl = document.getElementById('newResCustomerId');
        const tableEl = document.getElementById('newResTableId');
        const dateEl = document.getElementById('newResDate');
        const timeEl = document.getElementById('newResTime');
        const partyEl = document.getElementById('newResPartySize');
        const notesEl = document.getElementById('newResNotes');

        const customerId = custEl?.value ? parseInt(custEl.value) : (user ? user.id : null);
        const tableId = parseInt(tableEl?.value);
        const reservationDate = dateEl?.value;
        const reservationTime = timeEl?.value;
        const partySize = parseInt(partyEl?.value);
        const specialRequest = (notesEl?.value || '').trim();

        // Validation
        if (!customerId) {
            NotificationManager.showToast('Please select a customer.', true);
            if (custEl) custEl.style.borderColor = '#ef4444';
            return;
        }
        if (!tableId || isNaN(tableId)) {
            return FormValidator.markInvalid(tableEl, 'Please select a dining table.');
        }
        const dVal = FormValidator.validateDate(reservationDate, 'Reservation Date', false);
        if (!dVal.valid) return FormValidator.markInvalid(dateEl, dVal.message);
        if (!reservationTime) return FormValidator.markInvalid(timeEl, 'Please enter a dining time.');
        const pVal = FormValidator.validateNumber(partySize, 'Guest Count', 1, 50, true);
        if (!pVal.valid) return FormValidator.markInvalid(partyEl, pVal.message);

        // Validation against past time, daily limit, and table conflict
        const todayStr = new Date().toISOString().split('T')[0];
        if (reservationDate < todayStr) {
            NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', true);
            return;
        }
        if (reservationDate === todayStr && reservationTime) {
            const [th, tm] = reservationTime.split(':').map(Number);
            const slotTime = new Date();
            slotTime.setHours(th, tm, 0, 0);
            if (slotTime < new Date(Date.now() - 5 * 60000)) {
                NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', true);
                return;
            }
        }
        const activeToday = this.reservations.filter(r =>
            r.reservationDate === reservationDate &&
            !['CANCELLED', 'REJECTED', 'NO_SHOW'].includes((r.status || '').toUpperCase())
        ).length;
        if (activeToday >= 30) {
            NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', true);
            return;
        }
        const hasCollision = this.reservations.some(r => {
            if (String(r.tableId) !== String(tableId)) return false;
            if (r.reservationDate !== reservationDate) return false;
            if (['CANCELLED', 'REJECTED', 'NO_SHOW'].includes((r.status || '').toUpperCase())) return false;
            if (!reservationTime || !r.reservationTime) return true;
            const [rh, rm] = (r.reservationTime || '00:00').split(':').map(Number);
            const [th, tm] = reservationTime.split(':').map(Number);
            return Math.abs((rh * 60 + rm) - (th * 60 + tm)) < 90;
        });
        if (hasCollision) {
            NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', true);
            return;
        }

        const submitBtn = document.getElementById('btnSubmitNewReservation');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Confirming...'; }

        try {
            const res = await ApiService.reservations.create({
                customerId,
                tableId,
                reservationDate,
                reservationTime: reservationTime.length === 5 ? reservationTime + ':00' : reservationTime,
                partySize,
                specialRequest,
                status: 'CONFIRMED'
            });

            if (res && res.success) {
                ModalManager.closeModal('newReservationModal');
                NotificationManager.showToast('Reservation confirmed and created successfully!');
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res?.message || 'Failed to create reservation.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error creating reservation.', true);
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fa-solid fa-calendar-check"></i> Confirm Reservation'; }
        }
    },

    // ============================================================
    // EDIT RESERVATION MODAL
    // ============================================================
    openEditModal(id) {
        const r = this.reservations.find(x => x.id === id);
        if (!r) return;
        this.editingReservation = r;

        const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val || ''; };

        set('editResId', r.id);
        set('editResDate', r.reservationDate || '');
        set('editResTime', r.reservationTime ? r.reservationTime.substring(0, 5) : '');
        set('editResPartySize', r.partySize || 2);
        set('editResNotes', r.specialRequest || '');

        // Populate table dropdown and pre-select
        this.populateTableDropdowns();
        setTimeout(() => {
            const tbl = document.getElementById('editResTableId');
            if (tbl) tbl.value = r.tableId || '';
            const statEl = document.getElementById('editResStatus');
            if (statEl) {
                statEl.value = r.status || 'CONFIRMED';
            }
        }, 50);

        if (window.FormValidator) FormValidator.enforceMinDates();
        ModalManager.openModal('editReservationModal');
    },

    async handleEditSubmit(e) {
        if (e) e.preventDefault();

        const id = parseInt(document.getElementById('editResId')?.value);
        const tableEl = document.getElementById('editResTableId');
        const dateEl = document.getElementById('editResDate');
        const timeEl = document.getElementById('editResTime');
        const partyEl = document.getElementById('editResPartySize');
        const statusEl = document.getElementById('editResStatus');
        const notesEl = document.getElementById('editResNotes');

        const tableId = tableEl ? parseInt(tableEl.value) : null;
        const reservationDate = dateEl?.value;
        const reservationTime = timeEl?.value;
        const partySize = parseInt(partyEl?.value);
        const status = statusEl?.value || 'CONFIRMED';
        const specialRequest = (notesEl?.value || '').trim();

        if (!id || isNaN(id)) {
            NotificationManager.showToast('Invalid reservation selected.', true);
            return;
        }
        const dVal = FormValidator.validateDate(reservationDate, 'Reservation Date', false);
        if (!dVal.valid) return FormValidator.markInvalid(dateEl, dVal.message);
        if (!reservationTime) return FormValidator.markInvalid(timeEl, 'Please enter a dining time.');
        const pVal = FormValidator.validateNumber(partySize, 'Guest Count', 1, 50, true);
        if (!pVal.valid) return FormValidator.markInvalid(partyEl, pVal.message);

        // Validation against past time and table conflict
        const todayStr = new Date().toISOString().split('T')[0];
        if (reservationDate < todayStr) {
            NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', true);
            return;
        }
        if (reservationDate === todayStr && reservationTime) {
            const [th, tm] = reservationTime.split(':').map(Number);
            const slotTime = new Date();
            slotTime.setHours(th, tm, 0, 0);
            if (slotTime < new Date(Date.now() - 5 * 60000)) {
                NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', true);
                return;
            }
        }
        if (tableId) {
            const hasCollision = this.reservations.some(r => {
                if (r.id === id) return false;
                if (String(r.tableId) !== String(tableId)) return false;
                if (r.reservationDate !== reservationDate) return false;
                if (['CANCELLED', 'REJECTED', 'NO_SHOW'].includes((r.status || '').toUpperCase())) return false;
                if (!reservationTime || !r.reservationTime) return true;
                const [rh, rm] = (r.reservationTime || '00:00').split(':').map(Number);
                const [th, tm] = reservationTime.split(':').map(Number);
                return Math.abs((rh * 60 + rm) - (th * 60 + tm)) < 90;
            });
            if (hasCollision) {
                NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', true);
                return;
            }
        }

        const submitBtn = document.getElementById('btnSubmitEditReservation');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating...'; }

        try {
            const res = await ApiService.reservations.update({
                id,
                tableId: tableId || undefined,
                reservationDate,
                reservationTime: reservationTime.length === 5 ? reservationTime + ':00' : reservationTime,
                partySize,
                status,
                specialRequest
            });

            if (res && res.success) {
                ModalManager.closeModal('editReservationModal');
                NotificationManager.showToast('Reservation updated successfully!');
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res?.message || 'Failed to update reservation.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error updating reservation.', true);
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Changes'; }
        }
    },

    // ============================================================
    // BACKWARD COMPAT
    // ============================================================
    renderTablesDropdown() { this.populateTableDropdowns(); },

    async handleSubmit(e) {
        // Legacy reservation modal (from public/customer view)
        if (e) e.preventDefault();
        const user = window.AuthManager ? AuthManager.currentUser : null;
        const customerId = user ? user.id : 6;
        const tableEl = document.getElementById('rTableId');
        const dateEl = document.getElementById('rDate');
        const timeEl = document.getElementById('rTime');
        const partyEl = document.getElementById('rPartySize');
        const tableId = parseInt(tableEl?.value, 10);
        const reservationDate = dateEl?.value;
        const reservationTime = timeEl?.value;
        const partySize = parseInt(partyEl?.value, 10);
        const specialRequest = (document.getElementById('rSpecialRequest')?.value || '').trim();

        // Payment / Slip details
        const payMethod = document.getElementById('rPaymentMethod')?.value || 'PAY_AT_VENUE';
        const bankRefEl = document.getElementById('rBankRef');
        const depositAmtEl = document.getElementById('rDepositAmount');
        const slipFileEl = document.getElementById('rSlipFile');

        const bankRef = (bankRefEl?.value || '').trim();
        const depositAmount = parseFloat(depositAmtEl?.value || 5000);
        const slipFile = slipFileEl?.files?.[0] || null;

        if (!tableId || isNaN(tableId)) return FormValidator.markInvalid(tableEl, 'Please select a dining table.');
        const dVal = FormValidator.validateDate(reservationDate, 'Reservation Date', false);
        if (!dVal.valid) return FormValidator.markInvalid(dateEl, dVal.message);
        if (!reservationTime) return FormValidator.markInvalid(timeEl, 'Please specify reservation time.');
        const pVal = FormValidator.validateNumber(partySize, 'Party Size', 1, 30, true);
        if (!pVal.valid) return FormValidator.markInvalid(partyEl, pVal.message);

        if (payMethod === 'BANK_TRANSFER') {
            if (!bankRef) {
                return FormValidator.markInvalid(bankRefEl, 'Please enter bank transfer reference number.');
            }
            if (!slipFile) {
                if (window.NotificationManager) NotificationManager.showToast('Please attach your bank deposit slip image or PDF.', 'warning');
                return;
            }
        }

        // Validation against past time, daily limit, and table conflict
        const todayStr = new Date().toISOString().split('T')[0];
        if (reservationDate < todayStr) {
            NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', true);
            return;
        }
        if (reservationDate === todayStr && reservationTime) {
            const [th, tm] = reservationTime.split(':').map(Number);
            const slotTime = new Date();
            slotTime.setHours(th, tm, 0, 0);
            if (slotTime < new Date(Date.now() - 5 * 60000)) {
                NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', true);
                return;
            }
        }
        const activeToday = this.reservations.filter(r =>
            r.reservationDate === reservationDate &&
            !['CANCELLED', 'REJECTED', 'NO_SHOW'].includes((r.status || '').toUpperCase())
        ).length;
        if (activeToday >= 30) {
            NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', true);
            return;
        }
        const hasCollision = this.reservations.some(r => {
            if (String(r.tableId) !== String(tableId)) return false;
            if (r.reservationDate !== reservationDate) return false;
            if (['CANCELLED', 'REJECTED', 'NO_SHOW'].includes((r.status || '').toUpperCase())) return false;
            if (!reservationTime || !r.reservationTime) return true;
            const [rh, rm] = (r.reservationTime || '00:00').split(':').map(Number);
            const [th, tm] = reservationTime.split(':').map(Number);
            return Math.abs((rh * 60 + rm) - (th * 60 + tm)) < 90;
        });
        if (hasCollision) {
            NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', true);
            return;
        }

        try {
            const isBankSlip = (payMethod === 'BANK_TRANSFER');
            const reservationStatus = isBankSlip ? 'PENDING' : 'CONFIRMED';

            const res = await ApiService.reservations.create({
                customerId, tableId, reservationDate,
                reservationTime: reservationTime.length === 5 ? reservationTime + ':00' : reservationTime,
                partySize, specialRequest, status: reservationStatus
            });

            if (res && res.success) {
                const createdRes = res.data || {};
                const resId = createdRes.id || 'NEW';

                // If customer uploaded a bank slip, record the payment with PENDING_VERIFICATION
                if (isBankSlip && slipFile) {
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                        const slipDataUrl = event.target.result;
                        try {
                            const user = window.AuthManager ? AuthManager.currentUser : null;
                            const clientName = (user && user.fullName) ? user.fullName : 'Guest Diner';

                            await ApiService.billing.recordPayment({
                                bookingRef: 'RES-' + resId,
                                customerName: clientName,
                                paymentMethod: 'BANK_TRANSFER',
                                amountPaid: depositAmount,
                                depositAmount: depositAmount,
                                balanceAmount: 0.0,
                                transactionRef: bankRef,
                                status: 'PENDING_VERIFICATION',
                                slipUrl: slipDataUrl,
                                slipFileName: slipFile.name
                            });

                            if (window.BillingComponent) BillingComponent.load();
                        } catch (err) {
                            console.error('[Bank Slip Payment Recording Error]', err);
                        }
                    };
                    reader.readAsDataURL(slipFile);
                }

                ModalManager.closeModal('reservationModal');
                if (isBankSlip) {
                    NotificationManager.showToast('Reservation submitted! Bank slip sent to Finance for verification.');
                    NotificationManager.addNotification('Slip Submitted', `Bank slip for RES-${resId} is pending verification.`, 'fa-file-shield');
                } else {
                    NotificationManager.showToast('Dining table reservation confirmed!');
                }

                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res?.message || 'Failed to create reservation.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error creating reservation.', true);
        }
    },

    async updateStatus(id, newStatus) { return this.quickStatus(id, newStatus); },
    async cancelReservation(id) { return this.promptCancel(id); },
    async deleteReservation(id) { return this.promptCancel(id); }
};

// ============================================================
// GLOBAL EXPORTS
// ============================================================
window.ReservationsComponent = ReservationsComponent;
window.handleReservationSubmit = (e) => ReservationsComponent.handleSubmit(e);
window.handleEditReservationSubmit = (e) => ReservationsComponent.handleEditSubmit(e);
window.checkRealtimeTableAvailability = () => ReservationsComponent.checkRealtimeTableAvailability();
window.filterReservations = () => ReservationsComponent.applyFiltersAndRender();
window.cancelReservation = (id) => ReservationsComponent.promptCancel(id);
