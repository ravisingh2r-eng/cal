/**
 * Main Application Logic
 * Handles global app initialization, search, navigation, and utilities
 */

(function() {
    'use strict';

    // App Configuration
    const APP_CONFIG = {
        name: 'Calculator Platform',
        version: '1.0.0',
        debug: false
    };

    /**
     * Initialize the application
     */
    function init() {
        console.log(`${APP_CONFIG.name} v${APP_CONFIG.version} initialized`);

        // Initialize components
        initSearch();
        initMobileMenu();
        initStickyAd();
        initScrollEffects();
        initKeyboardShortcuts();

        // Log page view
        if (typeof trackPageView === 'function') {
            trackPageView();
        }
    }

    /**
     * Initialize search functionality
     */
    function initSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.querySelector('.search-btn');

        if (!searchInput) return;

        // Search on input
        searchInput.addEventListener('input', debounce(handleSearch, 300));

        // Search on button click
        if (searchBtn) {
            searchBtn.addEventListener('click', () => handleSearch());
        }

        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    /**
     * Handle search functionality
     */
    function handleSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        const query = searchInput.value.toLowerCase().trim();
        const calculatorCards = document.querySelectorAll('.calculator-card');

        if (!query) {
            // Show all cards
            calculatorCards.forEach(card => {
                card.style.display = '';
                card.classList.remove('fade-in');
            });
            return;
        }

        let visibleCount = 0;
        calculatorCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';

            if (title.includes(query) || description.includes(query)) {
                card.style.display = '';
                card.classList.add('fade-in');
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Track search
        if (typeof trackEvent === 'function') {
            trackEvent('search', 'query', query);
        }
    }

    /**
     * Initialize mobile menu toggle
     */
    function initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const mainNav = document.querySelector('.main-nav');

        if (!menuToggle || !mainNav) return;

        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');

            // Animate hamburger icon
            const spans = menuToggle.querySelectorAll('span');
            if (menuToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
            } else {
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    /**
     * Initialize sticky mobile ad
     */
    function initStickyAd() {
        const stickyAd = document.getElementById('stickyMobileAd');
        if (!stickyAd) return;

        const closeBtn = stickyAd.querySelector('.ad-close');

        // Show ad after 3 seconds on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                stickyAd.style.display = 'block';
                stickyAd.classList.add('slide-up');
            }, 3000);
        }

        // Close ad
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                stickyAd.style.display = 'none';
                // Save preference
                localStorage.setItem('stickyAdClosed', 'true');
            });
        }

        // Check if user previously closed ad
        if (localStorage.getItem('stickyAdClosed') === 'true') {
            stickyAd.style.display = 'none';
        }
    }

    /**
     * Initialize scroll effects
     */
    function initScrollEffects() {
        const header = document.querySelector('.header');
        let lastScroll = 0;

        window.addEventListener('scroll', throttle(() => {
            const currentScroll = window.pageYOffset;

            // Add shadow to header on scroll
            if (currentScroll > 10) {
                header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '';
            }

            // Hide/show header on scroll (optional)
            // if (currentScroll > lastScroll && currentScroll > 100) {
            //     header.style.transform = 'translateY(-100%)';
            // } else {
            //     header.style.transform = 'translateY(0)';
            // }

            lastScroll = currentScroll;
        }, 100));
    }

    /**
     * Initialize global keyboard shortcuts
     */
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }

            // Escape to clear search
            if (e.key === 'Escape') {
                const searchInput = document.getElementById('searchInput');
                if (searchInput && document.activeElement === searchInput) {
                    searchInput.value = '';
                    handleSearch();
                    searchInput.blur();
                }
            }
        });
    }

    /**
     * Debounce function to limit function calls
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function to limit function calls
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Format number with commas
     */
    function formatNumber(num, decimals = 0) {
        if (isNaN(num)) return '0';
        return Number(num).toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    /**
     * Format currency (INR)
     */
    function formatCurrency(num, decimals = 0) {
        if (isNaN(num)) return '₹ 0';
        return '₹ ' + formatNumber(num, decimals);
    }

    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).then(() => {
                showNotification('Copied to clipboard!', 'success');
            }).catch(err => {
                console.error('Failed to copy:', err);
                showNotification('Failed to copy', 'error');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showNotification('Copied to clipboard!', 'success');
            } catch (err) {
                console.error('Failed to copy:', err);
                showNotification('Failed to copy', 'error');
            }
            document.body.removeChild(textArea);
        }
    }

    /**
     * Show notification/toast
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} notification-slide`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background-color: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#4F46E5'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    /**
     * Validate email
     */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Validate phone number (Indian)
     */
    function validatePhone(phone) {
        const re = /^[6-9]\d{9}$/;
        return re.test(phone.replace(/\s/g, ''));
    }

    // Export utility functions globally
    window.APP = {
        config: APP_CONFIG,
        formatNumber,
        formatCurrency,
        copyToClipboard,
        showNotification,
        validateEmail,
        validatePhone,
        debounce,
        throttle
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
