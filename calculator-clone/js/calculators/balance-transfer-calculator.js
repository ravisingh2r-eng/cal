/**
 * Credit Card Balance Transfer Calculator
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
            <div class="calc-input-group"><label>Current Outstanding Balance (₹)</label><input type="number" class="calc-input" id="balance" value="200000"></div>
            <div class="calc-input-group"><label>Current Interest Rate (% p.a.)</label><input type="number" class="calc-input" id="currentRate" value="36" step="0.1"></div>
            <div class="calc-input-group"><label>New Card Interest Rate (% p.a.)</label><input type="number" class="calc-input" id="newRate" value="12" step="0.1"></div>
            <div class="calc-input-group"><label>Balance Transfer Fee (%)</label><input type="number" class="calc-input" id="transferFee" value="2" step="0.1"></div>
            <div class="calc-input-group"><label>Repayment Period (months)</label><input type="number" class="calc-input" id="tenure" value="12"></div>
            <div class="calc-input-group"><label>Monthly Payment (₹)</label><input type="number" class="calc-input" id="monthlyPayment" value="20000"></div>
        `;
    }
    function calculate() {
        const balance = parseFloat(document.getElementById('balance').value) || 0;
        const currentRate = parseFloat(document.getElementById('currentRate').value) || 36;
        const newRate = parseFloat(document.getElementById('newRate').value) || 12;
        const transferFeePercent = parseFloat(document.getElementById('transferFee').value) || 2;
        const tenure = parseFloat(document.getElementById('tenure').value) || 12;
        const monthlyPayment = parseFloat(document.getElementById('monthlyPayment').value) || 0;
        if (balance <= 0) { alert('Enter valid balance'); return; }
        const transferFee = balance * transferFeePercent / 100;
        const newBalance = balance + transferFee;
        let currentInterest = 0;
        let currentRemaining = balance;
        for (let i = 0; i < tenure; i++) {
            const interest = currentRemaining * (currentRate / 12 / 100);
            currentInterest += interest;
            currentRemaining = currentRemaining + interest - monthlyPayment;
            if (currentRemaining <= 0) break;
        }
        let newInterest = 0;
        let newRemaining = newBalance;
        for (let i = 0; i < tenure; i++) {
            const interest = newRemaining * (newRate / 12 / 100);
            newInterest += interest;
            newRemaining = newRemaining + interest - monthlyPayment;
            if (newRemaining <= 0) break;
        }
        const totalSavings = currentInterest - newInterest - transferFee;
        const netSavings = totalSavings;
        const breakEvenMonths = transferFee > 0 ? Math.ceil(transferFee / ((currentInterest - newInterest) / tenure)) : 0;
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Total Savings</span><span class="result-value" style="color: ${totalSavings >= 0 ? '#10B981' : '#EF4444'};">₹${totalSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Transfer Fee</span><span class="result-value">₹${transferFee.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Break-Even Period</span><span class="result-value">${breakEvenMonths} months</span></div>
                <div class="result-breakdown"><h3>Current Card Analysis</h3>
                    <div class="breakdown-item"><span>Outstanding Balance:</span><span>₹${balance.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Interest Rate:</span><span>${currentRate}% p.a.</span></div>
                    <div class="breakdown-item"><span>Total Interest (${tenure} months):</span><span>₹${currentInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Remaining Balance:</span><span>₹${Math.max(0, currentRemaining).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                </div>
                <div class="result-breakdown"><h3>New Card Analysis (After Transfer)</h3>
                    <div class="breakdown-item"><span>Balance + Transfer Fee:</span><span>₹${newBalance.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>New Interest Rate:</span><span>${newRate}% p.a.</span></div>
                    <div class="breakdown-item"><span>Total Interest (${tenure} months):</span><span>₹${newInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Remaining Balance:</span><span>₹${Math.max(0, newRemaining).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                </div>
                <div class="result-breakdown"><h3>Savings Summary</h3>
                    <div class="breakdown-item"><span>Interest Saved:</span><span style="color: #10B981;">₹${(currentInterest - newInterest).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Transfer Fee:</span><span style="color: #EF4444;">-₹${transferFee.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Net Savings:</span><span style="font-weight: 600; color: ${netSavings >= 0 ? '#10B981' : '#EF4444'};">₹${netSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Break-Even Period:</span><span>${breakEvenMonths} months</span></div>
                    <div class="breakdown-item"><span>Recommendation:</span><span>${totalSavings > 0 ? 'Transfer is beneficial ✓' : 'Not recommended ✗'}</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('balance-transfer', {balance, totalSavings}, {value: 'high-cpc'});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
