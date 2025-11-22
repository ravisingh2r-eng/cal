/**
 * Body Fat Calculator
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
            <div class="calc-input-group"><label>Gender</label><select class="calc-input" id="gender"><option value="male" selected>Male</option><option value="female">Female</option></select></div>
            <div class="calc-input-group"><label>Age (years)</label><input type="number" class="calc-input" id="age" value="30"></div>
            <div class="calc-input-group"><label>Weight (kg)</label><input type="number" class="calc-input" id="weight" value="70"></div>
            <div class="calc-input-group"><label>Height (cm)</label><input type="number" class="calc-input" id="height" value="170"></div>
            <div class="calc-input-group"><label>Neck (cm)</label><input type="number" class="calc-input" id="neck" value="37"></div>
            <div class="calc-input-group"><label>Waist (cm)</label><input type="number" class="calc-input" id="waist" value="85"></div>
            <div class="calc-input-group" id="hipGroup"><label>Hip (cm)</label><input type="number" class="calc-input" id="hip" value="95"></div>
        `;
        document.getElementById('gender').addEventListener('change', function() {
            document.getElementById('hipGroup').style.display = this.value === 'female' ? 'block' : 'none';
        });
    }
    function calculate() {
        const gender = document.getElementById('gender').value;
        const age = parseFloat(document.getElementById('age').value) || 30;
        const weight = parseFloat(document.getElementById('weight').value) || 70;
        const height = parseFloat(document.getElementById('height').value) || 170;
        const neck = parseFloat(document.getElementById('neck').value) || 37;
        const waist = parseFloat(document.getElementById('waist').value) || 85;
        const hip = parseFloat(document.getElementById('hip').value) || 95;
        let bodyFat = 0;
        if (gender === 'male') {
            bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
        } else {
            bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
        }
        const fatMass = weight * bodyFat / 100;
        const leanMass = weight - fatMass;
        let category = '';
        if (gender === 'male') {
            if (bodyFat < 6) category = 'Essential Fat';
            else if (bodyFat < 14) category = 'Athletes';
            else if (bodyFat < 18) category = 'Fitness';
            else if (bodyFat < 25) category = 'Average';
            else category = 'Obese';
        } else {
            if (bodyFat < 14) category = 'Essential Fat';
            else if (bodyFat < 21) category = 'Athletes';
            else if (bodyFat < 25) category = 'Fitness';
            else if (bodyFat < 32) category = 'Average';
            else category = 'Obese';
        }
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Body Fat %</span><span class="result-value">${bodyFat.toFixed(1)}%</span></div>
                <div class="result-item"><span class="result-label">Category</span><span class="result-value">${category}</span></div>
                <div class="result-breakdown"><h3>Body Composition</h3>
                    <div class="breakdown-item"><span>Total Weight:</span><span>${weight} kg</span></div>
                    <div class="breakdown-item"><span>Fat Mass:</span><span>${fatMass.toFixed(1)} kg</span></div>
                    <div class="breakdown-item"><span>Lean Mass:</span><span>${leanMass.toFixed(1)} kg</span></div>
                    <div class="breakdown-item"><span>Body Fat %:</span><span>${bodyFat.toFixed(1)}%</span></div>
                    <div class="breakdown-item"><span>Category:</span><span>${category}</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('body-fat', {bodyFat, category}, {});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
