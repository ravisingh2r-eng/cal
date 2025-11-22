/**
 * Google Analytics 4 (GA4) Event Tracking
 * Enhanced tracking for calculator usage and user behavior
 */

(function() {
    'use strict';

    // Configuration
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 Measurement ID

    // Initialize GA4
    function initAnalytics() {
        // Check if gtag is already loaded
        if (typeof gtag !== 'undefined') {
            console.log('Google Analytics initialized');
            return;
        }

        // Load gtag.js if not already loaded
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
            'send_page_view': true,
            'anonymize_ip': true // GDPR compliance
        });
    }

    // Track Calculator Usage
    window.trackCalculation = function(calculatorType, inputs, results) {
        if (typeof gtag === 'undefined') {
            console.warn('Google Analytics not loaded');
            return;
        }

        // Main calculation event
        gtag('event', 'calculate', {
            'event_category': 'Calculator',
            'event_label': calculatorType,
            'calculator_type': calculatorType,
            'value': 1
        });

        // Track specific calculator metrics
        gtag('event', calculatorType + '_calculation', {
            'event_category': 'Calculator_Detailed',
            'event_label': calculatorType,
            'inputs': JSON.stringify(inputs),
            'non_interaction': false
        });

        // Track user engagement
        gtag('event', 'user_engagement', {
            'engagement_time_msec': 100,
            'calculator_used': calculatorType
        });

        console.log('Analytics: Tracked calculation -', calculatorType);
    };

    // Track Page Views (Enhanced)
    function trackPageView() {
        if (typeof gtag === 'undefined') return;

        const page_title = document.title;
        const page_location = window.location.href;
        const page_path = window.location.pathname;

        gtag('event', 'page_view', {
            page_title: page_title,
            page_location: page_location,
            page_path: page_path
        });
    }

    // Track Button Clicks
    window.trackButtonClick = function(buttonName, category) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'button_click', {
            'event_category': category || 'Button',
            'event_label': buttonName,
            'button_name': buttonName
        });
    };

    // Track External Links
    function trackExternalLinks() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href) return;

            // Track external links
            if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        'event_category': 'External Link',
                        'event_label': href,
                        'transport_type': 'beacon'
                    });
                }
            }
        });
    }

    // Track Form Interactions
    window.trackFormInteraction = function(formName, action) {
        if (typeof gtag === 'undefined') return;

        gtag('event', action, {
            'event_category': 'Form',
            'event_label': formName,
            'form_name': formName
        });
    };

    // Track Errors
    window.trackError = function(errorMessage, errorType) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'exception', {
            'description': errorMessage,
            'error_type': errorType || 'general',
            'fatal': false
        });
    };

    // Track Calculator Results Viewed
    window.trackResultsView = function(calculatorType, resultType) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'view_results', {
            'event_category': 'Calculator',
            'event_label': calculatorType,
            'result_type': resultType
        });
    };

    // Track Time on Calculator
    let calculatorStartTime = Date.now();
    
    window.trackTimeOnCalculator = function(calculatorType) {
        if (typeof gtag === 'undefined') return;

        const timeSpent = Math.round((Date.now() - calculatorStartTime) / 1000);
        
        gtag('event', 'time_on_calculator', {
            'event_category': 'Engagement',
            'event_label': calculatorType,
            'value': timeSpent,
            'time_seconds': timeSpent
        });
    };

    // Track Ad Impressions
    window.trackAdImpression = function(adSlot, adPosition) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'ad_impression', {
            'event_category': 'Advertising',
            'event_label': adSlot,
            'ad_position': adPosition
        });
    };

    // Track Search (if you add search functionality)
    window.trackSearch = function(searchTerm) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'search', {
            'search_term': searchTerm
        });
    };

    // Track Social Shares (if you add share buttons)
    window.trackSocialShare = function(platform, contentType) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'share', {
            'method': platform,
            'content_type': contentType
        });
    };

    // Enhanced User Engagement Tracking
    let userEngagementTimer;
    function trackUserEngagement() {
        clearTimeout(userEngagementTimer);
        
        userEngagementTimer = setTimeout(function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'engaged_session', {
                    'event_category': 'Engagement',
                    'session_engaged': true
                });
            }
        }, 10000); // 10 seconds of activity = engaged session
    }

    // Track scroll depth
    let maxScroll = 0;
    function trackScrollDepth() {
        const scrollPercentage = Math.round(
            (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
        );

        if (scrollPercentage > maxScroll && scrollPercentage % 25 === 0) {
            maxScroll = scrollPercentage;
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll', {
                    'event_category': 'Engagement',
                    'event_label': scrollPercentage + '%',
                    'scroll_depth': scrollPercentage
                });
            }
        }
    }

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initAnalytics();
            trackExternalLinks();
            
            // Track user engagement
            document.addEventListener('mousemove', trackUserEngagement);
            document.addEventListener('keypress', trackUserEngagement);
            document.addEventListener('click', trackUserEngagement);
            
            // Track scroll depth
            window.addEventListener('scroll', trackScrollDepth);
        });
    } else {
        initAnalytics();
        trackExternalLinks();
    }

    // Track before page unload
    window.addEventListener('beforeunload', function() {
        const calculatorType = document.querySelector('h1')?.textContent || 'unknown';
        trackTimeOnCalculator(calculatorType);
    });

})();
