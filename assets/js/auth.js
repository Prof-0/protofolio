
/**
 * @file auth.js
 * @description Secure Authentication Module (Zero Trust)
 * Manages authentication state in memory. DOES NOT store tokens in localStorage.
 */

import { configManager } from './config.js';

export class AuthManager {
    constructor() {
        // State is held in closure/memory ONLY.
        // Refreshing the page destroys the session (Secure by Default).
        this.state = {
            apiKey: null,
            sessionToken: null,
            user: null,
            role: null,
            isAuthenticated: false
        };
    }

    /**
     * Verifies API Key with the backend.
     * @param {string} apiKey 
     */
    async login(apiKey) {
        try {
            const url = configManager.getApiUrl('verify');
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });

            if (!response.ok) throw new Error('Invalid Credentials');

            const data = await response.json();
            
            // Secure State Update
            this.state.apiKey = apiKey;
            this.state.sessionToken = data.token || apiKey; // Prefer token if sent
            this.state.user = data.user || 'Unknown';
            this.state.role = data.role || 'Guest';
            this.state.isAuthenticated = true;

            return { success: true, user: this.state.user };
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    /**
     * Registers a new user.
     * @param {string} username 
     */
    async register(username) {
        const url = configManager.getApiUrl('register');
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Registration Failed');
        }

        return await response.json(); // Returns { status: 'success', key: '...' }
    }

    /**
     * Clears session state.
     */
    logout() {
        this.state = {
            apiKey: null,
            sessionToken: null,
            user: null,
            role: null,
            isAuthenticated: false
        };
        // Use sendBeacon or simple fetch to notify backend if needed
    }

    getToken() {
        return this.state.sessionToken;
    }

    getUser() {
        return this.state.user;
    }
    
    isAuthenticated() {
        return this.state.isAuthenticated;
    }
}

export const authManager = new AuthManager();
