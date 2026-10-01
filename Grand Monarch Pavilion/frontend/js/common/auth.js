/**
 * Authentication and User Session Manager
 */

const AuthManager = {
    isLoggedIn: false,
    currentUser: null,

    init() {
        this.checkSavedSession();
    },

    async checkSavedSession() {
        const saved = localStorage.getItem('gm_auth_user');
        if (saved) {
            try {
                const user = JSON.parse(saved);
                if (user && user.id) {
                    this.executeLogin(user, false);
                    // Silently sync latest user data from server to keep name, role, and avatar fresh
                    this.syncCurrentUserFromServer(user.id);
                    return;
                }
            } catch (e) {
                localStorage.removeItem('gm_auth_user');
            }
        }
        // Default to public view
        this.setPublicView();
    },

    async syncCurrentUserFromServer(userId) {
        try {
            const res = await ApiService.users.getById(userId);
            const userObj = (res && res.data) ? res.data : (res && res.id ? res : null);
            if (userObj && userObj.id) {
                this.updateCurrentUser(userObj);
            }
        } catch (err) {
            console.warn('[Session Sync Warning]', err);
        }
    },

    updateCurrentUser(updatedData) {
        if (!this.currentUser) return;
        this.currentUser = { ...this.currentUser, ...updatedData };
        localStorage.setItem('gm_auth_user', JSON.stringify(this.currentUser));

        // Update header user display
        const nameEl = document.getElementById('currentUserName');
        const roleEl = document.getElementById('currentUserRole');
        const avatarEl = document.getElementById('currentAvatar');

        const displayName = this.currentUser.fullName || this.currentUser.username || 'User';
        if (nameEl) nameEl.textContent = displayName;
        if (roleEl) {
            roleEl.textContent = this.currentUser.role;
            roleEl.style.display = 'block';
        }
        if (avatarEl) {
            avatarEl.textContent = displayName.trim().charAt(0).toUpperCase();
        }

        // Also update profile inputs if profile section is loaded
        const profName = document.getElementById('profFullName');
        const profEmail = document.getElementById('profEmail');
        const profPhone = document.getElementById('profPhone');
        if (profName && this.currentUser.fullName) profName.value = this.currentUser.fullName;
        if (profEmail && this.currentUser.email) profEmail.value = this.currentUser.email;
        if (profPhone && this.currentUser.phone) profPhone.value = this.currentUser.phone;

        if (window.ChatbotComponent && typeof window.ChatbotComponent.updateGreeting === 'function') {
            window.ChatbotComponent.updateGreeting();
        }
    },

    async handleLogin(e) {
        if (e) e.preventDefault();
        const usernameInput = document.getElementById('loginUsername');
        const passwordInput = document.getElementById('loginPassword');

        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        // Field validations
        if (!username) {
            return FormValidator.markInvalid(usernameInput, 'Please enter your @gmail.com email address.');
        }
        // Mandatory @gmail.com requirement (or registered staff username)
        if (!username.toLowerCase().endsWith('@gmail.com') && !['admin', 'coordinator', 'finance', 'supervisor', 'csr', 'sandaruwan', 'kamal', 'vihanga', 'kavindu', 'dinuka'].includes(username.toLowerCase())) {
            return FormValidator.markInvalid(usernameInput, 'Login username/email must be a valid @gmail.com address (e.g. yourname@gmail.com).');
        }
        if (!password) {
            return FormValidator.markInvalid(passwordInput, 'Please enter your account password.');
        }
        if (password.length < 6) {
            return FormValidator.markInvalid(passwordInput, 'Password must be at least 6 characters/digits.');
        }

        try {
            const res = await ApiService.auth.login(username, password);
            const user = (res && (res.user || res.data)) ? (res.user || res.data) : null;
            if (res && res.success && user) {
                this.executeLogin(user, true);
                ModalManager.closeModal('loginModal');
                NotificationManager.showToast(`Welcome back, ${user.fullName || user.username}!`);
                if (usernameInput) usernameInput.value = '';
                if (passwordInput) passwordInput.value = '';
            } else {
                NotificationManager.showToast((res && res.message) ? res.message : 'Invalid credentials. Please check your @gmail.com address and password.', true);
                FormValidator.markInvalid(passwordInput);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Failed to authenticate. Check server status.', true);
        }
    },

    async handleRegister(e) {
        if (e) e.preventDefault();
        const fullNameEl = document.getElementById('regFullName');
        const emailEl = document.getElementById('regEmail');
        const phoneEl = document.getElementById('regPhone');
        const usernameEl = document.getElementById('regUsername');
        const passwordEl = document.getElementById('regPassword');
        const confirmEl = document.getElementById('regConfirmPassword');

        const fullName = fullNameEl?.value.trim() || '';
        const email = emailEl?.value.trim() || '';
        const phone = phoneEl?.value.trim() || '';
        const username = usernameEl?.value.trim() || '';
        const password = passwordEl?.value || '';
        const confirmPassword = confirmEl?.value || '';
        const role = document.getElementById('regRole')?.value || 'CUSTOMER';

        // Strict Name validation - REJECTS NUMBERS (e.g. 123)
        const fnVal = FormValidator.validateName(fullName, 'Full Name', 2);
        if (!fnVal.valid) return FormValidator.markInvalid(fullNameEl, fnVal.message);

        const unVal = FormValidator.validateUsername(username, 'Username');
        if (!unVal.valid) return FormValidator.markInvalid(usernameEl, unVal.message);

        const phVal = FormValidator.validatePhone(phone, 'Phone Number');
        if (!phVal.valid) return FormValidator.markInvalid(phoneEl, phVal.message);

        // Mandatory @gmail.com Email validation
        const emVal = FormValidator.validateEmail(email, 'Email Address');
        if (!emVal.valid) return FormValidator.markInvalid(emailEl, emVal.message);

        // Minimum 6-character Password validation
        const pwVal = FormValidator.validatePassword(password, 'Password', 6);
        if (!pwVal.valid) return FormValidator.markInvalid(passwordEl, pwVal.message);

        if (password !== confirmPassword) {
            return FormValidator.markInvalid(confirmEl, 'Passwords do not match. Please re-enter confirm password.');
        }

        try {
            const res = await ApiService.auth.register({
                fullName,
                email,
                phone: phVal.value,
                username,
                password,
                role
            });

            const user = (res && (res.user || res.data)) ? (res.user || res.data) : null;
            if (res && res.success && user) {
                ModalManager.closeModal('registerModal');
                this.executeLogin(user, true);
                NotificationManager.showToast('Account registered successfully! Welcome to Grand Monarch.');
            } else {
                NotificationManager.showToast((res && res.message) ? res.message : 'Registration failed.', true);
            }
        } catch (err) {
            NotificationManager.showToast(err.message || 'Failed to register account.', true);
        }
    },

    executeLogin(user, saveToStorage = true) {
        this.isLoggedIn = true;
        this.currentUser = user;
        if (saveToStorage) {
            localStorage.setItem('gm_auth_user', JSON.stringify(user));
        }

        // Switch to authenticated UI
        document.body.classList.remove('public-view');
        document.body.classList.add('authenticated-view');

        const publicActions = document.getElementById('publicHeaderActions');
        const authWidget = document.getElementById('authHeaderWidget');
        const sidebar = document.getElementById('appSidebar');

        if (publicActions) publicActions.style.display = 'none';
        if (authWidget) authWidget.style.display = 'flex';
        if (sidebar) sidebar.style.display = 'flex';

        // Update header user display
        const nameEl = document.getElementById('currentUserName');
        const roleEl = document.getElementById('currentUserRole');
        const avatarEl = document.getElementById('currentAvatar');

        if (nameEl) nameEl.textContent = user.fullName || user.username;
        if (roleEl) {
            roleEl.textContent = user.role;
            roleEl.style.display = 'block';
        }
        if (avatarEl) {
            avatarEl.textContent = (user.fullName || user.username).charAt(0).toUpperCase();
        }

        // Apply role permissions to navigation
        this.applyRolePermissions(user.role);

        // Load section according to role
        if (window.NavigationManager) {
            window.NavigationManager.showSection('dashboard');
        }

        // Refresh live data
        if (window.App && window.App.refreshAllData) {
            window.App.refreshAllData();
        }

        if (window.ChatbotComponent && typeof window.ChatbotComponent.updateGreeting === 'function') {
            window.ChatbotComponent.updateGreeting();
        }
    },

    handleLogout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        localStorage.removeItem('gm_auth_user');

        this.setPublicView();
        NotificationManager.showToast('You have been signed out.');

        if (window.ChatbotComponent && typeof window.ChatbotComponent.updateGreeting === 'function') {
            window.ChatbotComponent.updateGreeting();
        }
    },

    setPublicView() {
        document.body.classList.remove('authenticated-view');
        document.body.classList.add('public-view');

        const publicActions = document.getElementById('publicHeaderActions');
        const authWidget = document.getElementById('authHeaderWidget');
        const sidebar = document.getElementById('appSidebar');

        if (publicActions) publicActions.style.display = 'flex';
        if (authWidget) authWidget.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';

        if (window.NavigationManager && window.NavigationManager.goToHomePage) {
            window.NavigationManager.goToHomePage();
        } else if (window.goToHomePage) {
            window.goToHomePage();
        }

        // Direct guarantee that all sub-sections are hidden and home page is visible
        document.querySelectorAll('.page-section, .app-section').forEach(sec => {
            sec.style.display = 'none';
        });
        const homeSec = document.getElementById('sec-home');
        if (homeSec) homeSec.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    applyRolePermissions(role) {
        const normalized = (role || 'CUSTOMER').toUpperCase();
        const isCustomer = normalized === 'CUSTOMER';

        const roleElements = {
            navUsers: ['ADMIN', 'OPERATIONS_SUPERVISOR'],
            navOperations: ['ADMIN', 'OPERATIONS_SUPERVISOR'],
            navReservations: ['ADMIN', 'OPERATIONS_SUPERVISOR', 'CUSTOMER_SERVICE', 'CUSTOMER'],
            navEvents: ['ADMIN', 'EVENT_COORDINATOR', 'CUSTOMER_SERVICE', 'CUSTOMER'],
            navPayments: ['ADMIN', 'FINANCE_OFFICER'],
            navInvoices: ['ADMIN', 'FINANCE_OFFICER', 'CUSTOMER'],
            navReceipts: ['ADMIN', 'FINANCE_OFFICER', 'CUSTOMER'],
            navVenues: ['ADMIN', 'EVENT_COORDINATOR', 'OPERATIONS_SUPERVISOR', 'CUSTOMER'],
            navResources: ['ADMIN', 'EVENT_COORDINATOR', 'OPERATIONS_SUPERVISOR'],
            navReports: ['ADMIN', 'FINANCE_OFFICER'],
            navMenu: ['ADMIN', 'OPERATIONS_SUPERVISOR', 'CUSTOMER_SERVICE', 'CUSTOMER'],
            navProfile: ['ADMIN', 'EVENT_COORDINATOR', 'FINANCE_OFFICER', 'OPERATIONS_SUPERVISOR', 'CUSTOMER_SERVICE', 'CUSTOMER']
        };

        for (const [navId, allowedRoles] of Object.entries(roleElements)) {
            const el = document.getElementById(navId);
            if (el) {
                el.style.display = allowedRoles.includes(normalized) ? 'flex' : 'none';
            }
        }

        const btnGenInv = document.getElementById('btnGenerateInvoice');
        if (btnGenInv) {
            btnGenInv.style.display = isCustomer ? 'none' : 'inline-flex';
        }

        // Dynamically adjust sidebar labels for Customer vs Staff
        const dashLink = document.getElementById('navDashboard');
        const resLink = document.getElementById('navReservations');
        const evtLink = document.getElementById('navEvents');
        const invLink = document.getElementById('navInvoices');
        const recLink = document.getElementById('navReceipts');
        const venLink = document.getElementById('navVenues');
        const menuLink = document.getElementById('navMenu');
        const profLink = document.getElementById('navProfile');

        if (isCustomer) {
            if (dashLink) dashLink.innerHTML = '<i class="fa-solid fa-crown" style="color:var(--text-gold);"></i> My VIP Portal';
            if (resLink) resLink.innerHTML = '<i class="fa-solid fa-chair"></i> My Reservations';
            if (evtLink) evtLink.innerHTML = '<i class="fa-solid fa-champagne-glasses"></i> My Event Bookings';
            if (invLink) invLink.innerHTML = '<i class="fa-solid fa-file-invoice-dollar"></i> My Invoices & Pay';
            if (recLink) recLink.innerHTML = '<i class="fa-solid fa-receipt"></i> Payment Receipts';
            if (venLink) venLink.innerHTML = '<i class="fa-solid fa-building-columns"></i> Luxury Venues';
            if (menuLink) menuLink.innerHTML = '<i class="fa-solid fa-utensils"></i> Gourmet Menu';
            if (profLink) profLink.innerHTML = '<i class="fa-solid fa-user-circle"></i> Profile & Preferences';
        } else {
            if (dashLink) dashLink.innerHTML = '<i class="fa-solid fa-chart-pie"></i> Executive Console';
            if (resLink) resLink.innerHTML = '<i class="fa-solid fa-chair"></i> Dining Reservations';
            if (evtLink) evtLink.innerHTML = '<i class="fa-solid fa-calendar-check"></i> Event Bookings';
            if (invLink) invLink.innerHTML = '<i class="fa-solid fa-file-invoice-dollar"></i> Invoices & Billing';
            if (recLink) recLink.innerHTML = '<i class="fa-solid fa-receipt"></i> Receipts & History';
            if (venLink) venLink.innerHTML = '<i class="fa-solid fa-building-columns"></i> Venue Management';
            if (menuLink) menuLink.innerHTML = '<i class="fa-solid fa-utensils"></i> Culinary Menu';
            if (profLink) profLink.innerHTML = '<i class="fa-solid fa-user-circle"></i> My Profile';
        }
    },

    handleBookingAuthGuard(modalId) {
        if (!this.isLoggedIn) {
            ModalManager.openModal('loginModal');
            NotificationManager.showToast('Please sign in or create an account to proceed with your booking.', false);
        } else {
            ModalManager.openModal(modalId);
        }
    }
};

window.AuthManager = AuthManager;
window.handleFormLogin = AuthManager.handleLogin.bind(AuthManager);
window.handleFormRegister = AuthManager.handleRegister.bind(AuthManager);
window.handleLogout = AuthManager.handleLogout.bind(AuthManager);
window.handleBookingAuthGuard = AuthManager.handleBookingAuthGuard.bind(AuthManager);
