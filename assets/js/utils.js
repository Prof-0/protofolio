
/**
 * @file utils.js
 * @description Secure Utility Functions
 * Helper functions with strict input validation and sanitization.
 */

/**
 * Creates a text node to safely render content without HTML injection.
 * @param {string} text 
 * @returns {Text}
 */
export function safeText(text) {
    return document.createTextNode(text);
}

/**
 * Creates a DOM element with safe text content.
 * @param {string} tag 
 * @param {string} text 
 * @param {Array<string>} classes 
 * @returns {HTMLElement}
 */
export function createElement(tag, text = '', classes = []) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (classes.length) el.classList.add(...classes);
    return el;
}

/**
 * Masks an API key for display.
 * @param {string} key 
 * @returns {string}
 */
export function maskApiKey(key) {
    if (!key) return '';
    if (key.length < 8) return '********';
    return key.substring(0, 4) + '****' + key.substring(key.length - 4);
}

/**
 * Validates a username.
 * @param {string} username 
 * @returns {Object} { valid: boolean, error: string }
 */
export function validateUsername(username) {
    if (!username || username.trim().length < 3) {
        return { valid: false, error: 'Username must be at least 3 characters.' };
    }
    if (!/^[a-zA-Z0-9_\-]+$/.test(username)) {
        return { valid: false, error: 'Alphanumeric characters only.' };
    }
    return { valid: true };
}

/**
 * Toast Notification (Simple Implementation)
 * @param {string} message 
 * @param {string} type 'info', 'success', 'error'
 */
export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return; // Fail silently if UI not ready

    const toast = document.createElement('div');
    toast.className = `toast p-4 rounded mb-2 text-white text-sm shadow-lg backdrop-blur-md border border-white/10 transition-all duration-300 transform translate-y-2 opacity-0
        ${type === 'error' ? 'bg-red-900/80' : type === 'success' ? 'bg-green-900/80' : 'bg-blue-900/80'}`;
    
    toast.textContent = message;

    container.appendChild(toast);

    // Animation
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
