/**
 * Enhanced BMI Calculator - Calculator.net Style
 * Features: Visual BMI scale, unit tabs, color-coded results, save functionality
 */

(function() {
    'use strict';

    let unitSystem = 'metric';

    function init() {
        createCalculatorInterface();
        setupEventListeners();
    }

    function createCalculatorInterface() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <!-- Unit System Tabs -->
            <div class="unit-tabs">
                <button class="unit-tab active" data-unit="metric">
                    <span class="tab-icon">📏</span>
                    <span class="tab-label">Metric Units</span>
                </button>
                <button class="unit-tab" data-unit="imperial">
                    <span class="tab-icon">📐</span>
                    <span class="tab-label">US Units</span>
                </button>
            </div>

            <!-- Input Form -->
            <div class="bmi-form">
                <!-- Age Input -->
                <div class="calc-input-group">
                    <label for="age">Age (2-120)</label>
                    <input type="number" class="calc-input" id="age" placeholder="25" min="2" max="120" value="25">
                </div>

                <!-- Gender Selection -->
                <div class="calc-input-group">
                    <label>Gender</label>
                    <div class="gender-selector">
                        <button type="button" class="gender-btn active" data-gender="male">
                            <span class="gender-icon">👨</span>
                            <span>Male</span>
                        </button>
                        <button type="button" class="gender-btn" data-gender="female">
                            <span class="gender-icon">👩</span>
                            <span>Female</span>
                        </button>
                    </div>
                </div>

                <!-- Metric Inputs -->
                <div id="metricInputs" class="unit-inputs">
                    <div class="input-row">
                        <div class="calc-input-group">
                            <label for="heightCm">Height (cm)</label>
                            <div class="input-with-suffix">
                                <input type="number" class="calc-input" id="heightCm" placeholder="170" step="0.1" value="170">
                                <span class="input-suffix">cm</span>
                            </div>
                        </div>
                        <div class="calc-input-group">
                            <label for="weightKg">Weight (kg)</label>
                            <div class="input-with-suffix">
                                <input type="number" class="calc-input" id="weightKg" placeholder="70" step="0.1" value="70">
                                <span class="input-suffix">kg</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Imperial Inputs -->
                <div id="imperialInputs" class="unit-inputs" style="display: none;">
                    <div class="input-row">
                        <div class="calc-input-group">
                            <label for="heightFt">Height</label>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                                <div class="input-with-suffix">
                                    <input type="number" class="calc-input" id="heightFt" placeholder="5" min="0" value="5">
                                    <span class="input-suffix">ft</span>
                                </div>
                                <div class="input-with-suffix">
                                    <input type="number" class="calc-input" id="heightIn" placeholder="7" min="0" max="11" value="7">
                                    <span class="input-suffix">in</span>
                                </div>
                            </div>
                        </div>
                        <div class="calc-input-group">
                            <label for="weightLbs">Weight</label>
                            <div class="input-with-suffix">
                                <input type="number" class="calc-input" id="weightLbs" placeholder="154" step="0.1" value="154">
                                <span class="input-suffix">lbs</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="calc-actions">
                    <button type="button" class="btn btn-primary btn-large" id="calculateBMI">
                        <span>Calculate BMI</span>
                    </button>
                    <button type="button" class="btn btn-secondary" id="resetBMI">
                        <span>Reset</span>
                    </button>
                </div>
            </div>

            <style>
                /* Unit Tabs */
                .unit-tabs {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                    margin-bottom: 2rem;
                    background: #f3f4f6;
                    padding: 0.25rem;
                    border-radius: 10px;
                }

                .unit-tab {
                    padding: 1rem;
                    background: transparent;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    font-weight: 500;
                    color: #6b7280;
                }

                .unit-tab.active {
                    background: white;
                    color: #0B87BB;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .tab-icon {
                    font-size: 1.2rem;
                }

                .tab-label {
                    font-size: 0.95rem;
                }

                /* Gender Selector */
                .gender-selector {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .gender-btn {
                    padding: 1rem;
                    background: white;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 500;
                    color: #4b5563;
                }

                .gender-btn:hover {
                    border-color: #0B87BB;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(11, 135, 187, 0.2);
                }

                .gender-btn.active {
                    background: linear-gradient(135deg, #0B87BB 0%, #0891b2 100%);
                    border-color: #0B87BB;
                    color: white;
                }

                .gender-icon {
                    font-size: 2rem;
                }

                /* Input Row */
                .input-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                /* Action Buttons */
                .calc-actions {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .btn {
                    padding: 1rem 2rem;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #0B87BB 0%, #0891b2 100%);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(11, 135, 187, 0.4);
                }

                .btn-secondary {
                    background: #f3f4f6;
                    color: #4b5563;
                }

                .btn-secondary:hover {
                    background: #e5e7eb;
                }

                .btn-large {
                    font-size: 1.1rem;
                    padding: 1.2rem 2rem;
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .input-row,
                    .gender-selector {
                        grid-template-columns: 1fr;
                    }

                    .calc-actions {
                        grid-template-columns: 1fr;
                    }

                    .unit-tab {
                        flex-direction: column;
                        padding: 0.75rem;
                    }
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
        // Unit tab switching
        document.querySelectorAll('.unit-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                unitSystem = this.dataset.unit;

                document.querySelectorAll('.unit-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');

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
            btn.addEventListener('click', function() {
                document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Calculate button
        const calculateBtn = document.getElementById('calculateBMI');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculate);
        }

        // Reset button
        const resetBtn = document.getElementById('resetBMI');
        if (resetBtn) {
            resetBtn.addEventListener('click', reset);
        }

        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('calc-input')) {
                calculate();
            }
        });
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

        const age = parseInt(document.getElementById('age')?.value || 25);

        if (heightCm <= 0 || weightKg <= 0) {
            alert('Please enter valid height and weight values');
            return;
        }

        if (age < 2 || age > 120) {
            alert('Please enter a valid age between 2 and 120');
            return;
        }

        const heightM = heightCm / 100;
        const bmi = weightKg / (heightM * heightM);

        displayResults(bmi, heightCm, weightKg, age);

        // Track calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('bmi', { bmi: bmi.toFixed(1) }, {
                height: heightCm,
                weight: weightKg,
                age: age
            });
        }
    }

    function displayResults(bmi, heightCm, weightKg, age) {
        const category = getBMICategory(bmi);
        const resultsDiv = document.getElementById('results');

        if (!resultsDiv) return;

        // Calculate healthy weight range
        const heightM = heightCm / 100;
        const minWeight = 18.5 * heightM * heightM;
        const maxWeight = 24.9 * heightM * heightM;

        // Calculate BMI Prime (BMI / 25)
        const bmiPrime = (bmi / 25).toFixed(2);

        // Calculate Ponderal Index (weight / height³)
        const ponderalIndex = (weightKg / Math.pow(heightM, 3)).toFixed(1);

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <!-- Main BMI Result Card -->
            <div class="bmi-result-card ${category.class}">
                <div class="bmi-value-section">
                    <div class="bmi-label">Your BMI</div>
                    <div class="bmi-value">${bmi.toFixed(1)}</div>
                    <div class="bmi-unit">kg/m²</div>
                </div>
                <div class="bmi-status-section">
                    <div class="status-badge ${category.class}">
                        <span class="status-icon">${category.icon}</span>
                        <span class="status-text">${category.name}</span>
                    </div>
                    <div class="status-description">${category.info}</div>
                </div>
            </div>

            <!-- Visual BMI Scale -->
            <div class="bmi-scale-container">
                <h3 style="margin-bottom: 1rem; color: #1f2937;">BMI Scale</h3>
                <div class="bmi-scale">
                    <div class="scale-bar">
                        <div class="scale-segment underweight" style="width: 23.5%;">
                            <span class="scale-label">Underweight</span>
                            <span class="scale-range">&lt;18.5</span>
                        </div>
                        <div class="scale-segment normal" style="width: 26%;">
                            <span class="scale-label">Normal</span>
                            <span class="scale-range">18.5-25</span>
                        </div>
                        <div class="scale-segment overweight" style="width: 20%;">
                            <span class="scale-label">Overweight</span>
                            <span class="scale-range">25-30</span>
                        </div>
                        <div class="scale-segment obese" style="width: 30.5%;">
                            <span class="scale-label">Obese</span>
                            <span class="scale-range">&gt;30</span>
                        </div>
                    </div>
                    <div class="bmi-indicator" style="left: ${getBMIPosition(bmi)}%;">
                        <div class="indicator-arrow">▼</div>
                        <div class="indicator-value">${bmi.toFixed(1)}</div>
                    </div>
                </div>
            </div>

            <!-- Additional Metrics -->
            <div class="result-breakdown">
                <h3>📊 Additional Metrics</h3>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-label">Healthy BMI Range</div>
                        <div class="metric-value">18.5 - 25 kg/m²</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Healthy Weight Range</div>
                        <div class="metric-value">${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} kg</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">BMI Prime</div>
                        <div class="metric-value">${bmiPrime}</div>
                        <div class="metric-note">Optimal: 0.74 - 1.00</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Ponderal Index</div>
                        <div class="metric-value">${ponderalIndex}</div>
                        <div class="metric-note">Weight/Height³ ratio</div>
                    </div>
                </div>
            </div>

            <!-- Health Recommendations -->
            ${getHealthRecommendations(bmi, category)}

            <!-- Disclaimer -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1.5rem; margin-top: 2rem; border-radius: 8px;">
                <p style="margin: 0; color: #92400e; font-size: 0.95rem; line-height: 1.6;">
                    <strong>⚠️ Important:</strong> BMI is a screening tool and does not diagnose body fatness or health.
                    Factors like muscle mass, bone density, and overall body composition are not considered.
                    For ages 2-20, please refer to BMI-for-age percentile charts. Always consult with a healthcare
                    professional for personalized medical advice.
                </p>
            </div>

            <style>
                /* BMI Result Card */
                .bmi-result-card {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    gap: 2rem;
                    background: white;
                    border-radius: 12px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    border-left: 6px solid;
                    border-left-color: var(--status-color, #6b7280);
                }

                .bmi-result-card.underweight {
                    --status-color: #3b82f6;
                }

                .bmi-result-card.normal {
                    --status-color: #10b981;
                }

                .bmi-result-card.overweight {
                    --status-color: #f59e0b;
                }

                .bmi-result-card.obese {
                    --status-color: #ef4444;
                }

                .bmi-value-section {
                    text-align: center;
                    padding: 1rem;
                    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
                    border-radius: 12px;
                }

                .bmi-label {
                    font-size: 0.9rem;
                    color: #6b7280;
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .bmi-value {
                    font-size: 3.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    line-height: 1;
                    margin: 0.5rem 0;
                }

                .bmi-unit {
                    font-size: 1rem;
                    color: #6b7280;
                }

                .bmi-status-section {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1.5rem;
                    border-radius: 50px;
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    width: fit-content;
                }

                .status-badge.underweight {
                    background: #dbeafe;
                    color: #1e40af;
                }

                .status-badge.normal {
                    background: #d1fae5;
                    color: #065f46;
                }

                .status-badge.overweight {
                    background: #fef3c7;
                    color: #92400e;
                }

                .status-badge.obese {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .status-icon {
                    font-size: 1.5rem;
                }

                .status-description {
                    color: #4b5563;
                    line-height: 1.6;
                    font-size: 0.95rem;
                }

                /* BMI Scale */
                .bmi-scale-container {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .bmi-scale {
                    position: relative;
                    margin-top: 1rem;
                }

                .scale-bar {
                    display: flex;
                    height: 60px;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .scale-segment {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 0.5rem;
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .scale-segment.underweight {
                    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
                }

                .scale-segment.normal {
                    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
                }

                .scale-segment.overweight {
                    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
                }

                .scale-segment.obese {
                    background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
                }

                .scale-label {
                    font-size: 0.8rem;
                    margin-bottom: 0.25rem;
                }

                .scale-range {
                    font-size: 0.7rem;
                    opacity: 0.9;
                }

                .bmi-indicator {
                    position: absolute;
                    top: -30px;
                    transform: translateX(-50%);
                    text-align: center;
                }

                .indicator-arrow {
                    font-size: 1.5rem;
                    color: #1f2937;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .indicator-value {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: #1f2937;
                    background: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 6px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    margin-top: 0.25rem;
                }

                /* Metrics Grid */
                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .metric-card {
                    background: #f9fafb;
                    padding: 1.25rem;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }

                .metric-label {
                    font-size: 0.85rem;
                    color: #6b7280;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }

                .metric-value {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 0.25rem;
                }

                .metric-note {
                    font-size: 0.75rem;
                    color: #9ca3af;
                    margin-top: 0.25rem;
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .bmi-result-card {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }

                    .bmi-value {
                        font-size: 2.5rem;
                    }

                    .scale-label,
                    .scale-range {
                        font-size: 0.65rem;
                    }

                    .metrics-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;

        // Scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function getBMICategory(bmi) {
        if (bmi < 18.5) {
            return {
                name: 'Underweight',
                class: 'underweight',
                icon: '📉',
                info: 'Your BMI is below the normal range. This may indicate insufficient body weight. Consider consulting a healthcare provider about healthy weight gain strategies.'
            };
        } else if (bmi < 25) {
            return {
                name: 'Normal Weight',
                class: 'normal',
                icon: '✅',
                info: 'Your BMI is within the healthy range. Maintain your current lifestyle with balanced nutrition and regular physical activity.'
            };
        } else if (bmi < 30) {
            return {
                name: 'Overweight',
                class: 'overweight',
                icon: '⚠️',
                info: 'Your BMI is above the normal range. Consider lifestyle modifications including diet improvements and increased physical activity to reach a healthier weight.'
            };
        } else {
            return {
                name: 'Obese',
                class: 'obese',
                icon: '🔴',
                info: 'Your BMI indicates obesity, which may increase health risks. It is strongly recommended to consult with a healthcare provider for a comprehensive health evaluation and personalized weight management plan.'
            };
        }
    }

    function getBMIPosition(bmi) {
        // Map BMI to position on scale (15-40 range)
        const minBMI = 15;
        const maxBMI = 40;
        let position = ((bmi - minBMI) / (maxBMI - minBMI)) * 100;
        return Math.max(2, Math.min(98, position));
    }

    function getHealthRecommendations(bmi, category) {
        const recommendations = {
            underweight: [
                'Increase calorie intake with nutrient-dense foods',
                'Include protein-rich foods in every meal',
                'Consider strength training to build muscle mass',
                'Consult with a dietitian for a personalized meal plan'
            ],
            normal: [
                'Maintain balanced diet with variety of nutrients',
                'Aim for 150+ minutes of moderate exercise weekly',
                'Stay hydrated with 8+ glasses of water daily',
                'Get regular health check-ups and screenings'
            ],
            overweight: [
                'Create a moderate calorie deficit (300-500 cal/day)',
                'Increase physical activity to 200+ minutes weekly',
                'Focus on whole foods and reduce processed items',
                'Track your food intake and exercise regularly'
            ],
            obese: [
                'Consult healthcare provider before starting any program',
                'Consider working with registered dietitian',
                'Start with low-impact exercises like walking or swimming',
                'Set realistic, gradual weight loss goals (0.5-1 kg/week)'
            ]
        };

        const tips = recommendations[category.class] || recommendations.normal;

        return `
            <div class="result-breakdown">
                <h3>💡 Health Recommendations</h3>
                <ul style="list-style: none; padding: 0; margin: 1rem 0;">
                    ${tips.map(tip => `
                        <li style="padding: 0.75rem; background: #f9fafb; margin-bottom: 0.5rem; border-radius: 6px; border-left: 3px solid #0B87BB;">
                            ${tip}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    function reset() {
        if (unitSystem === 'metric') {
            document.getElementById('heightCm').value = '170';
            document.getElementById('weightKg').value = '70';
        } else {
            document.getElementById('heightFt').value = '5';
            document.getElementById('heightIn').value = '7';
            document.getElementById('weightLbs').value = '154';
        }
        document.getElementById('age').value = '25';

        // Reset gender selection
        document.querySelectorAll('.gender-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.gender === 'male') {
                btn.classList.add('active');
            }
        });

        // Hide results
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'none';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
