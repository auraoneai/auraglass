#!/bin/bash
# Simple fixes for common style issues

cd /Users/gurbakshchahal/AuraGlass

echo "Fixing backdrop-blur and blur-xl classes..."

# Fix backdrop-blur -> glass-backdrop-blur
find src -name "*.tsx" -o -name "*.ts" | while read file; do
    sed -i '' 's/\bbackdrop-blur\b/glass-backdrop-blur/g' "$file"
done

# Fix blur-xl -> glass-blur-xl
find src -name "*.tsx" -o -name "*.ts" | while read file; do
    sed -i '' 's/\bblur-xl\b/glass-blur-xl/g' "$file"
done

echo "✓ Fixed blur classes"
