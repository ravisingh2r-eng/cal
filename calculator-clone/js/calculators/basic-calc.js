/**
 * Basic Calculator Logic
 */

(function() {
    'use strict';

    let currentValue = '0';
    let previousValue = null;
    let operation = null;
    let memory = 0;
    let history = [];

    function init() {
        setupEventListeners();
        loadHistory();
    }

    function setupEventListeners() {
        document.querySelectorAll('.btn-number').forEach(btn => {
            btn.addEventListener('click', handleNumber);
        });

        document.querySelectorAll('.btn-operator').forEach(btn => {
            btn.addEventListener('click', handleOperator);
        });

        document.querySelector('[data-action="equals"]')?.addEventListener('click', calculate);
        document.querySelector('[data-action="clear"]')?.addEventListener('click', clear);
        document.querySelector('[data-action="backspace"]')?.addEventListener('click', backspace);

        // Memory functions
        document.querySelector('[data-action="mc"]')?.addEventListener('click', () => memory = 0);
        document.querySelector('[data-action="mr"]')?.addEventListener('click', () => {
            currentValue = memory.toString();
            updateDisplay();
        });
        document.querySelector('[data-action="m+"]')?.addEventListener('click', () => {
            memory += parseFloat(currentValue);
        });
        document.querySelector('[data-action="m-"]')?.addEventListener('click', () => {
            memory -= parseFloat(currentValue);
        });

        // Clear history
        document.getElementById('clearHistory')?.addEventListener('click', () => {
            history = [];
            updateHistoryDisplay();
            if (typeof StorageManager !== 'undefined') {
                StorageManager.clearHistory('basic');
            }
        });

        // Keyboard support
        document.addEventListener('keydown', handleKeyboard);
    }

    function handleNumber(e) {
        const value = e.target.dataset.value;
        if (currentValue === '0' && value !== '.') {
            currentValue = value;
        } else if (value === '.' && currentValue.includes('.')) {
            return;
        } else {
            currentValue += value;
        }
        updateDisplay();
    }

    function handleOperator(e) {
        const action = e.target.dataset.action;

        switch (action) {
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                if (previousValue !== null && operation) {
                    calculate();
                }
                previousValue = parseFloat(currentValue);
                operation = action;
                currentValue = '0';
                break;
            case 'sqrt':
                currentValue = Math.sqrt(parseFloat(currentValue)).toString();
                updateDisplay();
                break;
            case 'square':
                currentValue = Math.pow(parseFloat(currentValue), 2).toString();
                updateDisplay();
                break;
            case 'percent':
                currentValue = (parseFloat(currentValue) / 100).toString();
                updateDisplay();
                break;
            case 'negate':
                currentValue = (-parseFloat(currentValue)).toString();
                updateDisplay();
                break;
            case '1/x':
                currentValue = (1 / parseFloat(currentValue)).toString();
                updateDisplay();
                break;
            case 'copy':
                copyResult();
                break;
        }
    }

    function calculate() {
        if (previousValue === null || !operation) return;

        const prev = previousValue;
        const curr = parseFloat(currentValue);
        let result;

        switch (operation) {
            case 'add': result = prev + curr; break;
            case 'subtract': result = prev - curr; break;
            case 'multiply': result = prev * curr; break;
            case 'divide': result = prev / curr; break;
        }

        addToHistory(prev + ' ' + getOperatorSymbol(operation) + ' ' + curr + ' = ' + result);
        currentValue = result.toString();
        previousValue = null;
        operation = null;
        updateDisplay();
    }

    function getOperatorSymbol(op) {
        const symbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
        return symbols[op] || op;
    }

    function clear() {
        currentValue = '0';
        previousValue = null;
        operation = null;
        updateDisplay();
    }

    function backspace() {
        currentValue = currentValue.slice(0, -1) || '0';
        updateDisplay();
    }

    function updateDisplay() {
        const display = document.getElementById('result');
        if (display) display.textContent = currentValue;

        const expression = document.getElementById('expression');
        if (expression && previousValue !== null && operation) {
            expression.textContent = previousValue + ' ' + getOperatorSymbol(operation);
        } else if (expression) {
            expression.textContent = '';
        }
    }

    function handleKeyboard(e) {
        if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
            handleNumber({ target: { dataset: { value: e.key } } });
        } else if (e.key === 'Enter' || e.key === '=') {
            calculate();
        } else if (e.key === 'Escape') {
            clear();
        } else if (e.key === 'Backspace') {
            backspace();
        }
    }

    function addToHistory(calculation) {
        history.unshift(calculation);
        if (history.length > 20) history.pop();
        updateHistoryDisplay();

        if (typeof StorageManager !== 'undefined') {
            StorageManager.saveCalculation('basic', { expression: calculation }, currentValue);
        }
    }

    function updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        historyList.innerHTML = history.map(calc => '<div class="history-item">' + calc + '</div>').join('');
    }

    function loadHistory() {
        if (typeof StorageManager !== 'undefined') {
            const saved = StorageManager.getHistory('basic');
            history = saved.map(item => item.inputs.expression);
            updateHistoryDisplay();
        }
    }

    function copyResult() {
        if (window.APP && window.APP.copyToClipboard) {
            window.APP.copyToClipboard(currentValue);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
