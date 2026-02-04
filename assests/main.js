// ========================================
// Zain AI - Main Application
// Version: 2.0
// ========================================

// === GLOBAL STATE ===
(async () => {
  await bootstrapAPI();

  // مثال health check
  const r = await fetch(getApiUrl("/health"));
  console.log(await r.json());
})();

window.currentLang = localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE) || CONFIG.DEFAULT_LANG;

// Inactivity timers
let warningTimer = null;
let countdownTimer = null;
let kickTimer = null;
let countdownInterval = null;

// Health monitoring
let healthCheckInterval = null;

// === INACTIVITY MANAGEMENT ===
function resetInactivity() {
    if (!storedKey || isGenerating) return;
    
    // Clear all timers
    clearTimeout(warningTimer);
    clearTimeout(countdownTimer);
    clearTimeout(kickTimer);
    clearInterval(countdownInterval);
    
    // Hide countdown overlay
    document.getElementById('countdown-overlay').classList.add('hidden');
    
    // Set new timers
    warningTimer = setTimeout(() => {
        showToast(t('warn1'), 5000, 'info');
    }, CONFIG.TIMEOUTS.WARN_1);
    
    countdownTimer = setTimeout(() => {
        if (!storedKey || isGenerating) return;
        
        let secondsLeft = 30;
        const overlay = document.getElementById('countdown-overlay');
        const numEl = document.getElementById('countdown-num');
        
        overlay.classList.remove('hidden');
        
        countdownInterval = setInterval(() => {
            if (isGenerating) {
                clearInterval(countdownInterval);
                overlay.classList.add('hidden');
                return;
            }
            
            secondsLeft--;
            numEl.innerText = secondsLeft;
            
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
                triggerTimeoutScreen();
            }
        }, 1000);
        
    }, CONFIG.TIMEOUTS.COUNTDOWN);
    
    kickTimer = setTimeout(() => {
        if (!storedKey || isGenerating) return;
        triggerTimeoutScreen();
    }, CONFIG.TIMEOUTS.LOGOUT);
}

function triggerTimeoutScreen() {
    if (isGenerating) return;
    
    // Clear credentials
    localStorage.removeItem(CONFIG.STORAGE_KEYS.API_KEY);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.SESSION_TOKEN);
    storedKey = null;
    sessionToken = null;
    
    // Update page language
    updatePageLanguage(window.currentLang);
    
    // Show timeout screen
    document.getElementById('timeout-overlay').classList.remove('hidden');
}

// === LANGUAGE MANAGEMENT ===
async function toggleLanguage() {
    // Toggle language
    window.currentLang = window.currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, window.currentLang);
    
    // Update UI
    updateUILanguage();
    
    // Notify server if authenticated
    if (sessionToken || storedKey) {
        try {
            await fetch(getApiUrl('/update_lang'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken || storedKey}`
                },
                body: JSON.stringify({ lang: window.currentLang })
            });
        } catch (e) {
            debugLog('Failed to update language on server:', e);
        }
    }
    
    // Re-check server status
    checkServerStatus();
}

function updateUILanguage() {
    const dir = window.currentLang === 'ar' ? 'rtl' : 'ltr';
    const font = window.currentLang === 'ar' ? "'Cairo', sans-serif" : "'JetBrains Mono', monospace";
    
    // Update HTML attributes
    document.documentElement.dir = dir;
    document.documentElement.lang = window.currentLang;
    document.body.style.fontFamily = font;
    
    // Update placeholder
    const input = document.getElementById('in');
    if (input) {
        input.placeholder = t('ph');
    }
    
    // Update all i18n elements
    updatePageLanguage(window.currentLang);
    
    // Update send icon rotation
    const sendIcon = document.getElementById('send-icon');
    if (sendIcon) {
        sendIcon.style.transform = window.currentLang === 'ar' ? 'rotate(180deg)' : 'rotate(0deg)';
    }
}

// === HEALTH MONITORING ===
function startHealthMonitoring() {
    // Initial check
    checkServerStatus();
    
    // Periodic checks
    if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
    }
    
    healthCheckInterval = setInterval(() => {
        checkServerStatus();
    }, CONFIG.HEALTH_CHECK_INTERVAL);
}

function stopHealthMonitoring() {
    if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
        healthCheckInterval = null;
    }
}

// === INITIALIZATION ===
window.addEventListener('load', async () => {
    debugLog('Application initializing...');
    
    // Set initial language
    updateUILanguage();
    
    // Start health monitoring (will work even before login)
    checkServerStatus();
    setInterval(checkServerStatus, CONFIG.HEALTH_CHECK_INTERVAL);
    
    debugLog('Application initialized successfully');
});

// === CLEANUP ON UNLOAD ===
window.addEventListener('beforeunload', () => {
    stopHealthMonitoring();
    clearTimeout(warningTimer);
    clearTimeout(countdownTimer);
    clearTimeout(kickTimer);
    clearInterval(countdownInterval);
});

// === VISIBILITY CHANGE (tab switching) ===
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        debugLog('Tab hidden, pausing timers');
        // Don't pause inactivity timers (security)
    } else {
        debugLog('Tab visible, checking server status');
        checkServerStatus();
    }
});

// === ERROR HANDLING ===
window.addEventListener('error', (event) => {
    errorLog('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    errorLog('Unhandled promise rejection:', event.reason);
});

// === SERVICE WORKER (for PWA - optional) ===
if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
            (registration) => {
                debugLog('ServiceWorker registration successful:', registration.scope);
            },
            (error) => {
                debugLog('ServiceWorker registration failed:', error);
            }
        );
    });
}

// === CONSOLE GREETING ===
console.log('%c🤖 Zain AI v2.0', 'font-size: 24px; font-weight: bold; color: #2563eb;');
console.log('%cSecure AI Assistant Platform', 'font-size: 14px; color: #6366f1;');
console.log('%cCreated by Prof-0 🇪🇬', 'font-size: 12px; color: #a855f7;');
console.log('%c⚠️ Warning: Do not paste code here unless you know what you\'re doing!', 'font-size: 14px; font-weight: bold; color: #ef4444;');