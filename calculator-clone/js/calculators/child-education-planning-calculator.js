/**
 * Child Education Planning Calculator
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
                <label>Child's Current Age (years)</label>
                <input type="number" class="calc-input" id="currentAge" placeholder="Enter current age" value="5" min="0" max="25">
            </div>
            <div class="calc-input-group">
                <label>Target Education Age (years)</label>
                <select class="calc-input" id="targetAge">
                    <option value="18">18 years (Undergraduate)</option>
                    <option value="21" selected>21 years (Postgraduate)</option>
                    <option value="22">22 years (MBA/Professional)</option>
                    <option value="25">25 years (Specialization)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Current Education Cost (₹)</label>
                <input type="number" class="calc-input" id="currentCost" placeholder="Current cost" value="1500000">
            </div>
            <div class="calc-input-group">
                <label>Education Inflation Rate (%)</label>
                <select class="calc-input" id="inflationRate">
                    <option value="8">8% (Conservative)</option>
                    <option value="10" selected>10% (Average)</option>
                    <option value="12">12% (High)</option>
                    <option value="15">15% (Premium Institutions)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Expected Return on Investment (%)</label>
                <select class="calc-input" id="expectedReturn">
                    <option value="8">8% (Debt Funds)</option>
                    <option value="10">10% (Balanced)</option>
                    <option value="12" selected>12% (Equity)</option>
                    <option value="15">15% (Aggressive Equity)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Current Savings for Education (₹)</label>
                <input type="number" class="calc-input" id="currentSavings" placeholder="Existing corpus" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Education Type</label>
                <select class="calc-input" id="educationType">
                    <option value="india-engineering">India - Engineering</option>
                    <option value="india-medical">India - Medical</option>
                    <option value="india-mba">India - MBA</option>
                    <option value="abroad-undergrad" selected>Abroad - Undergraduate</option>
                    <option value="abroad-postgrad">Abroad - Postgraduate</option>
                    <option value="abroad-mba">Abroad - MBA</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Consider Sukanya Samriddhi Yojana (for girl child)?</label>
                <select class="calc-input" id="sukanyaOption">
                    <option value="no">No</option>
                    <option value="yes">Yes (Girl child ≤10 years)</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const currentAge = parseFloat(document.getElementById('currentAge').value) || 0;
        const targetAge = parseFloat(document.getElementById('targetAge').value) || 18;
        const currentCost = parseFloat(document.getElementById('currentCost').value) || 0;
        const inflationRate = parseFloat(document.getElementById('inflationRate').value) || 10;
        const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) || 12;
        const currentSavings = parseFloat(document.getElementById('currentSavings').value) || 0;
        const educationType = document.getElementById('educationType').value;
        const sukanyaOption = document.getElementById('sukanyaOption').value;

        if (currentAge >= targetAge) {
            alert('Target age must be greater than current age');
            return;
        }

        if (currentCost <= 0) {
            alert('Please enter valid education cost');
            return;
        }

        const yearsToGo = targetAge - currentAge;
        const monthsToGo = yearsToGo * 12;

        // Calculate future education cost
        const futureEducationCost = currentCost * Math.pow(1 + inflationRate/100, yearsToGo);

        // Calculate future value of current savings
        const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + expectedReturn/100, yearsToGo);

        // Additional corpus needed
        const additionalCorpusNeeded = Math.max(0, futureEducationCost - futureValueOfCurrentSavings);

        // Calculate monthly SIP needed
        const monthlyRate = expectedReturn / 12 / 100;
        const monthlySIP = additionalCorpusNeeded * monthlyRate /
                          (Math.pow(1 + monthlyRate, monthsToGo) - 1);

        // Total investment via SIP
        const totalSIPInvestment = monthlySIP * monthsToGo;

        // Returns generated
        const returnsGenerated = additionalCorpusNeeded - totalSIPInvestment;

        // Calculate with lump sum investment
        const lumpSumNeeded = additionalCorpusNeeded / Math.pow(1 + expectedReturn/100, yearsToGo);

        // Education Loan Comparison
        const loanAmount = futureEducationCost * 0.8; // 80% loan
        const downPayment = futureEducationCost * 0.2; // 20% down payment
        const loanRate = 10.5; // Average education loan rate in India
        const loanTenure = 10; // years
        const loanMonthlyRate = loanRate / 12 / 100;
        const loanMonths = loanTenure * 12;

        const emiAmount = (loanAmount * loanMonthlyRate * Math.pow(1 + loanMonthlyRate, loanMonths)) /
                         (Math.pow(1 + loanMonthlyRate, loanMonths) - 1);
        const totalLoanRepayment = emiAmount * loanMonths;
        const totalLoanInterest = totalLoanRepayment - loanAmount;

        // Sukanya Samriddhi Yojana calculation (if applicable)
        let sukanyaCorpus = 0;
        let sukanyaMonthlyInvestment = 0;
        let sukanyaEligible = false;

        if (sukanyaOption === 'yes' && currentAge <= 10) {
            sukanyaEligible = true;
            const sukanyaRate = 8.2; // Current SSY rate
            const sukanyaMaxAnnual = 150000; // Max annual deposit
            const sukanyaYears = Math.min(yearsToGo, 21 - currentAge); // Max 21 years

            sukanyaMonthlyInvestment = Math.min(monthlySIP, sukanyaMaxAnnual / 12);
            const sukanyaAnnualInvestment = sukanyaMonthlyInvestment * 12;

            // Calculate maturity value (compound interest for 21 years, deposits for 15 years)
            const depositYears = Math.min(15, sukanyaYears);
            sukanyaCorpus = sukanyaAnnualInvestment * ((Math.pow(1 + sukanyaRate/100, depositYears) - 1) / (sukanyaRate/100)) *
                           Math.pow(1 + sukanyaRate/100, Math.max(0, sukanyaYears - depositYears));
        }

        // Step-up SIP calculation (increase SIP by 10% annually)
        const stepUpPercent = 10;
        let stepUpCorpus = 0;
        let stepUpSIP = monthlySIP * 0.7; // Start with 70% of required SIP

        for (let year = 0; year < yearsToGo; year++) {
            const yearlyInvestment = stepUpSIP * 12;
            const yearsRemaining = yearsToGo - year;
            stepUpCorpus += yearlyInvestment * Math.pow(1 + expectedReturn/100, yearsRemaining);
            stepUpSIP = stepUpSIP * (1 + stepUpPercent/100);
        }

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Future Education Cost</span>
                    <span class="result-value">₹${futureEducationCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Required Monthly SIP</span>
                    <span class="result-value">₹${monthlySIP.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Corpus Needed</span>
                    <span class="result-value">₹${additionalCorpusNeeded.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Education Planning Details</h3>
                    <div class="breakdown-item">
                        <span>Child's Current Age:</span>
                        <span>${currentAge} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Target Education Age:</span>
                        <span>${targetAge} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Years to Go:</span>
                        <span>${yearsToGo} years (${monthsToGo} months)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Education Type:</span>
                        <span>${educationType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Current Education Cost:</span>
                        <span>₹${currentCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Education Inflation Rate:</span>
                        <span>${inflationRate}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Future Education Cost:</span>
                        <span>₹${futureEducationCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Cost Increase:</span>
                        <span>${((futureEducationCost/currentCost - 1) * 100).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Investment Plan - Regular SIP</h3>
                    <div class="breakdown-item">
                        <span>Monthly SIP Required:</span>
                        <span>₹${monthlySIP.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Expected Return:</span>
                        <span>${expectedReturn}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total SIP Investment:</span>
                        <span>₹${totalSIPInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Returns Generated:</span>
                        <span>₹${returnsGenerated.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Corpus at Maturity:</span>
                        <span>₹${additionalCorpusNeeded.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Return on Investment:</span>
                        <span>${((returnsGenerated/totalSIPInvestment)*100).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Current Savings Analysis</h3>
                    <div class="breakdown-item">
                        <span>Current Savings:</span>
                        <span>₹${currentSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Future Value of Savings:</span>
                        <span>₹${futureValueOfCurrentSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Growth in ${yearsToGo} Years:</span>
                        <span>₹${(futureValueOfCurrentSavings - currentSavings).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Additional Corpus Needed:</span>
                        <span>₹${additionalCorpusNeeded.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Savings Coverage:</span>
                        <span>${((futureValueOfCurrentSavings/futureEducationCost)*100).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Alternative: Lump Sum Investment</h3>
                    <div class="breakdown-item">
                        <span>One-Time Investment Needed:</span>
                        <span>₹${lumpSumNeeded.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Expected Return:</span>
                        <span>${expectedReturn}% per annum</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Future Value:</span>
                        <span>₹${additionalCorpusNeeded.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Returns Generated:</span>
                        <span>₹${(additionalCorpusNeeded - lumpSumNeeded).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Education Loan vs Savings Comparison</h3>
                    <div class="breakdown-item">
                        <span>Option 1: Savings Approach</span>
                        <span>₹${totalSIPInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Option 2: Education Loan (80%)</span>
                        <span>₹${loanAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan Down Payment (20%):</span>
                        <span>₹${downPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Loan EMI (${loanTenure} years @ ${loanRate}%):</span>
                        <span>₹${emiAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Loan Repayment:</span>
                        <span>₹${totalLoanRepayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Interest Payable:</span>
                        <span>₹${totalLoanInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Savings vs Loan Benefit:</span>
                        <span style="color: ${(totalSIPInvestment < totalLoanRepayment) ? '#10B981' : '#EF4444'}">
                            ₹${Math.abs(totalLoanRepayment - totalSIPInvestment).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                            ${(totalSIPInvestment < totalLoanRepayment) ? '(Savings Better)' : '(Loan Better)'}
                        </span>
                    </div>
                </div>
                ${sukanyaEligible ? `
                <div class="result-breakdown">
                    <h3>Sukanya Samriddhi Yojana (SSY) - Girl Child Benefit</h3>
                    <div class="breakdown-item">
                        <span>Eligibility:</span>
                        <span>✓ Eligible (Girl child ≤10 years)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>SSY Interest Rate:</span>
                        <span>8.2% per annum (Tax-free)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Suggested Monthly Investment:</span>
                        <span>₹${sukanyaMonthlyInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Maturity Corpus (Estimated):</span>
                        <span>₹${sukanyaCorpus.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tax Benefits:</span>
                        <span>Deduction u/s 80C + Tax-free returns</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Additional Corpus Needed:</span>
                        <span>₹${Math.max(0, futureEducationCost - sukanyaCorpus).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>Step-Up SIP Strategy (10% annual increase)</h3>
                    <div class="breakdown-item">
                        <span>Starting Monthly SIP:</span>
                        <span>₹${(monthlySIP * 0.7).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Final Year Monthly SIP:</span>
                        <span>₹${(monthlySIP * 0.7 * Math.pow(1.1, yearsToGo-1)).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Corpus at Maturity:</span>
                        <span>₹${stepUpCorpus.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Advantage:</span>
                        <span>Start with lower SIP, increase with income</span>
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
            trackCalculation('child-education-planning', {
                currentAge,
                targetAge,
                futureEducationCost,
                monthlySIP,
                educationType
            }, {
                value: 'high-cpc',
                corpusInCrores: futureEducationCost/10000000
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for child-education-planning');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
