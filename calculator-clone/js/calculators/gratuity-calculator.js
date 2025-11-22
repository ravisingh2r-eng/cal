/**
 * Gratuity Calculator
 * Production-ready calculator with validation
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
                <label>Last Drawn Salary (₹/month)</label>
                <input type="number" class="calc-input" id="salary" placeholder="Enter monthly salary" value="50000">
            </div>
            <div class="calc-input-group">
                <label>Years of Service</label>
                <input type="number" class="calc-input" id="yearsOfService" placeholder="Enter years of service" value="10" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Dearness Allowance (DA) - Optional</label>
                <input type="number" class="calc-input" id="da" placeholder="Enter DA amount" value="0">
            </div>
            <div class="calc-input-group">
                <label>Employment Type</label>
                <select class="calc-input" id="employmentType">
                    <option value="covered" selected>Covered under Gratuity Act</option>
                    <option value="notCovered">Not covered under Gratuity Act</option>
                    <option value="government">Government Employee</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const salary = parseFloat(document.getElementById('salary').value) || 0;
        const yearsOfService = parseFloat(document.getElementById('yearsOfService').value) || 0;
        const da = parseFloat(document.getElementById('da').value) || 0;
        const employmentType = document.getElementById('employmentType').value;

        // Calculate gratuity based on Indian rules
        // Formula: (Last Salary × Years of Service × 15) / 26
        // For government employees: (Last Salary × Years of Service) / 4

        const lastDrawnSalary = salary + da;
        let gratuityAmount = 0;
        let formula = '';
        const maxGratuity = 2000000; // ₹20 lakhs max for covered employees

        if (employmentType === 'government') {
            // Government employees: (Last Salary × Years of Service) / 4
            gratuityAmount = (lastDrawnSalary * yearsOfService) / 4;
            formula = '(Last Salary × Years of Service) / 4';
        } else if (employmentType === 'covered') {
            // Covered under Gratuity Act: (Last Salary × Years of Service × 15) / 26
            gratuityAmount = (lastDrawnSalary * yearsOfService * 15) / 26;
            formula = '(Last Salary × Years of Service × 15) / 26';

            // Cap at ₹20 lakhs for covered employees
            if (gratuityAmount > maxGratuity) {
                gratuityAmount = maxGratuity;
            }
        } else {
            // Not covered: Usually same formula but no cap
            gratuityAmount = (lastDrawnSalary * yearsOfService * 15) / 26;
            formula = '(Last Salary × Years of Service × 15) / 26';
        }

        // Round years to completed years + months
        const completedYears = Math.floor(yearsOfService);
        const months = Math.round((yearsOfService - completedYears) * 12);
        const roundedYears = months >= 6 ? completedYears + 1 : completedYears;

        // Recalculate with rounded years
        let finalGratuity = 0;
        if (employmentType === 'government') {
            finalGratuity = (lastDrawnSalary * roundedYears) / 4;
        } else {
            finalGratuity = (lastDrawnSalary * roundedYears * 15) / 26;
            if (employmentType === 'covered' && finalGratuity > maxGratuity) {
                finalGratuity = maxGratuity;
            }
        }

        // Calculate tax (gratuity up to ₹20L is tax-free for covered employees)
        let taxableAmount = 0;
        let tax = 0;
        const taxFreeLimit = 2000000;

        if (employmentType === 'covered') {
            if (finalGratuity > taxFreeLimit) {
                taxableAmount = finalGratuity - taxFreeLimit;
                tax = taxableAmount * 0.30; // Assuming 30% tax bracket
            }
        } else if (employmentType === 'government') {
            // Government gratuity is fully tax-free up to ₹20L
            if (finalGratuity > taxFreeLimit) {
                taxableAmount = finalGratuity - taxFreeLimit;
                tax = taxableAmount * 0.30;
            }
        } else {
            // For non-covered employees, minimum exemption applies
            const exemptionLimit = Math.min(
                finalGratuity,
                taxFreeLimit,
                (lastDrawnSalary * roundedYears * 15) / 26
            );
            taxableAmount = Math.max(0, finalGratuity - exemptionLimit);
            tax = taxableAmount * 0.30;
        }

        const netGratuity = finalGratuity - tax;

        // Calculate per year average
        const perYearGratuity = finalGratuity / roundedYears;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Gratuity Amount</span>
                    <span class="result-value">₹${finalGratuity.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Net Gratuity (After Tax)</span>
                    <span class="result-value" style="color: #10B981;">₹${netGratuity.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                ${tax > 0 ? `
                <div class="result-item">
                    <span class="result-label">Tax Deducted</span>
                    <span class="result-value" style="color: #EF4444;">₹${tax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>` : ''}
                <div class="result-breakdown">
                    <h3>Employee Details</h3>
                    <div class="breakdown-item">
                        <span>Last Drawn Salary:</span>
                        <span>₹${salary.toLocaleString('en-IN')}/month</span>
                    </div>
                    ${da > 0 ? `
                    <div class="breakdown-item">
                        <span>Dearness Allowance (DA):</span>
                        <span>₹${da.toLocaleString('en-IN')}/month</span>
                    </div>` : ''}
                    <div class="breakdown-item">
                        <span>Last Salary (incl. DA):</span>
                        <span style="font-weight: 600;">₹${lastDrawnSalary.toLocaleString('en-IN')}/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Years of Service:</span>
                        <span>${yearsOfService} years (${completedYears} years ${months} months)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Eligible Years (rounded):</span>
                        <span style="font-weight: 600;">${roundedYears} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Employment Type:</span>
                        <span>${employmentType === 'covered' ? 'Covered under Gratuity Act' : employmentType === 'government' ? 'Government Employee' : 'Not Covered'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Gratuity Calculation</h3>
                    <div class="breakdown-item">
                        <span>Formula:</span>
                        <span style="font-family: monospace; font-size: 0.85rem;">${formula}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Last Salary:</span>
                        <span>₹${lastDrawnSalary.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Eligible Years:</span>
                        <span>${roundedYears} years</span>
                    </div>
                    ${employmentType !== 'government' ? `
                    <div class="breakdown-item">
                        <span>Calculation:</span>
                        <span>(₹${lastDrawnSalary.toLocaleString('en-IN')} × ${roundedYears} × 15) / 26</span>
                    </div>` : `
                    <div class="breakdown-item">
                        <span>Calculation:</span>
                        <span>(₹${lastDrawnSalary.toLocaleString('en-IN')} × ${roundedYears}) / 4</span>
                    </div>`}
                    <div class="breakdown-item">
                        <span>Calculated Amount:</span>
                        <span>₹${(employmentType === 'government' ? (lastDrawnSalary * roundedYears) / 4 : (lastDrawnSalary * roundedYears * 15) / 26).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ${employmentType === 'covered' && finalGratuity === maxGratuity ? `
                    <div class="breakdown-item">
                        <span>Maximum Limit Applied:</span>
                        <span style="color: #F59E0B;">₹${maxGratuity.toLocaleString('en-IN')} (₹20 Lakhs cap)</span>
                    </div>` : ''}
                    <div class="breakdown-item">
                        <span>Final Gratuity:</span>
                        <span style="font-weight: 600;">₹${finalGratuity.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Calculation</h3>
                    <div class="breakdown-item">
                        <span>Gratuity Amount:</span>
                        <span>₹${finalGratuity.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax-Free Limit:</span>
                        <span style="color: #10B981;">₹${taxFreeLimit.toLocaleString('en-IN')} (₹20 Lakhs)</span>
                    </div>
                    ${taxableAmount > 0 ? `
                    <div class="breakdown-item">
                        <span>Taxable Amount:</span>
                        <span>₹${taxableAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax @ 30%:</span>
                        <span style="color: #EF4444;">₹${tax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>` : `
                    <div class="breakdown-item">
                        <span>Taxable Amount:</span>
                        <span style="color: #10B981;">₹0 (Fully tax-free)</span>
                    </div>`}
                    <div class="breakdown-item">
                        <span>Net Gratuity (After Tax):</span>
                        <span style="font-weight: 600; color: #10B981;">₹${netGratuity.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Gratuity Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Per Year of Service:</span>
                        <span>₹${perYearGratuity.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Per Month of Service:</span>
                        <span>₹${(perYearGratuity / 12).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>As % of Last Salary:</span>
                        <span>${((perYearGratuity / 12) / lastDrawnSalary * 100).toFixed(2)}% per year</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Months Worked:</span>
                        <span>${Math.round(yearsOfService * 12)} months</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Gratuity per Month Worked:</span>
                        <span>₹${(finalGratuity / (yearsOfService * 12)).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Eligibility & Rules</h3>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                        <strong>Indian Gratuity Act Rules:</strong><br>
                        ${employmentType === 'covered' ?
                            '• Applicable to organizations with 10+ employees<br>• Minimum 5 years of continuous service required<br>• Maximum limit: ₹20 lakhs (as per Payment of Gratuity Act)<br>• Formula: (Last Salary × Years × 15) / 26<br>• Tax-free up to ₹20 lakhs under Section 10(10) of Income Tax Act<br>• Fraction of year > 6 months rounded up to full year' :
                            employmentType === 'government' ?
                            '• Government employees have different formula<br>• Formula: (Last Salary × Years) / 4<br>• Generally more generous than private sector<br>• Tax-free up to ₹20 lakhs<br>• No minimum service requirement for government employees' :
                            '• Not covered under Gratuity Act<br>• Payment at employer\'s discretion<br>• Common formula: (Last Salary × Years × 15) / 26<br>• Tax exemption: Minimum of actual gratuity, ₹20L, or calculated amount<br>• Check employment contract for specific terms'
                        }
                    </p>
                </div>
                <div class="result-breakdown">
                    <h3>Important Notes</h3>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
                        • Gratuity is payable on resignation, retirement, death, or disablement<br>
                        • Last drawn salary includes basic salary + dearness allowance<br>
                        • Excludes: bonus, commission, HRA, other allowances<br>
                        • For fraction of year ≥ 6 months, count as completed year<br>
                        • Tax-free limit: ₹20,00,000 (as of current rules)<br>
                        • Amount above ₹20L is taxable as per income tax slab<br>
                        ${employmentType === 'covered' ? '• Maximum gratuity capped at ₹20 lakhs for covered employees' : ''}
                    </p>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('gratuity', {
                salary: lastDrawnSalary,
                years: roundedYears,
                gratuity: finalGratuity,
                employmentType
            }, {
                gratuity: finalGratuity
            });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for gratuity');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
