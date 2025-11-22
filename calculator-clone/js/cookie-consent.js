/**
 * GDPR-Compliant Cookie Consent Banner
 * Manages user cookie preferences and analytics/ads consent
 */

(function() {
    'use strict';

    const COOKIE_CONSENT_KEY = 'calc_cookie_consent';
    const COOKIE_PREFERENCES_KEY = 'calc_cookie_preferences';

    // Check if consent has been given
    function hasConsent() {
        return localStorage.getItem(COOKIE_CONSENT_KEY) === 'true';
    }

    // Check if user declined
    function hasDeclined() {
        return localStorage.getItem(COOKIE_CONSENT_KEY) === 'false';
    }

    // Get cookie preferences
    function getPreferences() {
        const prefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
        return prefs ? JSON.parse(prefs) : {
            necessary: true,
            analytics: false,
            advertising: false
        };
    }

    // Save preferences
    function savePreferences(preferences) {
        localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
        localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    }

    // Create cookie banner HTML
    function createBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookieConsentBanner';
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = '<div class="cookie-consent-content">' +
            '<div class="cookie-consent-text">' +
            '<h4>🍪 Cookie Consent</h4>' +
            '<p>We use cookies to enhance your experience, analyze site traffic, and serve personalized ads. By clicking "Accept All", you consent to our use of cookies.</p>' +
            '</div>' +
            '<div class="cookie-consent-actions">' +
            '<button id="cookieAcceptAll" class="cookie-btn cookie-btn-accept">Accept All</button>' +
            '<button id="cookieReject" class="cookie-btn cookie-btn-reject">Reject All</button>' +
            '<button id="cookieCustomize" class="cookie-btn cookie-btn-customize">Customize</button>' +
            '</div>' +
            '</div>';
        document.body.appendChild(banner);
        
        // Add event listeners
        document.getElementById('cookieAcceptAll').addEventListener('click', acceptAll);
        document.getElementById('cookieReject').addEventListener('click', rejectAll);
        document.getElementById('cookieCustomize').addEventListener('click', showCustomize);
    }

    // Create customization modal
    function createCustomizeModal() {
        const modal = document.createElement('div');
        modal.id = 'cookieCustomizeModal';
        modal.className = 'cookie-modal';
        const prefs = getPreferences();
        
        modal.innerHTML = '<div class="cookie-modal-content">' +
            '<div class="cookie-modal-header">' +
            '<h3>Cookie Preferences</h3>' +
            '<button id="cookieModalClose" class="cookie-modal-close">&times;</button>' +
            '</div>' +
            '<div class="cookie-modal-body">' +
            '<div class="cookie-preference-item">' +
            '<div class="cookie-pref-info">' +
            '<h4>Necessary Cookies</h4>' +
            '<p>Required for the website to function. Cannot be disabled.</p>' +
            '</div>' +
            '<label class="cookie-switch">' +
            '<input type="checkbox" id="cookieNecessary" checked disabled>' +
            '<span class="cookie-slider"></span>' +
            '</label>' +
            '</div>' +
            '<div class="cookie-preference-item">' +
            '<div class="cookie-pref-info">' +
            '<h4>Analytics Cookies</h4>' +
            '<p>Help us understand how visitors interact with our website (Google Analytics).</p>' +
            '</div>' +
            '<label class="cookie-switch">' +
            '<input type="checkbox" id="cookieAnalytics" ' + (prefs.analytics ? 'checked' : '') + '>' +
            '<span class="cookie-slider"></span>' +
            '</label>' +
            '</div>' +
            '<div class="cookie-preference-item">' +
            '<div class="cookie-pref-info">' +
            '<h4>Advertising Cookies</h4>' +
            '<p>Used to show personalized ads through Google AdSense.</p>' +
            '</div>' +
            '<label class="cookie-switch">' +
            '<input type="checkbox" id="cookieAdvertising" ' + (prefs.advertising ? 'checked' : '') + '>' +
            '<span class="cookie-slider"></span>' +
            '</label>' +
            '</div>' +
            '</div>' +
            '<div class="cookie-modal-footer">' +
            '<button id="cookieSavePreferences" class="cookie-btn cookie-btn-accept">Save Preferences</button>' +
            '<button id="cookieCancelCustomize" class="cookie-btn cookie-btn-secondary">Cancel</button>' +
            '</div>' +
            '</div>';
        
        document.body.appendChild(modal);
        
        // Event listeners
        document.getElementById('cookieModalClose').addEventListener('click', closeModal);
        document.getElementById('cookieCancelCustomize').addEventListener('click', closeModal);
        document.getElementById('cookieSavePreferences').addEventListener('click', saveCustomPreferences);
        
        // Click outside to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Accept all cookies
    function acceptAll() {
        const preferences = {
            necessary: true,
            analytics: true,
            advertising: true
        };
        savePreferences(preferences);
        hideBanner();
        enableTracking();
        trackEvent('cookie_consent', 'accept_all');
    }

    // Reject all non-essential cookies
    function rejectAll() {
        const preferences = {
            necessary: true,
            analytics: false,
            advertising: false
        };
        savePreferences(preferences);
        hideBanner();
        disableTracking();
        trackEvent('cookie_consent', 'reject_all');
    }

    // Show customization modal
    function showCustomize() {
        createCustomizeModal();
        document.getElementById('cookieCustomizeModal').style.display = 'flex';
    }

    // Close modal
    function closeModal() {
        const modal = document.getElementById('cookieCustomizeModal');
        if (modal) {
            modal.remove();
        }
    }

    // Save custom preferences
    function saveCustomPreferences() {
        const preferences = {
            necessary: true,
            analytics: document.getElementById('cookieAnalytics').checked,
            advertising: document.getElementById('cookieAdvertising').checked
        };
        
        savePreferences(preferences);
        closeModal();
        hideBanner();
        
        if (preferences.analytics || preferences.advertising) {
            enableTracking();
        } else {
            disableTracking();
        }
        
        trackEvent('cookie_consent', 'customize');
    }

    // Hide banner
    function hideBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    // Enable tracking based on preferences
    function enableTracking() {
        const prefs = getPreferences();
        
        if (typeof gtag === 'function') {
            if (prefs.analytics) {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                });
            }
            
            if (prefs.advertising) {
                gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted'
                });
            }
        }
    }

    // Disable tracking
    function disableTracking() {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
            });
        }
    }

    // Track events
    function trackEvent(category, action) {
        if (typeof gtag === 'function') {
            gtag('event', action, {
                'event_category': category
            });
        }
    }

    // Initialize
    function init() {
        if (!hasConsent() && !hasDeclined()) {
            createBanner();
        } else {
            const prefs = getPreferences();
            if (prefs.analytics || prefs.advertising) {
                enableTracking();
            }
        }
    }

    // Expose public API
    window.CookieConsent = {
        showBanner: createBanner,
        showSettings: showCustomize,
        getPreferences: getPreferences,
        hasConsent: hasConsent
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
