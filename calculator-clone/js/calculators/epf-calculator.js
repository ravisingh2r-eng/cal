/**
 * EPF (Employee Provident Fund) Calculator
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
                <label>Monthly Basic Salary (₹)</label>
                <input type="number" class="calc-input" id="basicSalary" placeholder="Enter basic salary" value="40000">
            </div>
            <div class="calc-input-group">
                <label>Dearness Allowance (DA) - (₹/month)</label>
                <input type="number" class="calc-input" id="da" placeholder="Enter DA if applicable" value="0">
            </div>
            <div class="calc-input-group">
                <label>Current Age (years)</label>
                <input type="number" class="calc-input" id="age" placeholder="Enter current age" value="30">
            </div>
            <div class="calc-input-group">
                <label>Retirement Age (years)</label>
                <input type="number" class="calc-input" id="retirementAge" placeholder="Enter retirement age" value="58">
            </div>
            <div class="calc-input-group">
                <label>Current EPF Balance (₹)</label>
                <input type="number" class="calc-input" id="currentBalance" placeholder="Enter current balance" value="500000">
            </div>
            <div class="calc-input-group">
                <label>Employee Contribution (%)</label>
                <select class="calc-input" id="employeeContribution">
                    <option value="12" selected>12% (Standard)</option>
                    <option value="15">15%</option>
                    <option value="20">20%</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Employer Contribution (%)</label>
                <select class="calc-input" id="employerContribution">
                    <option value="12" selected>12% (Standard)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>EPF Interest Rate (% p.a.)</label>
                <input type="number" class="calc-input" id="interestRate" placeholder="Current: 8.25%" value="8.25" step="0.01">
                <small>Current EPF rate: 8.25% p.a. (FY 2024-25)</small>
            </div>
            <div class="calc-input-group">
                <label>Annual Salary Increment (%)</label>
                <input type="number" class="calc-input" id="increment" placeholder="Expected increment" value="8" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Voluntary Provident Fund (VPF)</label>
                <select class="calc-input" id="vpf">
                    <option value="0" selected>No VPF</option>
                    <option value="5">5% Additional</option>
                    <option value="10">10% Additional</option>
                    <option value="15">15% Additional</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const basicSalary = parseFloat(document.getElementById('basicSalary').value) || 0;
        const da = parseFloat(document.getElementById('da').value) || 0;
        const age = parseFloat(document.getElementById('age').value) || 30;
        const retirementAge = parseFloat(document.getElementById('retirementAge').value) || 58;
        const currentBalance = parseFloat(document.getElementById('currentBalance').value) || 0;
        const employeeContribution = parseFloat(document.getElementById('employeeContribution').value) || 12;
        const employerContribution = parseFloat(document.getElementById('employerContribution').value) || 12;
        const interestRate = parseFloat(document.getElementById('interestRate').value) || 8.25;
        const increment = parseFloat(document.getElementById('increment').value) || 8;
        const vpf = parseFloat(document.getElementById('vpf').value) || 0;

        if (basicSalary <= 0) {
            alert('Please enter valid basic salary');
            return;
        }

        const yearsToRetirement = retirementAge - age;
        if (yearsToRetirement <= 0) {
            alert('Retirement age must be greater than current age');
            return;
        }

        // EPF wage ceiling: ₹15,000/month
        const epfWageCeiling = 15000;
        const eligibleWages = Math.min(basicSalary + da, epfWageCeiling);

        // Calculate monthly contributions
        const monthlyEmployeeContribution = (eligibleWages * employeeContribution) / 100;
        const monthlyEmployerContribution = (eligibleWages * employerContribution) / 100;
        const monthlyVPFContribution = (eligibleWages * vpf) / 100;
        const totalMonthlyContribution = monthlyEmployeeContribution + monthlyEmployerContribution + monthlyVPFContribution;

        // Employer contribution split: 8.33% to EPS, 3.67% to EPF
        const epsContribution = (eligibleWages * 8.33) / 100;
        const employerEPFContribution = monthlyEmployerContribution - epsContribution;

        // Calculate year-wise accumulation
        let balance = currentBalance;
        let salary = basicSalary;
        let totalContributions = 0;
        let totalInterestEarned = 0;

        const yearWiseData = [];

        for (let year = 1; year <= yearsToRetirement; year++) {
            const currentEligibleWages = Math.min(salary + da, epfWageCeiling);
            const yearlyEmployeeContribution = (currentEligibleWages * employeeContribution / 100) * 12;
            const yearlyEmployerContribution = (currentEligibleWages * employerContribution / 100) * 12;
            const yearlyVPFContribution = (currentEligibleWages * vpf / 100) * 12;
            const yearlyTotalContribution = yearlyEmployeeContribution + yearlyEmployerContribution + yearlyVPFContribution;

            // Calculate interest (compounded annually)
            const openingBalance = balance;
            const contributions = yearlyTotalContribution;
            const interest = (openingBalance + contributions) * (interestRate / 100);

            balance = openingBalance + contributions + interest;
            totalContributions += contributions;
            totalInterestEarned += interest;

            if (year <= 10 || year === yearsToRetirement) {
                yearWiseData.push({
                    year,
                    age: age + year,
                    contribution: yearlyTotalContribution,
                    interest,
                    balance
                });
            }

            // Apply salary increment
            salary = salary * (1 + increment/100);
        }

        const finalBalance = balance;
        const totalInvested = currentBalance + totalContributions;
        const totalReturns = totalInterestEarned;

        // Tax calculation (EPF is tax-free on withdrawal after 5 years of continuous service)
        const isTaxFree = yearsToRetirement >= 5;

        // Monthly pension calculation
        const monthlyPension = (finalBalance * (interestRate/100)) / 12;

        // Comparison with other instruments
        const fdReturn = 7; // FD rate
        const fdFinalValue = currentBalance * Math.pow(1 + fdReturn/100, yearsToRetirement) +
                            (totalContributions / yearsToRetirement) * ((Math.pow(1 + fdReturn/100, yearsToRetirement) - 1) / (fdReturn/100));

        const epfAdvantage = finalBalance - fdFinalValue;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">EPF Balance at Retirement</span>
                    <span class="result-value">₹${finalBalance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Interest Earned</span>
                    <span class="result-value" style="color: #10B981">₹${totalInterestEarned.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Monthly Pension (@ ${interestRate}%)</span>
                    <span class="result-value">₹${monthlyPension.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>EPF Account Summary</h3>
                    <div class="breakdown-item">
                        <span>Current Age:</span>
                        <span>${age} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Retirement Age:</span>
                        <span>${retirementAge} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Years to Retirement:</span>
                        <span>${yearsToRetirement} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Current EPF Balance:</span>
                        <span>₹${currentBalance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Final EPF Balance:</span>
                        <span style="font-weight: 600; color: #10B981">₹${finalBalance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Monthly Contributions</h3>
                    <div class="breakdown-item">
                        <span>Basic Salary + DA:</span>
                        <span>₹${(basicSalary + da).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>EPF Eligible Wages:</span>
                        <span>₹${eligibleWages.toLocaleString('en-IN', {maximumFractionDigits: 0})} (capped at ₹15,000)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Employee Contribution (${employeeContribution}%):</span>
                        <span>₹${monthlyEmployeeContribution.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Employer Contribution (${employerContribution}%):</span>
                        <span>₹${monthlyEmployerContribution.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ${vpf > 0 ? `
                    <div class="breakdown-item">
                        <span>VPF Contribution (${vpf}%):</span>
                        <span>₹${monthlyVPFContribution.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ` : ''}
                    <div class="breakdown-item">
                        <span>Total Monthly Contribution:</span>
                        <span style="font-weight: 600">₹${totalMonthlyContribution.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Contribution:</span>
                        <span>₹${(totalMonthlyContribution * 12).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Employer Contribution Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Total Employer Contribution:</span>
                        <span>₹${monthlyEmployerContribution.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>To EPS (Pension) - 8.33%:</span>
                        <span>₹${epsContribution.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>To EPF - 3.67%:</span>
                        <span>₹${employerEPFContribution.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *EPS (Employee Pension Scheme) provides monthly pension after retirement
                    </p>
                </div>
                <div class="result-breakdown">
                    <h3>Investment Summary</h3>
                    <div class="breakdown-item">
                        <span>Total Invested:</span>
                        <span>₹${totalInvested.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Interest Earned:</span>
                        <span style="color: #10B981">₹${totalInterestEarned.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Final Corpus:</span>
                        <span style="font-weight: 600">₹${finalBalance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Returns:</span>
                        <span>${((totalInterestEarned / totalContributions) * 100).toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Multiplier:</span>
                        <span>${(finalBalance / totalInvested).toFixed(2)}x</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Benefits</h3>
                    <div class="breakdown-item">
                        <span>Tax Status:</span>
                        <span style="color: #10B981">${isTaxFree ? '✓ Tax-free (EEE status)' : '⚠ Check tax implications'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Employee Contribution:</span>
                        <span>Deductible under Section 80C (up to ₹1.5L)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Earned:</span>
                        <span>Tax-free accumulation</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Withdrawal:</span>
                        <span>${isTaxFree ? 'Tax-free after 5 years of service' : 'Taxable if withdrawn before 5 years'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Tax Saving:</span>
                        <span>₹${(Math.min(monthlyEmployeeContribution * 12, 150000) * 0.30).toLocaleString('en-IN', {maximumFractionDigits: 0})} (at 30% slab)</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Comparison with Fixed Deposit (${fdReturn}%)</h3>
                    <div class="breakdown-item">
                        <span>EPF Final Value @ ${interestRate}%:</span>
                        <span>₹${finalBalance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>FD Final Value @ ${fdReturn}%:</span>
                        <span>₹${fdFinalValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>EPF Advantage:</span>
                        <span style="color: ${epfAdvantage > 0 ? '#10B981' : '#EF4444'}">₹${epfAdvantage.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *EPF offers better returns and tax benefits compared to FD
                    </p>
                </div>
                <div class="result-breakdown">
                    <h3>Year-wise Accumulation (First 10 Years & Final Year)</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <th style="padding: 0.5rem; text-align: left;">Year</th>
                                <th style="padding: 0.5rem; text-align: right;">Age</th>
                                <th style="padding: 0.5rem; text-align: right;">Contribution</th>
                                <th style="padding: 0.5rem; text-align: right;">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${yearWiseData.map(item => `
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 0.5rem;">${item.year}</td>
                                <td style="padding: 0.5rem; text-align: right;">${item.age}</td>
                                <td style="padding: 0.5rem; text-align: right;">₹${item.contribution.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                                <td style="padding: 0.5rem; text-align: right; color: #10B981;">₹${item.balance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="result-breakdown">
                    <h3>EPF Key Features (India 2024)</h3>
                    <ul style="font-size: 0.85rem; color: var(--text-secondary); list-style: inside; margin-top: 0.5rem;">
                        <li>Interest Rate: ${interestRate}% p.a. (FY 2024-25)</li>
                        <li>Wage Ceiling: ₹15,000/month for statutory contribution</li>
                        <li>Tax Status: EEE (Exempt-Exempt-Exempt)</li>
                        <li>Minimum Lock-in: 5 years for tax-free withdrawal</li>
                        <li>Partial Withdrawal: Allowed for housing, education, medical emergencies</li>
                        <li>Transferable: Across employers without breaking continuity</li>
                        <li>Employer Match: 12% (split: 8.33% to EPS + 3.67% to EPF)</li>
                        <li>VPF Option: Voluntary contribution beyond 12% at same interest rate</li>
                    </ul>
                </div>
                <div class="result-breakdown">
                    <h3>Recommendations</h3>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
                        ${vpf === 0 ? '💡 <strong>Consider VPF:</strong> Invest additional amount in VPF to get guaranteed returns at EPF rate<br>' : ''}
                        ✓ <strong>Stay Invested:</strong> Do not withdraw EPF prematurely to enjoy tax-free compounding<br>
                        ✓ <strong>Monitor Interest Rate:</strong> EPF rate is revised annually by EPFO<br>
                        ✓ <strong>Track Contributions:</strong> Check EPF passbook regularly via EPFO portal<br>
                        ✓ <strong>Link Aadhaar & UAN:</strong> Ensure seamless service across employers
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
            trackCalculation('epf', {
                basicSalary,
                yearsToRetirement,
                finalBalance,
                totalInterestEarned
            }, {
                value: 'high-cpc',
                corpusInLakhs: finalBalance/100000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for epf calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
