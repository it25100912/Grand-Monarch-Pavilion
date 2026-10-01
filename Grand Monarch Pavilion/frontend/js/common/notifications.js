/**
 * Notification & Toast Alerts System
 */

const NotificationManager = {
    notifications: [
        { id: 1, title: 'Welcome to Grand Monarch', message: 'Explore our luxury dining tables and grand ballrooms.', date: 'Just now', type: 'GENERAL', icon: 'fa-crown' }
    ],

    showToast(message, isError = false) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'toast-error' : 'toast-success'}`;
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '10px';
        toast.style.padding = '12px 18px';
        toast.style.borderRadius = '8px';
        toast.style.marginTop = '10px';
        toast.style.color = '#ffffff';
        toast.style.background = isError ? '#dc2626' : '#16a34a';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        toast.style.fontSize = '0.9rem';
        toast.style.fontWeight = '600';
        toast.style.transition = 'all 0.3s ease';

        toast.innerHTML = `
            <i class="fa-solid ${isError ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i>
            <span>${Utils.escapeHtml(message)}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    addNotification(title, message, icon = 'fa-bell', type = 'SYSTEM') {
        const item = {
            id: Date.now(),
            title,
            message,
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            icon,
            type
        };
        this.notifications.unshift(item);
        this.updateBadge();
        this.renderDropdown();
    },

    updateBadge() {
        const badge = document.getElementById('headerNotifBadge');
        const count = this.notifications.length;
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
        const notifDropdownCount = document.getElementById('notifDropdownCount');
        if (notifDropdownCount) {
            notifDropdownCount.textContent = `${count} New`;
        }
    },

    renderDropdown() {
        const container = document.getElementById('notifDropdownItems');
        if (!container) return;

        if (this.notifications.length === 0) {
            container.innerHTML = '<div style="padding:15px; text-align:center; color:#d1d5d0; font-size:0.85rem;">No new notifications.</div>';
            return;
        }

        container.innerHTML = this.notifications.map(n => `
            <div style="padding:10px; border-bottom:1px solid rgba(212, 175, 55, 0.2); display:flex; gap:10px; align-items:start;">
                <div style="width:32px; height:32px; border-radius:50%; background:rgba(212,175,55,0.15); color:var(--text-gold, #b8860b); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                    <i class="fa-solid ${n.icon}"></i>
                </div>
                <div style="flex:1;">
                    <div style="font-weight:700; font-size:0.85rem; color:#e6dfd5;">${Utils.escapeHtml(n.title)}</div>
                    <div style="font-size:0.78rem; color:#b0b8b4; margin-top:2px;">${Utils.escapeHtml(n.message)}</div>
                    <div style="font-size:0.7rem; color:#d1d5d0; margin-top:4px;">${n.date}</div>
                </div>
            </div>
        `).join('');
    },

    toggleDropdown(e) {
        if (e) e.stopPropagation();
        const popup = document.getElementById('notifDropdownPopup');
        if (!popup) return;
        const isShown = popup.style.display === 'block';
        popup.style.display = isShown ? 'none' : 'block';
        if (!isShown) {
            this.renderDropdown();
        }
    }
};

// Global click listener to close notification dropdown when clicking outside
document.addEventListener('click', (e) => {
    const popup = document.getElementById('notifDropdownPopup');
    const btn = document.getElementById('btnHeaderNotif');
    if (popup && popup.style.display === 'block') {
        if (btn && !btn.contains(e.target) && !popup.contains(e.target)) {
            popup.style.display = 'none';
        }
    }
});

window.NotificationManager = NotificationManager;
window.showToast = NotificationManager.showToast.bind(NotificationManager);
window.toggleNotifDropdown = NotificationManager.toggleDropdown.bind(NotificationManager);
window.updateHeaderNotifBadge = NotificationManager.updateBadge.bind(NotificationManager);
