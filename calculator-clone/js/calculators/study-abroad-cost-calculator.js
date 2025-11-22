/**
 * Study Abroad Cost Calculator Calculator
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
                <label>Destination Country</label>
                <select class="calc-input" id="country">
                    <option value="usa">USA</option>
                    <option value="uk">UK</option>
                    <option value="canada">Canada</option>
                    <option value="australia">Australia</option>
                    <option value="germany">Germany</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Course Duration (years)</label>
                <input type="number" class="calc-input" id="duration" placeholder="Enter course duration" value="2" min="0.5" step="0.5">
            </div>
            <h3 style="margin: 1.5rem 0 1rem; color: var(--text-primary);">Academic Costs</h3>
            <div class="calc-input-group">
                <label>Tuition Fee (per year)</label>
                <input type="number" class="calc-input" id="tuition" placeholder="Enter tuition fee" value="2500000">
            </div>
            <div class="calc-input-group">
                <label>Application Fees</label>
                <input type="number" class="calc-input" id="application" placeholder="Enter application fees" value="50000">
            </div>
            <div class="calc-input-group">
                <label>Books & Supplies (per year)</label>
                <input type="number" class="calc-input" id="books" placeholder="Enter books cost" value="100000">
            </div>
            <h3 style="margin: 1.5rem 0 1rem; color: var(--text-primary);">Living Expenses</h3>
            <div class="calc-input-group">
                <label>Accommodation (per month)</label>
                <input type="number" class="calc-input" id="accommodation" placeholder="Enter accommodation cost" value="80000">
            </div>
            <div class="calc-input-group">
                <label>Food & Groceries (per month)</label>
                <input type="number" class="calc-input" id="food" placeholder="Enter food cost" value="30000">
            </div>
            <div class="calc-input-group">
                <label>Transportation (per month)</label>
                <input type="number" class="calc-input" id="transport" placeholder="Enter transportation cost" value="10000">
            </div>
            <div class="calc-input-group">
                <label>Personal Expenses (per month)</label>
                <input type="number" class="calc-input" id="personal" placeholder="Enter personal expenses" value="15000">
            </div>
            <h3 style="margin: 1.5rem 0 1rem; color: var(--text-primary);">One-Time Costs</h3>
            <div class="calc-input-group">
                <label>Visa & Immigration Fees</label>
                <input type="number" class="calc-input" id="visa" placeholder="Enter visa fees" value="75000">
            </div>
            <div class="calc-input-group">
                <label>Health Insurance (per year)</label>
                <input type="number" class="calc-input" id="insurance" placeholder="Enter insurance cost" value="100000">
            </div>
            <div class="calc-input-group">
                <label>Travel (Airfare)</label>
                <input type="number" class="calc-input" id="travel" placeholder="Enter travel cost" value="150000">
            </div>
        `;
    }

    function calculate() {
        const country = document.getElementById('country').value;
        const duration = parseFloat(document.getElementById('duration').value) || 1;
        const tuition = parseFloat(document.getElementById('tuition').value) || 0;
        const application = parseFloat(document.getElementById('application').value) || 0;
        const books = parseFloat(document.getElementById('books').value) || 0;
        const accommodation = parseFloat(document.getElementById('accommodation').value) || 0;
        const food = parseFloat(document.getElementById('food').value) || 0;
        const transport = parseFloat(document.getElementById('transport').value) || 0;
        const personal = parseFloat(document.getElementById('personal').value) || 0;
        const visa = parseFloat(document.getElementById('visa').value) || 0;
        const insurance = parseFloat(document.getElementById('insurance').value) || 0;
        const travel = parseFloat(document.getElementById('travel').value) || 0;

        // Calculate costs
        const totalTuition = tuition * duration;
        const totalBooks = books * duration;
        const monthlyLiving = accommodation + food + transport + personal;
        const totalLiving = monthlyLiving * 12 * duration;
        const totalInsurance = insurance * duration;
        const oneTimeCosts = application + visa + travel;
        const totalCost = totalTuition + totalBooks + totalLiving + totalInsurance + oneTimeCosts;

        // Convert to lakhs for easier reading
        const totalLakhs = totalCost / 100000;

        // Country names
        const countryNames = {
            'usa': 'USA',
            'uk': 'United Kingdom',
            'canada': 'Canada',
            'australia': 'Australia',
            'germany': 'Germany',
            'other': 'Other'
        };

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Total Study Abroad Cost</span>
                    <span class="result-value">₹${totalCost.toLocaleString('en-IN')}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">In Lakhs</span>
                    <span class="result-value">₹${totalLakhs.toFixed(2)} Lakhs</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Average per Year</span>
                    <span class="result-value">₹${(totalCost/duration).toLocaleString('en-IN')}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Course Details</h3>
                    <div class="breakdown-item">
                        <span>Country:</span>
                        <span>${countryNames[country]}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Duration:</span>
                        <span>${duration} year(s)</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Academic Costs</h3>
                    <div class="breakdown-item">
                        <span>Tuition Fee (${duration} years):</span>
                        <span>₹${totalTuition.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Books & Supplies (${duration} years):</span>
                        <span>₹${totalBooks.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Application Fees:</span>
                        <span>₹${application.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Total Academic:</strong></span>
                        <span><strong>₹${(totalTuition + totalBooks + application).toLocaleString('en-IN')}</strong></span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Living Expenses (${duration} years)</h3>
                    <div class="breakdown-item">
                        <span>Monthly Living Cost:</span>
                        <span>₹${monthlyLiving.toLocaleString('en-IN')}/month</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Accommodation:</span>
                        <span>₹${(accommodation * 12 * duration).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Food & Groceries:</span>
                        <span>₹${(food * 12 * duration).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Transportation:</span>
                        <span>₹${(transport * 12 * duration).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Personal Expenses:</span>
                        <span>₹${(personal * 12 * duration).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Total Living:</strong></span>
                        <span><strong>₹${totalLiving.toLocaleString('en-IN')}</strong></span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Other Costs</h3>
                    <div class="breakdown-item">
                        <span>Visa & Immigration:</span>
                        <span>₹${visa.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Health Insurance (${duration} years):</span>
                        <span>₹${totalInsurance.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Travel (Airfare):</span>
                        <span>₹${travel.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span><strong>Total Other:</strong></span>
                        <span><strong>₹${(oneTimeCosts + totalInsurance).toLocaleString('en-IN')}</strong></span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Cost Distribution</h3>
                    <div class="breakdown-item">
                        <span>Academic Costs:</span>
                        <span>${((totalTuition + totalBooks + application)/totalCost*100).toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Living Expenses:</span>
                        <span>${(totalLiving/totalCost*100).toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Other Costs:</span>
                        <span>${((oneTimeCosts + totalInsurance)/totalCost*100).toFixed(1)}%</span>
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
            trackCalculation('study-abroad-cost', {
                country,
                duration,
                totalCost
            }, {
                value: 'high-cpc',
                totalLakhs
            });
        }

        // Trigger additional ad impressions for high-value calculators
        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        // Placeholder for affiliate content loading
        console.log('Loading affiliate offers for study-abroad-cost');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
