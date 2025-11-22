/**
 * Health Insurance Calculator Calculator
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
                <label>Your Age</label>
                <input type="number" class="calc-input" id="age" placeholder="Enter your age" value="30" min="18" max="80">
            </div>
            <div class="calc-input-group">
                <label>Number of Members to Cover</label>
                <select class="calc-input" id="members">
                    <option value="1">Individual</option>
                    <option value="2" selected>Self + Spouse</option>
                    <option value="3">Self + Spouse + 1 Child</option>
                    <option value="4">Self + Spouse + 2 Children</option>
                    <option value="5">Floater (Self + Spouse + Parents)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Desired Sum Insured (₹)</label>
                <select class="calc-input" id="sumInsured">
                    <option value="300000">₹3 Lakh</option>
                    <option value="500000" selected>₹5 Lakh</option>
                    <option value="1000000">₹10 Lakh</option>
                    <option value="1500000">₹15 Lakh</option>
                    <option value="2000000">₹20 Lakh</option>
                    <option value="2500000">₹25 Lakh</option>
                    <option value="5000000">₹50 Lakh</option>
                    <option value="10000000">₹1 Crore</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>City Tier</label>
                <select class="calc-input" id="city">
                    <option value="metro">Metro (Mumbai, Delhi, Bangalore, etc.)</option>
                    <option value="tier1" selected>Tier 1 (Pune, Ahmedabad, etc.)</option>
                    <option value="tier2">Tier 2/3 Cities</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Pre-existing Conditions</label>
                <select class="calc-input" id="preExisting">
                    <option value="no" selected>No</option>
                    <option value="yes">Yes</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Deductible/Co-payment</label>
                <select class="calc-input" id="deductible">
                    <option value="0" selected>No Deductible</option>
                    <option value="10">10% Co-payment</option>
                    <option value="20">20% Co-payment</option>
                    <option value="50000">₹50,000 Deductible</option>
                    <option value="100000">₹1,00,000 Deductible</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Add-on Covers</label>
                <div style="margin-top: 0.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">
                        <input type="checkbox" id="maternity" style="margin-right: 0.5rem;">
                        Maternity Cover
                    </label>
                    <label style="display: block; margin-bottom: 0.5rem;">
                        <input type="checkbox" id="criticalIllness" style="margin-right: 0.5rem;">
                        Critical Illness
                    </label>
                    <label style="display: block;">
                        <input type="checkbox" id="roomRent" style="margin-right: 0.5rem;">
                        No Room Rent Limit
                    </label>
                </div>
            </div>
        `;
    }

    function calculate() {
        const age = parseFloat(document.getElementById('age').value) || 30;
        const members = parseFloat(document.getElementById('members').value) || 2;
        const sumInsured = parseFloat(document.getElementById('sumInsured').value) || 500000;
        const city = document.getElementById('city').value;
        const preExisting = document.getElementById('preExisting').value;
        const deductible = parseFloat(document.getElementById('deductible').value) || 0;
        const maternity = document.getElementById('maternity').checked;
        const criticalIllness = document.getElementById('criticalIllness').checked;
        const roomRent = document.getElementById('roomRent').checked;

        // Base premium calculation (simplified model)
        let basePremium = sumInsured * 0.025; // 2.5% of sum insured as base

        // Age factor
        const ageFactor = age < 25 ? 0.7 : age < 35 ? 0.9 : age < 45 ? 1.2 : age < 55 ? 1.8 : 2.5;
        basePremium *= ageFactor;

        // Members factor
        const membersFactor = members === 1 ? 1 : members === 2 ? 1.6 : members === 3 ? 2.0 : members === 4 ? 2.3 : 2.8;
        basePremium *= membersFactor;

        // City factor
        const cityFactor = city === 'metro' ? 1.2 : city === 'tier1' ? 1.0 : 0.85;
        basePremium *= cityFactor;

        // Pre-existing condition loading
        if (preExisting === 'yes') {
            basePremium *= 1.5;
        }

        // Deductible/Co-payment discount
        let deductibleDiscount = 0;
        if (deductible === 10) deductibleDiscount = 0.15; // 15% discount
        else if (deductible === 20) deductibleDiscount = 0.25; // 25% discount
        else if (deductible === 50000) deductibleDiscount = 0.1;
        else if (deductible === 100000) deductibleDiscount = 0.2;
        basePremium *= (1 - deductibleDiscount);

        // Add-on covers
        let addOnCost = 0;
        if (maternity) addOnCost += basePremium * 0.25;
        if (criticalIllness) addOnCost += basePremium * 0.3;
        if (roomRent) addOnCost += basePremium * 0.15;

        const totalPremium = basePremium + addOnCost;
        const monthlyPremium = totalPremium / 12;

        // Tax benefit under Section 80D
        const maxTaxBenefit = age < 60 ? 25000 : 50000;
        const taxBenefit = Math.min(totalPremium, maxTaxBenefit);
        const taxSavings30 = taxBenefit * 0.3; // at 30% tax slab

        // Coverage adequacy
        const recommendedCoverage = members * 500000 + (age > 45 ? 500000 : 0);
        const adequacy = sumInsured >= recommendedCoverage ? 'Adequate' : 'Consider Increasing';

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Estimated Annual Premium</span>
                    <span class="result-value">₹${totalPremium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Monthly Premium (EMI)</span>
                    <span class="result-value">₹${monthlyPremium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Tax Savings (30% slab)</span>
                    <span class="result-value" style="color: #10B981;">₹${taxSavings30.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Policy Details</h3>
                    <div class="breakdown-item">
                        <span>Sum Insured:</span>
                        <span>₹${sumInsured.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Members Covered:</span>
                        <span>${members} ${members === 1 ? 'person' : 'people'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Coverage Adequacy:</span>
                        <span style="color: ${adequacy === 'Adequate' ? '#10B981' : '#EF4444'};">${adequacy}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Recommended Coverage:</span>
                        <span>₹${recommendedCoverage.toLocaleString('en-IN')}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Premium Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Base Premium:</span>
                        <span>₹${basePremium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ${addOnCost > 0 ? `
                    <div class="breakdown-item">
                        <span>Add-on Covers:</span>
                        <span>₹${addOnCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ` : ''}
                    ${deductibleDiscount > 0 ? `
                    <div class="breakdown-item">
                        <span>Deductible Discount:</span>
                        <span style="color: #10B981;">-${(deductibleDiscount*100).toFixed(0)}%</span>
                    </div>
                    ` : ''}
                    <div class="breakdown-item">
                        <span>Premium per Lakh:</span>
                        <span>₹${((totalPremium / sumInsured) * 100000).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Benefits (Section 80D)</h3>
                    <div class="breakdown-item">
                        <span>Maximum Tax Deduction:</span>
                        <span>₹${maxTaxBenefit.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Your Tax Deduction:</span>
                        <span>₹${taxBenefit.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Savings at 20% slab:</span>
                        <span>₹${(taxBenefit * 0.2).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Savings at 30% slab:</span>
                        <span>₹${taxSavings30.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Premium (after tax):</span>
                        <span>₹${(totalPremium - taxSavings30).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
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
            trackCalculation('health-insurance', {
                age,
                sumInsured,
                members,
                premium: totalPremium
            }, {
                value: 'high-cpc',
                taxSavings: taxSavings30
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for health-insurance');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
