/**
 * Blood Pressure Calculator
 * Check blood pressure category and heart health
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
                <label for="systolic">Systolic Pressure (mmHg)</label>
                <input type="number" id="systolic" placeholder="Top number" min="70" max="250" step="1" value="120">
                <small>Normal: Less than 120</small>
            </div>

            <div class="input-group">
                <label for="diastolic">Diastolic Pressure (mmHg)</label>
                <input type="number" id="diastolic" placeholder="Bottom number" min="40" max="150" step="1" value="80">
                <small>Normal: Less than 80</small>
            </div>

            <div class="input-group">
                <label for="age">Age (Optional)</label>
                <input type="number" id="age" placeholder="Your age" min="1" max="120" step="1">
            </div>
        `;
    }

    function getBPCategory(systolic, diastolic) {
        if (systolic < 120 && diastolic < 80) {
            return {
                category: 'Normal',
                color: '#10b981',
                description: 'Your blood pressure is in the normal range. Maintain a healthy lifestyle.',
                risk: 'Low'
            };
        } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
            return {
                category: 'Elevated',
                color: '#f59e0b',
                description: 'You have elevated blood pressure. Lifestyle changes can help prevent progression.',
                risk: 'Moderate'
            };
        } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
            return {
                category: 'High BP Stage 1',
                color: '#f97316',
                description: 'You have stage 1 hypertension. Consult a doctor and consider lifestyle changes.',
                risk: 'Moderate to High'
            };
        } else if (systolic >= 140 || diastolic >= 90) {
            return {
                category: 'High BP Stage 2',
                color: '#ef4444',
                description: 'You have stage 2 hypertension. Medical attention is recommended.',
                risk: 'High'
            };
        } else if (systolic >= 180 || diastolic >= 120) {
            return {
                category: 'Hypertensive Crisis',
                color: '#dc2626',
                description: 'EMERGENCY! Seek immediate medical attention.',
                risk: 'Very High'
            };
        } else {
            return {
                category: 'Hypotension',
                color: '#3b82f6',
                description: 'Your blood pressure is lower than normal. Consult a doctor if you have symptoms.',
                risk: 'Monitor'
            };
        }
    }

    function calculate() {
        const systolic = parseInt(document.getElementById('systolic').value);
        const diastolic = parseInt(document.getElementById('diastolic').value);
        const age = parseInt(document.getElementById('age').value);

        if (isNaN(systolic) || isNaN(diastolic)) {
            alert('Please enter valid blood pressure readings');
            return;
        }

        if (systolic < 70 || systolic > 250 || diastolic < 40 || diastolic > 150) {
            alert('Please enter realistic blood pressure values');
            return;
        }

        const bpInfo = getBPCategory(systolic, diastolic);
        const pulsePressure = systolic - diastolic;
        const map = diastolic + (pulsePressure / 3); // Mean Arterial Pressure

        displayResults(systolic, diastolic, bpInfo, pulsePressure, map, age);

        if (typeof trackCalculation === 'function') {
            trackCalculation('blood-pressure', { systolic, diastolic }, { category: bpInfo.category });
        }

        setTimeout(() => {
            if (typeof AdManager !== 'undefined' && AdManager.refresh) {
                AdManager.refresh();
            }
        }, 2000);
    }

    function displayResults(sys, dia, info, pp, map, age) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>Blood Pressure Analysis</h3>
            <div class="result-item">
                <span class="result-label">Your BP Reading</span>
                <span class="result-value">${sys}/${dia} mmHg</span>
            </div>
            <div class="result-item highlight" style="border-left: 4px solid ${info.color};">
                <span class="result-label">Category</span>
                <span class="result-value" style="color: ${info.color}; font-weight: bold;">${info.category}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Health Risk</span>
                <span class="result-value">${info.risk}</span>
            </div>
            <div style="margin: 15px 0; padding: 12px; background: #f9fafb; border-left: 4px solid ${info.color}; border-radius: 4px;">
                <p style="margin: 0;"><strong>Assessment:</strong> ${info.description}</p>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">Additional Metrics</h4>
            <div class="result-item">
                <span class="result-label">Pulse Pressure</span>
                <span class="result-value">${pp} mmHg</span>
            </div>
            <div class="result-item">
                <span class="result-label">Mean Arterial Pressure (MAP)</span>
                <span class="result-value">${map.toFixed(1)} mmHg</span>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">BP Categories (AHA Guidelines)</h4>
            <div style="padding: 10px; background: #f9fafb; border-radius: 6px; font-size: 0.9em;">
                <div style="margin: 5px 0;"><strong>Normal:</strong> &lt;120/80</div>
                <div style="margin: 5px 0;"><strong>Elevated:</strong> 120-129/&lt;80</div>
                <div style="margin: 5px 0;"><strong>Stage 1:</strong> 130-139/80-89</div>
                <div style="margin: 5px 0;"><strong>Stage 2:</strong> ≥140/≥90</div>
                <div style="margin: 5px 0;"><strong>Crisis:</strong> ≥180/≥120</div>
            </div>

            <div style="margin-top: 15px; padding: 10px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <strong>Disclaimer:</strong> This calculator is for educational purposes only. Consult a healthcare professional for medical advice.
            </div>
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();