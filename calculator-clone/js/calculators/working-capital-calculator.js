/**
 * Working Capital Calculator Calculator
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
            <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Current Assets</h3>
            <div class="calc-input-group">
                <label>Cash & Cash Equivalents (₹)</label>
                <input type="number" class="calc-input" id="cash" placeholder="Enter cash amount" value="500000">
            </div>
            <div class="calc-input-group">
                <label>Accounts Receivable (₹)</label>
                <input type="number" class="calc-input" id="receivables" placeholder="Enter receivables" value="300000">
            </div>
            <div class="calc-input-group">
                <label>Inventory (₹)</label>
                <input type="number" class="calc-input" id="inventory" placeholder="Enter inventory value" value="200000">
            </div>
            <div class="calc-input-group">
                <label>Other Current Assets (₹)</label>
                <input type="number" class="calc-input" id="otherAssets" placeholder="Enter other assets" value="50000">
            </div>
            <h3 style="margin: 1.5rem 0 1rem; color: var(--text-primary);">Current Liabilities</h3>
            <div class="calc-input-group">
                <label>Accounts Payable (₹)</label>
                <input type="number" class="calc-input" id="payables" placeholder="Enter payables" value="200000">
            </div>
            <div class="calc-input-group">
                <label>Short-term Debt (₹)</label>
                <input type="number" class="calc-input" id="debt" placeholder="Enter short-term debt" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Other Current Liabilities (₹)</label>
                <input type="number" class="calc-input" id="otherLiabilities" placeholder="Enter other liabilities" value="50000">
            </div>
        `;
    }

    function calculate() {
        const cash = parseFloat(document.getElementById('cash').value) || 0;
        const receivables = parseFloat(document.getElementById('receivables').value) || 0;
        const inventory = parseFloat(document.getElementById('inventory').value) || 0;
        const otherAssets = parseFloat(document.getElementById('otherAssets').value) || 0;
        const payables = parseFloat(document.getElementById('payables').value) || 0;
        const debt = parseFloat(document.getElementById('debt').value) || 0;
        const otherLiabilities = parseFloat(document.getElementById('otherLiabilities').value) || 0;

        // Calculate totals
        const totalCurrentAssets = cash + receivables + inventory + otherAssets;
        const totalCurrentLiabilities = payables + debt + otherLiabilities;
        const workingCapital = totalCurrentAssets - totalCurrentLiabilities;
        const currentRatio = totalCurrentLiabilities > 0 ? totalCurrentAssets / totalCurrentLiabilities : 0;
        const quickRatio = totalCurrentLiabilities > 0 ? (totalCurrentAssets - inventory) / totalCurrentLiabilities : 0;

        // Health assessment
        let healthStatus = '';
        let healthColor = '';
        if (workingCapital > 0 && currentRatio >= 1.5) {
            healthStatus = 'Healthy';
            healthColor = 'profit';
        } else if (workingCapital > 0 && currentRatio >= 1) {
            healthStatus = 'Adequate';
            healthColor = 'warning';
        } else {
            healthStatus = 'Needs Attention';
            healthColor = 'loss';
        }

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Working Capital</span>
                    <span class="result-value ${workingCapital >= 0 ? 'profit' : 'loss'}">₹${workingCapital.toLocaleString('en-IN')}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Financial Health</span>
                    <span class="result-value ${healthColor}">${healthStatus}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Financial Ratios</h3>
                    <div class="breakdown-item">
                        <span>Current Ratio:</span>
                        <span>${currentRatio.toFixed(2)} ${currentRatio >= 1.5 ? '✓' : currentRatio >= 1 ? '⚠' : '✗'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Quick Ratio:</span>
                        <span>${quickRatio.toFixed(2)} ${quickRatio >= 1 ? '✓' : '⚠'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Current Assets Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Cash & Equivalents:</span>
                        <span>₹${cash.toLocaleString('en-IN')} (${((cash/totalCurrentAssets)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Accounts Receivable:</span>
                        <span>₹${receivables.toLocaleString('en-IN')} (${((receivables/totalCurrentAssets)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Inventory:</span>
                        <span>₹${inventory.toLocaleString('en-IN')} (${((inventory/totalCurrentAssets)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Other Assets:</span>
                        <span>₹${otherAssets.toLocaleString('en-IN')} (${((otherAssets/totalCurrentAssets)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Total Current Assets:</strong></span>
                        <span><strong>₹${totalCurrentAssets.toLocaleString('en-IN')}</strong></span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Current Liabilities Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Accounts Payable:</span>
                        <span>₹${payables.toLocaleString('en-IN')} (${((payables/totalCurrentLiabilities)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Short-term Debt:</span>
                        <span>₹${debt.toLocaleString('en-IN')} (${((debt/totalCurrentLiabilities)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Other Liabilities:</span>
                        <span>₹${otherLiabilities.toLocaleString('en-IN')} (${((otherLiabilities/totalCurrentLiabilities)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Total Current Liabilities:</strong></span>
                        <span><strong>₹${totalCurrentLiabilities.toLocaleString('en-IN')}</strong></span>
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
            trackCalculation('working-capital', {
                workingCapital,
                currentRatio,
                quickRatio
            }, {
                value: 'high-cpc',
                health: healthStatus
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for working-capital');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
