/**
 * Home Affordability Calculator
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
                <input type="number" class="calc-input" id="monthlyIncome" placeholder="Enter monthly income" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Existing Monthly EMIs (₹)</label>
                <input type="number" class="calc-input" id="existingEmi" placeholder="Car loan, personal loan EMIs" value="15000">
            </div>
            <div class="calc-input-group">
                <label>Available Down Payment (₹)</label>
                <input type="number" class="calc-input" id="downPayment" placeholder="Savings for down payment" value="1000000">
            </div>
            <div class="calc-input-group">
                <label>Home Loan Interest Rate (% p.a.)</label>
                <input type="number" class="calc-input" id="interestRate" placeholder="Enter interest rate" value="8.5" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Loan Tenure (years)</label>
                <input type="number" class="calc-input" id="tenure" placeholder="Enter tenure" value="20">
            </div>
            <div class="calc-input-group">
                <label>Maximum DTI Ratio (%)</label>
                <input type="number" class="calc-input" id="dtiRatio" placeholder="Debt-to-Income ratio" value="40">
                <small style="color: #666; font-size: 12px;">Recommended: 40% (Banks typically allow 40-50%)</small>
            </div>
        `;
    }

    function calculate() {
        const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value) || 0;
        const existingEmi = parseFloat(document.getElementById('existingEmi').value) || 0;
        const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
        const annualRate = parseFloat(document.getElementById('interestRate').value) || 8.5;
        const tenure = parseFloat(document.getElementById('tenure').value) || 20;
        const dtiRatio = parseFloat(document.getElementById('dtiRatio').value) || 40;

        // Validation
        if (monthlyIncome <= 0) {
            alert('Please enter valid monthly income');
            return;
        }

        // Calculate maximum affordable EMI
        const maxAffordableEmi = (monthlyIncome * dtiRatio / 100) - existingEmi;

        if (maxAffordableEmi <= 0) {
            alert('Your existing EMIs are too high. Reduce existing debts before applying for home loan.');
            return;
        }

        // Calculate maximum loan amount using EMI formula
        const monthlyRate = annualRate / 12 / 100;
        const months = tenure * 12;

        // Loan amount from EMI = EMI × [(1 - (1 + r)^-n) / r]
        const maxLoanAmount = maxAffordableEmi * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate);

        // Maximum affordable home price
        const maxHomePrice = maxLoanAmount + downPayment;

        // Calculate actual EMI for the loan
        const actualEmi = maxAffordableEmi;

        // Total payment over loan tenure
        const totalPayment = actualEmi * months;
        const totalInterest = totalPayment - maxLoanAmount;

        // DTI Analysis
        const currentDti = (existingEmi / monthlyIncome) * 100;
        const newDti = ((existingEmi + actualEmi) / monthlyIncome) * 100;

        // Eligibility analysis
        const loanToValue = (maxLoanAmount / maxHomePrice) * 100;

        // Recommended values
        const recommendedDownPayment = maxHomePrice * 0.20; // 20% down payment
        const recommendedEmi = monthlyIncome * 0.35; // 35% of income

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Maximum Affordable Home Price</span>
                    <span class="result-value">₹${maxHomePrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Maximum Loan Amount</span>
                    <span class="result-value">₹${maxLoanAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Recommended Monthly EMI</span>
                    <span class="result-value">₹${actualEmi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Income & EMI Details</h3>
                    <div class="breakdown-item">
                        <span>Monthly Gross Income:</span>
                        <span>₹${monthlyIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Existing EMIs:</span>
                        <span>₹${existingEmi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>New Home Loan EMI:</span>
                        <span>₹${actualEmi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Monthly EMI:</span>
                        <span style="font-weight: 600;">₹${(existingEmi + actualEmi).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Loan Details</h3>
                    <div class="breakdown-item">
                        <span>Down Payment:</span>
                        <span>₹${downPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Amount:</span>
                        <span>₹${maxLoanAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Rate:</span>
                        <span>${annualRate}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Tenure:</span>
                        <span>${tenure} years (${months} months)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Interest Payable:</span>
                        <span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Payment:</span>
                        <span style="font-weight: 600;">₹${totalPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>DTI (Debt-to-Income) Analysis</h3>
                    <div class="breakdown-item">
                        <span>Current DTI Ratio:</span>
                        <span style="color: ${currentDti <= 40 ? '#10B981' : '#F59E0B'};">
                            ${currentDti.toFixed(2)}%
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>DTI After Home Loan:</span>
                        <span style="color: ${newDti <= 40 ? '#10B981' : newDti <= 50 ? '#F59E0B' : '#EF4444'};">
                            ${newDti.toFixed(2)}%
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan-to-Value Ratio:</span>
                        <span>${loanToValue.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>DTI Status:</span>
                        <span style="color: ${newDti <= 40 ? '#10B981' : newDti <= 50 ? '#F59E0B' : '#EF4444'};">
                            ${newDti <= 40 ? '✓ Excellent' : newDti <= 50 ? '⚠ Acceptable' : '✗ High Risk'}
                        </span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Eligibility Assessment</h3>
                    <div class="breakdown-item">
                        <span>Credit Profile:</span>
                        <span style="color: ${newDti <= 40 ? '#10B981' : '#F59E0B'};">
                            ${newDti <= 40 ? 'Strong' : 'Moderate'}
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Recommended Down Payment:</span>
                        <span>₹${recommendedDownPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})} (20%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Your Down Payment:</span>
                        <span style="color: ${downPayment >= recommendedDownPayment ? '#10B981' : '#F59E0B'};">
                            ${(downPayment / maxHomePrice * 100).toFixed(2)}%
                            ${downPayment >= recommendedDownPayment ? '✓' : '⚠'}
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Approval Likelihood:</span>
                        <span style="font-weight: 600; color: ${newDti <= 40 && downPayment >= recommendedDownPayment ? '#10B981' : '#F59E0B'};">
                            ${newDti <= 40 && downPayment >= recommendedDownPayment ? 'High' : 'Moderate'}
                        </span>
                    </div>
                </div>
                ${newDti > 50 ? `
                <div class="result-breakdown" style="background: #FEE2E2; border-left: 4px solid #EF4444; padding: 15px;">
                    <h3 style="color: #991B1B; margin-top: 0;">⚠️ High DTI Warning</h3>
                    <p style="color: #991B1B; margin: 8px 0; font-size: 14px;">
                        Your DTI ratio is above 50%, which may result in loan rejection. Consider:
                    </p>
                    <ul style="color: #991B1B; margin: 8px 0; font-size: 14px; padding-left: 20px;">
                        <li>Clearing existing debts before applying</li>
                        <li>Increasing your down payment</li>
                        <li>Looking for a lower-priced property</li>
                        <li>Extending the loan tenure</li>
                    </ul>
                </div>
                ` : ''}
                <div class="result-breakdown" style="background: #DBEAFE; border-left: 4px solid #3B82F6; padding: 15px;">
                    <h3 style="color: #1E40AF; margin-top: 0;">💡 Tips for Home Buyers</h3>
                    <ul style="color: #1E40AF; margin: 8px 0; font-size: 14px; padding-left: 20px;">
                        <li>Maintain DTI below 40% for better loan approval chances</li>
                        <li>Keep 6 months of EMI as emergency fund</li>
                        <li>Consider additional costs: registration (1-2%), stamp duty (4-7%)</li>
                        <li>Home loan interest is tax deductible (₹2 lakh u/s 24b)</li>
                        <li>Principal repayment deduction up to ₹1.5 lakh (u/s 80C)</li>
                    </ul>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        // Track high-value calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('home-affordability', { monthlyIncome, maxHomePrice, maxLoanAmount }, { value: 'high-cpc' });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for home-affordability');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
