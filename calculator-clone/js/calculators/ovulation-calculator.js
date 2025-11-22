/**
 * Ovulation Calculator
 * Calculate fertile window and ovulation date
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
                <label for="lmpDate">First Day of Last Period</label>
                <input type="date" id="lmpDate" max="${today}">
            </div>

            <div class="input-group">
                <label for="cycleLength">Average Cycle Length (days)</label>
                <input type="number" id="cycleLength" placeholder="Cycle length" min="21" max="35" step="1" value="28">
                <small>Typical: 21-35 days, Average: 28 days</small>
            </div>

            <div class="input-group">
                <label for="lutealPhase">Luteal Phase Length (days)</label>
                <input type="number" id="lutealPhase" placeholder="Luteal phase" min="10" max="16" step="1" value="14">
                <small>Typical: 12-14 days</small>
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
        const lmpDateStr = document.getElementById('lmpDate').value;
        const cycleLength = parseInt(document.getElementById('cycleLength').value);
        const lutealPhase = parseInt(document.getElementById('lutealPhase').value);

        if (!lmpDateStr) {
            alert('Please select the first day of your last period');
            return;
        }

        if (isNaN(cycleLength) || cycleLength < 21 || cycleLength > 35) {
            alert('Please enter a valid cycle length (21-35 days)');
            return;
        }

        const lmpDate = new Date(lmpDateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Ovulation typically occurs 14 days before next period
        const ovulationDay = cycleLength - lutealPhase;
        const ovulationDate = addDays(lmpDate, ovulationDay);

        // Fertile window: 5 days before ovulation + ovulation day
        const fertileStart = addDays(ovulationDate, -5);
        const fertileEnd = ovulationDate;

        // Best days for conception (2-3 days before ovulation)
        const bestStart = addDays(ovulationDate, -3);
        const bestEnd = addDays(ovulationDate, -1);

        // Next period
        const nextPeriod = addDays(lmpDate, cycleLength);

        // Check if currently in fertile window
        const isCurrentlyFertile = today >= fertileStart && today <= fertileEnd;

        displayResults(ovulationDate, fertileStart, fertileEnd, bestStart, bestEnd, nextPeriod, isCurrentlyFertile);

        if (typeof trackCalculation === 'function') {
            trackCalculation('ovulation', { cycleLength }, { ovulationDate: ovulationDate.toISOString() });
        }

        setTimeout(() => {
            if (typeof AdManager !== 'undefined' && AdManager.refresh) {
                AdManager.refresh();
            }
        }, 2000);
    }

    function displayResults(ovulation, fertileStart, fertileEnd, bestStart, bestEnd, nextPeriod, isFertile) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>Ovulation & Fertility Calendar</h3>
            
            ${isFertile ? `
                <div style="margin-bottom: 15px; padding: 12px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                    <strong>⚠️ You are currently in your fertile window!</strong>
                </div>
            ` : ''}

            <div class="result-item highlight">
                <span class="result-label">Ovulation Date</span>
                <span class="result-value">${formatDate(ovulation)}</span>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">Fertile Window</h4>
            <div class="result-item">
                <span class="result-label">Fertile Window Starts</span>
                <span class="result-value">${formatDate(fertileStart)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Fertile Window Ends</span>
                <span class="result-value">${formatDate(fertileEnd)}</span>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">Best Days for Conception</h4>
            <div class="result-item highlight">
                <span class="result-label">Best Days</span>
                <span class="result-value">${formatDate(bestStart)} - ${formatDate(bestEnd)}</span>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">Next Cycle</h4>
            <div class="result-item">
                <span class="result-label">Expected Next Period</span>
                <span class="result-value">${formatDate(nextPeriod)}</span>
            </div>

            <div style="margin-top: 15px; padding: 10px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <p style="margin: 0; margin-bottom: 8px;"><strong>Tips for Conception:</strong></p>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>Have intercourse during your fertile window</li>
                    <li>The 2-3 days before ovulation are most fertile</li>
                    <li>Track your cycle for 3-4 months for best accuracy</li>
                    <li>Consult a doctor if trying for over 12 months</li>
                </ul>
            </div>

            <div style="margin-top: 15px; padding: 10px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <strong>Note:</strong> This calculator provides estimates. Actual ovulation may vary. Not for use as birth control.
            </div>
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();