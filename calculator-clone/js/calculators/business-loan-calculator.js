/**
 * Business Loan Calculator Calculator
 * High-CPC calculator optimized for revenue
 */

(function() {
    'use strict';

    function init() {
        setupEventListeners();
        createInputFields();
        loadAffiliateOffers();
    }

    function setupEventListeners() {
        const calculateBtn = document.getElementById('calculate');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculate);
        }

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculate();
        });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="calc-input-group">
                <label>Loan Amount Required (₹)</label>
                <input type="number" class="calc-input" id="loanAmount" placeholder="Enter loan amount" value="5000000">
            </div>
            <div class="calc-input-group">
                <label>Interest Rate (% per annum)</label>
                <input type="number" class="calc-input" id="rate" placeholder="Enter interest rate" value="11.5" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Loan Tenure</label>
                <select class="calc-input" id="tenure">
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3" selected>3 Years</option>
                    <option value="5">5 Years</option>
                    <option value="7">7 Years</option>
                    <option value="10">10 Years</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Business Type</label>
                <select class="calc-input" id="businessType">
                    <option value="proprietorship">Sole Proprietorship</option>
                    <option value="partnership" selected>Partnership</option>
                    <option value="pvtltd">Private Limited</option>
                    <option value="publicltd">Public Limited</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Loan Purpose</label>
                <select class="calc-input" id="purpose">
                    <option value="working-capital" selected>Working Capital</option>
                    <option value="expansion">Business Expansion</option>
                    <option value="equipment">Equipment Purchase</option>
                    <option value="inventory">Inventory/Stock</option>
                    <option value="property">Commercial Property</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Annual Business Revenue (₹)</label>
                <input type="number" class="calc-input" id="revenue" placeholder="Enter annual revenue" value="20000000">
            </div>
            <div class="calc-input-group">
                <label>Collateral Type</label>
                <select class="calc-input" id="collateral">
                    <option value="property">Property</option>
                    <option value="equipment" selected>Equipment/Machinery</option>
                    <option value="inventory">Inventory</option>
                    <option value="unsecured">Unsecured</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const rate = parseFloat(document.getElementById('rate').value) || 11.5;
        const tenure = parseFloat(document.getElementById('tenure').value) || 3;
        const businessType = document.getElementById('businessType').value;
        const purpose = document.getElementById('purpose').value;
        const revenue = parseFloat(document.getElementById('revenue').value) || 0;
        const collateral = document.getElementById('collateral').value;

        // EMI calculation
        const monthlyRate = rate / 12 / 100;
        const tenureMonths = tenure * 12;
        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

        // Total calculations
        const totalPayment = emi * tenureMonths;
        const totalInterest = totalPayment - loanAmount;

        // Processing fee (1.5-3% based on business type)
        const processingFeePercent = businessType === 'publicltd' ? 0.015 :
                                      businessType === 'pvtltd' ? 0.02 :
                                      businessType === 'partnership' ? 0.025 : 0.03;
        const processingFee = loanAmount * processingFeePercent;

        // DSCR (Debt Service Coverage Ratio) - should be > 1.25
        const annualDebtService = emi * 12;
        const estimatedEBITDA = revenue * 0.20; // Assume 20% EBITDA margin
        const dscr = estimatedEBITDA / annualDebtService;
        const dscrStatus = dscr >= 1.5 ? 'Excellent' : dscr >= 1.25 ? 'Good' : dscr >= 1.0 ? 'Moderate' : 'Low';
        const dscrColor = dscr >= 1.5 ? '#10B981' : dscr >= 1.25 ? '#3B82F6' : dscr >= 1.0 ? '#F59E0B' : '#EF4444';

        // Interest rate factor based on collateral
        const collateralBenefit = collateral === 'property' ? '0.5-1%' :
                                   collateral === 'equipment' ? '0.25-0.75%' :
                                   collateral === 'inventory' ? '0.25-0.5%' : 'Higher rate';

        // Loan to Revenue ratio
        const loanToRevenue = (loanAmount / revenue) * 100;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Monthly EMI</span>
                    <span class="result-value">₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Amount Payable</span>
                    <span class="result-value">₹${totalPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Interest Cost</span>
                    <span class="result-value" style="color: #F59E0B;">₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">DSCR Status</span>
                    <span class="result-value" style="color: ${dscrColor};">${dscrStatus} (${dscr.toFixed(2)}x)</span>
                </div>
                <div class="result-breakdown">
                    <h3>Loan Details</h3>
                    <div class="breakdown-item">
                        <span>Loan Amount:</span>
                        <span>₹${loanAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Rate:</span>
                        <span>${rate}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Tenure:</span>
                        <span>${tenure} years (${tenureMonths} months)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Business Type:</span>
                        <span>${businessType === 'proprietorship' ? 'Sole Proprietorship' :
                                 businessType === 'partnership' ? 'Partnership' :
                                 businessType === 'pvtltd' ? 'Private Limited' : 'Public Limited'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Purpose:</span>
                        <span>${purpose === 'working-capital' ? 'Working Capital' :
                                 purpose === 'expansion' ? 'Business Expansion' :
                                 purpose === 'equipment' ? 'Equipment Purchase' :
                                 purpose === 'inventory' ? 'Inventory/Stock' : 'Commercial Property'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Cost Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Principal Amount:</span>
                        <span>₹${loanAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Interest:</span>
                        <span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Processing Fee (${(processingFeePercent*100).toFixed(1)}%):</span>
                        <span>₹${processingFee.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest as % of Loan:</span>
                        <span>${((totalInterest/loanAmount)*100).toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Effective Cost of Loan:</span>
                        <span>₹${(totalPayment + processingFee).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Business Metrics</h3>
                    <div class="breakdown-item">
                        <span>Annual Business Revenue:</span>
                        <span>₹${revenue.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan to Revenue Ratio:</span>
                        <span>${loanToRevenue.toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Debt Service:</span>
                        <span>₹${annualDebtService.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Estimated EBITDA (20%):</span>
                        <span>₹${estimatedEBITDA.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>DSCR (Debt Service Coverage):</span>
                        <span style="color: ${dscrColor};">${dscr.toFixed(2)}x ${dscr >= 1.25 ? '✓' : '✗'}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *DSCR should ideally be above 1.25 for comfortable loan approval
                    </p>
                </div>
                <div class="result-breakdown">
                    <h3>Collateral & Rate Impact</h3>
                    <div class="breakdown-item">
                        <span>Collateral Type:</span>
                        <span>${collateral === 'property' ? 'Property' :
                                 collateral === 'equipment' ? 'Equipment/Machinery' :
                                 collateral === 'inventory' ? 'Inventory' : 'Unsecured'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Potential Rate Benefit:</span>
                        <span style="color: #10B981;">${collateralBenefit} lower</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        // Track high-value calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('business-loan', {
                loanAmount,
                emi,
                tenure,
                businessType
            }, {
                value: 'high-cpc',
                totalInterest
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for business-loan');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
