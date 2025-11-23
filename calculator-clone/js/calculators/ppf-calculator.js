/**
 * PPF Calculator - Redesigned with calculator.net style
 * Features: Year-wise growth, tax benefit visualization, loan eligibility
 */

(function() {
    'use strict';

    const styles = `
        <style>
            .ppf-calculator-container {
                max-width: 1000px;
                margin: 0 auto;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }
            .ppf-input-section {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 25px;
            }
            .ppf-input-group { margin-bottom: 20px; }
            .ppf-label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #374151;
            }
            .label-value {
                color: #10b981;
                font-weight: 600;
                font-size: 15px;
            }
            .slider-input-combo {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 12px;
                align-items: center;
            }
            .ppf-slider {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: linear-gradient(to right, #d1fae5, #10b981);
                outline: none;
                -webkit-appearance: none;
            }
            .ppf-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #10b981;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .ppf-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #10b981;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .ppf-number-input {
                width: 140px;
                padding: 8px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                text-align: right;
            }
            .ppf-number-input:focus {
                outline: none;
                border-color: #10b981;
            }
            .tenure-buttons {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
            }
            .tenure-btn {
                padding: 10px;
                border: 2px solid #e5e7eb;
                background: white;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 500;
                color: #6b7280;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .tenure-btn:hover {
                border-color: #10b981;
                color: #10b981;
            }
            .tenure-btn.active {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border-color: #10b981;
            }
            .calculate-btn {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            }
            .calculate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
            }
            .main-ppf-card {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 25px;
                box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
            }
            .main-ppf-value {
                font-size: 42px;
                font-weight: 700;
                margin-bottom: 15px;
            }
            .ppf-breakdown-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 15px;
                margin-bottom: 25px;
            }
            .ppf-breakdown-card {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                border-left: 4px solid #10b981;
            }
            .ppf-section {
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
            .ppf-breakdown-bar {
                height: 60px;
                background: #f3f4f6;
                border-radius: 10px;
                overflow: hidden;
                display: flex;
                margin: 20px 0;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }
            .bar-invested {
                background: linear-gradient(135deg, #10b981, #059669);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 14px;
            }
            .bar-interest {
                background: linear-gradient(135deg, #fbbf24, #f59e0b);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 14px;
            }
            .year-growth-row {
                margin-bottom: 12px;
            }
            .year-growth-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
                font-size: 13px;
            }
            .year-growth-bar {
                height: 30px;
                background: #f3f4f6;
                border-radius: 6px;
                overflow: hidden;
                display: flex;
            }
            .growth-bar-fill {
                background: linear-gradient(90deg, #10b981, #059669);
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 10px;
                color: white;
                font-size: 11px;
                font-weight: 600;
            }
            .ppf-detail-row {
                display: flex;
                justify-content: space-between;
                padding: 12px;
                background: #f9fafb;
                border-radius: 8px;
                font-size: 14px;
                margin-bottom: 8px;
            }
            .ppf-detail-row.highlight {
                background: #d1fae5;
                border: 2px solid #6ee7b7;
                font-weight: 600;
                color: #065f46;
            }
            .tax-benefit-box {
                background: linear-gradient(135deg, #fef3c7, #fde68a);
                border: 2px solid #fbbf24;
                padding: 18px;
                border-radius: 10px;
                margin-top: 20px;
            }
            @media (max-width: 768px) {
                .main-ppf-value { font-size: 32px; }
                .ppf-breakdown-grid { grid-template-columns: 1fr; }
                .tenure-buttons { grid-template-columns: repeat(2, 1fr); }
            }
        </style>
    `;

    let currentTenure = 15;

    function init() {
        createCalculatorInterface();
        setupEventListeners();
    }

    function createCalculatorInterface() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = styles + `
            <div class="ppf-calculator-container">
                <div class="ppf-input-section">
                    <div class="ppf-input-group">
                        <div class="ppf-label">
                            <span>Yearly Investment</span>
                            <span class="label-value" id="yearlyDisplay">₹1,50,000</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="ppf-slider" id="yearlySlider"
                                   min="500" max="150000" step="500" value="150000">
                            <input type="number" class="ppf-number-input" id="yearlyInput"
                                   value="150000" min="500" max="150000" step="500">
                        </div>
                        <small style="font-size: 12px; color: #6b7280;">Max: ₹1,50,000/year | Min: ₹500/year</small>
                    </div>

                    <div class="ppf-input-group">
                        <div class="ppf-label">
                            <span>Interest Rate</span>
                            <span class="label-value" id="rateDisplay">7.1%</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="ppf-slider" id="rateSlider"
                                   min="6" max="9" step="0.1" value="7.1">
                            <input type="number" class="ppf-number-input" id="rateInput"
                                   value="7.1" min="6" max="9" step="0.1">
                        </div>
                        <small style="font-size: 12px; color: #6b7280;">Current rate: 7.1% p.a.</small>
                    </div>

                    <div class="ppf-input-group">
                        <div class="ppf-label">
                            <span>Tenure (Years)</span>
                        </div>
                        <div class="tenure-buttons">
                            <button class="tenure-btn active" data-tenure="15">15 Years</button>
                            <button class="tenure-btn" data-tenure="20">20 Years</button>
                            <button class="tenure-btn" data-tenure="25">25 Years</button>
                            <button class="tenure-btn" data-tenure="30">30 Years</button>
                        </div>
                    </div>

                    <button class="calculate-btn" id="calculateBtn">
                        💰 Calculate PPF Returns
                    </button>
                </div>

                <div id="ppfResults"></div>
            </div>
        `;
    }

    function setupEventListeners() {
        document.querySelectorAll('.tenure-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tenure-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                currentTenure = parseInt(e.currentTarget.dataset.tenure);
            });
        });

        syncSliderAndInput('yearly', 'yearlySlider', 'yearlyInput', 'yearlyDisplay', (val) => `₹${formatNumber(val)}`);
        syncSliderAndInput('rate', 'rateSlider', 'rateInput', 'rateDisplay', (val) => `${val}%`);

        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) calculateBtn.addEventListener('click', calculate);

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
                let value = e.target.value;
                if (name === 'yearly' && value > 150000) value = 150000;
                input.value = value;
                display.textContent = formatFn(value);
            });

            input.addEventListener('input', (e) => {
                let value = e.target.value;
                if (name === 'yearly' && value > 150000) value = 150000;
                slider.value = value;
                display.textContent = formatFn(value);
            });
        }
    }

    function calculate() {
        let yearly = parseFloat(document.getElementById('yearlyInput').value) || 150000;
        const rate = parseFloat(document.getElementById('rateInput').value) || 7.1;

        if (yearly > 150000) yearly = 150000;
        if (yearly <= 0) {
            alert('Please enter a valid yearly investment');
            return;
        }

        const r = rate / 100;
        const tenure = currentTenure;

        // Calculate year-wise PPF growth
        let balance = 0;
        let yearWiseData = [];

        for (let year = 1; year <= tenure; year++) {
            balance = (balance + yearly) * (1 + r);
            yearWiseData.push({
                year: year,
                invested: yearly * year,
                balance: balance,
                interest: balance - (yearly * year)
            });
        }

        const totalInvested = yearly * tenure;
        const maturityAmount = balance;
        const totalInterest = maturityAmount - totalInvested;
        const roi = (totalInterest / totalInvested) * 100;

        // Tax benefits (Section 80C)
        const annualTaxSaving = Math.min(yearly, 150000) * 0.30; // 30% bracket
        const totalTaxSaving = annualTaxSaving * tenure;

        displayResults(yearly, rate, tenure, maturityAmount, totalInvested, totalInterest, roi,
                      annualTaxSaving, totalTaxSaving, yearWiseData);
    }

    function displayResults(yearly, rate, tenure, maturityAmount, totalInvested, totalInterest, roi,
                           annualTaxSaving, totalTaxSaving, yearWiseData) {

        const investedPercent = (totalInvested / maturityAmount) * 100;
        const interestPercent = (totalInterest / maturityAmount) * 100;

        const maxBalance = Math.max(...yearWiseData.map(d => d.balance));

        const growthChartHTML = yearWiseData.filter((_, i) => i % Math.ceil(tenure/10) === 0 || i === tenure - 1).map(data => {
            const barWidth = (data.balance / maxBalance) * 100;
            return `
                <div class="year-growth-row">
                    <div class="year-growth-header">
                        <span style="font-weight: 600; color: #4b5563;">Year ${data.year}</span>
                        <span style="font-weight: 600; color: #10b981;">₹${formatNumber(data.balance.toFixed(0))}</span>
                    </div>
                    <div class="year-growth-bar">
                        <div class="growth-bar-fill" style="width: ${barWidth}%;">
                            +₹${formatNumber(data.interest.toFixed(0))}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const resultsDiv = document.getElementById('ppfResults');
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <div class="ppf-results">
                    <div class="main-ppf-card">
                        <div style="font-size: 16px; opacity: 0.95; margin-bottom: 8px;">💰 Maturity Amount</div>
                        <div class="main-ppf-value">₹${formatNumber(maturityAmount.toFixed(0))}</div>
                        <div style="display: inline-block; padding: 6px 16px; background: rgba(255,255,255,0.25); border-radius: 20px; font-size: 14px; font-weight: 600;">ROI: ${roi.toFixed(1)}%</div>
                    </div>

                    <div class="ppf-breakdown-grid">
                        <div class="ppf-breakdown-card">
                            <div style="font-size: 13px; color: #6b7280; margin-bottom: 6px;">Total Invested</div>
                            <div style="font-size: 22px; font-weight: 700; color: #1f2937;">₹${formatNumber(totalInvested)}</div>
                        </div>
                        <div class="ppf-breakdown-card">
                            <div style="font-size: 13px; color: #6b7280; margin-bottom: 6px;">Interest Earned</div>
                            <div style="font-size: 22px; font-weight: 700; color: #10b981;">₹${formatNumber(totalInterest.toFixed(0))}</div>
                        </div>
                        <div class="ppf-breakdown-card">
                            <div style="font-size: 13px; color: #6b7280; margin-bottom: 6px;">Tax Saved (80C)</div>
                            <div style="font-size: 22px; font-weight: 700; color: #f59e0b;">₹${formatNumber(totalTaxSaving.toFixed(0))}</div>
                        </div>
                    </div>

                    <div class="ppf-section">
                        <div class="section-title">📊 Investment Breakdown</div>
                        <div class="ppf-breakdown-bar">
                            <div class="bar-invested" style="width: ${investedPercent}%;">
                                Invested: ₹${formatNumber(totalInvested)}
                            </div>
                            <div class="bar-interest" style="width: ${interestPercent}%;">
                                Interest: ₹${formatNumber(totalInterest.toFixed(0))}
                            </div>
                        </div>
                    </div>

                    <div class="ppf-section">
                        <div class="section-title">📈 Year-wise Growth</div>
                        ${growthChartHTML}
                    </div>

                    <div class="ppf-section">
                        <div class="section-title">📋 PPF Details</div>
                        <div class="ppf-detail-row">
                            <span>Yearly Investment</span>
                            <span style="font-weight: 600;">₹${formatNumber(yearly)}</span>
                        </div>
                        <div class="ppf-detail-row">
                            <span>Interest Rate</span>
                            <span style="font-weight: 600;">${rate}% p.a.</span>
                        </div>
                        <div class="ppf-detail-row">
                            <span>Tenure</span>
                            <span style="font-weight: 600;">${tenure} years</span>
                        </div>
                        <div class="ppf-detail-row">
                            <span>Total Invested</span>
                            <span style="font-weight: 600;">₹${formatNumber(totalInvested)}</span>
                        </div>
                        <div class="ppf-detail-row">
                            <span>Interest Earned</span>
                            <span style="font-weight: 600; color: #10b981;">₹${formatNumber(totalInterest.toFixed(0))}</span>
                        </div>
                        <div class="ppf-detail-row highlight">
                            <span>Maturity Amount</span>
                            <span>₹${formatNumber(maturityAmount.toFixed(0))}</span>
                        </div>
                        <div class="ppf-detail-row">
                            <span>Return on Investment</span>
                            <span style="font-weight: 600;">${roi.toFixed(2)}%</span>
                        </div>

                        <div class="tax-benefit-box">
                            <div style="font-weight: 600; color: #78350f; margin-bottom: 10px;">💰 Tax Benefits (Section 80C)</div>
                            <div style="font-size: 13px; color: #92400e; line-height: 1.6;">
                                Annual tax saving: <strong>₹${formatNumber(annualTaxSaving.toFixed(0))}</strong> (30% bracket)<br>
                                Total tax saved over ${tenure} years: <strong>₹${formatNumber(totalTaxSaving.toFixed(0))}</strong><br>
                                <em>PPF contributions qualify for deduction under Section 80C up to ₹1.5 lakh</em>
                            </div>
                        </div>
                    </div>

                    <div class="ppf-section">
                        <div class="section-title">ℹ️ PPF Features</div>
                        <div class="ppf-detail-row">
                            <span>Minimum Deposit</span>
                            <span>₹500/year</span>
                        </div>
                        <div class="ppf-detail-row">
                            <span>Maximum Deposit</span>
                            <span>₹1,50,000/year</span>
                        </div>
                        <div class="ppf-detail-row">
                            <span>Lock-in Period</span>
                            <span>15 years (extendable in 5-year blocks)</span>
                        </div>
                        <div class="ppf-detail-row">
                            <span>Loan Facility</span>
                            <span>Available from 3rd to 6th year</span>
                        </div>
                        <div class="ppf-detail-row">
                            <span>Partial Withdrawal</span>
                            <span>After 7 years (up to 50%)</span>
                        </div>
                        <div class="ppf-detail-row">
                            <span>Tax Status</span>
                            <span>EEE (Exempt-Exempt-Exempt)</span>
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
