# Premium Theme Migration Plan

## Overview

This document outlines the migration plan for the Premium theme from the old project (`storefront.zatiqeasy.com`) to the new project (`storefront.zatiqeasy`).

**Source:** `/home/sumon7866/Projects/Zatiq/project-migration/storefront.zatiqeasy.com/src/www/e-commerce/themes/premium`
**Target:** `/home/sumon7866/Projects/Zatiq/project-migration/storefront.zatiqeasy/app/_themes/premium`

## Premium Theme Characteristics

### Unique Features (compared to Basic/Aurora/Luxura)
- **Buy Now Button** - Direct checkout from product card (configurable via `shop_theme.enable_buy_now_on_product_card`)
- **Full-Width Search Modal** - Large overlay search with product previews
- **Product Modifier Modal** - Quick variant/quantity selection without leaving page
- **Cart Floating Button** - Persistent cart indicator with totals
- **Advanced Product Card** - Animated state transitions with Framer Motion
- **Category-Based Product Sections** - Homepage sections organized by featured categories
- **First Category 2x2 Grid** - Featured category spans larger area on homepage

### Layout Specifications
- **Container Width:** Uses `premium-layout-width` custom class (similar to standard width)
- **Product Card Aspect Ratio:** 244:304
- **Grid Columns:** 2 (mobile) → 3 (tablet) → 5 (desktop)
- **Spacing:** Responsive padding and gaps scaling with breakpoints

---

## Migration Tasks

### Phase 1: Theme Structure Setup

#### Task 1.1: Create Directory Structure
```
app/_themes/premium/
├── index.ts
├── theme.config.ts
├── components/
│   ├── header/
│   │   ├── header.tsx
│   │   ├── mobile-nav.tsx
│   │   └── index.ts
│   ├── footer/
│   │   ├── footer.tsx
│   │   └── index.ts
│   ├── cards/
│   │   ├── premium-product-card.tsx
│   │   ├── premium-category-card.tsx
│   │   └── index.ts
│   ├── search/
│   │   ├── premium-search-modal.tsx
│   │   ├── search-dropdown.tsx
│   │   └── index.ts
│   ├── core/
│   │   ├── grid-container.tsx
│   │   ├── buy-now-button.tsx
│   │   └── index.ts
│   └── modals/
│       ├── product-modifier-modal.tsx
│       └── index.ts
└── modules/
    ├── home/
    │   ├── premium-home-page.tsx
    │   └── sections/
    │       ├── premium-hero-section.tsx
    │       ├── premium-category-section.tsx
    │       ├── premium-featured-products-section.tsx
    │       ├── premium-category-products-section.tsx
    │       ├── section-header.tsx
    │       └── index.ts
    ├── products/
    │   └── premium-all-products.tsx
    ├── category/
    │   └── premium-category-page.tsx
    ├── product-detail/
    │   ├── premium-product-detail-page.tsx
    │   └── sections/
    │       ├── product-pricing.tsx
    │       ├── product-variants.tsx
    │       ├── product-details.tsx
    │       ├── related-products.tsx
    │       └── index.ts
    └── checkout/
        └── premium-checkout.tsx
```

#### Task 1.2: Create Theme Configuration Files

**index.ts** - Main theme entry point with:
- StaticTheme definition
- Component exports
- Module exports
- Theme configuration

**theme.config.ts** - Premium-specific configuration:
- Color scheme (blue-zatiq primary)
- Typography settings
- Spacing system
- Border radius
- Premium-specific features

---

### Phase 2: Layout Components

#### Task 2.1: Header Component
**File:** `components/header/header.tsx`

**Features to migrate:**
- Sticky header with scroll shadow
- Shop logo/name with dynamic linking
- Navigation links (Products, Categories) - desktop only
- Search icon with modal trigger
- Shopping cart button with badge
- Language toggler
- Mobile hamburger menu
- Dark mode support

**Key changes:**
- Replace `useShopContext` → `useShopStore`
- Replace `useCartContext` → `useCartStore`
- Replace `useRouter` → Next.js App Router `useRouter`
- Use `useTranslation` from react-i18next

#### Task 2.2: Mobile Navigation
**File:** `components/header/mobile-nav.tsx`

**Features:**
- Slide-out drawer navigation
- Category links
- Products link
- Close button
- Dark mode support

#### Task 2.3: Footer Component
**File:** `components/footer/footer.tsx`

**Features:**
- Shop information
- Navigation links
- Social media links
- Copyright notice
- Dark mode support

---

### Phase 3: Core Components

#### Task 3.1: Premium Product Card
**File:** `components/cards/premium-product-card.tsx`

**Features to migrate:**
- Product image with fallback
- Price display with currency
- Old price with strikethrough
- Discount percentage badge
- Stock status indicator
- Framer Motion animations for cart state
- Add to cart button with quantity controls
- Buy now button (conditional)
- Variant support
- Dark mode support

**Key specifications:**
- Aspect ratio: 244:304
- Animation variants for cart button transitions
- LazyAnimation wrapper

#### Task 3.2: Premium Category Card
**File:** `components/cards/premium-category-card.tsx`

**Features:**
- Category image with overlay
- Category name
- Dark gradient overlay
- Link to category page
- Responsive sizing

#### Task 3.3: Buy Now Button
**File:** `components/core/buy-now-button.tsx`

**Features:**
- Conditional display via `shop_theme.enable_buy_now_on_product_card`
- Direct checkout redirect
- Respects stock status
- Variant handling (opens modal for multi-variant)
- Disabled state styling

#### Task 3.4: Grid Container
**File:** `components/core/grid-container.tsx`

**Features:**
- Responsive grid: 2 cols (mobile) → 3 cols (tablet) → 5 cols (desktop)
- Gap spacing
- Premium layout width

---

### Phase 4: Search Components

#### Task 4.1: Search Modal
**File:** `components/search/premium-search-modal.tsx`

**Features:**
- Fixed position overlay
- Animated entrance/exit (Framer Motion)
- Dark background overlay (40% opacity)
- Responsive sizing (94% mobile, 85% tablet+)
- Max width: 1300px
- Search input with live results
- Product preview cards

#### Task 4.2: Search Dropdown
**File:** `components/search/search-dropdown.tsx`

**Features:**
- Live search input
- Up to 20 product results
- Product preview (image, name, price)
- Navigation to product detail
- Price currency display

---

### Phase 5: Modal Components

#### Task 5.1: Product Modifier Modal
**File:** `components/modals/product-modifier-modal.tsx`

**Features:**
- Product variant selection
- Quantity controls
- Buy now option
- Max height: 80vh with scroll
- Dark mode styling
- Close button

---

### Phase 6: Home Page Module

#### Task 6.1: Premium Home Page
**File:** `modules/home/premium-home-page.tsx`

**Sections to implement:**
1. Featured Categories Grid
   - First category 2x2 on XL screens
   - Responsive grid (3 cols mobile, 4 cols XL)

2. Featured Products Grid
   - 5-column grid (2-3 on mobile)
   - Products from `shop_theme.selected_inventories`

3. Category-Based Product Sections
   - Dynamic sections per featured category
   - Category banner image
   - Product grid per category
   - "View All" button

**Key features:**
- Responsive spacing
- Cart floating button
- Variant selector modal
- Dynamic window width awareness

#### Task 6.2: Section Header
**File:** `modules/home/sections/section-header.tsx`

**Features:**
- Centered title (responsive sizes)
- "View All" button (desktop only)
- Translatable labels

#### Task 6.3: Premium Category Section
**File:** `modules/home/sections/premium-category-section.tsx`

**Features:**
- Featured categories grid
- First category larger (2x2) on XL
- Category cards with overlay

#### Task 6.4: Premium Featured Products Section
**File:** `modules/home/sections/premium-featured-products-section.tsx`

**Features:**
- Featured products from theme config
- 5-column responsive grid
- "View All" link

#### Task 6.5: Category Products Section
**File:** `modules/home/sections/premium-category-products-section.tsx`

**Features:**
- Category banner image
- Products filtered by category
- Dynamic section per category

---

### Phase 7: Products Page Module

#### Task 7.1: Premium All Products
**File:** `modules/products/premium-all-products.tsx`

**Features to migrate:**
- Full product catalog
- Price range filter sidebar
- Category filter
- Mobile filter modal toggle
- Pagination controls
- Product skeleton loading
- Category horizontal list (mobile)
- Responsive grid (2-5 columns)
- Cart floating button
- Search integration

---

### Phase 8: Category Page Module

#### Task 8.1: Premium Category Page
**File:** `modules/category/premium-category-page.tsx`

**Features:**
- Category breadcrumb
- Products filtered by category ID
- Pagination
- Category horizontal list
- Related products section
- Cart floating button

---

### Phase 9: Product Detail Page Module

#### Task 9.1: Premium Product Detail Page
**File:** `modules/product-detail/premium-product-detail-page.tsx`

**Features:**
- Product image gallery with lightbox
- Product details with animations
- Variant selection
- Stock management
- Cart quantity controls
- Customer reviews section
- Related products section
- Image download (if enabled)
- Video support
- Cart floating button

#### Task 9.2: Product Pricing Component
**File:** `modules/product-detail/sections/product-pricing.tsx`

**Features:**
- Current price display
- Old price with strikethrough
- Save price calculation
- Currency and unit name
- Responsive text sizes

#### Task 9.3: Product Variants Component
**File:** `modules/product-detail/sections/product-variants.tsx`

**Features:**
- Variant type selector
- Pill-shaped variant buttons
- Blue zatiq border on selection
- Image update on variant selection

#### Task 9.4: Related Products Component
**File:** `modules/product-detail/sections/related-products.tsx`

**Features:**
- Category-based filtering
- Excludes current product
- Uses PremiumProductCard
- Quick add-to-cart modal

---

### Phase 10: Integration

#### Task 10.1: Update Theme Handler
**File:** `app/lib/theme-handler.tsx`

Add Premium case:
```tsx
case "Premium":
  return (
    <>
      <PremiumHeader />
      {children}
      <PremiumFooter />
    </>
  );
```

#### Task 10.2: Update Merchant Pages

**Files to update:**
- `app/merchant/[shopId]/page.tsx` - Add PremiumHomePage
- `app/merchant/[shopId]/products/page.tsx` - Add PremiumAllProducts
- `app/merchant/[shopId]/categories/[category]/page.tsx` - Add PremiumCategoryPage
- `app/merchant/[shopId]/products/[productHandle]/page.tsx` - Add PremiumProductDetailPage

---

## Key Migration Considerations

### 1. State Management Changes
| Old (Pages Router) | New (App Router) |
|-------------------|------------------|
| `useShopContext` | `useShopStore` (Zustand) |
| `useCartContext` | `useCartStore` (Zustand) |
| `useInventoryContext` | `useProductsStore` (Zustand) |
| `useProductContext` | Local state / props |
| `usePageProps` | React Query hooks |

### 2. Data Fetching
| Old | New |
|-----|-----|
| Context providers | React Query hooks |
| `getServerSideProps` | Server components / hooks |
| Context state | Zustand stores |

### 3. Component Imports
| Old Import | New Import |
|------------|------------|
| `@app/www/e-commerce/...` | `@/components/...` or theme-local |
| Context hooks | Zustand store hooks |
| Custom image utils | `@/lib/utils/formatting` |

### 4. Styling Approach
- Keep Tailwind CSS classes
- Migrate SCSS to Tailwind where possible
- Use `cn()` utility for conditional classes
- Maintain dark mode support with `dark:` prefix

### 5. Animation Migration
- Keep Framer Motion animations
- Update animation component imports
- Use shared animation components from `@/components/shared/animations`

---

## File Count Summary

| Category | Files |
|----------|-------|
| Theme Config | 2 |
| Header/Footer | 4 |
| Cards | 3 |
| Search | 3 |
| Core Components | 3 |
| Modals | 2 |
| Home Page + Sections | 7 |
| Products Page | 1 |
| Category Page | 1 |
| Product Detail + Sections | 5 |
| **Total** | **~31 files** |

---

## Estimated Complexity

| Task | Complexity | Dependencies |
|------|------------|--------------|
| Directory Structure | Low | None |
| Theme Config | Low | None |
| Header/Footer | Medium | Zustand stores |
| Product Card | High | Animations, cart logic |
| Search Modal | Medium | Product search |
| Home Page | High | Multiple sections |
| Products Page | Medium | Filters, pagination |
| Category Page | Medium | Category filtering |
| Product Detail | High | Variants, gallery, cart |
| Integration | Low | All components |

---

## Testing Checklist

After migration, verify:
- [ ] Theme renders correctly when `theme_name === "Premium"`
- [ ] Header sticky behavior and scroll shadow
- [ ] Mobile navigation works
- [ ] Search modal opens and searches products
- [ ] Product cards display correctly with animations
- [ ] Add to cart functionality works
- [ ] Buy now button conditional display
- [ ] Cart floating button shows totals
- [ ] Home page sections render
- [ ] Category grid with featured (2x2) category
- [ ] Products page with filters
- [ ] Category page filtering
- [ ] Product detail with variants
- [ ] Related products display
- [ ] Dark mode throughout
- [ ] Responsive at all breakpoints
- [ ] Build succeeds with no TypeScript errors

---

## Notes

1. **Reuse Shared Components:** Many components (CategoryHorizontalList, Pagination, CartFloatingBtn, VariantSelectorModal) can be reused from shared components.

2. **Type Safety:** Use proper TypeScript types with casting where needed for shop_theme properties that may not be in the base type.

3. **Consistent Patterns:** Follow the same patterns established in Aurora and Luxura migrations for consistency.

4. **Animation Performance:** Ensure Framer Motion animations don't cause performance issues on mobile.

5. **Image Optimization:** Use Next.js Image component with proper sizing for all images.
