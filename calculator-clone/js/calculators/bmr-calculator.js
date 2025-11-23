/**
 * BMR (Basal Metabolic Rate) Calculator
 * Calculates daily calorie needs using Mifflin-St Jeor and Harris-Benedict formulas
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

        container.innerHTML = `
            <div class="calc-input-group">
                <label for="gender">Gender</label>
                <select class="calc-input" id="gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <div class="calc-input-group">
                <label for="age">Age (years)</label>
                <input type="number" class="calc-input" id="age" placeholder="25" min="1" max="120" value="25">
            </div>

            <div class="calc-input-group">
                <label for="weight">Weight (kg)</label>
                <input type="number" class="calc-input" id="weight" placeholder="70" min="1" step="0.1" value="70">
            </div>

            <div class="calc-input-group">
                <label for="height">Height (cm)</label>
                <input type="number" class="calc-input" id="height" placeholder="170" min="1" step="0.1" value="170">
            </div>

            <div class="calc-input-group">
                <label for="activity">Activity Level</label>
                <select class="calc-input" id="activity">
                    <option value="1.2">Sedentary (little or no exercise)</option>
                    <option value="1.375">Lightly Active (exercise 1-3 days/week)</option>
                    <option value="1.55" selected>Moderately Active (exercise 3-5 days/week)</option>
                    <option value="1.725">Very Active (exercise 6-7 days/week)</option>
                    <option value="1.9">Extremely Active (physical job or training twice/day)</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const gender = document.getElementById('gender').value;
        const age = parseFloat(document.getElementById('age').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const activity = parseFloat(document.getElementById('activity').value);

        // Validation
        if (!age || !weight || !height || age <= 0 || weight <= 0 || height <= 0) {
            alert('Please enter valid values for all fields');
            return;
        }

        // Mifflin-St Jeor Formula (More accurate)
        let bmrMifflin;
        if (gender === 'male') {
            bmrMifflin = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmrMifflin = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        // Harris-Benedict Formula (Revised)
        let bmrHarris;
        if (gender === 'male') {
            bmrHarris = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmrHarris = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        // TDEE (Total Daily Energy Expenditure)
        const tdeeMifflin = bmrMifflin * activity;
        const tdeeHarris = bmrHarris * activity;

        // Weight goals
        const maintainCalories = Math.round(tdeeMifflin);
        const mildWeightLoss = Math.round(tdeeMifflin - 250); // 0.25 kg/week
        const weightLoss = Math.round(tdeeMifflin - 500); // 0.5 kg/week
        const extremeWeightLoss = Math.round(tdeeMifflin - 1000); // 1 kg/week
        const mildWeightGain = Math.round(tdeeMifflin + 250); // 0.25 kg/week
        const weightGain = Math.round(tdeeMifflin + 500); // 0.5 kg/week

        // Display results
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Your BMR (Basal Metabolic Rate)</span>
                    <span class="result-value">${Math.round(bmrMifflin).toLocaleString('en-IN')} calories/day</span>
                </div>

                <div class="result-item">
                    <span class="result-label">TDEE (Total Daily Energy Expenditure)</span>
                    <span class="result-value">${maintainCalories.toLocaleString('en-IN')} calories/day</span>
                </div>

                <div class="result-breakdown">
                    <h3>📊 Calorie Needs by Goal</h3>

                    <div class="breakdown-section">
                        <h4 style="color: #10b981; margin: 1rem 0 0.5rem 0;">🔽 Weight Loss Goals</h4>
                        <div class="breakdown-item">
                            <span>Mild Weight Loss (0.25 kg/week):</span>
                            <span style="font-weight: 600;">${mildWeightLoss.toLocaleString('en-IN')} cal/day</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Weight Loss (0.5 kg/week):</span>
                            <span style="font-weight: 600;">${weightLoss.toLocaleString('en-IN')} cal/day</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Extreme Weight Loss (1 kg/week):</span>
                            <span style="font-weight: 600;">${extremeWeightLoss.toLocaleString('en-IN')} cal/day</span>
                        </div>
                    </div>

                    <div class="breakdown-section">
                        <h4 style="color: #3b82f6; margin: 1rem 0 0.5rem 0;">⚖️ Maintain Weight</h4>
                        <div class="breakdown-item">
                            <span>Maintain Current Weight:</span>
                            <span style="font-weight: 600;">${maintainCalories.toLocaleString('en-IN')} cal/day</span>
                        </div>
                    </div>

                    <div class="breakdown-section">
                        <h4 style="color: #f59e0b; margin: 1rem 0 0.5rem 0;">🔼 Weight Gain Goals</h4>
                        <div class="breakdown-item">
                            <span>Mild Weight Gain (0.25 kg/week):</span>
                            <span style="font-weight: 600;">${mildWeightGain.toLocaleString('en-IN')} cal/day</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Weight Gain (0.5 kg/week):</span>
                            <span style="font-weight: 600;">${weightGain.toLocaleString('en-IN')} cal/day</span>
                        </div>
                    </div>
                </div>

                <div class="result-breakdown">
                    <h3>📈 Formula Comparison</h3>
                    <div class="breakdown-item">
                        <span>Mifflin-St Jeor BMR:</span>
                        <span>${Math.round(bmrMifflin).toLocaleString('en-IN')} cal/day</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Harris-Benedict BMR:</span>
                        <span>${Math.round(bmrHarris).toLocaleString('en-IN')} cal/day</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Mifflin-St Jeor TDEE:</span>
                        <span>${Math.round(tdeeMifflin).toLocaleString('en-IN')} cal/day</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Harris-Benedict TDEE:</span>
                        <span>${Math.round(tdeeHarris).toLocaleString('en-IN')} cal/day</span>
                    </div>
                </div>

                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin-top: 1.5rem; border-radius: 6px;">
                    <p style="margin: 0; color: #92400e; font-size: 0.9rem;">
                        <strong>Note:</strong> These calculations are estimates. Individual metabolic rates can vary.
                        Consult a healthcare professional or registered dietitian for personalized advice.
                    </p>
                </div>
            `;
        }

        // Track calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('bmr', { bmr: Math.round(bmrMifflin), tdee: maintainCalories }, { gender, age, weight, height });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
