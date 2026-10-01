/**
 * Resources Component
 * Complete CRUD for AV equipment, lighting rigs, decor, and furniture inventory.
 * Validation: Equipment Name = letters/spaces only. Quantity/Price = positive integers only.
 */

// ─── Input Guards: Block invalid keystrokes in real-time ───────────────────────

/**
 * Attaches live keydown/paste guards to a quantity or price input.
 * Blocks: minus (-), plus (+), 'e', 'E', all non-numeric keys (for integers).
 */
function attachNumericGuard(el, allowDecimal = false) {
    if (!el) return;
    el.addEventListener('keydown', function (e) {
        const blocked = ['-', '+', 'e', 'E'];
        if (blocked.includes(e.key)) {
            e.preventDefault();
            return;
        }
        // Block decimal point for integer-only fields
        if (!allowDecimal && e.key === '.') {
            e.preventDefault();
        }
    });
    el.addEventListener('paste', function (e) {
        const pasted = (e.clipboardData || window.clipboardData).getData('text');
        const pattern = allowDecimal ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]+$/;
        if (!pattern.test(pasted.trim())) {
            e.preventDefault();
            el.classList.add('input-error');
            setTimeout(() => el.classList.remove('input-error'), 1500);
        }
    });
    // Remove any negative value on blur
    el.addEventListener('blur', function () {
        if (parseFloat(this.value) < 0) this.value = '';
    });
}

/**
 * Attaches live keydown/paste guards to an equipment name input.
 * Blocks: digits (0-9) and special symbols like / - + * # @ ! etc.
 * Allows: letters (a-z A-Z), spaces, apostrophes, and dots.
 */
function attachNameGuard(el) {
    if (!el) return;
    el.addEventListener('keydown', function (e) {
        // Allow control keys
        const controlKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
        if (controlKeys.includes(e.key) || (e.ctrlKey || e.metaKey)) return;
        // Block digits
        if (/^\d$/.test(e.key)) {
            e.preventDefault();
            flashError(el, 'Equipment name cannot contain numbers!');
            return;
        }
        // Block special symbols (allow letters, space, apostrophe, dot)
        if (!/^[a-zA-Z\s.']+$/.test(e.key)) {
            e.preventDefault();
            flashError(el, 'Special characters are not allowed!');
        }
    });
    el.addEventListener('paste', function (e) {
        const pasted = (e.clipboardData || window.clipboardData).getData('text');
        if (/\d/.test(pasted) || !/^[a-zA-Z\s.']*$/.test(pasted)) {
            e.preventDefault();
            flashError(el, 'Equipment name cannot contain numbers or special characters!');
        }
    });
}

/** Shows a brief red border flash with tooltip on the input */
function flashError(el, message) {
    el.style.borderColor = '#ef4444';
    el.title = message;
    setTimeout(() => {
        el.style.borderColor = '';
        el.title = '';
    }, 1500);
}

// ─── Equipment Name Validation (strict: letters/spaces/apostrophes only) ──────

function validateEquipmentName(value) {
    const cleaned = (value || '').trim();
    if (!cleaned) return { valid: false, message: 'Equipment Name is required.' };
    if (cleaned.length < 2) return { valid: false, message: 'Equipment Name must be at least 2 characters.' };
    if (cleaned.length > 100) return { valid: false, message: 'Equipment Name cannot exceed 100 characters.' };
    if (/\d/.test(cleaned)) return { valid: false, message: 'Equipment Name cannot contain numbers (e.g. 123). Please use letters only.' };
    if (!/^[a-zA-Z\s.']+$/.test(cleaned)) return { valid: false, message: "Equipment Name can only contain letters, spaces, apostrophes, and dots. No symbols like / - + # @ are allowed." };
    if (!/[a-zA-Z]/.test(cleaned)) return { valid: false, message: 'Equipment Name must contain at least one letter.' };
    return { valid: true, value: cleaned };
}

// ─── Main Component ───────────────────────────────────────────────────────────

const ResourcesComponent = {
    resources: [],

    async load() {
        try {
            const data = await ApiService.resources.getAll();
            this.resources = data || [];
            this.renderTable();
            // Attach guards after rendering (for any inline forms)
            this._attachGuards();
        } catch (err) {
            console.error('[Resources Load Error]', err);
        }
    },

    /** Attach input guards once the modal DOM is available */
    _attachGuards() {
        // Create modal guards
        attachNameGuard(document.getElementById('resName') || document.getElementById('resNameInput'));
        attachNumericGuard(document.getElementById('resTotal') || document.getElementById('resQuantityInput'), false);
        attachNumericGuard(document.getElementById('resPrice') || document.getElementById('resPriceInput'), true);
        // Edit modal guards
        attachNameGuard(document.getElementById('editResrcName'));
        attachNumericGuard(document.getElementById('editResrcTotal'), false);
        attachNumericGuard(document.getElementById('editResrcPrice'), true);
    },

    renderTable() {
        const tbody = document.getElementById('resourcesTableBody');
        if (!tbody) return;

        if (this.resources.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:24px; color:#d1d5d0;">No equipment or resources found in inventory.</td></tr>';
            return;
        }

        tbody.innerHTML = this.resources.map(r => {
            const available = Math.max(0, r.totalQuantity - (r.allocatedQuantity || 0));
            const statusClass = available === 0 ? 'danger' : (available < 5 ? 'warning' : 'success');
            return `
            <tr>
                <td><strong>#RES-${r.id}</strong></td>
                <td><strong>${Utils.escapeHtml(r.name)}</strong></td>
                <td><span class="badge" style="background:rgba(212, 175, 55, 0.15); color:#d1d5d0;"><i class="fa-solid fa-boxes-stacked"></i> ${Utils.escapeHtml(r.category || 'General')}</span></td>
                <td>${r.totalQuantity} units</td>
                <td><span style="color:#d97706; font-weight:700;">${r.allocatedQuantity || 0} allocated</span></td>
                <td><strong style="color:var(--text-gold); font-size:1.05rem;">${available} available</strong></td>
                <td><strong>${Utils.formatCurrency(r.unitPrice)}</strong></td>
                <td style="white-space:nowrap; text-align:center;">
                    <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" title="Edit Equipment" onclick="ResourcesComponent.openEditModal(${r.id})">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem; color:#dc2626;" title="Remove Equipment" onclick="ResourcesComponent.deleteResource(${r.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
            `;
        }).join('');
    },

    async handleSubmit(e) {
        if (e) e.preventDefault();

        const nameEl  = document.getElementById('resName') || document.getElementById('resNameInput');
        const catEl   = document.getElementById('resCat') || document.getElementById('resCategorySelect');
        const qtyEl   = document.getElementById('resTotal') || document.getElementById('resQuantityInput');
        const priceEl = document.getElementById('resPrice') || document.getElementById('resPriceInput');

        const name          = (nameEl?.value  || '').trim();
        const category      = (catEl?.value   || 'Audio Visual').trim();
        const totalQuantity = qtyEl?.value;
        const unitPrice     = priceEl?.value;

        // ── Equipment Name: letters only, no numbers, no symbols ──
        const nVal = validateEquipmentName(name);
        if (!nVal.valid) return FormValidator.markInvalid(nameEl, nVal.message);

        const cVal = FormValidator.validateText(category, 'Category', 2);
        if (!cVal.valid) return FormValidator.markInvalid(catEl, cVal.message);

        // ── Quantity: positive integer only ──
        const qVal = FormValidator.validateNumber(totalQuantity, 'Stock Quantity', 1, 10000, true);
        if (!qVal.valid) return FormValidator.markInvalid(qtyEl, qVal.message);
        if (parseInt(totalQuantity, 10) < 0) return FormValidator.markInvalid(qtyEl, 'Stock Quantity cannot be negative.');

        // ── Price: positive number only ──
        const pVal = FormValidator.validateNumber(unitPrice, 'Unit Rental Price (LKR)', 0);
        if (!pVal.valid) return FormValidator.markInvalid(priceEl, pVal.message);
        if (parseFloat(unitPrice) < 0) return FormValidator.markInvalid(priceEl, 'Unit Rental Price cannot be negative.');

        try {
            const res = await ApiService.resources.create({
                name,
                category,
                totalQuantity: parseInt(totalQuantity, 10),
                allocatedQuantity: 0,
                unitPrice: parseFloat(unitPrice),
                status: 'AVAILABLE'
            });

            if (res && res.success) {
                ModalManager.closeModal('resourceModal');
                ModalManager.closeModal('createResourceModal');
                NotificationManager.showToast('Equipment / Resource added to inventory successfully!');
                await this.load();
                if (window.EventsComponent) window.EventsComponent.populateDropdowns();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to add resource.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error adding resource.', true);
        }
    },

    openEditModal(id) {
        const resource = this.resources.find(r => r.id === id);
        if (!resource) return;

        const idEl     = document.getElementById('editResrcId');
        const nameEl   = document.getElementById('editResrcName');
        const catEl    = document.getElementById('editResrcCat');
        const totalEl  = document.getElementById('editResrcTotal');
        const priceEl  = document.getElementById('editResrcPrice');
        const statusEl = document.getElementById('editResrcStatus');

        if (idEl)     idEl.value     = resource.id;
        if (nameEl)   nameEl.value   = resource.name;
        if (catEl)    catEl.value    = resource.category;
        if (totalEl)  totalEl.value  = resource.totalQuantity;
        if (priceEl)  priceEl.value  = resource.unitPrice;
        if (statusEl) statusEl.value = resource.status || 'AVAILABLE';

        ModalManager.openModal('editResourceModal');

        // Attach guards after modal opens (DOM is now ready)
        setTimeout(() => {
            attachNameGuard(document.getElementById('editResrcName'));
            attachNumericGuard(document.getElementById('editResrcTotal'), false);
            attachNumericGuard(document.getElementById('editResrcPrice'), true);
        }, 100);
    },

    async handleEditSubmit(e) {
        if (e) e.preventDefault();

        const id       = document.getElementById('editResrcId')?.value;
        const nameEl   = document.getElementById('editResrcName');
        const catEl    = document.getElementById('editResrcCat');
        const totalEl  = document.getElementById('editResrcTotal');
        const priceEl  = document.getElementById('editResrcPrice');
        const statusEl = document.getElementById('editResrcStatus');

        const name          = (nameEl?.value  || '').trim();
        const category      = (catEl?.value   || '').trim();
        const totalQuantity = totalEl?.value;
        const unitPrice     = priceEl?.value;
        const status        = statusEl?.value || 'AVAILABLE';

        if (!id) {
            NotificationManager.showToast('Invalid equipment selected.', true);
            return;
        }

        // ── Equipment Name: letters only, no numbers, no symbols ──
        const nVal = validateEquipmentName(name);
        if (!nVal.valid) return FormValidator.markInvalid(nameEl, nVal.message);

        const cVal = FormValidator.validateText(category, 'Category', 2);
        if (!cVal.valid) return FormValidator.markInvalid(catEl, cVal.message);

        // ── Quantity: positive integer only ──
        const qVal = FormValidator.validateNumber(totalQuantity, 'Stock Quantity', 1, 10000, true);
        if (!qVal.valid) return FormValidator.markInvalid(totalEl, qVal.message);
        if (parseInt(totalQuantity, 10) < 0) return FormValidator.markInvalid(totalEl, 'Stock Quantity cannot be negative.');

        // ── Price: positive number only ──
        const pVal = FormValidator.validateNumber(unitPrice, 'Unit Rental Price (LKR)', 0);
        if (!pVal.valid) return FormValidator.markInvalid(priceEl, pVal.message);
        if (parseFloat(unitPrice) < 0) return FormValidator.markInvalid(priceEl, 'Unit Rental Price cannot be negative.');

        try {
            // ✅ Fix: pass id separately so API calls PUT /resources/{id}
            const res = await ApiService.resources.update(id, {
                name,
                category,
                totalQuantity: parseInt(totalQuantity, 10),
                unitPrice: parseFloat(unitPrice),
                status
            });

            if (res && res.success) {
                ModalManager.closeModal('editResourceModal');
                NotificationManager.showToast('Equipment inventory details updated successfully!');
                await this.load();
                if (window.EventsComponent) window.EventsComponent.populateDropdowns();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to update resource.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error updating resource.', true);
        }
    },

    async deleteResource(id) {
        if (!confirm('Are you sure you want to remove this equipment item from inventory?')) return;

        try {
            const res = await ApiService.resources.delete(id);
            if (res && res.success) {
                NotificationManager.showToast('Equipment removed from inventory successfully.');
                await this.load();
                if (window.EventsComponent) window.EventsComponent.populateDropdowns();
                if (window.DashboardComponent) window.DashboardComponent.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to delete resource.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error deleting resource.', true);
        }
    }
};

window.ResourcesComponent = ResourcesComponent;
window.handleResourceSubmit = ResourcesComponent.handleSubmit.bind(ResourcesComponent);
window.handleCreateResourceSubmit = ResourcesComponent.handleSubmit.bind(ResourcesComponent);
window.handleEditResourceSubmit = ResourcesComponent.handleEditSubmit.bind(ResourcesComponent);
