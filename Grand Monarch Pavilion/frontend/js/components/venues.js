/**
 * Venues Component
 * Complete CRUD and showcase for luxury event pavilions and banquet halls.
 */

const VenuesComponent = {
    venues: [],

    async load() {
        try {
            const data = await ApiService.venues.getAll();
            this.venues = data || [];
            this.renderShowcase();
            this.renderManagementTable();
            if (window.EventsComponent) {
                window.EventsComponent.venues = this.venues;
            }
        } catch (err) {
            console.error('[Venues Load Error]', err);
        }
    },

    openCreateVenueModal() {
        if (window.EventsComponent && typeof window.EventsComponent.openCreateVenueModal === 'function') {
            window.EventsComponent.openCreateVenueModal();
        } else if (window.ModalManager) {
            window.ModalManager.openModal('evtVenueModal');
        }
    },

    renderShowcase() {
        const container = document.getElementById('venuesShowcaseContainer');
        if (!container) return;

        if (this.venues.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:30px; color:#d1d5d0;">No venues registered yet.</div>';
            return;
        }

        container.innerHTML = this.venues.map(v => {
            const isFav = window.ReviewsComponent ? ReviewsComponent.isFavorite('venues', v.id) : false;
            const fallbackImg = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
            const imgUrl = v.imageUrl && v.imageUrl.startsWith('http') ? v.imageUrl : fallbackImg;
            return `
            <div class="venue-card" style="background:linear-gradient(145deg, #1b3b2b 0%, #121816 100%); border:1px solid rgba(212, 175, 55, 0.25); border-radius:14px; overflow:hidden; box-shadow:0 8px 25px rgba(0,0,0,0.35); transition:transform 0.25s, box-shadow 0.25s; position:relative;" onmouseenter="this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(212,175,55,0.6)'" onmouseleave="this.style.transform='translateY(0)'; this.style.borderColor='rgba(212,175,55,0.25)'">
                <button type="button" onclick="toggleFavorite('venues', ${v.id})" title="${isFav ? 'Remove Favorite' : 'Save as VIP Favorite'}" style="position:absolute; top:14px; right:14px; z-index:10; background:rgba(18, 24, 22, 0.8); backdrop-filter:blur(6px); border:1px solid rgba(212, 175, 55, 0.35); border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:${isFav ? '#dc2626' : '#d4af37'}; transition:all 0.2s;">
                    <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                </button>
                <div style="height:190px; overflow:hidden; background:#121816; position:relative;">
                    <img src="${imgUrl}" alt="${Utils.escapeHtml(v.name)}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='${fallbackImg}'">
                    <div style="position:absolute; bottom:8px; left:12px; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); padding:3px 8px; border-radius:6px; color:#ffffff; font-size:0.75rem; font-weight:700;">
                        <i class="fa-solid fa-location-dot" style="color:var(--text-gold);"></i> ${Utils.escapeHtml(v.location || 'Main Pavilion')}
                    </div>
                </div>
                <div style="padding:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <h3 style="margin:0; font-size:1.15rem; font-weight:800; color:#ffffff;">${Utils.escapeHtml(v.name)}</h3>
                        <span class="badge badge-${v.status === 'AVAILABLE' ? 'success' : 'warning'}">${v.status}</span>
                    </div>
                    <p style="font-size:0.85rem; color:#b0b8b4; line-height:1.55; min-height:42px;">${Utils.escapeHtml(v.description || 'Luxurious hall setting for weddings, banquets, and gala dinners.')}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; padding-top:14px; border-top:1px solid rgba(212, 175, 55, 0.2); margin-top:14px;">
                        <div>
                            <div style="font-size:0.75rem; color:#b0b8b4; font-weight:700;">CAPACITY</div>
                            <div style="font-weight:800; color:#ffffff;"><i class="fa-solid fa-users" style="color:var(--text-gold);"></i> ${v.capacity} Guests</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-size:0.75rem; color:#b0b8b4; font-weight:700;">HOURLY RATE</div>
                            <div style="font-weight:800; color:var(--text-gold, #d4af37);">${Utils.formatCurrency(v.pricePerHour)}/hr</div>
                        </div>
                    </div>
                    <button class="btn-primary" style="width:100%; margin-top:16px; padding:10px; font-weight:700;" onclick="AuthManager.handleBookingAuthGuard('eventModal')">
                        <i class="fa-solid fa-calendar-plus"></i> Reserve Pavilion
                    </button>
                </div>
            </div>
            `;
        }).join('');
    },

    renderManagementTable() {
        const tbody = document.getElementById('venuesTableBody');
        if (!tbody) return;

        if (this.venues.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:#d1d5d0;">No venues available.</td></tr>';
            return;
        }

        tbody.innerHTML = this.venues.map(v => `
            <tr>
                <td><strong>#VEN-${v.id}</strong></td>
                <td><strong>${Utils.escapeHtml(v.name)}</strong></td>
                <td>${Utils.escapeHtml(v.location || v.description || '-')}</td>
                <td>${v.capacity} Guests</td>
                <td><strong>${Utils.formatCurrency(v.pricePerHour)}</strong></td>
                <td><span class="badge badge-${v.status === 'AVAILABLE' ? 'success' : 'warning'}">${v.status}</span></td>
                <td style="white-space:nowrap; text-align:center;">
                    <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" title="Edit Pavilion" onclick="EventsComponent.openEditVenueModal(${v.id})">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem; color:#dc2626;" title="Delete Venue" onclick="EventsComponent.confirmDeleteVenue(${v.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    async handleSubmit(e) {
        if (e) e.preventDefault();

        const nameEl = document.getElementById('vName') || document.getElementById('venueNameInput');
        const capEl = document.getElementById('vCapacity') || document.getElementById('venueCapacityInput');
        const priceEl = document.getElementById('vPrice') || document.getElementById('venuePriceInput');
        const descEl = document.getElementById('vDesc') || document.getElementById('venueDescInput');

        const name = (nameEl?.value || '').trim();
        const description = (descEl?.value || '').trim();
        const capacity = capEl?.value;
        const pricePerHour = priceEl?.value;

        const nVal = FormValidator.validateVenueName(name, 'Venue Pavilion Name', 3);
        if (!nVal.valid) return FormValidator.markInvalid(nameEl, nVal.message);

        const duplicate = (this.venues || []).find(v => (v.name || '').trim().toLowerCase() === name.toLowerCase());
        if (duplicate) {
            return FormValidator.markInvalid(nameEl, `A venue named "${name}" already exists.`);
        }

        const cVal = FormValidator.validateNumber(capacity, 'Guest Capacity', 1, 5000, true);
        if (!cVal.valid) return FormValidator.markInvalid(capEl, cVal.message);

        const pVal = FormValidator.validateNumber(pricePerHour, 'Price Per Hour (LKR)', 1);
        if (!pVal.valid) return FormValidator.markInvalid(priceEl, pVal.message);

        try {
            const res = await ApiService.venues.create({
                name,
                description,
                capacity: parseInt(capacity, 10),
                pricePerHour: parseFloat(pricePerHour),
                status: 'AVAILABLE'
            });

            if (res && res.success) {
                ModalManager.closeModal('venueModal');
                ModalManager.closeModal('createVenueModal');
                NotificationManager.showToast('Luxury venue pavilion created successfully!');
                await this.load();
                if (window.EventsComponent) window.EventsComponent.populateDropdowns();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to create venue.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error creating venue.', true);
        }
    },

    openEditModal(id) {
        const venue = this.venues.find(v => v.id === id);
        if (!venue) return;

        const idEl = document.getElementById('editVenId');
        const nameEl = document.getElementById('editVenName');
        const capEl = document.getElementById('editVenCapacity');
        const priceEl = document.getElementById('editVenPrice');
        const statusEl = document.getElementById('editVenStatus');

        if (idEl) idEl.value = venue.id;
        if (nameEl) nameEl.value = venue.name;
        if (capEl) capEl.value = venue.capacity;
        if (priceEl) priceEl.value = venue.pricePerHour;
        if (statusEl) statusEl.value = venue.status;

        ModalManager.openModal('editVenueModal');
    },

    async handleEditSubmit(e) {
        if (e) e.preventDefault();

        const id = document.getElementById('editVenId')?.value;
        const nameEl = document.getElementById('editVenName');
        const capEl = document.getElementById('editVenCapacity');
        const priceEl = document.getElementById('editVenPrice');
        const statusEl = document.getElementById('editVenStatus');

        const name = (nameEl?.value || '').trim();
        const capacity = capEl?.value;
        const pricePerHour = priceEl?.value;
        const status = statusEl?.value || 'AVAILABLE';

        if (!id) {
            NotificationManager.showToast('Invalid venue selected.', true);
            return;
        }

        const nVal = FormValidator.validateVenueName(name, 'Venue Pavilion Name', 3);
        if (!nVal.valid) return FormValidator.markInvalid(nameEl, nVal.message);

        const duplicate = (this.venues || []).find(v => String(v.id) !== String(id) && (v.name || '').trim().toLowerCase() === name.toLowerCase());
        if (duplicate) {
            return FormValidator.markInvalid(nameEl, `A venue named "${name}" already exists.`);
        }

        const cVal = FormValidator.validateNumber(capacity, 'Guest Capacity', 1, 5000, true);
        if (!cVal.valid) return FormValidator.markInvalid(capEl, cVal.message);

        const pVal = FormValidator.validateNumber(pricePerHour, 'Price Per Hour (LKR)', 1);
        if (!pVal.valid) return FormValidator.markInvalid(priceEl, pVal.message);

        try {
            const res = await ApiService.venues.update(id, {
                name,
                capacity: parseInt(capacity, 10),
                pricePerHour: parseFloat(pricePerHour),
                status
            });

            if (res && res.success) {
                ModalManager.closeModal('editVenueModal');
                NotificationManager.showToast('Venue pavilion details updated successfully!');
                await this.load();
                if (window.EventsComponent) window.EventsComponent.populateDropdowns();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to update venue.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error updating venue.', true);
        }
    },

    async deleteVenue(id) {
        if (!confirm('Are you sure you want to delete this venue pavilion?')) return;

        try {
            const res = await ApiService.venues.delete(id);
            if (res && res.success) {
                NotificationManager.showToast('Venue pavilion deleted successfully.');
                await this.load();
                if (window.EventsComponent) window.EventsComponent.populateDropdowns();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to delete venue.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error deleting venue.', true);
        }
    }
};

window.VenuesComponent = VenuesComponent;
window.openCreateVenueModal = () => VenuesComponent.openCreateVenueModal();
window.handleVenueSubmit = VenuesComponent.handleSubmit.bind(VenuesComponent);
window.handleCreateVenueSubmit = VenuesComponent.handleSubmit.bind(VenuesComponent);
window.handleEditVenueSubmit = VenuesComponent.handleEditSubmit.bind(VenuesComponent);
