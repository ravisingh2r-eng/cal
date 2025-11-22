/**
 * Time Converter
 * Convert between different time units
 */

(function() {
    'use strict';

    const conversions = {
        'seconds': { name: 'Seconds', factor: 1 },
        'minutes': { name: 'Minutes', factor: 1/60 },
        'hours': { name: 'Hours', factor: 1/3600 },
        'days': { name: 'Days', factor: 1/86400 },
        'weeks': { name: 'Weeks', factor: 1/604800 },
        'months': { name: 'Months (30 days)', factor: 1/2592000 },
        'years': { name: 'Years (365 days)', factor: 1/31536000 },
        'milliseconds': { name: 'Milliseconds', factor: 1000 }
    };

    function init() {
        setupEventListeners();
        createInputFields();
    }

    function setupEventListeners() {
        const calculateBtn = document.getElementById('calculate');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculate);
        }

        document.addEventListener('input', (e) => {
            if (e.target.matches('#value, #fromUnit, #toUnit')) {
                calculate();
            }
        });

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculate();
        });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        let optionsHTML = '';
        for (const [key, value] of Object.entries(conversions)) {
            optionsHTML += `<option value="${key}">${value.name}</option>`;
        }

        container.innerHTML = `
            <div class="input-group">
                <label for="value">Value</label>
                <input type="number" id="value" placeholder="Enter time value" step="any" value="60">
            </div>

            <div class="input-group">
                <label for="fromUnit">From Unit</label>
                <select id="fromUnit">
                    ${optionsHTML.replace('value="seconds"', 'value="minutes"')}
                </select>
            </div>

            <div class="input-group">
                <label for="toUnit">To Unit</label>
                <select id="toUnit">
                    ${optionsHTML}
                </select>
            </div>
        `;

        // Set defaults
        document.getElementById('fromUnit').value = 'minutes';
        document.getElementById('toUnit').value = 'seconds';
    }

    function calculate() {
        const value = parseFloat(document.getElementById('value').value);
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;

        if (isNaN(value)) {
            return;
        }

        // Convert to seconds first (base unit)
        const valueInSeconds = value / conversions[fromUnit].factor;
        
        // Convert from seconds to target unit
        const result = valueInSeconds * conversions[toUnit].factor;

        // Get all conversions
        const allConversions = {};
        for (const [key, conv] of Object.entries(conversions)) {
            allConversions[key] = {
                name: conv.name,
                value: valueInSeconds * conv.factor
            };
        }

        displayResults(value, fromUnit, result, toUnit, allConversions);

        if (typeof trackCalculation === 'function') {
            trackCalculation('time', { value, fromUnit, toUnit }, { result });
        }

        setTimeout(() => {
            if (typeof AdManager !== 'undefined' && AdManager.refresh) {
                AdManager.refresh();
            }
        }, 2000);
    }

    function displayResults(inputValue, fromUnit, result, toUnit, allConv) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        let allConversionsHTML = '';
        for (const [key, conv] of Object.entries(allConv)) {
            const isHighlight = key === toUnit;
            allConversionsHTML += `
                <div class="result-item ${isHighlight ? 'highlight' : ''}">
                    <span class="result-label">${conv.name}</span>
                    <span class="result-value">${conv.value.toLocaleString('en-IN', {maximumFractionDigits: 6})}</span>
                </div>
            `;
        }

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>Time Conversion</h3>
            <div class="result-item">
                <span class="result-label">Input</span>
                <span class="result-value">${inputValue} ${conversions[fromUnit].name}</span>
            </div>
            <div class="result-item highlight">
                <span class="result-label">Result</span>
                <span class="result-value">${result.toLocaleString('en-IN', {maximumFractionDigits: 6})} ${conversions[toUnit].name}</span>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">All Conversions</h4>
            ${allConversionsHTML}
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();