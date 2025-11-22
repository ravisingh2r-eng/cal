/**
 * Mobile Navigation Menu
 * Hamburger menu for mobile devices
 */

(function() {
    'use strict';

    function init() {
        addMobileMenuButton();
        setupMobileMenu();
    }

    function addMobileMenuButton() {
        const headerContent = document.querySelector('.header-content');
        if (!headerContent) return;

        // Add hamburger button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.innerHTML = '☰';
        toggleBtn.setAttribute('aria-label', 'Toggle menu');
        headerContent.appendChild(toggleBtn);

        // Add overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);

        // Add close button to nav
        const nav = document.querySelector('.main-nav');
        if (nav) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'mobile-menu-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.setAttribute('aria-label', 'Close menu');
            nav.insertBefore(closeBtn, nav.firstChild);
        }
    }

    function setupMobileMenu() {
        const toggleBtn = document.querySelector('.mobile-menu-toggle');
        const closeBtn = document.querySelector('.mobile-menu-close');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const nav = document.querySelector('.main-nav');
        const dropdowns = document.querySelectorAll('.dropdown');

        if (!toggleBtn || !nav) return;

        // Toggle menu
        toggleBtn.addEventListener('click', function() {
            nav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close menu
        function closeMenu() {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeMenu);
        }

        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        // Handle dropdowns in mobile
        dropdowns.forEach(function(dropdown) {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });

        // Close on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
