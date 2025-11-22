/**
 * Angle Converter
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
            <div class="calc-input-group"><label>Value</label><input type="number" class="calc-input" id="value" value="90" step="0.01"></div>
            <div class="calc-input-group"><label>From</label><select class="calc-input" id="fromUnit">
                <option value="1" selected>Degree (°)</option>
                <option value="57.2958">Radian (rad)</option>
                <option value="1.11111">Gradian (grad)</option>
                <option value="0.0027778">Revolution (rev)</option>
            </select></div>
            <div class="calc-input-group"><label>To</label><select class="calc-input" id="toUnit">
                <option value="1">Degree (°)</option>
                <option value="57.2958" selected>Radian (rad)</option>
                <option value="1.11111">Gradian (grad)</option>
                <option value="0.0027778">Revolution (rev)</option>
            </select></div>
        `;
    }
    function calculate() {
        const value = parseFloat(document.getElementById('value').value) || 0;
        const fromFactor = parseFloat(document.getElementById('fromUnit').value);
        const toFactor = parseFloat(document.getElementById('toUnit').value);
        const fromText = document.getElementById('fromUnit').options[document.getElementById('fromUnit').selectedIndex].text;
        const toText = document.getElementById('toUnit').options[document.getElementById('toUnit').selectedIndex].text;
        const degrees = value / fromFactor;
        const result = degrees * toFactor;
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Result</span><span class="result-value">${result.toFixed(6)}</span></div>
                <div class="result-breakdown"><h3>Conversion</h3>
                    <div class="breakdown-item"><span>From:</span><span>${value} ${fromText}</span></div>
                    <div class="breakdown-item"><span>To:</span><span>${result.toFixed(6)} ${toText}</span></div>
                    <div class="breakdown-item"><span>In Degrees:</span><span>${degrees.toFixed(4)}°</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('angle-converter', {value, result}, {});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
