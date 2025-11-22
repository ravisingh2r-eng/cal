/**
 * Debt Consolidation Calculator
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
            <div class="calc-input-group"><label>Total Debt Amount (₹)</label><input type="number" class="calc-input" id="totalDebt" value="500000"></div>
            <div class="calc-input-group"><label>Current Avg Interest Rate (% p.a.)</label><input type="number" class="calc-input" id="currentRate" value="18" step="0.1"></div>
            <div class="calc-input-group"><label>Current Monthly Payment (₹)</label><input type="number" class="calc-input" id="currentEMI" value="45000"></div>
            <div class="calc-input-group"><label>Consolidation Loan Rate (% p.a.)</label><input type="number" class="calc-input" id="newRate" value="12" step="0.1"></div>
            <div class="calc-input-group"><label>Consolidation Loan Tenure (years)</label><input type="number" class="calc-input" id="newTenure" value="5"></div>
            <div class="calc-input-group"><label>Processing Fee (₹)</label><input type="number" class="calc-input" id="processingFee" value="10000"></div>
        `;
    }
    function calculate() {
        const totalDebt = parseFloat(document.getElementById('totalDebt').value) || 0;
        const currentRate = parseFloat(document.getElementById('currentRate').value) || 18;
        const currentEMI = parseFloat(document.getElementById('currentEMI').value) || 0;
        const newRate = parseFloat(document.getElementById('newRate').value) || 12;
        const newTenure = parseFloat(document.getElementById('newTenure').value) || 5;
        const processingFee = parseFloat(document.getElementById('processingFee').value) || 0;
        if (totalDebt <= 0 || currentEMI <= 0) { alert('Enter valid values'); return; }
        const currentMonthlyRate = currentRate / 12 / 100;
        const currentMonths = totalDebt > 0 && currentMonthlyRate > 0 ? 
            Math.log(currentEMI / (currentEMI - totalDebt * currentMonthlyRate)) / Math.log(1 + currentMonthlyRate) : 0;
        const currentTotalPayment = currentEMI * currentMonths;
        const currentTotalInterest = currentTotalPayment - totalDebt;
        const newMonths = newTenure * 12;
        const newMonthlyRate = newRate / 12 / 100;
        const newEMI = (totalDebt * newMonthlyRate * Math.pow(1 + newMonthlyRate, newMonths)) / 
                       (Math.pow(1 + newMonthlyRate, newMonths) - 1);
        const newTotalPayment = newEMI * newMonths;
        const newTotalInterest = newTotalPayment - totalDebt;
        const totalCost = newTotalPayment + processingFee;
        const totalSavings = currentTotalPayment - totalCost;
        const monthlySavings = currentEMI - newEMI;
        const interestSavings = currentTotalInterest - newTotalInterest;
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">New Monthly EMI</span><span class="result-value">₹${newEMI.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Monthly Savings</span><span class="result-value" style="color: #10B981;">₹${monthlySavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Total Savings</span><span class="result-value" style="color: #10B981;">₹${totalSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-breakdown"><h3>Current Debt Situation</h3>
                    <div class="breakdown-item"><span>Total Debt:</span><span>₹${totalDebt.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Avg Interest Rate:</span><span>${currentRate}% p.a.</span></div>
                    <div class="breakdown-item"><span>Current Monthly EMI:</span><span>₹${currentEMI.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Estimated Months to Payoff:</span><span>${Math.ceil(currentMonths)} months</span></div>
                    <div class="breakdown-item"><span>Total Interest:</span><span>₹${currentTotalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Total Payment:</span><span>₹${currentTotalPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                </div>
                <div class="result-breakdown"><h3>Consolidation Loan Details</h3>
                    <div class="breakdown-item"><span>Loan Amount:</span><span>₹${totalDebt.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>New Interest Rate:</span><span>${newRate}% p.a.</span></div>
                    <div class="breakdown-item"><span>Loan Tenure:</span><span>${newTenure} years (${newMonths} months)</span></div>
                    <div class="breakdown-item"><span>New Monthly EMI:</span><span>₹${newEMI.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Processing Fee:</span><span>₹${processingFee.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Total Interest:</span><span>₹${newTotalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Total Payment:</span><span>₹${totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                </div>
                <div class="result-breakdown"><h3>Savings Analysis</h3>
                    <div class="breakdown-item"><span>Monthly EMI Reduction:</span><span style="color: #10B981;">₹${monthlySavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>EMI Reduction %:</span><span>${((monthlySavings/currentEMI)*100).toFixed(1)}%</span></div>
                    <div class="breakdown-item"><span>Interest Savings:</span><span style="color: #10B981;">₹${interestSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Total Savings:</span><span style="font-weight: 600; color: #10B981;">₹${totalSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Recommendation:</span><span>${totalSavings > 0 ? 'Consolidation is beneficial ✓' : 'Not recommended ✗'}</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('debt-consolidation', {totalDebt, totalSavings}, {value: 'high-cpc'});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
