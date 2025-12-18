#!/bin/bash

# ========================================
# FIX IMAGE PATHS IN COMPONENTS
# ========================================
# 
# This script replaces all asset imports from:
# ../../assets/image/... → /assets/...
# 
# Because Astro serves static assets from public folder

echo "🔧 Fixing image paths in components..."

# Find all .tsx files in zatiq components
find src/components/zatiq -name "*.tsx" -type f | while read file; do
    # Replace import statements
    sed -i "s|import \(.*\) from ['\"]../../assets/image/\(.*\)['\"]|// Asset moved to public folder\n// Original: import \1 from '../../assets/image/\2'\nconst \1 = '/assets/\2'|g" "$file"
    
    # Also replace direct string references
    sed -i "s|['\"]../../assets/image/|'/assets/|g" "$file"
    sed -i "s|['\"]assets/|'/assets/|g" "$file"
done

echo "✅ Image paths updated!"
echo ""
echo "Changes made:"
echo "- Import statements converted to string constants"
echo "- All paths now point to /assets/ (public folder)"
echo ""
echo "Next: Restart dev server if running"
