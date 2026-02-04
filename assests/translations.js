// ========================================
// Zain AI - Translations
// Version: 2.0
// ========================================

const TRANSLATIONS = {
    ar: {
        // General
        ph: "اكتب رسالتك...",
        ok: "متصل",
        fail: "غير متصل",
        dir: "rtl",
        
        // Notifications
        warn1: "⚠️ تنبيه: سكون لمدة دقيقة",
        copyMsg: "تم النسخ! 📋",
        serverError: "⚠️ خطأ في السيرفر",
        invalidKey: "⛔ مفتاح غير صحيح",
        
        // Timeout
        timeoutTitle: "انتهت الجلسة",
        timeoutReason: "تم فصل الاتصال بسبب عدم النشاط",
        loginAgain: "تسجيل الدخول",
        
        // Authentication
        authTitle: "🔐 التحقق من الهوية",
        authSub: "أدخل مفتاح API للوصول",
        loginBtn: "دخول",
        newUserLink: "إنشاء حساب جديد؟",
        
        // Registration
        regTitle: "🆕 تسجيل جديد",
        regSub: "إنشاء حساب NewUser",
        createBtn: "إنشاء والحصول على مفتاح",
        backLogin: "عودة للدخول",
        
        // Rate Limit
        rlTitle: "تجاوزت الحد المسموح",
        rlMsg: "لقد استهلكت رصيد رسائلك بالكامل.",
        
        // Errors
        usernameError: "اسم مستخدم غير صالح",
        networkError: "خطأ في الاتصال",
        unknownError: "حدث خطأ غير معروف"
    },
    
    en: {
        // General
        ph: "Type your message...",
        ok: "Connected",
        fail: "Offline",
        dir: "ltr",
        
        // Notifications
        warn1: "⚠️ Inactive for 1 min",
        copyMsg: "Copied! 📋",
        serverError: "⚠️ Server Error",
        invalidKey: "⛔ Invalid Key",
        
        // Timeout
        timeoutTitle: "Session Expired",
        timeoutReason: "Disconnected due to inactivity",
        loginAgain: "Login Again",
        
        // Authentication
        authTitle: "🔐 Verify Identity",
        authSub: "Enter API Key to access",
        loginBtn: "Login",
        newUserLink: "Create New User?",
        
        // Registration
        regTitle: "🆕 Register",
        regSub: "Create NewUser Account",
        createBtn: "Create & Get Key",
        backLogin: "Back to Login",
        
        // Rate Limit
        rlTitle: "Rate Limit Exceeded",
        rlMsg: "You have reached the message quota.",
        
        // Errors
        usernameError: "Invalid username",
        networkError: "Network error",
        unknownError: "Unknown error occurred"
    }
};

// Get translation for key
function t(key, lang = null) {
    const currentLang = lang || (window.currentLang || CONFIG.DEFAULT_LANG);
    return TRANSLATIONS[currentLang][key] || key;
}

// Update all elements with data-i18n attribute
function updatePageLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = t(key, lang);
        if (translation !== key) {
            el.innerText = translation;
        }
    });
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TRANSLATIONS, t, updatePageLanguage };
}