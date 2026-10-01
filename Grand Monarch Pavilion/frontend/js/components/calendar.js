/**
 * Grand Monarch Pavilion - Centralized Booking Calendar
 * Production-ready visual calendar displaying all active dining table reservations
 * and event banquet bookings for users and staff.
 */

const BookingCalendarComponent = {
    currentDate: new Date(),
    selectedDate: new Date().toISOString().split('T')[0],
    filterType: 'ALL', // 'ALL' | 'TABLE' | 'EVENT'
    reservations: [],
    events: [],
    tables: [],
    venues: [],
    isLoading: false,

    async init() {
        await this.load();
    },

    async load() {
        this.isLoading = true;
        try {
            const [resData, evtData, tblData, venData] = await Promise.allSettled([
                ApiService.reservations.getAll(),
                ApiService.events.getAll(),
                ApiService.tables.getAll(),
                ApiService.venues.getAll()
            ]);

            const unwrap = (p) => {
                if (p.status === 'fulfilled' && p.value) {
                    const v = p.value;
                    if (Array.isArray(v)) return v;
                    if (v.data && Array.isArray(v.data)) return v.data;
                    if (v.value && Array.isArray(v.value)) return v.value;
                }
                return [];
            };

            this.reservations = unwrap(resData);
            this.events = unwrap(evtData);
            this.tables = unwrap(tblData);
            this.venues = unwrap(venData);
        } catch (err) {
            console.error('[BookingCalendar] Failed to load bookings:', err);
        } finally {
            this.isLoading = false;
            this.render();
        }
    },

    openModal() {
        const modal = document.getElementById('bookingCalendarModal');
        if (modal) {
            if (window.ModalManager) {
                ModalManager.openModal('bookingCalendarModal');
            } else {
                modal.style.display = 'flex';
            }
        }
        this.load();
    },

    closeModal() {
        if (window.ModalManager) {
            ModalManager.closeModal('bookingCalendarModal');
        } else {
            const modal = document.getElementById('bookingCalendarModal');
            if (modal) modal.style.display = 'none';
        }
    },

    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    },

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    },

    goToToday() {
        this.currentDate = new Date();
        this.selectedDate = new Date().toISOString().split('T')[0];
        this.render();
    },

    setFilter(filter) {
        this.filterType = filter;
        document.querySelectorAll('.calendar-filter-btn').forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.style.background = 'var(--text-gold, #d4af37)';
                btn.style.color = '#121816';
                btn.style.fontWeight = '700';
            } else {
                btn.style.background = 'rgba(212, 175, 55, 0.1)';
                btn.style.color = '#b0b8b4';
                btn.style.fontWeight = '600';
            }
        });
        this.render();
    },

    selectDate(dateStr) {
        this.selectedDate = dateStr;
        this.renderGrid();
        this.renderDayDetails();
    },

    getActiveReservationsOnDate(dateStr) {
        return this.reservations.filter(r =>
            r.reservationDate === dateStr &&
            !['CANCELLED', 'REJECTED', 'NO_SHOW'].includes((r.status || '').toUpperCase())
        );
    },

    getActiveEventsOnDate(dateStr) {
        return this.events.filter(e =>
            e.eventDate === dateStr &&
            !['CANCELLED', 'REJECTED'].includes((e.status || '').toUpperCase())
        );
    },

    render() {
        this.renderHeader();
        this.renderStats();
        this.renderGrid();
        this.renderDayDetails();
    },

    renderHeader() {
        const titleEl = document.getElementById('calendarMonthYearTitle');
        if (!titleEl) return;
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        titleEl.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    },

    renderStats() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

        const monthRes = this.reservations.filter(r =>
            (r.reservationDate || '').startsWith(monthPrefix) &&
            !['CANCELLED', 'REJECTED', 'NO_SHOW'].includes((r.status || '').toUpperCase())
        ).length;

        const monthEvt = this.events.filter(e =>
            (e.eventDate || '').startsWith(monthPrefix) &&
            !['CANCELLED', 'REJECTED'].includes((e.status || '').toUpperCase())
        ).length;

        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        set('calStatMonthTables', monthRes);
        set('calStatMonthEvents', monthEvt);
        set('calStatMonthTotal', monthRes + monthEvt);
    },

    renderGrid() {
        const grid = document.getElementById('bookingCalendarGrid');
        if (!grid) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const firstDayIndex = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const todayStr = new Date().toISOString().split('T')[0];

        let html = '';

        // Days from previous month
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const d = daysInPrevMonth - i;
            const prevMonthDate = new Date(year, month - 1, d);
            const dateStr = prevMonthDate.toISOString().split('T')[0];
            html += this.buildDayCell(d, dateStr, true, todayStr);
        }

        // Days of current month
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            html += this.buildDayCell(d, dateStr, false, todayStr);
        }

        // Days into next month to complete 35 or 42 grid cells
        const totalRendered = firstDayIndex + daysInMonth;
        const nextMonthPadding = (totalRendered % 7 === 0) ? 0 : 7 - (totalRendered % 7);
        for (let d = 1; d <= nextMonthPadding; d++) {
            const nextMonthDate = new Date(year, month + 1, d);
            const dateStr = nextMonthDate.toISOString().split('T')[0];
            html += this.buildDayCell(d, dateStr, true, todayStr);
        }

        grid.innerHTML = html;
    },

    buildDayCell(dayNumber, dateStr, isOtherMonth, todayStr) {
        const isToday = dateStr === todayStr;
        const isSelected = dateStr === this.selectedDate;
        const isPast = dateStr < todayStr;

        const tables = this.getActiveReservationsOnDate(dateStr);
        const events = this.getActiveEventsOnDate(dateStr);

        const showTables = this.filterType === 'ALL' || this.filterType === 'TABLE';
        const showEvents = this.filterType === 'ALL' || this.filterType === 'EVENT';

        const tableCount = showTables ? tables.length : 0;
        const eventCount = showEvents ? events.length : 0;
        const hasBookings = tableCount > 0 || eventCount > 0;

        const isFullyBooked = tables.length >= 30 || events.length >= 10;

        // Styling tokens
        let cellBg = isOtherMonth ? 'rgba(255, 255, 255, 0.02)' : 'rgba(27, 59, 43, 0.45)';
        let border = '1px solid rgba(212, 175, 55, 0.15)';
        if (isSelected) {
            border = '2px solid #d4af37';
            cellBg = 'rgba(212, 175, 55, 0.18)';
        } else if (isToday) {
            border = '1px solid #4ade80';
        }

        let badgesHtml = '';
        if (isFullyBooked) {
            badgesHtml += `<div style="background:#dc2626; color:#ffffff; font-size:0.65rem; font-weight:700; border-radius:4px; padding:2px 5px; margin-top:3px; display:inline-flex; align-items:center; gap:3px;">
                <i class="fa-solid fa-lock" style="font-size:0.6rem;"></i> Fully Booked
            </div>`;
        } else {
            if (showTables && tableCount > 0) {
                badgesHtml += `<div style="background:rgba(34, 197, 94, 0.2); color:#4ade80; border:1px solid rgba(34, 197, 94, 0.4); font-size:0.65rem; font-weight:700; border-radius:4px; padding:1px 5px; margin-top:2px; display:inline-flex; align-items:center; gap:4px;">
                    <i class="fa-solid fa-utensils" style="font-size:0.6rem;"></i> ${tableCount} ${tableCount === 1 ? 'Table' : 'Tables'}
                </div>`;
            }
            if (showEvents && eventCount > 0) {
                badgesHtml += `<div style="background:rgba(212, 175, 55, 0.2); color:#fef08a; border:1px solid rgba(212, 175, 55, 0.4); font-size:0.65rem; font-weight:700; border-radius:4px; padding:1px 5px; margin-top:2px; display:inline-flex; align-items:center; gap:4px;">
                    <i class="fa-solid fa-champagne-glasses" style="font-size:0.6rem;"></i> ${eventCount} ${eventCount === 1 ? 'Event' : 'Events'}
                </div>`;
            }
        }

        const opacity = isOtherMonth ? '0.45' : (isPast ? '0.65' : '1');

        return `
            <div onclick="BookingCalendarComponent.selectDate('${dateStr}')"
                 style="min-height:78px; padding:6px 8px; background:${cellBg}; border:${border}; border-radius:8px; cursor:pointer; opacity:${opacity}; transition:all 0.15s ease; display:flex; flex-direction:column; justify-content:space-between; position:relative;"
                 onmouseenter="if('${dateStr}' !== '${this.selectedDate}') this.style.borderColor='rgba(212, 175, 55, 0.5)'"
                 onmouseleave="if('${dateStr}' !== '${this.selectedDate}') this.style.borderColor='rgba(212, 175, 55, 0.15)'">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.85rem; font-weight:${isSelected || isToday ? '800' : '600'}; color:${isToday ? '#4ade80' : (isSelected ? '#d4af37' : '#e6dfd5')};">
                        ${dayNumber}
                    </span>
                    ${isToday ? '<span style="font-size:0.62rem; color:#4ade80; font-weight:800; text-transform:uppercase;">Today</span>' : ''}
                </div>
                <div style="display:flex; flex-direction:column; gap:2px; margin-top:4px;">
                    ${badgesHtml}
                </div>
            </div>
        `;
    },

    renderDayDetails() {
        const container = document.getElementById('calendarDayDetailsContainer');
        if (!container) return;

        const dateStr = this.selectedDate;
        const todayStr = new Date().toISOString().split('T')[0];
        const isPast = dateStr < todayStr;

        const tables = this.getActiveReservationsOnDate(dateStr);
        const events = this.getActiveEventsOnDate(dateStr);

        const dateObj = new Date(dateStr + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const tableLimit = 30;
        const eventLimit = 10;
        const tablePercent = Math.min(100, Math.round((tables.length / tableLimit) * 100));
        const eventPercent = Math.min(100, Math.round((events.length / eventLimit) * 100));

        const isTableFull = tables.length >= tableLimit;
        const isEventFull = events.length >= eventLimit;

        // Detail list items
        let tablesHtml = '';
        if (tables.length === 0) {
            tablesHtml = `<div style="padding:14px; background:rgba(255,255,255,0.03); border-radius:8px; text-align:center; color:#888888; font-size:0.85rem;">
                <i class="fa-solid fa-utensils" style="margin-right:6px; opacity:0.5;"></i> No dining table reservations scheduled on this date.
            </div>`;
        } else {
            tablesHtml = tables.map(r => {
                const time = (r.reservationTime || '').substring(0, 5) || 'Dinner';
                const statusColor = (r.status === 'CONFIRMED' || r.status === 'SEATED') ? '#4ade80' : '#fef08a';
                const statusBg = (r.status === 'CONFIRMED' || r.status === 'SEATED') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(212, 175, 55, 0.2)';
                const tableName = r.tableNumber ? `Table ${r.tableNumber}` : (r.tableId ? `Table #${r.tableId}` : 'Dining Table');
                return `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:rgba(27, 59, 43, 0.4); border:1px solid rgba(212, 175, 55, 0.15); border-radius:8px; margin-bottom:6px;">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:36px; height:36px; border-radius:8px; background:rgba(34, 197, 94, 0.15); color:#4ade80; display:flex; align-items:center; justify-content:center; font-size:0.9rem;">
                                <i class="fa-solid fa-chair"></i>
                            </div>
                            <div>
                                <div style="font-weight:700; color:#ffffff; font-size:0.88rem;">${tableName} &bull; ${r.partySize || 2} Guests</div>
                                <div style="font-size:0.75rem; color:#b0b8b4;"><i class="fa-solid fa-clock" style="color:var(--text-gold);"></i> ${time} &bull; Ref: #RES-${r.id}</div>
                            </div>
                        </div>
                        <span style="font-size:0.72rem; font-weight:700; padding:3px 8px; border-radius:6px; background:${statusBg}; color:${statusColor};">
                            ${r.status || 'CONFIRMED'}
                        </span>
                    </div>
                `;
            }).join('');
        }

        let eventsHtml = '';
        if (events.length === 0) {
            eventsHtml = `<div style="padding:14px; background:rgba(255,255,255,0.03); border-radius:8px; text-align:center; color:#888888; font-size:0.85rem;">
                <i class="fa-solid fa-champagne-glasses" style="margin-right:6px; opacity:0.5;"></i> No ballroom or banquet events booked on this date.
            </div>`;
        } else {
            eventsHtml = events.map(e => {
                const sTime = (e.startTime || '').substring(0, 5) || '18:00';
                const eTime = (e.endTime || '').substring(0, 5) || '23:00';
                const venue = this.venues.find(v => v.id === e.venueId);
                const venueName = venue ? venue.name : (e.venueName || 'Grand Ballroom');
                const statusColor = ['APPROVED', 'CONFIRMED'].includes((e.status || '').toUpperCase()) ? '#4ade80' : '#fef08a';
                const statusBg = ['APPROVED', 'CONFIRMED'].includes((e.status || '').toUpperCase()) ? 'rgba(34, 197, 94, 0.2)' : 'rgba(212, 175, 55, 0.2)';
                return `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:rgba(27, 59, 43, 0.4); border:1px solid rgba(212, 175, 55, 0.15); border-radius:8px; margin-bottom:6px;">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:36px; height:36px; border-radius:8px; background:rgba(212, 175, 55, 0.2); color:#fef08a; display:flex; align-items:center; justify-content:center; font-size:0.9rem;">
                                <i class="fa-solid fa-landmark"></i>
                            </div>
                            <div>
                                <div style="font-weight:700; color:#ffffff; font-size:0.88rem;">${Utils.escapeHtml(e.eventTitle || 'Private Event')} &bull; ${venueName}</div>
                                <div style="font-size:0.75rem; color:#b0b8b4;"><i class="fa-solid fa-clock" style="color:var(--text-gold);"></i> ${sTime} - ${eTime} &bull; ${e.expectedGuests || 50} Guests &bull; ${e.bookingCode || '#EVT-' + e.id}</div>
                            </div>
                        </div>
                        <span style="font-size:0.72rem; font-weight:700; padding:3px 8px; border-radius:6px; background:${statusBg}; color:${statusColor};">
                            ${e.status || 'CONFIRMED'}
                        </span>
                    </div>
                `;
            }).join('');
        }

        container.innerHTML = `
            <div style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:12px; padding:18px 20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px; border-bottom:1px solid rgba(212,175,55,0.15); padding-bottom:12px;">
                    <div>
                        <div style="font-size:0.78rem; text-transform:uppercase; color:var(--text-gold); font-weight:800; letter-spacing:0.5px;">Schedule Overview</div>
                        <h4 style="margin:2px 0 0 0; font-size:1.1rem; font-weight:800; color:#ffffff;">
                            ${formattedDate}
                            ${dateStr === todayStr ? ' <span style="font-size:0.75rem; color:#4ade80; background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.3); padding:2px 8px; border-radius:10px; margin-left:8px;">TODAY</span>' : ''}
                            ${isPast ? ' <span style="font-size:0.75rem; color:#f87171; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); padding:2px 8px; border-radius:10px; margin-left:8px;">PAST DATE</span>' : ''}
                        </h4>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="btn-primary" style="padding:7px 14px; font-size:0.8rem;" onclick="BookingCalendarComponent.bookTableForDate('${dateStr}')" ${isPast || isTableFull ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                            <i class="fa-solid fa-chair"></i> Reserve Table
                        </button>
                        <button class="btn-primary" style="background:linear-gradient(135deg, #d4af37, #b8860b); color:#121816; border:none; padding:7px 14px; font-size:0.8rem;" onclick="BookingCalendarComponent.bookEventForDate('${dateStr}')" ${isPast || isEventFull ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                            <i class="fa-solid fa-champagne-glasses"></i> Host Event
                        </button>
                    </div>
                </div>

                <!-- Daily Capacity Counters -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:18px;">
                    <div style="background:rgba(0,0,0,0.25); border:1px solid rgba(212,175,55,0.15); border-radius:10px; padding:12px 14px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <span style="font-size:0.82rem; font-weight:700; color:#e6dfd5;"><i class="fa-solid fa-utensils" style="color:#4ade80; margin-right:6px;"></i> Dining Tables Capacity</span>
                            <span style="font-size:0.85rem; font-weight:800; color:${isTableFull ? '#ef4444' : '#4ade80'};">${tables.length} / ${tableLimit} Booked</span>
                        </div>
                        <div style="height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
                            <div style="width:${tablePercent}%; height:100%; background:${isTableFull ? '#ef4444' : '#4ade80'}; border-radius:3px;"></div>
                        </div>
                    </div>

                    <div style="background:rgba(0,0,0,0.25); border:1px solid rgba(212,175,55,0.15); border-radius:10px; padding:12px 14px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <span style="font-size:0.82rem; font-weight:700; color:#e6dfd5;"><i class="fa-solid fa-champagne-glasses" style="color:var(--text-gold); margin-right:6px;"></i> Event Venues Capacity</span>
                            <span style="font-size:0.85rem; font-weight:800; color:${isEventFull ? '#ef4444' : '#fef08a'};">${events.length} / ${eventLimit} Booked</span>
                        </div>
                        <div style="height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
                            <div style="width:${eventPercent}%; height:100%; background:${isEventFull ? '#ef4444' : 'var(--text-gold)'}; border-radius:3px;"></div>
                        </div>
                    </div>
                </div>

                <!-- Tabs/Lists -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                    <div>
                        <div style="font-size:0.85rem; font-weight:800; color:#4ade80; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                            <i class="fa-solid fa-utensils"></i> Active Table Reservations (${tables.length})
                        </div>
                        <div style="max-height:220px; overflow-y:auto; padding-right:4px;">
                            ${tablesHtml}
                        </div>
                    </div>

                    <div>
                        <div style="font-size:0.85rem; font-weight:800; color:var(--text-gold); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                            <i class="fa-solid fa-champagne-glasses"></i> Active Event Bookings (${events.length})
                        </div>
                        <div style="max-height:220px; overflow-y:auto; padding-right:4px;">
                            ${eventsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    bookTableForDate(dateStr) {
        this.closeModal();
        const user = window.AuthManager ? AuthManager.currentUser : null;
        if (!user) {
            if (window.NotificationManager) NotificationManager.showToast('Please sign in or create an account to book your table.', 'info');
            if (window.ModalManager) ModalManager.openModal('loginModal');
            return;
        }

        // Open reservation modal and set date
        if (window.ModalManager) {
            ModalManager.openModal('reservationModal');
        } else {
            const m = document.getElementById('reservationModal');
            if (m) m.style.display = 'flex';
        }

        const dateInput = document.getElementById('rDate');
        if (dateInput) {
            dateInput.value = dateStr;
            if (window.checkRealtimeTableAvailability) checkRealtimeTableAvailability();
        }
    },

    bookEventForDate(dateStr) {
        this.closeModal();
        const user = window.AuthManager ? AuthManager.currentUser : null;
        if (!user) {
            if (window.NotificationManager) NotificationManager.showToast('Please sign in to coordinate your event booking.', 'info');
            if (window.ModalManager) ModalManager.openModal('loginModal');
            return;
        }

        if (window.EventsComponent && window.EventsComponent.openCreateBookingModal) {
            EventsComponent.openCreateBookingModal();
            const dateInput = document.getElementById('modalEvtDate');
            if (dateInput) dateInput.value = dateStr;
        } else if (window.ModalManager) {
            ModalManager.openModal('eventModal');
        }
    }
};

// Global Exports
window.BookingCalendarComponent = BookingCalendarComponent;
window.openBookingCalendarModal = () => BookingCalendarComponent.openModal();
window.closeBookingCalendarModal = () => BookingCalendarComponent.closeModal();
