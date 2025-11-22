/**
 * Down Payment Calculator (Home/Car)
 */
(function() {
    'use strict';
    function init() { setupEventListeners(); createInputFields(); loadAffiliateOffers(); }
    function setupEventListeners() {
        const btn = document.getElementById('calculate');
        if (btn) btn.addEventListener('click', calculate);
        document.addEventListener('keypress', e => { if (e.key === 'Enter') calculate(); });
    }
    function createInputFields() {
        const c = document.getElementById('calculatorInputs');
        if (!c) return;
        c.innerHTML = `
            <div class="calc-input-group"><label>Purchase Price (₹)</label><input type="number" class="calc-input" id="price" value="3000000"></div>
            <div class="calc-input-group"><label>Down Payment (₹)</label><input type="number" class="calc-input" id="downPayment" value="600000"></div>
            <div class="calc-input-group"><label>Loan Interest Rate (% p.a.)</label><input type="number" class="calc-input" id="rate" value="8.5" step="0.1"></div>
            <div class="calc-input-group"><label>Loan Tenure (years)</label><input type="number" class="calc-input" id="tenure" value="20"></div>
            <div class="calc-input-group"><label>Asset Type</label><select class="calc-input" id="assetType"><option value="home" selected>Home</option><option value="car">Car</option><option value="commercial">Commercial Property</option></select></div>
        `;
    }
    function calculate() {
        const price = parseFloat(document.getElementById('price').value) || 0;
        const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
        const rate = parseFloat(document.getElementById('rate').value) || 8.5;
        const tenure = parseFloat(document.getElementById('tenure').value) || 20;
        const assetType = document.getElementById('assetType').value;
        if (price <= 0 || downPayment < 0) { alert('Enter valid values'); return; }
        if (downPayment > price) { alert('Down payment cannot exceed price'); return; }
        const loanAmount = price - downPayment;
        const downPaymentPercent = (downPayment / price) * 100;
        const ltvRatio = (loanAmount / price) * 100;
        const months = tenure * 12;
        const monthlyRate = rate / 12 / 100;
        const emi = loanAmount > 0 ? 
            (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
            (Math.pow(1 + monthlyRate, months) - 1) : 0;
        const totalPayment = emi * months;
        const totalInterest = totalPayment - loanAmount;
        const totalCost = price + totalInterest;
        const stampDuty = assetType === 'home' ? price * 0.05 : assetType === 'car' ? price * 0.08 : price * 0.05;
        const registration = assetType === 'car' ? price * 0.10 : price * 0.01;
        const otherCosts = stampDuty + registration;
        const totalUpfrontCost = downPayment + otherCosts;
        const minRecommendedDP = assetType === 'home' ? price * 0.20 : price * 0.15;
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Monthly EMI</span><span class="result-value">₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Loan Amount</span><span class="result-value">₹${loanAmount.toLocaleString('en-IN')}</span></div>
                <div class="result-item"><span class="result-label">Down Payment %</span><span class="result-value">${downPaymentPercent.toFixed(1)}%</span></div>
                <div class="result-breakdown"><h3>Purchase Details</h3>
                    <div class="breakdown-item"><span>Asset Type:</span><span>${assetType === 'home' ? 'Home' : assetType === 'car' ? 'Car' : 'Commercial Property'}</span></div>
                    <div class="breakdown-item"><span>Purchase Price:</span><span>₹${price.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Down Payment:</span><span>₹${downPayment.toLocaleString('en-IN')} (${downPaymentPercent.toFixed(1)}%)</span></div>
                    <div class="breakdown-item"><span>Loan Amount:</span><span>₹${loanAmount.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>LTV Ratio:</span><span>${ltvRatio.toFixed(1)}%</span></div>
                </div>
                <div class="result-breakdown"><h3>Loan Details</h3>
                    <div class="breakdown-item"><span>Loan Amount:</span><span>₹${loanAmount.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Interest Rate:</span><span>${rate}% p.a.</span></div>
                    <div class="breakdown-item"><span>Tenure:</span><span>${tenure} years (${months} months)</span></div>
                    <div class="breakdown-item"><span>Monthly EMI:</span><span>₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Total Interest:</span><span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Total Payment:</span><span>₹${totalPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                </div>
                <div class="result-breakdown"><h3>Upfront Costs</h3>
                    <div class="breakdown-item"><span>Down Payment:</span><span>₹${downPayment.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Stamp Duty (~${assetType === 'car' ? '8' : '5'}%):</span><span>₹${stampDuty.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Registration (~${assetType === 'car' ? '10' : '1'}%):</span><span>₹${registration.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Total Upfront Cost:</span><span style="font-weight: 600;">₹${totalUpfrontCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                </div>
                <div class="result-breakdown"><h3>Total Cost Analysis</h3>
                    <div class="breakdown-item"><span>Purchase Price:</span><span>₹${price.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Total Interest:</span><span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Other Costs:</span><span>₹${otherCosts.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Total Cost of Ownership:</span><span style="font-weight: 600;">₹${(totalCost + otherCosts).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                </div>
                <div class="result-breakdown"><h3>Recommendations</h3>
                    <div class="breakdown-item"><span>Minimum Recommended DP:</span><span>₹${minRecommendedDP.toLocaleString('en-IN', {maximumFractionDigits: 0})} (${assetType === 'home' ? '20' : '15'}%)</span></div>
                    <div class="breakdown-item"><span>Your Down Payment:</span><span>${downPayment >= minRecommendedDP ? '✓ Adequate' : '✗ Consider increasing'}</span></div>
                    <div class="breakdown-item"><span>EMI to Income Ratio:</span><span>Should be < 40% of monthly income</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('down-payment', {price, downPayment, emi}, {value: 'high-cpc'});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
