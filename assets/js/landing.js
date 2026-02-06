
/**
 * @file landing.js
 * @description Landing Page Logic & Security Verification
 */

document.addEventListener('DOMContentLoaded', () => {
    initTerminal();
    initAgentModal();
});

// === TERMINAL TYPING EFFECT ===
function initTerminal() {
    const text = "whoami";
    const delay = 100;
    const element = document.getElementById('typed-command');
    const result = document.getElementById('execution-result');
    const cursor = document.getElementById('typing-cursor');

    if (!element || !result) return;

    let i = 0;

    setTimeout(() => {
        const interval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;

            if (i >= text.length) {
                clearInterval(interval);
                setTimeout(() => {
                    result.style.display = 'block';
                    cursor.style.display = 'none'; // Move cursor or hide
                    // Optional: Move cursor to new prompt line if exists
                    const newCursor = document.querySelector('#execution-result .t-cursor');
                    if (newCursor) newCursor.classList.add('blink');
                }, 300);
            }
        }, delay);
    }, 1000);
}

// === AGENT MODAL & SECURITY CHECK ===
function initAgentModal() {
    const btn = document.getElementById('open-agent-btn');
    const modal = document.getElementById('agent-modal');
    const closeBtn = document.getElementById('close-agent-btn');

    if (!btn || !modal) return;

    btn.addEventListener('click', () => {
        modal.classList.add('active');
        // Turnstile renders automatically via script tag in index.html, 
        // or we can render explicitly if needed.
    });

    closeBtn?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Global Callback for Turnstile
    window.onTurnstileSuccess = async function (token) {
        try {
            const response = await fetch('/verify-turnstile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            const data = await response.json();

            if (data.success) {
                // Redirect to secured agent interface
                // The backend sets a HttpOnly cookie 'zain_auth_token=verified'
                window.location.href = 'agent.html';
            } else {
                alert('Security Check Failed');
                // turnstile.reset();
            }
        } catch (e) {
            console.error(e);
            alert('Verification Error');
        }
    };
}
