/**
 * Fraction Calculator
 * Add, subtract, multiply, and divide fractions
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
            <h4>First Fraction</h4>
            <div class="input-group">
                <label for="num1">Numerator</label>
                <input type="number" id="num1" placeholder="Numerator" step="1" value="3">
            </div>
            <div class="input-group">
                <label for="den1">Denominator</label>
                <input type="number" id="den1" placeholder="Denominator" step="1" value="4">
            </div>

            <h4>Second Fraction</h4>
            <div class="input-group">
                <label for="num2">Numerator</label>
                <input type="number" id="num2" placeholder="Numerator" step="1" value="1">
            </div>
            <div class="input-group">
                <label for="den2">Denominator</label>
                <input type="number" id="den2" placeholder="Denominator" step="1" value="2">
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

    function simplify(num, den) {
        const divisor = gcd(num, den);
        return {
            num: num / divisor,
            den: den / divisor
        };
    }

    function calculate() {
        const num1 = parseInt(document.getElementById('num1').value);
        const den1 = parseInt(document.getElementById('den1').value);
        const num2 = parseInt(document.getElementById('num2').value);
        const den2 = parseInt(document.getElementById('den2').value);

        if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2)) {
            alert('Please enter valid numbers for all fields');
            return;
        }

        if (den1 === 0 || den2 === 0) {
            alert('Denominator cannot be zero');
            return;
        }

        // Addition: a/b + c/d = (ad + bc) / bd
        const addNum = (num1 * den2) + (num2 * den1);
        const addDen = den1 * den2;
        const add = simplify(addNum, addDen);

        // Subtraction: a/b - c/d = (ad - bc) / bd
        const subNum = (num1 * den2) - (num2 * den1);
        const subDen = den1 * den2;
        const sub = simplify(subNum, subDen);

        // Multiplication: a/b * c/d = ac / bd
        const mulNum = num1 * num2;
        const mulDen = den1 * den2;
        const mul = simplify(mulNum, mulDen);

        // Division: a/b ÷ c/d = ad / bc
        const divNum = num1 * den2;
        const divDen = den1 * num2;
        const div = divDen !== 0 ? simplify(divNum, divDen) : null;

        displayResults(num1, den1, num2, den2, add, sub, mul, div);

        if (typeof trackCalculation === 'function') {
            trackCalculation('fraction', { num1, den1, num2, den2 }, { add, sub, mul, div });
        }

        setTimeout(() => {
            if (typeof AdManager !== 'undefined' && AdManager.refresh) {
                AdManager.refresh();
            }
        }, 2000);
    }

    function formatFraction(frac) {
        if (!frac) return 'Undefined';
        const decimal = (frac.num / frac.den).toFixed(4);
        return `${frac.num}/${frac.den} = ${decimal}`;
    }

    function displayResults(n1, d1, n2, d2, add, sub, mul, div) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>Fraction Operations</h3>
            <div style="margin-bottom: 15px; padding: 10px; background: #f9fafb; border-radius: 6px;">
                <strong>Input:</strong> ${n1}/${d1} and ${n2}/${d2}
            </div>
            <div class="result-item">
                <span class="result-label">Addition</span>
                <span class="result-value">${formatFraction(add)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Subtraction</span>
                <span class="result-value">${formatFraction(sub)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Multiplication</span>
                <span class="result-value">${formatFraction(mul)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Division</span>
                <span class="result-value">${formatFraction(div)}</span>
            </div>
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();