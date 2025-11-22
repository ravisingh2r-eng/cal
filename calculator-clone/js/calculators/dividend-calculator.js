/**
 * Dividend Income Calculator
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
                <label>Number of Shares</label>
                <input type="number" class="calc-input" id="shares" placeholder="Shares owned" value="1000">
            </div>
            <div class="calc-input-group">
                <label>Dividend per Share (₹)</label>
                <input type="number" class="calc-input" id="dividendPerShare" placeholder="DPS" value="10" step="0.1">
            </div>
            <div class="calc-input-group">
                <label>Current Share Price (₹)</label>
                <input type="number" class="calc-input" id="sharePrice" placeholder="Current market price" value="500">
            </div>
            <div class="calc-input-group">
                <label>Dividend Frequency</label>
                <select class="calc-input" id="frequency">
                    <option value="quarterly">Quarterly</option>
                    <option value="half-yearly">Half Yearly</option>
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Dividend Growth Rate (% p.a.)</label>
                <input type="number" class="calc-input" id="growthRate" placeholder="Annual growth" value="5" step="0.1">
                <small style="color: #666; font-size: 12px;">
                    Expected annual increase in dividend
                </small>
            </div>
            <div class="calc-input-group">
                <label>Projection Period (years)</label>
                <input type="number" class="calc-input" id="projectionYears" placeholder="Future years" value="5">
            </div>
            <div class="calc-input-group">
                <label>Reinvest Dividends?</label>
                <select class="calc-input" id="reinvest">
                    <option value="no">No - Take Cash</option>
                    <option value="yes">Yes - Reinvest (DRIP)</option>
                </select>
            </div>
        `;
    }

    function calculate() {
        const shares = parseFloat(document.getElementById('shares').value) || 0;
        const dividendPerShare = parseFloat(document.getElementById('dividendPerShare').value) || 0;
        const sharePrice = parseFloat(document.getElementById('sharePrice').value) || 0;
        const frequency = document.getElementById('frequency').value;
        const growthRate = parseFloat(document.getElementById('growthRate').value) || 0;
        const projectionYears = parseInt(document.getElementById('projectionYears').value) || 5;
        const reinvest = document.getElementById('reinvest').value === 'yes';

        // Validation
        if (shares <= 0 || dividendPerShare <= 0 || sharePrice <= 0) {
            alert('Please enter valid values for shares, dividend, and share price');
            return;
        }

        // Calculate frequency multiplier
        const frequencyMultipliers = {
            'monthly': 12,
            'quarterly': 4,
            'half-yearly': 2,
            'yearly': 1
        };
        const paymentsPerYear = frequencyMultipliers[frequency];

        // Calculate annual dividend income
        const annualDividend = shares * dividendPerShare;
        const dividendPerPayment = annualDividend / paymentsPerYear;

        // Calculate dividend yield
        const totalInvestment = shares * sharePrice;
        const dividendYield = (annualDividend / totalInvestment) * 100;

        // Project future dividends
        let yearlyProjections = [];
        let cumulativeIncome = 0;
        let currentShares = shares;
        let currentDPS = dividendPerShare;

        for (let year = 1; year <= projectionYears; year++) {
            // Increase DPS by growth rate
            currentDPS = currentDPS * (1 + growthRate / 100);

            // Calculate dividend for this year
            let yearDividend = currentShares * currentDPS;

            if (reinvest) {
                // Calculate shares bought with dividends
                const sharesBought = yearDividend / sharePrice;
                currentShares += sharesBought;
            }

            cumulativeIncome += yearDividend;

            yearlyProjections.push({
                year,
                dividend: yearDividend,
                shares: currentShares,
                dps: currentDPS,
                cumulative: cumulativeIncome
            });
        }

        // Tax calculations (TDS on dividends)
        const tdsRate = 10; // 10% TDS on dividends
        const tdsAmount = annualDividend * (tdsRate / 100);
        const postTaxDividend = annualDividend - tdsAmount;

        // Tax based on income slabs
        const tax30 = annualDividend * 0.30;
        const tax20 = annualDividend * 0.20;
        const tax10 = annualDividend * 0.10;

        // Calculate post-tax income
        const postTax30 = annualDividend - tax30;
        const postTax20 = annualDividend - tax20;
        const postTax10 = annualDividend - tax10;

        // Compare with FD
        const fdRate = 6.5;
        const fdIncome = totalInvestment * (fdRate / 100);
        const extraIncome = annualDividend - fdIncome;

        // Future value if reinvested
        const futureShares = yearlyProjections[projectionYears - 1].shares;
        const futureValue = futureShares * sharePrice;
        const totalReturns = cumulativeIncome + (futureValue - totalInvestment);

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Annual Dividend Income</span>
                    <span class="result-value">₹${annualDividend.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Dividend Yield</span>
                    <span class="result-value">${dividendYield.toFixed(2)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Post-Tax Income (with TDS)</span>
                    <span class="result-value">₹${postTaxDividend.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Investment Details</h3>
                    <div class="breakdown-item">
                        <span>Number of Shares:</span>
                        <span>${shares.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Share Price:</span>
                        <span>₹${sharePrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Investment:</span>
                        <span>₹${totalInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Dividend per Share:</span>
                        <span>₹${dividendPerShare.toFixed(2)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Payment Frequency:</span>
                        <span>${frequency.charAt(0).toUpperCase() + frequency.slice(1).replace('-', ' ')}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Dividend Income Breakdown</h3>
                    <div class="breakdown-item">
                        <span>Annual Dividend:</span>
                        <span style="font-weight: 600;">₹${annualDividend.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Per Payment (${frequency}):</span>
                        <span>₹${dividendPerPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Monthly Average:</span>
                        <span>₹${(annualDividend / 12).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Dividend Yield:</span>
                        <span style="color: ${dividendYield >= 4 ? '#10B981' : '#F59E0B'}; font-weight: 600;">
                            ${dividendYield.toFixed(2)}%
                            ${dividendYield >= 4 ? '✓ Good' : '⚠ Moderate'}
                        </span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax on Dividends (FY 2024-25)</h3>
                    <div class="breakdown-item">
                        <span>Gross Dividend:</span>
                        <span>₹${annualDividend.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>TDS Deducted (10%):</span>
                        <span style="color: #EF4444;">-₹${tdsAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Dividend Received:</span>
                        <span>₹${postTaxDividend.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Post-Tax (10% slab):</span>
                        <span>₹${postTax10.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Post-Tax (20% slab):</span>
                        <span>₹${postTax20.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Post-Tax (30% slab):</span>
                        <span>₹${postTax30.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <p style="color: #666; font-size: 13px; margin-top: 10px;">
                        Note: TDS of 10% is deducted if dividend exceeds ₹5,000 per year. Dividend is taxed as per your income tax slab.
                    </p>
                </div>
                <div class="result-breakdown">
                    <h3>${projectionYears}-Year Dividend Projections (${growthRate}% growth)</h3>
                    ${yearlyProjections.map(proj => `
                        <div class="breakdown-item">
                            <span>Year ${proj.year}:</span>
                            <span>₹${proj.dividend.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                                ${reinvest ? ` (${proj.shares.toFixed(0)} shares)` : ''}
                            </span>
                        </div>
                    `).join('')}
                    <div class="breakdown-item" style="border-top: 1px solid #E5E7EB; padding-top: 10px; margin-top: 10px;">
                        <span>Total Dividend (${projectionYears} years):</span>
                        <span style="font-weight: 600; color: #10B981;">
                            ₹${cumulativeIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                        </span>
                    </div>
                    ${reinvest ? `
                    <div class="breakdown-item">
                        <span>Final Shares Owned:</span>
                        <span style="font-weight: 600;">
                            ${futureShares.toFixed(0)} (from ${shares})
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Portfolio Value:</span>
                        <span style="font-weight: 600;">
                            ₹${futureValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                        </span>
                    </div>
                    ` : ''}
                </div>
                ${reinvest ? `
                <div class="result-breakdown">
                    <h3>DRIP (Dividend Reinvestment) Benefits</h3>
                    <div class="breakdown-item">
                        <span>Initial Shares:</span>
                        <span>${shares.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Shares After ${projectionYears} Years:</span>
                        <span style="color: #10B981;">${futureShares.toFixed(0)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Additional Shares:</span>
                        <span style="color: #10B981;">+${(futureShares - shares).toFixed(0)} shares</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Dividend Income:</span>
                        <span>₹${cumulativeIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Capital Appreciation:</span>
                        <span>₹${(futureValue - totalInvestment).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Returns:</span>
                        <span style="font-weight: 600; color: #10B981;">
                            ₹${totalReturns.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                        </span>
                    </div>
                </div>
                ` : ''}
                <div class="result-breakdown">
                    <h3>Comparison with Fixed Deposit (${fdRate}% p.a.)</h3>
                    <div class="breakdown-item">
                        <span>Investment Amount:</span>
                        <span>₹${totalInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>FD Annual Income:</span>
                        <span>₹${fdIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Dividend Annual Income:</span>
                        <span>₹${annualDividend.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Extra Income vs FD:</span>
                        <span style="color: ${extraIncome >= 0 ? '#10B981' : '#EF4444'}; font-weight: 600;">
                            ₹${Math.abs(extraIncome).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                            ${extraIncome >= 0 ? '✓ Better' : '✗ Lower'}
                        </span>
                    </div>
                    <div class="breakdown-item">
                        <span>Performance:</span>
                        <span style="color: ${extraIncome >= 0 ? '#10B981' : '#EF4444'}; font-weight: 600;">
                            ${extraIncome >= 0 ? 'Dividends outperform FD' : 'FD outperforms Dividends'}
                        </span>
                    </div>
                </div>
                <div class="result-breakdown" style="background: #DBEAFE; border-left: 4px solid #3B82F6; padding: 15px;">
                    <h3 style="color: #1E40AF; margin-top: 0;">📈 Dividend Investing Benefits</h3>
                    <ul style="color: #1E40AF; margin: 8px 0; font-size: 14px; padding-left: 20px;">
                        <li><strong>Regular Income:</strong> Passive income stream without selling shares</li>
                        <li><strong>Compound Growth:</strong> Reinvesting dividends accelerates wealth creation</li>
                        <li><strong>Less Volatile:</strong> Dividend stocks are typically stable, mature companies</li>
                        <li><strong>Inflation Protection:</strong> Dividends often grow with inflation</li>
                        <li><strong>Double Benefit:</strong> Earn dividends + potential capital appreciation</li>
                    </ul>
                </div>
                <div class="result-breakdown" style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px;">
                    <h3 style="color: #92400E; margin-top: 0;">💡 Dividend Tax Changes (Post-2020)</h3>
                    <p style="color: #92400E; margin: 8px 0; font-size: 14px;">
                        <strong>Old System (Pre-2020):</strong> Companies paid DDT (Dividend Distribution Tax) at 15%, shareholders received tax-free dividends.
                    </p>
                    <p style="color: #92400E; margin: 8px 0; font-size: 14px;">
                        <strong>New System (Post-2020):</strong> Companies don't pay DDT. Dividends are taxed in hands of shareholders as per their income tax slab.
                    </p>
                    <p style="color: #92400E; margin: 8px 0; font-size: 14px;">
                        <strong>TDS:</strong> 10% TDS if total dividend exceeds ₹5,000 in a financial year.
                    </p>
                </div>
                <div class="result-breakdown" style="background: #F3F4F6; border-left: 4px solid #6B7280; padding: 15px;">
                    <h3 style="color: #374151; margin-top: 0;">🎯 Good Dividend Yield Benchmarks</h3>
                    <div class="breakdown-item" style="margin: 5px 0;">
                        <span>Excellent Yield:</span>
                        <span style="color: #10B981; font-weight: 600;">Above 6%</span>
                    </div>
                    <div class="breakdown-item" style="margin: 5px 0;">
                        <span>Good Yield:</span>
                        <span style="color: #10B981;">4% - 6%</span>
                    </div>
                    <div class="breakdown-item" style="margin: 5px 0;">
                        <span>Moderate Yield:</span>
                        <span style="color: #F59E0B;">2% - 4%</span>
                    </div>
                    <div class="breakdown-item" style="margin: 5px 0;">
                        <span>Low Yield:</span>
                        <span style="color: #EF4444;">Below 2%</span>
                    </div>
                    <p style="color: #666; font-size: 12px; margin-top: 8px;">
                        Note: Higher yield isn't always better. Check dividend sustainability and company fundamentals.
                    </p>
                </div>
                <div class="result-breakdown" style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 15px;">
                    <h3 style="color: #065F46; margin-top: 0;">💰 Top Dividend-Paying Sectors in India</h3>
                    <ul style="color: #065F46; margin: 8px 0; font-size: 14px; padding-left: 20px;">
                        <li><strong>PSU Banks:</strong> SBI, PNB, Bank of Baroda</li>
                        <li><strong>Oil & Gas:</strong> ONGC, Coal India, IOC</li>
                        <li><strong>Power:</strong> NTPC, Power Grid, NHPC</li>
                        <li><strong>Metal & Mining:</strong> Vedanta, Hindustan Zinc</li>
                        <li><strong>FMCG:</strong> ITC, HUL, Nestle</li>
                    </ul>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        // Track high-value calculation
        if (typeof trackCalculation === 'function') {
            trackCalculation('dividend', { shares, annualDividend, dividendYield }, { value: 'high-cpc' });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for dividend');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
