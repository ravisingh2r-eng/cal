/**
 * FD Calculator - Redesigned with calculator.net style
 * Features: Maturity breakdown, TDS visualization, interactive sliders
 */

(function() {
    'use strict';

    // Add embedded styles
    const styles = `
        <style>
            .fd-calculator-container {
                max-width: 1000px;
                margin: 0 auto;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }

            .fd-input-section {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 25px;
            }

            .fd-input-group {
                margin-bottom: 20px;
            }

            .fd-label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #374151;
            }

            .label-value {
                color: #f59e0b;
                font-weight: 600;
                font-size: 15px;
            }

            .slider-input-combo {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 12px;
                align-items: center;
            }

            .fd-slider {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: linear-gradient(to right, #fef3c7, #f59e0b);
                outline: none;
                -webkit-appearance: none;
            }

            .fd-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #f59e0b;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .fd-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #f59e0b;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .fd-number-input {
                width: 140px;
                padding: 8px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                text-align: right;
                transition: border-color 0.3s ease;
            }

            .fd-number-input:focus {
                outline: none;
                border-color: #f59e0b;
            }

            .tenure-buttons {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
            }

            .tenure-btn {
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

            .tenure-btn:hover {
                border-color: #f59e0b;
                color: #f59e0b;
            }

            .tenure-btn.active {
                background: linear-gradient(135deg, #f59e0b, #fb923c);
                color: white;
                border-color: #f59e0b;
            }

            .compounding-buttons {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
            }

            .compounding-btn {
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

            .compounding-btn:hover {
                border-color: #f59e0b;
                color: #f59e0b;
            }

            .compounding-btn.active {
                background: linear-gradient(135deg, #f59e0b, #fb923c);
                color: white;
                border-color: #f59e0b;
            }

            .fd-select {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                background: white;
                cursor: pointer;
                transition: border-color 0.3s ease;
            }

            .fd-select:focus {
                outline: none;
                border-color: #f59e0b;
            }

            .senior-toggle {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: #fefce8;
                border: 2px solid #fde047;
                border-radius: 8px;
            }

            .toggle-checkbox {
                width: 48px;
                height: 24px;
                background: #d1d5db;
                border-radius: 12px;
                position: relative;
                cursor: pointer;
                transition: background 0.3s ease;
            }

            .toggle-checkbox.active {
                background: #f59e0b;
            }

            .toggle-knob {
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                position: absolute;
                top: 2px;
                left: 2px;
                transition: left 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .toggle-checkbox.active .toggle-knob {
                left: 26px;
            }

            .toggle-label {
                font-size: 14px;
                font-weight: 500;
                color: #78350f;
            }

            .calculate-btn {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #f59e0b, #fb923c);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
            }

            .calculate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
            }

            .fd-results {
                margin-top: 30px;
            }

            .main-fd-card {
                background: linear-gradient(135deg, #f59e0b, #fb923c);
                color: white;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 25px;
                box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
            }

            .main-fd-label {
                font-size: 16px;
                opacity: 0.95;
                margin-bottom: 8px;
            }

            .main-fd-value {
                font-size: 42px;
                font-weight: 700;
                margin-bottom: 15px;
            }

            .return-badge {
                display: inline-block;
                padding: 6px 16px;
                background: rgba(255, 255, 255, 0.25);
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
            }

            .fd-breakdown-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 15px;
                margin-bottom: 25px;
            }

            .fd-breakdown-card {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                border-left: 4px solid #f59e0b;
            }

            .fd-breakdown-label {
                font-size: 13px;
                color: #6b7280;
                margin-bottom: 6px;
            }

            .fd-breakdown-value {
                font-size: 22px;
                font-weight: 700;
                color: #1f2937;
            }

            .fd-section {
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

            .maturity-breakdown-bar {
                height: 60px;
                background: #f3f4f6;
                border-radius: 10px;
                overflow: hidden;
                display: flex;
                margin: 20px 0;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }

            .bar-principal {
                background: linear-gradient(135deg, #f59e0b, #fb923c);
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

            .fd-detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background: #f9fafb;
                border-radius: 8px;
                font-size: 14px;
                margin-bottom: 8px;
            }

            .fd-detail-row.highlight {
                background: #fffbeb;
                border: 2px solid #fde68a;
                font-weight: 600;
                color: #92400e;
            }

            .fd-detail-label {
                color: #4b5563;
            }

            .fd-detail-value {
                font-weight: 600;
                color: #1f2937;
            }

            .tds-info-box {
                background: linear-gradient(135deg, #fef3c7, #fde68a);
                border: 2px solid #fbbf24;
                padding: 18px;
                border-radius: 10px;
                margin-top: 20px;
            }

            .tds-title {
                font-weight: 600;
                color: #78350f;
                margin-bottom: 10px;
                font-size: 15px;
            }

            .tds-text {
                font-size: 13px;
                color: #92400e;
                line-height: 1.6;
            }

            .bank-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 20px;
            }

            .bank-card {
                background: #f9fafb;
                padding: 15px;
                border-radius: 8px;
                border: 2px solid #e5e7eb;
            }

            .bank-card.selected {
                background: #fffbeb;
                border-color: #f59e0b;
            }

            .bank-name {
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 6px;
                font-size: 14px;
            }

            .bank-desc {
                font-size: 12px;
                color: #6b7280;
                line-height: 1.5;
            }

            @media (max-width: 768px) {
                .main-fd-value {
                    font-size: 32px;
                }

                .fd-breakdown-grid {
                    grid-template-columns: 1fr;
                }

                .fd-number-input {
                    width: 100px;
                }

                .slider-input-combo {
                    grid-template-columns: 1fr;
                }

                .tenure-buttons {
                    grid-template-columns: repeat(2, 1fr);
                }

                .compounding-buttons {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    `;

    let currentTenure = 1;
    let currentCompounding = 'quarterly';
    let isSeniorCitizen = false;

    function init() {
        createCalculatorInterface();
        setupEventListeners();
    }

    function createCalculatorInterface() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = styles + `
            <div class="fd-calculator-container">
                <div class="fd-input-section">
                    <div class="fd-input-group">
                        <div class="fd-label">
                            <span>Fixed Deposit Amount</span>
                            <span class="label-value" id="principalDisplay">₹1,00,000</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="fd-slider" id="principalSlider"
                                   min="10000" max="10000000" step="10000" value="100000">
                            <input type="number" class="fd-number-input" id="principalInput"
                                   value="100000" min="10000" max="10000000" step="10000">
                        </div>
                    </div>

                    <div class="fd-input-group">
                        <div class="fd-label">
                            <span>Annual Interest Rate</span>
                            <span class="label-value" id="rateDisplay">7.5%</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="fd-slider" id="rateSlider"
                                   min="3" max="12" step="0.1" value="7.5">
                            <input type="number" class="fd-number-input" id="rateInput"
                                   value="7.5" min="3" max="12" step="0.1">
                        </div>
                    </div>

                    <div class="fd-input-group">
                        <div class="fd-label">
                            <span>Tenure</span>
                        </div>
                        <div class="tenure-buttons">
                            <button class="tenure-btn" data-tenure="0.25">3 Months</button>
                            <button class="tenure-btn" data-tenure="0.5">6 Months</button>
                            <button class="tenure-btn active" data-tenure="1">1 Year</button>
                            <button class="tenure-btn" data-tenure="2">2 Years</button>
                            <button class="tenure-btn" data-tenure="3">3 Years</button>
                            <button class="tenure-btn" data-tenure="5">5 Years</button>
                            <button class="tenure-btn" data-tenure="7">7 Years</button>
                            <button class="tenure-btn" data-tenure="10">10 Years</button>
                        </div>
                    </div>

                    <div class="fd-input-group">
                        <div class="fd-label">
                            <span>Compounding Frequency</span>
                        </div>
                        <div class="compounding-buttons">
                            <button class="compounding-btn" data-comp="annually">Annually</button>
                            <button class="compounding-btn active" data-comp="quarterly">Quarterly</button>
                            <button class="compounding-btn" data-comp="monthly">Monthly</button>
                        </div>
                    </div>

                    <div class="fd-input-group">
                        <div class="senior-toggle" id="seniorToggle">
                            <div class="toggle-checkbox" id="seniorCheckbox">
                                <div class="toggle-knob"></div>
                            </div>
                            <div class="toggle-label">Senior Citizen (Extra 0.5% interest)</div>
                        </div>
                    </div>

                    <div class="fd-input-group">
                        <div class="fd-label">
                            <span>Bank Type</span>
                        </div>
                        <select class="fd-select" id="bankType">
                            <option value="public" selected>Public Sector Bank</option>
                            <option value="private">Private Bank</option>
                            <option value="small">Small Finance Bank</option>
                            <option value="post">Post Office</option>
                        </select>
                    </div>

                    <button class="calculate-btn" id="calculateBtn">
                        💰 Calculate FD Returns
                    </button>
                </div>

                <div id="fdResults"></div>
            </div>
        `;
    }

    function setupEventListeners() {
        // Tenure buttons
        document.querySelectorAll('.tenure-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tenure-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                currentTenure = parseFloat(e.currentTarget.dataset.tenure);
            });
        });

        // Compounding buttons
        document.querySelectorAll('.compounding-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.compounding-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                currentCompounding = e.currentTarget.dataset.comp;
            });
        });

        // Senior citizen toggle
        const seniorToggle = document.getElementById('seniorToggle');
        const seniorCheckbox = document.getElementById('seniorCheckbox');
        if (seniorToggle && seniorCheckbox) {
            seniorToggle.addEventListener('click', () => {
                isSeniorCitizen = !isSeniorCitizen;
                if (isSeniorCitizen) {
                    seniorCheckbox.classList.add('active');
                } else {
                    seniorCheckbox.classList.remove('active');
                }
            });
        }

        // Principal slider and input sync
        syncSliderAndInput('principal', 'principalSlider', 'principalInput', 'principalDisplay', (val) => `₹${formatNumber(val)}`);

        // Rate slider and input sync
        syncSliderAndInput('rate', 'rateSlider', 'rateInput', 'rateDisplay', (val) => `${val}%`);

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
        let rate = parseFloat(document.getElementById('rateInput').value) || 7.5;
        const bankType = document.getElementById('bankType').value;

        if (principal <= 0) {
            alert('Please enter a valid FD amount');
            return;
        }

        // Add senior citizen bonus
        if (isSeniorCitizen) {
            rate += 0.5;
        }

        const annualRate = rate;
        const r = rate / 100;
        const t = currentTenure;

        // Compounding frequency
        let n = 4; // quarterly
        if (currentCompounding === 'monthly') n = 12;
        if (currentCompounding === 'annually') n = 1;

        // Calculate maturity amount: A = P(1 + r/n)^(nt)
        const maturityAmount = principal * Math.pow(1 + r/n, n * t);
        const interestEarned = maturityAmount - principal;
        const absoluteReturn = (interestEarned / principal) * 100;
        const effectiveYield = (Math.pow(maturityAmount / principal, 1 / t) - 1) * 100;

        // TDS calculation
        const tdsThreshold = isSeniorCitizen ? 50000 : 40000;
        const tdsAmount = interestEarned > tdsThreshold ? interestEarned * 0.10 : 0;
        const netMaturityAmount = maturityAmount - tdsAmount;

        // Tax calculation (30% bracket)
        const taxAmount = interestEarned * 0.30;
        const postTaxMaturity = maturityAmount - taxAmount;
        const postTaxReturn = ((postTaxMaturity - principal) / principal) * 100;

        // Monthly interest
        const monthlyInterest = interestEarned / (t * 12);

        // Compounding frequency label
        const compoundingLabel = currentCompounding.charAt(0).toUpperCase() + currentCompounding.slice(1);

        // Tenure label
        const tenureLabel = t >= 1 ? `${t} ${t === 1 ? 'Year' : 'Years'}` : `${t * 12} Months`;

        // Bank names
        const bankNames = {
            public: 'Public Sector Bank',
            private: 'Private Bank',
            small: 'Small Finance Bank',
            post: 'Post Office'
        };

        displayResults(principal, annualRate, t, maturityAmount, interestEarned, absoluteReturn,
                      effectiveYield, monthlyInterest, tdsAmount, tdsThreshold, netMaturityAmount,
                      taxAmount, postTaxMaturity, postTaxReturn, n, compoundingLabel, tenureLabel,
                      bankType, bankNames[bankType]);
    }

    function displayResults(principal, annualRate, tenure, maturityAmount, interestEarned, absoluteReturn,
                           effectiveYield, monthlyInterest, tdsAmount, tdsThreshold, netMaturityAmount,
                           taxAmount, postTaxMaturity, postTaxReturn, n, compoundingLabel, tenureLabel,
                           bankType, bankName) {

        // Calculate percentages for breakdown bar
        const principalPercent = (principal / maturityAmount) * 100;
        const interestPercent = (interestEarned / maturityAmount) * 100;

        const resultsDiv = document.getElementById('fdResults');
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <div class="fd-results">
                    <div class="main-fd-card">
                        <div class="main-fd-label">💰 Maturity Amount</div>
                        <div class="main-fd-value">₹${formatNumber(maturityAmount.toFixed(0))}</div>
                        <div class="return-badge">Returns: ${absoluteReturn.toFixed(2)}%</div>
                    </div>

                    <div class="fd-breakdown-grid">
                        <div class="fd-breakdown-card">
                            <div class="fd-breakdown-label">Principal</div>
                            <div class="fd-breakdown-value">₹${formatNumber(principal)}</div>
                        </div>
                        <div class="fd-breakdown-card">
                            <div class="fd-breakdown-label">Interest Earned</div>
                            <div class="fd-breakdown-value" style="color: #10b981;">₹${formatNumber(interestEarned.toFixed(0))}</div>
                        </div>
                        <div class="fd-breakdown-card">
                            <div class="fd-breakdown-label">Post-Tax Amount</div>
                            <div class="fd-breakdown-value">₹${formatNumber(postTaxMaturity.toFixed(0))}</div>
                        </div>
                    </div>

                    <div class="fd-section">
                        <div class="section-title">
                            📊 Maturity Breakdown
                        </div>
                        <div class="maturity-breakdown-bar">
                            <div class="bar-principal" style="width: ${principalPercent}%;">
                                Principal: ₹${formatNumber(principal)}
                            </div>
                            <div class="bar-interest" style="width: ${interestPercent}%;">
                                Interest: ₹${formatNumber(interestEarned.toFixed(0))}
                            </div>
                        </div>
                    </div>

                    <div class="fd-section">
                        <div class="section-title">
                            📋 FD Details
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Deposit Amount</span>
                            <span class="fd-detail-value">₹${formatNumber(principal)}</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Interest Rate</span>
                            <span class="fd-detail-value">${annualRate}% p.a. ${isSeniorCitizen ? '(+0.5% senior)' : ''}</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Tenure</span>
                            <span class="fd-detail-value">${tenureLabel}</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Compounding</span>
                            <span class="fd-detail-value">${compoundingLabel}</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Bank Type</span>
                            <span class="fd-detail-value">${bankName}</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Senior Citizen</span>
                            <span class="fd-detail-value">${isSeniorCitizen ? 'Yes' : 'No'}</span>
                        </div>
                    </div>

                    <div class="fd-section">
                        <div class="section-title">
                            💵 Returns Analysis
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Principal Invested</span>
                            <span class="fd-detail-value">₹${formatNumber(principal)}</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Total Interest</span>
                            <span class="fd-detail-value" style="color: #10b981;">₹${formatNumber(interestEarned.toFixed(0))}</span>
                        </div>
                        <div class="fd-detail-row highlight">
                            <span class="fd-detail-label">Maturity Value</span>
                            <span class="fd-detail-value">₹${formatNumber(maturityAmount.toFixed(0))}</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Absolute Return</span>
                            <span class="fd-detail-value">${absoluteReturn.toFixed(2)}%</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Effective Annual Yield</span>
                            <span class="fd-detail-value">${effectiveYield.toFixed(2)}% p.a.</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Average Monthly Interest</span>
                            <span class="fd-detail-value">₹${formatNumber(monthlyInterest.toFixed(0))}</span>
                        </div>
                    </div>

                    <div class="fd-section">
                        <div class="section-title">
                            💸 Tax Implications
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Taxable Interest</span>
                            <span class="fd-detail-value">₹${formatNumber(interestEarned.toFixed(0))}</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">TDS Threshold</span>
                            <span class="fd-detail-value">₹${formatNumber(tdsThreshold)}</span>
                        </div>
                        ${tdsAmount > 0 ? `
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">TDS Deducted (10%)</span>
                            <span class="fd-detail-value" style="color: #ef4444;">₹${formatNumber(tdsAmount.toFixed(0))}</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Net Amount (After TDS)</span>
                            <span class="fd-detail-value">₹${formatNumber(netMaturityAmount.toFixed(0))}</span>
                        </div>
                        ` : `
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">TDS Applicable</span>
                            <span class="fd-detail-value" style="color: #10b981;">No (Below ₹${formatNumber(tdsThreshold)})</span>
                        </div>
                        `}
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Tax Liability (30% slab)</span>
                            <span class="fd-detail-value">₹${formatNumber(taxAmount.toFixed(0))}</span>
                        </div>
                        <div class="fd-detail-row highlight">
                            <span class="fd-detail-label">Post-Tax Maturity</span>
                            <span class="fd-detail-value">₹${formatNumber(postTaxMaturity.toFixed(0))}</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Post-Tax Return</span>
                            <span class="fd-detail-value">${postTaxReturn.toFixed(2)}%</span>
                        </div>

                        <div class="tds-info-box">
                            <div class="tds-title">ℹ️ TDS Information</div>
                            <div class="tds-text">
                                TDS of 10% is deducted if interest exceeds <strong>₹${formatNumber(tdsThreshold)}</strong> per year
                                ${isSeniorCitizen ? '(₹50,000 for senior citizens)' : '(₹40,000 for general depositors)'}.
                                Interest is fully taxable as per your income tax slab. You can claim credit for TDS in your tax return.
                                ${tenure >= 5 && bankType === 'post' ? ' <strong>Note:</strong> 5-year Post Office FD qualifies for Section 80C deduction (up to ₹1.5L).' : ''}
                            </div>
                        </div>
                    </div>

                    <div class="fd-section">
                        <div class="section-title">
                            🏦 Bank Features
                        </div>
                        ${bankType === 'small' ? `
                            <div class="bank-card selected">
                                <div class="bank-name">Small Finance Banks</div>
                                <div class="bank-desc">
                                    ✓ Higher interest rates (0.5-1% more than traditional banks)<br>
                                    ✓ DICGC insured up to ₹5 lakh per depositor<br>
                                    ✓ Good for maximizing returns<br>
                                    ⚠ Check bank's financial health before depositing
                                </div>
                            </div>
                        ` : bankType === 'post' ? `
                            <div class="bank-card selected">
                                <div class="bank-name">Post Office FD</div>
                                <div class="bank-desc">
                                    ✓ Government-backed, sovereign guarantee<br>
                                    ✓ 5-year FD eligible for 80C deduction (₹1.5L)<br>
                                    ✓ Safe investment option<br>
                                    ✓ No TDS deducted (for resident Indians)
                                </div>
                            </div>
                        ` : bankType === 'private' ? `
                            <div class="bank-card selected">
                                <div class="bank-name">Private Banks</div>
                                <div class="bank-desc">
                                    ✓ Competitive interest rates<br>
                                    ✓ Better digital banking experience<br>
                                    ✓ DICGC insured up to ₹5 lakh<br>
                                    ✓ Quick processing and service
                                </div>
                            </div>
                        ` : `
                            <div class="bank-card selected">
                                <div class="bank-name">Public Sector Banks</div>
                                <div class="bank-desc">
                                    ✓ Government-owned, perceived safer<br>
                                    ✓ Wide branch network<br>
                                    ✓ DICGC insured up to ₹5 lakh<br>
                                    ✓ Stable and trusted institutions
                                </div>
                            </div>
                        `}
                    </div>

                    <div class="fd-section">
                        <div class="section-title">
                            ℹ️ Key Features
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Premature Withdrawal</span>
                            <span class="fd-detail-value">Allowed (0.5-1% penalty)</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Loan Against FD</span>
                            <span class="fd-detail-value">Up to 90% of FD value</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Deposit Insurance</span>
                            <span class="fd-detail-value">₹5 lakh per bank (DICGC)</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Auto-Renewal</span>
                            <span class="fd-detail-value">Available at maturity</span>
                        </div>
                        <div class="fd-detail-row">
                            <span class="fd-detail-label">Nomination</span>
                            <span class="fd-detail-value">Mandatory for single holder</span>
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
