/**
 * Centralized REST API Client for Grand Monarch Luxury Dining & Event Platform.
 * Communicates with the Java backend (port 8080) and MySQL database.
 */

const API_BASE = 'http://localhost:8080/api';

const ApiService = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const authUser = localStorage.getItem('gm_auth_user');
        if (authUser) {
            try {
                const parsed = JSON.parse(authUser);
                if (parsed && parsed.token) {
                    headers['Authorization'] = `Bearer ${parsed.token}`;
                }
            } catch (e) {}
        }

        const config = {
            headers,
            ...options
        };

        try {
            const response = await fetch(url, config);
            const contentType = response.headers.get('content-type');
            let data = null;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                const errorMessage = (data && data.message) ? data.message : `HTTP error ${response.status}`;
                throw new Error(errorMessage);
            }

            return data;
        } catch (error) {
            console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error);
            throw error;
        }
    },

    // ----------------------------------------------------
    // Authentication Endpoints
    // ----------------------------------------------------
    auth: {
        login(username, password) {
            return ApiService.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
        },
        register(userData) {
            return ApiService.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
        }
    },

    // ----------------------------------------------------
    // Dashboard Endpoints
    // ----------------------------------------------------
    dashboard: {
        getStats() {
            return ApiService.request('/dashboard');
        }
    },

    // ----------------------------------------------------
    // User & Staff Management Endpoints
    // ----------------------------------------------------
    users: {
        getAll() {
            return ApiService.request('/users');
        },
        async getStaff() {
            const all = await this.getAll();
            return (all || []).filter(u => u.role !== 'CUSTOMER');
        },
        async getCustomers() {
            const all = await this.getAll();
            return (all || []).filter(u => u.role === 'CUSTOMER');
        },
        getById(id) {
            return ApiService.request(`/users/${id}`);
        },
        create(user) {
            return ApiService.request('/users', {
                method: 'POST',
                body: JSON.stringify(user)
            });
        },
        update(user) {
            return ApiService.request('/users', {
                method: 'PUT',
                body: JSON.stringify(user)
            });
        },
        updateStatus(id, status) {
            return ApiService.request(`/users/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
        },
        updateProfile(profileData) {
            return ApiService.request('/users/profile', {
                method: 'POST',
                body: JSON.stringify(profileData)
            });
        },
        changePassword(passData) {
            return ApiService.request('/users/change-password', {
                method: 'POST',
                body: JSON.stringify(passData)
            });
        },
        delete(id) {
            return ApiService.request(`/users/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // ----------------------------------------------------
    // Dining Tables & Reservations Endpoints
    // ----------------------------------------------------
    tables: {
        getAll(location = '', status = '') {
            let q = '';
            if (location && location !== 'ALL') q += `?location=${encodeURIComponent(location)}`;
            if (status && status !== 'ALL') q += (q ? '&' : '?') + `status=${encodeURIComponent(status)}`;
            return ApiService.request(`/tables${q}`);
        },
        getById(id) {
            return ApiService.request(`/tables/${id}`);
        },
        getDashboard() {
            return ApiService.request('/tables/dashboard');
        },
        create(table) {
            return ApiService.request('/tables', {
                method: 'POST',
                body: JSON.stringify(table)
            });
        },
        update(id, table) {
            return ApiService.request(`/tables/${id}`, {
                method: 'PUT',
                body: JSON.stringify(table)
            });
        },
        updateStatus(id, status) {
            return ApiService.request(`/tables/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
        },
        delete(id) {
            return ApiService.request(`/tables/${id}`, {
                method: 'DELETE'
            });
        }
    },

    reservations: {
        getAll() {
            return ApiService.request('/reservations');
        },
        getByCustomer(customerId) {
            return ApiService.request(`/reservations?customerId=${customerId}`);
        },
        getById(id) {
            return ApiService.request(`/reservations/${id}`);
        },
        create(reservation) {
            return ApiService.request('/reservations', {
                method: 'POST',
                body: JSON.stringify(reservation)
            });
        },
        update(reservation) {
            return ApiService.request('/reservations', {
                method: 'PUT',
                body: JSON.stringify(reservation)
            });
        },
        updateStatus(id, status) {
            return ApiService.request('/reservations', {
                method: 'PUT',
                body: JSON.stringify({ id, status })
            });
        },
        delete(id) {
            return ApiService.request(`/reservations/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // ----------------------------------------------------
    // Event Bookings Endpoints
    // ----------------------------------------------------
    events: {
        getAll() {
            return ApiService.request('/events');
        },
        getByCustomer(customerId) {
            return ApiService.request(`/events?customerId=${customerId}`);
        },
        getById(id) {
            return ApiService.request(`/events/${id}`);
        },
        getDashboard() {
            return ApiService.request('/events/dashboard');
        },
        create(event) {
            return ApiService.request('/events', {
                method: 'POST',
                body: JSON.stringify(event)
            });
        },
        update(idOrEvent, eventData) {
            const id = typeof idOrEvent === 'object' ? idOrEvent.id : idOrEvent;
            const body = typeof idOrEvent === 'object' ? idOrEvent : eventData;
            return ApiService.request(`/events/${id}`, {
                method: 'PUT',
                body: JSON.stringify(body)
            });
        },
        updateStatus(id, status) {
            return ApiService.request(`/events/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
        },
        delete(id) {
            return ApiService.request(`/events/${id}`, {
                method: 'DELETE'
            });
        },
        getStaff(eventId) {
            return ApiService.request(`/events/${eventId}/staff`);
        },
        assignStaff(eventId, data) {
            return ApiService.request(`/events/${eventId}/staff`, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        removeStaff(eventId, staffId) {
            return ApiService.request(`/events/${eventId}/staff/${staffId}`, {
                method: 'DELETE'
            });
        },
        getResources(eventId) {
            return ApiService.request(`/events/${eventId}/resources`);
        },
        allocateResource(eventId, data) {
            return ApiService.request(`/events/${eventId}/resources`, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        removeResource(eventId, resourceId) {
            return ApiService.request(`/events/${eventId}/resources/${resourceId}`, {
                method: 'DELETE'
            });
        }
    },

    // ----------------------------------------------------
    // Venues Endpoints
    // ----------------------------------------------------
    venues: {
        getAll() {
            return ApiService.request('/venues');
        },
        getById(id) {
            return ApiService.request(`/venues/${id}`);
        },
        getDashboard() {
            return ApiService.request('/venues/dashboard');
        },
        create(venue) {
            return ApiService.request('/venues', {
                method: 'POST',
                body: JSON.stringify(venue)
            });
        },
        update(idOrVenue, venueData) {
            const id = typeof idOrVenue === 'object' ? idOrVenue.id : idOrVenue;
            const body = typeof idOrVenue === 'object' ? idOrVenue : venueData;
            return ApiService.request(`/venues/${id}`, {
                method: 'PUT',
                body: JSON.stringify(body)
            });
        },
        delete(id) {
            return ApiService.request(`/venues/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // ----------------------------------------------------
    // Event Packages Endpoints
    // ----------------------------------------------------
    packages: {
        getAll(activeOnly = false) {
            return ApiService.request(activeOnly ? '/event-packages?activeOnly=true' : '/event-packages');
        },
        getById(id) {
            return ApiService.request(`/event-packages/${id}`);
        },
        create(pkg) {
            return ApiService.request('/event-packages', {
                method: 'POST',
                body: JSON.stringify(pkg)
            });
        },
        update(id, pkg) {
            return ApiService.request(`/event-packages/${id}`, {
                method: 'PUT',
                body: JSON.stringify(pkg)
            });
        },
        delete(id) {
            return ApiService.request(`/event-packages/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // ----------------------------------------------------
    // Resources & Inventory Endpoints
    // ----------------------------------------------------
    resources: {
        getAll() {
            return ApiService.request('/resources');
        },
        getById(id) {
            return ApiService.request(`/resources/${id}`);
        },
        create(resource) {
            return ApiService.request('/resources', {
                method: 'POST',
                body: JSON.stringify(resource)
            });
        },
        update(id, resource) {
            return ApiService.request(`/resources/${id}`, {
                method: 'PUT',
                body: JSON.stringify(resource)
            });
        },
        delete(id) {
            return ApiService.request(`/resources/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // ----------------------------------------------------
    // Billing, Invoices & Payments Endpoints
    // ----------------------------------------------------
    billing: {
        getInvoices(customerId = null) {
            return ApiService.request(customerId ? `/invoices?customerId=${customerId}` : '/invoices');
        },
        getInvoiceById(id) {
            return ApiService.request(`/invoices/${id}`);
        },
        createInvoice(invoice) {
            return ApiService.request('/invoices', {
                method: 'POST',
                body: JSON.stringify(invoice)
            });
        },
        updateInvoiceStatus(id, status) {
            return ApiService.request('/invoices', {
                method: 'PUT',
                body: JSON.stringify({ id, status })
            });
        },
        deleteInvoice(id) {
            return ApiService.request(`/invoices/${id}`, {
                method: 'DELETE'
            });
        },
        getPayments(customerId = null) {
            return ApiService.request(customerId ? `/payments?customerId=${customerId}` : '/payments');
        },
        getPendingVerification() {
            return ApiService.request('/payments/pending-verification');
        },
        recordPayment(payment) {
            return ApiService.request('/payments', {
                method: 'POST',
                body: JSON.stringify(payment)
            });
        },
        updatePaymentStatus(id, status) {
            return ApiService.request(`/payments/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
        },
        approvePayment(id, verifiedBy = 'Finance Officer') {
            return ApiService.request(`/payments/${id}/approve`, {
                method: 'POST',
                body: JSON.stringify({ verifiedBy })
            });
        },
        rejectPayment(id, reason, verifiedBy = 'Finance Officer') {
            return ApiService.request(`/payments/${id}/reject`, {
                method: 'POST',
                body: JSON.stringify({ reason, verifiedBy })
            });
        },
        processRefund(id, reason) {
            return ApiService.request(`/payments/${id}/refund`, {
                method: 'POST',
                body: JSON.stringify({ reason })
            });
        },
        deletePayment(id) {
            return ApiService.request(`/payments/${id}`, {
                method: 'DELETE'
            });
        },
        async getReceipts(customerId = null) {
            try {
                return await ApiService.request(customerId ? `/receipts?customerId=${customerId}` : '/receipts');
            } catch (err) {
                try {
                    return await ApiService.request(customerId ? `/billing/receipts?customerId=${customerId}` : '/billing/receipts');
                } catch (e2) {
                    return [];
                }
            }
        },
        async getReceiptById(id) {
            try {
                return await ApiService.request(`/receipts/${id}`);
            } catch (err) {
                try {
                    return await ApiService.request(`/billing/receipts/${id}`);
                } catch (e2) {
                    return null;
                }
            }
        },
        async getFinancialReports(period = 'monthly', startDate = '', endDate = '') {
            let q = `?period=${period}`;
            if (startDate) q += `&startDate=${startDate}`;
            if (endDate) q += `&endDate=${endDate}`;
            try {
                return await ApiService.request(`/reports/financial${q}`);
            } catch (err) {
                try {
                    return await ApiService.request(`/payments/reports${q}`);
                } catch (e2) {
                    try {
                        return await ApiService.request(`/billing/reports${q}`);
                    } catch (e3) {
                        return null;
                    }
                }
            }
        }
    },

    // ----------------------------------------------------
    // Gourmet Menu Endpoints
    // ----------------------------------------------------
    menu: {
        getAll() {
            return ApiService.request('/menu/items');
        },
        getById(id) {
            return ApiService.request(`/menu/items/${id}`);
        },
        create(item) {
            return ApiService.request('/menu/items', {
                method: 'POST',
                body: JSON.stringify(item)
            });
        },
        update(id, item) {
            return ApiService.request(`/menu/items/${id}`, {
                method: 'PUT',
                body: JSON.stringify(item)
            });
        },
        toggleAvailability(id, isAvailable) {
            return ApiService.request(`/menu/items/${id}/availability`, {
                method: 'PATCH',
                body: JSON.stringify({ isAvailable })
            });
        },
        delete(id) {
            return ApiService.request(`/menu/items/${id}`, {
                method: 'DELETE'
            });
        },
        // Category Methods
        getCategories(activeOnly = false) {
            return ApiService.request(`/menu/categories?activeOnly=${activeOnly}`);
        },
        getCategoryById(id) {
            return ApiService.request(`/menu/categories/${id}`);
        },
        createCategory(category) {
            return ApiService.request('/menu/categories', {
                method: 'POST',
                body: JSON.stringify(category)
            });
        },
        updateCategory(id, category) {
            return ApiService.request(`/menu/categories/${id}`, {
                method: 'PUT',
                body: JSON.stringify(category)
            });
        },
        deleteCategory(id) {
            return ApiService.request(`/menu/categories/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // ----------------------------------------------------
    // Operations & Branch Management Endpoints
    // ----------------------------------------------------
    operations: {
        getOverview() {
            return ApiService.request('/operations/overview');
        },
        getRestaurants(status = 'ALL', search = '') {
            let q = `?status=${encodeURIComponent(status)}`;
            if (search) q += `&search=${encodeURIComponent(search)}`;
            return ApiService.request(`/operations/restaurants${q}`);
        },
        getRestaurantById(id) {
            return ApiService.request(`/operations/restaurants/${id}`);
        },
        createRestaurant(data) {
            return ApiService.request('/operations/restaurants', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        updateRestaurant(id, data) {
            return ApiService.request(`/operations/restaurants/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        toggleRestaurantStatus(id) {
            return ApiService.request(`/operations/restaurants/${id}/status`, {
                method: 'PATCH'
            });
        },
        deleteRestaurant(id) {
            return ApiService.request(`/operations/restaurants/${id}`, {
                method: 'DELETE'
            });
        },
        getBranches(restaurantId = null, city = 'ALL', status = 'ALL') {
            let q = `?city=${encodeURIComponent(city)}&status=${encodeURIComponent(status)}`;
            if (restaurantId) q += `&restaurantId=${encodeURIComponent(restaurantId)}`;
            return ApiService.request(`/operations/branches${q}`);
        },
        getBranchById(id) {
            return ApiService.request(`/operations/branches/${id}`);
        },
        createBranch(data) {
            return ApiService.request('/operations/branches', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        updateBranch(id, data) {
            return ApiService.request(`/operations/branches/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        updateBranchStatus(id, status) {
            return ApiService.request(`/operations/branches/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
        },
        deleteBranch(id) {
            return ApiService.request(`/operations/branches/${id}`, {
                method: 'DELETE'
            });
        },
        getActivities() {
            return ApiService.request('/operations/activities');
        }
    },

    // ----------------------------------------------------
    // Dining Tables Endpoints
    // ----------------------------------------------------
    tables: {
        getAll(section = null, status = null) {
            let q = '';
            const params = [];
            if (section && section !== 'ALL') params.push(`section=${encodeURIComponent(section)}`);
            if (status && status !== 'ALL') params.push(`status=${encodeURIComponent(status)}`);
            if (params.length) q = '?' + params.join('&');
            return ApiService.request(`/tables${q}`);
        },
        getById(id) {
            return ApiService.request(`/tables/${id}`);
        },
        getDashboard() {
            return ApiService.request('/tables/dashboard');
        },
        create(data) {
            return ApiService.request('/tables', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        update(id, data) {
            return ApiService.request(`/tables/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        updateStatus(id, status) {
            return ApiService.request(`/tables/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
        },
        delete(id) {
            return ApiService.request(`/tables/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // ----------------------------------------------------
    // Staff Tasks & Shift Assignments Endpoints
    // ----------------------------------------------------
    tasks: {
        getAll(staffId = null, status = '', priority = '') {
            let q = '';
            if (staffId) q += `?staffId=${encodeURIComponent(staffId)}`;
            if (status) q += (q ? '&' : '?') + `status=${encodeURIComponent(status)}`;
            if (priority) q += (q ? '&' : '?') + `priority=${encodeURIComponent(priority)}`;
            return ApiService.request(`/tasks${q}`);
        },
        getById(id) {
            return ApiService.request(`/tasks/${id}`);
        },
        create(task) {
            return ApiService.request('/tasks', {
                method: 'POST',
                body: JSON.stringify(task)
            });
        },
        update(id, task) {
            return ApiService.request(`/tasks/${id}`, {
                method: 'PUT',
                body: JSON.stringify(task)
            });
        },
        updateStatus(id, status) {
            return ApiService.request(`/tasks/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
        },
        delete(id) {
            return ApiService.request(`/tasks/${id}`, {
                method: 'DELETE'
            });
        }
    }
};

window.ApiService = ApiService;
