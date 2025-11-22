/**
 * TDS Calculator
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

        // Add listener for income type change to update TDS rate
        document.addEventListener('change', (e) => {
            if (e.target.id === 'incomeType') {
                updateTDSRate();
            }
        });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="calc-input-group">
                <label>Income Amount (₹)</label>
                <input type="number" class="calc-input" id="incomeAmount" placeholder="Enter income amount" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Income Type</label>
                <select class="calc-input" id="incomeType">
                    <option value="salary">Salary</option>
                    <option value="interest">Interest (194A)</option>
                    <option value="rent">Rent (194I)</option>
                    <option value="professional">Professional Fees (194J)</option>
                    <option value="commission">Commission (194H)</option>
                    <option value="contractor">Contractor (194C)</option>
                    <option value="dividend">Dividend (194)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>PAN Available</label>
                <select class="calc-input" id="panAvailable">
                    <option value="yes" selected>Yes</option>
                    <option value="no">No (Higher TDS Rate Applicable)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Frequency</label>
                <select class="calc-input" id="frequency">
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually" selected>Annually</option>
                    <option value="one-time">One-time</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Financial Year</label>
                <select class="calc-input" id="financialYear">
                    <option value="2024-25" selected>2024-25</option>
                    <option value="2025-26">2025-26</option>
                </select>
            </div>
        `;
    }

    function updateTDSRate() {
        // This function can be used to show rate info when income type changes
        const incomeType = document.getElementById('incomeType').value;
        const panAvailable = document.getElementById('panAvailable').value;
        console.log(`TDS rate info updated for ${incomeType}, PAN: ${panAvailable}`);
    }

    function getTDSRate(incomeType, panAvailable, incomeAmount) {
        // Without PAN, TDS rate is 20% for most cases
        if (panAvailable === 'no') {
            return 0.20; // 20% TDS without PAN
        }

        // Standard TDS rates with PAN
        switch(incomeType) {
            case 'salary':
                // For salary, TDS is as per income tax slabs
                // Using new tax regime FY 2024-25 for simplification
                if (incomeAmount <= 300000) return 0;
                if (incomeAmount <= 600000) return 0.05;
                if (incomeAmount <= 900000) return 0.10;
                if (incomeAmount <= 1200000) return 0.15;
                if (incomeAmount <= 1500000) return 0.20;
                return 0.30;
            case 'interest':
                return 0.10; // 10% under Section 194A
            case 'rent':
                return 0.10; // 10% under Section 194I
            case 'professional':
                return 0.10; // 10% under Section 194J
            case 'commission':
                return 0.05; // 5% under Section 194H
            case 'contractor':
                return 0.01; // 1% for individuals/HUF under Section 194C
            case 'dividend':
                return 0.10; // 10% under Section 194
            default:
                return 0.10;
        }
    }

    function getSectionReference(incomeType) {
        const sections = {
            'salary': 'Section 192',
            'interest': 'Section 194A',
            'rent': 'Section 194I',
            'professional': 'Section 194J',
            'commission': 'Section 194H',
            'contractor': 'Section 194C',
            'dividend': 'Section 194'
        };
        return sections[incomeType] || 'Income Tax Act';
    }

    function getThresholdLimit(incomeType) {
        const thresholds = {
            'salary': '₹2,50,000 (Basic Exemption)',
            'interest': '₹40,000 (₹50,000 for senior citizens)',
            'rent': '₹2,40,000 per annum',
            'professional': '₹30,000 per annum',
            'commission': '₹15,000 per annum',
            'contractor': '₹30,000 (single), ₹1,00,000 (aggregate)',
            'dividend': '₹5,000 per annum'
        };
        return thresholds[incomeType] || 'As per Income Tax Act';
    }

    function calculate() {
        const incomeAmount = parseFloat(document.getElementById('incomeAmount').value) || 0;
        const incomeType = document.getElementById('incomeType').value;
        const panAvailable = document.getElementById('panAvailable').value;
        const frequency = document.getElementById('frequency').value;
        const financialYear = document.getElementById('financialYear').value;

        if (incomeAmount <= 0) {
            alert('Please enter a valid income amount');
            return;
        }

        // Get TDS rate
        const tdsRate = getTDSRate(incomeType, panAvailable, incomeAmount);
        const tdsRatePercent = tdsRate * 100;

        // Calculate TDS amount
        let tdsAmount = incomeAmount * tdsRate;

        // For salary, calculate more accurately based on slabs
        if (incomeType === 'salary') {
            tdsAmount = calculateSalaryTDS(incomeAmount, panAvailable);
        }

        const netPayment = incomeAmount - tdsAmount;

        // Annual projections based on frequency
        let annualIncome = incomeAmount;
        let annualTDS = tdsAmount;
        let paymentCount = 1;

        switch(frequency) {
            case 'monthly':
                annualIncome = incomeAmount * 12;
                annualTDS = tdsAmount * 12;
                paymentCount = 12;
                break;
            case 'quarterly':
                annualIncome = incomeAmount * 4;
                annualTDS = tdsAmount * 4;
                paymentCount = 4;
                break;
            case 'annually':
                annualIncome = incomeAmount;
                annualTDS = tdsAmount;
                paymentCount = 1;
                break;
            case 'one-time':
                annualIncome = incomeAmount;
                annualTDS = tdsAmount;
                paymentCount = 1;
                break;
        }

        const effectiveTaxRate = (tdsAmount / incomeAmount) * 100;
        const sectionRef = getSectionReference(incomeType);
        const threshold = getThresholdLimit(incomeType);

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">TDS Amount</span>
                    <span class="result-value">₹${tdsAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Net Payment (After TDS)</span>
                    <span class="result-value">₹${netPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">TDS Rate Applied</span>
                    <span class="result-value">${tdsRatePercent.toFixed(2)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Section Reference</span>
                    <span class="result-value">${sectionRef}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Payment Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Gross Income:</span>
                        <span>₹${incomeAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>TDS Deducted:</span>
                        <span>₹${tdsAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Amount Received:</span>
                        <span>₹${netPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Effective Tax Rate:</span>
                        <span>${effectiveTaxRate.toFixed(2)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Annual Projection (${financialYear})</h3>
                    <div class="breakdown-item">
                        <span>Payment Frequency:</span>
                        <span>${frequency.charAt(0).toUpperCase() + frequency.slice(1)} (${paymentCount}x per year)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Gross Income:</span>
                        <span>₹${annualIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual TDS Deduction:</span>
                        <span>₹${annualTDS.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Net Income:</span>
                        <span>₹${(annualIncome - annualTDS).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>TDS Details & Compliance</h3>
                    <div class="breakdown-item">
                        <span>Income Type:</span>
                        <span>${incomeType.charAt(0).toUpperCase() + incomeType.slice(1)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>PAN Status:</span>
                        <span>${panAvailable === 'yes' ? 'Available' : 'Not Available (20% TDS)'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Applicable Section:</span>
                        <span>${sectionRef}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Threshold Limit:</span>
                        <span>${threshold}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Important Notes</h3>
                    <div class="breakdown-item" style="display: block; padding: 10px; background: #f3f4f6; border-radius: 4px;">
                        <ul style="margin: 0; padding-left: 20px;">
                            <li>TDS is deducted at source by the payer and deposited with the government</li>
                            <li>You can claim credit for TDS deducted when filing your income tax return</li>
                            ${panAvailable === 'no' ? '<li><strong>Without PAN, TDS is deducted at 20% - Please provide PAN to reduce TDS</strong></li>' : ''}
                            <li>Check Form 26AS or AIS to verify TDS credits</li>
                            <li>If excess TDS is deducted, you can claim refund while filing ITR</li>
                            <li>TDS certificate (Form 16/16A) will be issued by the deductor</li>
                        </ul>
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
            trackCalculation('tds-calculator', {
                incomeAmount,
                incomeType,
                tdsAmount,
                annualIncome
            }, {
                value: 'high-cpc',
                tdsInLakhs: tdsAmount/100000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function calculateSalaryTDS(annualIncome, panAvailable) {
        if (panAvailable === 'no') {
            return annualIncome * 0.20;
        }

        // New tax regime FY 2024-25
        let tax = 0;

        if (annualIncome <= 300000) {
            tax = 0;
        } else if (annualIncome <= 600000) {
            tax = (annualIncome - 300000) * 0.05;
        } else if (annualIncome <= 900000) {
            tax = 15000 + (annualIncome - 600000) * 0.10;
        } else if (annualIncome <= 1200000) {
            tax = 45000 + (annualIncome - 900000) * 0.15;
        } else if (annualIncome <= 1500000) {
            tax = 90000 + (annualIncome - 1200000) * 0.20;
        } else {
            tax = 150000 + (annualIncome - 1500000) * 0.30;
        }

        // Add 4% Health and Education Cess
        tax = tax * 1.04;

        return tax;
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for tds-calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
