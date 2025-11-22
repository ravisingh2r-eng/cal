/**
 * Analytics Integration
 * Google Analytics 4 and custom event tracking
 */

(function() {
    'use strict';

    const ANALYTICS_CONFIG = {
        gaTrackingId: 'G-XXXXXXXXXX', // Replace with actual GA4 tracking ID
        enabled: true,
        debug: false
    };

    /**
     * Initialize analytics
     */
    function init() {
        if (!ANALYTICS_CONFIG.enabled) {
            console.log('Analytics disabled');
            return;
        }

        // Load Google Analytics 4
        loadGA4();

        // Track initial page view
        trackPageView();

        // Setup automatic event tracking
        setupAutoTracking();
    }

    /**
     * Load Google Analytics 4 script
     */
    function loadGA4() {
        // Load gtag.js
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.gaTrackingId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            window.dataLayer.push(arguments);
        };
        gtag('js', new Date());
        gtag('config', ANALYTICS_CONFIG.gaTrackingId, {
            send_page_view: false // We'll track manually
        });

        console.log('Google Analytics 4 initialized');
    }

    /**
     * Track page view
     */
    function trackPageView(pagePath = window.location.pathname) {
        if (typeof gtag !== 'function') return;

        gtag('event', 'page_view', {
            page_path: pagePath,
            page_title: document.title,
            page_location: window.location.href
        });

        if (ANALYTICS_CONFIG.debug) {
            console.log('Page view tracked:', pagePath);
        }
    }

    /**
     * Track custom event
     */
    function trackEvent(category, action, label = '', value = 0) {
        if (typeof gtag !== 'function') return;

        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });

        if (ANALYTICS_CONFIG.debug) {
            console.log('Event tracked:', { category, action, label, value });
        }
    }

    /**
     * Track calculator usage
     */
    function trackCalculation(calculatorType, inputs, result) {
        trackEvent('calculator', 'calculate', calculatorType);

        // Send calculator-specific data
        gtag('event', 'calculator_used', {
            calculator_type: calculatorType,
            ...inputs
        });
    }

    /**
     * Track button clicks
     */
    function trackButtonClick(buttonName) {
        trackEvent('engagement', 'button_click', buttonName);
    }

    /**
     * Track outbound links
     */
    function trackOutboundLink(url) {
        trackEvent('outbound', 'click', url);
    }

    /**
     * Track social shares
     */
    function trackShare(platform) {
        trackEvent('social', 'share', platform);
    }

    /**
     * Track errors
     */
    function trackError(errorMessage, errorType = 'javascript') {
        trackEvent('error', errorType, errorMessage);
    }

    /**
     * Track timing
     */
    function trackTiming(category, variable, time) {
        if (typeof gtag !== 'function') return;

        gtag('event', 'timing_complete', {
            name: variable,
            value: time,
            event_category: category
        });
    }

    /**
     * Setup automatic event tracking
     */
    function setupAutoTracking() {
        // Track all outbound links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.hostname !== window.location.hostname) {
                trackOutboundLink(link.href);
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.id) {
                trackEvent('form', 'submit', form.id);
            }
        });

        // Track JavaScript errors
        window.addEventListener('error', (e) => {
            trackError(e.message, 'javascript_error');
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            trackError(e.reason, 'promise_rejection');
        });

        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                trackEvent('engagement', 'page_hidden');
            } else {
                trackEvent('engagement', 'page_visible');
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', APP.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
                maxScroll = scrollPercent;
                trackEvent('engagement', 'scroll_depth', `${scrollPercent}%`);
            }
        }, 500));
    }

    /**
     * Track user engagement time
     */
    function trackEngagementTime() {
        const startTime = Date.now();

        window.addEventListener('beforeunload', () => {
            const engagementTime = Math.round((Date.now() - startTime) / 1000);
            trackTiming('engagement', 'time_on_page', engagementTime);
        });
    }

    // Export public API
    window.trackPageView = trackPageView;
    window.trackEvent = trackEvent;
    window.trackCalculation = trackCalculation;
    window.trackButtonClick = trackButtonClick;
    window.trackOutboundLink = trackOutboundLink;
    window.trackShare = trackShare;
    window.trackError = trackError;

    window.Analytics = {
        trackPageView,
        trackEvent,
        trackCalculation,
        trackButtonClick,
        trackOutboundLink,
        trackShare,
        trackError,
        trackTiming
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Track engagement time
    trackEngagementTime();

})();
