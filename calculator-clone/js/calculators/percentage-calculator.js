/**
 * Percentage Calculator
 * High-CPC calculator optimized for revenue
 */

(function() {
    'use strict';

    function init() {
        setupEventListeners();
        createInputFields();
        loadAffiliateOffers();
    }

    function setupEventListeners() {
        const calculateBtn = document.getElementById('calculate');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculate);
        }

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculate();
        });

        // Dynamic calculation mode switching
        document.addEventListener('change', function(e) {
            if (e.target && e.target.id === 'calculationMode') {
                updateInputFields(e.target.value);
            }
        });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="calc-input-group">
                <label>Calculation Type</label>
                <select class="calc-input" id="calculationMode">
                    <option value="basic">What is X% of Y?</option>
                    <option value="percent">What % is X of Y?</option>
                    <option value="whole">X is Y% of what?</option>
                    <option value="increase">Percentage Increase</option>
                    <option value="decrease">Percentage Decrease</option>
                    <option value="change">Percentage Change</option>
                    <option value="difference">Percentage Difference</option>
                </select>
            </div>
            <div class="calc-input-group" id="percentageGroup">
                <label>Percentage (%)</label>
                <input type="number" class="calc-input" id="percentage" placeholder="Enter percentage" value="20" step="0.01">
            </div>
            <div class="calc-input-group" id="numberGroup">
                <label>Number</label>
                <input type="number" class="calc-input" id="number" placeholder="Enter number" value="500" step="0.01">
            </div>
            <div class="calc-input-group" id="value1Group" style="display:none;">
                <label>Value 1 (Original/First)</label>
                <input type="number" class="calc-input" id="value1" placeholder="Original value" value="100" step="0.01">
            </div>
            <div class="calc-input-group" id="value2Group" style="display:none;">
                <label>Value 2 (New/Second)</label>
                <input type="number" class="calc-input" id="value2" placeholder="New value" value="150" step="0.01">
            </div>
            <div class="calc-input-group">
                <label>Context (Optional)</label>
                <select class="calc-input" id="context">
                    <option value="general">General Calculation</option>
                    <option value="salary">Salary/Income</option>
                    <option value="marks">Marks/Grades</option>
                    <option value="price">Price/Cost</option>
                    <option value="discount">Discount/Savings</option>
                    <option value="tax">Tax/Fees</option>
                    <option value="investment">Investment Returns</option>
                    <option value="growth">Business Growth</option>
                </select>
            </div>
        `;
    }

    function updateInputFields(mode) {
        const percentageGroup = document.getElementById('percentageGroup');
        const numberGroup = document.getElementById('numberGroup');
        const value1Group = document.getElementById('value1Group');
        const value2Group = document.getElementById('value2Group');

        if (mode === 'basic' || mode === 'whole') {
            if (percentageGroup) percentageGroup.style.display = 'block';
            if (numberGroup) numberGroup.style.display = 'block';
            if (value1Group) value1Group.style.display = 'none';
            if (value2Group) value2Group.style.display = 'none';
        } else if (mode === 'percent') {
            if (percentageGroup) percentageGroup.style.display = 'none';
            if (numberGroup) numberGroup.style.display = 'block';
            if (value1Group) value1Group.style.display = 'block';
            if (value2Group) value2Group.style.display = 'none';
        } else {
            // increase, decrease, change, difference
            if (percentageGroup) percentageGroup.style.display = 'none';
            if (numberGroup) numberGroup.style.display = 'none';
            if (value1Group) value1Group.style.display = 'block';
            if (value2Group) value2Group.style.display = 'block';
        }
    }

    function calculate() {
        const calculationMode = document.getElementById('calculationMode').value;
        const percentage = parseFloat(document.getElementById('percentage')?.value) || 0;
        const number = parseFloat(document.getElementById('number')?.value) || 0;
        const value1 = parseFloat(document.getElementById('value1')?.value) || 0;
        const value2 = parseFloat(document.getElementById('value2')?.value) || 0;
        const context = document.getElementById('context').value;

        let result = 0;
        let calculationSteps = '';
        let explanation = '';
        let formula = '';

        if (calculationMode === 'basic') {
            // What is X% of Y?
            if (number === 0) {
                alert('Please enter a valid number');
                return;
            }
            result = (percentage / 100) * number;
            formula = `${percentage}% of ${number}`;
            calculationSteps = `(${percentage} / 100) × ${number} = ${result.toFixed(2)}`;
            explanation = `${percentage}% of ${number} is ${result.toFixed(2)}`;
        } else if (calculationMode === 'percent') {
            // What % is X of Y?
            if (number === 0) {
                alert('Please enter valid values');
                return;
            }
            result = (value1 / number) * 100;
            formula = `(${value1} / ${number}) × 100`;
            calculationSteps = `(${value1} / ${number}) × 100 = ${result.toFixed(2)}%`;
            explanation = `${value1} is ${result.toFixed(2)}% of ${number}`;
        } else if (calculationMode === 'whole') {
            // X is Y% of what?
            if (percentage === 0) {
                alert('Please enter a valid percentage');
                return;
            }
            result = (number / percentage) * 100;
            formula = `(${number} / ${percentage}) × 100`;
            calculationSteps = `(${number} / ${percentage}) × 100 = ${result.toFixed(2)}`;
            explanation = `${number} is ${percentage}% of ${result.toFixed(2)}`;
        } else if (calculationMode === 'increase') {
            // Percentage increase
            if (value1 === 0) {
                alert('Please enter valid original value');
                return;
            }
            const increase = value2 - value1;
            result = (increase / value1) * 100;
            formula = `((${value2} - ${value1}) / ${value1}) × 100`;
            calculationSteps = `((${value2} - ${value1}) / ${value1}) × 100 = ${result.toFixed(2)}%`;
            explanation = `Increase from ${value1} to ${value2} is ${result.toFixed(2)}%`;
        } else if (calculationMode === 'decrease') {
            // Percentage decrease
            if (value1 === 0) {
                alert('Please enter valid original value');
                return;
            }
            const decrease = value1 - value2;
            result = (decrease / value1) * 100;
            formula = `((${value1} - ${value2}) / ${value1}) × 100`;
            calculationSteps = `((${value1} - ${value2}) / ${value1}) × 100 = ${result.toFixed(2)}%`;
            explanation = `Decrease from ${value1} to ${value2} is ${result.toFixed(2)}%`;
        } else if (calculationMode === 'change') {
            // Percentage change (positive or negative)
            if (value1 === 0) {
                alert('Please enter valid original value');
                return;
            }
            const change = value2 - value1;
            result = (change / value1) * 100;
            formula = `((${value2} - ${value1}) / ${value1}) × 100`;
            calculationSteps = `((${value2} - ${value1}) / ${value1}) × 100 = ${result.toFixed(2)}%`;
            explanation = `Change from ${value1} to ${value2} is ${result >= 0 ? '+' : ''}${result.toFixed(2)}%`;
        } else if (calculationMode === 'difference') {
            // Percentage difference (absolute)
            if (value1 === 0 || value2 === 0) {
                alert('Please enter valid values');
                return;
            }
            const average = (value1 + value2) / 2;
            const difference = Math.abs(value2 - value1);
            result = (difference / average) * 100;
            formula = `(|${value2} - ${value1}| / ((${value1} + ${value2}) / 2)) × 100`;
            calculationSteps = `(${difference} / ${average}) × 100 = ${result.toFixed(2)}%`;
            explanation = `The percentage difference between ${value1} and ${value2} is ${result.toFixed(2)}%`;
        }

        // Context-specific insights
        const contextInsights = {
            'salary': getContextInsight('salary', calculationMode, result, value1, value2),
            'marks': getContextInsight('marks', calculationMode, result, value1, value2),
            'price': getContextInsight('price', calculationMode, result, value1, value2),
            'discount': getContextInsight('discount', calculationMode, result, value1, value2),
            'tax': getContextInsight('tax', calculationMode, result, value1, value2),
            'investment': getContextInsight('investment', calculationMode, result, value1, value2),
            'growth': getContextInsight('growth', calculationMode, result, value1, value2),
            'general': 'General percentage calculation'
        };

        // Additional calculations based on mode
        let additionalInfo = getAdditionalInfo(calculationMode, percentage, number, value1, value2, result);

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Result</span>
                    <span class="result-value">${formatResult(calculationMode, result)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Explanation</span>
                    <span class="result-value" style="font-size: 0.9em">${explanation}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Calculation Details</h3>
                    <div class="breakdown-item">
                        <span>Formula:</span>
                        <span>${formula}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Calculation Steps:</span>
                        <span>${calculationSteps}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Result:</span>
                        <span style="font-weight: bold; color: #10B981">${formatResult(calculationMode, result)}</span>
                    </div>
                </div>
                ${additionalInfo.html}
                <div class="result-breakdown">
                    <h3>Context: ${context.charAt(0).toUpperCase() + context.slice(1)}</h3>
                    <div class="breakdown-item">
                        <span>Application:</span>
                        <span>${contextInsights[context]}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Quick Reference</h3>
                    <div class="breakdown-item">
                        <span>Type of Calculation:</span>
                        <span>${getCalculationTypeLabel(calculationMode)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Formula Pattern:</span>
                        <span>${getFormulaPattern(calculationMode)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Common Uses:</span>
                        <span>${getCommonUses(calculationMode)}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Percentage Basics</h3>
                    <div class="breakdown-item">
                        <span>What is a Percentage?:</span>
                        <span>A ratio expressed as a fraction of 100</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Symbol:</span>
                        <span>% (percent sign)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Origin:</span>
                        <span>From Latin "per centum" meaning "by the hundred"</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Conversion:</span>
                        <span>Percentage = (Part / Whole) × 100</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        // Track high-value calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('percentage', {
                mode: calculationMode,
                result,
                context
            }, {
                value: 'high-cpc',
                calculationType: calculationMode
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function formatResult(mode, result) {
        if (mode === 'basic' || mode === 'whole') {
            return result.toLocaleString('en-IN', {maximumFractionDigits: 2});
        } else {
            return `${result.toFixed(2)}%`;
        }
    }

    function getCalculationTypeLabel(mode) {
        const labels = {
            'basic': 'Basic Percentage (X% of Y)',
            'percent': 'Percentage Ratio (What % is X of Y)',
            'whole': 'Reverse Percentage (X is Y% of what)',
            'increase': 'Percentage Increase',
            'decrease': 'Percentage Decrease',
            'change': 'Percentage Change',
            'difference': 'Percentage Difference'
        };
        return labels[mode] || 'Percentage Calculation';
    }

    function getFormulaPattern(mode) {
        const patterns = {
            'basic': '(Percentage / 100) × Number',
            'percent': '(Part / Whole) × 100',
            'whole': '(Part / Percentage) × 100',
            'increase': '((New - Old) / Old) × 100',
            'decrease': '((Old - New) / Old) × 100',
            'change': '((New - Old) / Old) × 100',
            'difference': '(|V2 - V1| / Average) × 100'
        };
        return patterns[mode] || 'Standard percentage formula';
    }

    function getCommonUses(mode) {
        const uses = {
            'basic': 'Discounts, tips, tax calculation, commission',
            'percent': 'Grades, test scores, efficiency, completion rate',
            'whole': 'Finding original price, base salary, total marks',
            'increase': 'Salary hikes, price increases, growth rates',
            'decrease': 'Discounts, depreciation, loss calculation',
            'change': 'Stock markets, economic indicators, YoY growth',
            'difference': 'Comparing two values, variance analysis'
        };
        return uses[mode] || 'General percentage calculations';
    }

    function getContextInsight(context, mode, result, val1, val2) {
        const insights = {
            'salary': {
                'increase': `${result.toFixed(2)}% salary hike from ₹${val1.toLocaleString('en-IN')} to ₹${val2.toLocaleString('en-IN')}`,
                'basic': 'Calculate bonus, increment, or deduction',
                'default': 'Useful for salary negotiations and increment calculations'
            },
            'marks': {
                'percent': `Scored ${result.toFixed(2)}% - ${result >= 90 ? 'Outstanding!' : result >= 75 ? 'Distinction' : result >= 60 ? 'First Class' : result >= 50 ? 'Second Class' : result >= 40 ? 'Pass' : 'Need improvement'}`,
                'default': 'Grade calculation and academic performance analysis'
            },
            'price': {
                'increase': `Price increased by ${result.toFixed(2)}% from ₹${val1.toLocaleString('en-IN')} to ₹${val2.toLocaleString('en-IN')}`,
                'decrease': `Price reduced by ${result.toFixed(2)}% from ₹${val1.toLocaleString('en-IN')} to ₹${val2.toLocaleString('en-IN')}`,
                'default': 'Price comparison and market analysis'
            },
            'discount': {
                'basic': `Discount amount or savings calculation`,
                'decrease': `${result.toFixed(2)}% discount saves you ₹${(val1 - val2).toLocaleString('en-IN')}`,
                'default': 'Shopping discounts and offers analysis'
            },
            'tax': {
                'basic': 'Tax amount calculation (GST, Income Tax)',
                'default': 'Tax planning and compliance calculations'
            },
            'investment': {
                'increase': `${result.toFixed(2)}% return on investment - ${result >= 15 ? 'Excellent returns!' : result >= 10 ? 'Good returns' : result >= 5 ? 'Moderate returns' : 'Low returns'}`,
                'default': 'ROI and investment performance tracking'
            },
            'growth': {
                'increase': `${result.toFixed(2)}% business growth - ${result >= 50 ? 'Exceptional!' : result >= 30 ? 'Strong growth' : result >= 15 ? 'Healthy growth' : result >= 5 ? 'Steady growth' : 'Slow growth'}`,
                'default': 'Business metrics and KPI tracking'
            }
        };

        return insights[context]?.[mode] || insights[context]?.['default'] || 'General percentage application';
    }

    function getAdditionalInfo(mode, percentage, number, value1, value2, result) {
        let html = '';

        if (mode === 'basic') {
            const remaining = number - result;
            const remainingPercent = 100 - percentage;
            html = `
                <div class="result-breakdown">
                    <h3>Additional Information</h3>
                    <div class="breakdown-item">
                        <span>Total Number:</span>
                        <span>${number.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>${percentage}% of ${number}:</span>
                        <span style="color: #10B981">${result.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Remaining ${remainingPercent}%:</span>
                        <span>${remaining.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>As Decimal:</span>
                        <span>${(percentage / 100).toFixed(4)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>As Fraction:</span>
                        <span>${percentage}/100 (simplified: ${simplifyFraction(percentage, 100)})</span>
                    </div>
                </div>
            `;
        } else if (mode === 'increase' || mode === 'decrease' || mode === 'change') {
            const absoluteChange = Math.abs(value2 - value1);
            const multiplier = value2 / value1;
            html = `
                <div class="result-breakdown">
                    <h3>Change Analysis</h3>
                    <div class="breakdown-item">
                        <span>Original Value:</span>
                        <span>${value1.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>New Value:</span>
                        <span>${value2.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Absolute Change:</span>
                        <span style="color: ${value2 > value1 ? '#10B981' : '#EF4444'}">${value2 > value1 ? '+' : '-'}${absoluteChange.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Percentage Change:</span>
                        <span style="color: ${result >= 0 ? '#10B981' : '#EF4444'}">${result >= 0 ? '+' : ''}${result.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Growth Multiplier:</span>
                        <span>${multiplier.toFixed(2)}x</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Direction:</span>
                        <span>${value2 > value1 ? '📈 Upward' : value2 < value1 ? '📉 Downward' : '➡️ No change'}</span>
                    </div>
                </div>
            `;
        }

        return { html };
    }

    function simplifyFraction(numerator, denominator) {
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        const divisor = gcd(numerator, denominator);
        const simplified = `${numerator / divisor}/${denominator / divisor}`;
        return simplified === `${numerator}/${denominator}` ? 'already simplified' : simplified;
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for percentage calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
