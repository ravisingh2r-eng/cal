/**
 * Stock Calculator - High-CPC
 */
(function() {
    'use strict';
    function init() {
        setupEventListeners();
        createInputFields();
        loadAffiliateOffers();
    }
    function setupEventListeners() {
        const btn = document.getElementById('calculate');
        if (btn) btn.addEventListener('click', calculate);
        document.addEventListener('keypress', e => { if (e.key === 'Enter') calculate(); });
    }
    function createInputFields() {
        const c = document.getElementById('calculatorInputs');
        if (!c) return;
        c.innerHTML = `
            <div class="calc-input-group"><label>Buy Price (₹)</label><input type="number" class="calc-input" id="buyPrice" value="1500"></div>
            <div class="calc-input-group"><label>Sell Price (₹)</label><input type="number" class="calc-input" id="sellPrice" value="1800"></div>
            <div class="calc-input-group"><label>Quantity</label><input type="number" class="calc-input" id="quantity" value="100"></div>
            <div class="calc-input-group"><label>Brokerage (%)</label><input type="number" class="calc-input" id="brokerage" value="0.05" step="0.01"></div>
        `;
    }
    function calculate() {
        const buy = parseFloat(document.getElementById('buyPrice').value) || 0;
        const sell = parseFloat(document.getElementById('sellPrice').value) || 0;
        const qty = parseFloat(document.getElementById('quantity').value) || 0;
        const brok = parseFloat(document.getElementById('brokerage').value) || 0;
        if (buy <= 0 || qty <= 0) { alert('Enter valid values'); return; }
        const buyVal = buy * qty;
        const sellVal = sell * qty;
        const buyBrok = buyVal * brok / 100;
        const sellBrok = sellVal * brok / 100;
        const totalCost = buyVal + buyBrok;
        const totalRev = sellVal - sellBrok;
        const profit = totalRev - totalCost;
        const profitPct = (profit / totalCost) * 100;
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Profit/Loss</span><span class="result-value" style="color:${profit >= 0 ? '#10B981' : '#EF4444'}">₹${profit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Return</span><span class="result-value">${profitPct.toFixed(2)}%</span></div>
                <div class="result-breakdown"><h3>Transaction Details</h3>
                    <div class="breakdown-item"><span>Buy Price:</span><span>₹${buy} × ${qty} = ₹${buyVal.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Buy Brokerage:</span><span>₹${buyBrok.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Total Investment:</span><span>₹${totalCost.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Sell Price:</span><span>₹${sell} × ${qty} = ₹${sellVal.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Sell Brokerage:</span><span>₹${sellBrok.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Net Proceeds:</span><span>₹${totalRev.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>${profit >= 0 ? 'Profit' : 'Loss'}:</span><span style="color:${profit >= 0 ? '#10B981' : '#EF4444'}">₹${Math.abs(profit).toLocaleString('en-IN')}</span></div>
                </div>
                <div class="result-actions"><button class="btn btn-outline" onclick="window.print()">Print</button></div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('stock', {qty, profit}, {value: 'high-cpc'});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
