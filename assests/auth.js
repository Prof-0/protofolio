// ========================================
// Zain AI - Authentication
// Version: 2.1 (Fixed)
// ========================================


// حماية المتغيرات لتجنب توقف الملف إذا لم يتم تحميل الإعدادات
let storedKey = null;
let sessionToken = null;

try {
    if (typeof CONFIG !== 'undefined') {
        storedKey = localStorage.getItem(CONFIG.STORAGE_KEYS.API_KEY);
        sessionToken = localStorage.getItem(CONFIG.STORAGE_KEYS.SESSION_TOKEN);
    } else {
        console.error("⚠️ CONFIG is not defined in auth.js. Check config.js loading.");
    }
} catch (e) {
    console.error("⚠️ Error initializing auth vars:", e);
}

let deviceFingerprint = null;

// === REGISTRATION ===
// جعل الدالة global لضمان رؤيتها من قبل زر HTML
window.toggleRegister = function() {
    
    
    // التأكد من وجود دالة toggleElements
    if (typeof toggleElements === 'function') {
        toggleElements(['register-view'], ['login-view']);
        toggleElements(['login-view'], ['register-view']);
    } else {
        // بديل يدوي في حالة عدم تحميل utils.js
        const regView = document.getElementById('register-view');
        const loginView = document.getElementById('login-view');
        
        if (regView.classList.contains('hidden')) {
            regView.classList.remove('hidden');
            loginView.classList.add('hidden');
        } else {
            regView.classList.add('hidden');
            loginView.classList.remove('hidden');
        }
    }
    
    // Clear errors
    const errEl = document.getElementById('reg-error');
    if(errEl) errEl.innerText = '';
    
    const keyDisplay = document.getElementById('key-display');
    if(keyDisplay) keyDisplay.classList.add('hidden');
}

async function registerUser() {
    const usernameInput = document.getElementById('reg-username');
    const errorDiv = document.getElementById('reg-error');
    const btn = document.getElementById('reg-btn');
    
    const username = usernameInput.value.trim();
    
    // Validate username (check if validator exists)
    if (typeof validateUsername === 'function') {
        const validation = validateUsername(username);
        if (!validation.valid) {
            errorDiv.innerText = validation.error;
            return;
        }
    }
    
    // Show loading
    btn.disabled = true;
    btn.innerText = '...';
    errorDiv.innerText = '';
    
    try {
        // حماية دالة getApiUrl
        const url = (typeof getApiUrl === 'function') ? getApiUrl('/register') : '/register';

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        
        if (!response.ok && response.status !== 400) {
            throw new Error('Network error');
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Show key
            document.getElementById('key-display').classList.remove('hidden');
            document.getElementById('generated-key').innerText = data.key;
            document.getElementById('generated-key').dataset.full = data.key;
            
            // Copy to clipboard
            if (typeof copyToClipboard === 'function') await copyToClipboard(data.key);
            
            // Reset button
            btn.innerText = (typeof t === 'function') ? t('createBtn') : 'Create & Get Key';
            btn.disabled = false;
            
        } else {
            errorDiv.innerText = data.message || 'Unknown Error';
            btn.innerText = (typeof t === 'function') ? t('createBtn') : 'Create & Get Key';
            btn.disabled = false;
        }
        
    } catch (e) {
        if(typeof errorLog === 'function') errorLog('Registration failed:', e);
        console.error(e);
        
        errorDiv.innerText = 'Network Error';
        btn.innerText = (typeof t === 'function') ? t('createBtn') : 'Create & Get Key';
        btn.disabled = false;
    }
}

// تعريف الدالة window لضمان الوصول إليها
window.registerUser = registerUser;

window.copyGenKey = function() {
    const key = document.getElementById('generated-key').dataset.full;
    if (key && typeof copyToClipboard === 'function') {
        copyToClipboard(key);
    }
}

// === LOGIN / VERIFICATION ===
window.verifyApiKey = async function() {
    const keyInput = document.getElementById('api-key-input');
    const key = keyInput.value.trim();
    
    if (!key) {
        if(typeof showToast === 'function') showToast('Please enter API key', 2000, 'error');
        return;
    }
    
    const btn = document.getElementById('auth-btn');
    const errDiv = document.getElementById('auth-error');
    
    // Show loading
    btn.innerText = '...';
    btn.disabled = true;
    errDiv.classList.add('hidden');
    
    try {
        const url = (typeof getApiUrl === 'function') ? getApiUrl('/verify') : '/verify';

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${key}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Save credentials
            if (typeof CONFIG !== 'undefined') {
                localStorage.setItem(CONFIG.STORAGE_KEYS.API_KEY, key);
                localStorage.setItem(CONFIG.STORAGE_KEYS.SESSION_TOKEN, data.token || key);
            }
            storedKey = key;
            sessionToken = data.token || key;
            
            // Update language if provided
            if (data.lang && typeof CONFIG !== 'undefined' && CONFIG.SUPPORTED_LANGUAGES.includes(data.lang)) {
                window.currentLang = data.lang;
                localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, data.lang);
            }
            
            // Success animation
            btn.classList.remove('from-blue-600', 'to-blue-500');
            btn.classList.add('from-green-600', 'to-green-500');
            btn.innerText = '✓';
            
            setTimeout(() => {
                // Hide auth modal
                document.getElementById('auth-modal').classList.add('opacity-0', 'pointer-events-none');
                
                // Update UI
                updateUserInterface(data);
                
                // Update language
                if(typeof updatePageLanguage === 'function') updatePageLanguage(window.currentLang);
                
                // Load chat history
                if(typeof loadHistory === 'function') loadHistory();
                
                // Start monitoring
                if(typeof startHealthMonitoring === 'function') startHealthMonitoring();
                
                // Reset inactivity timer
                if(typeof resetInactivity === 'function') resetInactivity();
                
            }, 800);
            
        } else {
            throw new Error(response.status === 401 ? 'Invalid' : 'Network');
        }
        
    } catch (e) {
        if(typeof errorLog === 'function') errorLog('Verification failed:', e);
        console.error(e);
        errDiv.classList.remove('hidden');
        errDiv.innerText = e.message === 'Invalid' ? 'Invalid API Key' : 'Server Error';
        
        btn.innerText = (typeof t === 'function') ? t('loginBtn') : 'Login';
        btn.disabled = false;
        btn.classList.remove('from-green-600', 'to-green-500');
        btn.classList.add('from-blue-600', 'to-blue-500');
    }
}

// === UPDATE UI AFTER LOGIN ===
function updateUserInterface(userData) {
    const badge = document.getElementById('user-badge');
    if (badge) {
        badge.innerText = userData.user;
        badge.classList.remove('hidden');
    }
    
    document.getElementById('prof-name').innerText = userData.user;
    document.getElementById('prof-role').innerText = (userData.role || 'newuser').toUpperCase();
    document.getElementById('prof-lang').innerText = (window.currentLang || 'en').toUpperCase();
    
    const profKeyDisplay = document.getElementById('prof-key-display');
    if (profKeyDisplay) {
        profKeyDisplay.dataset.key = storedKey;
        const keySpan = profKeyDisplay.querySelector('span');
        if (keySpan && typeof maskApiKey === 'function') {
            keySpan.innerText = maskApiKey(storedKey);
        }
    }
}

// === LOGOUT ===
window.logout = function() {
    if (typeof CONFIG !== 'undefined') {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.API_KEY);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.SESSION_TOKEN);
    }
    location.reload();
}

// === PROFILE MODAL ===
window.openProfile = function() {
    document.getElementById('profile-modal').classList.remove('hidden');
}

window.closeProfile = function() {
    document.getElementById('profile-modal').classList.add('hidden');
}

window.copyKeyFromProfile = function() {
    const key = document.getElementById('prof-key-display').dataset.key;
    if (key && typeof copyToClipboard === 'function') {
        copyToClipboard(key);
    }
}

// === AUTO-LOGIN ON PAGE LOAD ===
window.addEventListener('DOMContentLoaded', async () => {
    
    if (typeof generateFingerprint === 'function') {
        deviceFingerprint = await generateFingerprint();
    }
    
    if (storedKey) {
        const input = document.getElementById('api-key-input');
        if(input) {
            input.value = storedKey;
            verifyApiKey();
        }
    }
});

