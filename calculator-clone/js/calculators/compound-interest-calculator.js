/**
 * Compound Interest Calculator
 * Production-ready calculator with validation and tracking
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
                <label>Principal Amount (₹)</label>
                <input type="number" class="calc-input" id="principal" placeholder="Enter principal amount" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Interest Rate (% per annum)</label>
                <input type="number" class="calc-input" id="rate" placeholder="Enter interest rate" value="8" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Time Period (years)</label>
                <input type="number" class="calc-input" id="time" placeholder="Enter time period" value="5">
            </div>
            <div class="calc-input-group">
                <label>Compounding Frequency</label>
                <select class="calc-input" id="frequency">
                    <option value="1">Annually</option>
                    <option value="2">Semi-Annually</option>
                    <option value="4" selected>Quarterly</option>
                    <option value="12">Monthly</option>
                    <option value="365">Daily</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Additional Monthly Contribution (₹) - Optional</label>
                <input type="number" class="calc-input" id="monthlyContribution" placeholder="Enter monthly contribution" value="0">
            </div>
        `;
    }

    function calculate() {
        const principal = parseFloat(document.getElementById('principal').value) || 0;
        const rate = parseFloat(document.getElementById('rate').value) || 0;
        const time = parseFloat(document.getElementById('time').value) || 0;
        const frequency = parseFloat(document.getElementById('frequency').value) || 4;
        const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;

        // Calculate compound interest: A = P(1 + r/n)^(nt)
        const r = rate / 100;
        const n = frequency;
        const t = time;

        // Calculate final amount with compound interest
        const compoundAmount = principal * Math.pow((1 + r/n), (n*t));

        // Calculate compound interest
        const compoundInterest = compoundAmount - principal;

        // Calculate with monthly contributions if applicable
        let totalWithContributions = compoundAmount;
        let totalContributions = 0;
        let interestOnContributions = 0;

        if (monthlyContribution > 0) {
            totalContributions = monthlyContribution * 12 * time;

            // Future value of annuity: FV = PMT × [(1 + r/n)^(nt) - 1] / (r/n)
            const monthlyRate = r / 12;
            const months = time * 12;

            // Using monthly compounding for contributions
            const contributionAmount = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

            interestOnContributions = contributionAmount - totalContributions;
            totalWithContributions = compoundAmount + contributionAmount;
        }

        const totalInterest = compoundInterest + interestOnContributions;
        const totalInvested = principal + totalContributions;
        const totalGrowth = totalWithContributions - totalInvested;

        // Calculate simple interest for comparison
        const simpleInterest = principal * r * t;
        const simpleAmount = principal + simpleInterest;

        // Calculate effective annual rate (EAR)
        const effectiveRate = (Math.pow(1 + r/n, n) - 1) * 100;

        // Calculate year-by-year breakdown
        let yearlyBreakdown = '';
        for (let year = 1; year <= Math.min(time, 10); year++) {
            const yearAmount = principal * Math.pow((1 + r/n), (n*year));
            const yearInterest = yearAmount - principal;

            let yearTotal = yearAmount;
            if (monthlyContribution > 0) {
                const monthsElapsed = year * 12;
                const monthlyRate = r / 12;
                const yearContribution = monthlyContribution * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate);
                yearTotal = yearAmount + yearContribution;
            }

            yearlyBreakdown += `
                <div class="breakdown-item">
                    <span>Year ${year}:</span>
                    <span>₹${yearTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
            `;
        }

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Final Amount</span>
                    <span class="result-value">₹${totalWithContributions.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Interest Earned</span>
                    <span class="result-value" style="color: #10B981;">₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Growth</span>
                    <span class="result-value" style="color: #10B981;">${((totalGrowth / totalInvested) * 100).toFixed(2)}%</span>
                </div>
                <div class="result-breakdown">
                    <h3>Investment Summary</h3>
                    <div class="breakdown-item">
                        <span>Principal Amount:</span>
                        <span>₹${principal.toLocaleString('en-IN')}</span>
                    </div>
                    ${monthlyContribution > 0 ? `
                    <div class="breakdown-item">
                        <span>Monthly Contribution:</span>
                        <span>₹${monthlyContribution.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Contributions (${time} years):</span>
                        <span>₹${totalContributions.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>` : ''}
                    <div class="breakdown-item">
                        <span>Total Invested:</span>
                        <span style="font-weight: 600;">₹${totalInvested.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Rate:</span>
                        <span>${rate}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Compounding:</span>
                        <span>${frequency == 1 ? 'Annually' : frequency == 2 ? 'Semi-Annually' : frequency == 4 ? 'Quarterly' : frequency == 12 ? 'Monthly' : 'Daily'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Time Period:</span>
                        <span>${time} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Effective Annual Rate (EAR):</span>
                        <span>${effectiveRate.toFixed(2)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Principal Amount:</span>
                        <span>₹${principal.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest on Principal:</span>
                        <span style="color: #10B981;">₹${compoundInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ${monthlyContribution > 0 ? `
                    <div class="breakdown-item">
                        <span>Total Contributions:</span>
                        <span>₹${totalContributions.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest on Contributions:</span>
                        <span style="color: #10B981;">₹${interestOnContributions.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>` : ''}
                    <div class="breakdown-item">
                        <span>Total Interest Earned:</span>
                        <span style="font-weight: 600; color: #10B981;">₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Final Amount:</span>
                        <span style="font-weight: 600;">₹${totalWithContributions.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Compound vs Simple Interest</h3>
                    <div class="breakdown-item">
                        <span>Compound Interest:</span>
                        <span style="color: #10B981;">₹${compoundInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Simple Interest:</span>
                        <span>₹${simpleInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Additional Earnings (Compounding):</span>
                        <span style="color: #10B981;">₹${(compoundInterest - simpleInterest).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Compound Amount:</span>
                        <span>₹${compoundAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Simple Amount:</span>
                        <span>₹${simpleAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Benefit of Compounding:</span>
                        <span style="color: #10B981;">${(((compoundInterest - simpleInterest) / simpleInterest) * 100).toFixed(2)}% more</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Year-by-Year Growth</h3>
                    ${yearlyBreakdown}
                    ${time > 10 ? `<p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">*Showing first 10 years only</p>` : ''}
                </div>
                <div class="result-breakdown">
                    <h3>Investment Insights</h3>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                        • Your investment will grow to <strong>₹${totalWithContributions.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong> in ${time} years<br>
                        • Total returns: <strong>${((totalGrowth / totalInvested) * 100).toFixed(2)}%</strong> on your investment<br>
                        • Interest earned: <strong>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong> (${((totalInterest / totalInvested) * 100).toFixed(1)}% of principal)<br>
                        • Effective rate with ${frequency == 1 ? 'annual' : frequency == 2 ? 'semi-annual' : frequency == 4 ? 'quarterly' : frequency == 12 ? 'monthly' : 'daily'} compounding: <strong>${effectiveRate.toFixed(2)}%</strong><br>
                        ${monthlyContribution > 0 ? `• Regular contributions add <strong>₹${interestOnContributions.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong> in additional interest<br>` : ''}
                        • Power of compounding: Earns <strong>₹${(compoundInterest - simpleInterest).toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong> more than simple interest
                    </p>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('compound-interest', {
                principal,
                rate,
                time,
                frequency,
                finalAmount: totalWithContributions
            }, {
                interest: totalInterest
            });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for compound-interest');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
