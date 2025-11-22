/**
 * Print Functionality
 * Provides print button and print-friendly output
 */

(function() {
    'use strict';

    // Initialize print functionality
    function initPrint() {
        createPrintButton();
        attachPrintEventListeners();
    }

    // Create print button HTML
    function createPrintButton() {
        const printContainer = document.getElementById('printButton');
        if (!printContainer) return;

        printContainer.innerHTML = `
            <button class="btn-print" id="printResultsBtn" title="Print Results">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                Print Results
            </button>
        `;
    }

    // Attach event listeners
    function attachPrintEventListeners() {
        const printBtn = document.getElementById('printResultsBtn');
        if (printBtn) {
            printBtn.addEventListener('click', handlePrint);
        }

        // Keyboard shortcut: Ctrl+P / Cmd+P
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                const resultsDiv = document.getElementById('results');
                if (resultsDiv && resultsDiv.style.display !== 'none') {
                    e.preventDefault();
                    handlePrint();
                }
            }
        });
    }

    // Handle print action
    function handlePrint() {
        const resultsDiv = document.getElementById('results');
        
        // Check if results exist
        if (!resultsDiv || resultsDiv.style.display === 'none') {
            alert('Please calculate results first before printing.');
            return;
        }

        // Prepare print content
        preparePrintContent();

        // Track print event
        if (typeof gtag === 'function') {
            gtag('event', 'print', {
                'event_category': 'Engagement',
                'event_label': document.title
            });
        }

        // Trigger print dialog
        setTimeout(() => {
            window.print();
        }, 100);
    }

    // Prepare content for printing
    function preparePrintContent() {
        const body = document.body;
        
        // Add print class to body
        body.classList.add('printing');

        // Create print header if it doesn't exist
        let printHeader = document.getElementById('printHeader');
        if (!printHeader) {
            printHeader = document.createElement('div');
            printHeader.id = 'printHeader';
            printHeader.className = 'print-header';
            printHeader.innerHTML = `
                <div class="print-logo">
                    <h1>🧮 Calculator Platform</h1>
                    <p>${document.title}</p>
                </div>
                <div class="print-date">
                    Printed on: ${new Date().toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            `;
            body.insertBefore(printHeader, body.firstChild);
        }

        // Create print footer if it doesn't exist
        let printFooter = document.getElementById('printFooter');
        if (!printFooter) {
            printFooter = document.createElement('div');
            printFooter.id = 'printFooter';
            printFooter.className = 'print-footer';
            printFooter.innerHTML = `
                <p>Calculated using Calculator Platform - ${window.location.href}</p>
                <p class="print-disclaimer">Disclaimer: Results are estimates only. Consult professionals for important decisions.</p>
            `;
            body.appendChild(printFooter);
        }

        // Remove print class after printing
        window.addEventListener('afterprint', function() {
            body.classList.remove('printing');
        }, { once: true });
    }

    // Alternative: Print specific section
    window.printSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) {
            console.error('Section not found:', sectionId);
            return;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${document.title}</title>
                <link rel="stylesheet" href="../css/style.css">
                <link rel="stylesheet" href="../css/print.css">
            </head>
            <body>
                <div class="print-header">
                    <h1>🧮 Calculator Platform</h1>
                    <p>${document.title}</p>
                </div>
                ${section.outerHTML}
                <div class="print-footer">
                    <p>Printed from: ${window.location.href}</p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPrint);
    } else {
        initPrint();
    }

})();
