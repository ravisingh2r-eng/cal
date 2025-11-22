/**
 * Crypto Tax Calculator
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
                <label>Purchase Price (₹)</label>
                <input type="number" class="calc-input" id="purchasePrice" placeholder="Enter purchase price" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Sale Price (₹)</label>
                <input type="number" class="calc-input" id="salePrice" placeholder="Enter sale price" value="150000">
            </div>
            <div class="calc-input-group">
                <label>Transaction Type</label>
                <select class="calc-input" id="transactionType">
                    <option value="profit">Profit/Gain</option>
                    <option value="loss">Loss</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Exchange Fees (₹) - Optional</label>
                <input type="number" class="calc-input" id="fees" placeholder="Enter fees" value="0">
            </div>
            <div class="calc-input-group">
                <label>Number of Transactions</label>
                <input type="number" class="calc-input" id="numTransactions" placeholder="Enter number" value="1">
            </div>
        `;
    }

    function calculate() {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
        const salePrice = parseFloat(document.getElementById('salePrice').value) || 0;
        const transactionType = document.getElementById('transactionType').value;
        const fees = parseFloat(document.getElementById('fees').value) || 0;
        const numTransactions = parseFloat(document.getElementById('numTransactions').value) || 1;

        // India Crypto Tax Rules (as of 2022):
        // - 30% flat tax on crypto gains (Section 115BBH)
        // - 1% TDS on crypto transactions above ₹10,000 (Section 194S)
        // - No deduction for losses
        // - No set-off of crypto losses against other income or crypto gains

        const totalPurchasePrice = purchasePrice * numTransactions;
        const totalSalePrice = salePrice * numTransactions;
        const totalFees = fees * numTransactions;

        // Calculate gains/losses
        const grossGain = totalSalePrice - totalPurchasePrice - totalFees;
        const isProfit = grossGain > 0;

        // Calculate tax (30% flat on gains only)
        let tax = 0;
        if (isProfit) {
            tax = grossGain * 0.30; // 30% flat tax on crypto gains
        }

        // Calculate TDS (1% on transaction value if > ₹10,000)
        let tds = 0;
        const tdsThreshold = 10000;
        if (totalSalePrice > tdsThreshold) {
            tds = totalSalePrice * 0.01; // 1% TDS
        }

        const totalTax = tax + tds;
        const netProceeds = totalSalePrice - totalTax;
        const netGain = netProceeds - totalPurchasePrice - totalFees;

        // Calculate effective tax rate
        const effectiveTaxRate = grossGain > 0 ? (totalTax / grossGain * 100) : 0;

        // Calculate per transaction breakdown
        const perTransactionGain = grossGain / numTransactions;
        const perTransactionTax = totalTax / numTransactions;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Total Tax Liability</span>
                    <span class="result-value">₹${totalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">${isProfit ? 'Gross Gain' : 'Loss'}</span>
                    <span class="result-value" style="color: ${isProfit ? '#10B981' : '#EF4444'};">₹${Math.abs(grossGain).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Net Proceeds (After Tax)</span>
                    <span class="result-value">₹${netProceeds.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Transaction Summary</h3>
                    <div class="breakdown-item">
                        <span>Number of Transactions:</span>
                        <span>${numTransactions}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Purchase Price:</span>
                        <span>₹${totalPurchasePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Sale Price:</span>
                        <span>₹${totalSalePrice.toLocaleString('en-IN')}</span>
                    </div>
                    ${totalFees > 0 ? `
                    <div class="breakdown-item">
                        <span>Total Exchange Fees:</span>
                        <span>₹${totalFees.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    <div class="breakdown-item">
                        <span>Gross ${isProfit ? 'Gain' : 'Loss'}:</span>
                        <span style="font-weight: 600; color: ${isProfit ? '#10B981' : '#EF4444'};">₹${Math.abs(grossGain).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Calculation (India)</h3>
                    ${isProfit ? `
                    <div class="breakdown-item">
                        <span>Taxable Gain:</span>
                        <span>₹${grossGain.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Rate (Section 115BBH):</span>
                        <span style="color: #F59E0B;">30% flat (no deductions)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax on Gain:</span>
                        <span>₹${tax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>` : `
                    <div class="breakdown-item">
                        <span>Loss Amount:</span>
                        <span style="color: #EF4444;">₹${Math.abs(grossGain).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax on Loss:</span>
                        <span style="color: #10B981;">₹0 (No tax on losses)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Important:</span>
                        <span style="color: #EF4444; font-size: 0.9rem;">Losses cannot be set off against gains or other income</span>
                    </div>`}
                    ${totalSalePrice > tdsThreshold ? `
                    <div class="breakdown-item">
                        <span>TDS (Section 194S):</span>
                        <span>1% on sale value (₹${totalSalePrice.toLocaleString('en-IN')})</span>
                    </div>
                    <div class="breakdown-item">
                        <span>TDS Amount:</span>
                        <span>₹${tds.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>` : `
                    <div class="breakdown-item">
                        <span>TDS (Section 194S):</span>
                        <span style="color: #10B981;">₹0 (Below ₹10,000 threshold)</span>
                    </div>`}
                    <div class="breakdown-item">
                        <span>Total Tax Liability:</span>
                        <span style="font-weight: 600;">₹${totalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ${isProfit ? `
                    <div class="breakdown-item">
                        <span>Effective Tax Rate:</span>
                        <span>${effectiveTaxRate.toFixed(2)}%</span>
                    </div>` : ''}
                </div>
                <div class="result-breakdown">
                    <h3>Net Proceeds</h3>
                    <div class="breakdown-item">
                        <span>Sale Proceeds:</span>
                        <span>₹${totalSalePrice.toLocaleString('en-IN')}</span>
                    </div>
                    ${tax > 0 ? `
                    <div class="breakdown-item">
                        <span>Less: Tax on Gain (30%):</span>
                        <span>₹${tax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>` : ''}
                    ${tds > 0 ? `
                    <div class="breakdown-item">
                        <span>Less: TDS (1%):</span>
                        <span>₹${tds.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>` : ''}
                    <div class="breakdown-item">
                        <span>Net Proceeds (After Tax):</span>
                        <span style="font-weight: 600;">₹${netProceeds.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Less: Purchase Cost:</span>
                        <span>₹${totalPurchasePrice.toLocaleString('en-IN')}</span>
                    </div>
                    ${totalFees > 0 ? `
                    <div class="breakdown-item">
                        <span>Less: Fees:</span>
                        <span>₹${totalFees.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    <div class="breakdown-item">
                        <span>Net Gain/Loss:</span>
                        <span style="font-weight: 600; color: ${netGain >= 0 ? '#10B981' : '#EF4444'};">₹${netGain.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                ${numTransactions > 1 ? `
                <div class="result-breakdown">
                    <h3>Per Transaction Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Purchase Price:</span>
                        <span>₹${purchasePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Sale Price:</span>
                        <span>₹${salePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Gain per Transaction:</span>
                        <span>₹${perTransactionGain.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax per Transaction:</span>
                        <span>₹${perTransactionTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>` : ''}
                <div class="result-breakdown">
                    <h3>India Crypto Tax Rules (2022 onwards)</h3>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                        <strong style="color: #F59E0B;">Section 115BBH - Tax on VDA (Virtual Digital Assets):</strong><br>
                        • <strong>30% flat tax</strong> on crypto gains (no deductions allowed)<br>
                        • No standard deductions or exemptions<br>
                        • Only acquisition cost can be deducted (not other expenses)<br>
                        • <strong>Losses cannot be set off</strong> against other income or crypto gains<br>
                        • Losses cannot be carried forward to subsequent years<br><br>

                        <strong style="color: #F59E0B;">Section 194S - TDS on Crypto:</strong><br>
                        • <strong>1% TDS</strong> on crypto transactions above ₹10,000<br>
                        • Applicable on transfer of VDA<br>
                        • Exchange/buyer must deduct and deposit TDS<br>
                        • Can be claimed as credit while filing ITR<br><br>

                        <strong style="color: #EF4444;">Important Notes:</strong><br>
                        • Gift of crypto is taxable in hands of recipient<br>
                        • Crypto received as salary is taxed as salary income<br>
                        • Mining/staking rewards taxed as business income<br>
                        • Must be reported in ITR (Schedule VDA)<br>
                        • No benefit from indexation or long-term capital gains
                    </p>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Planning Tips</h3>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
                        • Keep detailed records of all crypto transactions<br>
                        • Note down purchase date, price, sale date, and sale price<br>
                        • Save proof of TDS deducted (Form 26AS/AIS)<br>
                        • Report all crypto income in ITR even if below taxable limit<br>
                        • TDS can be claimed as advance tax while filing returns<br>
                        • Consider timing of sales to manage tax liability<br>
                        • Consult a tax professional for complex scenarios<br>
                        ${!isProfit ? '• Your loss cannot offset other gains - consider holding or dollar-cost averaging<br>' : ''}
                    </p>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('crypto-tax', {
                purchasePrice: totalPurchasePrice,
                salePrice: totalSalePrice,
                gain: grossGain,
                tax: totalTax
            }, {
                value: 'high-cpc',
                tax: totalTax
            });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for crypto-tax');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
