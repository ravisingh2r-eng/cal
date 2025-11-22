/**
 * Time Duration Calculator
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
            <div class="calc-input-group"><label>Start Time</label><input type="time" class="calc-input" id="startTime" value="09:00"></div>
            <div class="calc-input-group"><label>End Time</label><input type="time" class="calc-input" id="endTime" value="17:00"></div>
            <div class="calc-input-group"><label>Break (minutes)</label><input type="number" class="calc-input" id="breakTime" value="60"></div>
        `;
    }
    function calculate() {
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const breakMinutes = parseInt(document.getElementById('breakTime').value) || 0;
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
        if (totalMinutes < 0) totalMinutes += 24 * 60;
        const workMinutes = totalMinutes - breakMinutes;
        const hours = Math.floor(workMinutes / 60);
        const minutes = workMinutes % 60;
        const decimalHours = workMinutes / 60;
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Work Duration</span><span class="result-value">${hours}h ${minutes}m</span></div>
                <div class="result-item"><span class="result-label">Decimal Hours</span><span class="result-value">${decimalHours.toFixed(2)} hours</span></div>
                <div class="result-breakdown"><h3>Time Breakdown</h3>
                    <div class="breakdown-item"><span>Start Time:</span><span>${startTime}</span></div>
                    <div class="breakdown-item"><span>End Time:</span><span>${endTime}</span></div>
                    <div class="breakdown-item"><span>Total Duration:</span><span>${Math.floor(totalMinutes/60)}h ${totalMinutes%60}m</span></div>
                    <div class="breakdown-item"><span>Break Time:</span><span>${breakMinutes} minutes</span></div>
                    <div class="breakdown-item"><span>Work Duration:</span><span>${hours}h ${minutes}m</span></div>
                    <div class="breakdown-item"><span>Decimal Hours:</span><span>${decimalHours.toFixed(2)}</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('time-duration', {workMinutes}, {});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
