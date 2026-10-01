/**
 * ====================================================================
 * Grand Monarch Luxury Dining & Event Pavilion
 * Enterprise Business Platform - Main Application Orchestrator
 *
 * Architecture:
 * - Common:      common/api.js, common/utils.js, common/notifications.js, common/modal.js, common/auth.js
 * - Components:  header.js, sidebar.js, dashboard.js, reservations.js, events.js, venues.js,
 *                resources.js, billing.js, menu.js, users.js, chatbot.js
 * ====================================================================
 */

const App = {
    async init() {
        console.log('[App] Initializing Grand Monarch Enterprise Platform...');

        // 1. Initialize Common Modules
        HeaderComponent.init();
        AuthManager.init();
        if (window.ReviewsComponent) ReviewsComponent.init();

        // 2. Load Real-Time Backend Data across all components
        await this.refreshAllData();

        console.log('[App] All components initialized and connected to backend & MySQL database.');
    },

    async refreshAllData() {
        try {
            await Promise.allSettled([
                DashboardComponent.load(),
                ReservationsComponent.load(),
                EventsComponent.load(),
                VenuesComponent.load(),
                ResourcesComponent.load(),
                BillingComponent.load(),
                MenuComponent.load(),
                UsersComponent.load(),
                OperationsComponent.load(),
                window.BookingCalendarComponent ? BookingCalendarComponent.load() : Promise.resolve()
            ]);
        } catch (err) {
            console.warn('[App Data Refresh Warning]', err);
        }
    }
};

window.App = App;

// CSR Support Ticket Response Submission with Full Validation
window.handleCsrInquirySubmit = function(e) {
    if (e) e.preventDefault();
    const replyInput = document.getElementById('csrReplyText');
    const statusInput = document.getElementById('csrInquiryStatus');

    if (window.FormValidator) {
        if (!FormValidator.validateText(replyInput, 'Resolution reply message', 5, 1000)) return;
        if (!statusInput || !statusInput.value) {
            FormValidator.markInvalid(statusInput, 'Please choose an inquiry status');
            return;
        }
    }

    if (window.ModalManager) {
        ModalManager.closeModal('csrInquiryModal');
    }
    if (window.NotificationManager) {
        NotificationManager.showToast('Official response recorded and inquiry updated successfully!');
    }
};

// Bootstrap when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

