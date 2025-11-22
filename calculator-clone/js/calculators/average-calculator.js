/**
 * Average Calculator
 * Calculate mean, median, mode, and range from a list of numbers
 */

(function() {
    'use strict';

    let numbersList = [];

    function init() {
        setupEventListeners();
        createInputFields();
    }

    function setupEventListeners() {
        const calculateBtn = document.getElementById('calculate');
        const addBtn = document.getElementById('addNumber');
        const clearBtn = document.getElementById('clearNumbers');
        
        if (calculateBtn) calculateBtn.addEventListener('click', calculate);
        if (addBtn) addBtn.addEventListener('click', addNumber);
        if (clearBtn) clearBtn.addEventListener('click', clearNumbers);

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.id === 'number') addNumber();
        });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="input-group">
                <label for="number">Enter Numbers</label>
                <div style="display: flex; gap: 10px;">
                    <input type="number" id="number" step="any" placeholder="Enter a number">
                    <button type="button" id="addNumber" class="btn-secondary">Add</button>
                </div>
            </div>

            <div class="input-group">
                <label>Numbers Added (<span id="count">0</span>)</label>
                <div id="numbersList" style="min-height: 40px; padding: 10px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 10px;"></div>
                <button type="button" id="clearNumbers" class="btn-secondary">Clear All</button>
            </div>
        `;
    }

    function addNumber() {
        const numberInput = document.getElementById('number');
        const number = parseFloat(numberInput.value);

        if (isNaN(number)) {
            alert('Please enter a valid number');
            return;
        }

        numbersList.push(number);
        updateNumbersList();
        numberInput.value = '';
        numberInput.focus();
    }

    function clearNumbers() {
        numbersList = [];
        updateNumbersList();
        document.getElementById('results').style.display = 'none';
    }

    function updateNumbersList() {
        const listDiv = document.getElementById('numbersList');
        const countSpan = document.getElementById('count');
        
        countSpan.textContent = numbersList.length;
        
        if (numbersList.length === 0) {
            listDiv.innerHTML = '<span style="color: #9ca3af;">No numbers added yet</span>';
        } else {
            listDiv.innerHTML = numbersList.map((num, idx) => 
                `<span style="display: inline-block; margin: 4px; padding: 4px 8px; background: white; border: 1px solid #d1d5db; border-radius: 4px;">${num}</span>`
            ).join('');
        }
    }

    function calculate() {
        if (numbersList.length === 0) {
            alert('Please add at least one number');
            return;
        }

        const sorted = [...numbersList].sort((a, b) => a - b);
        
        // Mean
        const sum = numbersList.reduce((acc, num) => acc + num, 0);
        const mean = sum / numbersList.length;

        // Median
        let median;
        const mid = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            median = (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            median = sorted[mid];
        }

        // Mode
        const frequency = {};
        let maxFreq = 0;
        numbersList.forEach(num => {
            frequency[num] = (frequency[num] || 0) + 1;
            if (frequency[num] > maxFreq) maxFreq = frequency[num];
        });
        
        const modes = Object.keys(frequency).filter(num => frequency[num] === maxFreq);
        const mode = maxFreq > 1 ? modes.map(parseFloat).join(', ') : 'No mode';

        // Range
        const range = sorted[sorted.length - 1] - sorted[0];

        // Sum
        const total = sum;

        displayResults(mean, median, mode, range, total, sorted[0], sorted[sorted.length - 1]);

        if (typeof trackCalculation === 'function') {
            trackCalculation('average', { count: numbersList.length }, { mean, median, range });
        }

        setTimeout(() => {
            if (typeof AdManager !== 'undefined' && AdManager.refresh) {
                AdManager.refresh();
            }
        }, 2000);
    }

    function displayResults(mean, median, mode, range, sum, min, max) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>Statistical Results</h3>
            <div class="result-item highlight">
                <span class="result-label">Mean (Average)</span>
                <span class="result-value">${mean.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Median</span>
                <span class="result-value">${median.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Mode</span>
                <span class="result-value">${mode}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Range</span>
                <span class="result-value">${range.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Sum</span>
                <span class="result-value">${sum.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Minimum</span>
                <span class="result-value">${min.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Maximum</span>
                <span class="result-value">${max.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Count</span>
                <span class="result-value">${numbersList.length}</span>
            </div>
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();