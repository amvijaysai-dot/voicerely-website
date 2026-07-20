/**
 * Phone Demo Module
 * Unified PhoneController for all phone interactions
 */

const PhoneController = {
    // Persistent screens
    SCREENS: {
        READY: 'ready',
        DIALPAD: 'dialpad',
        CALLING: 'calling',
        CALL_INITIATED: 'call-initiated'
    },

    // Current state
    currentScreen: null,

    // Initialize phone with mode
    init(config) {
        this.currentScreen = this.SCREENS.READY;
        this._showScreen(this.SCREENS.READY);
    },

    // Set screen (persistent)
    setScreen(screenName) {
        this._hideAllScreens();
        this._showScreen(screenName);
        this.currentScreen = screenName;
    },

    // Reset to initial state
    reset() {
        this._hideAllScreens();
        this._showScreen(this.SCREENS.READY);
        this.currentScreen = this.SCREENS.READY;
    },

    // Internal: show screen
    _showScreen(screenName) {
        const screen = document.getElementById(screenName);
        if (screen) {
            screen.classList.add('active');
        }
    },

    // Internal: hide all screens
    _hideAllScreens() {
        const screens = document.querySelectorAll('.demo-screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    PhoneController.init({ mode: 'default' });
    initPhoneStatusRotator();
});

// Status rotator for the phone mockup status indicator
function initPhoneStatusRotator() {
    const items = document.querySelectorAll('.status-rotator .status-item');
    if (!items.length) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let current = 0;
    setInterval(() => {
        // Add active to next item first, then remove from current (prevents gap)
        const next = (current + 1) % items.length;
        items[next].classList.add('active');
        items[current].classList.remove('active');
        current = next;
    }, 2000);
}

// Export for use
window.phone = PhoneController;

// ============================================================
// Phone Demo Flow Functions
// ============================================================

// Start the demo flow - go to dialpad
function startDemoFlow() {
    PhoneController.setScreen(PhoneController.SCREENS.DIALPAD);
}

// Validate and submit phone number - calls real API to initiate call via Retell AI
async function submitPhoneNumber() {
    const phoneInput = document.getElementById('demoPhoneNumber');
    const countrySelect = document.querySelector('select[aria-label="Country Code Prefix Selection"]');
    const phoneValue = phoneInput ? phoneInput.value.trim() : '';
    const countryCode = countrySelect ? countrySelect.value : '+1';

    // Combine country code and phone number
    const fullPhone = `${countryCode}${phoneValue}`;

    // Client-side E.164 validation
    // Must start with + followed by 1-15 digits (E.164 format)
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(fullPhone)) {
        phoneInput && phoneInput.classList.add('border-red-500');
        showError('Invalid phone number format. Please use E.164 format (e.g., +15551234567)');
        return false;
    }

    phoneInput && phoneInput.classList.remove('border-red-500');

    // Show calling animation with loading state
    PhoneController.setScreen(PhoneController.SCREENS.CALLING);
    setLoadingState(true);

    try {
        // Call the API to initiate real phone call via Retell AI
        const response = await fetch('/api/start-demo-call', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone: fullPhone })
        });

        const data = await response.json();

        if (data.success) {
            // Call initiated successfully - show call initiated screen
            PhoneController.setScreen(PhoneController.SCREENS.CALL_INITIATED);
            setLoadingState(false);
        } else {
            // API returned error - show error state
            PhoneController.setScreen(PhoneController.SCREENS.DIALPAD);
            phoneInput && phoneInput.classList.add('border-red-500');
            // Show user-friendly error message (including rate limit errors)
            showError(data.error || 'Something went wrong — please try again');
            setLoadingState(false);
        }
    } catch (error) {
        // Network or unexpected error
        PhoneController.setScreen(PhoneController.SCREENS.DIALPAD);
        phoneInput && phoneInput.classList.add('border-red-500');
        console.error('Error initiating call:', error);
        showError('Something went wrong — please try again');
        setLoadingState(false);
    }

    return true;
}

// Set loading state on submit button
function setLoadingState(isLoading) {
    const submitBtn = document.querySelector('button[onclick="submitPhoneNumber()"]');
    if (submitBtn) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
            `;
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                Call Me
            `;
        }
    }
}

// Helper to show user-friendly error message
function showError(message) {
    // Remove any existing error
    hideError();

    const phoneInput = document.getElementById('demoPhoneNumber');
    if (phoneInput) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'phoneError';
        errorDiv.className = 'text-red-500 text-xs mt-1 font-mono';
        errorDiv.textContent = message;
        phoneInput.parentNode.appendChild(errorDiv);
    }
}

// Helper to hide error message
function hideError() {
    const existingError = document.getElementById('phoneError');
    if (existingError) {
        existingError.remove();
    }
}

// Reset demo - returns to original hero screen
function resetDemo() {
    // Reset phone number input
    const phoneInput = document.getElementById('demoPhoneNumber');
    if (phoneInput) {
        phoneInput.value = '';
        phoneInput.classList.remove('border-red-500');
    }

    // Reset country selector to default
    const countrySelect = document.querySelector('select[aria-label="Country Code Prefix Selection"]');
    if (countrySelect) {
        countrySelect.selectedIndex = 0;
    }

    // Reset PhoneController state
    PhoneController.reset();
    hideError();
}

// ============================================================
// Backward Compatibility Wrappers
// ============================================================

// For howitworks.html - toggle between ready and dialpad
function togglePhoneScreen(view) {
    if (view === 'agent') {
        PhoneController.setScreen(PhoneController.SCREENS.READY);
    } else if (view === 'dialpad') {
        PhoneController.setScreen(PhoneController.SCREENS.DIALPAD);
    }
}

// For howitworks.html - show calling status
function simulateDialPipeline() {
    PhoneController.setScreen(PhoneController.SCREENS.CALLING);

    setTimeout(() => {
        PhoneController.setScreen(PhoneController.SCREENS.CALL_INITIATED);
    }, 2000);
}

// Export functions
window.startDemoFlow = startDemoFlow;
window.submitPhoneNumber = submitPhoneNumber;
window.resetDemo = resetDemo;
window.togglePhoneScreen = togglePhoneScreen;
window.simulateDialPipeline = simulateDialPipeline;