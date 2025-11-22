/**
 * AdSense Configuration
 * Configure all ad settings and placements
 */

const ADS_CONFIG = {
    // AdSense Publisher ID - Replace with your actual ID
    publisherId: 'ca-pub-XXXXXXXXXX',

    // Ad Slots - Replace with your actual slot IDs
    slots: {
        'ad-slot-top': {
            id: '1234567890',
            format: 'horizontal',
            fullWidthResponsive: true
        },
        'ad-slot-middle': {
            id: '2345678901',
            format: 'horizontal',
            fullWidthResponsive: true
        },
        'ad-slot-bottom': {
            id: '3456789012',
            format: 'horizontal',
            fullWidthResponsive: true
        },
        'ad-slot-sidebar': {
            id: '4567890123',
            format: 'rectangle',
            fullWidthResponsive: false
        },
        'ad-slot-sticky-mobile': {
            id: '5678901234',
            format: 'auto',
            fullWidthResponsive: true
        },
        'ad-slot-in-content': {
            id: '6789012345',
            format: 'auto',
            fullWidthResponsive: true
        }
    },

    // Ad Refresh Settings
    refresh: {
        enabled: true,
        interval: 30000, // 30 seconds
        viewabilityThreshold: 0.5 // 50% viewable
    },

    // Lazy Loading
    lazyLoad: {
        enabled: true,
        offset: 200 // pixels
    },

    // Fallback Ad Network (Media.net, PropellerAds, etc.)
    fallback: {
        enabled: true,
        provider: 'media.net',
        publisherId: 'XXXXXXXX'
    },

    // High CPC Keywords by Page
    keywords: {
        'emi-calculator': [
            'personal loan',
            'instant loan',
            'home loan emi',
            'car loan emi',
            'loan apply online',
            'quick loan approval',
            'best loan rates'
        ],
        'loan-calculator': [
            'instant personal loan',
            'online loan',
            'quick loan',
            'loan approval',
            'best loan offers',
            'low interest loan'
        ],
        'gst-calculator': [
            'gst registration',
            'gst software',
            'business loan',
            'accounting software',
            'tax filing',
            'gst compliance'
        ],
        'income-tax-calculator': [
            'income tax',
            'tax saving',
            'tax planning',
            'tax filing',
            'investment plans',
            'tax calculator',
            'tax refund'
        ],
        'sip-calculator': [
            'mutual funds',
            'sip investment',
            'wealth management',
            'investment advisor',
            'best mutual funds',
            'sip plans'
        ],
        'bmi-calculator': [
            'weight loss',
            'fitness',
            'health insurance',
            'diet plans',
            'gym membership',
            'nutrition',
            'weight management'
        ],
        'default': [
            'calculator',
            'online tools',
            'finance calculator',
            'free calculator'
        ]
    },

    // Debug Mode
    debug: false
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ADS_CONFIG;
} else {
    window.ADS_CONFIG = ADS_CONFIG;
}
