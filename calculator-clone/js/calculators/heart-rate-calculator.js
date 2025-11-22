/**
 * Heart Rate Calculator
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
            <div class="calc-input-group"><label>Age (years)</label><input type="number" class="calc-input" id="age" value="30" min="1" max="120"></div>
            <div class="calc-input-group"><label>Resting Heart Rate (bpm)</label><input type="number" class="calc-input" id="restingHR" value="70"></div>
            <div class="calc-input-group"><label>Intensity (%)</label><input type="number" class="calc-input" id="intensity" value="70" min="50" max="100" step="5"></div>
        `;
    }
    function calculate() {
        const age = parseFloat(document.getElementById('age').value) || 30;
        const resting = parseFloat(document.getElementById('restingHR').value) || 70;
        const intensity = parseFloat(document.getElementById('intensity').value) || 70;
        const maxHR = 220 - age;
        const reserve = maxHR - resting;
        const targetHR = (reserve * intensity / 100) + resting;
        const minTarget = (reserve * 0.5) + resting;
        const maxTarget = (reserve * 0.85) + resting;
        let zone = '';
        if (intensity < 60) zone = 'Very Light (50-60%)';
        else if (intensity < 70) zone = 'Light (60-70%)';
        else if (intensity < 80) zone = 'Moderate (70-80%)';
        else if (intensity < 90) zone = 'Hard (80-90%)';
        else zone = 'Maximum (90-100%)';
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Target Heart Rate</span><span class="result-value">${targetHR.toFixed(0)} bpm</span></div>
                <div class="result-item"><span class="result-label">Training Zone</span><span class="result-value">${zone}</span></div>
                <div class="result-breakdown"><h3>Heart Rate Zones</h3>
                    <div class="breakdown-item"><span>Maximum HR:</span><span>${maxHR} bpm</span></div>
                    <div class="breakdown-item"><span>Resting HR:</span><span>${resting} bpm</span></div>
                    <div class="breakdown-item"><span>HR Reserve:</span><span>${reserve} bpm</span></div>
                    <div class="breakdown-item"><span>Target at ${intensity}%:</span><span>${targetHR.toFixed(0)} bpm</span></div>
                    <div class="breakdown-item"><span>Cardio Zone (50-85%):</span><span>${minTarget.toFixed(0)}-${maxTarget.toFixed(0)} bpm</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('heart-rate', {age, targetHR}, {});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
