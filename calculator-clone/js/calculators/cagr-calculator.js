/**
 * CAGR Calculator - Redesigned with calculator.net style
 * Features: Investment timeline, growth projection, annualized returns
 */

(function() {
    'use strict';

    const styles = `
        <style>
            .cagr-calculator-container {
                max-width: 1000px;
                margin: 0 auto;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }
            .cagr-input-section {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 25px;
            }
            .cagr-input-group { margin-bottom: 20px; }
            .cagr-label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #374151;
            }
            .label-value {
                color: #0ea5e9;
                font-weight: 600;
                font-size: 15px;
            }
            .slider-input-combo {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 12px;
                align-items: center;
            }
            .cagr-slider {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: linear-gradient(to right, #e0f2fe, #0ea5e9);
                outline: none;
                -webkit-appearance: none;
            }
            .cagr-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #0ea5e9;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .cagr-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #0ea5e9;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .cagr-number-input {
                width: 140px;
                padding: 8px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                text-align: right;
            }
            .cagr-number-input:focus {
                outline: none;
                border-color: #0ea5e9;
            }
            .calculate-btn {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #0ea5e9, #0284c7);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
            }
            .calculate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
            }
            .main-cagr-card {
                background: linear-gradient(135deg, #0ea5e9, #0284c7);
                color: white;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 25px;
                box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3);
            }
            .main-cagr-value {
                font-size: 42px;
                font-weight: 700;
                margin-bottom: 15px;
            }
            .cagr-breakdown-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 15px;
                margin-bottom: 25px;
            }
            .cagr-breakdown-card {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                border-left: 4px solid #0ea5e9;
            }
            .cagr-section {
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
            .growth-bar {
                height: 60px;
                background: #f3f4f6;
                border-radius: 10px;
                overflow: hidden;
                display: flex;
                margin: 20px 0;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }
            .bar-initial {
                background: linear-gradient(135deg, #6b7280, #4b5563);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 14px;
            }
            .bar-gains {
                background: linear-gradient(135deg, #0ea5e9, #0284c7);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 14px;
            }
            .timeline-row {
                margin-bottom: 12px;
            }
            .timeline-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
                font-size: 13px;
            }
            .timeline-bar {
                height: 30px;
                background: #f3f4f6;
                border-radius: 6px;
                overflow: hidden;
            }
            .timeline-fill {
                height: 100%;
                background: linear-gradient(90deg, #0ea5e9, #0284c7);
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 10px;
                color: white;
                font-size: 11px;
                font-weight: 600;
            }
            .cagr-detail-row {
                display: flex;
                justify-content: space-between;
                padding: 12px;
                background: #f9fafb;
                border-radius: 8px;
                font-size: 14px;
                margin-bottom: 8px;
            }
            .cagr-detail-row.highlight {
                background: #e0f2fe;
                border: 2px solid #7dd3fc;
                font-weight: 600;
                color: #075985;
            }
            @media (max-width: 768px) {
                .main-cagr-value { font-size: 32px; }
                .cagr-breakdown-grid { grid-template-columns: 1fr; }
            }
        </style>
    `;

    function init() {
        createCalculatorInterface();
        setupEventListeners();
    }

    function createCalculatorInterface() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = styles + `
            <div class="cagr-calculator-container">
                <div class="cagr-input-section">
                    <div class="cagr-input-group">
                        <div class="cagr-label">
                            <span>Initial Investment</span>
                            <span class="label-value" id="initialDisplay">₹1,00,000</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="cagr-slider" id="initialSlider"
                                   min="10000" max="10000000" step="10000" value="100000">
                            <input type="number" class="cagr-number-input" id="initialInput"
                                   value="100000" min="10000" step="10000">
                        </div>
                    </div>

                    <div class="cagr-input-group">
                        <div class="cagr-label">
                            <span>Final Value</span>
                            <span class="label-value" id="finalDisplay">₹2,50,000</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="cagr-slider" id="finalSlider"
                                   min="10000" max="10000000" step="10000" value="250000">
                            <input type="number" class="cagr-number-input" id="finalInput"
                                   value="250000" min="10000" step="10000">
                        </div>
                    </div>

                    <div class="cagr-input-group">
                        <div class="cagr-label">
                            <span>Investment Period (Years)</span>
                            <span class="label-value" id="yearsDisplay">5 Years</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="cagr-slider" id="yearsSlider"
                                   min="1" max="30" step="1" value="5">
                            <input type="number" class="cagr-number-input" id="yearsInput"
                                   value="5" min="1" max="30" step="1">
                        </div>
                    </div>

                    <button class="calculate-btn" id="calculateBtn">
                        📊 Calculate CAGR
                    </button>
                </div>

                <div id="cagrResults"></div>
            </div>
        `;
    }

    function setupEventListeners() {
        syncSliderAndInput('initial', 'initialSlider', 'initialInput', 'initialDisplay', (val) => `₹${formatNumber(val)}`);
        syncSliderAndInput('final', 'finalSlider', 'finalInput', 'finalDisplay', (val) => `₹${formatNumber(val)}`);
        syncSliderAndInput('years', 'yearsSlider', 'yearsInput', 'yearsDisplay', (val) => `${val} Years`);

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
        const initial = parseFloat(document.getElementById('initialInput').value) || 0;
        const final = parseFloat(document.getElementById('finalInput').value) || 0;
        const years = parseFloat(document.getElementById('yearsInput').value) || 0;

        if (initial <= 0 || final <= 0 || years <= 0) {
            alert('Please enter valid positive values');
            return;
        }

        if (final <= initial) {
            alert('Final value must be greater than initial investment');
            return;
        }

        // CAGR = (FV/PV)^(1/n) - 1
        const cagr = (Math.pow(final / initial, 1 / years) - 1) * 100;
        const absoluteGain = final - initial;
        const absoluteReturn = (absoluteGain / initial) * 100;

        // Year-wise projection
        let timelineData = [];
        for (let year = 1; year <= Math.min(years, 10); year++) {
            const value = initial * Math.pow(1 + cagr/100, year);
            timelineData.push({ year, value });
        }

        displayResults(initial, final, years, cagr, absoluteGain, absoluteReturn, timelineData);
    }

    function displayResults(initial, final, years, cagr, absoluteGain, absoluteReturn, timelineData) {
        const initialPercent = (initial / final) * 100;
        const gainsPercent = (absoluteGain / final) * 100;

        const maxValue = Math.max(...timelineData.map(d => d.value));

        const timelineHTML = timelineData.map(data => {
            const barWidth = (data.value / maxValue) * 100;
            return `
                <div class="timeline-row">
                    <div class="timeline-header">
                        <span style="font-weight: 600; color: #4b5563;">Year ${data.year}</span>
                        <span style="font-weight: 600; color: #0ea5e9;">₹${formatNumber(data.value.toFixed(0))}</span>
                    </div>
                    <div class="timeline-bar">
                        <div class="timeline-fill" style="width: ${barWidth}%;"></div>
                    </div>
                </div>
            `;
        }).join('');

        const resultsDiv = document.getElementById('cagrResults');
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <div class="cagr-results">
                    <div class="main-cagr-card">
                        <div style="font-size: 16px; opacity: 0.95; margin-bottom: 8px;">📊 CAGR (Annualized Return)</div>
                        <div class="main-cagr-value">${cagr.toFixed(2)}%</div>
                        <div style="display: inline-block; padding: 6px 16px; background: rgba(255,255,255,0.25); border-radius: 20px; font-size: 14px; font-weight: 600;">per annum</div>
                    </div>

                    <div class="cagr-breakdown-grid">
                        <div class="cagr-breakdown-card">
                            <div style="font-size: 13px; color: #6b7280; margin-bottom: 6px;">Initial Investment</div>
                            <div style="font-size: 22px; font-weight: 700; color: #1f2937;">₹${formatNumber(initial)}</div>
                        </div>
                        <div class="cagr-breakdown-card">
                            <div style="font-size: 13px; color: #6b7280; margin-bottom: 6px;">Final Value</div>
                            <div style="font-size: 22px; font-weight: 700; color: #0ea5e9;">₹${formatNumber(final)}</div>
                        </div>
                        <div class="cagr-breakdown-card">
                            <div style="font-size: 13px; color: #6b7280; margin-bottom: 6px;">Total Gains</div>
                            <div style="font-size: 22px; font-weight: 700; color: #10b981;">₹${formatNumber(absoluteGain.toFixed(0))}</div>
                        </div>
                    </div>

                    <div class="cagr-section">
                        <div class="section-title">📈 Investment Growth</div>
                        <div class="growth-bar">
                            <div class="bar-initial" style="width: ${initialPercent}%;">
                                Principal: ₹${formatNumber(initial)}
                            </div>
                            <div class="bar-gains" style="width: ${gainsPercent}%;">
                                Gains: ₹${formatNumber(absoluteGain.toFixed(0))}
                            </div>
                        </div>
                    </div>

                    <div class="cagr-section">
                        <div class="section-title">📅 Year-wise Projection</div>
                        ${timelineHTML}
                    </div>

                    <div class="cagr-section">
                        <div class="section-title">📋 CAGR Details</div>
                        <div class="cagr-detail-row">
                            <span>Initial Investment</span>
                            <span style="font-weight: 600;">₹${formatNumber(initial)}</span>
                        </div>
                        <div class="cagr-detail-row">
                            <span>Final Value</span>
                            <span style="font-weight: 600;">₹${formatNumber(final)}</span>
                        </div>
                        <div class="cagr-detail-row">
                            <span>Time Period</span>
                            <span style="font-weight: 600;">${years} years</span>
                        </div>
                        <div class="cagr-detail-row highlight">
                            <span>CAGR (Annualized Return)</span>
                            <span>${cagr.toFixed(2)}% p.a.</span>
                        </div>
                        <div class="cagr-detail-row">
                            <span>Absolute Return</span>
                            <span style="font-weight: 600;">${absoluteReturn.toFixed(2)}%</span>
                        </div>
                        <div class="cagr-detail-row">
                            <span>Total Gains</span>
                            <span style="font-weight: 600; color: #10b981;">₹${formatNumber(absoluteGain.toFixed(0))}</span>
                        </div>
                    </div>

                    <div class="cagr-section">
                        <div class="section-title">ℹ️ Understanding CAGR</div>
                        <div class="cagr-detail-row">
                            <span>What is CAGR?</span>
                            <span>Compound Annual Growth Rate</span>
                        </div>
                        <div class="cagr-detail-row">
                            <span>Formula</span>
                            <span>(FV/PV)^(1/n) - 1</span>
                        </div>
                        <div class="cagr-detail-row">
                            <span>Annualized Growth</span>
                            <span>${cagr.toFixed(2)}% per year</span>
                        </div>
                        <div class="cagr-detail-row">
                            <span>Investment Rating</span>
                            <span>${cagr >= 15 ? 'Excellent! 🌟' : cagr >= 10 ? 'Very Good! ✨' : cagr >= 7 ? 'Good! 👍' : 'Moderate'}</span>
                        </div>
                        <div class="cagr-detail-row">
                            <span>Money Multiplier</span>
                            <span>${(final / initial).toFixed(2)}x in ${years} years</span>
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
