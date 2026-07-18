/**
 * Phone Demo Module
 * Handles phone mockup screen switching and real call initiation
 */

/**
 * Toggle between agent view and dialpad view in the phone mockup
 * @param {string} targetScreen - The screen to show ('agent' or 'dialpad')
 */
function togglePhoneScreen(targetScreen) {
    const agentView = document.getElementById('agentActiveView');
    const dialpadView = document.getElementById('dialpadActiveView');
    
    if (targetScreen === 'dialpad') {
        agentView.classList.add('hidden');
        agentView.classList.remove('flex');
        dialpadView.classList.remove('hidden');
        dialpadView.classList.add('flex');
    } else {
        dialpadView.classList.add('hidden');
        dialpadView.classList.remove('flex');
        agentView.classList.remove('hidden');
        agentView.classList.add('flex');
    }
}

/**
 * Initiate a real outbound call via the backend API
 * @param {HTMLElement} btnRef - Reference to the button element
 */
async function initiateCall(btnRef) {
    const dialpadView = document.getElementById('dialpadActiveView');
    const countrySelect = dialpadView.querySelector('select');
    const phoneInput = dialpadView.querySelector('input[type="tel"]');

    if (!phoneInput || !phoneInput.value.trim()) {
        console.warn('[ERROR] Phone number is empty');
        btnRef.innerHTML = 'FAILED - RETRY';
        return;
    }

    const phoneNumber = countrySelect.value + phoneInput.value.trim().replace(/\D/g, '');

    btnRef.disabled = true;
    btnRef.innerHTML = 'CONNECTING...';

    try {
        const response = await fetch('http://localhost:5000/api/make-call', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[ERROR] Call failed:', response.status, errorData);
            btnRef.innerHTML = 'FAILED - RETRY';
            btnRef.disabled = false;
            return;
        }

        const data = await response.json();
        console.log('[SUCCESS] Call initiated:', data);

        btnRef.innerHTML = 'DIALING...';
        setTimeout(() => {
            togglePhoneScreen('agent');
        }, 800);

    } catch (error) {
        console.error('[ERROR] Network error:', error.message);
        btnRef.innerHTML = 'FAILED - RETRY';
        btnRef.disabled = false;
    }
}

// Export for use in other modules
window.togglePhoneScreen = togglePhoneScreen;
window.simulateDialPipeline = initiateCall;