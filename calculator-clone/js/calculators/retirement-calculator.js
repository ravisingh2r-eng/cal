/**
 * Retirement Calculator
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
                <label>Current Age (years)</label>
                <input type="number" class="calc-input" id="currentAge" placeholder="Enter current age" value="30">
            </div>
            <div class="calc-input-group">
                <label>Retirement Age (years)</label>
                <input type="number" class="calc-input" id="retirementAge" placeholder="Enter retirement age" value="60">
            </div>
            <div class="calc-input-group">
                <label>Life Expectancy (years)</label>
                <input type="number" class="calc-input" id="lifeExpectancy" placeholder="Enter life expectancy" value="85">
            </div>
            <div class="calc-input-group">
                <label>Current Monthly Expenses (₹)</label>
                <input type="number" class="calc-input" id="monthlyExpenses" placeholder="Enter monthly expenses" value="50000">
            </div>
            <div class="calc-input-group">
                <label>Expected Inflation Rate (% p.a.)</label>
                <input type="number" class="calc-input" id="inflationRate" placeholder="Enter inflation rate" value="6" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Current Savings (₹)</label>
                <input type="number" class="calc-input" id="currentSavings" placeholder="Enter current savings" value="500000">
            </div>
            <div class="calc-input-group">
                <label>Monthly Investment (₹)</label>
                <input type="number" class="calc-input" id="monthlyInvestment" placeholder="Enter monthly SIP" value="20000">
            </div>
            <div class="calc-input-group">
                <label>Expected Return (% p.a.)</label>
                <input type="number" class="calc-input" id="expectedReturn" placeholder="Enter expected return" value="12" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Post-Retirement Return (% p.a.)</label>
                <input type="number" class="calc-input" id="postRetirementReturn" placeholder="Enter post-retirement return" value="8" step="0.1">
            </div>
        `;
    }

    function calculate() {
        const currentAge = parseFloat(document.getElementById('currentAge').value) || 30;
        const retirementAge = parseFloat(document.getElementById('retirementAge').value) || 60;
        const lifeExpectancy = parseFloat(document.getElementById('lifeExpectancy').value) || 85;
        const monthlyExpenses = parseFloat(document.getElementById('monthlyExpenses').value) || 50000;
        const inflationRate = parseFloat(document.getElementById('inflationRate').value) || 6;
        const currentSavings = parseFloat(document.getElementById('currentSavings').value) || 0;
        const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) || 20000;
        const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) || 12;
        const postRetirementReturn = parseFloat(document.getElementById('postRetirementReturn').value) || 8;

        const yearsToRetirement = retirementAge - currentAge;
        const yearsInRetirement = lifeExpectancy - retirementAge;

        if (yearsToRetirement <= 0) {
            alert('Retirement age must be greater than current age');
            return;
        }

        // Calculate future monthly expenses at retirement (adjusted for inflation)
        const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflationRate/100, yearsToRetirement);
        const futureAnnualExpenses = futureMonthlyExpenses * 12;

        // Calculate corpus needed at retirement
        // Using present value of annuity formula adjusted for inflation
        const realReturnRate = ((1 + postRetirementReturn/100) / (1 + inflationRate/100)) - 1;
        const monthlyRealReturn = realReturnRate / 12;

        let corpusNeeded = 0;
        if (monthlyRealReturn > 0) {
            corpusNeeded = futureMonthlyExpenses * ((1 - Math.pow(1 + monthlyRealReturn, -yearsInRetirement * 12)) / monthlyRealReturn);
        } else {
            // If real return is 0 or negative, simple calculation
            corpusNeeded = futureMonthlyExpenses * yearsInRetirement * 12;
        }

        // Calculate future value of current savings
        const futureValueCurrentSavings = currentSavings * Math.pow(1 + expectedReturn/100, yearsToRetirement);

        // Calculate future value of monthly investments (SIP)
        const monthlyRate = expectedReturn / 12 / 100;
        const months = yearsToRetirement * 12;
        let futureValueInvestments = 0;

        for (let month = 1; month <= months; month++) {
            futureValueInvestments += monthlyInvestment * Math.pow(1 + monthlyRate, months - month + 1);
        }

        const totalCorpusAccumulated = futureValueCurrentSavings + futureValueInvestments;
        const corpusShortfall = corpusNeeded - totalCorpusAccumulated;

        // Calculate additional monthly investment needed
        let additionalMonthlyInvestment = 0;
        if (corpusShortfall > 0) {
            // Calculate additional SIP needed to cover shortfall
            const futureValueFactor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate);
            additionalMonthlyInvestment = corpusShortfall / futureValueFactor;
        }

        // Total investment calculation
        const totalInvested = currentSavings + (monthlyInvestment * months);
        const wealthGained = totalCorpusAccumulated - totalInvested;

        // Monthly pension calculations
        const monthlyPension = (totalCorpusAccumulated * (postRetirementReturn/100/12));
        const inflationAdjustedPension = (totalCorpusAccumulated * (realReturnRate/12));

        // Calculate replacement ratio
        const replacementRatio = (futureMonthlyExpenses / (monthlyExpenses * Math.pow(1 + inflationRate/100, yearsToRetirement))) * 100;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Retirement Corpus Needed</span>
                    <span class="result-value">₹${corpusNeeded.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Corpus You'll Accumulate</span>
                    <span class="result-value" style="color: ${corpusShortfall > 0 ? '#F59E0B' : '#10B981'};">₹${totalCorpusAccumulated.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                ${corpusShortfall > 0 ? `
                <div class="result-item">
                    <span class="result-label">Corpus Shortfall</span>
                    <span class="result-value" style="color: #EF4444;">₹${corpusShortfall.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                ` : `
                <div class="result-item">
                    <span class="result-label">Surplus Corpus</span>
                    <span class="result-value" style="color: #10B981;">₹${Math.abs(corpusShortfall).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                `}
                <div class="result-breakdown">
                    <h3>Your Retirement Plan</h3>
                    <div class="breakdown-item">
                        <span>Current Age:</span>
                        <span>${currentAge} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Retirement Age:</span>
                        <span>${retirementAge} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Life Expectancy:</span>
                        <span>${lifeExpectancy} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Years to Retirement:</span>
                        <span>${yearsToRetirement} years</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Years in Retirement:</span>
                        <span>${yearsInRetirement} years</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Expense Projections</h3>
                    <div class="breakdown-item">
                        <span>Current Monthly Expenses:</span>
                        <span>₹${monthlyExpenses.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Expenses at Retirement:</span>
                        <span>₹${futureMonthlyExpenses.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Annual Expenses at Retirement:</span>
                        <span>₹${futureAnnualExpenses.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Inflation Rate:</span>
                        <span>${inflationRate}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Expense Multiplier:</span>
                        <span>${(futureMonthlyExpenses / monthlyExpenses).toFixed(2)}x</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Corpus Calculation</h3>
                    <div class="breakdown-item">
                        <span>Corpus Required:</span>
                        <span style="font-weight: 600;">₹${corpusNeeded.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Current Savings:</span>
                        <span>₹${currentSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Future Value of Savings:</span>
                        <span>₹${futureValueCurrentSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Investment:</span>
                        <span>₹${monthlyInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Future Value of Investments:</span>
                        <span>₹${futureValueInvestments.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Corpus Accumulated:</span>
                        <span style="color: #10B981;">₹${totalCorpusAccumulated.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Investment Analysis</h3>
                    <div class="breakdown-item">
                        <span>Total Amount Invested:</span>
                        <span>₹${totalInvested.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Wealth Gained:</span>
                        <span style="color: #10B981;">₹${wealthGained.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Expected Return Rate:</span>
                        <span>${expectedReturn}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Post-Retirement Return:</span>
                        <span>${postRetirementReturn}% p.a.</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Real Return (Post-retirement):</span>
                        <span>${(realReturnRate * 100).toFixed(2)}% p.a.</span>
                    </div>
                </div>
                ${corpusShortfall > 0 ? `
                <div class="result-breakdown">
                    <h3>Action Required</h3>
                    <div class="breakdown-item">
                        <span>Additional Monthly SIP Needed:</span>
                        <span style="color: #EF4444; font-weight: 600;">₹${additionalMonthlyInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Recommended Total Monthly SIP:</span>
                        <span>₹${(monthlyInvestment + additionalMonthlyInvestment).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *Your current investment plan falls short. Increase monthly investment to meet retirement goals.
                    </p>
                </div>
                ` : `
                <div class="result-breakdown">
                    <h3>Congratulations!</h3>
                    <p style="font-size: 0.85rem; color: #10B981; margin-top: 0.5rem;">
                        ✓ You're on track to meet your retirement goals! Your current investment plan will accumulate more than needed.
                    </p>
                </div>
                `}
                <div class="result-breakdown">
                    <h3>Retirement Income Options</h3>
                    <div class="breakdown-item">
                        <span>Monthly Pension (${postRetirementReturn}% return):</span>
                        <span>₹${monthlyPension.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Inflation-Adjusted Pension:</span>
                        <span>₹${inflationAdjustedPension.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Estimated Expenses at Retirement:</span>
                        <span>₹${futureMonthlyExpenses.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Income vs Expenses:</span>
                        <span style="color: ${monthlyPension >= futureMonthlyExpenses ? '#10B981' : '#F59E0B'};">
                            ${monthlyPension >= futureMonthlyExpenses ? 'Sufficient' : 'May need adjustment'}
                        </span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        *Use a mix of equity and debt post-retirement for balanced income and growth
                    </p>
                </div>
                <div class="result-breakdown">
                    <h3>Retirement Investment Options</h3>
                    <ul style="font-size: 0.85rem; color: var(--text-secondary); list-style: inside; margin-top: 0.5rem;">
                        <li>NPS (National Pension System) - Tax benefit + Market returns</li>
                        <li>PPF - Tax-free, 7.1% p.a., 15-year lock-in</li>
                        <li>Equity Mutual Funds - 12-15% long-term returns</li>
                        <li>EPF - Employee Provident Fund - 8.25% p.a.</li>
                        <li>Senior Citizens Savings Scheme (Post-retirement) - 8.2% p.a.</li>
                    </ul>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('retirement', {
                corpusNeeded,
                totalCorpusAccumulated,
                yearsToRetirement
            }, { value: 'high-cpc', shortfall: corpusShortfall });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for retirement');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
