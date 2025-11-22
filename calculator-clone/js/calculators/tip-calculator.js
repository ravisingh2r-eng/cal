/**
 * Tip Calculator
 * Calculate tip amount and split bill among people
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

        // Real-time calculation
        document.addEventListener('input', (e) => {
            if (e.target.matches('#billAmount, #tipPercent, #people')) {
                calculate();
            }
        });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="input-group">
                <label for="billAmount">Bill Amount (₹)</label>
                <input type="number" id="billAmount" placeholder="Enter bill amount" min="0" step="0.01" value="1000">
            </div>

            <div class="input-group">
                <label for="tipPercent">Tip Percentage (%)</label>
                <input type="number" id="tipPercent" placeholder="Tip percentage" min="0" max="100" step="1" value="10">
                <div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
                    <button type="button" class="btn-secondary" onclick="document.getElementById('tipPercent').value=5; document.getElementById('calculate').click()">5%</button>
                    <button type="button" class="btn-secondary" onclick="document.getElementById('tipPercent').value=10; document.getElementById('calculate').click()">10%</button>
                    <button type="button" class="btn-secondary" onclick="document.getElementById('tipPercent').value=15; document.getElementById('calculate').click()">15%</button>
                    <button type="button" class="btn-secondary" onclick="document.getElementById('tipPercent').value=20; document.getElementById('calculate').click()">20%</button>
                </div>
            </div>

            <div class="input-group">
                <label for="people">Number of People</label>
                <input type="number" id="people" placeholder="Split among" min="1" step="1" value="1">
            </div>
        `;
    }

    function calculate() {
        const billAmount = parseFloat(document.getElementById('billAmount').value);
        const tipPercent = parseFloat(document.getElementById('tipPercent').value);
        const people = parseInt(document.getElementById('people').value);

        if (isNaN(billAmount) || billAmount <= 0) {
            return;
        }

        const tip = tipPercent > 0 ? (billAmount * tipPercent) / 100 : 0;
        const totalBill = billAmount + tip;
        const perPerson = people > 0 ? totalBill / people : totalBill;
        const tipPerPerson = people > 0 ? tip / people : tip;

        displayResults(billAmount, tip, totalBill, perPerson, tipPerPerson, people);

        if (typeof trackCalculation === 'function') {
            trackCalculation('tip', { billAmount, tipPercent, people }, { tip, totalBill });
        }

        setTimeout(() => {
            if (typeof AdManager !== 'undefined' && AdManager.refresh) {
                AdManager.refresh();
            }
        }, 2000);
    }

    function displayResults(billAmount, tip, totalBill, perPerson, tipPerPerson, people) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>Tip Calculation</h3>
            <div class="result-item">
                <span class="result-label">Bill Amount</span>
                <span class="result-value">₹${billAmount.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Tip Amount</span>
                <span class="result-value">₹${tip.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
            </div>
            <div class="result-item highlight">
                <span class="result-label">Total Bill</span>
                <span class="result-value">₹${totalBill.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
            </div>
            ${people > 1 ? `
                <h4 style="margin-top: 20px; margin-bottom: 10px;">Split Between ${people} People</h4>
                <div class="result-item highlight">
                    <span class="result-label">Amount Per Person</span>
                    <span class="result-value">₹${perPerson.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Tip Per Person</span>
                    <span class="result-value">₹${tipPerPerson.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
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