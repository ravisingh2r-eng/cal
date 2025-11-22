/**
 * Bonus Calculator
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

        // Dynamic update for bonus type
        document.addEventListener('change', function(e) {
            if (e.target && e.target.id === 'bonusType') {
                updateBonusFields(e.target.value);
            }
        });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="calc-input-group">
                <label>Basic Salary (₹/month)</label>
                <input type="number" class="calc-input" id="basicSalary" placeholder="Enter basic salary" value="50000">
            </div>
            <div class="calc-input-group">
                <label>Dearness Allowance (DA) (₹/month)</label>
                <input type="number" class="calc-input" id="da" placeholder="Enter DA" value="5000">
            </div>
            <div class="calc-input-group">
                <label>Bonus Type</label>
                <select class="calc-input" id="bonusType">
                    <option value="performance">Performance Bonus</option>
                    <option value="statutory">Statutory Bonus (Payment of Bonus Act)</option>
                    <option value="annual">Annual Bonus</option>
                    <option value="festival">Festival Bonus</option>
                    <option value="retention">Retention Bonus</option>
                </select>
            </div>
            <div class="calc-input-group" id="performanceGroup">
                <label>Performance Rating</label>
                <select class="calc-input" id="performanceRating">
                    <option value="5">Outstanding (5)</option>
                    <option value="4" selected>Exceeds Expectations (4)</option>
                    <option value="3">Meets Expectations (3)</option>
                    <option value="2">Needs Improvement (2)</option>
                    <option value="1">Unsatisfactory (1)</option>
                </select>
            </div>
            <div class="calc-input-group" id="percentageGroup">
                <label>Bonus Percentage (%)</label>
                <input type="number" class="calc-input" id="bonusPercent" placeholder="Enter bonus %" value="20" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Months of Service in Year</label>
                <input type="number" class="calc-input" id="monthsWorked" placeholder="Months worked" value="12" min="1" max="12">
            </div>
            <div class="calc-input-group">
                <label>Company Allocable Surplus (₹)</label>
                <input type="number" class="calc-input" id="allocableSurplus" placeholder="For statutory bonus" value="1000000">
            </div>
            <div class="calc-input-group">
                <label>Income Tax Slab (%)</label>
                <select class="calc-input" id="taxSlab">
                    <option value="0">0% (Income up to ₹2.5L)</option>
                    <option value="5">5% (₹2.5L - ₹5L)</option>
                    <option value="10">10% (₹5L - ₹7.5L)</option>
                    <option value="15">15% (₹7.5L - ₹10L)</option>
                    <option value="20" selected>20% (₹10L - ₹12.5L)</option>
                    <option value="25">25% (₹12.5L - ₹15L)</option>
                    <option value="30">30% (Above ₹15L)</option>
                </select>
            </div>
        `;
    }

    function updateBonusFields(bonusType) {
        const performanceGroup = document.getElementById('performanceGroup');
        const percentageGroup = document.getElementById('percentageGroup');

        if (bonusType === 'performance') {
            if (performanceGroup) performanceGroup.style.display = 'block';
            if (percentageGroup) percentageGroup.style.display = 'block';
        } else if (bonusType === 'statutory') {
            if (performanceGroup) performanceGroup.style.display = 'none';
            if (percentageGroup) percentageGroup.style.display = 'none';
        } else {
            if (performanceGroup) performanceGroup.style.display = 'none';
            if (percentageGroup) percentageGroup.style.display = 'block';
        }
    }

    function calculate() {
        const basicSalary = parseFloat(document.getElementById('basicSalary').value) || 0;
        const da = parseFloat(document.getElementById('da').value) || 0;
        const bonusType = document.getElementById('bonusType').value;
        const performanceRating = parseFloat(document.getElementById('performanceRating').value) || 3;
        const bonusPercent = parseFloat(document.getElementById('bonusPercent').value) || 20;
        const monthsWorked = parseFloat(document.getElementById('monthsWorked').value) || 12;
        const allocableSurplus = parseFloat(document.getElementById('allocableSurplus').value) || 0;
        const taxSlab = parseFloat(document.getElementById('taxSlab').value) || 0;

        if (basicSalary <= 0) {
            alert('Please enter valid basic salary');
            return;
        }

        let bonusAmount = 0;
        let bonusCalculationMethod = '';
        let eligibilityCheck = '';
        let maxBonusLimit = 0;

        const annualBasicSalary = basicSalary * 12;
        const annualDA = da * 12;
        const totalAnnualSalary = annualBasicSalary + annualDA;

        // Calculate based on bonus type
        if (bonusType === 'statutory') {
            // Payment of Bonus Act, 1965
            // Minimum: 8.33% of salary or ₹100, whichever is higher
            // Maximum: 20% of salary
            // Eligible if earning up to ₹21,000/month

            const monthlyWages = basicSalary + da;
            const eligibilityLimit = 21000;

            if (monthlyWages <= eligibilityLimit) {
                eligibilityCheck = 'Eligible for statutory bonus';

                // Calculate bonus based on working days
                const bonusEligibleWages = Math.min(monthlyWages, 7000); // Max ₹7,000 per month for calculation
                const annualEligibleWages = bonusEligibleWages * 12;

                // Minimum 8.33%
                const minBonus = annualEligibleWages * 0.0833;

                // Maximum 20%
                const maxBonus = annualEligibleWages * 0.20;

                // Pro-rata for months worked
                bonusAmount = (minBonus / 12) * monthsWorked;
                maxBonusLimit = (maxBonus / 12) * monthsWorked;

                // Minimum ₹100
                bonusAmount = Math.max(bonusAmount, 100);

                bonusCalculationMethod = `Statutory Bonus (Payment of Bonus Act, 1965)`;
            } else {
                eligibilityCheck = 'Not eligible (salary exceeds ₹21,000/month)';
                bonusAmount = 0;
                bonusCalculationMethod = 'Not Applicable';
            }
        } else if (bonusType === 'performance') {
            // Performance-based bonus
            const performanceMultiplier = {
                5: 1.5,  // Outstanding - 150%
                4: 1.2,  // Exceeds - 120%
                3: 1.0,  // Meets - 100%
                2: 0.5,  // Needs Improvement - 50%
                1: 0.0   // Unsatisfactory - 0%
            };

            const multiplier = performanceMultiplier[performanceRating] || 1.0;
            bonusAmount = ((totalAnnualSalary * bonusPercent / 100) * multiplier / 12) * monthsWorked;
            bonusCalculationMethod = `Performance-based (Rating: ${performanceRating}/5, ${multiplier*100}% of target)`;
            eligibilityCheck = 'Eligible';
        } else if (bonusType === 'annual') {
            // Annual bonus - typically a percentage of annual CTC
            bonusAmount = ((totalAnnualSalary * bonusPercent / 100) / 12) * monthsWorked;
            bonusCalculationMethod = `Annual Bonus (${bonusPercent}% of annual salary)`;
            eligibilityCheck = 'Eligible';
        } else if (bonusType === 'festival') {
            // Festival bonus - typically a fixed amount or percentage
            bonusAmount = ((totalAnnualSalary * bonusPercent / 100) / 12) * monthsWorked;
            bonusCalculationMethod = `Festival Bonus (${bonusPercent}% of annual salary)`;
            eligibilityCheck = 'Eligible';
        } else if (bonusType === 'retention') {
            // Retention bonus - typically higher percentage
            bonusAmount = ((totalAnnualSalary * bonusPercent / 100) / 12) * monthsWorked;
            bonusCalculationMethod = `Retention Bonus (${bonusPercent}% of annual salary)`;
            eligibilityCheck = 'Eligible';
        }

        // Tax calculations
        // Bonus is fully taxable as per slab
        const taxOnBonus = bonusAmount * (taxSlab / 100);
        const netBonus = bonusAmount - taxOnBonus;

        // Section 80CCC deduction (if applicable - for pension contributions)
        const maxDeduction80CCC = 150000;
        const possibleDeduction = Math.min(bonusAmount * 0.1, maxDeduction80CCC); // Assume 10% can be invested

        // Calculate post-deduction tax
        const taxableAfterDeduction = Math.max(0, bonusAmount - possibleDeduction);
        const taxAfterDeduction = taxableAfterDeduction * (taxSlab / 100);
        const netBonusAfterDeduction = bonusAmount - taxAfterDeduction;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Gross Bonus Amount</span>
                    <span class="result-value">₹${bonusAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Net Bonus (After Tax)</span>
                    <span class="result-value">₹${netBonus.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Tax on Bonus</span>
                    <span class="result-value">₹${taxOnBonus.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Bonus Calculation Details</h3>
                    <div class="breakdown-item">
                        <span>Bonus Type:</span>
                        <span>${bonusType.charAt(0).toUpperCase() + bonusType.slice(1)} Bonus</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Calculation Method:</span>
                        <span>${bonusCalculationMethod}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Eligibility Status:</span>
                        <span>${eligibilityCheck}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Months Considered:</span>
                        <span>${monthsWorked} months</span>
                    </div>
                    ${maxBonusLimit > 0 ? `
                    <div class="breakdown-item">
                        <span>Maximum Statutory Limit:</span>
                        <span>₹${maxBonusLimit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="result-breakdown">
                    <h3>Salary Components</h3>
                    <div class="breakdown-item">
                        <span>Monthly Basic Salary:</span>
                        <span>₹${basicSalary.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Dearness Allowance:</span>
                        <span>₹${da.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Monthly Wages:</span>
                        <span>₹${(basicSalary + da).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Salary (Basic + DA):</span>
                        <span>₹${totalAnnualSalary.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Implications</h3>
                    <div class="breakdown-item">
                        <span>Gross Bonus:</span>
                        <span>₹${bonusAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Applicable Tax Slab:</span>
                        <span>${taxSlab}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Deducted:</span>
                        <span>₹${taxOnBonus.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Bonus (Post-Tax):</span>
                        <span>₹${netBonus.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Take-home %:</span>
                        <span>${((netBonus/bonusAmount)*100).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Saving Opportunities (Section 80CCC)</h3>
                    <div class="breakdown-item">
                        <span>Possible 80CCC Investment:</span>
                        <span>₹${possibleDeduction.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Saved on Investment:</span>
                        <span>₹${(possibleDeduction * taxSlab / 100).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Bonus (With 80CCC):</span>
                        <span>₹${netBonusAfterDeduction.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Additional Savings:</span>
                        <span>₹${(netBonusAfterDeduction - netBonus).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                ${bonusType === 'statutory' ? `
                <div class="result-breakdown">
                    <h3>Payment of Bonus Act, 1965 - Key Points</h3>
                    <div class="breakdown-item">
                        <span>Eligibility Limit:</span>
                        <span>Up to ₹21,000/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Calculation Ceiling:</span>
                        <span>₹7,000/month maximum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Minimum Bonus:</span>
                        <span>8.33% of annual salary or ₹100</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Maximum Bonus:</span>
                        <span>20% of annual salary</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Minimum Service:</span>
                        <span>30 working days in a year</span>
                    </div>
                </div>
                ` : ''}
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        // Track high-value calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('bonus', {
                bonusType,
                basicSalary,
                bonusAmount,
                netBonus
            }, {
                value: 'high-cpc',
                bonusInLakhs: bonusAmount/100000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for bonus calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
