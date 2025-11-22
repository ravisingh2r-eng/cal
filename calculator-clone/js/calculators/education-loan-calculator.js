/**
 * Education Loan Calculator Calculator
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
                <label>Loan Amount Required (₹)</label>
                <input type="number" class="calc-input" id="loanAmount" placeholder="Enter loan amount" value="2000000">
            </div>
            <div class="calc-input-group">
                <label>Course Duration (years)</label>
                <select class="calc-input" id="courseDuration">
                    <option value="1">1 Year</option>
                    <option value="2" selected>2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                    <option value="5">5 Years</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Interest Rate (% per annum)</label>
                <input type="number" class="calc-input" id="rate" placeholder="Enter interest rate" value="10.5" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Repayment Tenure (years)</label>
                <select class="calc-input" id="tenure">
                    <option value="5">5 Years</option>
                    <option value="7">7 Years</option>
                    <option value="10" selected>10 Years</option>
                    <option value="15">15 Years</option>
                    <option value="20">20 Years</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Moratorium Period</label>
                <select class="calc-input" id="moratorium">
                    <option value="0">No Moratorium</option>
                    <option value="course" selected>Course Duration</option>
                    <option value="course+6">Course + 6 months</option>
                    <option value="course+12">Course + 1 year</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Study Destination</label>
                <select class="calc-input" id="destination">
                    <option value="india" selected>India</option>
                    <option value="abroad">Abroad</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const courseDuration = parseFloat(document.getElementById('courseDuration').value) || 2;
        const rate = parseFloat(document.getElementById('rate').value) || 10.5;
        const tenure = parseFloat(document.getElementById('tenure').value) || 10;
        const moratoriumType = document.getElementById('moratorium').value;
        const destination = document.getElementById('destination').value;

        // Calculate moratorium period in years
        let moratoriumYears = 0;
        if (moratoriumType === 'course') moratoriumYears = courseDuration;
        else if (moratoriumType === 'course+6') moratoriumYears = courseDuration + 0.5;
        else if (moratoriumType === 'course+12') moratoriumYears = courseDuration + 1;

        // During moratorium, simple interest accrues
        const moratoriumInterest = loanAmount * (rate / 100) * moratoriumYears;
        const principalAfterMoratorium = loanAmount + moratoriumInterest;

        // EMI calculation starts after moratorium
        const monthlyRate = rate / 12 / 100;
        const tenureMonths = tenure * 12;
        const emi = (principalAfterMoratorium * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

        // Total calculations
        const totalPayment = emi * tenureMonths;
        const totalInterest = totalPayment - loanAmount; // Total interest includes moratorium interest
        const repaymentInterest = totalPayment - principalAfterMoratorium;

        // Tax benefits under Section 80E (interest deduction)
        const avgAnnualInterest = totalInterest / tenure;
        const taxBenefit30 = avgAnnualInterest * 0.3; // At 30% tax slab

        // Processing fee (typically 1-2%)
        const processingFee = destination === 'india' ? loanAmount * 0.01 : loanAmount * 0.02;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Monthly EMI (After Moratorium)</span>
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
                        <span>Original Loan Amount:</span>
                        <span>₹${loanAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Course Duration:</span>
                        <span>${courseDuration} year(s)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Moratorium Period:</span>
                        <span>${moratoriumYears} year(s)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Rate:</span>
                        <span>${rate}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Repayment Tenure:</span>
                        <span>${tenure} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Study Destination:</span>
                        <span>${destination === 'india' ? 'India' : 'Abroad'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Moratorium Impact</h3>
                    <div class="breakdown-item">
                        <span>Interest During Moratorium:</span>
                        <span>₹${moratoriumInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Principal After Moratorium:</span>
                        <span>₹${principalAfterMoratorium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>EMI Starts After:</span>
                        <span>${moratoriumYears} year(s) from disbursement</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Cost Analysis</h3>
                    <div class="breakdown-item">
                        <span>Principal Amount:</span>
                        <span>₹${loanAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Moratorium Interest:</span>
                        <span>₹${moratoriumInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Repayment Interest:</span>
                        <span>₹${repaymentInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Interest:</span>
                        <span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Processing Fee (approx):</span>
                        <span>₹${processingFee.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest as % of Loan:</span>
                        <span>${((totalInterest/loanAmount)*100).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Benefits (Section 80E)</h3>
                    <div class="breakdown-item">
                        <span>Avg Annual Interest:</span>
                        <span>₹${avgAnnualInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Savings (30% slab):</span>
                        <span style="color: #10B981;">₹${taxBenefit30.toLocaleString('en-IN', {maximumFractionDigits: 0})}/year</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Deduction Period:</span>
                        <span>Up to 8 years or until interest is fully paid</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *Full interest amount is deductible u/s 80E. No maximum limit.
                    </p>
                </div>
                <div class="result-breakdown">
                    <h3>Repayment Summary</h3>
                    <div class="breakdown-item">
                        <span>Number of EMIs:</span>
                        <span>${tenureMonths} months</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Repayment:</span>
                        <span>₹${totalPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Cost of Education:</span>
                        <span>₹${(loanAmount + totalInterest + processingFee).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
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
            trackCalculation('education-loan', {
                loanAmount,
                courseDuration,
                emi,
                moratoriumYears
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
        console.log('Loading affiliate offers for education-loan');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
