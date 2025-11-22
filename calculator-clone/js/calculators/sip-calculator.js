/**
 * SIP Calculator
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
                <label>Monthly Investment (₹)</label>
                <input type="number" class="calc-input" id="monthly" placeholder="Enter monthly SIP" value="5000">
            </div>
            <div class="calc-input-group">
                <label>Expected Return Rate (% p.a.)</label>
                <input type="number" class="calc-input" id="rate" placeholder="Enter rate" value="12" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Investment Period (years)</label>
                <input type="number" class="calc-input" id="years" placeholder="Enter years" value="10">
            </div>
            <div class="calc-input-group">
                <label>Step-up SIP (% annual increase)</label>
                <input type="number" class="calc-input" id="stepup" placeholder="Enter step-up %" value="0" step="1">
            </div>
        `;
    }

    function calculate() {
        const monthly = parseFloat(document.getElementById('monthly').value) || 0;
        const annualRate = parseFloat(document.getElementById('rate').value) || 12;
        const years = parseFloat(document.getElementById('years').value) || 10;
        const stepup = parseFloat(document.getElementById('stepup').value) || 0;

        const monthlyRate = annualRate / 12 / 100;
        const months = years * 12;

        let futureValue = 0;
        let totalInvested = 0;
        let currentMonthly = monthly;

        // Calculate with step-up
        for (let year = 0; year < years; year++) {
            for (let month = 0; month < 12; month++) {
                const remainingMonths = months - (year * 12 + month);
                futureValue += currentMonthly * Math.pow(1 + monthlyRate, remainingMonths);
                totalInvested += currentMonthly;
            }
            if (stepup > 0 && year < years - 1) {
                currentMonthly = currentMonthly * (1 + stepup/100);
            }
        }

        const totalGains = futureValue - totalInvested;
        const absoluteReturn = (totalGains / totalInvested) * 100;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Maturity Amount</span>
                    <span class="result-value">₹${futureValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Investment</span>
                    <span class="result-value">₹${totalInvested.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Gains</span>
                    <span class="result-value" style="color: #10B981;">₹${totalGains.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>SIP Details</h3>
                    <div class="breakdown-item">
                        <span>Monthly SIP:</span>
                        <span>₹${monthly.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Expected Return:</span>
                        <span>${annualRate}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Investment Period:</span>
                        <span>${years} years (${months} months)</span>
                    </div>
                    ${stepup > 0 ? `
                    <div class="breakdown-item">
                        <span>Step-up Rate:</span>
                        <span>${stepup}% annually</span>
                    </div>
                    ` : ''}
                </div>
                <div class="result-breakdown">
                    <h3>Returns Analysis</h3>
                    <div class="breakdown-item">
                        <span>Total Invested:</span>
                        <span>₹${totalInvested.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Wealth Gained:</span>
                        <span>₹${totalGains.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Absolute Return:</span>
                        <span>${absoluteReturn.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Maturity Value:</span>
                        <span style="font-weight: 600;">₹${futureValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('sip', { monthly, futureValue, years }, { value: 'high-cpc', totalGains });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for sip');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
