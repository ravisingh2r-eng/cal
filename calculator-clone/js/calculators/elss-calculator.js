/**
 * ELSS (Equity Linked Savings Scheme) Calculator
 */
(function() {
    'use strict';
    function init() { setupEventListeners(); createInputFields(); loadAffiliateOffers(); }
    function setupEventListeners() {
        const btn = document.getElementById('calculate');
        if (btn) btn.addEventListener('click', calculate);
        document.addEventListener('keypress', e => { if (e.key === 'Enter') calculate(); });
    }
    function createInputFields() {
        const c = document.getElementById('calculatorInputs');
        if (!c) return;
        c.innerHTML = `
            <div class="calc-input-group"><label>Monthly Investment (₹)</label><input type="number" class="calc-input" id="monthlyInvestment" value="12500"></div>
            <div class="calc-input-group"><label>Investment Period (years)</label><input type="number" class="calc-input" id="years" value="10"></div>
            <div class="calc-input-group"><label>Expected Return Rate (% p.a.)</label><input type="number" class="calc-input" id="returnRate" value="12" step="0.1"></div>
            <div class="calc-input-group"><label>Tax Slab (%)</label><input type="number" class="calc-input" id="taxSlab" value="30"></div>
            <div class="calc-input-group"><label>One-time Lumpsum (optional)</label><input type="number" class="calc-input" id="lumpsum" value="0"></div>
        `;
    }
    function calculate() {
        const monthly = parseFloat(document.getElementById('monthlyInvestment').value) || 0;
        const years = parseFloat(document.getElementById('years').value) || 0;
        const rate = parseFloat(document.getElementById('returnRate').value) || 12;
        const taxSlab = parseFloat(document.getElementById('taxSlab').value) || 30;
        const lumpsum = parseFloat(document.getElementById('lumpsum').value) || 0;
        if (monthly <= 0 && lumpsum <= 0) { alert('Enter investment amount'); return; }
        const months = years * 12;
        const monthlyRate = rate / 12 / 100;
        let maturitySIP = 0;
        if (monthly > 0) {
            maturitySIP = monthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
        }
        const maturityLumpsum = lumpsum * Math.pow(1 + rate/100, years);
        const maturityValue = maturitySIP + maturityLumpsum;
        const totalInvested = (monthly * months) + lumpsum;
        const totalGains = maturityValue - totalInvested;
        const max80C = 150000;
        const annual80C = Math.min(monthly * 12 + lumpsum, max80C);
        const taxSaved80C = annual80C * taxSlab / 100;
        const totalTaxSaved = taxSaved80C * Math.min(years, 1);
        const ltcgExemption = 100000;
        let ltcgTax = 0;
        if (totalGains > ltcgExemption) {
            ltcgTax = (totalGains - ltcgExemption) * 0.10;
        }
        const netReturns = totalGains - ltcgTax;
        const effectiveReturn = (netReturns / totalInvested) * 100;
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Maturity Value</span><span class="result-value">₹${maturityValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Total Gains</span><span class="result-value">₹${totalGains.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Tax Saved (80C)</span><span class="result-value" style="color: #10B981;">₹${taxSaved80C.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-breakdown"><h3>Investment Summary</h3>
                    <div class="breakdown-item"><span>Monthly SIP:</span><span>₹${monthly.toLocaleString('en-IN')}</span></div>
                    ${lumpsum > 0 ? `<div class="breakdown-item"><span>One-time Lumpsum:</span><span>₹${lumpsum.toLocaleString('en-IN')}</span></div>` : ''}
                    <div class="breakdown-item"><span>Investment Period:</span><span>${years} years</span></div>
                    <div class="breakdown-item"><span>Expected Return:</span><span>${rate}% p.a.</span></div>
                    <div class="breakdown-item"><span>Total Invested:</span><span>₹${totalInvested.toLocaleString('en-IN')}</span></div>
                </div>
                <div class="result-breakdown"><h3>Returns Analysis</h3>
                    <div class="breakdown-item"><span>Maturity Value:</span><span>₹${maturityValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Total Invested:</span><span>₹${totalInvested.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Capital Gains:</span><span>₹${totalGains.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>LTCG Tax (10% above ₹1L):</span><span>₹${ltcgTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Net Returns:</span><span style="font-weight: 600;">₹${netReturns.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Effective Return:</span><span>${effectiveReturn.toFixed(2)}%</span></div>
                </div>
                <div class="result-breakdown"><h3>Section 80C Tax Benefits</h3>
                    <div class="breakdown-item"><span>Annual Investment:</span><span>₹${(monthly * 12 + lumpsum).toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>80C Deduction Claimed:</span><span>₹${annual80C.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Tax Slab:</span><span>${taxSlab}%</span></div>
                    <div class="breakdown-item"><span>Tax Saved per Year:</span><span style="color: #10B981;">₹${taxSaved80C.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Lock-in Period:</span><span>3 years (minimum)</span></div>
                </div>
                <div class="result-breakdown"><h3>ELSS Features</h3>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                        • Shortest lock-in period (3 years) among 80C options<br>
                        • Up to ₹1.5 lakh deduction under Section 80C<br>
                        • LTCG: 10% tax above ₹1 lakh exemption<br>
                        • Higher potential returns vs traditional tax-saving options<br>
                        • Equity exposure with tax benefits
                    </p>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('elss', {monthly, years, maturityValue}, {value: 'high-cpc'});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
