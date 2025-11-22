/**
 * Period Calculator
 * Track and predict menstrual cycle dates
 */

(function() {
    'use strict';

    function init() {
        setupEventListeners();
        createInputFields();
    }

    function setupEventListeners() {
        const calculateBtn = document.getElementById('calculate');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculate);
        }

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculate();
        });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        const today = new Date().toISOString().split('T')[0];

        container.innerHTML = `
            <div class="input-group">
                <label for="lastPeriod">First Day of Last Period</label>
                <input type="date" id="lastPeriod" max="${today}">
            </div>

            <div class="input-group">
                <label for="cycleLength">Average Cycle Length (days)</label>
                <input type="number" id="cycleLength" placeholder="Cycle length" min="21" max="35" step="1" value="28">
                <small>Typical: 21-35 days, Average: 28 days</small>
            </div>

            <div class="input-group">
                <label for="periodLength">Period Duration (days)</label>
                <input type="number" id="periodLength" placeholder="Period length" min="2" max="10" step="1" value="5">
                <small>Typical: 3-7 days</small>
            </div>

            <div class="input-group">
                <label for="cycles">Number of Cycles to Predict</label>
                <input type="number" id="cycles" placeholder="Cycles" min="1" max="12" step="1" value="3">
            </div>
        `;
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function calculate() {
        const lastPeriodStr = document.getElementById('lastPeriod').value;
        const cycleLength = parseInt(document.getElementById('cycleLength').value);
        const periodLength = parseInt(document.getElementById('periodLength').value);
        const cyclesToPredict = parseInt(document.getElementById('cycles').value);

        if (!lastPeriodStr) {
            alert('Please select the first day of your last period');
            return;
        }

        if (isNaN(cycleLength) || cycleLength < 21 || cycleLength > 35) {
            alert('Please enter a valid cycle length (21-35 days)');
            return;
        }

        if (isNaN(periodLength) || periodLength < 2 || periodLength > 10) {
            alert('Please enter a valid period duration (2-10 days)');
            return;
        }

        const lastPeriod = new Date(lastPeriodStr);
        const periods = [];

        for (let i = 1; i <= cyclesToPredict; i++) {
            const periodStart = addDays(lastPeriod, cycleLength * i);
            const periodEnd = addDays(periodStart, periodLength - 1);
            const ovulation = addDays(periodStart, -14);
            const fertileStart = addDays(ovulation, -5);
            const fertileEnd = ovulation;

            periods.push({
                cycle: i,
                periodStart,
                periodEnd,
                ovulation,
                fertileStart,
                fertileEnd
            });
        }

        displayResults(lastPeriod, periodLength, periods, cycleLength);

        if (typeof trackCalculation === 'function') {
            trackCalculation('period', { cycleLength, periodLength }, { cycles: cyclesToPredict });
        }

        setTimeout(() => {
            if (typeof AdManager !== 'undefined' && AdManager.refresh) {
                AdManager.refresh();
            }
        }, 2000);
    }

    function displayResults(lastPeriod, periodLength, periods, cycleLength) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        let periodsHTML = '';
        periods.forEach(p => {
            periodsHTML += `
                <div style="margin-bottom: 20px; padding: 15px; background: #f9fafb; border-radius: 8px;">
                    <h4 style="margin: 0 0 10px 0; color: #1f2937;">Cycle ${p.cycle}</h4>
                    <div style="margin: 8px 0;">
                        <strong style="color: #ef4444;">Period:</strong> ${formatDate(p.periodStart)} - ${formatDate(p.periodEnd)}
                    </div>
                    <div style="margin: 8px 0;">
                        <strong style="color: #10b981;">Fertile Window:</strong> ${formatDate(p.fertileStart)} - ${formatDate(p.fertileEnd)}
                    </div>
                    <div style="margin: 8px 0;">
                        <strong style="color: #3b82f6;">Ovulation:</strong> ${formatDate(p.ovulation)}
                    </div>
                </div>
            `;
        });

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>Period Prediction</h3>
            <div class="result-item">
                <span class="result-label">Last Period Started</span>
                <span class="result-value">${formatDate(lastPeriod)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Cycle Length</span>
                <span class="result-value">${cycleLength} days</span>
            </div>
            <div class="result-item">
                <span class="result-label">Period Duration</span>
                <span class="result-value">${periodLength} days</span>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 15px;">Upcoming Cycles</h4>
            ${periodsHTML}

            <div style="margin-top: 15px; padding: 10px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <p style="margin: 0; margin-bottom: 8px;"><strong>Legend:</strong></p>
                <ul style="margin: 0; padding-left: 20px;">
                    <li><strong style="color: #ef4444;">Period Days:</strong> Menstrual bleeding</li>
                    <li><strong style="color: #10b981;">Fertile Window:</strong> 6 days before ovulation (best for conception)</li>
                    <li><strong style="color: #3b82f6;">Ovulation:</strong> Most fertile day</li>
                </ul>
            </div>

            <div style="margin-top: 15px; padding: 10px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <strong>Note:</strong> Predictions are estimates based on average cycle. Actual dates may vary. Track for better accuracy.
            </div>
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();