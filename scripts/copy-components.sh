#!/bin/bash

# ========================================
# COMPONENT COPY SCRIPT
# ========================================
# 
# This script copies all components from headless-components 
# to storefront.zatiqeasy project

echo "🚀 Starting component copy process..."

SOURCE_DIR="../headless-components/src/components"
TARGET_DIR="./src/components/zatiq"

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Component categories to copy
CATEGORIES=(
  "AnnouncementBar"
  "Badges"
  "Brands"
  "Category"
  "Footers"
  "Hero"
  "Navbar"
  "PaymentStatus"
  "ProductCards"
  "Reviews"
  "SpecialOffersSlider"
  "StaticBanner"
)

# Copy each category
for category in "${CATEGORIES[@]}"; do
  echo "📦 Copying $category..."
  
  if [ -d "$SOURCE_DIR/$category" ]; then
    # Copy entire category folder
    cp -r "$SOURCE_DIR/$category" "$TARGET_DIR/"
    echo "✅ $category copied successfully"
  else
    echo "⚠️  Warning: $SOURCE_DIR/$category not found"
  fi
done

# Also copy assets if needed
echo "📦 Copying assets..."
if [ -d "../headless-components/src/assets" ]; then
  mkdir -p "./src/assets"
  cp -r "../headless-components/src/assets/image" "./src/assets/" 2>/dev/null || true
  echo "✅ Assets copied"
fi

echo ""
echo "✨ Component copy completed!"
echo ""
echo "Next steps:"
echo "1. Update imports in component-registry.ts"
echo "2. Run: pnpm dev"
echo "3. Test components"
