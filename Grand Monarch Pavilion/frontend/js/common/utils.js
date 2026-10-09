/**
 * Common Utility Helpers
 * Formatting, Live Clocks, String Utilities, and CSV Export.
 */

const Utils = {
    formatCurrency(amount) {
        if (isNaN(amount) || amount === null || amount === undefined) return 'LKR 0.00';
        return 'LKR ' + Number(amount).toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },

    formatDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    formatTime(timeStr) {
        if (!timeStr) return '-';
        if (timeStr.includes(':')) {
            const parts = timeStr.split(':');
            let hours = parseInt(parts[0], 10);
            const minutes = parts[1];
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            return `${hours}:${minutes} ${ampm}`;
        }
        return timeStr;
    },

    escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    scrollToElement(elementId) {
        if (window.NavigationManager && window.NavigationManager.currentSection !== 'home') {
            window.NavigationManager.goToHomePage(true);
            setTimeout(() => {
                const el = document.getElementById(elementId);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            return;
        }
        const el = document.getElementById(elementId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    startLiveClock(elementId) {
        function tick() {
            const el = document.getElementById(elementId);
            if (!el) return;
            const now = new Date();
            el.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }) + ' - ' + now.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
        tick();
        setInterval(tick, 1000);
    },

    downloadCSV(csvContent, fileName) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

const FormValidator = {
    // Phone Number validation: exactly 10 digits starting with 0 (e.g. 0771234567)
    validatePhone(value, fieldName = 'Phone Number') {
        if (!value || typeof value !== 'string') {
            return { valid: false, message: `${fieldName} is required.` };
        }
        const cleaned = value.trim().replace(/[\s\-]/g, '');
        if (!cleaned) {
            return { valid: false, message: `${fieldName} is required.` };
        }
        if (!/^0\d{9}$/.test(cleaned)) {
            return { valid: false, message: `${fieldName} must be exactly 10 digits starting with 0 (e.g., 0771234567).` };
        }
        return { valid: true, value: cleaned };
    },

    // Email validation - Mandatory @gmail.com domain
    validateEmail(value, fieldName = 'Email Address') {
        if (!value || typeof value !== 'string') {
            return { valid: false, message: `${fieldName} is required.` };
        }
        const cleaned = value.trim();
        if (!cleaned) {
            return { valid: false, message: `${fieldName} is required.` };
        }
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (!gmailRegex.test(cleaned)) {
            return { valid: false, message: `${fieldName} must be a valid @gmail.com address (e.g., yourname@gmail.com).` };
        }
        return { valid: true, value: cleaned.toLowerCase() };
    },

    // Strict Person Name Validation (Full Name, Customer Name, User Name) - STRICTLY NO NUMBERS LIKE 123
    validateName(value, fieldName = 'Full Name', minLength = 2, maxLength = 100) {
        if (!value || typeof value !== 'string') {
            return { valid: false, message: `${fieldName} is required.` };
        }
        const cleaned = value.trim();
        if (cleaned.length < minLength) {
            return { valid: false, message: `${fieldName} must be at least ${minLength} characters.` };
        }
        if (cleaned.length > maxLength) {
            return { valid: false, message: `${fieldName} cannot exceed ${maxLength} characters.` };
        }
        // Strict no-numbers check: rejects "123", "User 123", etc.
        if (/\d/.test(cleaned)) {
            return { valid: false, message: `${fieldName} cannot contain numbers (e.g. 123). Please enter letters only.` };
        }
        // Must contain alphabetic letters and only standard name punctuation
        if (!/^[a-zA-Z\s.'\-]+$/.test(cleaned) || !/[a-zA-Z]/.test(cleaned)) {
            return { valid: false, message: `${fieldName} can only contain letters and standard name characters.` };
        }
        return { valid: true, value: cleaned };
    },

    // Entity Name Validation (Dish names, Category names, Venue titles) - Cannot be purely numeric like "123"
    validateEntityName(value, fieldName = 'Name', minLength = 2, maxLength = 100) {
        if (!value || typeof value !== 'string') {
            return { valid: false, message: `${fieldName} is required.` };
        }
        const cleaned = value.trim();
        if (cleaned.length < minLength) {
            return { valid: false, message: `${fieldName} must be at least ${minLength} characters.` };
        }
        if (cleaned.length > maxLength) {
            return { valid: false, message: `${fieldName} cannot exceed ${maxLength} characters.` };
        }
        // Rejects purely numeric inputs like "123"
        if (/^\d+$/.test(cleaned) || !/[a-zA-Z]/.test(cleaned)) {
            return { valid: false, message: `${fieldName} cannot be numbers only (e.g. 123). Please use a descriptive name with letters.` };
        }
        return { valid: true, value: cleaned };
    },

    // Strict Venue Name Validation: Letters and spaces only. Strictly NO numbers (123) and NO symbols (-, =, + etc.)
    validateVenueName(value, fieldName = 'Venue Name', minLength = 3, maxLength = 100) {
        if (!value || typeof value !== 'string') {
            return { valid: false, message: `${fieldName} is required.` };
        }
        const cleaned = value.trim();
        if (cleaned.length < minLength) {
            return { valid: false, message: `${fieldName} must be at least ${minLength} characters.` };
        }
        if (cleaned.length > maxLength) {
            return { valid: false, message: `${fieldName} cannot exceed ${maxLength} characters.` };
        }
        if (/\d/.test(cleaned)) {
            return { valid: false, message: `${fieldName} cannot contain numbers (e.g. 123). Please enter letters only.` };
        }
        if (!/^[a-zA-Z\s]+$/.test(cleaned)) {
            return { valid: false, message: `${fieldName} can only contain letters and spaces. Numbers and symbols (such as -, =, +) are not allowed.` };
        }
        return { valid: true, value: cleaned };
    },

    // Text length and required validation
    validateText(value, fieldName = 'Field', minLength = 2, maxLength = 255) {
        if (!value || typeof value !== 'string') {
            return { valid: false, message: `${fieldName} is required.` };
        }
        const cleaned = value.trim();
        if (cleaned.length < minLength) {
            return { valid: false, message: `${fieldName} must be at least ${minLength} characters.` };
        }
        if (cleaned.length > maxLength) {
            return { valid: false, message: `${fieldName} must not exceed ${maxLength} characters.` };
        }
        return { valid: true, value: cleaned };
    },

    // Username validation
    validateUsername(value, fieldName = 'Username') {
        if (!value || typeof value !== 'string') {
            return { valid: false, message: `${fieldName} is required.` };
        }
        const cleaned = value.trim();
        if (cleaned.length < 3) {
            return { valid: false, message: `${fieldName} must be at least 3 characters.` };
        }
        if (/^\d+$/.test(cleaned)) {
            return { valid: false, message: `${fieldName} cannot be numbers only (e.g. 123). Please include letters.` };
        }
        if (!/^[a-zA-Z0-9_.\-]+$/.test(cleaned)) {
            return { valid: false, message: `${fieldName} can only contain letters, numbers, and underscores.` };
        }
        return { valid: true, value: cleaned };
    },

    // Password validation - Minimum 6 characters / digits
    validatePassword(value, fieldName = 'Password', minLength = 6) {
        if (!value || typeof value !== 'string') {
            return { valid: false, message: `${fieldName} is required.` };
        }
        if (value.length < minLength) {
            return { valid: false, message: `${fieldName} must be at least ${minLength} characters/digits.` };
        }
        return { valid: true, value };
    },

    // Numeric validation
    validateNumber(value, fieldName = 'Number', min = 0, max = Infinity, integerOnly = false) {
        if (value === null || value === undefined || String(value).trim() === '') {
            return { valid: false, message: `${fieldName} is required.` };
        }
        const num = Number(value);
        if (isNaN(num)) {
            return { valid: false, message: `${fieldName} must be a valid number.` };
        }
        if (integerOnly && !Number.isInteger(num)) {
            return { valid: false, message: `${fieldName} must be a whole integer.` };
        }
        if (num < min) {
            return { valid: false, message: `${fieldName} must be at least ${min}.` };
        }
        if (num > max) {
            return { valid: false, message: `${fieldName} cannot exceed ${max}.` };
        }
        return { valid: true, value: num };
    },

    // Date validation
    validateDate(value, fieldName = 'Date', allowPast = false) {
        if (!value) {
            return { valid: false, message: `${fieldName} is required.` };
        }
        const selected = new Date(value);
        if (isNaN(selected.getTime())) {
            return { valid: false, message: `Please enter a valid ${fieldName}.` };
        }
        if (!allowPast) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selDate = new Date(value + 'T00:00:00');
            if (selDate < today) {
                return { valid: false, message: `${fieldName} cannot be in the past. Please select today or a future date.` };
            }
        }
        return { valid: true, value };
    },

    // Time validation
    validateTimeRange(startTime, endTime) {
        if (!startTime || !endTime) {
            return { valid: false, message: 'Start time and End time are required.' };
        }
        if (startTime >= endTime) {
            return { valid: false, message: 'End time must be later than Start time.' };
        }
        return { valid: true };
    },

    // Visual mark invalid field & notification
    markInvalid(el, message) {
        if (!el) {
            if (message && window.NotificationManager) {
                NotificationManager.showToast(message, true);
            }
            return false;
        }

        el.classList.add('is-invalid');
        el.focus();

        const removeErr = () => {
            el.classList.remove('is-invalid');
            el.removeEventListener('input', removeErr);
            el.removeEventListener('change', removeErr);
        };
        el.addEventListener('input', removeErr);
        el.addEventListener('change', removeErr);

        if (message && window.NotificationManager) {
            NotificationManager.showToast(message, true);
        }
        return false;
    },

    // Auto-attach real-time input formatting and validation restrictions
    initRealtimeRestrictions() {
        // 1. Phone number restrictions: digits only, max 10, starts with 0
        const phoneSelectors = 'input[type="tel"], #regPhone, #uPhone, #editPhone, #profPhone';
        document.querySelectorAll(phoneSelectors).forEach(input => {
            input.setAttribute('maxlength', '10');
            input.setAttribute('pattern', '0[0-9]{9}');
            input.setAttribute('title', '10 digits starting with 0 (e.g. 0771234567)');
            
            input.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '');
                if (val.length > 10) val = val.substring(0, 10);
                e.target.value = val;

                if (val.length >= 1 && val[0] !== '0') {
                    e.target.classList.add('is-invalid');
                } else {
                    e.target.classList.remove('is-invalid');
                }
            });
        });

        // 2. Strict Person Name fields: block typing numbers in real-time
        const personNameSelectors = '#regFullName, #profFullName, #uFullName';
        document.querySelectorAll(personNameSelectors).forEach(input => {
            input.setAttribute('placeholder', 'Enter your full name');
            input.addEventListener('input', (e) => {
                // If user types numbers, strip them immediately and show visual warning
                if (/\d/.test(e.target.value)) {
                    e.target.value = e.target.value.replace(/\d/g, '');
                    if (window.NotificationManager) {
                        NotificationManager.showToast('Names cannot contain numbers (e.g. 123). Please enter letters only.', true);
                    }
                }
            });
        });

        // 2b. Strict Venue Name fields: letters and spaces only - block digits and symbols (-, =, + etc.) in real-time
        const venueNameInputs = '#modalVenueName, #editVenName, #vName';
        document.querySelectorAll(venueNameInputs).forEach(input => {
            input.addEventListener('input', (e) => {
                if (/[^a-zA-Z\s]/.test(e.target.value)) {
                    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    if (window.NotificationManager) {
                        NotificationManager.showToast('Venue Name can only contain letters and spaces. Numbers and symbols are not allowed.', true);
                    }
                }
            });
        });
        const entityNameSelectors = '#modalMenuItemName, #modalCategoryName, #vName, #pkgName, #modalVenueName, #editVenName';
        document.querySelectorAll(entityNameSelectors).forEach(input => {
            input.addEventListener('input', (e) => {
                const val = e.target.value.trim();
                if (/^\d+$/.test(val)) {
                    e.target.classList.add('is-invalid');
                } else {
                    e.target.classList.remove('is-invalid');
                }
            });
        });

        // 4. Strict Booking/Reservation Date fields: strictly prohibit past dates
        this.enforceMinDates();
    },

    enforceMinDates() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        const dateFields = ['rDate', 'newResDate', 'editResDate', 'eDate', 'modalEvtDate', 'editEvtDate'];
        dateFields.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.setAttribute('min', todayStr);
                const validatePastDate = (e) => {
                    const val = e.target.value;
                    if (val && val < todayStr) {
                        e.target.value = '';
                        e.target.classList.add('is-invalid');
                        if (window.NotificationManager) {
                            NotificationManager.showToast('Past dates cannot be selected. Please choose today or a future date.', true);
                        }
                    } else if (val) {
                        e.target.classList.remove('is-invalid');
                    }
                };
                input.removeEventListener('change', input._enforceDateHandler);
                input.removeEventListener('input', input._enforceDateHandler);
                input._enforceDateHandler = validatePastDate;
                input.addEventListener('change', validatePastDate);
                input.addEventListener('input', validatePastDate);
            }
        });

        // Task deadline datetime-local
        const taskDueInput = document.getElementById('taskDueDate');
        if (taskDueInput) {
            const nowIso = new Date().toISOString().slice(0, 16);
            taskDueInput.setAttribute('min', nowIso);
            const validateTaskDue = (e) => {
                if (e.target.value && e.target.value < nowIso) {
                    e.target.value = '';
                    if (window.NotificationManager) {
                        NotificationManager.showToast('Task deadline cannot be in the past.', true);
                    }
                }
            };
            taskDueInput.removeEventListener('change', taskDueInput._enforceTaskDueHandler);
            taskDueInput._enforceTaskDueHandler = validateTaskDue;
            taskDueInput.addEventListener('change', validateTaskDue);
        }
    }
};

window.Utils = Utils;
window.FormValidator = FormValidator;
window.Utils.FormValidator = FormValidator;
window.formatCurrency = Utils.formatCurrency;
window.scrollToElement = Utils.scrollToElement;
window.downloadCSV = Utils.downloadCSV;

// Run input restrictions when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => FormValidator.initRealtimeRestrictions());
} else {
    FormValidator.initRealtimeRestrictions();
}

