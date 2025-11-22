/**
 * Advance Tax Calculator
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
                <label>Annual Salary Income (₹)</label>
                <input type="number" class="calc-input" id="salaryIncome" placeholder="Enter salary income" value="1500000">
            </div>
            <div class="calc-input-group">
                <label>Other Income - Interest/Rental (₹)</label>
                <input type="number" class="calc-input" id="otherIncome" placeholder="Enter other income" value="0">
            </div>
            <div class="calc-input-group">
                <label>Capital Gains (₹)</label>
                <input type="number" class="calc-input" id="capitalGains" placeholder="Enter capital gains" value="0">
            </div>
            <div class="calc-input-group">
                <label>Tax Regime</label>
                <select class="calc-input" id="regime">
                    <option value="old">Old Tax Regime (with deductions)</option>
                    <option value="new" selected>New Tax Regime (lower rates)</option>
                </select>
            </div>
            <div class="calc-input-group" id="deductionsGroup">
                <label>Section 80C Deductions (₹)</label>
                <input type="number" class="calc-input" id="deduction80C" placeholder="EPF, PPF, ELSS, etc." value="0">
            </div>
            <div class="calc-input-group" id="deductions80DGroup">
                <label>Section 80D Health Insurance (₹)</label>
                <input type="number" class="calc-input" id="deduction80D" placeholder="Health insurance premium" value="0">
            </div>
            <div class="calc-input-group" id="hraGroup">
                <label>HRA Exemption (₹)</label>
                <input type="number" class="calc-input" id="hraExemption" placeholder="HRA exemption claimed" value="0">
            </div>
            <div class="calc-input-group" id="otherDeductionsGroup">
                <label>Other Deductions (₹)</label>
                <input type="number" class="calc-input" id="otherDeductions" placeholder="80E, 80G, NPS, etc." value="0">
            </div>
            <div class="calc-input-group">
                <label>TDS Already Deducted (₹)</label>
                <input type="number" class="calc-input" id="tdsDeducted" placeholder="Total TDS from salary" value="150000">
            </div>
            <div class="calc-input-group">
                <label>Current Date</label>
                <select class="calc-input" id="currentQuarter">
                    <option value="1">Before June 15 (Q1)</option>
                    <option value="2" selected>Before September 15 (Q2)</option>
                    <option value="3">Before December 15 (Q3)</option>
                    <option value="4">Before March 15 (Q4)</option>
                </select>
            </div>
        `;

        // Add event listener for regime change
        const regimeSelect = document.getElementById('regime');
        if (regimeSelect) {
            regimeSelect.addEventListener('change', toggleDeductionFields);
            toggleDeductionFields();
        }
    }

    function toggleDeductionFields() {
        const regime = document.getElementById('regime').value;
        const deductionGroups = ['deductionsGroup', 'deductions80DGroup', 'hraGroup', 'otherDeductionsGroup'];

        deductionGroups.forEach(groupId => {
            const group = document.getElementById(groupId);
            if (group) {
                if (regime === 'old') {
                    group.style.display = 'block';
                } else {
                    group.style.display = 'none';
                }
            }
        });
    }

    function calculate() {
        const salaryIncome = parseFloat(document.getElementById('salaryIncome').value) || 0;
        const otherIncome = parseFloat(document.getElementById('otherIncome').value) || 0;
        const capitalGains = parseFloat(document.getElementById('capitalGains').value) || 0;
        const regime = document.getElementById('regime').value;
        const deduction80C = regime === 'old' ? Math.min(parseFloat(document.getElementById('deduction80C').value) || 0, 150000) : 0;
        const deduction80D = regime === 'old' ? Math.min(parseFloat(document.getElementById('deduction80D').value) || 0, 50000) : 0;
        const hraExemption = regime === 'old' ? parseFloat(document.getElementById('hraExemption').value) || 0 : 0;
        const otherDeductions = regime === 'old' ? parseFloat(document.getElementById('otherDeductions').value) || 0 : 0;
        const tdsDeducted = parseFloat(document.getElementById('tdsDeducted').value) || 0;
        const currentQuarter = parseInt(document.getElementById('currentQuarter').value);

        // Calculate total income
        const totalIncome = salaryIncome + otherIncome + capitalGains;

        // Calculate total deductions
        const totalDeductions = deduction80C + deduction80D + hraExemption + otherDeductions;

        // Calculate tax liability
        let totalTax = 0;
        if (regime === 'old') {
            totalTax = calculateOldRegimeTax(totalIncome, totalDeductions);
        } else {
            totalTax = calculateNewRegimeTax(totalIncome);
        }

        // Calculate advance tax installments
        const installment1 = totalTax * 0.15; // 15% by June 15
        const installment2 = totalTax * 0.30; // 30% by Sept 15 (45% cumulative - 15% already paid)
        const installment3 = totalTax * 0.30; // 30% by Dec 15 (75% cumulative - 45% already paid)
        const installment4 = totalTax * 0.25; // 25% by March 15 (100% cumulative - 75% already paid)

        // Calculate cumulative amounts
        const cumulative1 = installment1;
        const cumulative2 = cumulative1 + installment2;
        const cumulative3 = cumulative2 + installment3;
        const cumulative4 = cumulative3 + installment4;

        // Calculate remaining tax after TDS
        const remainingTax = Math.max(totalTax - tdsDeducted, 0);
        const refundDue = Math.max(tdsDeducted - totalTax, 0);

        // Calculate interest on late payment (1% per month)
        const monthsDelayed = (4 - currentQuarter) * 3; // Approximate months
        const interestPenalty = remainingTax > 0 && currentQuarter > 1 ? remainingTax * 0.01 * monthsDelayed : 0;

        // Determine status
        const taxStatus = remainingTax > 0 ? 'Additional tax payable' : refundDue > 0 ? 'Refund due' : 'Fully paid via TDS';

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Total Tax Liability (FY 2024-25)</span>
                    <span class="result-value">₹${totalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">TDS Already Deducted</span>
                    <span class="result-value" style="color: #10B981;">₹${tdsDeducted.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                ${remainingTax > 0 ? `
                <div class="result-item">
                    <span class="result-label">Remaining Tax Payable</span>
                    <span class="result-value" style="color: #EF4444;">₹${remainingTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                ` : ''}
                ${refundDue > 0 ? `
                <div class="result-item">
                    <span class="result-label">Refund Due</span>
                    <span class="result-value" style="color: #10B981;">₹${refundDue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                ` : ''}
                <div class="result-item">
                    <span class="result-label">Tax Status</span>
                    <span class="result-value">${taxStatus}</span>
                </div>

                <div class="result-breakdown">
                    <h3>Income Summary</h3>
                    <div class="breakdown-item">
                        <span>Salary Income:</span>
                        <span>₹${salaryIncome.toLocaleString('en-IN')}</span>
                    </div>
                    ${otherIncome > 0 ? `
                    <div class="breakdown-item">
                        <span>Other Income (Interest/Rental):</span>
                        <span>₹${otherIncome.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${capitalGains > 0 ? `
                    <div class="breakdown-item">
                        <span>Capital Gains:</span>
                        <span>₹${capitalGains.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    <div class="breakdown-item">
                        <span>Total Gross Income:</span>
                        <span style="font-weight: 600;">₹${totalIncome.toLocaleString('en-IN')}</span>
                    </div>
                    ${regime === 'old' && totalDeductions > 0 ? `
                    <div class="breakdown-item">
                        <span>Total Deductions:</span>
                        <span style="color: #10B981;">-₹${totalDeductions.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Taxable Income:</span>
                        <span style="font-weight: 600;">₹${Math.max(totalIncome - totalDeductions - 50000, 0).toLocaleString('en-IN')}</span>
                    </div>
                    ` : `
                    <div class="breakdown-item">
                        <span>Standard Deduction:</span>
                        <span style="color: #10B981;">-₹50,000</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Taxable Income:</span>
                        <span style="font-weight: 600;">₹${Math.max(totalIncome - 50000, 0).toLocaleString('en-IN')}</span>
                    </div>
                    `}
                    <div class="breakdown-item">
                        <span>Tax Regime:</span>
                        <span>${regime === 'old' ? 'Old Regime (with deductions)' : 'New Regime (lower rates)'}</span>
                    </div>
                </div>

                ${regime === 'old' && totalDeductions > 0 ? `
                <div class="result-breakdown">
                    <h3>Deductions Claimed</h3>
                    ${deduction80C > 0 ? `
                    <div class="breakdown-item">
                        <span>Section 80C:</span>
                        <span>₹${deduction80C.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${deduction80D > 0 ? `
                    <div class="breakdown-item">
                        <span>Section 80D (Health Insurance):</span>
                        <span>₹${deduction80D.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${hraExemption > 0 ? `
                    <div class="breakdown-item">
                        <span>HRA Exemption:</span>
                        <span>₹${hraExemption.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${otherDeductions > 0 ? `
                    <div class="breakdown-item">
                        <span>Other Deductions:</span>
                        <span>₹${otherDeductions.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    <div class="breakdown-item">
                        <span>Total Deductions:</span>
                        <span style="font-weight: 600; color: #10B981;">₹${totalDeductions.toLocaleString('en-IN')}</span>
                    </div>
                </div>
                ` : ''}

                <div class="result-breakdown">
                    <h3>Advance Tax Installment Schedule</h3>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">
                        Advance tax must be paid in 4 quarterly installments as per the schedule below:
                    </p>
                    <div class="breakdown-item" style="background: #F0F9FF; padding: 0.75rem; border-radius: 6px; margin-bottom: 0.5rem;">
                        <span><strong>Installment 1 (Due: June 15)</strong><br>15% of total tax</span>
                        <span style="font-weight: 600;">₹${installment1.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item" style="background: #F0F9FF; padding: 0.75rem; border-radius: 6px; margin-bottom: 0.5rem;">
                        <span><strong>Installment 2 (Due: September 15)</strong><br>30% of total tax (45% cumulative)</span>
                        <span style="font-weight: 600;">₹${installment2.toLocaleString('en-IN', {maximumFractionDigits: 0})}<br><small style="color: #666;">Cumulative: ₹${cumulative2.toLocaleString('en-IN', {maximumFractionDigits: 0})}</small></span>
                    </div>
                    <div class="breakdown-item" style="background: #F0F9FF; padding: 0.75rem; border-radius: 6px; margin-bottom: 0.5rem;">
                        <span><strong>Installment 3 (Due: December 15)</strong><br>30% of total tax (75% cumulative)</span>
                        <span style="font-weight: 600;">₹${installment3.toLocaleString('en-IN', {maximumFractionDigits: 0})}<br><small style="color: #666;">Cumulative: ₹${cumulative3.toLocaleString('en-IN', {maximumFractionDigits: 0})}</small></span>
                    </div>
                    <div class="breakdown-item" style="background: #F0F9FF; padding: 0.75rem; border-radius: 6px;">
                        <span><strong>Installment 4 (Due: March 15)</strong><br>25% of total tax (100% cumulative)</span>
                        <span style="font-weight: 600;">₹${installment4.toLocaleString('en-IN', {maximumFractionDigits: 0})}<br><small style="color: #666;">Cumulative: ₹${cumulative4.toLocaleString('en-IN', {maximumFractionDigits: 0})}</small></span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 1rem;">
                        Note: If TDS covers your entire tax liability, advance tax payment may not be required. However, if you have income other than salary (e.g., capital gains, business income), advance tax is mandatory if your tax liability exceeds ₹10,000.
                    </p>
                </div>

                <div class="result-breakdown">
                    <h3>Tax Payment Status</h3>
                    <div class="breakdown-item">
                        <span>Total Tax Liability:</span>
                        <span>₹${totalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>TDS Already Deducted:</span>
                        <span style="color: #10B981;">-₹${tdsDeducted.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ${remainingTax > 0 ? `
                    <div class="breakdown-item">
                        <span>Balance Tax Payable:</span>
                        <span style="font-weight: 600; color: #EF4444;">₹${remainingTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ${currentQuarter > 1 && interestPenalty > 0 ? `
                    <div class="breakdown-item">
                        <span>Interest Penalty (Section 234B/234C):</span>
                        <span style="color: #EF4444;">₹${interestPenalty.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Amount Payable (Tax + Interest):</span>
                        <span style="font-weight: 600; color: #EF4444;">₹${(remainingTax + interestPenalty).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: #EF4444; margin-top: 0.5rem;">
                        ⚠️ Interest @1% per month is charged for late payment or short payment of advance tax under sections 234B and 234C.
                    </p>
                    ` : ''}
                    ` : refundDue > 0 ? `
                    <div class="breakdown-item">
                        <span>Refund Due (claim via ITR):</span>
                        <span style="font-weight: 600; color: #10B981;">₹${refundDue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: #10B981; margin-top: 0.5rem;">
                        You have excess TDS. File your ITR to claim the refund.
                    </p>
                    ` : `
                    <div class="breakdown-item">
                        <span>Status:</span>
                        <span style="font-weight: 600; color: #10B981;">Fully Paid via TDS</span>
                    </div>
                    <p style="font-size: 0.85rem; color: #10B981; margin-top: 0.5rem;">
                        Your tax liability is fully covered by TDS. No advance tax payment required.
                    </p>
                    `}
                </div>

                <div class="result-breakdown">
                    <h3>Important Information</h3>
                    <ul style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                        <li>Advance tax is applicable if your total tax liability exceeds ₹10,000 per year</li>
                        <li>Salaried individuals with only salary income and adequate TDS may not need to pay advance tax</li>
                        <li>Interest under section 234B is charged @1% per month if less than 90% of tax is paid before March 31</li>
                        <li>Interest under section 234C is charged @1% per month for deferment of advance tax installments</li>
                        <li>Use Challan 280 (online at incometax.gov.in) to pay advance tax</li>
                        <li>Assessment Year for FY 2024-25 is AY 2025-26</li>
                    </ul>
                </div>

                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('advance-tax', {
                totalIncome,
                totalTax,
                tdsDeducted,
                remainingTax,
                regime
            }, {
                value: 'high-cpc',
                taxAmount: totalTax
            });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function calculateOldRegimeTax(income, deductions) {
        const taxableIncome = Math.max(income - deductions - 50000, 0); // Standard deduction ₹50,000
        let tax = 0;

        if (taxableIncome <= 250000) {
            tax = 0;
        } else if (taxableIncome <= 500000) {
            tax = (taxableIncome - 250000) * 0.05;
        } else if (taxableIncome <= 1000000) {
            tax = 12500 + (taxableIncome - 500000) * 0.20;
        } else {
            tax = 12500 + 100000 + (taxableIncome - 1000000) * 0.30;
        }

        // Add 4% cess
        tax = tax * 1.04;

        return tax;
    }

    function calculateNewRegimeTax(income) {
        const taxableIncome = Math.max(income - 50000, 0); // Standard deduction ₹50,000
        let tax = 0;

        if (taxableIncome <= 300000) {
            tax = 0;
        } else if (taxableIncome <= 600000) {
            tax = (taxableIncome - 300000) * 0.05;
        } else if (taxableIncome <= 900000) {
            tax = 15000 + (taxableIncome - 600000) * 0.10;
        } else if (taxableIncome <= 1200000) {
            tax = 15000 + 30000 + (taxableIncome - 900000) * 0.15;
        } else if (taxableIncome <= 1500000) {
            tax = 15000 + 30000 + 45000 + (taxableIncome - 1200000) * 0.20;
        } else {
            tax = 15000 + 30000 + 45000 + 60000 + (taxableIncome - 1500000) * 0.30;
        }

        // Add 4% cess
        tax = tax * 1.04;

        return tax;
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for advance-tax');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
