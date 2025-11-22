/**
 * Water Intake Calculator
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
        c.innerHTML = \`
            <div class="calc-input-group"><label>Weight (kg)</label><input type="number" class="calc-input" id="weight" value="70"></div>
            <div class="calc-input-group"><label>Activity Level</label><select class="calc-input" id="activity"><option value="1">Sedentary</option><option value="1.2" selected>Light Activity</option><option value="1.4">Moderate Activity</option><option value="1.6">Very Active</option></select></div>
            <div class="calc-input-group"><label>Climate</label><select class="calc-input" id="climate"><option value="1" selected>Normal</option><option value="1.2">Hot/Humid</option></select></div>
        \`;
    }
    function calculate() {
        const weight = parseFloat(document.getElementById('weight').value) || 70;
        const activity = parseFloat(document.getElementById('activity').value) || 1.2;
        const climate = parseFloat(document.getElementById('climate').value) || 1;
        const base = weight * 0.033;
        const total = base * activity * climate;
        const glasses = Math.ceil(total / 0.25);
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = \`
                <div class="result-item main-result"><span class="result-label">Daily Water Intake</span><span class="result-value">\${total.toFixed(1)} liters</span></div>
                <div class="result-item"><span class="result-label">Glasses (250ml)</span><span class="result-value">\${glasses} glasses</span></div>
                <div class="result-breakdown"><h3>Hydration Guide</h3>
                    <div class="breakdown-item"><span>Your Weight:</span><span>\${weight} kg</span></div>
                    <div class="breakdown-item"><span>Base Water Need:</span><span>\${base.toFixed(1)}L</span></div>
                    <div class="breakdown-item"><span>Recommended Intake:</span><span>\${total.toFixed(1)}L/day</span></div>
                    <div class="breakdown-item"><span>In Glasses:</span><span>\${glasses} × 250ml</span></div>
                </div>
            \`;
        }
        if (typeof trackCalculation === 'function') trackCalculation('water-intake', {weight, intake: total}, {});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
