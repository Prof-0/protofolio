// ========================================
// Zain AI - Frontend Configuration
// Version: 2.0
// ========================================
async function bootstrapAPI() {
  const res = await fetch("https://caused-dui-pollution-pursuant.trycloudflare.com/meta");
  const data = await res.json();

  CONFIG.API_URL = data.api;
  console.log("[Zain] API Loaded:", CONFIG.API_URL);
}


// === API CONFIGURATION ===
const CONFIG = {
    // PUBLIC URL (Cloudflare Tunnel)
    // This allows the static frontend (GitHub Pages) to talk to the backend.
    API_URL: null,

    // Inactivity timeouts (milliseconds)
    TIMEOUTS: {
        WARN_1: 60000,      // 1 minute warning
        COUNTDOWN: 270000,  // 4.5 minutes countdown
        LOGOUT: 300000      // 5 minutes logout
    },

    // Local storage keys
    STORAGE_KEYS: {
        API_KEY: "zain_api_key",
        LANGUAGE: "zain_lang",
        SESSION_TOKEN: "zain_session_token"
    },

    // Default language
    DEFAULT_LANG: 'en',

    // Supported languages
    SUPPORTED_LANGUAGES: ['en', 'ar'],

    // Server health check interval
    HEALTH_CHECK_INTERVAL: 10000, // 10 seconds

    // Rate limit check interval
    RATE_LIMIT_CHECK_INTERVAL: 1000, // 1 second

    // Maximum message length
    MAX_MESSAGE_LENGTH: 4000,

    // Enable debug mode (MUST BE FALSE IN PRODUCTION)
    DEBUG: false
};

// === HELPER FUNCTIONS ===
function getConfig(key) {
    return CONFIG[key];
}

function getApiUrl(endpoint = '') {
    return `${CONFIG.API_URL}${endpoint}`;
}

function debugLog(...args) {
    if (CONFIG.DEBUG) {
        console.log('[Zain AI]', ...args);
    }
}

function errorLog(...args) {
    console.error('[Zain AI ERROR]', ...args);
}

// === EXPORT (for module use) ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, getConfig, getApiUrl, debugLog, errorLog };
}