/**
 * Gold Calculator - High-CPC
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
        c.innerHTML = \`
            <div class="calc-input-group"><label>Gold Weight (grams)</label><input type="number" class="calc-input" id="weight" value="10"></div>
            <div class="calc-input-group"><label>Purity (Karat)</label><select class="calc-input" id="purity"><option value="24">24K (99.9%)</option><option value="22" selected>22K (91.6%)</option><option value="18">18K (75%)</option></select></div>
            <div class="calc-input-group"><label>Gold Rate (₹/10g)</label><input type="number" class="calc-input" id="rate" value="62000"></div>
            <div class="calc-input-group"><label>Making Charges (%)</label><input type="number" class="calc-input" id="making" value="10" step="0.1"></div>
        \`;
    }
    function calculate() {
        const weight = parseFloat(document.getElementById('weight').value) || 0;
        const purity = parseFloat(document.getElementById('purity').value) || 22;
        const rate = parseFloat(document.getElementById('rate').value) || 62000;
        const making = parseFloat(document.getElementById('making').value) || 10;
        if (weight <= 0) { alert('Enter valid weight'); return; }
        const purityFactor = purity === 24 ? 0.999 : purity === 22 ? 0.916 : 0.75;
        const goldValue = (weight / 10) * rate * purityFactor;
        const makingCharges = goldValue * making / 100;
        const total = goldValue + makingCharges;
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = \`
                <div class="result-item main-result"><span class="result-label">Total Price</span><span class="result-value">₹\${total.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Gold Value</span><span class="result-value">₹\${goldValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-breakdown"><h3>Price Breakdown</h3>
                    <div class="breakdown-item"><span>Weight:</span><span>\${weight}g</span></div>
                    <div class="breakdown-item"><span>Purity:</span><span>\${purity}K (\${(purityFactor*100).toFixed(1)}%)</span></div>
                    <div class="breakdown-item"><span>Rate:</span><span>₹\${rate}/10g</span></div>
                    <div class="breakdown-item"><span>Gold Value:</span><span>₹\${goldValue.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Making Charges (\${making}%):</span><span>₹\${makingCharges.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Total Price:</span><span>₹\${total.toLocaleString('en-IN')}</span></div>
                </div>
                <div class="result-actions"><button class="btn btn-outline" onclick="window.print()">Print</button></div>
            \`;
        }
        if (typeof trackCalculation === 'function') trackCalculation('gold', {weight, total}, {value: 'high-cpc'});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
