/**
 * SEO Configuration
 * Meta tags, structured data, and SEO settings for each page
 */

const SEO_CONFIG = {
    // Default Site-wide SEO
    default: {
        siteName: 'Calculator Platform',
        separator: ' | ',
        locale: 'en_US',
        twitterCardType: 'summary_large_image'
    },

    // Homepage SEO
    homepage: {
        title: 'Free Online Calculator - Scientific, Financial, Health & More',
        description: 'Free online calculators for all your needs. 20+ calculators including scientific, EMI, loan, BMI, GST and more. Fast, accurate, and easy to use.',
        keywords: 'calculator, online calculator, scientific calculator, emi calculator, loan calculator, bmi calculator, gst calculator, free calculator',
        canonical: 'https://www.calculator.com/'
    },

    // Calculator-specific SEO
    calculators: {
        'emi-calculator': {
            title: 'EMI Calculator - Calculate Loan EMI with Amortization Schedule',
            description: 'Free EMI Calculator to calculate Equated Monthly Installment for home loan, car loan, personal loan with detailed amortization schedule and charts.',
            keywords: 'emi calculator, loan emi calculator, home loan emi, car loan emi, personal loan calculator, amortization schedule, instant loan',
            h1: 'EMI Calculator - Calculate Loan EMI Online',
            canonical: 'https://www.calculator.com/calculators/emi-calculator.html'
        },
        'loan-calculator': {
            title: 'Loan Calculator - Calculate Personal, Home & Car Loan EMI',
            description: 'Free loan calculator for personal loans, home loans, car loans. Calculate EMI, interest, total payment with amortization schedule.',
            keywords: 'loan calculator, personal loan, home loan, car loan, instant loan, loan emi, quick loan',
            h1: 'Loan Calculator',
            canonical: 'https://www.calculator.com/calculators/loan-calculator.html'
        },
        'gst-calculator': {
            title: 'GST Calculator - Calculate GST Inclusive & Exclusive',
            description: 'Free GST Calculator to calculate GST inclusive and exclusive amounts. Support for 5%, 12%, 18%, 28% GST rates. Instant and accurate calculations.',
            keywords: 'gst calculator, gst calculation, gst inclusive, gst exclusive, goods and services tax calculator, gst rates',
            h1: 'GST Calculator',
            canonical: 'https://www.calculator.com/calculators/gst-calculator.html'
        },
        'income-tax-calculator': {
            title: 'Income Tax Calculator - Calculate Tax for Current Year',
            description: 'Free Income Tax Calculator for India. Calculate your income tax liability, tax savings, and plan your finances for the current financial year.',
            keywords: 'income tax calculator, tax calculator, income tax, tax saving, tax planning, tax calculator india',
            h1: 'Income Tax Calculator',
            canonical: 'https://www.calculator.com/calculators/income-tax-calculator.html'
        },
        'sip-calculator': {
            title: 'SIP Calculator - Calculate Mutual Fund SIP Returns',
            description: 'Free SIP Calculator to calculate Systematic Investment Plan returns. Plan your mutual fund investments with detailed projections.',
            keywords: 'sip calculator, mutual funds calculator, sip returns, investment calculator, systematic investment plan',
            h1: 'SIP Calculator',
            canonical: 'https://www.calculator.com/calculators/sip-calculator.html'
        },
        'bmi-calculator': {
            title: 'BMI Calculator - Calculate Your Body Mass Index',
            description: 'Free BMI Calculator to calculate your Body Mass Index. Check if you are underweight, normal, overweight or obese. Supports metric and imperial units.',
            keywords: 'bmi calculator, body mass index, bmi chart, weight calculator, health calculator, ideal weight',
            h1: 'BMI Calculator',
            canonical: 'https://www.calculator.com/calculators/bmi-calculator.html'
        },
        'basic-calculator': {
            title: 'Basic Calculator - Free Online Calculator with Memory Functions',
            description: 'Free basic calculator with memory functions, history, and keyboard support. Perfect for everyday calculations.',
            keywords: 'basic calculator, online calculator, free calculator, simple calculator, calculator with memory',
            h1: 'Basic Calculator',
            canonical: 'https://www.calculator.com/calculators/basic-calculator.html'
        },
        'scientific-calculator': {
            title: 'Scientific Calculator - Free Online Scientific Calculator',
            description: 'Free scientific calculator with trigonometry, logarithms, exponentials, and more. Perfect for students and professionals.',
            keywords: 'scientific calculator, online scientific calculator, trigonometry calculator, math calculator',
            h1: 'Scientific Calculator',
            canonical: 'https://www.calculator.com/calculators/scientific-calculator.html'
        }
    },

    // Structured Data Templates
    structuredData: {
        organization: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'Calculator Platform',
            'url': 'https://www.calculator.com',
            'logo': 'https://www.calculator.com/assets/images/logo.svg',
            'sameAs': [
                'https://facebook.com/calculatorapp',
                'https://twitter.com/calculatorapp'
            ]
        },
        website: {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'Calculator Platform',
            'url': 'https://www.calculator.com',
            'potentialAction': {
                '@type': 'SearchAction',
                'target': 'https://www.calculator.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
            }
        },
        breadcrumb: {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': []
        }
    },

    // Social Media Card Templates
    socialCards: {
        default: {
            'og:type': 'website',
            'og:site_name': 'Calculator Platform',
            'twitter:card': 'summary_large_image',
            'twitter:site': '@calculatorapp'
        }
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEO_CONFIG;
} else {
    window.SEO_CONFIG = SEO_CONFIG;
}
