/**
 * Schema Markup Helper
 * Generates structured data (schema.org) for SEO
 * Supports: FAQPage, BreadcrumbList, HowTo, Organization
 */

(function() {
    'use strict';

    const SchemaHelper = {
        /**
         * Add FAQ schema to page
         * @param {Array} faqs - Array of {question, answer} objects
         */
        addFAQSchema: function(faqs) {
            if (!faqs || faqs.length === 0) return;

            const faqSchema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqs.map(function(faq) {
                    return {
                        "@type": "Question",
                        "name": faq.question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": faq.answer
                        }
                    };
                })
            };

            this.injectSchema(faqSchema);
        },

        /**
         * Add Breadcrumb schema to page
         * @param {Array} breadcrumbs - Array of {name, url} objects
         */
        addBreadcrumbSchema: function(breadcrumbs) {
            if (!breadcrumbs || breadcrumbs.length === 0) return;

            const breadcrumbSchema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": breadcrumbs.map(function(item, index) {
                    return {
                        "@type": "ListItem",
                        "position": index + 1,
                        "name": item.name,
                        "item": item.url
                    };
                })
            };

            this.injectSchema(breadcrumbSchema);
        },

        /**
         * Add HowTo schema to page
         * @param {Object} howto - {name, description, steps: [{name, text}]}
         */
        addHowToSchema: function(howto) {
            if (!howto || !howto.steps) return;

            const howtoSchema = {
                "@context": "https://schema.org",
                "@type": "HowTo",
                "name": howto.name,
                "description": howto.description || "",
                "step": howto.steps.map(function(step, index) {
                    return {
                        "@type": "HowToStep",
                        "name": step.name,
                        "text": step.text,
                        "position": index + 1
                    };
                })
            };

            if (howto.totalTime) {
                howtoSchema.totalTime = howto.totalTime;
            }

            this.injectSchema(howtoSchema);
        },

        /**
         * Add Organization schema (for homepage)
         * @param {Object} org - {name, url, logo, description, sameAs, contactPoint}
         */
        addOrganizationSchema: function(org) {
            if (!org) return;

            const orgSchema = {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": org.name,
                "url": org.url,
                "logo": org.logo,
                "description": org.description
            };

            if (org.sameAs) {
                orgSchema.sameAs = org.sameAs;
            }

            if (org.contactPoint) {
                orgSchema.contactPoint = {
                    "@type": "ContactPoint",
                    "contactType": org.contactPoint.contactType,
                    "email": org.contactPoint.email
                };
            }

            this.injectSchema(orgSchema);
        },

        /**
         * Add WebSite schema with SearchAction
         * @param {Object} site - {name, url, searchUrl}
         */
        addWebSiteSchema: function(site) {
            if (!site) return;

            const siteSchema = {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": site.name,
                "url": site.url,
                "areaServed": {
                    "@type": "Country",
                    "name": "India"
                },
                "inLanguage": "en-IN"
            };

            if (site.searchUrl) {
                siteSchema.potentialAction = {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": site.searchUrl + "?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                };
            }

            this.injectSchema(siteSchema);
        },

        /**
         * Inject schema JSON-LD into page
         * @private
         */
        injectSchema: function(schemaObject) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.text = JSON.stringify(schemaObject);
            document.head.appendChild(script);
        },

        /**
         * Utility: Auto-generate breadcrumbs from current URL
         */
        autoGenerateBreadcrumbs: function() {
            const path = window.location.pathname;
            const parts = path.split('/').filter(Boolean);
            const baseUrl = window.location.origin;
            
            const breadcrumbs = [{
                name: "Home",
                url: baseUrl + "/"
            }];

            let currentPath = '';
            parts.forEach(function(part, index) {
                currentPath += '/' + part;
                
                // Convert filename to readable name
                let name = part.replace('.html', '').replace(/-/g, ' ');
                name = name.charAt(0).toUpperCase() + name.slice(1);
                
                breadcrumbs.push({
                    name: name,
                    url: baseUrl + currentPath
                });
            });

            return breadcrumbs;
        }
    };

    // Make globally available
    window.SchemaHelper = SchemaHelper;

    // Auto-add breadcrumb schema on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            const breadcrumbs = SchemaHelper.autoGenerateBreadcrumbs();
            if (breadcrumbs.length > 1) {
                SchemaHelper.addBreadcrumbSchema(breadcrumbs);
            }
        });
    } else {
        const breadcrumbs = SchemaHelper.autoGenerateBreadcrumbs();
        if (breadcrumbs.length > 1) {
            SchemaHelper.addBreadcrumbSchema(breadcrumbs);
        }
    }

})();
