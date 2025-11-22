/**
 * Freelancer Income Calculator
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
                <label>Annual Gross Income (₹)</label>
                <input type="number" class="calc-input" id="grossIncome" placeholder="Enter gross income" value="1000000">
            </div>
            <div class="calc-input-group">
                <label>Business Expenses (₹)</label>
                <input type="number" class="calc-input" id="expenses" placeholder="Enter business expenses" value="200000">
            </div>
            <div class="calc-input-group">
                <label>GST Registration</label>
                <select class="calc-input" id="gstRegistered">
                    <option value="no">No (Turnover < ₹20L)</option>
                    <option value="yes">Yes (GST Registered)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Taxation Scheme</label>
                <select class="calc-input" id="taxScheme">
                    <option value="presumptive" selected>Presumptive (44ADA) - 50% deemed profit</option>
                    <option value="actual">Actual Income (Regular Books)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Professional Type</label>
                <select class="calc-input" id="professionalType">
                    <option value="professional" selected>Professional (Doctor, Lawyer, CA, etc.)</option>
                    <option value="freelancer">Freelancer (IT, Consulting, etc.)</option>
                    <option value="consultant">Business Consultant</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>State (for Professional Tax)</label>
                <select class="calc-input" id="state">
                    <option value="2500" selected>Karnataka (₹2,500)</option>
                    <option value="2400">Maharashtra (₹2,400)</option>
                    <option value="3000">Tamil Nadu (₹3,000)</option>
                    <option value="2000">West Bengal (₹2,000)</option>
                    <option value="0">No Professional Tax</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const grossIncome = parseFloat(document.getElementById('grossIncome').value) || 0;
        const expenses = parseFloat(document.getElementById('expenses').value) || 0;
        const gstRegistered = document.getElementById('gstRegistered').value;
        const taxScheme = document.getElementById('taxScheme').value;
        const professionalType = document.getElementById('professionalType').value;
        const professionalTax = parseFloat(document.getElementById('state').value) || 0;

        if (grossIncome <= 0) {
            alert('Please enter a valid gross income');
            return;
        }

        // Calculate taxable income based on scheme
        let taxableIncome = 0;
        let actualProfit = grossIncome - expenses;
        let profitPercent = 0;

        if (taxScheme === 'presumptive') {
            // Section 44ADA - 50% deemed profit for professionals
            taxableIncome = grossIncome * 0.50;
            profitPercent = 50;
        } else {
            // Actual income method
            taxableIncome = actualProfit;
            profitPercent = (actualProfit / grossIncome) * 100;
        }

        // Calculate GST liability (if registered)
        let gstLiability = 0;
        let gstRate = 0;
        if (gstRegistered === 'yes') {
            gstRate = 18; // Typical GST rate for professional services
            gstLiability = (grossIncome * gstRate) / (100 + gstRate); // Reverse calculation
        }

        // Calculate income tax
        const incomeTax = calculateIncomeTax(taxableIncome);

        // Total tax
        const totalTax = incomeTax + professionalTax;

        // Net income
        const netIncome = taxableIncome - totalTax;
        const monthlyNetIncome = netIncome / 12;

        // Effective tax rate
        const effectiveTaxRate = (totalTax / taxableIncome) * 100;

        // Benefits of 44ADA
        const auditRequired = taxScheme === 'presumptive' && grossIncome <= 5000000 ? 'No' : 'Yes';
        const booksRequired = taxScheme === 'presumptive' ? 'No (Simplified)' : 'Yes (Full Books)';

        // Take-home percentage
        const takeHomePercent = (netIncome / grossIncome) * 100;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Annual Net Income</span>
                    <span class="result-value">₹${netIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Monthly Net Income</span>
                    <span class="result-value">₹${monthlyNetIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Tax Payable</span>
                    <span class="result-value">₹${totalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Effective Tax Rate</span>
                    <span class="result-value">${effectiveTaxRate.toFixed(2)}%</span>
                </div>
                <div class="result-breakdown">
                    <h3>Income Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Gross Annual Income:</span>
                        <span>₹${grossIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ${taxScheme === 'actual' ? `
                    <div class="breakdown-item">
                        <span>Business Expenses:</span>
                        <span>₹${expenses.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Actual Profit:</span>
                        <span>₹${actualProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ` : ''}
                    <div class="breakdown-item">
                        <span>Taxable Income (${taxScheme === 'presumptive' ? '50% deemed' : 'actual'}):</span>
                        <span>₹${taxableIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Profit Margin:</span>
                        <span>${profitPercent.toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Components</h3>
                    <div class="breakdown-item">
                        <span>Income Tax:</span>
                        <span>₹${incomeTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Professional Tax:</span>
                        <span>₹${professionalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ${gstRegistered === 'yes' ? `
                    <div class="breakdown-item">
                        <span>GST Liability (${gstRate}%):</span>
                        <span>₹${gstLiability.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ` : ''}
                    <div class="breakdown-item">
                        <span><strong>Total Tax:</strong></span>
                        <span><strong>₹${totalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong></span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Monthly Projections</h3>
                    <div class="breakdown-item">
                        <span>Monthly Gross Income:</span>
                        <span>₹${(grossIncome/12).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Tax Burden:</span>
                        <span>₹${(totalTax/12).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Monthly Net Income:</strong></span>
                        <span><strong>₹${monthlyNetIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong></span>
                    </div>
                    <div class="breakdown-item">
                        <span>Take-Home %:</span>
                        <span>${takeHomePercent.toFixed(1)}%</span>
                    </div>
                </div>
                ${taxScheme === 'presumptive' ? `
                <div class="result-breakdown">
                    <h3>Section 44ADA Benefits</h3>
                    <div class="breakdown-item">
                        <span>Deemed Profit:</span>
                        <span>50% of gross receipts</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Audit Requirement:</span>
                        <span>${auditRequired} ${grossIncome <= 5000000 ? '(Turnover ≤ ₹50L)' : ''}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Books of Accounts:</span>
                        <span>${booksRequired}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Eligibility:</span>
                        <span>${grossIncome <= 5000000 ? 'Eligible ✓' : 'Not Eligible (> ₹50L)'}</span>
                    </div>
                    <div class="breakdown-item" style="display: block; padding: 10px; background: #f3f4f6; border-radius: 4px; margin-top: 10px;">
                        <p style="margin: 0; font-size: 14px;">
                            <strong>Note:</strong> Under Section 44ADA, 50% of gross receipts is deemed as profit.
                            This scheme is available for specified professionals with turnover up to ₹50 lakhs.
                            No need to maintain detailed books of accounts or get audit done.
                        </p>
                    </div>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>Compliance Summary</h3>
                    <div class="breakdown-item">
                        <span>GST Registration:</span>
                        <span>${gstRegistered === 'yes' ? 'Yes - GST Returns Required' : 'No - Below Threshold'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Taxation Scheme:</span>
                        <span>${taxScheme === 'presumptive' ? 'Presumptive (44ADA)' : 'Actual Income'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Professional Type:</span>
                        <span>${professionalType.charAt(0).toUpperCase() + professionalType.slice(1)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>ITR Form:</span>
                        <span>${taxScheme === 'presumptive' ? 'ITR-4 (Sugam)' : 'ITR-3'}</span>
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
            trackCalculation('freelancer-income-calculator', {
                grossIncome,
                taxableIncome,
                netIncome,
                taxScheme
            }, {
                value: 'high-cpc',
                incomeInLakhs: grossIncome/100000
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
        console.log('Loading affiliate offers for freelancer-income-calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
