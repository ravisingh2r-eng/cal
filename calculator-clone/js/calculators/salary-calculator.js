/**
 * Salary Calculator
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
                <label>Annual CTC (₹)</label>
                <input type="number" class="calc-input" id="ctc" placeholder="Enter annual CTC" value="1200000">
            </div>
            <div class="calc-input-group">
                <label>Basic Salary (% of CTC)</label>
                <input type="number" class="calc-input" id="basicPercent" placeholder="Typically 40-50%" value="40" min="30" max="60" step="1">
            </div>
            <div class="calc-input-group">
                <label>HRA (% of Basic)</label>
                <input type="number" class="calc-input" id="hraPercent" placeholder="Typically 40-50%" value="50" min="0" max="100" step="1">
            </div>
            <div class="calc-input-group">
                <label>Special Allowance (% of CTC)</label>
                <input type="number" class="calc-input" id="specialAllowance" placeholder="Remaining after basic and HRA" value="20" min="0" max="50" step="1">
            </div>
            <div class="calc-input-group">
                <label>PF Contribution (%)</label>
                <select class="calc-input" id="pfContribution">
                    <option value="12" selected>12% (Standard)</option>
                    <option value="0">0% (No PF)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Professional Tax (Annual)</label>
                <select class="calc-input" id="professionalTax">
                    <option value="2400">₹2,400 (Maharashtra)</option>
                    <option value="2500" selected>₹2,500 (Karnataka)</option>
                    <option value="3000">₹3,000 (Tamil Nadu)</option>
                    <option value="2000">₹2,000 (West Bengal)</option>
                    <option value="0">₹0 (No PT)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Other Deductions (Annual)</label>
                <input type="number" class="calc-input" id="otherDeductions" placeholder="Enter other deductions" value="0">
            </div>
        `;
    }

    function calculate() {
        const ctc = parseFloat(document.getElementById('ctc').value) || 0;
        const basicPercent = parseFloat(document.getElementById('basicPercent').value) || 40;
        const hraPercent = parseFloat(document.getElementById('hraPercent').value) || 50;
        const specialAllowancePercent = parseFloat(document.getElementById('specialAllowance').value) || 20;
        const pfPercent = parseFloat(document.getElementById('pfContribution').value) || 12;
        const professionalTax = parseFloat(document.getElementById('professionalTax').value) || 2500;
        const otherDeductions = parseFloat(document.getElementById('otherDeductions').value) || 0;

        if (ctc <= 0) {
            alert('Please enter a valid CTC amount');
            return;
        }

        // Calculate components
        const basic = (ctc * basicPercent) / 100;
        const hra = (basic * hraPercent) / 100;
        const specialAllowance = (ctc * specialAllowancePercent) / 100;

        // Calculate gross salary
        const grossSalary = basic + hra + specialAllowance;

        // Calculate employer PF (12% of basic)
        const employerPF = (basic * pfPercent) / 100;

        // Calculate employee PF (12% of basic)
        const employeePF = (basic * pfPercent) / 100;

        // Calculate taxable income (gross - standard deduction)
        const standardDeduction = 50000; // Standard deduction for FY 2024-25
        const taxableIncome = Math.max(0, grossSalary - standardDeduction - employeePF);

        // Calculate income tax (new tax regime)
        const incomeTax = calculateIncomeTax(taxableIncome);

        // Total deductions
        const totalDeductions = employeePF + professionalTax + incomeTax + otherDeductions;

        // Net salary (in-hand)
        const netSalary = grossSalary - totalDeductions;

        // Monthly breakdown
        const monthlyGross = grossSalary / 12;
        const monthlyNet = netSalary / 12;
        const monthlyPF = employeePF / 12;
        const monthlyPT = professionalTax / 12;
        const monthlyTax = incomeTax / 12;

        // CTC vs in-hand difference
        const ctcVsInHand = ctc - netSalary;
        const takeHomePercent = (netSalary / ctc) * 100;

        // Employer contributions
        const totalEmployerContribution = employerPF;
        const totalCostToCompany = ctc + totalEmployerContribution;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Monthly In-Hand Salary</span>
                    <span class="result-value">₹${monthlyNet.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Annual Net Salary</span>
                    <span class="result-value">₹${netSalary.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Take Home %</span>
                    <span class="result-value">${takeHomePercent.toFixed(1)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Deductions</span>
                    <span class="result-value">₹${totalDeductions.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Salary Components (Annual)</h3>
                    <div class="breakdown-item">
                        <span>Basic Salary (${basicPercent}%):</span>
                        <span>₹${basic.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>HRA (${hraPercent}% of Basic):</span>
                        <span>₹${hra.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Special Allowance:</span>
                        <span>₹${specialAllowance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Gross Salary:</strong></span>
                        <span><strong>₹${grossSalary.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong></span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Monthly Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Monthly Gross:</span>
                        <span>₹${monthlyGross.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Employee PF:</span>
                        <span>₹${monthlyPF.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Professional Tax:</span>
                        <span>₹${monthlyPT.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Income Tax (TDS):</span>
                        <span>₹${monthlyTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Monthly In-Hand:</strong></span>
                        <span><strong>₹${monthlyNet.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong></span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Annual Deductions</h3>
                    <div class="breakdown-item">
                        <span>Employee PF (${pfPercent}%):</span>
                        <span>₹${employeePF.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Professional Tax:</span>
                        <span>₹${professionalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Income Tax:</span>
                        <span>₹${incomeTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ${otherDeductions > 0 ? `
                    <div class="breakdown-item">
                        <span>Other Deductions:</span>
                        <span>₹${otherDeductions.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ` : ''}
                    <div class="breakdown-item">
                        <span><strong>Total Deductions:</strong></span>
                        <span><strong>₹${totalDeductions.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong></span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>CTC vs In-Hand Comparison</h3>
                    <div class="breakdown-item">
                        <span>Annual CTC:</span>
                        <span>₹${ctc.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Gross Salary:</span>
                        <span>₹${grossSalary.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Deductions:</span>
                        <span>₹${totalDeductions.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Net In-Hand Salary:</strong></span>
                        <span><strong>₹${netSalary.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong></span>
                    </div>
                    <div class="breakdown-item">
                        <span>CTC vs In-Hand Gap:</span>
                        <span>₹${ctcVsInHand.toLocaleString('en-IN', {maximumFractionDigits: 0})} (${(100-takeHomePercent).toFixed(1)}%)</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Employer Contributions</h3>
                    <div class="breakdown-item">
                        <span>Employer PF (${pfPercent}%):</span>
                        <span>₹${employerPF.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Cost to Company:</span>
                        <span>₹${totalCostToCompany.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item" style="display: block; padding: 10px; background: #f3f4f6; border-radius: 4px; margin-top: 10px;">
                        <p style="margin: 0; font-size: 14px;">
                            <strong>Note:</strong> Your PF account receives both employee (${pfPercent}%) and employer (${pfPercent}%) contributions,
                            totaling ₹${(employeePF + employerPF).toLocaleString('en-IN', {maximumFractionDigits: 0})} annually.
                        </p>
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
            trackCalculation('salary-calculator', {
                ctc,
                grossSalary,
                netSalary,
                monthlyNet
            }, {
                value: 'high-cpc',
                ctcInLakhs: ctc/100000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function calculateIncomeTax(taxableIncome) {
        // New tax regime FY 2024-25
        let tax = 0;

        if (taxableIncome <= 300000) {
            tax = 0;
        } else if (taxableIncome <= 600000) {
            tax = (taxableIncome - 300000) * 0.05;
        } else if (taxableIncome <= 900000) {
            tax = 15000 + (taxableIncome - 600000) * 0.10;
        } else if (taxableIncome <= 1200000) {
            tax = 45000 + (taxableIncome - 900000) * 0.15;
        } else if (taxableIncome <= 1500000) {
            tax = 90000 + (taxableIncome - 1200000) * 0.20;
        } else {
            tax = 150000 + (taxableIncome - 1500000) * 0.30;
        }

        // Add 4% Health and Education Cess
        tax = tax * 1.04;

        return tax;
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for salary-calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
