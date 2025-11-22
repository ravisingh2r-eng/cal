/**
 * Bitcoin/Cryptocurrency Investment Calculator
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
            <div class="calc-input-group"><label>Investment Amount (₹)</label><input type="number" class="calc-input" id="investment" value="100000"></div>
            <div class="calc-input-group"><label>Bitcoin Purchase Price (₹)</label><input type="number" class="calc-input" id="buyPrice" value="4500000"></div>
            <div class="calc-input-group"><label>Current/Target Bitcoin Price (₹)</label><input type="number" class="calc-input" id="sellPrice" value="5000000"></div>
            <div class="calc-input-group"><label>Investment Duration (months)</label><input type="number" class="calc-input" id="duration" value="12"></div>
            <div class="calc-input-group"><label>Exchange Fee (%)</label><input type="number" class="calc-input" id="fee" value="1" step="0.1"></div>
            <div class="calc-input-group"><label>Tax on Gains (%)</label><input type="number" class="calc-input" id="tax" value="30" step="0.1"></div>
        `;
    }
    function calculate() {
        const investment = parseFloat(document.getElementById('investment').value) || 0;
        const buyPrice = parseFloat(document.getElementById('buyPrice').value) || 0;
        const sellPrice = parseFloat(document.getElementById('sellPrice').value) || 0;
        const duration = parseFloat(document.getElementById('duration').value) || 12;
        const feePercent = parseFloat(document.getElementById('fee').value) || 1;
        const taxPercent = parseFloat(document.getElementById('tax').value) || 30;
        if (investment <= 0 || buyPrice <= 0) { alert('Enter valid values'); return; }
        const buyFee = investment * feePercent / 100;
        const netInvestment = investment - buyFee;
        const btcUnits = netInvestment / buyPrice;
        const sellValue = btcUnits * sellPrice;
        const sellFee = sellValue * feePercent / 100;
        const netSellValue = sellValue - sellFee;
        const totalFees = buyFee + sellFee;
        const grossProfit = netSellValue - investment;
        const taxOnProfit = Math.max(0, grossProfit) * taxPercent / 100;
        const netProfit = grossProfit - taxOnProfit;
        const roi = (grossProfit / investment) * 100;
        const priceChange = ((sellPrice - buyPrice) / buyPrice) * 100;
        const annualizedReturn = duration > 0 ? (roi / duration) * 12 : 0;
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Net Profit/Loss</span><span class="result-value" style="color: ${netProfit >= 0 ? '#10B981' : '#EF4444'};">₹${netProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">ROI</span><span class="result-value">${roi.toFixed(2)}%</span></div>
                <div class="result-item"><span class="result-label">Bitcoin Units</span><span class="result-value">${btcUnits.toFixed(8)} BTC</span></div>
                <div class="result-breakdown"><h3>Investment Summary</h3>
                    <div class="breakdown-item"><span>Investment Amount:</span><span>₹${investment.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Buy Fee (${feePercent}%):</span><span>₹${buyFee.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Net Investment:</span><span>₹${netInvestment.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>BTC Units Purchased:</span><span>${btcUnits.toFixed(8)} BTC</span></div>
                    <div class="breakdown-item"><span>Purchase Price per BTC:</span><span>₹${buyPrice.toLocaleString('en-IN')}</span></div>
                </div>
                <div class="result-breakdown"><h3>Returns Analysis</h3>
                    <div class="breakdown-item"><span>Current/Target BTC Price:</span><span>₹${sellPrice.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Price Change:</span><span style="color: ${priceChange >= 0 ? '#10B981' : '#EF4444'};">${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}%</span></div>
                    <div class="breakdown-item"><span>Current Value:</span><span>₹${sellValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Sell Fee (${feePercent}%):</span><span>₹${sellFee.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Net Sale Value:</span><span>₹${netSellValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                </div>
                <div class="result-breakdown"><h3>Profit & Tax</h3>
                    <div class="breakdown-item"><span>Gross Profit:</span><span>₹${grossProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Total Fees:</span><span>₹${totalFees.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Tax on Profit (${taxPercent}%):</span><span>₹${taxOnProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>Net Profit:</span><span style="font-weight: 600; color: ${netProfit >= 0 ? '#10B981' : '#EF4444'};">₹${netProfit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div class="breakdown-item"><span>ROI:</span><span>${roi.toFixed(2)}%</span></div>
                    <div class="breakdown-item"><span>Annualized Return:</span><span>${annualizedReturn.toFixed(2)}% p.a.</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('bitcoin', {investment, roi, netProfit}, {value: 'high-cpc'});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
