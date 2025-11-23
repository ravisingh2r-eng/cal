/**
 * Discount Calculator - Redesigned with calculator.net style
 * Features: Savings visualization, price comparison, discount breakdown
 */

(function() {
    'use strict';

    const styles = `
        <style>
            .discount-calculator-container {
                max-width: 1000px;
                margin: 0 auto;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }
            .discount-input-section {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 25px;
            }
            .discount-input-group { margin-bottom: 20px; }
            .discount-label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #374151;
            }
            .label-value {
                color: #ec4899;
                font-weight: 600;
                font-size: 15px;
            }
            .slider-input-combo {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 12px;
                align-items: center;
            }
            .discount-slider {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: linear-gradient(to right, #fce7f3, #ec4899);
                outline: none;
                -webkit-appearance: none;
            }
            .discount-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #ec4899;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .discount-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #ec4899;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .discount-number-input {
                width: 140px;
                padding: 8px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                text-align: right;
            }
            .discount-number-input:focus {
                outline: none;
                border-color: #ec4899;
            }
            .calculate-btn {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #ec4899, #f43f5e);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
            }
            .calculate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(236, 72, 153, 0.4);
            }
            .main-discount-card {
                background: linear-gradient(135deg, #ec4899, #f43f5e);
                color: white;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 25px;
                box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3);
            }
            .main-discount-value {
                font-size: 42px;
                font-weight: 700;
                margin-bottom: 15px;
            }
            .discount-breakdown-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 15px;
                margin-bottom: 25px;
            }
            .discount-breakdown-card {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                border-left: 4px solid #ec4899;
            }
            .discount-section {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 25px;
            }
            .section-title {
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .savings-bar {
                height: 60px;
                background: #f3f4f6;
                border-radius: 10px;
                overflow: hidden;
                display: flex;
                margin: 20px 0;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }
            .bar-original {
                background: linear-gradient(135deg, #6b7280, #4b5563);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 14px;
            }
            .bar-savings {
                background: linear-gradient(135deg, #ec4899, #f43f5e);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 14px;
            }
            .price-comparison {
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                gap: 20px;
                align-items: center;
                margin: 20px 0;
            }
            .price-box {
                text-align: center;
                padding: 20px;
                border-radius: 10px;
                border: 2px solid #e5e7eb;
            }
            .price-box.original {
                background: #f9fafb;
            }
            .price-box.final {
                background: #fdf2f8;
                border-color: #ec4899;
            }
            .price-label {
                font-size: 13px;
                color: #6b7280;
                margin-bottom: 8px;
            }
            .price-amount {
                font-size: 28px;
                font-weight: 700;
                color: #1f2937;
            }
            .price-amount.strikethrough {
                text-decoration: line-through;
                color: #9ca3af;
            }
            .arrow-icon {
                font-size: 32px;
                color: #ec4899;
            }
            .discount-detail-row {
                display: flex;
                justify-content: space-between;
                padding: 12px;
                background: #f9fafb;
                border-radius: 8px;
                font-size: 14px;
                margin-bottom: 8px;
            }
            .discount-detail-row.highlight {
                background: #fdf2f8;
                border: 2px solid #fbcfe8;
                font-weight: 600;
                color: #9f1239;
            }
            @media (max-width: 768px) {
                .main-discount-value { font-size: 32px; }
                .discount-breakdown-grid { grid-template-columns: 1fr; }
                .price-comparison { grid-template-columns: 1fr; }
                .arrow-icon { transform: rotate(90deg); }
            }
        </style>
    `;

    function init() {
        createCalculatorInterface();
        setupEventListeners();
    }

    function createCalculatorInterface() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = styles + `
            <div class="discount-calculator-container">
                <div class="discount-input-section">
                    <div class="discount-input-group">
                        <div class="discount-label">
                            <span>Original Price</span>
                            <span class="label-value" id="priceDisplay">₹5,000</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="discount-slider" id="priceSlider"
                                   min="100" max="100000" step="100" value="5000">
                            <input type="number" class="discount-number-input" id="priceInput"
                                   value="5000" min="100" step="100">
                        </div>
                    </div>

                    <div class="discount-input-group">
                        <div class="discount-label">
                            <span>Discount Percentage</span>
                            <span class="label-value" id="discountDisplay">20%</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="discount-slider" id="discountSlider"
                                   min="5" max="90" step="1" value="20">
                            <input type="number" class="discount-number-input" id="discountInput"
                                   value="20" min="5" max="90" step="1">
                        </div>
                    </div>

                    <div class="discount-input-group">
                        <div class="discount-label">
                            <span>Quantity</span>
                            <span class="label-value" id="quantityDisplay">1</span>
                        </div>
                        <div class="slider-input-combo">
                            <input type="range" class="discount-slider" id="quantitySlider"
                                   min="1" max="20" step="1" value="1">
                            <input type="number" class="discount-number-input" id="quantityInput"
                                   value="1" min="1" max="100" step="1">
                        </div>
                    </div>

                    <button class="calculate-btn" id="calculateBtn">
                        🏷️ Calculate Discount
                    </button>
                </div>

                <div id="discountResults"></div>
            </div>
        `;
    }

    function setupEventListeners() {
        syncSliderAndInput('price', 'priceSlider', 'priceInput', 'priceDisplay', (val) => `₹${formatNumber(val)}`);
        syncSliderAndInput('discount', 'discountSlider', 'discountInput', 'discountDisplay', (val) => `${val}%`);
        syncSliderAndInput('quantity', 'quantitySlider', 'quantityInput', 'quantityDisplay', (val) => val);

        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) calculateBtn.addEventListener('click', calculate);

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculate();
        });
    }

    function syncSliderAndInput(name, sliderId, inputId, displayId, formatFn) {
        const slider = document.getElementById(sliderId);
        const input = document.getElementById(inputId);
        const display = document.getElementById(displayId);

        if (slider && input && display) {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                input.value = value;
                display.textContent = formatFn(value);
            });

            input.addEventListener('input', (e) => {
                const value = e.target.value;
                slider.value = value;
                display.textContent = formatFn(value);
            });
        }
    }

    function calculate() {
        const originalPrice = parseFloat(document.getElementById('priceInput').value) || 0;
        const discountPercent = parseFloat(document.getElementById('discountInput').value) || 0;
        const quantity = parseInt(document.getElementById('quantityInput').value) || 1;

        if (originalPrice <= 0) {
            alert('Please enter a valid original price');
            return;
        }

        const discountAmount = (originalPrice * discountPercent) / 100;
        const finalPrice = originalPrice - discountAmount;
        const totalOriginal = originalPrice * quantity;
        const totalSavings = discountAmount * quantity;
        const totalFinal = finalPrice * quantity;

        const savingsPercent = discountPercent;
        const pricePercent = 100 - discountPercent;

        displayResults(originalPrice, discountPercent, discountAmount, finalPrice, quantity,
                      totalOriginal, totalSavings, totalFinal, savingsPercent, pricePercent);
    }

    function displayResults(originalPrice, discountPercent, discountAmount, finalPrice, quantity,
                           totalOriginal, totalSavings, totalFinal, savingsPercent, pricePercent) {

        const resultsDiv = document.getElementById('discountResults');
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <div class="discount-results">
                    <div class="main-discount-card">
                        <div style="font-size: 16px; opacity: 0.95; margin-bottom: 8px;">💰 You Save</div>
                        <div class="main-discount-value">₹${formatNumber(totalSavings.toFixed(0))}</div>
                        <div style="display: inline-block; padding: 6px 16px; background: rgba(255,255,255,0.25); border-radius: 20px; font-size: 14px; font-weight: 600;">${discountPercent}% OFF</div>
                    </div>

                    <div class="discount-breakdown-grid">
                        <div class="discount-breakdown-card">
                            <div style="font-size: 13px; color: #6b7280; margin-bottom: 6px;">Original Price</div>
                            <div style="font-size: 22px; font-weight: 700; color: #6b7280; text-decoration: line-through;">₹${formatNumber(totalOriginal.toFixed(0))}</div>
                        </div>
                        <div class="discount-breakdown-card">
                            <div style="font-size: 13px; color: #6b7280; margin-bottom: 6px;">Final Price</div>
                            <div style="font-size: 22px; font-weight: 700; color: #ec4899;">₹${formatNumber(totalFinal.toFixed(0))}</div>
                        </div>
                        <div class="discount-breakdown-card">
                            <div style="font-size: 13px; color: #6b7280; margin-bottom: 6px;">Per Item</div>
                            <div style="font-size: 22px; font-weight: 700; color: #1f2937;">₹${formatNumber(finalPrice.toFixed(0))}</div>
                        </div>
                    </div>

                    <div class="discount-section">
                        <div class="section-title">💸 Savings Breakdown</div>
                        <div class="savings-bar">
                            <div class="bar-original" style="width: ${pricePercent}%;">
                                Pay: ₹${formatNumber(totalFinal.toFixed(0))}
                            </div>
                            <div class="bar-savings" style="width: ${savingsPercent}%;">
                                Save: ₹${formatNumber(totalSavings.toFixed(0))}
                            </div>
                        </div>
                    </div>

                    <div class="discount-section">
                        <div class="section-title">🔄 Price Comparison</div>
                        <div class="price-comparison">
                            <div class="price-box original">
                                <div class="price-label">Original Price</div>
                                <div class="price-amount strikethrough">₹${formatNumber(totalOriginal.toFixed(0))}</div>
                            </div>
                            <div class="arrow-icon">→</div>
                            <div class="price-box final">
                                <div class="price-label">Final Price</div>
                                <div class="price-amount">₹${formatNumber(totalFinal.toFixed(0))}</div>
                            </div>
                        </div>
                    </div>

                    <div class="discount-section">
                        <div class="section-title">📋 Calculation Details</div>
                        <div class="discount-detail-row">
                            <span>Original Price (per item)</span>
                            <span style="font-weight: 600;">₹${formatNumber(originalPrice.toFixed(0))}</span>
                        </div>
                        <div class="discount-detail-row">
                            <span>Discount Percentage</span>
                            <span style="font-weight: 600;">${discountPercent}%</span>
                        </div>
                        <div class="discount-detail-row">
                            <span>Discount Amount (per item)</span>
                            <span style="font-weight: 600; color: #ec4899;">₹${formatNumber(discountAmount.toFixed(0))}</span>
                        </div>
                        <div class="discount-detail-row">
                            <span>Final Price (per item)</span>
                            <span style="font-weight: 600;">₹${formatNumber(finalPrice.toFixed(0))}</span>
                        </div>
                        <div class="discount-detail-row">
                            <span>Quantity</span>
                            <span style="font-weight: 600;">${quantity} ${quantity === 1 ? 'item' : 'items'}</span>
                        </div>
                        <div class="discount-detail-row highlight">
                            <span>Total You Pay</span>
                            <span>₹${formatNumber(totalFinal.toFixed(0))}</span>
                        </div>
                        <div class="discount-detail-row highlight">
                            <span>Total You Save</span>
                            <span>₹${formatNumber(totalSavings.toFixed(0))}</span>
                        </div>
                    </div>

                    <div class="discount-section">
                        <div class="section-title">ℹ️ Smart Shopping Tips</div>
                        <div class="discount-detail-row">
                            <span>Effective Savings</span>
                            <span>${discountPercent}% on every ₹100</span>
                        </div>
                        <div class="discount-detail-row">
                            <span>Best Time to Buy</span>
                            <span>${discountPercent >= 50 ? 'Excellent Deal! 🎉' : discountPercent >= 30 ? 'Great Discount! ✨' : 'Good Savings! 👍'}</span>
                        </div>
                        <div class="discount-detail-row">
                            <span>Money Saved</span>
                            <span>₹${formatNumber(discountAmount.toFixed(0))} per item</span>
                        </div>
                        ${quantity > 1 ? `
                        <div class="discount-detail-row">
                            <span>Bulk Benefit</span>
                            <span>Saving ₹${formatNumber(totalSavings.toFixed(0))} total</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    }

    function formatNumber(num) {
        return parseFloat(num).toLocaleString('en-IN', { maximumFractionDigits: 0 });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
