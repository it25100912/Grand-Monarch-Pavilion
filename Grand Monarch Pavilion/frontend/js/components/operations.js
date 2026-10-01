/**
 * Operations & Branch Management Component
 * Commercial-grade hospitality operations console for Operations Supervisors & Admins.
 */

const OperationsComponent = {
    overview: null,
    restaurants: [],
    branches: [],
    activities: [],
    activeTab: 'overview',
    restaurantViewMode: 'grid', // 'grid' or 'table'
    selectedDeleteTarget: null, // { type: 'restaurant' | 'branch', id, name }

    async load() {
        await Promise.allSettled([
            this.loadOverview(),
            this.loadRestaurants(),
            this.loadBranches(),
            this.loadActivities()
        ]);
        this.populateRestaurantDropdowns();
    },

    /* =========================================================================
       DATA LOADERS
       ========================================================================= */
    async loadOverview() {
        try {
            const data = await ApiService.operations.getOverview();
            this.overview = data || {};
            this.renderOverviewMetrics();
        } catch (err) {
            console.error('[Operations Overview Load Error]', err);
        }
    },

    async loadRestaurants() {
        try {
            const statusFilter = document.getElementById('opsRestStatusFilter')?.value || 'ALL';
            const searchQuery = document.getElementById('opsRestSearch')?.value || '';
            const data = await ApiService.operations.getRestaurants(statusFilter, searchQuery);
            this.restaurants = data || [];
            this.renderRestaurants();
            this.populateRestaurantDropdowns();
        } catch (err) {
            console.error('[Operations Restaurants Load Error]', err);
        }
    },

    async loadBranches() {
        try {
            const restFilter = document.getElementById('opsBranchRestFilter')?.value || null;
            const cityFilter = document.getElementById('opsBranchCityFilter')?.value || 'ALL';
            const statusFilter = document.getElementById('opsBranchStatusFilter')?.value || 'ALL';
            const data = await ApiService.operations.getBranches(restFilter, cityFilter, statusFilter);
            this.branches = data || [];
            this.renderBranchesTable();
        } catch (err) {
            console.error('[Operations Branches Load Error]', err);
        }
    },

    async loadActivities() {
        try {
            const data = await ApiService.operations.getActivities();
            this.activities = data || [];
            this.renderActivitiesFeed();
        } catch (err) {
            console.error('[Operations Activities Load Error]', err);
        }
    },

    /* =========================================================================
       TAB & VIEW SWITCHERS
       ========================================================================= */
    switchTab(tab) {
        this.activeTab = tab;
        const tabs = ['overview', 'restaurants', 'branches', 'activities'];
        tabs.forEach(t => {
            const btn = document.getElementById(`opsTabBtn_${t}`);
            const view = document.getElementById(`opsView_${t}`);
            if (btn) {
                if (t === tab) {
                    btn.classList.add('active');
                    btn.style.background = 'linear-gradient(135deg, #d4af37, #b8860b)'; btn.style.color = '#121816';
                    btn.style.color = '#ffffff';
                    btn.style.borderColor = 'var(--text-gold)';
                } else {
                    btn.classList.remove('active');
                    btn.style.background = '#ffffff';
                    btn.style.color = '#d1d5d0';
                    btn.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                }
            }
            if (view) {
                view.style.display = (t === tab) ? 'block' : 'none';
            }
        });

        if (tab === 'overview') this.loadOverview();
        if (tab === 'restaurants') this.loadRestaurants();
        if (tab === 'branches') this.loadBranches();
        if (tab === 'activities') this.loadActivities();
    },

    setRestaurantViewMode(mode) {
        this.restaurantViewMode = mode;
        const gridBtn = document.getElementById('opsRestGridBtn');
        const tableBtn = document.getElementById('opsRestTableBtn');
        const gridContainer = document.getElementById('opsRestaurantsGrid');
        const tableContainer = document.getElementById('opsRestaurantsTableContainer');

        if (gridBtn && tableBtn) {
            if (mode === 'grid') {
                gridBtn.classList.add('btn-primary');
                gridBtn.classList.remove('btn-secondary');
                tableBtn.classList.add('btn-secondary');
                tableBtn.classList.remove('btn-primary');
                if (gridContainer) gridContainer.style.display = 'grid';
                if (tableContainer) tableContainer.style.display = 'none';
            } else {
                tableBtn.classList.add('btn-primary');
                tableBtn.classList.remove('btn-secondary');
                gridBtn.classList.add('btn-secondary');
                gridBtn.classList.remove('btn-primary');
                if (gridContainer) gridContainer.style.display = 'none';
                if (tableContainer) tableContainer.style.display = 'block';
            }
        }
    },

    /* =========================================================================
       OVERVIEW DASHBOARD METRICS & FEED
       ========================================================================= */
    renderOverviewMetrics() {
        const o = this.overview || {};

        const elRest = document.getElementById('opsMetric_totalRestaurants');
        const elBranch = document.getElementById('opsMetric_totalBranches');
        const elCap = document.getElementById('opsMetric_totalCapacity');
        const elRate = document.getElementById('opsMetric_operationalRate');
        const elStatus = document.getElementById('opsMetric_operationalStatus');

        if (elRest) elRest.textContent = `${o.activeRestaurants || 0} / ${o.totalRestaurants || 0}`;
        if (elBranch) elBranch.textContent = `${o.openBranches || 0} / ${o.totalBranches || 0}`;
        if (elCap) elCap.textContent = `${(o.totalCapacity || 0).toLocaleString()} Guests`;
        if (elRate) elRate.textContent = `${o.operationalRate || 100}% Active`;
        if (elStatus) elStatus.textContent = o.operationalStatus || 'Fully Operational';

        // Also update the Operations Supervisor card on the main dashboard if present
        const mainOpsCard = document.getElementById('opsSuperTotalBranches');
        if (mainOpsCard) mainOpsCard.textContent = o.totalBranches || 0;
    },

    renderActivitiesFeed() {
        const list = this.activities || [];
        const container = document.getElementById('opsActivitiesList');
        const homeFeed = document.getElementById('opsOverviewRecentFeed');

        const html = list.length === 0 ? `
            <div style="text-align:center; padding:30px; color:#d1d5d0;">
                <i class="fa-solid fa-clock-rotate-left" style="font-size:2rem; opacity:0.4; display:block; margin-bottom:8px;"></i>
                No operational activity recorded yet.
            </div>
        ` : list.map(item => {
            let icon = 'fa-solid fa-circle-info';
            let iconBg = '#e0f2fe';
            let iconColor = '#0369a1';

            if (item.type === 'BRANCH_CREATED') {
                icon = 'fa-solid fa-building-circle-check';
                iconBg = '#dcfce7';
                iconColor = '#15803d';
            } else if (item.type === 'STATUS_CHANGED') {
                icon = 'fa-solid fa-arrow-right-arrow-left';
                iconBg = '#fef9c3';
                iconColor = '#a16207';
            } else if (item.type === 'RESTAURANT_CREATED' || item.type === 'RESTAURANT_UPDATED') {
                icon = 'fa-solid fa-hotel';
                iconBg = '#f3e8ff';
                iconColor = '#7e22ce';
            } else if (item.type?.includes('DELETED')) {
                icon = 'fa-solid fa-trash-can';
                iconBg = '#fee2e2';
                iconColor = '#dc2626';
            }

            return `
                <div style="display:flex; gap:14px; align-items:start; padding:12px 14px; background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.2); border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,0.02);">
                    <div style="width:36px; height:36px; border-radius:50%; background:${iconBg}; color:${iconColor}; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:0.9rem;">
                        <i class="${icon}"></i>
                    </div>
                    <div style="flex:1;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <strong style="color:#e6dfd5; font-size:0.88rem;">${Utils.escapeHtml(item.title)}</strong>
                            <span style="font-size:0.72rem; color:#d1d5d0;"><i class="fa-regular fa-clock"></i> ${Utils.formatDateTime ? Utils.formatDateTime(item.timestamp) : (item.timestamp || 'Recent')}</span>
                        </div>
                        <p style="margin:3px 0 0 0; font-size:0.8rem; color:#b0b8b4; line-height:1.4;">${Utils.escapeHtml(item.description)}</p>
                        <small style="color:var(--text-gold); font-weight:700; font-size:0.72rem;"><i class="fa-solid fa-user-shield"></i> ${Utils.escapeHtml(item.actor || 'Supervisor')}</small>
                    </div>
                </div>
            `;
        }).join('');

        if (container) container.innerHTML = html;
        if (homeFeed) homeFeed.innerHTML = html;
    },

    /* =========================================================================
       RESTAURANTS MANAGEMENT (GRID & TABLE)
       ========================================================================= */
    renderRestaurants() {
        const grid = document.getElementById('opsRestaurantsGrid');
        const tbody = document.getElementById('opsRestaurantsTableBody');

        if (this.restaurants.length === 0) {
            const emptyHtml = `
                <div style="grid-column:1/-1; text-align:center; padding:40px; background:#1b3b2b; border:1px dashed rgba(212, 175, 55, 0.3); border-radius:14px;">
                    <i class="fa-solid fa-hotel" style="font-size:2.4rem; color:rgba(212, 175, 55, 0.35); margin-bottom:12px; display:block;"></i>
                    <h4 style="margin:0 0 6px 0; color:#e6dfd5;">No Restaurant Brands Found</h4>
                    <p style="font-size:0.85rem; color:#d1d5d0; margin:0 0 16px 0;">Create your first luxury restaurant brand or adjust your search filter.</p>
                    <button class="btn-primary" onclick="OperationsComponent.openRestaurantModal()"><i class="fa-solid fa-plus"></i> Add Restaurant Brand</button>
                </div>
            `;
            if (grid) grid.innerHTML = emptyHtml;
            if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:#d1d5d0;">No restaurant brands match the filter criteria.</td></tr>';
            return;
        }

        // 1. Grid View
        if (grid) {
            grid.innerHTML = this.restaurants.map(r => {
                const cuisinesList = (r.cuisines || 'Fine Dining').split(',').map(c => c.trim()).filter(Boolean);
                const isActive = (r.status || 'ACTIVE') === 'ACTIVE';

                return `
                    <div class="restaurant-card" style="background:linear-gradient(145deg, #1b3b2b 0%, #121816 100%); border:1px solid rgba(212, 175, 55, 0.25); border-radius:16px; overflow:hidden; box-shadow:0 8px 25px rgba(0,0,0,0.35); display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.2s, box-shadow 0.2s;">
                        <!-- Cover Image Header -->
                        <div style="height:150px; position:relative; background:linear-gradient(135deg, #121816 0%, #1b3b2b 100%); border-bottom:1px solid rgba(212, 175, 55, 0.2); overflow:hidden;">
                            <img src="${r.coverImageUrl || 'images/gourmet_feast.jpg'}" onerror="this.onerror=null; this.src='images/gourmet_feast.jpg';" alt="${Utils.escapeHtml(r.name)}" style="width:100%; height:100%; object-fit:cover; opacity:0.85;">
                            <div style="position:absolute; top:12px; right:12px;">
                                <span class="badge" style="background:${isActive ? '#15803d' : '#dc2626'}; color:#ffffff; font-weight:800; font-size:0.72rem; padding:4px 10px; border-radius:20px; box-shadow:0 2px 8px rgba(0,0,0,0.25);">
                                    <i class="fa-solid ${isActive ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${r.status || 'ACTIVE'}
                                </span>
                            </div>
                            <div style="position:absolute; bottom:10px; left:14px; background:rgba(15,23,42,0.85); backdrop-filter:blur(4px); padding:4px 12px; border-radius:20px; border:1px solid rgba(212,175,55,0.4); color:var(--text-gold); font-size:0.75rem; font-weight:800;">
                                <i class="fa-solid fa-code-branch"></i> ${r.branchCount || 0} Linked Branches
                            </div>
                        </div>

                        <!-- Card Body -->
                        <div style="padding:18px; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                            <div>
                                <h3 style="margin:0 0 6px 0; font-size:1.15rem; font-weight:800; color:#e6dfd5;">${Utils.escapeHtml(r.name)}</h3>
                                <p style="margin:0 0 12px 0; font-size:0.82rem; color:#b0b8b4; line-height:1.5;">${Utils.escapeHtml(r.shortDescription || 'Premier luxury dining venue in the Grand Monarch network.')}</p>
                                
                                <!-- Cuisines Badges -->
                                <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:14px;">
                                    ${cuisinesList.map(c => `<span style="background:#121816; border:1px solid rgba(212, 175, 55, 0.2); color:#d1d5d0; font-size:0.72rem; padding:2px 8px; border-radius:6px; font-weight:600;"><i class="fa-solid fa-utensils" style="font-size:0.6rem; color:var(--text-gold);"></i> ${Utils.escapeHtml(c)}</span>`).join('')}
                                </div>

                                <!-- Contact / Hours Info Grid -->
                                <div style="font-size:0.78rem; color:#d1d5d0; display:flex; flex-direction:column; gap:4px; padding:10px; background:#121816; border-radius:8px; margin-bottom:14px;">
                                    <div><i class="fa-solid fa-clock" style="color:var(--text-gold); width:16px;"></i> ${r.openingHours || '10:00 AM'} &ndash; ${r.closingHours || '11:30 PM'}</div>
                                    <div><i class="fa-solid fa-phone" style="color:var(--text-gold); width:16px;"></i> ${Utils.escapeHtml(r.phone || '+94 11 255 8800')}</div>
                                    <div><i class="fa-solid fa-envelope" style="color:var(--text-gold); width:16px;"></i> ${Utils.escapeHtml(r.email || 'info@grandmonarch.lk')}</div>
                                </div>
                            </div>

                            <!-- Actions Footer -->
                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(212, 175, 55, 0.2); padding-top:12px; gap:8px;">
                                <button class="btn-secondary" style="padding:6px 12px; font-size:0.78rem;" onclick="OperationsComponent.toggleRestaurantStatus(${r.id})" title="Toggle Active Status">
                                    <i class="fa-solid fa-power-off" style="color:${isActive ? '#16a34a' : '#94a3b8'};"></i> ${isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <div style="display:flex; gap:6px;">
                                    <button class="btn-secondary" style="padding:6px 10px; font-size:0.78rem;" onclick="OperationsComponent.openRestaurantModal(${r.id})" title="Edit Brand Profile">
                                        <i class="fa-solid fa-pen-to-square"></i> Edit
                                    </button>
                                    <button class="btn-secondary" style="padding:6px 10px; font-size:0.78rem; color:#dc2626;" onclick="OperationsComponent.promptDelete('restaurant', ${r.id}, '${Utils.escapeHtml(r.name).replace(/'/g, "\\'")}', ${r.branchCount || 0})" title="Delete Restaurant">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // 2. Table View
        if (tbody) {
            tbody.innerHTML = this.restaurants.map(r => `
                <tr>
                    <td class="text-left" style="white-space:nowrap;">
                        <strong>#RES-${r.id}</strong>
                    </td>
                    <td class="text-left">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <img src="${r.coverImageUrl || 'images/gourmet_feast.jpg'}" onerror="this.onerror=null; this.src='images/gourmet_feast.jpg';" style="width:40px; height:40px; border-radius:8px; object-fit:cover;">
                            <div>
                                <strong style="color:#e6dfd5; display:block;">${Utils.escapeHtml(r.name)}</strong>
                                <small style="color:#b0b8b4;">${Utils.escapeHtml(r.cuisines || 'Fine Dining')}</small>
                            </div>
                        </div>
                    </td>
                    <td class="text-left"><small>${r.openingHours || '10:00 AM'} &ndash; ${r.closingHours || '11:30 PM'}</small></td>
                    <td class="text-left"><small>${Utils.escapeHtml(r.phone || '-')}<br>${Utils.escapeHtml(r.email || '-')}</small></td>
                    <td class="text-center"><span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:800;">${r.branchCount || 0} Branches</span></td>
                    <td class="text-center">
                        <span class="badge badge-${r.status === 'ACTIVE' ? 'success' : 'danger'}">${r.status || 'ACTIVE'}</span>
                    </td>
                    <td class="text-center" style="white-space:nowrap;">
                        <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="OperationsComponent.openRestaurantModal(${r.id})" title="Edit">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="OperationsComponent.toggleRestaurantStatus(${r.id})" title="Toggle Status">
                            <i class="fa-solid fa-power-off"></i>
                        </button>
                        <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem; color:#dc2626;" onclick="OperationsComponent.promptDelete('restaurant', ${r.id}, '${Utils.escapeHtml(r.name).replace(/'/g, "\\'")}', ${r.branchCount || 0})" title="Delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    },

    /* =========================================================================
       BRANCHES MANAGEMENT (TABLE & FILTERS)
       ========================================================================= */
    renderBranchesTable() {
        const tbody = document.getElementById('opsBranchesTableBody');
        if (!tbody) return;

        if (this.branches.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:30px; color:#d1d5d0;">No operating branches match the selected filters.</td></tr>';
            return;
        }

        tbody.innerHTML = this.branches.map(b => {
            let statusBadgeClass = 'success';
            let statusLabel = 'OPEN';
            if (b.status === 'TEMPORARILY_CLOSED') {
                statusBadgeClass = 'danger';
                statusLabel = 'CLOSED';
            } else if (b.status === 'UNDER_MAINTENANCE') {
                statusBadgeClass = 'warning';
                statusLabel = 'MAINTENANCE';
            }

            return `
                <tr>
                    <td class="text-left" style="white-space:nowrap;">
                        <strong style="color:var(--gold-dark);">${Utils.escapeHtml(b.branchCode)}</strong>
                    </td>
                    <td class="text-left">
                        <strong style="color:#e6dfd5; font-size:0.9rem;">${Utils.escapeHtml(b.branchName)}</strong>
                        <div style="font-size:0.75rem; color:#b0b8b4;"><i class="fa-solid fa-hotel" style="color:var(--text-gold); font-size:0.65rem;"></i> ${Utils.escapeHtml(b.restaurantName || 'Grand Monarch')}</div>
                    </td>
                    <td class="text-left">
                        <small style="color:#e6dfd5;">${Utils.escapeHtml(b.streetAddress || '-')}</small>
                    </td>
                    <td class="text-center">
                        <span class="badge" style="background:rgba(212, 175, 55, 0.15); color:#e6dfd5; font-weight:700;">${Utils.escapeHtml(b.city || 'Colombo')}</span>
                    </td>
                    <td class="text-left">
                        <small style="font-weight:600; color:#e6dfd5;"><i class="fa-solid fa-user-tie" style="color:#b0b8b4;"></i> ${Utils.escapeHtml(b.branchManager || 'Designated Manager')}</small><br>
                        <small style="color:#b0b8b4;">${Utils.escapeHtml(b.phone || '-')}</small>
                    </td>
                    <td class="text-right" style="white-space:nowrap;">
                        <strong style="color:#e6dfd5;"><i class="fa-solid fa-chair" style="color:var(--text-gold);"></i> ${b.seatingCapacity || 100}</strong>
                    </td>
                    <td class="text-center" style="white-space:nowrap;">
                        <!-- Inline Status Switcher Dropdown -->
                        <select class="form-control" style="width:145px; font-size:0.75rem; padding:3px 6px; font-weight:700; border-radius:6px;" onchange="OperationsComponent.changeBranchStatus(${b.id}, this.value)">
                            <option value="OPEN" ${b.status === 'OPEN' ? 'selected' : ''}>🟢 OPEN</option>
                            <option value="UNDER_MAINTENANCE" ${b.status === 'UNDER_MAINTENANCE' ? 'selected' : ''}>🟡 MAINTENANCE</option>
                            <option value="TEMPORARILY_CLOSED" ${b.status === 'TEMPORARILY_CLOSED' ? 'selected' : ''}>🔴 CLOSED</option>
                        </select>
                    </td>
                    <td class="text-center" style="white-space:nowrap;">
                        <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="OperationsComponent.openBranchModal(${b.id})" title="Edit Branch">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem; color:#dc2626;" onclick="OperationsComponent.promptDelete('branch', ${b.id}, '${Utils.escapeHtml(b.branchName).replace(/'/g, "\\'")}', 0)" title="Delete Branch">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    populateRestaurantDropdowns() {
        const selects = [
            document.getElementById('bRestaurantId'),
            document.getElementById('opsBranchRestFilter')
        ].filter(Boolean);

        if (selects.length === 0) return;

        const branchFilterSelect = document.getElementById('opsBranchRestFilter');
        if (branchFilterSelect) {
            branchFilterSelect.innerHTML = '<option value="">All Parent Restaurants</option>' +
                this.restaurants.map(r => `<option value="${r.id}">${Utils.escapeHtml(r.name)}</option>`).join('');
        }

        const modalSelect = document.getElementById('bRestaurantId');
        if (modalSelect) {
            modalSelect.innerHTML = '<option value="">-- Choose Parent Restaurant Brand --</option>' +
                this.restaurants.filter(r => r.status === 'ACTIVE').map(r => `
                    <option value="${r.id}">${Utils.escapeHtml(r.name)}</option>
                `).join('');
        }
    },

    /* =========================================================================
       RESTAURANT ADD / EDIT MODAL
       ========================================================================= */
    openRestaurantModal(id = null) {
        const titleEl = document.getElementById('restaurantModalTitle');
        const idEl = document.getElementById('restModalId');
        const nameEl = document.getElementById('restModalName');
        const descEl = document.getElementById('restModalDesc');
        const bioEl = document.getElementById('restModalBio');
        const cuisinesEl = document.getElementById('restModalCuisines');
        const emailEl = document.getElementById('restModalEmail');
        const phoneEl = document.getElementById('restModalPhone');
        const webEl = document.getElementById('restModalWebsite');
        const openEl = document.getElementById('restModalOpenHours');
        const closeEl = document.getElementById('restModalCloseHours');
        const coverEl = document.getElementById('restModalCoverUrl');
        const logoEl = document.getElementById('restModalLogoUrl');
        const statusEl = document.getElementById('restModalStatus');

        if (id) {
            const r = this.restaurants.find(item => item.id === id);
            if (!r) return;

            if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color:var(--text-gold);"></i> Edit Restaurant Brand';
            if (idEl) idEl.value = r.id;
            if (nameEl) nameEl.value = r.name || '';
            if (descEl) descEl.value = r.shortDescription || '';
            if (bioEl) bioEl.value = r.detailedBio || '';
            if (cuisinesEl) cuisinesEl.value = r.cuisines || '';
            if (emailEl) emailEl.value = r.email || '';
            if (phoneEl) phoneEl.value = r.phone || '';
            if (webEl) webEl.value = r.website || '';
            if (openEl) openEl.value = r.openingHours || '10:00 AM';
            if (closeEl) closeEl.value = r.closingHours || '11:30 PM';
            if (coverEl) coverEl.value = r.coverImageUrl || '';
            if (logoEl) logoEl.value = r.logoUrl || '';
            if (statusEl) statusEl.value = r.status || 'ACTIVE';
        } else {
            if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-hotel" style="color:var(--text-gold);"></i> Register New Restaurant Brand';
            if (idEl) idEl.value = '';
            if (nameEl) nameEl.value = '';
            if (descEl) descEl.value = '';
            if (bioEl) bioEl.value = '';
            if (cuisinesEl) cuisinesEl.value = 'Fine Dining, Seafood, Sri Lankan Fusion';
            if (emailEl) emailEl.value = 'dining@grandmonarch.lk';
            if (phoneEl) phoneEl.value = '+94 11 255 8800';
            if (webEl) webEl.value = 'https://grandmonarch.lk';
            if (openEl) openEl.value = '10:00 AM';
            if (closeEl) closeEl.value = '11:30 PM';
            if (coverEl) coverEl.value = 'images/gourmet_feast.jpg';
            if (logoEl) logoEl.value = 'images/ballroom.jpg';
            if (statusEl) statusEl.value = 'ACTIVE';
        }

        ModalManager.openModal('restaurantModal');
    },

    async handleRestaurantSubmit(e) {
        if (e) e.preventDefault();

        const idVal = document.getElementById('restModalId')?.value;
        const nameEl = document.getElementById('restModalName');
        const descEl = document.getElementById('restModalDesc');
        const bioEl = document.getElementById('restModalBio');
        const cuisinesEl = document.getElementById('restModalCuisines');
        const emailEl = document.getElementById('restModalEmail');
        const phoneEl = document.getElementById('restModalPhone');
        const webEl = document.getElementById('restModalWebsite');
        const openEl = document.getElementById('restModalOpenHours');
        const closeEl = document.getElementById('restModalCloseHours');
        const coverEl = document.getElementById('restModalCoverUrl');
        const logoEl = document.getElementById('restModalLogoUrl');
        const statusEl = document.getElementById('restModalStatus');

        const name = (nameEl?.value || '').trim();
        const shortDescription = (descEl?.value || '').trim();
        const detailedBio = (bioEl?.value || '').trim();
        const cuisines = (cuisinesEl?.value || '').trim();
        const email = (emailEl?.value || '').trim();
        const phone = (phoneEl?.value || '').trim();
        const website = (webEl?.value || '').trim();
        const openingHours = (openEl?.value || '').trim();
        const closingHours = (closeEl?.value || '').trim();
        const coverImageUrl = (coverEl?.value || '').trim();
        const logoUrl = (logoEl?.value || '').trim();
        const status = statusEl?.value || 'ACTIVE';

        // Validations
        if (!name || name.length < 3) {
            return FormValidator.markInvalid(nameEl, 'Restaurant name must be at least 3 characters.');
        }
        if (email) {
            const emVal = FormValidator.validateEmail(email, 'Official Email');
            if (!emVal.valid) return FormValidator.markInvalid(emailEl, emVal.message);
        }
        if (phone) {
            const phVal = FormValidator.validatePhone(phone, 'Phone Number');
            if (!phVal.valid) return FormValidator.markInvalid(phoneEl, phVal.message);
        }

        const payload = {
            name,
            shortDescription,
            detailedBio,
            cuisines,
            email,
            phone,
            website,
            openingHours,
            closingHours,
            coverImageUrl,
            logoUrl,
            status
        };

        try {
            let res;
            if (idVal) {
                res = await ApiService.operations.updateRestaurant(parseInt(idVal, 10), payload);
            } else {
                res = await ApiService.operations.createRestaurant(payload);
            }

            if (res && res.success) {
                ModalManager.closeModal('restaurantModal');
                NotificationManager.showToast(idVal ? 'Restaurant brand updated successfully!' : 'New restaurant brand created successfully!');
                await this.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to save restaurant brand.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error saving restaurant brand.', true);
        }
    },

    async toggleRestaurantStatus(id) {
        try {
            const res = await ApiService.operations.toggleRestaurantStatus(id);
            if (res && res.success) {
                NotificationManager.showToast('Restaurant status updated successfully.');
                await this.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to toggle status.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error updating status.', true);
        }
    },

    /* =========================================================================
       BRANCH ADD / EDIT MODAL & QUICK STATUS
       ========================================================================= */
    openBranchModal(id = null) {
        const titleEl = document.getElementById('branchModalTitle');
        const idEl = document.getElementById('branchModalId');
        const restSel = document.getElementById('bRestaurantId');
        const nameEl = document.getElementById('bBranchName');
        const codeEl = document.getElementById('bBranchCode');
        const addrEl = document.getElementById('bStreetAddress');
        const cityEl = document.getElementById('bCity');
        const stateEl = document.getElementById('bRegionState');
        const zipEl = document.getElementById('bZipCode');
        const phoneEl = document.getElementById('bPhone');
        const mgrEl = document.getElementById('bBranchManager');
        const capEl = document.getElementById('bSeatingCapacity');
        const statusEl = document.getElementById('bStatus');

        this.populateRestaurantDropdowns();

        if (id) {
            const b = this.branches.find(item => item.id === id);
            if (!b) return;

            if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color:var(--text-gold);"></i> Edit Operational Branch';
            if (idEl) idEl.value = b.id;
            if (restSel) restSel.value = b.restaurantId || '';
            if (nameEl) nameEl.value = b.branchName || '';
            if (codeEl) {
                codeEl.value = b.branchCode || '';
                codeEl.readOnly = true;
            }
            if (addrEl) addrEl.value = b.streetAddress || '';
            if (cityEl) cityEl.value = b.city || 'Colombo';
            if (stateEl) stateEl.value = b.regionState || 'Western Province';
            if (zipEl) zipEl.value = b.zipCode || '';
            if (phoneEl) phoneEl.value = b.phone || '';
            if (mgrEl) mgrEl.value = b.branchManager || '';
            if (capEl) capEl.value = b.seatingCapacity || 100;
            if (statusEl) statusEl.value = b.status || 'OPEN';
        } else {
            if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-building-circle-check" style="color:var(--text-gold);"></i> Operationalize New Branch';
            if (idEl) idEl.value = '';
            if (restSel && restSel.options.length > 1) restSel.selectedIndex = 1;
            if (nameEl) nameEl.value = '';
            if (codeEl) {
                codeEl.value = 'GMC-0' + (this.branches.length + 1);
                codeEl.readOnly = false;
            }
            if (addrEl) addrEl.value = '';
            if (cityEl) cityEl.value = 'Colombo';
            if (stateEl) stateEl.value = 'Western Province';
            if (zipEl) zipEl.value = '00300';
            if (phoneEl) phoneEl.value = '+94 11 255 8800';
            if (mgrEl) mgrEl.value = 'Dulanjee Supervisor';
            if (capEl) capEl.value = 150;
            if (statusEl) statusEl.value = 'OPEN';
        }

        ModalManager.openModal('branchModal');
    },

    async handleBranchSubmit(e) {
        if (e) e.preventDefault();

        const idVal = document.getElementById('branchModalId')?.value;
        const restEl = document.getElementById('bRestaurantId');
        const nameEl = document.getElementById('bBranchName');
        const codeEl = document.getElementById('bBranchCode');
        const addrEl = document.getElementById('bStreetAddress');
        const cityEl = document.getElementById('bCity');
        const stateEl = document.getElementById('bRegionState');
        const zipEl = document.getElementById('bZipCode');
        const phoneEl = document.getElementById('bPhone');
        const mgrEl = document.getElementById('bBranchManager');
        const capEl = document.getElementById('bSeatingCapacity');
        const statusEl = document.getElementById('bStatus');

        const restaurantId = parseInt(restEl?.value || '0', 10);
        const branchName = (nameEl?.value || '').trim();
        const branchCode = (codeEl?.value || '').trim().toUpperCase();
        const streetAddress = (addrEl?.value || '').trim();
        const city = (cityEl?.value || '').trim();
        const regionState = (stateEl?.value || '').trim();
        const zipCode = (zipEl?.value || '').trim();
        const phone = (phoneEl?.value || '').trim();
        const branchManager = (mgrEl?.value || '').trim();
        const seatingCapacity = parseInt(capEl?.value || '100', 10);
        const status = statusEl?.value || 'OPEN';

        // Validations
        if (!restaurantId || restaurantId <= 0) {
            return FormValidator.markInvalid(restEl, 'Please select the parent restaurant brand.');
        }
        if (!branchName || branchName.length < 3) {
            return FormValidator.markInvalid(nameEl, 'Branch name must be at least 3 characters.');
        }
        if (!branchCode || branchCode.length < 2) {
            return FormValidator.markInvalid(codeEl, 'Branch code is required (e.g. GMC-01).');
        }
        if (!seatingCapacity || seatingCapacity < 10) {
            return FormValidator.markInvalid(capEl, 'Minimum branch seating capacity is 10 guests.');
        }
        if (phone) {
            const phVal = FormValidator.validatePhone(phone, 'Branch Phone Number');
            if (!phVal.valid) return FormValidator.markInvalid(phoneEl, phVal.message);
        }

        const payload = {
            restaurantId,
            branchName,
            branchCode,
            streetAddress,
            city,
            regionState,
            zipCode,
            phone,
            branchManager,
            seatingCapacity,
            status
        };

        try {
            let res;
            if (idVal) {
                res = await ApiService.operations.updateBranch(parseInt(idVal, 10), payload);
            } else {
                res = await ApiService.operations.createBranch(payload);
            }

            if (res && res.success) {
                ModalManager.closeModal('branchModal');
                NotificationManager.showToast(idVal ? 'Branch updated successfully!' : 'New branch operationalized successfully!');
                await this.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to save branch.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error saving branch.', true);
        }
    },

    async changeBranchStatus(id, newStatus) {
        try {
            const res = await ApiService.operations.updateBranchStatus(id, newStatus);
            if (res && res.success) {
                NotificationManager.showToast(`Branch status shifted to ${newStatus}.`);
                await this.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to update branch status.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error updating branch status.', true);
        }
    },

    /* =========================================================================
       DELETE CONFIRMATION SAFEGUARD
       ========================================================================= */
    promptDelete(type, id, name, linkedBranches = 0) {
        if (type === 'restaurant' && linkedBranches > 0) {
            NotificationManager.showToast(`Cannot delete '${name}' because it has ${linkedBranches} active branch(es). Please delete or reassign branches first.`, true);
            return;
        }

        this.selectedDeleteTarget = { type, id, name };
        const msgEl = document.getElementById('deleteSafeguardMessage');
        const titleEl = document.getElementById('deleteSafeguardTitle');

        if (titleEl) titleEl.textContent = type === 'restaurant' ? 'Decommission Restaurant Brand' : 'Decommission Branch';
        if (msgEl) {
            msgEl.innerHTML = `Are you sure you want to permanently delete <strong>${Utils.escapeHtml(name)}</strong>?<br><br><span style="color:#dc2626; font-weight:700;">Warning:</span> This action cannot be undone.`;
        }

        ModalManager.openModal('deleteSafeguardModal');
    },

    async confirmDelete() {
        if (!this.selectedDeleteTarget) return;

        const { type, id } = this.selectedDeleteTarget;
        try {
            let res;
            if (type === 'restaurant') {
                res = await ApiService.operations.deleteRestaurant(id);
            } else {
                res = await ApiService.operations.deleteBranch(id);
            }

            if (res && res.success) {
                ModalManager.closeModal('deleteSafeguardModal');
                NotificationManager.showToast(`${type === 'restaurant' ? 'Restaurant brand' : 'Branch'} deleted successfully.`);
                this.selectedDeleteTarget = null;
                await this.load();
            } else {
                NotificationManager.showToast(res.message || 'Deletion failed.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error deleting item.', true);
        }
    },

    /* =========================================================================
       SYSTEM STATUS & CSV EXPORT
       ========================================================================= */
    openSystemStatusModal() {
        const o = this.overview || {};
        const contentEl = document.getElementById('systemStatusModalContent');
        if (contentEl) {
            contentEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:16px;">
                    <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:16px; display:flex; align-items:center; gap:12px;">
                        <div style="width:42px; height:42px; border-radius:50%; background:#22c55e; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0;">
                            <i class="fa-solid fa-server"></i>
                        </div>
                        <div>
                            <strong style="color:#166534; font-size:1rem; display:block;">Hospitality Infrastructure 100% Online</strong>
                            <small style="color:#15803d;">MySQL connected • REST API Gateway running on port 8080 • JWT security active</small>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div style="background:#121816; border:1px solid rgba(212, 175, 55, 0.2); border-radius:10px; padding:12px;">
                            <small style="color:#b0b8b4; font-weight:700;">ACTIVE RESTAURANTS</small>
                            <div style="font-size:1.2rem; font-weight:800; color:#e6dfd5;">${o.activeRestaurants || 0} Brands</div>
                        </div>
                        <div style="background:#121816; border:1px solid rgba(212, 175, 55, 0.2); border-radius:10px; padding:12px;">
                            <small style="color:#b0b8b4; font-weight:700;">OPERATIONAL BRANCHES</small>
                            <div style="font-size:1.2rem; font-weight:800; color:#e6dfd5;">${o.openBranches || 0} Open / ${o.totalBranches || 0} Total</div>
                        </div>
                        <div style="background:#121816; border:1px solid rgba(212, 175, 55, 0.2); border-radius:10px; padding:12px;">
                            <small style="color:#b0b8b4; font-weight:700;">TOTAL SEATING CAPACITY</small>
                            <div style="font-size:1.2rem; font-weight:800; color:var(--text-gold);">${(o.totalCapacity || 0).toLocaleString()} Seats</div>
                        </div>
                        <div style="background:#121816; border:1px solid rgba(212, 175, 55, 0.2); border-radius:10px; padding:12px;">
                            <small style="color:#b0b8b4; font-weight:700;">FACILITY STATUS</small>
                            <div style="font-size:1.2rem; font-weight:800; color:#15803d;">${o.operationalRate || 100}% Operational</div>
                        </div>
                    </div>

                    <div style="background:#121816; border:1px solid rgba(212, 175, 55, 0.2); border-radius:10px; padding:12px; font-size:0.8rem; color:#d1d5d0;">
                        <div><strong>Database Node:</strong> localhost:3306 (restaurant_event_db)</div>
                        <div><strong>Security Protocol:</strong> HMAC-SHA256 Token Signature</div>
                        <div><strong>Last Synced:</strong> ${new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
            `;
        }
        ModalManager.openModal('systemStatusModal');
    },

    exportBranchReport() {
        if (!this.branches || this.branches.length === 0) {
            NotificationManager.showToast('No branch data available to export.', true);
            return;
        }

        const headers = ["Branch Code", "Branch Name", "Parent Restaurant", "Address", "City", "Region", "Manager", "Phone", "Capacity", "Status"];
        const rows = this.branches.map(b => [
            `"${b.branchCode || ''}"`,
            `"${(b.branchName || '').replace(/"/g, '""')}"`,
            `"${(b.restaurantName || '').replace(/"/g, '""')}"`,
            `"${(b.streetAddress || '').replace(/"/g, '""')}"`,
            `"${(b.city || '').replace(/"/g, '""')}"`,
            `"${(b.regionState || '').replace(/"/g, '""')}"`,
            `"${(b.branchManager || '').replace(/"/g, '""')}"`,
            `"${(b.phone || '').replace(/"/g, '""')}"`,
            b.seatingCapacity || 0,
            `"${b.status || 'OPEN'}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Grand_Monarch_Branches_Report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        NotificationManager.showToast('Operational Branch Report exported successfully (CSV)!');
    }
};

window.OperationsComponent = OperationsComponent;
