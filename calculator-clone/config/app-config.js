/**
 * Application Configuration
 * Main app settings and constants
 */

const APP_CONFIG = {
    // App Information
    name: 'Calculator Platform',
    version: '1.0.0',
    description: 'Free online calculators for all your needs',
    url: 'https://www.calculator.com',

    // API Endpoints (if using backend)
    api: {
        baseUrl: '/api',
        endpoints: {
            currencyRates: '/currency-rates.php',
            saveCalculation: '/save-calculation.php',
            analytics: '/analytics-tracker.php'
        }
    },

    // Feature Flags
    features: {
        pwa: true,
        darkMode: true,
        offlineMode: true,
        voiceInput: false, // Requires Web Speech API implementation
        exportPDF: true,
        shareResults: true,
        saveHistory: true,
        ads: true
    },

    // Storage Settings
    storage: {
        maxHistoryItems: 50,
        cacheExpiry: 86400000, // 24 hours in milliseconds
        prefix: 'calc-'
    },

    // Calculator Categories
    categories: {
        financial: {
            name: 'Financial Calculators',
            calculators: [
                'emi-calculator',
                'loan-calculator',
                'sip-calculator',
                'fd-calculator',
                'rd-calculator',
                'ppf-calculator',
                'gst-calculator',
                'income-tax-calculator',
                'simple-interest-calculator',
                'compound-interest-calculator'
            ]
        },
        scientific: {
            name: 'Scientific & Basic',
            calculators: [
                'basic-calculator',
                'scientific-calculator',
                'percentage-calculator',
                'discount-calculator'
            ]
        },
        health: {
            name: 'Health Calculators',
            calculators: [
                'bmi-calculator',
                'calorie-calculator',
                'age-calculator',
                'pregnancy-calculator'
            ]
        },
        converters: {
            name: 'Converters',
            calculators: [
                'currency-converter',
                'unit-converter'
            ]
        }
    },

    // Calculator Metadata
    calculators: {
        'emi-calculator': {
            name: 'EMI Calculator',
            description: 'Calculate loan EMI with amortization schedule',
            icon: 'emi.svg',
            popular: true
        },
        'gst-calculator': {
            name: 'GST Calculator',
            description: 'Calculate GST inclusive and exclusive amounts',
            icon: 'gst.svg',
            popular: true
        },
        'bmi-calculator': {
            name: 'BMI Calculator',
            description: 'Calculate Body Mass Index and health category',
            icon: 'bmi.svg',
            popular: true
        }
        // Add more calculator metadata as needed
    },

    // SEO Settings
    seo: {
        siteName: 'Calculator Platform',
        defaultTitle: 'Free Online Calculator - Scientific, Financial, Health & More',
        defaultDescription: 'Free online calculators for all your needs. 20+ calculators including scientific, EMI, loan, BMI, GST and more.',
        defaultKeywords: 'calculator, online calculator, free calculator, scientific calculator, emi calculator',
        ogImage: '/assets/images/og-image.jpg',
        twitterHandle: '@calculatorapp'
    },

    // Social Media
    social: {
        facebook: 'https://facebook.com/calculatorapp',
        twitter: 'https://twitter.com/calculatorapp',
        linkedin: 'https://linkedin.com/company/calculatorapp'
    },

    // Contact
    contact: {
        email: 'support@calculator.com',
        supportUrl: '/contact.html'
    },

    // Legal
    legal: {
        privacyPolicy: '/privacy.html',
        termsOfService: '/terms.html',
        disclaimer: 'These calculators are provided for informational purposes only. Always consult with professionals for important financial or health decisions.'
    },

    // Performance
    performance: {
        enableLazyLoading: true,
        enableServiceWorker: true,
        cacheStaticAssets: true
    },

    // Debug Mode
    debug: false
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
} else {
    window.APP_CONFIG = APP_CONFIG;
}
