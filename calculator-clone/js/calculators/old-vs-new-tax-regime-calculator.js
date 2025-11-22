/**
 * Old vs New Tax Regime Calculator
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
                <input type="number" class="calc-input" id="grossIncome" placeholder="Enter gross annual income" value="1200000">
            </div>
            <div class="calc-input-group">
                <label>Section 80C Deductions (₹)</label>
                <input type="number" class="calc-input" id="deduction80C" placeholder="EPF, PPF, ELSS, Insurance (Max: ₹1.5L)" value="150000">
                <small>Provident Fund, Life Insurance, ELSS, NSC, etc. (Max: ₹1,50,000)</small>
            </div>
            <div class="calc-input-group">
                <label>Section 80D Health Insurance (₹)</label>
                <input type="number" class="calc-input" id="deduction80D" placeholder="Health insurance premium" value="25000">
                <small>Self + Family: ₹25,000 | Senior Citizens: ₹50,000</small>
            </div>
            <div class="calc-input-group">
                <label>HRA Received (₹)</label>
                <input type="number" class="calc-input" id="hraReceived" placeholder="House Rent Allowance received" value="0">
            </div>
            <div class="calc-input-group">
                <label>Rent Paid (₹)</label>
                <input type="number" class="calc-input" id="rentPaid" placeholder="Annual rent paid" value="0">
            </div>
            <div class="calc-input-group">
                <label>LTA (Leave Travel Allowance) (₹)</label>
                <input type="number" class="calc-input" id="lta" placeholder="LTA claimed" value="0">
                <small>Only in Old Regime (subject to actual travel bills)</small>
            </div>
            <div class="calc-input-group">
                <label>Home Loan Interest (₹)</label>
                <input type="number" class="calc-input" id="homeLoanInterest" placeholder="Interest on home loan" value="0">
                <small>Section 24: Max ₹2,00,000 (only in Old Regime for self-occupied)</small>
            </div>
            <div class="calc-input-group">
                <label>Section 80CCD(1B) NPS (₹)</label>
                <input type="number" class="calc-input" id="nps" placeholder="NPS contribution" value="50000">
                <small>Additional ₹50,000 deduction (only in Old Regime)</small>
            </div>
            <div class="calc-input-group">
                <label>Other Deductions (₹)</label>
                <input type="number" class="calc-input" id="otherDeductions" placeholder="80E, 80G, etc." value="0">
                <small>Education Loan Interest, Donations, etc. (only in Old Regime)</small>
            </div>
            <div class="calc-input-group">
                <label>Age Group</label>
                <select class="calc-input" id="ageGroup">
                    <option value="below60">Below 60 years</option>
                    <option value="60to80">60-80 years (Senior Citizen)</option>
                    <option value="above80">Above 80 years (Super Senior Citizen)</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const grossIncome = parseFloat(document.getElementById('grossIncome').value) || 0;
        const deduction80C = Math.min(parseFloat(document.getElementById('deduction80C').value) || 0, 150000);
        const deduction80D = parseFloat(document.getElementById('deduction80D').value) || 0;
        const hraReceived = parseFloat(document.getElementById('hraReceived').value) || 0;
        const rentPaid = parseFloat(document.getElementById('rentPaid').value) || 0;
        const lta = parseFloat(document.getElementById('lta').value) || 0;
        const homeLoanInterest = Math.min(parseFloat(document.getElementById('homeLoanInterest').value) || 0, 200000);
        const nps = Math.min(parseFloat(document.getElementById('nps').value) || 0, 50000);
        const otherDeductions = parseFloat(document.getElementById('otherDeductions').value) || 0;
        const ageGroup = document.getElementById('ageGroup').value;

        // Calculate HRA exemption (only for old regime)
        const hraExemption = calculateHRAExemption(grossIncome, hraReceived, rentPaid);

        // OLD REGIME CALCULATION
        const standardDeductionOld = 50000;
        let totalDeductionsOld = deduction80C + deduction80D + hraExemption + lta + homeLoanInterest + nps + otherDeductions;
        const taxableIncomeOld = Math.max(grossIncome - standardDeductionOld - totalDeductionsOld, 0);
        const taxOld = calculateOldRegimeTax(taxableIncomeOld, ageGroup);

        // NEW REGIME CALCULATION
        const standardDeductionNew = 50000;
        const taxableIncomeNew = Math.max(grossIncome - standardDeductionNew, 0);
        const taxNew = calculateNewRegimeTax(taxableIncomeNew);

        // Determine which is better
        const savingsOld = taxNew - taxOld;
        const savingsNew = taxOld - taxNew;
        const betterRegime = taxOld < taxNew ? 'old' : 'new';
        const savingsAmount = Math.abs(taxOld - taxNew);
        const savingsPercentage = ((savingsAmount / Math.max(taxOld, taxNew)) * 100).toFixed(1);

        // Calculate effective tax rate
        const effectiveTaxRateOld = ((taxOld / grossIncome) * 100).toFixed(2);
        const effectiveTaxRateNew = ((taxNew / grossIncome) * 100).toFixed(2);

        // Calculate take-home salary
        const takeHomeOld = grossIncome - taxOld;
        const takeHomeNew = grossIncome - taxNew;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Recommended Tax Regime</span>
                    <span class="result-value">${betterRegime === 'old' ? 'Old Regime' : 'New Regime'}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Tax Savings</span>
                    <span class="result-value" style="color: #10B981;">₹${savingsAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})} (${savingsPercentage}% less)</span>
                </div>

                <div class="result-breakdown">
                    <h3>Side-by-Side Comparison</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                        <thead>
                            <tr style="background: var(--card-bg); border-bottom: 2px solid var(--border-color);">
                                <th style="text-align: left; padding: 0.75rem; font-weight: 600;">Particulars</th>
                                <th style="text-align: right; padding: 0.75rem; font-weight: 600; color: #3B82F6;">Old Regime</th>
                                <th style="text-align: right; padding: 0.75rem; font-weight: 600; color: #10B981;">New Regime</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 0.75rem;">Gross Income</td>
                                <td style="text-align: right; padding: 0.75rem;">₹${grossIncome.toLocaleString('en-IN')}</td>
                                <td style="text-align: right; padding: 0.75rem;">₹${grossIncome.toLocaleString('en-IN')}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 0.75rem;">Standard Deduction</td>
                                <td style="text-align: right; padding: 0.75rem; color: #10B981;">-₹${standardDeductionOld.toLocaleString('en-IN')}</td>
                                <td style="text-align: right; padding: 0.75rem; color: #10B981;">-₹${standardDeductionNew.toLocaleString('en-IN')}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 0.75rem;">Total Deductions</td>
                                <td style="text-align: right; padding: 0.75rem; color: #10B981;">-₹${totalDeductionsOld.toLocaleString('en-IN')}</td>
                                <td style="text-align: right; padding: 0.75rem; color: #EF4444;">₹0</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border-color); font-weight: 600; background: #F9FAFB;">
                                <td style="padding: 0.75rem;">Taxable Income</td>
                                <td style="text-align: right; padding: 0.75rem;">₹${taxableIncomeOld.toLocaleString('en-IN')}</td>
                                <td style="text-align: right; padding: 0.75rem;">₹${taxableIncomeNew.toLocaleString('en-IN')}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border-color); font-weight: 600; font-size: 1.05rem;">
                                <td style="padding: 0.75rem;">Tax Payable (incl. cess)</td>
                                <td style="text-align: right; padding: 0.75rem; color: ${taxOld < taxNew ? '#10B981' : '#EF4444'};">₹${taxOld.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                                <td style="text-align: right; padding: 0.75rem; color: ${taxNew < taxOld ? '#10B981' : '#EF4444'};">₹${taxNew.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 0.75rem;">Effective Tax Rate</td>
                                <td style="text-align: right; padding: 0.75rem;">${effectiveTaxRateOld}%</td>
                                <td style="text-align: right; padding: 0.75rem;">${effectiveTaxRateNew}%</td>
                            </tr>
                            <tr style="font-weight: 600; background: #F0F9FF;">
                                <td style="padding: 0.75rem;">Take-Home Salary</td>
                                <td style="text-align: right; padding: 0.75rem; color: ${takeHomeOld > takeHomeNew ? '#10B981' : '#666'};">₹${takeHomeOld.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                                <td style="text-align: right; padding: 0.75rem; color: ${takeHomeNew > takeHomeOld ? '#10B981' : '#666'};">₹${takeHomeNew.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="result-breakdown">
                    <h3>Old Tax Regime Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Gross Income:</span>
                        <span>₹${grossIncome.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Standard Deduction:</span>
                        <span style="color: #10B981;">-₹${standardDeductionOld.toLocaleString('en-IN')}</span>
                    </div>
                    ${deduction80C > 0 ? `
                    <div class="breakdown-item">
                        <span>Section 80C (EPF, PPF, ELSS, etc.):</span>
                        <span style="color: #10B981;">-₹${deduction80C.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${deduction80D > 0 ? `
                    <div class="breakdown-item">
                        <span>Section 80D (Health Insurance):</span>
                        <span style="color: #10B981;">-₹${deduction80D.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${hraExemption > 0 ? `
                    <div class="breakdown-item">
                        <span>HRA Exemption:</span>
                        <span style="color: #10B981;">-₹${hraExemption.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${lta > 0 ? `
                    <div class="breakdown-item">
                        <span>LTA (Leave Travel Allowance):</span>
                        <span style="color: #10B981;">-₹${lta.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${homeLoanInterest > 0 ? `
                    <div class="breakdown-item">
                        <span>Home Loan Interest (Section 24):</span>
                        <span style="color: #10B981;">-₹${homeLoanInterest.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${nps > 0 ? `
                    <div class="breakdown-item">
                        <span>NPS (Section 80CCD 1B):</span>
                        <span style="color: #10B981;">-₹${nps.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${otherDeductions > 0 ? `
                    <div class="breakdown-item">
                        <span>Other Deductions (80E, 80G, etc.):</span>
                        <span style="color: #10B981;">-₹${otherDeductions.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    <div class="breakdown-item">
                        <span>Total Deductions:</span>
                        <span style="color: #10B981; font-weight: 600;">-₹${totalDeductionsOld.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Taxable Income:</span>
                        <span style="font-weight: 600;">₹${taxableIncomeOld.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax (before cess):</span>
                        <span>₹${(taxOld / 1.04).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Health & Education Cess (4%):</span>
                        <span>₹${(taxOld - taxOld / 1.04).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Tax Payable:</span>
                        <span style="font-weight: 600; font-size: 1.1rem; color: #3B82F6;">₹${taxOld.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>

                <div class="result-breakdown">
                    <h3>New Tax Regime Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Gross Income:</span>
                        <span>₹${grossIncome.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Standard Deduction:</span>
                        <span style="color: #10B981;">-₹${standardDeductionNew.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Other Deductions:</span>
                        <span style="color: #EF4444;">₹0 (not allowed)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Taxable Income:</span>
                        <span style="font-weight: 600;">₹${taxableIncomeNew.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax (before cess):</span>
                        <span>₹${(taxNew / 1.04).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Health & Education Cess (4%):</span>
                        <span>₹${(taxNew - taxNew / 1.04).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Tax Payable:</span>
                        <span style="font-weight: 600; font-size: 1.1rem; color: #10B981;">₹${taxNew.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>

                <div class="result-breakdown">
                    <h3>Tax Slab Rates - Old Regime</h3>
                    <table style="width: 100%; font-size: 0.85rem;">
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 0.5rem;">₹0 - ₹2,50,000</td>
                            <td style="text-align: right; padding: 0.5rem;">Nil</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 0.5rem;">₹2,50,001 - ₹5,00,000</td>
                            <td style="text-align: right; padding: 0.5rem;">5%</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 0.5rem;">₹5,00,001 - ₹10,00,000</td>
                            <td style="text-align: right; padding: 0.5rem;">20%</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5rem;">Above ₹10,00,000</td>
                            <td style="text-align: right; padding: 0.5rem;">30%</td>
                        </tr>
                    </table>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        + 4% Health & Education Cess on total tax
                    </p>
                </div>

                <div class="result-breakdown">
                    <h3>Tax Slab Rates - New Regime</h3>
                    <table style="width: 100%; font-size: 0.85rem;">
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 0.5rem;">₹0 - ₹3,00,000</td>
                            <td style="text-align: right; padding: 0.5rem;">Nil</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 0.5rem;">₹3,00,001 - ₹6,00,000</td>
                            <td style="text-align: right; padding: 0.5rem;">5%</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 0.5rem;">₹6,00,001 - ₹9,00,000</td>
                            <td style="text-align: right; padding: 0.5rem;">10%</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 0.5rem;">₹9,00,001 - ₹12,00,000</td>
                            <td style="text-align: right; padding: 0.5rem;">15%</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 0.5rem;">₹12,00,001 - ₹15,00,000</td>
                            <td style="text-align: right; padding: 0.5rem;">20%</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5rem;">Above ₹15,00,000</td>
                            <td style="text-align: right; padding: 0.5rem;">30%</td>
                        </tr>
                    </table>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        + 4% Health & Education Cess on total tax
                    </p>
                </div>

                <div class="result-breakdown">
                    <h3>Recommendation & Analysis</h3>
                    ${betterRegime === 'old' ? `
                    <div style="background: #EFF6FF; padding: 1rem; border-radius: 8px; border-left: 4px solid #3B82F6;">
                        <p style="font-weight: 600; color: #1E40AF; margin-bottom: 0.5rem;">Choose Old Tax Regime</p>
                        <p style="font-size: 0.9rem; color: #1E3A8A; line-height: 1.6;">
                            You will save ₹${savingsAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})} by choosing the Old Tax Regime.
                            Your deductions of ₹${totalDeductionsOld.toLocaleString('en-IN')} significantly reduce your taxable income,
                            making the old regime more beneficial despite its higher tax slabs.
                        </p>
                        <p style="font-size: 0.9rem; color: #1E3A8A; margin-top: 0.5rem;">
                            <strong>Key Benefits:</strong> You can claim deductions under Section 80C, 80D, HRA, home loan interest, and other exemptions.
                        </p>
                    </div>
                    ` : `
                    <div style="background: #F0FDF4; padding: 1rem; border-radius: 8px; border-left: 4px solid #10B981;">
                        <p style="font-weight: 600; color: #065F46; margin-bottom: 0.5rem;">Choose New Tax Regime</p>
                        <p style="font-size: 0.9rem; color: #064E3B; line-height: 1.6;">
                            You will save ₹${savingsAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})} by choosing the New Tax Regime.
                            Even without claiming deductions, the lower tax rates make the new regime more beneficial for your income level.
                        </p>
                        <p style="font-size: 0.9rem; color: #064E3B; margin-top: 0.5rem;">
                            <strong>Key Benefits:</strong> Simpler tax filing with lower rates, no need to maintain investment proofs, higher basic exemption limit.
                        </p>
                    </div>
                    `}

                    <h4 style="margin-top: 1.5rem; margin-bottom: 0.5rem;">When to Choose Old Regime:</h4>
                    <ul style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.8;">
                        <li>High deductions (80C, 80D, HRA, home loan interest exceeding ₹2.5 lakhs)</li>
                        <li>Existing investments in tax-saving instruments</li>
                        <li>Paying high rent and claiming HRA exemption</li>
                        <li>Home loan with significant interest component</li>
                    </ul>

                    <h4 style="margin-top: 1rem; margin-bottom: 0.5rem;">When to Choose New Regime:</h4>
                    <ul style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.8;">
                        <li>Low or no deductions available</li>
                        <li>Income below ₹7.5 lakhs (significant tax savings)</li>
                        <li>Prefer simpler tax filing without maintaining investment proofs</li>
                        <li>No home loan or HRA component</li>
                    </ul>
                </div>

                <div class="result-breakdown">
                    <h3>Important Notes</h3>
                    <ul style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                        <li>You can switch between regimes every year (except business income holders who must continue for 1-2 years)</li>
                        <li>The new regime is the default from FY 2023-24, but you can opt for old regime while filing ITR</li>
                        <li>Consider future investments and financial goals before choosing</li>
                        <li>Section 87A rebate: If total income is up to ₹7 lakhs (new regime) or ₹5 lakhs (old regime), no tax payable</li>
                        <li>This calculator provides estimates. Consult a tax professional for personalized advice</li>
                        <li>Surcharge applicable on income above ₹50 lakhs (not included in this calculator)</li>
                    </ul>
                </div>

                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('old-vs-new-tax-regime', {
                grossIncome,
                taxOld,
                taxNew,
                betterRegime,
                savingsAmount
            }, {
                value: 'high-cpc',
                savingsAmount
            });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function calculateHRAExemption(grossIncome, hraReceived, rentPaid) {
        if (hraReceived === 0 || rentPaid === 0) return 0;

        const salary = grossIncome - hraReceived; // Basic salary approximation
        const tenPercentSalary = salary * 0.10;
        const rentExcess = rentPaid - tenPercentSalary;
        const fiftyPercentSalary = salary * 0.50; // Assuming metro city

        // HRA exemption is minimum of: actual HRA, rent minus 10% salary, or 50% salary
        const hraExemption = Math.min(hraReceived, rentExcess, fiftyPercentSalary);
        return Math.max(hraExemption, 0);
    }

    function calculateOldRegimeTax(taxableIncome, ageGroup) {
        let tax = 0;
        let exemptionLimit = 250000;

        // Adjust exemption limit based on age
        if (ageGroup === '60to80') {
            exemptionLimit = 300000;
        } else if (ageGroup === 'above80') {
            exemptionLimit = 500000;
        }

        if (taxableIncome <= exemptionLimit) {
            tax = 0;
        } else if (taxableIncome <= 500000) {
            tax = (taxableIncome - exemptionLimit) * 0.05;
        } else if (taxableIncome <= 1000000) {
            tax = (500000 - exemptionLimit) * 0.05 + (taxableIncome - 500000) * 0.20;
        } else {
            tax = (500000 - exemptionLimit) * 0.05 + 500000 * 0.20 + (taxableIncome - 1000000) * 0.30;
        }

        // Add 4% cess
        tax = tax * 1.04;

        // Section 87A rebate for income up to 5 lakhs
        if (taxableIncome <= 500000) {
            tax = Math.max(0, tax - 12500);
        }

        return tax;
    }

    function calculateNewRegimeTax(taxableIncome) {
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

        // Section 87A rebate for income up to 7 lakhs
        if (taxableIncome <= 700000) {
            tax = Math.max(0, tax - 25000);
        }

        return tax;
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for old-vs-new-tax-regime');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
