/**
 * ROI (Return on Investment) Calculator
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
                <label>Initial Investment Amount (₹)</label>
                <input type="number" class="calc-input" id="initialInvestment" placeholder="Amount invested" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Final/Current Value (₹)</label>
                <input type="number" class="calc-input" id="finalValue" placeholder="Current worth" value="150000">
            </div>
            <div class="calc-input-group">
                <label>Investment Period (years)</label>
                <input type="number" class="calc-input" id="timePeriod" placeholder="Time in years" value="3" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Investment Type</label>
                <select class="calc-input" id="investmentType">
                    <option value="stocks">Stocks/Equity</option>
                    <option value="mutual-funds" selected>Mutual Funds</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="fd">Fixed Deposit</option>
                    <option value="gold">Gold</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="business">Business</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Additional Investments (₹)</label>
                <input type="number" class="calc-input" id="additionalInvestments" placeholder="Additional amounts added" value="0">
            </div>
            <div class="calc-input-group">
                <label>Income Generated (₹)</label>
                <input type="number" class="calc-input" id="incomeGenerated" placeholder="Dividends, rent, etc." value="5000">
            </div>
            <div class="calc-input-group">
                <label>Inflation Rate (%)</label>
                <input type="number" class="calc-input" id="inflationRate" placeholder="Average inflation" value="6" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Tax Rate on Gains (%)</label>
                <select class="calc-input" id="taxRate">
                    <option value="0">0% (Tax-free instruments)</option>
                    <option value="10">10% (LTCG Equity > ₹1L)</option>
                    <option value="12.5">12.5% (LTCG Equity - New)</option>
                    <option value="15">15% (STCG Equity)</option>
                    <option value="20" selected>20% (LTCG with indexation)</option>
                    <option value="30">30% (Income tax slab)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Compare with Benchmark</label>
                <select class="calc-input" id="benchmark">
                    <option value="none">No Comparison</option>
                    <option value="nifty" selected>Nifty 50 (12% avg)</option>
                    <option value="sensex">Sensex (11% avg)</option>
                    <option value="fd">FD (7% avg)</option>
                    <option value="gold">Gold (8% avg)</option>
                    <option value="custom">Custom Benchmark</option>
                </select>
            </div>
            <div class="calc-input-group" id="customBenchmarkGroup" style="display: none;">
                <label>Custom Benchmark Return (%)</label>
                <input type="number" class="calc-input" id="customBenchmarkRate" placeholder="Expected return" value="10" step="0.1">
            </div>
        `;

        // Show/hide custom benchmark input
        document.getElementById('benchmark').addEventListener('change', function(e) {
            const customGroup = document.getElementById('customBenchmarkGroup');
            if (customGroup) {
                customGroup.style.display = e.target.value === 'custom' ? 'block' : 'none';
            }
        });
    }

    function calculate() {
        const initialInvestment = parseFloat(document.getElementById('initialInvestment').value) || 0;
        const finalValue = parseFloat(document.getElementById('finalValue').value) || 0;
        const timePeriod = parseFloat(document.getElementById('timePeriod').value) || 1;
        const investmentType = document.getElementById('investmentType').value;
        const additionalInvestments = parseFloat(document.getElementById('additionalInvestments').value) || 0;
        const incomeGenerated = parseFloat(document.getElementById('incomeGenerated').value) || 0;
        const inflationRate = parseFloat(document.getElementById('inflationRate').value) || 6;
        const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
        const benchmark = document.getElementById('benchmark').value;
        const customBenchmarkRate = parseFloat(document.getElementById('customBenchmarkRate').value) || 10;

        if (initialInvestment <= 0) {
            alert('Please enter valid initial investment');
            return;
        }

        if (timePeriod <= 0) {
            alert('Please enter valid time period');
            return;
        }

        // Calculate total investment
        const totalInvestment = initialInvestment + additionalInvestments;

        // Calculate absolute gain/loss
        const absoluteGain = finalValue - totalInvestment + incomeGenerated;
        const absoluteGainPercent = (absoluteGain / totalInvestment) * 100;

        // Calculate simple ROI
        const simpleROI = ((finalValue - totalInvestment + incomeGenerated) / totalInvestment) * 100;

        // Calculate annualized ROI
        const annualizedROI = (Math.pow((finalValue + incomeGenerated) / totalInvestment, 1/timePeriod) - 1) * 100;

        // Calculate CAGR (Compound Annual Growth Rate)
        const cagr = (Math.pow(finalValue / initialInvestment, 1/timePeriod) - 1) * 100;

        // Tax calculations
        const taxableGain = Math.max(0, absoluteGain);
        const taxAmount = taxableGain * (taxRate / 100);
        const gainAfterTax = absoluteGain - taxAmount;
        const roiAfterTax = (gainAfterTax / totalInvestment) * 100;

        // Inflation-adjusted returns
        const realROI = ((1 + annualizedROI/100) / (1 + inflationRate/100) - 1) * 100;
        const inflationAdjustedValue = finalValue / Math.pow(1 + inflationRate/100, timePeriod);
        const realGain = inflationAdjustedValue - totalInvestment;
        const purchasingPowerLoss = finalValue - inflationAdjustedValue;

        // Benchmark comparison
        let benchmarkRate = 0;
        let benchmarkName = '';
        if (benchmark === 'nifty') {
            benchmarkRate = 12;
            benchmarkName = 'Nifty 50';
        } else if (benchmark === 'sensex') {
            benchmarkRate = 11;
            benchmarkName = 'Sensex';
        } else if (benchmark === 'fd') {
            benchmarkRate = 7;
            benchmarkName = 'Fixed Deposit';
        } else if (benchmark === 'gold') {
            benchmarkRate = 8;
            benchmarkName = 'Gold';
        } else if (benchmark === 'custom') {
            benchmarkRate = customBenchmarkRate;
            benchmarkName = 'Custom Benchmark';
        }

        const benchmarkValue = benchmark !== 'none' ?
            totalInvestment * Math.pow(1 + benchmarkRate/100, timePeriod) : 0;
        const benchmarkGain = benchmarkValue - totalInvestment;
        const alpha = annualizedROI - benchmarkRate;

        // Risk-adjusted return (Sharpe-like ratio simplified)
        const excessReturn = annualizedROI - 7; // Assuming 7% risk-free rate (FD)
        const sharpeRatio = excessReturn / 10; // Simplified, assuming 10% volatility

        // Doubling/Tripling time
        const doublingTime = timePeriod > 0 ? 72 / annualizedROI : 0;
        const triplingTime = timePeriod > 0 ? Math.log(3) / Math.log(1 + annualizedROI/100) : 0;

        // Future projections
        const projectionYears = [5, 10, 15, 20];
        const projections = projectionYears.map(years => {
            const futureValue = finalValue * Math.pow(1 + annualizedROI/100, years);
            const futureInvestment = totalInvestment * Math.pow(1 + annualizedROI/100, years + timePeriod);
            return {
                years,
                value: futureValue,
                investmentValue: futureInvestment
            };
        });

        // Multiple investments comparison
        const comparisonInvestments = [
            { name: 'Equity (Nifty)', rate: 12 },
            { name: 'Debt (FD)', rate: 7 },
            { name: 'Gold', rate: 8 },
            { name: 'Real Estate', rate: 9 },
            { name: 'PPF', rate: 7.1 }
        ];

        const comparisons = comparisonInvestments.map(inv => {
            const value = totalInvestment * Math.pow(1 + inv.rate/100, timePeriod);
            const gain = value - totalInvestment;
            return {
                name: inv.name,
                rate: inv.rate,
                value,
                gain,
                comparison: gain > absoluteGain ? 'Better' : gain < absoluteGain ? 'Worse' : 'Same'
            };
        });

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Total ROI</span>
                    <span class="result-value" style="color: ${simpleROI > 0 ? '#10B981' : '#EF4444'}">${simpleROI.toFixed(2)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Annualized ROI</span>
                    <span class="result-value">${annualizedROI.toFixed(2)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Absolute Gain</span>
                    <span class="result-value" style="color: ${absoluteGain > 0 ? '#10B981' : '#EF4444'}">₹${absoluteGain.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Investment Summary</h3>
                    <div class="breakdown-item">
                        <span>Initial Investment:</span>
                        <span>₹${initialInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Additional Investments:</span>
                        <span>₹${additionalInvestments.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Investment:</span>
                        <span>₹${totalInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Current Value:</span>
                        <span>₹${finalValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Income Generated:</span>
                        <span>₹${incomeGenerated.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Time Period:</span>
                        <span>${timePeriod} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Investment Type:</span>
                        <span>${investmentType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Returns Analysis</h3>
                    <div class="breakdown-item">
                        <span>Absolute Gain/Loss:</span>
                        <span style="color: ${absoluteGain > 0 ? '#10B981' : '#EF4444'}">₹${absoluteGain.toLocaleString('en-IN', {maximumFractionDigits: 0})} (${absoluteGainPercent.toFixed(2)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Simple ROI:</span>
                        <span style="color: ${simpleROI > 0 ? '#10B981' : '#EF4444'}">${simpleROI.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annualized ROI:</span>
                        <span>${annualizedROI.toFixed(2)}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>CAGR:</span>
                        <span>${cagr.toFixed(2)}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Performance:</span>
                        <span style="color: ${annualizedROI > 12 ? '#10B981' : annualizedROI > 8 ? '#3B82F6' : annualizedROI > 5 ? '#F59E0B' : '#EF4444'}">
                            ${annualizedROI > 12 ? 'Excellent' : annualizedROI > 8 ? 'Good' : annualizedROI > 5 ? 'Average' : 'Below Average'}
                        </span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Impact</h3>
                    <div class="breakdown-item">
                        <span>Taxable Gain:</span>
                        <span>₹${taxableGain.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Rate:</span>
                        <span>${taxRate}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Amount:</span>
                        <span>₹${taxAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Gain After Tax:</span>
                        <span style="color: ${gainAfterTax > 0 ? '#10B981' : '#EF4444'}">₹${gainAfterTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>ROI After Tax:</span>
                        <span>${roiAfterTax.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Effective Annual Return (Post-tax):</span>
                        <span>${((roiAfterTax / timePeriod)).toFixed(2)}% p.a.</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Inflation-Adjusted Returns</h3>
                    <div class="breakdown-item">
                        <span>Inflation Rate:</span>
                        <span>${inflationRate}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Real ROI (Inflation-adjusted):</span>
                        <span style="color: ${realROI > 0 ? '#10B981' : '#EF4444'}">${realROI.toFixed(2)}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Inflation-Adjusted Value:</span>
                        <span>₹${inflationAdjustedValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Real Gain (Purchasing Power):</span>
                        <span style="color: ${realGain > 0 ? '#10B981' : '#EF4444'}">₹${realGain.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Purchasing Power Loss:</span>
                        <span>₹${purchasingPowerLoss.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interpretation:</span>
                        <span>${realROI > 3 ? 'Beating inflation significantly ✓' : realROI > 0 ? 'Beating inflation ✓' : 'Losing to inflation ✗'}</span>
                    </div>
                </div>
                ${benchmark !== 'none' ? `
                <div class="result-breakdown">
                    <h3>Benchmark Comparison (${benchmarkName})</h3>
                    <div class="breakdown-item">
                        <span>Your Annualized Return:</span>
                        <span>${annualizedROI.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>${benchmarkName} Return:</span>
                        <span>${benchmarkRate.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Alpha (Excess Return):</span>
                        <span style="color: ${alpha > 0 ? '#10B981' : '#EF4444'}">${alpha > 0 ? '+' : ''}${alpha.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Your Value:</span>
                        <span>₹${finalValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>${benchmarkName} Value:</span>
                        <span>₹${benchmarkValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Performance vs Benchmark:</span>
                        <span style="color: ${alpha > 0 ? '#10B981' : '#EF4444'}">
                            ${alpha > 0 ? 'Outperformed by ' + alpha.toFixed(2) + '%' : 'Underperformed by ' + Math.abs(alpha).toFixed(2) + '%'}
                        </span>
                    </div>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>Time Value Metrics</h3>
                    <div class="breakdown-item">
                        <span>Doubling Time:</span>
                        <span>${doublingTime > 0 && doublingTime < 100 ? doublingTime.toFixed(1) + ' years' : 'N/A'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tripling Time:</span>
                        <span>${triplingTime > 0 && triplingTime < 100 ? triplingTime.toFixed(1) + ' years' : 'N/A'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Rule of 72 (Doubling):</span>
                        <span>${annualizedROI > 0 ? (72/annualizedROI).toFixed(1) + ' years' : 'N/A'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Risk-free Rate:</span>
                        <span>7% (FD rate)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Excess Return:</span>
                        <span>${excessReturn.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Sharpe Ratio (Simplified):</span>
                        <span>${sharpeRatio.toFixed(2)} ${sharpeRatio > 1 ? '(Good)' : sharpeRatio > 0.5 ? '(Average)' : '(Poor)'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Multiple Investment Comparison</h3>
                    ${comparisons.map(comp => `
                        <div class="breakdown-item">
                            <span>${comp.name} @ ${comp.rate}%:</span>
                            <span style="color: ${comp.comparison === 'Worse' ? '#10B981' : comp.comparison === 'Better' ? '#EF4444' : '#6B7280'}">
                                ₹${comp.value.toLocaleString('en-IN', {maximumFractionDigits: 0})} (${comp.comparison})
                            </span>
                        </div>
                    `).join('')}
                </div>
                <div class="result-breakdown">
                    <h3>Future Projections (Continuing @ ${annualizedROI.toFixed(1)}%)</h3>
                    ${projections.map(proj => `
                        <div class="breakdown-item">
                            <span>After ${proj.years} more years:</span>
                            <span>₹${proj.value.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="result-breakdown">
                    <h3>Investment Assessment</h3>
                    <div class="breakdown-item">
                        <span>Overall Rating:</span>
                        <span style="color: ${annualizedROI > 15 ? '#10B981' : annualizedROI > 10 ? '#3B82F6' : annualizedROI > 6 ? '#F59E0B' : '#EF4444'}">
                            ${annualizedROI > 15 ? 'Excellent ⭐⭐⭐⭐⭐' : annualizedROI > 10 ? 'Very Good ⭐⭐⭐⭐' : annualizedROI > 6 ? 'Good ⭐⭐⭐' : annualizedROI > 3 ? 'Fair ⭐⭐' : 'Poor ⭐'}
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Beats Inflation:</span>
                        <span style="color: ${realROI > 0 ? '#10B981' : '#EF4444'}">${realROI > 0 ? 'Yes ✓' : 'No ✗'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Beats FD (7%):</span>
                        <span style="color: ${annualizedROI > 7 ? '#10B981' : '#EF4444'}">${annualizedROI > 7 ? 'Yes ✓' : 'No ✗'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Risk Category:</span>
                        <span>${investmentType === 'stocks' || investmentType === 'crypto' ? 'High Risk' : investmentType === 'mutual-funds' || investmentType === 'real-estate' ? 'Medium Risk' : 'Low Risk'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Recommendation:</span>
                        <span>${annualizedROI > 12 ? 'Continue holding' : annualizedROI > 8 ? 'Monitor performance' : annualizedROI > 5 ? 'Consider alternatives' : 'Review investment strategy'}</span>
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
            trackCalculation('roi', {
                initialInvestment,
                finalValue,
                absoluteGain,
                annualizedROI,
                cagr
            }, {
                value: 'high-cpc',
                investmentInLakhs: initialInvestment/100000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for roi calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
