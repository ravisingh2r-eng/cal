/**
 * Enhanced EMI Calculator - Modern Design
 * Features: Visual pie chart, sliders, amortization schedule, professional UI
 */

(function() {
    'use strict';

    let tenureType = 'years';

    function init() {
        createCalculatorInterface();
        setupEventListeners();
    }

    function createCalculatorInterface() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="emi-calculator-container">
                <!-- Loan Amount -->
                <div class="calc-input-group">
                    <label for="loanAmount">Loan Amount (₹)</label>
                    <input type="number" class="calc-input" id="loanAmount" value="1000000" min="10000" step="10000">
                    <input type="range" class="calc-slider" id="loanAmountSlider" min="10000" max="10000000" value="1000000" step="10000">
                    <div class="slider-labels">
                        <span>₹10K</span>
                        <span>₹1Cr</span>
                    </div>
                </div>

                <!-- Interest Rate -->
                <div class="calc-input-group">
                    <label for="interestRate">Interest Rate (% per year)</label>
                    <input type="number" class="calc-input" id="interestRate" value="8.5" min="0.1" max="30" step="0.1">
                    <input type="range" class="calc-slider" id="interestRateSlider" min="0.1" max="30" value="8.5" step="0.1">
                    <div class="slider-labels">
                        <span>0.1%</span>
                        <span>30%</span>
                    </div>
                </div>

                <!-- Loan Tenure -->
                <div class="calc-input-group">
                    <label for="loanTenure">Loan Tenure</label>

                    <!-- Tenure Type Toggle -->
                    <div class="tenure-toggle">
                        <button type="button" class="tenure-btn active" data-type="years">Years</button>
                        <button type="button" class="tenure-btn" data-type="months">Months</button>
                    </div>

                    <input type="number" class="calc-input" id="loanTenure" value="20" min="1" max="30">
                    <input type="range" class="calc-slider" id="loanTenureSlider" min="1" max="30" value="20" step="1">
                    <div class="slider-labels">
                        <span id="tenureMin">1 Yr</span>
                        <span id="tenureMax">30 Yrs</span>
                    </div>
                </div>

                <!-- Calculate Button -->
                <button type="button" class="btn btn-primary btn-large" id="calculateBtn">
                    <span>Calculate EMI</span>
                </button>
            </div>

            <style>
                .emi-calculator-container {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .calc-slider {
                    width: 100%;
                    height: 8px;
                    border-radius: 5px;
                    background: linear-gradient(90deg, #0B87BB 0%, #667eea 100%);
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
                    border: 3px solid #0B87BB;
                }

                .calc-slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    border: 3px solid #0B87BB;
                }

                .slider-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                    color: #6b7280;
                    margin-top: 0.25rem;
                }

                .tenure-toggle {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                    background: #f3f4f6;
                    padding: 0.25rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                }

                .tenure-btn {
                    padding: 0.75rem;
                    background: transparent;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 500;
                    color: #6b7280;
                }

                .tenure-btn.active {
                    background: white;
                    color: #0B87BB;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
                    background: linear-gradient(135deg, #0B87BB 0%, #0891b2 100%);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(11, 135, 187, 0.4);
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
        // Tenure toggle
        document.querySelectorAll('.tenure-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                tenureType = this.dataset.type;
                document.querySelectorAll('.tenure-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                updateTenureSlider();
            });
        });

        // Sync sliders with inputs
        document.getElementById('loanAmountSlider')?.addEventListener('input', function() {
            document.getElementById('loanAmount').value = this.value;
        });

        document.getElementById('interestRateSlider')?.addEventListener('input', function() {
            document.getElementById('interestRate').value = this.value;
        });

        document.getElementById('loanTenureSlider')?.addEventListener('input', function() {
            document.getElementById('loanTenure').value = this.value;
        });

        // Sync inputs with sliders
        document.getElementById('loanAmount')?.addEventListener('input', function() {
            document.getElementById('loanAmountSlider').value = this.value;
        });

        document.getElementById('interestRate')?.addEventListener('input', function() {
            document.getElementById('interestRateSlider').value = this.value;
        });

        document.getElementById('loanTenure')?.addEventListener('input', function() {
            document.getElementById('loanTenureSlider').value = this.value;
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

    function updateTenureSlider() {
        const slider = document.getElementById('loanTenureSlider');
        const input = document.getElementById('loanTenure');
        const minLabel = document.getElementById('tenureMin');
        const maxLabel = document.getElementById('tenureMax');

        if (tenureType === 'years') {
            slider.max = 30;
            slider.value = Math.min(input.value, 30);
            input.value = slider.value;
            input.max = 30;
            minLabel.textContent = '1 Yr';
            maxLabel.textContent = '30 Yrs';
        } else {
            slider.max = 360;
            slider.value = Math.min(input.value, 360);
            input.value = slider.value;
            input.max = 360;
            minLabel.textContent = '1 Mo';
            maxLabel.textContent = '360 Mos';
        }
    }

    function calculate() {
        const principal = parseFloat(document.getElementById('loanAmount')?.value || 0);
        const annualRate = parseFloat(document.getElementById('interestRate')?.value || 0);
        let tenure = parseFloat(document.getElementById('loanTenure')?.value || 0);

        if (principal <= 0 || annualRate <= 0 || tenure <= 0) {
            alert('Please enter valid values');
            return;
        }

        // Convert tenure to months
        const tenureMonths = tenureType === 'years' ? tenure * 12 : tenure;

        // Calculate EMI: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
        const monthlyRate = annualRate / 12 / 100;
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

        const totalAmount = emi * tenureMonths;
        const totalInterest = totalAmount - principal;

        displayResults(emi, principal, totalInterest, totalAmount, tenureMonths);

        // Track calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('emi', {
                emi: emi.toFixed(2),
                principal: principal,
                interest: totalInterest.toFixed(2)
            }, {
                loan_amount: principal,
                interest_rate: annualRate,
                tenure: tenureMonths
            });
        }
    }

    function displayResults(emi, principal, totalInterest, totalAmount, tenureMonths) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        // Calculate percentage for pie chart
        const principalPercent = (principal / totalAmount) * 100;
        const interestPercent = (totalInterest / totalAmount) * 100;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <!-- Main EMI Result Card -->
            <div class="emi-result-card">
                <div class="emi-value-section">
                    <div class="emi-label">Monthly EMI</div>
                    <div class="emi-value">₹${formatNumber(emi)}</div>
                </div>
            </div>

            <!-- Breakdown Cards -->
            <div class="breakdown-cards">
                <div class="breakdown-card principal-card">
                    <div class="card-icon">🏦</div>
                    <div class="card-label">Principal Amount</div>
                    <div class="card-value">₹${formatNumber(principal)}</div>
                </div>
                <div class="breakdown-card interest-card">
                    <div class="card-icon">📈</div>
                    <div class="card-label">Total Interest</div>
                    <div class="card-value">₹${formatNumber(totalInterest)}</div>
                </div>
                <div class="breakdown-card total-card">
                    <div class="card-icon">💰</div>
                    <div class="card-label">Total Amount</div>
                    <div class="card-value">₹${formatNumber(totalAmount)}</div>
                </div>
            </div>

            <!-- Visual Pie Chart (Pure CSS) -->
            <div class="chart-container">
                <h3>Payment Breakdown</h3>
                <div class="pie-chart-wrapper">
                    <div class="css-pie-chart" style="background: conic-gradient(
                        #4F46E5 0% ${principalPercent}%,
                        #F59E0B ${principalPercent}% 100%
                    );">
                        <div class="pie-center">
                            <div class="pie-total-label">Total</div>
                            <div class="pie-total-value">₹${formatNumber(totalAmount)}</div>
                        </div>
                    </div>
                    <div class="pie-legend">
                        <div class="legend-item">
                            <span class="legend-color" style="background: #4F46E5;"></span>
                            <span class="legend-label">Principal</span>
                            <span class="legend-value">₹${formatNumber(principal)} (${principalPercent.toFixed(1)}%)</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color" style="background: #F59E0B;"></span>
                            <span class="legend-label">Interest</span>
                            <span class="legend-value">₹${formatNumber(totalInterest)} (${interestPercent.toFixed(1)}%)</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payment Details -->
            <div class="result-breakdown">
                <h3>📋 Payment Details</h3>
                <div class="details-grid">
                    <div class="detail-row">
                        <span>Loan Tenure:</span>
                        <span style="font-weight: 600;">${Math.floor(tenureMonths/12)} years ${tenureMonths%12} months (${tenureMonths} months)</span>
                    </div>
                    <div class="detail-row">
                        <span>Monthly Payment:</span>
                        <span style="font-weight: 600;">₹${formatNumber(emi)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Number of Payments:</span>
                        <span style="font-weight: 600;">${tenureMonths}</span>
                    </div>
                    <div class="detail-row">
                        <span>Total Payments:</span>
                        <span style="font-weight: 600;">₹${formatNumber(totalAmount)}</span>
                    </div>
                </div>
            </div>

            <!-- Year-wise Breakdown -->
            ${generateYearlyBreakdown(principal, monthlyRate, tenureMonths, emi)}

            <style>
                .emi-result-card {
                    background: linear-gradient(135deg, #0B87BB 0%, #0891b2 100%);
                    color: white;
                    border-radius: 16px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 8px 24px rgba(11, 135, 187, 0.3);
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
                    font-size: 3rem;
                    font-weight: 700;
                    line-height: 1;
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
                    border-left-color: #4F46E5;
                }

                .interest-card {
                    border-left-color: #F59E0B;
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

                /* Pure CSS Pie Chart */
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

                .pie-chart-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 3rem;
                    flex-wrap: wrap;
                }

                .css-pie-chart {
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    position: relative;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .pie-center {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 120px;
                    height: 120px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .pie-total-label {
                    font-size: 0.75rem;
                    color: #6b7280;
                    margin-bottom: 0.25rem;
                }

                .pie-total-value {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1f2937;
                }

                .pie-legend {
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
                    width: 16px;
                    height: 16px;
                    border-radius: 4px;
                }

                .legend-label {
                    font-size: 0.9rem;
                    color: #4b5563;
                    min-width: 80px;
                }

                .legend-value {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #1f2937;
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

                .yearly-breakdown-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 1rem;
                }

                .yearly-breakdown-table th {
                    background: #f3f4f6;
                    padding: 0.75rem;
                    text-align: left;
                    font-size: 0.85rem;
                    color: #4b5563;
                    border-bottom: 2px solid #e5e7eb;
                }

                .yearly-breakdown-table td {
                    padding: 0.75rem;
                    border-bottom: 1px solid #e5e7eb;
                    font-size: 0.9rem;
                }

                .yearly-breakdown-table tr:hover {
                    background: #f9fafb;
                }

                @media (max-width: 768px) {
                    .emi-value {
                        font-size: 2rem;
                    }

                    .breakdown-cards {
                        grid-template-columns: 1fr;
                    }

                    .pie-chart-wrapper {
                        flex-direction: column;
                        gap: 2rem;
                    }

                    .yearly-breakdown-table {
                        font-size: 0.75rem;
                    }

                    .yearly-breakdown-table th,
                    .yearly-breakdown-table td {
                        padding: 0.5rem;
                    }
                }
            </style>
        `;

        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function generateYearlyBreakdown(principal, monthlyRate, tenureMonths, emi) {
        let balance = principal;
        let html = `
            <div class="result-breakdown">
                <h3>📊 Year-wise Payment Breakdown</h3>
                <div style="overflow-x: auto;">
                    <table class="yearly-breakdown-table">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Opening Balance</th>
                                <th>EMI Paid</th>
                                <th>Principal Paid</th>
                                <th>Interest Paid</th>
                                <th>Closing Balance</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        let year = 1;
        let yearlyData = {
            opening: principal,
            emiPaid: 0,
            principal: 0,
            interest: 0
        };

        for (let month = 1; month <= tenureMonths; month++) {
            const interest = balance * monthlyRate;
            const principalPaid = emi - interest;
            balance = Math.max(0, balance - principalPaid);

            yearlyData.emiPaid += emi;
            yearlyData.principal += principalPaid;
            yearlyData.interest += interest;

            if (month % 12 === 0 || month === tenureMonths) {
                html += `
                    <tr>
                        <td><strong>${year}</strong></td>
                        <td>₹${formatNumber(yearlyData.opening)}</td>
                        <td>₹${formatNumber(yearlyData.emiPaid)}</td>
                        <td>₹${formatNumber(yearlyData.principal)}</td>
                        <td>₹${formatNumber(yearlyData.interest)}</td>
                        <td>₹${formatNumber(balance)}</td>
                    </tr>
                `;

                year++;
                yearlyData = {
                    opening: balance,
                    emiPaid: 0,
                    principal: 0,
                    interest: 0
                };
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
