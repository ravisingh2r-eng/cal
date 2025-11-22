/**
 * Property Valuation Calculator
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
                <label>Property Area (sq ft)</label>
                <input type="number" class="calc-input" id="area" placeholder="Built-up area" value="1000">
            </div>
            <div class="calc-input-group">
                <label>Location Category</label>
                <select class="calc-input" id="location">
                    <option value="tier1-prime">Tier 1 City - Prime Location</option>
                    <option value="tier1-standard">Tier 1 City - Standard Location</option>
                    <option value="tier2-prime">Tier 2 City - Prime Location</option>
                    <option value="tier2-standard">Tier 2 City - Standard Location</option>
                    <option value="tier3">Tier 3 City</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Property Age (years)</label>
                <input type="number" class="calc-input" id="age" placeholder="Age of property" value="5">
            </div>
            <div class="calc-input-group">
                <label>Property Type</label>
                <select class="calc-input" id="propertyType">
                    <option value="apartment">Apartment/Flat</option>
                    <option value="villa">Independent Villa/House</option>
                    <option value="plot">Residential Plot</option>
                    <option value="commercial">Commercial Property</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Number of Bedrooms</label>
                <select class="calc-input" id="bedrooms">
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Amenities Score (0-10)</label>
                <input type="number" class="calc-input" id="amenities" placeholder="Rate amenities" value="7" min="0" max="10">
                <small style="color: #666; font-size: 12px;">
                    Consider: Parking, Gym, Pool, Security, Power backup, etc.
                </small>
            </div>
            <div class="calc-input-group">
                <label>Floor</label>
                <select class="calc-input" id="floor">
                    <option value="ground">Ground Floor</option>
                    <option value="low">Low Floor (1-3)</option>
                    <option value="mid">Mid Floor (4-7)</option>
                    <option value="high">High Floor (8+)</option>
                    <option value="penthouse">Penthouse</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const area = parseFloat(document.getElementById('area').value) || 0;
        const location = document.getElementById('location').value;
        const age = parseFloat(document.getElementById('age').value) || 0;
        const propertyType = document.getElementById('propertyType').value;
        const bedrooms = parseInt(document.getElementById('bedrooms').value) || 2;
        const amenities = parseFloat(document.getElementById('amenities').value) || 5;
        const floor = document.getElementById('floor').value;

        if (area <= 0) {
            alert('Please enter valid property area');
            return;
        }

        // Base price per sq ft based on location
        const basePrices = {
            'tier1-prime': 12000,
            'tier1-standard': 8000,
            'tier2-prime': 5500,
            'tier2-standard': 4000,
            'tier3': 2500
        };

        let pricePerSqFt = basePrices[location];

        // Property type multiplier
        const typeMultipliers = {
            'apartment': 1.0,
            'villa': 1.3,
            'plot': 0.7,
            'commercial': 1.5
        };
        pricePerSqFt *= typeMultipliers[propertyType];

        // Age depreciation (2% per year for first 10 years)
        const ageDepreciation = Math.min(age * 0.02, 0.20);
        pricePerSqFt *= (1 - ageDepreciation);

        // Amenities adjustment (-10% to +15%)
        const amenitiesAdjustment = ((amenities - 5) / 5) * 0.15;
        pricePerSqFt *= (1 + amenitiesAdjustment);

        // Floor adjustment
        const floorAdjustments = {
            'ground': 0.95,
            'low': 0.98,
            'mid': 1.02,
            'high': 1.05,
            'penthouse': 1.15
        };
        pricePerSqFt *= floorAdjustments[floor];

        // Bedroom size factor (larger units have slightly lower per sq ft rate)
        const bedroomFactor = bedrooms >= 3 ? 0.97 : 1.0;
        pricePerSqFt *= bedroomFactor;

        // Calculate estimated value
        const estimatedValue = area * pricePerSqFt;

        // Value range (±10%)
        const minValue = estimatedValue * 0.90;
        const maxValue = estimatedValue * 1.10;

        // Appreciation projections (7% CAGR for real estate)
        const appreciationRate = 0.07;
        const value3Year = estimatedValue * Math.pow(1 + appreciationRate, 3);
        const value5Year = estimatedValue * Math.pow(1 + appreciationRate, 5);
        const value10Year = estimatedValue * Math.pow(1 + appreciationRate, 10);

        // Rental yield estimation (2.5-4% of property value annually)
        const rentalYieldPercent = propertyType === 'commercial' ? 6 : 3;
        const monthlyRent = (estimatedValue * rentalYieldPercent / 100) / 12;
        const annualRent = monthlyRent * 12;

        // Comparable properties
        const comparable1 = estimatedValue * 0.95;
        const comparable2 = estimatedValue * 1.05;
        const comparable3 = estimatedValue * 0.98;

        const locationNames = {
            'tier1-prime': 'Tier 1 City - Prime Location',
            'tier1-standard': 'Tier 1 City - Standard',
            'tier2-prime': 'Tier 2 City - Prime',
            'tier2-standard': 'Tier 2 City - Standard',
            'tier3': 'Tier 3 City'
        };

        const propertyTypeNames = {
            'apartment': 'Apartment/Flat',
            'villa': 'Independent Villa',
            'plot': 'Residential Plot',
            'commercial': 'Commercial Property'
        };

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Estimated Property Value</span>
                    <span class="result-value">₹${estimatedValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Price per Sq Ft</span>
                    <span class="result-value">₹${pricePerSqFt.toLocaleString('en-IN', {maximumFractionDigits: 0})}/sq ft</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Estimated Range</span>
                    <span class="result-value" style="font-size: 16px;">
                        ₹${minValue.toLocaleString('en-IN', {maximumFractionDigits: 0})} - ₹${maxValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                    </span>
                </div>
                <div class="result-breakdown">
                    <h3>Property Details</h3>
                    <div class="breakdown-item">
                        <span>Property Type:</span>
                        <span>${propertyTypeNames[propertyType]}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Built-up Area:</span>
                        <span>${area.toLocaleString('en-IN')} sq ft</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Configuration:</span>
                        <span>${bedrooms} BHK</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Location:</span>
                        <span>${locationNames[location]}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Property Age:</span>
                        <span>${age} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Floor:</span>
                        <span>${floor.charAt(0).toUpperCase() + floor.slice(1).replace('-', ' ')}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Valuation Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Base Price (Location):</span>
                        <span>₹${basePrices[location].toLocaleString('en-IN')}/sq ft</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Age Depreciation:</span>
                        <span style="color: #EF4444;">-${(ageDepreciation * 100).toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Amenities Impact:</span>
                        <span style="color: ${amenitiesAdjustment >= 0 ? '#10B981' : '#EF4444'};">
                            ${amenitiesAdjustment >= 0 ? '+' : ''}${(amenitiesAdjustment * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Floor Premium/Discount:</span>
                        <span style="color: ${floorAdjustments[floor] >= 1 ? '#10B981' : '#EF4444'};">
                            ${((floorAdjustments[floor] - 1) * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Final Price per Sq Ft:</span>
                        <span style="font-weight: 600;">₹${pricePerSqFt.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Appreciation Projections (${(appreciationRate * 100).toFixed(0)}% CAGR)</h3>
                    <div class="breakdown-item">
                        <span>Current Value:</span>
                        <span>₹${estimatedValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Value After 3 Years:</span>
                        <span style="color: #10B981;">₹${value3Year.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Value After 5 Years:</span>
                        <span style="color: #10B981;">₹${value5Year.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Value After 10 Years:</span>
                        <span style="color: #10B981; font-weight: 600;">₹${value10Year.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>10-Year Appreciation:</span>
                        <span style="color: #10B981;">+₹${(value10Year - estimatedValue).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Rental Yield Estimates</h3>
                    <div class="breakdown-item">
                        <span>Expected Rental Yield:</span>
                        <span>${rentalYieldPercent}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Estimated Monthly Rent:</span>
                        <span>₹${monthlyRent.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Rental Income:</span>
                        <span style="font-weight: 600;">₹${annualRent.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>10-Year Rental Income:</span>
                        <span style="color: #10B981;">₹${(annualRent * 10).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Comparable Properties</h3>
                    <div class="breakdown-item">
                        <span>Similar Property 1:</span>
                        <span>₹${comparable1.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Similar Property 2:</span>
                        <span>₹${comparable2.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Similar Property 3:</span>
                        <span>₹${comparable3.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Market Average:</span>
                        <span style="font-weight: 600;">₹${((comparable1 + comparable2 + comparable3) / 3).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown" style="background: #DBEAFE; border-left: 4px solid #3B82F6; padding: 15px;">
                    <h3 style="color: #1E40AF; margin-top: 0;">💡 Valuation Notes</h3>
                    <ul style="color: #1E40AF; margin: 8px 0; font-size: 14px; padding-left: 20px;">
                        <li>This is an estimated valuation based on market averages</li>
                        <li>Actual property value may vary based on specific location, builder reputation, and market conditions</li>
                        <li>Get professional valuation before making purchase decisions</li>
                        <li>Consider registration charges (1-2%) and stamp duty (4-7%)</li>
                    </ul>
                </div>
                <div class="result-breakdown" style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px;">
                    <h3 style="color: #92400E; margin-top: 0;">📋 Additional Costs</h3>
                    <div class="breakdown-item" style="margin: 5px 0;">
                        <span>Stamp Duty & Registration:</span>
                        <span>₹${(estimatedValue * 0.06).toLocaleString('en-IN', {maximumFractionDigits: 0})} (approx 6%)</span>
                    </div>
                    <div class="breakdown-item" style="margin: 5px 0;">
                        <span>GST (if under construction):</span>
                        <span>₹${(estimatedValue * 0.05).toLocaleString('en-IN', {maximumFractionDigits: 0})} (5%)</span>
                    </div>
                    <div class="breakdown-item" style="margin: 5px 0;">
                        <span>Maintenance (annual estimate):</span>
                        <span>₹${(area * 30 * 12).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
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
            trackCalculation('property-valuation', { area, estimatedValue, pricePerSqFt }, { value: 'high-cpc' });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for property-valuation');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
