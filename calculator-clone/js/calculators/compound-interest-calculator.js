/**
 * Compound Interest Calculator - Redesigned with calculator.net style
 * Features: Exponential growth visualization, interactive sliders, CI vs SI comparison
 */

(function() {
    'use strict';

    // Add embedded styles
    const styles = `
        <style>
            .ci-calculator-container {
                max-width: 1000px;
                margin: 0 auto;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }

            .ci-input-section {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 25px;
            }

            .ci-input-group {
                margin-bottom: 20px;
            }

            .ci-label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #374151;
            }

            .label-value {
                color: #6366f1;
                font-weight: 600;
                font-size: 15px;
            }

            .slider-input-combo {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 12px;
                align-items: center;
            }

            .ci-slider {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: linear-gradient(to right, #ddd6fe, #6366f1);
                outline: none;
                -webkit-appearance: none;
            }

            .ci-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #6366f1;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .ci-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #6366f1;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .ci-number-input {
                width: 140px;
                padding: 8px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                text-align: right;
                transition: border-color 0.3s ease;
            }

            .ci-number-input:focus {
                outline: none;
                border-color: #6366f1;
            }

            .ci-select {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                background: white;
                cursor: pointer;
                transition: border-color 0.3s ease;
            }

            .ci-select:focus {
                outline: none;
                border-color: #6366f1;
            }

            .frequency-buttons {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 8px;
            }

            .frequency-btn {
                padding: 10px 8px;
                border: 2px solid #e5e7eb;
                background: white;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 500;
                color: #6b7280;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .frequency-btn:hover {
                border-color: #6366f1;
                color: #6366f1;
            }

            .frequency-btn.active {
                background: linear-gradient(135deg, #6366f1, #4f46e5);
                color: white;
                border-color: #6366f1;
            }

            .calculate-btn {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #6366f1, #4f46e5);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            }

            .calculate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
            }

            .ci-results {
                margin-top: 30px;
            }

            .main-ci-card {
                background: linear-gradient(135deg, #6366f1, #4f46e5);
                color: white;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 25px;
                box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
            }

            .main-ci-label {
                font-size: 16px;
                opacity: 0.95;
                margin-bottom: 8px;
            }

            .main-ci-value {
                font-size: 42px;
                font-weight: 700;
                margin-bottom: 15px;
            }

            .growth-badge {
                display: inline-block;
                padding: 6px 16px;
                background: rgba(255, 255, 255, 0.25);
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
            }

            .ci-breakdown-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 15px;
                margin-bottom: 25px;
            }

            .ci-breakdown-card {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                border-left: 4px solid #6366f1;
            }

            .ci-breakdown-label {
                font-size: 13px;
                color: #6b7280;
                margin-bottom: 6px;
            }

            .ci-breakdown-value {
                font-size: 22px;
                font-weight: 700;
                color: #1f2937;
            }

            .ci-section {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 25px;
            }

            .section-title {
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .investment-breakdown-bar {
                height: 60px;
                background: #f3f4f6;
                border-radius: 10px;
                overflow: hidden;
                display: flex;
                margin: 20px 0;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }

            .bar-principal {
                background: linear-gradient(135deg, #6366f1, #4f46e5);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.5s ease;
            }

            .bar-interest {
                background: linear-gradient(135deg, #10b981, #059669);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.5s ease;
            }

            .growth-chart-container {
                margin-top: 25px;
            }

            .growth-chart-row {
                margin-bottom: 15px;
            }

            .growth-chart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;
                font-size: 13px;
            }

            .growth-year {
                font-weight: 600;
                color: #4b5563;
            }

            .growth-amount {
                font-weight: 600;
                color: #6366f1;
            }

            .growth-chart-bar {
                height: 35px;
                background: #f3f4f6;
                border-radius: 8px;
                overflow: hidden;
                position: relative;
                display: flex;
            }

            .growth-bar-principal {
                background: linear-gradient(90deg, #6366f1, #4f46e5);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 11px;
                font-weight: 600;
            }

            .growth-bar-interest {
                background: linear-gradient(90deg, #10b981, #059669);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 11px;
                font-weight: 600;
            }

            .ci-detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background: #f9fafb;
                border-radius: 8px;
                font-size: 14px;
                margin-bottom: 8px;
            }

            .ci-detail-row.highlight {
                background: #ede9fe;
                border: 2px solid #c7d2fe;
                font-weight: 600;
                color: #4338ca;
            }

            .ci-detail-label {
                color: #4b5563;
            }

            .ci-detail-value {
                font-weight: 600;
                color: #1f2937;
            }

            .comparison-section {
                background: linear-gradient(135deg, #fef3c7, #fde68a);
                padding: 20px;
                border-radius: 10px;
                margin-top: 20px;
            }

            .comparison-title {
                font-weight: 600;
                color: #92400e;
                margin-bottom: 15px;
                font-size: 15px;
            }

            .comparison-bars {
                display: grid;
                gap: 15px;
            }

            .comparison-bar-row {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .comparison-label {
                min-width: 120px;
                font-size: 13px;
                font-weight: 600;
                color: #78350f;
            }

            .comparison-bar-track {
                flex: 1;
                height: 35px;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .comparison-bar-fill-ci {
                height: 100%;
                background: linear-gradient(90deg, #6366f1, #4f46e5);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: 600;
            }

            .comparison-bar-fill-si {
                height: 100%;
                background: linear-gradient(90deg, #14b8a6, #0d9488);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: 600;
            }

            .power-of-compounding {
                background: #eff6ff;
                border-left: 4px solid #3b82f6;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
            }

            .power-title {
                font-weight: 600;
                color: #1e40af;
                margin-bottom: 8px;
                font-size: 14px;
            }

            .power-text {
                font-size: 13px;
                color: #1e40af;
                line-height: 1.6;
            }

            @media (max-width: 768px) {
                .main-ci-value {
                    font-size: 32px;
                }

                .ci-breakdown-grid {
                    grid-template-columns: 1fr;
                }

                .ci-number-input {
                    width: 100px;
                }

                .slider-input-combo {
                    grid-template-columns: 1fr;
                }

                .frequency-buttons {
                    grid-template-columns: repeat(2, 1fr);
                }

                .comparison-bar-row {
                    flex-direction: column;
                    align-items: stretch;
                }

                .comparison-label {
                    min-width: auto;
                }
            }
        </style>
    `;

    let currentFrequency = 4;

    function init() {
        createCalculatorInterface();
        setupEventListeners();
    }

    function createCalculatorInterface() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = styles + `
            <div class="ci-calculator-container">
                <div class="ci-input-section">
                    <div class="ci-input-group">
                        <div class="ci-label">
                            <span>Principal Amount</span>
                            <span class="label-value" id="principalDisplay">₹1,00,000</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="ci-slider" id="principalSlider"
                                   min="10000" max="10000000" step="10000" value="100000">
                            <input type="number" class="ci-number-input" id="principalInput"
                                   value="100000" min="10000" max="10000000" step="10000">
                        </div>
                    </div>

                    <div class="ci-input-group">
                        <div class="ci-label">
                            <span>Annual Interest Rate</span>
                            <span class="label-value" id="rateDisplay">8%</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="ci-slider" id="rateSlider"
                                   min="1" max="30" step="0.1" value="8">
                            <input type="number" class="ci-number-input" id="rateInput"
                                   value="8" min="1" max="30" step="0.1">
                        </div>
                    </div>

                    <div class="ci-input-group">
                        <div class="ci-label">
                            <span>Time Period (Years)</span>
                            <span class="label-value" id="timeDisplay">5 Years</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="ci-slider" id="timeSlider"
                                   min="1" max="30" step="1" value="5">
                            <input type="number" class="ci-number-input" id="timeInput"
                                   value="5" min="1" max="30" step="1">
                        </div>
                    </div>

                    <div class="ci-input-group">
                        <div class="ci-label">
                            <span>Compounding Frequency</span>
                        </div>
                        <div class="frequency-buttons">
                            <button class="frequency-btn" data-freq="1">Yearly</button>
                            <button class="frequency-btn" data-freq="2">Half-Yearly</button>
                            <button class="frequency-btn active" data-freq="4">Quarterly</button>
                            <button class="frequency-btn" data-freq="12">Monthly</button>
                            <button class="frequency-btn" data-freq="365">Daily</button>
                        </div>
                    </div>

                    <div class="ci-input-group">
                        <div class="ci-label">
                            <span>Monthly Contribution (Optional)</span>
                            <span class="label-value" id="contributionDisplay">₹0</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="ci-slider" id="contributionSlider"
                                   min="0" max="50000" step="500" value="0">
                            <input type="number" class="ci-number-input" id="contributionInput"
                                   value="0" min="0" max="100000" step="500">
                        </div>
                    </div>

                    <button class="calculate-btn" id="calculateBtn">
                        📈 Calculate Compound Interest
                    </button>
                </div>

                <div id="ciResults"></div>
            </div>
        `;
    }

    function setupEventListeners() {
        // Frequency buttons
        document.querySelectorAll('.frequency-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.frequency-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                currentFrequency = parseInt(e.currentTarget.dataset.freq);
            });
        });

        // Principal slider and input sync
        syncSliderAndInput('principal', 'principalSlider', 'principalInput', 'principalDisplay', (val) => `₹${formatNumber(val)}`);

        // Rate slider and input sync
        syncSliderAndInput('rate', 'rateSlider', 'rateInput', 'rateDisplay', (val) => `${val}%`);

        // Time slider and input sync
        syncSliderAndInput('time', 'timeSlider', 'timeInput', 'timeDisplay', (val) => `${val} Years`);

        // Contribution slider and input sync
        syncSliderAndInput('contribution', 'contributionSlider', 'contributionInput', 'contributionDisplay', (val) => `₹${formatNumber(val)}`);

        // Calculate button
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculate);
        }

        // Enter key to calculate
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculate();
        });
    }

    function syncSliderAndInput(name, sliderId, inputId, displayId, formatFn) {
        const slider = document.getElementById(sliderId);
        const input = document.getElementById(inputId);
        const display = document.getElementById(displayId);

        if (slider && input && display) {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                input.value = value;
                display.textContent = formatFn(value);
            });

            input.addEventListener('input', (e) => {
                const value = e.target.value;
                slider.value = value;
                display.textContent = formatFn(value);
            });
        }
    }

    function calculate() {
        const principal = parseFloat(document.getElementById('principalInput').value) || 0;
        const rate = parseFloat(document.getElementById('rateInput').value) || 0;
        const time = parseFloat(document.getElementById('timeInput').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('contributionInput').value) || 0;

        if (principal <= 0) {
            alert('Please enter a valid principal amount');
            return;
        }

        if (rate <= 0) {
            alert('Please enter a valid interest rate');
            return;
        }

        if (time <= 0) {
            alert('Please enter a valid time period');
            return;
        }

        // Compound Interest Formula: A = P(1 + r/n)^(nt)
        const r = rate / 100;
        const n = currentFrequency;
        const t = time;

        // Calculate compound interest on principal
        const compoundAmount = principal * Math.pow((1 + r/n), (n*t));
        const compoundInterest = compoundAmount - principal;

        // Calculate with monthly contributions
        let totalWithContributions = compoundAmount;
        let totalContributions = 0;
        let interestOnContributions = 0;

        if (monthlyContribution > 0) {
            totalContributions = monthlyContribution * 12 * time;
            const monthlyRate = r / 12;
            const months = time * 12;
            const contributionAmount = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
            interestOnContributions = contributionAmount - totalContributions;
            totalWithContributions = compoundAmount + contributionAmount;
        }

        const totalInterest = compoundInterest + interestOnContributions;
        const totalInvested = principal + totalContributions;
        const totalGrowth = ((totalWithContributions - totalInvested) / totalInvested) * 100;

        // Simple Interest for comparison
        const simpleInterest = principal * r * t;
        const simpleAmount = principal + simpleInterest;
        const compoundAdvantage = compoundInterest - simpleInterest;
        const advantagePercent = (compoundAdvantage / simpleInterest) * 100;

        // Effective Annual Rate
        const effectiveRate = (Math.pow(1 + r/n, n) - 1) * 100;

        // Year-wise breakdown
        const years = Math.ceil(time);
        let yearWiseData = [];
        for (let i = 1; i <= Math.min(years, 10); i++) {
            const yearAmount = principal * Math.pow((1 + r/n), (n*i));
            const yearInterest = yearAmount - principal;

            let yearTotal = yearAmount;
            let yearTotalInvested = principal;

            if (monthlyContribution > 0) {
                const monthsElapsed = i * 12;
                const monthlyRate = r / 12;
                const yearContribution = monthlyContribution * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate);
                yearTotal = yearAmount + yearContribution;
                yearTotalInvested = principal + (monthlyContribution * monthsElapsed);
            }

            yearWiseData.push({
                year: i,
                principal: yearTotalInvested,
                total: yearTotal,
                interest: yearTotal - yearTotalInvested
            });
        }

        displayResults(principal, rate, time, currentFrequency, monthlyContribution,
                      compoundAmount, compoundInterest, totalWithContributions, totalInterest,
                      totalInvested, totalGrowth, simpleAmount, simpleInterest, compoundAdvantage,
                      advantagePercent, effectiveRate, yearWiseData, totalContributions, interestOnContributions);
    }

    function displayResults(principal, rate, time, frequency, monthlyContribution,
                           compoundAmount, compoundInterest, totalWithContributions, totalInterest,
                           totalInvested, totalGrowth, simpleAmount, simpleInterest, compoundAdvantage,
                           advantagePercent, effectiveRate, yearWiseData, totalContributions, interestOnContributions) {

        const frequencyLabel = frequency === 1 ? 'Yearly' : frequency === 2 ? 'Half-Yearly' :
                              frequency === 4 ? 'Quarterly' : frequency === 12 ? 'Monthly' : 'Daily';

        // Calculate percentages for breakdown bar
        const principalPercent = (totalInvested / totalWithContributions) * 100;
        const interestPercent = (totalInterest / totalWithContributions) * 100;

        // Find max for chart scaling
        const maxAmount = Math.max(...yearWiseData.map(d => d.total));

        // Generate growth chart
        const growthChartHTML = yearWiseData.map(data => {
            const barWidth = (data.total / maxAmount) * 100;
            const principalWidth = (data.principal / data.total) * 100;
            const interestWidth = (data.interest / data.total) * 100;

            return `
                <div class="growth-chart-row">
                    <div class="growth-chart-header">
                        <span class="growth-year">Year ${data.year}</span>
                        <span class="growth-amount">₹${formatNumber(data.total.toFixed(0))}</span>
                    </div>
                    <div class="growth-chart-bar">
                        <div class="growth-bar-principal" style="width: ${principalWidth}%;">
                            ${principalWidth > 15 ? '₹' + formatNumber(data.principal.toFixed(0)) : ''}
                        </div>
                        <div class="growth-bar-interest" style="width: ${interestWidth}%;">
                            ${interestWidth > 15 ? '₹' + formatNumber(data.interest.toFixed(0)) : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Comparison bars
        const ciBarWidth = 100;
        const siBarWidth = (simpleAmount / compoundAmount) * 100;

        const resultsDiv = document.getElementById('ciResults');
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <div class="ci-results">
                    <div class="main-ci-card">
                        <div class="main-ci-label">💰 Final Amount</div>
                        <div class="main-ci-value">₹${formatNumber(totalWithContributions.toFixed(0))}</div>
                        <div class="growth-badge">Growth: ${totalGrowth.toFixed(1)}%</div>
                    </div>

                    <div class="ci-breakdown-grid">
                        <div class="ci-breakdown-card">
                            <div class="ci-breakdown-label">Total Invested</div>
                            <div class="ci-breakdown-value">₹${formatNumber(totalInvested.toFixed(0))}</div>
                        </div>
                        <div class="ci-breakdown-card">
                            <div class="ci-breakdown-label">Total Interest</div>
                            <div class="ci-breakdown-value" style="color: #10b981;">₹${formatNumber(totalInterest.toFixed(0))}</div>
                        </div>
                        <div class="ci-breakdown-card">
                            <div class="ci-breakdown-label">Effective Rate</div>
                            <div class="ci-breakdown-value">${effectiveRate.toFixed(2)}%</div>
                        </div>
                    </div>

                    <div class="ci-section">
                        <div class="section-title">
                            📊 Investment Breakdown
                        </div>
                        <div class="investment-breakdown-bar">
                            <div class="bar-principal" style="width: ${principalPercent}%;">
                                Principal: ₹${formatNumber(totalInvested.toFixed(0))}
                            </div>
                            <div class="bar-interest" style="width: ${interestPercent}%;">
                                Interest: ₹${formatNumber(totalInterest.toFixed(0))}
                            </div>
                        </div>
                    </div>

                    <div class="ci-section">
                        <div class="section-title">
                            📈 Year-wise Growth
                        </div>
                        <div class="growth-chart-container">
                            ${growthChartHTML}
                        </div>
                    </div>

                    <div class="ci-section">
                        <div class="section-title">
                            🧮 Calculation Details
                        </div>
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Principal Amount</span>
                            <span class="ci-detail-value">₹${formatNumber(principal)}</span>
                        </div>
                        ${monthlyContribution > 0 ? `
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Monthly Contribution</span>
                            <span class="ci-detail-value">₹${formatNumber(monthlyContribution)}</span>
                        </div>
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Total Contributions (${time} years)</span>
                            <span class="ci-detail-value">₹${formatNumber(totalContributions.toFixed(0))}</span>
                        </div>
                        ` : ''}
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Interest Rate</span>
                            <span class="ci-detail-value">${rate}% per annum</span>
                        </div>
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Compounding</span>
                            <span class="ci-detail-value">${frequencyLabel}</span>
                        </div>
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Time Period</span>
                            <span class="ci-detail-value">${time} years</span>
                        </div>
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Effective Annual Rate (EAR)</span>
                            <span class="ci-detail-value">${effectiveRate.toFixed(2)}%</span>
                        </div>
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Interest on Principal</span>
                            <span class="ci-detail-value" style="color: #10b981;">₹${formatNumber(compoundInterest.toFixed(0))}</span>
                        </div>
                        ${monthlyContribution > 0 ? `
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Interest on Contributions</span>
                            <span class="ci-detail-value" style="color: #10b981;">₹${formatNumber(interestOnContributions.toFixed(0))}</span>
                        </div>
                        ` : ''}
                        <div class="ci-detail-row highlight">
                            <span class="ci-detail-label">Total Interest Earned</span>
                            <span class="ci-detail-value">₹${formatNumber(totalInterest.toFixed(0))}</span>
                        </div>
                        <div class="ci-detail-row highlight">
                            <span class="ci-detail-label">Final Amount</span>
                            <span class="ci-detail-value">₹${formatNumber(totalWithContributions.toFixed(0))}</span>
                        </div>
                    </div>

                    <div class="ci-section">
                        <div class="section-title">
                            ⚖️ Compound vs Simple Interest
                        </div>
                        <div class="comparison-section">
                            <div class="comparison-title">Interest Comparison (on Principal)</div>
                            <div class="comparison-bars">
                                <div class="comparison-bar-row">
                                    <div class="comparison-label">Compound</div>
                                    <div class="comparison-bar-track">
                                        <div class="comparison-bar-fill-ci" style="width: ${ciBarWidth}%;">
                                            ₹${formatNumber(compoundAmount.toFixed(0))}
                                        </div>
                                    </div>
                                </div>
                                <div class="comparison-bar-row">
                                    <div class="comparison-label">Simple</div>
                                    <div class="comparison-bar-track">
                                        <div class="comparison-bar-fill-si" style="width: ${siBarWidth}%;">
                                            ₹${formatNumber(simpleAmount.toFixed(0))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Compound Interest Earned</span>
                            <span class="ci-detail-value">₹${formatNumber(compoundInterest.toFixed(0))}</span>
                        </div>
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Simple Interest (for same period)</span>
                            <span class="ci-detail-value">₹${formatNumber(simpleInterest.toFixed(0))}</span>
                        </div>
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Compound Advantage</span>
                            <span class="ci-detail-value" style="color: #10b981;">
                                ₹${formatNumber(compoundAdvantage.toFixed(0))} (+${advantagePercent.toFixed(1)}%)
                            </span>
                        </div>

                        <div class="power-of-compounding">
                            <div class="power-title">💡 Power of Compounding</div>
                            <div class="power-text">
                                With ${frequencyLabel.toLowerCase()} compounding, your investment earns
                                <strong>₹${formatNumber(compoundAdvantage.toFixed(0))}</strong> more than simple interest.
                                That's <strong>${advantagePercent.toFixed(1)}%</strong> additional returns!
                                The more frequently interest compounds, the faster your money grows.
                                ${monthlyContribution > 0 ? ` Your regular monthly contributions of ₹${formatNumber(monthlyContribution)} add an extra ₹${formatNumber(interestOnContributions.toFixed(0))} in interest.` : ''}
                            </div>
                        </div>
                    </div>

                    <div class="ci-section">
                        <div class="section-title">
                            ℹ️ Key Insights
                        </div>
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Interest Type</span>
                            <span class="ci-detail-value">Compound Interest (Exponential Growth)</span>
                        </div>
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Growth Pattern</span>
                            <span class="ci-detail-value">Interest earns interest</span>
                        </div>
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Best For</span>
                            <span class="ci-detail-value">Long-term wealth building</span>
                        </div>
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Typical Applications</span>
                            <span class="ci-detail-value">FD, PPF, mutual funds, stocks</span>
                        </div>
                        <div class="ci-detail-row">
                            <span class="ci-detail-label">Annual Return</span>
                            <span class="ci-detail-value">${((totalWithContributions / totalInvested - 1) / time * 100).toFixed(2)}% per year</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    function formatNumber(num) {
        return parseFloat(num).toLocaleString('en-IN', { maximumFractionDigits: 0 });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
