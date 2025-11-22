/**
 * Social Share Functionality
 * Provides share buttons for WhatsApp, Facebook, Twitter, and Copy Link
 */

(function() {
    'use strict';

    // Initialize share buttons when DOM is ready
    function initShareButtons() {
        createShareButtons();
        attachShareEventListeners();
    }

    // Create share button HTML
    function createShareButtons() {
        const shareContainer = document.getElementById('shareButtons');
        if (!shareContainer) return;

        shareContainer.innerHTML = `
            <div class="share-buttons-wrapper">
                <h4>Share This Calculator</h4>
                <div class="share-buttons">
                    <button class="share-btn whatsapp-btn" data-share="whatsapp" title="Share on WhatsApp">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                    </button>

                    <button class="share-btn facebook-btn" data-share="facebook" title="Share on Facebook">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                    </button>

                    <button class="share-btn twitter-btn" data-share="twitter" title="Share on Twitter">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                    </button>

                    <button class="share-btn copy-link-btn" data-share="copy" title="Copy Link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        Copy Link
                    </button>
                </div>
            </div>
        `;
    }

    // Attach event listeners to share buttons
    function attachShareEventListeners() {
        const shareButtons = document.querySelectorAll('[data-share]');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', function() {
                const shareType = this.getAttribute('data-share');
                handleShare(shareType);
            });
        });
    }

    // Handle different share types
    function handleShare(type) {
        const url = window.location.href;
        const title = document.title;

        switch(type) {
            case 'whatsapp':
                shareWhatsApp(url, title);
                break;
            case 'facebook':
                shareFacebook(url);
                break;
            case 'twitter':
                shareTwitter(url, title);
                break;
            case 'copy':
                copyLink(url);
                break;
        }

        // Track share event in Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'share', {
                'event_category': 'Social',
                'event_label': type,
                'value': url
            });
        }
    }

    // Share on WhatsApp
    function shareWhatsApp(url, title) {
        const text = title + ' - ' + url;
        const whatsappUrl = 'https://wa.me/?text=' + encodeURIComponent(text);
        
        // Mobile detection
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            window.location.href = whatsappUrl;
        } else {
            window.open(whatsappUrl, '_blank', 'width=600,height=400');
        }
    }

    // Share on Facebook
    function shareFacebook(url) {
        const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    }

    // Share on Twitter
    function shareTwitter(url, title) {
        const twitterUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title);
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    }

    // Copy link to clipboard
    function copyLink(url) {
        // Modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                showCopyFeedback('Link copied!');
            }).catch(err => {
                fallbackCopyLink(url);
            });
        } else {
            fallbackCopyLink(url);
        }
    }

    // Fallback copy method for older browsers
    function fallbackCopyLink(url) {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback('Link copied!');
        } catch (err) {
            showCopyFeedback('Failed to copy', true);
        }
        
        document.body.removeChild(textArea);
    }

    // Show copy feedback message
    function showCopyFeedback(message, isError) {
        const copyBtn = document.querySelector('[data-share="copy"]');
        if (!copyBtn) return;

        const originalText = copyBtn.innerHTML;
        
        if (isError) {
            copyBtn.classList.add('error');
        } else {
            copyBtn.classList.add('success');
        }
        
        copyBtn.textContent = message;

        setTimeout(() => {
            copyBtn.classList.remove('success', 'error');
            copyBtn.innerHTML = originalText;
        }, 2000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initShareButtons);
    } else {
        initShareButtons();
    }

})();
