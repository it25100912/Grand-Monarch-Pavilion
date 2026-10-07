/**
 * Navigation & Sidebar Component
 */

const NavigationManager = {
    currentSection: 'home',
    previousSection: null,

    showSection(sectionId, navElement = null, pushHistory = true) {
        if (sectionId === 'home') {
            this.goToHomePage(pushHistory);
            return;
        }

        // Push section change to browser history
        if (pushHistory && this.currentSection !== sectionId) {
            this.previousSection = this.currentSection;
            try {
                history.pushState({ section: sectionId, prev: this.currentSection }, '', '#' + sectionId);
            } catch (e) {
                console.warn('[Navigation History Warning]', e);
            }
        }

        // Hide all main section containers
        document.querySelectorAll('.page-section, .app-section').forEach(sec => {
            sec.style.display = 'none';
        });

        // Show target section
        const target = document.getElementById(`sec-${sectionId}`) || document.getElementById(sectionId);
        if (target) {
            target.style.display = 'block';
            this.currentSection = sectionId;
        }

        // When authenticated, show sidebar for management modules
        const sidebar = document.getElementById('appSidebar');
        if (sidebar && window.AuthManager && window.AuthManager.isLoggedIn) {
            sidebar.style.display = 'flex';
        }

        // Hide landing nav links in auth widget if open
        const authHomeNav = document.getElementById('authHomeNavLinks');
        if (authHomeNav) authHomeNav.style.display = 'none';

        // Update active class on sidebar nav items
        document.querySelectorAll('.sidebar .nav-item').forEach(item => {
            item.classList.remove('active');
        });

        if (navElement) {
            navElement.classList.add('active');
        } else {
            const defaultNav = document.querySelector(`.sidebar .nav-item[onclick*="'${sectionId}'"]`);
            if (defaultNav) defaultNav.classList.add('active');
        }

        // Scroll page to top of container
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Trigger component-specific reloads for all 12 modules
        if (sectionId === 'dashboard' && window.DashboardComponent) {
            window.DashboardComponent.load();
        } else if (sectionId === 'users' && window.UsersComponent) {
            window.UsersComponent.load();
        } else if (sectionId === 'reservations' && window.ReservationsComponent) {
            window.ReservationsComponent.load();
        } else if (sectionId === 'events' && window.EventsComponent) {
            window.EventsComponent.load();
        } else if (sectionId === 'venues' && window.VenuesComponent) {
            window.VenuesComponent.load();
        } else if (sectionId === 'resources' && window.ResourcesComponent) {
            window.ResourcesComponent.load();
        } else if (['payments', 'invoices', 'receipts'].includes(sectionId) && window.BillingComponent) {
            if (sectionId === 'invoices') window.BillingComponent.renderInvoicesTable();
            if (sectionId === 'receipts') window.BillingComponent.renderReceiptsTable();
            if (sectionId === 'payments') window.BillingComponent.renderPaymentsTable();
            window.BillingComponent.load();
        } else if (sectionId === 'reports' && window.BillingComponent) {
            window.BillingComponent.renderReportView();
            window.BillingComponent.load();
            if (window.BillingComponent.loadReports) window.BillingComponent.loadReports();
        } else if (sectionId === 'menu' && window.MenuComponent) {
            window.MenuComponent.load();
        } else if (sectionId === 'operations' && window.OperationsComponent) {
            window.OperationsComponent.load();
        } else if (sectionId === 'profile' && window.UsersComponent) {
            if (window.UsersComponent.loadProfile) window.UsersComponent.loadProfile();
        }
    },

    goToHomePage(pushHistory = true) {
        // Push home navigation to browser history
        if (pushHistory && this.currentSection !== 'home') {
            this.previousSection = this.currentSection;
            try {
                history.pushState({ section: 'home', prev: this.currentSection }, '', '#home');
            } catch (e) {
                console.warn('[Navigation History Warning]', e);
            }
        }

        document.querySelectorAll('.page-section, .app-section').forEach(sec => {
            sec.style.display = 'none';
        });

        const homeSec = document.getElementById('sec-home') || document.getElementById('sec-public-home');
        if (homeSec) {
            homeSec.style.display = 'block';
            this.currentSection = 'home';
        }

        // Hide sidebar on home landing page so the hero banner displays full width
        const sidebar = document.getElementById('appSidebar');
        if (sidebar) {
            sidebar.style.display = 'none';
        }

        // If authenticated and on home page, show landing nav links in auth widget
        if (window.AuthManager && window.AuthManager.isLoggedIn) {
            const authHomeNav = document.getElementById('authHomeNavLinks');
            if (authHomeNav) authHomeNav.style.display = 'flex';
        }

        document.querySelectorAll('.sidebar .nav-item').forEach(item => {
            item.classList.remove('active');
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Handle Browser Back and Forward button clicks seamlessly
window.addEventListener('popstate', (e) => {
    const state = e.state;
    const targetSection = (state && state.section) ? state.section : (window.location.hash.replace('#', '') || 'home');

    if (targetSection === 'home') {
        NavigationManager.goToHomePage(false);
    } else {
        if (!window.AuthManager || !window.AuthManager.isLoggedIn) {
            NavigationManager.goToHomePage(false);
        } else {
            NavigationManager.showSection(targetSection, null, false);
        }
    }
});

// Setup initial history state on load if not set
if (!history.state) {
    const initialSection = window.location.hash ? window.location.hash.replace('#', '') : 'home';
    try {
        history.replaceState({ section: initialSection, prev: null }, '', window.location.hash || '#home');
    } catch (e) {}
}

window.NavigationManager = NavigationManager;
window.showSection = NavigationManager.showSection.bind(NavigationManager);
window.goToHomePage = NavigationManager.goToHomePage.bind(NavigationManager);

