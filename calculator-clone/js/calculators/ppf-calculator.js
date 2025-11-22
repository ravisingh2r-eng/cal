/**
 * PPF Calculator
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
                <label>Yearly Investment (₹)</label>
                <input type="number" class="calc-input" id="yearly" placeholder="Enter yearly investment" value="150000">
                <small>Maximum: ₹1,50,000 per year</small>
            </div>
            <div class="calc-input-group">
                <label>Current Age (years)</label>
                <input type="number" class="calc-input" id="age" placeholder="Enter your age" value="30">
            </div>
            <div class="calc-input-group">
                <label>PPF Tenure (years)</label>
                <select class="calc-input" id="tenure">
                    <option value="15" selected>15 years (Minimum)</option>
                    <option value="20">20 years (Extended once)</option>
                    <option value="25">25 years (Extended twice)</option>
                    <option value="30">30 years (Extended thrice)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Current PPF Interest Rate (% p.a.)</label>
                <input type="number" class="calc-input" id="rate" placeholder="Enter rate" value="7.1" step="0.1">
                <small>Current rate: 7.1% (Q4 FY 2024-25)</small>
            </div>
            <div class="calc-input-group">
                <label>Deposit Frequency</label>
                <select class="calc-input" id="frequency">
                    <option value="yearly" selected>Yearly (Single deposit)</option>
                    <option value="monthly">Monthly (12 deposits)</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        let yearlyInvestment = parseFloat(document.getElementById('yearly').value) || 0;
        const age = parseFloat(document.getElementById('age').value) || 30;
        const tenure = parseFloat(document.getElementById('tenure').value) || 15;
        const annualRate = parseFloat(document.getElementById('rate').value) || 7.1;
        const frequency = document.getElementById('frequency').value;

        // PPF limit validation
        if (yearlyInvestment > 150000) {
            yearlyInvestment = 150000;
            document.getElementById('yearly').value = 150000;
        }

        const rate = annualRate / 100;
        let maturityAmount = 0;
        let totalInvested = yearlyInvestment * tenure;

        // Calculate PPF maturity (compound interest)
        // For yearly deposits at year start
        if (frequency === 'yearly') {
            for (let year = 1; year <= tenure; year++) {
                maturityAmount += yearlyInvestment * Math.pow(1 + rate, tenure - year + 1);
            }
        } else {
            // For monthly deposits (approximate calculation)
            const monthlyInvestment = yearlyInvestment / 12;
            const monthlyRate = Math.pow(1 + rate, 1/12) - 1;
            const months = tenure * 12;

            for (let month = 1; month <= months; month++) {
                maturityAmount += monthlyInvestment * Math.pow(1 + monthlyRate, months - month + 1);
            }
        }

        const totalInterest = maturityAmount - totalInvested;
        const maturityAge = age + tenure;

        // Tax benefit calculation (Section 80C)
        const annualTaxSaved = yearlyInvestment * 0.30; // Assuming 30% tax bracket
        const totalTaxSaved = annualTaxSaved * tenure;

        // Loan availability (50% of balance after 7 years, 25% after 3 years)
        const loanEligibleAmount = maturityAmount * 0.5; // Approximate after maturity

        // Extension options
        const canExtend = tenure === 15;
        const extensionYears = Math.floor((45 - maturityAge) / 5) * 5; // Can extend in blocks of 5 years

        // Monthly pension if used as retirement corpus
        const monthlyPension = maturityAmount * 0.005; // Approximate 6% annual withdrawal

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Maturity Amount</span>
                    <span class="result-value">₹${maturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Investment</span>
                    <span class="result-value">₹${totalInvested.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Interest Earned</span>
                    <span class="result-value" style="color: #10B981;">₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>PPF Account Details</h3>
                    <div class="breakdown-item">
                        <span>Yearly Investment:</span>
                        <span>₹${yearlyInvestment.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Rate:</span>
                        <span>${annualRate}% p.a. (compounded annually)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>PPF Tenure:</span>
                        <span>${tenure} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Deposit Frequency:</span>
                        <span>${frequency === 'yearly' ? 'Yearly (Lump sum)' : 'Monthly'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Current Age:</span>
                        <span>${age} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Maturity Age:</span>
                        <span>${maturityAge} years</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Returns Analysis</h3>
                    <div class="breakdown-item">
                        <span>Total Invested:</span>
                        <span>₹${totalInvested.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Earned:</span>
                        <span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Maturity Value:</span>
                        <span style="font-weight: 600;">₹${maturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Absolute Return:</span>
                        <span>${((totalInterest / totalInvested) * 100).toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest as % of Principal:</span>
                        <span>${((totalInterest / totalInvested) * 100).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Benefits (EEE Status)</h3>
                    <div class="breakdown-item">
                        <span>Annual Tax Saved (30% bracket):</span>
                        <span style="color: #10B981;">₹${annualTaxSaved.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Tax Saved (${tenure} years):</span>
                        <span style="color: #10B981;">₹${totalTaxSaved.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Tax:</span>
                        <span style="color: #10B981;">₹0 (Tax-free)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Maturity Tax:</span>
                        <span style="color: #10B981;">₹0 (Tax-free)</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *PPF has EEE (Exempt-Exempt-Exempt) status: Investment, Interest, and Maturity all tax-free
                    </p>
                </div>
                <div class="result-breakdown">
                    <h3>PPF Features & Benefits</h3>
                    <div class="breakdown-item">
                        <span>Minimum Annual Investment:</span>
                        <span>₹500</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Maximum Annual Investment:</span>
                        <span>₹1,50,000</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Lock-in Period:</span>
                        <span>15 years (minimum)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Partial Withdrawal:</span>
                        <span>Allowed after 7 years (up to 50%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Facility:</span>
                        <span>Available from 3rd to 6th year</span>
                    </div>
                    ${canExtend && extensionYears > 0 ? `
                    <div class="breakdown-item">
                        <span>Extension Available:</span>
                        <span style="color: #10B981;">Yes, up to ${extensionYears} more years</span>
                    </div>
                    ` : ''}
                </div>
                <div class="result-breakdown">
                    <h3>Retirement Planning</h3>
                    <div class="breakdown-item">
                        <span>Corpus at Maturity:</span>
                        <span>₹${maturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Estimated Monthly Income:</span>
                        <span>₹${monthlyPension.toLocaleString('en-IN', {maximumFractionDigits: 0})} (6% annual)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Retirement Age:</span>
                        <span>${maturityAge} years</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *Use PPF corpus for retirement income by investing in Senior Citizens Savings Scheme (SCSS)
                    </p>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('ppf', { yearlyInvestment, maturityAmount, tenure }, { value: 'high-cpc' });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for ppf');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
