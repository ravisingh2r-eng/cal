/**
 * Grade Calculator
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
        c.innerHTML = \`
            <div class="calc-input-group"><label>Total Marks</label><input type="number" class="calc-input" id="totalMarks" value="100"></div>
            <div class="calc-input-group"><label>Marks Obtained</label><input type="number" class="calc-input" id="obtained" value="85"></div>
            <div class="calc-input-group"><label>Grading System</label><select class="calc-input" id="system"><option value="percent">Percentage</option><option value="letter" selected>Letter Grade</option><option value="gpa">GPA</option></select></div>
        \`;
    }
    function calculate() {
        const total = parseFloat(document.getElementById('totalMarks').value) || 100;
        const obtained = parseFloat(document.getElementById('obtained').value) || 0;
        if (total <= 0 || obtained < 0) { alert('Enter valid marks'); return; }
        const pct = (obtained / total) * 100;
        let grade = '', gpa = 0;
        if (pct >= 90) { grade = 'A+'; gpa = 4.0; }
        else if (pct >= 80) { grade = 'A'; gpa = 3.7; }
        else if (pct >= 70) { grade = 'B+'; gpa = 3.3; }
        else if (pct >= 60) { grade = 'B'; gpa = 3.0; }
        else if (pct >= 50) { grade = 'C'; gpa = 2.0; }
        else if (pct >= 40) { grade = 'D'; gpa = 1.0; }
        else { grade = 'F'; gpa = 0.0; }
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = \`
                <div class="result-item main-result"><span class="result-label">Percentage</span><span class="result-value">\${pct.toFixed(2)}%</span></div>
                <div class="result-item"><span class="result-label">Letter Grade</span><span class="result-value">\${grade}</span></div>
                <div class="result-item"><span class="result-label">GPA</span><span class="result-value">\${gpa.toFixed(1)}</span></div>
                <div class="result-breakdown"><h3>Grade Details</h3>
                    <div class="breakdown-item"><span>Marks Obtained:</span><span>\${obtained} / \${total}</span></div>
                    <div class="breakdown-item"><span>Percentage:</span><span>\${pct.toFixed(2)}%</span></div>
                    <div class="breakdown-item"><span>Letter Grade:</span><span>\${grade}</span></div>
                    <div class="breakdown-item"><span>GPA (4.0 scale):</span><span>\${gpa}</span></div>
                </div>
            \`;
        }
        if (typeof trackCalculation === 'function') trackCalculation('grade', {pct, grade}, {});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
