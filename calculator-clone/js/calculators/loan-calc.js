/**
 * Enhanced Loan Calculator - Modern Design
 * Features: Interactive sliders, processing fee calculation, income recommendation
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
            <div class="loan-calculator-container">
                <!-- Loan Amount -->
                <div class="calc-input-group">
                    <label for="loanAmount">Loan Amount (₹)</label>
                    <input type="number" class="calc-input" id="loanAmount" value="500000" min="10000" step="10000">
                    <input type="range" class="calc-slider" id="loanAmountSlider" min="10000" max="5000000" value="500000" step="10000">
                    <div class="slider-labels">
                        <span>₹10K</span>
                        <span>₹50L</span>
                    </div>
                </div>

                <!-- Interest Rate -->
                <div class="calc-input-group">
                    <label for="rate">Interest Rate (% per year)</label>
                    <input type="number" class="calc-input" id="rate" value="12" min="5" max="30" step="0.1">
                    <input type="range" class="calc-slider" id="rateSlider" min="5" max="30" value="12" step="0.1">
                    <div class="slider-labels">
                        <span>5%</span>
                        <span>30%</span>
                    </div>
                </div>

                <!-- Loan Tenure -->
                <div class="calc-input-group">
                    <label for="tenure">Loan Tenure (years)</label>
                    <input type="number" class="calc-input" id="tenure" value="3" min="1" max="20">
                    <input type="range" class="calc-slider" id="tenureSlider" min="1" max="20" value="3" step="1">
                    <div class="slider-labels">
                        <span>1 Year</span>
                        <span>20 Years</span>
                    </div>
                </div>

                <!-- Loan Purpose -->
                <div class="calc-input-group">
                    <label for="purpose">Loan Purpose</label>
                    <select class="calc-input" id="purpose">
                        <option value="personal">Personal Loan</option>
                        <option value="debt-consolidation">Debt Consolidation</option>
                        <option value="home-renovation">Home Renovation</option>
                        <option value="wedding">Wedding</option>
                        <option value="medical">Medical Emergency</option>
                        <option value="education">Education</option>
                        <option value="travel">Travel</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <!-- Employment Type -->
                <div class="calc-input-group">
                    <label for="employment">Employment Type</label>
                    <select class="calc-input" id="employment">
                        <option value="salaried">Salaried</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="business">Business Owner</option>
                    </select>
                </div>

                <!-- Calculate Button -->
                <button type="button" class="btn btn-primary btn-large" id="calculateBtn">
                    <span>Calculate Loan</span>
                </button>
            </div>

            <style>
                .loan-calculator-container {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .calc-slider {
                    width: 100%;
                    height: 8px;
                    border-radius: 5px;
                    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
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
                    border: 3px solid #3b82f6;
                }

                .calc-slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    border: 3px solid #3b82f6;
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
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
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
        document.getElementById('loanAmountSlider')?.addEventListener('input', function() {
            document.getElementById('loanAmount').value = this.value;
        });

        document.getElementById('rateSlider')?.addEventListener('input', function() {
            document.getElementById('rate').value = this.value;
        });

        document.getElementById('tenureSlider')?.addEventListener('input', function() {
            document.getElementById('tenure').value = this.value;
        });

        // Sync inputs with sliders
        document.getElementById('loanAmount')?.addEventListener('input', function() {
            document.getElementById('loanAmountSlider').value = this.value;
        });

        document.getElementById('rate')?.addEventListener('input', function() {
            document.getElementById('rateSlider').value = this.value;
        });

        document.getElementById('tenure')?.addEventListener('input', function() {
            document.getElementById('tenureSlider').value = this.value;
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
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const rate = parseFloat(document.getElementById('rate').value) || 12;
        const tenure = parseFloat(document.getElementById('tenure').value) || 3;
        const purpose = document.getElementById('purpose').value;
        const employment = document.getElementById('employment').value;

        if (loanAmount <= 0 || rate <= 0 || tenure <= 0) {
            alert('Please enter valid values');
            return;
        }

        // EMI calculation
        const monthlyRate = rate / 12 / 100;
        const tenureMonths = tenure * 12;
        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

        // Total calculations
        const totalPayment = emi * tenureMonths;
        const totalInterest = totalPayment - loanAmount;

        // Processing fee (varies by employment)
        const processingFeePercent = employment === 'salaried' ? 1 : employment === 'self-employed' ? 1.5 : 2;
        const processingFee = loanAmount * (processingFeePercent / 100);

        // GST on processing fee (18%)
        const gstOnFee = processingFee * 0.18;
        const totalProcessingFee = processingFee + gstOnFee;

        // Total cost
        const totalCost = totalPayment + totalProcessingFee;

        // Monthly income recommendation (EMI should be < 40-50% of income)
        const recommendedIncome = emi / 0.4;

        displayResults({
            loanAmount, emi, totalPayment, totalInterest, totalCost,
            processingFee: totalProcessingFee, processingFeePercent,
            recommendedIncome, tenure, tenureMonths, rate, purpose, employment
        });

        // Track calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('loan', {
                emi: emi.toFixed(2),
                totalInterest: totalInterest.toFixed(2)
            }, {
                loanAmount, rate, tenure
            });
        }
    }

    function displayResults(data) {
        const { loanAmount, emi, totalPayment, totalInterest, totalCost, processingFee, processingFeePercent, recommendedIncome, tenure, tenureMonths, rate } = data;

        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        // Calculate percentages for visualization
        const principalPercent = (loanAmount / totalPayment) * 100;
        const interestPercent = (totalInterest / totalPayment) * 100;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <!-- Main EMI Result Card -->
            <div class="loan-result-card">
                <div class="emi-label">Monthly EMI</div>
                <div class="emi-value">₹${formatNumber(emi)}</div>
                <div class="emi-subtitle">for ${tenure} year${tenure > 1 ? 's' : ''}</div>
            </div>

            <!-- Cost Breakdown Cards -->
            <div class="breakdown-cards">
                <div class="breakdown-card principal-card">
                    <div class="card-icon">💰</div>
                    <div class="card-label">Loan Amount</div>
                    <div class="card-value">₹${formatNumber(loanAmount)}</div>
                </div>
                <div class="breakdown-card interest-card">
                    <div class="card-icon">📈</div>
                    <div class="card-label">Total Interest</div>
                    <div class="card-value">₹${formatNumber(totalInterest)}</div>
                </div>
                <div class="breakdown-card total-card">
                    <div class="card-icon">💳</div>
                    <div class="card-label">Total Payable</div>
                    <div class="card-value">₹${formatNumber(totalPayment)}</div>
                </div>
            </div>

            <!-- Visual Cost Breakdown -->
            <div class="chart-container">
                <h3>💰 Cost Breakdown</h3>
                <div class="cost-bar">
                    <div class="cost-segment principal-segment" style="width: ${principalPercent}%;">
                        <span class="segment-label">${principalPercent.toFixed(1)}%</span>
                    </div>
                    <div class="cost-segment interest-segment" style="width: ${interestPercent}%;">
                        <span class="segment-label">${interestPercent.toFixed(1)}%</span>
                    </div>
                </div>
                <div class="cost-legend">
                    <div class="legend-item">
                        <span class="legend-color principal-color"></span>
                        <span class="legend-text">Principal: ₹${formatNumber(loanAmount)} (${principalPercent.toFixed(1)}%)</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color interest-color"></span>
                        <span class="legend-text">Interest: ₹${formatNumber(totalInterest)} (${interestPercent.toFixed(1)}%)</span>
                    </div>
                </div>
            </div>

            <!-- Loan Details -->
            <div class="result-breakdown">
                <h3>📋 Loan Details</h3>
                <div class="details-grid">
                    <div class="detail-row">
                        <span>Monthly EMI:</span>
                        <span style="font-weight: 600;">₹${formatNumber(emi)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Loan Tenure:</span>
                        <span style="font-weight: 600;">${tenure} years (${tenureMonths} months)</span>
                    </div>
                    <div class="detail-row">
                        <span>Interest Rate:</span>
                        <span style="font-weight: 600;">${rate}% p.a.</span>
                    </div>
                    <div class="detail-row">
                        <span>Processing Fee:</span>
                        <span style="font-weight: 600;">₹${formatNumber(processingFee)} (${processingFeePercent}% + GST)</span>
                    </div>
                    <div class="detail-row">
                        <span>Total Cost (incl. fees):</span>
                        <span style="font-weight: 600; color: #ef4444;">₹${formatNumber(totalCost)}</span>
                    </div>
                </div>
            </div>

            <!-- Income Recommendation -->
            <div class="income-recommendation-card">
                <div class="recommendation-icon">💼</div>
                <div class="recommendation-content">
                    <div class="recommendation-label">Recommended Monthly Income</div>
                    <div class="recommendation-value">₹${formatNumber(recommendedIncome)}</div>
                    <div class="recommendation-note">EMI should not exceed 40% of your monthly income</div>
                </div>
            </div>

            <!-- Eligibility Tips -->
            <div class="result-breakdown">
                <h3>✅ Eligibility Tips</h3>
                <ul style="list-style: none; padding: 0; margin: 1rem 0;">
                    <li style="padding: 0.75rem; background: #ecfdf5; margin-bottom: 0.5rem; border-radius: 6px; border-left: 3px solid #10b981;">
                        <strong>Good Credit Score:</strong> Maintain a score above 750 for better interest rates
                    </li>
                    <li style="padding: 0.75rem; background: #ecfdf5; margin-bottom: 0.5rem; border-radius: 6px; border-left: 3px solid #10b981;">
                        <strong>Stable Income:</strong> Regular income proof for ${tenure}+ years increases approval chances
                    </li>
                    <li style="padding: 0.75rem; background: #ecfdf5; margin-bottom: 0.5rem; border-radius: 6px; border-left: 3px solid #10b981;">
                        <strong>Low Debt-to-Income:</strong> Keep existing EMIs below 50% of monthly income
                    </li>
                    <li style="padding: 0.75rem; background: #ecfdf5; margin-bottom: 0.5rem; border-radius: 6px; border-left: 3px solid #10b981;">
                        <strong>Complete Documentation:</strong> Keep ID proof, address proof, and income documents ready
                    </li>
                </ul>
            </div>

            <style>
                .loan-result-card {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    border-radius: 16px;
                    padding: 2.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
                    text-align: center;
                }

                .emi-label {
                    font-size: 1rem;
                    opacity: 0.9;
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .emi-value {
                    font-size: 3.5rem;
                    font-weight: 700;
                    line-height: 1;
                    margin: 0.5rem 0;
                }

                .emi-subtitle {
                    font-size: 1rem;
                    opacity: 0.9;
                }

                .breakdown-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .breakdown-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    border-left: 4px solid;
                    text-align: center;
                }

                .principal-card {
                    border-left-color: #3b82f6;
                }

                .interest-card {
                    border-left-color: #f59e0b;
                }

                .total-card {
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
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                }

                .chart-container {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .chart-container h3 {
                    margin-bottom: 1.5rem;
                    color: #1f2937;
                }

                .cost-bar {
                    display: flex;
                    height: 80px;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    margin-bottom: 1.5rem;
                }

                .cost-segment {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                }

                .principal-segment {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                }

                .interest-segment {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                }

                .segment-label {
                    font-size: 1.1rem;
                }

                .cost-legend {
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

                .principal-color {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                }

                .interest-color {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                }

                .legend-text {
                    font-size: 0.95rem;
                    color: #4b5563;
                    font-weight: 500;
                }

                .income-recommendation-card {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    color: white;
                    border-radius: 12px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .recommendation-icon {
                    font-size: 3rem;
                }

                .recommendation-label {
                    font-size: 0.9rem;
                    opacity: 0.9;
                    margin-bottom: 0.5rem;
                }

                .recommendation-value {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 0.25rem;
                }

                .recommendation-note {
                    font-size: 0.85rem;
                    opacity: 0.9;
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

                @media (max-width: 768px) {
                    .emi-value {
                        font-size: 2.5rem;
                    }

                    .breakdown-cards {
                        grid-template-columns: 1fr;
                    }

                    .income-recommendation-card {
                        flex-direction: column;
                        text-align: center;
                    }

                    .cost-bar {
                        height: 60px;
                    }

                    .segment-label {
                        font-size: 0.9rem;
                    }
                }
            </style>
        `;

        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
