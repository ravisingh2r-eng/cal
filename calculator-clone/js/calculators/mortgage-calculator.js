/**
 * Mortgage Calculator
 * Highest-CPC calculator optimized for revenue ($15-25)
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
                <label>Home Price (₹)</label>
                <input type="number" class="calc-input" id="homePrice" placeholder="Enter home price" value="5000000">
            </div>
            <div class="calc-input-group">
                <label>Down Payment (₹)</label>
                <input type="number" class="calc-input" id="downPayment" placeholder="Enter down payment" value="1000000">
            </div>
            <div class="calc-input-group">
                <label>Interest Rate (% per annum)</label>
                <input type="number" class="calc-input" id="rate" placeholder="Enter interest rate" value="8.5" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Loan Tenure</label>
                <select class="calc-input" id="tenure">
                    <option value="5">5 Years</option>
                    <option value="10">10 Years</option>
                    <option value="15">15 Years</option>
                    <option value="20" selected>20 Years</option>
                    <option value="25">25 Years</option>
                    <option value="30">30 Years</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Property Tax (₹/year)</label>
                <input type="number" class="calc-input" id="propertyTax" placeholder="Enter property tax" value="25000">
            </div>
            <div class="calc-input-group">
                <label>Home Insurance (₹/year)</label>
                <input type="number" class="calc-input" id="insurance" placeholder="Enter insurance" value="15000">
            </div>
            <div class="calc-input-group">
                <label>Loan Type</label>
                <select class="calc-input" id="loanType">
                    <option value="fixed" selected>Fixed Rate</option>
                    <option value="floating">Floating Rate</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const homePrice = parseFloat(document.getElementById('homePrice').value) || 0;
        const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
        const rate = parseFloat(document.getElementById('rate').value) || 8.5;
        const tenure = parseFloat(document.getElementById('tenure').value) || 20;
        const propertyTax = parseFloat(document.getElementById('propertyTax').value) || 0;
        const insurance = parseFloat(document.getElementById('insurance').value) || 0;
        const loanType = document.getElementById('loanType').value;

        const loanAmount = homePrice - downPayment;
        const downPaymentPercent = (downPayment / homePrice) * 100;
        const loanToValue = (loanAmount / homePrice) * 100;

        const monthlyRate = rate / 12 / 100;
        const tenureMonths = tenure * 12;
        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

        const totalPayment = emi * tenureMonths;
        const totalInterest = totalPayment - loanAmount;

        const monthlyPropertyTax = propertyTax / 12;
        const monthlyInsurance = insurance / 12;
        const totalMonthlyPayment = emi + monthlyPropertyTax + monthlyInsurance;

        const totalTaxOverTenure = propertyTax * tenure;
        const totalInsuranceOverTenure = insurance * tenure;
        const totalCost = homePrice + totalInterest + totalTaxOverTenure + totalInsuranceOverTenure;

        const processingFee = loanAmount * 0.0050;
        const stampDuty = homePrice * 0.06;

        const annualInterestFirstYear = loanAmount * rate / 100;
        const taxBenefitSec24 = Math.min(200000, annualInterestFirstYear);
        const taxSavings = taxBenefitSec24 * 0.30;

        const recommendedIncome = (totalMonthlyPayment / 0.35).toFixed(0);

        const principalFirstYear = (emi * 12) - annualInterestFirstYear;
        const equityYear5 = calculateEquity(loanAmount, monthlyRate, emi, 5 * 12);
        const equityYear10 = calculateEquity(loanAmount, monthlyRate, emi, 10 * 12);

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Monthly EMI (Principal + Interest)</span>
                    <span class="result-value">₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Monthly Payment</span>
                    <span class="result-value">₹${totalMonthlyPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Interest Payable</span>
                    <span class="result-value" style="color: #F59E0B;">₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Loan Details</h3>
                    <div class="breakdown-item">
                        <span>Home Price:</span>
                        <span>₹${homePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Down Payment:</span>
                        <span>₹${downPayment.toLocaleString('en-IN')} (${downPaymentPercent.toFixed(1)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Amount:</span>
                        <span>₹${loanAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan-to-Value (LTV):</span>
                        <span>${loanToValue.toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Rate:</span>
                        <span>${rate}% per annum (${loanType === 'fixed' ? 'Fixed' : 'Floating'})</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Tenure:</span>
                        <span>${tenure} years (${tenureMonths} months)</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Monthly Payment Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Principal + Interest (EMI):</span>
                        <span>₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Property Tax:</span>
                        <span>₹${monthlyPropertyTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Home Insurance:</span>
                        <span>₹${monthlyInsurance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Monthly Payment:</span>
                        <span style="font-weight: 600;">₹${totalMonthlyPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Total Cost Analysis</h3>
                    <div class="breakdown-item">
                        <span>Principal Amount:</span>
                        <span>₹${loanAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Interest (${tenure} years):</span>
                        <span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Property Tax (${tenure} years):</span>
                        <span>₹${totalTaxOverTenure.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Insurance (${tenure} years):</span>
                        <span>₹${totalInsuranceOverTenure.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Cost of Home:</span>
                        <span style="font-weight: 600;">₹${totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest as % of Loan:</span>
                        <span>${((totalInterest/loanAmount)*100).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Upfront Costs</h3>
                    <div class="breakdown-item">
                        <span>Down Payment:</span>
                        <span>₹${downPayment.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Stamp Duty (6% avg):</span>
                        <span>₹${stampDuty.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Processing Fee (0.5%):</span>
                        <span>₹${processingFee.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Upfront Cost:</span>
                        <span style="font-weight: 600;">₹${(downPayment + stampDuty + processingFee).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Benefits (India)</h3>
                    <div class="breakdown-item">
                        <span>Interest Deduction (Section 24):</span>
                        <span style="color: #10B981;">₹${taxBenefitSec24.toLocaleString('en-IN', {maximumFractionDigits: 0})}/year</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Principal Deduction (Section 80C):</span>
                        <span style="color: #10B981;">₹1,50,000/year (part of ₹1.5L limit)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Tax Savings (30% bracket):</span>
                        <span style="color: #10B981;">₹${taxSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}/year</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *First-time buyers can claim additional ₹1.5L under Section 80EEA (for loans up to ₹35L)
                    </p>
                </div>
                <div class="result-breakdown">
                    <h3>Equity Build-up</h3>
                    <div class="breakdown-item">
                        <span>Principal (Year 1):</span>
                        <span>₹${principalFirstYear.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Equity after 5 years:</span>
                        <span>₹${equityYear5.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ${tenure >= 10 ? `
                    <div class="breakdown-item">
                        <span>Equity after 10 years:</span>
                        <span>₹${equityYear10.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ` : ''}
                    <div class="breakdown-item">
                        <span>Remaining Balance:</span>
                        <span>₹${(loanAmount - equityYear5).toLocaleString('en-IN', {maximumFractionDigits: 0})} (after 5 years)</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Affordability Check</h3>
                    <div class="breakdown-item">
                        <span>Recommended Monthly Income:</span>
                        <span>₹${parseFloat(recommendedIncome).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Payment to Income Ratio:</span>
                        <span>Should be ≤ 35%</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *For comfortable repayment, total housing cost should not exceed 35% of monthly income
                    </p>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('mortgage', {
                homePrice,
                loanAmount,
                emi,
                tenure
            }, {
                value: 'highest-cpc',
                totalInterest
            });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function calculateEquity(loanAmount, monthlyRate, emi, months) {
        let balance = loanAmount;
        for (let i = 0; i < months; i++) {
            const interest = balance * monthlyRate;
            const principal = emi - interest;
            balance -= principal;
        }
        return loanAmount - balance;
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for mortgage');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
