/**
 * Recurring Deposit (RD) Calculator
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
                <label>Monthly Deposit (₹)</label>
                <input type="number" class="calc-input" id="monthlyDeposit" placeholder="Enter monthly deposit" value="5000">
            </div>
            <div class="calc-input-group">
                <label>Interest Rate (% p.a.)</label>
                <input type="number" class="calc-input" id="interestRate" placeholder="RD interest rate" value="6.5" step="0.1">
                <small style="color: #666; font-size: 12px;">
                    Current RD rates: SBI 6.5%, HDFC 7.0%, Post Office 6.7%
                </small>
            </div>
            <div class="calc-input-group">
                <label>Tenure</label>
                <select class="calc-input" id="tenureType" onchange="updateTenureField()">
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Tenure Period</label>
                <input type="number" class="calc-input" id="tenure" placeholder="Enter tenure" value="12">
            </div>
            <div class="calc-input-group">
                <label>Compounding Frequency</label>
                <select class="calc-input" id="compounding">
                    <option value="quarterly">Quarterly</option>
                    <option value="monthly">Monthly</option>
                    <option value="half-yearly">Half Yearly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>
        `;

        // Make updateTenureField available globally
        window.updateTenureField = updateTenureField;
    }

    function updateTenureField() {
        const tenureType = document.getElementById('tenureType').value;
        const tenureInput = document.getElementById('tenure');
        if (tenureType === 'years') {
            tenureInput.value = '1';
            tenureInput.placeholder = 'Enter years';
        } else {
            tenureInput.value = '12';
            tenureInput.placeholder = 'Enter months';
        }
    }

    function calculate() {
        const monthlyDeposit = parseFloat(document.getElementById('monthlyDeposit').value) || 0;
        const annualRate = parseFloat(document.getElementById('interestRate').value) || 6.5;
        const tenureType = document.getElementById('tenureType').value;
        let tenure = parseFloat(document.getElementById('tenure').value) || 12;
        const compounding = document.getElementById('compounding').value;

        // Validation
        if (monthlyDeposit <= 0 || tenure <= 0) {
            alert('Please enter valid deposit amount and tenure');
            return;
        }

        // Convert tenure to months
        const months = tenureType === 'years' ? tenure * 12 : tenure;
        const years = months / 12;

        // Calculate compounding periods per year
        const compoundingPeriods = {
            'monthly': 12,
            'quarterly': 4,
            'half-yearly': 2,
            'yearly': 1
        };
        const n = compoundingPeriods[compounding];

        // RD Maturity formula: M = P × n × [(1 + r/n)^(n×t) - 1] / (1 - (1 + r/n)^(-1/3))
        // Simplified: For monthly deposits with quarterly compounding (standard RD)
        const r = annualRate / 100;
        const quarterlyRate = r / 4;

        let maturityAmount = 0;
        const totalDeposit = monthlyDeposit * months;

        // Calculate maturity using compound interest for each monthly installment
        for (let i = 1; i <= months; i++) {
            const monthsRemaining = months - i + 1;
            const quartersRemaining = monthsRemaining / 3;
            const amount = monthlyDeposit * Math.pow(1 + quarterlyRate, quartersRemaining);
            maturityAmount += amount;
        }

        const interestEarned = maturityAmount - totalDeposit;
        const effectiveReturn = (interestEarned / totalDeposit) * 100;

        // Compare with SIP (assuming 12% returns)
        const sipRate = 12;
        const monthlyRateSIP = sipRate / 12 / 100;
        let sipValue = 0;
        for (let i = 0; i < months; i++) {
            sipValue += monthlyDeposit * Math.pow(1 + monthlyRateSIP, months - i);
        }
        const sipReturns = sipValue - totalDeposit;

        // Tax implications
        const taxableInterest = interestEarned;
        const taxAt30 = taxableInterest * 0.30; // 30% tax slab
        const taxAt20 = taxableInterest * 0.20; // 20% tax slab
        const taxAt10 = taxableInterest * 0.10; // 10% tax slab
        const postTaxMaturity30 = maturityAmount - taxAt30;
        const postTaxMaturity20 = maturityAmount - taxAt20;
        const postTaxMaturity10 = maturityAmount - taxAt10;

        // Monthly breakdown
        const monthlyInterest = interestEarned / months;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Maturity Amount</span>
                    <span class="result-value">₹${maturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Deposit</span>
                    <span class="result-value">₹${totalDeposit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Interest Earned</span>
                    <span class="result-value" style="color: #10B981;">₹${interestEarned.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>RD Details</h3>
                    <div class="breakdown-item">
                        <span>Monthly Deposit:</span>
                        <span>₹${monthlyDeposit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Rate:</span>
                        <span>${annualRate}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tenure:</span>
                        <span>${months} months (${years.toFixed(1)} years)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Compounding:</span>
                        <span>${compounding.charAt(0).toUpperCase() + compounding.slice(1).replace('-', ' ')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Deposits:</span>
                        <span>₹${totalDeposit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Returns Analysis</h3>
                    <div class="breakdown-item">
                        <span>Interest Earned:</span>
                        <span style="color: #10B981;">₹${interestEarned.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Effective Return:</span>
                        <span>${effectiveReturn.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Average Monthly Interest:</span>
                        <span>₹${monthlyInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Maturity Value:</span>
                        <span style="font-weight: 600;">₹${maturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Comparison with Mutual Fund SIP (${sipRate}% p.a.)</h3>
                    <div class="breakdown-item">
                        <span>RD Maturity:</span>
                        <span>₹${maturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>SIP Estimated Value:</span>
                        <span>₹${sipValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>RD Returns:</span>
                        <span>₹${interestEarned.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>SIP Returns:</span>
                        <span>₹${sipReturns.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Difference:</span>
                        <span style="color: ${sipReturns > interestEarned ? '#F59E0B' : '#10B981'}; font-weight: 600;">
                            ₹${Math.abs(sipReturns - interestEarned).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                            ${sipReturns > interestEarned ? '(SIP higher)' : '(RD higher)'}
                        </span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Implications</h3>
                    <div class="breakdown-item">
                        <span>Taxable Interest:</span>
                        <span>₹${taxableInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Post-Tax Maturity (10% slab):</span>
                        <span>₹${postTaxMaturity10.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Post-Tax Maturity (20% slab):</span>
                        <span>₹${postTaxMaturity20.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Post-Tax Maturity (30% slab):</span>
                        <span>₹${postTaxMaturity30.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <p style="color: #666; font-size: 13px; margin-top: 10px;">
                        Note: Interest earned is added to your income and taxed as per your tax slab. TDS deducted if interest exceeds ₹40,000 (₹50,000 for senior citizens).
                    </p>
                </div>
                <div class="result-breakdown" style="background: #DBEAFE; border-left: 4px solid #3B82F6; padding: 15px;">
                    <h3 style="color: #1E40AF; margin-top: 0;">💡 RD Benefits</h3>
                    <ul style="color: #1E40AF; margin: 8px 0; font-size: 14px; padding-left: 20px;">
                        <li><strong>Safe Investment:</strong> RD deposits are insured up to ₹5 lakh by DICGC</li>
                        <li><strong>Disciplined Saving:</strong> Encourages regular monthly savings habit</li>
                        <li><strong>Flexible Tenure:</strong> Choose tenure from 6 months to 10 years</li>
                        <li><strong>Loan Facility:</strong> Can take loan against RD (up to 90% of deposit)</li>
                        <li><strong>Premature Withdrawal:</strong> Available with slight penalty</li>
                    </ul>
                </div>
                <div class="result-breakdown" style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px;">
                    <h3 style="color: #92400E; margin-top: 0;">⚖️ RD vs SIP Comparison</h3>
                    <div style="color: #92400E; font-size: 14px;">
                        <p style="margin: 8px 0;"><strong>Choose RD if:</strong></p>
                        <ul style="margin: 8px 0; padding-left: 20px;">
                            <li>You want guaranteed returns with zero risk</li>
                            <li>You need safety and capital protection</li>
                            <li>Investment horizon is short (1-3 years)</li>
                        </ul>
                        <p style="margin: 8px 0;"><strong>Choose SIP if:</strong></p>
                        <ul style="margin: 8px 0; padding-left: 20px;">
                            <li>You can take moderate risk for higher returns</li>
                            <li>Investment horizon is long (5+ years)</li>
                            <li>You want to beat inflation significantly</li>
                        </ul>
                    </div>
                </div>
                <div class="result-breakdown" style="background: #F3F4F6; border-left: 4px solid #6B7280; padding: 15px;">
                    <h3 style="color: #374151; margin-top: 0;">🏦 Popular RD Schemes</h3>
                    <div class="breakdown-item" style="margin: 5px 0;">
                        <span>SBI Regular RD:</span>
                        <span>6.5% - 7.0% p.a.</span>
                    </div>
                    <div class="breakdown-item" style="margin: 5px 0;">
                        <span>HDFC Bank RD:</span>
                        <span>7.0% p.a.</span>
                    </div>
                    <div class="breakdown-item" style="margin: 5px 0;">
                        <span>Post Office RD:</span>
                        <span>6.7% p.a.</span>
                    </div>
                    <div class="breakdown-item" style="margin: 5px 0;">
                        <span>ICICI Bank RD:</span>
                        <span>7.0% p.a.</span>
                    </div>
                    <p style="color: #666; font-size: 12px; margin-top: 8px;">
                        *Senior citizens get additional 0.5% interest
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
            trackCalculation('rd', { monthlyDeposit, months, maturityAmount }, { value: 'high-cpc' });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for rd');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
