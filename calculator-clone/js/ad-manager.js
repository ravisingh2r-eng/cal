/**
 * Centralized Ad Management System
 * Handles AdSense integration, ad placement, lazy loading, and refresh
 */

(function() {
    'use strict';

    // Ad Configuration
    const AD_CONFIG = {
        adsenseClientId: 'ca-pub-XXXXXXXXXX', // Replace with actual AdSense publisher ID
        enableAdRefresh: true,
        refreshInterval: 30000, // 30 seconds
        lazyLoadOffset: 200, // pixels
        fallbackProvider: 'media.net', // Fallback ad network
        debug: true
    };

    // High CPC Keywords for each calculator type
    const HIGH_CPC_KEYWORDS = {
        'emi-calculator': ['personal loan', 'instant loan', 'home loan emi', 'car loan emi', 'loan apply'],
        'loan-calculator': ['instant loan', 'personal loan online', 'quick loan', 'loan approval'],
        'gst-calculator': ['gst registration', 'gst software', 'business loan', 'accounting software'],
        'income-tax-calculator': ['income tax', 'tax saving', 'tax planning', 'investment plans'],
        'sip-calculator': ['mutual funds', 'sip investment', 'wealth management', 'investment advisor'],
        'bmi-calculator': ['weight loss', 'fitness', 'health insurance', 'diet plans'],
        'default': ['calculator', 'finance', 'tools', 'online calculator']
    };

    // Ad slot configuration
    const AD_SLOTS = [
        { id: 'ad-slot-top', type: 'horizontal', size: '728x90', enabled: true },
        { id: 'ad-slot-middle', type: 'horizontal', size: '728x90', enabled: true },
        { id: 'ad-slot-bottom', type: 'horizontal', size: '728x90', enabled: true },
        { id: 'ad-slot-sidebar', type: 'vertical', size: '300x250', enabled: true },
        { id: 'ad-slot-sticky-mobile', type: 'mobile-banner', size: '320x50', enabled: true }
    ];

    let adRefreshTimers = {};
    let viewableAds = new Set();

    /**
     * Initialize ad system
     */
    function init() {
        console.log('Ad Manager initialized');

        // Load AdSense script
        loadAdSenseScript();

        // Inject high CPC keywords
        injectKeywords();

        // Initialize ad slots
        initializeAdSlots();

        // Setup lazy loading
        setupLazyLoading();

        // Setup intersection observer for viewability
        setupViewabilityTracking();

        // Setup ad refresh
        if (AD_CONFIG.enableAdRefresh) {
            setupAdRefresh();
        }

        // Log ad impressions
        trackAdImpressions();
    }

    /**
     * Load AdSense script dynamically
     */
    function loadAdSenseScript() {
        if (document.querySelector('script[src*="adsbygoogle"]')) {
            return; // Already loaded
        }

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.adsenseClientId}`;
        script.crossOrigin = 'anonymous';
        script.onerror = () => {
            console.warn('AdSense failed to load, using fallback');
            loadFallbackAds();
        };
        document.head.appendChild(script);
    }

    /**
     * Inject high CPC keywords into page for better ad targeting
     */
    function injectKeywords() {
        const pagePath = window.location.pathname;
        const pageType = getPageType(pagePath);
        const keywords = HIGH_CPC_KEYWORDS[pageType] || HIGH_CPC_KEYWORDS.default;

        // Create hidden keyword div for ad targeting
        const keywordDiv = document.createElement('div');
        keywordDiv.className = 'cpc-keywords';
        keywordDiv.setAttribute('aria-hidden', 'true');
        keywordDiv.textContent = keywords.join(', ');
        document.body.appendChild(keywordDiv);

        if (AD_CONFIG.debug) {
            console.log('Injected keywords:', keywords);
        }
    }

    /**
     * Get page type from URL
     */
    function getPageType(path) {
        const match = path.match(/\/calculators\/([^\.]+)/);
        return match ? match[1] : 'default';
    }

    /**
     * Initialize all ad slots
     */
    function initializeAdSlots() {
        AD_SLOTS.forEach(slot => {
            if (!slot.enabled) return;

            const element = document.getElementById(slot.id);
            if (!element) return;

            // Create ad unit
            createAdUnit(element, slot);
        });
    }

    /**
     * Create AdSense ad unit
     */
    function createAdUnit(element, slot) {
        // Check if already has ad
        if (element.querySelector('ins.adsbygoogle')) return;

        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.setAttribute('data-ad-client', AD_CONFIG.adsenseClientId);

        // Set ad format based on type
        if (slot.type === 'horizontal') {
            ins.setAttribute('data-ad-slot', '1234567890'); // Replace with actual slot ID
            ins.setAttribute('data-ad-format', 'horizontal');
            ins.setAttribute('data-full-width-responsive', 'true');
        } else if (slot.type === 'vertical') {
            ins.setAttribute('data-ad-slot', '0987654321'); // Replace with actual slot ID
            ins.setAttribute('data-ad-format', 'rectangle');
        } else if (slot.type === 'mobile-banner') {
            ins.setAttribute('data-ad-slot', '1111111111'); // Replace with actual slot ID
            ins.setAttribute('data-ad-format', 'auto');
            ins.setAttribute('data-full-width-responsive', 'true');
        }

        element.appendChild(ins);

        // Push ad
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense push error:', e);
        }

        if (AD_CONFIG.debug) {
            console.log('Ad unit created:', slot.id);
        }
    }

    /**
     * Setup lazy loading for ads
     */
    function setupLazyLoading() {
        const adContainers = document.querySelectorAll('.ad-container');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const adSlot = entry.target.querySelector('.ad-slot');
                    if (adSlot && !adSlot.classList.contains('ad-loaded')) {
                        adSlot.classList.add('ad-loaded');
                        loadAd(adSlot);
                    }
                }
            });
        }, {
            rootMargin: `${AD_CONFIG.lazyLoadOffset}px`
        });

        adContainers.forEach(container => observer.observe(container));
    }

    /**
     * Load individual ad
     */
    function loadAd(element) {
        // Add loading animation
        element.classList.add('ad-loading');

        setTimeout(() => {
            element.classList.remove('ad-loading');
        }, 1000);

        if (AD_CONFIG.debug) {
            console.log('Ad loaded:', element.id);
        }
    }

    /**
     * Setup viewability tracking
     */
    function setupViewabilityTracking() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const adId = entry.target.id;

                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    // Ad is viewable (50% visible)
                    viewableAds.add(adId);

                    if (AD_CONFIG.debug) {
                        console.log('Ad viewable:', adId);
                    }

                    // Track viewable impression
                    if (typeof trackEvent === 'function') {
                        trackEvent('ad', 'viewable', adId);
                    }
                } else {
                    viewableAds.delete(adId);
                }
            });
        }, {
            threshold: 0.5
        });

        document.querySelectorAll('.ad-slot').forEach(ad => {
            observer.observe(ad);
        });
    }

    /**
     * Setup auto-refresh for viewable ads
     */
    function setupAdRefresh() {
        setInterval(() => {
            viewableAds.forEach(adId => {
                refreshAd(adId);
            });
        }, AD_CONFIG.refreshInterval);
    }

    /**
     * Refresh individual ad
     */
    function refreshAd(adId) {
        const adElement = document.getElementById(adId);
        if (!adElement) return;

        // Clear existing ad
        const existingAd = adElement.querySelector('ins.adsbygoogle');
        if (existingAd) {
            existingAd.remove();
        }

        // Create new ad unit
        const slot = AD_SLOTS.find(s => s.id === adId);
        if (slot) {
            createAdUnit(adElement, slot);
        }

        if (AD_CONFIG.debug) {
            console.log('Ad refreshed:', adId);
        }

        // Track refresh
        if (typeof trackEvent === 'function') {
            trackEvent('ad', 'refresh', adId);
        }
    }

    /**
     * Load fallback ads (Media.net or other)
     */
    function loadFallbackAds() {
        console.log('Loading fallback ads from', AD_CONFIG.fallbackProvider);

        // Implement fallback ad provider integration
        // This would load Media.net or another ad network
        // Example placeholder:
        document.querySelectorAll('.ad-slot').forEach(slot => {
            if (!slot.querySelector('.fallback-ad')) {
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = 'fallback-ad';
                fallbackDiv.textContent = 'Advertisement';
                fallbackDiv.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    background-color: #f3f4f6;
                    color: #9ca3af;
                `;
                slot.appendChild(fallbackDiv);
            }
        });
    }

    /**
     * Track ad impressions
     */
    function trackAdImpressions() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const adId = entry.target.id;

                    if (typeof trackEvent === 'function') {
                        trackEvent('ad', 'impression', adId);
                    }

                    // Unobserve after first impression
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        document.querySelectorAll('.ad-slot').forEach(ad => {
            observer.observe(ad);
        });
    }

    /**
     * Manually refresh all ads
     */
    function refreshAllAds() {
        AD_SLOTS.forEach(slot => {
            if (slot.enabled) {
                refreshAd(slot.id);
            }
        });
    }

    /**
     * Auto-place ads based on content length
     */
    function autoPlaceAds() {
        const contentSection = document.querySelector('.content-section');
        if (!contentSection) return;

        const paragraphs = contentSection.querySelectorAll('p');
        const totalParagraphs = paragraphs.length;

        // Insert ad after every 3-4 paragraphs
        if (totalParagraphs > 6) {
            const insertAfter = Math.floor(totalParagraphs / 2);
            const targetParagraph = paragraphs[insertAfter];

            if (targetParagraph) {
                const inContentAd = document.createElement('div');
                inContentAd.className = 'in-content-ad';
                inContentAd.innerHTML = `
                    <div class="ad-label">Advertisement</div>
                    <div class="ad-slot" id="ad-slot-in-content"></div>
                `;

                targetParagraph.after(inContentAd);

                // Initialize this ad
                const adSlot = inContentAd.querySelector('.ad-slot');
                createAdUnit(adSlot, {
                    id: 'ad-slot-in-content',
                    type: 'horizontal',
                    size: '728x90'
                });
            }
        }
    }

    // Export public methods
    window.AdManager = {
        refresh: refreshAd,
        refreshAll: refreshAllAds,
        autoPlace: autoPlaceAds
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
