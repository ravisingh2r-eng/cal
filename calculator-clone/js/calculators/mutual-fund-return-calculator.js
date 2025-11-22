/**
 * Mutual Fund Return Calculator (XIRR/CAGR Calculator)
 * High-CPC calculator optimized for revenue
 */

(function() {
    'use strict';

    let transactions = [];

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
                <label>Investment Type</label>
                <select class="calc-input" id="investmentType" onchange="updateFields()">
                    <option value="lumpsum">Lumpsum Investment</option>
                    <option value="sip">SIP Investment</option>
                    <option value="multiple">Multiple Transactions (XIRR)</option>
                </select>
            </div>
            <div id="lumpsumFields">
                <div class="calc-input-group">
                    <label>Investment Amount (₹)</label>
                    <input type="number" class="calc-input" id="investmentAmount" placeholder="Enter amount" value="100000">
                </div>
                <div class="calc-input-group">
                    <label>Purchase Date</label>
                    <input type="date" class="calc-input" id="purchaseDate" value="2020-01-01">
                </div>
                <div class="calc-input-group">
                    <label>Current/Redemption Value (₹)</label>
                    <input type="number" class="calc-input" id="redemptionAmount" placeholder="Current NAV × Units" value="150000">
                </div>
                <div class="calc-input-group">
                    <label>Redemption Date</label>
                    <input type="date" class="calc-input" id="redemptionDate">
                </div>
            </div>
            <div id="sipFields" style="display: none;">
                <div class="calc-input-group">
                    <label>Monthly SIP (₹)</label>
                    <input type="number" class="calc-input" id="sipAmount" placeholder="Monthly SIP" value="10000">
                </div>
                <div class="calc-input-group">
                    <label>SIP Start Date</label>
                    <input type="date" class="calc-input" id="sipStartDate" value="2020-01-01">
                </div>
                <div class="calc-input-group">
                    <label>SIP End Date</label>
                    <input type="date" class="calc-input" id="sipEndDate">
                </div>
                <div class="calc-input-group">
                    <label>Current Portfolio Value (₹)</label>
                    <input type="number" class="calc-input" id="sipCurrentValue" placeholder="Current value" value="500000">
                </div>
            </div>
            <div id="multipleFields" style="display: none;">
                <p style="color: #666; font-size: 14px;">Add your investment transactions</p>
                <div id="transactionList"></div>
                <button type="button" class="btn btn-outline" onclick="addTransaction()" style="margin-top: 10px;">+ Add Transaction</button>
            </div>
        `;

        // Set today's date as default redemption date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('redemptionDate').value = today;
        document.getElementById('sipEndDate').value = today;

        // Make updateFields available globally
        window.updateFields = updateFields;
        window.addTransaction = addTransaction;
        window.removeTransaction = removeTransaction;
    }

    function updateFields() {
        const type = document.getElementById('investmentType').value;
        document.getElementById('lumpsumFields').style.display = type === 'lumpsum' ? 'block' : 'none';
        document.getElementById('sipFields').style.display = type === 'sip' ? 'block' : 'none';
        document.getElementById('multipleFields').style.display = type === 'multiple' ? 'block' : 'none';
    }

    function addTransaction() {
        const list = document.getElementById('transactionList');
        const index = transactions.length;

        const transactionHtml = `
            <div class="transaction-row" id="transaction-${index}" style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 10px; margin-bottom: 10px; align-items: end;">
                <div>
                    <label style="font-size: 12px;">Date</label>
                    <input type="date" class="calc-input" id="txDate-${index}" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div>
                    <label style="font-size: 12px;">Amount (₹)</label>
                    <input type="number" class="calc-input" id="txAmount-${index}" placeholder="Amount">
                </div>
                <div>
                    <label style="font-size: 12px;">Type</label>
                    <select class="calc-input" id="txType-${index}">
                        <option value="buy">Buy/Invest</option>
                        <option value="sell">Sell/Redeem</option>
                    </select>
                </div>
                <button type="button" class="btn btn-outline" onclick="removeTransaction(${index})" style="padding: 8px 12px;">×</button>
            </div>
        `;

        list.insertAdjacentHTML('beforeend', transactionHtml);
        transactions.push({ index });
    }

    function removeTransaction(index) {
        const element = document.getElementById(`transaction-${index}`);
        if (element) {
            element.remove();
            transactions = transactions.filter(t => t.index !== index);
        }
    }

    function calculateCAGR(initial, final, years) {
        if (years <= 0 || initial <= 0) return 0;
        return (Math.pow(final / initial, 1 / years) - 1) * 100;
    }

    function calculateXIRR(cashFlows) {
        // Simple XIRR approximation using Newton-Raphson method
        let rate = 0.1; // Initial guess
        const maxIterations = 100;
        const tolerance = 0.0001;

        for (let i = 0; i < maxIterations; i++) {
            let npv = 0;
            let dnpv = 0;
            const startDate = cashFlows[0].date;

            cashFlows.forEach(cf => {
                const days = (cf.date - startDate) / (1000 * 60 * 60 * 24);
                const years = days / 365;
                const factor = Math.pow(1 + rate, years);
                npv += cf.amount / factor;
                dnpv -= (cf.amount * years) / (factor * (1 + rate));
            });

            const newRate = rate - npv / dnpv;
            if (Math.abs(newRate - rate) < tolerance) {
                return newRate * 100;
            }
            rate = newRate;
        }

        return rate * 100;
    }

    function calculate() {
        const type = document.getElementById('investmentType').value;
        let absoluteReturn, cagr, xirr, totalInvested, currentValue, years;

        if (type === 'lumpsum') {
            const invested = parseFloat(document.getElementById('investmentAmount').value) || 0;
            const redeemed = parseFloat(document.getElementById('redemptionAmount').value) || 0;
            const purchaseDate = new Date(document.getElementById('purchaseDate').value);
            const redemptionDate = new Date(document.getElementById('redemptionDate').value);

            if (invested <= 0 || redeemed <= 0) {
                alert('Please enter valid amounts');
                return;
            }

            const days = (redemptionDate - purchaseDate) / (1000 * 60 * 60 * 24);
            years = days / 365;

            totalInvested = invested;
            currentValue = redeemed;
            absoluteReturn = ((redeemed - invested) / invested) * 100;
            cagr = calculateCAGR(invested, redeemed, years);
            xirr = cagr; // For lumpsum, XIRR = CAGR

        } else if (type === 'sip') {
            const sipAmount = parseFloat(document.getElementById('sipAmount').value) || 0;
            const startDate = new Date(document.getElementById('sipStartDate').value);
            const endDate = new Date(document.getElementById('sipEndDate').value);
            currentValue = parseFloat(document.getElementById('sipCurrentValue').value) || 0;

            if (sipAmount <= 0 || currentValue <= 0) {
                alert('Please enter valid amounts');
                return;
            }

            const months = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
            years = months / 12;
            totalInvested = sipAmount * months;
            absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;

            // Calculate XIRR for SIP
            const cashFlows = [];
            for (let i = 0; i < months; i++) {
                const date = new Date(startDate);
                date.setMonth(date.getMonth() + i);
                cashFlows.push({ date, amount: -sipAmount });
            }
            cashFlows.push({ date: endDate, amount: currentValue });
            xirr = calculateXIRR(cashFlows);
            cagr = calculateCAGR(totalInvested / months, currentValue / months, years);

        } else {
            // Multiple transactions
            const cashFlows = [];
            transactions.forEach(t => {
                const date = new Date(document.getElementById(`txDate-${t.index}`).value);
                const amount = parseFloat(document.getElementById(`txAmount-${t.index}`).value) || 0;
                const txType = document.getElementById(`txType-${t.index}`).value;

                if (amount > 0) {
                    cashFlows.push({
                        date,
                        amount: txType === 'buy' ? -amount : amount
                    });
                }
            });

            if (cashFlows.length < 2) {
                alert('Please add at least 2 transactions');
                return;
            }

            totalInvested = cashFlows.filter(cf => cf.amount < 0).reduce((sum, cf) => sum + Math.abs(cf.amount), 0);
            currentValue = cashFlows.filter(cf => cf.amount > 0).reduce((sum, cf) => sum + cf.amount, 0);
            absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;

            const days = (cashFlows[cashFlows.length - 1].date - cashFlows[0].date) / (1000 * 60 * 60 * 24);
            years = days / 365;

            xirr = calculateXIRR(cashFlows);
            cagr = calculateCAGR(totalInvested, currentValue, years);
        }

        const gains = currentValue - totalInvested;

        // FD comparison (assuming 6.5% FD rate)
        const fdRate = 6.5;
        const fdReturns = totalInvested * (Math.pow(1 + fdRate / 100, years) - 1);
        const extraGains = gains - fdReturns;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Current Value</span>
                    <span class="result-value">₹${currentValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Invested</span>
                    <span class="result-value">₹${totalInvested.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Gains</span>
                    <span class="result-value" style="color: ${gains >= 0 ? '#10B981' : '#EF4444'};">
                        ₹${gains.toLocaleString('en-IN', {maximumFractionDigits: 0})} (${absoluteReturn.toFixed(2)}%)
                    </span>
                </div>
                <div class="result-breakdown">
                    <h3>Return Metrics</h3>
                    <div class="breakdown-item">
                        <span>Absolute Return:</span>
                        <span style="color: ${absoluteReturn >= 0 ? '#10B981' : '#EF4444'}; font-weight: 600;">
                            ${absoluteReturn.toFixed(2)}%
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>CAGR (Annualized):</span>
                        <span style="color: ${cagr >= 0 ? '#10B981' : '#EF4444'}; font-weight: 600;">
                            ${cagr.toFixed(2)}% p.a.
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>XIRR:</span>
                        <span style="color: ${xirr >= 0 ? '#10B981' : '#EF4444'}; font-weight: 600;">
                            ${xirr.toFixed(2)}% p.a.
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Investment Period:</span>
                        <span>${years.toFixed(2)} years</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Investment Summary</h3>
                    <div class="breakdown-item">
                        <span>Total Amount Invested:</span>
                        <span>₹${totalInvested.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Current Portfolio Value:</span>
                        <span>₹${currentValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Wealth Gained:</span>
                        <span style="color: ${gains >= 0 ? '#10B981' : '#EF4444'};">
                            ₹${gains.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Return Multiple:</span>
                        <span>${(currentValue / totalInvested).toFixed(2)}x</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Comparison with Fixed Deposit (${fdRate}% p.a.)</h3>
                    <div class="breakdown-item">
                        <span>FD Returns (Same Period):</span>
                        <span>₹${fdReturns.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Your Mutual Fund Returns:</span>
                        <span>₹${gains.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Extra Gains vs FD:</span>
                        <span style="color: ${extraGains >= 0 ? '#10B981' : '#EF4444'}; font-weight: 600;">
                            ₹${extraGains.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                            ${extraGains >= 0 ? '✓' : '✗'}
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Performance:</span>
                        <span style="color: ${extraGains >= 0 ? '#10B981' : '#EF4444'}; font-weight: 600;">
                            ${extraGains >= 0 ? 'Outperformed FD' : 'Underperformed FD'}
                        </span>
                    </div>
                </div>
                <div class="result-breakdown" style="background: #DBEAFE; border-left: 4px solid #3B82F6; padding: 15px;">
                    <h3 style="color: #1E40AF; margin-top: 0;">📊 Understanding Returns</h3>
                    <p style="color: #1E40AF; margin: 8px 0; font-size: 14px;">
                        <strong>Absolute Return:</strong> Total percentage gain/loss without considering time
                    </p>
                    <p style="color: #1E40AF; margin: 8px 0; font-size: 14px;">
                        <strong>CAGR:</strong> Compounded Annual Growth Rate - smoothed annual return
                    </p>
                    <p style="color: #1E40AF; margin: 8px 0; font-size: 14px;">
                        <strong>XIRR:</strong> Extended Internal Rate of Return - best for SIP/multiple transactions
                    </p>
                </div>
                <div class="result-breakdown" style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px;">
                    <h3 style="color: #92400E; margin-top: 0;">💡 Tax Information</h3>
                    <p style="color: #92400E; margin: 8px 0; font-size: 14px;">
                        <strong>Equity Funds:</strong> LTCG >₹1L taxed at 10% (>1 year), STCG at 15%
                    </p>
                    <p style="color: #92400E; margin: 8px 0; font-size: 14px;">
                        <strong>Debt Funds:</strong> Gains taxed as per income slab
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
            trackCalculation('mutual-fund-return', { totalInvested, currentValue, cagr, xirr }, { value: 'high-cpc' });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for mutual-fund-return');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
