/**
 * Enhanced Age Calculator - Modern Design
 * Features: Timeline visualization, next birthday countdown, life milestones
 */

(function() {
    'use strict';

    function init() {
        createCalculatorInterface();
        setupEventListeners();
    }

    function createCalculatorInterface() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        const today = new Date().toISOString().split('T')[0];

        container.innerHTML = `
            <div class="age-calculator-container">
                <!-- Date of Birth -->
                <div class="calc-input-group">
                    <label for="dob">📅 Date of Birth</label>
                    <input type="date" class="calc-input" id="dob" value="1990-01-01" max="${today}">
                </div>

                <!-- Calculate As Of Date -->
                <div class="calc-input-group">
                    <label for="asOf">📆 Calculate Age As Of</label>
                    <input type="date" class="calc-input" id="asOf" value="${today}">
                </div>

                <!-- Calculate Button -->
                <button type="button" class="btn btn-primary btn-large" id="calculateBtn">
                    <span>Calculate Age</span>
                </button>
            </div>

            <style>
                .age-calculator-container {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .btn {
                    width: 100%;
                    padding: 1.2rem 2rem;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 1.5rem;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }
            </style>
        `;

        // Hide default calculate button
        const defaultBtn = document.getElementById('calculate');
        if (defaultBtn) {
            defaultBtn.style.display = 'none';
        }
    }

    function setupEventListeners() {
        // Calculate button
        document.getElementById('calculateBtn')?.addEventListener('click', calculate);

        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.type === 'date') {
                calculate();
            }
        });
    }

    function calculate() {
        const dobInput = document.getElementById('dob').value;
        const asOfInput = document.getElementById('asOf').value;

        if (!dobInput || !asOfInput) {
            alert('Please select both dates');
            return;
        }

        const dob = new Date(dobInput);
        const asOf = new Date(asOfInput);

        if (dob > asOf) {
            alert('Date of birth cannot be after the calculation date');
            return;
        }

        // Calculate age components
        let years = asOf.getFullYear() - dob.getFullYear();
        let months = asOf.getMonth() - dob.getMonth();
        let days = asOf.getDate() - dob.getDate();

        if (days < 0) {
            months--;
            days += new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Calculate total units
        const diffMs = asOf - dob;
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;
        const totalSeconds = totalMinutes * 60;

        // Next birthday
        const nextBirthday = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
        if (nextBirthday < asOf) {
            nextBirthday.setFullYear(asOf.getFullYear() + 1);
        }
        const daysUntilBirthday = Math.ceil((nextBirthday - asOf) / (1000 * 60 * 60 * 24));

        displayResults({
            years, months, days,
            totalDays, totalWeeks, totalMonths, totalHours, totalMinutes, totalSeconds,
            daysUntilBirthday, nextBirthday, dob, asOf
        });

        // Track calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('age', {
                years: years,
                days: totalDays
            }, {});
        }
    }

    function displayResults(data) {
        const { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, totalMinutes, totalSeconds, daysUntilBirthday, nextBirthday, dob } = data;

        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        // Calculate life progress (assume 80 years lifespan)
        const lifeExpectancy = 80;
        const lifeProgress = (years / lifeExpectancy) * 100;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <!-- Main Age Result Card -->
            <div class="age-result-card">
                <div class="age-icon">🎂</div>
                <div class="age-display">
                    <div class="age-value">${years} Years</div>
                    <div class="age-detail">${months} Months, ${days} Days</div>
                </div>
            </div>

            <!-- Birthday Countdown -->
            <div class="birthday-countdown-card">
                <div class="countdown-icon">🎉</div>
                <div class="countdown-content">
                    <div class="countdown-label">Next Birthday In</div>
                    <div class="countdown-value">${daysUntilBirthday} Days</div>
                    <div class="countdown-date">${nextBirthday.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
            </div>

            <!-- Age Timeline -->
            <div class="timeline-container">
                <h3>⏳ Life Timeline</h3>
                <div class="life-progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(lifeProgress, 100)}%;">
                        <span class="progress-label">${years} years</span>
                    </div>
                </div>
                <div class="timeline-labels">
                    <span>Birth</span>
                    <span>20</span>
                    <span>40</span>
                    <span>60</span>
                    <span>80</span>
                </div>
                <div class="timeline-note">Based on ${lifeExpectancy} year life expectancy</div>
            </div>

            <!-- Age in Different Units -->
            <div class="result-breakdown">
                <h3>📊 Age in Different Units</h3>
                <div class="units-grid">
                    <div class="unit-card">
                        <div class="unit-value">${totalMonths}</div>
                        <div class="unit-label">Months</div>
                    </div>
                    <div class="unit-card">
                        <div class="unit-value">${totalWeeks.toLocaleString('en-IN')}</div>
                        <div class="unit-label">Weeks</div>
                    </div>
                    <div class="unit-card">
                        <div class="unit-value">${totalDays.toLocaleString('en-IN')}</div>
                        <div class="unit-label">Days</div>
                    </div>
                    <div class="unit-card">
                        <div class="unit-value">${totalHours.toLocaleString('en-IN')}</div>
                        <div class="unit-label">Hours</div>
                    </div>
                    <div class="unit-card">
                        <div class="unit-value">${totalMinutes.toLocaleString('en-IN')}</div>
                        <div class="unit-label">Minutes</div>
                    </div>
                    <div class="unit-card">
                        <div class="unit-value">${totalSeconds.toLocaleString('en-IN')}</div>
                        <div class="unit-label">Seconds</div>
                    </div>
                </div>
            </div>

            <!-- Life Milestones -->
            ${generateMilestones(years, dob)}

            <!-- Birth Information -->
            <div class="result-breakdown">
                <h3>ℹ️ Birth Information</h3>
                <div class="details-grid">
                    <div class="detail-row">
                        <span>Date of Birth:</span>
                        <span style="font-weight: 600;">${dob.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div class="detail-row">
                        <span>Day of Week:</span>
                        <span style="font-weight: 600;">${dob.toLocaleDateString('en-IN', { weekday: 'long' })}</span>
                    </div>
                    <div class="detail-row">
                        <span>Birth Year:</span>
                        <span style="font-weight: 600;">${dob.getFullYear()}</span>
                    </div>
                    <div class="detail-row">
                        <span>Generation:</span>
                        <span style="font-weight: 600;">${getGeneration(dob.getFullYear())}</span>
                    </div>
                </div>
            </div>

            <style>
                .age-result-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 16px;
                    padding: 2.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                }

                .age-icon {
                    font-size: 4rem;
                }

                .age-display {
                    text-align: center;
                }

                .age-value {
                    font-size: 3rem;
                    font-weight: 700;
                    line-height: 1;
                    margin-bottom: 0.5rem;
                }

                .age-detail {
                    font-size: 1.25rem;
                    opacity: 0.95;
                }

                .birthday-countdown-card {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white;
                    border-radius: 12px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .countdown-icon {
                    font-size: 3rem;
                }

                .countdown-label {
                    font-size: 0.9rem;
                    opacity: 0.9;
                    margin-bottom: 0.25rem;
                }

                .countdown-value {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 0.25rem;
                }

                .countdown-date {
                    font-size: 0.9rem;
                    opacity: 0.9;
                }

                /* Timeline */
                .timeline-container {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .timeline-container h3 {
                    margin-bottom: 1.5rem;
                    color: #1f2937;
                }

                .life-progress-bar {
                    height: 50px;
                    background: #f3f4f6;
                    border-radius: 25px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding-right: 1rem;
                    transition: width 1s ease;
                }

                .progress-label {
                    color: white;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .timeline-labels {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 0.5rem;
                    font-size: 0.85rem;
                    color: #6b7280;
                }

                .timeline-note {
                    text-align: center;
                    font-size: 0.8rem;
                    color: #9ca3af;
                    margin-top: 0.5rem;
                }

                /* Units Grid */
                .units-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .unit-card {
                    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
                    padding: 1.5rem;
                    border-radius: 10px;
                    text-align: center;
                    border: 2px solid #e5e7eb;
                    transition: all 0.3s;
                }

                .unit-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
                    border-color: #667eea;
                }

                .unit-value {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #667eea;
                    margin-bottom: 0.5rem;
                }

                .unit-label {
                    font-size: 0.9rem;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .details-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-top: 1rem;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.75rem;
                    background: #f9fafb;
                    border-radius: 6px;
                }

                .milestone-item {
                    padding: 1rem;
                    background: #f9fafb;
                    border-left: 4px solid;
                    border-radius: 6px;
                    margin-bottom: 0.75rem;
                }

                .milestone-item.achieved {
                    border-left-color: #10b981;
                    background: #ecfdf5;
                }

                .milestone-item.upcoming {
                    border-left-color: #f59e0b;
                    background: #fef3c7;
                }

                .milestone-title {
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 0.25rem;
                }

                .milestone-detail {
                    font-size: 0.9rem;
                    color: #6b7280;
                }

                @media (max-width: 768px) {
                    .age-result-card {
                        flex-direction: column;
                        gap: 1rem;
                        padding: 2rem;
                    }

                    .age-value {
                        font-size: 2.5rem;
                    }

                    .age-detail {
                        font-size: 1rem;
                    }

                    .birthday-countdown-card {
                        flex-direction: column;
                        text-align: center;
                    }

                    .units-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .unit-value {
                        font-size: 1.25rem;
                    }
                }
            </style>
        `;

        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function generateMilestones(years, dob) {
        const milestones = [
            { age: 1, title: 'First Birthday', description: 'Baby\'s first year milestone' },
            { age: 10, title: 'Decade', description: 'First decade of life completed' },
            { age: 13, title: 'Teenager', description: 'Teenage years begin' },
            { age: 18, title: 'Adult', description: 'Legal adulthood in most countries' },
            { age: 21, title: 'Coming of Age', description: 'Traditional coming of age milestone' },
            { age: 25, title: 'Quarter Century', description: '25 years of life experiences' },
            { age: 30, title: 'Third Decade', description: 'Entering the 30s' },
            { age: 40, title: 'Four Decades', description: 'Mid-life milestone' },
            { age: 50, title: 'Half Century', description: '50 years of wisdom' },
            { age: 60, title: 'Diamond Jubilee', description: '60 years milestone' },
            { age: 65, title: 'Retirement Age', description: 'Traditional retirement age' },
            { age: 70, title: 'Platinum Jubilee', description: '70 years of life' },
            { age: 75, title: 'Three Quarters', description: '75 years milestone' },
            { age: 80, title: 'Octogenarian', description: '80 years of memories' }
        ];

        const achieved = milestones.filter(m => years >= m.age);
        const upcoming = milestones.filter(m => years < m.age).slice(0, 3);

        let html = '<div class="result-breakdown"><h3>🎯 Life Milestones</h3>';

        if (achieved.length > 0) {
            html += '<h4 style="color: #10b981; margin: 1rem 0 0.5rem;">✓ Achieved</h4>';
            achieved.slice(-3).forEach(m => {
                html += `
                    <div class="milestone-item achieved">
                        <div class="milestone-title">${m.title} (Age ${m.age})</div>
                        <div class="milestone-detail">${m.description}</div>
                    </div>
                `;
            });
        }

        if (upcoming.length > 0) {
            html += '<h4 style="color: #f59e0b; margin: 1rem 0 0.5rem;">⏳ Upcoming</h4>';
            upcoming.forEach(m => {
                const yearsUntil = m.age - years;
                html += `
                    <div class="milestone-item upcoming">
                        <div class="milestone-title">${m.title} (Age ${m.age})</div>
                        <div class="milestone-detail">${m.description} • In ${yearsUntil} year${yearsUntil > 1 ? 's' : ''}</div>
                    </div>
                `;
            });
        }

        html += '</div>';
        return html;
    }

    function getGeneration(birthYear) {
        if (birthYear >= 1997 && birthYear <= 2012) return 'Gen Z';
        if (birthYear >= 1981 && birthYear <= 1996) return 'Millennial';
        if (birthYear >= 1965 && birthYear <= 1980) return 'Gen X';
        if (birthYear >= 1946 && birthYear <= 1964) return 'Baby Boomer';
        if (birthYear >= 1928 && birthYear <= 1945) return 'Silent Generation';
        if (birthYear >= 2013) return 'Gen Alpha';
        return 'Unknown';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
