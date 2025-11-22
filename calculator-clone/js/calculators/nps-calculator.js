/**
 * NPS Calculator
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
                <label>Current Age (years)</label>
                <input type="number" class="calc-input" id="currentAge" placeholder="Enter current age" value="30" min="18" max="65">
            </div>
            <div class="calc-input-group">
                <label>Retirement Age</label>
                <select class="calc-input" id="retirementAge">
                    <option value="60" selected>60 years</option>
                    <option value="65">65 years</option>
                    <option value="70">70 years (extended)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Monthly Contribution (₹)</label>
                <input type="number" class="calc-input" id="monthlyContribution" placeholder="Enter monthly amount" value="5000">
            </div>
            <div class="calc-input-group">
                <label>Expected Annual Return (%)</label>
                <input type="number" class="calc-input" id="returnRate" placeholder="Typical: 9-12%" value="10" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Asset Allocation</label>
                <select class="calc-input" id="assetAllocation">
                    <option value="aggressive">Aggressive (75% Equity, 25% Debt)</option>
                    <option value="moderate" selected>Moderate (50% Equity, 50% Debt)</option>
                    <option value="conservative">Conservative (25% Equity, 75% Debt)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Annuity Rate (%)</label>
                <input type="number" class="calc-input" id="annuityRate" placeholder="Typical: 6-8%" value="7" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Annual Income (for tax benefit)</label>
                <input type="number" class="calc-input" id="annualIncome" placeholder="Enter annual income" value="1200000">
            </div>
        `;
    }

    function calculate() {
        const currentAge = parseFloat(document.getElementById('currentAge').value) || 30;
        const retirementAge = parseFloat(document.getElementById('retirementAge').value) || 60;
        const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 5000;
        const returnRate = parseFloat(document.getElementById('returnRate').value) || 10;
        const annuityRate = parseFloat(document.getElementById('annuityRate').value) || 7;
        const annualIncome = parseFloat(document.getElementById('annualIncome').value) || 1200000;

        if (currentAge >= retirementAge) {
            alert('Retirement age must be greater than current age');
            return;
        }

        if (monthlyContribution <= 0) {
            alert('Please enter a valid monthly contribution');
            return;
        }

        // Calculate investment period
        const yearsToRetirement = retirementAge - currentAge;
        const monthsToRetirement = yearsToRetirement * 12;

        // Calculate total contribution
        const totalContribution = monthlyContribution * monthsToRetirement;

        // Calculate maturity corpus using compound interest
        const monthlyRate = returnRate / 12 / 100;
        const maturityCorpus = monthlyContribution *
            ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate) *
            (1 + monthlyRate);

        // Calculate wealth gained
        const wealthGained = maturityCorpus - totalContribution;

        // NPS withdrawal rules
        // Minimum 40% must be used to purchase annuity
        // Maximum 60% can be withdrawn as lump sum
        const mandatoryAnnuity = maturityCorpus * 0.40; // 40% mandatory
        const maxLumpSum = maturityCorpus * 0.60; // 60% max lump sum

        // Tax-free lump sum (60% of corpus is tax-free at withdrawal)
        const taxFreeLumpSum = maxLumpSum;

        // Calculate monthly pension from annuity
        const monthlyPension = (mandatoryAnnuity * annuityRate) / (12 * 100);

        // Annual pension
        const annualPension = monthlyPension * 12;

        // Tax benefits under different sections
        const annualContribution = monthlyContribution * 12;
        const taxBenefits = calculateNPSTaxBenefits(annualContribution, annualIncome);

        // Total tax saved over investment period
        const totalTaxSaved = taxBenefits.totalBenefit * yearsToRetirement;

        // Effective corpus (after tax savings)
        const effectiveCorpus = maturityCorpus + totalTaxSaved;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Maturity Corpus at ${retirementAge}</span>
                    <span class="result-value">₹${maturityCorpus.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Monthly Pension</span>
                    <span class="result-value">₹${monthlyPension.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Lump Sum (60%)</span>
                    <span class="result-value">₹${maxLumpSum.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Wealth Gained</span>
                    <span class="result-value">₹${wealthGained.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Investment Details</h3>
                    <div class="breakdown-item">
                        <span>Current Age:</span>
                        <span>${currentAge} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Retirement Age:</span>
                        <span>${retirementAge} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Investment Period:</span>
                        <span>${yearsToRetirement} years (${monthsToRetirement} months)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Contribution:</span>
                        <span>₹${monthlyContribution.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Expected Return:</span>
                        <span>${returnRate}% per annum</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Corpus Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Total Contribution:</span>
                        <span>₹${totalContribution.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Wealth Gained (Returns):</span>
                        <span>₹${wealthGained.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Total Corpus:</strong></span>
                        <span><strong>₹${maturityCorpus.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong></span>
                    </div>
                    <div class="breakdown-item">
                        <span>Corpus in Crores:</span>
                        <span>₹${(maturityCorpus/10000000).toFixed(2)} Cr</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Returns Multiple:</span>
                        <span>${(maturityCorpus/totalContribution).toFixed(2)}x</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Withdrawal Options at Retirement</h3>
                    <div class="breakdown-item">
                        <span>Option 1 - Lump Sum (60%):</span>
                        <span>₹${maxLumpSum.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax on Lump Sum:</span>
                        <span>₹0 (Tax-Free)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Option 2 - Annuity (40%):</span>
                        <span>₹${mandatoryAnnuity.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item" style="display: block; padding: 10px; background: #f3f4f6; border-radius: 4px; margin-top: 10px;">
                        <p style="margin: 0; font-size: 14px;">
                            <strong>Note:</strong> Minimum 40% of corpus must be used to purchase annuity.
                            Up to 60% can be withdrawn as lump sum (tax-free). You can choose to invest
                            more than 40% in annuity for higher pension.
                        </p>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Monthly Pension Details</h3>
                    <div class="breakdown-item">
                        <span>Annuity Amount (40%):</span>
                        <span>₹${mandatoryAnnuity.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annuity Rate:</span>
                        <span>${annuityRate}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Pension:</span>
                        <span>₹${monthlyPension.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Pension:</span>
                        <span>₹${annualPension.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item" style="display: block; padding: 10px; background: #fff3cd; border-radius: 4px; margin-top: 10px;">
                        <p style="margin: 0; font-size: 14px;">
                            <strong>Taxation:</strong> Pension income is taxable as per your income tax slab.
                        </p>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Benefits</h3>
                    <div class="breakdown-item">
                        <span>Annual Contribution:</span>
                        <span>₹${annualContribution.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Section 80CCD(1) Benefit:</span>
                        <span>₹${taxBenefits.section80CCD1.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Section 80CCD(1B) Benefit:</span>
                        <span>₹${taxBenefits.section80CCD1B.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Tax Benefit/Year:</span>
                        <span>₹${taxBenefits.totalBenefit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Saved (${yearsToRetirement} years):</span>
                        <span>₹${totalTaxSaved.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item" style="display: block; padding: 10px; background: #f3f4f6; border-radius: 4px; margin-top: 10px;">
                        <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                            <li><strong>80CCD(1):</strong> Up to ₹1.5L under overall 80C limit</li>
                            <li><strong>80CCD(1B):</strong> Additional ₹50,000 deduction (exclusive)</li>
                            <li><strong>80CCD(2):</strong> Employer contribution (if applicable)</li>
                            <li><strong>Withdrawal:</strong> 60% lump sum is tax-free at maturity</li>
                        </ul>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Retirement Summary</h3>
                    <div class="breakdown-item">
                        <span>You will receive at ${retirementAge}:</span>
                        <span></span>
                    </div>
                    <div class="breakdown-item">
                        <span>1. Tax-Free Lump Sum:</span>
                        <span>₹${taxFreeLumpSum.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>2. Monthly Pension (Life):</span>
                        <span>₹${monthlyPension.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>3. Tax Savings (Till ${retirementAge}):</span>
                        <span>₹${totalTaxSaved.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Effective Wealth:</strong></span>
                        <span><strong>₹${effectiveCorpus.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong></span>
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
            trackCalculation('nps-calculator', {
                currentAge,
                retirementAge,
                monthlyContribution,
                maturityCorpus,
                monthlyPension
            }, {
                value: 'high-cpc',
                corpusInCrores: maturityCorpus/10000000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function calculateNPSTaxBenefits(annualContribution, annualIncome) {
        // Calculate tax rate based on income
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

        // Add 4% cess
        taxRate = taxRate * 1.04;

        // Section 80CCD(1) - Part of 80C limit (₹1.5L)
        const section80CCD1Amount = Math.min(annualContribution, 150000);
        const section80CCD1Benefit = section80CCD1Amount * taxRate;

        // Section 80CCD(1B) - Additional ₹50,000
        const section80CCD1BAmount = Math.min(Math.max(0, annualContribution - 150000), 50000);
        const section80CCD1BBenefit = section80CCD1BAmount * taxRate;

        // Total benefit
        const totalBenefit = section80CCD1Benefit + section80CCD1BBenefit;

        return {
            section80CCD1: section80CCD1Benefit,
            section80CCD1B: section80CCD1BBenefit,
            totalBenefit: totalBenefit
        };
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for nps-calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
