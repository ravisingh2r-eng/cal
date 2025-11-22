/**
 * Life Insurance Calculator Calculator
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
                <label>Your Age</label>
                <input type="number" class="calc-input" id="age" placeholder="Enter your age" value="30" min="18" max="65">
            </div>
            <div class="calc-input-group">
                <label>Annual Income (₹)</label>
                <input type="number" class="calc-input" id="income" placeholder="Enter annual income" value="1000000">
            </div>
            <div class="calc-input-group">
                <label>Existing Life Insurance Coverage (₹)</label>
                <input type="number" class="calc-input" id="existing" placeholder="Enter existing coverage" value="0">
            </div>
            <div class="calc-input-group">
                <label>Number of Dependents</label>
                <input type="number" class="calc-input" id="dependents" placeholder="Enter number" value="3" min="0">
            </div>
            <div class="calc-input-group">
                <label>Annual Expenses (₹)</label>
                <input type="number" class="calc-input" id="expenses" placeholder="Enter annual expenses" value="600000">
            </div>
            <div class="calc-input-group">
                <label>Outstanding Loans/Debts (₹)</label>
                <input type="number" class="calc-input" id="debts" placeholder="Enter total debts" value="2000000">
            </div>
            <div class="calc-input-group">
                <label>Current Savings/Assets (₹)</label>
                <input type="number" class="calc-input" id="savings" placeholder="Enter savings" value="500000">
            </div>
            <div class="calc-input-group">
                <label>Years of Coverage Needed</label>
                <input type="number" class="calc-input" id="years" placeholder="Enter years" value="25" min="5" max="40">
            </div>
            <div class="calc-input-group">
                <label>Expected Inflation Rate (%)</label>
                <input type="number" class="calc-input" id="inflation" placeholder="Enter inflation rate" value="6" step="0.1">
            </div>
        `;
    }

    function calculate() {
        const age = parseFloat(document.getElementById('age').value) || 30;
        const income = parseFloat(document.getElementById('income').value) || 0;
        const existing = parseFloat(document.getElementById('existing').value) || 0;
        const dependents = parseFloat(document.getElementById('dependents').value) || 0;
        const expenses = parseFloat(document.getElementById('expenses').value) || 0;
        const debts = parseFloat(document.getElementById('debts').value) || 0;
        const savings = parseFloat(document.getElementById('savings').value) || 0;
        const years = parseFloat(document.getElementById('years').value) || 25;
        const inflation = parseFloat(document.getElementById('inflation').value) || 6;

        // Calculate using multiple methods

        // Method 1: Income Replacement Method (10-15x annual income)
        const incomeMultiplier = dependents > 2 ? 15 : dependents > 0 ? 12 : 10;
        const incomeMethod = income * incomeMultiplier;

        // Method 2: Human Life Value (HLV) Method
        const retirementAge = 60;
        const workingYears = Math.min(retirementAge - age, years);
        const netAnnualIncome = income - expenses;
        const discountRate = 8; // assumed return rate
        const realRate = ((1 + discountRate/100) / (1 + inflation/100)) - 1;
        const pvFactor = realRate > 0 ? (1 - Math.pow(1 + realRate, -workingYears)) / realRate : workingYears;
        const hlvMethod = netAnnualIncome * pvFactor;

        // Method 3: Needs-based Method
        const futureExpenses = expenses * years;
        const needsMethod = futureExpenses + debts - savings;

        // Recommended coverage (average of methods with weights)
        const recommendedCoverage = Math.max(
            (incomeMethod * 0.3) + (hlvMethod * 0.4) + (needsMethod * 0.3),
            debts + (expenses * 5) // minimum coverage
        );

        const additionalNeeded = Math.max(recommendedCoverage - existing, 0);
        const coverageGap = additionalNeeded > 0;

        // Estimated premium (rough calculation: 0.5-1% of sum assured per year for term insurance)
        const premiumRate = age < 35 ? 0.005 : age < 45 ? 0.007 : 0.01;
        const estimatedAnnualPremium = recommendedCoverage * premiumRate;
        const estimatedMonthlyPremium = estimatedAnnualPremium / 12;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Recommended Life Insurance Coverage</span>
                    <span class="result-value">₹${recommendedCoverage.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Coverage in Crores</span>
                    <span class="result-value">₹${(recommendedCoverage/10000000).toFixed(2)} Cr</span>
                </div>
                ${coverageGap ? `
                <div class="result-item">
                    <span class="result-label">Additional Coverage Needed</span>
                    <span class="result-value" style="color: #EF4444;">₹${additionalNeeded.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                ` : `
                <div class="result-item">
                    <span class="result-label">Coverage Status</span>
                    <span class="result-value" style="color: #10B981;">Adequately Covered ✓</span>
                </div>
                `}
                <div class="result-breakdown">
                    <h3>Calculation Methods</h3>
                    <div class="breakdown-item">
                        <span>Income Replacement (${incomeMultiplier}x):</span>
                        <span>₹${incomeMethod.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Human Life Value (HLV):</span>
                        <span>₹${hlvMethod.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Needs-Based Method:</span>
                        <span>₹${needsMethod.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Coverage Analysis</h3>
                    <div class="breakdown-item">
                        <span>Your Age:</span>
                        <span>${age} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Working Years Remaining:</span>
                        <span>${workingYears} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Income:</span>
                        <span>₹${income.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Existing Coverage:</span>
                        <span>₹${existing.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Outstanding Debts:</span>
                        <span>₹${debts.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Current Savings:</span>
                        <span>₹${savings.toLocaleString('en-IN')}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Estimated Premium (Term Insurance)</h3>
                    <div class="breakdown-item">
                        <span>Annual Premium:</span>
                        <span>₹${estimatedAnnualPremium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Premium:</span>
                        <span>₹${estimatedMonthlyPremium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Premium as % of Income:</span>
                        <span>${((estimatedAnnualPremium/income)*100).toFixed(2)}%</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *Estimated premium for ${years}-year term plan. Actual rates may vary by insurer.
                    </p>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        // Track high-value calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('life-insurance', {
                age,
                income,
                recommendedCoverage,
                additionalNeeded
            }, {
                value: 'high-cpc',
                coverageInCrores: recommendedCoverage/10000000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for life-insurance');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
