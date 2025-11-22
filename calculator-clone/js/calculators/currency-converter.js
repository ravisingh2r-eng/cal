/**
 * Currency Converter
 */
(function() {
    'use strict';
    function init() { setupEventListeners(); createInputFields(); loadAffiliateOffers(); }
    function setupEventListeners() {
        const btn = document.getElementById('calculate');
        if (btn) btn.addEventListener('click', calculate);
    }
    function createInputFields() {
        const c = document.getElementById('calculatorInputs');
        if (!c) return;
        c.innerHTML = `
            <div class="calc-input-group"><label>Amount</label><input type="number" class="calc-input" id="amount" value="1000" step="0.01"></div>
            <div class="calc-input-group"><label>From</label><select class="calc-input" id="from"><option value="USD" selected>USD - US Dollar</option><option value="INR">INR - Indian Rupee</option><option value="EUR">EUR - Euro</option><option value="GBP">GBP - British Pound</option><option value="JPY">JPY - Japanese Yen</option><option value="AUD">AUD - Australian Dollar</option><option value="CAD">CAD - Canadian Dollar</option></select></div>
            <div class="calc-input-group"><label>To</label><select class="calc-input" id="to"><option value="USD">USD - US Dollar</option><option value="INR" selected>INR - Indian Rupee</option><option value="EUR">EUR - Euro</option><option value="GBP">GBP - British Pound</option><option value="JPY">JPY - Japanese Yen</option><option value="AUD">AUD - Australian Dollar</option><option value="CAD">CAD - Canadian Dollar</option></select></div>
        `;
    }
    function calculate() {
        const amount = parseFloat(document.getElementById('amount').value) || 0;
        const from = document.getElementById('from').value;
        const to = document.getElementById('to').value;
        const rates = {
            'USD': 1, 'INR': 83.12, 'EUR': 0.92, 'GBP': 0.79, 'JPY': 149.50, 'AUD': 1.52, 'CAD': 1.36
        };
        const usdAmount = amount / rates[from];
        const result = usdAmount * rates[to];
        const rate = rates[to] / rates[from];
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Converted Amount</span><span class="result-value">${result.toFixed(2)} ${to}</span></div>
                <div class="result-item"><span class="result-label">Exchange Rate</span><span class="result-value">1 ${from} = ${rate.toFixed(4)} ${to}</span></div>
                <div class="result-breakdown"><h3>Conversion</h3>
                    <div class="breakdown-item"><span>From:</span><span>${amount.toFixed(2)} ${from}</span></div>
                    <div class="breakdown-item"><span>To:</span><span>${result.toFixed(2)} ${to}</span></div>
                    <div class="breakdown-item"><span>Rate:</span><span>${rate.toFixed(4)}</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('currency-converter', {from, to, amount}, {});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
