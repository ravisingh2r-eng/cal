/**
 * Startup Cost Calculator Calculator
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
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: var(--text-primary);">One-Time Costs</h3>
            <div class="calc-input-group">
                <label>Legal & Registration Fees (₹)</label>
                <input type="number" class="calc-input" id="legal" placeholder="Enter legal fees" value="50000">
            </div>
            <div class="calc-input-group">
                <label>Equipment & Technology (₹)</label>
                <input type="number" class="calc-input" id="equipment" placeholder="Enter equipment cost" value="200000">
            </div>
            <div class="calc-input-group">
                <label>Office Setup & Furniture (₹)</label>
                <input type="number" class="calc-input" id="office" placeholder="Enter office setup cost" value="150000">
            </div>
            <div class="calc-input-group">
                <label>Initial Inventory (₹)</label>
                <input type="number" class="calc-input" id="inventory" placeholder="Enter inventory cost" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Marketing & Branding (₹)</label>
                <input type="number" class="calc-input" id="marketing" placeholder="Enter marketing cost" value="75000">
            </div>
            <div class="calc-input-group">
                <label>Other One-Time Costs (₹)</label>
                <input type="number" class="calc-input" id="otherOnetime" placeholder="Enter other costs" value="25000">
            </div>
            <h3 style="margin: 1.5rem 0 1rem; color: var(--text-primary);">Monthly Operating Costs</h3>
            <div class="calc-input-group">
                <label>Rent (₹/month)</label>
                <input type="number" class="calc-input" id="rent" placeholder="Enter monthly rent" value="30000">
            </div>
            <div class="calc-input-group">
                <label>Salaries & Wages (₹/month)</label>
                <input type="number" class="calc-input" id="salaries" placeholder="Enter monthly salaries" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Utilities (₹/month)</label>
                <input type="number" class="calc-input" id="utilities" placeholder="Enter monthly utilities" value="10000">
            </div>
            <div class="calc-input-group">
                <label>Insurance (₹/month)</label>
                <input type="number" class="calc-input" id="insurance" placeholder="Enter monthly insurance" value="5000">
            </div>
            <div class="calc-input-group">
                <label>Other Monthly Costs (₹/month)</label>
                <input type="number" class="calc-input" id="otherMonthly" placeholder="Enter other monthly costs" value="15000">
            </div>
            <div class="calc-input-group">
                <label>Planning Period (months)</label>
                <input type="number" class="calc-input" id="months" placeholder="Enter planning period" value="12" min="1">
            </div>
        `;
    }

    function calculate() {
        const legal = parseFloat(document.getElementById('legal').value) || 0;
        const equipment = parseFloat(document.getElementById('equipment').value) || 0;
        const office = parseFloat(document.getElementById('office').value) || 0;
        const inventory = parseFloat(document.getElementById('inventory').value) || 0;
        const marketing = parseFloat(document.getElementById('marketing').value) || 0;
        const otherOnetime = parseFloat(document.getElementById('otherOnetime').value) || 0;
        const rent = parseFloat(document.getElementById('rent').value) || 0;
        const salaries = parseFloat(document.getElementById('salaries').value) || 0;
        const utilities = parseFloat(document.getElementById('utilities').value) || 0;
        const insurance = parseFloat(document.getElementById('insurance').value) || 0;
        const otherMonthly = parseFloat(document.getElementById('otherMonthly').value) || 0;
        const months = parseFloat(document.getElementById('months').value) || 12;

        // Calculate totals
        const totalOnetime = legal + equipment + office + inventory + marketing + otherOnetime;
        const monthlyOperating = rent + salaries + utilities + insurance + otherMonthly;
        const totalOperating = monthlyOperating * months;
        const totalStartupCost = totalOnetime + totalOperating;
        const emergencyBuffer = totalStartupCost * 0.2; // 20% buffer
        const recommendedCapital = totalStartupCost + emergencyBuffer;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Total Startup Cost (${months} months)</span>
                    <span class="result-value">₹${totalStartupCost.toLocaleString('en-IN')}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Recommended Capital (with 20% buffer)</span>
                    <span class="result-value">₹${recommendedCapital.toLocaleString('en-IN')}</span>
                </div>
                <div class="result-breakdown">
                    <h3>One-Time Costs</h3>
                    <div class="breakdown-item">
                        <span>Legal & Registration:</span>
                        <span>₹${legal.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Equipment & Technology:</span>
                        <span>₹${equipment.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Office Setup:</span>
                        <span>₹${office.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Initial Inventory:</span>
                        <span>₹${inventory.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Marketing & Branding:</span>
                        <span>₹${marketing.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Other One-Time:</span>
                        <span>₹${otherOnetime.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Total One-Time:</strong></span>
                        <span><strong>₹${totalOnetime.toLocaleString('en-IN')}</strong></span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Monthly Operating Costs</h3>
                    <div class="breakdown-item">
                        <span>Rent:</span>
                        <span>₹${rent.toLocaleString('en-IN')}/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Salaries & Wages:</span>
                        <span>₹${salaries.toLocaleString('en-IN')}/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Utilities:</span>
                        <span>₹${utilities.toLocaleString('en-IN')}/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Insurance:</span>
                        <span>₹${insurance.toLocaleString('en-IN')}/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Other Monthly:</span>
                        <span>₹${otherMonthly.toLocaleString('en-IN')}/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Monthly Total:</strong></span>
                        <span><strong>₹${monthlyOperating.toLocaleString('en-IN')}/month</strong></span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>${months}-Month Operating Cost:</strong></span>
                        <span><strong>₹${totalOperating.toLocaleString('en-IN')}</strong></span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Summary</h3>
                    <div class="breakdown-item">
                        <span>One-Time Costs:</span>
                        <span>₹${totalOnetime.toLocaleString('en-IN')} (${((totalOnetime/totalStartupCost)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Operating Costs (${months} months):</span>
                        <span>₹${totalOperating.toLocaleString('en-IN')} (${((totalOperating/totalStartupCost)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Emergency Buffer (20%):</span>
                        <span>₹${emergencyBuffer.toLocaleString('en-IN')}</span>
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
            trackCalculation('startup-cost', {
                totalCost: totalStartupCost,
                recommendedCapital,
                months
            }, {
                value: 'high-cpc',
                monthlyBurn: monthlyOperating
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for startup-cost');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
