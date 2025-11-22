/**
 * Steps to Calories Calculator
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
            <div class="calc-input-group"><label>Steps</label><input type="number" class="calc-input" id="steps" value="10000"></div>
            <div class="calc-input-group"><label>Weight (kg)</label><input type="number" class="calc-input" id="weight" value="70"></div>
            <div class="calc-input-group"><label>Height (cm)</label><input type="number" class="calc-input" id="height" value="170"></div>
            <div class="calc-input-group"><label>Pace</label><select class="calc-input" id="pace"><option value="0.04">Slow</option><option value="0.05" selected>Moderate</option><option value="0.06">Brisk</option></select></div>
        `;
    }
    function calculate() {
        const steps = parseFloat(document.getElementById('steps').value) || 10000;
        const weight = parseFloat(document.getElementById('weight').value) || 70;
        const height = parseFloat(document.getElementById('height').value) || 170;
        const paceCalPerStep = parseFloat(document.getElementById('pace').value) || 0.05;
        const strideLength = height * 0.43 / 100;
        const distance = steps * strideLength / 1000;
        const calories = steps * paceCalPerStep * (weight / 70);
        const time = steps / 100;
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Calories Burned</span><span class="result-value">${calories.toFixed(0)} kcal</span></div>
                <div class="result-item"><span class="result-label">Distance</span><span class="result-value">${distance.toFixed(2)} km</span></div>
                <div class="result-breakdown"><h3>Activity Summary</h3>
                    <div class="breakdown-item"><span>Steps:</span><span>${steps.toLocaleString()}</span></div>
                    <div class="breakdown-item"><span>Distance:</span><span>${distance.toFixed(2)} km</span></div>
                    <div class="breakdown-item"><span>Calories:</span><span>${calories.toFixed(0)} kcal</span></div>
                    <div class="breakdown-item"><span>Time (approx):</span><span>${time.toFixed(0)} minutes</span></div>
                    <div class="breakdown-item"><span>Calories/1000 steps:</span><span>${(calories/steps*1000).toFixed(0)} kcal</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('steps-calories', {steps, calories}, {});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
