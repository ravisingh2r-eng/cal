/**
 * Mutual Fund Calculator
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
                <input type="number" class="calc-input" id="initial" placeholder="Enter amount" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Expected Return Rate (% p.a.)</label>
                <input type="number" class="calc-input" id="returnRate" placeholder="Enter rate" value="12" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Investment Period (years)</label>
                <input type="number" class="calc-input" id="years" placeholder="Enter years" value="10">
            </div>
            <div class="calc-input-group">
                <label>Fund Type</label>
                <select class="calc-input" id="fundType">
                    <option value="equity" selected>Equity Fund</option>
                    <option value="debt">Debt Fund</option>
                    <option value="hybrid">Hybrid Fund</option>
                    <option value="index">Index Fund</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Exit Load (%)</label>
                <input type="number" class="calc-input" id="exitLoad" placeholder="Enter exit load" value="1" step="0.1">
            </div>
        `;
    }

    function calculate() {
        const initial = parseFloat(document.getElementById('initial').value) || 0;
        const returnRate = parseFloat(document.getElementById('returnRate').value) || 12;
        const years = parseFloat(document.getElementById('years').value) || 10;
        const fundType = document.getElementById('fundType').value;
        const exitLoad = parseFloat(document.getElementById('exitLoad').value) || 1;

        // Future value calculation
        const futureValue = initial * Math.pow(1 + returnRate/100, years);
        const totalGains = futureValue - initial;
        const absoluteReturn = (totalGains / initial) * 100;

        // Exit load calculation
        const exitLoadAmount = futureValue * (exitLoad / 100);
        const netFutureValue = futureValue - exitLoadAmount;
        const netGains = netFutureValue - initial;

        // Tax calculation (equity: LTCG 10% above 1L, debt: as per slab)
        let taxAmount = 0;
        if (fundType === 'equity' && years >= 1) {
            const taxableGains = Math.max(netGains - 100000, 0);
            taxAmount = taxableGains * 0.10; // 10% LTCG
        } else if (fundType === 'debt' && years >= 3) {
            taxAmount = netGains * 0.20; // 20% with indexation benefit
        } else {
            taxAmount = netGains * 0.30; // STCG at slab rate (assumed 30%)
        }

        const netValueAfterTax = netFutureValue - taxAmount;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Final Value</span>
                    <span class="result-value">₹${futureValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Gains</span>
                    <span class="result-value" style="color: #10B981;">₹${totalGains.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Net Value After Tax</span>
                    <span class="result-value">₹${netValueAfterTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Investment Summary</h3>
                    <div class="breakdown-item">
                        <span>Initial Investment:</span>
                        <span>₹${initial.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Expected Return:</span>
                        <span>${returnRate}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Investment Period:</span>
                        <span>${years} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Fund Type:</span>
                        <span>${fundType.charAt(0).toUpperCase() + fundType.slice(1)} Fund</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Returns Analysis</h3>
                    <div class="breakdown-item">
                        <span>Future Value:</span>
                        <span>₹${futureValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Gains:</span>
                        <span>₹${totalGains.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Absolute Return:</span>
                        <span>${absoluteReturn.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Exit Load (${exitLoad}%):</span>
                        <span>₹${exitLoadAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Implications</h3>
                    <div class="breakdown-item">
                        <span>Tax Amount:</span>
                        <span>₹${taxAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Value After Tax:</span>
                        <span style="font-weight: 600;">₹${netValueAfterTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('mutual-fund', { initial, futureValue, years, fundType }, { value: 'high-cpc', totalGains });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for mutual-fund');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
