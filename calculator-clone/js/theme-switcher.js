/**
 * Theme Switcher - Dark/Light Mode
 * Handles theme toggling and persistence
 */

(function() {
    'use strict';

    const THEME_KEY = 'calculator-theme';
    const THEMES = {
        LIGHT: 'light',
        DARK: 'dark'
    };

    let currentTheme = THEMES.LIGHT;

    /**
     * Initialize theme system
     */
    function init() {
        // Load saved theme or detect system preference
        loadTheme();

        // Setup theme toggle button
        setupToggleButton();

        // Listen for system theme changes
        watchSystemTheme();
    }

    /**
     * Load theme from storage or system preference
     */
    function loadTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);

        if (savedTheme) {
            currentTheme = savedTheme;
        } else {
            // Detect system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                currentTheme = THEMES.DARK;
            }
        }

        applyTheme(currentTheme);
    }

    /**
     * Apply theme to document
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        currentTheme = theme;

        // Update toggle button icon
        updateToggleIcon(theme);

        // Save to localStorage
        localStorage.setItem(THEME_KEY, theme);

        // Track theme change
        if (typeof trackEvent === 'function') {
            trackEvent('theme', 'change', theme);
        }

        console.log('Theme applied:', theme);
    }

    /**
     * Toggle between themes
     */
    function toggleTheme() {
        const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
        applyTheme(newTheme);
    }

    /**
     * Setup theme toggle button
     */
    function setupToggleButton() {
        const toggleBtn = document.getElementById('themeToggle');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', toggleTheme);

        // Keyboard accessibility
        toggleBtn.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }

    /**
     * Update toggle button icon
     */
    function updateToggleIcon(theme) {
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');

        if (!sunIcon || !moonIcon) return;

        if (theme === THEMES.DARK) {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }

    /**
     * Watch for system theme changes
     */
    function watchSystemTheme() {
        if (!window.matchMedia) return;

        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        darkModeQuery.addEventListener('change', (e) => {
            // Only apply if user hasn't manually set a preference
            if (!localStorage.getItem(THEME_KEY)) {
                const newTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
                applyTheme(newTheme);
            }
        });
    }

    /**
     * Get current theme
     */
    function getCurrentTheme() {
        return currentTheme;
    }

    /**
     * Set specific theme
     */
    function setTheme(theme) {
        if (Object.values(THEMES).includes(theme)) {
            applyTheme(theme);
        }
    }

    // Export public API
    window.ThemeSwitcher = {
        toggle: toggleTheme,
        getCurrentTheme,
        setTheme,
        THEMES
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
