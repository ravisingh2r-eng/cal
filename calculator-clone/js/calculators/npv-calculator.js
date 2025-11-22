/**
 * NPV Calculator
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

        // Add cash flow button
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'addCashFlow') {
                addCashFlowField();
            }
        });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="calc-input-group">
                <label>Initial Investment (₹)</label>
                <input type="number" class="calc-input" id="initialInvestment" placeholder="Enter initial investment" value="1000000">
                <small>Negative value represents cash outflow</small>
            </div>
            <div class="calc-input-group">
                <label>Discount Rate (% p.a.)</label>
                <input type="number" class="calc-input" id="discountRate" placeholder="Enter discount rate" value="10" step="0.1">
                <small>WACC or expected return rate</small>
            </div>
            <div class="calc-input-group">
                <label>Project Duration (years)</label>
                <input type="number" class="calc-input" id="duration" placeholder="Enter duration" value="5">
            </div>
            <div class="calc-input-group">
                <label>Cash Flow Pattern</label>
                <select class="calc-input" id="pattern">
                    <option value="uniform" selected>Uniform (Equal yearly cash flows)</option>
                    <option value="custom">Custom (Different each year)</option>
                </select>
            </div>
            <div id="uniformCashFlow" class="calc-input-group">
                <label>Annual Cash Flow (₹)</label>
                <input type="number" class="calc-input" id="annualCashFlow" placeholder="Enter annual cash flow" value="300000">
            </div>
            <div id="customCashFlows" style="display: none;">
                <div class="calc-input-group">
                    <label>Year 1 Cash Flow (₹)</label>
                    <input type="number" class="calc-input cash-flow" data-year="1" placeholder="Year 1" value="200000">
                </div>
                <div class="calc-input-group">
                    <label>Year 2 Cash Flow (₹)</label>
                    <input type="number" class="calc-input cash-flow" data-year="2" placeholder="Year 2" value="250000">
                </div>
                <div class="calc-input-group">
                    <label>Year 3 Cash Flow (₹)</label>
                    <input type="number" class="calc-input cash-flow" data-year="3" placeholder="Year 3" value="300000">
                </div>
                <div class="calc-input-group">
                    <label>Year 4 Cash Flow (₹)</label>
                    <input type="number" class="calc-input cash-flow" data-year="4" placeholder="Year 4" value="350000">
                </div>
                <div class="calc-input-group">
                    <label>Year 5 Cash Flow (₹)</label>
                    <input type="number" class="calc-input cash-flow" data-year="5" placeholder="Year 5" value="400000">
                </div>
            </div>
        `;

        // Pattern change listener
        document.getElementById('pattern')?.addEventListener('change', (e) => {
            const uniformDiv = document.getElementById('uniformCashFlow');
            const customDiv = document.getElementById('customCashFlows');

            if (e.target.value === 'custom') {
                uniformDiv.style.display = 'none';
                customDiv.style.display = 'block';
            } else {
                uniformDiv.style.display = 'block';
                customDiv.style.display = 'none';
            }
        });
    }

    function addCashFlowField() {
        const customDiv = document.getElementById('customCashFlows');
        const currentFields = customDiv.querySelectorAll('.cash-flow').length;
        const newYear = currentFields + 1;

        const newField = document.createElement('div');
        newField.className = 'calc-input-group';
        newField.innerHTML = `
            <label>Year ${newYear} Cash Flow (₹)</label>
            <input type="number" class="calc-input cash-flow" data-year="${newYear}" placeholder="Year ${newYear}" value="0">
        `;
        customDiv.appendChild(newField);
    }

    function calculate() {
        const initialInvestment = Math.abs(parseFloat(document.getElementById('initialInvestment').value) || 0);
        const discountRate = parseFloat(document.getElementById('discountRate').value) || 10;
        const duration = parseFloat(document.getElementById('duration').value) || 5;
        const pattern = document.getElementById('pattern').value;

        const rate = discountRate / 100;

        // Get cash flows
        let cashFlows = [];

        if (pattern === 'uniform') {
            const annualCashFlow = parseFloat(document.getElementById('annualCashFlow').value) || 0;
            for (let year = 1; year <= duration; year++) {
                cashFlows.push(annualCashFlow);
            }
        } else {
            const cashFlowInputs = document.querySelectorAll('.cash-flow');
            cashFlowInputs.forEach((input, index) => {
                if (index < duration) {
                    cashFlows.push(parseFloat(input.value) || 0);
                }
            });
        }

        // Calculate NPV
        let npv = -initialInvestment; // Initial investment is negative cash flow
        let totalPresentValue = 0;
        let totalCashFlows = 0;

        const yearlyBreakdown = [];

        cashFlows.forEach((cashFlow, index) => {
            const year = index + 1;
            const presentValue = cashFlow / Math.pow(1 + rate, year);
            npv += presentValue;
            totalPresentValue += presentValue;
            totalCashFlows += cashFlow;

            yearlyBreakdown.push({
                year,
                cashFlow,
                discountFactor: 1 / Math.pow(1 + rate, year),
                presentValue
            });
        });

        // Calculate IRR (approximate using Newton-Raphson method)
        let irr = calculateIRR([-initialInvestment, ...cashFlows]);

        // Calculate Profitability Index
        const profitabilityIndex = totalPresentValue / initialInvestment;

        // Calculate Payback Period
        let cumulativeCashFlow = -initialInvestment;
        let paybackPeriod = 0;
        for (let i = 0; i < cashFlows.length; i++) {
            cumulativeCashFlow += cashFlows[i];
            if (cumulativeCashFlow >= 0) {
                paybackPeriod = i + 1 - (cumulativeCashFlow / cashFlows[i]);
                break;
            }
        }
        if (cumulativeCashFlow < 0) {
            paybackPeriod = duration; // Not recovered within project duration
        }

        // Calculate Discounted Payback Period
        cumulativeCashFlow = -initialInvestment;
        let discountedPaybackPeriod = 0;
        for (let i = 0; i < yearlyBreakdown.length; i++) {
            cumulativeCashFlow += yearlyBreakdown[i].presentValue;
            if (cumulativeCashFlow >= 0) {
                discountedPaybackPeriod = i + 1 - (cumulativeCashFlow / yearlyBreakdown[i].presentValue);
                break;
            }
        }
        if (cumulativeCashFlow < 0) {
            discountedPaybackPeriod = duration;
        }

        const isViable = npv > 0;
        const totalReturn = totalCashFlows - initialInvestment;
        const roi = (totalReturn / initialInvestment) * 100;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Net Present Value (NPV)</span>
                    <span class="result-value" style="color: ${npv >= 0 ? '#10B981' : '#EF4444'};">₹${npv.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Project Viability</span>
                    <span class="result-value" style="color: ${isViable ? '#10B981' : '#EF4444'};">${isViable ? 'ACCEPT' : 'REJECT'}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Internal Rate of Return (IRR)</span>
                    <span class="result-value">${irr !== null ? irr.toFixed(2) + '%' : 'N/A'}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Investment Details</h3>
                    <div class="breakdown-item">
                        <span>Initial Investment:</span>
                        <span>₹${initialInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Discount Rate (WACC):</span>
                        <span>${discountRate}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Project Duration:</span>
                        <span>${duration} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Cash Inflows:</span>
                        <span>₹${totalCashFlows.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Return (Undiscounted):</span>
                        <span style="color: ${totalReturn >= 0 ? '#10B981' : '#EF4444'};">₹${totalReturn.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>NPV Analysis</h3>
                    <div class="breakdown-item">
                        <span>Present Value of Cash Inflows:</span>
                        <span>₹${totalPresentValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Initial Investment (Outflow):</span>
                        <span>₹${initialInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Present Value:</span>
                        <span style="font-weight: 600; color: ${npv >= 0 ? '#10B981' : '#EF4444'};">₹${npv.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Decision:</span>
                        <span style="font-weight: 600; color: ${isViable ? '#10B981' : '#EF4444'};">
                            ${isViable ? '✓ Accept Project (NPV > 0)' : '✗ Reject Project (NPV < 0)'}
                        </span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Investment Metrics</h3>
                    <div class="breakdown-item">
                        <span>Profitability Index (PI):</span>
                        <span>${profitabilityIndex.toFixed(2)}${profitabilityIndex > 1 ? ' (Good)' : ' (Poor)'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>ROI (Undiscounted):</span>
                        <span>${roi.toFixed(2)}%</span>
                    </div>
                    ${irr !== null ? `
                    <div class="breakdown-item">
                        <span>IRR vs Discount Rate:</span>
                        <span style="color: ${irr > discountRate ? '#10B981' : '#EF4444'};">
                            ${irr > discountRate ? 'IRR > Discount Rate (Good)' : 'IRR < Discount Rate (Poor)'}
                        </span>
                    </div>
                    ` : ''}
                    <div class="breakdown-item">
                        <span>Payback Period:</span>
                        <span>${paybackPeriod < duration ? paybackPeriod.toFixed(2) + ' years' : 'Beyond project duration'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Discounted Payback Period:</span>
                        <span>${discountedPaybackPeriod < duration ? discountedPaybackPeriod.toFixed(2) + ' years' : 'Beyond project duration'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Yearly Cash Flow Breakdown</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <th style="padding: 0.5rem; text-align: left;">Year</th>
                                <th style="padding: 0.5rem; text-align: right;">Cash Flow</th>
                                <th style="padding: 0.5rem; text-align: right;">Discount Factor</th>
                                <th style="padding: 0.5rem; text-align: right;">Present Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 0.5rem;">0</td>
                                <td style="padding: 0.5rem; text-align: right; color: #EF4444;">-₹${initialInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                                <td style="padding: 0.5rem; text-align: right;">1.000</td>
                                <td style="padding: 0.5rem; text-align: right; color: #EF4444;">-₹${initialInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                            </tr>
                            ${yearlyBreakdown.map(item => `
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 0.5rem;">${item.year}</td>
                                <td style="padding: 0.5rem; text-align: right;">₹${item.cashFlow.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                                <td style="padding: 0.5rem; text-align: right;">${item.discountFactor.toFixed(4)}</td>
                                <td style="padding: 0.5rem; text-align: right;">₹${item.presentValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                            </tr>
                            `).join('')}
                            <tr style="font-weight: 600; background-color: var(--bg-secondary);">
                                <td style="padding: 0.5rem;">NPV</td>
                                <td style="padding: 0.5rem; text-align: right;">₹${totalCashFlows.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                                <td style="padding: 0.5rem; text-align: right;">-</td>
                                <td style="padding: 0.5rem; text-align: right; color: ${npv >= 0 ? '#10B981' : '#EF4444'};">₹${npv.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="result-breakdown">
                    <h3>Key Insights</h3>
                    ${npv > 0 ? `
                    <p style="font-size: 0.85rem; color: #10B981;">
                        ✓ <strong>Positive NPV:</strong> This project adds ₹${npv.toLocaleString('en-IN', {maximumFractionDigits: 0})} in value. Accept the project.
                    </p>
                    ` : `
                    <p style="font-size: 0.85rem; color: #EF4444;">
                        ✗ <strong>Negative NPV:</strong> This project destroys ₹${Math.abs(npv).toLocaleString('en-IN', {maximumFractionDigits: 0})} in value. Reject the project.
                    </p>
                    `}
                    ${irr !== null && irr > discountRate ? `
                    <p style="font-size: 0.85rem; color: #10B981;">
                        ✓ <strong>IRR (${irr.toFixed(2)}%) > Discount Rate (${discountRate}%):</strong> Project returns exceed cost of capital.
                    </p>
                    ` : irr !== null ? `
                    <p style="font-size: 0.85rem; color: #EF4444;">
                        ✗ <strong>IRR (${irr.toFixed(2)}%) < Discount Rate (${discountRate}%):</strong> Project returns below cost of capital.
                    </p>
                    ` : ''}
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        <strong>Note:</strong> NPV is the preferred method for capital budgeting decisions. Always consider qualitative factors alongside financial metrics.
                    </p>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('npv', {
                initialInvestment,
                npv,
                irr: irr || 0
            }, { value: 'high-cpc', viable: isViable });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    // Calculate IRR using Newton-Raphson method
    function calculateIRR(cashFlows, guess = 0.1) {
        const maxIterations = 100;
        const tolerance = 0.00001;

        let rate = guess;

        for (let i = 0; i < maxIterations; i++) {
            let npv = 0;
            let dnpv = 0;

            for (let t = 0; t < cashFlows.length; t++) {
                npv += cashFlows[t] / Math.pow(1 + rate, t);
                dnpv += -t * cashFlows[t] / Math.pow(1 + rate, t + 1);
            }

            const newRate = rate - npv / dnpv;

            if (Math.abs(newRate - rate) < tolerance) {
                return newRate * 100; // Convert to percentage
            }

            rate = newRate;
        }

        return null; // IRR not found
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for npv');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
