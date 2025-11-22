/**
 * EMI Calculator Logic
 * Calculates Equated Monthly Installment with amortization schedule
 */

(function() {
    'use strict';

    let tenureType = 'years';
    let chart = null;

    /**
     * Initialize EMI calculator
     */
    function init() {
        setupEventListeners();
        syncInputsWithSliders();
        loadSavedInputs();
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Calculate button
        document.getElementById('calculateBtn')?.addEventListener('click', calculate);

        // Reset button
        document.getElementById('resetBtn')?.addEventListener('click', reset);

        // Tenure toggle
        document.querySelectorAll('.tenure-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tenure-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                tenureType = e.target.dataset.type;
                updateTenureSlider();
            });
        });

        // Sync inputs with sliders
        document.getElementById('loanAmountSlider')?.addEventListener('input', (e) => {
            document.getElementById('loanAmount').value = e.target.value;
        });

        document.getElementById('interestRateSlider')?.addEventListener('input', (e) => {
            document.getElementById('interestRate').value = e.target.value;
        });

        document.getElementById('loanTenureSlider')?.addEventListener('input', (e) => {
            document.getElementById('loanTenure').value = e.target.value;
        });

        // Sync sliders with inputs
        document.getElementById('loanAmount')?.addEventListener('input', (e) => {
            document.getElementById('loanAmountSlider').value = e.target.value;
        });

        document.getElementById('interestRate')?.addEventListener('input', (e) => {
            document.getElementById('interestRateSlider').value = e.target.value;
        });

        document.getElementById('loanTenure')?.addEventListener('input', (e) => {
            document.getElementById('loanTenureSlider').value = e.target.value;
        });

        // Share, print, download buttons
        document.getElementById('shareBtn')?.addEventListener('click', shareResults);
        document.getElementById('printBtn')?.addEventListener('click', printResults);
        document.getElementById('downloadBtn')?.addEventListener('click', downloadPDF);

        // Enter key to calculate
        document.querySelectorAll('.calc-input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') calculate();
            });
        });
    }

    /**
     * Sync inputs with sliders
     */
    function syncInputsWithSliders() {
        const loanAmount = document.getElementById('loanAmount');
        const loanAmountSlider = document.getElementById('loanAmountSlider');

        if (loanAmount && loanAmountSlider) {
            loanAmountSlider.value = loanAmount.value;
        }

        const interestRate = document.getElementById('interestRate');
        const interestRateSlider = document.getElementById('interestRateSlider');

        if (interestRate && interestRateSlider) {
            interestRateSlider.value = interestRate.value;
        }

        const loanTenure = document.getElementById('loanTenure');
        const loanTenureSlider = document.getElementById('loanTenureSlider');

        if (loanTenure && loanTenureSlider) {
            loanTenureSlider.value = loanTenure.value;
        }
    }

    /**
     * Update tenure slider based on type
     */
    function updateTenureSlider() {
        const slider = document.getElementById('loanTenureSlider');
        const input = document.getElementById('loanTenure');

        if (tenureType === 'years') {
            slider.max = 30;
            slider.value = Math.min(input.value, 30);
            input.value = slider.value;
        } else {
            slider.max = 360;
            slider.value = Math.min(input.value, 360);
            input.value = slider.value;
        }
    }

    /**
     * Calculate EMI
     */
    function calculate() {
        // Get input values
        const principal = parseFloat(document.getElementById('loanAmount')?.value || 0);
        const annualRate = parseFloat(document.getElementById('interestRate')?.value || 0);
        let tenure = parseFloat(document.getElementById('loanTenure')?.value || 0);

        // Validation
        if (principal <= 0 || annualRate <= 0 || tenure <= 0) {
            APP.showNotification('Please enter valid values', 'error');
            return;
        }

        // Convert tenure to months if in years
        const tenureMonths = tenureType === 'years' ? tenure * 12 : tenure;

        // Calculate EMI using formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
        const monthlyRate = annualRate / 12 / 100;
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

        const totalAmount = emi * tenureMonths;
        const totalInterest = totalAmount - principal;

        // Display results
        displayResults(emi, principal, totalInterest, totalAmount);

        // Generate amortization schedule
        generateAmortization(principal, monthlyRate, tenureMonths, emi);

        // Create chart
        createChart(principal, totalInterest);

        // Show results
        document.getElementById('resultsCard').style.display = 'block';
        document.getElementById('amortizationCard').style.display = 'block';

        // Save calculation
        saveCalculation({
            principal,
            annualRate,
            tenure: tenureMonths,
            emi,
            totalInterest,
            totalAmount
        });

        // Track event
        if (typeof trackCalculation === 'function') {
            trackCalculation('emi', {
                loan_amount: principal,
                interest_rate: annualRate,
                tenure: tenureMonths
            }, { emi: emi.toFixed(2) });
        }

        // Scroll to results
        document.getElementById('resultsCard').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Display results
     */
    function displayResults(emi, principal, totalInterest, totalAmount) {
        document.getElementById('emiAmount').textContent = APP.formatCurrency(emi, 0);
        document.getElementById('principalAmount').textContent = APP.formatCurrency(principal, 0);
        document.getElementById('totalInterest').textContent = APP.formatCurrency(totalInterest, 0);
        document.getElementById('totalAmount').textContent = APP.formatCurrency(totalAmount, 0);
    }

    /**
     * Generate amortization schedule
     */
    function generateAmortization(principal, monthlyRate, tenureMonths, emi) {
        const tbody = document.getElementById('amortizationBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        let balance = principal;
        let year = 1;
        let yearlyData = {
            opening: principal,
            emiPaid: 0,
            principal: 0,
            interest: 0
        };

        for (let month = 1; month <= tenureMonths; month++) {
            const interest = balance * monthlyRate;
            const principalPaid = emi - interest;
            balance -= principalPaid;

            yearlyData.emiPaid += emi;
            yearlyData.principal += principalPaid;
            yearlyData.interest += interest;

            // Add row for each year
            if (month % 12 === 0 || month === tenureMonths) {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${year}</td>
                    <td>${APP.formatCurrency(yearlyData.opening, 0)}</td>
                    <td>${APP.formatCurrency(yearlyData.emiPaid, 0)}</td>
                    <td>${APP.formatCurrency(yearlyData.principal, 0)}</td>
                    <td>${APP.formatCurrency(yearlyData.interest, 0)}</td>
                    <td>${APP.formatCurrency(Math.max(0, balance), 0)}</td>
                `;

                // Reset for next year
                year++;
                yearlyData = {
                    opening: balance,
                    emiPaid: 0,
                    principal: 0,
                    interest: 0
                };
            }
        }
    }

    /**
     * Create pie chart for principal vs interest
     */
    function createChart(principal, totalInterest) {
        const canvas = document.getElementById('emiChart');
        if (!canvas) return;

        // Destroy existing chart
        if (chart) {
            chart.destroy();
        }

        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded');
            return;
        }

        const ctx = canvas.getContext('2d');
        chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal Amount', 'Total Interest'],
                datasets: [{
                    data: [principal, totalInterest],
                    backgroundColor: ['#4F46E5', '#F59E0B'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + APP.formatCurrency(context.parsed, 0);
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Reset calculator
     */
    function reset() {
        document.getElementById('loanAmount').value = 1000000;
        document.getElementById('interestRate').value = 8.5;
        document.getElementById('loanTenure').value = 20;

        syncInputsWithSliders();

        document.getElementById('resultsCard').style.display = 'none';
        document.getElementById('amortizationCard').style.display = 'none';

        if (chart) {
            chart.destroy();
            chart = null;
        }
    }

    /**
     * Save calculation to storage
     */
    function saveCalculation(data) {
        if (typeof StorageManager !== 'undefined') {
            StorageManager.saveCalculation('emi', data, data.emi);
        }
    }

    /**
     * Load saved inputs
     */
    function loadSavedInputs() {
        // Load from storage or URL parameters
        const params = new URLSearchParams(window.location.search);
        if (params.has('amount')) {
            document.getElementById('loanAmount').value = params.get('amount');
        }
        if (params.has('rate')) {
            document.getElementById('interestRate').value = params.get('rate');
        }
        if (params.has('tenure')) {
            document.getElementById('loanTenure').value = params.get('tenure');
        }

        syncInputsWithSliders();
    }

    /**
     * Share results
     */
    function shareResults() {
        const emi = document.getElementById('emiAmount')?.textContent || '';
        const principal = document.getElementById('principalAmount')?.textContent || '';

        const shareData = {
            title: 'EMI Calculator Result',
            text: `Monthly EMI: ${emi} for loan of ${principal}`,
            url: window.location.href
        };

        if (typeof ShareManager !== 'undefined') {
            ShareManager.share(shareData);
        }
    }

    /**
     * Print results
     */
    function printResults() {
        window.print();
    }

    /**
     * Download results as PDF
     */
    function downloadPDF() {
        // This would require jsPDF library
        if (typeof jsPDF === 'undefined') {
            APP.showNotification('PDF download not available', 'error');
            return;
        }

        const doc = new jsPDF();
        const emi = document.getElementById('emiAmount')?.textContent || '';
        const principal = document.getElementById('principalAmount')?.textContent || '';
        const interest = document.getElementById('totalInterest')?.textContent || '';
        const total = document.getElementById('totalAmount')?.textContent || '';

        doc.text('EMI Calculation Results', 20, 20);
        doc.text(`Monthly EMI: ${emi}`, 20, 40);
        doc.text(`Principal Amount: ${principal}`, 20, 50);
        doc.text(`Total Interest: ${interest}`, 20, 60);
        doc.text(`Total Amount: ${total}`, 20, 70);

        doc.save('emi-calculation.pdf');
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
