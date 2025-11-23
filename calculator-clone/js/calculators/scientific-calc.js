/**
 * Scientific Calculator
 * Full-featured scientific calculator with trigonometric, logarithmic, and advanced functions
 */

(function() {
    'use strict';

    let display = '';
    let memory = 0;
    let lastResult = null;
    let angleMode = 'deg'; // 'deg' or 'rad'

    function init() {
        createCalculatorInterface();
        setupEventListeners();
    }

    function createCalculatorInterface() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div style="max-width: 600px; margin: 0 auto;">
                <!-- Display Screen -->
                <div style="background: #1f2937; color: #10b981; padding: 1.5rem; border-radius: 12px 12px 0 0; margin-bottom: 0; font-family: 'Courier New', monospace;">
                    <div id="calcDisplay" style="font-size: 2rem; text-align: right; min-height: 2.5rem; word-break: break-all; margin-bottom: 0.5rem;">0</div>
                    <div id="calcExpression" style="font-size: 0.9rem; text-align: right; color: #9ca3af; min-height: 1.2rem;"></div>
                </div>

                <!-- Mode & Memory Indicators -->
                <div style="background: #374151; padding: 0.5rem 1rem; display: flex; justify-content: space-between; font-size: 0.8rem; color: #d1d5db;">
                    <div>
                        <span id="angleMode" style="background: #667eea; padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer; font-weight: 600;">DEG</span>
                        <span id="memoryIndicator" style="margin-left: 0.5rem; opacity: 0.5;">M: 0</span>
                    </div>
                    <div id="errorIndicator" style="color: #ef4444;"></div>
                </div>

                <!-- Calculator Buttons -->
                <div style="background: #f3f4f6; padding: 1rem; border-radius: 0 0 12px 12px;">
                    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.5rem;">
                        <!-- Row 1: Memory & Special Functions -->
                        <button class="calc-btn secondary" data-action="mc">MC</button>
                        <button class="calc-btn secondary" data-action="mr">MR</button>
                        <button class="calc-btn secondary" data-action="m+">M+</button>
                        <button class="calc-btn secondary" data-action="m-">M-</button>
                        <button class="calc-btn danger" data-action="clear">C</button>
                        <button class="calc-btn danger" data-action="backspace">⌫</button>

                        <!-- Row 2: Trigonometric Functions -->
                        <button class="calc-btn function" data-action="sin">sin</button>
                        <button class="calc-btn function" data-action="cos">cos</button>
                        <button class="calc-btn function" data-action="tan">tan</button>
                        <button class="calc-btn function" data-action="sqrt">√</button>
                        <button class="calc-btn function" data-action="power">x²</button>
                        <button class="calc-btn function" data-action="pow">xʸ</button>

                        <!-- Row 3: Inverse Trig & Log -->
                        <button class="calc-btn function" data-action="asin">asin</button>
                        <button class="calc-btn function" data-action="acos">acos</button>
                        <button class="calc-btn function" data-action="atan">atan</button>
                        <button class="calc-btn function" data-action="log">log</button>
                        <button class="calc-btn function" data-action="ln">ln</button>
                        <button class="calc-btn function" data-action="exp">eˣ</button>

                        <!-- Row 4: Constants & Special -->
                        <button class="calc-btn function" data-action="pi">π</button>
                        <button class="calc-btn function" data-action="e">e</button>
                        <button class="calc-btn function" data-action="abs">|x|</button>
                        <button class="calc-btn function" data-action="factorial">n!</button>
                        <button class="calc-btn operator" data-action="(">(</button>
                        <button class="calc-btn operator" data-action=")">)</button>

                        <!-- Row 5-8: Number Pad & Operations -->
                        <button class="calc-btn number" data-action="7">7</button>
                        <button class="calc-btn number" data-action="8">8</button>
                        <button class="calc-btn number" data-action="9">9</button>
                        <button class="calc-btn operator" data-action="/">÷</button>
                        <button class="calc-btn function" data-action="1/x">1/x</button>
                        <button class="calc-btn function" data-action="%">%</button>

                        <button class="calc-btn number" data-action="4">4</button>
                        <button class="calc-btn number" data-action="5">5</button>
                        <button class="calc-btn number" data-action="6">6</button>
                        <button class="calc-btn operator" data-action="*">×</button>
                        <button class="calc-btn function" data-action="cube">x³</button>
                        <button class="calc-btn function" data-action="cbrt">∛</button>

                        <button class="calc-btn number" data-action="1">1</button>
                        <button class="calc-btn number" data-action="2">2</button>
                        <button class="calc-btn number" data-action="3">3</button>
                        <button class="calc-btn operator" data-action="-">−</button>
                        <button class="calc-btn function" data-action="10x">10ˣ</button>
                        <button class="calc-btn function" data-action="2x">2ˣ</button>

                        <button class="calc-btn number" data-action="0">0</button>
                        <button class="calc-btn number" data-action=".">.</button>
                        <button class="calc-btn number" data-action="ans">Ans</button>
                        <button class="calc-btn operator" data-action="+">+</button>
                        <button class="calc-btn equals" data-action="=" style="grid-column: span 2;">=</button>
                    </div>
                </div>

                <style>
                    .calc-btn {
                        padding: 1rem;
                        font-size: 1rem;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.2s;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .calc-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                    }
                    .calc-btn:active {
                        transform: translateY(0);
                    }
                    .calc-btn.number {
                        background: #ffffff;
                        color: #1f2937;
                    }
                    .calc-btn.operator {
                        background: #f59e0b;
                        color: white;
                    }
                    .calc-btn.function {
                        background: #667eea;
                        color: white;
                        font-size: 0.9rem;
                    }
                    .calc-btn.secondary {
                        background: #6b7280;
                        color: white;
                        font-size: 0.9rem;
                    }
                    .calc-btn.danger {
                        background: #ef4444;
                        color: white;
                    }
                    .calc-btn.equals {
                        background: #10b981;
                        color: white;
                        font-size: 1.2rem;
                    }
                </style>
            </div>
        `;

        // Hide the default calculate button since we have our own interface
        const defaultBtn = document.getElementById('calculate');
        if (defaultBtn) {
            defaultBtn.style.display = 'none';
        }

        updateDisplay();
    }

    function setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('calc-btn')) {
                handleButtonClick(e.target.dataset.action);
            }
        });

        // Angle mode toggle
        document.addEventListener('click', (e) => {
            if (e.target.id === 'angleMode') {
                angleMode = angleMode === 'deg' ? 'rad' : 'deg';
                e.target.textContent = angleMode.toUpperCase();
            }
        });

        // Keyboard support
        document.addEventListener('keydown', handleKeyboard);
    }

    function handleKeyboard(e) {
        const key = e.key;
        if (/[0-9.]/.test(key)) {
            handleButtonClick(key);
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            handleButtonClick(key);
        } else if (key === 'Enter') {
            handleButtonClick('=');
        } else if (key === 'Escape') {
            handleButtonClick('clear');
        } else if (key === 'Backspace') {
            handleButtonClick('backspace');
        } else if (key === '(' || key === ')') {
            handleButtonClick(key);
        }
    }

    function handleButtonClick(action) {
        const errorDiv = document.getElementById('errorIndicator');
        errorDiv.textContent = '';

        try {
            switch(action) {
                case 'clear':
                    display = '';
                    lastResult = null;
                    break;
                case 'backspace':
                    display = display.slice(0, -1);
                    break;
                case '=':
                    if (display) {
                        const result = evaluateExpression(display);
                        lastResult = result;
                        document.getElementById('calcExpression').textContent = display + ' =';
                        display = String(result);
                    }
                    break;
                case 'mc':
                    memory = 0;
                    updateMemoryIndicator();
                    break;
                case 'mr':
                    display += String(memory);
                    break;
                case 'm+':
                    memory += evaluateExpression(display || '0');
                    updateMemoryIndicator();
                    break;
                case 'm-':
                    memory -= evaluateExpression(display || '0');
                    updateMemoryIndicator();
                    break;
                case 'ans':
                    if (lastResult !== null) {
                        display += String(lastResult);
                    }
                    break;
                case 'pi':
                    display += String(Math.PI);
                    break;
                case 'e':
                    display += String(Math.E);
                    break;
                case 'sin':
                case 'cos':
                case 'tan':
                case 'asin':
                case 'acos':
                case 'atan':
                case 'sqrt':
                case 'ln':
                case 'log':
                case 'abs':
                case 'exp':
                case 'factorial':
                case '1/x':
                case 'cbrt':
                case '10x':
                case '2x':
                    applyFunction(action);
                    break;
                case 'power':
                    applyFunction('power');
                    break;
                case 'cube':
                    applyFunction('cube');
                    break;
                case 'pow':
                    display += '^';
                    break;
                default:
                    display += action;
            }
        } catch (error) {
            errorDiv.textContent = 'Error';
            display = '';
        }

        updateDisplay();
    }

    function applyFunction(func) {
        if (!display) return;

        const value = evaluateExpression(display);
        let result;

        switch(func) {
            case 'sin':
                result = angleMode === 'deg' ? Math.sin(value * Math.PI / 180) : Math.sin(value);
                break;
            case 'cos':
                result = angleMode === 'deg' ? Math.cos(value * Math.PI / 180) : Math.cos(value);
                break;
            case 'tan':
                result = angleMode === 'deg' ? Math.tan(value * Math.PI / 180) : Math.tan(value);
                break;
            case 'asin':
                result = angleMode === 'deg' ? Math.asin(value) * 180 / Math.PI : Math.asin(value);
                break;
            case 'acos':
                result = angleMode === 'deg' ? Math.acos(value) * 180 / Math.PI : Math.acos(value);
                break;
            case 'atan':
                result = angleMode === 'deg' ? Math.atan(value) * 180 / Math.PI : Math.atan(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'cbrt':
                result = Math.cbrt(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'abs':
                result = Math.abs(value);
                break;
            case 'exp':
                result = Math.exp(value);
                break;
            case '10x':
                result = Math.pow(10, value);
                break;
            case '2x':
                result = Math.pow(2, value);
                break;
            case 'power':
                result = Math.pow(value, 2);
                break;
            case 'cube':
                result = Math.pow(value, 3);
                break;
            case '1/x':
                result = 1 / value;
                break;
            case 'factorial':
                result = factorial(Math.floor(value));
                break;
        }

        display = String(result);
        lastResult = result;
    }

    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    function evaluateExpression(expr) {
        // Replace symbols
        expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

        // Handle power operator
        expr = expr.replace(/\^/g, '**');

        // Safe evaluation
        try {
            // eslint-disable-next-line no-eval
            return eval(expr);
        } catch (error) {
            throw new Error('Invalid expression');
        }
    }

    function updateDisplay() {
        const displayDiv = document.getElementById('calcDisplay');
        if (displayDiv) {
            displayDiv.textContent = display || '0';
        }
    }

    function updateMemoryIndicator() {
        const indicator = document.getElementById('memoryIndicator');
        if (indicator) {
            indicator.textContent = `M: ${memory.toFixed(2)}`;
            indicator.style.opacity = memory !== 0 ? '1' : '0.5';
        }
    }

    // Hide results div as we have integrated display
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
