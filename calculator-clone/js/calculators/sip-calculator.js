/**
 * Enhanced SIP Calculator - Modern Design
 * Features: Interactive sliders, investment growth visualization, step-up SIP
 */

(function() {
    'use strict';

    function init() {
        createCalculatorInterface();
        setupEventListeners();
    }

    function createCalculatorInterface() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="sip-calculator-container">
                <!-- Monthly Investment -->
                <div class="calc-input-group">
                    <label for="monthly">Monthly Investment (₹)</label>
                    <input type="number" class="calc-input" id="monthly" value="5000" min="500" step="500">
                    <input type="range" class="calc-slider" id="monthlySlider" min="500" max="100000" value="5000" step="500">
                    <div class="slider-labels">
                        <span>₹500</span>
                        <span>₹1L</span>
                    </div>
                </div>

                <!-- Expected Return Rate -->
                <div class="calc-input-group">
                    <label for="rate">Expected Return Rate (% per year)</label>
                    <input type="number" class="calc-input" id="rate" value="12" min="1" max="30" step="0.5">
                    <input type="range" class="calc-slider" id="rateSlider" min="1" max="30" value="12" step="0.5">
                    <div class="slider-labels">
                        <span>1%</span>
                        <span>30%</span>
                    </div>
                </div>

                <!-- Investment Period -->
                <div class="calc-input-group">
                    <label for="years">Investment Period (years)</label>
                    <input type="number" class="calc-input" id="years" value="10" min="1" max="40">
                    <input type="range" class="calc-slider" id="yearsSlider" min="1" max="40" value="10" step="1">
                    <div class="slider-labels">
                        <span>1 Year</span>
                        <span>40 Years</span>
                    </div>
                </div>

                <!-- Step-up SIP (Optional) -->
                <div class="calc-input-group">
                    <label for="stepup">Annual Step-up (% increase per year)</label>
                    <input type="number" class="calc-input" id="stepup" value="0" min="0" max="20" step="1">
                    <input type="range" class="calc-slider" id="stepupSlider" min="0" max="20" value="0" step="1">
                    <div class="slider-labels">
                        <span>0%</span>
                        <span>20%</span>
                    </div>
                </div>

                <!-- Calculate Button -->
                <button type="button" class="btn btn-primary btn-large" id="calculateBtn">
                    <span>Calculate Returns</span>
                </button>
            </div>

            <style>
                .sip-calculator-container {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .calc-slider {
                    width: 100%;
                    height: 8px;
                    border-radius: 5px;
                    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
                    outline: none;
                    margin: 1rem 0 0.5rem 0;
                    -webkit-appearance: none;
                }

                .calc-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    border: 3px solid #10b981;
                }

                .calc-slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    border: 3px solid #10b981;
                }

                .slider-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                    color: #6b7280;
                    margin-top: 0.25rem;
                }

                .btn {
                    width: 100%;
                    padding: 1.2rem 2rem;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 1.5rem;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
                }
            </style>
        `;

        // Hide default calculate button
        const defaultBtn = document.getElementById('calculate');
        if (defaultBtn) {
            defaultBtn.style.display = 'none';
        }
    }

    function setupEventListeners() {
        // Sync sliders with inputs
        document.getElementById('monthlySlider')?.addEventListener('input', function() {
            document.getElementById('monthly').value = this.value;
        });

        document.getElementById('rateSlider')?.addEventListener('input', function() {
            document.getElementById('rate').value = this.value;
        });

        document.getElementById('yearsSlider')?.addEventListener('input', function() {
            document.getElementById('years').value = this.value;
        });

        document.getElementById('stepupSlider')?.addEventListener('input', function() {
            document.getElementById('stepup').value = this.value;
        });

        // Sync inputs with sliders
        document.getElementById('monthly')?.addEventListener('input', function() {
            document.getElementById('monthlySlider').value = this.value;
        });

        document.getElementById('rate')?.addEventListener('input', function() {
            document.getElementById('rateSlider').value = this.value;
        });

        document.getElementById('years')?.addEventListener('input', function() {
            document.getElementById('yearsSlider').value = this.value;
        });

        document.getElementById('stepup')?.addEventListener('input', function() {
            document.getElementById('stepupSlider').value = this.value;
        });

        // Calculate button
        document.getElementById('calculateBtn')?.addEventListener('click', calculate);

        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('calc-input')) {
                calculate();
            }
        });
    }

    function calculate() {
        const monthly = parseFloat(document.getElementById('monthly').value) || 0;
        const annualRate = parseFloat(document.getElementById('rate').value) || 12;
        const years = parseFloat(document.getElementById('years').value) || 10;
        const stepup = parseFloat(document.getElementById('stepup').value) || 0;

        if (monthly <= 0 || annualRate <= 0 || years <= 0) {
            alert('Please enter valid values');
            return;
        }

        const monthlyRate = annualRate / 12 / 100;
        const months = years * 12;

        let futureValue = 0;
        let totalInvested = 0;
        let currentMonthly = monthly;

        // Calculate with step-up
        for (let year = 0; year < years; year++) {
            for (let month = 0; month < 12; month++) {
                const remainingMonths = months - (year * 12 + month);
                futureValue += currentMonthly * Math.pow(1 + monthlyRate, remainingMonths);
                totalInvested += currentMonthly;
            }
            if (stepup > 0 && year < years - 1) {
                currentMonthly = currentMonthly * (1 + stepup/100);
            }
        }

        const totalGains = futureValue - totalInvested;

        displayResults(futureValue, totalInvested, totalGains, monthly, annualRate, years, stepup);

        // Track calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('sip', {
                futureValue: futureValue.toFixed(2),
                totalInvested: totalInvested.toFixed(2),
                totalGains: totalGains.toFixed(2)
            }, {
                monthly: monthly,
                rate: annualRate,
                years: years,
                stepup: stepup
            });
        }
    }

    function displayResults(futureValue, totalInvested, totalGains, monthly, annualRate, years, stepup) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        // Calculate percentages for visualization
        const investedPercent = (totalInvested / futureValue) * 100;
        const gainsPercent = (totalGains / futureValue) * 100;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <!-- Main Result Card -->
            <div class="sip-result-card">
                <div class="result-header">
                    <div class="result-icon">💰</div>
                    <div class="result-title">Maturity Value</div>
                </div>
                <div class="result-amount">₹${formatNumber(futureValue)}</div>
                <div class="result-subtitle">after ${years} years</div>
            </div>

            <!-- Investment Summary Cards -->
            <div class="summary-cards">
                <div class="summary-card invested-card">
                    <div class="card-icon">📊</div>
                    <div class="card-label">Total Invested</div>
                    <div class="card-value">₹${formatNumber(totalInvested)}</div>
                </div>
                <div class="summary-card gains-card">
                    <div class="card-icon">📈</div>
                    <div class="card-label">Total Returns</div>
                    <div class="card-value">₹${formatNumber(totalGains)}</div>
                </div>
            </div>

            <!-- Investment Growth Visualization -->
            <div class="growth-container">
                <h3>Investment Growth Breakdown</h3>
                <div class="growth-bar-wrapper">
                    <div class="growth-bar">
                        <div class="bar-segment invested-segment" style="width: ${investedPercent}%;">
                            <span class="segment-label">${investedPercent.toFixed(1)}%</span>
                        </div>
                        <div class="bar-segment gains-segment" style="width: ${gainsPercent}%;">
                            <span class="segment-label">${gainsPercent.toFixed(1)}%</span>
                        </div>
                    </div>
                    <div class="growth-legend">
                        <div class="legend-item">
                            <span class="legend-color invested-color"></span>
                            <span class="legend-text">Your Investment: ₹${formatNumber(totalInvested)}</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color gains-color"></span>
                            <span class="legend-text">Returns Earned: ₹${formatNumber(totalGains)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Investment Details -->
            <div class="result-breakdown">
                <h3>📋 Investment Details</h3>
                <div class="details-grid">
                    <div class="detail-row">
                        <span>Monthly SIP Amount:</span>
                        <span style="font-weight: 600;">₹${formatNumber(monthly)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Investment Period:</span>
                        <span style="font-weight: 600;">${years} years (${years * 12} months)</span>
                    </div>
                    <div class="detail-row">
                        <span>Expected Return Rate:</span>
                        <span style="font-weight: 600;">${annualRate}% p.a.</span>
                    </div>
                    ${stepup > 0 ? `
                    <div class="detail-row">
                        <span>Annual Step-up:</span>
                        <span style="font-weight: 600;">${stepup}% per year</span>
                    </div>
                    ` : ''}
                    <div class="detail-row">
                        <span>Total Amount Invested:</span>
                        <span style="font-weight: 600;">₹${formatNumber(totalInvested)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Wealth Gained:</span>
                        <span style="font-weight: 600; color: #10b981;">₹${formatNumber(totalGains)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Maturity Amount:</span>
                        <span style="font-weight: 600; color: #0B87BB;">₹${formatNumber(futureValue)}</span>
                    </div>
                </div>
            </div>

            <!-- Year-wise Growth -->
            ${generateYearlyGrowth(monthly, annualRate, years, stepup)}

            <!-- Disclaimer -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1.5rem; margin-top: 2rem; border-radius: 8px;">
                <p style="margin: 0; color: #92400e; font-size: 0.95rem; line-height: 1.6;">
                    <strong>⚠️ Important:</strong> This calculator provides estimates based on the expected rate of return.
                    Actual returns may vary depending on market conditions. Mutual fund investments are subject to market risks.
                    Please read all scheme-related documents carefully before investing.
                </p>
            </div>

            <style>
                .sip-result-card {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border-radius: 16px;
                    padding: 2.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
                    text-align: center;
                }

                .result-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }

                .result-icon {
                    font-size: 2rem;
                }

                .result-title {
                    font-size: 1.1rem;
                    opacity: 0.95;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .result-amount {
                    font-size: 3.5rem;
                    font-weight: 700;
                    line-height: 1;
                    margin: 1rem 0;
                }

                .result-subtitle {
                    font-size: 1rem;
                    opacity: 0.9;
                }

                .summary-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .summary-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    border-left: 4px solid;
                    text-align: center;
                }

                .invested-card {
                    border-left-color: #6366f1;
                }

                .gains-card {
                    border-left-color: #10b981;
                }

                .card-icon {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }

                .card-label {
                    font-size: 0.85rem;
                    color: #6b7280;
                    margin-bottom: 0.5rem;
                }

                .card-value {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1f2937;
                }

                /* Growth Visualization */
                .growth-container {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .growth-container h3 {
                    margin-bottom: 1.5rem;
                    color: #1f2937;
                }

                .growth-bar-wrapper {
                    margin-top: 1.5rem;
                }

                .growth-bar {
                    display: flex;
                    height: 80px;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    margin-bottom: 1.5rem;
                }

                .bar-segment {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    position: relative;
                    transition: all 0.3s;
                }

                .invested-segment {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                }

                .gains-segment {
                    background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
                }

                .segment-label {
                    font-size: 1.1rem;
                }

                .growth-legend {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .legend-color {
                    width: 20px;
                    height: 20px;
                    border-radius: 4px;
                }

                .invested-color {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                }

                .gains-color {
                    background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
                }

                .legend-text {
                    font-size: 0.95rem;
                    color: #4b5563;
                    font-weight: 500;
                }

                .details-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-top: 1rem;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.75rem;
                    background: #f9fafb;
                    border-radius: 6px;
                }

                .yearly-growth-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 1rem;
                }

                .yearly-growth-table th {
                    background: #f3f4f6;
                    padding: 0.75rem;
                    text-align: left;
                    font-size: 0.85rem;
                    color: #4b5563;
                    border-bottom: 2px solid #e5e7eb;
                }

                .yearly-growth-table td {
                    padding: 0.75rem;
                    border-bottom: 1px solid #e5e7eb;
                    font-size: 0.9rem;
                }

                .yearly-growth-table tr:hover {
                    background: #f9fafb;
                }

                @media (max-width: 768px) {
                    .result-amount {
                        font-size: 2.5rem;
                    }

                    .summary-cards {
                        grid-template-columns: 1fr;
                    }

                    .growth-bar {
                        height: 60px;
                    }

                    .segment-label {
                        font-size: 0.9rem;
                    }

                    .yearly-growth-table {
                        font-size: 0.75rem;
                    }

                    .yearly-growth-table th,
                    .yearly-growth-table td {
                        padding: 0.5rem;
                    }
                }
            </style>
        `;

        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function generateYearlyGrowth(monthly, annualRate, years, stepup) {
        const monthlyRate = annualRate / 12 / 100;
        let currentMonthly = monthly;

        let html = `
            <div class="result-breakdown">
                <h3>📊 Year-wise Investment Growth</h3>
                <div style="overflow-x: auto;">
                    <table class="yearly-growth-table">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Invested (₹)</th>
                                <th>Returns (₹)</th>
                                <th>Total Value (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        let totalInvested = 0;
        let totalValue = 0;

        for (let year = 1; year <= years; year++) {
            let yearInvested = 0;

            for (let month = 0; month < 12; month++) {
                const remainingMonths = (years * 12) - ((year - 1) * 12 + month);
                totalValue += currentMonthly * Math.pow(1 + monthlyRate, remainingMonths);
                yearInvested += currentMonthly;
            }

            totalInvested += yearInvested;
            const returns = totalValue - totalInvested;

            html += `
                <tr>
                    <td><strong>${year}</strong></td>
                    <td>₹${formatNumber(yearInvested)}</td>
                    <td style="color: #10b981;">₹${formatNumber(returns)}</td>
                    <td><strong>₹${formatNumber(totalValue)}</strong></td>
                </tr>
            `;

            if (stepup > 0 && year < years) {
                currentMonthly = currentMonthly * (1 + stepup/100);
            }
        }

        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        return html;
    }

    function formatNumber(num) {
        return Math.round(num).toLocaleString('en-IN');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
