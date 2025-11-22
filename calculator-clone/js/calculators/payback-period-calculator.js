/**
 * Payback Period Calculator
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
            <div class="calc-input-group"><label>Initial Investment (₹)</label><input type="number" class="calc-input" id="investment" value="1000000"></div>
            <div class="calc-input-group"><label>Annual Cash Inflow (₹)</label><input type="number" class="calc-input" id="cashflow" value="300000"></div>
            <div class="calc-input-group"><label>Discount Rate (% p.a.)</label><input type="number" class="calc-input" id="discountRate" value="10" step="0.1"></div>
            <div class="calc-input-group"><label>Project Life (years)</label><input type="number" class="calc-input" id="projectLife" value="10"></div>
        `;
    }

    function calculate() {
        const inv = parseFloat(document.getElementById('investment').value) || 0;
        const cf = parseFloat(document.getElementById('cashflow').value) || 0;
        const rate = parseFloat(document.getElementById('discountRate').value) || 10;
        const life = parseFloat(document.getElementById('projectLife').value) || 10;
        if (inv <= 0 || cf <= 0) { alert('Enter valid values'); return; }

        const simplePayback = inv / cf;
        let discPayback = 0;
        let cumulative = 0;
        for (let y = 1; y <= life; y++) {
            const pv = cf / Math.pow(1 + rate/100, y);
            cumulative += pv;
            if (cumulative >= inv && discPayback === 0) {
                discPayback = y - 1 + (inv - (cumulative - pv)) / pv;
            }
        }
        if (discPayback === 0) discPayback = life;

        const roi = ((cf * life - inv) / inv) * 100;
        const npv = -inv;
        for (let y = 1; y <= life; y++) npv += cf / Math.pow(1 + rate/100, y);

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Simple Payback Period</span><span class="result-value">${simplePayback.toFixed(2)} years</span></div>
                <div class="result-item"><span class="result-label">Discounted Payback</span><span class="result-value">${discPayback.toFixed(2)} years</span></div>
                <div class="result-item"><span class="result-label">NPV</span><span class="result-value" style="color:${npv >= 0 ? '#10B981' : '#EF4444'}">₹${npv.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-breakdown"><h3>Investment Analysis</h3>
                    <div class="breakdown-item"><span>Initial Investment:</span><span>₹${inv.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Annual Cash Inflow:</span><span>₹${cf.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Discount Rate:</span><span>${rate}% p.a.</span></div>
                    <div class="breakdown-item"><span>Project Life:</span><span>${life} years</span></div>
                    <div class="breakdown-item"><span>Simple Payback:</span><span>${simplePayback.toFixed(2)} years ${simplePayback <= life ? '✓' : '✗'}</span></div>
                    <div class="breakdown-item"><span>Discounted Payback:</span><span>${discPayback.toFixed(2)} years ${discPayback <= life ? '✓' : '✗'}</span></div>
                    <div class="breakdown-item"><span>ROI:</span><span>${roi.toFixed(2)}%</span></div>
                    <div class="breakdown-item"><span>Decision:</span><span style="color:${npv >= 0 ? '#10B981' : '#EF4444'}">${npv >= 0 ? '✓ Accept (NPV > 0)' : '✗ Reject (NPV < 0)'}</span></div>
                </div>
                <div class="result-actions"><button class="btn btn-outline" onclick="window.print()">Print</button></div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('payback-period', {investment: inv, payback: simplePayback}, {value: 'high-cpc'});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }

    function loadAffiliateOffers() { console.log('Loading affiliate offers for payback period'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
