/**
 * Margin Calculator
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

        // Dynamic calculation mode switching
        document.addEventListener('change', function(e) {
            if (e.target && e.target.id === 'calculationMode') {
                updateInputFields(e.target.value);
            }
        });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="calc-input-group">
                <label>Calculation Mode</label>
                <select class="calc-input" id="calculationMode">
                    <option value="gross">Gross Margin</option>
                    <option value="net">Net Profit Margin</option>
                    <option value="operating">Operating Margin</option>
                    <option value="markup">Markup Calculator</option>
                    <option value="reverse">Reverse Calculate (Find Cost)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Revenue/Sales Price (₹)</label>
                <input type="number" class="calc-input" id="revenue" placeholder="Enter total revenue" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Cost of Goods Sold - COGS (₹)</label>
                <input type="number" class="calc-input" id="cogs" placeholder="Enter COGS" value="60000">
            </div>
            <div class="calc-input-group" id="operatingExpensesGroup" style="display:none;">
                <label>Operating Expenses (₹)</label>
                <input type="number" class="calc-input" id="operatingExpenses" placeholder="Salaries, rent, etc." value="15000">
            </div>
            <div class="calc-input-group" id="otherExpensesGroup" style="display:none;">
                <label>Other Expenses (₹)</label>
                <input type="number" class="calc-input" id="otherExpenses" placeholder="Tax, interest, etc." value="5000">
            </div>
            <div class="calc-input-group">
                <label>Quantity Sold (Units)</label>
                <input type="number" class="calc-input" id="quantity" placeholder="Number of units" value="100">
            </div>
            <div class="calc-input-group">
                <label>Industry Benchmark</label>
                <select class="calc-input" id="industryBenchmark">
                    <option value="retail">Retail (20-40% margin)</option>
                    <option value="manufacturing">Manufacturing (15-30% margin)</option>
                    <option value="software">Software/SaaS (70-90% margin)</option>
                    <option value="food">Food & Beverages (60-70% margin)</option>
                    <option value="ecommerce">E-commerce (30-50% margin)</option>
                    <option value="consulting">Consulting (40-60% margin)</option>
                    <option value="construction">Construction (10-20% margin)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Target Margin (%)</label>
                <input type="number" class="calc-input" id="targetMargin" placeholder="Your target margin" value="40" step="0.1">
            </div>
        `;
    }

    function updateInputFields(mode) {
        const operatingExpensesGroup = document.getElementById('operatingExpensesGroup');
        const otherExpensesGroup = document.getElementById('otherExpensesGroup');

        if (mode === 'net') {
            if (operatingExpensesGroup) operatingExpensesGroup.style.display = 'block';
            if (otherExpensesGroup) otherExpensesGroup.style.display = 'block';
        } else if (mode === 'operating') {
            if (operatingExpensesGroup) operatingExpensesGroup.style.display = 'block';
            if (otherExpensesGroup) otherExpensesGroup.style.display = 'none';
        } else {
            if (operatingExpensesGroup) operatingExpensesGroup.style.display = 'none';
            if (otherExpensesGroup) otherExpensesGroup.style.display = 'none';
        }
    }

    function calculate() {
        const revenue = parseFloat(document.getElementById('revenue').value) || 0;
        const cogs = parseFloat(document.getElementById('cogs').value) || 0;
        const operatingExpenses = parseFloat(document.getElementById('operatingExpenses')?.value) || 0;
        const otherExpenses = parseFloat(document.getElementById('otherExpenses')?.value) || 0;
        const quantity = parseFloat(document.getElementById('quantity').value) || 1;
        const targetMargin = parseFloat(document.getElementById('targetMargin').value) || 40;
        const calculationMode = document.getElementById('calculationMode').value;
        const industryBenchmark = document.getElementById('industryBenchmark').value;

        if (revenue <= 0) {
            alert('Please enter valid revenue');
            return;
        }

        if (cogs < 0) {
            alert('Please enter valid COGS');
            return;
        }

        // Calculate all margin types
        const grossProfit = revenue - cogs;
        const grossMargin = (grossProfit / revenue) * 100;
        const grossMarkup = (grossProfit / cogs) * 100;

        const operatingProfit = grossProfit - operatingExpenses;
        const operatingMargin = (operatingProfit / revenue) * 100;

        const netProfit = operatingProfit - otherExpenses;
        const netMargin = (netProfit / revenue) * 100;

        // Per unit calculations
        const revenuePerUnit = revenue / quantity;
        const cogsPerUnit = cogs / quantity;
        const profitPerUnit = grossProfit / quantity;
        const marginPerUnit = grossMargin;

        // Break-even analysis
        const fixedCosts = operatingExpenses + otherExpenses;
        const contributionMarginPerUnit = profitPerUnit;
        const breakEvenUnits = fixedCosts > 0 ? fixedCosts / contributionMarginPerUnit : 0;
        const breakEvenRevenue = breakEvenUnits * revenuePerUnit;

        // Target margin calculations
        const requiredRevenueForTarget = (cogs * 100) / (100 - targetMargin);
        const requiredPriceForTarget = requiredRevenueForTarget / quantity;
        const currentVsTarget = grossMargin - targetMargin;

        // Industry benchmark comparison
        const benchmarkRanges = {
            'retail': { min: 20, max: 40, avg: 30 },
            'manufacturing': { min: 15, max: 30, avg: 22.5 },
            'software': { min: 70, max: 90, avg: 80 },
            'food': { min: 60, max: 70, avg: 65 },
            'ecommerce': { min: 30, max: 50, avg: 40 },
            'consulting': { min: 40, max: 60, avg: 50 },
            'construction': { min: 10, max: 20, avg: 15 }
        };

        const benchmark = benchmarkRanges[industryBenchmark];
        const benchmarkComparison = grossMargin - benchmark.avg;
        const isHealthy = grossMargin >= benchmark.min && grossMargin <= benchmark.max;

        // Margin improvement scenarios
        const reduce5PercentCOGS = cogs * 0.95;
        const newMarginWith5PercentReduction = ((revenue - reduce5PercentCOGS) / revenue) * 100;
        const additionalProfitFrom5PercentReduction = (cogs - reduce5PercentCOGS);

        const increase5PercentPrice = revenue * 1.05;
        const newMarginWith5PercentIncrease = ((increase5PercentPrice - cogs) / increase5PercentPrice) * 100;
        const additionalProfitFrom5PercentIncrease = increase5PercentPrice - revenue;

        // ROI and efficiency metrics
        const returnOnSales = (netProfit / revenue) * 100;
        const costPerRupeeOfSales = cogs / revenue;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Gross Margin</span>
                    <span class="result-value">${grossMargin.toFixed(2)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Gross Profit</span>
                    <span class="result-value">₹${grossProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Markup Percentage</span>
                    <span class="result-value">${grossMarkup.toFixed(2)}%</span>
                </div>
                <div class="result-breakdown">
                    <h3>Margin Analysis</h3>
                    <div class="breakdown-item">
                        <span>Total Revenue/Sales:</span>
                        <span>₹${revenue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Cost of Goods Sold (COGS):</span>
                        <span>₹${cogs.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Gross Profit:</span>
                        <span>₹${grossProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Gross Margin:</span>
                        <span style="color: ${grossMargin > 30 ? '#10B981' : grossMargin > 15 ? '#F59E0B' : '#EF4444'}">${grossMargin.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Markup on Cost:</span>
                        <span>${grossMarkup.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Cost per ₹1 of Sales:</span>
                        <span>₹${costPerRupeeOfSales.toFixed(2)}</span>
                    </div>
                </div>
                ${operatingExpenses > 0 || calculationMode === 'operating' || calculationMode === 'net' ? `
                <div class="result-breakdown">
                    <h3>Operating Margin</h3>
                    <div class="breakdown-item">
                        <span>Gross Profit:</span>
                        <span>₹${grossProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Operating Expenses:</span>
                        <span>₹${operatingExpenses.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Operating Profit (EBIT):</span>
                        <span>₹${operatingProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Operating Margin:</span>
                        <span style="color: ${operatingMargin > 20 ? '#10B981' : operatingMargin > 10 ? '#F59E0B' : '#EF4444'}">${operatingMargin.toFixed(2)}%</span>
                    </div>
                </div>
                ` : ''}
                ${(otherExpenses > 0 || calculationMode === 'net') ? `
                <div class="result-breakdown">
                    <h3>Net Profit Margin</h3>
                    <div class="breakdown-item">
                        <span>Operating Profit:</span>
                        <span>₹${operatingProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Other Expenses (Tax, Interest):</span>
                        <span>₹${otherExpenses.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Profit:</span>
                        <span>₹${netProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Profit Margin:</span>
                        <span style="color: ${netMargin > 15 ? '#10B981' : netMargin > 5 ? '#F59E0B' : '#EF4444'}">${netMargin.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Return on Sales (ROS):</span>
                        <span>${returnOnSales.toFixed(2)}%</span>
                    </div>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>Per Unit Analysis</h3>
                    <div class="breakdown-item">
                        <span>Units Sold:</span>
                        <span>${quantity.toLocaleString('en-IN', {maximumFractionDigits: 0})} units</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Revenue per Unit:</span>
                        <span>₹${revenuePerUnit.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Cost per Unit:</span>
                        <span>₹${cogsPerUnit.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Profit per Unit:</span>
                        <span>₹${profitPerUnit.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Margin per Unit:</span>
                        <span>${marginPerUnit.toFixed(2)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Industry Benchmark Comparison</h3>
                    <div class="breakdown-item">
                        <span>Industry:</span>
                        <span>${industryBenchmark.charAt(0).toUpperCase() + industryBenchmark.slice(1)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Industry Average Margin:</span>
                        <span>${benchmark.avg}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Industry Range:</span>
                        <span>${benchmark.min}% - ${benchmark.max}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Your Margin:</span>
                        <span style="color: ${isHealthy ? '#10B981' : '#F59E0B'}">${grossMargin.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Comparison to Average:</span>
                        <span style="color: ${benchmarkComparison > 0 ? '#10B981' : '#EF4444'}">${benchmarkComparison > 0 ? '+' : ''}${benchmarkComparison.toFixed(2)}% ${benchmarkComparison > 0 ? 'above' : 'below'} average</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Health Status:</span>
                        <span style="color: ${isHealthy ? '#10B981' : '#F59E0B'}">${isHealthy ? '✓ Within healthy range' : '⚠ Outside typical range'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Target Margin Analysis</h3>
                    <div class="breakdown-item">
                        <span>Current Gross Margin:</span>
                        <span>${grossMargin.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Target Margin:</span>
                        <span>${targetMargin}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Gap:</span>
                        <span style="color: ${currentVsTarget >= 0 ? '#10B981' : '#EF4444'}">${currentVsTarget >= 0 ? '+' : ''}${currentVsTarget.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Required Revenue for Target:</span>
                        <span>₹${requiredRevenueForTarget.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Required Price per Unit:</span>
                        <span>₹${requiredPriceForTarget.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Price Adjustment Needed:</span>
                        <span>${((requiredPriceForTarget - revenuePerUnit) / revenuePerUnit * 100).toFixed(2)}%</span>
                    </div>
                </div>
                ${fixedCosts > 0 ? `
                <div class="result-breakdown">
                    <h3>Break-Even Analysis</h3>
                    <div class="breakdown-item">
                        <span>Fixed Costs:</span>
                        <span>₹${fixedCosts.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Contribution Margin per Unit:</span>
                        <span>₹${contributionMarginPerUnit.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Break-Even Units:</span>
                        <span>${Math.ceil(breakEvenUnits).toLocaleString('en-IN', {maximumFractionDigits: 0})} units</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Break-Even Revenue:</span>
                        <span>₹${breakEvenRevenue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Current Units Sold:</span>
                        <span>${quantity.toLocaleString('en-IN', {maximumFractionDigits: 0})} units</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Margin of Safety:</span>
                        <span style="color: ${quantity > breakEvenUnits ? '#10B981' : '#EF4444'}">${((quantity - breakEvenUnits) / quantity * 100).toFixed(2)}%</span>
                    </div>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>Margin Improvement Scenarios</h3>
                    <div class="breakdown-item">
                        <span>Current Gross Margin:</span>
                        <span>${grossMargin.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>If COGS reduced by 5%:</span>
                        <span style="color: #10B981">${newMarginWith5PercentReduction.toFixed(2)}% margin (${(newMarginWith5PercentReduction - grossMargin).toFixed(2)}% improvement)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Additional Profit (5% COGS cut):</span>
                        <span>₹${additionalProfitFrom5PercentReduction.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>If Price increased by 5%:</span>
                        <span style="color: #10B981">${newMarginWith5PercentIncrease.toFixed(2)}% margin (${(newMarginWith5PercentIncrease - grossMargin).toFixed(2)}% improvement)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Additional Revenue (5% price increase):</span>
                        <span>₹${additionalProfitFrom5PercentIncrease.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Key Recommendations</h3>
                    <div class="breakdown-item">
                        <span>Margin Health:</span>
                        <span>${grossMargin > benchmark.avg ? '✓ Above industry average' : '⚠ Below industry average - focus on cost optimization'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Price Strategy:</span>
                        <span>${currentVsTarget < 0 ? `Consider ${Math.abs(((requiredPriceForTarget - revenuePerUnit) / revenuePerUnit * 100)).toFixed(1)}% price increase to reach target` : '✓ Price point supports target margin'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Cost Efficiency:</span>
                        <span>${costPerRupeeOfSales > 0.7 ? '⚠ High cost ratio - negotiate with suppliers' : '✓ Good cost control'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Volume Impact:</span>
                        <span>${fixedCosts > 0 && quantity < breakEvenUnits * 2 ? '⚠ Increase sales volume to improve profitability' : '✓ Good sales volume'}</span>
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
            trackCalculation('margin', {
                revenue,
                cogs,
                grossMargin,
                calculationMode
            }, {
                value: 'high-cpc',
                revenueInLakhs: revenue/100000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for margin calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
