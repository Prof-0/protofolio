
/**
 * @file main.js
 * @description Main Application Entry Point
 * Initializes modules and binds event listeners.
 */

import { configManager } from './config.js';
import { authManager } from './auth.js';
import { chatManager } from './chat.js';
import { setLanguage, updatePageLanguage, t, getCurrentLang } from './translations.js';
import { showToast, copyToClipboard, validateUsername } from './utils.js';

// === INITIALIZATION ===
async function init() {
    await configManager.load();

    // Set initial language from config or default
    setLanguage(configManager.get('DEFAULT_LANG') || 'en');
    updatePageLanguage();

    // Check if user is verified (via cookie check in a real app, 
    // but here we just show the auth modal if no session)
    // Note: Since we don't use localStorage for tokens anymore, 
    // the user MUST login every time for security (Zero Trust).

    document.getElementById('auth-modal').classList.remove('hidden');

    bindEvents();
}

// === EVENT BINDING ===
function bindEvents() {
    // --- Auth Events ---
    document.getElementById('auth-btn')?.addEventListener('click', async () => {
        const keyInput = document.getElementById('api-key-input');
        const btn = document.getElementById('auth-btn');
        const errDiv = document.getElementById('auth-error');

        if (!keyInput || !btn) return;

        const key = keyInput.value.trim();
        if (!key) return showToast(t('invalidKey'), 'error');

        btn.disabled = true;
        btn.innerText = '...';

        try {
            const result = await authManager.login(key);
            showToast(`Welcome ${result.user}`, 'success');

            // Hide Modal
            document.getElementById('auth-modal').classList.add('hidden');

            // Allow Chat
            document.getElementById('chat').classList.remove('opacity-50', 'pointer-events-none');

        } catch (error) {
            errDiv.classList.remove('hidden');
            errDiv.innerText = error.message;
            showToast(error.message, 'error');
        } finally {
            btn.disabled = false;
            btn.innerText = t('loginBtn');
        }
    });

    // --- Register Toggle ---
    window.toggleRegister = function () { // Expose for HTML onclick if needed, or bind better
        const loginView = document.getElementById('login-view');
        const regView = document.getElementById('register-view');
        if (loginView.classList.contains('hidden')) {
            loginView.classList.remove('hidden');
            regView.classList.add('hidden');
        } else {
            loginView.classList.add('hidden');
            regView.classList.remove('hidden');
        }
    };
    // Make it global for HTML access (legacy support or ease of use)
    // Better interaction would be finding the element and adding listener:
    document.querySelectorAll('[onclick="toggleRegister()"]').forEach(el => {
        el.onclick = toggleRegister;
        el.removeAttribute('onclick');
    });

    // --- Register Action ---
    document.getElementById('reg-btn')?.addEventListener('click', async () => {
        const usernameInput = document.getElementById('reg-username');
        const btn = document.getElementById('reg-btn');
        const errDiv = document.getElementById('reg-error');

        if (!usernameInput) return;

        const username = usernameInput.value.trim();
        const validation = validateUsername(username);

        if (!validation.valid) {
            errDiv.innerText = validation.error;
            return;
        }

        btn.disabled = true;
        btn.innerText = '...';

        try {
            const data = await authManager.register(username);

            document.getElementById('key-display').classList.remove('hidden');
            const keyEl = document.getElementById('generated-key');
            keyEl.innerText = data.key;
            keyEl.dataset.full = data.key;

            copyToClipboard(data.key);

        } catch (error) {
            errDiv.innerText = error.message;
        } finally {
            btn.disabled = false;
            btn.innerText = t('createBtn');
        }
    });

    // --- Chat Events ---
    document.getElementById('send-btn')?.addEventListener('click', () => {
        const input = document.getElementById('in');
        chatManager.sendMessage(input.value);
    });

    document.getElementById('in')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatManager.sendMessage(e.target.value);
        }
    });

    document.getElementById('stop-btn')?.addEventListener('click', () => {
        chatManager.stopGeneration();
    });

    // --- Logout ---
    window.logout = function () {
        authManager.logout();
        window.location.reload();
    };
    document.querySelector('[onclick="logout()"]')?.addEventListener('click', window.logout);


    // --- Generic Copy ---
    window.copyGenKey = function () {
        const key = document.getElementById('generated-key').dataset.full;
        if (key) copyToClipboard(key);
    };
}

// Start App
init().catch(console.error);
