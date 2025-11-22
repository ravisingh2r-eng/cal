/**
 * Property Tax Calculator Calculator
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
                <label>Built-up Area (sq ft)</label>
                <input type="number" class="calc-input" id="builtUpArea" placeholder="Enter built-up area" value="1000">
            </div>
            <div class="calc-input-group">
                <label>City/Municipal Corporation</label>
                <select class="calc-input" id="city">
                    <option value="mumbai">Mumbai (BMC)</option>
                    <option value="bangalore" selected>Bangalore (BBMP)</option>
                    <option value="delhi">Delhi (MCD)</option>
                    <option value="pune">Pune (PMC)</option>
                    <option value="hyderabad">Hyderabad (GHMC)</option>
                    <option value="chennai">Chennai (CMC)</option>
                    <option value="kolkata">Kolkata (KMC)</option>
                    <option value="other">Other City</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Property Type</label>
                <select class="calc-input" id="propertyType">
                    <option value="residential" selected>Residential</option>
                    <option value="commercial">Commercial</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Usage Type</label>
                <select class="calc-input" id="usage">
                    <option value="self-occupied" selected>Self-Occupied</option>
                    <option value="rented">Rented</option>
                    <option value="vacant">Vacant</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Monthly Rent (if rented) (₹)</label>
                <input type="number" class="calc-input" id="monthlyRent" placeholder="Enter monthly rent" value="0">
            </div>
            <div class="calc-input-group">
                <label>Property Age</label>
                <select class="calc-input" id="age">
                    <option value="0-5" selected>0-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-20">11-20 years</option>
                    <option value="20+">20+ years</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const propertyValue = parseFloat(document.getElementById('propertyValue').value) || 0;
        const builtUpArea = parseFloat(document.getElementById('builtUpArea').value) || 0;
        const city = document.getElementById('city').value;
        const propertyType = document.getElementById('propertyType').value;
        const usage = document.getElementById('usage').value;
        const monthlyRent = parseFloat(document.getElementById('monthlyRent').value) || 0;
        const age = document.getElementById('age').value;

        // Calculate Annual Rental Value (ARV)
        let arv = 0;
        if (usage === 'rented' && monthlyRent > 0) {
            arv = monthlyRent * 12;
        } else {
            // For self-occupied/vacant, estimate ARV as % of property value
            arv = propertyValue * 0.08; // 8% of property value as annual rent
        }

        // City-specific tax rates and methods
        let propertyTax = 0;
        let method = '';
        let rate = 0;

        switch(city) {
            case 'mumbai':
                // Mumbai uses capital value system (% of property value)
                rate = propertyType === 'residential' ? 0.003 : 0.004;
                propertyTax = propertyValue * rate;
                method = 'Capital Value System';
                break;

            case 'bangalore':
                // Bangalore uses unit area assessment
                rate = propertyType === 'residential' ? 25 : 40; // per sq ft per year
                const ageFactor = age === '0-5' ? 1.0 : age === '6-10' ? 0.9 : age === '11-20' ? 0.8 : 0.7;
                propertyTax = builtUpArea * rate * ageFactor;
                method = 'Unit Area System';
                break;

            case 'delhi':
                // Delhi uses unit area system
                rate = propertyType === 'residential' ? 15 : 30; // per sq ft per year
                propertyTax = builtUpArea * rate;
                method = 'Unit Area System';
                break;

            case 'pune':
            case 'hyderabad':
            case 'chennai':
            case 'kolkata':
                // These cities use ARV-based system
                rate = propertyType === 'residential' ? 0.15 : 0.20; // 15-20% of ARV
                propertyTax = arv * rate;
                method = 'Annual Rental Value (ARV) System';
                break;

            default:
                // Other cities - general ARV based
                rate = propertyType === 'residential' ? 0.12 : 0.18;
                propertyTax = arv * rate;
                method = 'Annual Rental Value (ARV) System';
        }

        // Add cess and surcharges (typically 10-20% extra)
        const cess = propertyTax * 0.15; // 15% cess
        const totalTax = propertyTax + cess;

        // Monthly and quarterly breakdown
        const monthlyTax = totalTax / 12;
        const quarterlyTax = totalTax / 4;

        // Rebate for early payment (typically 5-10%)
        const earlyPaymentRebate = totalTax * 0.05;
        const taxAfterRebate = totalTax - earlyPaymentRebate;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Annual Property Tax</span>
                    <span class="result-value">₹${totalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Quarterly Tax</span>
                    <span class="result-value">₹${quarterlyTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">After Early Payment Rebate (5%)</span>
                    <span class="result-value" style="color: #10B981;">₹${taxAfterRebate.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Property Details</h3>
                    <div class="breakdown-item">
                        <span>Property Value:</span>
                        <span>₹${propertyValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Built-up Area:</span>
                        <span>${builtUpArea.toLocaleString('en-IN')} sq ft</span>
                    </div>
                    <div class="breakdown-item">
                        <span>City:</span>
                        <span>${city.charAt(0).toUpperCase() + city.slice(1)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Property Type:</span>
                        <span>${propertyType === 'residential' ? 'Residential' : 'Commercial'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Usage:</span>
                        <span>${usage === 'self-occupied' ? 'Self-Occupied' : usage === 'rented' ? 'Rented' : 'Vacant'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Calculation (${method})</h3>
                    ${city === 'bangalore' || city === 'delhi' ? `
                    <div class="breakdown-item">
                        <span>Rate per sq ft:</span>
                        <span>₹${rate}/sq ft/year</span>
                    </div>
                    ${city === 'bangalore' ? `
                    <div class="breakdown-item">
                        <span>Age Factor:</span>
                        <span>${age === '0-5' ? '100%' : age === '6-10' ? '90%' : age === '11-20' ? '80%' : '70%'}</span>
                    </div>
                    ` : ''}
                    ` : city === 'mumbai' ? `
                    <div class="breakdown-item">
                        <span>Property Tax Rate:</span>
                        <span>${(rate * 100).toFixed(1)}% of property value</span>
                    </div>
                    ` : `
                    <div class="breakdown-item">
                        <span>Annual Rental Value (ARV):</span>
                        <span>₹${arv.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Rate on ARV:</span>
                        <span>${(rate * 100).toFixed(0)}%</span>
                    </div>
                    `}
                    <div class="breakdown-item">
                        <span>Base Property Tax:</span>
                        <span>₹${propertyTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Cess & Surcharges (15%):</span>
                        <span>₹${cess.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Annual Tax:</span>
                        <span style="font-weight: 600;">₹${totalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Payment Options</h3>
                    <div class="breakdown-item">
                        <span>Annual Payment:</span>
                        <span>₹${totalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Half-Yearly Payment:</span>
                        <span>₹${(totalTax/2).toLocaleString('en-IN', {maximumFractionDigits: 0})} x 2</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Quarterly Payment:</span>
                        <span>₹${quarterlyTax.toLocaleString('en-IN', {maximumFractionDigits: 0})} x 4</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Payment:</span>
                        <span>₹${monthlyTax.toLocaleString('en-IN', {maximumFractionDigits: 0})} x 12</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Rebates & Discounts</h3>
                    <div class="breakdown-item">
                        <span>Early Payment Rebate:</span>
                        <span style="color: #10B981;">₹${earlyPaymentRebate.toLocaleString('en-IN', {maximumFractionDigits: 0})} (5%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax After Rebate:</span>
                        <span>₹${taxAfterRebate.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *Pay before April 30 to get early payment rebate
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
            trackCalculation('property-tax', {
                propertyValue,
                city,
                totalTax,
                propertyType
            }, {
                value: 'high-cpc',
                annualTax: totalTax
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for property-tax');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
