/**
 * Protein Calculator
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
            <div class="calc-input-group"><label>Activity Level</label><select class="calc-input" id="activity"><option value="0.8">Sedentary</option><option value="1" selected>Light Activity</option><option value="1.2">Moderate</option><option value="1.6">Active</option><option value="2">Athlete</option></select></div>
            <div class="calc-input-group"><label>Goal</label><select class="calc-input" id="goal"><option value="1">Maintain</option><option value="1.2" selected>Build Muscle</option><option value="0.9">Lose Weight</option></select></div>
        \`;
    }
    function calculate() {
        const weight = parseFloat(document.getElementById('weight').value) || 70;
        const activity = parseFloat(document.getElementById('activity').value) || 1;
        const goal = parseFloat(document.getElementById('goal').value) || 1;
        const protein = weight * activity * goal;
        const meals = (protein / 4).toFixed(0);
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = \`
                <div class="result-item main-result"><span class="result-label">Daily Protein</span><span class="result-value">\${protein.toFixed(0)}g</span></div>
                <div class="result-item"><span class="result-label">Per Meal (4 meals)</span><span class="result-value">\${meals}g</span></div>
                <div class="result-breakdown"><h3>Protein Guide</h3>
                    <div class="breakdown-item"><span>Your Weight:</span><span>\${weight} kg</span></div>
                    <div class="breakdown-item"><span>Daily Requirement:</span><span>\${protein.toFixed(0)}g/day</span></div>
                    <div class="breakdown-item"><span>Per kg:</span><span>\${(protein/weight).toFixed(1)}g/kg</span></div>
                </div>
            \`;
        }
        if (typeof trackCalculation === 'function') trackCalculation('protein', {weight, protein}, {});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
