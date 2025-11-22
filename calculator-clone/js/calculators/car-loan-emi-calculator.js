/**
 * Car Loan Emi Calculator Calculator
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
                <label>Car Price (On-Road) (₹)</label>
                <input type="number" class="calc-input" id="carPrice" placeholder="Enter car price" value="1000000">
            </div>
            <div class="calc-input-group">
                <label>Down Payment (₹)</label>
                <input type="number" class="calc-input" id="downPayment" placeholder="Enter down payment" value="200000">
            </div>
            <div class="calc-input-group">
                <label>Interest Rate (% per annum)</label>
                <input type="number" class="calc-input" id="rate" placeholder="Enter interest rate" value="9.5" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Loan Tenure</label>
                <select class="calc-input" id="tenure">
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                    <option value="5" selected>5 Years</option>
                    <option value="6">6 Years</option>
                    <option value="7">7 Years</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Lender Type</label>
                <select class="calc-input" id="lenderType">
                    <option value="bank" selected>Bank</option>
                    <option value="nbfc">NBFC</option>
                    <option value="dealer">Dealer Finance</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const carPrice = parseFloat(document.getElementById('carPrice').value) || 0;
        const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
        const rate = parseFloat(document.getElementById('rate').value) || 9.5;
        const tenure = parseFloat(document.getElementById('tenure').value) || 5;
        const lenderType = document.getElementById('lenderType').value;

        // Calculate loan amount
        const loanAmount = carPrice - downPayment;
        const downPaymentPercent = (downPayment / carPrice) * 100;

        // EMI calculation
        const monthlyRate = rate / 12 / 100;
        const tenureMonths = tenure * 12;
        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

        // Total calculations
        const totalPayment = emi * tenureMonths;
        const totalInterest = totalPayment - loanAmount;
        const totalCost = carPrice + totalInterest;

        // Processing fee (typically 1-2% of loan amount)
        const processingFee = lenderType === 'bank' ? loanAmount * 0.01 : lenderType === 'nbfc' ? loanAmount * 0.015 : loanAmount * 0.02;

        // Affordability check (EMI should ideally be < 40% of monthly income)
        const recommendedIncome = (emi / 0.4).toFixed(0);

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
                        <span>Car Price (On-Road):</span>
                        <span>₹${carPrice.toLocaleString('en-IN')}</span>
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
                        <span>Interest Rate:</span>
                        <span>${rate}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Tenure:</span>
                        <span>${tenure} years (${tenureMonths} months)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Lender Type:</span>
                        <span>${lenderType === 'bank' ? 'Bank' : lenderType === 'nbfc' ? 'NBFC' : 'Dealer Finance'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Cost Analysis</h3>
                    <div class="breakdown-item">
                        <span>Principal Amount:</span>
                        <span>₹${loanAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Interest Paid:</span>
                        <span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Processing Fee (approx):</span>
                        <span>₹${processingFee.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Cost of Car:</span>
                        <span>₹${totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest as % of Loan:</span>
                        <span>${((totalInterest/loanAmount)*100).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>EMI Breakdown (First Month)</h3>
                    <div class="breakdown-item">
                        <span>Principal Component:</span>
                        <span>₹${(loanAmount * monthlyRate).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Component:</span>
                        <span>₹${(emi - (loanAmount * monthlyRate)).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
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
                        <span>Should be ≤ 40%</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *For comfortable repayment, your EMI should not exceed 40% of monthly income
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
            trackCalculation('car-loan-emi', {
                carPrice,
                loanAmount,
                emi,
                tenure
            }, {
                value: 'high-cpc',
                totalInterest
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for car-loan-emi');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
