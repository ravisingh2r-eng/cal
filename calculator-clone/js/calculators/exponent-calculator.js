/**
 * Exponent Calculator
 * Calculate powers and exponents
 */

(function() {
    'use strict';

    function init() {
        setupEventListeners();
        createInputFields();
    }

    function setupEventListeners() {
        const calculateBtn = document.getElementById('calculate');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculate);
        }

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculate();
        });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="input-group">
                <label for="base">Base Number</label>
                <input type="number" id="base" placeholder="Enter base" step="any" value="2">
            </div>

            <div class="input-group">
                <label for="exponent">Exponent (Power)</label>
                <input type="number" id="exponent" placeholder="Enter exponent" step="any" value="3">
            </div>
        `;
    }

    function calculate() {
        const base = parseFloat(document.getElementById('base').value);
        const exponent = parseFloat(document.getElementById('exponent').value);

        if (isNaN(base) || isNaN(exponent)) {
            alert('Please enter valid numbers');
            return;
        }

        const result = Math.pow(base, exponent);
        const squared = Math.pow(base, 2);
        const cubed = Math.pow(base, 3);
        const sqrt = base >= 0 ? Math.sqrt(base) : NaN;
        const cbrt = Math.cbrt(base);

        displayResults(base, exponent, result, squared, cubed, sqrt, cbrt);

        if (typeof trackCalculation === 'function') {
            trackCalculation('exponent', { base, exponent }, { result });
        }

        setTimeout(() => {
            if (typeof AdManager !== 'undefined' && AdManager.refresh) {
                AdManager.refresh();
            }
        }, 2000);
    }

    function displayResults(base, exp, result, squared, cubed, sqrt, cbrt) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>Exponent Results</h3>
            <div class="result-item highlight">
                <span class="result-label">${base}<sup>${exp}</sup></span>
                <span class="result-value">${result.toExponential(4)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Decimal Form</span>
                <span class="result-value">${result < 1e15 ? result.toLocaleString('en-IN', {maximumFractionDigits: 10}) : result.toExponential(4)}</span>
            </div>
            
            <h4 style="margin-top: 20px; margin-bottom: 10px;">Other Powers of ${base}</h4>
            <div class="result-item">
                <span class="result-label">${base}<sup>2</sup> (Squared)</span>
                <span class="result-value">${squared.toLocaleString('en-IN', {maximumFractionDigits: 4})}</span>
            </div>
            <div class="result-item">
                <span class="result-label">${base}<sup>3</sup> (Cubed)</span>
                <span class="result-value">${cubed.toLocaleString('en-IN', {maximumFractionDigits: 4})}</span>
            </div>
            ${!isNaN(sqrt) ? `
                <div class="result-item">
                    <span class="result-label">√${base} (Square Root)</span>
                    <span class="result-value">${sqrt.toFixed(6)}</span>
                </div>
            ` : ''}
            <div class="result-item">
                <span class="result-label">∛${base} (Cube Root)</span>
                <span class="result-value">${cbrt.toFixed(6)}</span>
            </div>
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();