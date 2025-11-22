/**
 * Professional Tax Calculator
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
            <div class="calc-input-group">
                <label>Monthly Salary (₹)</label>
                <input type="number" class="calc-input" id="monthlySalary" placeholder="Enter monthly salary" value="50000">
            </div>
            <div class="calc-input-group">
                <label>Select State</label>
                <select class="calc-input" id="state">
                    <option value="maharashtra">Maharashtra</option>
                    <option value="karnataka" selected>Karnataka</option>
                    <option value="westbengal">West Bengal</option>
                    <option value="tamilnadu">Tamil Nadu</option>
                    <option value="andhrapradesh">Andhra Pradesh</option>
                    <option value="telangana">Telangana</option>
                    <option value="meghalaya">Meghalaya</option>
                    <option value="assam">Assam</option>
                    <option value="nostate">No Professional Tax State</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Employment Type</label>
                <select class="calc-input" id="employmentType">
                    <option value="salaried" selected>Salaried Employee</option>
                    <option value="professional">Professional/Self-Employed</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const monthlySalary = parseFloat(document.getElementById('monthlySalary').value) || 0;
        const state = document.getElementById('state').value;
        const employmentType = document.getElementById('employmentType').value;

        if (monthlySalary <= 0) {
            alert('Please enter a valid monthly salary');
            return;
        }

        const annualSalary = monthlySalary * 12;

        // Calculate Professional Tax based on state
        const ptDetails = calculateProfessionalTax(monthlySalary, annualSalary, state, employmentType);

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Monthly Professional Tax</span>
                    <span class="result-value">₹${ptDetails.monthlyPT.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Annual Professional Tax</span>
                    <span class="result-value">₹${ptDetails.annualPT.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">State</span>
                    <span class="result-value">${ptDetails.stateName}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">PT as % of Salary</span>
                    <span class="result-value">${ptDetails.ptPercent.toFixed(2)}%</span>
                </div>
                <div class="result-breakdown">
                    <h3>Salary Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Monthly Gross Salary:</span>
                        <span>₹${monthlySalary.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Professional Tax:</span>
                        <span>₹${ptDetails.monthlyPT.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Net (After PT):</span>
                        <span>₹${(monthlySalary - ptDetails.monthlyPT).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Annual Summary</h3>
                    <div class="breakdown-item">
                        <span>Annual Gross Salary:</span>
                        <span>₹${annualSalary.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Professional Tax:</span>
                        <span>₹${ptDetails.annualPT.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Net (After PT):</span>
                        <span>₹${(annualSalary - ptDetails.annualPT).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>${ptDetails.stateName} - PT Slab Rates</h3>
                    ${ptDetails.slabInfo}
                </div>
                <div class="result-breakdown">
                    <h3>Important Information</h3>
                    <div class="breakdown-item" style="display: block; padding: 10px; background: #f3f4f6; border-radius: 4px;">
                        <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                            <li>Professional Tax is a state-level tax on employment and professions</li>
                            <li>Employer deducts PT from salary and remits to state government</li>
                            <li>PT paid is deductible from taxable income under Section 16(iii)</li>
                            <li>Maximum PT limit: ₹2,500 per year in most states</li>
                            <li>${ptDetails.additionalInfo}</li>
                        </ul>
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
            trackCalculation('professional-tax-calculator', {
                monthlySalary,
                annualSalary,
                state,
                annualPT: ptDetails.annualPT
            }, {
                value: 'high-cpc',
                salaryInLakhs: annualSalary/100000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function calculateProfessionalTax(monthlySalary, annualSalary, state, employmentType) {
        let monthlyPT = 0;
        let annualPT = 0;
        let stateName = '';
        let slabInfo = '';
        let additionalInfo = '';

        switch(state) {
            case 'maharashtra':
                stateName = 'Maharashtra';
                if (monthlySalary <= 7500) {
                    monthlyPT = 0;
                } else if (monthlySalary <= 10000) {
                    monthlyPT = 175;
                } else {
                    monthlyPT = 200;
                }
                // February has PT of 300
                annualPT = (monthlyPT * 11) + Math.min(monthlyPT + 100, 300);
                slabInfo = `
                    <div class="breakdown-item"><span>Up to ₹7,500/month:</span><span>Nil</span></div>
                    <div class="breakdown-item"><span>₹7,501 to ₹10,000/month:</span><span>₹175</span></div>
                    <div class="breakdown-item"><span>Above ₹10,000/month:</span><span>₹200 (₹300 in Feb)</span></div>
                    <div class="breakdown-item"><span>Maximum PT per year:</span><span>₹2,500</span></div>
                `;
                additionalInfo = 'In Maharashtra, February has higher PT (₹300 instead of ₹200)';
                break;

            case 'karnataka':
                stateName = 'Karnataka';
                if (monthlySalary <= 15000) {
                    monthlyPT = 0;
                } else {
                    monthlyPT = 200;
                }
                annualPT = monthlyPT * 12;
                if (annualPT > 2500) annualPT = 2500;
                slabInfo = `
                    <div class="breakdown-item"><span>Up to ₹15,000/month:</span><span>Nil</span></div>
                    <div class="breakdown-item"><span>Above ₹15,000/month:</span><span>₹200</span></div>
                    <div class="breakdown-item"><span>Maximum PT per year:</span><span>₹2,500</span></div>
                `;
                additionalInfo = 'Karnataka has one of the simplest PT structures';
                break;

            case 'westbengal':
                stateName = 'West Bengal';
                if (monthlySalary <= 10000) {
                    monthlyPT = 0;
                } else if (monthlySalary <= 15000) {
                    monthlyPT = 110;
                } else if (monthlySalary <= 25000) {
                    monthlyPT = 130;
                } else if (monthlySalary <= 40000) {
                    monthlyPT = 150;
                } else {
                    monthlyPT = 200;
                }
                annualPT = monthlyPT * 12;
                slabInfo = `
                    <div class="breakdown-item"><span>Up to ₹10,000/month:</span><span>Nil</span></div>
                    <div class="breakdown-item"><span>₹10,001 to ₹15,000:</span><span>₹110</span></div>
                    <div class="breakdown-item"><span>₹15,001 to ₹25,000:</span><span>₹130</span></div>
                    <div class="breakdown-item"><span>₹25,001 to ₹40,000:</span><span>₹150</span></div>
                    <div class="breakdown-item"><span>Above ₹40,000:</span><span>₹200</span></div>
                `;
                additionalInfo = 'West Bengal has multiple slab rates based on monthly income';
                break;

            case 'tamilnadu':
                stateName = 'Tamil Nadu';
                if (monthlySalary <= 3500) {
                    monthlyPT = 0;
                } else if (monthlySalary <= 5000) {
                    monthlyPT = 16.67;
                } else if (monthlySalary <= 6000) {
                    monthlyPT = 41.67;
                } else if (monthlySalary <= 10000) {
                    monthlyPT = 83.33;
                } else if (monthlySalary <= 15000) {
                    monthlyPT = 125;
                } else {
                    monthlyPT = 208.33;
                }
                annualPT = monthlyPT * 12;
                slabInfo = `
                    <div class="breakdown-item"><span>Up to ₹3,500/month:</span><span>Nil</span></div>
                    <div class="breakdown-item"><span>₹3,501 to ₹5,000:</span><span>₹16.67</span></div>
                    <div class="breakdown-item"><span>₹5,001 to ₹6,000:</span><span>₹41.67</span></div>
                    <div class="breakdown-item"><span>₹6,001 to ₹10,000:</span><span>₹83.33</span></div>
                    <div class="breakdown-item"><span>₹10,001 to ₹15,000:</span><span>₹125</span></div>
                    <div class="breakdown-item"><span>Above ₹15,000:</span><span>₹208.33</span></div>
                `;
                additionalInfo = 'Tamil Nadu PT is calculated on annual basis and divided by 12';
                break;

            case 'andhrapradesh':
            case 'telangana':
                stateName = state === 'andhrapradesh' ? 'Andhra Pradesh' : 'Telangana';
                if (monthlySalary <= 15000) {
                    monthlyPT = 0;
                } else if (monthlySalary <= 20000) {
                    monthlyPT = 150;
                } else {
                    monthlyPT = 200;
                }
                annualPT = monthlyPT * 12;
                slabInfo = `
                    <div class="breakdown-item"><span>Up to ₹15,000/month:</span><span>Nil</span></div>
                    <div class="breakdown-item"><span>₹15,001 to ₹20,000:</span><span>₹150</span></div>
                    <div class="breakdown-item"><span>Above ₹20,000:</span><span>₹200</span></div>
                `;
                additionalInfo = `${stateName} follows similar PT structure`;
                break;

            case 'meghalaya':
                stateName = 'Meghalaya';
                if (monthlySalary <= 2500) {
                    monthlyPT = 0;
                } else if (monthlySalary <= 4167) {
                    monthlyPT = 25;
                } else if (monthlySalary <= 6667) {
                    monthlyPT = 50;
                } else if (monthlySalary <= 8333) {
                    monthlyPT = 75;
                } else if (monthlySalary <= 16667) {
                    monthlyPT = 150;
                } else {
                    monthlyPT = 208.33;
                }
                annualPT = monthlyPT * 12;
                slabInfo = `
                    <div class="breakdown-item"><span>Up to ₹2,500/month:</span><span>Nil</span></div>
                    <div class="breakdown-item"><span>₹2,501 to ₹4,167:</span><span>₹25</span></div>
                    <div class="breakdown-item"><span>₹4,168 to ₹6,667:</span><span>₹50</span></div>
                    <div class="breakdown-item"><span>₹6,668 to ₹8,333:</span><span>₹75</span></div>
                    <div class="breakdown-item"><span>₹8,334 to ₹16,667:</span><span>₹150</span></div>
                    <div class="breakdown-item"><span>Above ₹16,667:</span><span>₹208.33</span></div>
                `;
                additionalInfo = 'Meghalaya has graduated slabs for PT';
                break;

            case 'assam':
                stateName = 'Assam';
                if (monthlySalary <= 10000) {
                    monthlyPT = 0;
                } else if (monthlySalary <= 15000) {
                    monthlyPT = 150;
                } else if (monthlySalary <= 25000) {
                    monthlyPT = 180;
                } else {
                    monthlyPT = 208.33;
                }
                annualPT = monthlyPT * 12;
                slabInfo = `
                    <div class="breakdown-item"><span>Up to ₹10,000/month:</span><span>Nil</span></div>
                    <div class="breakdown-item"><span>₹10,001 to ₹15,000:</span><span>₹150</span></div>
                    <div class="breakdown-item"><span>₹15,001 to ₹25,000:</span><span>₹180</span></div>
                    <div class="breakdown-item"><span>Above ₹25,000:</span><span>₹208.33</span></div>
                `;
                additionalInfo = 'Assam PT is calculated based on monthly income slabs';
                break;

            case 'nostate':
            default:
                stateName = 'Not Applicable';
                monthlyPT = 0;
                annualPT = 0;
                slabInfo = `
                    <div class="breakdown-item"><span>Professional Tax:</span><span>Not applicable in this state</span></div>
                `;
                additionalInfo = 'Many states in India do not levy Professional Tax';
                break;
        }

        const ptPercent = annualSalary > 0 ? (annualPT / annualSalary) * 100 : 0;

        return {
            monthlyPT,
            annualPT,
            stateName,
            slabInfo,
            additionalInfo,
            ptPercent
        };
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for professional-tax-calculator');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
