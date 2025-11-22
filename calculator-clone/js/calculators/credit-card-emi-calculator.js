/**
 * Credit Card Emi Calculator Calculator
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
            <div class="calc-input-group"><label>Purchase Amount (₹)</label><input type="number" class="calc-input" id="purchaseAmount" value="50000"></div>
            <div class="calc-input-group"><label>Interest Rate (% per month)</label><input type="number" class="calc-input" id="rate" value="1.5" step="0.1"></div>
            <div class="calc-input-group"><label>Tenure</label><select class="calc-input" id="tenure"><option value="3">3 Months</option><option value="6" selected>6 Months</option><option value="9">9 Months</option><option value="12">12 Months</option><option value="18">18 Months</option><option value="24">24 Months</option></select></div>
            <div class="calc-input-group"><label>Processing Fee (₹)</label><input type="number" class="calc-input" id="processingFee" value="199"></div>
        `;
    }

    function calculate() {
        const purchaseAmount = parseFloat(document.getElementById('purchaseAmount').value) || 0;
        const rate = parseFloat(document.getElementById('rate').value) || 1.5;
        const tenure = parseFloat(document.getElementById('tenure').value) || 6;
        const processingFee = parseFloat(document.getElementById('processingFee').value) || 0;

        const monthlyRate = rate / 100;
        const emi = (purchaseAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
        const totalPayment = emi * tenure;
        const totalInterest = totalPayment - purchaseAmount;
        const totalCost = totalPayment + processingFee;
        const effectiveRate = ((totalInterest / purchaseAmount) / tenure) * 12 * 100;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Monthly EMI</span><span class="result-value">₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Total Amount Payable</span><span class="result-value">₹${totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Total Interest</span><span class="result-value" style="color:#F59E0B">₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-breakdown"><h3>EMI Details</h3>
                    <div class="breakdown-item"><span>Purchase Amount:</span><span>₹${purchaseAmount.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Interest Rate:</span><span>${rate}% per month (${(rate*12).toFixed(1)}% p.a.)</span></div>
                    <div class="breakdown-item"><span>Tenure:</span><span>${tenure} months</span></div>
                    <div class="breakdown-item"><span>Processing Fee:</span><span>₹${processingFee.toLocaleString('en-IN')}</span></div>
                </div>
                <div class="result-breakdown"><h3>Cost Analysis</h3>
                    <div class="breakdown-item"><span>Principal:</span><span>₹${purchaseAmount.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Interest Paid:</span><span>₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Processing Fee:</span><span>₹${processingFee.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Total Cost:</span><span>₹${totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Interest as % of Purchase:</span><span>${((totalInterest/purchaseAmount)*100).toFixed(1)}%</span></div>
                    <div class="breakdown-item"><span>Effective Annual Rate:</span><span>${effectiveRate.toFixed(1)}% p.a.</span></div>
                </div>
                <div class="result-breakdown" style="background:#FEF3C7;padding:1rem;border-radius:8px"><h3>💡 Comparison</h3>
                    <div class="breakdown-item"><span>Regular CC Interest (42% p.a.):</span><span style="color:#EF4444">₹${(purchaseAmount * 0.42 * (tenure/12)).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Your EMI Interest:</span><span style="color:#10B981">₹${totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Savings vs Regular Interest:</span><span style="color:#10B981">₹${((purchaseAmount * 0.42 * (tenure/12)) - totalInterest).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                </div>
                <div class="result-actions"><button class="btn btn-outline" onclick="window.print()">Print</button><button class="btn btn-outline" id="shareResult">Share</button></div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('credit-card-emi', {purchaseAmount, tenure, emi, totalInterest}, {value: 'high-cpc', effectiveRate});
        }
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for credit-card-emi');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
