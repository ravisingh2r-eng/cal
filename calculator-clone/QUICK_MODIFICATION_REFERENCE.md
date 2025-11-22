# Quick Modification Reference Card

Fast reference for common calculator modifications.

---

## 🚀 Most Common Tasks

### 1. Change Calculator Formula
```bash
# Edit specific calculator
nano js/calculators/emi-calculator.js

# Find calculate() function
# Modify formula
# Save and test
```

### 2. Update Page Title (Single Calculator)
```bash
sed -i 's/<title>Old Title<\/title>/<title>New Title<\/title>/' calculators/emi-calculator.html
```

### 3. Update All Page Titles (Batch)
```bash
for file in calculators/*.html; do
    sed -i 's/Calculate Online Free/Free Calculator India 2025/' "$file"
done
```

### 4. Change Copyright Year
```bash
sed -i 's/© 2024/© 2025/g' components/footer.html
```

### 5. Update Meta Description (Single)
```bash
sed -i 's/content="Old description"/content="New description"/' calculators/emi-calculator.html
```

---

## 📝 File Locations

| What to Modify | File Location |
|----------------|---------------|
| Calculator Logic | `/js/calculators/*.js` |
| Page Content | `/calculators/*.html` |
| Styling | `/css/*.css` |
| Header (All Pages) | `/components/header.html` |
| Footer (All Pages) | `/components/footer.html` |

---

## 🔧 Quick Modifications

### Add Text to All Calculators
```python
# Python script
import os
for f in os.listdir('calculators'):
    if f.endswith('.html'):
        with open(f'calculators/{f}', 'r+') as file:
            content = file.read()
            content = content.replace('OLD', 'NEW')
            file.seek(0)
            file.write(content)
            file.truncate()
```

### Change Number Format
```javascript
// Indian format with commas
number.toLocaleString('en-IN', {maximumFractionDigits: 0})

// Example: 100000 → 1,00,000
```

### Update Button Text
```javascript
// In calculator JS file
document.getElementById('calculate').textContent = 'New Button Text';
```

---

## ⚡ One-Liners

```bash
# Find all calculators
ls js/calculators/

# Count total calculators
ls -1 js/calculators/*.js | wc -l

# Search for specific text in all calculators
grep -r "search term" js/calculators/

# Replace text in all HTML files
find calculators -name "*.html" -exec sed -i 's/old/new/g' {} +

# Backup before making changes
cp -r calculator-clone calculator-backup-$(date +%Y%m%d)

# Test JavaScript file for errors
node --check js/calculators/emi-calculator.js
```

---

## 🎯 Common Patterns

### Pattern 1: Modify Input Field
```javascript
// Find in JS file
<input type="number" id="principal" min="1000" max="10000000">

// Change to
<input type="number" id="principal" min="100" max="100000000" step="1000">
```

### Pattern 2: Change Result Display
```javascript
// Old
<span class="result-value">${emi.toFixed(2)}</span>

// New (Indian format)
<span class="result-value">₹${emi.toLocaleString('en-IN')}</span>
```

### Pattern 3: Add New Section
```javascript
// In displayResults() function, add:
resultsDiv.innerHTML += `
    <div class="new-section">
        <h4>Additional Info</h4>
        <p>Your custom content here</p>
    </div>
`;
```

---

## 🧪 Testing Commands

```bash
# Open file
nano js/calculators/emi-calculator.js

# Check syntax
node --check js/calculators/emi-calculator.js

# View changes
git diff js/calculators/emi-calculator.js

# Commit changes
git add js/calculators/emi-calculator.js
git commit -m "Updated EMI formula"
```

---

## 💡 Pro Tips

1. **Always backup first:** `cp file file.backup`
2. **Test on one file:** Before batch operations
3. **Use git:** Track all changes
4. **Search first:** `grep -r "pattern" .` to find text
5. **Validate:** Open in browser after changes

---

## 🔍 Finding What to Modify

```bash
# Find calculator by name
find . -name "*emi*"

# Search for specific function
grep -n "function calculate" js/calculators/*.js

# Find all uses of a variable
grep -r "monthlyRate" js/calculators/

# List all calculators with specific text
grep -l "specific text" calculators/*.html
```

---

## 📊 Batch Operations Template

```bash
#!/bin/bash
# Template for batch modifications

for file in calculators/*.html; do
    echo "Processing: $file"
    
    # Your modification here
    sed -i 's/OLD/NEW/g' "$file"
    
    echo "✓ Done: $file"
done

echo "✅ All files updated!"
```

---

## 🎨 CSS Modifications

```bash
# Change colors
sed -i 's/#3b82f6/#your-color/g' css/style.css

# Update font sizes
sed -i 's/font-size: 1rem/font-size: 1.1rem/g' css/style.css

# Change button styles
nano css/style.css
# Find .btn-primary class
```

---

## 📱 Quick File Access

```bash
# Most used files
nano js/calculators/emi-calculator.js
nano calculators/emi-calculator.html
nano css/style.css
nano components/header.html
nano components/footer.html
```

For detailed guide, see: **CONTENT_MODIFICATION_GUIDE.md**
