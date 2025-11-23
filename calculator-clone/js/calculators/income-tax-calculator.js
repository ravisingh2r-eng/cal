/**
 * Income Tax Calculator - Redesigned with calculator.net style
 * Features: Tax slab visualization, regime comparison, interactive sliders
 */

(function() {
    'use strict';

    let currentRegime = 'new';

    // Add embedded styles
    const styles = `
        <style>
            .tax-calculator-container {
                max-width: 1000px;
                margin: 0 auto;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }

            .regime-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 25px;
                border-bottom: 2px solid #e5e7eb;
            }

            .regime-tab {
                flex: 1;
                padding: 14px 20px;
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

            .regime-tab:hover {
                color: #f97316;
                background: #fff7ed;
            }

            .regime-tab.active {
                color: #f97316;
                border-bottom-color: #f97316;
                background: linear-gradient(to bottom, #fff7ed, transparent);
            }

            .regime-icon {
                font-size: 18px;
            }

            .tax-input-section {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 25px;
            }

            .tax-input-group {
                margin-bottom: 20px;
            }

            .tax-label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #374151;
            }

            .label-value {
                color: #f97316;
                font-weight: 600;
                font-size: 15px;
            }

            .slider-input-combo {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 12px;
                align-items: center;
            }

            .tax-slider {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: linear-gradient(to right, #fef3c7, #f97316);
                outline: none;
                -webkit-appearance: none;
            }

            .tax-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #f97316;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .tax-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #f97316;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .tax-number-input {
                width: 140px;
                padding: 8px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                text-align: right;
                transition: border-color 0.3s ease;
            }

            .tax-number-input:focus {
                outline: none;
                border-color: #f97316;
            }

            .tax-select {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                background: white;
                cursor: pointer;
                transition: border-color 0.3s ease;
            }

            .tax-select:focus {
                outline: none;
                border-color: #f97316;
            }

            .deduction-inputs {
                display: grid;
                gap: 15px;
                padding: 15px;
                background: #fffbeb;
                border-radius: 8px;
                border: 2px dashed #fbbf24;
                margin-top: 15px;
            }

            .deduction-note {
                font-size: 12px;
                color: #92400e;
                font-style: italic;
            }

            .calculate-btn {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #f97316, #ef4444);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
            }

            .calculate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4);
            }

            .tax-results {
                margin-top: 30px;
            }

            .main-tax-card {
                background: linear-gradient(135deg, #f97316, #ef4444);
                color: white;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 25px;
                box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
            }

            .main-tax-label {
                font-size: 16px;
                opacity: 0.95;
                margin-bottom: 8px;
            }

            .main-tax-value {
                font-size: 42px;
                font-weight: 700;
                margin-bottom: 15px;
            }

            .effective-rate-badge {
                display: inline-block;
                padding: 6px 16px;
                background: rgba(255, 255, 255, 0.25);
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
            }

            .tax-breakdown-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 15px;
                margin-bottom: 25px;
            }

            .tax-breakdown-card {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                border-left: 4px solid #f97316;
            }

            .tax-breakdown-label {
                font-size: 13px;
                color: #6b7280;
                margin-bottom: 6px;
            }

            .tax-breakdown-value {
                font-size: 22px;
                font-weight: 700;
                color: #1f2937;
            }

            .tax-section {
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

            .slab-visualization {
                margin-top: 20px;
            }

            .slab-item {
                margin-bottom: 15px;
            }

            .slab-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;
                font-size: 13px;
            }

            .slab-range {
                color: #4b5563;
                font-weight: 500;
            }

            .slab-rate {
                font-weight: 600;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 12px;
            }

            .slab-rate-0 { background: #d1fae5; color: #065f46; }
            .slab-rate-5 { background: #dbeafe; color: #1e40af; }
            .slab-rate-10 { background: #e0e7ff; color: #3730a3; }
            .slab-rate-15 { background: #fce7f3; color: #9f1239; }
            .slab-rate-20 { background: #ffedd5; color: #9a3412; }
            .slab-rate-30 { background: #fee2e2; color: #991b1b; }

            .slab-bar-container {
                display: flex;
                height: 35px;
                border-radius: 6px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .slab-bar-filled {
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .slab-bar-empty {
                background: #f3f4f6;
            }

            .tax-detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background: #f9fafb;
                border-radius: 8px;
                font-size: 14px;
                margin-bottom: 8px;
            }

            .tax-detail-row.total {
                background: #fff7ed;
                font-weight: 600;
                color: #9a3412;
                border: 2px solid #fed7aa;
            }

            .tax-detail-label {
                color: #4b5563;
            }

            .tax-detail-value {
                font-weight: 600;
                color: #1f2937;
            }

            .regime-comparison {
                background: linear-gradient(135deg, #fef3c7, #fed7aa);
                padding: 20px;
                border-radius: 10px;
                margin-top: 20px;
            }

            .comparison-title {
                font-weight: 600;
                color: #92400e;
                margin-bottom: 12px;
                font-size: 15px;
            }

            .comparison-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }

            .comparison-card {
                background: white;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                border: 2px solid transparent;
                transition: all 0.3s ease;
            }

            .comparison-card.better {
                border-color: #10b981;
                background: #ecfdf5;
            }

            .comparison-regime {
                font-size: 13px;
                color: #6b7280;
                margin-bottom: 4px;
            }

            .comparison-value {
                font-size: 20px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 4px;
            }

            .comparison-badge {
                display: inline-block;
                padding: 4px 10px;
                background: #10b981;
                color: white;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
            }

            .tax-savings-tips {
                background: #eff6ff;
                border-left: 4px solid #3b82f6;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
            }

            .tips-title {
                font-weight: 600;
                color: #1e40af;
                margin-bottom: 10px;
                font-size: 14px;
            }

            .tips-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .tips-list li {
                padding: 6px 0;
                font-size: 13px;
                color: #1e40af;
                display: flex;
                align-items: start;
                gap: 8px;
            }

            .tips-list li:before {
                content: "💡";
                flex-shrink: 0;
            }

            @media (max-width: 768px) {
                .main-tax-value {
                    font-size: 32px;
                }

                .tax-breakdown-grid {
                    grid-template-columns: 1fr;
                }

                .tax-number-input {
                    width: 100px;
                }

                .slider-input-combo {
                    grid-template-columns: 1fr;
                }

                .comparison-grid {
                    grid-template-columns: 1fr;
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
            <div class="tax-calculator-container">
                <div class="regime-tabs">
                    <button class="regime-tab active" data-regime="new">
                        <span class="regime-icon">✨</span>
                        <span>New Tax Regime (FY 2024-25)</span>
                    </button>
                    <button class="regime-tab" data-regime="old">
                        <span class="regime-icon">📋</span>
                        <span>Old Tax Regime</span>
                    </button>
                </div>

                <div class="tax-input-section">
                    <div class="tax-input-group">
                        <div class="tax-label">
                            <span>Annual Gross Income</span>
                            <span class="label-value" id="incomeDisplay">₹10,00,000</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="tax-slider" id="incomeSlider"
                                   min="100000" max="10000000" step="10000" value="1000000">
                            <input type="number" class="tax-number-input" id="incomeInput"
                                   value="1000000" min="100000" max="10000000" step="10000">
                        </div>
                    </div>

                    <div class="tax-input-group">
                        <div class="tax-label">
                            <span>Age Group</span>
                        </div>
                        <select class="tax-select" id="ageGroup">
                            <option value="below60" selected>Below 60 years</option>
                            <option value="60to80">60-80 years (Senior Citizen)</option>
                            <option value="above80">Above 80 years (Super Senior Citizen)</option>
                        </select>
                    </div>

                    <div id="deductionSection" style="display: none;">
                        <div class="deduction-inputs">
                            <div class="deduction-note">
                                📌 Deductions are only available in Old Tax Regime
                            </div>
                            <div class="tax-input-group" style="margin-bottom: 10px;">
                                <div class="tax-label">
                                    <span>Section 80C (PPF, ELSS, LIC, etc.)</span>
                                    <span class="label-value" id="sec80cDisplay">₹1,50,000</span>
                                </div>
                                <input type="number" class="tax-number-input" id="sec80cInput"
                                       value="150000" min="0" max="150000" step="10000" style="width: 100%;">
                            </div>
                            <div class="tax-input-group" style="margin-bottom: 0;">
                                <div class="tax-label">
                                    <span>Other Deductions (80D, 80G, etc.)</span>
                                    <span class="label-value" id="otherDedDisplay">₹0</span>
                                </div>
                                <input type="number" class="tax-number-input" id="otherDedInput"
                                       value="0" min="0" step="5000" style="width: 100%;">
                            </div>
                        </div>
                    </div>

                    <button class="calculate-btn" id="calculateBtn">
                        💸 Calculate Tax
                    </button>
                </div>

                <div id="taxResults"></div>
            </div>
        `;
    }

    function setupEventListeners() {
        // Regime tab switching
        document.querySelectorAll('.regime-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.regime-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                currentRegime = e.currentTarget.dataset.regime;

                // Show/hide deduction section
                const deductionSection = document.getElementById('deductionSection');
                if (deductionSection) {
                    deductionSection.style.display = currentRegime === 'old' ? 'block' : 'none';
                }

                // Recalculate if results exist
                const resultsDiv = document.getElementById('taxResults');
                if (resultsDiv && resultsDiv.innerHTML) {
                    calculate();
                }
            });
        });

        // Income slider and input sync
        syncSliderAndInput('income', 'incomeSlider', 'incomeInput', 'incomeDisplay', (val) => `₹${formatNumber(val)}`);

        // Deduction inputs
        const sec80cInput = document.getElementById('sec80cInput');
        if (sec80cInput) {
            sec80cInput.addEventListener('input', (e) => {
                const display = document.getElementById('sec80cDisplay');
                if (display) {
                    display.textContent = `₹${formatNumber(e.target.value || 0)}`;
                }
            });
        }

        const otherDedInput = document.getElementById('otherDedInput');
        if (otherDedInput) {
            otherDedInput.addEventListener('input', (e) => {
                const display = document.getElementById('otherDedDisplay');
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
        const income = parseFloat(document.getElementById('incomeInput').value) || 0;
        const ageGroup = document.getElementById('ageGroup').value;
        const sec80c = currentRegime === 'old' ? Math.min(parseFloat(document.getElementById('sec80cInput').value) || 0, 150000) : 0;
        const otherDed = currentRegime === 'old' ? (parseFloat(document.getElementById('otherDedInput').value) || 0) : 0;

        if (income <= 0) {
            alert('Please enter a valid income amount');
            return;
        }

        // Calculate for current regime
        const currentResult = calculateTaxForRegime(income, currentRegime, ageGroup, sec80c, otherDed);

        // Calculate for comparison
        const otherRegime = currentRegime === 'new' ? 'old' : 'new';
        const comparisonResult = calculateTaxForRegime(income, otherRegime, ageGroup, sec80c, otherDed);

        displayResults(income, currentResult, comparisonResult, ageGroup, sec80c, otherDed);
    }

    function calculateTaxForRegime(income, regime, ageGroup, sec80c, otherDed) {
        let tax = 0;
        let taxableIncome = income;
        let slabs = [];

        if (regime === 'old') {
            taxableIncome = income - sec80c - otherDed - 50000; // Standard deduction

            let exemptLimit = ageGroup === 'below60' ? 250000 : (ageGroup === '60to80' ? 300000 : 500000);

            // Old regime slabs
            if (taxableIncome > exemptLimit) {
                let slab1Limit = ageGroup === 'above80' ? 0 : (ageGroup === '60to80' ? 300000 : 250000);
                let slab2Limit = 500000;
                let slab3Limit = 1000000;

                if (ageGroup !== 'above80' && taxableIncome > slab1Limit) {
                    let taxable = Math.min(taxableIncome, slab2Limit) - slab1Limit;
                    let taxInSlab = taxable * 0.05;
                    tax += taxInSlab;
                    slabs.push({ range: `₹${formatNumber(slab1Limit)} - ₹${formatNumber(slab2Limit)}`, rate: '5%', amount: taxInSlab, rateClass: 'slab-rate-5' });
                }

                if (taxableIncome > slab2Limit) {
                    let taxable = Math.min(taxableIncome, slab3Limit) - slab2Limit;
                    let taxInSlab = taxable * 0.20;
                    tax += taxInSlab;
                    slabs.push({ range: `₹${formatNumber(slab2Limit)} - ₹${formatNumber(slab3Limit)}`, rate: '20%', amount: taxInSlab, rateClass: 'slab-rate-20' });
                }

                if (taxableIncome > slab3Limit) {
                    let taxable = taxableIncome - slab3Limit;
                    let taxInSlab = taxable * 0.30;
                    tax += taxInSlab;
                    slabs.push({ range: `Above ₹${formatNumber(slab3Limit)}`, rate: '30%', amount: taxInSlab, rateClass: 'slab-rate-30' });
                }
            }
        } else {
            // New regime
            taxableIncome = income - 50000; // Standard deduction only

            if (taxableIncome > 300000) {
                let taxable = Math.min(taxableIncome, 600000) - 300000;
                let taxInSlab = taxable * 0.05;
                tax += taxInSlab;
                slabs.push({ range: '₹3L - ₹6L', rate: '5%', amount: taxInSlab, rateClass: 'slab-rate-5' });
            }

            if (taxableIncome > 600000) {
                let taxable = Math.min(taxableIncome, 900000) - 600000;
                let taxInSlab = taxable * 0.10;
                tax += taxInSlab;
                slabs.push({ range: '₹6L - ₹9L', rate: '10%', amount: taxInSlab, rateClass: 'slab-rate-10' });
            }

            if (taxableIncome > 900000) {
                let taxable = Math.min(taxableIncome, 1200000) - 900000;
                let taxInSlab = taxable * 0.15;
                tax += taxInSlab;
                slabs.push({ range: '₹9L - ₹12L', rate: '15%', amount: taxInSlab, rateClass: 'slab-rate-15' });
            }

            if (taxableIncome > 1200000) {
                let taxable = Math.min(taxableIncome, 1500000) - 1200000;
                let taxInSlab = taxable * 0.20;
                tax += taxInSlab;
                slabs.push({ range: '₹12L - ₹15L', rate: '20%', amount: taxInSlab, rateClass: 'slab-rate-20' });
            }

            if (taxableIncome > 1500000) {
                let taxable = taxableIncome - 1500000;
                let taxInSlab = taxable * 0.30;
                tax += taxInSlab;
                slabs.push({ range: 'Above ₹15L', rate: '30%', amount: taxInSlab, rateClass: 'slab-rate-30' });
            }
        }

        const cess = tax * 0.04;
        const totalTax = tax + cess;

        return { tax, cess, totalTax, taxableIncome, slabs };
    }

    function displayResults(income, currentResult, comparisonResult, ageGroup, sec80c, otherDed) {
        const netIncome = income - currentResult.totalTax;
        const effectiveRate = (currentResult.totalTax / income) * 100;
        const monthlyTax = currentResult.totalTax / 12;

        const isBetter = currentResult.totalTax <= comparisonResult.totalTax;
        const savings = Math.abs(currentResult.totalTax - comparisonResult.totalTax);

        const currentRegimeName = currentRegime === 'new' ? 'New Regime' : 'Old Regime';
        const otherRegimeName = currentRegime === 'new' ? 'Old Regime' : 'New Regime';

        let slabsHTML = '';
        if (currentResult.slabs.length > 0) {
            slabsHTML = currentResult.slabs.map(slab => `
                <div class="slab-item">
                    <div class="slab-header">
                        <span class="slab-range">${slab.range}</span>
                        <span class="slab-rate ${slab.rateClass}">${slab.rate}</span>
                    </div>
                    <div class="slab-bar-container">
                        <div class="slab-bar-filled ${slab.rateClass.replace('rate', 'bar')}"
                             style="width: 100%; background: linear-gradient(135deg, #f97316, #ef4444);">
                            Tax: ₹${formatNumber(slab.amount.toFixed(0))}
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            slabsHTML = '<div style="padding: 20px; text-align: center; color: #10b981; font-weight: 600;">🎉 No tax payable! Your income is below the exemption limit.</div>';
        }

        const resultsDiv = document.getElementById('taxResults');
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <div class="tax-results">
                    <div class="main-tax-card">
                        <div class="main-tax-label">💸 Total Tax Payable (${currentRegimeName})</div>
                        <div class="main-tax-value">₹${formatNumber(currentResult.totalTax.toFixed(0))}</div>
                        <div class="effective-rate-badge">Effective Rate: ${effectiveRate.toFixed(2)}%</div>
                    </div>

                    <div class="tax-breakdown-grid">
                        <div class="tax-breakdown-card">
                            <div class="tax-breakdown-label">Net In-Hand Income</div>
                            <div class="tax-breakdown-value" style="color: #10b981;">₹${formatNumber(netIncome.toFixed(0))}</div>
                        </div>
                        <div class="tax-breakdown-card">
                            <div class="tax-breakdown-label">Monthly Tax (TDS)</div>
                            <div class="tax-breakdown-value">₹${formatNumber(monthlyTax.toFixed(0))}</div>
                        </div>
                        <div class="tax-breakdown-card">
                            <div class="tax-breakdown-label">Taxable Income</div>
                            <div class="tax-breakdown-value">₹${formatNumber(Math.max(currentResult.taxableIncome, 0).toFixed(0))}</div>
                        </div>
                    </div>

                    <div class="tax-section">
                        <div class="section-title">
                            📊 Tax Slab Breakdown
                        </div>
                        <div class="slab-visualization">
                            ${slabsHTML}
                        </div>
                    </div>

                    <div class="tax-section">
                        <div class="section-title">
                            🧮 Tax Calculation Details
                        </div>
                        <div class="tax-detail-row">
                            <span class="tax-detail-label">Gross Annual Income</span>
                            <span class="tax-detail-value">₹${formatNumber(income)}</span>
                        </div>
                        ${currentRegime === 'old' ? `
                        <div class="tax-detail-row">
                            <span class="tax-detail-label">Section 80C Deductions</span>
                            <span class="tax-detail-value">₹${formatNumber(sec80c)}</span>
                        </div>
                        <div class="tax-detail-row">
                            <span class="tax-detail-label">Other Deductions</span>
                            <span class="tax-detail-value">₹${formatNumber(otherDed)}</span>
                        </div>
                        ` : ''}
                        <div class="tax-detail-row">
                            <span class="tax-detail-label">Standard Deduction</span>
                            <span class="tax-detail-value">₹50,000</span>
                        </div>
                        <div class="tax-detail-row total">
                            <span class="tax-detail-label">Taxable Income</span>
                            <span class="tax-detail-value">₹${formatNumber(Math.max(currentResult.taxableIncome, 0).toFixed(0))}</span>
                        </div>
                        <div class="tax-detail-row">
                            <span class="tax-detail-label">Income Tax</span>
                            <span class="tax-detail-value">₹${formatNumber(currentResult.tax.toFixed(0))}</span>
                        </div>
                        <div class="tax-detail-row">
                            <span class="tax-detail-label">Health & Education Cess (4%)</span>
                            <span class="tax-detail-value">₹${formatNumber(currentResult.cess.toFixed(0))}</span>
                        </div>
                        <div class="tax-detail-row total">
                            <span class="tax-detail-label">Total Tax Payable</span>
                            <span class="tax-detail-value">₹${formatNumber(currentResult.totalTax.toFixed(0))}</span>
                        </div>

                        <div class="regime-comparison">
                            <div class="comparison-title">📊 Regime Comparison</div>
                            <div class="comparison-grid">
                                <div class="comparison-card ${isBetter ? 'better' : ''}">
                                    <div class="comparison-regime">${currentRegimeName}</div>
                                    <div class="comparison-value">₹${formatNumber(currentResult.totalTax.toFixed(0))}</div>
                                    ${isBetter ? '<span class="comparison-badge">✓ Better Option</span>' : ''}
                                </div>
                                <div class="comparison-card ${!isBetter ? 'better' : ''}">
                                    <div class="comparison-regime">${otherRegimeName}</div>
                                    <div class="comparison-value">₹${formatNumber(comparisonResult.totalTax.toFixed(0))}</div>
                                    ${!isBetter ? '<span class="comparison-badge">✓ Better Option</span>' : ''}
                                </div>
                            </div>
                            ${savings > 0 ? `
                            <div style="text-align: center; margin-top: 12px; font-size: 14px; color: #92400e;">
                                ${isBetter ? '💰 You save' : '⚠️ You pay extra'} <strong>₹${formatNumber(savings.toFixed(0))}</strong> with ${currentRegimeName}
                            </div>
                            ` : ''}
                        </div>

                        ${currentRegime === 'old' ? `
                        <div class="tax-savings-tips">
                            <div class="tips-title">💡 Tax Saving Tips (Old Regime)</div>
                            <ul class="tips-list">
                                <li>Invest up to ₹1.5L in PPF, ELSS, or NPS under Section 80C</li>
                                <li>Claim health insurance premiums under Section 80D (up to ₹25K or ₹50K for seniors)</li>
                                <li>Donate to eligible charities under Section 80G for deductions</li>
                                <li>Home loan interest deduction under Section 24 (up to ₹2L)</li>
                                <li>Save on education loan interest under Section 80E</li>
                            </ul>
                        </div>
                        ` : `
                        <div class="tax-savings-tips">
                            <div class="tips-title">ℹ️ New Regime Features</div>
                            <ul class="tips-list">
                                <li>Lower tax rates but no deductions (except ₹50K standard deduction)</li>
                                <li>Simpler calculation with fewer tax slabs</li>
                                <li>Good for those without significant investments or deductions</li>
                                <li>You can switch between regimes every year based on your situation</li>
                            </ul>
                        </div>
                        `}
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
