/**
 * Inflation Calculator
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
                <label>Current Amount/Price (₹)</label>
                <input type="number" class="calc-input" id="currentAmount" placeholder="Enter current amount" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Expected Inflation Rate (%)</label>
                <select class="calc-input" id="inflationRate">
                    <option value="4">4% (Low)</option>
                    <option value="5">5% (Moderate)</option>
                    <option value="6" selected>6% (Average India)</option>
                    <option value="7">7% (High)</option>
                    <option value="8">8% (Very High)</option>
                    <option value="10">10% (Extreme)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Time Period (years)</label>
                <input type="number" class="calc-input" id="years" placeholder="Number of years" value="10" min="1" max="50">
            </div>
            <div class="calc-input-group">
                <label>Category-wise Inflation (Optional)</label>
                <select class="calc-input" id="categoryInflation">
                    <option value="general">General Inflation</option>
                    <option value="food">Food & Beverages (8-10%)</option>
                    <option value="healthcare">Healthcare (12-15%)</option>
                    <option value="education">Education (10-12%)</option>
                    <option value="housing">Housing (5-7%)</option>
                    <option value="transport">Transport (6-8%)</option>
                    <option value="fuel">Fuel & Energy (8-12%)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Investment Return Rate (%)</label>
                <input type="number" class="calc-input" id="returnRate" placeholder="Expected returns" value="10" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Monthly Savings/Investment (₹)</label>
                <input type="number" class="calc-input" id="monthlySavings" placeholder="Monthly amount" value="10000">
            </div>
            <div class="calc-input-group">
                <label>Calculation Type</label>
                <select class="calc-input" id="calculationType">
                    <option value="future">Future Value (what will it cost?)</option>
                    <option value="present" selected>Present Value (what's it worth today?)</option>
                    <option value="both">Both Scenarios</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const currentAmount = parseFloat(document.getElementById('currentAmount').value) || 0;
        let inflationRate = parseFloat(document.getElementById('inflationRate').value) || 6;
        const years = parseFloat(document.getElementById('years').value) || 10;
        const categoryInflation = document.getElementById('categoryInflation').value;
        const returnRate = parseFloat(document.getElementById('returnRate').value) || 10;
        const monthlySavings = parseFloat(document.getElementById('monthlySavings').value) || 0;
        const calculationType = document.getElementById('calculationType').value;

        if (currentAmount <= 0) {
            alert('Please enter valid amount');
            return;
        }

        if (years <= 0) {
            alert('Please enter valid time period');
            return;
        }

        // Adjust inflation rate based on category
        let categorySpecificRate = inflationRate;
        let categoryName = 'General';

        if (categoryInflation !== 'general') {
            const categoryRates = {
                'food': { rate: 9, name: 'Food & Beverages' },
                'healthcare': { rate: 13.5, name: 'Healthcare' },
                'education': { rate: 11, name: 'Education' },
                'housing': { rate: 6, name: 'Housing' },
                'transport': { rate: 7, name: 'Transport' },
                'fuel': { rate: 10, name: 'Fuel & Energy' }
            };

            if (categoryRates[categoryInflation]) {
                categorySpecificRate = categoryRates[categoryInflation].rate;
                categoryName = categoryRates[categoryInflation].name;
            }
        }

        // Calculate future value (inflation impact)
        const futureValue = currentAmount * Math.pow(1 + categorySpecificRate/100, years);

        // Calculate purchasing power loss
        const purchasingPowerLoss = futureValue - currentAmount;
        const purchasingPowerLossPercent = ((futureValue - currentAmount) / currentAmount) * 100;

        // Calculate present value (what future amount is worth today)
        const presentValue = currentAmount / Math.pow(1 + categorySpecificRate/100, years);
        const valueErosion = currentAmount - presentValue;

        // Real vs Nominal Returns
        const nominalReturn = returnRate;
        const realReturn = ((1 + returnRate/100) / (1 + categorySpecificRate/100) - 1) * 100;

        // Investment needed to beat inflation
        const monthlyRate = returnRate / 12 / 100;
        const months = years * 12;
        const futureValueOfSavings = monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

        // Inflation-adjusted value of investment
        const inflationAdjustedInvestmentValue = futureValueOfSavings / Math.pow(1 + categorySpecificRate/100, years);
        const realGainInInvestment = inflationAdjustedInvestmentValue - (monthlySavings * months);

        // Year-wise breakdown
        let yearWiseData = [];
        for (let i = 1; i <= Math.min(years, 20); i++) {
            const yearFutureValue = currentAmount * Math.pow(1 + categorySpecificRate/100, i);
            const yearPurchasingPower = currentAmount / Math.pow(1 + categorySpecificRate/100, i);
            yearWiseData.push({
                year: i,
                futureValue: yearFutureValue,
                purchasingPower: yearPurchasingPower,
                erosion: currentAmount - yearPurchasingPower
            });
        }

        // India's historical inflation context
        const indiaAvgInflation = 6.2; // Historical average
        const comparisonWithAvg = categorySpecificRate - indiaAvgInflation;

        // Doubling time using Rule of 72
        const doublingTime = 72 / categorySpecificRate;

        // Halving of purchasing power
        const halvingTime = 72 / categorySpecificRate;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Future Value (After ${years} years)</span>
                    <span class="result-value">₹${futureValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Purchasing Power Loss</span>
                    <span class="result-value">₹${purchasingPowerLoss.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Real Return on Investment</span>
                    <span class="result-value">${realReturn.toFixed(2)}%</span>
                </div>
                <div class="result-breakdown">
                    <h3>Inflation Impact Analysis</h3>
                    <div class="breakdown-item">
                        <span>Current Amount:</span>
                        <span>₹${currentAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Inflation Rate:</span>
                        <span>${categorySpecificRate}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Category:</span>
                        <span>${categoryName}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Time Period:</span>
                        <span>${years} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Future Cost/Value:</span>
                        <span>₹${futureValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Increase:</span>
                        <span>₹${purchasingPowerLoss.toLocaleString('en-IN', {maximumFractionDigits: 0})} (${purchasingPowerLossPercent.toFixed(1)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Price Multiplier:</span>
                        <span>${(futureValue/currentAmount).toFixed(2)}x</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Purchasing Power Analysis</h3>
                    <div class="breakdown-item">
                        <span>Today's Value:</span>
                        <span>₹${currentAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Future Purchasing Power:</span>
                        <span>₹${presentValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Value Erosion:</span>
                        <span>₹${valueErosion.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Erosion Rate:</span>
                        <span>${((valueErosion/currentAmount)*100).toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>What ₹100 buys after ${years} years:</span>
                        <span>Goods worth ₹${(100 / Math.pow(1 + categorySpecificRate/100, years)).toFixed(2)} today</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Real vs Nominal Returns</h3>
                    <div class="breakdown-item">
                        <span>Nominal Investment Return:</span>
                        <span>${nominalReturn}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Inflation Rate:</span>
                        <span>${categorySpecificRate}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Real Return (Inflation-adjusted):</span>
                        <span style="color: ${realReturn > 0 ? '#10B981' : '#EF4444'}">${realReturn.toFixed(2)}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interpretation:</span>
                        <span>${realReturn > 0 ? 'Your investment beats inflation ✓' : 'Your investment loses to inflation ✗'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Minimum Return Needed:</span>
                        <span>${categorySpecificRate}% to maintain purchasing power</span>
                    </div>
                </div>
                ${monthlySavings > 0 ? `
                <div class="result-breakdown">
                    <h3>Investment Growth vs Inflation</h3>
                    <div class="breakdown-item">
                        <span>Monthly Savings:</span>
                        <span>₹${monthlySavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Investment (${years} years):</span>
                        <span>₹${(monthlySavings * months).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Future Value @ ${returnRate}%:</span>
                        <span>₹${futureValueOfSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Nominal Gain:</span>
                        <span>₹${(futureValueOfSavings - monthlySavings * months).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Inflation-Adjusted Value:</span>
                        <span>₹${inflationAdjustedInvestmentValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Real Gain (After Inflation):</span>
                        <span style="color: ${realGainInInvestment > 0 ? '#10B981' : '#EF4444'}">₹${realGainInInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>India's Inflation Context</h3>
                    <div class="breakdown-item">
                        <span>Historical Average (India):</span>
                        <span>${indiaAvgInflation}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Your Inflation Rate:</span>
                        <span>${categorySpecificRate}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Comparison:</span>
                        <span>${comparisonWithAvg > 0 ? '+' : ''}${comparisonWithAvg.toFixed(1)}% vs national average</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Price Doubling Time:</span>
                        <span>${doublingTime.toFixed(1)} years (Rule of 72)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Purchasing Power Halving:</span>
                        <span>${halvingTime.toFixed(1)} years</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Category-wise Inflation Rates (India 2024)</h3>
                    <div class="breakdown-item">
                        <span>Food & Beverages:</span>
                        <span>8-10% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Healthcare & Medicine:</span>
                        <span>12-15% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Education:</span>
                        <span>10-12% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Housing & Rent:</span>
                        <span>5-7% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Transport:</span>
                        <span>6-8% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Fuel & Energy:</span>
                        <span>8-12% p.a.</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Year-wise Impact (First ${Math.min(years, 10)} Years)</h3>
                    ${yearWiseData.slice(0, 10).map(data => `
                        <div class="breakdown-item">
                            <span>Year ${data.year}:</span>
                            <span>Future: ₹${data.futureValue.toLocaleString('en-IN', {maximumFractionDigits: 0})} | Worth: ₹${data.purchasingPower.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        // Track high-value calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('inflation', {
                currentAmount,
                inflationRate: categorySpecificRate,
                years,
                futureValue,
                categoryName
            }, {
                value: 'high-cpc',
                impactInLakhs: purchasingPowerLoss/100000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for inflation calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
