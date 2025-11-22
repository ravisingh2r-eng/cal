/**
 * Section 80d Calculator Calculator
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
                <label>Premium for Self & Family (₹)</label>
                <input type="number" class="calc-input" id="selfPremium" placeholder="Enter premium amount" value="25000">
            </div>
            <div class="calc-input-group">
                <label>Age Category (Self)</label>
                <select class="calc-input" id="selfAge">
                    <option value="below60">Below 60 years</option>
                    <option value="above60">60 years or above</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Premium for Parents (₹)</label>
                <input type="number" class="calc-input" id="parentsPremium" placeholder="Enter premium amount" value="0">
            </div>
            <div class="calc-input-group">
                <label>Age Category (Parents)</label>
                <select class="calc-input" id="parentsAge">
                    <option value="below60">Below 60 years</option>
                    <option value="above60">60 years or above</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Preventive Health Checkup (₹)</label>
                <input type="number" class="calc-input" id="checkup" placeholder="Enter checkup cost" value="0" max="5000">
            </div>
            <div class="calc-input-group">
                <label>Your Tax Slab</label>
                <select class="calc-input" id="taxSlab">
                    <option value="5">5%</option>
                    <option value="10">10%</option>
                    <option value="15">15%</option>
                    <option value="20">20%</option>
                    <option value="30" selected>30%</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const selfPremium = parseFloat(document.getElementById('selfPremium').value) || 0;
        const selfAge = document.getElementById('selfAge').value;
        const parentsPremium = parseFloat(document.getElementById('parentsPremium').value) || 0;
        const parentsAge = document.getElementById('parentsAge').value;
        const checkup = Math.min(parseFloat(document.getElementById('checkup').value) || 0, 5000);
        const taxSlab = parseFloat(document.getElementById('taxSlab').value);

        // Calculate deduction limits
        const selfLimit = selfAge === 'below60' ? 25000 : 50000;
        const parentsLimit = parentsAge === 'below60' ? 25000 : 50000;

        // Calculate eligible deductions
        const selfDeduction = Math.min(selfPremium, selfLimit);
        const parentsDeduction = Math.min(parentsPremium, parentsLimit);
        const checkupDeduction = checkup; // Max 5000 already enforced

        // Total deduction (checkup is within the overall limits)
        const totalDeduction = Math.min(selfDeduction + checkupDeduction, selfLimit) + parentsDeduction;
        const maxPossible = selfLimit + parentsLimit;
        const taxSavings = (totalDeduction * taxSlab) / 100;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Total Deduction under Section 80D</span>
                    <span class="result-value">₹${totalDeduction.toLocaleString('en-IN')}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Tax Savings (at ${taxSlab}% slab)</span>
                    <span class="result-value">₹${taxSavings.toLocaleString('en-IN')}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Self & Family Deduction:</span>
                        <span>₹${Math.min(selfDeduction + checkupDeduction, selfLimit).toLocaleString('en-IN')} (Max: ₹${selfLimit.toLocaleString('en-IN')})</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Parents Deduction:</span>
                        <span>₹${parentsDeduction.toLocaleString('en-IN')} (Max: ₹${parentsLimit.toLocaleString('en-IN')})</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Preventive Checkup:</span>
                        <span>₹${checkupDeduction.toLocaleString('en-IN')} (Max: ₹5,000)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Maximum Possible Deduction:</span>
                        <span>₹${maxPossible.toLocaleString('en-IN')}</span>
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
            trackCalculation('section-80d', {
                selfPremium,
                parentsPremium,
                totalDeduction
            }, {
                value: 'high-cpc',
                taxSavings
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for section-80d');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
