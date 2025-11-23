/**
 * Enhanced GST Calculator - Modern Design
 * Features: Add/Remove GST tabs, visual tax breakdown, CGST/SGST split
 */

(function() {
    'use strict';

    let activeTab = 'add';
    let currentRate = 18;

    function init() {
        createCalculatorInterface();
        setupEventListeners();
    }

    function createCalculatorInterface() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="gst-calculator-container">
                <!-- Tab Selection -->
                <div class="gst-tabs">
                    <button class="gst-tab active" data-tab="add">
                        <span class="tab-icon">➕</span>
                        <span class="tab-text">Add GST</span>
                    </button>
                    <button class="gst-tab" data-tab="remove">
                        <span class="tab-icon">➖</span>
                        <span class="tab-text">Remove GST</span>
                    </button>
                </div>

                <!-- Add GST Content -->
                <div id="add-content" class="tab-content active">
                    <div class="calc-input-group">
                        <label for="amountExclusive">Amount (Excluding GST) ₹</label>
                        <input type="number" class="calc-input" id="amountExclusive" placeholder="Enter amount" value="10000" step="0.01">
                    </div>

                    <div class="calc-input-group">
                        <label>GST Rate (%)</label>
                        <div class="rate-buttons">
                            <button class="rate-btn" data-rate="5">5%</button>
                            <button class="rate-btn" data-rate="12">12%</button>
                            <button class="rate-btn active" data-rate="18">18%</button>
                            <button class="rate-btn" data-rate="28">28%</button>
                        </div>
                        <input type="number" class="calc-input" id="gstRateAdd" value="18" min="0" max="100" step="0.1" style="margin-top: 0.5rem;">
                    </div>

                    <button type="button" class="btn btn-primary btn-large" id="calculateAddBtn">
                        <span>Calculate with GST</span>
                    </button>
                </div>

                <!-- Remove GST Content -->
                <div id="remove-content" class="tab-content">
                    <div class="calc-input-group">
                        <label for="amountInclusive">Amount (Including GST) ₹</label>
                        <input type="number" class="calc-input" id="amountInclusive" placeholder="Enter amount" value="11800" step="0.01">
                    </div>

                    <div class="calc-input-group">
                        <label>GST Rate (%)</label>
                        <div class="rate-buttons">
                            <button class="rate-btn" data-rate="5">5%</button>
                            <button class="rate-btn" data-rate="12">12%</button>
                            <button class="rate-btn active" data-rate="18">18%</button>
                            <button class="rate-btn" data-rate="28">28%</button>
                        </div>
                        <input type="number" class="calc-input" id="gstRateRemove" value="18" min="0" max="100" step="0.1" style="margin-top: 0.5rem;">
                    </div>

                    <button type="button" class="btn btn-primary btn-large" id="calculateRemoveBtn">
                        <span>Extract GST</span>
                    </button>
                </div>
            </div>

            <style>
                .gst-calculator-container {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .gst-tabs {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                    background: #f3f4f6;
                    padding: 0.25rem;
                    border-radius: 10px;
                    margin-bottom: 2rem;
                }

                .gst-tab {
                    padding: 1rem;
                    background: transparent;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    font-weight: 500;
                    color: #6b7280;
                }

                .gst-tab.active {
                    background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
                }

                .tab-icon {
                    font-size: 1.2rem;
                }

                .tab-content {
                    display: none;
                }

                .tab-content.active {
                    display: block;
                }

                .rate-buttons {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 0.5rem;
                }

                .rate-btn {
                    padding: 0.75rem;
                    background: white;
                    border: 2px solid #e5e7eb;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 600;
                    color: #4b5563;
                }

                .rate-btn:hover {
                    border-color: #ec4899;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(236, 72, 153, 0.2);
                }

                .rate-btn.active {
                    background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
                    border-color: #ec4899;
                    color: white;
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
                    background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
                }

                @media (max-width: 768px) {
                    .rate-buttons {
                        grid-template-columns: repeat(2, 1fr);
                    }
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
        // Tab switching
        document.querySelectorAll('.gst-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                activeTab = this.dataset.tab;

                document.querySelectorAll('.gst-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById(activeTab + '-content').classList.add('active');
            });
        });

        // Rate buttons
        document.querySelectorAll('.rate-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const rate = parseFloat(this.dataset.rate);
                currentRate = rate;

                this.parentElement.querySelectorAll('.rate-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                if (activeTab === 'add') {
                    document.getElementById('gstRateAdd').value = rate;
                } else {
                    document.getElementById('gstRateRemove').value = rate;
                }
            });
        });

        // Rate input changes
        document.getElementById('gstRateAdd')?.addEventListener('input', function() {
            currentRate = parseFloat(this.value) || 18;
        });

        document.getElementById('gstRateRemove')?.addEventListener('input', function() {
            currentRate = parseFloat(this.value) || 18;
        });

        // Calculate buttons
        document.getElementById('calculateAddBtn')?.addEventListener('click', calculateAddGST);
        document.getElementById('calculateRemoveBtn')?.addEventListener('click', calculateRemoveGST);

        // Enter key support
        document.getElementById('amountExclusive')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateAddGST();
        });

        document.getElementById('amountInclusive')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateRemoveGST();
        });
    }

    function calculateAddGST() {
        const amount = parseFloat(document.getElementById('amountExclusive').value) || 0;
        const rate = parseFloat(document.getElementById('gstRateAdd').value) || 18;

        if (amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const gstAmount = (amount * rate) / 100;
        const cgst = gstAmount / 2;
        const sgst = gstAmount / 2;
        const totalAmount = amount + gstAmount;

        displayResults({
            type: 'add',
            originalAmount: amount,
            gstAmount,
            cgst,
            sgst,
            totalAmount,
            rate
        });

        // Track calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('gst', {
                type: 'add',
                gstAmount: gstAmount.toFixed(2),
                totalAmount: totalAmount.toFixed(2)
            }, { amount, rate });
        }
    }

    function calculateRemoveGST() {
        const totalAmount = parseFloat(document.getElementById('amountInclusive').value) || 0;
        const rate = parseFloat(document.getElementById('gstRateRemove').value) || 18;

        if (totalAmount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const amount = (totalAmount * 100) / (100 + rate);
        const gstAmount = totalAmount - amount;
        const cgst = gstAmount / 2;
        const sgst = gstAmount / 2;

        displayResults({
            type: 'remove',
            originalAmount: amount,
            gstAmount,
            cgst,
            sgst,
            totalAmount,
            rate
        });

        // Track calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('gst', {
                type: 'remove',
                gstAmount: gstAmount.toFixed(2),
                baseAmount: amount.toFixed(2)
            }, { totalAmount, rate });
        }
    }

    function displayResults(data) {
        const { type, originalAmount, gstAmount, cgst, sgst, totalAmount, rate } = data;

        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        // Calculate percentages for visualization
        const basePercent = (originalAmount / totalAmount) * 100;
        const gstPercent = (gstAmount / totalAmount) * 100;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <!-- Main Result Card -->
            <div class="gst-result-card">
                <div class="result-icon">${type === 'add' ? '➕' : '➖'}</div>
                <div class="result-content">
                    <div class="result-label">${type === 'add' ? 'Total Amount (With GST)' : 'Base Amount (Without GST)'}</div>
                    <div class="result-value">₹${formatNumber(type === 'add' ? totalAmount : originalAmount)}</div>
                </div>
            </div>

            <!-- Breakdown Cards -->
            <div class="breakdown-cards">
                <div class="breakdown-card base-card">
                    <div class="card-icon">💰</div>
                    <div class="card-label">Base Amount</div>
                    <div class="card-value">₹${formatNumber(originalAmount)}</div>
                </div>
                <div class="breakdown-card gst-card">
                    <div class="card-icon">📊</div>
                    <div class="card-label">GST (${rate}%)</div>
                    <div class="card-value">₹${formatNumber(gstAmount)}</div>
                </div>
                <div class="breakdown-card total-card">
                    <div class="card-icon">💳</div>
                    <div class="card-label">Total Amount</div>
                    <div class="card-value">₹${formatNumber(totalAmount)}</div>
                </div>
            </div>

            <!-- Visual Breakdown -->
            <div class="chart-container">
                <h3>📈 Amount Breakdown</h3>
                <div class="amount-bar">
                    <div class="bar-segment base-segment" style="width: ${basePercent}%;">
                        <span class="segment-label">${basePercent.toFixed(1)}%</span>
                    </div>
                    <div class="bar-segment gst-segment" style="width: ${gstPercent}%;">
                        <span class="segment-label">${gstPercent.toFixed(1)}%</span>
                    </div>
                </div>
                <div class="bar-legend">
                    <div class="legend-item">
                        <span class="legend-color base-color"></span>
                        <span class="legend-text">Base Amount: ₹${formatNumber(originalAmount)}</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color gst-color"></span>
                        <span class="legend-text">GST Amount: ₹${formatNumber(gstAmount)}</span>
                    </div>
                </div>
            </div>

            <!-- GST Breakdown -->
            <div class="result-breakdown">
                <h3>🧾 GST Breakdown</h3>
                <div class="gst-split-container">
                    <div class="gst-split-card cgst-card">
                        <div class="split-label">CGST (${rate/2}%)</div>
                        <div class="split-value">₹${formatNumber(cgst)}</div>
                        <div class="split-note">Central GST</div>
                    </div>
                    <div class="gst-plus">+</div>
                    <div class="gst-split-card sgst-card">
                        <div class="split-label">SGST (${rate/2}%)</div>
                        <div class="split-value">₹${formatNumber(sgst)}</div>
                        <div class="split-note">State GST</div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 1rem; padding: 1rem; background: #f9fafb; border-radius: 6px;">
                    <div style="font-size: 0.85rem; color: #6b7280; margin-bottom: 0.25rem;">Total GST Amount</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #ec4899;">₹${formatNumber(gstAmount)}</div>
                </div>
            </div>

            <!-- Calculation Details -->
            <div class="result-breakdown">
                <h3>📋 Calculation Details</h3>
                <div class="details-grid">
                    <div class="detail-row">
                        <span>${type === 'add' ? 'Original Amount:' : 'Total Amount:'}</span>
                        <span style="font-weight: 600;">₹${formatNumber(type === 'add' ? originalAmount : totalAmount)}</span>
                    </div>
                    <div class="detail-row">
                        <span>GST Rate:</span>
                        <span style="font-weight: 600;">${rate}%</span>
                    </div>
                    <div class="detail-row">
                        <span>GST Amount:</span>
                        <span style="font-weight: 600; color: #ec4899;">₹${formatNumber(gstAmount)}</span>
                    </div>
                    <div class="detail-row">
                        <span>CGST (${rate/2}%):</span>
                        <span style="font-weight: 600;">₹${formatNumber(cgst)}</span>
                    </div>
                    <div class="detail-row">
                        <span>SGST (${rate/2}%):</span>
                        <span style="font-weight: 600;">₹${formatNumber(sgst)}</span>
                    </div>
                    <div class="detail-row" style="background: #fef3c7; font-size: 1.05rem;">
                        <span>${type === 'add' ? 'Final Amount:' : 'Base Amount:'}</span>
                        <span style="font-weight: 700; color: #d97706;">₹${formatNumber(type === 'add' ? totalAmount : originalAmount)}</span>
                    </div>
                </div>
            </div>

            <!-- Info Note -->
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 1.5rem; margin-top: 2rem; border-radius: 8px;">
                <p style="margin: 0; color: #1e40af; font-size: 0.9rem; line-height: 1.6;">
                    <strong>ℹ️ Note:</strong> For intra-state transactions, GST is split into CGST (Central GST) and SGST (State GST).
                    For inter-state transactions, IGST (Integrated GST) of ${rate}% would apply instead.
                </p>
            </div>

            <style>
                .gst-result-card {
                    background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
                    color: white;
                    border-radius: 16px;
                    padding: 2.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                }

                .result-icon {
                    font-size: 4rem;
                }

                .result-content {
                    text-align: center;
                }

                .result-label {
                    font-size: 1rem;
                    opacity: 0.9;
                    margin-bottom: 0.5rem;
                }

                .result-value {
                    font-size: 3.5rem;
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

                .base-card {
                    border-left-color: #3b82f6;
                }

                .gst-card {
                    border-left-color: #ec4899;
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

                .amount-bar {
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
                }

                .base-segment {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                }

                .gst-segment {
                    background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
                }

                .segment-label {
                    font-size: 1.1rem;
                }

                .bar-legend {
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

                .base-color {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                }

                .gst-color {
                    background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
                }

                .legend-text {
                    font-size: 0.95rem;
                    color: #4b5563;
                    font-weight: 500;
                }

                .gst-split-container {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    gap: 1rem;
                    align-items: center;
                    margin-top: 1rem;
                }

                .gst-split-card {
                    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
                    padding: 1.5rem;
                    border-radius: 10px;
                    text-align: center;
                    border: 2px solid #e5e7eb;
                }

                .split-label {
                    font-size: 0.85rem;
                    color: #6b7280;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }

                .split-value {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #ec4899;
                    margin-bottom: 0.25rem;
                }

                .split-note {
                    font-size: 0.75rem;
                    color: #9ca3af;
                }

                .gst-plus {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #6b7280;
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
                    .gst-result-card {
                        flex-direction: column;
                        gap: 1rem;
                        padding: 2rem;
                    }

                    .result-value {
                        font-size: 2.5rem;
                    }

                    .breakdown-cards {
                        grid-template-columns: 1fr;
                    }

                    .gst-split-container {
                        grid-template-columns: 1fr;
                        gap: 0.5rem;
                    }

                    .gst-plus {
                        text-align: center;
                        font-size: 1.5rem;
                    }

                    .amount-bar {
                        height: 60px;
                    }
                }
            </style>
        `;

        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function formatNumber(num) {
        return Math.round(num).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
