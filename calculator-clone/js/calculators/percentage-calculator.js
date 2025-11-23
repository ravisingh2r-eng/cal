/**
 * Enhanced Percentage Calculator - Modern Design
 * Features: Multiple calculation modes, visual percentage representation
 */

(function() {
    'use strict';

    let calcMode = 'basic';

    function init() {
        createCalculatorInterface();
        setupEventListeners();
    }

    function createCalculatorInterface() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="percentage-calculator-container">
                <!-- Calculation Mode Selection -->
                <div class="calc-input-group">
                    <label for="calculationMode">Calculation Type</label>
                    <select class="calc-input calc-mode-select" id="calculationMode">
                        <option value="basic">What is X% of Y?</option>
                        <option value="percent">What % is X of Y?</option>
                        <option value="whole">X is Y% of what?</option>
                        <option value="increase">Percentage Increase</option>
                        <option value="decrease">Percentage Decrease</option>
                        <option value="change">Percentage Change</option>
                        <option value="difference">Percentage Difference</option>
                    </select>
                </div>

                <!-- Input Fields (Dynamic based on mode) -->
                <div id="inputFields"></div>

                <!-- Calculate Button -->
                <button type="button" class="btn btn-primary btn-large" id="calculateBtn">
                    <span>Calculate</span>
                </button>
            </div>

            <style>
                .percentage-calculator-container {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .calc-mode-select {
                    font-weight: 500;
                    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
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
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
                }
            </style>
        `;

        // Hide default calculate button
        const defaultBtn = document.getElementById('calculate');
        if (defaultBtn) {
            defaultBtn.style.display = 'none';
        }

        updateInputFields('basic');
    }

    function setupEventListeners() {
        // Mode change
        document.getElementById('calculationMode')?.addEventListener('change', function() {
            calcMode = this.value;
            updateInputFields(calcMode);
        });

        // Calculate button
        document.getElementById('calculateBtn')?.addEventListener('click', calculate);

        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('calc-input')) {
                calculate();
            }
        });
    }

    function updateInputFields(mode) {
        const container = document.getElementById('inputFields');
        if (!container) return;

        let html = '';

        switch(mode) {
            case 'basic':
                html = `
                    <div class="calc-input-group">
                        <label for="percentage">Percentage (%)</label>
                        <input type="number" class="calc-input" id="percentage" placeholder="e.g., 20" value="20" step="0.01">
                    </div>
                    <div class="calc-input-group">
                        <label for="number">Number</label>
                        <input type="number" class="calc-input" id="number" placeholder="e.g., 500" value="500" step="0.01">
                    </div>
                `;
                break;
            case 'percent':
                html = `
                    <div class="calc-input-group">
                        <label for="part">Part (X)</label>
                        <input type="number" class="calc-input" id="part" placeholder="e.g., 25" value="25" step="0.01">
                    </div>
                    <div class="calc-input-group">
                        <label for="whole">Whole (Y)</label>
                        <input type="number" class="calc-input" id="whole" placeholder="e.g., 100" value="100" step="0.01">
                    </div>
                `;
                break;
            case 'whole':
                html = `
                    <div class="calc-input-group">
                        <label for="part">Part (X)</label>
                        <input type="number" class="calc-input" id="part" placeholder="e.g., 30" value="30" step="0.01">
                    </div>
                    <div class="calc-input-group">
                        <label for="percentage">Percentage (Y%)</label>
                        <input type="number" class="calc-input" id="percentage" placeholder="e.g., 15" value="15" step="0.01">
                    </div>
                `;
                break;
            case 'increase':
            case 'decrease':
            case 'change':
                html = `
                    <div class="calc-input-group">
                        <label for="original">Original Value</label>
                        <input type="number" class="calc-input" id="original" placeholder="e.g., 200" value="200" step="0.01">
                    </div>
                    <div class="calc-input-group">
                        <label for="new">New Value</label>
                        <input type="number" class="calc-input" id="new" placeholder="e.g., 250" value="250" step="0.01">
                    </div>
                `;
                break;
            case 'difference':
                html = `
                    <div class="calc-input-group">
                        <label for="value1">First Value</label>
                        <input type="number" class="calc-input" id="value1" placeholder="e.g., 150" value="150" step="0.01">
                    </div>
                    <div class="calc-input-group">
                        <label for="value2">Second Value</label>
                        <input type="number" class="calc-input" id="value2" placeholder="e.g., 200" value="200" step="0.01">
                    </div>
                `;
                break;
        }

        container.innerHTML = html;
    }

    function calculate() {
        let result, explanation;

        switch(calcMode) {
            case 'basic':
                result = calculateBasic();
                break;
            case 'percent':
                result = calculatePercent();
                break;
            case 'whole':
                result = calculateWhole();
                break;
            case 'increase':
                result = calculateIncrease();
                break;
            case 'decrease':
                result = calculateDecrease();
                break;
            case 'change':
                result = calculateChange();
                break;
            case 'difference':
                result = calculateDifference();
                break;
        }

        if (result) {
            displayResults(result);
        }

        // Track calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('percentage', { mode: calcMode, result: result.value }, {});
        }
    }

    function calculateBasic() {
        const percentage = parseFloat(document.getElementById('percentage')?.value || 0);
        const number = parseFloat(document.getElementById('number')?.value || 0);

        if (percentage < 0 || number < 0) {
            alert('Please enter valid positive numbers');
            return null;
        }

        const value = (percentage / 100) * number;

        return {
            value: value,
            formula: `${percentage}% of ${number} = (${percentage}/100) × ${number}`,
            explanation: `${percentage}% of ${number} is ${value.toFixed(2)}`,
            inputs: { percentage, number },
            visualPercent: percentage
        };
    }

    function calculatePercent() {
        const part = parseFloat(document.getElementById('part')?.value || 0);
        const whole = parseFloat(document.getElementById('whole')?.value || 0);

        if (whole === 0) {
            alert('Whole number cannot be zero');
            return null;
        }

        const percentage = (part / whole) * 100;

        return {
            value: percentage,
            formula: `(${part}/${whole}) × 100`,
            explanation: `${part} is ${percentage.toFixed(2)}% of ${whole}`,
            inputs: { part, whole },
            visualPercent: Math.min(percentage, 100)
        };
    }

    function calculateWhole() {
        const part = parseFloat(document.getElementById('part')?.value || 0);
        const percentage = parseFloat(document.getElementById('percentage')?.value || 0);

        if (percentage === 0) {
            alert('Percentage cannot be zero');
            return null;
        }

        const whole = (part * 100) / percentage;

        return {
            value: whole,
            formula: `(${part} × 100) / ${percentage}`,
            explanation: `${part} is ${percentage}% of ${whole.toFixed(2)}`,
            inputs: { part, percentage },
            visualPercent: percentage
        };
    }

    function calculateIncrease() {
        const original = parseFloat(document.getElementById('original')?.value || 0);
        const newValue = parseFloat(document.getElementById('new')?.value || 0);

        if (original === 0) {
            alert('Original value cannot be zero');
            return null;
        }

        const increase = newValue - original;
        const percentIncrease = (increase / original) * 100;

        return {
            value: percentIncrease,
            formula: `((${newValue} - ${original}) / ${original}) × 100`,
            explanation: `Increase from ${original} to ${newValue} is ${percentIncrease.toFixed(2)}%`,
            inputs: { original, new: newValue, increase },
            visualPercent: Math.abs(percentIncrease)
        };
    }

    function calculateDecrease() {
        const original = parseFloat(document.getElementById('original')?.value || 0);
        const newValue = parseFloat(document.getElementById('new')?.value || 0);

        if (original === 0) {
            alert('Original value cannot be zero');
            return null;
        }

        const decrease = original - newValue;
        const percentDecrease = (decrease / original) * 100;

        return {
            value: percentDecrease,
            formula: `((${original} - ${newValue}) / ${original}) × 100`,
            explanation: `Decrease from ${original} to ${newValue} is ${percentDecrease.toFixed(2)}%`,
            inputs: { original, new: newValue, decrease },
            visualPercent: Math.abs(percentDecrease)
        };
    }

    function calculateChange() {
        const original = parseFloat(document.getElementById('original')?.value || 0);
        const newValue = parseFloat(document.getElementById('new')?.value || 0);

        if (original === 0) {
            alert('Original value cannot be zero');
            return null;
        }

        const change = newValue - original;
        const percentChange = (change / original) * 100;
        const isIncrease = change > 0;

        return {
            value: percentChange,
            formula: `((${newValue} - ${original}) / ${original}) × 100`,
            explanation: `${isIncrease ? 'Increase' : 'Decrease'} from ${original} to ${newValue} is ${Math.abs(percentChange).toFixed(2)}%`,
            inputs: { original, new: newValue, change },
            visualPercent: Math.abs(percentChange),
            isIncrease
        };
    }

    function calculateDifference() {
        const value1 = parseFloat(document.getElementById('value1')?.value || 0);
        const value2 = parseFloat(document.getElementById('value2')?.value || 0);

        const average = (value1 + value2) / 2;
        if (average === 0) {
            alert('Average cannot be zero');
            return null;
        }

        const difference = Math.abs(value1 - value2);
        const percentDifference = (difference / average) * 100;

        return {
            value: percentDifference,
            formula: `(|${value1} - ${value2}| / ((${value1} + ${value2})/2)) × 100`,
            explanation: `Percentage difference between ${value1} and ${value2} is ${percentDifference.toFixed(2)}%`,
            inputs: { value1, value2, difference, average },
            visualPercent: Math.min(percentDifference, 100)
        };
    }

    function displayResults(data) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <!-- Main Result Card -->
            <div class="percentage-result-card">
                <div class="result-icon">📊</div>
                <div class="result-content">
                    <div class="result-label">Result</div>
                    <div class="result-value">${data.value.toFixed(2)}${calcMode === 'basic' ? '' : '%'}</div>
                </div>
            </div>

            <!-- Visual Percentage Bar -->
            ${generatePercentageBar(data.visualPercent)}

            <!-- Calculation Details -->
            <div class="result-breakdown">
                <h3>📐 Calculation Details</h3>
                <div class="details-grid">
                    <div class="detail-row">
                        <span>Formula:</span>
                        <span style="font-weight: 600; font-family: monospace;">${data.formula}</span>
                    </div>
                    <div class="detail-row">
                        <span>Explanation:</span>
                        <span style="font-weight: 600;">${data.explanation}</span>
                    </div>
                </div>
            </div>

            <!-- Input Breakdown -->
            ${generateInputBreakdown(data.inputs)}

            <style>
                .percentage-result-card {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: white;
                    border-radius: 16px;
                    padding: 2.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                }

                .result-icon {
                    font-size: 4rem;
                }

                .result-content {
                    text-align: center;
                }

                .result-label {
                    font-size: 1rem;
                    opacity: 0.9;
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .result-value {
                    font-size: 3.5rem;
                    font-weight: 700;
                    line-height: 1;
                }

                .percentage-bar-container {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .percentage-bar-container h3 {
                    margin-bottom: 1.5rem;
                    color: #1f2937;
                }

                .percentage-visual-bar {
                    height: 60px;
                    background: #f3f4f6;
                    border-radius: 30px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .percentage-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding-right: 1.5rem;
                    transition: width 1s ease;
                }

                .percentage-fill-label {
                    color: white;
                    font-weight: 700;
                    font-size: 1.1rem;
                }

                .input-breakdown-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .input-breakdown-card {
                    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
                    padding: 1.25rem;
                    border-radius: 10px;
                    border: 2px solid #e5e7eb;
                    text-align: center;
                }

                .input-breakdown-label {
                    font-size: 0.85rem;
                    color: #6b7280;
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .input-breakdown-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #f59e0b;
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
                    padding: 1rem;
                    background: #f9fafb;
                    border-radius: 6px;
                    gap: 1rem;
                }

                @media (max-width: 768px) {
                    .percentage-result-card {
                        flex-direction: column;
                        gap: 1rem;
                        padding: 2rem;
                    }

                    .result-value {
                        font-size: 2.5rem;
                    }

                    .detail-row {
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .input-breakdown-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;

        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function generatePercentageBar(percent) {
        const displayPercent = Math.min(Math.abs(percent), 100);

        return `
            <div class="percentage-bar-container">
                <h3>📊 Visual Representation</h3>
                <div class="percentage-visual-bar">
                    <div class="percentage-fill" style="width: ${displayPercent}%;">
                        <span class="percentage-fill-label">${percent.toFixed(1)}%</span>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.85rem; color: #6b7280;">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                </div>
            </div>
        `;
    }

    function generateInputBreakdown(inputs) {
        let html = '<div class="result-breakdown"><h3>📋 Input Values</h3><div class="input-breakdown-grid">';

        for (const [key, value] of Object.entries(inputs)) {
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            html += `
                <div class="input-breakdown-card">
                    <div class="input-breakdown-label">${label}</div>
                    <div class="input-breakdown-value">${value.toFixed(2)}</div>
                </div>
            `;
        }

        html += '</div></div>';
        return html;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
