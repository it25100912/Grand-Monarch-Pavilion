/**
 * ====================================================================
 * Grand Monarch Luxury Dining & Event Pavilion
 * Commercial Event & Banquet Management Module (EventsComponent)
 *
 * Features:
 * 1. Event Bookings Hub (Full CRUD, Booking Codes, Live Status, Packages)
 * 2. Luxury Venues & Ballrooms (CRUD, Facilities Checkboxes, High-Res Media, Dual Cards/Table)
 * 3. Event Packages & Catering Tiers (CRUD, Tier Badges, Included Services)
 * 4. Executive Dashboard & Metrics (KPIs, Schedule Calendar, Real-Time Stats)
 * ====================================================================
 */

const EventsComponent = {
    events: [],
    venues: [],
    packages: [],
    customers: [],
    staffList: [],
    resources: [],
    activeTab: 'bookings',
    venueViewMode: 'cards',
    selectedPackageTier: 'ALL',
    calendarCurrentDate: new Date(),
    pendingDeleteTarget: null, // { type: 'venue'|'package'|'event', id: number, name: string }

    // Filter states for Bookings
    bookingFilters: {
        search: '',
        type: 'ALL',
        venue: 'ALL',
        status: 'ALL',
        date: ''
    },

    // Filter states for Venues
    venueFilters: {
        search: '',
        status: 'ALL'
    },

    async load() {
        console.log('[EventsComponent] Loading all event management datasets...');
        await Promise.allSettled([
            this.loadVenues(),
            this.loadPackages(),
            this.loadCustomers(),
            this.loadStaff(),
            this.loadResources(),
            this.loadEvents()
        ]);
        this.updateDashboardMetrics();
        this.populateDropdowns();
    },

    // ----------------------------------------------------
    // Data Loaders
    // ----------------------------------------------------
    async loadVenues() {
        try {
            const data = await ApiService.venues.getAll();
            this.venues = data || [];
            this.renderVenues();
            if (window.VenuesComponent) {
                window.VenuesComponent.venues = this.venues;
                window.VenuesComponent.renderShowcase();
                window.VenuesComponent.renderManagementTable();
            }
        } catch (err) {
            console.error('[Events] Failed to load venues:', err);
        }
    },

    async loadPackages() {
        try {
            const data = await ApiService.packages.getAll();
            this.packages = data || [];
            this.renderPackages();
        } catch (err) {
            console.error('[Events] Failed to load packages:', err);
        }
    },

    async loadCustomers() {
        try {
            const users = await ApiService.users.getAll();
            this.customers = (users || []).filter(u => u.role === 'CUSTOMER' || !u.role);
            if (this.customers.length === 0 && users && users.length > 0) {
                this.customers = users;
            }
        } catch (err) {
            console.warn('[Events] Users load warning:', err);
        }
    },

    async loadStaff() {
        try {
            const staff = await ApiService.users.getStaff();
            this.staffList = staff || [];
        } catch (err) {
            console.warn('[Events] Staff load warning:', err);
        }
    },

    async loadResources() {
        try {
            const res = await ApiService.resources.getAll();
            this.resources = res || [];
        } catch (err) {
            console.warn('[Events] Resources load warning:', err);
        }
    },

    async loadEvents() {
        try {
            const user = window.AuthManager ? AuthManager.currentUser : null;
            let data = [];
            if (user && user.role === 'CUSTOMER') {
                data = await ApiService.events.getByCustomer(user.id);
            } else {
                data = await ApiService.events.getAll();
            }
            this.events = data || [];
            this.renderBookingsTable();
            this.renderCalendar();
            this.updateDashboardMetrics();
        } catch (err) {
            console.error('[Events] Failed to load event bookings:', err);
        }
    },

    // ----------------------------------------------------
    // Tab Navigation
    // ----------------------------------------------------
    switchTab(tabId) {
        this.activeTab = tabId;

        // Update tab buttons
        const tabBtns = {
            bookings: document.getElementById('tabBtnEvtBookings'),
            venues: document.getElementById('tabBtnEvtVenues'),
            packages: document.getElementById('tabBtnEvtPackages'),
            calendar: document.getElementById('tabBtnEvtCalendar')
        };

        const tabPanes = {
            bookings: document.getElementById('tabContentEvtBookings'),
            venues: document.getElementById('tabContentEvtVenues'),
            packages: document.getElementById('tabContentEvtPackages'),
            calendar: document.getElementById('tabContentEvtCalendar')
        };

        Object.keys(tabBtns).forEach(key => {
            const btn = tabBtns[key];
            const pane = tabPanes[key];
            if (key === tabId) {
                if (btn) {
                    btn.classList.add('active');
                    btn.style.color = '#d4af37';
                    btn.style.borderBottom = '3px solid var(--text-gold)';
                }
                if (pane) pane.style.display = 'block';
            } else {
                if (btn) {
                    btn.classList.remove('active');
                    btn.style.color = '#b0b8b4';
                    btn.style.borderBottom = 'none';
                }
                if (pane) pane.style.display = 'none';
            }
        });

        if (tabId === 'venues') this.renderVenues();
        if (tabId === 'packages') this.renderPackages();
        if (tabId === 'calendar') this.renderCalendar();
        if (tabId === 'bookings') this.renderBookingsTable();
    },

    // ----------------------------------------------------
    // Executive Metrics Calculation
    // ----------------------------------------------------
    updateDashboardMetrics() {
        const totalBookings = this.events.length;
        const confirmedBookings = this.events.filter(e => ['APPROVED', 'CONFIRMED', 'IN_PROGRESS'].includes((e.status || '').toUpperCase())).length;
        const pendingBookings = this.events.filter(e => (e.status || '').toUpperCase() === 'PENDING').length;

        // Upcoming events: dates on or after today
        const todayStr = new Date().toISOString().split('T')[0];
        const upcomingCount = this.events.filter(e => e.eventDate >= todayStr && (e.status || '').toUpperCase() !== 'CANCELLED').length;

        // Total portfolio revenue
        const totalRev = this.events
            .filter(e => (e.status || '').toUpperCase() !== 'CANCELLED')
            .reduce((sum, e) => sum + (e.totalPrice || 0), 0);

        const elTotal = document.getElementById('metricEvtTotal');
        const elConfirmed = document.getElementById('metricEvtConfirmed');
        const elUpcoming = document.getElementById('metricEvtUpcoming');
        const elPending = document.getElementById('metricEvtPending');
        const elVenues = document.getElementById('metricEvtVenues');
        const elPackages = document.getElementById('metricEvtPackages');
        const elRevenue = document.getElementById('metricEvtRevenue');

        if (elTotal) elTotal.textContent = totalBookings;
        if (elConfirmed) elConfirmed.textContent = confirmedBookings;
        if (elUpcoming) elUpcoming.textContent = upcomingCount;
        if (elPending) elPending.textContent = pendingBookings;
        if (elVenues) elVenues.textContent = this.venues.length;
        if (elPackages) elPackages.textContent = this.packages.length;
        if (elRevenue) elRevenue.textContent = Utils.formatCurrency(totalRev);
    },

    // ----------------------------------------------------
    // TAB 1: Event Bookings Data Table & Filtering
    // ----------------------------------------------------
    applyBookingFilters() {
        this.bookingFilters.search = (document.getElementById('evtSearchInput')?.value || '').trim().toLowerCase();
        this.bookingFilters.type = document.getElementById('evtFilterType')?.value || 'ALL';
        this.bookingFilters.venue = document.getElementById('evtFilterVenue')?.value || 'ALL';
        this.bookingFilters.status = document.getElementById('evtFilterStatus')?.value || 'ALL';
        this.bookingFilters.date = document.getElementById('evtFilterDate')?.value || '';
        this.renderBookingsTable();
    },

    resetBookingFilters() {
        const sInput = document.getElementById('evtSearchInput');
        const tSelect = document.getElementById('evtFilterType');
        const vSelect = document.getElementById('evtFilterVenue');
        const stSelect = document.getElementById('evtFilterStatus');
        const dInput = document.getElementById('evtFilterDate');

        if (sInput) sInput.value = '';
        if (tSelect) tSelect.value = 'ALL';
        if (vSelect) vSelect.value = 'ALL';
        if (stSelect) stSelect.value = 'ALL';
        if (dInput) dInput.value = '';

        this.bookingFilters = { search: '', type: 'ALL', venue: 'ALL', status: 'ALL', date: '' };
        this.renderBookingsTable();
    },

    getFilteredBookings() {
        return this.events.filter(e => {
            // 1. Search keyword
            if (this.bookingFilters.search) {
                const s = this.bookingFilters.search;
                const matchCode = (e.bookingCode || '').toLowerCase().includes(s) || ('#evt-' + e.id).includes(s);
                const matchTitle = (e.eventTitle || '').toLowerCase().includes(s);
                const matchCustomer = (e.customerName || '').toLowerCase().includes(s);
                const matchPhone = (e.clientPhone || '').toLowerCase().includes(s);
                if (!matchCode && !matchTitle && !matchCustomer && !matchPhone) return false;
            }

            // 2. Type filter
            if (this.bookingFilters.type !== 'ALL' && (e.eventType || '').toUpperCase() !== this.bookingFilters.type) {
                return false;
            }

            // 3. Venue filter
            if (this.bookingFilters.venue !== 'ALL' && String(e.venueId) !== String(this.bookingFilters.venue)) {
                return false;
            }

            // 4. Status filter
            if (this.bookingFilters.status !== 'ALL' && (e.status || '').toUpperCase() !== this.bookingFilters.status) {
                return false;
            }

            // 5. Date filter
            if (this.bookingFilters.date && e.eventDate !== this.bookingFilters.date) {
                return false;
            }

            return true;
        });
    },

    renderBookingsTable() {
        const tbody = document.getElementById('eventsTableBody');
        if (!tbody) return;

        const filtered = this.getFilteredBookings();

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align:center; padding:36px 20px; color:#d1d5d0;">
                        <div style="font-size:2rem; margin-bottom:8px; color:rgba(212, 175, 55, 0.35);"><i class="fa-solid fa-calendar-xmark"></i></div>
                        <div style="font-weight:700; font-size:0.95rem; color:#b0b8b4;">No event bookings match your search or filter parameters.</div>
                        <div style="font-size:0.8rem; margin-top:4px;">Try clearing filters or schedule a new event booking.</div>
                    </td>
                </tr>
            `;
            return;
        }

        const user = window.AuthManager ? AuthManager.currentUser : null;
        const isStaff = user && ['ADMIN', 'EVENT_COORDINATOR', 'OPERATIONS_SUPERVISOR', 'MANAGER'].includes(user.role);

        tbody.innerHTML = filtered.map(e => {
            const bookingCode = e.bookingCode || (`#EVT-${String(e.id).padStart(4, '0')}`);
            const venue = this.venues.find(v => v.id === e.venueId);
            const venueName = venue ? venue.name : (e.venueName || 'Pavilion #' + e.venueId);
            const pkg = this.packages.find(p => p.id === e.packageId);
            const packageName = pkg ? pkg.name : (e.packageName || 'Custom Event');

            const statusClass = this.getStatusBadgeClass(e.status);

            return `
                <tr style="transition:background 0.15s;">
                    <td class="text-center">
                        <span style="display:inline-block; padding:4px 8px; border-radius:6px; background:rgba(212, 175, 55, 0.15); border:1px solid rgba(212, 175, 55, 0.25); font-weight:800; font-size:0.78rem; color:#e6dfd5; letter-spacing:0.5px;">
                            ${Utils.escapeHtml(bookingCode)}
                        </span>
                    </td>
                    <td>
                        <div style="font-weight:800; color:#e6dfd5; font-size:0.92rem;">${Utils.escapeHtml(e.eventTitle)}</div>
                        <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
                            <span style="font-size:0.72rem; padding:1px 6px; border-radius:4px; background:#e0f2fe; color:#0369a1; font-weight:700;">
                                ${Utils.escapeHtml(e.eventType || 'EVENT')}
                            </span>
                        </div>
                    </td>
                    <td>
                        <div style="font-weight:700; color:#e6dfd5; font-size:0.88rem;">
                            <i class="fa-solid fa-user-circle" style="color:#d1d5d0; margin-right:4px;"></i>${Utils.escapeHtml(e.customerName || 'Client #' + e.customerId)}
                        </div>
                        <div style="font-size:0.75rem; color:#b0b8b4; margin-top:2px;">
                            ${e.clientPhone ? `<i class="fa-solid fa-phone" style="font-size:0.65rem;"></i> ${Utils.escapeHtml(e.clientPhone)}` : ''}
                        </div>
                    </td>
                    <td>
                        <div style="font-weight:700; color:#e6dfd5; font-size:0.85rem;">
                            <i class="fa-solid fa-hotel" style="color:var(--text-gold); margin-right:4px;"></i>${Utils.escapeHtml(venueName)}
                        </div>
                        <div style="font-size:0.72rem; color:#7c3aed; font-weight:600; margin-top:2px;">
                            <i class="fa-solid fa-gem" style="font-size:0.65rem;"></i> ${Utils.escapeHtml(packageName)}
                        </div>
                    </td>
                    <td class="text-center" style="white-space:nowrap;">
                        <div style="font-weight:700; color:#e6dfd5; font-size:0.85rem;">${Utils.formatDate(e.eventDate)}</div>
                        <div style="font-size:0.75rem; color:#b0b8b4;"><i class="fa-regular fa-clock" style="font-size:0.7rem;"></i> ${Utils.formatTime(e.startTime)} - ${Utils.formatTime(e.endTime)}</div>
                    </td>
                    <td class="text-center">
                        <span style="font-weight:800; color:#e6dfd5; font-size:0.9rem;">${e.expectedGuests || 0}</span>
                        <div style="font-size:0.7rem; color:#d1d5d0;">Guests</div>
                    </td>
                    <td class="text-right">
                        <div style="font-weight:800; color:#e6dfd5; font-size:0.9rem;">${Utils.formatCurrency(e.totalPrice || 0)}</div>
                        <div style="font-size:0.72rem; color:#059669; font-weight:600;">
                            Adv: ${Utils.formatCurrency(e.advancePayment || 0)}
                        </div>
                    </td>
                    <td class="text-center">
                        ${isStaff ? `
                            <select onchange="EventsComponent.updateBookingStatusInline(${e.id}, this.value)" style="padding:4px 8px; border-radius:8px; font-size:0.76rem; font-weight:800; cursor:pointer; border:1px solid rgba(212, 175, 55, 0.25); background:${this.getStatusBgColor(e.status)}; color:${this.getStatusTextColor(e.status)};">
                                <option value="PENDING" ${e.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                                <option value="APPROVED" ${e.status === 'APPROVED' ? 'selected' : ''}>APPROVED</option>
                                <option value="CONFIRMED" ${e.status === 'CONFIRMED' ? 'selected' : ''}>CONFIRMED</option>
                                <option value="IN_PROGRESS" ${e.status === 'IN_PROGRESS' ? 'selected' : ''}>IN PROGRESS</option>
                                <option value="COMPLETED" ${e.status === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
                                <option value="CANCELLED" ${e.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
                            </select>
                        ` : `
                            <span class="badge ${statusClass}">${e.status}</span>
                        `}
                    </td>
                    <td style="white-space:nowrap; text-align:center;">
                        <div style="display:flex; gap:6px; justify-content:center;">
                            <button class="btn-secondary" style="padding:5px 8px; font-size:0.75rem;" title="View Specifications" onclick="EventsComponent.viewBookingDetails(${e.id})">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                            <button class="btn-secondary" style="padding:5px 8px; font-size:0.75rem;" title="Edit Booking" onclick="EventsComponent.openEditBookingModal(${e.id})">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="btn-secondary" style="padding:5px 8px; font-size:0.75rem; color:#dc2626;" title="Cancel Booking" onclick="EventsComponent.confirmDeleteBooking(${e.id})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    getStatusBadgeClass(status) {
        switch ((status || '').toUpperCase()) {
            case 'CONFIRMED':
            case 'APPROVED': return 'badge-success';
            case 'IN_PROGRESS':
            case 'SCHEDULED': return 'badge-info';
            case 'COMPLETED': return 'badge-primary';
            case 'CANCELLED': return 'badge-danger';
            default: return 'badge-warning';
        }
    },

    getStatusBgColor(status) {
        switch ((status || '').toUpperCase()) {
            case 'CONFIRMED': return '#ecfdf5';
            case 'APPROVED': return '#e0f2fe';
            case 'IN_PROGRESS': return '#f3e8ff';
            case 'COMPLETED': return 'rgba(212, 175, 55, 0.15)';
            case 'CANCELLED': return '#fee2e2';
            default: return '#fefce8';
        }
    },

    getStatusTextColor(status) {
        switch ((status || '').toUpperCase()) {
            case 'CONFIRMED': return '#047857';
            case 'APPROVED': return '#0369a1';
            case 'IN_PROGRESS': return '#6b21a8';
            case 'COMPLETED': return '#d4af37';
            case 'CANCELLED': return '#b91c1c';
            default: return '#b45309';
        }
    },

    async updateBookingStatusInline(id, newStatus) {
        try {
            await ApiService.events.updateStatus(id, newStatus);
            if (window.NotificationManager) {
                NotificationManager.showToast(`Booking #EVT-${id} updated to ${newStatus}`, 'success');
            }
            await this.loadEvents();
        } catch (err) {
            console.error('[Events] Status update failed:', err);
            if (window.NotificationManager) {
                NotificationManager.showToast('Failed to update booking status: ' + err.message, 'error');
            }
        }
    },

    // ----------------------------------------------------
    // TAB 2: Venues Management (Cards + Table dual view)
    // ----------------------------------------------------
    setVenueViewMode(mode) {
        this.venueViewMode = mode;
        const btnCards = document.getElementById('btnVenueViewCards');
        const btnTable = document.getElementById('btnVenueViewTable');
        const containerCards = document.getElementById('venuesCardsContainer');
        const containerTable = document.getElementById('venuesTableContainer');

        if (mode === 'cards') {
            if (btnCards) btnCards.classList.add('active');
            if (btnTable) btnTable.classList.remove('active');
            if (containerCards) containerCards.style.display = 'grid';
            if (containerTable) containerTable.style.display = 'none';
        } else {
            if (btnCards) btnCards.classList.remove('active');
            if (btnTable) btnTable.classList.add('active');
            if (containerCards) containerCards.style.display = 'none';
            if (containerTable) containerTable.style.display = 'block';
        }
        this.renderVenues();
    },

    applyVenueFilters() {
        this.venueFilters.search = (document.getElementById('venueSearchInput')?.value || '').trim().toLowerCase();
        this.venueFilters.status = document.getElementById('venueStatusFilter')?.value || 'ALL';
        this.renderVenues();
    },

    getFilteredVenues() {
        return this.venues.filter(v => {
            if (this.venueFilters.search) {
                const s = this.venueFilters.search;
                const matchName = (v.name || '').toLowerCase().includes(s);
                const matchLoc = (v.location || '').toLowerCase().includes(s);
                const matchDesc = (v.description || '').toLowerCase().includes(s);
                const matchFac = (v.facilities || '').toLowerCase().includes(s);
                if (!matchName && !matchLoc && !matchDesc && !matchFac) return false;
            }
            if (this.venueFilters.status !== 'ALL' && (v.status || '').toUpperCase() !== this.venueFilters.status) {
                return false;
            }
            return true;
        });
    },

    renderVenues() {
        const filtered = this.getFilteredVenues();
        const cardsContainer = document.getElementById('venuesCardsContainer');
        const tableBody = document.getElementById('venuesTableListBody');

        // 1. Render Cards View
        if (cardsContainer) {
            if (filtered.length === 0) {
                cardsContainer.innerHTML = `
                    <div style="grid-column:1 / -1; text-align:center; padding:40px 20px; background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:14px; color:#d1d5d0;">
                        <i class="fa-solid fa-hotel" style="font-size:2.4rem; color:rgba(212, 175, 55, 0.35); margin-bottom:10px;"></i>
                        <div style="font-weight:700; font-size:1rem; color:#b0b8b4;">No pavilions or venues found.</div>
                    </div>
                `;
            } else {
                cardsContainer.innerHTML = filtered.map(v => {
                    const fallbackImg = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
                    const imgUrl = v.imageUrl && v.imageUrl.startsWith('http') ? v.imageUrl : fallbackImg;
                    const facilitiesList = (v.facilities || '')
                        .split(',')
                        .map(f => f.trim())
                        .filter(Boolean);

                    const statusBadge = v.status === 'AVAILABLE'
                        ? '<span class="badge badge-success">AVAILABLE</span>'
                        : (v.status === 'BOOKED' ? '<span class="badge badge-warning">BOOKED</span>' : '<span class="badge badge-danger">MAINTENANCE</span>');

                    return `
                        <div class="venue-card" style="background:linear-gradient(145deg, #1b3b2b 0%, #121816 100%); border:1px solid rgba(212, 175, 55, 0.25); border-radius:16px; overflow:hidden; box-shadow:0 8px 25px rgba(0,0,0,0.35); display:flex; flex-direction:column; transition:transform 0.2s, box-shadow 0.2s;">
                            <!-- Image Header with status badge -->
                            <div style="position:relative; height:190px; overflow:hidden; background:#121816;">
                                <img src="${imgUrl}" alt="${Utils.escapeHtml(v.name)}" style="width:100%; height:100%; object-fit:cover; opacity:0.92;" onerror="this.src='${fallbackImg}'">
                                <div style="position:absolute; top:12px; left:12px;">
                                    ${statusBadge}
                                </div>
                                <div style="position:absolute; bottom:10px; right:12px; background:rgba(15,23,42,0.85); backdrop-filter:blur(4px); padding:4px 10px; border-radius:8px; color:var(--text-gold); font-weight:800; font-size:0.85rem;">
                                    ${Utils.formatCurrency(v.pricePerHour || 0)} / hr
                                </div>
                            </div>

                            <!-- Content Body -->
                            <div style="padding:18px 20px; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                                <div>
                                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                                        <h3 style="margin:0; font-size:1.15rem; font-weight:800; color:#e6dfd5;">${Utils.escapeHtml(v.name)}</h3>
                                    </div>
                                    <div style="font-size:0.78rem; color:#b0b8b4; margin-top:4px; display:flex; align-items:center; gap:6px;">
                                        <i class="fa-solid fa-location-dot" style="color:var(--text-gold);"></i>
                                        <span>${Utils.escapeHtml(v.location || 'Grand Pavilion Wing')}</span>
                                        <span style="color:rgba(212, 175, 55, 0.35);">•</span>
                                        <i class="fa-solid fa-users" style="color:#b0b8b4;"></i>
                                        <strong>${v.capacity || 100} Guests</strong>
                                    </div>

                                    <p style="font-size:0.82rem; color:#d1d5d0; line-height:1.5; margin:10px 0 14px 0; min-height:42px;">
                                        ${Utils.escapeHtml(v.description || 'Luxurious venue suitable for state galas, wedding celebrations, and corporate events.')}
                                    </p>

                                    <!-- Facility Tags -->
                                    <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:16px;">
                                        ${facilitiesList.slice(0, 4).map(f => `
                                            <span style="font-size:0.72rem; padding:2px 8px; border-radius:6px; background:rgba(212, 175, 55, 0.15); color:#e6dfd5; font-weight:600; border:1px solid rgba(212, 175, 55, 0.2);">
                                                <i class="fa-solid fa-check" style="color:#10b981; font-size:0.65rem; margin-right:3px;"></i>${Utils.escapeHtml(f)}
                                            </span>
                                        `).join('')}
                                        ${facilitiesList.length > 4 ? `
                                            <span style="font-size:0.72rem; padding:2px 6px; border-radius:6px; background:#121816; color:#d1d5d0; font-weight:600;">
                                                +${facilitiesList.length - 4} more
                                            </span>
                                        ` : ''}
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div style="display:flex; justify-content:space-between; align-items:center; padding-top:14px; border-top:1px solid rgba(212, 175, 55, 0.2); gap:8px;">
                                    <button class="btn-secondary" style="flex:1; padding:7px 12px; font-size:0.82rem;" onclick="EventsComponent.openEditVenueModal(${v.id})">
                                        <i class="fa-solid fa-pen-to-square"></i> Edit
                                    </button>
                                    <button class="btn-secondary" style="padding:7px 12px; font-size:0.82rem; color:#dc2626;" title="Delete Venue" onclick="EventsComponent.confirmDeleteVenue(${v.id})">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // 2. Render Table View
        if (tableBody) {
            if (filtered.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:24px; color:#d1d5d0;">No venues found.</td></tr>';
            } else {
                tableBody.innerHTML = filtered.map(v => `
                    <tr>
                        <td class="text-center"><strong>#VEN-${v.id}</strong></td>
                        <td>
                            <div style="font-weight:800; color:#e6dfd5;">${Utils.escapeHtml(v.name)}</div>
                            <div style="font-size:0.75rem; color:#b0b8b4;"><i class="fa-solid fa-location-dot" style="color:var(--text-gold);"></i> ${Utils.escapeHtml(v.location || '-')}</div>
                        </td>
                        <td class="text-center"><strong>${v.capacity}</strong> Guests</td>
                        <td class="text-right"><strong>${Utils.formatCurrency(v.pricePerHour)}</strong> / hr</td>
                        <td>
                            <div style="font-size:0.78rem; color:#d1d5d0; max-width:320px;">
                                ${Utils.escapeHtml(v.facilities || '-')}
                            </div>
                        </td>
                        <td class="text-center">
                            <span class="badge badge-${v.status === 'AVAILABLE' ? 'success' : (v.status === 'BOOKED' ? 'warning' : 'danger')}">${v.status}</span>
                        </td>
                        <td class="text-center" style="white-space:nowrap;">
                            <button class="btn-secondary" style="padding:5px 8px; font-size:0.75rem;" onclick="EventsComponent.openEditVenueModal(${v.id})">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="btn-secondary" style="padding:5px 8px; font-size:0.75rem; color:#dc2626;" onclick="EventsComponent.confirmDeleteVenue(${v.id})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    },

    openCreateVenueModal() {
        const form = document.getElementById('formEvtVenue');
        if (form) form.reset();
        document.getElementById('modalVenueId').value = '';
        document.getElementById('modalVenueHeader').textContent = 'Add New Pavilion / Venue';
        document.getElementById('modalVenueStatus').value = 'AVAILABLE';
        document.getElementById('modalVenueImage').value = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
        this.updateVenueImagePreview(document.getElementById('modalVenueImage').value);

        if (window.ModalManager) ModalManager.openModal('evtVenueModal');
        else {
            const m = document.getElementById('evtVenueModal');
            if (m) m.style.display = 'flex';
        }
    },

    openEditVenueModal(id) {
        let venue = this.venues.find(v => v.id === id);
        if (!venue && window.VenuesComponent && window.VenuesComponent.venues) {
            venue = window.VenuesComponent.venues.find(v => v.id === id);
        }
        if (!venue) return;

        document.getElementById('modalVenueId').value = venue.id;
        document.getElementById('modalVenueHeader').textContent = `Edit Venue: ${venue.name}`;
        document.getElementById('modalVenueName').value = venue.name || '';
        document.getElementById('modalVenueLocation').value = venue.location || '';
        document.getElementById('modalVenueCapacity').value = venue.capacity || 100;
        document.getElementById('modalVenuePrice').value = venue.pricePerHour || 0;
        document.getElementById('modalVenueStatus').value = venue.status || 'AVAILABLE';
        document.getElementById('modalVenueImage').value = venue.imageUrl || '';
        document.getElementById('modalVenueDesc').value = venue.description || '';
        this.updateVenueImagePreview(venue.imageUrl || '');

        // Set facility checkboxes
        const currentFacilities = (venue.facilities || '').split(',').map(s => s.trim().toLowerCase());
        document.querySelectorAll('input[name="venueFacility"]').forEach(cb => {
            cb.checked = currentFacilities.includes(cb.value.toLowerCase());
        });

        if (window.ModalManager) ModalManager.openModal('evtVenueModal');
        else {
            const m = document.getElementById('evtVenueModal');
            if (m) m.style.display = 'flex';
        }
    },

    updateVenueImagePreview(url) {
        const img = document.getElementById('modalVenueImagePreview');
        if (img) {
            img.src = url && url.startsWith('http') ? url : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
        }
    },

    async handleVenueSubmit(e) {
        if (e) e.preventDefault();

        const id = document.getElementById('modalVenueId').value;
        const name = (document.getElementById('modalVenueName').value || '').trim();
        const location = (document.getElementById('modalVenueLocation').value || '').trim();
        const capacity = parseInt(document.getElementById('modalVenueCapacity').value, 10);
        const pricePerHour = parseFloat(document.getElementById('modalVenuePrice').value);
        const status = document.getElementById('modalVenueStatus').value;
        const imageUrl = (document.getElementById('modalVenueImage').value || '').trim();
        const description = (document.getElementById('modalVenueDesc').value || '').trim();

        // Selected facilities
        const checkedFacilities = Array.from(document.querySelectorAll('input[name="venueFacility"]:checked'))
            .map(cb => cb.value)
            .join(', ');

        const nameEl = document.getElementById('modalVenueName');
        const locEl = document.getElementById('modalVenueLocation');
        const capEl = document.getElementById('modalVenueCapacity');
        const priceEl = document.getElementById('modalVenuePrice');

        if (window.FormValidator) {
            const nVal = FormValidator.validateEntityName(name, 'Venue Name', 3, 100);
            if (!nVal.valid) return FormValidator.markInvalid(nameEl, nVal.message);

            if (location) {
                const lVal = FormValidator.validateEntityName(location, 'Location / Wing', 2, 150);
                if (!lVal.valid) return FormValidator.markInvalid(locEl, lVal.message);
            }

            const cVal = FormValidator.validateNumber(capacity, 'Guest Capacity', 1, 10000, true);
            if (!cVal.valid) return FormValidator.markInvalid(capEl, cVal.message);

            const pVal = FormValidator.validateNumber(pricePerHour, 'Hourly Rate (LKR)', 0);
            if (!pVal.valid) return FormValidator.markInvalid(priceEl, pVal.message);
        } else {
            if (!name || name.length < 3 || /^\d+$/.test(name) || !/[a-zA-Z]/.test(name)) {
                if (window.NotificationManager) NotificationManager.showToast('Venue name cannot be numbers only (e.g. 123). Please include letters.', 'warning');
                if (nameEl) nameEl.focus();
                return;
            }
        }

        const payload = {
            name,
            location: location || 'Grand Pavilion',
            capacity: isNaN(capacity) ? 100 : capacity,
            pricePerHour: isNaN(pricePerHour) ? 25000 : pricePerHour,
            status,
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
            facilities: checkedFacilities,
            description
        };

        try {
            if (id) {
                await ApiService.venues.update(id, payload);
                if (window.NotificationManager) NotificationManager.showToast('Venue specifications updated successfully!', 'success');
            } else {
                await ApiService.venues.create(payload);
                if (window.NotificationManager) NotificationManager.showToast('New venue registered successfully!', 'success');
            }

            if (window.ModalManager) ModalManager.closeModal('evtVenueModal');
            else {
                const m = document.getElementById('evtVenueModal');
                if (m) m.style.display = 'none';
            }

            await this.loadVenues();
            this.populateDropdowns();
        } catch (err) {
            console.error('[Events] Failed to save venue:', err);
            if (window.NotificationManager) NotificationManager.showToast('Error saving venue: ' + err.message, 'error');
        }
    },

    confirmDeleteVenue(id) {
        const venue = this.venues.find(v => v.id === id);
        if (!venue) return;

        // Safeguard: Check if venue is linked to active event bookings
        const activeBookings = this.events.filter(e => e.venueId === id && (e.status || '').toUpperCase() !== 'CANCELLED');
        if (activeBookings.length > 0) {
            if (window.NotificationManager) {
                NotificationManager.showToast(`Cannot delete venue "${venue.name}": There are ${activeBookings.length} active event bookings scheduled here.`, 'error');
            }
            return;
        }

        this.pendingDeleteTarget = { type: 'venue', id, name: venue.name };
        document.getElementById('evtDeleteModalTitle').textContent = 'Delete Venue Specification';
        document.getElementById('evtDeleteModalMessage').innerHTML = `Are you sure you want to delete venue <strong>"${Utils.escapeHtml(venue.name)}"</strong>? This action cannot be reversed.`;

        const btn = document.getElementById('evtDeleteConfirmBtn');
        btn.onclick = () => this.executeDeleteTarget();

        if (window.ModalManager) ModalManager.openModal('evtDeleteSafeguardModal');
        else {
            const m = document.getElementById('evtDeleteSafeguardModal');
            if (m) m.style.display = 'flex';
        }
    },

    // ----------------------------------------------------
    // TAB 3: Event Packages Management (CRUD)
    // ----------------------------------------------------
    filterPackageTier(tier) {
        this.selectedPackageTier = tier;
        document.querySelectorAll('.pill-filter').forEach(btn => {
            if (btn.id === `pkgTier${tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()}`) {
                btn.style.background = 'linear-gradient(135deg, #d4af37, #b8860b)';
                btn.style.color = '#121816';
            } else {
                btn.style.background = '#ffffff';
                btn.style.color = '#b0b8b4';
            }
        });
        this.renderPackages();
    },

    getFilteredPackages() {
        if (this.selectedPackageTier === 'ALL') return this.packages;
        return this.packages.filter(p => (p.tier || '').toUpperCase() === this.selectedPackageTier);
    },

    renderPackages() {
        const container = document.getElementById('packagesCardsContainer');
        if (!container) return;

        const filtered = this.getFilteredPackages();

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="grid-column:1 / -1; text-align:center; padding:40px 20px; background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:14px; color:#d1d5d0;">
                    <i class="fa-solid fa-gift" style="font-size:2.4rem; color:rgba(212, 175, 55, 0.35); margin-bottom:10px;"></i>
                    <div style="font-weight:700; font-size:1rem; color:#b0b8b4;">No event packages found for tier: ${this.selectedPackageTier}.</div>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(p => {
            const tierConfig = this.getTierVisuals(p.tier);
            const servicesList = (p.services || '')
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);

            return `
                <div class="package-card" style="background:linear-gradient(145deg, #1b3b2b 0%, #121816 100%); border:1px solid rgba(212, 175, 55, 0.25); border-radius:18px; overflow:hidden; box-shadow:0 8px 25px rgba(0,0,0,0.35); display:flex; flex-direction:column; justify-content:space-between; position:relative; transition:transform 0.2s, box-shadow 0.2s;">
                    <!-- Tier Header Banner -->
                    <div style="background:${tierConfig.gradient}; padding:20px; color:#ffffff;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:1px; background:rgba(255,255,255,0.22); backdrop-filter:blur(4px); padding:3px 10px; border-radius:20px;">
                                ${tierConfig.icon} ${p.tier || 'GOLD'} TIER
                            </span>
                            <span style="font-size:0.75rem; font-weight:700; background:rgba(0,0,0,0.2); padding:2px 8px; border-radius:8px;">
                                ${Utils.escapeHtml(p.eventType || 'ALL')}
                            </span>
                        </div>
                        <h3 style="margin:0 0 6px 0; font-size:1.25rem; font-weight:800; color:#ffffff;">${Utils.escapeHtml(p.name)}</h3>
                        <div style="display:flex; align-items:baseline; gap:6px;">
                            <span style="font-size:1.6rem; font-weight:900; color:#ffffff;">${Utils.formatCurrency(p.price || 0)}</span>
                            <span style="font-size:0.75rem; opacity:0.85;">package price</span>
                        </div>
                    </div>

                    <!-- Package Details -->
                    <div style="padding:20px; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                        <div>
                            <div style="display:flex; align-items:center; gap:8px; font-size:0.82rem; font-weight:700; color:#d1d5d0; margin-bottom:14px; background:#121816; padding:8px 12px; border-radius:10px; border:1px solid rgba(212, 175, 55, 0.2);">
                                <i class="fa-solid fa-users" style="color:var(--text-gold);"></i>
                                <span>Includes up to <strong>${p.maxGuests || 200} guests</strong></span>
                            </div>

                            <p style="font-size:0.82rem; color:#b0b8b4; line-height:1.5; margin-bottom:16px;">
                                ${Utils.escapeHtml(p.description || 'Comprehensive luxury event hospitality package crafted for memorable celebrations.')}
                            </p>

                            <!-- Included Services List -->
                            <div style="font-size:0.78rem; font-weight:800; color:#e6dfd5; text-transform:uppercase; margin-bottom:8px; letter-spacing:0.5px;">
                                Included Services & Features:
                            </div>
                            <ul style="list-style:none; padding:0; margin:0 0 20px 0; display:flex; flex-direction:column; gap:8px;">
                                ${servicesList.map(s => `
                                    <li style="font-size:0.82rem; color:#e6dfd5; display:flex; align-items:flex-start; gap:8px; line-height:1.4;">
                                        <i class="fa-solid fa-circle-check" style="color:#10b981; font-size:0.9rem; margin-top:2px; flex-shrink:0;"></i>
                                        <span>${Utils.escapeHtml(s)}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>

                        <!-- Card Action Buttons -->
                        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:14px; border-top:1px solid rgba(212, 175, 55, 0.2); gap:8px;">
                            <button class="btn-secondary" style="flex:1; padding:7px 12px; font-size:0.82rem;" onclick="EventsComponent.openEditPackageModal(${p.id})">
                                <i class="fa-solid fa-pen-to-square"></i> Edit Package
                            </button>
                            <button class="btn-secondary" style="padding:7px 12px; font-size:0.82rem; color:#dc2626;" title="Delete Package" onclick="EventsComponent.confirmDeletePackage(${p.id})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    getTierVisuals(tier) {
        switch ((tier || '').toUpperCase()) {
            case 'ROYAL':
                return { gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)', icon: '👑' };
            case 'PLATINUM':
                return { gradient: 'linear-gradient(135deg, #1b3b2b 0%, #121816 50%, #0d1210 100%)', icon: '💎' };
            case 'SILVER':
                return { gradient: 'linear-gradient(135deg, #233a30 0%, #1b3b2b 50%, #121816 100%)', icon: '🥈' };
            default: // GOLD
                return { gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 50%, #b45309 100%)', icon: '🥇' };
        }
    },

    openCreatePackageModal() {
        const form = document.getElementById('formEvtPackage');
        if (form) form.reset();
        document.getElementById('modalPackageId').value = '';
        document.getElementById('modalPackageHeader').textContent = 'Create Event Package';
        document.getElementById('modalPackageTier').value = 'GOLD';
        document.getElementById('modalPackageType').value = 'WEDDING';
        document.getElementById('modalPackageStatus').value = 'ACTIVE';

        if (window.ModalManager) ModalManager.openModal('evtPackageModal');
        else {
            const m = document.getElementById('evtPackageModal');
            if (m) m.style.display = 'flex';
        }
    },

    openEditPackageModal(id) {
        const pkg = this.packages.find(p => p.id === id);
        if (!pkg) return;

        document.getElementById('modalPackageId').value = pkg.id;
        document.getElementById('modalPackageHeader').textContent = `Edit Package: ${pkg.name}`;
        document.getElementById('modalPackageName').value = pkg.name || '';
        document.getElementById('modalPackageTier').value = pkg.tier || 'GOLD';
        document.getElementById('modalPackageType').value = pkg.eventType || 'ALL';
        document.getElementById('modalPackagePrice').value = pkg.price || 0;
        document.getElementById('modalPackageMaxGuests').value = pkg.maxGuests || 200;
        document.getElementById('modalPackageStatus').value = pkg.status || 'ACTIVE';
        document.getElementById('modalPackageServices').value = pkg.services || '';
        document.getElementById('modalPackageDesc').value = pkg.description || '';

        if (window.ModalManager) ModalManager.openModal('evtPackageModal');
        else {
            const m = document.getElementById('evtPackageModal');
            if (m) m.style.display = 'flex';
        }
    },

    appendPackageService(serviceName) {
        const txt = document.getElementById('modalPackageServices');
        if (!txt) return;
        const current = txt.value.trim();
        if (!current) {
            txt.value = serviceName;
        } else if (!current.includes(serviceName)) {
            txt.value = current + ', ' + serviceName;
        }
    },

    async handlePackageSubmit(e) {
        if (e) e.preventDefault();

        const id = document.getElementById('modalPackageId').value;
        const name = (document.getElementById('modalPackageName').value || '').trim();
        const tier = document.getElementById('modalPackageTier').value;
        const eventType = document.getElementById('modalPackageType').value;
        const price = parseFloat(document.getElementById('modalPackagePrice').value);
        const maxGuests = parseInt(document.getElementById('modalPackageMaxGuests').value, 10);
        const status = document.getElementById('modalPackageStatus').value;
        const services = (document.getElementById('modalPackageServices').value || '').trim();
        const description = (document.getElementById('modalPackageDesc').value || '').trim();

        if (!name || name.length < 3) {
            if (window.NotificationManager) NotificationManager.showToast('Please provide a package title (min 3 chars)', 'warning');
            return;
        }

        const payload = {
            name,
            tier,
            eventType,
            price: isNaN(price) ? 0 : price,
            maxGuests: isNaN(maxGuests) ? 200 : maxGuests,
            status,
            services,
            description
        };

        try {
            if (id) {
                await ApiService.packages.update(id, payload);
                if (window.NotificationManager) NotificationManager.showToast('Event package updated successfully!', 'success');
            } else {
                await ApiService.packages.create(payload);
                if (window.NotificationManager) NotificationManager.showToast('New event package created successfully!', 'success');
            }

            if (window.ModalManager) ModalManager.closeModal('evtPackageModal');
            else {
                const m = document.getElementById('evtPackageModal');
                if (m) m.style.display = 'none';
            }

            await this.loadPackages();
            this.populateDropdowns();
        } catch (err) {
            console.error('[Events] Failed to save package:', err);
            if (window.NotificationManager) NotificationManager.showToast('Error saving package: ' + err.message, 'error');
        }
    },

    confirmDeletePackage(id) {
        const pkg = this.packages.find(p => p.id === id);
        if (!pkg) return;

        this.pendingDeleteTarget = { type: 'package', id, name: pkg.name };
        document.getElementById('evtDeleteModalTitle').textContent = 'Delete Event Package';
        document.getElementById('evtDeleteModalMessage').innerHTML = `Are you sure you want to delete package <strong>"${Utils.escapeHtml(pkg.name)}"</strong>?`;

        const btn = document.getElementById('evtDeleteConfirmBtn');
        btn.onclick = () => this.executeDeleteTarget();

        if (window.ModalManager) ModalManager.openModal('evtDeleteSafeguardModal');
        else {
            const m = document.getElementById('evtDeleteSafeguardModal');
            if (m) m.style.display = 'flex';
        }
    },

    // ----------------------------------------------------
    // Create & Edit Event Booking Modal & Lifecycle
    // ----------------------------------------------------
    openCreateBookingModal() {
        const form = document.getElementById('formEvtBooking');
        if (form) form.reset();
        document.getElementById('modalEvtBookingId').value = '';
        document.getElementById('modalEvtBookingHeader').textContent = 'New Executive Event Booking';
        document.getElementById('modalEvtStatus').value = 'CONFIRMED';

        // Default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('modalEvtDate').value = tomorrow.toISOString().split('T')[0];
        document.getElementById('modalEvtStartTime').value = '18:00';
        document.getElementById('modalEvtEndTime').value = '23:00';
        document.getElementById('modalEvtGuests').value = '100';

        this.populateModalDropdowns();
        this.recalculateBookingPricing();

        if (window.ModalManager) ModalManager.openModal('evtBookingModal');
        else {
            const m = document.getElementById('evtBookingModal');
            if (m) m.style.display = 'flex';
        }
    },

    openEditBookingModal(id) {
        const evt = this.events.find(e => e.id === id);
        if (!evt) return;

        this.populateModalDropdowns();

        document.getElementById('modalEvtBookingId').value = evt.id;
        document.getElementById('modalEvtBookingHeader').textContent = `Edit Booking: ${evt.bookingCode || '#EVT-' + evt.id}`;
        document.getElementById('modalEvtCustomer').value = evt.customerId || '';
        document.getElementById('modalEvtPhone').value = evt.clientPhone || '';
        document.getElementById('modalEvtEmail').value = evt.clientEmail || '';
        document.getElementById('modalEvtTitle').value = evt.eventTitle || '';
        document.getElementById('modalEvtType').value = evt.eventType || 'WEDDING';
        document.getElementById('modalEvtVenue').value = evt.venueId || '';
        document.getElementById('modalEvtPackage').value = evt.packageId || '';
        document.getElementById('modalEvtDate').value = evt.eventDate || '';
        document.getElementById('modalEvtStartTime').value = (evt.startTime || '').substring(0, 5) || '18:00';
        document.getElementById('modalEvtEndTime').value = (evt.endTime || '').substring(0, 5) || '23:00';
        document.getElementById('modalEvtGuests').value = evt.expectedGuests || 100;
        document.getElementById('modalEvtTotalPrice').value = evt.totalPrice || 0;
        document.getElementById('modalEvtAdvancePayment').value = evt.advancePayment || 0;
        document.getElementById('modalEvtStatus').value = evt.status || 'CONFIRMED';
        document.getElementById('modalEvtRequirements').value = evt.specialRequirements || '';

        if (window.ModalManager) ModalManager.openModal('evtBookingModal');
        else {
            const m = document.getElementById('evtBookingModal');
            if (m) m.style.display = 'flex';
        }
    },

    populateModalDropdowns() {
        // Customer select
        const custSelect = document.getElementById('modalEvtCustomer');
        if (custSelect) {
            custSelect.innerHTML = '<option value="">-- Choose Client Account --</option>' +
                this.customers.map(c => `
                    <option value="${c.id}">${Utils.escapeHtml(c.fullName || c.username)} (${c.email || c.phone || 'ID: ' + c.id})</option>
                `).join('');
        }

        // Venue select
        const venueSelect = document.getElementById('modalEvtVenue');
        if (venueSelect) {
            venueSelect.innerHTML = '<option value="">-- Select Ballroom / Pavilion --</option>' +
                this.venues.map(v => `
                    <option value="${v.id}">${Utils.escapeHtml(v.name)} (Cap: ${v.capacity}, ${Utils.formatCurrency(v.pricePerHour)}/hr)</option>
                `).join('');
        }

        // Package select
        const pkgSelect = document.getElementById('modalEvtPackage');
        if (pkgSelect) {
            pkgSelect.innerHTML = '<option value="">-- Custom / No Package --</option>' +
                this.packages.filter(p => p.status !== 'INACTIVE').map(p => `
                    <option value="${p.id}">${Utils.escapeHtml(p.name)} [${p.tier}] (${Utils.formatCurrency(p.price)})</option>
                `).join('');
        }
    },

    onBookingClientChange(clientId) {
        if (!clientId) return;
        const client = this.customers.find(c => String(c.id) === String(clientId));
        if (client) {
            const phoneEl = document.getElementById('modalEvtPhone');
            const emailEl = document.getElementById('modalEvtEmail');
            if (phoneEl && client.phone) phoneEl.value = client.phone;
            if (emailEl && client.email) emailEl.value = client.email;
        }
    },

    onBookingCategoryChange(category) {
        // Suggest a title if empty
        const titleEl = document.getElementById('modalEvtTitle');
        if (titleEl && !titleEl.value) {
            const catMap = {
                WEDDING: 'Grand Wedding Reception',
                CORPORATE: 'Annual Corporate Gala & Summit',
                BIRTHDAY: 'Milestone Birthday Celebration',
                PARTY: 'Private VIP Dining Soirée',
                OTHER: 'Celebration Banquet'
            };
            titleEl.value = catMap[category] || 'Event Celebration';
        }
    },

    onBookingPackageChange(pkgId) {
        if (!pkgId) {
            this.recalculateBookingPricing();
            return;
        }
        const pkg = this.packages.find(p => String(p.id) === String(pkgId));
        if (pkg) {
            const priceEl = document.getElementById('modalEvtTotalPrice');
            const guestsEl = document.getElementById('modalEvtGuests');
            if (priceEl) priceEl.value = pkg.price;
            if (guestsEl && pkg.maxGuests) guestsEl.value = Math.min(parseInt(guestsEl.value || '100', 10), pkg.maxGuests);
            // Default 30% advance
            const advEl = document.getElementById('modalEvtAdvancePayment');
            if (advEl && (!advEl.value || advEl.value === '0')) {
                advEl.value = Math.round(pkg.price * 0.3);
            }
        }
    },

    recalculateBookingPricing() {
        const pkgId = document.getElementById('modalEvtPackage')?.value;
        if (pkgId) {
            // If package selected, package price takes precedence unless customized
            const pkg = this.packages.find(p => String(p.id) === String(pkgId));
            if (pkg) {
                const priceEl = document.getElementById('modalEvtTotalPrice');
                if (priceEl && (!priceEl.value || parseFloat(priceEl.value) === 0)) {
                    priceEl.value = pkg.price;
                }
                return;
            }
        }

        const venueId = document.getElementById('modalEvtVenue')?.value;
        const startTime = document.getElementById('modalEvtStartTime')?.value || '18:00';
        const endTime = document.getElementById('modalEvtEndTime')?.value || '23:00';
        const guests = parseInt(document.getElementById('modalEvtGuests')?.value || '100', 10);

        const venue = this.venues.find(v => String(v.id) === String(venueId));
        if (venue) {
            const [sh, sm] = startTime.split(':').map(Number);
            const [eh, em] = endTime.split(':').map(Number);
            const durationMinutes = (eh * 60 + em) - (sh * 60 + sm);
            const hours = Math.max(1, durationMinutes > 0 ? durationMinutes / 60 : 5);

            const venueCost = (venue.pricePerHour || 25000) * hours;
            const cateringEst = guests * 3000;
            const total = venueCost + cateringEst;

            const priceEl = document.getElementById('modalEvtTotalPrice');
            if (priceEl) priceEl.value = total;

            const advEl = document.getElementById('modalEvtAdvancePayment');
            if (advEl && (!advEl.value || advEl.value === '0')) {
                advEl.value = Math.round(total * 0.3);
            }
        }
    },

    async handleBookingSubmit(e) {
        if (e) e.preventDefault();

        const id = document.getElementById('modalEvtBookingId').value;
        const customerId = parseInt(document.getElementById('modalEvtCustomer').value, 10);
        const venueId = parseInt(document.getElementById('modalEvtVenue').value, 10);
        const packageIdVal = document.getElementById('modalEvtPackage').value;
        const packageId = packageIdVal ? parseInt(packageIdVal, 10) : null;

        const eventTitle = (document.getElementById('modalEvtTitle').value || '').trim();
        const eventType = document.getElementById('modalEvtType').value;
        const eventDate = document.getElementById('modalEvtDate').value;
        const startTime = document.getElementById('modalEvtStartTime').value;
        const endTime = document.getElementById('modalEvtEndTime').value;
        const expectedGuests = parseInt(document.getElementById('modalEvtGuests').value, 10);
        const totalPrice = parseFloat(document.getElementById('modalEvtTotalPrice').value) || 0;
        const advancePayment = parseFloat(document.getElementById('modalEvtAdvancePayment').value) || 0;
        const status = document.getElementById('modalEvtStatus').value;
        const clientPhone = (document.getElementById('modalEvtPhone').value || '').trim();
        const clientEmail = (document.getElementById('modalEvtEmail').value || '').trim();
        const specialRequirements = (document.getElementById('modalEvtRequirements').value || '').trim();

        if (!customerId) {
            if (window.NotificationManager) NotificationManager.showToast('Please select a customer client account', 'warning');
            return;
        }
        if (!venueId) {
            if (window.NotificationManager) NotificationManager.showToast('Please select a venue / pavilion', 'warning');
            return;
        }

        const todayStr = new Date().toISOString().split('T')[0];
        if (eventDate < todayStr) {
            if (window.NotificationManager) NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', 'error');
            return;
        }
        if (eventDate === todayStr && startTime) {
            const [sh, sm] = startTime.split(':').map(Number);
            const slotTime = new Date();
            slotTime.setHours(sh, sm, 0, 0);
            if (slotTime < new Date(Date.now() - 5 * 60000)) {
                if (window.NotificationManager) NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', 'error');
                return;
            }
        }

        // Daily limit rule: max 10 active events per day
        const activeEventsOnDate = this.events.filter(e =>
            e.eventDate === eventDate &&
            !['CANCELLED', 'REJECTED'].includes((e.status || '').toUpperCase()) &&
            (!id || String(e.id) !== String(id))
        ).length;
        if (activeEventsOnDate >= 10) {
            if (window.NotificationManager) NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', 'error');
            return;
        }

        // Venue collision rule: overlapping time check
        const venueConflict = this.events.find(e => {
            if (id && String(e.id) === String(id)) return false;
            if (['CANCELLED', 'REJECTED'].includes((e.status || '').toUpperCase())) return false;
            if (String(e.venueId) !== String(venueId)) return false;
            if (e.eventDate !== eventDate) return false;
            if (!startTime || !endTime || !e.startTime || !e.endTime) return true;
            const eStart = (e.startTime || '').substring(0, 5);
            const eEnd = (e.endTime || '').substring(0, 5);
            return (startTime < eEnd && eStart < endTime);
        });
        if (venueConflict) {
            if (window.NotificationManager) NotificationManager.showToast('Sorry, bookings for this date and time are fully booked / time is over. Please choose another slot!', 'error');
            return;
        }

        const dVal = FormValidator.validateDate(eventDate, 'Event Date', false);
        if (!dVal.valid) {
            return FormValidator.markInvalid(document.getElementById('modalEvtDate'), dVal.message);
        }
        const tVal = FormValidator.validateTimeRange(startTime, endTime);
        if (!tVal.valid) {
            return FormValidator.markInvalid(document.getElementById('modalEvtEndTime'), tVal.message);
        }

        const payMethod = document.getElementById('modalEvtPaymentMethod')?.value || 'BANK_TRANSFER';
        const bankRef = (document.getElementById('modalEvtBankRef')?.value || '').trim();
        const slipFile = document.getElementById('modalEvtSlipFile')?.files?.[0] || null;

        if (advancePayment > 0 && payMethod === 'BANK_TRANSFER') {
            if (!bankRef) {
                if (window.NotificationManager) NotificationManager.showToast('Please enter the Bank Transfer Reference Number', 'warning');
                return;
            }
        }

        const payload = {
            customerId,
            venueId,
            packageId,
            eventTitle,
            eventType,
            eventDate,
            startTime,
            endTime,
            expectedGuests: isNaN(expectedGuests) ? 100 : expectedGuests,
            totalPrice,
            advancePayment,
            status,
            clientPhone,
            clientEmail,
            specialRequirements
        };

        try {
            let res;
            if (id) {
                res = await ApiService.events.update(id, payload);
                if (window.NotificationManager) NotificationManager.showToast('Event booking updated successfully!', 'success');
            } else {
                res = await ApiService.events.create(payload);
                if (window.NotificationManager) NotificationManager.showToast('Event booked and scheduled successfully!', 'success');
            }

            const evtObj = (res && res.data) ? res.data : (res || {});
            const bookingId = evtObj.id || id || Date.now();

            // Record bank slip payment in PENDING_VERIFICATION if slip is provided
            if (advancePayment > 0 && payMethod === 'BANK_TRANSFER' && slipFile) {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const slipDataUrl = event.target.result;
                    try {
                        const clientName = (document.getElementById('modalEvtCustomer')?.selectedOptions?.[0]?.text || 'Valued Client');
                        await ApiService.billing.recordPayment({
                            bookingRef: 'EVT-' + bookingId,
                            customerName: clientName,
                            paymentMethod: 'BANK_TRANSFER',
                            totalAmount: totalPrice,
                            depositAmount: advancePayment,
                            amountPaid: advancePayment,
                            balanceAmount: Math.max(0, totalPrice - advancePayment),
                            transactionRef: bankRef || ('SLIP-EVT-' + Date.now()),
                            status: 'PENDING_VERIFICATION',
                            slipUrl: slipDataUrl,
                            slipFileName: slipFile.name
                        });
                        if (window.BillingComponent) BillingComponent.load();
                    } catch (err) {
                        console.error('[Event Slip Payment Recording Error]', err);
                    }
                };
                reader.readAsDataURL(slipFile);
            }

            if (window.ModalManager) ModalManager.closeModal('evtBookingModal');
            else {
                const m = document.getElementById('evtBookingModal');
                if (m) m.style.display = 'none';
            }

            await this.loadEvents();
        } catch (err) {
            console.error('[Events] Failed to save booking:', err);
            if (window.NotificationManager) NotificationManager.showToast('Failed to save booking: ' + err.message, 'error');
        }
    },

    toggleSlipFields() {
        const method = document.getElementById('modalEvtPaymentMethod')?.value;
        const box = document.getElementById('modalEvtBankSlipBox');
        if (box) box.style.display = (method === 'BANK_TRANSFER') ? 'block' : 'none';
    },

    previewSlip(event) {
        const file = event?.target?.files?.[0];
        if (!file) return;

        const container = document.getElementById('modalEvtSlipPreviewContainer');
        const img = document.getElementById('modalEvtSlipPreviewImg');
        const pdf = document.getElementById('modalEvtSlipPdfBadge');

        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            if (img) img.style.display = 'none';
            if (pdf) {
                pdf.style.display = 'block';
                pdf.innerHTML = `<i class="fa-solid fa-file-pdf"></i> Attached: <strong>${Utils.escapeHtml(file.name)}</strong> (${(file.size / 1024).toFixed(1)} KB)`;
            }
            if (container) container.style.display = 'block';
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (pdf) pdf.style.display = 'none';
                if (img) {
                    img.src = e.target.result;
                    img.style.display = 'inline-block';
                }
                if (container) container.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    },

    confirmDeleteBooking(id) {
        const evt = this.events.find(e => e.id === id);
        if (!evt) return;

        this.pendingDeleteTarget = { type: 'event', id, name: evt.eventTitle };
        document.getElementById('evtDeleteModalTitle').textContent = 'Cancel Event Booking';
        document.getElementById('evtDeleteModalMessage').innerHTML = `Are you sure you want to cancel booking <strong>"${Utils.escapeHtml(evt.eventTitle)}"</strong> (#EVT-${id})?`;

        const btn = document.getElementById('evtDeleteConfirmBtn');
        btn.onclick = () => this.executeDeleteTarget();

        if (window.ModalManager) ModalManager.openModal('evtDeleteSafeguardModal');
        else {
            const m = document.getElementById('evtDeleteSafeguardModal');
            if (m) m.style.display = 'flex';
        }
    },

    viewBookingDetails(id) {
        const evt = this.events.find(e => e.id === id);
        if (!evt) return;

        const venue = this.venues.find(v => v.id === evt.venueId);
        const pkg = this.packages.find(p => p.id === evt.packageId);

        const detailsHtml = `
            Booking Code: ${evt.bookingCode || '#EVT-' + evt.id}
            Event Title: ${evt.eventTitle}
            Category: ${evt.eventType}
            Client: ${evt.customerName || 'Customer #' + evt.customerId}
            Contact: ${evt.clientPhone || '-'} | ${evt.clientEmail || '-'}
            Venue: ${venue ? venue.name : evt.venueName || '-'}
            Package: ${pkg ? pkg.name : (evt.packageName || 'Custom Event')}
            Date: ${evt.eventDate} (${evt.startTime} - ${evt.endTime})
            Guests: ${evt.expectedGuests}
            Total Price: LKR ${evt.totalPrice || 0}
            Advance Paid: LKR ${evt.advancePayment || 0}
            Status: ${evt.status}
            Requirements: ${evt.specialRequirements || 'None specified'}
        `;

        if (window.NotificationManager) {
            NotificationManager.showToast(`Details for ${evt.bookingCode || '#EVT-' + evt.id} loaded in console.`, 'info');
        }
        console.log('[Event Specifications]', detailsHtml);
        this.openEditBookingModal(id);
    },

    async executeDeleteTarget() {
        if (!this.pendingDeleteTarget) return;

        const { type, id, name } = this.pendingDeleteTarget;

        try {
            if (type === 'venue') {
                await ApiService.venues.delete(id);
                if (window.NotificationManager) NotificationManager.showToast(`Venue "${name}" removed.`, 'success');
                await this.loadVenues();
                this.populateDropdowns();
            } else if (type === 'package') {
                await ApiService.packages.delete(id);
                if (window.NotificationManager) NotificationManager.showToast(`Package "${name}" removed.`, 'success');
                await this.loadPackages();
                this.populateDropdowns();
            } else if (type === 'event') {
                await ApiService.events.delete(id);
                if (window.NotificationManager) NotificationManager.showToast(`Booking #EVT-${id} cancelled.`, 'success');
                await this.loadEvents();
            }

            if (window.ModalManager) ModalManager.closeModal('evtDeleteSafeguardModal');
            else {
                const m = document.getElementById('evtDeleteSafeguardModal');
                if (m) m.style.display = 'none';
            }
        } catch (err) {
            console.error('[Events] Delete error:', err);
            if (window.NotificationManager) NotificationManager.showToast('Error removing item: ' + err.message, 'error');
        } finally {
            this.pendingDeleteTarget = null;
        }
    },

    // ----------------------------------------------------
    // TAB 4: Interactive Schedule Calendar
    // ----------------------------------------------------
    renderCalendar() {
        const calGrid = document.getElementById('calendarDaysGrid');
        const calTitle = document.getElementById('calMonthYearTitle');
        if (!calGrid) return;

        const year = this.calendarCurrentDate.getFullYear();
        const month = this.calendarCurrentDate.getMonth();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (calTitle) calTitle.textContent = `${monthNames[month]} ${year}`;

        // First day index (Mon=0, Tue=1 ... Sun=6)
        let firstDayIndex = new Date(year, month, 1).getDay() - 1;
        if (firstDayIndex < 0) firstDayIndex = 6;
        const totalDays = new Date(year, month + 1, 0).getDate();

        let gridHtml = '';
        for (let i = 0; i < firstDayIndex; i++) {
            gridHtml += '<div class="calendar-day-cell empty" style="min-height:95px; background:#121816; border-right:1px solid rgba(212, 175, 55, 0.15); border-bottom:1px solid rgba(212, 175, 55, 0.15); opacity:0.4;"></div>';
        }

        const todayStr = new Date().toISOString().split('T')[0];

        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = this.events.filter(e => e.eventDate === dateStr && (e.status || '').toUpperCase() !== 'CANCELLED');
            const isToday = todayStr === dateStr;

            gridHtml += `
                <div class="calendar-day-cell" style="min-height:95px; padding:8px; background:${isToday ? '#fefce8' : '#ffffff'}; border-right:1px solid rgba(212, 175, 55, 0.15); border-bottom:1px solid rgba(212, 175, 55, 0.15); font-size:0.8rem; overflow-y:auto;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                        <span style="font-weight:800; color:${isToday ? '#d4af37' : '#e6dfd5'}; font-size:0.85rem;">${day}</span>
                        ${dayEvents.length > 0 ? `<span style="font-size:0.68rem; background:#121816; color:#ffffff; padding:1px 5px; border-radius:10px; font-weight:700;">${dayEvents.length}</span>` : ''}
                    </div>
                    ${dayEvents.map(e => `
                        <div style="background:#121816; color:#ffffff; padding:3px 6px; border-radius:6px; font-size:0.72rem; margin-bottom:3px; cursor:pointer; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; border-left:3px solid var(--text-gold);" onclick="EventsComponent.viewBookingDetails(${e.id})" title="${Utils.escapeHtml(e.eventTitle)} (${e.startTime}-${e.endTime})">
                            ${Utils.escapeHtml(e.eventTitle)}
                        </div>
                    `).join('')}
                </div>
            `;
        }

        calGrid.innerHTML = gridHtml;
        this.renderCalendarSummaryCards();
    },

    renderCalendarSummaryCards() {
        const container = document.getElementById('eventsCalendarGrid');
        if (!container) return;

        const upcoming = this.events
            .filter(e => (e.status || '').toUpperCase() !== 'CANCELLED')
            .slice(0, 6);

        if (upcoming.length === 0) {
            container.innerHTML = '<div style="grid-column:1 / -1; color:#d1d5d0; font-size:0.85rem;">No upcoming events scheduled.</div>';
            return;
        }

        container.innerHTML = upcoming.map(e => `
            <div style="background:linear-gradient(145deg, #1b3b2b 0%, #121816 100%); border:1px solid rgba(212, 175, 55, 0.25); border-radius:12px; padding:14px; box-shadow:0 4px 15px rgba(0,0,0,0.3);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:0.75rem; font-weight:800; color:var(--text-gold);">${e.bookingCode || '#EVT-' + e.id}</span>
                    <span class="badge ${this.getStatusBadgeClass(e.status)}">${e.status}</span>
                </div>
                <div style="font-weight:800; color:#e6dfd5; font-size:0.92rem; margin-bottom:4px;">${Utils.escapeHtml(e.eventTitle)}</div>
                <div style="font-size:0.78rem; color:#b0b8b4;">
                    <i class="fa-regular fa-calendar"></i> ${Utils.formatDate(e.eventDate)} (${Utils.formatTime(e.startTime)})
                </div>
            </div>
        `).join('');
    },

    changeCalendarMonth(delta) {
        this.calendarCurrentDate.setMonth(this.calendarCurrentDate.getMonth() + delta);
        this.renderCalendar();
    },

    resetCalendarToToday() {
        this.calendarCurrentDate = new Date();
        this.renderCalendar();
    },

    // ----------------------------------------------------
    // General Dropdown Populator
    // ----------------------------------------------------
    populateDropdowns() {
        // Filter dropdown in Bookings toolbar
        const filterVenue = document.getElementById('evtFilterVenue');
        if (filterVenue) {
            const currentVal = filterVenue.value;
            filterVenue.innerHTML = '<option value="ALL">All Venues & Pavilions</option>' +
                this.venues.map(v => `<option value="${v.id}">${Utils.escapeHtml(v.name)}</option>`).join('');
            filterVenue.value = currentVal || 'ALL';
        }

        // Public event modal venue dropdown
        const publiceVenue = document.getElementById('eVenueId');
        if (publiceVenue) {
            publiceVenue.innerHTML = '<option value="">-- Choose Venue Pavilion --</option>' +
                this.venues.map(v => `<option value="${v.id}">${Utils.escapeHtml(v.name)} (Cap: ${v.capacity}, ${Utils.formatCurrency(v.pricePerHour)}/hr)</option>`).join('');
        }
    },

    // ----------------------------------------------------
    // Public Booking Compatibility Handlers
    // ----------------------------------------------------
    calculateEstimate() {
        const venueId = document.getElementById('eVenueId')?.value;
        const startTime = document.getElementById('eStartTime')?.value;
        const endTime = document.getElementById('eEndTime')?.value;
        const guests = parseInt(document.getElementById('eGuests')?.value || '0', 10);
        const totalEl = document.getElementById('eventEstimatedTotal');
        const breakEl = document.getElementById('eventEstimateBreakdown');

        if (!totalEl) return;

        const venue = this.venues.find(v => String(v.id) === String(venueId));
        if (!venue || !startTime || !endTime) {
            totalEl.textContent = 'LKR 0.00';
            if (breakEl) breakEl.textContent = 'Select venue, duration and guest count for instant pricing preview.';
            return;
        }

        const [sh, sm] = startTime.split(':').map(Number);
        const [eh, em] = endTime.split(':').map(Number);
        const durationMinutes = (eh * 60 + em) - (sh * 60 + sm);
        const hours = Math.max(1, durationMinutes > 0 ? durationMinutes / 60 : 4);

        const venueRate = venue.pricePerHour || 25000;
        const venueCost = venueRate * hours;
        const cateringCost = guests > 0 ? guests * 2500 : 0;
        const total = venueCost + cateringCost;

        totalEl.textContent = Utils.formatCurrency(total);
        if (breakEl) {
            breakEl.innerHTML = `<strong>Venue:</strong> ${Utils.formatCurrency(venueCost)} (${hours.toFixed(1)} hrs) + <strong>Catering:</strong> ${Utils.formatCurrency(cateringCost)} (${guests} guests)`;
        }
    },

    async handleSubmit(e) {
        if (e) e.preventDefault();

        const titleEl = document.getElementById('eTitle');
        const venueEl = document.getElementById('eVenueId');
        const dateEl = document.getElementById('eDate');
        const startEl = document.getElementById('eStartTime');
        const endEl = document.getElementById('eEndTime');
        const guestsEl = document.getElementById('eGuests');
        const user = window.AuthManager ? AuthManager.currentUser : null;

        if (!user) {
            if (window.NotificationManager) NotificationManager.showToast('Please sign in to book an event', 'warning');
            if (window.ModalManager) ModalManager.openModal('loginModal');
            return;
        }

        const payload = {
            customerId: user.id,
            venueId: parseInt(venueEl?.value, 10),
            eventTitle: (titleEl?.value || '').trim(),
            eventType: document.getElementById('eType')?.value || 'WEDDING',
            eventDate: dateEl?.value,
            startTime: startEl?.value,
            endTime: endEl?.value,
            expectedGuests: parseInt(guestsEl?.value || '50', 10),
            specialRequirements: (document.getElementById('eRequirements')?.value || '').trim(),
            status: 'PENDING'
        };

        const dVal = FormValidator.validateDate(payload.eventDate, 'Event Date', false);
        if (!dVal.valid) {
            return FormValidator.markInvalid(dateEl, dVal.message);
        }
        const tVal = FormValidator.validateTimeRange(payload.startTime, payload.endTime);
        if (!tVal.valid) {
            return FormValidator.markInvalid(endEl, tVal.message);
        }

        try {
            await ApiService.events.create(payload);
            if (window.NotificationManager) NotificationManager.showToast('Event inquiry submitted successfully! A coordinator will confirm shortly.', 'success');
            if (window.ModalManager) ModalManager.closeModal('eventModal');
            await this.loadEvents();
        } catch (err) {
            console.error('[Events] Public inquiry error:', err);
            if (window.NotificationManager) NotificationManager.showToast('Booking failed: ' + err.message, 'error');
        }
    }
};

// Global bindings for backward compatibility and HTML onclick events
window.EventsComponent = EventsComponent;
window.calculateEventEstimate = () => EventsComponent.calculateEstimate();
window.handleEventSubmit = (e) => EventsComponent.handleSubmit(e);
window.handleVenueSubmit = (e) => EventsComponent.handleVenueSubmit(e);

// Global handler for editEventModal form
window.handleEditEventSubmit = async function(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('editEvtId')?.value;
    const title = (document.getElementById('editEvtTitle')?.value || '').trim();
    const type = document.getElementById('editEvtType')?.value || 'WEDDING';
    const guests = parseInt(document.getElementById('editEvtGuests')?.value, 10);
    const dateEl = document.getElementById('editEvtDate');
    const date = dateEl?.value;
    const startTime = document.getElementById('editEvtStartTime')?.value;
    const endTime = document.getElementById('editEvtEndTime')?.value;
    const requirements = (document.getElementById('editEvtRequirements')?.value || '').trim();
    const status = document.getElementById('editEvtStatus')?.value;

    const dVal = FormValidator.validateDate(date, 'Event Date', false);
    if (!dVal.valid) {
        return FormValidator.markInvalid(dateEl, dVal.message);
    }
    const tVal = FormValidator.validateTimeRange(startTime, endTime);
    if (!tVal.valid) {
        return FormValidator.markInvalid(document.getElementById('editEvtEndTime'), tVal.message);
    }

    try {
        const payload = {
            id: parseInt(id, 10),
            eventTitle: title,
            eventType: type,
            expectedGuests: guests,
            eventDate: date,
            startTime,
            endTime,
            specialRequirements: requirements,
            status
        };
        await ApiService.events.update(id, payload);
        if (window.NotificationManager) NotificationManager.showToast('Event details updated successfully!');
        if (window.ModalManager) ModalManager.closeModal('editEventModal');
        if (window.EventsComponent) window.EventsComponent.loadBookings();
    } catch (err) {
        if (window.NotificationManager) NotificationManager.showToast('Failed to update event: ' + err.message, true);
    }
};
