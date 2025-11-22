/**
 * Home Loan Eligibility Calculator Calculator
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
                <label>Monthly Gross Income (₹)</label>
                <input type="number" class="calc-input" id="income" placeholder="Enter monthly income" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Co-Applicant Income (₹/month)</label>
                <input type="number" class="calc-input" id="coIncome" placeholder="Enter co-applicant income" value="0">
            </div>
            <div class="calc-input-group">
                <label>Your Age (years)</label>
                <input type="number" class="calc-input" id="age" placeholder="Enter your age" value="30" min="21" max="65">
            </div>
            <div class="calc-input-group">
                <label>Existing EMIs (₹/month)</label>
                <input type="number" class="calc-input" id="existingEmi" placeholder="Enter total existing EMIs" value="0">
            </div>
            <div class="calc-input-group">
                <label>Desired Loan Tenure (years)</label>
                <select class="calc-input" id="tenure">
                    <option value="5">5 years</option>
                    <option value="10">10 years</option>
                    <option value="15">15 years</option>
                    <option value="20" selected>20 years</option>
                    <option value="25">25 years</option>
                    <option value="30">30 years</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Interest Rate (%)</label>
                <input type="number" class="calc-input" id="rate" placeholder="Enter rate" value="8.5" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Employment Type</label>
                <select class="calc-input" id="employment">
                    <option value="salaried" selected>Salaried</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="professional">Professional</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Property Value (₹)</label>
                <input type="number" class="calc-input" id="propertyValue" placeholder="Enter property value" value="5000000">
            </div>
        `;
    }

    function calculate() {
        const income = parseFloat(document.getElementById('income').value) || 0;
        const coIncome = parseFloat(document.getElementById('coIncome').value) || 0;
        const age = parseFloat(document.getElementById('age').value) || 30;
        const existingEmi = parseFloat(document.getElementById('existingEmi').value) || 0;
        const tenure = parseFloat(document.getElementById('tenure').value) || 20;
        const rate = parseFloat(document.getElementById('rate').value) || 8.5;
        const employment = document.getElementById('employment').value;
        const propertyValue = parseFloat(document.getElementById('propertyValue').value) || 0;

        const totalIncome = income + coIncome;

        // FOIR (Fixed Obligation to Income Ratio) - typically 50-60% for home loans
        const foirPercent = employment === 'salaried' ? 0.6 : 0.5;
        const maxEmi = (totalIncome * foirPercent) - existingEmi;

        // Calculate max loan amount based on EMI capacity
        const monthlyRate = rate / 12 / 100;
        const tenureMonths = tenure * 12;

        // EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
        // Reverse calculate P from EMI
        const maxLoanFromIncome = maxEmi * (Math.pow(1 + monthlyRate, tenureMonths) - 1) /
                                  (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths));

        // LTV (Loan to Value) limits - typically 75-90%
        const ltvPercent = propertyValue <= 3000000 ? 0.9 : propertyValue <= 7500000 ? 0.8 : 0.75;
        const maxLoanFromLTV = propertyValue * ltvPercent;

        // Age-based tenure limit
        const maxTenureByAge = Math.min(tenure, 65 - age);
        const adjustedTenureMonths = maxTenureByAge * 12;

        // Final eligible loan (minimum of income-based and LTV-based)
        const eligibleLoan = Math.min(maxLoanFromIncome, maxLoanFromLTV);
        const downPayment = propertyValue - eligibleLoan;
        const downPaymentPercent = (downPayment / propertyValue) * 100;

        // Calculate EMI for eligible loan
        const emi = (eligibleLoan * monthlyRate * Math.pow(1 + monthlyRate, adjustedTenureMonths)) /
                    (Math.pow(1 + monthlyRate, adjustedTenureMonths) - 1);

        // Total payment and interest
        const totalPayment = emi * adjustedTenureMonths;
        const totalInterest = totalPayment - eligibleLoan;

        // FOIR calculation
        const actualFoir = ((emi + existingEmi) / totalIncome) * 100;

        // Affordability status
        let affordability = '';
        let affordabilityColor = '';
        if (eligibleLoan >= propertyValue * 0.8) {
            affordability = 'Excellent';
            affordabilityColor = '#10B981';
        } else if (eligibleLoan >= propertyValue * 0.6) {
            affordability = 'Good';
            affordabilityColor = '#3B82F6';
        } else if (eligibleLoan >= propertyValue * 0.4) {
            affordability = 'Moderate';
            affordabilityColor = '#F59E0B';
        } else {
            affordability = 'Low';
            affordabilityColor = '#EF4444';
        }

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Maximum Eligible Loan Amount</span>
                    <span class="result-value">₹${eligibleLoan.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Loan Amount in Crores</span>
                    <span class="result-value">₹${(eligibleLoan/10000000).toFixed(2)} Cr</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Monthly EMI</span>
                    <span class="result-value">₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Affordability Status</span>
                    <span class="result-value" style="color: ${affordabilityColor};">${affordability}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Loan Calculation Basis</h3>
                    <div class="breakdown-item">
                        <span>Income-based Max Loan:</span>
                        <span>₹${maxLoanFromIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>LTV-based Max Loan (${(ltvPercent*100).toFixed(0)}%):</span>
                        <span>₹${maxLoanFromLTV.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Limiting Factor:</span>
                        <span>${maxLoanFromIncome < maxLoanFromLTV ? 'Income' : 'Property Value (LTV)'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Property & Down Payment</h3>
                    <div class="breakdown-item">
                        <span>Property Value:</span>
                        <span>₹${propertyValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Required Down Payment:</span>
                        <span>₹${downPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Down Payment %:</span>
                        <span>${downPaymentPercent.toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan to Value (LTV):</span>
                        <span>${((eligibleLoan/propertyValue)*100).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Income & EMI Analysis</h3>
                    <div class="breakdown-item">
                        <span>Total Monthly Income:</span>
                        <span>₹${totalIncome.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Existing EMIs:</span>
                        <span>₹${existingEmi.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>New Home Loan EMI:</span>
                        <span>₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total EMI Burden:</span>
                        <span>₹${(emi + existingEmi).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>FOIR (EMI/Income ratio):</span>
                        <span>${actualFoir.toFixed(1)}% ${actualFoir <= 50 ? '✓' : actualFoir <= 60 ? '⚠' : '✗'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Disposable Income:</span>
                        <span>₹${(totalIncome - emi - existingEmi).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Loan Details</h3>
                    <div class="breakdown-item">
                        <span>Interest Rate:</span>
                        <span>${rate}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Tenure:</span>
                        <span>${maxTenureByAge} years (${adjustedTenureMonths} months)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Amount Payable:</span>
                        <span>₹${totalPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Interest Payable:</span>
                        <span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest as % of Principal:</span>
                        <span>${((totalInterest/eligibleLoan)*100).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        // Track high-value calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('home-loan-eligibility', {
                income: totalIncome,
                eligibleLoan,
                propertyValue,
                tenure
            }, {
                value: 'high-cpc',
                loanInCrores: eligibleLoan/10000000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for home-loan-eligibility');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
