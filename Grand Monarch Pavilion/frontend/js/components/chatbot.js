/**
 * Chatbot Component
 * 24/7 Virtual Hospitality & Booking Concierge Assistant
 */

const ChatbotComponent = {
    isOpen: false,
    hasUserInteracted: false,

    init() {
        this.updateGreeting();
        // Listen for Esc key to close chat widget
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggleWindow(false);
            }
        });
    },

    /**
     * Resolve current logged-in user profile from AuthManager or localStorage
     */
    getLoggedInUser() {
        if (window.AuthManager && window.AuthManager.currentUser) {
            return window.AuthManager.currentUser;
        }
        try {
            const stored = localStorage.getItem('gm_auth_user') || localStorage.getItem('currentUser');
            if (stored) return JSON.parse(stored);
        } catch (e) {}
        return null;
    },

    /**
     * Generate the welcome greeting according to authentication state
     */
    getGreetingText() {
        const user = this.getLoggedInUser();
        if (user && (user.fullName || user.username)) {
            const displayName = (user.fullName || user.username).trim();
            return `Hello ${Utils.escapeHtml(displayName)}! Welcome to our hospitality portal. How can I assist you with your table reservations, events, or menus today?`;
        }
        return `Hello there! Welcome to our restaurant and event booking platform.`;
    },

    /**
     * Dynamically update the initial greeting in the chat window
     */
    updateGreeting() {
        const greetingEl = document.getElementById('chatInitialGreeting');
        const greetingText = this.getGreetingText();
        if (greetingEl) {
            greetingEl.style.background = '#ffffff';
            greetingEl.style.border = '1.5px solid #d4af37';
            greetingEl.style.color = '#121816';
            greetingEl.style.boxShadow = '0 4px 15px rgba(0,0,0,0.35)';
            greetingEl.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; font-weight:800; color:#1b3b2b; font-size:0.92rem;">
                    <span style="font-size:1.1rem;">👋</span> Welcome to Grand Monarch!
                </div>
                <div style="font-size:0.88rem; color:#121816; line-height:1.55; font-weight:600;">
                    ${greetingText}
                </div>
            `;
        }
    },

    /**
     * Toggle or set the chat popup window state
     */
    toggleWindow(forceState) {
        const win = document.getElementById('chatWidgetWindow') || document.getElementById('chatFloatingWindow');
        const badge = document.getElementById('chatFloatingBadge');
        if (!win) return;

        this.isOpen = typeof forceState === 'boolean' ? forceState : !this.isOpen;

        if (this.isOpen) {
            win.style.display = 'flex';
            if (badge) badge.style.display = 'none';
            // Always ensure the greeting reflects the latest user session
            if (!this.hasUserInteracted) {
                this.updateGreeting();
            }
            // Auto focus the input field
            setTimeout(() => {
                const input = document.getElementById('chatInputText');
                if (input) input.focus();
                this.scrollToBottom();
            }, 100);
        } else {
            win.style.display = 'none';
            if (badge) badge.style.display = 'flex';
        }
    },

    /**
     * Helper to send quick suggestion queries
     */
    sendQuickQuery(text) {
        const input = document.getElementById('chatInputText');
        if (input) {
            input.value = text;
        }
        this.handleQuery(text);
    },

    /**
     * Form submission handler
     */
    handleSubmit(e) {
        if (e) e.preventDefault();
        const input = document.getElementById('chatInputText');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        this.handleQuery(text);
    },

    /**
     * Process user query and generate response
     */
    handleQuery(userText) {
        const container = document.getElementById('chatMessageContainer');
        if (!container) return;

        this.hasUserInteracted = true;

        // Render User Message
        const userMsg = document.createElement('div');
        userMsg.style.display = 'flex';
        userMsg.style.justifyContent = 'flex-end';
        userMsg.innerHTML = `
            <div style="background:linear-gradient(135deg, #d4af37 0%, #f3e5ab 50%, #b8972e 100%); color:#121816; font-weight:700; border:1px solid #d4af37; border-radius:16px; border-bottom-right-radius:3px; padding:11px 16px; font-size:0.88rem; max-width:85%; box-shadow:0 4px 15px rgba(212,175,55,0.3); line-height:1.45;">
                ${Utils.escapeHtml(userText)}
            </div>
        `;
        container.appendChild(userMsg);
        this.scrollToBottom();

        // Render Typing Indicator
        const typingId = 'typing-' + Date.now();
        const typingMsg = document.createElement('div');
        typingMsg.id = typingId;
        typingMsg.style.display = 'flex';
        typingMsg.style.gap = '10px';
        typingMsg.style.maxWidth = '88%';
        typingMsg.innerHTML = `
            <img src="/images/chef_bot_avatar.png?v=3" alt="AI Chef Assistant" style="width:34px; height:34px; border-radius:50%; object-fit:cover; border:2px solid #d4af37; flex-shrink:0; align-self:flex-end; box-shadow:0 2px 8px rgba(212,175,55,0.35);">
            <div style="background:#ffffff; border:1.5px solid #d4af37; border-radius:16px; border-bottom-left-radius:3px; padding:11px 16px; font-size:0.85rem; color:#121816; font-weight:600; font-style:italic; display:flex; align-items:center; gap:8px; box-shadow:0 4px 15px rgba(0,0,0,0.25);">
                <i class="fa-solid fa-circle-notch fa-spin" style="color:#d4af37;"></i> AI Chef is thinking...
            </div>
        `;
        container.appendChild(typingMsg);
        this.scrollToBottom();

        // Respond after realistic delay
        setTimeout(() => {
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.remove();

            const replyHtml = this.generateReply(userText);
            const botMsg = document.createElement('div');
            botMsg.style.display = 'flex';
            botMsg.style.gap = '10px';
            botMsg.style.maxWidth = '92%';
            botMsg.innerHTML = `
                <img src="/images/chef_bot_avatar.png?v=3" alt="AI Chef Assistant" style="width:34px; height:34px; border-radius:50%; object-fit:cover; border:2px solid #d4af37; flex-shrink:0; align-self:flex-end; box-shadow:0 2px 8px rgba(212,175,55,0.35);">
                <div style="background:#ffffff; border:1.5px solid #d4af37; border-radius:16px; border-bottom-left-radius:3px; padding:14px 16px; font-size:0.88rem; color:#121816; line-height:1.55; box-shadow:0 4px 15px rgba(0,0,0,0.35); font-weight:500;">
                    ${replyHtml}
                </div>
            `;
            container.appendChild(botMsg);
            this.scrollToBottom();
        }, 400);
    },

    scrollToBottom() {
        const container = document.getElementById('chatMessageContainer');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    },

    /**
     * Knowledge Base Matching Engine
     * Trained with hospitality knowledge base + fallback for irrelevant questions
     */
    generateReply(rawInput) {
        const text = (rawInput || '').trim();
        const q = text.toLowerCase().replace(/[?!.,'"“”‘’()\-]/g, ' ').replace(/\s+/g, ' ').trim();

        // -------------------------------------------------------------
        // Q1: How can I book a table? / Table reservation kohomada karanne?
        // -------------------------------------------------------------
        const isTableBooking = 
            q.includes('how can i book a table') ||
            q.includes('table reservation kohomada karanne') ||
            q.includes('how to book a table') ||
            q.includes('book a table') ||
            q.includes('reserve a table') ||
            q.includes('table booking') ||
            q.includes('table reservation') ||
            q.includes('reserve table') ||
            q.includes('book table') ||
            q.includes('dining reservation') ||
            q.includes('dining booking') ||
            q.includes('table ekak book') ||
            (q.includes('table') && (q.includes('book') || q.includes('reserve') || q.includes('kohomada')));

        // -------------------------------------------------------------
        // Q5: Can I modify or cancel my reservation? / Mage booking eka wenas karaganna puluwanda?
        // (Checked before general booking so modify/cancel gets higher priority)
        // -------------------------------------------------------------
        const isModifyCancel =
            q.includes('can i modify or cancel my reservation') ||
            q.includes('mage booking eka wenas karaganna puluwanda') ||
            q.includes('modify or cancel') ||
            q.includes('cancel reservation') ||
            q.includes('modify reservation') ||
            q.includes('cancel my reservation') ||
            q.includes('cancel booking') ||
            q.includes('modify booking') ||
            q.includes('edit reservation') ||
            q.includes('change reservation') ||
            q.includes('reschedule') ||
            q.includes('booking eka wenas') ||
            q.includes('wenas karaganna') ||
            (q.includes('booking') && (q.includes('cancel') || q.includes('modify') || q.includes('change') || q.includes('wenas')));

        if (isModifyCancel) {
            return `Yes, you can view your upcoming reservations in your Customer Dashboard and modify or cancel them according to our booking policy.<br><br>
                <button type="button" class="btn-secondary" style="padding:5px 10px; font-size:0.75rem;" onclick="if(window.NavigationManager){NavigationManager.showSection('reservations');} toggleChatbotWindow(false);">
                    <i class="fa-regular fa-calendar-check"></i> View My Reservations
                </button>`;
        }

        if (isTableBooking) {
            return `You can easily reserve a table by navigating to the 'Restaurants' or 'Table Booking' section, selecting your preferred date, time, and guest count, and choosing an available table.<br><br>
                <button type="button" class="btn-primary" style="padding:6px 12px; font-size:0.75rem;" onclick="if(window.AuthManager){AuthManager.handleBookingAuthGuard('bookTableModal');} toggleChatbotWindow(false);">
                    <i class="fa-solid fa-utensils"></i> Reserve a Table Now
                </button>`;
        }

        // -------------------------------------------------------------
        // Q2: What are your operating hours? / Open karala thiyenne mokawage welawakd?
        // -------------------------------------------------------------
        const isOperatingHours =
            q.includes('what are your operating hours') ||
            q.includes('open karala thiyenne mokawage welawakd') ||
            q.includes('operating hours') ||
            q.includes('opening hours') ||
            q.includes('open hours') ||
            q.includes('when are you open') ||
            q.includes('what time do you open') ||
            q.includes('closing time') ||
            q.includes('open karala') ||
            q.includes('mokawage welawakd') ||
            (q.includes('hours') && (q.includes('open') || q.includes('operating') || q.includes('service') || q.includes('restaurant')));

        if (isOperatingHours) {
            return `Our restaurants and booking services are generally open from 10:00 AM to 11:00 PM daily. You can also check specific branch timings on our Restaurant Details page.`;
        }

        // -------------------------------------------------------------
        // Q3: How do event bookings work? / Events book karanne kohomada?
        // -------------------------------------------------------------
        const isEventBooking =
            q.includes('how do event bookings work') ||
            q.includes('events book karanne kohomada') ||
            q.includes('event bookings work') ||
            q.includes('how to book an event') ||
            q.includes('book an event') ||
            q.includes('event booking') ||
            q.includes('event bookings') ||
            q.includes('events book') ||
            q.includes('wedding booking') ||
            q.includes('hall booking') ||
            q.includes('venue booking') ||
            q.includes('banquet booking') ||
            q.includes('party booking') ||
            q.includes('event ekak book') ||
            (q.includes('event') && (q.includes('book') || q.includes('venue') || q.includes('package') || q.includes('kohomada')));

        if (isEventBooking) {
            return `Go to the 'Events' page, select your event type (Weddings, Corporate, Birthdays, etc.), choose a venue and a package (Basic, Premium, Luxury), pick your date, and submit your booking request for manager approval.<br><br>
                <button type="button" class="btn-primary" style="padding:6px 12px; font-size:0.75rem;" onclick="if(window.AuthManager){AuthManager.handleBookingAuthGuard('bookEventModal');} toggleChatbotWindow(false);">
                    <i class="fa-solid fa-champagne-glasses"></i> Book Event Venue
                </button>`;
        }

        // -------------------------------------------------------------
        // Q4: What is the payment method? / Payments karanne kohomada?
        // -------------------------------------------------------------
        const isPaymentMethod =
            q.includes('what is the payment method') ||
            q.includes('payments karanne kohomada') ||
            q.includes('payment method') ||
            q.includes('payment methods') ||
            q.includes('how to pay') ||
            q.includes('how can i pay') ||
            q.includes('payment karanne kohomada') ||
            q.includes('salli gewanne kohomada') ||
            q.includes('bank transfer') ||
            q.includes('deposit slip') ||
            q.includes('transfer slip') ||
            q.includes('receipt upload') ||
            (q.includes('payment') || q.includes('payments') || q.includes('gewanne'));

        if (isPaymentMethod) {
            return `We use a secure manual bank transfer system. During checkout, you can upload your bank deposit or transfer slip, which our finance team will verify and approve.`;
        }

        // -------------------------------------------------------------
        // Q6: What food items are available in the menu? / Menu eke mokada tiyenne?
        // -------------------------------------------------------------
        const isMenuFood =
            q.includes('what food items are available in the menu') ||
            q.includes('menu eke mokada tiyenne') ||
            q.includes('what food items are available') ||
            q.includes('food items are available in the menu') ||
            q.includes('food items') ||
            q.includes('available in the menu') ||
            q.includes('what is on the menu') ||
            q.includes('food menu') ||
            q.includes('view menu') ||
            q.includes('menu eka') ||
            q.includes('kema monawada') ||
            q.includes('kaama monawada') ||
            q.includes('dishes') ||
            q.includes('cuisines') ||
            (q.includes('menu') && (q.includes('food') || q.includes('item') || q.includes('dish') || q.includes('tiyenne') || q.includes('available') || q.includes('view') || q.includes('show'))) ||
            q === 'menu' ||
            q === 'food';

        if (isMenuFood) {
            return `We offer a wide range of categories including Starters, Main Courses, Rice & Noodles, Desserts, and Beverages, featuring items like Grilled Chicken Steak, Seafood Nasi Goreng, and Chocolate Brownies.<br><br>
                <button type="button" class="btn-secondary" style="padding:5px 10px; font-size:0.75rem;" onclick="if(window.NavigationManager){NavigationManager.showSection('menu');} toggleChatbotWindow(false);">
                    <i class="fa-solid fa-book-open"></i> Browse Gourmet Menu
                </button>`;
        }

        // -------------------------------------------------------------
        // Friendly Greetings
        // -------------------------------------------------------------
        const isGreeting = 
            q === 'hi' || q === 'hello' || q === 'hey' || q === 'ayubowan' || 
            q === 'good morning' || q === 'good afternoon' || q === 'good evening' ||
            q === 'greetings' || q === 'vanakkam' || q === 'halo';

        if (isGreeting) {
            const user = this.getLoggedInUser();
            if (user && (user.fullName || user.username)) {
                return `Hello ${Utils.escapeHtml((user.fullName || user.username).trim())}! How can I assist you with your table reservations, events, or menus today?`;
            }
            return `Hello there! Welcome to our restaurant and event booking platform. How can I assist you with table reservations, event venues, menus, or payments today?`;
        }

        // -------------------------------------------------------------
        // Exact Fallback for Irrelevant Questions
        // -------------------------------------------------------------
        return `I am your hospitality and booking assistant. I can only help you with restaurant tables, event venues, menus, reservations, and payments on our website. Please ask me something related to our services!`;
    }
};

window.ChatbotComponent = ChatbotComponent;
window.toggleChatbotWindow = ChatbotComponent.toggleWindow.bind(ChatbotComponent);
window.sendQuickChatQuery = ChatbotComponent.sendQuickQuery.bind(ChatbotComponent);
window.handleChatSubmit = ChatbotComponent.handleSubmit.bind(ChatbotComponent);

// Auto initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ChatbotComponent.init());
} else {
    ChatbotComponent.init();
}
