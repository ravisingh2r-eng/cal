/**
 * Conception & Due Date Calculator
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
            <div class="calc-input-group"><label>Calculation Method</label><select class="calc-input" id="method" onchange="toggleFields()"><option value="lmp" selected>Last Menstrual Period (LMP)</option><option value="conception">Conception Date</option><option value="due">Due Date</option></select></div>
            <div class="calc-input-group" id="lmpGroup"><label>Last Menstrual Period</label><input type="date" class="calc-input" id="lmp" value="${today}"></div>
            <div class="calc-input-group" id="conceptionGroup" style="display:none;"><label>Conception Date</label><input type="date" class="calc-input" id="conception" value="${today}"></div>
            <div class="calc-input-group" id="dueGroup" style="display:none;"><label>Due Date</label><input type="date" class="calc-input" id="due" value="${today}"></div>
            <div class="calc-input-group"><label>Cycle Length (days)</label><input type="number" class="calc-input" id="cycleLength" value="28"></div>
        `;
    }
    function calculate() {
        const method = document.getElementById('method').value;
        const cycleLength = parseFloat(document.getElementById('cycleLength').value) || 28;
        let lmpDate, conceptionDate, dueDate;
        if (method === 'lmp') {
            lmpDate = new Date(document.getElementById('lmp').value);
            conceptionDate = new Date(lmpDate.getTime() + (cycleLength - 14) * 24 * 60 * 60 * 1000);
            dueDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);
        } else if (method === 'conception') {
            conceptionDate = new Date(document.getElementById('conception').value);
            lmpDate = new Date(conceptionDate.getTime() - (cycleLength - 14) * 24 * 60 * 60 * 1000);
            dueDate = new Date(conceptionDate.getTime() + 266 * 24 * 60 * 60 * 1000);
        } else {
            dueDate = new Date(document.getElementById('due').value);
            lmpDate = new Date(dueDate.getTime() - 280 * 24 * 60 * 60 * 1000);
            conceptionDate = new Date(lmpDate.getTime() + (cycleLength - 14) * 24 * 60 * 60 * 1000);
        }
        const today = new Date();
        const daysSinceLMP = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(daysSinceLMP / 7);
        const days = daysSinceLMP % 7;
        const trimester = weeks < 13 ? 1 : weeks < 27 ? 2 : 3;
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Due Date</span><span class="result-value">${dueDate.toLocaleDateString()}</span></div>
                <div class="result-item"><span class="result-label">Current Week</span><span class="result-value">${weeks} weeks, ${days} days</span></div>
                <div class="result-item"><span class="result-label">Trimester</span><span class="result-value">${trimester}</span></div>
                <div class="result-breakdown"><h3>Important Dates</h3>
                    <div class="breakdown-item"><span>Last Menstrual Period:</span><span>${lmpDate.toLocaleDateString()}</span></div>
                    <div class="breakdown-item"><span>Estimated Conception:</span><span>${conceptionDate.toLocaleDateString()}</span></div>
                    <div class="breakdown-item"><span>Estimated Due Date:</span><span>${dueDate.toLocaleDateString()}</span></div>
                    <div class="breakdown-item"><span>Current Gestational Age:</span><span>${weeks} weeks, ${days} days</span></div>
                    <div class="breakdown-item"><span>Trimester:</span><span>${trimester} (${trimester === 1 ? 'Weeks 1-12' : trimester === 2 ? 'Weeks 13-26' : 'Weeks 27-40'})</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('conception', {weeks, trimester}, {});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    window.toggleFields = function() {
        const method = document.getElementById('method').value;
        document.getElementById('lmpGroup').style.display = method === 'lmp' ? 'block' : 'none';
        document.getElementById('conceptionGroup').style.display = method === 'conception' ? 'block' : 'none';
        document.getElementById('dueGroup').style.display = method === 'due' ? 'block' : 'none';
    };
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
