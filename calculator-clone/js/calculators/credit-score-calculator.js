/**
 * Credit Score Estimator Calculator
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
        c.innerHTML = `
            <div class="calc-input-group"><label>Payment History</label><select class="calc-input" id="paymentHistory"><option value="100">Always on time (100%)</option><option value="90" selected>Mostly on time (90%)</option><option value="70">Occasional delays (70%)</option><option value="50">Frequent delays (50%)</option><option value="30">Multiple defaults (30%)</option></select></div>
            <div class="calc-input-group"><label>Credit Utilization (%)</label><input type="number" class="calc-input" id="utilization" value="30" min="0" max="100"></div>
            <div class="calc-input-group"><label>Credit History Length (years)</label><input type="number" class="calc-input" id="historyLength" value="5"></div>
            <div class="calc-input-group"><label>Number of Credit Accounts</label><input type="number" class="calc-input" id="numAccounts" value="3"></div>
            <div class="calc-input-group"><label>Recent Credit Inquiries (last 6 months)</label><input type="number" class="calc-input" id="inquiries" value="1"></div>
            <div class="calc-input-group"><label>Negative Marks</label><select class="calc-input" id="negativeMarks"><option value="0" selected>None</option><option value="1">1-2</option><option value="3">3-5</option><option value="5">More than 5</option></select></div>
        `;
    }
    function calculate() {
        const paymentHistory = parseFloat(document.getElementById('paymentHistory').value) || 100;
        const utilization = parseFloat(document.getElementById('utilization').value) || 30;
        const historyLength = parseFloat(document.getElementById('historyLength').value) || 5;
        const numAccounts = parseFloat(document.getElementById('numAccounts').value) || 3;
        const inquiries = parseFloat(document.getElementById('inquiries').value) || 0;
        const negativeMarks = parseFloat(document.getElementById('negativeMarks').value) || 0;
        let score = 300;
        score += paymentHistory * 3.5;
        const utilizationScore = utilization <= 10 ? 100 : utilization <= 30 ? 80 : utilization <= 50 ? 60 : utilization <= 75 ? 40 : 20;
        score += utilizationScore * 0.3;
        const historyScore = Math.min(historyLength * 20, 150);
        score += historyScore * 0.15;
        const accountsScore = numAccounts >= 5 ? 100 : numAccounts >= 3 ? 80 : numAccounts >= 2 ? 60 : 40;
        score += accountsScore * 0.1;
        score -= inquiries * 5;
        score -= negativeMarks * 50;
        score = Math.max(300, Math.min(900, Math.round(score)));
        let rating = '';
        let color = '';
        if (score >= 750) { rating = 'Excellent'; color = '#10B981'; }
        else if (score >= 700) { rating = 'Good'; color = '#3B82F6'; }
        else if (score >= 650) { rating = 'Fair'; color = '#F59E0B'; }
        else if (score >= 550) { rating = 'Poor'; color = '#EF4444'; }
        else { rating = 'Very Poor'; color = '#991B1B'; }
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Estimated Credit Score</span><span class="result-value" style="color: ${color};">${score}</span></div>
                <div class="result-item"><span class="result-label">Rating</span><span class="result-value" style="color: ${color};">${rating}</span></div>
                <div class="result-breakdown"><h3>Score Factors</h3>
                    <div class="breakdown-item"><span>Payment History (35%):</span><span>${paymentHistory}%</span></div>
                    <div class="breakdown-item"><span>Credit Utilization (30%):</span><span>${utilization}%</span></div>
                    <div class="breakdown-item"><span>Credit History Length (15%):</span><span>${historyLength} years</span></div>
                    <div class="breakdown-item"><span>Credit Accounts (10%):</span><span>${numAccounts} accounts</span></div>
                    <div class="breakdown-item"><span>Recent Inquiries (10%):</span><span>${inquiries} inquiries</span></div>
                    <div class="breakdown-item"><span>Negative Marks:</span><span>${negativeMarks}</span></div>
                </div>
                <div class="result-breakdown"><h3>Score Range Guide</h3>
                    <div class="breakdown-item"><span>750-900 (Excellent):</span><span>Best loan rates, easy approvals</span></div>
                    <div class="breakdown-item"><span>700-749 (Good):</span><span>Good loan rates, likely approvals</span></div>
                    <div class="breakdown-item"><span>650-699 (Fair):</span><span>Moderate rates, conditional approvals</span></div>
                    <div class="breakdown-item"><span>550-649 (Poor):</span><span>Higher rates, difficult approvals</span></div>
                    <div class="breakdown-item"><span>300-549 (Very Poor):</span><span>Very high rates, unlikely approvals</span></div>
                </div>
                <div class="result-breakdown"><h3>Improvement Tips</h3>
                    <div class="breakdown-item"><span>Payment History:</span><span>${paymentHistory < 90 ? 'Pay all bills on time ✗' : 'Excellent ✓'}</span></div>
                    <div class="breakdown-item"><span>Credit Utilization:</span><span>${utilization > 30 ? 'Keep below 30% ✗' : 'Good ✓'}</span></div>
                    <div class="breakdown-item"><span>Credit Age:</span><span>${historyLength < 5 ? 'Build longer history ✗' : 'Good ✓'}</span></div>
                    <div class="breakdown-item"><span>Hard Inquiries:</span><span>${inquiries > 2 ? 'Limit new applications ✗' : 'Good ✓'}</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('credit-score', {score, rating}, {});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
