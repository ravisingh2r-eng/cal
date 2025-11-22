/**
 * Discount Calculator
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
                <label>Calculation Mode</label>
                <select class="calc-input" id="calculationMode">
                    <option value="discount">Calculate Final Price (with discount)</option>
                    <option value="reverse">Find Original Price</option>
                    <option value="percentage">Find Discount Percentage</option>
                    <option value="multiple">Multiple Discounts</option>
                </select>
            </div>
            <div class="calc-input-group" id="originalPriceGroup">
                <label>Original Price (₹)</label>
                <input type="number" class="calc-input" id="originalPrice" placeholder="Enter original price" value="5000">
            </div>
            <div class="calc-input-group" id="discountPercentGroup">
                <label>Discount Percentage (%)</label>
                <input type="number" class="calc-input" id="discountPercent" placeholder="Enter discount %" value="20" step="0.1">
            </div>
            <div class="calc-input-group" id="additionalDiscountGroup" style="display:none;">
                <label>Additional Discount (%)</label>
                <input type="number" class="calc-input" id="additionalDiscount" placeholder="Extra discount %" value="10" step="0.1">
            </div>
            <div class="calc-input-group" id="couponDiscountGroup" style="display:none;">
                <label>Coupon Discount (₹)</label>
                <input type="number" class="calc-input" id="couponDiscount" placeholder="Flat discount amount" value="200">
            </div>
            <div class="calc-input-group" id="finalPriceGroup" style="display:none;">
                <label>Final Price (₹)</label>
                <input type="number" class="calc-input" id="finalPrice" placeholder="Enter final price" value="4000">
            </div>
            <div class="calc-input-group">
                <label>Quantity</label>
                <input type="number" class="calc-input" id="quantity" placeholder="Number of items" value="2">
            </div>
            <div class="calc-input-group">
                <label>Tax/GST (%)</label>
                <select class="calc-input" id="taxRate">
                    <option value="0">No Tax</option>
                    <option value="5">5% GST</option>
                    <option value="12">12% GST</option>
                    <option value="18" selected>18% GST</option>
                    <option value="28">28% GST</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Sale Type</label>
                <select class="calc-input" id="saleType">
                    <option value="regular">Regular Sale</option>
                    <option value="flash">Flash Sale</option>
                    <option value="clearance">Clearance Sale</option>
                    <option value="festive">Festive Sale</option>
                    <option value="bogo">Buy 1 Get 1</option>
                </select>
            </div>
        `;
    }

    function updateInputFields(mode) {
        const discountPercentGroup = document.getElementById('discountPercentGroup');
        const finalPriceGroup = document.getElementById('finalPriceGroup');
        const additionalDiscountGroup = document.getElementById('additionalDiscountGroup');
        const couponDiscountGroup = document.getElementById('couponDiscountGroup');
        const originalPriceGroup = document.getElementById('originalPriceGroup');

        if (mode === 'reverse') {
            if (originalPriceGroup) originalPriceGroup.style.display = 'none';
            if (finalPriceGroup) finalPriceGroup.style.display = 'block';
            if (discountPercentGroup) discountPercentGroup.style.display = 'block';
            if (additionalDiscountGroup) additionalDiscountGroup.style.display = 'none';
            if (couponDiscountGroup) couponDiscountGroup.style.display = 'none';
        } else if (mode === 'percentage') {
            if (originalPriceGroup) originalPriceGroup.style.display = 'block';
            if (finalPriceGroup) finalPriceGroup.style.display = 'block';
            if (discountPercentGroup) discountPercentGroup.style.display = 'none';
            if (additionalDiscountGroup) additionalDiscountGroup.style.display = 'none';
            if (couponDiscountGroup) couponDiscountGroup.style.display = 'none';
        } else if (mode === 'multiple') {
            if (originalPriceGroup) originalPriceGroup.style.display = 'block';
            if (finalPriceGroup) finalPriceGroup.style.display = 'none';
            if (discountPercentGroup) discountPercentGroup.style.display = 'block';
            if (additionalDiscountGroup) additionalDiscountGroup.style.display = 'block';
            if (couponDiscountGroup) couponDiscountGroup.style.display = 'block';
        } else {
            if (originalPriceGroup) originalPriceGroup.style.display = 'block';
            if (finalPriceGroup) finalPriceGroup.style.display = 'none';
            if (discountPercentGroup) discountPercentGroup.style.display = 'block';
            if (additionalDiscountGroup) additionalDiscountGroup.style.display = 'none';
            if (couponDiscountGroup) couponDiscountGroup.style.display = 'none';
        }
    }

    function calculate() {
        const calculationMode = document.getElementById('calculationMode').value;
        const originalPrice = parseFloat(document.getElementById('originalPrice')?.value) || 0;
        const discountPercent = parseFloat(document.getElementById('discountPercent')?.value) || 0;
        const additionalDiscount = parseFloat(document.getElementById('additionalDiscount')?.value) || 0;
        const couponDiscount = parseFloat(document.getElementById('couponDiscount')?.value) || 0;
        const finalPrice = parseFloat(document.getElementById('finalPrice')?.value) || 0;
        const quantity = parseFloat(document.getElementById('quantity').value) || 1;
        const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
        const saleType = document.getElementById('saleType').value;

        let calculatedOriginalPrice = originalPrice;
        let calculatedDiscountPercent = discountPercent;
        let calculatedFinalPrice = 0;
        let discountAmount = 0;
        let totalSavings = 0;

        if (calculationMode === 'reverse') {
            // Find original price from final price and discount
            if (finalPrice <= 0 || discountPercent <= 0) {
                alert('Please enter valid final price and discount percentage');
                return;
            }
            calculatedOriginalPrice = finalPrice / (1 - discountPercent/100);
            discountAmount = calculatedOriginalPrice - finalPrice;
            calculatedFinalPrice = finalPrice;
            totalSavings = discountAmount;
        } else if (calculationMode === 'percentage') {
            // Find discount percentage from original and final price
            if (originalPrice <= 0 || finalPrice <= 0) {
                alert('Please enter valid original and final prices');
                return;
            }
            if (finalPrice > originalPrice) {
                alert('Final price cannot be greater than original price');
                return;
            }
            discountAmount = originalPrice - finalPrice;
            calculatedDiscountPercent = (discountAmount / originalPrice) * 100;
            calculatedFinalPrice = finalPrice;
            totalSavings = discountAmount;
        } else if (calculationMode === 'multiple') {
            // Multiple successive discounts
            if (originalPrice <= 0) {
                alert('Please enter valid original price');
                return;
            }

            // Apply first discount
            let priceAfterFirstDiscount = originalPrice * (1 - discountPercent/100);

            // Apply second discount
            let priceAfterSecondDiscount = priceAfterFirstDiscount * (1 - additionalDiscount/100);

            // Apply coupon discount (flat amount)
            let priceAfterCoupon = priceAfterSecondDiscount - couponDiscount;
            priceAfterCoupon = Math.max(0, priceAfterCoupon);

            calculatedFinalPrice = priceAfterCoupon;
            totalSavings = originalPrice - calculatedFinalPrice;
            calculatedDiscountPercent = (totalSavings / originalPrice) * 100;
            discountAmount = totalSavings;
        } else {
            // Standard discount calculation
            if (originalPrice <= 0) {
                alert('Please enter valid original price');
                return;
            }
            discountAmount = originalPrice * (discountPercent / 100);
            calculatedFinalPrice = originalPrice - discountAmount;
            totalSavings = discountAmount;
        }

        // Per item calculations
        const savingsPerItem = totalSavings;
        const finalPricePerItem = calculatedFinalPrice;

        // Total for quantity
        const totalOriginalPrice = calculatedOriginalPrice * quantity;
        const totalFinalPrice = calculatedFinalPrice * quantity;
        const totalDiscountAmount = totalSavings * quantity;

        // Tax calculations
        const taxOnFinalPrice = (totalFinalPrice * taxRate) / 100;
        const finalPriceWithTax = totalFinalPrice + taxOnFinalPrice;

        // Value analysis
        const savingsPercentage = calculatedDiscountPercent;
        const payPercentage = 100 - savingsPercentage;

        // BOGO calculations for special sale type
        let bogoSavings = 0;
        let bogoQuantity = quantity;
        if (saleType === 'bogo') {
            bogoQuantity = Math.floor(quantity / 2) + quantity;
            bogoSavings = (Math.floor(quantity / 2)) * calculatedFinalPrice;
        }

        // Comparison with common discount ranges
        const discountQuality =
            savingsPercentage >= 50 ? 'Excellent Deal' :
            savingsPercentage >= 30 ? 'Great Deal' :
            savingsPercentage >= 20 ? 'Good Deal' :
            savingsPercentage >= 10 ? 'Fair Deal' :
            'Minimal Savings';

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Final Price (per item)</span>
                    <span class="result-value">₹${calculatedFinalPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">You Save</span>
                    <span class="result-value" style="color: #10B981">₹${savingsPerItem.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Discount Percentage</span>
                    <span class="result-value">${calculatedDiscountPercent.toFixed(2)}%</span>
                </div>
                <div class="result-breakdown">
                    <h3>Price Breakdown (Per Item)</h3>
                    <div class="breakdown-item">
                        <span>Original Price:</span>
                        <span>₹${calculatedOriginalPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Discount Amount:</span>
                        <span style="color: #10B981">-₹${savingsPerItem.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Discount Percentage:</span>
                        <span style="color: ${savingsPercentage > 30 ? '#10B981' : savingsPercentage > 15 ? '#F59E0B' : '#6B7280'}">${calculatedDiscountPercent.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Final Price:</span>
                        <span style="font-weight: bold">₹${calculatedFinalPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>You Pay:</span>
                        <span>${payPercentage.toFixed(2)}% of original</span>
                    </div>
                </div>
                ${calculationMode === 'multiple' ? `
                <div class="result-breakdown">
                    <h3>Multiple Discounts Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Original Price:</span>
                        <span>₹${originalPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>After ${discountPercent}% discount:</span>
                        <span>₹${(originalPrice * (1 - discountPercent/100)).toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>After additional ${additionalDiscount}% discount:</span>
                        <span>₹${(originalPrice * (1 - discountPercent/100) * (1 - additionalDiscount/100)).toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>After ₹${couponDiscount} coupon:</span>
                        <span>₹${calculatedFinalPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Effective Total Discount:</span>
                        <span style="color: #10B981">${calculatedDiscountPercent.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Savings:</span>
                        <span style="color: #10B981">₹${totalSavings.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>Total for ${quantity} items</h3>
                    <div class="breakdown-item">
                        <span>Quantity:</span>
                        <span>${quantity} items</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Original Price:</span>
                        <span>₹${totalOriginalPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Discount:</span>
                        <span style="color: #10B981">-₹${totalDiscountAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Final Price:</span>
                        <span style="font-weight: bold">₹${totalFinalPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Savings:</span>
                        <span style="color: #10B981; font-size: 1.1em">₹${totalDiscountAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                ${taxRate > 0 ? `
                <div class="result-breakdown">
                    <h3>Price with Tax (GST ${taxRate}%)</h3>
                    <div class="breakdown-item">
                        <span>Final Price (Before Tax):</span>
                        <span>₹${totalFinalPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>GST Amount:</span>
                        <span>₹${taxOnFinalPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Final Price (With Tax):</span>
                        <span style="font-weight: bold">₹${finalPriceWithTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>You Still Save:</span>
                        <span style="color: #10B981">₹${(totalDiscountAmount - taxOnFinalPrice).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                ` : ''}
                ${saleType === 'bogo' ? `
                <div class="result-breakdown">
                    <h3>Buy 1 Get 1 Offer</h3>
                    <div class="breakdown-item">
                        <span>Items You Pay For:</span>
                        <span>${quantity} items</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Free Items:</span>
                        <span>${Math.floor(quantity / 2)} items</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Items You Get:</span>
                        <span>${bogoQuantity} items</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Regular Discount Savings:</span>
                        <span>₹${totalDiscountAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>BOGO Additional Savings:</span>
                        <span style="color: #10B981">₹${bogoSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Combined Savings:</span>
                        <span style="color: #10B981; font-size: 1.1em">₹${(totalDiscountAmount + bogoSavings).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Effective Price per Item:</span>
                        <span>₹${(totalFinalPrice / bogoQuantity).toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                    </div>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>Deal Analysis</h3>
                    <div class="breakdown-item">
                        <span>Discount Quality:</span>
                        <span style="color: ${savingsPercentage >= 30 ? '#10B981' : savingsPercentage >= 15 ? '#F59E0B' : '#6B7280'}">${discountQuality}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Savings Percentage:</span>
                        <span>${savingsPercentage.toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Value for Money:</span>
                        <span>${savingsPercentage >= 40 ? '⭐⭐⭐⭐⭐ Exceptional' : savingsPercentage >= 30 ? '⭐⭐⭐⭐ Excellent' : savingsPercentage >= 20 ? '⭐⭐⭐ Good' : savingsPercentage >= 10 ? '⭐⭐ Fair' : '⭐ Average'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Original vs Final:</span>
                        <span>Paying ${payPercentage.toFixed(0)}%, Saving ${savingsPercentage.toFixed(0)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Comparison with Common Sales</h3>
                    <div class="breakdown-item">
                        <span>Typical Flash Sale (40-60%):</span>
                        <span>${savingsPercentage >= 40 ? '✓ Better or equal' : '✗ Lower discount'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Festive Sale (25-40%):</span>
                        <span>${savingsPercentage >= 25 ? '✓ Better or equal' : '✗ Lower discount'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Regular Sale (10-25%):</span>
                        <span>${savingsPercentage >= 10 ? '✓ Better or equal' : '✗ Lower discount'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Clearance Sale (50-70%):</span>
                        <span>${savingsPercentage >= 50 ? '✓ Better or equal' : '✗ Lower discount'}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Shopping Tips</h3>
                    <div class="breakdown-item">
                        <span>Best Time to Buy:</span>
                        <span>${savingsPercentage >= 30 ? '✓ Great time to purchase!' : '⚠ Consider waiting for better deals'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Recommendation:</span>
                        <span>${savingsPercentage >= 40 ? 'Excellent deal - buy now!' : savingsPercentage >= 25 ? 'Good discount - worth buying' : savingsPercentage >= 15 ? 'Decent savings available' : 'Consider comparing prices elsewhere'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Bulk Purchase Benefit:</span>
                        <span>${quantity > 1 ? `Saving ₹${totalDiscountAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})} on ${quantity} items` : 'Buy more to maximize savings'}</span>
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
            trackCalculation('discount', {
                originalPrice: calculatedOriginalPrice,
                discountPercent: calculatedDiscountPercent,
                finalPrice: calculatedFinalPrice,
                savings: totalSavings,
                quantity
            }, {
                value: 'high-cpc',
                savingsInThousands: totalDiscountAmount/1000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for discount calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
