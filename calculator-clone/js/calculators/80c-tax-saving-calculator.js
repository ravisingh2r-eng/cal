/**
 * 80C Tax Saving Calculator
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
                <label>Annual Income (₹)</label>
                <input type="number" class="calc-input" id="income" placeholder="Enter annual income" value="1200000">
            </div>
            <div class="calc-input-group">
                <label>Tax Regime</label>
                <select class="calc-input" id="regime">
                    <option value="old" selected>Old Tax Regime (with deductions)</option>
                    <option value="new">New Tax Regime (lower rates, no deductions)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>EPF/PPF Contributions (₹/year)</label>
                <input type="number" class="calc-input" id="epf" placeholder="Enter EPF/PPF amount" value="50000">
            </div>
            <div class="calc-input-group">
                <label>Life Insurance Premium (₹/year)</label>
                <input type="number" class="calc-input" id="insurance" placeholder="Enter LIC premium" value="25000">
            </div>
            <div class="calc-input-group">
                <label>ELSS Mutual Funds (₹/year)</label>
                <input type="number" class="calc-input" id="elss" placeholder="Enter ELSS investment" value="50000">
            </div>
            <div class="calc-input-group">
                <label>Home Loan Principal (₹/year)</label>
                <input type="number" class="calc-input" id="homeLoan" placeholder="Enter principal repayment" value="0">
            </div>
            <div class="calc-input-group">
                <label>Tuition Fees (₹/year)</label>
                <input type="number" class="calc-input" id="tuition" placeholder="Enter children's tuition" value="0">
            </div>
            <div class="calc-input-group">
                <label>NSC/Tax Saver FD (₹/year)</label>
                <input type="number" class="calc-input" id="nsc" placeholder="Enter NSC/FD amount" value="0">
            </div>
            <div class="calc-input-group">
                <label>Sukanya Samriddhi Yojana (₹/year)</label>
                <input type="number" class="calc-input" id="sukanya" placeholder="Enter SSY amount" value="0">
            </div>
            <div class="calc-input-group">
                <label>NPS Contribution (₹/year)</label>
                <input type="number" class="calc-input" id="nps" placeholder="Enter NPS amount" value="25000">
                <small>Section 80CCD(1B): Additional ₹50,000 deduction</small>
            </div>
        `;
    }

    function calculate() {
        const income = parseFloat(document.getElementById('income').value) || 0;
        const regime = document.getElementById('regime').value;
        const epf = parseFloat(document.getElementById('epf').value) || 0;
        const insurance = parseFloat(document.getElementById('insurance').value) || 0;
        const elss = parseFloat(document.getElementById('elss').value) || 0;
        const homeLoan = parseFloat(document.getElementById('homeLoan').value) || 0;
        const tuition = parseFloat(document.getElementById('tuition').value) || 0;
        const nsc = parseFloat(document.getElementById('nsc').value) || 0;
        const sukanya = parseFloat(document.getElementById('sukanya').value) || 0;
        const nps = parseFloat(document.getElementById('nps').value) || 0;

        // Calculate total 80C investments
        const total80C = epf + insurance + elss + homeLoan + tuition + nsc + sukanya;
        const max80C = 150000;
        const eligible80C = Math.min(total80C, max80C);
        const excess80C = Math.max(total80C - max80C, 0);

        // NPS 80CCD(1B) - separate ₹50,000 limit
        const max80CCD1B = 50000;
        const eligible80CCD1B = Math.min(nps, max80CCD1B);

        // Total deductions
        const totalDeductions = eligible80C + eligible80CCD1B;

        // Calculate tax based on regime
        let taxWithout = 0;
        let taxWith = 0;

        if (regime === 'old') {
            // Old tax regime calculation
            taxWithout = calculateOldRegimeTax(income, 0);
            taxWith = calculateOldRegimeTax(income, totalDeductions);
        } else {
            // New tax regime (no deductions allowed)
            taxWithout = calculateNewRegimeTax(income);
            taxWith = taxWithout; // No deductions in new regime
        }

        const taxSaved = taxWithout - taxWith;

        // Calculate effective return on 80C investments
        const effectiveReturn = eligible80C > 0 ? (taxSaved / eligible80C) * 100 : 0;

        // Recommendations
        const unutilized80C = max80C - eligible80C;
        const unutilizedNPS = max80CCD1B - eligible80CCD1B;
        const totalUnutilized = unutilized80C + unutilizedNPS;
        const additionalSavings = totalUnutilized * 0.30; // At 30% tax bracket

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Tax Saved (Section 80C + 80CCD)</span>
                    <span class="result-value">₹${taxSaved.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Tax Without Deductions</span>
                    <span class="result-value" style="color: #EF4444;">₹${taxWithout.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Tax After Deductions</span>
                    <span class="result-value" style="color: #10B981;">₹${taxWith.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Section 80C Investments</h3>
                    ${epf > 0 ? `
                    <div class="breakdown-item">
                        <span>EPF/PPF:</span>
                        <span>₹${epf.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${insurance > 0 ? `
                    <div class="breakdown-item">
                        <span>Life Insurance Premium:</span>
                        <span>₹${insurance.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${elss > 0 ? `
                    <div class="breakdown-item">
                        <span>ELSS Mutual Funds:</span>
                        <span>₹${elss.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${homeLoan > 0 ? `
                    <div class="breakdown-item">
                        <span>Home Loan Principal:</span>
                        <span>₹${homeLoan.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${tuition > 0 ? `
                    <div class="breakdown-item">
                        <span>Tuition Fees:</span>
                        <span>₹${tuition.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${nsc > 0 ? `
                    <div class="breakdown-item">
                        <span>NSC/Tax Saver FD:</span>
                        <span>₹${nsc.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${sukanya > 0 ? `
                    <div class="breakdown-item">
                        <span>Sukanya Samriddhi Yojana:</span>
                        <span>₹${sukanya.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    <div class="breakdown-item">
                        <span>Total 80C Investments:</span>
                        <span>₹${total80C.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Maximum 80C Limit:</span>
                        <span>₹${max80C.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Eligible 80C Deduction:</span>
                        <span style="font-weight: 600; color: #10B981;">₹${eligible80C.toLocaleString('en-IN')}</span>
                    </div>
                    ${excess80C > 0 ? `
                    <div class="breakdown-item">
                        <span>Excess Investment (No benefit):</span>
                        <span style="color: #F59E0B;">₹${excess80C.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                </div>
                <div class="result-breakdown">
                    <h3>Section 80CCD(1B) - NPS</h3>
                    <div class="breakdown-item">
                        <span>NPS Contribution:</span>
                        <span>₹${nps.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Maximum 80CCD(1B) Limit:</span>
                        <span>₹${max80CCD1B.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Eligible 80CCD(1B) Deduction:</span>
                        <span style="font-weight: 600; color: #10B981;">₹${eligible80CCD1B.toLocaleString('en-IN')}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *Section 80CCD(1B) provides additional ₹50,000 deduction over and above the ₹1.5 lakh limit under Section 80C
                    </p>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Summary</h3>
                    <div class="breakdown-item">
                        <span>Annual Income:</span>
                        <span>₹${income.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Regime:</span>
                        <span>${regime === 'old' ? 'Old Regime (with deductions)' : 'New Regime (no deductions)'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Deductions:</span>
                        <span>₹${totalDeductions.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Before Deductions:</span>
                        <span>₹${taxWithout.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax After Deductions:</span>
                        <span>₹${taxWith.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Saved:</span>
                        <span style="font-weight: 600; color: #10B981;">₹${taxSaved.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Effective Return on 80C:</span>
                        <span>${effectiveReturn.toFixed(2)}%</span>
                    </div>
                </div>
                ${totalUnutilized > 0 ? `
                <div class="result-breakdown">
                    <h3>Optimization Opportunity</h3>
                    <div class="breakdown-item">
                        <span>Unutilized 80C Limit:</span>
                        <span style="color: #F59E0B;">₹${unutilized80C.toLocaleString('en-IN')}</span>
                    </div>
                    ${unutilizedNPS > 0 ? `
                    <div class="breakdown-item">
                        <span>Unutilized 80CCD(1B) Limit:</span>
                        <span style="color: #F59E0B;">₹${unutilizedNPS.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    <div class="breakdown-item">
                        <span>Total Unutilized:</span>
                        <span>₹${totalUnutilized.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Additional Tax Savings Possible:</span>
                        <span style="color: #EF4444; font-weight: 600;">₹${additionalSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        💡 You can save an additional ₹${additionalSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})} by investing ₹${totalUnutilized.toLocaleString('en-IN')} in 80C/80CCD instruments
                    </p>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>Best 80C Investment Options</h3>
                    <table style="width: 100%; font-size: 0.85rem; color: var(--text-secondary);">
                        <tr style="font-weight: 600; border-bottom: 1px solid var(--border-color);">
                            <td>Option</td>
                            <td>Return</td>
                            <td>Lock-in</td>
                            <td>Risk</td>
                        </tr>
                        <tr>
                            <td>ELSS Mutual Funds</td>
                            <td>12-15%</td>
                            <td>3 years</td>
                            <td>High</td>
                        </tr>
                        <tr>
                            <td>PPF</td>
                            <td>7.1%</td>
                            <td>15 years</td>
                            <td>None</td>
                        </tr>
                        <tr>
                            <td>EPF</td>
                            <td>8.25%</td>
                            <td>Till retirement</td>
                            <td>None</td>
                        </tr>
                        <tr>
                            <td>NSC</td>
                            <td>7.7%</td>
                            <td>5 years</td>
                            <td>None</td>
                        </tr>
                        <tr>
                            <td>Tax Saver FD</td>
                            <td>6-7%</td>
                            <td>5 years</td>
                            <td>None</td>
                        </tr>
                        <tr>
                            <td>NPS (80CCD 1B)</td>
                            <td>10-12%</td>
                            <td>Till 60</td>
                            <td>Medium</td>
                        </tr>
                    </table>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('80c-tax-saving', {
                income,
                total80C,
                eligible80C,
                taxSaved
            }, {
                value: 'high-cpc',
                taxSaved
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
        console.log('Loading affiliate offers for 80c-tax-saving');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
