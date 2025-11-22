/**
 * Speed Converter
 * Convert between different speed units
 */

(function() {
    'use strict';

    const conversions = {
        'kmh': { name: 'Kilometers per Hour', factor: 1 },
        'mph': { name: 'Miles per Hour', factor: 0.621371 },
        'ms': { name: 'Meters per Second', factor: 0.277778 },
        'fps': { name: 'Feet per Second', factor: 0.911344 },
        'knots': { name: 'Knots', factor: 0.539957 },
        'mach': { name: 'Mach (at sea level)', factor: 0.000816 }
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
                <input type="number" id="value" placeholder="Enter speed value" step="any" value="100">
            </div>

            <div class="input-group">
                <label for="fromUnit">From Unit</label>
                <select id="fromUnit">
                    ${optionsHTML}
                </select>
            </div>

            <div class="input-group">
                <label for="toUnit">To Unit</label>
                <select id="toUnit">
                    ${optionsHTML.replace('value="kmh"', 'value="mph"')}
                </select>
            </div>
        `;

        // Set default to mph for toUnit
        document.getElementById('toUnit').value = 'mph';
    }

    function calculate() {
        const value = parseFloat(document.getElementById('value').value);
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;

        if (isNaN(value)) {
            return;
        }

        // Convert to km/h first (base unit)
        const valueInKmh = value / conversions[fromUnit].factor;
        
        // Convert from km/h to target unit
        const result = valueInKmh * conversions[toUnit].factor;

        // Get all conversions
        const allConversions = {};
        for (const [key, conv] of Object.entries(conversions)) {
            allConversions[key] = {
                name: conv.name,
                value: valueInKmh * conv.factor
            };
        }

        displayResults(value, fromUnit, result, toUnit, allConversions);

        if (typeof trackCalculation === 'function') {
            trackCalculation('speed', { value, fromUnit, toUnit }, { result });
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
                    <span class="result-value">${conv.value.toFixed(6)} ${key.toUpperCase()}</span>
                </div>
            `;
        }

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>Speed Conversion</h3>
            <div class="result-item">
                <span class="result-label">Input</span>
                <span class="result-value">${inputValue} ${conversions[fromUnit].name}</span>
            </div>
            <div class="result-item highlight">
                <span class="result-label">Result</span>
                <span class="result-value">${result.toFixed(6)} ${conversions[toUnit].name}</span>
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