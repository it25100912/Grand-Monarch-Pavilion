/**
 * Centralized Modal Window Controller
 */

const ModalManager = {
    openModal(id) {
        if (id === 'venueModal' || id === 'createVenueModal') {
            if (window.EventsComponent && typeof window.EventsComponent.openCreateVenueModal === 'function') {
                window.EventsComponent.openCreateVenueModal();
                return;
            }
            id = 'evtVenueModal';
        }
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('open');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Ensure authentication forms are never prefilled with stale or cached credentials
            if (id === 'loginModal') {
                const form = document.getElementById('formLogin');
                if (form) form.reset();
                const u = document.getElementById('loginUsername');
                const p = document.getElementById('loginPassword');
                if (u) { u.value = ''; u.setAttribute('value', ''); }
                if (p) { p.value = ''; p.setAttribute('value', ''); }
                // Delay clear to catch late browser autofill injection
                setTimeout(() => {
                    if (u) u.value = '';
                    if (p) p.value = '';
                }, 60);
            } else if (id === 'registerModal') {
                const form = document.getElementById('formRegister');
                if (form) form.reset();
            }
            
            if (window.FormValidator && typeof window.FormValidator.enforceMinDates === 'function') {
                window.FormValidator.enforceMinDates();
            }

            // Auto focus on first input if available
            const firstInput = modal.querySelector('input:not([type=hidden]), select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    },

    closeModal(id) {
        if (id === 'venueModal' || id === 'createVenueModal') {
            id = 'evtVenueModal';
        }
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('open');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';

            if (id === 'loginModal') {
                const u = document.getElementById('loginUsername');
                const p = document.getElementById('loginPassword');
                if (u) u.value = '';
                if (p) p.value = '';
            }
        }
    }
};

// Global handlers for closing on backdrop click and Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open, .modal, .modal-backdrop').forEach(modal => {
            modal.classList.remove('open');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('open');
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

window.ModalManager = ModalManager;
window.openModal = ModalManager.openModal.bind(ModalManager);
window.closeModal = ModalManager.closeModal.bind(ModalManager);
