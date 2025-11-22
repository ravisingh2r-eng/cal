/**
 * Car Insurance Calculator Calculator
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
            <div class="calc-input-group"><label>Car Value (IDV) (₹)</label><input type="number" class="calc-input" id="carValue" value="800000"></div>
            <div class="calc-input-group"><label>Car Age (years)</label><select class="calc-input" id="carAge"><option value="0" selected>New Car</option><option value="1">1 Year</option><option value="2">2 Years</option><option value="3">3 Years</option><option value="5">5 Years</option><option value="7">7+ Years</option></select></div>
            <div class="calc-input-group"><label>City</label><select class="calc-input" id="city"><option value="metro" selected>Metro (Mumbai, Delhi, Bangalore)</option><option value="tier1">Tier 1 (Pune, Ahmedabad)</option><option value="tier2">Tier 2/3</option></select></div>
            <div class="calc-input-group"><label>Policy Type</label><select class="calc-input" id="policyType"><option value="comprehensive" selected>Comprehensive</option><option value="thirdparty">Third Party Only</option></select></div>
            <div class="calc-input-group"><label>NCB (No Claim Bonus)</label><select class="calc-input" id="ncb"><option value="0" selected>0% (First Year)</option><option value="20">20% (1 Claim-free year)</option><option value="25">25% (2 years)</option><option value="35">35% (3 years)</option><option value="45">45% (4 years)</option><option value="50">50% (5+ years)</option></select></div>
            <div class="calc-input-group"><label>Add-ons</label><div style="margin-top:0.5rem"><label style="display:block;margin-bottom:0.5rem"><input type="checkbox" id="zeroDepreciation" style="margin-right:0.5rem">Zero Depreciation</label><label style="display:block"><input type="checkbox" id="engineProtection" style="margin-right:0.5rem">Engine Protection</label></div></div>
        `;
    }

    function calculate() {
        const carValue = parseFloat(document.getElementById('carValue').value) || 0;
        const carAge = parseFloat(document.getElementById('carAge').value) || 0;
        const city = document.getElementById('city').value;
        const policyType = document.getElementById('policyType').value;
        const ncb = parseFloat(document.getElementById('ncb').value) || 0;
        const zeroDepreciation = document.getElementById('zeroDepreciation').checked;
        const engineProtection = document.getElementById('engineProtection').checked;

        let basePremium = policyType === 'comprehensive' ? carValue * 0.03 : 2000;
        const cityFactor = city === 'metro' ? 1.2 : city === 'tier1' ? 1.0 : 0.85;
        basePremium *= cityFactor;
        const ageFactor = carAge === 0 ? 1.0 : carAge <= 2 ? 0.95 : carAge <= 5 ? 0.9 : 0.85;
        basePremium *= ageFactor;
        const ncbDiscount = basePremium * (ncb / 100);
        let addOnCost = 0;
        if (zeroDepreciation) addOnCost += basePremium * 0.15;
        if (engineProtection) addOnCost += basePremium * 0.1;
        const totalPremium = basePremium - ncbDiscount + addOnCost;
        const premiumWithGST = totalPremium * 1.18;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Annual Premium (excl. GST)</span><span class="result-value">₹${totalPremium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Annual Premium (incl. 18% GST)</span><span class="result-value">₹${premiumWithGST.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-breakdown"><h3>Policy Details</h3>
                    <div class="breakdown-item"><span>Car Value (IDV):</span><span>₹${carValue.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Car Age:</span><span>${carAge === 0 ? 'New Car' : carAge + ' year(s)'}</span></div>
                    <div class="breakdown-item"><span>Policy Type:</span><span>${policyType === 'comprehensive' ? 'Comprehensive' : 'Third Party Only'}</span></div>
                    <div class="breakdown-item"><span>NCB Discount:</span><span>${ncb}% (-₹${ncbDiscount.toLocaleString('en-IN', {maximumFractionDigits: 0})})</span></div>
                </div>
                <div class="result-breakdown"><h3>Premium Breakdown</h3>
                    <div class="breakdown-item"><span>Base Premium:</span><span>₹${basePremium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>NCB Discount:</span><span style="color:#10B981">-₹${ncbDiscount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    ${addOnCost > 0 ? `<div class="breakdown-item"><span>Add-on Covers:</span><span>₹${addOnCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>` : ''}
                    <div class="breakdown-item"><span>GST (18%):</span><span>₹${(premiumWithGST - totalPremium).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                </div>
                <div class="result-actions"><button class="btn btn-outline" onclick="window.print()">Print</button><button class="btn btn-outline" id="shareResult">Share</button></div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('car-insurance', {carValue, policyType, totalPremium}, {value: 'high-cpc', ncb});
        }
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for car-insurance');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
