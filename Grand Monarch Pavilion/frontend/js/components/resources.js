/**
 * Resources Component
 * Complete CRUD for AV equipment, lighting rigs, decor, and furniture inventory.
 */

const ResourcesComponent = {
    resources: [],

    async load() {
        try {
            const data = await ApiService.resources.getAll();
            this.resources = data || [];
            this.renderTable();
        } catch (err) {
            console.error('[Resources Load Error]', err);
        }
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

        const nameEl = document.getElementById('resName') || document.getElementById('resNameInput');
        const catEl = document.getElementById('resCat') || document.getElementById('resCategorySelect');
        const qtyEl = document.getElementById('resTotal') || document.getElementById('resQuantityInput');
        const priceEl = document.getElementById('resPrice') || document.getElementById('resPriceInput');

        const name = (nameEl?.value || '').trim();
        const category = (catEl?.value || 'Audio Visual').trim();
        const totalQuantity = qtyEl?.value;
        const unitPrice = priceEl?.value;

        const nVal = FormValidator.validateText(name, 'Equipment Name', 2);
        if (!nVal.valid) return FormValidator.markInvalid(nameEl, nVal.message);

        const cVal = FormValidator.validateText(category, 'Category', 2);
        if (!cVal.valid) return FormValidator.markInvalid(catEl, cVal.message);

        const qVal = FormValidator.validateNumber(totalQuantity, 'Stock Quantity', 1, 10000, true);
        if (!qVal.valid) return FormValidator.markInvalid(qtyEl, qVal.message);

        const pVal = FormValidator.validateNumber(unitPrice, 'Unit Rental Price (LKR)', 0);
        if (!pVal.valid) return FormValidator.markInvalid(priceEl, pVal.message);

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

        const idEl = document.getElementById('editResrcId');
        const nameEl = document.getElementById('editResrcName');
        const catEl = document.getElementById('editResrcCat');
        const totalEl = document.getElementById('editResrcTotal');
        const priceEl = document.getElementById('editResrcPrice');
        const statusEl = document.getElementById('editResrcStatus');

        if (idEl) idEl.value = resource.id;
        if (nameEl) nameEl.value = resource.name;
        if (catEl) catEl.value = resource.category;
        if (totalEl) totalEl.value = resource.totalQuantity;
        if (priceEl) priceEl.value = resource.unitPrice;
        if (statusEl) statusEl.value = resource.status || 'AVAILABLE';

        ModalManager.openModal('editResourceModal');
    },

    async handleEditSubmit(e) {
        if (e) e.preventDefault();

        const id = document.getElementById('editResrcId')?.value;
        const nameEl = document.getElementById('editResrcName');
        const catEl = document.getElementById('editResrcCat');
        const totalEl = document.getElementById('editResrcTotal');
        const priceEl = document.getElementById('editResrcPrice');
        const statusEl = document.getElementById('editResrcStatus');

        const name = (nameEl?.value || '').trim();
        const category = (catEl?.value || '').trim();
        const totalQuantity = totalEl?.value;
        const unitPrice = priceEl?.value;
        const status = statusEl?.value || 'AVAILABLE';

        if (!id) {
            NotificationManager.showToast('Invalid equipment selected.', true);
            return;
        }

        const nVal = FormValidator.validateText(name, 'Equipment Name', 2);
        if (!nVal.valid) return FormValidator.markInvalid(nameEl, nVal.message);

        const cVal = FormValidator.validateText(category, 'Category', 2);
        if (!cVal.valid) return FormValidator.markInvalid(catEl, cVal.message);

        const qVal = FormValidator.validateNumber(totalQuantity, 'Stock Quantity', 1, 10000, true);
        if (!qVal.valid) return FormValidator.markInvalid(totalEl, qVal.message);

        const pVal = FormValidator.validateNumber(unitPrice, 'Unit Rental Price (LKR)', 0);
        if (!pVal.valid) return FormValidator.markInvalid(priceEl, pVal.message);

        try {
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
