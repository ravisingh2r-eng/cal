# Open Graph Images Guide

## What are Open Graph Images?

Open Graph (OG) images are preview images that appear when you share links on social media platforms like Facebook, Twitter, LinkedIn, WhatsApp, etc.

## Current Status

✅ OG meta tags are already in header.html:
```html
<meta property="og:title" content="{{TITLE}}">
<meta property="og:description" content="{{DESCRIPTION}}">
<meta property="og:type" content="website">
<meta property="og:url" content="{{URL}}">
<meta property="og:image" content="{{OG_IMAGE_URL}}">
```

## How to Create OG Images

### Option 1: Use Canva (Easiest)
1. Go to canva.com
2. Create design → Custom size: 1200x630px
3. Use template: "Facebook Post" or "Social Media"
4. Design elements:
   - Calculator icon 🧮
   - Platform name: "Calculator Platform"
   - Calculator-specific text (e.g., "EMI Calculator")
   - Clean background with brand colors (#3b82f6)
5. Download as PNG
6. Upload to `/images/og/` directory

### Option 2: Use Figma
1. Create 1200x630px frame
2. Design your OG image
3. Export as PNG @ 2x
4. Save to `/images/og/`

### Option 3: Online Tools
- **Placid.app** - Automate OG images
- **OGImage.Gallery** - Free templates
- **SocialSizes.io** - Size guide + templates

## Recommended OG Image Specs

- **Size**: 1200x630px (Facebook/LinkedIn standard)
- **Format**: PNG or JPG
- **File size**: < 300KB for fast loading
- **Aspect ratio**: 1.91:1
- **Safe zone**: Keep important content in center 1000x500px

## Image Naming Convention

```
/images/og/
├── default-og.png                  (homepage)
├── emi-calculator-og.png
├── sip-calculator-og.png
├── income-tax-calculator-og.png
└── ... (one for each calculator)
```

## Update Header Template

Replace `{{OG_IMAGE_URL}}` with actual image URLs:

```html
<!-- For specific calculators -->
<meta property="og:image" content="https://yourdomain.com/images/og/emi-calculator-og.png">

<!-- For generic pages (use default) -->
<meta property="og:image" content="https://yourdomain.com/images/og/default-og.png">
```

## Twitter Card

Already configured in header.html. Just ensure images follow same specs.

## Testing OG Images

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/

## Quick Win: Default Image

For now, create ONE default OG image (1200x630px) with:
- Text: "Calculator Platform - 125+ Free Calculators"
- Subtitle: "Finance, Health, Investment & More"
- Icon: 🧮
- Background: Gradient (#3b82f6 to #764ba2)

Save as `/images/og/default-og.png` and use for all pages initially.

## Priority

- **High Priority**: Homepage, Top 10 calculators
- **Medium Priority**: All category pages
- **Low Priority**: Remaining calculators (can use default)

## Bulk Generation (Advanced)

Use automation tools to generate 125 OG images:
- **Puppeteer** - Screenshot HTML templates
- **Cloudinary** - Dynamic image generation
- **ImgIX** - URL-based image manipulation

## Timeline

- Default OG image: 10-15 minutes
- Top 10 custom images: 1-2 hours
- All 125 images: 1 day (if using automation)
