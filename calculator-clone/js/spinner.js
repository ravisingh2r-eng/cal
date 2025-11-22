/**
 * Loading Spinner System
 * Provides visual feedback during calculations
 */

(function() {
    'use strict';

    // Spinner manager
    window.SpinnerManager = {
        // Show spinner
        show: function(containerId) {
            const container = containerId ? document.getElementById(containerId) : document.getElementById('results');
            if (!container) return;

            // Create spinner element if it doesn't exist
            let spinner = container.querySelector('.spinner-overlay');
            if (!spinner) {
                spinner = this.createSpinner();
                container.style.position = 'relative';
                container.insertBefore(spinner, container.firstChild);
            }
            
            spinner.style.display = 'flex';
        },

        // Hide spinner
        hide: function(containerId) {
            const container = containerId ? document.getElementById(containerId) : document.getElementById('results');
            if (!container) return;

            const spinner = container.querySelector('.spinner-overlay');
            if (spinner) {
                spinner.style.display = 'none';
            }
        },

        // Create spinner HTML
        createSpinner: function() {
            const spinnerDiv = document.createElement('div');
            spinnerDiv.className = 'spinner-overlay';
            spinnerDiv.innerHTML = `
                <div class="spinner-container">
                    <div class="spinner"></div>
                    <p class="spinner-text">Calculating...</p>
                </div>
            `;
            return spinnerDiv;
        },

        // Show spinner on calculate button
        showOnButton: function(buttonId) {
            const button = typeof buttonId === 'string' ? 
                document.getElementById(buttonId) : buttonId;
            
            if (!button) return;

            // Store original button content
            button.dataset.originalText = button.innerHTML;
            
            // Add spinner to button
            button.innerHTML = `
                <span class="button-spinner"></span>
                <span>Calculating...</span>
            `;
            button.disabled = true;
            button.classList.add('calculating');
        },

        // Hide spinner from button
        hideFromButton: function(buttonId) {
            const button = typeof buttonId === 'string' ? 
                document.getElementById(buttonId) : buttonId;
            
            if (!button) return;

            // Restore original button content
            if (button.dataset.originalText) {
                button.innerHTML = button.dataset.originalText;
            }
            button.disabled = false;
            button.classList.remove('calculating');
        }
    };

    // Helper function for async calculations with spinner
    window.calculateWithSpinner = function(calculationFunction, options) {
        options = options || {};
        const buttonId = options.buttonId || 'calculate';
        const delay = options.delay || 300; // Minimum spinner display time
        
        // Show spinner
        SpinnerManager.showOnButton(buttonId);
        
        // Perform calculation after small delay (allows UI to update)
        setTimeout(() => {
            const startTime = Date.now();
            
            try {
                // Execute calculation
                const result = calculationFunction();
                
                // Calculate remaining delay time
                const elapsed = Date.now() - startTime;
                const remainingDelay = Math.max(0, delay - elapsed);
                
                // Hide spinner after minimum display time
                setTimeout(() => {
                    SpinnerManager.hideFromButton(buttonId);
                }, remainingDelay);
                
            } catch (error) {
                // Hide spinner on error
                SpinnerManager.hideFromButton(buttonId);
                console.error('Calculation error:', error);
                throw error;
            }
        }, 10);
    };

})();
