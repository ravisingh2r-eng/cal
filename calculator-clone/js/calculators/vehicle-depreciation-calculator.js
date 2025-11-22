/**
 * Vehicle Depreciation Calculator
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
                <label>Vehicle Purchase Price (₹)</label>
                <input type="number" class="calc-input" id="purchasePrice" placeholder="Ex-showroom price" value="1000000">
            </div>
            <div class="calc-input-group">
                <label>Vehicle Type</label>
                <select class="calc-input" id="vehicleType">
                    <option value="car-petrol">Car - Petrol</option>
                    <option value="car-diesel" selected>Car - Diesel</option>
                    <option value="car-ev">Car - Electric</option>
                    <option value="bike">Two Wheeler (Bike/Scooter)</option>
                    <option value="commercial">Commercial Vehicle</option>
                    <option value="luxury">Luxury Car</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Vehicle Age (years)</label>
                <input type="number" class="calc-input" id="vehicleAge" placeholder="How old is the vehicle?" value="3" min="0" max="20">
            </div>
            <div class="calc-input-group">
                <label>Kilometers Driven</label>
                <input type="number" class="calc-input" id="kmsDriven" placeholder="Total kilometers" value="30000">
            </div>
            <div class="calc-input-group">
                <label>Vehicle Condition</label>
                <select class="calc-input" id="condition">
                    <option value="excellent">Excellent</option>
                    <option value="good" selected>Good</option>
                    <option value="average">Average</option>
                    <option value="poor">Poor</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Accident History</label>
                <select class="calc-input" id="accidentHistory">
                    <option value="no" selected>No Accidents</option>
                    <option value="minor">Minor Accident</option>
                    <option value="major">Major Accident</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Service History</label>
                <select class="calc-input" id="serviceHistory">
                    <option value="complete" selected>Complete Service Records</option>
                    <option value="partial">Partial Records</option>
                    <option value="none">No Records</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Ownership</label>
                <select class="calc-input" id="ownership">
                    <option value="1" selected>First Owner</option>
                    <option value="2">Second Owner</option>
                    <option value="3">Third Owner</option>
                    <option value="4">Fourth+ Owner</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
        const vehicleType = document.getElementById('vehicleType').value;
        const vehicleAge = parseFloat(document.getElementById('vehicleAge').value) || 0;
        const kmsDriven = parseFloat(document.getElementById('kmsDriven').value) || 0;
        const condition = document.getElementById('condition').value;
        const accidentHistory = document.getElementById('accidentHistory').value;
        const serviceHistory = document.getElementById('serviceHistory').value;
        const ownership = document.getElementById('ownership').value;

        if (purchasePrice <= 0) {
            alert('Please enter valid purchase price');
            return;
        }

        // Define depreciation rates based on vehicle type (as per Indian market & tax rules)
        let depreciationSchedule = [];
        let taxDepreciationRate = 0.15; // 15% for most vehicles
        let vehicleTypeName = '';

        if (vehicleType === 'car-petrol' || vehicleType === 'car-diesel') {
            vehicleTypeName = vehicleType === 'car-petrol' ? 'Petrol Car' : 'Diesel Car';
            // Standard car depreciation: 20% Year 1, 15% Year 2-5, 10% thereafter
            depreciationSchedule = [0.20, 0.15, 0.15, 0.15, 0.15, 0.10, 0.10, 0.10, 0.10, 0.10];
            taxDepreciationRate = 0.15; // 15% for tax purposes
        } else if (vehicleType === 'car-ev') {
            vehicleTypeName = 'Electric Car';
            // EVs depreciate faster initially due to battery concerns
            depreciationSchedule = [0.25, 0.18, 0.15, 0.12, 0.12, 0.10, 0.10, 0.08, 0.08, 0.08];
            taxDepreciationRate = 0.15;
        } else if (vehicleType === 'bike') {
            vehicleTypeName = 'Two Wheeler';
            // Bikes depreciate faster
            depreciationSchedule = [0.25, 0.20, 0.15, 0.15, 0.10, 0.10, 0.08, 0.08, 0.05, 0.05];
            taxDepreciationRate = 0.30; // 30% for bikes as per IT rules
        } else if (vehicleType === 'commercial') {
            vehicleTypeName = 'Commercial Vehicle';
            // Commercial vehicles depreciate based on usage
            depreciationSchedule = [0.30, 0.25, 0.20, 0.15, 0.15, 0.10, 0.10, 0.08, 0.08, 0.08];
            taxDepreciationRate = 0.30; // 30% for commercial
        } else if (vehicleType === 'luxury') {
            vehicleTypeName = 'Luxury Car';
            // Luxury cars depreciate faster
            depreciationSchedule = [0.30, 0.20, 0.15, 0.12, 0.10, 0.10, 0.08, 0.08, 0.05, 0.05];
            taxDepreciationRate = 0.15;
        }

        // Calculate year-wise depreciation
        let currentValue = purchasePrice;
        let yearWiseData = [];
        let totalDepreciation = 0;

        for (let year = 1; year <= Math.min(vehicleAge, 10); year++) {
            const yearlyDepRate = depreciationSchedule[year - 1] || 0.10;
            const yearlyDepAmount = currentValue * yearlyDepRate;
            currentValue = currentValue - yearlyDepAmount;
            totalDepreciation += yearlyDepAmount;

            yearWiseData.push({
                year: year,
                openingValue: currentValue + yearlyDepAmount,
                depreciationRate: yearlyDepRate * 100,
                depreciationAmount: yearlyDepAmount,
                closingValue: currentValue
            });
        }

        // Apply condition adjustments
        let conditionMultiplier = 1.0;
        if (condition === 'excellent') conditionMultiplier = 1.05;
        else if (condition === 'good') conditionMultiplier = 1.0;
        else if (condition === 'average') conditionMultiplier = 0.92;
        else if (condition === 'poor') conditionMultiplier = 0.80;

        // Accident history adjustment
        let accidentMultiplier = 1.0;
        if (accidentHistory === 'minor') accidentMultiplier = 0.95;
        else if (accidentHistory === 'major') accidentMultiplier = 0.85;

        // Service history adjustment
        let serviceMultiplier = 1.0;
        if (serviceHistory === 'complete') serviceMultiplier = 1.0;
        else if (serviceHistory === 'partial') serviceMultiplier = 0.95;
        else if (serviceHistory === 'none') serviceMultiplier = 0.88;

        // Ownership adjustment
        let ownershipMultiplier = 1.0;
        if (ownership === '1') ownershipMultiplier = 1.0;
        else if (ownership === '2') ownershipMultiplier = 0.93;
        else if (ownership === '3') ownershipMultiplier = 0.85;
        else ownershipMultiplier = 0.75;

        // Kilometers driven adjustment
        const avgKmsPerYear = vehicleType === 'bike' ? 5000 : 12000;
        const expectedKms = avgKmsPerYear * vehicleAge;
        const kmsMultiplier = kmsDriven <= expectedKms ? 1.0 :
                             (1.0 - ((kmsDriven - expectedKms) / expectedKms) * 0.15);

        // Apply all adjustments
        const marketValue = currentValue * conditionMultiplier * accidentMultiplier *
                           serviceMultiplier * ownershipMultiplier * Math.max(0.7, kmsMultiplier);

        // Calculate Insurance IDV (Insured Declared Value)
        // IDV reduces by ~15% each year for first 5 years, then ~10%
        let idv = purchasePrice;
        for (let i = 0; i < vehicleAge; i++) {
            const idvDepRate = i < 5 ? 0.15 : 0.10;
            idv = idv * (1 - idvDepRate);
        }

        // Tax depreciation (Written Down Value method)
        const taxDepreciatedValue = purchasePrice * Math.pow(1 - taxDepreciationRate, vehicleAge);

        // Calculate resale percentage
        const resalePercentage = (marketValue / purchasePrice) * 100;

        // Total loss
        const totalLoss = purchasePrice - marketValue;
        const totalLossPercent = (totalLoss / purchasePrice) * 100;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Current Market Value</span>
                    <span class="result-value">₹${marketValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Depreciation</span>
                    <span class="result-value">₹${totalLoss.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Insurance IDV</span>
                    <span class="result-value">₹${idv.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Vehicle Details</h3>
                    <div class="breakdown-item">
                        <span>Vehicle Type:</span>
                        <span>${vehicleTypeName}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Purchase Price:</span>
                        <span>₹${purchasePrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Vehicle Age:</span>
                        <span>${vehicleAge} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Kilometers Driven:</span>
                        <span>${kmsDriven.toLocaleString('en-IN')} km</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Condition:</span>
                        <span>${condition.charAt(0).toUpperCase() + condition.slice(1)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Ownership:</span>
                        <span>${ownership === '1' ? 'First' : ownership === '2' ? 'Second' : ownership === '3' ? 'Third' : 'Fourth+'} Owner</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Depreciation Analysis</h3>
                    <div class="breakdown-item">
                        <span>Base Depreciated Value:</span>
                        <span>₹${currentValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Condition Adjustment:</span>
                        <span>${((conditionMultiplier - 1) * 100).toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Accident Impact:</span>
                        <span>${((accidentMultiplier - 1) * 100).toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Service Records Impact:</span>
                        <span>${((serviceMultiplier - 1) * 100).toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Ownership Impact:</span>
                        <span>${((ownershipMultiplier - 1) * 100).toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Mileage Impact:</span>
                        <span>${((Math.max(0.7, kmsMultiplier) - 1) * 100).toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Final Market Value:</span>
                        <span>₹${marketValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Value Retention</h3>
                    <div class="breakdown-item">
                        <span>Original Price:</span>
                        <span>₹${purchasePrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Current Value:</span>
                        <span>₹${marketValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Value Retained:</span>
                        <span>${resalePercentage.toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Loss:</span>
                        <span>₹${totalLoss.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loss Percentage:</span>
                        <span>${totalLossPercent.toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Average Annual Depreciation:</span>
                        <span>₹${(totalLoss/vehicleAge).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Insurance IDV Calculation</h3>
                    <div class="breakdown-item">
                        <span>Insured Declared Value (IDV):</span>
                        <span>₹${idv.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>IDV as % of Purchase Price:</span>
                        <span>${((idv/purchasePrice)*100).toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Market Value vs IDV:</span>
                        <span>${marketValue > idv ? 'Market value higher' : 'IDV higher'} by ₹${Math.abs(marketValue - idv).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Premium Calculation Base:</span>
                        <span>Insurance premium = IDV × Rate</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Note:</span>
                        <span>IDV reduces ~15% annually (first 5 years)</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Depreciation (Income Tax)</h3>
                    <div class="breakdown-item">
                        <span>Tax Depreciation Rate:</span>
                        <span>${(taxDepreciationRate * 100).toFixed(0)}% (${vehicleType === 'bike' || vehicleType === 'commercial' ? '30%' : '15%'} as per IT Act)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Written Down Value:</span>
                        <span>₹${taxDepreciatedValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Method:</span>
                        <span>Written Down Value (WDV)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Applicable For:</span>
                        <span>Business use / Taxi / Commercial</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Tax Depreciation:</span>
                        <span>₹${(purchasePrice - taxDepreciatedValue).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Year-wise Depreciation Schedule</h3>
                    ${yearWiseData.map(data => `
                        <div class="breakdown-item">
                            <span>Year ${data.year} (${data.depreciationRate.toFixed(1)}%):</span>
                            <span>₹${data.openingValue.toLocaleString('en-IN', {maximumFractionDigits: 0})} → ₹${data.closingValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="result-breakdown">
                    <h3>Resale Recommendations</h3>
                    <div class="breakdown-item">
                        <span>Expected Market Price Range:</span>
                        <span>₹${(marketValue * 0.9).toLocaleString('en-IN', {maximumFractionDigits: 0})} - ₹${(marketValue * 1.1).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Quick Sale Price:</span>
                        <span>₹${(marketValue * 0.85).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Dealer Offer (Approx):</span>
                        <span>₹${(marketValue * 0.75).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Best Time to Sell:</span>
                        <span>${vehicleAge < 3 ? 'Good time - low depreciation ahead' : vehicleAge < 5 ? 'Optimal - before high depreciation phase' : 'Consider selling - high depreciation phase'}</span>
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
            trackCalculation('vehicle-depreciation', {
                purchasePrice,
                vehicleAge,
                marketValue,
                vehicleType,
                totalLoss
            }, {
                value: 'high-cpc',
                vehicleValueInLakhs: purchasePrice/100000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for vehicle-depreciation');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
