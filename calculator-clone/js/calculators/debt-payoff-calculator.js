/**
 * Debt Payoff Calculator
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
                <label>Debt 1 - Name</label>
                <input type="text" class="calc-input" id="debt1Name" placeholder="e.g., Credit Card" value="Credit Card">
            </div>
            <div class="calc-input-group">
                <label>Debt 1 - Balance (₹)</label>
                <input type="number" class="calc-input" id="debt1Balance" placeholder="Enter balance" value="50000">
            </div>
            <div class="calc-input-group">
                <label>Debt 1 - Interest Rate (%)</label>
                <input type="number" class="calc-input" id="debt1Rate" placeholder="Enter rate" value="18" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Debt 1 - Minimum Payment (₹)</label>
                <input type="number" class="calc-input" id="debt1MinPayment" placeholder="Enter min payment" value="2500">
            </div>

            <div class="calc-input-group">
                <label>Debt 2 - Name</label>
                <input type="text" class="calc-input" id="debt2Name" placeholder="e.g., Personal Loan" value="Personal Loan">
            </div>
            <div class="calc-input-group">
                <label>Debt 2 - Balance (₹)</label>
                <input type="number" class="calc-input" id="debt2Balance" placeholder="Enter balance" value="200000">
            </div>
            <div class="calc-input-group">
                <label>Debt 2 - Interest Rate (%)</label>
                <input type="number" class="calc-input" id="debt2Rate" placeholder="Enter rate" value="14" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Debt 2 - Minimum Payment (₹)</label>
                <input type="number" class="calc-input" id="debt2MinPayment" placeholder="Enter min payment" value="5000">
            </div>

            <div class="calc-input-group">
                <label>Debt 3 - Name (Optional)</label>
                <input type="text" class="calc-input" id="debt3Name" placeholder="e.g., Car Loan" value="">
            </div>
            <div class="calc-input-group">
                <label>Debt 3 - Balance (₹)</label>
                <input type="number" class="calc-input" id="debt3Balance" placeholder="Enter balance" value="0">
            </div>
            <div class="calc-input-group">
                <label>Debt 3 - Interest Rate (%)</label>
                <input type="number" class="calc-input" id="debt3Rate" placeholder="Enter rate" value="0" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Debt 3 - Minimum Payment (₹)</label>
                <input type="number" class="calc-input" id="debt3MinPayment" placeholder="Enter min payment" value="0">
            </div>

            <div class="calc-input-group">
                <label>Extra Monthly Payment (₹)</label>
                <input type="number" class="calc-input" id="extraPayment" placeholder="Additional amount to pay" value="5000">
            </div>

            <div class="calc-input-group">
                <label>Payoff Strategy</label>
                <select class="calc-input" id="strategy">
                    <option value="avalanche" selected>Avalanche (Highest Interest First)</option>
                    <option value="snowball">Snowball (Lowest Balance First)</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const strategy = document.getElementById('strategy').value;
        const extraPayment = parseFloat(document.getElementById('extraPayment').value) || 0;

        // Collect debts
        const debts = [];
        for (let i = 1; i <= 3; i++) {
            const name = document.getElementById(`debt${i}Name`).value || `Debt ${i}`;
            const balance = parseFloat(document.getElementById(`debt${i}Balance`).value) || 0;
            const rate = parseFloat(document.getElementById(`debt${i}Rate`).value) || 0;
            const minPayment = parseFloat(document.getElementById(`debt${i}MinPayment`).value) || 0;

            if (balance > 0) {
                debts.push({
                    name,
                    balance,
                    rate,
                    minPayment,
                    originalBalance: balance
                });
            }
        }

        if (debts.length === 0) {
            alert('Please enter at least one debt.');
            return;
        }

        // Calculate total debt and minimum payment
        const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
        const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minPayment, 0);
        const totalPayment = totalMinPayment + extraPayment;

        // Sort debts based on strategy
        if (strategy === 'avalanche') {
            // Highest interest rate first
            debts.sort((a, b) => b.rate - a.rate);
        } else {
            // Lowest balance first (snowball)
            debts.sort((a, b) => a.balance - b.balance);
        }

        // Calculate payoff with strategy
        const payoffResults = calculatePayoffPlan(debts, extraPayment);

        // Calculate payoff with minimum payments only (for comparison)
        const minPayoffResults = calculateMinimumPayoffPlan(debts);

        const totalInterest = payoffResults.totalInterest;
        const totalMonths = payoffResults.months;
        const totalYears = (totalMonths / 12).toFixed(1);

        const minTotalInterest = minPayoffResults.totalInterest;
        const minTotalMonths = minPayoffResults.months;
        const minTotalYears = (minTotalMonths / 12).toFixed(1);

        const interestSaved = minTotalInterest - totalInterest;
        const timeSaved = minTotalMonths - totalMonths;

        // Generate debt payoff order table
        let debtOrderHTML = '';
        payoffResults.order.forEach((debt, index) => {
            debtOrderHTML += `
                <div class="breakdown-item">
                    <span>${index + 1}. ${debt.name}</span>
                    <span>₹${debt.originalBalance.toLocaleString('en-IN', {maximumFractionDigits: 0})} @ ${debt.rate}%</span>
                </div>
            `;
        });

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Debt-Free Date</span>
                    <span class="result-value">${totalMonths} months (${totalYears} years)</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Interest Paid</span>
                    <span class="result-value" style="color: #F59E0B;">₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Interest Saved</span>
                    <span class="result-value" style="color: #10B981;">₹${interestSaved.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Debt Summary</h3>
                    <div class="breakdown-item">
                        <span>Total Debt:</span>
                        <span>₹${totalDebt.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Number of Debts:</span>
                        <span>${debts.length}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Payoff Strategy:</span>
                        <span>${strategy === 'avalanche' ? 'Avalanche (Highest Interest First)' : 'Snowball (Lowest Balance First)'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Minimum Payment:</span>
                        <span>₹${totalMinPayment.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Extra Monthly Payment:</span>
                        <span style="color: #10B981;">₹${extraPayment.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Monthly Payment:</span>
                        <span style="font-weight: 600;">₹${totalPayment.toLocaleString('en-IN')}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Payoff Timeline (${strategy === 'avalanche' ? 'Avalanche' : 'Snowball'} Method)</h3>
                    <div class="breakdown-item">
                        <span>Time to Debt Freedom:</span>
                        <span style="font-weight: 600;">${totalMonths} months (${totalYears} years)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Amount Paid:</span>
                        <span>₹${(totalDebt + totalInterest).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Interest Paid:</span>
                        <span style="color: #F59E0B;">₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Payment:</span>
                        <span>₹${totalPayment.toLocaleString('en-IN')}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Comparison: With vs Without Extra Payment</h3>
                    <div class="breakdown-item">
                        <span>With Extra Payment (${totalPayment.toLocaleString('en-IN')}/month):</span>
                        <span>${totalMonths} months</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Minimum Payments Only (${totalMinPayment.toLocaleString('en-IN')}/month):</span>
                        <span>${minTotalMonths} months</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Time Saved:</span>
                        <span style="color: #10B981; font-weight: 600;">${timeSaved} months (${(timeSaved/12).toFixed(1)} years)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest with Extra Payment:</span>
                        <span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest with Minimum Only:</span>
                        <span>₹${minTotalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Saved:</span>
                        <span style="color: #10B981; font-weight: 600;">₹${interestSaved.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Debt Payoff Order</h3>
                    ${debtOrderHTML}
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        ${strategy === 'avalanche' ?
                            '*Avalanche Method: Pay off debts in order of highest to lowest interest rate. Saves the most money.' :
                            '*Snowball Method: Pay off debts in order of smallest to largest balance. Provides psychological wins.'
                        }
                    </p>
                </div>
                <div class="result-breakdown">
                    <h3>Individual Debt Details</h3>
                    ${debts.map(debt => `
                        <div style="margin-bottom: 1rem; padding: 0.75rem; background: var(--card-bg); border-radius: 8px;">
                            <div class="breakdown-item">
                                <span style="font-weight: 600;">${debt.name}</span>
                                <span>₹${debt.originalBalance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div class="breakdown-item">
                                <span>Interest Rate:</span>
                                <span>${debt.rate}% per annum</span>
                            </div>
                            <div class="breakdown-item">
                                <span>Minimum Payment:</span>
                                <span>₹${debt.minPayment.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="result-breakdown">
                    <h3>Payoff Strategy Guide</h3>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                        <strong style="color: #F59E0B;">Avalanche Method (Highest Interest First):</strong><br>
                        • Most cost-effective mathematically<br>
                        • Saves the most money in interest<br>
                        • Pay minimums on all debts<br>
                        • Put extra payment toward highest interest rate debt<br>
                        • When paid off, move to next highest rate<br>
                        • Best for: Maximizing savings<br><br>

                        <strong style="color: #10B981;">Snowball Method (Lowest Balance First):</strong><br>
                        • Most motivating psychologically<br>
                        • Quick wins build momentum<br>
                        • Pay minimums on all debts<br>
                        • Put extra payment toward smallest balance<br>
                        • When paid off, move to next smallest<br>
                        • Best for: Building confidence and motivation
                    </p>
                </div>
                <div class="result-breakdown">
                    <h3>Debt Payoff Tips</h3>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
                        • Always pay at least the minimum on all debts to avoid penalties<br>
                        • Consider balance transfer to 0% APR credit card if available<br>
                        • Negotiate lower interest rates with creditors<br>
                        • Stop adding new debt while paying off existing debt<br>
                        • Build emergency fund (₹50,000-₹1,00,000) to avoid new debt<br>
                        • Consider debt consolidation loan if you qualify for lower rate<br>
                        • Track progress monthly to stay motivated<br>
                        • Celebrate milestones when each debt is paid off<br>
                        • Use windfalls (bonus, tax refund) for extra payments
                    </p>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('debt-payoff', {
                totalDebt,
                strategy,
                months: totalMonths,
                interestSaved
            }, {
                value: 'high-cpc',
                savings: interestSaved
            });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function calculatePayoffPlan(debts, extraPayment) {
        // Clone debts to avoid modifying original
        const debtsCopy = debts.map(d => ({ ...d }));
        let totalInterest = 0;
        let months = 0;
        const maxMonths = 600; // 50 years max
        const payoffOrder = [];

        while (debtsCopy.some(d => d.balance > 0) && months < maxMonths) {
            months++;

            // Apply payments
            debtsCopy.forEach(debt => {
                if (debt.balance > 0) {
                    // Calculate interest for this month
                    const monthlyRate = debt.rate / 100 / 12;
                    const interest = debt.balance * monthlyRate;
                    totalInterest += interest;

                    // Apply minimum payment
                    const payment = Math.min(debt.minPayment, debt.balance + interest);
                    debt.balance = debt.balance + interest - payment;
                }
            });

            // Apply extra payment to first debt with balance
            let remainingExtra = extraPayment;
            for (let debt of debtsCopy) {
                if (debt.balance > 0 && remainingExtra > 0) {
                    const payment = Math.min(remainingExtra, debt.balance);
                    debt.balance -= payment;
                    remainingExtra -= payment;

                    if (debt.balance <= 0) {
                        payoffOrder.push({ ...debt });
                    }
                    break;
                }
            }
        }

        return {
            totalInterest,
            months,
            order: payoffOrder
        };
    }

    function calculateMinimumPayoffPlan(debts) {
        // Clone debts to avoid modifying original
        const debtsCopy = debts.map(d => ({ ...d }));
        let totalInterest = 0;
        let months = 0;
        const maxMonths = 600; // 50 years max

        while (debtsCopy.some(d => d.balance > 0) && months < maxMonths) {
            months++;

            debtsCopy.forEach(debt => {
                if (debt.balance > 0) {
                    const monthlyRate = debt.rate / 100 / 12;
                    const interest = debt.balance * monthlyRate;
                    totalInterest += interest;

                    const payment = Math.min(debt.minPayment, debt.balance + interest);
                    debt.balance = debt.balance + interest - payment;
                }
            });
        }

        return {
            totalInterest,
            months
        };
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for debt-payoff');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
