/**
 * Profit Margin Calculator
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
                <label>Selling Price (₹)</label>
                <input type="number" class="calc-input" id="sellingPrice" placeholder="Enter selling price" value="1000">
            </div>
            <div class="calc-input-group">
                <label>Cost Price (₹)</label>
                <input type="number" class="calc-input" id="costPrice" placeholder="Enter cost price" value="600">
            </div>
            <div class="calc-input-group">
                <label>Additional Costs (₹)</label>
                <input type="number" class="calc-input" id="additionalCosts" placeholder="Shipping, packaging, etc." value="50">
            </div>
            <div class="calc-input-group">
                <label>Tax/GST (%)</label>
                <select class="calc-input" id="taxRate">
                    <option value="0">No Tax</option>
                    <option value="5">5% GST</option>
                    <option value="12">12% GST</option>
                    <option value="18" selected>18% GST</option>
                    <option value="28">28% GST</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Quantity</label>
                <input type="number" class="calc-input" id="quantity" placeholder="Number of units" value="100">
            </div>
            <div class="calc-input-group">
                <label>Desired Profit Margin (%)</label>
                <input type="number" class="calc-input" id="desiredMargin" placeholder="Target margin" value="35" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Business Type</label>
                <select class="calc-input" id="businessType">
                    <option value="retail">Retail Business</option>
                    <option value="wholesale">Wholesale Business</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="service">Service Business</option>
                    <option value="restaurant">Restaurant/Food</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const sellingPrice = parseFloat(document.getElementById('sellingPrice').value) || 0;
        const costPrice = parseFloat(document.getElementById('costPrice').value) || 0;
        const additionalCosts = parseFloat(document.getElementById('additionalCosts').value) || 0;
        const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
        const quantity = parseFloat(document.getElementById('quantity').value) || 1;
        const desiredMargin = parseFloat(document.getElementById('desiredMargin').value) || 35;
        const businessType = document.getElementById('businessType').value;

        if (sellingPrice <= 0) {
            alert('Please enter valid selling price');
            return;
        }

        if (costPrice < 0) {
            alert('Please enter valid cost price');
            return;
        }

        // Calculate total cost per unit
        const totalCostPerUnit = costPrice + additionalCosts;

        // Calculate profit
        const profitPerUnit = sellingPrice - totalCostPerUnit;
        const totalRevenue = sellingPrice * quantity;
        const totalCost = totalCostPerUnit * quantity;
        const totalProfit = profitPerUnit * quantity;

        // Calculate margins
        const profitMargin = (profitPerUnit / sellingPrice) * 100;
        const markup = (profitPerUnit / totalCostPerUnit) * 100;
        const profitMarginOnCost = (profitPerUnit / totalCostPerUnit) * 100;

        // Tax calculations
        const taxAmount = (totalRevenue * taxRate) / 100;
        const revenueIncludingTax = totalRevenue + taxAmount;
        const profitAfterTax = totalProfit - (totalProfit * taxRate / 100);

        // ROI calculation
        const roi = (totalProfit / totalCost) * 100;

        // Calculate required price for desired margin
        const requiredPriceForDesiredMargin = totalCostPerUnit / (1 - desiredMargin/100);
        const priceAdjustmentNeeded = requiredPriceForDesiredMargin - sellingPrice;
        const priceAdjustmentPercent = (priceAdjustmentNeeded / sellingPrice) * 100;

        // Margin improvement scenarios
        const reduce10PercentCost = totalCostPerUnit * 0.9;
        const newMarginWith10PercentCostReduction = ((sellingPrice - reduce10PercentCost) / sellingPrice) * 100;
        const additionalProfitFrom10PercentReduction = (totalCostPerUnit - reduce10PercentCost) * quantity;

        const increase10PercentPrice = sellingPrice * 1.10;
        const newMarginWith10PercentPriceIncrease = ((increase10PercentPrice - totalCostPerUnit) / increase10PercentPrice) * 100;
        const additionalProfitFrom10PercentIncrease = (increase10PercentPrice - sellingPrice) * quantity;

        // Break-even analysis
        const breakEvenPrice = totalCostPerUnit;
        const marginOfSafety = sellingPrice - breakEvenPrice;
        const marginOfSafetyPercent = (marginOfSafety / sellingPrice) * 100;

        // Business type benchmarks
        const benchmarks = {
            'retail': { margin: '25-40%', markup: '33-67%' },
            'wholesale': { margin: '10-20%', markup: '11-25%' },
            'ecommerce': { margin: '30-50%', markup: '43-100%' },
            'manufacturing': { margin: '20-35%', markup: '25-54%' },
            'service': { margin: '40-60%', markup: '67-150%' },
            'restaurant': { margin: '60-70%', markup: '150-233%' }
        };

        const benchmark = benchmarks[businessType];

        // Profitability assessment
        const isProfitable = profitPerUnit > 0;
        const meetsTarget = profitMargin >= desiredMargin;

        // Calculate volume needed for target profit
        const targetMonthlyProfit = 100000; // Example: ₹1 lakh monthly target
        const unitsNeededForTarget = Math.ceil(targetMonthlyProfit / profitPerUnit);

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Profit Margin</span>
                    <span class="result-value" style="color: ${profitMargin > 30 ? '#10B981' : profitMargin > 15 ? '#F59E0B' : '#EF4444'}">${profitMargin.toFixed(2)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Profit per Unit</span>
                    <span class="result-value">₹${profitPerUnit.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Profit (${quantity} units)</span>
                    <span class="result-value">₹${totalProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Profit Analysis</h3>
                    <div class="breakdown-item">
                        <span>Selling Price (per unit):</span>
                        <span>₹${sellingPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Cost Price (per unit):</span>
                        <span>₹${costPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Additional Costs (per unit):</span>
                        <span>₹${additionalCosts.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Cost (per unit):</span>
                        <span>₹${totalCostPerUnit.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Profit (per unit):</span>
                        <span style="color: ${profitPerUnit > 0 ? '#10B981' : '#EF4444'}">₹${profitPerUnit.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Profit Margin:</span>
                        <span style="color: ${profitMargin > 30 ? '#10B981' : profitMargin > 15 ? '#F59E0B' : '#EF4444'}">${profitMargin.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Markup on Cost:</span>
                        <span>${markup.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Status:</span>
                        <span style="color: ${isProfitable ? '#10B981' : '#EF4444'}">${isProfitable ? '✓ Profitable' : '✗ Loss-making'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Revenue & Cost Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Quantity:</span>
                        <span>${quantity.toLocaleString('en-IN', {maximumFractionDigits: 0})} units</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Revenue (Excl. Tax):</span>
                        <span>₹${totalRevenue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Cost:</span>
                        <span>₹${totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Profit:</span>
                        <span style="color: ${totalProfit > 0 ? '#10B981' : '#EF4444'}">₹${totalProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>ROI (Return on Investment):</span>
                        <span>${roi.toFixed(2)}%</span>
                    </div>
                </div>
                ${taxRate > 0 ? `
                <div class="result-breakdown">
                    <h3>Tax Impact (GST ${taxRate}%)</h3>
                    <div class="breakdown-item">
                        <span>Revenue (Before Tax):</span>
                        <span>₹${totalRevenue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>GST Amount:</span>
                        <span>₹${taxAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Revenue (Incl. Tax):</span>
                        <span>₹${revenueIncludingTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Profit After Tax:</span>
                        <span>₹${profitAfterTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Impact on Profit:</span>
                        <span>₹${(totalProfit - profitAfterTax).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>Target Margin Analysis</h3>
                    <div class="breakdown-item">
                        <span>Current Profit Margin:</span>
                        <span>${profitMargin.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Desired Profit Margin:</span>
                        <span>${desiredMargin}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Gap:</span>
                        <span style="color: ${profitMargin >= desiredMargin ? '#10B981' : '#EF4444'}">${(profitMargin - desiredMargin).toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Required Price for ${desiredMargin}% margin:</span>
                        <span>₹${requiredPriceForDesiredMargin.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Price Adjustment Needed:</span>
                        <span style="color: ${priceAdjustmentNeeded > 0 ? '#F59E0B' : '#10B981'}">${priceAdjustmentNeeded > 0 ? '+' : ''}₹${priceAdjustmentNeeded.toLocaleString('en-IN', {maximumFractionDigits: 2})} (${priceAdjustmentPercent >= 0 ? '+' : ''}${priceAdjustmentPercent.toFixed(2)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Target Status:</span>
                        <span style="color: ${meetsTarget ? '#10B981' : '#F59E0B'}">${meetsTarget ? '✓ Target achieved' : '⚠ Below target'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Business Benchmark (${businessType.charAt(0).toUpperCase() + businessType.slice(1)})</h3>
                    <div class="breakdown-item">
                        <span>Industry Average Margin:</span>
                        <span>${benchmark.margin}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Industry Average Markup:</span>
                        <span>${benchmark.markup}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Your Profit Margin:</span>
                        <span>${profitMargin.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Your Markup:</span>
                        <span>${markup.toFixed(2)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Break-Even & Safety Analysis</h3>
                    <div class="breakdown-item">
                        <span>Break-Even Price:</span>
                        <span>₹${breakEvenPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Current Selling Price:</span>
                        <span>₹${sellingPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Margin of Safety:</span>
                        <span style="color: ${marginOfSafety > 0 ? '#10B981' : '#EF4444'}">₹${marginOfSafety.toLocaleString('en-IN', {maximumFractionDigits: 2})} (${marginOfSafetyPercent.toFixed(2)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Risk Level:</span>
                        <span style="color: ${marginOfSafetyPercent > 30 ? '#10B981' : marginOfSafetyPercent > 15 ? '#F59E0B' : '#EF4444'}">${marginOfSafetyPercent > 30 ? 'Low risk' : marginOfSafetyPercent > 15 ? 'Medium risk' : 'High risk'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Profit Improvement Scenarios</h3>
                    <div class="breakdown-item">
                        <span>Current Margin:</span>
                        <span>${profitMargin.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>If costs reduced by 10%:</span>
                        <span style="color: #10B981">${newMarginWith10PercentCostReduction.toFixed(2)}% margin (+${(newMarginWith10PercentCostReduction - profitMargin).toFixed(2)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Additional profit (10% cost cut):</span>
                        <span>₹${additionalProfitFrom10PercentReduction.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>If price increased by 10%:</span>
                        <span style="color: #10B981">${newMarginWith10PercentPriceIncrease.toFixed(2)}% margin (+${(newMarginWith10PercentPriceIncrease - profitMargin).toFixed(2)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Additional profit (10% price increase):</span>
                        <span>₹${additionalProfitFrom10PercentIncrease.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Volume Planning</h3>
                    <div class="breakdown-item">
                        <span>Current Quantity:</span>
                        <span>${quantity.toLocaleString('en-IN', {maximumFractionDigits: 0})} units</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Profit per Unit:</span>
                        <span>₹${profitPerUnit.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Units for ₹1L monthly profit:</span>
                        <span>${unitsNeededForTarget.toLocaleString('en-IN', {maximumFractionDigits: 0})} units</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Daily sales needed (30 days):</span>
                        <span>${Math.ceil(unitsNeededForTarget / 30).toLocaleString('en-IN', {maximumFractionDigits: 0})} units/day</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Key Recommendations</h3>
                    <div class="breakdown-item">
                        <span>Profitability:</span>
                        <span>${isProfitable ? '✓ Product is profitable' : '✗ Product is loss-making - adjust pricing or costs'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Pricing:</span>
                        <span>${meetsTarget ? '✓ Price supports target margin' : `⚠ ${priceAdjustmentPercent > 0 ? 'Increase' : 'Decrease'} price by ${Math.abs(priceAdjustmentPercent).toFixed(1)}% to hit target`}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Cost Control:</span>
                        <span>${(totalCostPerUnit / sellingPrice) < 0.6 ? '✓ Good cost control' : '⚠ High cost ratio - negotiate with suppliers'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Best Strategy:</span>
                        <span>${additionalProfitFrom10PercentReduction > additionalProfitFrom10PercentIncrease ? 'Focus on reducing costs' : 'Focus on increasing prices'}</span>
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
            trackCalculation('profit-margin', {
                sellingPrice,
                costPrice,
                profitMargin,
                quantity
            }, {
                value: 'high-cpc',
                revenueInLakhs: totalRevenue/100000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for profit margin calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
