/**
 * Theme Module
 * Handles theme switching functionality with localStorage persistence
 */

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('light');
    const isLight = html.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

/**
 * Initialize theme on page load - apply before first paint
 */
(function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light');
    }
})();

// Export for use in other modules
window.toggleTheme = toggleTheme;