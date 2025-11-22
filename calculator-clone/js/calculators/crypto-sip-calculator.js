/**
 * Crypto SIP Calculator
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
                <label>Monthly Investment (₹)</label>
                <input type="number" class="calc-input" id="monthly" placeholder="Enter monthly SIP" value="5000">
            </div>
            <div class="calc-input-group">
                <label>Cryptocurrency</label>
                <select class="calc-input" id="crypto">
                    <option value="btc">Bitcoin (BTC)</option>
                    <option value="eth">Ethereum (ETH)</option>
                    <option value="bnb">Binance Coin (BNB)</option>
                    <option value="ada">Cardano (ADA)</option>
                    <option value="sol">Solana (SOL)</option>
                    <option value="xrp">Ripple (XRP)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Investment Period (months)</label>
                <input type="number" class="calc-input" id="months" placeholder="Enter months" value="12">
            </div>
            <div class="calc-input-group">
                <label>Expected Monthly Return (%)</label>
                <input type="number" class="calc-input" id="monthlyReturn" placeholder="Enter expected return" value="5" step="0.1">
                <small style="color: #666; font-size: 12px;">Note: Crypto returns are highly volatile</small>
            </div>
            <div class="calc-input-group">
                <label>Current Price (₹)</label>
                <input type="number" class="calc-input" id="currentPrice" placeholder="Current crypto price" value="50000">
            </div>
        `;
    }

    function calculate() {
        const monthly = parseFloat(document.getElementById('monthly').value) || 0;
        const months = parseFloat(document.getElementById('months').value) || 12;
        const monthlyReturn = parseFloat(document.getElementById('monthlyReturn').value) || 5;
        const currentPrice = parseFloat(document.getElementById('currentPrice').value) || 50000;
        const crypto = document.getElementById('crypto').value;

        // Validation
        if (monthly <= 0 || months <= 0 || currentPrice <= 0) {
            alert('Please enter valid positive values');
            return;
        }

        // Calculate total investment
        const totalInvestment = monthly * months;

        // Calculate units accumulated with DCA (Dollar Cost Averaging)
        let totalUnits = 0;
        let monthlyPrices = [];
        let currentPriceVal = currentPrice;

        for (let i = 0; i < months; i++) {
            // Simulate price fluctuation (random walk)
            const priceChange = (Math.random() - 0.5) * 2 * (monthlyReturn / 100);
            currentPriceVal = currentPriceVal * (1 + priceChange);
            monthlyPrices.push(currentPriceVal);
            totalUnits += monthly / currentPriceVal;
        }

        // Average cost per unit
        const averageCost = totalInvestment / totalUnits;

        // Final price (last month's price)
        const finalPrice = monthlyPrices[monthlyPrices.length - 1];

        // Current value
        const currentValue = totalUnits * finalPrice;

        // Returns
        const absoluteReturns = currentValue - totalInvestment;
        const returnPercentage = (absoluteReturns / totalInvestment) * 100;

        // Annualized return
        const years = months / 12;
        const annualizedReturn = years > 0 ? (Math.pow(currentValue / totalInvestment, 1 / years) - 1) * 100 : 0;

        const cryptoNames = {
            'btc': 'Bitcoin',
            'eth': 'Ethereum',
            'bnb': 'Binance Coin',
            'ada': 'Cardano',
            'sol': 'Solana',
            'xrp': 'Ripple'
        };

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Current Portfolio Value</span>
                    <span class="result-value">₹${currentValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Investment</span>
                    <span class="result-value">₹${totalInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Returns</span>
                    <span class="result-value" style="color: ${absoluteReturns >= 0 ? '#10B981' : '#EF4444'};">
                        ₹${absoluteReturns.toLocaleString('en-IN', {maximumFractionDigits: 0})} (${returnPercentage.toFixed(2)}%)
                    </span>
                </div>
                <div class="result-breakdown">
                    <h3>Investment Details</h3>
                    <div class="breakdown-item">
                        <span>Cryptocurrency:</span>
                        <span>${cryptoNames[crypto]}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly SIP:</span>
                        <span>₹${monthly.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Investment Period:</span>
                        <span>${months} months</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Units Accumulated:</span>
                        <span>${totalUnits.toFixed(8)}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Cost Analysis</h3>
                    <div class="breakdown-item">
                        <span>Starting Price:</span>
                        <span>₹${currentPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Average Purchase Price:</span>
                        <span>₹${averageCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Current Price:</span>
                        <span>₹${finalPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Price Change:</span>
                        <span style="color: ${finalPrice >= currentPrice ? '#10B981' : '#EF4444'};">
                            ${((finalPrice - currentPrice) / currentPrice * 100).toFixed(2)}%
                        </span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Returns Analysis</h3>
                    <div class="breakdown-item">
                        <span>Absolute Returns:</span>
                        <span style="color: ${absoluteReturns >= 0 ? '#10B981' : '#EF4444'};">
                            ₹${absoluteReturns.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Return Percentage:</span>
                        <span style="color: ${returnPercentage >= 0 ? '#10B981' : '#EF4444'};">
                            ${returnPercentage.toFixed(2)}%
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annualized Return:</span>
                        <span>${annualizedReturn.toFixed(2)}% p.a.</span>
                    </div>
                </div>
                <div class="result-breakdown" style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin-top: 15px;">
                    <h3 style="color: #92400E; margin-top: 0;">⚠️ Risk Disclaimer</h3>
                    <p style="color: #92400E; margin: 8px 0; font-size: 14px;">
                        <strong>High Volatility:</strong> Cryptocurrency prices are extremely volatile and can fluctuate significantly.
                    </p>
                    <p style="color: #92400E; margin: 8px 0; font-size: 14px;">
                        <strong>No Guarantees:</strong> Past performance does not guarantee future returns. You may lose your entire investment.
                    </p>
                    <p style="color: #92400E; margin: 8px 0; font-size: 14px;">
                        <strong>Regulatory Risk:</strong> Cryptocurrency regulations in India are evolving. Tax implications apply (30% tax + 1% TDS on gains).
                    </p>
                    <p style="color: #92400E; margin: 8px 0; font-size: 14px;">
                        <strong>Recommendation:</strong> Only invest what you can afford to lose. Consider consulting a financial advisor.
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
            trackCalculation('crypto-sip', { monthly, months, currentValue }, { value: 'high-cpc' });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for crypto-sip');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
