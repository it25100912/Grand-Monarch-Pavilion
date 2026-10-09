/**
 * User & Staff Management Component
 * Complete CRUD for accounts, roles, staff rosters, duty task assignments, and permissions.
 */

const UsersComponent = {
    users: [],
    events: [],
    tasks: [],
    activeTab: 'staff',

    async load() {
        try {
            const [usersData, eventsData, tasksData] = await Promise.allSettled([
                ApiService.users.getAll(),
                ApiService.events.getAll(),
                ApiService.tasks.getAll()
            ]);
            this.users = usersData.status === 'fulfilled' && Array.isArray(usersData.value) ? usersData.value : [];
            this.events = eventsData.status === 'fulfilled' && Array.isArray(eventsData.value) ? eventsData.value : [];
            this.tasks = tasksData.status === 'fulfilled' && Array.isArray(tasksData.value) ? tasksData.value : [];

            this.renderStaffTable();
            this.updateTaskKPIs();
            this.renderTasksTable();
            this.renderCustomersTable();
            this.loadProfile();
        } catch (err) {
            console.error('[Users Load Error]', err);
        }
    },

    switchTab(tabName) {
        this.activeTab = tabName;
        const panelStaff = document.getElementById('panelStaffTable');
        const panelTasks = document.getElementById('panelStaffTasksTable');
        const panelCust = document.getElementById('panelCustomersTable');

        const btnStaff = document.getElementById('tabStaffBtn');
        const btnTasks = document.getElementById('tabStaffTasksBtn');
        const btnCust = document.getElementById('tabCustomerBtn');

        if (panelStaff) panelStaff.style.display = tabName === 'staff' ? 'block' : 'none';
        if (panelTasks) panelTasks.style.display = tabName === 'tasks' ? 'block' : 'none';
        if (panelCust) panelCust.style.display = tabName === 'customers' ? 'block' : 'none';

        if (btnStaff) btnStaff.className = tabName === 'staff' ? 'btn-primary' : 'btn-secondary';
        if (btnTasks) btnTasks.className = tabName === 'tasks' ? 'btn-primary' : 'btn-secondary';
        if (btnCust) btnCust.className = tabName === 'customers' ? 'btn-primary' : 'btn-secondary';

        if (tabName === 'tasks') {
            this.updateTaskKPIs();
            this.renderTasksTable();
        }
    },

    /* =========================================================================
       STAFF DIRECTORY & ROSTERS
       ========================================================================= */
    renderStaffTable() {
        const tbody = document.getElementById('staffTableBody');
        if (!tbody) return;

        const searchQuery = (document.getElementById('staffSearch')?.value || '').toLowerCase().trim();
        const branchFilter = document.getElementById('staffBranchFilter')?.value || 'ALL';
        const statusFilter = document.getElementById('staffStatusFilter')?.value || 'ALL';

        let staffList = this.users.filter(u => u.role !== 'CUSTOMER');

        if (branchFilter !== 'ALL') {
            staffList = staffList.filter(s => (s.branch || 'Colombo Flagship').toLowerCase() === branchFilter.toLowerCase());
        }
        if (statusFilter !== 'ALL') {
            staffList = staffList.filter(s => (s.status || 'ACTIVE').toUpperCase() === statusFilter.toUpperCase());
        }
        if (searchQuery) {
            staffList = staffList.filter(s => 
                (s.fullName && s.fullName.toLowerCase().includes(searchQuery)) ||
                (s.username && s.username.toLowerCase().includes(searchQuery)) ||
                (s.email && s.email.toLowerCase().includes(searchQuery)) ||
                (s.phone && s.phone.toLowerCase().includes(searchQuery)) ||
                (s.role && s.role.toLowerCase().includes(searchQuery)) ||
                (s.branch && s.branch.toLowerCase().includes(searchQuery))
            );
        }

        if (staffList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:28px; color:#d1d5d0;">No staff members match the selected filters.</td></tr>';
            return;
        }

        tbody.innerHTML = staffList.map(s => {
            const status = (s.status || 'ACTIVE').toUpperCase();

            // Status badge (Luxury dark emerald / amber / red) - compact & complete
            let statusBadge = '';
            if (status === 'ACTIVE') {
                statusBadge = '<span class="badge" style="display:inline-flex; align-items:center; gap:4px; padding:2px 7px; border-radius:10px; font-weight:700; font-size:0.68rem; background:rgba(34, 197, 94, 0.15); color:#4ade80; border:1px solid rgba(34, 197, 94, 0.3); white-space:nowrap;"><i class="fa-solid fa-circle-check" style="font-size:0.62rem;"></i> ACTIVE</span>';
            } else if (status === 'ON_LEAVE') {
                statusBadge = '<span class="badge" style="display:inline-flex; align-items:center; gap:4px; padding:2px 7px; border-radius:10px; font-weight:700; font-size:0.68rem; background:rgba(245, 158, 11, 0.15); color:#fbbf24; border:1px solid rgba(245, 158, 11, 0.3); white-space:nowrap;"><i class="fa-solid fa-mug-hot" style="font-size:0.62rem;"></i> LEAVE</span>';
            } else {
                statusBadge = '<span class="badge" style="display:inline-flex; align-items:center; gap:4px; padding:2px 7px; border-radius:10px; font-weight:700; font-size:0.68rem; background:rgba(239, 68, 68, 0.15); color:#f87171; border:1px solid rgba(239, 68, 68, 0.3); white-space:nowrap;"><i class="fa-solid fa-ban" style="font-size:0.62rem;"></i> INACTIVE</span>';
            }

            // Initials avatar
            const initials = (s.fullName || s.username || 'ST')
                .split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

            // Clean concise role
            let roleFormatted = (s.role || 'STAFF').replace(/_/g, ' ');
            if (s.role === 'OPERATIONS_SUPERVISOR') roleFormatted = 'Supervisor';
            else if (s.role === 'EVENT_COORDINATOR') roleFormatted = 'Coordinator';
            else if (s.role === 'FINANCE_OFFICER') roleFormatted = 'Finance';
            else if (s.role === 'CUSTOMER_SERVICE') roleFormatted = 'CSR';
            else if (s.role === 'ADMIN') roleFormatted = 'Admin';

            // Clean name (strip duplicate role suffix in parenthesis from database)
            const cleanName = (s.fullName || s.username || '').replace(/\s*\([^)]*\)/g, '').trim() || s.username;

            // Clean concise branch
            const branchRaw = (s.branch || 'Colombo Flagship').toLowerCase();
            let branchTitle = 'Colombo 07';
            if (branchRaw.includes('kandy')) branchTitle = 'Kandy';
            else if (branchRaw.includes('galle')) branchTitle = 'Galle Fort';
            else if (branchRaw.includes('negombo')) branchTitle = 'Negombo';

            // Clean concise shift
            const rawHours = s.workingHours || '08:30 AM - 05:30 PM';
            const hourMatch = rawHours.match(/^(.*?)(?:\s*\((.*?)\))?$/);
            const timeStr = (hourMatch && hourMatch[1]) ? hourMatch[1].trim() : rawHours;

            return `
            <tr>
                <td class="text-center" style="white-space:nowrap;"><span style="color:#d4af37; font-weight:700; font-size:0.75rem;">#${s.id}</span></td>
                <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg, #1b3b2b, #121816); border:1px solid #d4af37; color:var(--text-gold); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.72rem; flex-shrink:0;">
                            ${initials}
                        </div>
                        <div style="line-height:1.2;">
                            <strong style="color:#e6dfd5; font-size:0.84rem;">${Utils.escapeHtml(cleanName)}</strong><br>
                            <small style="color:#b0b8b4; font-size:0.7rem;">@${Utils.escapeHtml(s.username)}</small>
                        </div>
                    </div>
                </td>
                <td class="text-center" style="white-space:nowrap;">
                    <span class="badge" style="background:rgba(212, 175, 55, 0.12); color:#e6dfd5; border:1px solid rgba(212, 175, 55, 0.28); font-weight:700; font-size:0.68rem; padding:2px 7px; border-radius:6px;">
                        <i class="fa-solid fa-user-shield" style="color:var(--text-gold); font-size:0.65rem; margin-right:3px;"></i>${roleFormatted}
                    </span>
                </td>
                <td class="text-left" style="white-space:nowrap;">
                    <span style="font-weight:600; color:#e6dfd5; font-size:0.78rem;"><i class="fa-solid fa-location-dot" style="color:var(--text-gold); font-size:0.68rem; margin-right:3px;"></i>${Utils.escapeHtml(branchTitle)}</span>
                </td>
                <td class="text-left">
                    <div style="color:#e6dfd5; font-size:0.76rem; font-weight:500;">${Utils.escapeHtml(s.email || '-')}</div>
                    <small style="color:#b0b8b4; font-size:0.68rem;"><i class="fa-solid fa-phone" style="font-size:0.62rem; margin-right:2px;"></i>${Utils.escapeHtml(s.phone || '-')}</small>
                </td>
                <td class="text-center" style="white-space:nowrap;">
                    <span style="font-weight:600; font-size:0.75rem; color:#e6dfd5;"><i class="fa-regular fa-clock" style="color:var(--text-gold); font-size:0.68rem; margin-right:3px;"></i>${Utils.escapeHtml(timeStr)}</span>
                </td>
                <td class="text-center" style="white-space:nowrap; padding:4px 6px;">
                    ${statusBadge}
                </td>
                <td class="text-center" style="white-space:nowrap; padding:4px 6px;">
                    <div style="display:inline-flex; align-items:center; gap:3px;">
                        <button class="action-btn" style="background:rgba(212, 175, 55, 0.15); color:#d4af37; border:1px solid rgba(212, 175, 55, 0.3); padding:3px 6px; font-size:0.68rem;" onclick="UsersComponent.openEditUserModal(${s.id})" title="Edit Details">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        ${s.role === 'ADMIN' || s.username === 'admin' ? '' : `
                        <button class="action-btn" style="background:rgba(255, 255, 255, 0.06); color:${status === 'ACTIVE' ? '#fbbf24' : '#4ade80'}; border:1px solid rgba(255, 255, 255, 0.15); padding:3px 5px; font-size:0.68rem;" onclick="UsersComponent.toggleStatus(${s.id}, '${status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}')" title="${status === 'ACTIVE' ? 'Deactivate (Turn Off)' : 'Activate (Turn On)'}">
                            <i class="fa-solid fa-power-off"></i>
                        </button>
                        <button class="action-btn" style="background:rgba(239, 68, 68, 0.15); color:#f87171; border:1px solid rgba(239, 68, 68, 0.3); padding:3px 5px; font-size:0.68rem;" onclick="UsersComponent.deleteUser(${s.id})" title="Delete Staff Account">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        `}
                    </div>
                </td>
            </tr>
            `;
        }).join('');
    },

    /* =========================================================================
       STAFF DUTY TASKS & ASSIGNMENTS BOARD
       ========================================================================= */
    updateTaskKPIs() {
        const total = (this.tasks || []).length;
        const pending = (this.tasks || []).filter(t => (t.status || 'PENDING').toUpperCase() === 'PENDING').length;
        const inProgress = (this.tasks || []).filter(t => (t.status || '').toUpperCase() === 'IN_PROGRESS').length;
        const completed = (this.tasks || []).filter(t => (t.status || '').toUpperCase() === 'COMPLETED').length;

        const totEl = document.getElementById('kpiTotalTasks');
        const penEl = document.getElementById('kpiPendingTasks');
        const inpEl = document.getElementById('kpiInProgressTasks');
        const comEl = document.getElementById('kpiCompletedTasks');

        if (totEl) totEl.textContent = total;
        if (penEl) penEl.textContent = pending;
        if (inpEl) inpEl.textContent = inProgress;
        if (comEl) comEl.textContent = completed;
    },

    renderTasksTable() {
        const tbody = document.getElementById('staffTasksTableBody');
        if (!tbody) return;

        const searchQuery = (document.getElementById('taskSearch')?.value || '').toLowerCase().trim();
        const priorityFilter = document.getElementById('taskPriorityFilter')?.value || 'ALL';
        const statusFilter = document.getElementById('taskStatusFilter')?.value || 'ALL';

        let list = this.tasks || [];

        if (priorityFilter !== 'ALL') {
            list = list.filter(t => (t.priority || 'MEDIUM').toUpperCase() === priorityFilter.toUpperCase());
        }
        if (statusFilter !== 'ALL') {
            list = list.filter(t => (t.status || 'PENDING').toUpperCase() === statusFilter.toUpperCase());
        }
        if (searchQuery) {
            list = list.filter(t => 
                (t.title && t.title.toLowerCase().includes(searchQuery)) ||
                (t.staffName && t.staffName.toLowerCase().includes(searchQuery)) ||
                (t.bookingRef && t.bookingRef.toLowerCase().includes(searchQuery)) ||
                (t.description && t.description.toLowerCase().includes(searchQuery))
            );
        }

        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:28px; color:#d1d5d0;">No tasks found matching the criteria. Click "New Task" above to assign duties.</td></tr>';
            return;
        }

        tbody.innerHTML = list.map(t => {
            const priority = (t.priority || 'MEDIUM').toUpperCase();
            let prioBadge = '';
            if (priority === 'HIGH') {
                prioBadge = '<span class="badge" style="background:#fee2e2; color:#b91c1c; font-weight:700;"><i class="fa-solid fa-fire"></i> HIGH</span>';
            } else if (priority === 'LOW') {
                prioBadge = '<span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700;"><i class="fa-solid fa-circle-check"></i> LOW</span>';
            } else {
                prioBadge = '<span class="badge" style="background:#fef3c7; color:#b45309; font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> MEDIUM</span>';
            }

            const currentStatus = (t.status || 'PENDING').toUpperCase();

            return `
            <tr>
                <td class="text-center" style="white-space:nowrap;"><strong>#TSK-${t.id}</strong></td>
                <td>
                    <strong style="color:#e6dfd5; font-size:0.95rem;">${Utils.escapeHtml(t.title)}</strong>
                    ${t.description ? `<br><small style="color:#b0b8b4; line-height:1.4;">${Utils.escapeHtml(t.description)}</small>` : ''}
                </td>
                <td class="text-left" style="white-space:nowrap;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="width:28px; height:28px; border-radius:50%; background:rgba(212, 175, 55, 0.15); color:#d4af37; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700;">
                            <i class="fa-solid fa-user"></i>
                        </div>
                        <div>
                            <strong style="color:#e6dfd5;">${Utils.escapeHtml(t.staffName || 'Staff Member #' + t.staffId)}</strong>
                        </div>
                    </div>
                </td>
                <td class="text-center" style="white-space:nowrap;">
                    <span class="badge" style="background:#121816; border:1px solid rgba(212, 175, 55, 0.25); color:#e6dfd5; font-family:monospace; font-weight:700;">
                        ${Utils.escapeHtml(t.bookingRef || 'General Roster')}
                    </span>
                </td>
                <td class="text-center" style="white-space:nowrap;">
                    <span style="font-size:0.85rem; color:#d1d5d0;"><i class="fa-regular fa-calendar" style="color:var(--text-gold);"></i> ${t.dueDate ? Utils.formatDate(t.dueDate) : 'No Deadline'}</span>
                </td>
                <td class="text-center" style="white-space:nowrap;">
                    ${prioBadge}
                </td>
                <td class="text-center" style="white-space:nowrap;">
                    <select class="form-control" style="width:135px; padding:4px 8px; font-size:0.78rem; font-weight:700; border-radius:6px;" onchange="UsersComponent.quickUpdateTaskStatus(${t.id}, this.value)">
                        <option value="PENDING" ${currentStatus === 'PENDING' ? 'selected' : ''}>⏳ PENDING</option>
                        <option value="IN_PROGRESS" ${currentStatus === 'IN_PROGRESS' ? 'selected' : ''}>⚡ IN PROGRESS</option>
                        <option value="COMPLETED" ${currentStatus === 'COMPLETED' ? 'selected' : ''}>✅ COMPLETED</option>
                    </select>
                </td>
                <td class="text-center" style="white-space:nowrap;">
                    <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="UsersComponent.openEditTaskModal(${t.id})" title="Edit Task">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem; color:#dc2626;" onclick="UsersComponent.deleteTask(${t.id})" title="Delete Task">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
            `;
        }).join('');
    },

    openAddTaskModal(taskId = null) {
        const staffSelect = document.getElementById('taskStaffSelect');
        if (staffSelect) {
            const staffList = this.users.filter(u => u.role !== 'CUSTOMER');
            staffSelect.innerHTML = '<option value="">-- Choose Assigned Staff Member --</option>' +
                staffList.map(s => `
                    <option value="${s.id}">${Utils.escapeHtml(s.fullName || s.username)} (${(s.role || 'STAFF').replace(/_/g, ' ')}) - ${s.branch || 'Colombo'}</option>
                `).join('');
        }

        const titleEl = document.getElementById('staffTaskModalTitle');
        const form = document.getElementById('formStaffTask');
        if (form) form.reset();

        const formId = document.getElementById('taskFormId');
        if (formId) formId.value = '';

        const dueInput = document.getElementById('taskDueDate');
        if (dueInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(14, 0, 0, 0);
            dueInput.value = tomorrow.toISOString().slice(0, 16);
        }

        if (titleEl) {
            titleEl.innerHTML = '<i class="fa-solid fa-list-check" style="color:var(--text-gold);"></i> Create Staff Duty Task';
        }

        ModalManager.openModal('staffTaskModal');
    },

    openEditTaskModal(taskId) {
        const task = (this.tasks || []).find(t => t.id === taskId);
        if (!task) return;

        this.openAddTaskModal();

        const titleEl = document.getElementById('staffTaskModalTitle');
        if (titleEl) {
            titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color:var(--text-gold);"></i> Edit Staff Duty Task';
        }

        const formId = document.getElementById('taskFormId');
        const titleInput = document.getElementById('taskTitle');
        const descInput = document.getElementById('taskDescription');
        const staffSelect = document.getElementById('taskStaffSelect');
        const bookRefInput = document.getElementById('taskBookingRef');
        const prioSelect = document.getElementById('taskPriority');
        const dueInput = document.getElementById('taskDueDate');
        const statusSelect = document.getElementById('taskStatus');

        if (formId) formId.value = task.id;
        if (titleInput) titleInput.value = task.title || '';
        if (descInput) descInput.value = task.description || '';
        if (staffSelect) staffSelect.value = task.staffId || '';
        if (bookRefInput) bookRefInput.value = task.bookingRef || '';
        if (prioSelect) prioSelect.value = task.priority || 'MEDIUM';
        if (dueInput && task.dueDate) dueInput.value = task.dueDate.slice(0, 16);
        if (statusSelect) statusSelect.value = task.status || 'PENDING';
    },

    async handleTaskSubmit(e) {
        if (e) e.preventDefault();

        const formId = document.getElementById('taskFormId')?.value;
        const titleEl = document.getElementById('taskTitle');
        const descEl = document.getElementById('taskDescription');
        const staffSelect = document.getElementById('taskStaffSelect');
        const bookingRefEl = document.getElementById('taskBookingRef');
        const priority = document.getElementById('taskPriority')?.value || 'MEDIUM';
        const dueDateEl = document.getElementById('taskDueDate');
        const status = document.getElementById('taskStatus')?.value || 'PENDING';

        const title = (titleEl?.value || '').trim();
        const description = (descEl?.value || '').trim();
        const staffIdVal = staffSelect?.value;
        const bookingRef = (bookingRefEl?.value || '').trim();
        const dueDate = dueDateEl?.value;

        if (!staffIdVal) {
            return FormValidator.markInvalid(staffSelect, 'Please select an assigned staff member.');
        }

        const tVal = FormValidator.validateText(title, 'Task Title', 4);
        if (!tVal.valid) return FormValidator.markInvalid(titleEl, tVal.message);

        const dVal = FormValidator.validateText(description, 'Task Instructions', 5);
        if (!dVal.valid) return FormValidator.markInvalid(descEl, dVal.message);

        if (dueDate) {
            const dtVal = FormValidator.validateDate(dueDate.slice(0, 10), 'Task Deadline Date', false);
            if (!dtVal.valid) return FormValidator.markInvalid(dueDateEl, dtVal.message);
        }

        const staffId = parseInt(staffIdVal, 10);
        const taskPayload = {
            title,
            description,
            staffId,
            bookingRef,
            priority,
            dueDate,
            status
        };

        try {
            let res;
            if (formId && parseInt(formId, 10) > 0) {
                res = await ApiService.tasks.update(parseInt(formId, 10), taskPayload);
            } else {
                res = await ApiService.tasks.create(taskPayload);
            }

            if (res && res.success) {
                ModalManager.closeModal('staffTaskModal');
                NotificationManager.showToast(formId ? 'Task updated successfully!' : 'Staff task created and assigned!');
                NotificationManager.addNotification('Task Assigned', `Duty assigned: ${title}`, 'fa-list-check');
                const refreshedTasks = await ApiService.tasks.getAll();
                this.tasks = Array.isArray(refreshedTasks) ? refreshedTasks : [];
                this.updateTaskKPIs();
                this.renderTasksTable();
            } else {
                NotificationManager.showToast(res.message || 'Failed to save task.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error saving task.', true);
        }
    },

    async quickUpdateTaskStatus(taskId, newStatus) {
        try {
            const res = await ApiService.tasks.updateStatus(taskId, newStatus);
            if (res && res.success) {
                NotificationManager.showToast(`Task #TSK-${taskId} status updated to ${newStatus}`);
                const task = this.tasks.find(t => t.id === taskId);
                if (task) task.status = newStatus;
                this.updateTaskKPIs();
            } else {
                NotificationManager.showToast(res.message || 'Failed to update status.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error updating status.', true);
        }
    },

    async deleteTask(taskId) {
        if (!confirm(`Are you sure you want to delete task #TSK-${taskId}?`)) return;

        try {
            const res = await ApiService.tasks.delete(taskId);
            if (res && res.success) {
                NotificationManager.showToast('Task removed.');
                this.tasks = this.tasks.filter(t => t.id !== taskId);
                this.updateTaskKPIs();
                this.renderTasksTable();
            } else {
                NotificationManager.showToast(res.message || 'Failed to delete task.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error deleting task.', true);
        }
    },



    // ----------------------------------------------------
    // Admin Profile & Security
    // ----------------------------------------------------
    loadProfile() {
        const currentUser = AuthManager.currentUser || (this.users.length > 0 ? this.users.find(u => u.role === 'ADMIN') : null);
        if (!currentUser) return;

        const nameField = document.getElementById('profFullName');
        const emailField = document.getElementById('profEmail');
        const phoneField = document.getElementById('profPhone');
        const roleField = document.getElementById('profRole');
        const statusField = document.getElementById('profStatus');

        if (nameField) nameField.value = currentUser.fullName || currentUser.username || '';
        if (emailField) emailField.value = currentUser.email || '';
        if (phoneField) phoneField.value = currentUser.phone || '';
        if (roleField) roleField.value = currentUser.role || 'ADMIN';
        if (statusField) statusField.value = currentUser.status || 'ACTIVE';
    },

    async handleUpdateProfileSubmit(e) {
        if (e) e.preventDefault();

        const currentUser = AuthManager.currentUser || (this.users.length > 0 ? this.users.find(u => u.role === 'ADMIN') : null);
        if (!currentUser) {
            NotificationManager.showToast('User session not found.', true);
            return;
        }

        const fullNameEl = document.getElementById('profFullName');
        const emailEl = document.getElementById('profEmail');
        const phoneEl = document.getElementById('profPhone');

        const fullName = fullNameEl?.value.trim() || '';
        const email = emailEl?.value.trim() || '';
        const phone = phoneEl?.value.trim() || '';

        // Strict Person Name Validation (letters only, rejects numbers like 123)
        const fnVal = FormValidator.validateName(fullName, 'Full Name', 2);
        if (!fnVal.valid) return FormValidator.markInvalid(fullNameEl, fnVal.message);

        const emVal = FormValidator.validateEmail(email, 'Email Address');
        if (!emVal.valid) return FormValidator.markInvalid(emailEl, emVal.message);

        const phVal = FormValidator.validatePhone(phone, 'Phone Number');
        if (!phVal.valid) return FormValidator.markInvalid(phoneEl, phVal.message);

        try {
            const res = await ApiService.users.updateProfile({
                id: currentUser.id,
                fullName,
                email,
                phone: phVal.value
            });

            if (res && res.success) {
                NotificationManager.showToast('Personal profile updated successfully!');
                if (window.AuthManager && AuthManager.updateCurrentUser) {
                    AuthManager.updateCurrentUser({
                        fullName,
                        email,
                        phone: phVal.value
                    });
                } else {
                    currentUser.fullName = fullName;
                    currentUser.email = email;
                    currentUser.phone = phVal.value;
                    localStorage.setItem('gm_auth_user', JSON.stringify(currentUser));
                    const headerName = document.getElementById('currentUserName');
                    if (headerName) headerName.textContent = fullName;
                }

                await this.load();
            } else {
                NotificationManager.showToast(res.message || 'Failed to update profile.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error updating profile.', true);
        }
    },

    async handleChangePasswordSubmit(e) {
        if (e) e.preventDefault();

        const currentUser = AuthManager.currentUser || (this.users.length > 0 ? this.users.find(u => u.role === 'ADMIN') : null);
        if (!currentUser) {
            NotificationManager.showToast('User session not found.', true);
            return;
        }

        const currentPassEl = document.getElementById('passCurrent');
        const newPassEl = document.getElementById('passNew');
        const confirmPassEl = document.getElementById('passConfirm');

        const currentPassword = currentPassEl?.value || '';
        const newPassword = newPassEl?.value || '';
        const confirmPassword = confirmPassEl?.value || '';

        if (!currentPassword) {
            return FormValidator.markInvalid(currentPassEl, 'Please enter your current password.');
        }

        const pwVal = FormValidator.validatePassword(newPassword, 'New Password', 6);
        if (!pwVal.valid) return FormValidator.markInvalid(newPassEl, pwVal.message);

        if (newPassword !== confirmPassword) {
            return FormValidator.markInvalid(confirmPassEl, 'New passwords do not match. Please verify confirmation.');
        }

        if (newPassword === currentPassword) {
            return FormValidator.markInvalid(newPassEl, 'New password must be different from current password.');
        }

        try {
            const res = await ApiService.users.changePassword({
                id: currentUser.id,
                currentPassword,
                newPassword
            });

            if (res && res.success) {
                NotificationManager.showToast('Password changed successfully!');
                document.getElementById('formChangePassword')?.reset();
            } else {
                NotificationManager.showToast(res.message || 'Failed to change password. Please verify current password.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error changing password.', true);
        }
    },

    /* =========================================================================
       STAFF & USER MODAL HANDLERS AND CRUD
       ========================================================================= */
    openAddStaffModal(defaultRole = 'EVENT_COORDINATOR') {
        const form = document.getElementById('formUser');
        if (form) form.reset();

        const titleEl = document.getElementById('userModalTitle');
        if (titleEl) {
            titleEl.innerHTML = defaultRole === 'CUSTOMER' 
                ? '<i class="fa-solid fa-user-plus" style="color:var(--text-gold);"></i> Register Customer Account'
                : '<i class="fa-solid fa-user-plus" style="color:var(--text-gold);"></i> Add Staff Member';
        }

        const roleSelect = document.getElementById('uRole');
        if (roleSelect) {
            roleSelect.value = defaultRole;
        }

        ModalManager.openModal('userModal');
    },

    openRegisterModal(role = 'CUSTOMER') {
        this.openAddStaffModal(role);
    },

    openEditUserModal(userId) {
        const user = (this.users || []).find(u => u.id === userId);
        if (!user) return;

        const idEl = document.getElementById('editUserId');
        const nameEl = document.getElementById('editFullName');
        const emailEl = document.getElementById('editEmail');
        const phoneEl = document.getElementById('editPhone');
        const roleEl = document.getElementById('editRole');
        const branchEl = document.getElementById('editBranch');
        const hoursEl = document.getElementById('editWorkingHours');
        const statusEl = document.getElementById('editStatus');

        if (idEl) idEl.value = user.id;
        if (nameEl) nameEl.value = user.fullName || user.username || '';
        if (emailEl) emailEl.value = user.email || '';
        if (phoneEl) phoneEl.value = user.phone || '';
        if (roleEl) roleEl.value = user.role || 'EVENT_COORDINATOR';
        if (branchEl) branchEl.value = user.branch || 'Colombo Flagship';
        if (hoursEl) hoursEl.value = user.workingHours || '09:00 AM - 06:00 PM';
        if (statusEl) statusEl.value = user.status || 'ACTIVE';

        ModalManager.openModal('editUserModal');
    },

    async handleRegisterSubmit(e) {
        if (e) e.preventDefault();

        const fullNameEl = document.getElementById('uFullName');
        const usernameEl = document.getElementById('uUsername');
        const passwordEl = document.getElementById('uPassword');
        const emailEl = document.getElementById('uEmail');
        const phoneEl = document.getElementById('uPhone');
        const roleEl = document.getElementById('uRole');
        const branchEl = document.getElementById('uBranch');
        const hoursEl = document.getElementById('uWorkingHours');
        const statusEl = document.getElementById('uStatus');

        const fullName = (fullNameEl?.value || '').trim();
        const username = (usernameEl?.value || '').trim();
        const password = passwordEl?.value || '';
        const email = (emailEl?.value || '').trim();
        const phone = (phoneEl?.value || '').trim();
        const role = roleEl?.value || 'EVENT_COORDINATOR';
        const branch = branchEl?.value || 'Colombo Flagship';
        const workingHours = hoursEl?.value || '09:00 AM - 06:00 PM';
        const status = statusEl?.value || 'ACTIVE';

        if (window.FormValidator) {
            const fnVal = FormValidator.validateName(fullName, 'Full Name', 3);
            if (!fnVal.valid) return FormValidator.markInvalid(fullNameEl, fnVal.message);

            const unVal = FormValidator.validateUsername(username, 'Username');
            if (!unVal.valid) return FormValidator.markInvalid(usernameEl, unVal.message);

            const emVal = FormValidator.validateEmail(email, 'Email Address');
            if (!emVal.valid) return FormValidator.markInvalid(emailEl, emVal.message);

            const phVal = FormValidator.validatePhone(phone, 'Phone Number');
            if (!phVal.valid) return FormValidator.markInvalid(phoneEl, phVal.message);

            if (!password || password.length < 6) {
                return FormValidator.markInvalid(passwordEl, 'Password must be at least 6 characters.');
            }
        }

        try {
            const res = await ApiService.users.create({
                fullName,
                username,
                password,
                email,
                phone,
                role,
                branch,
                workingHours,
                status
            });

            if (res && (res.success || res.id)) {
                ModalManager.closeModal('userModal');
                NotificationManager.showToast('Account registered successfully!');
                await this.load();
            } else {
                NotificationManager.showToast((res && res.message) ? res.message : 'Failed to register account.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error registering account.', true);
        }
    },

    async handleEditSubmit(e) {
        if (e) e.preventDefault();
        const id = parseInt(document.getElementById('editUserId')?.value, 10);
        const fullNameEl = document.getElementById('editFullName');
        const emailEl = document.getElementById('editEmail');
        const phoneEl = document.getElementById('editPhone');
        const roleEl = document.getElementById('editRole');
        const branchEl = document.getElementById('editBranch');
        const hoursEl = document.getElementById('editWorkingHours');
        const statusEl = document.getElementById('editStatus');

        const fullName = (fullNameEl?.value || '').trim();
        const email = (emailEl?.value || '').trim();
        const phone = (phoneEl?.value || '').trim();
        const role = roleEl?.value || 'EVENT_COORDINATOR';
        const branch = branchEl?.value || 'Colombo Flagship';
        const workingHours = hoursEl?.value || '09:00 AM - 06:00 PM';
        const status = statusEl?.value || 'ACTIVE';

        if (window.FormValidator) {
            const fnVal = FormValidator.validateName(fullName, 'Full Name', 3);
            if (!fnVal.valid) return FormValidator.markInvalid(fullNameEl, fnVal.message);

            const emVal = FormValidator.validateEmail(email, 'Email Address');
            if (!emVal.valid) return FormValidator.markInvalid(emailEl, emVal.message);

            const phVal = FormValidator.validatePhone(phone, 'Phone Number');
            if (!phVal.valid) return FormValidator.markInvalid(phoneEl, phVal.message);
        }

        try {
            const res = await ApiService.users.update({
                id,
                fullName,
                email,
                phone,
                role,
                branch,
                workingHours,
                status
            });

            if (res && (res.success || res.id)) {
                ModalManager.closeModal('editUserModal');
                NotificationManager.showToast('Account details updated successfully!');
                await this.load();
            } else {
                NotificationManager.showToast((res && res.message) ? res.message : 'Failed to update account.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error updating account.', true);
        }
    },

    async toggleStatus(id, newStatus) {
        const target = (this.users || []).find(s => s.id === id);
        if (target && (target.role === 'ADMIN' || target.username === 'admin' || target.id === 1)) {
            NotificationManager.showToast('Administrator status cannot be modified.', true);
            return;
        }
        try {
            const res = await ApiService.users.updateStatus(id, newStatus);
            if (res && (res.success || res.id || res.message)) {
                NotificationManager.showToast(`Status updated to ${newStatus}`);
                await this.load();
            } else {
                NotificationManager.showToast((res && res.message) ? res.message : 'Failed to update status', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error updating status', true);
        }
    },

    async deleteUser(id) {
        const target = (this.users || []).find(s => s.id === id);
        if (target && (target.role === 'ADMIN' || target.username === 'admin' || target.id === 1)) {
            NotificationManager.showToast('Administrator account cannot be deleted.', true);
            return;
        }
        if (window.AuthManager && window.AuthManager.currentUser && window.AuthManager.currentUser.id === id) {
            NotificationManager.showToast('You cannot delete your own currently logged-in account.', true);
            return;
        }
        const name = target ? (target.fullName || target.username) : `#${id}`;
        if (!confirm(`Are you sure you want to delete account "${name}"? This action cannot be undone.`)) return;
        try {
            const res = await ApiService.users.delete(id);
            if (res && (res.success || res.status === 200 || res.message)) {
                NotificationManager.showToast('Account deleted successfully.');
                await this.load();
            } else {
                NotificationManager.showToast((res && res.message) ? res.message : 'Failed to delete account.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Error deleting account.', true);
        }
    },

    renderCustomersTable() {
        const tbody = document.getElementById('customersTableBody');
        if (!tbody) return;

        const searchQuery = (document.getElementById('custSearch')?.value || '').toLowerCase().trim();
        let custList = (this.users || []).filter(u => u.role === 'CUSTOMER');

        if (searchQuery) {
            custList = custList.filter(c => 
                (c.fullName && c.fullName.toLowerCase().includes(searchQuery)) ||
                (c.username && c.username.toLowerCase().includes(searchQuery)) ||
                (c.email && c.email.toLowerCase().includes(searchQuery)) ||
                (c.phone && c.phone.toLowerCase().includes(searchQuery))
            );
        }

        if (custList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:28px; color:#d1d5d0;">No customer accounts found matching criteria.</td></tr>';
            return;
        }

        tbody.innerHTML = custList.map(c => {
            const status = (c.status || 'ACTIVE').toUpperCase();
            const statusBadge = status === 'ACTIVE'
                ? '<span class="badge" style="display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:12px; font-weight:700; font-size:0.72rem; background:rgba(34, 197, 94, 0.16); color:#4ade80; border:1px solid rgba(34, 197, 94, 0.35); white-space:nowrap;"><i class="fa-solid fa-circle-check" style="font-size:0.7rem;"></i> ACTIVE</span>'
                : '<span class="badge" style="display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:12px; font-weight:700; font-size:0.72rem; background:rgba(239, 68, 68, 0.16); color:#f87171; border:1px solid rgba(239, 68, 68, 0.35); white-space:nowrap;"><i class="fa-solid fa-ban" style="font-size:0.7rem;"></i> INACTIVE</span>';

            return `
            <tr>
                <td class="text-center" style="white-space:nowrap;"><span style="color:#d4af37; font-weight:700; font-size:0.8rem;">#CST-${c.id}</span></td>
                <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg, #1b3b2b, #121816); border:1.5px solid #d4af37; color:var(--text-gold); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.75rem; flex-shrink:0;">
                            ${(c.fullName || c.username || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <strong style="color:#e6dfd5; font-size:0.88rem;">${Utils.escapeHtml(c.fullName || c.username)}</strong>
                        </div>
                    </div>
                </td>
                <td class="text-left" style="white-space:nowrap;">
                    <code style="color:var(--text-gold); font-weight:700;">@${Utils.escapeHtml(c.username)}</code>
                </td>
                <td class="text-left">
                    <span style="color:#e6dfd5; font-size:0.85rem;"><i class="fa-solid fa-envelope" style="color:var(--text-gold); font-size:0.75rem;"></i> ${Utils.escapeHtml(c.email || '-')}</span><br>
                    <small style="color:#b0b8b4;"><i class="fa-solid fa-phone" style="font-size:0.75rem;"></i> ${Utils.escapeHtml(c.phone || '-')}</small>
                </td>
                <td class="text-center" style="white-space:nowrap;">
                    <span class="badge" style="background:rgba(212, 175, 55, 0.15); color:#d4af37; border:1px solid rgba(212, 175, 55, 0.3); font-weight:700; font-size:0.75rem;">
                        <i class="fa-solid fa-crown"></i> VIP GUEST
                    </span>
                </td>
                <td class="text-center" style="white-space:nowrap;">
                    ${statusBadge}
                </td>
                <td class="text-center" style="white-space:nowrap;">
                    <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="UsersComponent.openEditUserModal(${c.id})" title="Edit Account">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem; color:#dc2626;" onclick="UsersComponent.deleteUser(${c.id})" title="Delete Account">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
            `;
        }).join('');
    }
};

window.UsersComponent = UsersComponent;
window.switchUserTab = (tab) => UsersComponent.switchTab(tab);
window.openAddStaffModal = () => UsersComponent.openAddStaffModal();
window.openAddTaskModal = (id) => UsersComponent.openAddTaskModal(id);
window.openEditTaskModal = (id) => UsersComponent.openEditTaskModal(id);
window.handleTaskSubmit = (e) => UsersComponent.handleTaskSubmit(e);
window.handleUserSubmit = (e) => UsersComponent.handleRegisterSubmit(e);
window.handleEditUserSubmit = (e) => UsersComponent.handleEditSubmit(e);
window.handleUpdateProfileSubmit = (e) => UsersComponent.handleUpdateProfileSubmit(e);
window.handleChangePasswordSubmit = (e) => UsersComponent.handleChangePasswordSubmit(e);
window.renderStaffAvailabilityTable = () => UsersComponent.renderStaffTable();
window.toggleUserStatus = (id, status) => UsersComponent.toggleStatus(id, status);
window.deleteUser = (id) => UsersComponent.deleteUser(id);
