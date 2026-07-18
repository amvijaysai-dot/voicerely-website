/**
 * Navigation Module
 * Handles mobile menu drawer functionality
 */

/**
 * Toggle mobile menu drawer open/close
 * @param {boolean} isOpen - Whether to open (true) or close (false) the menu
 */
function toggleMobileMenu(isOpen) {
    const backdrop = document.getElementById('mobileMenuDrawer');
    const panel = document.getElementById('mobileMenuPanel');
    
    if (isOpen) {
        backdrop.classList.remove('hidden');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            backdrop.classList.add('opacity-100');
            backdrop.classList.add('pointer-events-auto');
            panel.classList.remove('translate-x-full');
            panel.classList.add('translate-x-0');
        }, 10);
    } else {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');
        backdrop.classList.remove('pointer-events-auto');
        panel.classList.remove('translate-x-0');
        panel.classList.add('translate-x-full');
        setTimeout(() => {
            backdrop.classList.add('hidden');
        }, 300);
    }
}

// Export for use in other modules
window.toggleMobileMenu = toggleMobileMenu;