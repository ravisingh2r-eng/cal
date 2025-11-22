/**
 * Age Calculator
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
            <div class="calc-input-group"><label>Date of Birth</label><input type="date" class="calc-input" id="dob" value="1990-01-01"></div>
            <div class="calc-input-group"><label>Calculate Age As Of</label><input type="date" class="calc-input" id="asOf" value="${today}"></div>
        `;
    }
    function calculate() {
        const dob = new Date(document.getElementById('dob').value);
        const asOf = new Date(document.getElementById('asOf').value);
        if (!dob || !asOf) { alert('Enter valid dates'); return; }
        const diff = asOf - dob;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const years = Math.floor(days / 365.25);
        const months = Math.floor((days % 365.25) / 30.44);
        const remainingDays = Math.floor((days % 365.25) % 30.44);
        const hours = days * 24;
        const minutes = hours * 60;
        const weeks = Math.floor(days / 7);
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Age</span><span class="result-value">${years} years, ${months} months, ${remainingDays} days</span></div>
                <div class="result-item"><span class="result-label">Total Days</span><span class="result-value">${days.toLocaleString()} days</span></div>
                <div class="result-breakdown"><h3>Detailed Breakdown</h3>
                    <div class="breakdown-item"><span>Years:</span><span>${years}</span></div>
                    <div class="breakdown-item"><span>Months:</span><span>${Math.floor(days / 30.44)}</span></div>
                    <div class="breakdown-item"><span>Weeks:</span><span>${weeks.toLocaleString()}</span></div>
                    <div class="breakdown-item"><span>Days:</span><span>${days.toLocaleString()}</span></div>
                    <div class="breakdown-item"><span>Hours:</span><span>${hours.toLocaleString()}</span></div>
                    <div class="breakdown-item"><span>Minutes:</span><span>${minutes.toLocaleString()}</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('age', {years, days}, {});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
