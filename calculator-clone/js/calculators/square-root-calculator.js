/**
 * Square Root Calculator
 * Calculate square root, cube root, and nth root
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
                <label for="number">Number</label>
                <input type="number" id="number" placeholder="Enter number" step="any" value="16">
            </div>

            <div class="input-group">
                <label for="root">Root (n)</label>
                <input type="number" id="root" placeholder="Enter root value" step="1" min="1" value="2">
                <small>n=2 for square root, n=3 for cube root, etc.</small>
            </div>
        `;
    }

    function calculate() {
        const number = parseFloat(document.getElementById('number').value);
        const rootValue = parseFloat(document.getElementById('root').value);

        if (isNaN(number) || isNaN(rootValue)) {
            alert('Please enter valid numbers');
            return;
        }

        if (rootValue <= 0) {
            alert('Root value must be positive');
            return;
        }

        if (number < 0 && rootValue % 2 === 0) {
            alert('Cannot calculate even root of negative number');
            return;
        }

        const nthRoot = Math.pow(Math.abs(number), 1 / rootValue) * (number < 0 ? -1 : 1);
        const squareRoot = number >= 0 ? Math.sqrt(number) : NaN;
        const cubeRoot = Math.cbrt(number);
        const squared = number * number;
        const cubed = number * number * number;

        displayResults(number, rootValue, nthRoot, squareRoot, cubeRoot, squared, cubed);

        if (typeof trackCalculation === 'function') {
            trackCalculation('square-root', { number, rootValue }, { nthRoot });
        }

        setTimeout(() => {
            if (typeof AdManager !== 'undefined' && AdManager.refresh) {
                AdManager.refresh();
            }
        }, 2000);
    }

    function displayResults(num, root, nthRoot, sqrt, cbrt, squared, cubed) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>Root Results</h3>
            <div class="result-item highlight">
                <span class="result-label">${root}√${num} (${root}th Root)</span>
                <span class="result-value">${nthRoot.toFixed(8)}</span>
            </div>
            
            ${!isNaN(sqrt) ? `
                <h4 style="margin-top: 20px; margin-bottom: 10px;">Common Roots</h4>
                <div class="result-item">
                    <span class="result-label">√${num} (Square Root)</span>
                    <span class="result-value">${sqrt.toFixed(8)}</span>
                </div>
            ` : ''}
            <div class="result-item">
                <span class="result-label">∛${num} (Cube Root)</span>
                <span class="result-value">${cbrt.toFixed(8)}</span>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">Powers</h4>
            <div class="result-item">
                <span class="result-label">${num}<sup>2</sup> (Squared)</span>
                <span class="result-value">${squared.toLocaleString('en-IN', {maximumFractionDigits: 4})}</span>
            </div>
            <div class="result-item">
                <span class="result-label">${num}<sup>3</sup> (Cubed)</span>
                <span class="result-value">${cubed.toLocaleString('en-IN', {maximumFractionDigits: 4})}</span>
            </div>

            <div class="result-item" style="margin-top: 15px; background: #f9fafb; padding: 10px; border-radius: 6px;">
                <span class="result-label">Verification</span>
                <span class="result-value">(${nthRoot.toFixed(4)})<sup>${root}</sup> = ${Math.pow(nthRoot, root).toFixed(4)}</span>
            </div>
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();