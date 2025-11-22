/**
 * GST Calculator Logic
 */

(function() {
    'use strict';

    let currentRate = 5;
    let activeTab = 'add';

    function init() {
        setupEventListeners();
        setupTabs();
        setupRateButtons();
    }

    function setupEventListeners() {
        document.getElementById('calculateAddGST')?.addEventListener('click', calculateAddGST);
        document.getElementById('calculateRemoveGST')?.addEventListener('click', calculateRemoveGST);

        document.getElementById('gstRateAdd')?.addEventListener('input', (e) => {
            currentRate = parseFloat(e.target.value);
        });

        document.getElementById('gstRateRemove')?.addEventListener('input', (e) => {
            currentRate = parseFloat(e.target.value);
        });

        // Enter key
        document.getElementById('amountExclusive')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateAddGST();
        });

        document.getElementById('amountInclusive')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateRemoveGST();
        });
    }

    function setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;

                // Update tab buttons
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Update tab content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(tab + '-gst').classList.add('active');

                activeTab = tab;
            });
        });
    }

    function setupRateButtons() {
        document.querySelectorAll('.rate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rate = parseFloat(e.target.dataset.rate);
                currentRate = rate;

                // Update active state
                e.target.parentElement.querySelectorAll('.rate-btn').forEach(b =>
                    b.classList.remove('active')
                );
                e.target.classList.add('active');

                // Update input
                const input = activeTab === 'add' ?
                    document.getElementById('gstRateAdd') :
                    document.getElementById('gstRateRemove');
                if (input) input.value = rate;
            });
        });
    }

    function calculateAddGST() {
        const amount = parseFloat(document.getElementById('amountExclusive')?.value || 0);
        const rate = parseFloat(document.getElementById('gstRateAdd')?.value || 0);

        if (amount <= 0 || rate < 0) {
            APP.showNotification('Please enter valid values', 'error');
            return;
        }

        const gstAmount = (amount * rate) / 100;
        const totalAmount = amount + gstAmount;

        // Display results
        document.getElementById('gstAmountAdd').textContent = APP.formatCurrency(gstAmount, 2);
        document.getElementById('totalAmountAdd').textContent = APP.formatCurrency(totalAmount, 2);
        document.getElementById('addResults').style.display = 'block';

        // Save calculation
        if (typeof StorageManager !== 'undefined') {
            StorageManager.saveCalculation('gst-add', {
                amount, rate, gstAmount, totalAmount
            }, totalAmount);
        }

        // Track
        if (typeof trackCalculation === 'function') {
            trackCalculation('gst', { type: 'add', amount, rate }, { total: totalAmount });
        }
    }

    function calculateRemoveGST() {
        const amount = parseFloat(document.getElementById('amountInclusive')?.value || 0);
        const rate = parseFloat(document.getElementById('gstRateRemove')?.value || 0);

        if (amount <= 0 || rate < 0) {
            APP.showNotification('Please enter valid values', 'error');
            return;
        }

        const originalAmount = (amount * 100) / (100 + rate);
        const gstAmount = amount - originalAmount;

        // Display results
        document.getElementById('originalAmount').textContent = APP.formatCurrency(originalAmount, 2);
        document.getElementById('gstAmountRemove').textContent = APP.formatCurrency(gstAmount, 2);
        document.getElementById('removeResults').style.display = 'block';

        // Save calculation
        if (typeof StorageManager !== 'undefined') {
            StorageManager.saveCalculation('gst-remove', {
                amount, rate, originalAmount, gstAmount
            }, originalAmount);
        }

        // Track
        if (typeof trackCalculation === 'function') {
            trackCalculation('gst', { type: 'remove', amount, rate }, { original: originalAmount });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
