/**
 * Salary Calculator - Redesigned with calculator.net style
 * Features: Interactive sliders, visual breakdowns, annual/monthly toggle
 */

(function() {
    'use strict';

    let currentView = 'annual'; // 'annual' or 'monthly'

    // Add embedded styles
    const styles = `
        <style>
            .salary-calculator-container {
                max-width: 1000px;
                margin: 0 auto;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }

            .view-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 25px;
                border-bottom: 2px solid #e5e7eb;
            }

            .view-tab {
                flex: 1;
                padding: 12px 20px;
                background: none;
                border: none;
                border-bottom: 3px solid transparent;
                font-size: 15px;
                font-weight: 500;
                color: #6b7280;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .view-tab:hover {
                color: #8b5cf6;
                background: #f9fafb;
            }

            .view-tab.active {
                color: #8b5cf6;
                border-bottom-color: #8b5cf6;
                background: linear-gradient(to bottom, #faf5ff, transparent);
            }

            .view-icon {
                font-size: 18px;
            }

            .salary-input-section {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 25px;
            }

            .salary-input-group {
                margin-bottom: 20px;
            }

            .salary-label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #374151;
            }

            .label-value {
                color: #8b5cf6;
                font-weight: 600;
                font-size: 15px;
            }

            .slider-input-combo {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 12px;
                align-items: center;
            }

            .salary-slider {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: linear-gradient(to right, #e5e7eb, #8b5cf6);
                outline: none;
                -webkit-appearance: none;
            }

            .salary-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #8b5cf6;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .salary-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #8b5cf6;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .salary-number-input {
                width: 140px;
                padding: 8px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                text-align: right;
                transition: border-color 0.3s ease;
            }

            .salary-number-input:focus {
                outline: none;
                border-color: #8b5cf6;
            }

            .salary-select {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                background: white;
                cursor: pointer;
                transition: border-color 0.3s ease;
            }

            .salary-select:focus {
                outline: none;
                border-color: #8b5cf6;
            }

            .calculate-btn {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #8b5cf6, #6366f1);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
            }

            .calculate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
            }

            .salary-results {
                margin-top: 30px;
            }

            .main-result-card {
                background: linear-gradient(135deg, #8b5cf6, #6366f1);
                color: white;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 25px;
                box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
            }

            .main-result-label {
                font-size: 16px;
                opacity: 0.95;
                margin-bottom: 8px;
            }

            .main-result-value {
                font-size: 42px;
                font-weight: 700;
                margin-bottom: 15px;
            }

            .take-home-badge {
                display: inline-block;
                padding: 6px 16px;
                background: rgba(255, 255, 255, 0.25);
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
            }

            .breakdown-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 15px;
                margin-bottom: 25px;
            }

            .breakdown-card {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                border-left: 4px solid #8b5cf6;
            }

            .breakdown-card-label {
                font-size: 13px;
                color: #6b7280;
                margin-bottom: 6px;
            }

            .breakdown-card-value {
                font-size: 22px;
                font-weight: 700;
                color: #1f2937;
            }

            .salary-flow-section {
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

            .visual-breakdown-bar {
                margin-bottom: 25px;
            }

            .breakdown-bar-container {
                display: flex;
                height: 50px;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                margin-bottom: 10px;
            }

            .bar-segment {
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 13px;
                font-weight: 600;
                transition: all 0.3s ease;
                position: relative;
            }

            .bar-segment:hover {
                filter: brightness(1.1);
            }

            .segment-basic {
                background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            }

            .segment-hra {
                background: linear-gradient(135deg, #6366f1, #4f46e5);
            }

            .segment-allowance {
                background: linear-gradient(135deg, #a78bfa, #8b5cf6);
            }

            .segment-deduction {
                background: linear-gradient(135deg, #ef4444, #dc2626);
            }

            .bar-legend {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                font-size: 13px;
            }

            .legend-item {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .legend-color {
                width: 14px;
                height: 14px;
                border-radius: 3px;
            }

            .component-details {
                display: grid;
                gap: 12px;
            }

            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background: #f9fafb;
                border-radius: 8px;
                font-size: 14px;
            }

            .detail-row.total {
                background: #ede9fe;
                font-weight: 600;
                color: #6d28d9;
                border: 2px solid #c4b5fd;
            }

            .detail-label {
                color: #4b5563;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .detail-value {
                font-weight: 600;
                color: #1f2937;
            }

            .deduction-row {
                background: #fef2f2;
            }

            .deduction-row .detail-value {
                color: #dc2626;
            }

            .info-note {
                background: #eff6ff;
                border-left: 4px solid #3b82f6;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
                font-size: 14px;
                color: #1e40af;
                line-height: 1.6;
            }

            .pf-info-box {
                background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                border: 2px solid #10b981;
                padding: 18px;
                border-radius: 10px;
                margin-top: 20px;
            }

            .pf-title {
                font-weight: 600;
                color: #065f46;
                margin-bottom: 8px;
                font-size: 15px;
            }

            .pf-breakdown {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 12px;
                margin-top: 12px;
            }

            .pf-item {
                background: white;
                padding: 12px;
                border-radius: 8px;
                text-align: center;
            }

            .pf-item-label {
                font-size: 12px;
                color: #059669;
                margin-bottom: 4px;
            }

            .pf-item-value {
                font-size: 18px;
                font-weight: 700;
                color: #047857;
            }

            @media (max-width: 768px) {
                .main-result-value {
                    font-size: 32px;
                }

                .breakdown-grid {
                    grid-template-columns: 1fr;
                }

                .salary-number-input {
                    width: 100px;
                }

                .slider-input-combo {
                    grid-template-columns: 1fr;
                }

                .bar-segment {
                    font-size: 11px;
                }
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
            <div class="salary-calculator-container">
                <div class="view-tabs">
                    <button class="view-tab active" data-view="annual">
                        <span class="view-icon">📅</span>
                        <span>Annual View</span>
                    </button>
                    <button class="view-tab" data-view="monthly">
                        <span class="view-icon">📆</span>
                        <span>Monthly View</span>
                    </button>
                </div>

                <div class="salary-input-section">
                    <div class="salary-input-group">
                        <div class="salary-label">
                            <span>Annual CTC</span>
                            <span class="label-value" id="ctcDisplay">₹12,00,000</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="salary-slider" id="ctcSlider"
                                   min="100000" max="10000000" step="10000" value="1200000">
                            <input type="number" class="salary-number-input" id="ctcInput"
                                   value="1200000" min="100000" max="10000000" step="10000">
                        </div>
                    </div>

                    <div class="salary-input-group">
                        <div class="salary-label">
                            <span>Basic Salary (% of CTC)</span>
                            <span class="label-value" id="basicDisplay">40%</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="salary-slider" id="basicSlider"
                                   min="30" max="60" step="1" value="40">
                            <input type="number" class="salary-number-input" id="basicInput"
                                   value="40" min="30" max="60" step="1">
                        </div>
                    </div>

                    <div class="salary-input-group">
                        <div class="salary-label">
                            <span>HRA (% of Basic)</span>
                            <span class="label-value" id="hraDisplay">50%</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="salary-slider" id="hraSlider"
                                   min="0" max="100" step="5" value="50">
                            <input type="number" class="salary-number-input" id="hraInput"
                                   value="50" min="0" max="100" step="5">
                        </div>
                    </div>

                    <div class="salary-input-group">
                        <div class="salary-label">
                            <span>Special Allowance (% of CTC)</span>
                            <span class="label-value" id="allowanceDisplay">20%</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="salary-slider" id="allowanceSlider"
                                   min="0" max="50" step="1" value="20">
                            <input type="number" class="salary-number-input" id="allowanceInput"
                                   value="20" min="0" max="50" step="1">
                        </div>
                    </div>

                    <div class="salary-input-group">
                        <div class="salary-label">
                            <span>PF Contribution</span>
                        </div>
                        <select class="salary-select" id="pfContribution">
                            <option value="12" selected>12% (Standard EPF)</option>
                            <option value="0">0% (No PF)</option>
                        </select>
                    </div>

                    <div class="salary-input-group">
                        <div class="salary-label">
                            <span>Professional Tax</span>
                        </div>
                        <select class="salary-select" id="professionalTax">
                            <option value="2400">₹2,400/year (Maharashtra)</option>
                            <option value="2500" selected>₹2,500/year (Karnataka)</option>
                            <option value="3000">₹3,000/year (Tamil Nadu)</option>
                            <option value="2000">₹2,000/year (West Bengal)</option>
                            <option value="0">₹0/year (No PT)</option>
                        </select>
                    </div>

                    <div class="salary-input-group">
                        <div class="salary-label">
                            <span>Other Deductions (Annual)</span>
                            <span class="label-value" id="otherDisplay">₹0</span>
                        </div>
                        <input type="number" class="salary-number-input" id="otherDeductions"
                               value="0" min="0" step="1000" style="width: 100%;">
                    </div>

                    <button class="calculate-btn" id="calculateBtn">
                        💰 Calculate Salary Breakdown
                    </button>
                </div>

                <div id="salaryResults"></div>
            </div>
        `;
    }

    function setupEventListeners() {
        // View tab switching
        document.querySelectorAll('.view-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                currentView = e.currentTarget.dataset.view;

                // Recalculate to update view
                const calculateBtn = document.getElementById('calculateBtn');
                if (calculateBtn && document.getElementById('salaryResults').innerHTML) {
                    calculate();
                }
            });
        });

        // CTC slider and input sync
        syncSliderAndInput('ctc', 'ctcSlider', 'ctcInput', 'ctcDisplay', (val) => `₹${formatNumber(val)}`);

        // Basic salary slider and input sync
        syncSliderAndInput('basic', 'basicSlider', 'basicInput', 'basicDisplay', (val) => `${val}%`);

        // HRA slider and input sync
        syncSliderAndInput('hra', 'hraSlider', 'hraInput', 'hraDisplay', (val) => `${val}%`);

        // Allowance slider and input sync
        syncSliderAndInput('allowance', 'allowanceSlider', 'allowanceInput', 'allowanceDisplay', (val) => `${val}%`);

        // Other deductions input
        const otherInput = document.getElementById('otherDeductions');
        if (otherInput) {
            otherInput.addEventListener('input', (e) => {
                const display = document.getElementById('otherDisplay');
                if (display) {
                    display.textContent = `₹${formatNumber(e.target.value || 0)}`;
                }
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
        const ctc = parseFloat(document.getElementById('ctcInput').value) || 0;
        const basicPercent = parseFloat(document.getElementById('basicInput').value) || 40;
        const hraPercent = parseFloat(document.getElementById('hraInput').value) || 50;
        const allowancePercent = parseFloat(document.getElementById('allowanceInput').value) || 20;
        const pfPercent = parseFloat(document.getElementById('pfContribution').value) || 12;
        const professionalTax = parseFloat(document.getElementById('professionalTax').value) || 2500;
        const otherDeductions = parseFloat(document.getElementById('otherDeductions').value) || 0;

        if (ctc <= 0) {
            alert('Please enter a valid CTC amount');
            return;
        }

        // Calculate components
        const basic = (ctc * basicPercent) / 100;
        const hra = (basic * hraPercent) / 100;
        const specialAllowance = (ctc * allowancePercent) / 100;
        const grossSalary = basic + hra + specialAllowance;

        // Calculate PF
        const employeePF = (basic * pfPercent) / 100;
        const employerPF = (basic * pfPercent) / 100;

        // Calculate income tax
        const standardDeduction = 50000;
        const taxableIncome = Math.max(0, grossSalary - standardDeduction - employeePF);
        const incomeTax = calculateIncomeTax(taxableIncome);

        // Total deductions
        const totalDeductions = employeePF + professionalTax + incomeTax + otherDeductions;

        // Net salary
        const netSalary = grossSalary - totalDeductions;
        const takeHomePercent = (netSalary / ctc) * 100;

        // Monthly values
        const monthlyGross = grossSalary / 12;
        const monthlyNet = netSalary / 12;
        const monthlyPF = employeePF / 12;
        const monthlyPT = professionalTax / 12;
        const monthlyTax = incomeTax / 12;

        // Display multiplier based on view
        const multiplier = currentView === 'annual' ? 1 : 1/12;
        const viewLabel = currentView === 'annual' ? 'Annual' : 'Monthly';
        const viewIcon = currentView === 'annual' ? '📅' : '📆';

        // Calculate percentages for visual bar
        const basicPercent_visual = (basic / grossSalary) * 100;
        const hraPercent_visual = (hra / grossSalary) * 100;
        const allowancePercent_visual = (specialAllowance / grossSalary) * 100;

        const resultsDiv = document.getElementById('salaryResults');
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <div class="salary-results">
                    <div class="main-result-card">
                        <div class="main-result-label">${viewIcon} ${viewLabel} In-Hand Salary</div>
                        <div class="main-result-value">₹${formatNumber((netSalary * multiplier).toFixed(0))}</div>
                        <div class="take-home-badge">Take Home: ${takeHomePercent.toFixed(1)}% of CTC</div>
                    </div>

                    <div class="breakdown-grid">
                        <div class="breakdown-card">
                            <div class="breakdown-card-label">${viewLabel} Gross Salary</div>
                            <div class="breakdown-card-value">₹${formatNumber((grossSalary * multiplier).toFixed(0))}</div>
                        </div>
                        <div class="breakdown-card">
                            <div class="breakdown-card-label">Total Deductions</div>
                            <div class="breakdown-card-value" style="color: #dc2626;">₹${formatNumber((totalDeductions * multiplier).toFixed(0))}</div>
                        </div>
                        <div class="breakdown-card">
                            <div class="breakdown-card-label">${viewLabel} CTC</div>
                            <div class="breakdown-card-value">₹${formatNumber((ctc * multiplier).toFixed(0))}</div>
                        </div>
                    </div>

                    <div class="salary-flow-section">
                        <div class="section-title">
                            📊 Salary Component Breakdown
                        </div>
                        <div class="visual-breakdown-bar">
                            <div class="breakdown-bar-container">
                                <div class="bar-segment segment-basic" style="width: ${basicPercent_visual}%;">
                                    ${basicPercent_visual > 15 ? basicPercent_visual.toFixed(0) + '%' : ''}
                                </div>
                                <div class="bar-segment segment-hra" style="width: ${hraPercent_visual}%;">
                                    ${hraPercent_visual > 15 ? hraPercent_visual.toFixed(0) + '%' : ''}
                                </div>
                                <div class="bar-segment segment-allowance" style="width: ${allowancePercent_visual}%;">
                                    ${allowancePercent_visual > 15 ? allowancePercent_visual.toFixed(0) + '%' : ''}
                                </div>
                            </div>
                            <div class="bar-legend">
                                <div class="legend-item">
                                    <div class="legend-color segment-basic"></div>
                                    <span>Basic Salary</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color segment-hra"></div>
                                    <span>HRA</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color segment-allowance"></div>
                                    <span>Special Allowance</span>
                                </div>
                            </div>
                        </div>

                        <div class="component-details">
                            <div class="detail-row">
                                <span class="detail-label">💼 Basic Salary (${basicPercent}%)</span>
                                <span class="detail-value">₹${formatNumber((basic * multiplier).toFixed(0))}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">🏠 HRA (${hraPercent}% of Basic)</span>
                                <span class="detail-value">₹${formatNumber((hra * multiplier).toFixed(0))}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">✨ Special Allowance</span>
                                <span class="detail-value">₹${formatNumber((specialAllowance * multiplier).toFixed(0))}</span>
                            </div>
                            <div class="detail-row total">
                                <span class="detail-label">💰 Gross Salary</span>
                                <span class="detail-value">₹${formatNumber((grossSalary * multiplier).toFixed(0))}</span>
                            </div>
                        </div>
                    </div>

                    <div class="salary-flow-section">
                        <div class="section-title">
                            📉 Deductions Breakdown
                        </div>
                        <div class="component-details">
                            <div class="detail-row deduction-row">
                                <span class="detail-label">🏦 Employee PF (${pfPercent}% of Basic)</span>
                                <span class="detail-value">₹${formatNumber((employeePF * multiplier).toFixed(0))}</span>
                            </div>
                            <div class="detail-row deduction-row">
                                <span class="detail-label">📋 Professional Tax</span>
                                <span class="detail-value">₹${formatNumber((professionalTax * multiplier).toFixed(0))}</span>
                            </div>
                            <div class="detail-row deduction-row">
                                <span class="detail-label">💳 Income Tax (TDS)</span>
                                <span class="detail-value">₹${formatNumber((incomeTax * multiplier).toFixed(0))}</span>
                            </div>
                            ${otherDeductions > 0 ? `
                            <div class="detail-row deduction-row">
                                <span class="detail-label">📊 Other Deductions</span>
                                <span class="detail-value">₹${formatNumber((otherDeductions * multiplier).toFixed(0))}</span>
                            </div>
                            ` : ''}
                            <div class="detail-row total">
                                <span class="detail-label">📉 Total Deductions</span>
                                <span class="detail-value" style="color: #dc2626;">₹${formatNumber((totalDeductions * multiplier).toFixed(0))}</span>
                            </div>
                        </div>

                        <div class="info-note">
                            <strong>ℹ️ Tax Calculation:</strong> Income tax is calculated using the New Tax Regime (FY 2024-25)
                            with standard deduction of ₹50,000 and includes 4% Health & Education Cess.
                        </div>
                    </div>

                    ${pfPercent > 0 ? `
                    <div class="salary-flow-section">
                        <div class="section-title">
                            💎 Your PF Benefits
                        </div>
                        <div class="pf-info-box">
                            <div class="pf-title">Total PF Contribution (Employee + Employer)</div>
                            <div class="pf-breakdown">
                                <div class="pf-item">
                                    <div class="pf-item-label">Your Contribution</div>
                                    <div class="pf-item-value">₹${formatNumber(employeePF.toFixed(0))}</div>
                                </div>
                                <div class="pf-item">
                                    <div class="pf-item-label">Employer Contribution</div>
                                    <div class="pf-item-value">₹${formatNumber(employerPF.toFixed(0))}</div>
                                </div>
                                <div class="pf-item">
                                    <div class="pf-item-label">Total Annual PF</div>
                                    <div class="pf-item-value">₹${formatNumber((employeePF + employerPF).toFixed(0))}</div>
                                </div>
                            </div>
                            <div style="margin-top: 12px; font-size: 13px; color: #047857;">
                                💡 Your PF account grows with contributions from both you and your employer,
                                building a secure retirement corpus with competitive interest rates.
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <div class="salary-flow-section">
                        <div class="section-title">
                            📈 CTC vs In-Hand Comparison
                        </div>
                        <div class="component-details">
                            <div class="detail-row">
                                <span class="detail-label">Annual CTC</span>
                                <span class="detail-value">₹${formatNumber(ctc.toFixed(0))}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Gross Salary</span>
                                <span class="detail-value">₹${formatNumber(grossSalary.toFixed(0))}</span>
                            </div>
                            <div class="detail-row deduction-row">
                                <span class="detail-label">Total Deductions</span>
                                <span class="detail-value">₹${formatNumber(totalDeductions.toFixed(0))}</span>
                            </div>
                            <div class="detail-row total">
                                <span class="detail-label">💵 Net In-Hand Salary</span>
                                <span class="detail-value">₹${formatNumber(netSalary.toFixed(0))}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">CTC Gap</span>
                                <span class="detail-value" style="color: #dc2626;">₹${formatNumber((ctc - netSalary).toFixed(0))} (${(100 - takeHomePercent).toFixed(1)}%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    function calculateIncomeTax(taxableIncome) {
        // New tax regime FY 2024-25
        let tax = 0;

        if (taxableIncome <= 300000) {
            tax = 0;
        } else if (taxableIncome <= 600000) {
            tax = (taxableIncome - 300000) * 0.05;
        } else if (taxableIncome <= 900000) {
            tax = 15000 + (taxableIncome - 600000) * 0.10;
        } else if (taxableIncome <= 1200000) {
            tax = 45000 + (taxableIncome - 900000) * 0.15;
        } else if (taxableIncome <= 1500000) {
            tax = 90000 + (taxableIncome - 1200000) * 0.20;
        } else {
            tax = 150000 + (taxableIncome - 1500000) * 0.30;
        }

        // Add 4% Health and Education Cess
        tax = tax * 1.04;

        return tax;
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
