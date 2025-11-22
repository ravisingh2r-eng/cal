/**
 * Ideal Weight Calculator
 * Calculate ideal body weight using multiple formulas
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
            <div class="input-group">
                <label for="gender">Gender</label>
                <select id="gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <div class="input-group">
                <label for="height">Height (cm)</label>
                <input type="number" id="height" placeholder="Enter height in cm" min="100" max="250" step="0.1" value="170">
            </div>

            <div class="input-group">
                <label for="currentWeight">Current Weight (kg) - Optional</label>
                <input type="number" id="currentWeight" placeholder="Your current weight" min="20" max="300" step="0.1">
            </div>
        `;
    }

    function calculate() {
        const gender = document.getElementById('gender').value;
        const height = parseFloat(document.getElementById('height').value);
        const currentWeight = parseFloat(document.getElementById('currentWeight').value);

        if (isNaN(height) || height < 100 || height > 250) {
            alert('Please enter a valid height between 100-250 cm');
            return;
        }

        const heightInMeters = height / 100;
        const heightInInches = height / 2.54;

        // Devine Formula (1974)
        let devine;
        if (gender === 'male') {
            devine = 50 + 2.3 * ((heightInInches - 60));
        } else {
            devine = 45.5 + 2.3 * ((heightInInches - 60));
        }

        // Robinson Formula (1983)
        let robinson;
        if (gender === 'male') {
            robinson = 52 + 1.9 * ((heightInInches - 60));
        } else {
            robinson = 49 + 1.7 * ((heightInInches - 60));
        }

        // Miller Formula (1983)
        let miller;
        if (gender === 'male') {
            miller = 56.2 + 1.41 * ((heightInInches - 60));
        } else {
            miller = 53.1 + 1.36 * ((heightInInches - 60));
        }

        // Hamwi Formula (1964)
        let hamwi;
        if (gender === 'male') {
            hamwi = 48 + 2.7 * ((heightInInches - 60));
        } else {
            hamwi = 45.5 + 2.2 * ((heightInInches - 60));
        }

        // BMI-based healthy weight range (BMI 18.5-24.9)
        const minHealthy = 18.5 * heightInMeters * heightInMeters;
        const maxHealthy = 24.9 * heightInMeters * heightInMeters;
        const idealBMI = 21.5 * heightInMeters * heightInMeters;

        // Average of formulas
        const average = (devine + robinson + miller + hamwi) / 4;

        let status = '';
        let difference = 0;
        if (!isNaN(currentWeight)) {
            if (currentWeight < minHealthy) {
                status = 'Underweight';
                difference = minHealthy - currentWeight;
            } else if (currentWeight > maxHealthy) {
                status = 'Overweight';
                difference = currentWeight - maxHealthy;
            } else {
                status = 'Healthy Weight';
                difference = 0;
            }
        }

        displayResults(devine, robinson, miller, hamwi, average, minHealthy, maxHealthy, idealBMI, currentWeight, status, difference);

        if (typeof trackCalculation === 'function') {
            trackCalculation('ideal-weight', { gender, height }, { average });
        }

        setTimeout(() => {
            if (typeof AdManager !== 'undefined' && AdManager.refresh) {
                AdManager.refresh();
            }
        }, 2000);
    }

    function displayResults(devine, robinson, miller, hamwi, avg, min, max, ideal, current, status, diff) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>Ideal Weight by Formula</h3>
            <div class="result-item">
                <span class="result-label">Devine Formula</span>
                <span class="result-value">${devine.toFixed(1)} kg</span>
            </div>
            <div class="result-item">
                <span class="result-label">Robinson Formula</span>
                <span class="result-value">${robinson.toFixed(1)} kg</span>
            </div>
            <div class="result-item">
                <span class="result-label">Miller Formula</span>
                <span class="result-value">${miller.toFixed(1)} kg</span>
            </div>
            <div class="result-item">
                <span class="result-label">Hamwi Formula</span>
                <span class="result-value">${hamwi.toFixed(1)} kg</span>
            </div>
            <div class="result-item highlight">
                <span class="result-label">Average Ideal Weight</span>
                <span class="result-value">${avg.toFixed(1)} kg</span>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">Healthy Weight Range (BMI 18.5-24.9)</h4>
            <div class="result-item">
                <span class="result-label">Minimum Healthy Weight</span>
                <span class="result-value">${min.toFixed(1)} kg</span>
            </div>
            <div class="result-item">
                <span class="result-label">Maximum Healthy Weight</span>
                <span class="result-value">${max.toFixed(1)} kg</span>
            </div>
            <div class="result-item">
                <span class="result-label">Ideal (BMI 21.5)</span>
                <span class="result-value">${ideal.toFixed(1)} kg</span>
            </div>

            ${!isNaN(current) ? `
                <h4 style="margin-top: 20px; margin-bottom: 10px;">Your Status</h4>
                <div class="result-item">
                    <span class="result-label">Current Weight</span>
                    <span class="result-value">${current.toFixed(1)} kg</span>
                </div>
                <div class="result-item ${status === 'Healthy Weight' ? 'highlight' : ''}">
                    <span class="result-label">Status</span>
                    <span class="result-value">${status}</span>
                </div>
                ${diff > 0 ? `
                    <div class="result-item">
                        <span class="result-label">${status === 'Overweight' ? 'Weight to Lose' : 'Weight to Gain'}</span>
                        <span class="result-value">${diff.toFixed(1)} kg</span>
                    </div>
                ` : ''}
            ` : ''}
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();