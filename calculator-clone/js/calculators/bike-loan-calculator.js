/**
 * Bike Loan Calculator
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
                <label>Bike Price (₹)</label>
                <input type="number" class="calc-input" id="bikePrice" placeholder="Enter bike price" value="150000">
            </div>
            <div class="calc-input-group">
                <label>Down Payment (₹)</label>
                <input type="number" class="calc-input" id="downPayment" placeholder="Enter down payment" value="30000">
            </div>
            <div class="calc-input-group">
                <label>Interest Rate (% per annum)</label>
                <input type="number" class="calc-input" id="interestRate" placeholder="Typical: 9-12%" value="10.5" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Loan Tenure</label>
                <select class="calc-input" id="tenure">
                    <option value="12">1 year (12 months)</option>
                    <option value="24">2 years (24 months)</option>
                    <option value="36" selected>3 years (36 months)</option>
                    <option value="48">4 years (48 months)</option>
                    <option value="60">5 years (60 months)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Processing Fee (%)</label>
                <input type="number" class="calc-input" id="processingFee" placeholder="Typically 1-2%" value="1" step="0.1" min="0" max="5">
            </div>
            <div class="calc-input-group">
                <label>Insurance (Annual)</label>
                <input type="number" class="calc-input" id="insurance" placeholder="Enter insurance cost" value="8000">
            </div>
        `;
    }

    function calculate() {
        const bikePrice = parseFloat(document.getElementById('bikePrice').value) || 0;
        const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
        const interestRate = parseFloat(document.getElementById('interestRate').value) || 10.5;
        const tenureMonths = parseFloat(document.getElementById('tenure').value) || 36;
        const processingFeePercent = parseFloat(document.getElementById('processingFee').value) || 1;
        const annualInsurance = parseFloat(document.getElementById('insurance').value) || 0;

        if (bikePrice <= 0) {
            alert('Please enter a valid bike price');
            return;
        }

        if (downPayment >= bikePrice) {
            alert('Down payment cannot be equal to or greater than bike price');
            return;
        }

        // Calculate loan amount
        const loanAmount = bikePrice - downPayment;

        // Calculate processing fee
        const processingFee = (loanAmount * processingFeePercent) / 100;

        // Calculate EMI using formula: EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
        const monthlyRate = interestRate / 12 / 100;
        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

        // Calculate total payment and interest
        const totalPayment = emi * tenureMonths;
        const totalInterest = totalPayment - loanAmount;

        // Total cost including fees and insurance
        const totalInsurance = (annualInsurance * tenureMonths) / 12;
        const totalCost = bikePrice + totalInterest + processingFee + totalInsurance;

        // LTV ratio
        const ltvRatio = (loanAmount / bikePrice) * 100;
        const downPaymentPercent = (downPayment / bikePrice) * 100;

        // Interest as percentage of principal
        const interestPercent = (totalInterest / loanAmount) * 100;

        // Monthly cost (EMI + insurance)
        const monthlyInsurance = annualInsurance / 12;
        const totalMonthlyCost = emi + monthlyInsurance;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Monthly EMI</span>
                    <span class="result-value">₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Loan Amount</span>
                    <span class="result-value">₹${loanAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Interest</span>
                    <span class="result-value">₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Amount Payable</span>
                    <span class="result-value">₹${totalPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Loan Details</h3>
                    <div class="breakdown-item">
                        <span>Bike On-Road Price:</span>
                        <span>₹${bikePrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Down Payment (${downPaymentPercent.toFixed(1)}%):</span>
                        <span>₹${downPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Amount (${ltvRatio.toFixed(1)}% LTV):</span>
                        <span>₹${loanAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Rate:</span>
                        <span>${interestRate}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Tenure:</span>
                        <span>${tenureMonths} months (${(tenureMonths/12).toFixed(1)} years)</span>
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
                        <span>Principal Amount:</span>
                        <span>₹${loanAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Interest:</span>
                        <span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest as % of Principal:</span>
                        <span>${interestPercent.toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Additional Costs</h3>
                    <div class="breakdown-item">
                        <span>Processing Fee (${processingFeePercent}%):</span>
                        <span>₹${processingFee.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Insurance:</span>
                        <span>₹${annualInsurance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Insurance (${(tenureMonths/12).toFixed(1)} years):</span>
                        <span>₹${totalInsurance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Total Cost of Ownership:</strong></span>
                        <span><strong>₹${totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong></span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Monthly Cost Analysis</h3>
                    <div class="breakdown-item">
                        <span>Monthly EMI:</span>
                        <span>₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Insurance:</span>
                        <span>₹${monthlyInsurance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Total Monthly Cost:</strong></span>
                        <span><strong>₹${totalMonthlyCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong></span>
                    </div>
                    <div class="breakdown-item" style="display: block; padding: 10px; background: #f3f4f6; border-radius: 4px; margin-top: 10px;">
                        <p style="margin: 0; font-size: 14px;">
                            <strong>Note:</strong> Total monthly cost includes EMI and insurance.
                            Additional expenses like maintenance, fuel, and servicing are not included.
                        </p>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>First 6 Months Amortization</h3>
                    ${generateAmortizationTable(loanAmount, monthlyRate, emi, 6)}
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        // Track high-value calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('bike-loan-calculator', {
                bikePrice,
                loanAmount,
                emi,
                totalInterest
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

    function generateAmortizationTable(principal, monthlyRate, emi, months) {
        let balance = principal;
        let html = '<table style="width: 100%; border-collapse: collapse; font-size: 14px;">';
        html += '<tr style="background: #f3f4f6; font-weight: bold;">';
        html += '<th style="padding: 8px; text-align: left;">Month</th>';
        html += '<th style="padding: 8px; text-align: right;">Principal</th>';
        html += '<th style="padding: 8px; text-align: right;">Interest</th>';
        html += '<th style="padding: 8px; text-align: right;">Balance</th>';
        html += '</tr>';

        for (let i = 1; i <= months; i++) {
            const interest = balance * monthlyRate;
            const principalPaid = emi - interest;
            balance -= principalPaid;

            html += `<tr style="border-bottom: 1px solid #e5e7eb;">`;
            html += `<td style="padding: 8px;">${i}</td>`;
            html += `<td style="padding: 8px; text-align: right;">₹${principalPaid.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>`;
            html += `<td style="padding: 8px; text-align: right;">₹${interest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>`;
            html += `<td style="padding: 8px; text-align: right;">₹${balance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>`;
            html += `</tr>`;
        }

        html += '</table>';
        return html;
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for bike-loan-calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
