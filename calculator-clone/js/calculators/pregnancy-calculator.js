/**
 * Pregnancy Calculator
 * Calculates due date, current week, trimester, and pregnancy milestones
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

        // Get today's date for default value (280 days ago)
        const today = new Date();
        const defaultLMP = new Date(today.getTime() - (280 - 140) * 24 * 60 * 60 * 1000); // ~20 weeks pregnant
        const defaultDate = defaultLMP.toISOString().split('T')[0];

        container.innerHTML = `
            <div class="calc-input-group">
                <label for="calculationMethod">Calculation Method</label>
                <select class="calc-input" id="calculationMethod">
                    <option value="lmp" selected>Last Menstrual Period (LMP)</option>
                    <option value="conception">Conception Date</option>
                    <option value="ultrasound">Ultrasound Due Date</option>
                </select>
            </div>

            <div class="calc-input-group" id="lmpGroup">
                <label for="lmpDate">First Day of Last Menstrual Period</label>
                <input type="date" class="calc-input" id="lmpDate" value="${defaultDate}" max="${today.toISOString().split('T')[0]}">
            </div>

            <div class="calc-input-group" id="conceptionGroup" style="display: none;">
                <label for="conceptionDate">Conception Date</label>
                <input type="date" class="calc-input" id="conceptionDate" max="${today.toISOString().split('T')[0]}">
            </div>

            <div class="calc-input-group" id="ultrasoundGroup" style="display: none;">
                <label for="ultrasoundDate">Ultrasound Due Date</label>
                <input type="date" class="calc-input" id="ultrasoundDate">
            </div>

            <div class="calc-input-group">
                <label for="cycleLength">Average Cycle Length (days)</label>
                <input type="number" class="calc-input" id="cycleLength" placeholder="28" min="21" max="35" value="28">
            </div>
        `;

        // Method change handler
        const methodSelect = document.getElementById('calculationMethod');
        if (methodSelect) {
            methodSelect.addEventListener('change', function() {
                document.getElementById('lmpGroup').style.display = this.value === 'lmp' ? 'block' : 'none';
                document.getElementById('conceptionGroup').style.display = this.value === 'conception' ? 'block' : 'none';
                document.getElementById('ultrasoundGroup').style.display = this.value === 'ultrasound' ? 'block' : 'none';
            });
        }
    }

    function calculate() {
        const method = document.getElementById('calculationMethod').value;
        const cycleLength = parseInt(document.getElementById('cycleLength').value) || 28;

        let lmpDate;

        // Determine LMP based on calculation method
        if (method === 'lmp') {
            const lmpInput = document.getElementById('lmpDate').value;
            if (!lmpInput) {
                alert('Please select your Last Menstrual Period date');
                return;
            }
            lmpDate = new Date(lmpInput);
        } else if (method === 'conception') {
            const conceptionInput = document.getElementById('conceptionDate').value;
            if (!conceptionInput) {
                alert('Please select your conception date');
                return;
            }
            const conceptionDate = new Date(conceptionInput);
            // LMP is approximately 14 days before conception
            lmpDate = new Date(conceptionDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        } else if (method === 'ultrasound') {
            const ultrasoundInput = document.getElementById('ultrasoundDate').value;
            if (!ultrasoundInput) {
                alert('Please select your ultrasound due date');
                return;
            }
            const ultrasoundDueDate = new Date(ultrasoundInput);
            // LMP is 280 days before due date
            lmpDate = new Date(ultrasoundDueDate.getTime() - 280 * 24 * 60 * 60 * 1000);
        }

        // Adjust for cycle length (Naegele's rule adjustment)
        const cycleDiff = cycleLength - 28;
        lmpDate = new Date(lmpDate.getTime() + cycleDiff * 24 * 60 * 60 * 1000);

        // Calculate due date (Naegele's rule: LMP + 280 days)
        const dueDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);

        // Current date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Days pregnant
        const daysPregnant = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));

        // Weeks and days
        const weeksPregnant = Math.floor(daysPregnant / 7);
        const remainingDays = daysPregnant % 7;

        // Trimester
        let trimester;
        if (weeksPregnant < 13) {
            trimester = '1st Trimester';
        } else if (weeksPregnant < 27) {
            trimester = '2nd Trimester';
        } else {
            trimester = '3rd Trimester';
        }

        // Days until due date
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        // Key milestone dates
        const milestones = {
            firstTrimesterEnd: new Date(lmpDate.getTime() + 12 * 7 * 24 * 60 * 60 * 1000),
            secondTrimesterEnd: new Date(lmpDate.getTime() + 26 * 7 * 24 * 60 * 60 * 1000),
            fullTerm: new Date(lmpDate.getTime() + 37 * 7 * 24 * 60 * 60 * 1000),
            conceptionDate: new Date(lmpDate.getTime() + 14 * 24 * 60 * 60 * 1000)
        };

        // Format dates
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        // Display results
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">📅 Estimated Due Date</span>
                    <span class="result-value">${dueDate.toLocaleDateString('en-IN', options)}</span>
                </div>

                <div class="result-item">
                    <span class="result-label">Current Status</span>
                    <span class="result-value">${weeksPregnant} weeks ${remainingDays} days pregnant</span>
                </div>

                <div class="result-item">
                    <span class="result-label">Trimester</span>
                    <span class="result-value">${trimester}</span>
                </div>

                <div class="result-item">
                    <span class="result-label">Days Until Due Date</span>
                    <span class="result-value">${daysUntilDue > 0 ? daysUntilDue + ' days' : 'Due date passed'}</span>
                </div>

                <div class="result-breakdown">
                    <h3>🗓️ Important Dates</h3>

                    <div class="breakdown-item">
                        <span>Last Menstrual Period (LMP):</span>
                        <span>${lmpDate.toLocaleDateString('en-IN', options)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Estimated Conception Date:</span>
                        <span>${milestones.conceptionDate.toLocaleDateString('en-IN', options)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>End of 1st Trimester (Week 12):</span>
                        <span>${milestones.firstTrimesterEnd.toLocaleDateString('en-IN', options)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>End of 2nd Trimester (Week 26):</span>
                        <span>${milestones.secondTrimesterEnd.toLocaleDateString('en-IN', options)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Full Term (Week 37):</span>
                        <span>${milestones.fullTerm.toLocaleDateString('en-IN', options)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Due Date (Week 40):</span>
                        <span>${dueDate.toLocaleDateString('en-IN', options)}</span>
                    </div>
                </div>

                <div class="result-breakdown">
                    <h3>📊 Pregnancy Timeline</h3>
                    <div style="background: linear-gradient(90deg, #10b981 0%, #10b981 ${(weeksPregnant/40)*100}%, #e5e7eb ${(weeksPregnant/40)*100}%, #e5e7eb 100%); height: 30px; border-radius: 15px; margin: 1rem 0; position: relative;">
                        <div style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #1f2937; font-weight: 600; font-size: 0.9rem;">
                            ${Math.round((weeksPregnant/40)*100)}%
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #6b7280;">
                        <span>Week 0</span>
                        <span>Week 13</span>
                        <span>Week 27</span>
                        <span>Week 40</span>
                    </div>
                </div>

                ${getWeekInfo(weeksPregnant)}

                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin-top: 1.5rem; border-radius: 6px;">
                    <p style="margin: 0; color: #92400e; font-size: 0.9rem;">
                        <strong>Important:</strong> This calculator provides estimates based on standard calculations.
                        Every pregnancy is unique. Only about 5% of babies are born on their exact due date.
                        Always consult your healthcare provider for personalized medical advice and accurate dating based on ultrasound.
                    </p>
                </div>
            `;
        }

        // Track calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('pregnancy', {
                dueDate: dueDate.toISOString().split('T')[0],
                weeksPregnant: weeksPregnant,
                trimester: trimester
            }, {
                method: method,
                cycleLength: cycleLength
            });
        }
    }

    function getWeekInfo(weeks) {
        const weekInfo = {
            4: { stage: 'Early Pregnancy', description: 'Embryo implants in uterus, pregnancy test becomes positive' },
            8: { stage: 'Embryonic Stage', description: 'Major organs begin to form, heart starts beating' },
            12: { stage: 'End of 1st Trimester', description: 'Risk of miscarriage decreases significantly, baby fully formed' },
            16: { stage: 'Mid-Pregnancy', description: 'Baby\'s sex may be visible on ultrasound, feeling first movements soon' },
            20: { stage: 'Anatomy Scan', description: 'Detailed ultrasound to check baby\'s development' },
            24: { stage: 'Viability', description: 'Baby could potentially survive with intensive care if born' },
            28: { stage: '3rd Trimester Begins', description: 'Baby\'s eyes can open, rapid brain development' },
            32: { stage: 'Growth Phase', description: 'Baby gaining weight rapidly, getting ready for birth' },
            37: { stage: 'Full Term', description: 'Baby is fully developed and ready to be born anytime' },
            40: { stage: 'Due Date', description: 'Estimated delivery date - most babies are born within 2 weeks of this date' }
        };

        // Find closest milestone
        let closestWeek = null;
        let minDiff = Infinity;
        for (const week in weekInfo) {
            const diff = Math.abs(weeks - week);
            if (diff < minDiff) {
                minDiff = diff;
                closestWeek = week;
            }
        }

        if (closestWeek && weekInfo[closestWeek]) {
            const info = weekInfo[closestWeek];
            return `
                <div class="result-breakdown">
                    <h3>🤰 Current Stage: ${info.stage}</h3>
                    <p style="color: #4b5563; line-height: 1.6; margin: 0.5rem 0;">
                        ${info.description}
                    </p>
                </div>
            `;
        }

        return '';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
