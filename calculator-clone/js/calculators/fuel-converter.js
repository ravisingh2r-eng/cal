/**
 * Fuel Efficiency Converter
 * Convert between km/L, mpg, and L/100km
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

        document.addEventListener('input', (e) => {
            if (e.target.matches('#value, #fromUnit')) {
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

        container.innerHTML = `
            <div class="input-group">
                <label for="value">Fuel Efficiency Value</label>
                <input type="number" id="value" placeholder="Enter value" step="any" min="0" value="15">
            </div>

            <div class="input-group">
                <label for="fromUnit">From Unit</label>
                <select id="fromUnit">
                    <option value="kml">Kilometers per Liter (km/L)</option>
                    <option value="mpg_us">Miles per Gallon - US (MPG)</option>
                    <option value="mpg_uk">Miles per Gallon - UK (MPG)</option>
                    <option value="l100km">Liters per 100 Kilometers (L/100km)</option>
                </select>
            </div>

            <div style="margin-top: 10px; padding: 10px; background: #f9fafb; border-radius: 6px; font-size: 0.9em;">
                <strong>Note:</strong> km/L and MPG are "higher is better", while L/100km is "lower is better"
            </div>
        `;
    }

    function calculate() {
        const value = parseFloat(document.getElementById('value').value);
        const fromUnit = document.getElementById('fromUnit').value;

        if (isNaN(value) || value <= 0) {
            return;
        }

        let kml, mpgUS, mpgUK, l100km;

        // Convert to km/L (base unit)
        switch(fromUnit) {
            case 'kml':
                kml = value;
                break;
            case 'mpg_us':
                kml = value * 0.425144; // 1 MPG(US) = 0.425144 km/L
                break;
            case 'mpg_uk':
                kml = value * 0.354006; // 1 MPG(UK) = 0.354006 km/L
                break;
            case 'l100km':
                kml = 100 / value; // L/100km to km/L
                break;
        }

        // Convert from km/L to all units
        mpgUS = kml / 0.425144;
        mpgUK = kml / 0.354006;
        l100km = 100 / kml;

        displayResults(value, fromUnit, kml, mpgUS, mpgUK, l100km);

        if (typeof trackCalculation === 'function') {
            trackCalculation('fuel-converter', { value, fromUnit }, { kml, mpgUS });
        }

        setTimeout(() => {
            if (typeof AdManager !== 'undefined' && AdManager.refresh) {
                AdManager.refresh();
            }
        }, 2000);
    }

    function displayResults(inputValue, fromUnit, kml, mpgUS, mpgUK, l100km) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        const unitNames = {
            'kml': 'Kilometers per Liter',
            'mpg_us': 'Miles per Gallon (US)',
            'mpg_uk': 'Miles per Gallon (UK)',
            'l100km': 'Liters per 100 Kilometers'
        };

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>Fuel Efficiency Conversion</h3>
            <div class="result-item">
                <span class="result-label">Input</span>
                <span class="result-value">${inputValue} ${unitNames[fromUnit]}</span>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">Converted Values</h4>
            <div class="result-item ${fromUnit === 'kml' ? 'highlight' : ''}">
                <span class="result-label">Kilometers per Liter (km/L)</span>
                <span class="result-value">${kml.toFixed(4)}</span>
            </div>
            <div class="result-item ${fromUnit === 'mpg_us' ? 'highlight' : ''}">
                <span class="result-label">Miles per Gallon - US (MPG)</span>
                <span class="result-value">${mpgUS.toFixed(4)}</span>
            </div>
            <div class="result-item ${fromUnit === 'mpg_uk' ? 'highlight' : ''}">
                <span class="result-label">Miles per Gallon - UK (MPG)</span>
                <span class="result-value">${mpgUK.toFixed(4)}</span>
            </div>
            <div class="result-item ${fromUnit === 'l100km' ? 'highlight' : ''}">
                <span class="result-label">Liters per 100 Kilometers (L/100km)</span>
                <span class="result-value">${l100km.toFixed(4)}</span>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">Efficiency Rating</h4>
            <div style="padding: 10px; background: #f9fafb; border-radius: 6px;">
                ${kml >= 20 ? '<div style="color: #10b981;">⭐⭐⭐ Excellent fuel efficiency!</div>' :
                  kml >= 15 ? '<div style="color: #3b82f6;">⭐⭐ Good fuel efficiency</div>' :
                  kml >= 10 ? '<div style="color: #f59e0b;">⭐ Average fuel efficiency</div>' :
                  '<div style="color: #ef4444;">❌ Poor fuel efficiency</div>'}
            </div>

            <div style="margin-top: 15px; padding: 10px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <strong>Quick Reference:</strong>
                <ul style="margin: 8px 0; padding-left: 20px;">
                    <li>1 gallon (US) = 3.785 liters</li>
                    <li>1 gallon (UK) = 4.546 liters</li>
                    <li>Higher km/L and MPG = Better efficiency</li>
                    <li>Lower L/100km = Better efficiency</li>
                </ul>
            </div>
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();