
/**
 * @file config.js
 * @description Secure Configuration Module
 * Handles dynamic configuration loading to prevent exposing secrets in static code.
 */

export class ConfigManager {
    constructor() {
        this.config = {
            API_URL: null,
            TIMEOUTS: {
                WARN_1: 60000,
                COUNTDOWN: 270000,
                LOGOUT: 300000
            }
        };
        this.isLoaded = false;
    }

    /**
     * Loads configuration from a static JSON endpoint or file.
     * Use a relative path 'config.json' which should be present in the assets folder.
     */
    async load() {
        if (this.isLoaded) return;

        try {
            // In a real deployment, this should fetch from a secure endpoint
            // or a config.json not committed to public repo.
            // For now, we simulate fetching or load from a known location.
            const response = await fetch('assets/config.json');
            if (!response.ok) throw new Error('Failed to load config');
            
            const remoteConfig = await response.json();
            this.config = { ...this.config, ...remoteConfig };
            this.isLoaded = true;
            // console.log("[SecureConfig] Loaded."); 
        } catch (error) {
            console.error("[SecureConfig] Failed to load configuration:", error);
            // Fallback provided only for dev/demo if absolutely necessary
        }
    }

    get(key) {
        return this.config[key];
    }

    getApiUrl(endpoint = '') {
        // Ensure no trailing slash in base, no leading slash in endpoint
        const base = (this.config.API_URL || '').replace(/\/$/, '');
        const path = endpoint.replace(/^\//, '');
        return `${base}/${path}`;
    }
}

export const configManager = new ConfigManager();
