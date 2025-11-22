/**
 * Fuel Cost Calculator
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
        if (calculateBtn) calculateBtn.addEventListener('click', calculate);
        document.addEventListener('keypress', (e) => { if (e.key === 'Enter') calculate(); });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;
        container.innerHTML = `
            <div class="calc-input-group"><label>Distance (km)</label><input type="number" class="calc-input" id="distance" value="100"></div>
            <div class="calc-input-group"><label>Mileage (km/liter)</label><input type="number" class="calc-input" id="mileage" value="15" step="0.1"></div>
            <div class="calc-input-group"><label>Fuel Price (₹/liter)</label><input type="number" class="calc-input" id="fuelPrice" value="105" step="0.1"></div>
            <div class="calc-input-group"><label>Frequency</label><select class="calc-input" id="frequency"><option value="1">One-time Trip</option><option value="30" selected>Monthly</option><option value="365">Yearly</option></select></div>
            <div class="calc-input-group"><label>Fuel Type</label><select class="calc-input" id="fuelType"><option value="petrol" selected>Petrol</option><option value="diesel">Diesel</option><option value="cng">CNG</option></select></div>
        `;
    }

    function calculate() {
        const dist = parseFloat(document.getElementById('distance').value) || 0;
        const mile = parseFloat(document.getElementById('mileage').value) || 15;
        const price = parseFloat(document.getElementById('fuelPrice').value) || 105;
        const freq = parseFloat(document.getElementById('frequency').value) || 1;
        if (dist <= 0 || mile <= 0) { alert('Enter valid values'); return; }
        const liters = dist / mile;
        const cost = liters * price;
        const totalDist = dist * freq;
        const totalLiters = liters * freq;
        const totalCost = cost * freq;
        const costPerKm = cost / dist;
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result"><span class="result-label">${freq == 1 ? 'Trip' : freq == 30 ? 'Monthly' : 'Yearly'} Fuel Cost</span><span class="result-value">₹${totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Fuel Required</span><span class="result-value">${totalLiters.toFixed(2)} liters</span></div>
                <div class="result-item"><span class="result-label">Cost per km</span><span class="result-value">₹${costPerKm.toFixed(2)}/km</span></div>
                <div class="result-breakdown"><h3>Calculation Details</h3>
                    <div class="breakdown-item"><span>Distance:</span><span>${dist} km ${freq > 1 ? `× ${freq} = ${totalDist.toLocaleString('en-IN')} km` : ''}</span></div>
                    <div class="breakdown-item"><span>Mileage:</span><span>${mile} km/liter</span></div>
                    <div class="breakdown-item"><span>Fuel Price:</span><span>₹${price}/liter</span></div>
                    <div class="breakdown-item"><span>Fuel Needed:</span><span>${liters.toFixed(2)} liters ${freq > 1 ? `× ${freq} = ${totalLiters.toFixed(2)} liters` : ''}</span></div>
                    <div class="breakdown-item"><span>Total Cost:</span><span>₹${totalCost.toLocaleString('en-IN')}</span></div>
                    ${freq == 30 ? `<div class="breakdown-item"><span>Yearly Cost:</span><span>₹${(totalCost * 12).toLocaleString('en-IN')}</span></div>` : ''}
                    ${freq == 365 ? `<div class="breakdown-item"><span>Monthly Average:</span><span>₹${(totalCost / 12).toLocaleString('en-IN')}</span></div>` : ''}
                </div>
                <div class="result-actions"><button class="btn btn-outline" onclick="window.print()">Print</button></div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('fuel-cost', {distance: totalDist, cost: totalCost}, {value: 'high-cpc'});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }

    function loadAffiliateOffers() { console.log('Loading affiliate offers for fuel cost'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
