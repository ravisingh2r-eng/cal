/**
 * BMI Calculator Logic
 */

(function() {
    'use strict';

    let unitSystem = 'metric';
    let selectedGender = null;

    function init() {
        setupEventListeners();
    }

    function setupEventListeners() {
        // Unit toggle
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                unitSystem = e.target.dataset.unit;
                document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Toggle input sections
                if (unitSystem === 'metric') {
                    document.getElementById('metricInputs').style.display = 'block';
                    document.getElementById('imperialInputs').style.display = 'none';
                } else {
                    document.getElementById('metricInputs').style.display = 'none';
                    document.getElementById('imperialInputs').style.display = 'block';
                }
            });
        });

        // Gender selection
        document.querySelectorAll('.gender-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                selectedGender = e.target.dataset.gender;
                document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Calculate button
        document.getElementById('calculateBMI')?.addEventListener('click', calculate);

        // Reset button
        document.getElementById('resetBMI')?.addEventListener('click', reset);
    }

    function calculate() {
        let heightCm, weightKg;

        if (unitSystem === 'metric') {
            heightCm = parseFloat(document.getElementById('heightCm')?.value || 0);
            weightKg = parseFloat(document.getElementById('weightKg')?.value || 0);
        } else {
            const heightFt = parseFloat(document.getElementById('heightFt')?.value || 0);
            const heightIn = parseFloat(document.getElementById('heightIn')?.value || 0);
            const weightLbs = parseFloat(document.getElementById('weightLbs')?.value || 0);

            heightCm = (heightFt * 12 + heightIn) * 2.54;
            weightKg = weightLbs * 0.453592;
        }

        if (heightCm <= 0 || weightKg <= 0) {
            APP.showNotification('Please enter valid values', 'error');
            return;
        }

        const heightM = heightCm / 100;
        const bmi = weightKg / (heightM * heightM);

        displayResults(bmi, heightCm, weightKg);
        updateIndicator(bmi);
        showHealthyWeightRange(heightCm);

        document.getElementById('bmiResults').style.display = 'block';

        // Save and track
        if (typeof StorageManager !== 'undefined') {
            StorageManager.saveCalculation('bmi', {
                height: heightCm,
                weight: weightKg,
                bmi
            }, bmi);
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('bmi', { height: heightCm, weight: weightKg }, { bmi: bmi.toFixed(1) });
        }

        // Scroll to results
        document.getElementById('bmiResults').scrollIntoView({ behavior: 'smooth' });
    }

    function displayResults(bmi, heightCm, weightKg) {
        document.getElementById('bmiValue').textContent = bmi.toFixed(1);

        const category = getBMICategory(bmi);
        const categoryValue = document.getElementById('categoryValue');
        categoryValue.textContent = category.name;
        categoryValue.className = 'category-value ' + category.class;

        const bmiInfo = document.getElementById('bmiInfo');
        bmiInfo.innerHTML = '<p>' + category.info + '</p>';
    }

    function getBMICategory(bmi) {
        if (bmi < 18.5) {
            return {
                name: 'Underweight',
                class: 'underweight',
                info: 'Your BMI is below the normal range. Consider consulting with a healthcare provider about healthy ways to gain weight.'
            };
        } else if (bmi < 25) {
            return {
                name: 'Normal Weight',
                class: 'normal',
                info: 'Your BMI is in the normal range. Maintain a healthy lifestyle with balanced diet and regular exercise.'
            };
        } else if (bmi < 30) {
            return {
                name: 'Overweight',
                class: 'overweight',
                info: 'Your BMI is above the normal range. Consider lifestyle changes including diet and exercise to reach a healthy weight.'
            };
        } else {
            return {
                name: 'Obese',
                class: 'obese',
                info: 'Your BMI indicates obesity. It is recommended to consult with a healthcare provider for a personalized weight management plan.'
            };
        }
    }

    function updateIndicator(bmi) {
        const indicator = document.getElementById('bmiIndicator');
        if (!indicator) return;

        // Calculate position (BMI range 15-40, mapped to 0-100%)
        let percent = ((bmi - 15) / 25) * 100;
        percent = Math.max(0, Math.min(100, percent));

        indicator.style.left = percent + '%';
    }

    function showHealthyWeightRange(heightCm) {
        const heightM = heightCm / 100;
        const minWeight = 18.5 * heightM * heightM;
        const maxWeight = 24.9 * heightM * heightM;

        const weightRange = document.getElementById('weightRange');
        if (weightRange) {
            weightRange.textContent = 'For your height, a healthy weight range is ' +
                APP.formatNumber(minWeight, 1) + ' kg - ' +
                APP.formatNumber(maxWeight, 1) + ' kg';
        }
    }

    function reset() {
        document.getElementById('heightCm').value = '170';
        document.getElementById('weightKg').value = '70';
        document.getElementById('age').value = '';

        document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
        selectedGender = null;

        document.getElementById('bmiResults').style.display = 'none';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
