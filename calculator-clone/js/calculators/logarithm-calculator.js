/**
 * Logarithm Calculator
 * Calculate logarithms with different bases
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
                <label for="number">Number (x)</label>
                <input type="number" id="number" placeholder="Enter number" step="any" min="0.0001" value="100">
            </div>

            <div class="input-group">
                <label for="base">Base (b)</label>
                <input type="number" id="base" placeholder="Enter base" step="any" min="0.0001" value="10">
                <small>Common bases: 10 (common log), e≈2.718 (natural log), 2 (binary)</small>
            </div>
        `;
    }

    function calculate() {
        const number = parseFloat(document.getElementById('number').value);
        const base = parseFloat(document.getElementById('base').value);

        if (isNaN(number) || isNaN(base)) {
            alert('Please enter valid numbers');
            return;
        }

        if (number <= 0) {
            alert('Number must be positive');
            return;
        }

        if (base <= 0 || base === 1) {
            alert('Base must be positive and not equal to 1');
            return;
        }

        const logBase = Math.log(number) / Math.log(base);
        const log10 = Math.log10(number);
        const ln = Math.log(number);
        const log2 = Math.log2(number);
        const antilog = Math.pow(base, number);

        displayResults(number, base, logBase, log10, ln, log2, antilog);

        if (typeof trackCalculation === 'function') {
            trackCalculation('logarithm', { number, base }, { logBase });
        }

        setTimeout(() => {
            if (typeof AdManager !== 'undefined' && AdManager.refresh) {
                AdManager.refresh();
            }
        }, 2000);
    }

    function displayResults(num, base, logBase, log10, ln, log2, antilog) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>Logarithm Results</h3>
            <div class="result-item highlight">
                <span class="result-label">log<sub>${base}</sub>(${num})</span>
                <span class="result-value">${logBase.toFixed(8)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Verification</span>
                <span class="result-value">${base}<sup>${logBase.toFixed(4)}</sup> = ${Math.pow(base, logBase).toFixed(4)}</span>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">Common Logarithms</h4>
            <div class="result-item">
                <span class="result-label">log<sub>10</sub>(${num}) - Common Log</span>
                <span class="result-value">${log10.toFixed(8)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">ln(${num}) - Natural Log</span>
                <span class="result-value">${ln.toFixed(8)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">log<sub>2</sub>(${num}) - Binary Log</span>
                <span class="result-value">${log2.toFixed(8)}</span>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">Antilog</h4>
            <div class="result-item">
                <span class="result-label">${base}<sup>${num}</sup> (Antilog)</span>
                <span class="result-value">${antilog < 1e15 ? antilog.toLocaleString('en-IN', {maximumFractionDigits: 4}) : antilog.toExponential(4)}</span>
            </div>
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();