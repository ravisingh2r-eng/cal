/**
 * Income Tax Calculator
 * High-CPC calculator optimized for revenue
 */

(function() {
    'use strict';

    function init() {
        setupEventListeners();
        createInputFields();
        loadAffiliateOffers();
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
            <div class="calc-input-group">
                <label>Annual Income (₹)</label>
                <input type="number" class="calc-input" id="income" placeholder="Enter annual income" value="1000000">
            </div>
            <div class="calc-input-group">
                <label>Tax Regime</label>
                <select class="calc-input" id="regime">
                    <option value="new" selected>New Regime (FY 2024-25)</option>
                    <option value="old">Old Regime</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Section 80C Deductions (₹)</label>
                <input type="number" class="calc-input" id="sec80c" placeholder="Max ₹1.5L" value="150000">
            </div>
            <div class="calc-input-group">
                <label>Other Deductions (₹)</label>
                <input type="number" class="calc-input" id="otherDed" placeholder="80D, 80G, etc." value="0">
            </div>
            <div class="calc-input-group">
                <label>Age Group</label>
                <select class="calc-input" id="age">
                    <option value="below60" selected>Below 60 years</option>
                    <option value="60to80">60-80 years (Senior)</option>
                    <option value="above80">Above 80 years (Super Senior)</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const income = parseFloat(document.getElementById('income').value) || 0;
        const regime = document.getElementById('regime').value;
        const sec80c = Math.min(parseFloat(document.getElementById('sec80c').value) || 0, 150000);
        const otherDed = parseFloat(document.getElementById('otherDed').value) || 0;
        const age = document.getElementById('age').value;

        let tax = 0;
        let taxableIncome = income;

        // Old regime with deductions
        if (regime === 'old') {
            taxableIncome = income - sec80c - otherDed - 50000; // Standard deduction

            if (age === 'below60') {
                if (taxableIncome > 250000) tax += (Math.min(taxableIncome, 500000) - 250000) * 0.05;
                if (taxableIncome > 500000) tax += (Math.min(taxableIncome, 1000000) - 500000) * 0.20;
                if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30;
            } else if (age === '60to80') {
                if (taxableIncome > 300000) tax += (Math.min(taxableIncome, 500000) - 300000) * 0.05;
                if (taxableIncome > 500000) tax += (Math.min(taxableIncome, 1000000) - 500000) * 0.20;
                if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30;
            } else {
                if (taxableIncome > 500000) tax += (Math.min(taxableIncome, 1000000) - 500000) * 0.20;
                if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30;
            }
        } else {
            // New regime (no deductions except standard)
            taxableIncome = income - 50000;

            if (taxableIncome > 300000) tax += (Math.min(taxableIncome, 600000) - 300000) * 0.05;
            if (taxableIncome > 600000) tax += (Math.min(taxableIncome, 900000) - 600000) * 0.10;
            if (taxableIncome > 900000) tax += (Math.min(taxableIncome, 1200000) - 900000) * 0.15;
            if (taxableIncome > 1200000) tax += (Math.min(taxableIncome, 1500000) - 1200000) * 0.20;
            if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.30;
        }

        const cess = tax * 0.04; // 4% cess
        const totalTax = tax + cess;
        const netIncome = income - totalTax;
        const effectiveRate = (totalTax / income) * 100;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Total Tax Payable</span>
                    <span class="result-value">₹${totalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Net Income (In-hand)</span>
                    <span class="result-value" style="color: #10B981;">₹${netIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Effective Tax Rate</span>
                    <span class="result-value">${effectiveRate.toFixed(2)}%</span>
                </div>
                <div class="result-breakdown">
                    <h3>Income Details</h3>
                    <div class="breakdown-item">
                        <span>Gross Annual Income:</span>
                        <span>₹${income.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Regime:</span>
                        <span>${regime === 'new' ? 'New Regime' : 'Old Regime'}</span>
                    </div>
                    ${regime === 'old' ? `
                    <div class="breakdown-item">
                        <span>80C Deductions:</span>
                        <span>₹${sec80c.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Other Deductions:</span>
                        <span>₹${otherDed.toLocaleString('en-IN')}</span>
                    </div>
                    ` : ''}
                    <div class="breakdown-item">
                        <span>Taxable Income:</span>
                        <span>₹${Math.max(taxableIncome, 0).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Income Tax:</span>
                        <span>₹${tax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Health & Education Cess (4%):</span>
                        <span>₹${cess.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Tax:</span>
                        <span style="font-weight: 600;">₹${totalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Tax:</span>
                        <span>₹${(totalTax/12).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('income-tax', { income, regime, totalTax }, { value: 'high-cpc' });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for income-tax');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
