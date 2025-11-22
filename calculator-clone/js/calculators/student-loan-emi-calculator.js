/**
 * Student Loan EMI Calculator
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
                <input type="number" class="calc-input" id="interestRate" placeholder="Typical: 8-12%" value="9.5" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Loan Tenure (years)</label>
                <select class="calc-input" id="tenure">
                    <option value="3">3 years</option>
                    <option value="5" selected>5 years</option>
                    <option value="7">7 years</option>
                    <option value="10">10 years</option>
                    <option value="15">15 years</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Course Duration (years)</label>
                <select class="calc-input" id="courseDuration">
                    <option value="0">Already Completed</option>
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3 years</option>
                    <option value="4" selected>4 years</option>
                    <option value="5">5 years</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Moratorium Period (after course)</label>
                <select class="calc-input" id="moratorium">
                    <option value="0">No Moratorium</option>
                    <option value="0.5">6 months</option>
                    <option value="1" selected>1 year</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Annual Income (for tax benefit)</label>
                <input type="number" class="calc-input" id="annualIncome" placeholder="Enter annual income" value="600000">
            </div>
        `;
    }

    function calculate() {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const interestRate = parseFloat(document.getElementById('interestRate').value) || 9.5;
        const tenureYears = parseFloat(document.getElementById('tenure').value) || 5;
        const courseDuration = parseFloat(document.getElementById('courseDuration').value) || 4;
        const moratoriumYears = parseFloat(document.getElementById('moratorium').value) || 1;
        const annualIncome = parseFloat(document.getElementById('annualIncome').value) || 0;

        if (loanAmount <= 0) {
            alert('Please enter a valid loan amount');
            return;
        }

        // Calculate interest during moratorium (simple interest)
        const totalMoratoriumPeriod = courseDuration + moratoriumYears;
        const interestDuringMoratorium = (loanAmount * interestRate * totalMoratoriumPeriod) / 100;

        // Total loan after moratorium (principal + accumulated interest)
        const totalLoanAfterMoratorium = loanAmount + interestDuringMoratorium;

        // Calculate EMI
        const tenureMonths = tenureYears * 12;
        const monthlyRate = interestRate / 12 / 100;
        const emi = (totalLoanAfterMoratorium * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

        // Calculate total payment and interest
        const totalPayment = emi * tenureMonths;
        const totalInterest = totalPayment - totalLoanAfterMoratorium;
        const totalInterestOverall = interestDuringMoratorium + totalInterest;

        // Total amount to be repaid
        const totalAmountPaid = loanAmount + totalInterestOverall;

        // Section 80E tax benefit
        const maxTaxBenefit = calculateTaxBenefit(totalInterestOverall / tenureYears, annualIncome);

        // EMI to income ratio
        const monthlyIncome = annualIncome / 12;
        const emiToIncomeRatio = monthlyIncome > 0 ? (emi / monthlyIncome) * 100 : 0;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Monthly EMI</span>
                    <span class="result-value">₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Interest</span>
                    <span class="result-value">₹${totalInterestOverall.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Amount Payable</span>
                    <span class="result-value">₹${totalAmountPaid.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">EMI Start Date</span>
                    <span class="result-value">After ${totalMoratoriumPeriod} years</span>
                </div>
                <div class="result-breakdown">
                    <h3>Loan Details</h3>
                    <div class="breakdown-item">
                        <span>Original Loan Amount:</span>
                        <span>₹${loanAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Rate:</span>
                        <span>${interestRate}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Repayment Tenure:</span>
                        <span>${tenureYears} years (${tenureMonths} months)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Course Duration:</span>
                        <span>${courseDuration} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Moratorium Period:</span>
                        <span>${moratoriumYears} year(s) after course</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Interest During Moratorium</h3>
                    <div class="breakdown-item">
                        <span>Total Moratorium Period:</span>
                        <span>${totalMoratoriumPeriod} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Accumulated:</span>
                        <span>₹${interestDuringMoratorium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan After Moratorium:</span>
                        <span>₹${totalLoanAfterMoratorium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item" style="display: block; padding: 10px; background: #f3f4f6; border-radius: 4px; margin-top: 10px;">
                        <p style="margin: 0; font-size: 14px;">
                            <strong>Note:</strong> During the moratorium period (course + grace period),
                            simple interest accumulates on the principal. EMI payments start only after this period.
                        </p>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>EMI & Payment Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Monthly EMI:</span>
                        <span>₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total EMI Payments:</span>
                        <span>₹${totalPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest During Repayment:</span>
                        <span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Total Interest (Overall):</strong></span>
                        <span><strong>₹${totalInterestOverall.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong></span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Amount Payable:</span>
                        <span>₹${totalAmountPaid.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Section 80E Tax Benefits</h3>
                    <div class="breakdown-item">
                        <span>Annual Interest (Avg):</span>
                        <span>₹${(totalInterestOverall/tenureYears).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Benefit (Section 80E):</span>
                        <span>₹${maxTaxBenefit.toLocaleString('en-IN', {maximumFractionDigits: 0})} per year</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Tax Saved (${tenureYears} years):</span>
                        <span>₹${(maxTaxBenefit * tenureYears).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item" style="display: block; padding: 10px; background: #f3f4f6; border-radius: 4px; margin-top: 10px;">
                        <p style="margin: 0; font-size: 14px;">
                            <strong>Section 80E Benefits:</strong> Interest paid on education loan is fully deductible
                            (no maximum limit) for up to 8 years or until the loan is repaid, whichever is earlier.
                            Tax benefit starts from the year you start paying EMI.
                        </p>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Affordability Analysis</h3>
                    <div class="breakdown-item">
                        <span>Monthly Income:</span>
                        <span>₹${monthlyIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly EMI:</span>
                        <span>₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>EMI to Income Ratio:</span>
                        <span>${emiToIncomeRatio.toFixed(1)}% ${emiToIncomeRatio <= 40 ? '✓ Affordable' : '⚠ High'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Disposable Income:</span>
                        <span>₹${(monthlyIncome - emi).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
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
            trackCalculation('student-loan-emi-calculator', {
                loanAmount,
                emi,
                totalInterest: totalInterestOverall,
                tenure: tenureYears
            }, {
                value: 'high-cpc',
                loanInLakhs: loanAmount/100000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function calculateTaxBenefit(annualInterest, annualIncome) {
        // Section 80E - Interest deduction
        // Calculate tax saved based on income slab
        let taxRate = 0;

        if (annualIncome <= 300000) {
            taxRate = 0;
        } else if (annualIncome <= 600000) {
            taxRate = 0.05;
        } else if (annualIncome <= 900000) {
            taxRate = 0.10;
        } else if (annualIncome <= 1200000) {
            taxRate = 0.15;
        } else if (annualIncome <= 1500000) {
            taxRate = 0.20;
        } else {
            taxRate = 0.30;
        }

        // Tax benefit = Interest amount * tax rate (with 4% cess)
        return annualInterest * taxRate * 1.04;
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for student-loan-emi-calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
