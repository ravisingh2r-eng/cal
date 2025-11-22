/**
 * Term Insurance Calculator Calculator
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
                <input type="number" class="calc-input" id="age" placeholder="Enter your age" value="30" min="18" max="65">
            </div>
            <div class="calc-input-group">
                <label>Gender</label>
                <select class="calc-input" id="gender">
                    <option value="male" selected>Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Sum Assured (Cover Amount) (₹)</label>
                <select class="calc-input" id="sumAssured">
                    <option value="2500000">₹25 Lakh</option>
                    <option value="5000000" selected>₹50 Lakh</option>
                    <option value="7500000">₹75 Lakh</option>
                    <option value="10000000">₹1 Crore</option>
                    <option value="15000000">₹1.5 Crore</option>
                    <option value="20000000">₹2 Crore</option>
                    <option value="50000000">₹5 Crore</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Policy Term (years)</label>
                <select class="calc-input" id="term">
                    <option value="10">10 Years</option>
                    <option value="15">15 Years</option>
                    <option value="20">20 Years</option>
                    <option value="25" selected>25 Years</option>
                    <option value="30">30 Years</option>
                    <option value="35">35 Years</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Premium Payment Term</label>
                <select class="calc-input" id="paymentTerm">
                    <option value="regular" selected>Regular Pay (Full term)</option>
                    <option value="limited5">Limited Pay (5 years)</option>
                    <option value="limited10">Limited Pay (10 years)</option>
                    <option value="single">Single Pay</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Smoker Status</label>
                <select class="calc-input" id="smoker">
                    <option value="no" selected>Non-Smoker</option>
                    <option value="yes">Smoker</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const age = parseFloat(document.getElementById('age').value) || 30;
        const gender = document.getElementById('gender').value;
        const sumAssured = parseFloat(document.getElementById('sumAssured').value) || 5000000;
        const term = parseFloat(document.getElementById('term').value) || 25;
        const paymentTerm = document.getElementById('paymentTerm').value;
        const smoker = document.getElementById('smoker').value;

        // Base premium rate (per lakh per year)
        let basePremiumRate = 350;
        const ageFactor = age <= 25 ? 0.7 : age <= 30 ? 0.85 : age <= 35 ? 1.0 : age <= 40 ? 1.3 : age <= 45 ? 1.8 : age <= 50 ? 2.5 : 3.5;
        basePremiumRate *= ageFactor;
        const genderFactor = gender === 'female' ? 0.9 : 1.0;
        basePremiumRate *= genderFactor;
        const smokerFactor = smoker === 'yes' ? 1.4 : 1.0;
        basePremiumRate *= smokerFactor;
        const termFactor = term <= 15 ? 1.1 : term <= 25 ? 1.0 : 0.95;
        basePremiumRate *= termFactor;

        const sumInLakhs = sumAssured / 100000;
        let annualPremium = sumInLakhs * basePremiumRate;
        let paymentYears = term;
        if (paymentTerm === 'limited5') {
            paymentYears = 5;
            annualPremium *= 1.8;
        } else if (paymentTerm === 'limited10') {
            paymentYears = 10;
            annualPremium *= 1.4;
        } else if (paymentTerm === 'single') {
            paymentYears = 1;
            annualPremium = annualPremium * term * 0.85;
        }

        const monthlyPremium = annualPremium / 12;
        const totalPremiumPaid = annualPremium * paymentYears;
        const premiumPerLakh = (annualPremium / sumInLakhs).toFixed(0);
        const annualPremiumWithGST = annualPremium * 1.18;
        const totalWithGST = totalPremiumPaid * 1.18;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Annual Premium (excl. GST)</span>
                    <span class="result-value">₹${annualPremium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Annual Premium (incl. 18% GST)</span>
                    <span class="result-value">₹${annualPremiumWithGST.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Monthly Premium</span>
                    <span class="result-value">₹${monthlyPremium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Policy Details</h3>
                    <div class="breakdown-item"><span>Sum Assured (Cover):</span><span>₹${sumAssured.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Policy Term:</span><span>${term} years</span></div>
                    <div class="breakdown-item"><span>Premium Payment Term:</span><span>${paymentYears} year(s)</span></div>
                    <div class="breakdown-item"><span>Age at Entry:</span><span>${age} years</span></div>
                    <div class="breakdown-item"><span>Maturity Age:</span><span>${age + term} years</span></div>
                </div>
                <div class="result-breakdown">
                    <h3>Premium Analysis</h3>
                    <div class="breakdown-item"><span>Premium per Lakh:</span><span>₹${premiumPerLakh}/lakh/year</span></div>
                    <div class="breakdown-item"><span>Total Premium (excl. GST):</span><span>₹${totalPremiumPaid.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Total Premium (incl. GST):</span><span>₹${totalWithGST.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Coverage Multiple:</span><span>${(sumAssured/totalWithGST).toFixed(1)}x your investment</span></div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('term-insurance', {age, sumAssured, term, annualPremium}, {value: 'high-cpc', coverInCrores: sumAssured/10000000});
        }
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for term-insurance');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
