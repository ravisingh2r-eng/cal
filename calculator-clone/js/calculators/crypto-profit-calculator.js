/**
 * Crypto Profit Calculator Calculator
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
                <label>Cryptocurrency</label>
                <select class="calc-input" id="crypto">
                    <option value="btc" selected>Bitcoin (BTC)</option>
                    <option value="eth">Ethereum (ETH)</option>
                    <option value="bnb">Binance Coin (BNB)</option>
                    <option value="xrp">Ripple (XRP)</option>
                    <option value="ada">Cardano (ADA)</option>
                    <option value="doge">Dogecoin (DOGE)</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Investment Amount (₹)</label>
                <input type="number" class="calc-input" id="investment" placeholder="Enter investment" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Buy Price (₹)</label>
                <input type="number" class="calc-input" id="buyPrice" placeholder="Enter buy price" value="3000000" step="0.01">
            </div>
            <div class="calc-input-group">
                <label>Sell Price (₹)</label>
                <input type="number" class="calc-input" id="sellPrice" placeholder="Enter sell price" value="3500000" step="0.01">
            </div>
            <div class="calc-input-group">
                <label>Holding Period (months)</label>
                <input type="number" class="calc-input" id="holdingPeriod" placeholder="Enter months" value="12">
            </div>
            <div class="calc-input-group">
                <label>Trading Fee (%)</label>
                <input type="number" class="calc-input" id="tradingFee" placeholder="Enter fee %" value="0.5" step="0.1">
            </div>
        `;
    }

    function calculate() {
        const crypto = document.getElementById('crypto').value;
        const investment = parseFloat(document.getElementById('investment').value) || 0;
        const buyPrice = parseFloat(document.getElementById('buyPrice').value) || 0;
        const sellPrice = parseFloat(document.getElementById('sellPrice').value) || 0;
        const holdingPeriod = parseFloat(document.getElementById('holdingPeriod').value) || 1;
        const tradingFeePercent = parseFloat(document.getElementById('tradingFee').value) || 0.5;

        if (buyPrice <= 0 || sellPrice <= 0 || investment <= 0) {
            alert('Please enter valid values');
            return;
        }

        // Calculate quantity
        const quantity = investment / buyPrice;

        // Buy transaction fee
        const buyFee = (investment * tradingFeePercent) / 100;
        const totalInvestment = investment + buyFee;

        // Sell value and fee
        const sellValue = quantity * sellPrice;
        const sellFee = (sellValue * tradingFeePercent) / 100;
        const netSellValue = sellValue - sellFee;

        // Profit/Loss calculation
        const profitLoss = netSellValue - totalInvestment;
        const profitLossPercent = (profitLoss / totalInvestment) * 100;

        // India crypto tax (30% on gains + 1% TDS)
        const tdsAmount = sellValue * 0.01; // 1% TDS on sell value
        let capitalGainsTax = 0;
        if (profitLoss > 0) {
            capitalGainsTax = profitLoss * 0.30; // 30% tax on gains
        }
        const totalTax = capitalGainsTax + tdsAmount;
        const netProfitAfterTax = profitLoss - capitalGainsTax;

        // ROI and CAGR
        const roi = profitLossPercent;
        const years = holdingPeriod / 12;
        const cagr = years > 0 ? (Math.pow(netSellValue / totalInvestment, 1 / years) - 1) * 100 : 0;

        // Breakeven price
        const breakEvenPrice = (totalInvestment + (totalInvestment * tradingFeePercent / 100)) / quantity;

        const cryptoNames = {
            btc: 'Bitcoin (BTC)',
            eth: 'Ethereum (ETH)',
            bnb: 'Binance Coin (BNB)',
            xrp: 'Ripple (XRP)',
            ada: 'Cardano (ADA)',
            doge: 'Dogecoin (DOGE)',
            other: 'Cryptocurrency'
        };

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">${profitLoss >= 0 ? 'Total Profit' : 'Total Loss'}</span>
                    <span class="result-value" style="color: ${profitLoss >= 0 ? '#10B981' : '#EF4444'};">₹${Math.abs(profitLoss).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">ROI (Return on Investment)</span>
                    <span class="result-value" style="color: ${profitLoss >= 0 ? '#10B981' : '#EF4444'};">${profitLossPercent >= 0 ? '+' : ''}${profitLossPercent.toFixed(2)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Net Profit After Tax</span>
                    <span class="result-value" style="color: ${netProfitAfterTax >= 0 ? '#10B981' : '#EF4444'};">₹${netProfitAfterTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Investment Details</h3>
                    <div class="breakdown-item">
                        <span>Cryptocurrency:</span>
                        <span>${cryptoNames[crypto]}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Initial Investment:</span>
                        <span>₹${investment.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Buy Price:</span>
                        <span>₹${buyPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Quantity Purchased:</span>
                        <span>${quantity.toFixed(8)} ${crypto.toUpperCase()}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Buy Transaction Fee:</span>
                        <span>₹${buyFee.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Investment:</span>
                        <span>₹${totalInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Exit Details</h3>
                    <div class="breakdown-item">
                        <span>Sell Price:</span>
                        <span>₹${sellPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Gross Sell Value:</span>
                        <span>₹${sellValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Sell Transaction Fee:</span>
                        <span>₹${sellFee.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Sell Value:</span>
                        <span>₹${netSellValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Price Change:</span>
                        <span style="color: ${sellPrice >= buyPrice ? '#10B981' : '#EF4444'};">${((sellPrice - buyPrice) / buyPrice * 100).toFixed(2)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Profit/Loss Analysis</h3>
                    <div class="breakdown-item">
                        <span>Gross ${profitLoss >= 0 ? 'Profit' : 'Loss'}:</span>
                        <span style="color: ${profitLoss >= 0 ? '#10B981' : '#EF4444'};">₹${Math.abs(profitLoss).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>ROI:</span>
                        <span>${profitLossPercent.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Holding Period:</span>
                        <span>${holdingPeriod} months (${years.toFixed(1)} years)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>CAGR:</span>
                        <span>${cagr.toFixed(2)}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Breakeven Price:</span>
                        <span>₹${breakEvenPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Implications (India)</h3>
                    <div class="breakdown-item">
                        <span>TDS on Crypto (1%):</span>
                        <span>₹${tdsAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ${profitLoss > 0 ? `
                    <div class="breakdown-item">
                        <span>Capital Gains Tax (30%):</span>
                        <span>₹${capitalGainsTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Tax:</span>
                        <span style="color: #EF4444;">₹${totalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Profit After Tax:</span>
                        <span style="font-weight: 600; color: #10B981;">₹${netProfitAfterTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ` : `
                    <div class="breakdown-item">
                        <span>Tax on Loss:</span>
                        <span>₹0 (No tax on losses, but losses cannot be offset)</span>
                    </div>
                    `}
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *India taxes crypto at 30% flat rate on gains. Losses cannot be offset against other income.
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
            trackCalculation('crypto-profit', {
                crypto,
                investment,
                profitLoss,
                roi: profitLossPercent
            }, {
                value: 'high-cpc',
                netProfit: netProfitAfterTax
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for crypto-profit');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
