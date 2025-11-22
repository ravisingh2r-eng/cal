/**
 * Personal Loan Calculator
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
                <label>Loan Amount (₹)</label>
                <input type="number" class="calc-input" id="loanAmount" placeholder="Enter loan amount" value="500000">
            </div>
            <div class="calc-input-group">
                <label>Interest Rate (% per annum)</label>
                <input type="number" class="calc-input" id="rate" placeholder="Enter interest rate" value="12" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Loan Tenure</label>
                <select class="calc-input" id="tenure">
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3" selected>3 Years</option>
                    <option value="4">4 Years</option>
                    <option value="5">5 Years</option>
                    <option value="6">6 Years</option>
                    <option value="7">7 Years</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Loan Purpose</label>
                <select class="calc-input" id="purpose">
                    <option value="debt-consolidation" selected>Debt Consolidation</option>
                    <option value="home-renovation">Home Renovation</option>
                    <option value="wedding">Wedding</option>
                    <option value="travel">Travel</option>
                    <option value="medical">Medical Emergency</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Employment Type</label>
                <select class="calc-input" id="employment">
                    <option value="salaried" selected>Salaried</option>
                    <option value="self-employed">Self-Employed</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const rate = parseFloat(document.getElementById('rate').value) || 12;
        const tenure = parseFloat(document.getElementById('tenure').value) || 3;
        const purpose = document.getElementById('purpose').value;
        const employment = document.getElementById('employment').value;

        // EMI calculation
        const monthlyRate = rate / 12 / 100;
        const tenureMonths = tenure * 12;
        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

        // Total calculations
        const totalPayment = emi * tenureMonths;
        const totalInterest = totalPayment - loanAmount;

        // Processing fee (1-2.5% based on employment)
        const processingFeePercent = employment === 'salaried' ? 0.01 : 0.02;
        const processingFee = loanAmount * processingFeePercent;

        // Total cost
        const totalCost = totalPayment + processingFee;

        // Monthly income recommendation (EMI should be < 50% of income)
        const recommendedIncome = (emi / 0.5).toFixed(0);

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Monthly EMI</span>
                    <span class="result-value">₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Amount Payable</span>
                    <span class="result-value">₹${totalPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Interest</span>
                    <span class="result-value" style="color: #F59E0B;">₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Loan Details</h3>
                    <div class="breakdown-item">
                        <span>Loan Amount:</span>
                        <span>₹${loanAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Rate:</span>
                        <span>${rate}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Tenure:</span>
                        <span>${tenure} years (${tenureMonths} months)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Purpose:</span>
                        <span>${purpose.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Cost Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Principal Amount:</span>
                        <span>₹${loanAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Interest:</span>
                        <span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Processing Fee (${(processingFeePercent*100).toFixed(1)}%):</span>
                        <span>₹${processingFee.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Cost:</span>
                        <span>₹${totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest as % of Loan:</span>
                        <span>${((totalInterest/loanAmount)*100).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Affordability Check</h3>
                    <div class="breakdown-item">
                        <span>Recommended Monthly Income:</span>
                        <span>₹${parseFloat(recommendedIncome).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>EMI to Income Ratio:</span>
                        <span>Should be ≤ 50%</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *For comfortable repayment, your EMI should not exceed 50% of monthly income
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
            trackCalculation('personal-loan', {
                loanAmount,
                emi,
                tenure,
                purpose
            }, {
                value: 'high-cpc',
                totalInterest
            });
        }

        // Trigger additional ad impressions
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for personal-loan');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
