/**
 * Lumpsum Investment Calculator
 * High-CPC calculator optimized for revenue
 */

(function() {
    'use strict';

    function init() {
        setupEventListeners();
        createInputFields();
        loadAffiliateOffers();
    }

    function setupEventListeners() {
        const calculateBtn = document.getElementById('calculate');
        if (calculateBtn) calculateBtn.addEventListener('click', calculate);
        document.addEventListener('keypress', (e) => { if (e.key === 'Enter') calculate(); });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;
        container.innerHTML = `
            <div class="calc-input-group"><label>Lumpsum Amount (₹)</label><input type="number" class="calc-input" id="amount" value="500000"></div>
            <div class="calc-input-group"><label>Expected Return (% p.a.)</label><input type="number" class="calc-input" id="returnRate" value="12" step="0.1"></div>
            <div class="calc-input-group"><label>Period (years)</label><input type="number" class="calc-input" id="period" value="10"></div>
            <div class="calc-input-group"><label>Tax on Gains (%)</label><input type="number" class="calc-input" id="taxRate" value="12.5" step="0.1"></div>
        `;
    }

    function calculate() {
        const amount = parseFloat(document.getElementById('amount').value) || 0;
        const rate = parseFloat(document.getElementById('returnRate').value) || 12;
        const years = parseFloat(document.getElementById('period').value) || 10;
        const tax = parseFloat(document.getElementById('taxRate').value) || 0;
        if (amount <= 0) { alert('Enter valid amount'); return; }
        const fv = amount * Math.pow(1 + rate/100, years);
        const gains = fv - amount;
        const taxAmt = gains * tax / 100;
        const postTax = fv - taxAmt;
        const cagr = (Math.pow(fv/amount, 1/years) - 1) * 100;
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Future Value</span><span class="result-value">₹${fv.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Total Gains</span><span class="result-value" style="color:#10B981">₹${gains.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Post-Tax Value</span><span class="result-value">₹${postTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-breakdown"><h3>Details</h3>
                    <div class="breakdown-item"><span>Investment:</span><span>₹${amount.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Period:</span><span>${years} years</span></div>
                    <div class="breakdown-item"><span>Return Rate:</span><span>${rate}% p.a.</span></div>
                    <div class="breakdown-item"><span>CAGR:</span><span>${cagr.toFixed(2)}%</span></div>
                    <div class="breakdown-item"><span>Wealth Multiplier:</span><span>${(fv/amount).toFixed(2)}x</span></div>
                    <div class="breakdown-item"><span>Tax Amount:</span><span style="color:#EF4444">₹${taxAmt.toLocaleString('en-IN')}</span></div>
                </div>
                <div class="result-actions"><button class="btn btn-outline" onclick="window.print()">Print</button></div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('lumpsum', {amount, fv}, {value: 'high-cpc'});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }

    function loadAffiliateOffers() { console.log('Loading affiliate offers for lumpsum'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
