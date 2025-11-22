/**
 * Car Lease Calculator
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
                <label>Car Price (₹)</label>
                <input type="number" class="calc-input" id="carPrice" placeholder="Ex-showroom price" value="1000000">
            </div>
            <div class="calc-input-group">
                <label>Down Payment (₹)</label>
                <input type="number" class="calc-input" id="downPayment" placeholder="Initial payment" value="200000">
                <small style="color: #666; font-size: 12px;">
                    Typically 10-30% of car price
                </small>
            </div>
            <div class="calc-input-group">
                <label>Lease Term (months)</label>
                <input type="number" class="calc-input" id="leaseTerm" placeholder="Lease duration" value="36">
                <small style="color: #666; font-size: 12px;">
                    Common: 24, 36, or 48 months
                </small>
            </div>
            <div class="calc-input-group">
                <label>Interest Rate (% p.a.)</label>
                <input type="number" class="calc-input" id="interestRate" placeholder="Annual interest rate" value="9" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Residual Value (%)</label>
                <input type="number" class="calc-input" id="residualValue" placeholder="End-of-lease value" value="50" step="1">
                <small style="color: #666; font-size: 12px;">
                    Expected value at lease end (typically 40-60%)
                </small>
            </div>
            <div class="calc-input-group">
                <label>Security Deposit (₹)</label>
                <input type="number" class="calc-input" id="securityDeposit" placeholder="Refundable deposit" value="50000">
            </div>
        `;
    }

    function calculate() {
        const carPrice = parseFloat(document.getElementById('carPrice').value) || 0;
        const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
        const leaseTerm = parseInt(document.getElementById('leaseTerm').value) || 36;
        const annualRate = parseFloat(document.getElementById('interestRate').value) || 9;
        const residualPercent = parseFloat(document.getElementById('residualValue').value) || 50;
        const securityDeposit = parseFloat(document.getElementById('securityDeposit').value) || 0;

        // Validation
        if (carPrice <= 0 || leaseTerm <= 0) {
            alert('Please enter valid car price and lease term');
            return;
        }

        if (downPayment >= carPrice) {
            alert('Down payment should be less than car price');
            return;
        }

        // Calculate residual value
        const residualValue = carPrice * (residualPercent / 100);

        // Calculate depreciation
        const depreciation = carPrice - residualValue;

        // Amount to be financed (net capitalized cost)
        const financeAmount = carPrice - downPayment;

        // Monthly interest rate
        const monthlyRate = annualRate / 12 / 100;

        // Depreciation component (principal)
        const depreciationFee = depreciation / leaseTerm;

        // Finance fee (interest on average value)
        const financeFee = (financeAmount + residualValue) * monthlyRate;

        // Monthly lease payment
        const monthlyPayment = depreciationFee + financeFee;

        // Total lease cost
        const totalLeaseCost = (monthlyPayment * leaseTerm) + downPayment + securityDeposit;

        // Buyout cost at end of lease
        const buyoutCost = residualValue;
        const totalCostIfBought = totalLeaseCost + buyoutCost;

        // Compare with buying (assuming same interest rate)
        const loanAmount = carPrice - downPayment;
        const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, leaseTerm) / (Math.pow(1 + monthlyRate, leaseTerm) - 1);
        const totalPaymentBuy = (emi * leaseTerm) + downPayment;
        const totalInterestBuy = (emi * leaseTerm) - loanAmount;

        // Cost comparison
        const leaseSavings = totalPaymentBuy - totalLeaseCost;
        const buySavings = totalPaymentBuy - totalCostIfBought;

        // Annual costs
        const annualLeaseCost = (monthlyPayment * 12);
        const annualEMI = emi * 12;

        // Calculate tax benefits (depreciation deduction if business use)
        const businessDepreciationDeduction = depreciation * 0.15; // 15% depreciation

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Monthly Lease Payment</span>
                    <span class="result-value">₹${monthlyPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}/month</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Lease Cost</span>
                    <span class="result-value">₹${totalLeaseCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Buyout Option Cost</span>
                    <span class="result-value">₹${buyoutCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Lease Details</h3>
                    <div class="breakdown-item">
                        <span>Car Price:</span>
                        <span>₹${carPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Down Payment:</span>
                        <span>₹${downPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Security Deposit:</span>
                        <span>₹${securityDeposit.toLocaleString('en-IN', {maximumFractionDigits: 0})} (Refundable)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Lease Term:</span>
                        <span>${leaseTerm} months (${(leaseTerm / 12).toFixed(1)} years)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Rate:</span>
                        <span>${annualRate}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Residual Value:</span>
                        <span>₹${residualValue.toLocaleString('en-IN', {maximumFractionDigits: 0})} (${residualPercent}%)</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Monthly Payment Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Depreciation Fee:</span>
                        <span>₹${depreciationFee.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Finance Fee (Interest):</span>
                        <span>₹${financeFee.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Monthly Payment:</span>
                        <span style="font-weight: 600;">₹${monthlyPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Lease Cost:</span>
                        <span>₹${annualLeaseCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Total Cost Analysis</h3>
                    <div class="breakdown-item">
                        <span>Down Payment:</span>
                        <span>₹${downPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Lease Payments:</span>
                        <span>₹${(monthlyPayment * leaseTerm).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Security Deposit:</span>
                        <span>₹${securityDeposit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Lease Cost:</span>
                        <span style="font-weight: 600;">₹${totalLeaseCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Buyout at Lease End:</span>
                        <span>₹${buyoutCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Cost if Bought:</span>
                        <span style="font-weight: 600;">₹${totalCostIfBought.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Lease vs Buy Comparison</h3>
                    <div class="breakdown-item">
                        <span>Monthly Lease Payment:</span>
                        <span>₹${monthlyPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly EMI (if buying):</span>
                        <span>₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Savings (Lease):</span>
                        <span style="color: ${emi > monthlyPayment ? '#10B981' : '#EF4444'};">
                            ₹${Math.abs(emi - monthlyPayment).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                            ${emi > monthlyPayment ? '✓' : '✗'}
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Lease Cost:</span>
                        <span>₹${totalLeaseCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Cost (Buying):</span>
                        <span>₹${totalPaymentBuy.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Savings with Lease:</span>
                        <span style="color: ${leaseSavings > 0 ? '#10B981' : '#EF4444'}; font-weight: 600;">
                            ₹${Math.abs(leaseSavings).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                            ${leaseSavings > 0 ? '(Lease cheaper)' : '(Buy cheaper)'}
                        </span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>At End of Lease (${leaseTerm} months)</h3>
                    <div class="breakdown-item">
                        <span>Option 1: Return the Car</span>
                        <span style="font-weight: 600;">Total Cost: ₹${totalLeaseCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Option 2: Buy the Car</span>
                        <span style="font-weight: 600;">
                            Pay: ₹${buyoutCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                            (Total: ₹${totalCostIfBought.toLocaleString('en-IN', {maximumFractionDigits: 0})})
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Option 3: Lease New Car</span>
                        <span>Start fresh lease cycle</span>
                    </div>
                </div>
                ${carPrice >= 1000000 ? `
                <div class="result-breakdown">
                    <h3>Business Use Tax Benefits</h3>
                    <div class="breakdown-item">
                        <span>Depreciation Deduction:</span>
                        <span>₹${businessDepreciationDeduction.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Lease Payment Deduction:</span>
                        <span>100% deductible for business use</span>
                    </div>
                    <p style="color: #666; font-size: 13px; margin-top: 8px;">
                        Note: Tax benefits apply only if car is used for business purposes. Consult a tax advisor.
                    </p>
                </div>
                ` : ''}
                <div class="result-breakdown" style="background: #DBEAFE; border-left: 4px solid #3B82F6; padding: 15px;">
                    <h3 style="color: #1E40AF; margin-top: 0;">💡 Lease Advantages</h3>
                    <ul style="color: #1E40AF; margin: 8px 0; font-size: 14px; padding-left: 20px;">
                        <li><strong>Lower Monthly Payments:</strong> Typically 30-40% less than loan EMI</li>
                        <li><strong>Always Drive New:</strong> Upgrade to latest model every 2-3 years</li>
                        <li><strong>No Resale Hassle:</strong> Simply return the car at lease end</li>
                        <li><strong>Maintenance Included:</strong> Many leases include servicing</li>
                        <li><strong>Tax Benefits:</strong> 100% deductible for business use</li>
                    </ul>
                </div>
                <div class="result-breakdown" style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px;">
                    <h3 style="color: #92400E; margin-top: 0;">⚠️ Lease Considerations</h3>
                    <ul style="color: #92400E; margin: 8px 0; font-size: 14px; padding-left: 20px;">
                        <li><strong>Mileage Limits:</strong> Excess mileage charges apply (typically ₹8-12/km)</li>
                        <li><strong>Wear & Tear:</strong> Excessive damage charges at lease end</li>
                        <li><strong>Early Termination:</strong> Heavy penalties for breaking lease early</li>
                        <li><strong>No Ownership:</strong> You don't own the car unless you buy it out</li>
                        <li><strong>Credit Required:</strong> Good credit score needed for approval</li>
                    </ul>
                </div>
                <div class="result-breakdown" style="background: #F3F4F6; border-left: 4px solid #6B7280; padding: 15px;">
                    <h3 style="color: #374151; margin-top: 0;">🚗 When to Choose Lease?</h3>
                    <div style="color: #374151; font-size: 14px;">
                        <p style="margin: 8px 0;"><strong>Lease is better if:</strong></p>
                        <ul style="margin: 8px 0; padding-left: 20px;">
                            <li>You prefer lower monthly payments</li>
                            <li>You like driving latest models</li>
                            <li>You don't drive excessive kilometers</li>
                            <li>Car is for business use (tax benefits)</li>
                            <li>You want hassle-free ownership</li>
                        </ul>
                        <p style="margin: 8px 0;"><strong>Buying is better if:</strong></p>
                        <ul style="margin: 8px 0; padding-left: 20px;">
                            <li>You want to own the car</li>
                            <li>You drive long distances frequently</li>
                            <li>You plan to keep car for 7+ years</li>
                            <li>You want customization freedom</li>
                        </ul>
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
            trackCalculation('car-lease', { carPrice, monthlyPayment, leaseTerm }, { value: 'high-cpc' });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for car-lease');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
