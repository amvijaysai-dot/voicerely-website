/**
 * Schedule Page JavaScript
 * Handles Cal.com modal opening
 */

// Open Cal.com booking modal
function openCalModal() {
    if (typeof Cal !== 'undefined' && Cal.ns && Cal.ns.demo) {
        Cal.ns.demo('open');
    } else {
        // Fallback: redirect to Cal.com booking page
        window.location.href = 'https://cal.com/amvijaysai1/demo';
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to elements
    const elements = document.querySelectorAll('.schedule-fade-in');
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
});

// Export for global use
window.openCalModal = openCalModal;