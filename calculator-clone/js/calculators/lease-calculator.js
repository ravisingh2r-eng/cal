/**
 * Lease Calculator - High-CPC
 */
(function() {
    'use strict';
    function init() {
        setupEventListeners();
        createInputFields();
        loadAffiliateOffers();
    }
    function setupEventListeners() {
        const btn = document.getElementById('calculate');
        if (btn) btn.addEventListener('click', calculate);
        document.addEventListener('keypress', e => { if (e.key === 'Enter') calculate(); });
    }
    function createInputFields() {
        const c = document.getElementById('calculatorInputs');
        if (!c) return;
        c.innerHTML = `
            <div class="calc-input-group"><label>Asset Value (₹)</label><input type="number" class="calc-input" id="assetValue" value="2000000"></div>
            <div class="calc-input-group"><label>Lease Period (months)</label><input type="number" class="calc-input" id="period" value="36"></div>
            <div class="calc-input-group"><label>Interest Rate (% p.a.)</label><input type="number" class="calc-input" id="rate" value="9" step="0.1"></div>
            <div class="calc-input-group"><label>Down Payment (₹)</label><input type="number" class="calc-input" id="downPayment" value="200000"></div>
            <div class="calc-input-group"><label>Residual Value (₹)</label><input type="number" class="calc-input" id="residual" value="400000"></div>
        `;
    }
    function calculate() {
        const asset = parseFloat(document.getElementById('assetValue').value) || 0;
        const months = parseFloat(document.getElementById('period').value) || 36;
        const rate = parseFloat(document.getElementById('rate').value) || 9;
        const down = parseFloat(document.getElementById('downPayment').value) || 0;
        const residual = parseFloat(document.getElementById('residual').value) || 0;
        if (asset <= 0) { alert('Enter valid asset value'); return; }
        const principal = asset - down;
        const monthlyRate = rate / 12 / 100;
        const emi = (principal - residual) * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        const total = emi * months + down + residual;
        const totalInt = total - asset;
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Monthly Lease Payment</span><span class="result-value">₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Total Lease Cost</span><span class="result-value">₹${total.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-breakdown"><h3>Lease Details</h3>
                    <div class="breakdown-item"><span>Asset Value:</span><span>₹${asset.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Down Payment:</span><span>₹${down.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Lease Period:</span><span>${months} months</span></div>
                    <div class="breakdown-item"><span>Interest Rate:</span><span>${rate}% p.a.</span></div>
                    <div class="breakdown-item"><span>Monthly EMI:</span><span>₹${emi.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Total Cost:</span><span>₹${total.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Total Interest:</span><span>₹${totalInt.toLocaleString('en-IN')}</span></div>
                </div>
                <div class="result-actions"><button class="btn btn-outline" onclick="window.print()">Print</button></div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('lease', {asset, emi}, {value: 'high-cpc'});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
