/**
 * Header Component
 */

const HeaderComponent = {
    init() {
        const liveClockEl = document.getElementById('liveClockHeader');
        if (liveClockEl) {
            Utils.startLiveClock('liveClockHeader');
        }
    },

    handleLogoClick() {
        if (window.NavigationManager && window.NavigationManager.goToHomePage) {
            window.NavigationManager.goToHomePage(true);
        } else if (window.goToHomePage) {
            window.goToHomePage(true);
        }
    }
};

window.HeaderComponent = HeaderComponent;
window.handleLogoClick = HeaderComponent.handleLogoClick.bind(HeaderComponent);
