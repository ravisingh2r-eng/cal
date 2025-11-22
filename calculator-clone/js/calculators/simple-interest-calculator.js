/**
 * Simple Interest Calculator
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
                <label>Principal Amount (₹)</label>
                <input type="number" class="calc-input" id="principal" placeholder="Enter principal amount" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Annual Interest Rate (%)</label>
                <input type="number" class="calc-input" id="interestRate" placeholder="Enter interest rate" value="8" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Time Period</label>
                <input type="number" class="calc-input" id="timePeriod" placeholder="Enter time" value="5" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Time Unit</label>
                <select class="calc-input" id="timeUnit">
                    <option value="years" selected>Years</option>
                    <option value="months">Months</option>
                    <option value="days">Days</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Calculation Mode</label>
                <select class="calc-input" id="calculationMode">
                    <option value="interest">Calculate Interest</option>
                    <option value="principal">Find Principal</option>
                    <option value="rate">Find Rate</option>
                    <option value="time">Find Time</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Compare with Compound Interest</label>
                <select class="calc-input" id="compareCompound">
                    <option value="yes" selected>Yes</option>
                    <option value="no">No</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Investment Type</label>
                <select class="calc-input" id="investmentType">
                    <option value="fixed-deposit">Fixed Deposit</option>
                    <option value="recurring-deposit">Recurring Deposit</option>
                    <option value="loan">Loan/Borrowing</option>
                    <option value="savings">Savings Account</option>
                    <option value="bond">Bonds</option>
                    <option value="other">Other</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const principal = parseFloat(document.getElementById('principal').value) || 0;
        const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
        let timePeriod = parseFloat(document.getElementById('timePeriod').value) || 0;
        const timeUnit = document.getElementById('timeUnit').value;
        const calculationMode = document.getElementById('calculationMode').value;
        const compareCompound = document.getElementById('compareCompound').value;
        const investmentType = document.getElementById('investmentType').value;

        if (principal <= 0 && calculationMode !== 'principal') {
            alert('Please enter valid principal amount');
            return;
        }

        if (interestRate <= 0 && calculationMode !== 'rate') {
            alert('Please enter valid interest rate');
            return;
        }

        if (timePeriod <= 0 && calculationMode !== 'time') {
            alert('Please enter valid time period');
            return;
        }

        // Convert time to years for calculation
        let timeInYears = timePeriod;
        if (timeUnit === 'months') {
            timeInYears = timePeriod / 12;
        } else if (timeUnit === 'days') {
            timeInYears = timePeriod / 365;
        }

        let simpleInterest = 0;
        let totalAmount = 0;
        let calculatedPrincipal = principal;
        let calculatedRate = interestRate;
        let calculatedTime = timeInYears;

        // Simple Interest Formula: SI = (P × R × T) / 100
        if (calculationMode === 'interest') {
            simpleInterest = (principal * interestRate * timeInYears) / 100;
            totalAmount = principal + simpleInterest;
        } else if (calculationMode === 'principal') {
            // P = (SI × 100) / (R × T)
            // For this mode, we need to ask for total amount instead
            const totalAmountInput = prompt('Enter the total amount you want to reach (₹):');
            if (!totalAmountInput) return;
            totalAmount = parseFloat(totalAmountInput);
            simpleInterest = totalAmount - (totalAmount / (1 + (interestRate * timeInYears / 100)));
            calculatedPrincipal = totalAmount - simpleInterest;
        } else if (calculationMode === 'rate') {
            // R = (SI × 100) / (P × T)
            const desiredInterest = prompt('Enter the interest you want to earn (₹):');
            if (!desiredInterest) return;
            simpleInterest = parseFloat(desiredInterest);
            calculatedRate = (simpleInterest * 100) / (principal * timeInYears);
            totalAmount = principal + simpleInterest;
        } else if (calculationMode === 'time') {
            // T = (SI × 100) / (P × R)
            const desiredInterest = prompt('Enter the interest you want to earn (₹):');
            if (!desiredInterest) return;
            simpleInterest = parseFloat(desiredInterest);
            calculatedTime = (simpleInterest * 100) / (principal * interestRate);
            totalAmount = principal + simpleInterest;
            timeInYears = calculatedTime;
        }

        // Recalculate with final values
        if (calculationMode === 'interest') {
            simpleInterest = (calculatedPrincipal * calculatedRate * calculatedTime) / 100;
            totalAmount = calculatedPrincipal + simpleInterest;
        }

        // Monthly and yearly breakdowns
        const monthlyInterest = simpleInterest / (timeInYears * 12);
        const yearlyInterest = simpleInterest / timeInYears;

        // Compound interest comparison
        let compoundInterest = 0;
        let compoundAmount = 0;
        let differenceSIvsCI = 0;

        if (compareCompound === 'yes') {
            compoundAmount = calculatedPrincipal * Math.pow((1 + calculatedRate/100), calculatedTime);
            compoundInterest = compoundAmount - calculatedPrincipal;
            differenceSIvsCI = compoundInterest - simpleInterest;
        }

        // Return on investment
        const roi = (simpleInterest / calculatedPrincipal) * 100;
        const effectiveAnnualReturn = roi / calculatedTime;

        // Year-wise breakdown
        let yearWiseData = [];
        for (let i = 1; i <= Math.min(Math.ceil(calculatedTime), 20); i++) {
            const yearSI = (calculatedPrincipal * calculatedRate * i) / 100;
            const yearTotal = calculatedPrincipal + yearSI;
            const yearCI = calculatedPrincipal * Math.pow((1 + calculatedRate/100), i) - calculatedPrincipal;
            yearWiseData.push({
                year: i,
                simpleInterest: yearSI,
                totalAmount: yearTotal,
                compoundInterest: yearCI,
                difference: yearCI - yearSI
            });
        }

        // Investment type specific insights
        const typeInsights = {
            'fixed-deposit': 'Fixed Deposits typically use compound interest. Simple interest comparison helps understand the difference.',
            'recurring-deposit': 'RDs often use a formula similar to simple interest for regular deposits.',
            'loan': 'Simple interest loans are less common. Most loans use reducing balance (compound) method.',
            'savings': 'Savings accounts typically use compound interest calculated daily/monthly.',
            'bond': 'Bonds often pay simple interest as periodic coupon payments.',
            'other': 'Compare with compound interest to understand the best return structure.'
        };

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Simple Interest Earned</span>
                    <span class="result-value">₹${simpleInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Amount</span>
                    <span class="result-value">₹${totalAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Return on Investment</span>
                    <span class="result-value">${roi.toFixed(2)}%</span>
                </div>
                <div class="result-breakdown">
                    <h3>Calculation Details</h3>
                    <div class="breakdown-item">
                        <span>Principal Amount (P):</span>
                        <span>₹${calculatedPrincipal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Rate (R):</span>
                        <span>${calculatedRate}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Time Period (T):</span>
                        <span>${calculatedTime.toFixed(2)} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Formula Used:</span>
                        <span>SI = (P × R × T) / 100</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Calculation:</span>
                        <span>(${calculatedPrincipal.toLocaleString('en-IN')} × ${calculatedRate} × ${calculatedTime.toFixed(2)}) / 100</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Simple Interest:</span>
                        <span style="color: #10B981">₹${simpleInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Maturity Amount:</span>
                        <span style="font-weight: bold">₹${totalAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Interest Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Total Interest:</span>
                        <span>₹${simpleInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Yearly Interest:</span>
                        <span>₹${yearlyInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}/year</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Interest:</span>
                        <span>₹${monthlyInterest.toLocaleString('en-IN', {maximumFractionDigits: 2})}/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Daily Interest:</span>
                        <span>₹${(simpleInterest / (calculatedTime * 365)).toLocaleString('en-IN', {maximumFractionDigits: 2})}/day</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Effective Annual Return:</span>
                        <span>${effectiveAnnualReturn.toFixed(2)}% per year</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Return Analysis</h3>
                    <div class="breakdown-item">
                        <span>Initial Investment:</span>
                        <span>₹${calculatedPrincipal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Returns:</span>
                        <span>₹${simpleInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Return on Investment (ROI):</span>
                        <span style="color: ${roi > 50 ? '#10B981' : roi > 25 ? '#F59E0B' : '#6B7280'}">${roi.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Final Amount:</span>
                        <span>₹${totalAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Growth Factor:</span>
                        <span>${(totalAmount / calculatedPrincipal).toFixed(2)}x</span>
                    </div>
                </div>
                ${compareCompound === 'yes' ? `
                <div class="result-breakdown">
                    <h3>Simple vs Compound Interest Comparison</h3>
                    <div class="breakdown-item">
                        <span>Simple Interest Earned:</span>
                        <span>₹${simpleInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Compound Interest Earned:</span>
                        <span>₹${compoundInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Difference:</span>
                        <span style="color: ${differenceSIvsCI > 0 ? '#10B981' : '#6B7280'}">₹${Math.abs(differenceSIvsCI).toLocaleString('en-IN', {maximumFractionDigits: 0})} ${differenceSIvsCI > 0 ? 'more with CI' : ''}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Simple Interest Total:</span>
                        <span>₹${totalAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Compound Interest Total:</span>
                        <span>₹${compoundAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Compound Advantage:</span>
                        <span style="color: #10B981">${((differenceSIvsCI / simpleInterest) * 100).toFixed(2)}% more returns</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Recommendation:</span>
                        <span>${differenceSIvsCI > calculatedPrincipal * 0.1 ? '⚠ Significant difference! Consider compound interest options' : '✓ Difference is minimal for this duration'}</span>
                    </div>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>Year-wise Growth (First ${Math.min(Math.ceil(calculatedTime), 10)} Years)</h3>
                    ${yearWiseData.slice(0, 10).map(data => `
                        <div class="breakdown-item">
                            <span>Year ${data.year}:</span>
                            <span>SI: ₹${data.totalAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}${compareCompound === 'yes' ? ` | CI: ₹${(calculatedPrincipal + data.compoundInterest).toLocaleString('en-IN', {maximumFractionDigits: 0})}` : ''}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="result-breakdown">
                    <h3>Investment Type: ${investmentType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h3>
                    <div class="breakdown-item">
                        <span>Insight:</span>
                        <span>${typeInsights[investmentType]}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Best For:</span>
                        <span>${investmentType === 'loan' ? 'Lower total interest compared to compound' : investmentType === 'bond' ? 'Predictable fixed returns' : 'Short-term investments'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Typical Rate Range:</span>
                        <span>${investmentType === 'fixed-deposit' ? '5-7% p.a.' : investmentType === 'savings' ? '2-4% p.a.' : investmentType === 'loan' ? '8-15% p.a.' : investmentType === 'bond' ? '6-9% p.a.' : 'Varies'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Key Insights</h3>
                    <div class="breakdown-item">
                        <span>Interest Type:</span>
                        <span>Simple Interest (Linear Growth)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Growth Pattern:</span>
                        <span>Fixed amount added each period</span>
                    </div>
                    <div class="breakdown-item">
                        <span>vs Compound Interest:</span>
                        <span>${compareCompound === 'yes' && differenceSIvsCI > 0 ? `Compound earns ₹${differenceSIvsCI.toLocaleString('en-IN', {maximumFractionDigits: 0})} more` : 'Similar for short durations'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Best Use Case:</span>
                        <span>${calculatedTime < 3 ? 'Good for short-term (< 3 years)' : 'Consider compound interest for long-term'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Effective Rate:</span>
                        <span>${effectiveAnnualReturn.toFixed(2)}% annual return</span>
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
            trackCalculation('simple-interest', {
                principal: calculatedPrincipal,
                rate: calculatedRate,
                time: calculatedTime,
                interest: simpleInterest,
                totalAmount
            }, {
                value: 'high-cpc',
                principalInLakhs: calculatedPrincipal/100000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for simple interest calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
