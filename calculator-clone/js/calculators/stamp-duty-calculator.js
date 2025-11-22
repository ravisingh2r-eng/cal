/**
 * Stamp Duty Calculator Calculator
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
                <label>Property Value (₹)</label>
                <input type="number" class="calc-input" id="propertyValue" placeholder="Enter property value" value="5000000">
            </div>
            <div class="calc-input-group">
                <label>State</label>
                <select class="calc-input" id="state">
                    <option value="maharashtra" selected>Maharashtra</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="delhi">Delhi</option>
                    <option value="gujarat">Gujarat</option>
                    <option value="tamilnadu">Tamil Nadu</option>
                    <option value="telangana">Telangana</option>
                    <option value="rajasthan">Rajasthan</option>
                    <option value="up">Uttar Pradesh</option>
                    <option value="other">Other (5% avg)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Property Type</label>
                <select class="calc-input" id="propertyType">
                    <option value="residential" selected>Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="plot">Plot/Land</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Buyer Gender</label>
                <select class="calc-input" id="gender">
                    <option value="male" selected>Male</option>
                    <option value="female">Female</option>
                    <option value="joint">Joint (Male + Female)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>First Property Purchase?</label>
                <select class="calc-input" id="firstProperty">
                    <option value="yes" selected>Yes</option>
                    <option value="no">No</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const propertyValue = parseFloat(document.getElementById('propertyValue').value) || 0;
        const state = document.getElementById('state').value;
        const propertyType = document.getElementById('propertyType').value;
        const gender = document.getElementById('gender').value;
        const firstProperty = document.getElementById('firstProperty').value;

        // Stamp duty rates by state (in %)
        const stampDutyRates = {
            maharashtra: { male: 6, female: 5, commercial: 6, plot: 6 },
            karnataka: { male: 5, female: 3, commercial: 5, plot: 5.6 },
            delhi: { male: 6, female: 4, commercial: 6, plot: 6 },
            gujarat: { male: 4.9, female: 4.9, commercial: 4.9, plot: 4.9 },
            tamilnadu: { male: 7, female: 7, commercial: 7, plot: 7 },
            telangana: { male: 4, female: 3, commercial: 6, plot: 5 },
            rajasthan: { male: 5, female: 4.5, commercial: 6, plot: 6 },
            up: { male: 7, female: 6, commercial: 7, plot: 7 },
            other: { male: 5, female: 5, commercial: 5, plot: 5 }
        };

        // Registration charges (typically 1% of property value, capped)
        const registrationPercent = 1;
        const registrationMax = 30000; // Cap at ₹30,000 in most states

        // Get applicable stamp duty rate
        let stampDutyPercent = 0;
        const rates = stampDutyRates[state];

        if (propertyType === 'commercial') {
            stampDutyPercent = rates.commercial;
        } else if (propertyType === 'plot') {
            stampDutyPercent = rates.plot;
        } else {
            // Residential
            if (gender === 'female' && firstProperty === 'yes') {
                stampDutyPercent = rates.female;
            } else if (gender === 'joint') {
                stampDutyPercent = (rates.male + rates.female) / 2;
            } else {
                stampDutyPercent = rates.male;
            }
        }

        // Calculate stamp duty
        const stampDuty = (propertyValue * stampDutyPercent) / 100;

        // Calculate registration charges
        const calculatedRegistration = (propertyValue * registrationPercent) / 100;
        const registrationCharges = Math.min(calculatedRegistration, registrationMax);

        // Total cost
        const totalCost = stampDuty + registrationCharges;
        const totalPropertyCost = propertyValue + totalCost;

        // Savings for women
        const maleSavings = gender === 'female' ? ((rates.male - rates.female) * propertyValue) / 100 : 0;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Total Stamp Duty</span>
                    <span class="result-value">₹${stampDuty.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Registration Charges</span>
                    <span class="result-value">₹${registrationCharges.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Cost</span>
                    <span class="result-value" style="color: #F59E0B;">₹${totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                ${maleSavings > 0 ? `
                <div class="result-item">
                    <span class="result-label">Savings (Women Concession)</span>
                    <span class="result-value" style="color: #10B981;">₹${maleSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>Property Details</h3>
                    <div class="breakdown-item">
                        <span>Property Value:</span>
                        <span>₹${propertyValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>State:</span>
                        <span>${state.charAt(0).toUpperCase() + state.slice(1)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Property Type:</span>
                        <span>${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Buyer Category:</span>
                        <span>${gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : 'Joint'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Cost Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Stamp Duty Rate:</span>
                        <span>${stampDutyPercent}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Stamp Duty Amount:</span>
                        <span>₹${stampDuty.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Registration Charges:</span>
                        <span>₹${registrationCharges.toLocaleString('en-IN', {maximumFractionDigits: 0})} (${registrationPercent}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Registration Cost:</span>
                        <span>₹${totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>As % of Property Value:</span>
                        <span>${((totalCost/propertyValue)*100).toFixed(2)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Total Investment</h3>
                    <div class="breakdown-item">
                        <span>Property Value:</span>
                        <span>₹${propertyValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Stamp Duty + Registration:</span>
                        <span>₹${totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Property Cost:</span>
                        <span style="font-weight: 600;">₹${totalPropertyCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                ${state === 'maharashtra' || state === 'karnataka' ? `
                <div class="result-breakdown">
                    <h3>State-Specific Information</h3>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        ${state === 'maharashtra' ?
                        '• Women buyers get 1% concession in stamp duty<br>• Metro cities charge 1% higher than non-metro' :
                        '• Women get 2% concession for first property purchase<br>• Additional 0.6% green cess applicable on plots'}
                    </p>
                </div>
                ` : ''}
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        // Track high-value calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('stamp-duty', {
                propertyValue,
                state,
                stampDuty,
                totalCost
            }, {
                value: 'high-cpc',
                propertyType
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for stamp-duty');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
