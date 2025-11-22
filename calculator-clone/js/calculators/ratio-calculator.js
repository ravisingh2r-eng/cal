/**
 * Ratio Calculator
 * Calculate and simplify ratios and proportions
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
                <label for="value1">First Value (A)</label>
                <input type="number" id="value1" placeholder="Enter first value" step="any" value="12">
            </div>

            <div class="input-group">
                <label for="value2">Second Value (B)</label>
                <input type="number" id="value2" placeholder="Enter second value" step="any" value="8">
            </div>

            <div class="input-group">
                <label for="total">Total (Optional - for ratio distribution)</label>
                <input type="number" id="total" placeholder="Total amount to distribute" step="any">
            </div>
        `;
    }

    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    function simplifyRatio(a, b) {
        const divisor = gcd(a, b);
        return {
            simplified1: a / divisor,
            simplified2: b / divisor,
            gcd: divisor
        };
    }

    function calculate() {
        const value1 = parseFloat(document.getElementById('value1').value);
        const value2 = parseFloat(document.getElementById('value2').value);
        const total = parseFloat(document.getElementById('total').value);

        if (isNaN(value1) || isNaN(value2) || value1 <= 0 || value2 <= 0) {
            alert('Please enter valid positive numbers for both values');
            return;
        }

        const { simplified1, simplified2, gcd: divisor } = simplifyRatio(value1, value2);
        const ratioSum = simplified1 + simplified2;
        const percentage1 = (value1 / (value1 + value2)) * 100;
        const percentage2 = (value2 / (value1 + value2)) * 100;

        let distribution1 = 0;
        let distribution2 = 0;
        if (!isNaN(total) && total > 0) {
            distribution1 = (total * simplified1) / ratioSum;
            distribution2 = (total * simplified2) / ratioSum;
        }

        displayResults(value1, value2, simplified1, simplified2, percentage1, percentage2, distribution1, distribution2, total, divisor);

        if (typeof trackCalculation === 'function') {
            trackCalculation('ratio', { value1, value2 }, { simplified1, simplified2 });
        }

        setTimeout(() => {
            if (typeof AdManager !== 'undefined' && AdManager.refresh) {
                AdManager.refresh();
            }
        }, 2000);
    }

    function displayResults(v1, v2, s1, s2, p1, p2, d1, d2, total, gcd) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>Ratio Results</h3>
            <div class="result-item">
                <span class="result-label">Original Ratio</span>
                <span class="result-value">${v1} : ${v2}</span>
            </div>
            <div class="result-item highlight">
                <span class="result-label">Simplified Ratio</span>
                <span class="result-value">${s1} : ${s2}</span>
            </div>
            <div class="result-item">
                <span class="result-label">GCD</span>
                <span class="result-value">${gcd}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Percentage Split</span>
                <span class="result-value">${p1.toFixed(2)}% : ${p2.toFixed(2)}%</span>
            </div>
            ${!isNaN(total) && total > 0 ? `
                <h4 style="margin-top: 20px; margin-bottom: 10px;">Distribution of ₹${total.toLocaleString('en-IN')}</h4>
                <div class="result-item">
                    <span class="result-label">Part A (${s1})</span>
                    <span class="result-value">₹${d1.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Part B (${s2})</span>
                    <span class="result-value">₹${d2.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                </div>
            ` : ''}
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();