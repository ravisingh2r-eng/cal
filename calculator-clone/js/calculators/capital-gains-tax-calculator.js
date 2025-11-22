/**
 * Capital Gains Tax Calculator
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
                <label>Asset Type</label>
                <select class="calc-input" id="assetType">
                    <option value="equity">Equity (Stocks/Mutual Funds)</option>
                    <option value="property">Property/Real Estate</option>
                    <option value="debt">Debt Mutual Funds</option>
                    <option value="gold">Gold/Unlisted Shares</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>Purchase Price (₹)</label>
                <input type="number" class="calc-input" id="purchasePrice" placeholder="Enter purchase price" value="1000000">
            </div>
            <div class="calc-input-group">
                <label>Sale Price (₹)</label>
                <input type="number" class="calc-input" id="salePrice" placeholder="Enter sale price" value="1500000">
            </div>
            <div class="calc-input-group">
                <label>Purchase Date</label>
                <input type="date" class="calc-input" id="purchaseDate" value="2020-01-01">
            </div>
            <div class="calc-input-group">
                <label>Sale Date</label>
                <input type="date" class="calc-input" id="saleDate" value="2024-01-01">
            </div>
            <div class="calc-input-group" id="indexationGroup" style="display: none;">
                <label>Cost Inflation Index (Purchase Year)</label>
                <input type="number" class="calc-input" id="purchaseCII" placeholder="Enter CII" value="280">
            </div>
            <div class="calc-input-group" id="indexationGroup2" style="display: none;">
                <label>Cost Inflation Index (Sale Year)</label>
                <input type="number" class="calc-input" id="saleCII" placeholder="Enter CII" value="348">
            </div>
            <div class="calc-input-group">
                <label>Improvement Cost (₹) - Optional</label>
                <input type="number" class="calc-input" id="improvementCost" placeholder="Enter improvement cost" value="0">
            </div>
            <div class="calc-input-group">
                <label>Transaction Expenses (₹) - Optional</label>
                <input type="number" class="calc-input" id="transactionCost" placeholder="Enter transaction cost" value="0">
            </div>
        `;

        // Show indexation fields for property
        const assetTypeSelect = document.getElementById('assetType');
        if (assetTypeSelect) {
            assetTypeSelect.addEventListener('change', function() {
                const indexationGroups = document.querySelectorAll('#indexationGroup, #indexationGroup2');
                if (this.value === 'property' || this.value === 'gold') {
                    indexationGroups.forEach(group => group.style.display = 'block');
                } else {
                    indexationGroups.forEach(group => group.style.display = 'none');
                }
            });
        }
    }

    function calculate() {
        const assetType = document.getElementById('assetType').value;
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
        const salePrice = parseFloat(document.getElementById('salePrice').value) || 0;
        const purchaseDate = new Date(document.getElementById('purchaseDate').value);
        const saleDate = new Date(document.getElementById('saleDate').value);
        const improvementCost = parseFloat(document.getElementById('improvementCost').value) || 0;
        const transactionCost = parseFloat(document.getElementById('transactionCost').value) || 0;

        // Calculate holding period in months and years
        const holdingMonths = (saleDate.getFullYear() - purchaseDate.getFullYear()) * 12 +
                              (saleDate.getMonth() - purchaseDate.getMonth());
        const holdingYears = (holdingMonths / 12).toFixed(1);

        // Determine if LTCG or STCG based on asset type
        let isLongTerm = false;
        let ltcgThreshold = 0;
        let stcgRate = 0;
        let ltcgRate = 0;
        let exemptionLimit = 0;

        if (assetType === 'equity') {
            isLongTerm = holdingMonths >= 12;
            stcgRate = 15; // 15% for equity STCG
            ltcgRate = 10; // 10% for equity LTCG above ₹1L
            exemptionLimit = 100000; // ₹1L exemption for equity LTCG
        } else if (assetType === 'property' || assetType === 'gold') {
            isLongTerm = holdingMonths >= 24; // 24 months for property
            stcgRate = 30; // As per income tax slab
            ltcgRate = 20; // 20% with indexation
        } else if (assetType === 'debt') {
            isLongTerm = holdingMonths >= 36; // 36 months for debt MF
            stcgRate = 30; // As per income tax slab
            ltcgRate = 20; // 20% with indexation
        }

        // Calculate cost basis
        let adjustedCost = purchasePrice + improvementCost + transactionCost;

        // Apply indexation for LTCG on property/gold/debt
        if (isLongTerm && (assetType === 'property' || assetType === 'gold' || assetType === 'debt')) {
            const purchaseCII = parseFloat(document.getElementById('purchaseCII').value) || 280;
            const saleCII = parseFloat(document.getElementById('saleCII').value) || 348;
            adjustedCost = (purchasePrice * saleCII / purchaseCII) + improvementCost + transactionCost;
        }

        // Calculate capital gains
        const capitalGains = salePrice - adjustedCost;
        const capitalGainsType = isLongTerm ? 'Long Term Capital Gains (LTCG)' : 'Short Term Capital Gains (STCG)';

        // Calculate tax
        let taxableGains = capitalGains;
        let tax = 0;
        let exemptionUsed = 0;

        if (capitalGains > 0) {
            if (isLongTerm) {
                if (assetType === 'equity') {
                    // Equity LTCG: 10% above ₹1L
                    if (capitalGains > exemptionLimit) {
                        taxableGains = capitalGains - exemptionLimit;
                        exemptionUsed = exemptionLimit;
                        tax = taxableGains * ltcgRate / 100;
                    } else {
                        tax = 0;
                        exemptionUsed = capitalGains;
                    }
                } else {
                    // Property/Gold/Debt LTCG: 20% with indexation
                    tax = capitalGains * ltcgRate / 100;
                }
            } else {
                // STCG
                if (assetType === 'equity') {
                    tax = capitalGains * stcgRate / 100; // 15% for equity
                } else {
                    tax = capitalGains * stcgRate / 100; // 30% for others (slab rate)
                }
            }
        }

        const netProceeds = salePrice - tax;
        const effectiveTaxRate = capitalGains > 0 ? (tax / capitalGains * 100) : 0;

        // Calculate securities transaction tax (STT) for equity
        let stt = 0;
        if (assetType === 'equity') {
            stt = salePrice * 0.00025; // 0.025% on sale
        }

        const totalTaxBurden = tax + stt;

        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-item main-result">
                    <span class="result-label">Capital Gains Tax</span>
                    <span class="result-value">₹${tax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Capital Gains</span>
                    <span class="result-value" style="color: ${capitalGains >= 0 ? '#10B981' : '#EF4444'};">₹${capitalGains.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Net Proceeds (After Tax)</span>
                    <span class="result-value">₹${netProceeds.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="result-breakdown">
                    <h3>Transaction Details</h3>
                    <div class="breakdown-item">
                        <span>Asset Type:</span>
                        <span>${assetType.charAt(0).toUpperCase() + assetType.slice(1)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Purchase Price:</span>
                        <span>₹${purchasePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Sale Price:</span>
                        <span>₹${salePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Holding Period:</span>
                        <span>${holdingYears} years (${holdingMonths} months)</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Gain Type:</span>
                        <span style="font-weight: 600; color: ${isLongTerm ? '#10B981' : '#F59E0B'};">${capitalGainsType}</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Cost Basis Calculation</h3>
                    <div class="breakdown-item">
                        <span>Purchase Price:</span>
                        <span>₹${purchasePrice.toLocaleString('en-IN')}</span>
                    </div>
                    ${improvementCost > 0 ? `
                    <div class="breakdown-item">
                        <span>Improvement Cost:</span>
                        <span>₹${improvementCost.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${transactionCost > 0 ? `
                    <div class="breakdown-item">
                        <span>Transaction Expenses:</span>
                        <span>₹${transactionCost.toLocaleString('en-IN')}</span>
                    </div>` : ''}
                    ${isLongTerm && (assetType === 'property' || assetType === 'gold' || assetType === 'debt') ? `
                    <div class="breakdown-item">
                        <span>Indexation Applied:</span>
                        <span style="color: #10B981;">Yes (CII Ratio: ${(parseFloat(document.getElementById('saleCII').value) / parseFloat(document.getElementById('purchaseCII').value)).toFixed(2)})</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Indexed Cost:</span>
                        <span>₹${adjustedCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>` : `
                    <div class="breakdown-item">
                        <span>Total Cost Basis:</span>
                        <span>₹${adjustedCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>`}
                </div>
                <div class="result-breakdown">
                    <h3>Capital Gains Calculation</h3>
                    <div class="breakdown-item">
                        <span>Sale Proceeds:</span>
                        <span>₹${salePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Less: Cost Basis:</span>
                        <span>₹${adjustedCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Capital Gains:</span>
                        <span style="font-weight: 600;">₹${capitalGains.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ${exemptionUsed > 0 ? `
                    <div class="breakdown-item">
                        <span>Less: LTCG Exemption:</span>
                        <span style="color: #10B981;">₹${exemptionUsed.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Taxable Gains:</span>
                        <span>₹${taxableGains.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>` : ''}
                </div>
                <div class="result-breakdown">
                    <h3>Tax Calculation</h3>
                    <div class="breakdown-item">
                        <span>Tax Rate:</span>
                        <span>${isLongTerm ? ltcgRate : stcgRate}% ${isLongTerm ? '(LTCG)' : '(STCG)'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Capital Gains Tax:</span>
                        <span style="font-weight: 600;">₹${tax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    ${assetType === 'equity' ? `
                    <div class="breakdown-item">
                        <span>Securities Transaction Tax (STT):</span>
                        <span>₹${stt.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Tax Burden:</span>
                        <span style="font-weight: 600;">₹${totalTaxBurden.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>` : ''}
                    <div class="breakdown-item">
                        <span>Effective Tax Rate:</span>
                        <span>${effectiveTaxRate.toFixed(2)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Final Proceeds</h3>
                    <div class="breakdown-item">
                        <span>Sale Price:</span>
                        <span>₹${salePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Less: Tax:</span>
                        <span>₹${(assetType === 'equity' ? totalTaxBurden : tax).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Net Proceeds:</span>
                        <span style="font-weight: 600; color: #10B981;">₹${(salePrice - (assetType === 'equity' ? totalTaxBurden : tax)).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Return on Investment:</span>
                        <span>${((salePrice - purchasePrice) / purchasePrice * 100).toFixed(2)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Post-Tax Return:</span>
                        <span>${((salePrice - (assetType === 'equity' ? totalTaxBurden : tax) - purchasePrice) / purchasePrice * 100).toFixed(2)}%</span>
                    </div>
                </div>
                <div class="result-breakdown">
                    <h3>Tax Rules Summary</h3>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                        <strong>${assetType === 'equity' ? 'Equity (Stocks/MF):' : assetType === 'property' ? 'Property/Real Estate:' : assetType === 'debt' ? 'Debt Mutual Funds:' : 'Gold/Unlisted Shares:'}</strong><br>
                        ${assetType === 'equity' ?
                            '• Short Term: < 12 months - 15% tax<br>• Long Term: ≥ 12 months - 10% tax above ₹1L exemption<br>• STT: 0.025% on sale value' :
                            assetType === 'property' ?
                            '• Short Term: < 24 months - As per income tax slab (30%)<br>• Long Term: ≥ 24 months - 20% tax with indexation benefit' :
                            assetType === 'debt' ?
                            '• Short Term: < 36 months - As per income tax slab (30%)<br>• Long Term: ≥ 36 months - 20% tax with indexation benefit' :
                            '• Short Term: < 24 months - As per income tax slab (30%)<br>• Long Term: ≥ 24 months - 20% tax with indexation benefit'
                        }
                    </p>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline" onclick="window.print()">Print</button>
                    <button class="btn btn-outline" id="shareResult">Share</button>
                </div>
            `;
        }

        if (typeof trackCalculation === 'function') {
            trackCalculation('capital-gains-tax', {
                assetType,
                capitalGains,
                tax,
                isLongTerm
            }, {
                value: 'high-cpc',
                tax
            });
        }

        if (window.AdManager && window.AdManager.refresh) {
            setTimeout(() => window.AdManager.refresh('ad-slot-bottom'), 2000);
        }
    }

    function loadAffiliateOffers() {
        console.log('Loading affiliate offers for capital-gains-tax');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
