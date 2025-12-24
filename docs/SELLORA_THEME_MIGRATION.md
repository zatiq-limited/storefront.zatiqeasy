# Sellora Theme Migration Plan

## Overview

This document outlines the migration plan for the Sellora theme from the old Next.js Pages Router project (`storefront.zatiqeasy.com`) to the new Next.js App Router project (`storefront.zatiqeasy`).

## Sellora Theme Characteristics

### Visual Identity
- **Primary Color**: Blue (`#3B82F6` / `blue-zatiq`)
- **Container Width**: `max-w-7xl` (1280px)
- **Background Style**: Clean white/cream tones with dark mode support
- **Typography**: Semibold headings with normal body text
- **Footer Background**: `#ede9e6` (cream/beige tone)

### Unique Features

1. **Full-Width Hero Carousel**
   - Primary and secondary carousel tags
   - Title, subtitle, and CTA button overlays
   - Auto-rotation with pagination dots
   - Dark overlay for text visibility

2. **Transparent Header with Scroll Effect**
   - Header becomes white with shadow on scroll
   - Text color transitions based on scroll position
   - Light text on hero, dark text when scrolled

3. **Trust Features Bar**
   - Black background section in footer
   - 4 trust icons with descriptions
   - Icons: ShieldCheck, MessagesSquare, Tags, Truck

4. **On Sale Section with Flash Sale**
   - Swiper carousel for on-sale products
   - Flash sale countdown timer
   - Sale badge on product cards
   - Auto-play with navigation arrows

5. **"Our Collections" Category Grid**
   - 2x3 category grid (2 cols mobile, 3 cols desktop)
   - Category cards with overlay text

6. **Product Card (1:1.6 Aspect Ratio)**
   - Tall product image format
   - Discount percentage badge
   - Hover overlay with Add to Cart and Buy Now buttons
   - Cart quantity control on card

7. **Language Toggler**
   - Language switch dropdown in header

8. **Product Details with Sticky Info**
   - 3:2 layout (3 cols image, 2 cols info)
   - Sticky product info on desktop
   - Buy Now button prominent
   - Customer reviews section
   - Product video section

9. **All Products Page with Hero Banner**
   - Full-width hero banner from carousel
   - Sidebar price filters
   - Sort by section
   - Featured collections at bottom

## Directory Structure

```
app/_themes/sellora/
├── index.ts                     # Theme exports & StaticTheme definition
├── theme.config.ts              # Theme configuration constants
├── components/
│   ├── header/
│   │   ├── header.tsx           # Main header with scroll effect
│   │   ├── mobile-nav.tsx       # Mobile navigation drawer
│   │   ├── language-toggler.tsx # Language switch dropdown
│   │   └── index.ts
│   ├── footer/
│   │   ├── footer.tsx           # Footer with trust features bar
│   │   └── index.ts
│   ├── cards/
│   │   ├── sellora-product-card.tsx    # 1:1.6 aspect ratio product card
│   │   ├── sellora-category-card.tsx   # Category grid card
│   │   ├── on-sale-product-card.tsx    # On-sale variant with sale badge
│   │   └── index.ts
│   ├── carousel/
│   │   ├── hero-carousel.tsx    # Full-width hero carousel slider
│   │   └── index.ts
│   ├── sections/
│   │   ├── trust-features.tsx   # Trust bar with icons
│   │   ├── flash-sale-countdown.tsx  # Countdown timer
│   │   └── index.ts
│   ├── filters/
│   │   ├── price-filter.tsx     # Price range filter
│   │   ├── sort-by.tsx          # Sort dropdown
│   │   └── index.ts
│   └── core/
│       ├── grid-container.tsx   # Product grid container
│       ├── pagination.tsx       # Pagination component
│       └── index.ts
├── modules/
│   ├── home/
│   │   ├── sellora-home-page.tsx
│   │   └── sections/
│   │       ├── our-collection.tsx         # Category grid section
│   │       ├── featured-products.tsx      # New arrivals section
│   │       ├── on-sale-section.tsx        # Flash sale swiper
│   │       └── index.ts
│   ├── products/
│   │   ├── sellora-all-products.tsx       # Products with hero & sidebar
│   │   └── sections/
│   │       └── hero-banner.tsx
│   ├── category/
│   │   └── sellora-category-page.tsx
│   └── product-detail/
│       ├── sellora-product-detail-page.tsx
│       └── sections/
│           ├── product-image-section.tsx
│           ├── product-pricing.tsx
│           ├── product-variants.tsx
│           ├── description-details.tsx
│           ├── product-video.tsx
│           ├── customer-reviews.tsx
│           ├── related-products.tsx
│           └── index.ts
```

## Migration Tasks

### Phase 1: Theme Configuration & Core Setup

- [ ] Create `theme.config.ts` with Sellora-specific values
- [ ] Create main `index.ts` with exports and StaticTheme

### Phase 2: Layout Components

- [ ] Migrate Header with scroll transparency effect
- [ ] Migrate Mobile Navigation
- [ ] Migrate Language Toggler
- [ ] Migrate Footer with Trust Features Bar

### Phase 3: Card Components

- [ ] Create Sellora Product Card (1:1.6 aspect ratio, hover overlay)
- [ ] Create Sellora Category Card (grid style)
- [ ] Create On-Sale Product Card (with sale badge)

### Phase 4: Home Page Components

- [ ] Create Hero Carousel component
- [ ] Create Our Collection section
- [ ] Create Featured Products section
- [ ] Create On Sale section with Swiper
- [ ] Create Flash Sale Countdown
- [ ] Assemble Sellora Home Page

### Phase 5: Products Page

- [ ] Create Hero Banner section
- [ ] Create Price Filter component
- [ ] Create Sort By component
- [ ] Create Pagination component
- [ ] Assemble All Products page with sidebar

### Phase 6: Category Page

- [ ] Create Category page with horizontal category list

### Phase 7: Product Detail Page

- [ ] Create Product Image Section (with thumbnail strip)
- [ ] Create Product Pricing component
- [ ] Create Product Variants component
- [ ] Create Description Details accordion
- [ ] Create Product Video section
- [ ] Create Customer Reviews section
- [ ] Create Related Products section
- [ ] Assemble Product Detail page with sticky layout

### Phase 8: Integration

- [ ] Update `theme-handler.tsx` with Sellora header/footer
- [ ] Update merchant pages with Sellora components
- [ ] Run build and fix TypeScript errors

## Key Technical Considerations

### 1. Scroll-Based Header Styling
```typescript
// Track scroll position
const [scrollY, setScrollY] = useState(0);

// Determine text color based on page and scroll
const shouldUseLightText = (isHomePage || isProductsPage) && scrollY <= 20;

// Header classes
className={cn(
  "transition-all duration-300",
  scrollY > 20 ? "bg-white shadow-sm text-black" : "bg-white/5 backdrop-blur-xs",
  shouldUseLightText ? "text-gray-300" : "text-gray-900"
)}
```

### 2. Product Card Aspect Ratio
```css
/* Sellora uses 1:1.6 (10:16) aspect ratio */
aspect-ratio: 1 / 1.6;  /* or aspect-[10/16] */
```

### 3. Hero Carousel Implementation
```typescript
// Use state for carousel rotation
const [currentIndex, setCurrentIndex] = useState(0);

// Auto-rotate every 4 seconds
useEffect(() => {
  const timer = setTimeout(() => {
    setCurrentIndex((prev) => (prev + 1) % carousels.length);
  }, 4000);
  return () => clearTimeout(timer);
}, [currentIndex, carousels.length]);
```

### 4. On Sale Section with Swiper
```typescript
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

<Swiper
  slidesPerView={2}
  breakpoints={{
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 3 },
  }}
  navigation
  autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
  modules={[Navigation, Autoplay]}
>
```

### 5. Trust Features Data
```typescript
const trustFeatures = [
  { icon: ShieldCheck, title: t("shop_with_confidence"), description: t("trusted_by_happy_customers") },
  { icon: MessagesSquare, title: t("best_deals_fast_delivery"), description: t("express_shipping") },
  { icon: Tags, title: t("trusted_online_store"), description: t("quality_products_expert_support") },
  { icon: Truck, title: t("shop_smart_save_more"), description: t("exclusive_deals_top_quality") },
];
```

### 6. Sticky Product Info on Desktop
```tsx
<div className="lg:col-span-2 lg:sticky lg:top-20 lg:self-start">
  {/* Product info content */}
</div>
```

### 7. Store Integration
```typescript
// Use Zustand stores
import { useShopStore } from "@/stores/shopStore";
import { useCartStore, selectTotalItems } from "@/stores/cartStore";
import { useProductsStore } from "@/stores/productsStore";

// Access shop theme for carousels, on_sale_inventories, etc.
const carousels = (shopDetails?.shop_theme as unknown as {
  carousels?: Array<{ tag: string; image_url: string; title: string; sub_title: string; button_text: string; button_link: string }>
})?.carousels || [];

const onSaleProducts = (shopDetails?.shop_theme as unknown as {
  on_sale_inventories?: Product[]
})?.on_sale_inventories || [];
```

## Components Mapping (Old → New)

| Old Component | New Component |
|--------------|---------------|
| `layout/header.tsx` | `components/header/header.tsx` |
| `layout/footer.tsx` | `components/footer/footer.tsx` |
| `components/productcard.tsx` | `components/cards/sellora-product-card.tsx` |
| `components/category-grid.tsx` | `components/cards/sellora-category-card.tsx` |
| `components/home/carousel-slider.tsx` | `components/carousel/hero-carousel.tsx` |
| `components/home/category-section.tsx` | `modules/home/sections/our-collection.tsx` |
| `components/home/featured-products.tsx` | `modules/home/sections/featured-products.tsx` |
| `components/home/onsale-section.tsx` | `modules/home/sections/on-sale-section.tsx` |
| `components/product-details/product-details.tsx` | `modules/product-detail/sellora-product-detail-page.tsx` |
| `page/home-page.tsx` | `modules/home/sellora-home-page.tsx` |
| `page/all-products.tsx` | `modules/products/sellora-all-products.tsx` |
| `page/categories.tsx` | `modules/category/sellora-category-page.tsx` |

## Dependencies

- `lucide-react` - Icons
- `swiper` - Carousel/slider functionality
- `framer-motion` - Animations
- `clsx` & `tailwind-merge` - Class utilities
- `react-i18next` - Translations

## Estimated Effort

| Phase | Estimated Time |
|-------|---------------|
| Phase 1: Config & Setup | 1 hour |
| Phase 2: Layout Components | 2 hours |
| Phase 3: Card Components | 2 hours |
| Phase 4: Home Page | 3 hours |
| Phase 5: Products Page | 2 hours |
| Phase 6: Category Page | 1 hour |
| Phase 7: Product Detail | 3 hours |
| Phase 8: Integration | 2 hours |
| **Total** | **~16 hours** |

## Testing Checklist

- [ ] Header transparency effect on home page
- [ ] Header turns white on scroll
- [ ] Hero carousel auto-rotates
- [ ] On-sale section Swiper works with navigation
- [ ] Flash sale countdown updates
- [ ] Product cards show hover overlay
- [ ] Add to cart from product card works
- [ ] Buy now navigates to checkout
- [ ] Category grid links work
- [ ] All products page filters work
- [ ] Product detail sticky layout on desktop
- [ ] Product video plays
- [ ] Customer reviews display
- [ ] Related products show
- [ ] Mobile navigation works
- [ ] Language toggler works
- [ ] Footer trust features display
- [ ] Dark mode support
- [ ] Cart floating button shows correct count
