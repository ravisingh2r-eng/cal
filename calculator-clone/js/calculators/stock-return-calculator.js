/**
 * Stock Return Calculator Calculator
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
                <label>Initial Investment (₹)</label>
                <input type="number" class="calc-input" id="investment" placeholder="Enter investment amount" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Purchase Price per Share (₹)</label>
                <input type="number" class="calc-input" id="buyPrice" placeholder="Enter buying price" value="100">
            </div>
            <div class="calc-input-group">
                <label>Current/Selling Price per Share (₹)</label>
                <input type="number" class="calc-input" id="sellPrice" placeholder="Enter current/selling price" value="150">
            </div>
            <div class="calc-input-group">
                <label>Number of Shares</label>
                <input type="number" class="calc-input" id="shares" placeholder="Enter number of shares" value="1000">
            </div>
            <div class="calc-input-group">
                <label>Dividends Received (₹)</label>
                <input type="number" class="calc-input" id="dividends" placeholder="Enter total dividends" value="0">
            </div>
            <div class="calc-input-group">
                <label>Holding Period (years)</label>
                <input type="number" class="calc-input" id="period" placeholder="Enter holding period" value="1" step="0.1">
            </div>
        `;
    }

    function calculate() {
        const investment = parseFloat(document.getElementById('investment').value) || 0;
        const buyPrice = parseFloat(document.getElementById('buyPrice').value) || 0;
        const sellPrice = parseFloat(document.getElementById('sellPrice').value) || 0;
        const shares = parseFloat(document.getElementById('shares').value) || 0;
        const dividends = parseFloat(document.getElementById('dividends').value) || 0;
        const period = parseFloat(document.getElementById('period').value) || 1;

        // Calculate returns
        const totalInvestment = buyPrice * shares;
        const currentValue = sellPrice * shares;
        const capitalGain = currentValue - totalInvestment;
        const totalReturn = capitalGain + dividends;
        const returnPercent = (totalReturn / totalInvestment) * 100;
        const cagr = (Math.pow(currentValue / totalInvestment, 1 / period) - 1) * 100;
        const absoluteReturn = totalReturn;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Total Return</span>
                    <span class="result-value ${totalReturn >= 0 ? 'profit' : 'loss'}">₹${totalReturn.toLocaleString('en-IN')}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Return Percentage</span>
                    <span class="result-value ${returnPercent >= 0 ? 'profit' : 'loss'}">${returnPercent.toFixed(2)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">CAGR (Annualized)</span>
                    <span class="result-value">${cagr.toFixed(2)}%</span>
                </div>
                <div class="result-breakdown">
                    <h3>Investment Details</h3>
                    <div class="breakdown-item">
                        <span>Total Investment:</span>
                        <span>₹${totalInvestment.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Current Value:</span>
                        <span>₹${currentValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Capital Gain/Loss:</span>
                        <span class="${capitalGain >= 0 ? 'profit' : 'loss'}">₹${capitalGain.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Dividends Received:</span>
                        <span>₹${dividends.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Number of Shares:</span>
                        <span>${shares.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Gain per Share:</span>
                        <span>₹${(sellPrice - buyPrice).toFixed(2)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Holding Period:</span>
                        <span>${period} year(s)</span>
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
            trackCalculation('stock-return', {
                investment: totalInvestment,
                returns: totalReturn,
                returnPercent
            }, {
                value: 'high-cpc',
                cagr
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for stock-return');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
