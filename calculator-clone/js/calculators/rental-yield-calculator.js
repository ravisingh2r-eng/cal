/**
 * Rental Yield Calculator
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
                <label>Property Value (₹)</label>
                <input type="number" class="calc-input" id="propertyValue" placeholder="Market value" value="5000000">
            </div>
            <div class="calc-input-group">
                <label>Monthly Rental Income (₹)</label>
                <input type="number" class="calc-input" id="monthlyRent" placeholder="Monthly rent" value="30000">
            </div>
            <div class="calc-input-group">
                <label>Property Type</label>
                <select class="calc-input" id="propertyType">
                    <option value="residential" selected>Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="shop">Shop/Retail</option>
                    <option value="office">Office Space</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Annual Maintenance Cost (₹)</label>
                <input type="number" class="calc-input" id="maintenanceCost" placeholder="Repairs, upkeep" value="30000">
            </div>
            <div class="calc-input-group">
                <label>Annual Property Tax (₹)</label>
                <input type="number" class="calc-input" id="propertyTax" placeholder="Municipal tax" value="20000">
            </div>
            <div class="calc-input-group">
                <label>Annual Insurance (₹)</label>
                <input type="number" class="calc-input" id="insurance" placeholder="Property insurance" value="15000">
            </div>
            <div class="calc-input-group">
                <label>Vacancy Rate (%)</label>
                <select class="calc-input" id="vacancyRate">
                    <option value="0">0% (Always occupied)</option>
                    <option value="5" selected>5% (1-2 weeks/year)</option>
                    <option value="10">10% (1 month/year)</option>
                    <option value="15">15% (2 months/year)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Management Fees (%)</label>
                <input type="number" class="calc-input" id="managementFees" placeholder="% of rent" value="5" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>HOA/Society Charges (₹/month)</label>
                <input type="number" class="calc-input" id="hoaCharges" placeholder="Society maintenance" value="3000">
            </div>
            <div class="calc-input-group">
                <label>Home Loan Outstanding (₹)</label>
                <input type="number" class="calc-input" id="loanOutstanding" placeholder="Remaining loan" value="0">
            </div>
            <div class="calc-input-group">
                <label>Loan Interest Rate (%)</label>
                <input type="number" class="calc-input" id="loanRate" placeholder="Interest rate" value="8.5" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Expected Annual Appreciation (%)</label>
                <input type="number" class="calc-input" id="appreciation" placeholder="Capital growth" value="5" step="0.1">
            </div>
        `;
    }

    function calculate() {
        const propertyValue = parseFloat(document.getElementById('propertyValue').value) || 0;
        const monthlyRent = parseFloat(document.getElementById('monthlyRent').value) || 0;
        const propertyType = document.getElementById('propertyType').value;
        const maintenanceCost = parseFloat(document.getElementById('maintenanceCost').value) || 0;
        const propertyTax = parseFloat(document.getElementById('propertyTax').value) || 0;
        const insurance = parseFloat(document.getElementById('insurance').value) || 0;
        const vacancyRate = parseFloat(document.getElementById('vacancyRate').value) || 0;
        const managementFees = parseFloat(document.getElementById('managementFees').value) || 0;
        const hoaCharges = parseFloat(document.getElementById('hoaCharges').value) || 0;
        const loanOutstanding = parseFloat(document.getElementById('loanOutstanding').value) || 0;
        const loanRate = parseFloat(document.getElementById('loanRate').value) || 8.5;
        const appreciation = parseFloat(document.getElementById('appreciation').value) || 5;

        if (propertyValue <= 0) {
            alert('Please enter valid property value');
            return;
        }

        if (monthlyRent <= 0) {
            alert('Please enter valid monthly rent');
            return;
        }

        // Calculate annual rental income
        const annualRentGross = monthlyRent * 12;

        // Adjust for vacancy
        const vacancyLoss = annualRentGross * (vacancyRate / 100);
        const annualRentNet = annualRentGross - vacancyLoss;

        // Calculate annual expenses
        const managementCost = annualRentGross * (managementFees / 100);
        const hoaAnnual = hoaCharges * 12;
        const totalAnnualExpenses = maintenanceCost + propertyTax + insurance + managementCost + hoaAnnual;

        // Net Operating Income (NOI)
        const noi = annualRentNet - totalAnnualExpenses;

        // Loan interest (if applicable)
        const annualLoanInterest = loanOutstanding * (loanRate / 100);

        // Net income after loan interest
        const netIncomeAfterInterest = noi - annualLoanInterest;

        // Gross Rental Yield
        const grossRentalYield = (annualRentGross / propertyValue) * 100;

        // Net Rental Yield
        const netRentalYield = (noi / propertyValue) * 100;

        // Cash-on-cash return (if loan)
        const equity = propertyValue - loanOutstanding;
        const cashOnCashReturn = equity > 0 ? (netIncomeAfterInterest / equity) * 100 : 0;

        // Total ROI including appreciation
        const appreciationAmount = propertyValue * (appreciation / 100);
        const totalAnnualReturn = noi + appreciationAmount;
        const totalROI = (totalAnnualReturn / propertyValue) * 100;

        // Compare with FD returns
        const fdRate = 7.0; // Average FD rate in India
        const fdReturns = propertyValue * (fdRate / 100);
        const fdVsRental = noi - fdReturns;

        // Capitalization Rate (Cap Rate)
        const capRate = (noi / propertyValue) * 100;

        // Payback period
        const paybackPeriod = propertyValue / noi;

        // Monthly cash flow
        const monthlyCashFlow = netIncomeAfterInterest / 12;

        // Tax benefits (Section 24 - interest deduction, depreciation)
        const interestDeduction = Math.min(annualLoanInterest, 200000); // Max ₹2L deduction
        const standardDeduction = annualRentNet * 0.30; // 30% standard deduction
        const taxableIncome = annualRentNet - standardDeduction - interestDeduction;
        const taxSaved = Math.max(0, (standardDeduction + interestDeduction) * 0.30); // Assuming 30% tax bracket

        // 5-year projection
        let projectedValue = propertyValue;
        let projectedRent = monthlyRent;
        const projection = [];
        const rentGrowth = 3; // 3% annual rent growth

        for (let year = 1; year <= 5; year++) {
            projectedValue = projectedValue * (1 + appreciation/100);
            projectedRent = projectedRent * (1 + rentGrowth/100);
            const yearlyRent = projectedRent * 12 * (1 - vacancyRate/100);
            const yearlyExpenses = totalAnnualExpenses * Math.pow(1.05, year); // 5% expense inflation
            const yearlyNOI = yearlyRent - yearlyExpenses;
            const yearlyYield = (yearlyNOI / projectedValue) * 100;

            projection.push({
                year,
                value: projectedValue,
                rent: projectedRent,
                noi: yearlyNOI,
                yield: yearlyYield
            });
        }

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Gross Rental Yield</span>
                    <span class="result-value">${grossRentalYield.toFixed(2)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Net Rental Yield</span>
                    <span class="result-value">${netRentalYield.toFixed(2)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Annual Net Income</span>
                    <span class="result-value">₹${noi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Property Details</h3>
                    <div class="breakdown-item">
                        <span>Property Value:</span>
                        <span>₹${propertyValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Property Type:</span>
                        <span>${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Rent:</span>
                        <span>₹${monthlyRent.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Rent (Gross):</span>
                        <span>₹${annualRentGross.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Vacancy Loss (${vacancyRate}%):</span>
                        <span>₹${vacancyLoss.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Rent (Net):</span>
                        <span>₹${annualRentNet.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Rental Yield Analysis</h3>
                    <div class="breakdown-item">
                        <span>Gross Rental Yield:</span>
                        <span>${grossRentalYield.toFixed(2)}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Rental Yield:</span>
                        <span>${netRentalYield.toFixed(2)}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Cap Rate:</span>
                        <span>${capRate.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total ROI (with appreciation):</span>
                        <span>${totalROI.toFixed(2)}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Yield Classification:</span>
                        <span>${grossRentalYield > 6 ? 'High Yield' : grossRentalYield > 4 ? 'Good Yield' : grossRentalYield > 2.5 ? 'Average Yield' : 'Low Yield'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Annual Expenses Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Maintenance & Repairs:</span>
                        <span>₹${maintenanceCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Property Tax:</span>
                        <span>₹${propertyTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Insurance:</span>
                        <span>₹${insurance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Management Fees (${managementFees}%):</span>
                        <span>₹${managementCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>HOA/Society Charges:</span>
                        <span>₹${hoaAnnual.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Annual Expenses:</span>
                        <span>₹${totalAnnualExpenses.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Expense Ratio:</span>
                        <span>${((totalAnnualExpenses/annualRentGross)*100).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Net Operating Income (NOI)</h3>
                    <div class="breakdown-item">
                        <span>Annual Rental Income (Net):</span>
                        <span>₹${annualRentNet.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Less: Total Expenses:</span>
                        <span>₹${totalAnnualExpenses.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Operating Income (NOI):</span>
                        <span>₹${noi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Cash Flow:</span>
                        <span>₹${monthlyCashFlow.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Payback Period:</span>
                        <span>${paybackPeriod.toFixed(1)} years</span>
                    </div>
                </div>
                ${loanOutstanding > 0 ? `
                <div class="result-breakdown">
                    <h3>Loan Impact Analysis</h3>
                    <div class="breakdown-item">
                        <span>Loan Outstanding:</span>
                        <span>₹${loanOutstanding.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Rate:</span>
                        <span>${loanRate}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Interest:</span>
                        <span>₹${annualLoanInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Equity Value:</span>
                        <span>₹${equity.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Cash-on-Cash Return:</span>
                        <span>${cashOnCashReturn.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Income (After Interest):</span>
                        <span style="color: ${netIncomeAfterInterest > 0 ? '#10B981' : '#EF4444'}">₹${netIncomeAfterInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>FD vs Rental Income Comparison</h3>
                    <div class="breakdown-item">
                        <span>FD Returns @ ${fdRate}%:</span>
                        <span>₹${fdReturns.toLocaleString('en-IN', {maximumFractionDigits: 0})}/year</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Rental Income (NOI):</span>
                        <span>₹${noi.toLocaleString('en-IN', {maximumFractionDigits: 0})}/year</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Difference:</span>
                        <span style="color: ${fdVsRental > 0 ? '#10B981' : '#EF4444'}">
                            ${fdVsRental > 0 ? '+' : ''}₹${fdVsRental.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Rental vs FD:</span>
                        <span style="color: ${fdVsRental > 0 ? '#10B981' : '#EF4444'}">
                            ${fdVsRental > 0 ? 'Rental Better by ' + ((fdVsRental/fdReturns)*100).toFixed(1) + '%' : 'FD Better by ' + ((Math.abs(fdVsRental)/noi)*100).toFixed(1) + '%'}
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Note:</span>
                        <span>FD returns are taxable, rental has tax benefits</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Capital Appreciation</h3>
                    <div class="breakdown-item">
                        <span>Expected Appreciation:</span>
                        <span>${appreciation}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Appreciation:</span>
                        <span>₹${appreciationAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Annual Return:</span>
                        <span>₹${totalAnnualReturn.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total ROI (Rent + Appreciation):</span>
                        <span>${totalROI.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Value in 5 years:</span>
                        <span>₹${(propertyValue * Math.pow(1 + appreciation/100, 5)).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Benefits (India)</h3>
                    <div class="breakdown-item">
                        <span>Gross Rental Income:</span>
                        <span>₹${annualRentNet.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Standard Deduction (30%):</span>
                        <span>₹${standardDeduction.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Deduction (Sec 24):</span>
                        <span>₹${interestDeduction.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Taxable Rental Income:</span>
                        <span>₹${Math.max(0, taxableIncome).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Estimated Tax Saved:</span>
                        <span>₹${taxSaved.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>5-Year Projection</h3>
                    ${projection.map(p => `
                        <div class="breakdown-item">
                            <span>Year ${p.year}:</span>
                            <span>Value: ₹${(p.value/10000000).toFixed(2)}Cr | Rent: ₹${p.rent.toLocaleString('en-IN', {maximumFractionDigits: 0})} | Yield: ${p.yield.toFixed(2)}%</span>
                        </div>
                    `).join('')}
                </div>
                <div class="result-breakdown">
                    <h3>Investment Assessment</h3>
                    <div class="breakdown-item">
                        <span>Yield Rating:</span>
                        <span>${netRentalYield > 5 ? 'Excellent ✓' : netRentalYield > 3.5 ? 'Good ✓' : netRentalYield > 2 ? 'Average ⚠' : 'Poor ✗'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Cash Flow Status:</span>
                        <span style="color: ${noi > 0 ? '#10B981' : '#EF4444'}">${noi > 0 ? 'Positive Cash Flow ✓' : 'Negative Cash Flow ✗'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Recommendation:</span>
                        <span>${totalROI > 10 ? 'Strong Investment' : totalROI > 7 ? 'Good Investment' : totalROI > 5 ? 'Moderate Investment' : 'Weak Investment'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Best For:</span>
                        <span>${netRentalYield > 4 ? 'Rental Income Focus' : 'Capital Appreciation Focus'}</span>
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
            trackCalculation('rental-yield', {
                propertyValue,
                monthlyRent,
                grossRentalYield,
                netRentalYield,
                noi
            }, {
                value: 'high-cpc',
                propertyInCrores: propertyValue/10000000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for rental-yield');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
