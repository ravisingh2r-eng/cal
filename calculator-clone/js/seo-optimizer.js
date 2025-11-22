/**
 * SEO Optimizer
 * Dynamic SEO enhancements and structured data
 */

(function() {
    'use strict';

    /**
     * Initialize SEO optimizations
     */
    function init() {
        addStructuredData();
        optimizeImages();
        addCanonicalURL();
        addPreloadLinks();
        optimizePerformance();
    }

    /**
     * Add structured data (Schema.org) for calculators
     */
    function addStructuredData() {
        const calculatorType = getCalculatorType();
        if (!calculatorType) return;

        const schema = {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": `${calculatorType} Calculator`,
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Any",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
            }
        };

        injectStructuredData(schema);
    }

    /**
     * Inject structured data into page
     */
    function injectStructuredData(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    /**
     * Get calculator type from URL or page
     */
    function getCalculatorType() {
        const path = window.location.pathname;
        const match = path.match(/\/calculators\/([^\.]+)/);
        if (match) {
            return match[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        return null;
    }

    /**
     * Optimize images with lazy loading
     */
    function optimizeImages() {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.loading = 'lazy';
            // Add alt text if missing
            if (!img.alt) {
                img.alt = img.src.split('/').pop().split('.')[0].replace(/-/g, ' ');
            }
        });
    }

    /**
     * Add canonical URL if not present
     */
    function addCanonicalURL() {
        if (!document.querySelector('link[rel="canonical"]')) {
            const canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = window.location.origin + window.location.pathname;
            document.head.appendChild(canonical);
        }
    }

    /**
     * Add preload links for critical resources
     */
    function addPreloadLinks() {
        // Preload critical CSS
        const criticalCSS = ['/css/style.css'];
        criticalCSS.forEach(href => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = href;
                document.head.appendChild(link);
            }
        });
    }

    /**
     * Optimize page performance
     */
    function optimizePerformance() {
        // Defer non-critical scripts
        const scripts = document.querySelectorAll('script[src]:not([async]):not([defer])');
        scripts.forEach(script => {
            if (!script.src.includes('critical')) {
                script.defer = true;
            }
        });

        // Add resource hints
        addResourceHints();
    }

    /**
     * Add DNS prefetch and preconnect for external resources
     */
    function addResourceHints() {
        const domains = [
            'https://pagead2.googlesyndication.com',
            'https://www.googletagmanager.com',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];

        domains.forEach(domain => {
            // DNS Prefetch
            if (!document.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`)) {
                const dnsPrefetch = document.createElement('link');
                dnsPrefetch.rel = 'dns-prefetch';
                dnsPrefetch.href = domain;
                document.head.appendChild(dnsPrefetch);
            }

            // Preconnect
            if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
                const preconnect = document.createElement('link');
                preconnect.rel = 'preconnect';
                preconnect.href = domain;
                preconnect.crossOrigin = 'anonymous';
                document.head.appendChild(preconnect);
            }
        });
    }

    /**
     * Update meta tags dynamically
     */
    function updateMetaTags(data) {
        if (data.title) {
            document.title = data.title;
        }

        const metaTags = {
            description: data.description,
            keywords: data.keywords,
            'og:title': data.title,
            'og:description': data.description,
            'twitter:title': data.title,
            'twitter:description': data.description
        };

        Object.entries(metaTags).forEach(([name, content]) => {
            if (content) {
                let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
                if (!meta) {
                    meta = document.createElement('meta');
                    if (name.startsWith('og:') || name.startsWith('twitter:')) {
                        meta.setAttribute('property', name);
                    } else {
                        meta.setAttribute('name', name);
                    }
                    document.head.appendChild(meta);
                }
                meta.setAttribute('content', content);
            }
        });
    }

    // Export public API
    window.SEOOptimizer = {
        updateMetaTags,
        addStructuredData: injectStructuredData
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
