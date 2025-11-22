/**
 * Invoice Calculator
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
        if (calculateBtn) calculateBtn.addEventListener('click', calculate);
        document.addEventListener('keypress', (e) => { if (e.key === 'Enter') calculate(); });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;
        container.innerHTML = `
            <div class="calc-input-group"><label>Item/Service Amount (₹)</label><input type="number" class="calc-input" id="amount" value="10000"></div>
            <div class="calc-input-group"><label>Quantity</label><input type="number" class="calc-input" id="quantity" value="5"></div>
            <div class="calc-input-group"><label>Discount (%)</label><input type="number" class="calc-input" id="discount" value="10" step="0.1"></div>
            <div class="calc-input-group"><label>GST Rate (%)</label><select class="calc-input" id="gst"><option value="0">No GST</option><option value="5">5%</option><option value="12">12%</option><option value="18" selected>18%</option><option value="28">28%</option></select></div>
            <div class="calc-input-group"><label>Additional Charges (₹)</label><input type="number" class="calc-input" id="addCharges" value="500"></div>
        `;
    }

    function calculate() {
        const amount = parseFloat(document.getElementById('amount').value) || 0;
        const qty = parseFloat(document.getElementById('quantity').value) || 1;
        const disc = parseFloat(document.getElementById('discount').value) || 0;
        const gst = parseFloat(document.getElementById('gst').value) || 0;
        const add = parseFloat(document.getElementById('addCharges').value) || 0;
        if (amount <= 0) { alert('Enter valid amount'); return; }
        const subtotal = amount * qty;
        const discAmt = subtotal * disc / 100;
        const afterDisc = subtotal - discAmt;
        const taxable = afterDisc + add;
        const gstAmt = taxable * gst / 100;
        const total = taxable + gstAmt;
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Invoice Total</span><span class="result-value">₹${total.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">Taxable Amount</span><span class="result-value">₹${taxable.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-item"><span class="result-label">GST Amount</span><span class="result-value">₹${gstAmt.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                <div class="result-breakdown"><h3>Invoice Breakdown</h3>
                    <div class="breakdown-item"><span>Item Amount:</span><span>₹${amount.toLocaleString('en-IN')} × ${qty}</span></div>
                    <div class="breakdown-item"><span>Subtotal:</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Discount (${disc}%):</span><span style="color:#10B981">-₹${discAmt.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>After Discount:</span><span>₹${afterDisc.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Additional Charges:</span><span>₹${add.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>Taxable Amount:</span><span>₹${taxable.toLocaleString('en-IN')}</span></div>
                    <div class="breakdown-item"><span>GST @ ${gst}%:</span><span>₹${gstAmt.toLocaleString('en-IN')}</span></div>
                    ${gst == 18 ? `<div class="breakdown-item"><span>CGST (9%):</span><span>₹${(gstAmt/2).toLocaleString('en-IN')}</span></div><div class="breakdown-item"><span>SGST (9%):</span><span>₹${(gstAmt/2).toLocaleString('en-IN')}</span></div>` : ''}
                    <div class="breakdown-item"><span><strong>Total Amount:</strong></span><span><strong>₹${total.toLocaleString('en-IN')}</strong></span></div>
                </div>
                <div class="result-actions"><button class="btn btn-outline" onclick="window.print()">Print Invoice</button></div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('invoice', {amount: total}, {value: 'high-cpc'});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }

    function loadAffiliateOffers() { console.log('Loading affiliate offers for invoice'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
