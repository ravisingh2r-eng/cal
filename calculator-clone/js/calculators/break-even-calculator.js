/**
 * Break Even Calculator
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
                <label>Fixed Costs (₹/month)</label>
                <input type="number" class="calc-input" id="fixedCosts" placeholder="Rent, salaries, utilities" value="200000">
            </div>
            <div class="calc-input-group">
                <label>Variable Cost per Unit (₹)</label>
                <input type="number" class="calc-input" id="variableCost" placeholder="Cost per unit" value="150">
            </div>
            <div class="calc-input-group">
                <label>Selling Price per Unit (₹)</label>
                <input type="number" class="calc-input" id="sellingPrice" placeholder="Price per unit" value="250">
            </div>
            <div class="calc-input-group">
                <label>Current Sales Volume (units/month)</label>
                <input type="number" class="calc-input" id="currentVolume" placeholder="Current sales" value="3000">
            </div>
            <div class="calc-input-group">
                <label>Target Profit (₹/month)</label>
                <input type="number" class="calc-input" id="targetProfit" placeholder="Desired monthly profit" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Semi-Variable Costs (₹/month)</label>
                <input type="number" class="calc-input" id="semiVariableCosts" placeholder="Marketing, commissions" value="50000">
            </div>
            <div class="calc-input-group">
                <label>Number of Products (Multi-Product Analysis)</label>
                <select class="calc-input" id="numProducts">
                    <option value="1" selected>Single Product</option>
                    <option value="2">2 Products</option>
                    <option value="3">3 Products</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Tax Rate (%)</label>
                <input type="number" class="calc-input" id="taxRate" placeholder="GST/Tax %" value="18" step="0.1">
            </div>
        `;
    }

    function calculate() {
        const fixedCosts = parseFloat(document.getElementById('fixedCosts').value) || 0;
        const variableCost = parseFloat(document.getElementById('variableCost').value) || 0;
        const sellingPrice = parseFloat(document.getElementById('sellingPrice').value) || 0;
        const currentVolume = parseFloat(document.getElementById('currentVolume').value) || 0;
        const targetProfit = parseFloat(document.getElementById('targetProfit').value) || 0;
        const semiVariableCosts = parseFloat(document.getElementById('semiVariableCosts').value) || 0;
        const numProducts = parseInt(document.getElementById('numProducts').value) || 1;
        const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;

        if (sellingPrice <= 0 || variableCost < 0 || fixedCosts < 0) {
            alert('Please enter valid values');
            return;
        }

        if (sellingPrice <= variableCost) {
            alert('Selling price must be greater than variable cost per unit');
            return;
        }

        // Calculate contribution margin
        const contributionPerUnit = sellingPrice - variableCost;
        const contributionMarginRatio = (contributionPerUnit / sellingPrice) * 100;

        // Total fixed costs including semi-variable
        const totalFixedCosts = fixedCosts + semiVariableCosts;

        // Break-even point in units
        const breakEvenUnits = totalFixedCosts / contributionPerUnit;

        // Break-even point in revenue
        const breakEvenRevenue = breakEvenUnits * sellingPrice;

        // Units needed to achieve target profit
        const unitsForTargetProfit = (totalFixedCosts + targetProfit) / contributionPerUnit;
        const revenueForTargetProfit = unitsForTargetProfit * sellingPrice;

        // Current position analysis
        const currentRevenue = currentVolume * sellingPrice;
        const currentVariableCosts = currentVolume * variableCost;
        const currentContribution = currentVolume * contributionPerUnit;
        const currentProfit = currentContribution - totalFixedCosts;

        // Margin of safety
        const marginOfSafetyUnits = currentVolume - breakEvenUnits;
        const marginOfSafetyRevenue = marginOfSafetyUnits * sellingPrice;
        const marginOfSafetyPercent = (marginOfSafetyUnits / currentVolume) * 100;

        // Operating leverage
        const degreeOfOperatingLeverage = currentContribution / currentProfit;

        // Net profit after tax
        const profitAfterTax = currentProfit * (1 - taxRate/100);

        // Sensitivity analysis - what if scenarios
        const scenarios = [
            { name: '10% Price Increase', sellingPrice: sellingPrice * 1.1, variableCost, fixedCosts: totalFixedCosts },
            { name: '10% Price Decrease', sellingPrice: sellingPrice * 0.9, variableCost, fixedCosts: totalFixedCosts },
            { name: '10% Cost Increase', sellingPrice, variableCost: variableCost * 1.1, fixedCosts: totalFixedCosts },
            { name: '10% Cost Decrease', sellingPrice, variableCost: variableCost * 0.9, fixedCosts: totalFixedCosts },
            { name: '20% Fixed Cost Increase', sellingPrice, variableCost, fixedCosts: totalFixedCosts * 1.2 }
        ];

        const scenarioResults = scenarios.map(scenario => {
            const contrib = scenario.sellingPrice - scenario.variableCost;
            const beUnits = scenario.fixedCosts / contrib;
            const beRevenue = beUnits * scenario.sellingPrice;
            return {
                name: scenario.name,
                breakEvenUnits: beUnits,
                breakEvenRevenue: beRevenue,
                change: ((beUnits - breakEvenUnits) / breakEvenUnits * 100)
            };
        });

        // Cash break-even (excluding non-cash fixed costs like depreciation)
        const depreciation = totalFixedCosts * 0.15; // Assume 15% is depreciation
        const cashFixedCosts = totalFixedCosts - depreciation;
        const cashBreakEvenUnits = cashFixedCosts / contributionPerUnit;
        const cashBreakEvenRevenue = cashBreakEvenUnits * sellingPrice;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Break-Even Point (Units)</span>
                    <span class="result-value">${breakEvenUnits.toLocaleString('en-IN', {maximumFractionDigits: 0})} units</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Break-Even Revenue</span>
                    <span class="result-value">₹${breakEvenRevenue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Current Monthly Profit</span>
                    <span class="result-value" style="color: ${currentProfit > 0 ? '#10B981' : '#EF4444'}">₹${currentProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Break-Even Analysis</h3>
                    <div class="breakdown-item">
                        <span>Break-Even Units:</span>
                        <span>${breakEvenUnits.toLocaleString('en-IN', {maximumFractionDigits: 0})} units/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Break-Even Revenue:</span>
                        <span>₹${breakEvenRevenue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Daily Break-Even Units:</span>
                        <span>${(breakEvenUnits/30).toLocaleString('en-IN', {maximumFractionDigits: 0})} units/day</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Break-Even Revenue:</span>
                        <span>₹${(breakEvenRevenue * 12).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Status:</span>
                        <span style="color: ${currentVolume > breakEvenUnits ? '#10B981' : '#EF4444'}">
                            ${currentVolume > breakEvenUnits ? '✓ Above Break-Even' : '✗ Below Break-Even'}
                        </span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Contribution Margin Analysis</h3>
                    <div class="breakdown-item">
                        <span>Selling Price per Unit:</span>
                        <span>₹${sellingPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Variable Cost per Unit:</span>
                        <span>₹${variableCost.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Contribution per Unit:</span>
                        <span>₹${contributionPerUnit.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Contribution Margin Ratio:</span>
                        <span>${contributionMarginRatio.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Contribution (Current):</span>
                        <span>₹${currentContribution.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Cost Structure</h3>
                    <div class="breakdown-item">
                        <span>Fixed Costs:</span>
                        <span>₹${fixedCosts.toLocaleString('en-IN', {maximumFractionDigits: 0})}/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Semi-Variable Costs:</span>
                        <span>₹${semiVariableCosts.toLocaleString('en-IN', {maximumFractionDigits: 0})}/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Fixed Costs:</span>
                        <span>₹${totalFixedCosts.toLocaleString('en-IN', {maximumFractionDigits: 0})}/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Variable Costs (Current):</span>
                        <span>₹${currentVariableCosts.toLocaleString('en-IN', {maximumFractionDigits: 0})}/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Costs (Current):</span>
                        <span>₹${(totalFixedCosts + currentVariableCosts).toLocaleString('en-IN', {maximumFractionDigits: 0})}/month</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Current Performance</h3>
                    <div class="breakdown-item">
                        <span>Current Sales Volume:</span>
                        <span>${currentVolume.toLocaleString('en-IN')} units/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Current Revenue:</span>
                        <span>₹${currentRevenue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Current Profit (Before Tax):</span>
                        <span style="color: ${currentProfit > 0 ? '#10B981' : '#EF4444'}">₹${currentProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Profit After Tax (${taxRate}%):</span>
                        <span style="color: ${profitAfterTax > 0 ? '#10B981' : '#EF4444'}">₹${profitAfterTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Profit Margin:</span>
                        <span>${((currentProfit/currentRevenue)*100).toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Projected Profit:</span>
                        <span>₹${(currentProfit * 12).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Margin of Safety</h3>
                    <div class="breakdown-item">
                        <span>Margin of Safety (Units):</span>
                        <span style="color: ${marginOfSafetyUnits > 0 ? '#10B981' : '#EF4444'}">${marginOfSafetyUnits.toLocaleString('en-IN', {maximumFractionDigits: 0})} units</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Margin of Safety (Revenue):</span>
                        <span style="color: ${marginOfSafetyRevenue > 0 ? '#10B981' : '#EF4444'}">₹${marginOfSafetyRevenue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Margin of Safety (%):</span>
                        <span style="color: ${marginOfSafetyPercent > 0 ? '#10B981' : '#EF4444'}">${marginOfSafetyPercent.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interpretation:</span>
                        <span>${marginOfSafetyPercent > 25 ? 'Strong safety margin' : marginOfSafetyPercent > 10 ? 'Moderate safety' : 'Low safety margin'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Sales can drop by:</span>
                        <span>${Math.abs(marginOfSafetyPercent).toFixed(1)}% before losses</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Target Profit Analysis</h3>
                    <div class="breakdown-item">
                        <span>Target Monthly Profit:</span>
                        <span>₹${targetProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Units Needed for Target:</span>
                        <span>${unitsForTargetProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})} units</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Revenue Needed for Target:</span>
                        <span>₹${revenueForTargetProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Additional Units Needed:</span>
                        <span>${(unitsForTargetProfit - currentVolume).toLocaleString('en-IN', {maximumFractionDigits: 0})} units</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Growth Required:</span>
                        <span>${(((unitsForTargetProfit - currentVolume)/currentVolume)*100).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Cash Break-Even Analysis</h3>
                    <div class="breakdown-item">
                        <span>Cash Fixed Costs:</span>
                        <span>₹${cashFixedCosts.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Non-Cash Costs (Depreciation):</span>
                        <span>₹${depreciation.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Cash Break-Even Units:</span>
                        <span>${cashBreakEvenUnits.toLocaleString('en-IN', {maximumFractionDigits: 0})} units</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Cash Break-Even Revenue:</span>
                        <span>₹${cashBreakEvenRevenue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Difference from Accounting BEP:</span>
                        <span>${(breakEvenUnits - cashBreakEvenUnits).toLocaleString('en-IN', {maximumFractionDigits: 0})} units</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Operating Leverage</h3>
                    <div class="breakdown-item">
                        <span>Degree of Operating Leverage:</span>
                        <span>${degreeOfOperatingLeverage.toFixed(2)}x</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interpretation:</span>
                        <span>${degreeOfOperatingLeverage > 3 ? 'High leverage - profits sensitive to sales' : 'Moderate leverage'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>10% Sales Increase Impact:</span>
                        <span>Profit increases by ${(degreeOfOperatingLeverage * 10).toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>10% Sales Decrease Impact:</span>
                        <span>Profit decreases by ${(degreeOfOperatingLeverage * 10).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Sensitivity Analysis - What If Scenarios</h3>
                    ${scenarioResults.map(scenario => `
                        <div class="breakdown-item">
                            <span>${scenario.name}:</span>
                            <span>${scenario.breakEvenUnits.toLocaleString('en-IN', {maximumFractionDigits: 0})} units (${scenario.change > 0 ? '+' : ''}${scenario.change.toFixed(1)}%)</span>
                        </div>
                    `).join('')}
                </div>
                <div class="result-breakdown">
                    <h3>Key Recommendations</h3>
                    <div class="breakdown-item">
                        <span>Risk Level:</span>
                        <span>${marginOfSafetyPercent > 30 ? 'Low Risk ✓' : marginOfSafetyPercent > 15 ? 'Moderate Risk ⚠' : 'High Risk ✗'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Priority Action:</span>
                        <span>${currentProfit < 0 ? 'Increase volume or reduce costs urgently' : marginOfSafetyPercent < 20 ? 'Improve margin of safety' : 'Focus on profit optimization'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Price Sensitivity:</span>
                        <span>${contributionMarginRatio < 30 ? 'High - small price changes matter' : 'Moderate - good margin cushion'}</span>
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
            trackCalculation('break-even', {
                fixedCosts,
                breakEvenUnits,
                breakEvenRevenue,
                currentProfit,
                contributionMarginRatio
            }, {
                value: 'high-cpc',
                revenueInLakhs: breakEvenRevenue/100000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for break-even');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
