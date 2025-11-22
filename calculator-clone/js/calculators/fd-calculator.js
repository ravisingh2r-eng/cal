/**
 * FD Calculator
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
                <label>Fixed Deposit Amount (₹)</label>
                <input type="number" class="calc-input" id="principal" placeholder="Enter FD amount" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Interest Rate (% p.a.)</label>
                <input type="number" class="calc-input" id="rate" placeholder="Enter rate" value="7.5" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Tenure</label>
                <select class="calc-input" id="tenure">
                    <option value="0.25">3 months</option>
                    <option value="0.5">6 months</option>
                    <option value="1" selected>1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3 years</option>
                    <option value="5">5 years</option>
                    <option value="7">7 years</option>
                    <option value="10">10 years</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Compounding Frequency</label>
                <select class="calc-input" id="compounding">
                    <option value="quarterly" selected>Quarterly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Senior Citizen?</label>
                <select class="calc-input" id="seniorCitizen">
                    <option value="no" selected>No</option>
                    <option value="yes">Yes (Extra 0.5% interest)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Bank Type</label>
                <select class="calc-input" id="bankType">
                    <option value="public" selected>Public Sector Bank</option>
                    <option value="private">Private Bank</option>
                    <option value="small">Small Finance Bank</option>
                    <option value="post">Post Office</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const principal = parseFloat(document.getElementById('principal').value) || 0;
        let annualRate = parseFloat(document.getElementById('rate').value) || 7.5;
        const tenureYears = parseFloat(document.getElementById('tenure').value) || 1;
        const compounding = document.getElementById('compounding').value;
        const isSeniorCitizen = document.getElementById('seniorCitizen').value === 'yes';
        const bankType = document.getElementById('bankType').value;

        // Add senior citizen bonus (typically 0.5%)
        if (isSeniorCitizen) {
            annualRate += 0.5;
        }

        const rate = annualRate / 100;

        // Compounding frequency
        let n = 4; // quarterly
        if (compounding === 'monthly') n = 12;
        if (compounding === 'annually') n = 1;

        // Calculate maturity amount using compound interest formula
        // A = P(1 + r/n)^(nt)
        const maturityAmount = principal * Math.pow(1 + rate/n, n * tenureYears);
        const interestEarned = maturityAmount - principal;

        // TDS calculation (10% if interest > ₹40,000 for general, ₹50,000 for senior citizens)
        const tdsThreshold = isSeniorCitizen ? 50000 : 40000;
        const tdsAmount = interestEarned > tdsThreshold ? interestEarned * 0.10 : 0;
        const netMaturityAmount = maturityAmount - tdsAmount;

        // Tax calculation (assuming 30% tax bracket)
        const taxableInterest = interestEarned;
        const taxAmount = taxableInterest * 0.30; // 30% tax on interest
        const postTaxMaturity = principal + interestEarned - taxAmount;

        // Effective annual yield
        const effectiveYield = (Math.pow(maturityAmount / principal, 1 / tenureYears) - 1) * 100;

        // Monthly breakdown
        const monthlyInterest = interestEarned / (tenureYears * 12);

        const bankNames = {
            public: 'Public Sector Bank',
            private: 'Private Sector Bank',
            small: 'Small Finance Bank',
            post: 'Post Office'
        };

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Maturity Amount</span>
                    <span class="result-value">₹${maturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Interest Earned</span>
                    <span class="result-value" style="color: #10B981;">₹${interestEarned.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Post-Tax Maturity (30% bracket)</span>
                    <span class="result-value">₹${postTaxMaturity.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Fixed Deposit Details</h3>
                    <div class="breakdown-item">
                        <span>Principal Amount:</span>
                        <span>₹${principal.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Rate:</span>
                        <span>${annualRate}% p.a. ${isSeniorCitizen ? '(incl. 0.5% senior bonus)' : ''}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tenure:</span>
                        <span>${tenureYears >= 1 ? tenureYears + ' year(s)' : (tenureYears * 12) + ' months'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Compounding:</span>
                        <span>${compounding.charAt(0).toUpperCase() + compounding.slice(1)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Bank Type:</span>
                        <span>${bankNames[bankType]}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Senior Citizen:</span>
                        <span>${isSeniorCitizen ? 'Yes' : 'No'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Returns Analysis</h3>
                    <div class="breakdown-item">
                        <span>Principal Invested:</span>
                        <span>₹${principal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Earned:</span>
                        <span>₹${interestEarned.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Maturity Value:</span>
                        <span style="font-weight: 600;">₹${maturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Absolute Return:</span>
                        <span>${((interestEarned / principal) * 100).toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Effective Annual Yield:</span>
                        <span>${effectiveYield.toFixed(2)}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Average Monthly Interest:</span>
                        <span>₹${monthlyInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Implications</h3>
                    <div class="breakdown-item">
                        <span>Taxable Interest:</span>
                        <span>₹${taxableInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>TDS Threshold:</span>
                        <span>₹${tdsThreshold.toLocaleString('en-IN')}</span>
                    </div>
                    ${tdsAmount > 0 ? `
                    <div class="breakdown-item">
                        <span>TDS Deducted (10%):</span>
                        <span style="color: #EF4444;">₹${tdsAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Maturity (After TDS):</span>
                        <span>₹${netMaturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ` : `
                    <div class="breakdown-item">
                        <span>TDS Applicable:</span>
                        <span style="color: #10B981;">No (Below threshold)</span>
                    </div>
                    `}
                    <div class="breakdown-item">
                        <span>Tax Liability (30% bracket):</span>
                        <span>₹${taxAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Post-Tax Maturity:</span>
                        <span>₹${postTaxMaturity.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *Interest earned is taxable as per your income tax slab. TDS is deducted if interest exceeds ₹${tdsThreshold.toLocaleString('en-IN')}/year.
                    </p>
                </div>
                <div class="result-breakdown">
                    <h3>FD Features by Bank Type</h3>
                    ${bankType === 'small' ? `
                    <p style="font-size: 0.85rem; color: var(--text-secondary);">
                        <strong>Small Finance Banks:</strong> Typically offer 0.5-1% higher interest rates than traditional banks. DICGC insured up to ₹5 lakh per depositor per bank.
                    </p>
                    ` : bankType === 'post' ? `
                    <p style="font-size: 0.85rem; color: var(--text-secondary);">
                        <strong>Post Office FD:</strong> Government-backed, sovereign guarantee. 5-year FD eligible for ₹1.5L deduction under Section 80C.
                    </p>
                    ` : bankType === 'private' ? `
                    <p style="font-size: 0.85rem; color: var(--text-secondary);">
                        <strong>Private Banks:</strong> Competitive rates, better digital banking. DICGC insured up to ₹5 lakh.
                    </p>
                    ` : `
                    <p style="font-size: 0.85rem; color: var(--text-secondary);">
                        <strong>Public Sector Banks:</strong> Government-owned, perceived as safer. DICGC insured up to ₹5 lakh.
                    </p>
                    `}
                </div>
                <div class="result-breakdown">
                    <h3>Key Points</h3>
                    <div class="breakdown-item">
                        <span>Premature Withdrawal:</span>
                        <span>Allowed with penalty (0.5-1%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Against FD:</span>
                        <span>Available (up to 90% of value)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Deposit Insurance:</span>
                        <span>₹5 lakh per bank (DICGC)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Auto-Renewal:</span>
                        <span>Available at maturity</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('fd', { principal, maturityAmount, tenureYears }, { value: 'high-cpc' });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for fd');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
