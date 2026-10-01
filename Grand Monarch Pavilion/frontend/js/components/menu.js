/**
 * Grand Monarch Pavilion - Menu & Table Management Component
 * Commercial Hospitality SaaS Grade Module
 * 
 * Features:
 * 1. Summary Metrics & Real-Time Capacity Dashboard
 * 2. Tab Navigation (Menu Catalog, Categories CRUD, Dining Tables & Floor Plan)
 * 3. Menu Items CRUD with High-Res Image, Dietary Indicators, Spicy Levels, Featured Tags, Availability Switch
 * 4. Menu Categories CRUD with Icon, Display Order, Active/Inactive, Item Count & Delete Safeguard
 * 5. Floor Plan & Table Management with Section Filters, Capacity, Color-Coded Status & Inline Status Changer
 */

const MenuComponent = {
    // State
    currentTab: 'items', // 'items' | 'categories' | 'tables'
    menuItems: [],
    categories: [],
    tables: [],
    
    // Filters for Menu Items
    activeCategoryFilter: 'ALL',
    activeDietaryFilter: 'ALL', // 'ALL' | 'VEG' | 'NON_VEG' | 'FEATURED'
    activeSpicyFilter: 'ALL', // 'ALL' | '0' | '1' | '2' | '3'
    searchQuery: '',
    itemViewMode: 'grid', // 'grid' | 'table'

    // Filters for Tables
    activeSectionFilter: 'ALL', // 'ALL' | 'Indoor' | 'Outdoor' | 'Rooftop' | 'VIP' | 'Poolside'
    activeTableStatusFilter: 'ALL',

    // Currently Editing
    editingCategory: null,
    editingMenuItem: null,
    editingTable: null,

    async load() {
        try {
            await Promise.all([
                this.loadCategories(),
                this.loadMenuItems(),
                this.loadTables()
            ]);
            this.renderMetrics();
            this.renderCurrentTab();
            this.updateStaffControls();
        } catch (err) {
            console.error('[MenuComponent Load Error]', err);
            if (window.NotificationManager) {
                NotificationManager.showToast('Failed to load menu & table data: ' + err.message, true);
            }
        }
    },

    async loadCategories() {
        try {
            const data = await ApiService.menu.getCategories();
            this.categories = Array.isArray(data) ? data : [];
            this.populateCategoryDropdowns();
        } catch (err) {
            console.warn('[Categories Load Warning]', err);
            this.categories = [];
        }
    },

    async loadMenuItems() {
        try {
            const data = await ApiService.menu.getAll();
            this.menuItems = Array.isArray(data) ? data : [];
        } catch (err) {
            console.warn('[MenuItems Load Warning]', err);
            this.menuItems = [];
        }
    },

    async loadTables() {
        try {
            const data = await ApiService.tables.getAll();
            this.tables = Array.isArray(data) ? data : [];
        } catch (err) {
            console.warn('[Tables Load Warning]', err);
            this.tables = [];
        }
    },

    updateStaffControls() {
        const user = window.AuthManager ? AuthManager.currentUser : null;
        const isStaff = user && ['ADMIN', 'EVENT_COORDINATOR', 'OPERATIONS_SUPERVISOR', 'STAFF'].includes(user.role);
        
        const staffElements = document.querySelectorAll('.staff-only-menu-control');
        staffElements.forEach(el => {
            el.style.display = isStaff ? '' : 'none';
        });

        const staffMenuActions = document.getElementById('staffMenuActions');
        if (staffMenuActions) {
            staffMenuActions.style.display = isStaff ? 'flex' : 'none';
        }

        const thActions = document.getElementById('thMenuActions');
        if (thActions) {
            thActions.style.display = isStaff ? 'table-cell' : 'none';
        }
    },

    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.menu-tab-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === tab) {
                btn.classList.add('active');
                btn.style.background = 'linear-gradient(135deg, #d4af37, #b8860b)';
                btn.style.color = '#121816';
                btn.style.borderColor = '#d4af37';
            } else {
                btn.classList.remove('active');
                btn.style.background = '#1b3b2b';
                btn.style.color = '#d1d5d0';
                btn.style.borderColor = 'rgba(212, 175, 55, 0.25)';
            }
        });

        // Toggle containers
        const tabItems = document.getElementById('tabContentMenuItems');
        const tabCategories = document.getElementById('tabContentCategories');
        const tabTables = document.getElementById('tabContentTables');

        if (tabItems) tabItems.style.display = tab === 'items' ? 'block' : 'none';
        if (tabCategories) tabCategories.style.display = tab === 'categories' ? 'block' : 'none';
        if (tabTables) tabTables.style.display = tab === 'tables' ? 'block' : 'none';

        // Update toolbar action button
        this.updateToolbarActions();
        this.renderCurrentTab();
    },

    updateToolbarActions() {
        const user = window.AuthManager ? AuthManager.currentUser : null;
        const isStaff = user && ['ADMIN', 'EVENT_COORDINATOR', 'OPERATIONS_SUPERVISOR', 'STAFF'].includes(user.role);
        const container = document.getElementById('menuToolbarActions');
        if (!container) return;

        if (!isStaff) {
            container.innerHTML = '';
            return;
        }

        if (this.currentTab === 'items') {
            container.innerHTML = `
                <button class="btn-primary" onclick="MenuComponent.openCreateMenuItemModal()" style="display:inline-flex; align-items:center; gap:8px; padding:9px 18px; border-radius:10px;">
                    <i class="fa-solid fa-plus"></i> Add Gourmet Dish
                </button>
            `;
        } else if (this.currentTab === 'categories') {
            container.innerHTML = `
                <button class="btn-primary" onclick="MenuComponent.openCreateCategoryModal()" style="display:inline-flex; align-items:center; gap:8px; padding:9px 18px; border-radius:10px;">
                    <i class="fa-solid fa-layer-group"></i> Add Category
                </button>
            `;
        } else if (this.currentTab === 'tables') {
            container.innerHTML = `
                <button class="btn-primary" onclick="MenuComponent.openCreateTableModal()" style="display:inline-flex; align-items:center; gap:8px; padding:9px 18px; border-radius:10px;">
                    <i class="fa-solid fa-chair"></i> Add Dining Table
                </button>
            `;
        }
    },

    renderCurrentTab() {
        if (this.currentTab === 'items') {
            this.renderMenuItems();
        } else if (this.currentTab === 'categories') {
            this.renderCategories();
        } else if (this.currentTab === 'tables') {
            this.renderTables();
        }
    },

    renderMetrics() {
        // Total Items
        const totalItems = this.menuItems.length;
        const activeItems = this.menuItems.filter(i => i.isAvailable !== false).length;
        
        // Total Categories
        const totalCategories = this.categories.length;
        
        // Tables & Capacity
        const totalTables = this.tables.length;
        const totalCapacity = this.tables.reduce((sum, t) => sum + (parseInt(t.capacity) || 0), 0);
        
        // Table Statuses
        const availTables = this.tables.filter(t => (t.status || 'AVAILABLE').toUpperCase() === 'AVAILABLE').length;
        const reservedTables = this.tables.filter(t => (t.status || '').toUpperCase() === 'RESERVED').length;
        const occupiedTables = this.tables.filter(t => (t.status || '').toUpperCase() === 'OCCUPIED').length;
        const cleaningTables = this.tables.filter(t => (t.status || '').toUpperCase() === 'CLEANING').length;
        const maintenanceTables = this.tables.filter(t => (t.status || '').toUpperCase() === 'MAINTENANCE').length;

        // Populate summary elements
        const elMetricItems = document.getElementById('metricMenuTotalItems');
        if (elMetricItems) elMetricItems.innerText = totalItems;

        const elMetricItemsSub = document.getElementById('metricMenuTotalItemsSub');
        if (elMetricItemsSub) elMetricItemsSub.innerText = `${activeItems} Available | ${totalItems - activeItems} Sold Out`;

        const elMetricCats = document.getElementById('metricMenuTotalCategories');
        if (elMetricCats) elMetricCats.innerText = totalCategories;

        const elMetricTables = document.getElementById('metricMenuTotalTables');
        if (elMetricTables) elMetricTables.innerText = totalTables;

        const elMetricCapacity = document.getElementById('metricMenuTotalCapacity');
        if (elMetricCapacity) elMetricCapacity.innerText = `${totalCapacity} Guests`;

        // Real-time table pill counters
        const pillAvail = document.getElementById('pillTableAvail');
        if (pillAvail) pillAvail.innerText = availTables;

        const pillReserved = document.getElementById('pillTableReserved');
        if (pillReserved) pillReserved.innerText = reservedTables;

        const pillOccupied = document.getElementById('pillTableOccupied');
        if (pillOccupied) pillOccupied.innerText = occupiedTables;

        const pillCleaning = document.getElementById('pillTableCleaning');
        if (pillCleaning) pillCleaning.innerText = cleaningTables;

        const pillMaint = document.getElementById('pillTableMaint');
        if (pillMaint) pillMaint.innerText = maintenanceTables;
    },

    populateCategoryDropdowns() {
        const filters = [
            document.getElementById('menuCategoryFilter'),
            document.getElementById('addMnuCatSelect'),
            document.getElementById('editMnuCatSelect')
        ];

        filters.forEach(select => {
            if (!select) return;
            const currentVal = select.value;
            const isFilter = select.id === 'menuCategoryFilter';
            
            let html = isFilter ? '<option value="ALL">All Categories</option>' : '<option value="">Select Category</option>';
            this.categories.forEach(cat => {
                html += `<option value="${Utils.escapeHtml(cat.name)}">${Utils.escapeHtml(cat.name)}</option>`;
            });
            select.innerHTML = html;
            if (currentVal) select.value = currentVal;
        });
    },

    /* ==========================================================================
       TAB 1: MENU ITEMS CATALOG
       ========================================================================== */
    setItemViewMode(mode) {
        this.itemViewMode = mode;
        const btnGrid = document.getElementById('btnViewGrid');
        const btnTable = document.getElementById('btnViewTable');
        const gridView = document.getElementById('menuCardsGridContainer');
        const tableView = document.getElementById('menuTableContainer');

        if (mode === 'grid') {
            if (btnGrid) {
                btnGrid.classList.add('btn-primary');
                btnGrid.classList.remove('btn-secondary');
            }
            if (btnTable) {
                btnTable.classList.remove('btn-primary');
                btnTable.classList.add('btn-secondary');
            }
            if (gridView) gridView.style.display = 'grid';
            if (tableView) tableView.style.display = 'none';
        } else {
            if (btnGrid) {
                btnGrid.classList.remove('btn-primary');
                btnGrid.classList.add('btn-secondary');
            }
            if (btnTable) {
                btnTable.classList.add('btn-primary');
                btnTable.classList.remove('btn-secondary');
            }
            if (gridView) gridView.style.display = 'none';
            if (tableView) tableView.style.display = 'block';
        }
        this.renderMenuItems();
    },

    filterByCategory(category) {
        this.activeCategoryFilter = category;
        const sel = document.getElementById('menuCategoryFilter');
        if (sel) sel.value = category;
        this.renderMenuItems();
    },

    filterByDietary(dietary) {
        this.activeDietaryFilter = dietary;
        document.querySelectorAll('.dietary-filter-pill').forEach(pill => {
            if (pill.getAttribute('data-dietary') === dietary) {
                pill.style.background = 'linear-gradient(135deg, #d4af37, #b8860b)';
                pill.style.color = '#121816';
                pill.style.borderColor = '#d4af37';
            } else {
                pill.style.background = '#1b3b2b';
                pill.style.color = '#d1d5d0';
                pill.style.borderColor = 'rgba(212, 175, 55, 0.25)';
            }
        });
        this.renderMenuItems();
    },

    filterBySpicy(spicyLevel) {
        this.activeSpicyFilter = spicyLevel;
        this.renderMenuItems();
    },

    onSearchInput(val) {
        this.searchQuery = (val || '').toLowerCase().trim();
        this.renderMenuItems();
    },

    getFilteredMenuItems() {
        let items = [...this.menuItems];

        // Search Query
        if (this.searchQuery) {
            items = items.filter(i => 
                (i.name || '').toLowerCase().includes(this.searchQuery) ||
                (i.description || '').toLowerCase().includes(this.searchQuery) ||
                (i.category || '').toLowerCase().includes(this.searchQuery)
            );
        }

        // Category Filter
        if (this.activeCategoryFilter && this.activeCategoryFilter !== 'ALL') {
            items = items.filter(i => (i.category || '').toUpperCase() === this.activeCategoryFilter.toUpperCase());
        }

        // Dietary Filter
        if (this.activeDietaryFilter === 'VEG') {
            items = items.filter(i => i.isVegetarian === true || i.vegetarian === true);
        } else if (this.activeDietaryFilter === 'NON_VEG') {
            items = items.filter(i => i.isVegetarian === false || i.vegetarian === false);
        } else if (this.activeDietaryFilter === 'FEATURED') {
            items = items.filter(i => i.isFeatured === true || i.featured === true);
        }

        // Spicy Level Filter
        if (this.activeSpicyFilter !== 'ALL') {
            const level = parseInt(this.activeSpicyFilter);
            items = items.filter(i => (parseInt(i.spicyLevel) || 0) === level);
        }

        return items;
    },

    renderMenuItems() {
        const filtered = this.getFilteredMenuItems();
        const user = window.AuthManager ? AuthManager.currentUser : null;
        const isStaff = user && ['ADMIN', 'EVENT_COORDINATOR', 'OPERATIONS_SUPERVISOR', 'STAFF'].includes(user.role);

        // 1. Render Grid View
        const grid = document.getElementById('menuCardsGridContainer');
        if (grid) {
            if (filtered.length === 0) {
                grid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align:center; padding:50px 20px; background:#1b3b2b; border-radius:16px; border:1px dashed rgba(212, 175, 55, 0.3);">
                        <i class="fa-solid fa-utensils" style="font-size:2.5rem; color:#d1d5d0; margin-bottom:12px; display:block;"></i>
                        <h4 style="color:#e6dfd5; font-size:1.1rem; margin-bottom:6px;">No Gourmet Dishes Found</h4>
                        <p style="color:#b0b8b4; font-size:0.9rem; max-width:400px; margin:0 auto 16px auto;">There are no menu items matching the active filters or search terms.</p>
                        ${isStaff ? `<button class="btn-primary" onclick="MenuComponent.openCreateMenuItemModal()"><i class="fa-solid fa-plus"></i> Add New Dish</button>` : ''}
                    </div>
                `;
            } else {
                grid.innerHTML = filtered.map(item => {
                    const isAvailable = item.isAvailable !== false;
                    const isVeg = item.isVegetarian === true || item.vegetarian === true;
                    const isFeatured = item.isFeatured === true || item.featured === true;
                    const spicyLevel = parseInt(item.spicyLevel) || 0;
                    const isFav = window.ReviewsComponent ? ReviewsComponent.isFavorite('menu', item.id) : false;
                    const imgUrl = item.imageUrl || 'images/gourmet_feast.jpg';

                    // Build spicy chilies
                    let spicyHtml = '';
                    if (spicyLevel > 0) {
                        const chilies = '🌶️'.repeat(Math.min(spicyLevel, 3));
                        spicyHtml = `<span style="font-size:0.75rem; background:#fee2e2; color:#b91c1c; padding:2px 7px; border-radius:6px; font-weight:700;" title="Spiciness: Level ${spicyLevel}">${chilies} Spicy</span>`;
                    }

                    return `
                    <div class="menu-item-card" style="background:linear-gradient(145deg, #1b3b2b 0%, #121816 100%); border:1px solid rgba(212, 175, 55, 0.25); border-radius:16px; overflow:hidden; box-shadow:0 8px 25px rgba(0,0,0,0.35); display:flex; flex-direction:column; justify-content:space-between; transition:all 0.25s ease; position:relative;" onmouseenter="this.style.transform='translateY(-5px)'; this.style.borderColor='rgba(212, 175, 55, 0.6)'; this.style.boxShadow='0 14px 35px rgba(0,0,0,0.5)'" onmouseleave="this.style.transform='translateY(0)'; this.style.borderColor='rgba(212, 175, 55, 0.25)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.35)'">
                        <!-- Image with Badges -->
                        <div style="position:relative; height:180px; background:#121816; overflow:hidden;">
                            <img src="${imgUrl}" alt="${Utils.escapeHtml(item.name)}" style="width:100%; height:100%; object-fit:cover; opacity:${isAvailable ? '1' : '0.6'}; transition:transform 0.4s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" onerror="this.src='images/gourmet_feast.jpg'">
                            
                            <!-- Top overlay badges -->
                            <div style="position:absolute; top:12px; left:12px; display:flex; gap:6px; flex-wrap:wrap;">
                                ${isFeatured ? `<span style="background:linear-gradient(135deg, #d4af37, #b8860b); color:#121816; font-size:0.68rem; font-weight:800; padding:3px 8px; border-radius:8px; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 2px 6px rgba(0,0,0,0.3);"><i class="fa-solid fa-crown"></i> Chef Special</span>` : ''}
                                ${isVeg ? `<span style="background:rgba(34, 197, 94, 0.2); color:#4ade80; font-size:0.7rem; font-weight:700; padding:3px 8px; border-radius:8px; border:1px solid rgba(74, 222, 128, 0.4); backdrop-filter:blur(4px);"><i class="fa-solid fa-leaf"></i> Vegetarian</span>` : `<span style="background:rgba(212, 175, 55, 0.2); color:#e6dfd5; font-size:0.7rem; font-weight:700; padding:3px 8px; border-radius:8px; border:1px solid rgba(212, 175, 55, 0.3); backdrop-filter:blur(4px);"><i class="fa-solid fa-drumstick-bite"></i> Non-Veg</span>`}
                            </div>

                            <!-- Favorite button -->
                            <button type="button" onclick="toggleFavorite('menu', ${item.id})" title="${isFav ? 'Remove Favorite' : 'Save as VIP Favorite'}" style="position:absolute; top:12px; right:12px; background:rgba(18, 24, 22, 0.8); border:1px solid rgba(212, 175, 55, 0.35); border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:${isFav ? '#dc2626' : '#d4af37'}; backdrop-filter:blur(6px); box-shadow:0 2px 8px rgba(0,0,0,0.3); transition:all 0.2s;">
                                <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                            </button>

                            <!-- Availability status badge -->
                            <div style="position:absolute; bottom:10px; right:12px;">
                                <span class="badge badge-${isAvailable ? 'success' : 'danger'}" style="font-size:0.72rem; padding:4px 9px; box-shadow:0 2px 6px rgba(0,0,0,0.4); font-weight:700;">
                                    ${isAvailable ? 'AVAILABLE' : 'SOLD OUT'}
                                </span>
                            </div>
                        </div>

                        <!-- Card Body -->
                        <div style="padding:18px 20px; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                            <div>
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; gap:8px;">
                                    <h4 style="margin:0; font-size:1.15rem; font-weight:800; color:#ffffff; line-height:1.3;">${Utils.escapeHtml(item.name)}</h4>
                                </div>

                                <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap;">
                                    <span style="font-size:0.72rem; background:rgba(212, 175, 55, 0.15); color:var(--text-gold, #d4af37); padding:2px 8px; border-radius:6px; font-weight:700; border:1px solid rgba(212, 175, 55, 0.25);"><i class="fa-solid fa-tag"></i> ${Utils.escapeHtml(item.category || 'General')}</span>
                                    ${spicyHtml}
                                </div>

                                <p style="font-size:0.86rem; color:#b0b8b4; line-height:1.55; margin:0 0 16px 0;">${Utils.escapeHtml(item.description || 'Artfully prepared using fine ingredients by our executive culinary masters.')}</p>
                            </div>

                            <div>
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding-top:12px; border-top:1px dashed rgba(212, 175, 55, 0.25);">
                                    <span style="font-size:0.78rem; color:#b0b8b4; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Price per serving</span>
                                    <strong style="color:var(--text-gold, #d4af37); font-size:1.25rem; font-weight:800;">${Utils.formatCurrency(item.price)}</strong>
                                </div>

                                <!-- Action Buttons -->
                                ${isStaff ? `
                                    <div style="display:grid; grid-template-columns: 1fr 1fr auto; gap:8px;">
                                        <button class="btn-secondary" style="padding:7px 10px; font-size:0.8rem; justify-content:center;" onclick="MenuComponent.openEditModal(${item.id})">
                                             <i class="fa-solid fa-pen-to-square"></i> Edit
                                        </button>
                                        <button class="btn-secondary" style="padding:7px 10px; font-size:0.8rem; justify-content:center; color:${isAvailable ? '#f59e0b' : '#10b981'};" onclick="MenuComponent.toggleAvailability(${item.id})">
                                            <i class="fa-solid fa-power-off"></i> ${isAvailable ? 'Set Out' : 'Set Avail'}
                                        </button>
                                        <button class="btn-secondary" style="padding:7px 10px; font-size:0.8rem; color:#ef4444; justify-content:center;" onclick="MenuComponent.deleteMenuItem(${item.id})" title="Delete Dish">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                ` : `
                                    <button class="btn-primary" style="width:100%; font-size:0.85rem; padding:10px; justify-content:center; font-weight:700;" onclick="AuthManager.handleBookingAuthGuard('reservationModal')">
                                        <i class="fa-solid fa-utensils"></i> Reserve Table & Taste
                                    </button>
                                `}
                            </div>
                        </div>
                    </div>
                    `;
                }).join('');
            }
        }

        // 2. Render Table View
        const tbody = document.getElementById('menuTableBody');
        if (tbody) {
            if (filtered.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#d1d5d0;">No menu dishes found in catalog matching your filters.</td></tr>`;
            } else {
                tbody.innerHTML = filtered.map(item => {
                    const isAvailable = item.isAvailable !== false;
                    const isVeg = item.isVegetarian === true || item.vegetarian === true;
                    const isFeatured = item.isFeatured === true || item.featured === true;
                    const spicyLevel = parseInt(item.spicyLevel) || 0;
                    const imgUrl = item.imageUrl || 'images/gourmet_feast.jpg';

                    return `
                    <tr>
                        <td class="text-center" style="width:70px;">
                            <img src="${imgUrl}" alt="${Utils.escapeHtml(item.name)}" style="width:50px; height:50px; border-radius:10px; object-fit:cover; border:1px solid rgba(212, 175, 55, 0.2);" onerror="this.src='images/gourmet_feast.jpg'">
                        </td>
                        <td>
                            <div style="font-weight:800; color:#e6dfd5; font-size:0.95rem;">${Utils.escapeHtml(item.name)}</div>
                            <div style="font-size:0.75rem; color:#b0b8b4; margin-top:2px;">#MNU-${item.id}</div>
                        </td>
                        <td class="text-center">
                            <span class="badge" style="background:rgba(212, 175, 55, 0.15); color:#e6dfd5; font-size:0.75rem; font-weight:600;">${Utils.escapeHtml(item.category || 'General')}</span>
                        </td>
                        <td>
                            <div style="display:flex; gap:5px; flex-wrap:wrap; margin-bottom:4px;">
                                ${isFeatured ? `<span class="badge" style="background:#fef3c7; color:#b45309; font-size:0.68rem;"><i class="fa-solid fa-crown"></i> Chef Special</span>` : ''}
                                ${isVeg ? `<span class="badge" style="background:#dcfce7; color:#15803d; font-size:0.68rem;"><i class="fa-solid fa-leaf"></i> Veg</span>` : `<span class="badge" style="background:rgba(212, 175, 55, 0.15); color:#d1d5d0; font-size:0.68rem;">Non-Veg</span>`}
                                ${spicyLevel > 0 ? `<span class="badge" style="background:#fee2e2; color:#b91c1c; font-size:0.68rem;">🌶️ Lvl ${spicyLevel}</span>` : ''}
                            </div>
                            <div style="font-size:0.8rem; color:#b0b8b4; max-width:320px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                ${Utils.escapeHtml(item.description || '-')}
                            </div>
                        </td>
                        <td class="text-right">
                            <strong style="color:#b8860b; font-size:1rem;">${Utils.formatCurrency(item.price)}</strong>
                        </td>
                        <td class="text-center">
                            <button type="button" class="badge badge-${isAvailable ? 'success' : 'danger'}" style="cursor:pointer; border:none; padding:5px 10px; font-size:0.75rem; font-weight:700;" onclick="MenuComponent.toggleAvailability(${item.id})" title="Click to toggle availability status">
                                <i class="fa-solid fa-${isAvailable ? 'circle-check' : 'circle-xmark'}"></i> ${isAvailable ? 'AVAILABLE' : 'SOLD OUT'}
                            </button>
                        </td>
                        ${isStaff ? `
                            <td class="text-center" style="white-space:nowrap;">
                                <button class="btn-secondary" style="padding:5px 10px; font-size:0.75rem; margin-right:4px;" title="Edit Dish" onclick="MenuComponent.openEditModal(${item.id})">
                                    <i class="fa-solid fa-pen-to-square"></i> Edit
                                </button>
                                <button class="btn-secondary" style="padding:5px 8px; font-size:0.75rem; color:#ef4444;" title="Delete Dish" onclick="MenuComponent.deleteMenuItem(${item.id})">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        ` : ''}
                    </tr>
                    `;
                }).join('');
            }
        }
    },

    openCreateMenuItemModal() {
        this.editingMenuItem = null;
        const titleEl = document.getElementById('menuItemModalTitle');
        if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-utensils" style="color:var(--text-gold);"></i> Add New Gourmet Dish';
        
        const form = document.getElementById('formMenuItemModal');
        if (form) form.reset();

        const idEl = document.getElementById('modalMenuItemId');
        if (idEl) idEl.value = '';

        const previewImg = document.getElementById('modalMenuItemImagePreview');
        if (previewImg) previewImg.src = 'images/gourmet_feast.jpg';

        this.populateCategoryDropdowns();
        ModalManager.openModal('menuItemModal');
    },

    openEditModal(id) {
        const item = this.menuItems.find(i => i.id === id);
        if (!item) return;

        this.editingMenuItem = item;
        const titleEl = document.getElementById('menuItemModalTitle');
        if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color:var(--text-gold);"></i> Edit Gourmet Dish';

        const idEl = document.getElementById('modalMenuItemId');
        const nameEl = document.getElementById('modalMenuItemName');
        const catEl = document.getElementById('modalMenuItemCategory');
        const priceEl = document.getElementById('modalMenuItemPrice');
        const imgEl = document.getElementById('modalMenuItemImage');
        const descEl = document.getElementById('modalMenuItemDescription');
        const vegEl = document.getElementById('modalMenuItemIsVeg');
        const featuredEl = document.getElementById('modalMenuItemIsFeatured');
        const spicyEl = document.getElementById('modalMenuItemSpicyLevel');
        const availEl = document.getElementById('modalMenuItemAvailable');
        const previewImg = document.getElementById('modalMenuItemImagePreview');

        if (idEl) idEl.value = item.id;
        if (nameEl) nameEl.value = item.name || '';
        if (catEl) catEl.value = item.category || '';
        if (priceEl) priceEl.value = item.price || '';
        if (imgEl) imgEl.value = item.imageUrl || 'images/gourmet_feast.jpg';
        if (descEl) descEl.value = item.description || '';
        if (vegEl) vegEl.checked = item.isVegetarian === true || item.vegetarian === true;
        if (featuredEl) featuredEl.checked = item.isFeatured === true || item.featured === true;
        if (spicyEl) spicyEl.value = item.spicyLevel || 0;
        if (availEl) availEl.value = item.isAvailable !== false ? 'true' : 'false';
        if (previewImg) previewImg.src = item.imageUrl || 'images/gourmet_feast.jpg';

        ModalManager.openModal('menuItemModal');
    },

    updateMenuItemImagePreview(url) {
        const previewImg = document.getElementById('modalMenuItemImagePreview');
        if (previewImg) {
            previewImg.src = url || 'images/gourmet_feast.jpg';
        }
    },

    async handleMenuItemSubmit(e) {
        if (e) e.preventDefault();

        const id = document.getElementById('modalMenuItemId')?.value;
        const nameEl = document.getElementById('modalMenuItemName');
        const catEl = document.getElementById('modalMenuItemCategory');
        const priceEl = document.getElementById('modalMenuItemPrice');
        const imgEl = document.getElementById('modalMenuItemImage');
        const descEl = document.getElementById('modalMenuItemDescription');
        const vegEl = document.getElementById('modalMenuItemIsVeg');
        const featuredEl = document.getElementById('modalMenuItemIsFeatured');
        const spicyEl = document.getElementById('modalMenuItemSpicyLevel');
        const availEl = document.getElementById('modalMenuItemAvailable');

        const name = (nameEl?.value || '').trim();
        const category = (catEl?.value || '').trim();
        const price = priceEl?.value;
        const imageUrl = (imgEl?.value || '').trim() || 'images/gourmet_feast.jpg';
        const description = (descEl?.value || '').trim();
        const isVegetarian = vegEl ? vegEl.checked : false;
        const isFeatured = featuredEl ? featuredEl.checked : false;
        const spicyLevel = parseInt(spicyEl?.value) || 0;
        const isAvailable = availEl ? availEl.value === 'true' : true;

        // Validation - Cannot be purely numeric like 123
        const nVal = FormValidator.validateEntityName(name, 'Gourmet Dish Name', 2);
        if (!nVal.valid) return FormValidator.markInvalid(nameEl, nVal.message);

        if (!category) {
            return FormValidator.markInvalid(catEl, 'Please select an assigned menu category.');
        }

        const pVal = FormValidator.validateNumber(price, 'Dish Price (LKR)', 1);
        if (!pVal.valid) return FormValidator.markInvalid(priceEl, pVal.message);

        const payload = {
            name,
            category,
            price: parseFloat(price),
            description,
            imageUrl,
            isVegetarian,
            isSpicy: spicyLevel > 0,
            spicyLevel,
            isFeatured,
            isAvailable
        };

        try {
            let res;
            if (id) {
                res = await ApiService.menu.update(id, payload);
            } else {
                res = await ApiService.menu.create(payload);
            }

            if (res && res.success) {
                ModalManager.closeModal('menuItemModal');
                NotificationManager.showToast(id ? 'Menu dish updated successfully!' : 'Gourmet dish added to catalog!');
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to save menu item.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error saving menu item.', true);
        }
    },

    async toggleAvailability(id) {
        const item = this.menuItems.find(i => i.id === id);
        if (!item) return;

        const currentStatus = item.isAvailable !== false;
        try {
            const res = await ApiService.menu.toggleAvailability(id);
            if (res && res.success) {
                NotificationManager.showToast(`Dish status changed to ${!currentStatus ? 'AVAILABLE' : 'SOLD OUT'}.`);
                await this.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to toggle availability.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error toggling availability.', true);
        }
    },

    async deleteMenuItem(id) {
        const item = this.menuItems.find(i => i.id === id);
        const name = item ? item.name : 'this dish';
        if (!confirm(`Are you sure you want to permanently delete "${name}" from the menu catalog?`)) return;

        try {
            const res = await ApiService.menu.delete(id);
            if (res && res.success) {
                NotificationManager.showToast(`"${name}" deleted successfully.`);
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to delete dish.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error deleting dish.', true);
        }
    },

    /* ==========================================================================
       TAB 2: MENU CATEGORIES MANAGEMENT (CRUD + DELETE SAFEGUARD)
       ========================================================================== */
    renderCategories() {
        const grid = document.getElementById('categoriesGridContainer');
        if (!grid) return;

        const user = window.AuthManager ? AuthManager.currentUser : null;
        const isStaff = user && ['ADMIN', 'EVENT_COORDINATOR', 'OPERATIONS_SUPERVISOR', 'STAFF'].includes(user.role);

        if (this.categories.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align:center; padding:50px 20px; background:#1b3b2b; border-radius:16px; border:1px dashed rgba(212, 175, 55, 0.3);">
                    <i class="fa-solid fa-layer-group" style="font-size:2.5rem; color:#d1d5d0; margin-bottom:12px; display:block;"></i>
                    <h4 style="color:#e6dfd5; font-size:1.1rem; margin-bottom:6px;">No Menu Categories Defined</h4>
                    <p style="color:#b0b8b4; font-size:0.9rem; max-width:400px; margin:0 auto 16px auto;">Create culinary categories such as Appetizers, Main Course, Seafood, and Desserts.</p>
                    ${isStaff ? `<button class="btn-primary" onclick="MenuComponent.openCreateCategoryModal()"><i class="fa-solid fa-plus"></i> Add First Category</button>` : ''}
                </div>
            `;
            return;
        }

        grid.innerHTML = this.categories.map(cat => {
            // Count items belonging to this category
            const count = this.menuItems.filter(i => 
                (i.category || '').toUpperCase() === (cat.name || '').toUpperCase()
            ).length;

            const iconClass = cat.icon || 'fa-bowl-food';
            const isActive = (cat.status || 'ACTIVE').toUpperCase() === 'ACTIVE';

            return `
            <div class="category-card" style="background:linear-gradient(145deg, #1b3b2b 0%, #121816 100%); border:1px solid rgba(212, 175, 55, 0.25); border-radius:16px; padding:22px; box-shadow:0 8px 25px rgba(0,0,0,0.35); display:flex; flex-direction:column; justify-content:space-between; transition:all 0.25s ease;" onmouseenter="this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(212, 175, 55, 0.6)'" onmouseleave="this.style.transform='translateY(0)'; this.style.borderColor='rgba(212, 175, 55, 0.25)'">
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
                        <div style="width:48px; height:48px; border-radius:12px; background:rgba(212,175,55,0.18); border:1px solid rgba(212,175,55,0.4); display:flex; align-items:center; justify-content:center; color:var(--text-gold); font-size:1.35rem;">
                            <i class="fa-solid ${iconClass}"></i>
                        </div>
                        <div style="display:flex; gap:6px; align-items:center;">
                            <span class="badge" style="background:#121816; color:#ffffff; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:12px; border:1px solid rgba(212,175,55,0.2);">
                                ${count} ${count === 1 ? 'Dish' : 'Dishes'}
                            </span>
                            <span class="badge badge-${isActive ? 'success' : 'secondary'}" style="font-size:0.72rem;">
                                ${isActive ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                        </div>
                    </div>

                    <h4 style="margin:0 0 6px 0; font-size:1.15rem; font-weight:800; color:#ffffff;">${Utils.escapeHtml(cat.name)}</h4>
                    <p style="font-size:0.86rem; color:#b0b8b4; line-height:1.55; margin:0 0 16px 0;">${Utils.escapeHtml(cat.description || 'Curated gourmet selection for luxury dining and gala events.')}</p>
                    
                    <div style="display:flex; align-items:center; gap:8px; font-size:0.78rem; color:#b0b8b4;">
                        <i class="fa-solid fa-arrow-down-1-9"></i> Display Sequence: <strong style="color:var(--text-gold);">#${cat.displayOrder || 1}</strong>
                    </div>
                </div>

                <div style="margin-top:20px; padding-top:14px; border-top:1px dashed rgba(212, 175, 55, 0.25); display:flex; justify-content:space-between; align-items:center; gap:8px;">
                    <button class="btn-secondary" style="padding:6px 12px; font-size:0.8rem;" onclick="MenuComponent.filterByCategory('${Utils.escapeHtml(cat.name)}'); MenuComponent.switchTab('items');">
                        <i class="fa-solid fa-list-check"></i> View Dishes
                    </button>
                    ${isStaff ? `
                        <div style="display:flex; gap:6px;">
                            <button class="btn-secondary" style="padding:6px 10px; font-size:0.8rem;" title="Edit Category" onclick="MenuComponent.openEditCategoryModal(${cat.id})">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="btn-secondary" style="padding:6px 10px; font-size:0.8rem; color:#ef4444;" title="Delete Category" onclick="MenuComponent.confirmDeleteCategory(${cat.id}, '${Utils.escapeHtml(cat.name)}', ${count})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
            `;
        }).join('');
    },

    openCreateCategoryModal() {
        this.editingCategory = null;
        const titleEl = document.getElementById('categoryModalTitle');
        if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-layer-group" style="color:var(--text-gold);"></i> Create Menu Category';

        const form = document.getElementById('formCategoryModal');
        if (form) form.reset();

        const idEl = document.getElementById('modalCategoryId');
        if (idEl) idEl.value = '';

        const iconEl = document.getElementById('modalCategoryIcon');
        if (iconEl) iconEl.value = 'fa-utensils';

        const orderEl = document.getElementById('modalCategoryOrder');
        if (orderEl) orderEl.value = (this.categories.length + 1);

        ModalManager.openModal('categoryModal');
    },

    openEditCategoryModal(id) {
        const cat = this.categories.find(c => c.id === id);
        if (!cat) return;

        this.editingCategory = cat;
        const titleEl = document.getElementById('categoryModalTitle');
        if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color:var(--text-gold);"></i> Edit Menu Category';

        const idEl = document.getElementById('modalCategoryId');
        const nameEl = document.getElementById('modalCategoryName');
        const iconEl = document.getElementById('modalCategoryIcon');
        const orderEl = document.getElementById('modalCategoryOrder');
        const descEl = document.getElementById('modalCategoryDesc');
        const statusEl = document.getElementById('modalCategoryStatus');

        if (idEl) idEl.value = cat.id;
        if (nameEl) nameEl.value = cat.name || '';
        if (iconEl) iconEl.value = cat.icon || 'fa-utensils';
        if (orderEl) orderEl.value = cat.displayOrder || 1;
        if (descEl) descEl.value = cat.description || '';
        if (statusEl) statusEl.value = (cat.status || 'ACTIVE').toUpperCase();

        ModalManager.openModal('categoryModal');
    },

    async handleCategorySubmit(e) {
        if (e) e.preventDefault();

        const id = document.getElementById('modalCategoryId')?.value;
        const nameEl = document.getElementById('modalCategoryName');
        const iconEl = document.getElementById('modalCategoryIcon');
        const orderEl = document.getElementById('modalCategoryOrder');
        const descEl = document.getElementById('modalCategoryDesc');
        const statusEl = document.getElementById('modalCategoryStatus');

        const name = (nameEl?.value || '').trim();
        const icon = (iconEl?.value || 'fa-utensils').trim();
        const displayOrder = parseInt(orderEl?.value) || 1;
        const description = (descEl?.value || '').trim();
        const status = statusEl ? statusEl.value : 'ACTIVE';

        // Validation - Cannot be purely numeric like 123
        const nVal = FormValidator.validateEntityName(name, 'Category Name', 2);
        if (!nVal.valid) return FormValidator.markInvalid(nameEl, nVal.message);

        const payload = {
            name,
            icon,
            displayOrder,
            description,
            status
        };

        try {
            let res;
            if (id) {
                res = await ApiService.menu.updateCategory(id, payload);
            } else {
                res = await ApiService.menu.createCategory(payload);
            }

            if (res && res.success) {
                ModalManager.closeModal('categoryModal');
                NotificationManager.showToast(id ? 'Menu category updated successfully!' : 'New category created successfully!');
                await this.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to save category.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error saving category.', true);
        }
    },

    confirmDeleteCategory(id, name, itemCount) {
        if (itemCount > 0) {
            // Safeguard warning
            const modalBody = document.getElementById('deleteCategorySafeguardBody');
            if (modalBody) {
                modalBody.innerHTML = `
                    <div style="text-align:center; padding:10px 0;">
                        <div style="width:60px; height:60px; border-radius:50%; background:#fee2e2; color:#dc2626; display:inline-flex; align-items:center; justify-content:center; font-size:1.8rem; margin-bottom:14px;">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                        <h4 style="font-size:1.15rem; color:#e6dfd5; margin-bottom:8px;">Cannot Delete Category: "${name}"</h4>
                        <p style="font-size:0.9rem; color:#b0b8b4; line-height:1.5;">
                            This category currently contains <strong>${itemCount} active gourmet dish(es)</strong>. In accordance with Grand Monarch data integrity standards, categories with assigned dishes cannot be deleted.
                        </p>
                        <div style="background:#121816; border:1px solid rgba(212, 175, 55, 0.2); border-radius:10px; padding:12px; margin:14px 0; font-size:0.85rem; color:#d1d5d0; text-align:left;">
                            <strong style="color:#e6dfd5;"><i class="fa-solid fa-circle-info"></i> How to proceed:</strong>
                            <ol style="margin:6px 0 0 16px; padding:0;">
                                <li>Filter dishes by "${name}" in the Menu Items tab.</li>
                                <li>Reassign dishes to another category or delete them.</li>
                                <li>Return here to safely delete the empty category.</li>
                            </ol>
                        </div>
                    </div>
                `;
                ModalManager.openModal('deleteCategorySafeguardModal');
            } else {
                alert(`Cannot delete category "${name}" because it contains ${itemCount} active dish(es). Please reassign or delete the dishes first.`);
            }
            return;
        }

        if (!confirm(`Are you sure you want to permanently delete category "${name}"?`)) return;

        this.executeDeleteCategory(id);
    },

    async executeDeleteCategory(id) {
        try {
            const res = await ApiService.menu.deleteCategory(id);
            if (res && res.success) {
                ModalManager.closeModal('deleteCategorySafeguardModal');
                NotificationManager.showToast('Menu category deleted successfully.');
                await this.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to delete category.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error deleting category.', true);
        }
    },

    /* ==========================================================================
       TAB 3: DINING TABLES & FLOOR PLAN MANAGEMENT
       ========================================================================== */
    filterTablesBySection(section) {
        this.activeSectionFilter = section;
        document.querySelectorAll('.table-section-pill').forEach(pill => {
            if (pill.getAttribute('data-section') === section) {
                pill.style.background = 'linear-gradient(135deg, #d4af37, #b8860b)';
                pill.style.color = '#121816';
                pill.style.borderColor = '#d4af37';
            } else {
                pill.style.background = '#1b3b2b';
                pill.style.color = '#d1d5d0';
                pill.style.borderColor = 'rgba(212, 175, 55, 0.25)';
            }
        });
        this.renderTables();
    },

    filterTablesByStatus(status) {
        this.activeTableStatusFilter = status;
        this.renderTables();
    },

    getFilteredTables() {
        let list = [...this.tables];

        if (this.activeSectionFilter !== 'ALL') {
            list = list.filter(t => (t.location || '').toLowerCase().includes(this.activeSectionFilter.toLowerCase()));
        }

        if (this.activeTableStatusFilter !== 'ALL') {
            list = list.filter(t => (t.status || '').toUpperCase() === this.activeTableStatusFilter.toUpperCase());
        }

        return list;
    },

    renderTables() {
        const grid = document.getElementById('tablesFloorPlanContainer');
        if (!grid) return;

        const filtered = this.getFilteredTables();
        const user = window.AuthManager ? AuthManager.currentUser : null;
        const isStaff = user && ['ADMIN', 'EVENT_COORDINATOR', 'OPERATIONS_SUPERVISOR', 'STAFF'].includes(user.role);

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align:center; padding:50px 20px; background:#1b3b2b; border-radius:16px; border:1px dashed rgba(212, 175, 55, 0.3);">
                    <i class="fa-solid fa-chair" style="font-size:2.5rem; color:#d1d5d0; margin-bottom:12px; display:block;"></i>
                    <h4 style="color:#e6dfd5; font-size:1.1rem; margin-bottom:6px;">No Dining Tables Found</h4>
                    <p style="color:#b0b8b4; font-size:0.9rem; max-width:400px; margin:0 auto 16px auto;">No tables match the active dining section or status filter.</p>
                    ${isStaff ? `<button class="btn-primary" onclick="MenuComponent.openCreateTableModal()"><i class="fa-solid fa-plus"></i> Add Dining Table</button>` : ''}
                </div>
            `;
            return;
        }

        // Color definitions for Table Statuses
        const statusConfigs = {
            'AVAILABLE': { label: 'AVAILABLE', bg: '#dcfce7', text: '#15803d', border: '#86efac', icon: 'fa-circle-check' },
            'RESERVED': { label: 'RESERVED', bg: '#fef3c7', text: '#b45309', border: '#fcd34d', icon: 'fa-clock' },
            'OCCUPIED': { label: 'OCCUPIED', bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd', icon: 'fa-user-group' },
            'CLEANING': { label: 'CLEANING', bg: '#ffedd5', text: '#c2410c', border: '#fdba74', icon: 'fa-broom' },
            'MAINTENANCE': { label: 'MAINTENANCE', bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5', icon: 'fa-wrench' }
        };

        grid.innerHTML = filtered.map(t => {
            const rawStatus = (t.status || 'AVAILABLE').toUpperCase();
            const config = statusConfigs[rawStatus] || statusConfigs['AVAILABLE'];
            const capacity = parseInt(t.capacity) || 2;

            // Render guest icons
            let guestIcons = '';
            for (let i = 0; i < Math.min(capacity, 8); i++) {
                guestIcons += '<i class="fa-solid fa-user" style="margin-right:2px; font-size:0.8rem; color:#b0b8b4;"></i>';
            }
            if (capacity > 8) {
                guestIcons += `<span style="font-size:0.75rem; font-weight:700; color:#d1d5d0;">+${capacity - 8}</span>`;
            }

            return `
            <div class="table-floor-card" style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-top:4px solid ${config.border}; border-radius:16px; padding:20px; box-shadow:0 4px 14px rgba(0,0,0,0.05); display:flex; flex-direction:column; justify-content:space-between; transition:all 0.2s; position:relative;">
                <div>
                    <!-- Top header with Table Number and Status -->
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <div style="width:42px; height:42px; border-radius:10px; background:#121816; color:#d4af37; display:flex; align-items:center; justify-content:center; font-size:1.1rem; font-weight:900;">
                                <i class="fa-solid fa-chair"></i>
                            </div>
                            <div>
                                <h3 style="margin:0; font-size:1.25rem; font-weight:900; color:#e6dfd5; letter-spacing:0.5px;">${Utils.escapeHtml(t.tableNumber || 'T-XX')}</h3>
                                <span style="font-size:0.72rem; color:#d1d5d0; font-weight:600;">ID #${t.id}</span>
                            </div>
                        </div>

                        <!-- Status Badge -->
                        <span style="background:${config.bg}; color:${config.text}; border:1px solid ${config.border}; padding:4px 10px; border-radius:8px; font-size:0.75rem; font-weight:800; display:inline-flex; align-items:center; gap:5px;">
                            <i class="fa-solid ${config.icon}"></i> ${config.label}
                        </span>
                    </div>

                    <!-- Dining Section & Location -->
                    <div style="margin-bottom:12px; background:#121816; border:1px solid rgba(212, 175, 55, 0.2); border-radius:10px; padding:10px 12px;">
                        <div style="font-size:0.75rem; color:#b0b8b4; font-weight:600; text-transform:uppercase; margin-bottom:2px;">Dining Section</div>
                        <div style="font-weight:700; color:#e6dfd5; font-size:0.92rem; display:flex; align-items:center; gap:6px;">
                            <i class="fa-solid fa-location-dot" style="color:#b8860b;"></i> ${Utils.escapeHtml(t.location || 'Main Dining Hall')}
                        </div>
                    </div>

                    <!-- Seating Capacity -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; padding:0 4px;">
                        <span style="font-size:0.82rem; color:#b0b8b4; font-weight:600;">Seating Capacity:</span>
                        <div style="display:flex; align-items:center; gap:6px;">
                            ${guestIcons}
                            <strong style="color:#e6dfd5; font-size:0.95rem; margin-left:4px;">${capacity} Guests</strong>
                        </div>
                    </div>
                </div>

                <!-- Footer with Status Dropdown and Actions -->
                <div style="pt:12px; border-top:1px dashed rgba(212, 175, 55, 0.2);">
                    ${isStaff ? `
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <div style="display:flex; align-items:center; gap:6px;">
                                <label style="font-size:0.75rem; color:#b0b8b4; font-weight:700; white-space:nowrap;">Status:</label>
                                <select class="form-control" style="font-size:0.78rem; padding:4px 8px; height:auto; font-weight:700; border-radius:8px;" onchange="MenuComponent.updateTableStatus(${t.id}, this.value)">
                                    <option value="AVAILABLE" ${rawStatus === 'AVAILABLE' ? 'selected' : ''}>🟢 Available</option>
                                    <option value="RESERVED" ${rawStatus === 'RESERVED' ? 'selected' : ''}>🟡 Reserved</option>
                                    <option value="OCCUPIED" ${rawStatus === 'OCCUPIED' ? 'selected' : ''}>🔵 Occupied</option>
                                    <option value="CLEANING" ${rawStatus === 'CLEANING' ? 'selected' : ''}>🟠 Cleaning</option>
                                    <option value="MAINTENANCE" ${rawStatus === 'MAINTENANCE' ? 'selected' : ''}>🔴 Maintenance</option>
                                </select>
                            </div>

                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px;">
                                <button class="btn-secondary" style="padding:6px 8px; font-size:0.78rem; justify-content:center;" onclick="MenuComponent.openEditTableModal(${t.id})">
                                    <i class="fa-solid fa-pen-to-square"></i> Edit
                                </button>
                                <button class="btn-secondary" style="padding:6px 8px; font-size:0.78rem; color:#ef4444; justify-content:center;" onclick="MenuComponent.deleteTable(${t.id}, '${Utils.escapeHtml(t.tableNumber)}')">
                                    <i class="fa-solid fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    ` : `
                        <button class="btn-primary" style="width:100%; font-size:0.85rem; padding:8px; justify-content:center;" onclick="AuthManager.handleBookingAuthGuard('reservationModal')">
                            <i class="fa-solid fa-calendar-check"></i> Book This Table
                        </button>
                    `}
                </div>
            </div>
            `;
        }).join('');
    },

    async updateTableStatus(tableId, newStatus) {
        try {
            const res = await ApiService.tables.updateStatus(tableId, newStatus);
            if (res && res.success) {
                NotificationManager.showToast(`Table status updated to ${newStatus}.`);
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
                if (window.ReservationsComponent) window.ReservationsComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to update table status.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error updating table status.', true);
        }
    },

    openCreateTableModal() {
        this.editingTable = null;
        const titleEl = document.getElementById('tableModalTitle');
        if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-chair" style="color:var(--text-gold);"></i> Add New Dining Table';

        const form = document.getElementById('formTableModal');
        if (form) form.reset();

        const idEl = document.getElementById('modalTableId');
        if (idEl) idEl.value = '';

        const capEl = document.getElementById('modalTableCapacity');
        if (capEl) capEl.value = 4;

        ModalManager.openModal('tableModal');
    },

    openEditTableModal(id) {
        const table = this.tables.find(t => t.id === id);
        if (!table) return;

        this.editingTable = table;
        const titleEl = document.getElementById('tableModalTitle');
        if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color:var(--text-gold);"></i> Edit Dining Table';

        const idEl = document.getElementById('modalTableId');
        const numEl = document.getElementById('modalTableNumber');
        const capEl = document.getElementById('modalTableCapacity');
        const locEl = document.getElementById('modalTableLocation');
        const statEl = document.getElementById('modalTableStatus');

        if (idEl) idEl.value = table.id;
        if (numEl) numEl.value = table.tableNumber || '';
        if (capEl) capEl.value = table.capacity || 4;
        if (locEl) locEl.value = table.location || 'Main Dining Indoor';
        if (statEl) statEl.value = (table.status || 'AVAILABLE').toUpperCase();

        ModalManager.openModal('tableModal');
    },

    async handleTableSubmit(e) {
        if (e) e.preventDefault();

        const id = document.getElementById('modalTableId')?.value;
        const numEl = document.getElementById('modalTableNumber');
        const capEl = document.getElementById('modalTableCapacity');
        const locEl = document.getElementById('modalTableLocation');
        const statEl = document.getElementById('modalTableStatus');

        const tableNumber = (numEl?.value || '').trim();
        const capacity = parseInt(capEl?.value);
        const location = (locEl?.value || '').trim();
        const status = (statEl?.value || 'AVAILABLE').toUpperCase();

        const nVal = FormValidator.validateText(tableNumber, 'Table Identifier', 2);
        if (!nVal.valid) return FormValidator.markInvalid(numEl, nVal.message);

        const cVal = FormValidator.validateNumber(capacity, 'Seating Capacity', 1, 50);
        if (!cVal.valid) return FormValidator.markInvalid(capEl, cVal.message);

        if (!location) {
            return FormValidator.markInvalid(locEl, 'Please select or enter a dining section.');
        }

        const payload = {
            tableNumber,
            capacity,
            location,
            status
        };

        try {
            let res;
            if (id) {
                res = await ApiService.tables.update(id, payload);
            } else {
                res = await ApiService.tables.create(payload);
            }

            if (res && res.success) {
                ModalManager.closeModal('tableModal');
                NotificationManager.showToast(id ? 'Dining table updated successfully!' : 'New table added to floor plan!');
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to save dining table.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error saving dining table.', true);
        }
    },

    async deleteTable(id, tableNumber) {
        if (!confirm(`Are you sure you want to delete table "${tableNumber}" from the dining floor plan?`)) return;

        try {
            const res = await ApiService.tables.delete(id);
            if (res && res.success) {
                NotificationManager.showToast(`Table "${tableNumber}" deleted successfully.`);
                await this.load();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to delete table.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error deleting table.', true);
        }
    },

    /* ==========================================================================
       BACKWARD COMPATIBILITY BRIDGE (For public preview & old forms)
       ========================================================================== */
    renderPreviewGrid() {
        this.renderMenuItems();
    },

    renderTable() {
        this.renderMenuItems();
    },

    async handleSubmit(e) {
        return this.handleMenuItemSubmit(e);
    },

    async handleEditSubmit(e) {
        return this.handleMenuItemSubmit(e);
    }
};

window.MenuComponent = MenuComponent;
window.renderMenuTable = function() {
    const searchVal = document.getElementById('menuSearch')?.value;
    const catVal = document.getElementById('menuCategoryFilter')?.value;
    if (searchVal !== undefined) MenuComponent.onSearchInput(searchVal);
    if (catVal !== undefined) MenuComponent.filterByCategory(catVal);
};
window.handleAddMenuSubmit = function(e) {
    return MenuComponent.handleMenuItemSubmit(e);
};
window.handleCreateMenuItemSubmit = function(e) {
    return MenuComponent.handleMenuItemSubmit(e);
};
window.handleEditMenuSubmit = function(e) {
    return MenuComponent.handleMenuItemSubmit(e);
};
