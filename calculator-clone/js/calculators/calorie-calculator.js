/**
 * Daily Calorie Requirements Calculator
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
            <div class="calc-input-group"><label>Gender</label><select class="calc-input" id="gender"><option value="male" selected>Male</option><option value="female">Female</option></select></div>
            <div class="calc-input-group"><label>Age (years)</label><input type="number" class="calc-input" id="age" value="30"></div>
            <div class="calc-input-group"><label>Weight (kg)</label><input type="number" class="calc-input" id="weight" value="70"></div>
            <div class="calc-input-group"><label>Height (cm)</label><input type="number" class="calc-input" id="height" value="170"></div>
            <div class="calc-input-group"><label>Activity Level</label><select class="calc-input" id="activity"><option value="1.2">Sedentary (little/no exercise)</option><option value="1.375" selected>Light (1-3 days/week)</option><option value="1.55">Moderate (3-5 days/week)</option><option value="1.725">Active (6-7 days/week)</option><option value="1.9">Very Active (athlete)</option></select></div>
            <div class="calc-input-group"><label>Goal</label><select class="calc-input" id="goal"><option value="0.8">Lose Weight (-20%)</option><option value="0.9">Lose Weight (-10%)</option><option value="1" selected>Maintain Weight</option><option value="1.1">Gain Weight (+10%)</option><option value="1.2">Gain Weight (+20%)</option></select></div>
        `;
    }
    function calculate() {
        const gender = document.getElementById('gender').value;
        const age = parseFloat(document.getElementById('age').value) || 30;
        const weight = parseFloat(document.getElementById('weight').value) || 70;
        const height = parseFloat(document.getElementById('height').value) || 170;
        const activity = parseFloat(document.getElementById('activity').value) || 1.375;
        const goal = parseFloat(document.getElementById('goal').value) || 1;
        let bmr = 0;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        const tdee = bmr * activity;
        const targetCalories = tdee * goal;
        const protein = weight * 2.2;
        const fat = (targetCalories * 0.25) / 9;
        const carbs = (targetCalories - (protein * 4) - (fat * 9)) / 4;
        const r = document.getElementById('results');
        if (r) {
            r.style.display = 'block';
            r.innerHTML = `
                <div class="result-item main-result"><span class="result-label">Daily Calorie Target</span><span class="result-value">${targetCalories.toFixed(0)} kcal</span></div>
                <div class="result-item"><span class="result-label">BMR</span><span class="result-value">${bmr.toFixed(0)} kcal</span></div>
                <div class="result-item"><span class="result-label">TDEE</span><span class="result-value">${tdee.toFixed(0)} kcal</span></div>
                <div class="result-breakdown"><h3>Macros Breakdown</h3>
                    <div class="breakdown-item"><span>Protein:</span><span>${protein.toFixed(0)}g (${((protein * 4 / targetCalories) * 100).toFixed(0)}%)</span></div>
                    <div class="breakdown-item"><span>Carbs:</span><span>${carbs.toFixed(0)}g (${((carbs * 4 / targetCalories) * 100).toFixed(0)}%)</span></div>
                    <div class="breakdown-item"><span>Fats:</span><span>${fat.toFixed(0)}g (${((fat * 9 / targetCalories) * 100).toFixed(0)}%)</span></div>
                </div>
                <div class="result-breakdown"><h3>Summary</h3>
                    <div class="breakdown-item"><span>BMR (Basal Metabolic Rate):</span><span>${bmr.toFixed(0)} kcal</span></div>
                    <div class="breakdown-item"><span>TDEE (Total Daily Energy Expenditure):</span><span>${tdee.toFixed(0)} kcal</span></div>
                    <div class="breakdown-item"><span>Target Calories:</span><span>${targetCalories.toFixed(0)} kcal</span></div>
                    <div class="breakdown-item"><span>Goal:</span><span>${goal < 1 ? 'Weight Loss' : goal > 1 ? 'Weight Gain' : 'Maintenance'}</span></div>
                </div>
            `;
        }
        if (typeof trackCalculation === 'function') trackCalculation('calorie', {tdee, targetCalories}, {});
        if (window.AdManager && window.AdManager.refresh) setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
    }
    function loadAffiliateOffers() { console.log('Loading affiliate offers'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
