// ========================================
// Zain AI - Chat Logic
// Version: 2.0
// ========================================

let abortController = null;
let isGenerating = false;

// === SEND MESSAGE ===
async function send() {
    if (isGenerating) {
        debugLog('Already generating, ignoring send request');
        return;
    }

    const input = document.getElementById('in');
    const message = input.value.trim();

    // Validate message
    const validation = validateMessage(message);
    if (!validation.valid) {
        showToast(validation.error, 2000, 'error');
        return;
    }

    // Reset inactivity
    resetInactivity();

    // Disable input
    isGenerating = true;
    input.disabled = true;
    document.getElementById('send-btn').classList.add('opacity-50');

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Add user message to chat
    addMessage(message, 'user');
    toggleSendButton(true);
    scrollToBottom();

    // Show loading indicator
    const loadingId = addLoadingMessage();
    scrollToBottom();

    // Create abort controller
    abortController = new AbortController();

    try {
        const response = await fetch(getApiUrl('/chat'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken || storedKey}`
            },
            body: JSON.stringify({ message }),
            signal: abortController.signal
        });

        // Handle auth errors
        if (response.status === 401 || response.status === 403) {
            removeMessage(loadingId);
            addMessage("⚠️ Session expired. Logging out...", "ai");
            setTimeout(logout, 2000);
            return;
        }

        // Handle rate limit
        if (response.status === 429) {
            const errorData = await response.json();
            removeMessage(loadingId);

            // Show error message with click handler
            // Show error message with click handler
            const errorDiv = document.createElement('div');
            errorDiv.className = 'flex flex-col items-end';

            const msgDiv = document.createElement('div');
            msgDiv.className = 'msg-bubble ai-msg error-msg cursor-pointer';
            msgDiv.textContent = '⛔ Rate Limit Exceeded (Click for details)';
            msgDiv.onclick = () => openRateLimitModal(errorData.details);

            errorDiv.appendChild(msgDiv);
            document.getElementById('chat').appendChild(errorDiv);

            scrollToBottom();
            return;
        }

        // Parse response
        const data = await response.json();
        removeMessage(loadingId);

        // Add AI response
        addMessage(data.response, 'ai', data);

    } catch (e) {
        removeMessage(loadingId);

        if (e.name !== 'AbortError') {
            errorLog('Chat error:', e);
            addMessage("⚠️ Network error. Please try again.", "ai");
        } else {
            debugLog('Generation aborted by user');
        }
    } finally {
        // Re-enable input
        isGenerating = false;
        input.disabled = false;
        document.getElementById('send-btn').classList.remove('opacity-50');
        input.focus();

        toggleSendButton(false);
        abortController = null;
        scrollToBottom();
        resetInactivity();
    }
}

// === STOP GENERATION ===
async function stopGen() {
    if (abortController) {
        abortController.abort();
        abortController = null;
    }

    try {
        await fetch(getApiUrl('/stop'), { method: 'POST' });
    } catch (e) {
        debugLog('Stop request failed:', e);
    }
}

// === TOGGLE SEND/STOP BUTTON ===
function toggleSendButton(loading) {
    const sendBtn = document.getElementById('send-btn');
    const stopBtn = document.getElementById('stop-btn');

    if (loading) {
        sendBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
    } else {
        sendBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
    }
}

// === ADD MESSAGE TO CHAT ===
function addMessage(text, sender, metadata = null) {
    const chat = document.getElementById('chat');
    if (!chat) return null;

    const messageDiv = document.createElement('div');
    messageDiv.className = `flex flex-col ${sender === 'user' ? 'items-start' : 'items-end'}`;

    // Add metadata if present
    let metaHtml = '';
    if (metadata && metadata.model) {
        metaHtml = `<div class="flex gap-2 mt-1 text-[10px] text-zinc-500 font-mono">${metadata.model}</div>`;
    }

    // Create message bubble
    const bubbleClass = sender === 'user' ? 'user-msg' : 'ai-msg';
    messageDiv.innerHTML = `
        <div class="msg-bubble ${bubbleClass}">${escapeHtml(text).replace(/\n/g, '<br>')}</div>
        ${metaHtml}
    `;

    chat.appendChild(messageDiv);
    return messageDiv;
}

// === ADD LOADING INDICATOR ===
function addLoadingMessage() {
    const chat = document.getElementById('chat');
    if (!chat) return null;

    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.className = 'flex flex-col items-end';
    loadingDiv.innerHTML = `
        <div class="msg-bubble ai-msg flex gap-2 items-center loading-dots">
            <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
        </div>
    `;

    chat.appendChild(loadingDiv);
    return loadingId;
}

// === REMOVE MESSAGE ===
function removeMessage(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

// === LOAD CHAT HISTORY ===
async function loadHistory() {
    if (!sessionToken && !storedKey) return;

    try {
        const response = await fetch(getApiUrl('/history'), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionToken || storedKey}`
            }
        });

        if (!response.ok) {
            debugLog('Failed to load history:', response.status);
            return;
        }

        const data = await response.json();

        if (data.history && data.history.length > 0) {
            debugLog(`Loading ${data.history.length} messages from history`);

            data.history.forEach(msg => {
                if (msg.role !== 'system') {
                    addMessage(msg.content, msg.role === 'user' ? 'user' : 'ai');
                }
            });

            scrollToBottom();
        }

    } catch (e) {
        errorLog('Failed to load history:', e);
    }
}

// === RATE LIMIT MODAL ===
let limitTimerInterval = null;

function openRateLimitModal(details) {
    const modal = document.getElementById('limit-modal');
    if (!modal) return;

    // Update content
    document.getElementById('rl-role').innerText = (details.role || 'newuser').toUpperCase();
    document.getElementById('rl-limit').innerText = details.limit || '--';

    // Start countdown timer
    let timeLeft = details.reset_in_seconds || 0;
    const timerEl = document.getElementById('rl-timer');

    clearInterval(limitTimerInterval);

    limitTimerInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft <= 0) {
            timerEl.innerText = 'READY NOW';
            timerEl.className = 'text-green-400 font-mono font-bold animate-pulse';
            clearInterval(limitTimerInterval);
        } else {
            timerEl.innerText = formatDuration(timeLeft);
            timerEl.className = 'text-green-400 font-mono font-bold';
        }
    }, 1000);

    // Show modal
    modal.classList.remove('hidden');
}

function closeLimitModal() {
    const modal = document.getElementById('limit-modal');
    if (modal) {
        modal.classList.add('hidden');
    }

    clearInterval(limitTimerInterval);
}

// === ESCAPE HTML (prevent XSS) ===
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close modals
        if (!document.getElementById('profile-modal').classList.contains('hidden')) {
            closeProfile();
            return;
        }

        if (!document.getElementById('limit-modal').classList.contains('hidden')) {
            closeLimitModal();
            return;
        }

        // Stop generation
        if (abortController) {
            stopGen();
            return;
        }

        // Blur input
        const input = document.getElementById('in');
        if (document.activeElement === input) {
            input.blur();
        }
    }
});