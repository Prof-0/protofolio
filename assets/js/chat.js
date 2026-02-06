
/**
 * @file chat.js
 * @description Secure Chat Manager
 */

import { configManager } from './config.js';
import { authManager } from './auth.js';
import { showToast, safeText, createElement } from './utils.js';
import { t } from './translations.js';

export class ChatManager {
    constructor() {
        this.abortController = null;
        this.isGenerating = false;
    }

    async sendMessage(text) {
        if (this.isGenerating) return;
        if (!text || !text.trim()) return;

        const message = text.trim();

        // UI Updates
        const input = document.getElementById('in');
        const sendBtn = document.getElementById('send-btn');
        const stopBtn = document.getElementById('stop-btn');

        input.value = '';
        input.disabled = true;
        this.isGenerating = true;

        this.toggleButtons(true);
        this.addMessage(message, 'user');

        // Loading Indicator
        const loadingId = this.addLoadingIndicator();

        this.abortController = new AbortController();

        try {
            const url = configManager.getApiUrl('chat');
            const token = authManager.getToken(); // Retrieve from memory

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message }),
                signal: this.abortController.signal
            });

            this.removeMessage(loadingId);

            if (response.status === 401 || response.status === 403) {
                this.addMessage("⚠️ Session expired. Logging out...", "ai");
                setTimeout(() => window.location.reload(), 2000); // Simple reload to clear memory state
                return;
            }

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            this.addMessage(data.response, 'ai', data.model);

        } catch (error) {
            this.removeMessage(loadingId);
            if (error.name === 'AbortError') {
                this.addMessage(t('fail'), 'system'); // Canceled
            } else {
                console.error(error);
                this.addMessage(t('networkError') || 'Network Error', 'ai');
            }
        } finally {
            this.isGenerating = false;
            this.abortController = null;
            input.disabled = false;
            input.focus();
            this.toggleButtons(false);
        }
    }

    stopGeneration() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    toggleButtons(isLoading) {
        const sendBtn = document.getElementById('send-btn');
        const stopBtn = document.getElementById('stop-btn');
        if (isLoading) {
            sendBtn?.classList.add('hidden');
            stopBtn?.classList.remove('hidden');
        } else {
            sendBtn?.classList.remove('hidden');
            stopBtn?.classList.add('hidden');
        }
    }

    addMessage(text, role, model = null) {
        const chat = document.getElementById('chat');
        if (!chat) return;

        const msgDiv = document.createElement('div');
        const isUser = role === 'user';
        msgDiv.className = `flex flex-col ${isUser ? 'items-start' : 'items-end'}`;

        const bubble = document.createElement('div');
        // Re-use legacy classes for styling compatibility
        bubble.className = `msg-bubble ${isUser ? 'user-msg' : 'ai-msg'} whitespace-pre-wrap`;

        // Secure Text Insertion
        bubble.textContent = text;

        msgDiv.appendChild(bubble);

        if (model) {
            const meta = document.createElement('div');
            meta.className = "flex gap-2 mt-1 text-[10px] text-zinc-500 font-mono";
            meta.textContent = model;
            msgDiv.appendChild(meta);
        }

        chat.appendChild(msgDiv);
        chat.scrollTop = chat.scrollHeight;
    }

    addLoadingIndicator() {
        const chat = document.getElementById('chat');
        const id = 'loading-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'flex flex-col items-end';
        div.innerHTML = `
        <div class="msg-bubble ai-msg flex gap-2 items-center loading-dots">
            <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
        </div>`;
        // Note: innerHTML is safe here for static structure.
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
        return id;
    }

    removeMessage(id) {
        document.getElementById(id)?.remove();
    }
}

export const chatManager = new ChatManager();
