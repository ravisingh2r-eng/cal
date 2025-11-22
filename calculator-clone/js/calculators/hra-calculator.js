/**
 * HRA (House Rent Allowance) Calculator
 * Calculate HRA tax exemption under Indian Income Tax Act
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

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculate();
        });
    }

    function createInputFields() {
        const container = document.getElementById('calculatorInputs');
        if (!container) return;

        container.innerHTML = `
            <div class="input-group">
                <label for="basicSalary">Basic Salary (Annual - ₹)</label>
                <input type="number" id="basicSalary" placeholder="Annual basic salary" min="0" step="1000" value="600000">
            </div>

            <div class="input-group">
                <label for="da">Dearness Allowance (Annual - ₹)</label>
                <input type="number" id="da" placeholder="Annual DA (if any)" min="0" step="1000" value="0">
            </div>

            <div class="input-group">
                <label for="hraReceived">HRA Received (Annual - ₹)</label>
                <input type="number" id="hraReceived" placeholder="Annual HRA received" min="0" step="1000" value="180000">
            </div>

            <div class="input-group">
                <label for="rentPaid">Rent Paid (Annual - ₹)</label>
                <input type="number" id="rentPaid" placeholder="Annual rent paid" min="0" step="1000" value="240000">
            </div>

            <div class="input-group">
                <label for="city">City Type</label>
                <select id="city">
                    <option value="metro">Metro City (Mumbai, Delhi, Kolkata, Chennai)</option>
                    <option value="nonmetro">Non-Metro City</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const basicSalary = parseFloat(document.getElementById('basicSalary').value);
        const da = parseFloat(document.getElementById('da').value) || 0;
        const hraReceived = parseFloat(document.getElementById('hraReceived').value);
        const rentPaid = parseFloat(document.getElementById('rentPaid').value);
        const city = document.getElementById('city').value;

        if (isNaN(basicSalary) || isNaN(hraReceived) || isNaN(rentPaid)) {
            alert('Please enter valid amounts');
            return;
        }

        if (basicSalary <= 0 || hraReceived <= 0 || rentPaid <= 0) {
            alert('Please enter positive amounts');
            return;
        }

        const basicPlusDA = basicSalary + da;
        
        // HRA exemption is minimum of:
        // 1. Actual HRA received
        // 2. 50% of (Basic + DA) for metro, 40% for non-metro
        // 3. Rent paid - 10% of (Basic + DA)

        const percentage = city === 'metro' ? 0.50 : 0.40;
        const condition1 = hraReceived;
        const condition2 = basicPlusDA * percentage;
        const condition3 = rentPaid - (basicPlusDA * 0.10);

        const hraExempt = Math.max(0, Math.min(condition1, condition2, condition3));
        const hraTaxable = hraReceived - hraExempt;

        // Assuming 30% tax bracket for illustration
        const taxSaved30 = hraExempt * 0.30;
        const taxSaved20 = hraExempt * 0.20;

        displayResults(hraReceived, hraExempt, hraTaxable, condition1, condition2, condition3, taxSaved30, taxSaved20);

        if (typeof trackCalculation === 'function') {
            trackCalculation('hra', { basicSalary, rentPaid, city }, { hraExempt });
        }

        setTimeout(() => {
            if (typeof AdManager !== 'undefined' && AdManager.refresh) {
                AdManager.refresh();
            }
        }, 2000);
    }

    function displayResults(received, exempt, taxable, c1, c2, c3, tax30, tax20) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <h3>HRA Exemption Calculation</h3>
            <div class="result-item">
                <span class="result-label">HRA Received</span>
                <span class="result-value">₹${received.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>
            <div class="result-item highlight">
                <span class="result-label">HRA Exempt from Tax</span>
                <span class="result-value">₹${exempt.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>
            <div class="result-item">
                <span class="result-label">HRA Taxable</span>
                <span class="result-value">₹${taxable.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">Exemption Conditions (Minimum is Exempt)</h4>
            <div class="result-item">
                <span class="result-label">Actual HRA Received</span>
                <span class="result-value">₹${c1.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>
            <div class="result-item">
                <span class="result-label">50%/40% of (Basic + DA)</span>
                <span class="result-value">₹${c2.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Rent Paid - 10% of (Basic + DA)</span>
                <span class="result-value">₹${c3.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">Tax Savings (Illustrative)</h4>
            <div class="result-item">
                <span class="result-label">If in 30% Tax Bracket</span>
                <span class="result-value">₹${tax30.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>
            <div class="result-item">
                <span class="result-label">If in 20% Tax Bracket</span>
                <span class="result-value">₹${tax20.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>

            <div style="margin-top: 15px; padding: 10px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <strong>Note:</strong> HRA exemption is only available if you live in rented accommodation. Not applicable if living in own house.
            </div>
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();