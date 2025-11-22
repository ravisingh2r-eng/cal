/**
 * GPA Calculator
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
            <div class="calc-input-group"><label>Number of Subjects</label><input type="number" class="calc-input" id="numSubjects" value="5" min="1" max="15"></div>
            <div id="gradeInputs"></div>
            <div class="calc-input-group"><label>GPA Scale</label><select class="calc-input" id="scale"><option value="4" selected>4.0 Scale</option><option value="10">10.0 Scale</option></select></div>
        \`;
        updateGradeInputs();
    }
    function updateGradeInputs() {
        const num = parseInt(document.getElementById('numSubjects').value) || 5;
        const container = document.getElementById('gradeInputs');
        if (!container) return;
        let html = '';
        for (let i = 1; i <= num; i++) {
            html += \`<div class="calc-input-group"><label>Subject \${i} Grade</label><select class="calc-input grade-input"><option value="4">A (4.0)</option><option value="3.7">A- (3.7)</option><option value="3.3">B+ (3.3)</option><option value="3">B (3.0)</option><option value="2.7">B- (2.7)</option><option value="2.3">C+ (2.3)</option><option value="2">C (2.0)</option><option value="1">D (1.0)</option><option value="0">F (0.0)</option></select></div>\`;
        }
        container.innerHTML = html;
    }
    function calculate() {
        const grades = Array.from(document.querySelectorAll('.grade-input')).map(e => parseFloat(e.value));
        const scale = parseFloat(document.getElementById('scale').value);
        if (grades.length === 0) { alert('Add subjects'); return; }
        const gpa = grades.reduce((a, b) => a + b, 0) / grades.length;
        const scaledGPA = scale === 10 ? (gpa / 4) * 10 : gpa;
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = \`
                <div class="result-item main-result"><span class="result-label">GPA</span><span class="result-value">\${scaledGPA.toFixed(2)}</span></div>
                <div class="result-breakdown"><h3>Grade Summary</h3>
                    <div class="breakdown-item"><span>Total Subjects:</span><span>\${grades.length}</span></div>
                    <div class="breakdown-item"><span>GPA:</span><span>\${scaledGPA.toFixed(2)} / \${scale}</span></div>
                    <div class="breakdown-item"><span>Percentage:</span><span>\${(scaledGPA / scale * 100).toFixed(1)}%</span></div>
                </div>
            \`;
        }
        if (typeof trackCalculation === 'function') trackCalculation('gpa', {gpa: scaledGPA}, {value: 'high-cpc'});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    document.getElementById('numSubjects')?.addEventListener('change', updateGradeInputs);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
