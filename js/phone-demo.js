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

// New isolated status rotator for the phone mockup status indicator
function initPhoneStatusRotator() {
    const items = document.querySelectorAll('.status-rotator .status-item');
    if (!items.length) return;
    let current = 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setInterval(() => {
        items[current].classList.remove('active');
        current = (current + 1) % items.length;
        items[current].classList.add('active');
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
        // TODO: Add user-friendly error message display
        return false;
    }
    
    phoneInput && phoneInput.classList.remove('border-red-500');
    
    // Show calling animation
    PhoneController.setScreen(PhoneController.SCREENS.CALLING);
    
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
            
            // TODO: Implement client-side rate limiting (e.g., disable button for 60s after call)
            // TODO: Consider adding server-side rate limiting in /api/start-demo-call.js
        } else {
            // API returned error - show error state
            PhoneController.setScreen(PhoneController.SCREENS.DIALPAD);
            phoneInput && phoneInput.classList.add('border-red-500');
            // TODO: Show user-friendly error message (data.error)
            console.error('Call failed:', data.error);
        }
    } catch (error) {
        // Network or unexpected error
        PhoneController.setScreen(PhoneController.SCREENS.DIALPAD);
        phoneInput && phoneInput.classList.add('border-red-500');
        console.error('Error initiating call:', error);
        showError('Something went wrong — please try again');
    }
    
    return true;
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

// TODO: Add server-side rate limiting before public launch
// e.g., max 1 demo call per phone number per hour to prevent abuse
// Consider using Vercel Edge Middleware or a Redis-based rate limiter in /api/start-demo-call.js

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

// ============================================================
// Status Rotator - Rotating Status Indicator
// ============================================================

// Status rotator states
const STATUS_STATES = [
    { key: 'answering', text: 'Answering calls' },
    { key: 'booking', text: 'Booking appointments' },
    { key: 'qualifying', text: 'Qualifying leads' },
    { key: 'available', text: 'Available 24/7' }
];

let currentStatusIndex = 0;
let statusRotatorInterval = null;

// Check if reduced motion is preferred
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Initialize status rotator
function initStatusRotator() {
    // If reduced motion is preferred, show static "Available 24/7" state
    if (prefersReducedMotion()) {
        const statusItems = document.querySelectorAll('.status-item');
        statusItems.forEach(item => item.classList.remove('active'));
        const availableItem = document.querySelector('.status-item[data-status="available"]');
        if (availableItem) {
            availableItem.classList.add('active');
        }
        return;
    }

    // Start rotation
    statusRotatorInterval = setInterval(rotateStatus, 2400); // 2s visible + 400ms transition
}

// Rotate to next status
function rotateStatus() {
    const statusItems = document.querySelectorAll('.status-item');
    
    // Remove active class from current
    statusItems[currentStatusIndex].classList.remove('active');
    
    // Move to next
    currentStatusIndex = (currentStatusIndex + 1) % STATUS_STATES.length;
    
    // Add active class to next
    statusItems[currentStatusIndex].classList.add('active');
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (statusRotatorInterval) {
        clearInterval(statusRotatorInterval);
    }
});