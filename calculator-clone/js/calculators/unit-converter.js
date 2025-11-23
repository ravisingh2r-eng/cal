/**
 * Unit Converter
 * Multi-category unit converter with live conversion
 */

(function() {
    'use strict';

    const conversionRates = {
        length: {
            name: 'Length',
            units: {
                'meter': { name: 'Meters (m)', toBase: 1 },
                'kilometer': { name: 'Kilometers (km)', toBase: 1000 },
                'centimeter': { name: 'Centimeters (cm)', toBase: 0.01 },
                'millimeter': { name: 'Millimeters (mm)', toBase: 0.001 },
                'mile': { name: 'Miles (mi)', toBase: 1609.344 },
                'yard': { name: 'Yards (yd)', toBase: 0.9144 },
                'foot': { name: 'Feet (ft)', toBase: 0.3048 },
                'inch': { name: 'Inches (in)', toBase: 0.0254 },
                'nautical-mile': { name: 'Nautical Miles', toBase: 1852 }
            }
        },
        weight: {
            name: 'Weight/Mass',
            units: {
                'kilogram': { name: 'Kilograms (kg)', toBase: 1 },
                'gram': { name: 'Grams (g)', toBase: 0.001 },
                'milligram': { name: 'Milligrams (mg)', toBase: 0.000001 },
                'metric-ton': { name: 'Metric Tons', toBase: 1000 },
                'pound': { name: 'Pounds (lb)', toBase: 0.453592 },
                'ounce': { name: 'Ounces (oz)', toBase: 0.0283495 },
                'stone': { name: 'Stones (st)', toBase: 6.35029 },
                'ton': { name: 'US Tons', toBase: 907.185 }
            }
        },
        temperature: {
            name: 'Temperature',
            units: {
                'celsius': { name: 'Celsius (°C)' },
                'fahrenheit': { name: 'Fahrenheit (°F)' },
                'kelvin': { name: 'Kelvin (K)' }
            }
        },
        area: {
            name: 'Area',
            units: {
                'square-meter': { name: 'Square Meters (m²)', toBase: 1 },
                'square-kilometer': { name: 'Square Kilometers (km²)', toBase: 1000000 },
                'square-centimeter': { name: 'Square Centimeters (cm²)', toBase: 0.0001 },
                'hectare': { name: 'Hectares (ha)', toBase: 10000 },
                'acre': { name: 'Acres (ac)', toBase: 4046.86 },
                'square-mile': { name: 'Square Miles (mi²)', toBase: 2589988.11 },
                'square-yard': { name: 'Square Yards (yd²)', toBase: 0.836127 },
                'square-foot': { name: 'Square Feet (ft²)', toBase: 0.092903 },
                'square-inch': { name: 'Square Inches (in²)', toBase: 0.00064516 }
            }
        },
        volume: {
            name: 'Volume',
            units: {
                'liter': { name: 'Liters (L)', toBase: 1 },
                'milliliter': { name: 'Milliliters (mL)', toBase: 0.001 },
                'cubic-meter': { name: 'Cubic Meters (m³)', toBase: 1000 },
                'cubic-centimeter': { name: 'Cubic Centimeters (cm³)', toBase: 0.001 },
                'gallon-us': { name: 'US Gallons (gal)', toBase: 3.78541 },
                'gallon-uk': { name: 'UK Gallons (gal)', toBase: 4.54609 },
                'quart': { name: 'Quarts (qt)', toBase: 0.946353 },
                'pint': { name: 'Pints (pt)', toBase: 0.473176 },
                'cup': { name: 'Cups', toBase: 0.236588 },
                'fluid-ounce': { name: 'Fluid Ounces (fl oz)', toBase: 0.0295735 }
            }
        },
        speed: {
            name: 'Speed',
            units: {
                'meter-per-second': { name: 'Meters/Second (m/s)', toBase: 1 },
                'kilometer-per-hour': { name: 'Kilometers/Hour (km/h)', toBase: 0.277778 },
                'mile-per-hour': { name: 'Miles/Hour (mph)', toBase: 0.44704 },
                'foot-per-second': { name: 'Feet/Second (ft/s)', toBase: 0.3048 },
                'knot': { name: 'Knots (kn)', toBase: 0.514444 }
            }
        },
        time: {
            name: 'Time',
            units: {
                'second': { name: 'Seconds (s)', toBase: 1 },
                'minute': { name: 'Minutes (min)', toBase: 60 },
                'hour': { name: 'Hours (h)', toBase: 3600 },
                'day': { name: 'Days (d)', toBase: 86400 },
                'week': { name: 'Weeks (wk)', toBase: 604800 },
                'month': { name: 'Months (mo)', toBase: 2592000 },
                'year': { name: 'Years (yr)', toBase: 31536000 }
            }
        },
        data: {
            name: 'Digital Storage',
            units: {
                'byte': { name: 'Bytes (B)', toBase: 1 },
                'kilobyte': { name: 'Kilobytes (KB)', toBase: 1024 },
                'megabyte': { name: 'Megabytes (MB)', toBase: 1048576 },
                'gigabyte': { name: 'Gigabytes (GB)', toBase: 1073741824 },
                'terabyte': { name: 'Terabytes (TB)', toBase: 1099511627776 },
                'petabyte': { name: 'Petabytes (PB)', toBase: 1125899906842624 }
            }
        }
    };

    let currentCategory = 'length';

    function init() {
        createInputFields();
        setupEventListeners();
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="calc-input-group">
                <label for="category">Category</label>
                <select class="calc-input" id="category">
                    ${Object.keys(conversionRates).map(cat =>
                        `<option value="${cat}">${conversionRates[cat].name}</option>`
                    ).join('')}
                </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: end; margin: 2rem 0;">
                <div class="calc-input-group">
                    <label for="fromValue">From</label>
                    <input type="number" class="calc-input" id="fromValue" placeholder="Enter value" value="1" step="any">
                    <select class="calc-input" id="fromUnit" style="margin-top: 0.5rem;">
                    </select>
                </div>

                <div style="text-align: center; font-size: 1.5rem; color: #667eea; padding-bottom: 1rem;">
                    ⇄
                </div>

                <div class="calc-input-group">
                    <label for="toValue">To</label>
                    <input type="number" class="calc-input" id="toValue" placeholder="Result" readonly style="background: #f9fafb;">
                    <select class="calc-input" id="toUnit" style="margin-top: 0.5rem;">
                    </select>
                </div>
            </div>

            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                <p style="margin: 0; color: #1e40af; font-size: 0.9rem;">
                    <strong>💡 Tip:</strong> Conversion happens automatically as you type. Select different units to see instant results.
                </p>
            </div>
        `;

        // Hide default calculate button
        const calculateBtn = document.getElementById('calculate');
        if (calculateBtn) {
            calculateBtn.style.display = 'none';
        }

        updateUnitDropdowns();
        convert();
    }

    function setupEventListeners() {
        const category = document.getElementById('category');
        const fromValue = document.getElementById('fromValue');
        const fromUnit = document.getElementById('fromUnit');
        const toUnit = document.getElementById('toUnit');

        if (category) {
            category.addEventListener('change', function() {
                currentCategory = this.value;
                updateUnitDropdowns();
                convert();
            });
        }

        if (fromValue) {
            fromValue.addEventListener('input', convert);
        }

        if (fromUnit) {
            fromUnit.addEventListener('change', convert);
        }

        if (toUnit) {
            toUnit.addEventListener('change', convert);
        }
    }

    function updateUnitDropdowns() {
        const fromUnit = document.getElementById('fromUnit');
        const toUnit = document.getElementById('toUnit');

        if (!fromUnit || !toUnit) return;

        const units = conversionRates[currentCategory].units;
        const unitOptions = Object.keys(units).map(key =>
            `<option value="${key}">${units[key].name}</option>`
        ).join('');

        fromUnit.innerHTML = unitOptions;
        toUnit.innerHTML = unitOptions;

        // Set different default units
        const unitKeys = Object.keys(units);
        if (unitKeys.length > 1) {
            toUnit.value = unitKeys[1];
        }
    }

    function convert() {
        const fromValue = parseFloat(document.getElementById('fromValue').value);
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;
        const toValueInput = document.getElementById('toValue');

        if (!fromValue || isNaN(fromValue)) {
            toValueInput.value = '';
            updateResults('');
            return;
        }

        let result;

        if (currentCategory === 'temperature') {
            result = convertTemperature(fromValue, fromUnit, toUnit);
        } else {
            // Standard conversion through base unit
            const category = conversionRates[currentCategory];
            const fromRate = category.units[fromUnit].toBase;
            const toRate = category.units[toUnit].toBase;

            const baseValue = fromValue * fromRate;
            result = baseValue / toRate;
        }

        // Format result
        const formattedResult = formatNumber(result);
        toValueInput.value = formattedResult;

        // Update results display
        updateResults(result, fromValue, fromUnit, toUnit);
    }

    function convertTemperature(value, from, to) {
        // First convert to Celsius as base
        let celsius;
        if (from === 'celsius') {
            celsius = value;
        } else if (from === 'fahrenheit') {
            celsius = (value - 32) * 5/9;
        } else if (from === 'kelvin') {
            celsius = value - 273.15;
        }

        // Then convert from Celsius to target
        if (to === 'celsius') {
            return celsius;
        } else if (to === 'fahrenheit') {
            return (celsius * 9/5) + 32;
        } else if (to === 'kelvin') {
            return celsius + 273.15;
        }
    }

    function formatNumber(num) {
        if (Math.abs(num) < 0.0001 && num !== 0) {
            return num.toExponential(6);
        } else if (Math.abs(num) > 1000000) {
            return num.toExponential(6);
        } else {
            return parseFloat(num.toFixed(8)).toString();
        }
    }

    function updateResults(result, fromValue, fromUnit, toUnit) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        if (result === '') {
            resultsDiv.style.display = 'none';
            return;
        }

        const category = conversionRates[currentCategory];
        const fromUnitName = category.units[fromUnit].name;
        const toUnitName = category.units[toUnit].name;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <div class="result-item main-result">
                <span class="result-label">Conversion Result</span>
                <span class="result-value">${formatNumber(result)} ${toUnitName.split('(')[0].trim()}</span>
            </div>

            <div class="result-breakdown">
                <h3>📐 Conversion Details</h3>
                <div class="breakdown-item">
                    <span>From:</span>
                    <span style="font-weight: 600;">${fromValue} ${fromUnitName}</span>
                </div>
                <div class="breakdown-item">
                    <span>To:</span>
                    <span style="font-weight: 600;">${formatNumber(result)} ${toUnitName}</span>
                </div>
                <div class="breakdown-item">
                    <span>Category:</span>
                    <span>${category.name}</span>
                </div>
            </div>

            ${getCommonConversions(fromValue, fromUnit)}

            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 1rem; margin-top: 1.5rem; border-radius: 6px;">
                <p style="margin: 0; color: #065f46; font-size: 0.9rem;">
                    <strong>✓ Quick Tip:</strong> ${getConversionTip(currentCategory)}
                </p>
            </div>
        `;

        // Track conversion
        if (typeof trackCalculation === 'function') {
            trackCalculation('unit-converter', {
                result: result,
                category: currentCategory
            }, {
                from: fromUnit,
                to: toUnit,
                value: fromValue
            });
        }
    }

    function getCommonConversions(value, fromUnit) {
        const category = conversionRates[currentCategory];
        const units = Object.keys(category.units);

        // Show conversions to 3-4 common units
        const commonUnits = units.slice(0, 4).filter(u => u !== fromUnit);

        if (commonUnits.length === 0) return '';

        let html = '<div class="result-breakdown"><h3>🔄 Common Conversions</h3>';

        commonUnits.forEach(unit => {
            let result;
            if (currentCategory === 'temperature') {
                result = convertTemperature(value, fromUnit, unit);
            } else {
                const fromRate = category.units[fromUnit].toBase;
                const toRate = category.units[unit].toBase;
                const baseValue = value * fromRate;
                result = baseValue / toRate;
            }

            html += `
                <div class="breakdown-item">
                    <span>${category.units[unit].name}:</span>
                    <span style="font-weight: 600;">${formatNumber(result)}</span>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    function getConversionTip(category) {
        const tips = {
            'length': '1 kilometer = 1000 meters, 1 mile ≈ 1.609 kilometers',
            'weight': '1 kilogram = 1000 grams, 1 pound ≈ 0.454 kilograms',
            'temperature': '0°C = 32°F = 273.15K, Water freezes at 0°C and boils at 100°C',
            'area': '1 hectare = 10,000 m², 1 acre ≈ 4047 m²',
            'volume': '1 liter = 1000 milliliters, 1 US gallon ≈ 3.785 liters',
            'speed': '100 km/h ≈ 62 mph, 1 knot ≈ 1.852 km/h',
            'time': '1 hour = 60 minutes = 3600 seconds',
            'data': '1 KB = 1024 Bytes, 1 MB = 1024 KB = 1,048,576 Bytes'
        };
        return tips[category] || 'Select different units to see instant conversions';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
