/**
 * Reviews & Customer Experience Component
 * Manages VIP client testimonials, reviews submission, and customer favorites.
 */

const ReviewsComponent = {
    selectedRating: 5,

    defaultReviews: [
        {
            id: 1,
            author: "Sandaruwan & Dulanjee",
            role: "Wedding Reception",
            rating: 5,
            comment: "Grand Monarch hosted our wedding reception in the Royal Ballroom. The venue arrangement, catering, and online booking management were absolutely flawless!",
            date: "September 2026"
        },
        {
            id: 2,
            author: "Kamal Perera",
            role: "Corporate Event Director",
            rating: 5,
            comment: "The executive VIP suite was perfect for our corporate board dinner. Seamless invoicing, instant status tracking, and extraordinary service by the event coordinators.",
            date: "August 2026"
        },
        {
            id: 3,
            author: "Dr. Priyantha Jayasuriya",
            role: "Fine Dining Patron",
            rating: 5,
            comment: "The Grilled Norwegian Salmon and chef specialties are world-class. Table booking was confirmed instantly online without any double-booking friction.",
            date: "September 2026"
        },
        {
            id: 4,
            author: "Anoma & Rohan De Silva",
            role: "Silver Jubilee Celebration",
            rating: 5,
            comment: "Garden Terrace poolside ambiance in the evening is magical with illuminated palm trees. The live buffet and equipment setup exceeded all our expectations.",
            date: "July 2026"
        }
    ],

    init() {
        this.renderTestimonials();
    },

    getReviews() {
        try {
            const stored = localStorage.getItem('gm_customer_reviews');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.warn('[Reviews] Failed reading stored reviews', e);
        }
        localStorage.setItem('gm_customer_reviews', JSON.stringify(this.defaultReviews));
        return this.defaultReviews;
    },

    renderTestimonials() {
        const container = document.getElementById('testimonialsGridContainer');
        if (!container) return;

        const reviews = this.getReviews();
        container.innerHTML = reviews.map(r => {
            const starsHtml = Array.from({ length: 5 }).map((_, idx) => 
                `<i class="fa-solid fa-star" style="color:${idx < r.rating ? 'var(--text-gold)' : '#cbd5e1'}; font-size:0.9rem; margin-right:2px;"></i>`
            ).join('');

            return `
                <div class="testimonial-card" style="background:#1b3b2b; border:1px solid rgba(212, 175, 55, 0.25); border-radius:14px; padding:22px; box-shadow:0 4px 15px rgba(0,0,0,0.03); display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden;">
                    <div style="position:absolute; top:12px; right:16px; font-size:2.4rem; color:rgba(212, 175, 55, 0.12); z-index:0; font-family:serif;">“</div>
                    <div style="position:relative; z-index:1;">
                        <div class="stars" style="margin-bottom:10px;">${starsHtml}</div>
                        <p style="font-size:0.9rem; color:#e6dfd5; line-height:1.6; font-style:italic; margin:0 0 14px 0;">"${Utils.escapeHtml(r.comment)}"</p>
                    </div>
                    <div style="position:relative; z-index:1; border-top:1px solid rgba(212, 175, 55, 0.2); padding-top:10px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong style="color:#e6dfd5; font-size:0.88rem; display:block;">${Utils.escapeHtml(r.author)}</strong>
                            <small style="color:var(--gold-dark); font-weight:700; font-size:0.75rem;"><i class="fa-solid fa-crown" style="font-size:0.65rem;"></i> ${Utils.escapeHtml(r.role)}</small>
                        </div>
                        <span style="font-size:0.72rem; color:#d1d5d0;"><i class="fa-regular fa-clock"></i> ${Utils.escapeHtml(r.date || 'Recent')}</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    openReviewModal() {
        if (!window.AuthManager || !AuthManager.isLoggedIn) {
            NotificationManager.showToast('Please sign in or register to submit a verified VIP review.', false);
            ModalManager.openModal('loginModal');
            return;
        }

        const user = AuthManager.currentUser;
        const nameInput = document.getElementById('revAuthorName');
        if (nameInput) {
            nameInput.value = user.fullName || user.username;
        }

        this.setRating(5);
        const commentInput = document.getElementById('revComment');
        if (commentInput) commentInput.value = '';

        ModalManager.openModal('reviewModal');
    },

    setRating(rating) {
        this.selectedRating = rating;
        const stars = document.querySelectorAll('.review-star-btn');
        stars.forEach((btn, idx) => {
            const starIcon = btn.querySelector('i');
            if (idx < rating) {
                btn.style.color = '#d4af37';
                if (starIcon) starIcon.className = 'fa-solid fa-star';
            } else {
                btn.style.color = '#cbd5e1';
                if (starIcon) starIcon.className = 'fa-regular fa-star';
            }
        });
        const ratingText = document.getElementById('revRatingText');
        if (ratingText) {
            const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Exceptional Luxury (5/5)'];
            ratingText.textContent = labels[rating - 1] || `${rating} Stars`;
        }
    },

    handleSubmitReview(e) {
        if (e) e.preventDefault();

        const user = window.AuthManager ? AuthManager.currentUser : null;
        const author = document.getElementById('revAuthorName')?.value.trim() || (user ? user.fullName : 'Valued Patron');
        const occasion = document.getElementById('revOccasion')?.value || 'Fine Dining Experience';
        const comment = (document.getElementById('revComment')?.value || '').trim();

        if (comment.length < 10) {
            NotificationManager.showToast('Please write at least 10 characters for your review.', true);
            return;
        }

        const newReview = {
            id: Date.now(),
            author,
            role: occasion,
            rating: this.selectedRating,
            comment,
            date: 'Verified Patron • ' + new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };

        const list = this.getReviews();
        list.unshift(newReview);
        localStorage.setItem('gm_customer_reviews', JSON.stringify(list));

        ModalManager.closeModal('reviewModal');
        NotificationManager.showToast('✨ Thank you! Your VIP review has been submitted successfully.');
        NotificationManager.addNotification('Review Published', `Your ${this.selectedRating}-star review was posted.`, 'fa-star');

        this.renderTestimonials();
    },

    /* =========================================================================
       FAVORITES FEATURE
       ========================================================================= */
    getFavoritesKey() {
        const user = window.AuthManager ? AuthManager.currentUser : null;
        return user ? `gm_favs_${user.id}` : 'gm_favs_guest';
    },

    getFavorites() {
        try {
            const stored = localStorage.getItem(this.getFavoritesKey());
            return stored ? JSON.parse(stored) : { menu: [], venues: [] };
        } catch (e) {
            return { menu: [], venues: [] };
        }
    },

    isFavorite(type, id) {
        const favs = this.getFavorites();
        return (favs[type] || []).includes(id);
    },

    toggleFavorite(type, id) {
        const key = this.getFavoritesKey();
        const favs = this.getFavorites();
        if (!favs[type]) favs[type] = [];

        const idx = favs[type].indexOf(id);
        let added = false;
        if (idx > -1) {
            favs[type].splice(idx, 1);
            NotificationManager.showToast('Removed from your VIP favorites.');
        } else {
            favs[type].push(id);
            added = true;
            NotificationManager.showToast('Added to your VIP favorites! ❤️');
        }

        localStorage.setItem(key, JSON.stringify(favs));

        // Re-render corresponding components if loaded
        if (type === 'menu' && window.MenuComponent) {
            window.MenuComponent.renderPreviewGrid();
        }
        if (type === 'venues' && window.VenuesComponent) {
            window.VenuesComponent.renderShowcase();
        }
        return added;
    }
};

window.ReviewsComponent = ReviewsComponent;
window.openReviewModal = () => ReviewsComponent.openReviewModal();
window.setReviewRating = (r) => ReviewsComponent.setRating(r);
window.handleReviewSubmit = (e) => ReviewsComponent.handleSubmitReview(e);
window.toggleFavorite = (type, id) => ReviewsComponent.toggleFavorite(type, id);
