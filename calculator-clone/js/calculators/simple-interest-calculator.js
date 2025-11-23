/**
 * Simple Interest Calculator - Redesigned with calculator.net style
 * Features: Visual timeline, growth chart, SI vs CI comparison
 */

(function() {
    'use strict';

    // Add embedded styles
    const styles = `
        <style>
            .si-calculator-container {
                max-width: 1000px;
                margin: 0 auto;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }

            .si-input-section {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 25px;
            }

            .si-input-group {
                margin-bottom: 20px;
            }

            .si-label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #374151;
            }

            .label-value {
                color: #14b8a6;
                font-weight: 600;
                font-size: 15px;
            }

            .slider-input-combo {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 12px;
                align-items: center;
            }

            .si-slider {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: linear-gradient(to right, #ccfbf1, #14b8a6);
                outline: none;
                -webkit-appearance: none;
            }

            .si-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #14b8a6;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .si-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #14b8a6;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .si-number-input {
                width: 140px;
                padding: 8px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                text-align: right;
                transition: border-color 0.3s ease;
            }

            .si-number-input:focus {
                outline: none;
                border-color: #14b8a6;
            }

            .si-select {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                background: white;
                cursor: pointer;
                transition: border-color 0.3s ease;
            }

            .si-select:focus {
                outline: none;
                border-color: #14b8a6;
            }

            .time-unit-buttons {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
            }

            .time-unit-btn {
                padding: 10px;
                border: 2px solid #e5e7eb;
                background: white;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 500;
                color: #6b7280;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .time-unit-btn:hover {
                border-color: #14b8a6;
                color: #14b8a6;
            }

            .time-unit-btn.active {
                background: linear-gradient(135deg, #14b8a6, #06b6d4);
                color: white;
                border-color: #14b8a6;
            }

            .calculate-btn {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #14b8a6, #06b6d4);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
            }

            .calculate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(20, 184, 166, 0.4);
            }

            .si-results {
                margin-top: 30px;
            }

            .main-si-card {
                background: linear-gradient(135deg, #14b8a6, #06b6d4);
                color: white;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 25px;
                box-shadow: 0 8px 20px rgba(20, 184, 166, 0.3);
            }

            .main-si-label {
                font-size: 16px;
                opacity: 0.95;
                margin-bottom: 8px;
            }

            .main-si-value {
                font-size: 42px;
                font-weight: 700;
                margin-bottom: 15px;
            }

            .roi-badge {
                display: inline-block;
                padding: 6px 16px;
                background: rgba(255, 255, 255, 0.25);
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
            }

            .si-breakdown-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 15px;
                margin-bottom: 25px;
            }

            .si-breakdown-card {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                border-left: 4px solid #14b8a6;
            }

            .si-breakdown-label {
                font-size: 13px;
                color: #6b7280;
                margin-bottom: 6px;
            }

            .si-breakdown-value {
                font-size: 22px;
                font-weight: 700;
                color: #1f2937;
            }

            .si-section {
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

            .visual-timeline {
                margin-top: 20px;
            }

            .timeline-axis {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 0 5px;
            }

            .timeline-marker {
                text-align: center;
                font-size: 12px;
                color: #6b7280;
            }

            .timeline-year {
                font-weight: 600;
                color: #14b8a6;
            }

            .growth-bars-container {
                margin-top: 20px;
            }

            .growth-bar-row {
                margin-bottom: 12px;
            }

            .growth-bar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;
                font-size: 13px;
            }

            .growth-bar-year {
                font-weight: 600;
                color: #4b5563;
            }

            .growth-bar-amount {
                font-weight: 600;
                color: #14b8a6;
            }

            .growth-bar-track {
                height: 30px;
                background: #f3f4f6;
                border-radius: 6px;
                overflow: hidden;
                position: relative;
            }

            .growth-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #14b8a6, #06b6d4);
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 10px;
                color: white;
                font-size: 12px;
                font-weight: 600;
                transition: width 0.5s ease;
            }

            .comparison-visualization {
                margin-top: 25px;
            }

            .comparison-bar-row {
                margin-bottom: 15px;
            }

            .comparison-label {
                font-size: 13px;
                font-weight: 600;
                color: #4b5563;
                margin-bottom: 6px;
            }

            .comparison-bar-container {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .comparison-bar {
                flex: 1;
                height: 35px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 13px;
                font-weight: 600;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .comparison-bar-si {
                background: linear-gradient(135deg, #14b8a6, #0d9488);
            }

            .comparison-bar-ci {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
            }

            .si-detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background: #f9fafb;
                border-radius: 8px;
                font-size: 14px;
                margin-bottom: 8px;
            }

            .si-detail-row.highlight {
                background: #ecfdf5;
                border: 2px solid #a7f3d0;
                font-weight: 600;
                color: #065f46;
            }

            .si-detail-label {
                color: #4b5563;
            }

            .si-detail-value {
                font-weight: 600;
                color: #1f2937;
            }

            .formula-box {
                background: linear-gradient(135deg, #f0fdfa, #ccfbf1);
                border: 2px solid #14b8a6;
                padding: 18px;
                border-radius: 10px;
                margin-top: 20px;
            }

            .formula-title {
                font-weight: 600;
                color: #115e59;
                margin-bottom: 10px;
                font-size: 14px;
            }

            .formula-text {
                font-family: 'Courier New', monospace;
                font-size: 16px;
                color: #0f766e;
                font-weight: 600;
                text-align: center;
                padding: 10px;
                background: white;
                border-radius: 6px;
                margin-bottom: 10px;
            }

            .formula-explanation {
                font-size: 13px;
                color: #115e59;
                line-height: 1.6;
            }

            .comparison-highlight {
                background: #dbeafe;
                border-left: 4px solid #3b82f6;
                padding: 15px;
                border-radius: 8px;
                margin-top: 15px;
            }

            .comparison-title {
                font-weight: 600;
                color: #1e40af;
                margin-bottom: 8px;
                font-size: 14px;
            }

            .comparison-text {
                font-size: 13px;
                color: #1e40af;
                line-height: 1.6;
            }

            @media (max-width: 768px) {
                .main-si-value {
                    font-size: 32px;
                }

                .si-breakdown-grid {
                    grid-template-columns: 1fr;
                }

                .si-number-input {
                    width: 100px;
                }

                .slider-input-combo {
                    grid-template-columns: 1fr;
                }

                .time-unit-buttons {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    `;

    let currentTimeUnit = 'years';

    function init() {
        createCalculatorInterface();
        setupEventListeners();
    }

    function createCalculatorInterface() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = styles + `
            <div class="si-calculator-container">
                <div class="si-input-section">
                    <div class="si-input-group">
                        <div class="si-label">
                            <span>Principal Amount</span>
                            <span class="label-value" id="principalDisplay">₹1,00,000</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="si-slider" id="principalSlider"
                                   min="10000" max="10000000" step="10000" value="100000">
                            <input type="number" class="si-number-input" id="principalInput"
                                   value="100000" min="10000" max="10000000" step="10000">
                        </div>
                    </div>

                    <div class="si-input-group">
                        <div class="si-label">
                            <span>Annual Interest Rate</span>
                            <span class="label-value" id="rateDisplay">8%</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="si-slider" id="rateSlider"
                                   min="1" max="30" step="0.1" value="8">
                            <input type="number" class="si-number-input" id="rateInput"
                                   value="8" min="1" max="30" step="0.1">
                        </div>
                    </div>

                    <div class="si-input-group">
                        <div class="si-label">
                            <span>Time Period</span>
                            <span class="label-value" id="timeDisplay">5 Years</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="si-slider" id="timeSlider"
                                   min="1" max="30" step="1" value="5">
                            <input type="number" class="si-number-input" id="timeInput"
                                   value="5" min="1" max="30" step="1">
                        </div>
                    </div>

                    <div class="si-input-group">
                        <div class="si-label">
                            <span>Time Unit</span>
                        </div>
                        <div class="time-unit-buttons">
                            <button class="time-unit-btn active" data-unit="years">📅 Years</button>
                            <button class="time-unit-btn" data-unit="months">📆 Months</button>
                            <button class="time-unit-btn" data-unit="days">🗓️ Days</button>
                        </div>
                    </div>

                    <button class="calculate-btn" id="calculateBtn">
                        💰 Calculate Simple Interest
                    </button>
                </div>

                <div id="siResults"></div>
            </div>
        `;
    }

    function setupEventListeners() {
        // Time unit buttons
        document.querySelectorAll('.time-unit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-unit-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                currentTimeUnit = e.currentTarget.dataset.unit;
                updateTimeDisplay();
            });
        });

        // Principal slider and input sync
        syncSliderAndInput('principal', 'principalSlider', 'principalInput', 'principalDisplay', (val) => `₹${formatNumber(val)}`);

        // Rate slider and input sync
        syncSliderAndInput('rate', 'rateSlider', 'rateInput', 'rateDisplay', (val) => `${val}%`);

        // Time slider and input sync
        const timeSlider = document.getElementById('timeSlider');
        const timeInput = document.getElementById('timeInput');
        const timeDisplay = document.getElementById('timeDisplay');

        if (timeSlider && timeInput && timeDisplay) {
            timeSlider.addEventListener('input', (e) => {
                timeInput.value = e.target.value;
                updateTimeDisplay();
            });

            timeInput.addEventListener('input', (e) => {
                timeSlider.value = e.target.value;
                updateTimeDisplay();
            });
        }

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

    function updateTimeDisplay() {
        const timeInput = document.getElementById('timeInput');
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeInput && timeDisplay) {
            const value = timeInput.value;
            const unitLabel = currentTimeUnit.charAt(0).toUpperCase() + currentTimeUnit.slice(1);
            timeDisplay.textContent = `${value} ${unitLabel}`;
        }
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
        const timePeriod = parseFloat(document.getElementById('timeInput').value) || 0;

        if (principal <= 0) {
            alert('Please enter a valid principal amount');
            return;
        }

        if (rate <= 0) {
            alert('Please enter a valid interest rate');
            return;
        }

        if (timePeriod <= 0) {
            alert('Please enter a valid time period');
            return;
        }

        // Convert time to years
        let timeInYears = timePeriod;
        if (currentTimeUnit === 'months') {
            timeInYears = timePeriod / 12;
        } else if (currentTimeUnit === 'days') {
            timeInYears = timePeriod / 365;
        }

        // Calculate Simple Interest: SI = (P × R × T) / 100
        const simpleInterest = (principal * rate * timeInYears) / 100;
        const totalAmount = principal + simpleInterest;
        const roi = (simpleInterest / principal) * 100;
        const effectiveAnnualReturn = roi / timeInYears;

        // Period-wise breakdown
        const monthlyInterest = simpleInterest / (timeInYears * 12);
        const yearlyInterest = simpleInterest / timeInYears;
        const dailyInterest = simpleInterest / (timeInYears * 365);

        // Compound Interest for comparison
        const compoundAmount = principal * Math.pow((1 + rate/100), timeInYears);
        const compoundInterest = compoundAmount - principal;
        const difference = compoundInterest - simpleInterest;
        const differencePercent = (difference / simpleInterest) * 100;

        // Year-wise breakdown
        const years = Math.ceil(timeInYears);
        let yearWiseData = [];
        for (let i = 1; i <= Math.min(years, 10); i++) {
            const yearSI = (principal * rate * i) / 100;
            const yearTotal = principal + yearSI;
            const yearCI = principal * Math.pow((1 + rate/100), i) - principal;
            const yearCITotal = principal + yearCI;
            yearWiseData.push({
                year: i,
                si: yearSI,
                total: yearTotal,
                ci: yearCI,
                ciTotal: yearCITotal
            });
        }

        displayResults(principal, rate, timeInYears, simpleInterest, totalAmount, roi, effectiveAnnualReturn,
                      monthlyInterest, yearlyInterest, dailyInterest, compoundInterest, compoundAmount,
                      difference, differencePercent, yearWiseData);
    }

    function displayResults(principal, rate, timeInYears, simpleInterest, totalAmount, roi, effectiveAnnualReturn,
                           monthlyInterest, yearlyInterest, dailyInterest, compoundInterest, compoundAmount,
                           difference, differencePercent, yearWiseData) {

        // Find max amount for bar scaling
        const maxAmount = Math.max(...yearWiseData.map(d => d.ciTotal));

        // Generate growth bars HTML
        const growthBarsHTML = yearWiseData.map(data => {
            const barWidth = (data.total / maxAmount) * 100;
            return `
                <div class="growth-bar-row">
                    <div class="growth-bar-header">
                        <span class="growth-bar-year">Year ${data.year}</span>
                        <span class="growth-bar-amount">₹${formatNumber(data.total.toFixed(0))}</span>
                    </div>
                    <div class="growth-bar-track">
                        <div class="growth-bar-fill" style="width: ${barWidth}%;">
                            +₹${formatNumber(data.si.toFixed(0))}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Generate comparison bars
        const comparisonSIWidth = (totalAmount / compoundAmount) * 100;
        const comparisonCIWidth = 100;

        const resultsDiv = document.getElementById('siResults');
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <div class="si-results">
                    <div class="main-si-card">
                        <div class="main-si-label">💵 Total Interest Earned</div>
                        <div class="main-si-value">₹${formatNumber(simpleInterest.toFixed(0))}</div>
                        <div class="roi-badge">ROI: ${roi.toFixed(2)}%</div>
                    </div>

                    <div class="si-breakdown-grid">
                        <div class="si-breakdown-card">
                            <div class="si-breakdown-label">Total Amount</div>
                            <div class="si-breakdown-value">₹${formatNumber(totalAmount.toFixed(0))}</div>
                        </div>
                        <div class="si-breakdown-card">
                            <div class="si-breakdown-label">Yearly Interest</div>
                            <div class="si-breakdown-value">₹${formatNumber(yearlyInterest.toFixed(0))}</div>
                        </div>
                        <div class="si-breakdown-card">
                            <div class="si-breakdown-label">Monthly Interest</div>
                            <div class="si-breakdown-value">₹${formatNumber(monthlyInterest.toFixed(0))}</div>
                        </div>
                    </div>

                    <div class="si-section">
                        <div class="section-title">
                            📊 Growth Timeline
                        </div>
                        <div class="growth-bars-container">
                            ${growthBarsHTML}
                        </div>
                    </div>

                    <div class="si-section">
                        <div class="section-title">
                            🧮 Calculation Details
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Principal Amount (P)</span>
                            <span class="si-detail-value">₹${formatNumber(principal)}</span>
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Interest Rate (R)</span>
                            <span class="si-detail-value">${rate}% per annum</span>
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Time Period (T)</span>
                            <span class="si-detail-value">${timeInYears.toFixed(2)} years</span>
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Simple Interest</span>
                            <span class="si-detail-value">₹${formatNumber(simpleInterest.toFixed(0))}</span>
                        </div>
                        <div class="si-detail-row highlight">
                            <span class="si-detail-label">Total Maturity Amount</span>
                            <span class="si-detail-value">₹${formatNumber(totalAmount.toFixed(0))}</span>
                        </div>

                        <div class="formula-box">
                            <div class="formula-title">💡 Simple Interest Formula</div>
                            <div class="formula-text">SI = (P × R × T) / 100</div>
                            <div class="formula-explanation">
                                <strong>Calculation:</strong> (₹${formatNumber(principal)} × ${rate}% × ${timeInYears.toFixed(2)}) / 100 =
                                <strong>₹${formatNumber(simpleInterest.toFixed(0))}</strong>
                            </div>
                        </div>
                    </div>

                    <div class="si-section">
                        <div class="section-title">
                            📈 Interest Breakdown
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Total Interest</span>
                            <span class="si-detail-value">₹${formatNumber(simpleInterest.toFixed(0))}</span>
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Yearly Interest</span>
                            <span class="si-detail-value">₹${formatNumber(yearlyInterest.toFixed(0))}/year</span>
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Monthly Interest</span>
                            <span class="si-detail-value">₹${formatNumber(monthlyInterest.toFixed(2))}/month</span>
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Daily Interest</span>
                            <span class="si-detail-value">₹${formatNumber(dailyInterest.toFixed(2))}/day</span>
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Return on Investment (ROI)</span>
                            <span class="si-detail-value">${roi.toFixed(2)}%</span>
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Effective Annual Return</span>
                            <span class="si-detail-value">${effectiveAnnualReturn.toFixed(2)}% p.a.</span>
                        </div>
                    </div>

                    <div class="si-section">
                        <div class="section-title">
                            ⚖️ Simple vs Compound Interest
                        </div>
                        <div class="comparison-visualization">
                            <div class="comparison-bar-row">
                                <div class="comparison-label">Simple Interest (Linear Growth)</div>
                                <div class="comparison-bar-container">
                                    <div class="comparison-bar comparison-bar-si" style="width: ${comparisonSIWidth}%;">
                                        ₹${formatNumber(totalAmount.toFixed(0))}
                                    </div>
                                </div>
                            </div>
                            <div class="comparison-bar-row">
                                <div class="comparison-label">Compound Interest (Exponential Growth)</div>
                                <div class="comparison-bar-container">
                                    <div class="comparison-bar comparison-bar-ci" style="width: ${comparisonCIWidth}%;">
                                        ₹${formatNumber(compoundAmount.toFixed(0))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="si-detail-row">
                            <span class="si-detail-label">Simple Interest Earned</span>
                            <span class="si-detail-value">₹${formatNumber(simpleInterest.toFixed(0))}</span>
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Compound Interest Earned</span>
                            <span class="si-detail-value">₹${formatNumber(compoundInterest.toFixed(0))}</span>
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Difference</span>
                            <span class="si-detail-value" style="color: ${difference > 0 ? '#3b82f6' : '#6b7280'};">
                                ₹${formatNumber(Math.abs(difference).toFixed(0))} (${differencePercent.toFixed(1)}% ${difference > 0 ? 'more with CI' : ''})
                            </span>
                        </div>

                        <div class="comparison-highlight">
                            <div class="comparison-title">
                                ${difference > principal * 0.1 ? '⚠️ Significant Difference Detected!' : 'ℹ️ Comparison Insight'}
                            </div>
                            <div class="comparison-text">
                                ${difference > principal * 0.1
                                    ? `Compound interest earns <strong>₹${formatNumber(difference.toFixed(0))}</strong> more than simple interest over ${timeInYears.toFixed(1)} years. For long-term investments, compound interest provides significantly better returns.`
                                    : `For this ${timeInYears.toFixed(1)}-year period, the difference between simple and compound interest is minimal (₹${formatNumber(difference.toFixed(0))}). Simple interest may be suitable for short-term investments.`
                                }
                            </div>
                        </div>
                    </div>

                    <div class="si-section">
                        <div class="section-title">
                            💼 Year-wise Comparison
                        </div>
                        ${yearWiseData.slice(0, 5).map(data => `
                            <div class="si-detail-row">
                                <span class="si-detail-label">Year ${data.year}</span>
                                <span class="si-detail-value">
                                    SI: ₹${formatNumber(data.total.toFixed(0))} |
                                    CI: ₹${formatNumber(data.ciTotal.toFixed(0))}
                                    <span style="color: #3b82f6;">(+₹${formatNumber((data.ciTotal - data.total).toFixed(0))})</span>
                                </span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="si-section">
                        <div class="section-title">
                            ℹ️ Key Insights
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Interest Type</span>
                            <span class="si-detail-value">Simple Interest (Linear Growth)</span>
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Growth Pattern</span>
                            <span class="si-detail-value">Fixed ₹${formatNumber(yearlyInterest.toFixed(0))} per year</span>
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Best Use Case</span>
                            <span class="si-detail-value">${timeInYears < 3 ? 'Short-term investments (< 3 years)' : 'Consider compound interest for better returns'}</span>
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Typical Applications</span>
                            <span class="si-detail-value">Bonds, some loans, short-term deposits</span>
                        </div>
                        <div class="si-detail-row">
                            <span class="si-detail-label">Recommendation</span>
                            <span class="si-detail-value">
                                ${timeInYears >= 5 && difference > principal * 0.15
                                    ? '💡 Consider compound interest options for long-term investments'
                                    : '✓ Simple interest is suitable for this duration'
                                }
                            </span>
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
