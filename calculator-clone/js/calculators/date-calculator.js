/**
 * Date Calculator
 */
(function() {
    'use strict';
    function init() { setupEventListeners(); createInputFields(); loadAffiliateOffers(); }
    function setupEventListeners() {
        const btn = document.getElementById('calculate');
        if (btn) btn.addEventListener('click', calculate);
    }
    function createInputFields() {
        const c = document.getElementById('calculatorInputs');
        if (!c) return;
        const today = new Date().toISOString().split('T')[0];
        c.innerHTML = `
            <div class="calc-input-group"><label>Start Date</label><input type="date" class="calc-input" id="startDate" value="${today}"></div>
            <div class="calc-input-group"><label>End Date</label><input type="date" class="calc-input" id="endDate" value="${today}"></div>
            <div class="calc-input-group"><label>Or Add/Subtract</label><select class="calc-input" id="operation"><option value="add">Add</option><option value="subtract">Subtract</option></select></div>
            <div class="calc-input-group"><label>Days</label><input type="number" class="calc-input" id="days" value="30"></div>
        `;
    }
    function calculate() {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        const operation = document.getElementById('operation').value;
        const days = parseInt(document.getElementById('days').value) || 0;
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diffDays / 7);
        const months = Math.floor(diffDays / 30.44);
        const years = Math.floor(diffDays / 365.25);
        let newDate = new Date(startDate);
        if (operation === 'add') {
            newDate.setDate(newDate.getDate() + days);
        } else {
            newDate.setDate(newDate.getDate() - days);
        }
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Days Between</span><span class="result-value">${diffDays} days</span></div>
                <div class="result-item"><span class="result-label">New Date (${operation})</span><span class="result-value">${newDate.toLocaleDateString()}</span></div>
                <div class="result-breakdown"><h3>Date Breakdown</h3>
                    <div class="breakdown-item"><span>Total Days:</span><span>${diffDays} days</span></div>
                    <div class="breakdown-item"><span>Weeks:</span><span>${weeks} weeks</span></div>
                    <div class="breakdown-item"><span>Months:</span><span>${months} months</span></div>
                    <div class="breakdown-item"><span>Years:</span><span>${years.toFixed(1)} years</span></div>
                    <div class="breakdown-item"><span>New Date:</span><span>${newDate.toLocaleDateString()}</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('date', {diffDays}, {});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
