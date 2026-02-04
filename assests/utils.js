// ========================================
// Zain AI - Utility Functions
// Version: 2.0
// ========================================

// === DEVICE FINGERPRINTING ===
async function generateFingerprint() {
    return new Promise((resolve) => {
        if (typeof Fingerprint2 === 'undefined') {
            // Fallback if Fingerprint2 not loaded
            const fallback = `${navigator.userAgent}|${navigator.language}|${screen.width}x${screen.height}`;
            resolve(hashString(fallback));
            return;
        }

        Fingerprint2.get((components) => {
            const values = components.map(c => c.value);
            const hash = Fingerprint2.x64hash128(values.join(''), 31);
            resolve(hash);
        });
    });
}

// Simple string hash function (fallback)
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

// === SERVER STATUS ===
async function checkServerStatus() {
    try {
        const start = Date.now();
        const response = await fetch(getApiUrl('/health'), {
            method: 'HEAD',
            cache: 'no-cache'
        });

        const latency = Date.now() - start;
        const isOnline = response.ok;

        updateStatusIndicators(isOnline, latency);
        return { online: isOnline, latency };

    } catch (e) {
        debugLog('Server status check failed:', e);
        updateStatusIndicators(false, 0);
        return { online: false, latency: 0 };
    }
}

function updateStatusIndicators(isOnline, latency) {
    const statusText = isOnline ? t('ok') : t('fail');
    const statusColor = isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500';

    // Update main status dot
    const mainDot = document.getElementById('api-status-dot');
    if (mainDot) {
        mainDot.className = `w-2.5 h-2.5 rounded-full ${statusColor} transition-all duration-500`;
    }

    // Update login status dot
    const loginDot = document.getElementById('login-status-dot');
    if (loginDot) {
        loginDot.className = `w-2.5 h-2.5 rounded-full ${statusColor}`;
    }

    // Update status text
    const statusTextMain = document.getElementById('status-text-main');
    if (statusTextMain) {
        statusTextMain.innerText = statusText;
        statusTextMain.className = `font-bold ${isOnline ? 'text-green-400' : 'text-red-400'}`;
    }

    // Update latency
    const statusLatency = document.getElementById('status-latency');
    if (statusLatency) {
        statusLatency.innerText = isOnline ? `Ping: ${latency}ms` : '--';
    }

    // Update login status text
    const loginStatusText = document.getElementById('login-status-text');
    if (loginStatusText) {
        loginStatusText.innerText = statusText;
        loginStatusText.className = `text-xs ${isOnline ? 'text-green-400' : 'text-red-400'}`;
    }
}

// === TOAST NOTIFICATIONS ===
function showToast(message, duration = 3000, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = "toast bg-zinc-800/95 border border-zinc-600 text-white px-6 py-3 rounded-lg shadow-2xl backdrop-blur-md text-sm flex items-center gap-3 pointer-events-auto";

    const icons = {
        info: '<svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>',
        success: '<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
        error: '<svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>'
    };

    const iconSpan = document.createElement('span');
    iconSpan.innerHTML = icons[type] || icons.info;
    iconSpan.className = "flex-shrink-0";

    const msgSpan = document.createElement('span');
    msgSpan.textContent = message;

    toast.appendChild(iconSpan);
    toast.appendChild(msgSpan);

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// === UI HELPERS ===
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function scrollToBottom() {
    const chat = document.getElementById('chat');
    if (chat) {
        setTimeout(() => {
            chat.scrollTop = chat.scrollHeight;
        }, 50);
    }
}

function toggleElements(showIds = [], hideIds = []) {
    showIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('hidden');
    });

    hideIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
}

function maskApiKey(key, visibleChars = 4) {
    if (!key || key.length <= visibleChars * 2) {
        return '••••••••••••';
    }

    const start = key.substring(0, visibleChars);
    const end = key.substring(key.length - visibleChars);
    const middle = '•'.repeat(Math.min(12, key.length - visibleChars * 2));

    return `${start}${middle}${end}`;
}

// === VALIDATION ===
function validateUsername(username) {
    if (!username || username.length < 3) {
        return { valid: false, error: 'Username must be at least 3 characters' };
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
        return { valid: false, error: 'Username can only contain English letters, numbers, and . - _' };
    }

    return { valid: true };
}

function validateMessage(message) {
    if (!message || message.trim().length === 0) {
        return { valid: false, error: 'Message cannot be empty' };
    }

    if (message.length > CONFIG.MAX_MESSAGE_LENGTH) {
        return { valid: false, error: `Message too long (max ${CONFIG.MAX_MESSAGE_LENGTH} characters)` };
    }

    return { valid: true };
}

// === CLIPBOARD ===
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast(t('copyMsg'), 2000, 'success');
        return true;
    } catch (e) {
        debugLog('Clipboard copy failed:', e);

        // Fallback method
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            showToast(t('copyMsg'), 2000, 'success');
            return true;
        } catch (err) {
            showToast('Failed to copy', 2000, 'error');
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

// === TIME FORMATTING ===
function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');

    return `${h}:${m}:${s}`;
}

// === EXPORT ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateFingerprint,
        checkServerStatus,
        showToast,
        autoResize,
        scrollToBottom,
        toggleElements,
        maskApiKey,
        validateUsername,
        validateMessage,
        copyToClipboard,
        formatDuration
    };
}