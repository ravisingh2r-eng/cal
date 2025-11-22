/**
 * Cagr Calculator Calculator
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
                <input type="number" class="calc-input" id="initial" placeholder="Enter initial amount" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Final Value (₹)</label>
                <input type="number" class="calc-input" id="final" placeholder="Enter final value" value="250000">
            </div>
            <div class="calc-input-group">
                <label>Investment Period (years)</label>
                <input type="number" class="calc-input" id="years" placeholder="Enter years" value="5" step="0.5">
            </div>
            <div class="calc-input-group">
                <label>Additional Monthly Investment (SIP)</label>
                <input type="number" class="calc-input" id="sip" placeholder="Enter monthly SIP (optional)" value="0">
            </div>
        `;
    }

    function calculate() {
        const initial = parseFloat(document.getElementById('initial').value) || 0;
        const final = parseFloat(document.getElementById('final').value) || 0;
        const years = parseFloat(document.getElementById('years').value) || 1;
        const sip = parseFloat(document.getElementById('sip').value) || 0;

        if (initial <= 0 || final <= 0 || years <= 0) {
            alert('Please enter valid positive values');
            return;
        }

        // CAGR calculation: CAGR = (FV/PV)^(1/n) - 1
        const cagr = (Math.pow(final / initial, 1 / years) - 1) * 100;

        // Absolute returns
        const absoluteGain = final - initial;
        const absoluteReturn = (absoluteGain / initial) * 100;

        // If SIP is involved, adjust calculations
        let totalInvested = initial;
        let sipContribution = 0;
        if (sip > 0) {
            sipContribution = sip * 12 * years;
            totalInvested = initial + sipContribution;
        }

        const netGain = final - totalInvested;
        const netReturnPercent = (netGain / totalInvested) * 100;

        // Future value projections at this CAGR
        const fv3Years = initial * Math.pow(1 + cagr/100, 3);
        const fv5Years = initial * Math.pow(1 + cagr/100, 5);
        const fv10Years = initial * Math.pow(1 + cagr/100, 10);

        // Comparison with standard returns
        const compareReturns = (rate, label) => {
            const value = initial * Math.pow(1 + rate/100, years);
            const diff = final - value;
            return { label, value, diff };
        };

        const fdComparison = compareReturns(7, 'FD (7% p.a.)');
        const ppfComparison = compareReturns(7.1, 'PPF (7.1% p.a.)');
        const niftyComparison = compareReturns(12, 'Nifty 50 (~12% p.a.)');

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">CAGR (Compound Annual Growth Rate)</span>
                    <span class="result-value" style="color: ${cagr >= 0 ? '#10B981' : '#EF4444'};">${cagr.toFixed(2)}% p.a.</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Absolute Returns</span>
                    <span class="result-value">${absoluteReturn.toFixed(2)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Gain/Loss</span>
                    <span class="result-value" style="color: ${absoluteGain >= 0 ? '#10B981' : '#EF4444'};">₹${absoluteGain.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                ${sip > 0 ? `
                <div class="result-item">
                    <span class="result-label">Net Return (incl. SIP)</span>
                    <span class="result-value">${netReturnPercent.toFixed(2)}%</span>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>Investment Summary</h3>
                    <div class="breakdown-item">
                        <span>Initial Investment:</span>
                        <span>₹${initial.toLocaleString('en-IN')}</span>
                    </div>
                    ${sip > 0 ? `
                    <div class="breakdown-item">
                        <span>SIP Contribution (${sip.toLocaleString('en-IN')}/month):</span>
                        <span>₹${sipContribution.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Invested:</span>
                        <span>₹${totalInvested.toLocaleString('en-IN')}</span>
                    </div>
                    ` : ''}
                    <div class="breakdown-item">
                        <span>Final Value:</span>
                        <span>₹${final.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Investment Period:</span>
                        <span>${years} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Gain:</span>
                        <span style="color: ${absoluteGain >= 0 ? '#10B981' : '#EF4444'};">₹${absoluteGain.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Returns Analysis</h3>
                    <div class="breakdown-item">
                        <span>CAGR:</span>
                        <span>${cagr.toFixed(2)}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Absolute Return:</span>
                        <span>${absoluteReturn.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Simple Annual Return:</span>
                        <span>${(absoluteReturn / years).toFixed(2)}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Doubling Time (Rule of 72):</span>
                        <span>${cagr > 0 ? (72 / cagr).toFixed(1) : 'N/A'} years</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Future Value Projections (at ${cagr.toFixed(2)}% CAGR)</h3>
                    <div class="breakdown-item">
                        <span>After 3 years:</span>
                        <span>₹${fv3Years.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>After 5 years:</span>
                        <span>₹${fv5Years.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>After 10 years:</span>
                        <span>₹${fv10Years.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Performance Comparison (${years} years)</h3>
                    <div class="breakdown-item">
                        <span>Your Investment:</span>
                        <span>₹${final.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>${fdComparison.label}:</span>
                        <span>₹${fdComparison.value.toLocaleString('en-IN', {maximumFractionDigits: 0})} ${fdComparison.diff > 0 ? '(+' + fdComparison.diff.toLocaleString('en-IN', {maximumFractionDigits: 0}) + ')' : '(' + fdComparison.diff.toLocaleString('en-IN', {maximumFractionDigits: 0}) + ')'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>${ppfComparison.label}:</span>
                        <span>₹${ppfComparison.value.toLocaleString('en-IN', {maximumFractionDigits: 0})} ${ppfComparison.diff > 0 ? '(+' + ppfComparison.diff.toLocaleString('en-IN', {maximumFractionDigits: 0}) + ')' : '(' + ppfComparison.diff.toLocaleString('en-IN', {maximumFractionDigits: 0}) + ')'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>${niftyComparison.label}:</span>
                        <span>₹${niftyComparison.value.toLocaleString('en-IN', {maximumFractionDigits: 0})} ${niftyComparison.diff > 0 ? '(+' + niftyComparison.diff.toLocaleString('en-IN', {maximumFractionDigits: 0}) + ')' : '(' + niftyComparison.diff.toLocaleString('en-IN', {maximumFractionDigits: 0}) + ')'}</span>
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
            trackCalculation('cagr', {
                initial,
                final,
                years,
                cagr
            }, {
                value: 'high-cpc',
                absoluteGain
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for cagr');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
