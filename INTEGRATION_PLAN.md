# Zatiq Storefront Integration Plan

## Executive Summary

This document outlines the strategy to combine two existing projects into this new shadcn-based storefront:

1. **Theme Builder System** from `storefront.zatiqeasy` - JSON-driven dynamic UI rendering
2. **Static Theme System** from `storefront.zatiqeasy.com` - Pre-built e-commerce themes and full checkout flow

---

## Current Project State

### New Project: `storefront.zatiqeasy.dev` (This Project)

| Aspect | Version/Details |
|--------|-----------------|
| **Framework** | Next.js 16.0.10 with App Router |
| **React** | React 19.2.1 |
| **Styling** | Tailwind CSS v4 with OKLch color variables |
| **UI Primitives** | @base-ui/react 1.0.0 (headless components) |
| **Icons** | Lucide React 0.561.0 |
| **CLI** | shadcn 3.6.2 |
| **TypeScript** | TypeScript 5 |

### Pre-built UI Components (13 total)

| Component | Description |
|-----------|-------------|
| `alert-dialog` | Modal dialogs with actions |
| `badge` | Label badges with variants |
| `button` | Buttons with extensive variants (xs, sm, default, lg, icon) |
| `card` | Card layout with header, content, footer, action |
| `combobox` | Searchable select dropdown |
| `dropdown-menu` | Context menus with submenus, checkboxes, radios |
| `field` | Complete form field system with validation |
| `input` | Text input with accessibility |
| `input-group` | Input grouping component |
| `label` | Form labels |
| `select` | Dropdown select |
| `separator` | Horizontal/vertical dividers |
| `textarea` | Multi-line text input |

### Path Aliases Configured

```json
{
  "components": "@/components",
  "utils": "@/lib/utils",
  "ui": "@/components/ui",
  "lib": "@/lib",
  "hooks": "@/hooks"
}
```

---

## Source Projects Analysis

### Source 1: `storefront.zatiqeasy` (Theme Builder)

| Feature | Details |
|---------|---------|
| **BlockRenderer** | Dynamic UI from JSON API responses |
| **V3.0 Schema** | Data binding (bind_content, bind_src, bind_href) |
| **Components** | Repeaters, Swipers --> Embla, Marquees, Icons, Conditions, Events |
| **Product Cards** | 16 variants (ProductCard1-16) |
| **Pagination** | 2 styles |
| **Hero Sections** | 2 styles |
| **Sidebar** | 2 styles |

**Existing Stores (Zustand):**
- `themeStore.ts` - Theme JSON data
- `homepageStore.ts` - Homepage sections
- `productsStore.ts` - Products with filters
- `productDetailsStore.ts` - Single product details
- `aboutUsStore.ts` - About Us page

**Existing Hooks:**
- `useTheme()` - Theme config
- `useHomepage()` - Homepage config
- `useProducts()` - Products with filters
- `useProductDetails(handle)` - Product details
- `useAboutUs()` - About Us

### Source 2: `storefront.zatiqeasy.com` (Static Themes)

| Feature | Details |
|---------|---------|
| **Static Themes** | 5 themes: Basic, Premium, Aurora, Luxura, Sellora |
| **Landing Pages** | 3 themes: Arcadia, Nirvana, Grip |
| **E-commerce** | Full cart, checkout, payment flow |
| **Payment Gateways** | bKash, AamarPay, COD, self_mfs, zatiq_seller_pay |
| **Analytics** | Facebook Pixel, GTM, TikTok Pixel, Firebase |
| **i18n** | English (en), Bengali (bn) |
| **Multi-tenant** | SHOPLINK/STANDALONE modes |

**Existing Contexts (6 total):**
- `ShopContext` - Shop profile, visitor tracking
- `CartContext` - Cart with localStorage persistence
- `CheckoutContext` - Form state, delivery, promo codes
- `InventoryContext` - Products, categories, filtering
- `ProductContext` - Variant selection, pricing
- `GTMPixelContext` - Analytics

---

## Target Directory Structure

```
storefront.zatiqeasy.dev/
├── app/
│   ├── (shop)/                          # Shop route group
│   │   ├── layout.tsx                   # Shop layout with providers
│   │   ├── page.tsx                     # Home page
│   │   ├── products/
│   │   │   ├── page.tsx                 # Products listing
│   │   │   └── [handle]/
│   │   │       └── page.tsx             # Product detail
│   │   ├── categories/
│   │   │   ├── page.tsx                 # All categories
│   │   │   └── [category]/
│   │   │       └── page.tsx             # Category products
│   │   ├── checkout/
│   │   │   └── page.tsx                 # Checkout page
│   │   ├── payment-confirm/
│   │   │   └── page.tsx                 # Payment confirmation
│   │   ├── receipt/
│   │   │   └── [id]/
│   │   │       └── page.tsx             # Order receipt
│   │   ├── single-product/              # Landing pages
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── about-us/
│   │   │   └── page.tsx
│   │   ├── privacy-policy/
│   │   │   └── page.tsx
│   │   ├── terms-and-conditions/
│   │   │   └── page.tsx
│   │   └── return-and-cancellation-policy/
│   │       └── page.tsx
│   │
│   ├── merchant/                        # Multi-tenant routes
│   │   └── [shopId]/
│   │       └── ...                      # Same structure as (shop)
│   │
│   ├── api/                             # Route handlers
│   │   └── storefront/
│   │       └── v1/
│   │           ├── theme/
│   │           ├── products/
│   │           ├── page/
│   │           └── ...
│   │
│   ├── globals.css                      # Existing - Theme CSS
│   └── layout.tsx                       # Root layout
│
├── components/
│   ├── ui/                              # Existing shadcn components (13)
│   │
│   ├── builder/                         # Theme Builder components
│   │   ├── BlockRenderer.tsx            # Main JSON renderer
│   │   ├── IconRenderer.tsx
│   │   ├── RepeaterRenderer.tsx
│   │   ├── SwiperRenderer.tsx           # It'll be through Embla Carousel
│   │   ├── MarqueeRenderer.tsx
│   │   └── EventHandler.tsx
│   │
│   ├── products/                        # Product card variants
│   │   ├── ProductCard1.tsx
│   │   ├── ProductCard2.tsx
│   │   └── ... (16 cards)
│   │
│   ├── themes/                          # Static theme components
│   │   ├── basic/
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── pages/
│   │   │       ├── HomePage.tsx
│   │   │       ├── ProductsPage.tsx
│   │   │       └── ...
│   │   ├── premium/
│   │   ├── aurora/
│   │   ├── luxura/
│   │   └── sellora/
│   │
│   ├── landing-page/                    # Landing page themes
│   │   ├── LandingPageRenderer.tsx
│   │   ├── themes/
│   │   │   ├── arcadia/
│   │   │   ├── nirvana/
│   │   │   └── grip/
│   │   ├── checkout/
│   │   │   ├── CommonCheckoutForm.tsx
│   │   │   └── ...
│   │   └── shared/
│   │
│   ├── cart/                            # Cart components
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartFloatingButton.tsx
│   │   └── CartSummary.tsx
│   │
│   ├── checkout/                        # Checkout components
│   │   ├── CheckoutForm.tsx
│   │   ├── ContactSection.tsx
│   │   ├── ShippingAddressSection.tsx
│   │   ├── DeliveryZoneSection.tsx
│   │   ├── PaymentOptionsSection.tsx
│   │   └── OrderSummarySection.tsx
│   │
│   ├── shared/                          # Shared components
│   │   ├── ImageLightbox.tsx
│   │   ├── CustomerReviews.tsx
│   │   ├── Pagination.tsx
│   │   ├── SearchModal.tsx
│   │   ├── TopbarMessage.tsx
│   │   └── ...
│   │
│   ├── ThemeSelector.tsx                # Chooses builder vs static
│   └── PageContentSelector.tsx          # Page content by theme type
│
├── stores/                              # Zustand stores
│   ├── themeStore.ts                    # Theme JSON (builder)
│   ├── homepageStore.ts                 # Homepage sections (builder)
│   ├── productsStore.ts                 # Products with filters
│   ├── productDetailsStore.ts           # Single product
│   ├── shopStore.ts                     # Shop profile
│   ├── cartStore.ts                     # Cart with persistence
│   ├── checkoutStore.ts                 # Checkout state
│   ├── inventoryStore.ts                # Inventory filters
│   ├── analyticsStore.ts                # Analytics config
│   └── landingPageStore.ts              # Landing page state
│
├── hooks/                               # Custom hooks
│   ├── useTheme.ts                      # Theme config
│   ├── useHomepage.ts                   # Homepage config
│   ├── useProducts.ts                   # Products with filters
│   ├── useProductDetails.ts             # Product details
│   ├── useShop.ts                       # Shop data
│   ├── useCart.ts                       # Cart operations
│   ├── useCheckout.ts                   # Checkout calculations
│   ├── usePlaceOrder.ts                 # Order placement
│   ├── usePromoCode.ts                  # Promo validation
│   └── useAnalytics.ts                  # Analytics events
│
├── lib/
│   ├── utils.ts                         # Existing cn() utility
│   ├── block-utils.ts                   # Block renderer utilities
│   ├── api/
│   │   ├── axios.config.ts              # Axios setup
│   │   └── endpoints.ts                 # API endpoints
│   ├── utils/
│   │   ├── helpers.ts                   # General helpers
│   │   ├── delivery-charge.ts           # Delivery calculation
│   │   ├── theme-colors.ts              # Theme color utils
│   │   └── currency.ts                  # Currency formatting
│   ├── analytics/
│   │   ├── fpixel.ts                    # Facebook Pixel
│   │   ├── tpixel.ts                    # TikTok Pixel
│   │   └── gtm.ts                       # Google Tag Manager
│   └── encrypt-decrypt.ts               # API encryption
│
├── providers/
│   ├── QueryProvider.tsx                # TanStack Query provider
│   ├── ShopProvider.tsx                 # Shop context
│   ├── AnalyticsProvider.tsx            # Analytics wrapper
│   └── ThemeProvider.tsx                # Theme selection
│
├── types/
│   ├── shop.types.ts                    # Shop profile types
│   ├── inventory.types.ts               # Product types
│   ├── cart.types.ts                    # Cart types
│   ├── order.types.ts                   # Order types
│   ├── checkout.types.ts                # Checkout types
│   ├── analytics.types.ts               # Analytics types
│   ├── theme.types.ts                   # Theme builder types
│   └── landing-page.types.ts            # Landing page types
│
├── contexts/                            # React contexts (if needed)
│   └── DrawerContext.tsx                # Drawer state for builder
│
├── public/
│   └── locales/                         # i18n translations
│       ├── en/
│       │   └── translation.json
│       └── bn/
│           └── translation.json
│
└── ... config files
```

---

## Migration Phases

### Phase 1: Core Infrastructure Setup

**Goal:** Set up shared infrastructure that both theme systems will use.

#### 1.1 Install Required Dependencies

```bash
pnpm add zustand @tanstack/react-query axios nanoid
pnpm add crypto-js libphonenumber-js fuse.js
pnpm add embla-carousel-react
pnpm add react-hook-form @hookform/resolvers zod
pnpm add next-intl
pnpm add -D @types/crypto-js
```

#### 1.2 Create Types Directory

```typescript
// types/shop.types.ts
export interface ShopProfile {
  id: number;
  shop_uuid: string;
  shop_name: string;
  shop_phone: string;
  image_url?: string;
  favicon_url?: string;
  address: string;
  details?: string;
  vat_tax: number;
  specific_delivery_charges: Record<string, number>;
  others_delivery_charge: number;
  payment_methods?: string[];
  country_code: string;
  country_currency: string;
  baseUrl: string;
  baseFullUrl: string;
  shop_theme: ShopTheme;
  // Analytics
  hasPixelAccess?: boolean;
  pixel_id?: string;
  pixel_access_token?: string;
  hasGTMAccess?: boolean;
  gtm_id?: string;
  hasTikTokPixelAccess?: boolean;
  tiktok_pixel_id?: string;
  // Settings
  default_language_code?: string;
  delivery_option?: string;
  message_on_top?: string;
  order_verification_enabled?: boolean;
}

export interface ShopTheme {
  id: number;
  theme_type: 'builder' | 'static';
  // For static themes
  theme_name?: 'Basic' | 'Premium' | 'Aurora' | 'Luxura' | 'Sellora';
  theme_mode?: 'light' | 'dark';
  // For builder themes
  theme_json?: ZatiqTheme;
  // Common
  enable_buy_now_on_product_card: boolean;
  on_sale_inventories: InventoryProduct[];
  selected_categories: SelectedCategory[];
  carousels: Carousel[];
}
```

```typescript
// types/inventory.types.ts
export interface InventoryProduct {
  id: number;
  shop_id: number;
  name: string;
  image_url?: string;
  price: number;
  quantity: number;
  old_price: number;
  is_active: boolean;
  has_variant: boolean;
  images?: string[];
  categories: InventoryCategory[];
  variant_types: VariantType[];
  stocks: Stock[];
  is_stock_manage_by_variant: boolean;
  reviews: Review[];
  total_inventory_sold: number;
  video_link?: string;
}

export interface VariantType {
  id: number;
  title: string;
  is_mandatory?: boolean;
  variants: Variant[];
}

export interface Variant {
  id: number;
  name: string;
  price: number;
  image_url?: string;
}

export interface InventoryCategory {
  id: string | number;
  parent_id?: number;
  name: string;
  image_url?: string;
  sub_categories?: InventoryCategory[];
}
```

```typescript
// types/cart.types.ts
export interface CartProduct extends InventoryProduct {
  qty: number;
  cartId: string;
  selectedVariants: VariantsState;
}

export type VariantState = {
  variant_type_id: number;
  variant_id: number;
  price: number;
  variant_name: string;
  image_url?: string;
};

export type VariantsState = Record<number | string, VariantState>;
```

#### 1.3 Create Zustand Stores

```typescript
// stores/shopStore.ts
import { create } from 'zustand';
import type { ShopProfile } from '@/types/shop.types';

interface ShopState {
  shopDetails: ShopProfile | null;
  isSearchModalOpen: boolean;
  shopLanguage: string;

  setShopDetails: (details: ShopProfile) => void;
  setSearchModalOpen: (open: boolean) => void;
  setShopLanguage: (lang: string) => void;
}

export const useShopStore = create<ShopState>((set) => ({
  shopDetails: null,
  isSearchModalOpen: false,
  shopLanguage: 'en',

  setShopDetails: (details) => set({ shopDetails: details }),
  setSearchModalOpen: (open) => set({ isSearchModalOpen: open }),
  setShopLanguage: (lang) => set({ shopLanguage: lang }),
}));
```

```typescript
// stores/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartProduct } from '@/types/cart.types';
import { nanoid } from 'nanoid';

interface CartState {
  products: Record<string, CartProduct>;
  cartExpiry: string | null;
  orderStatus: 'success' | 'error' | undefined;
  isLoading: boolean;
  trackLink: string | null;

  addProduct: (product: CartProduct) => void;
  removeProduct: (cartId: string) => void;
  updateQuantity: (cartId: string, qty: number) => void;
  incrementQty: (cartId: string) => void;
  decrementQty: (cartId: string) => void;
  resetCart: () => void;
  setOrderStatus: (status: 'success' | 'error' | undefined) => void;
  setIsLoading: (loading: boolean) => void;
  setTrackLink: (link: string | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      products: {},
      cartExpiry: null,
      orderStatus: undefined,
      isLoading: false,
      trackLink: null,

      addProduct: (product) => {
        const cartId = product.cartId || nanoid();
        set((state) => ({
          products: {
            ...state.products,
            [cartId]: { ...product, cartId }
          },
          cartExpiry: Object.keys(state.products).length === 0
            ? new Date().toISOString()
            : state.cartExpiry,
        }));
      },

      removeProduct: (cartId) => {
        set((state) => {
          const newProducts = { ...state.products };
          delete newProducts[cartId];
          return {
            products: newProducts,
            cartExpiry: Object.keys(newProducts).length === 0 ? null : state.cartExpiry
          };
        });
      },

      updateQuantity: (cartId, qty) => {
        if (qty <= 0) {
          get().removeProduct(cartId);
          return;
        }
        set((state) => ({
          products: {
            ...state.products,
            [cartId]: { ...state.products[cartId], qty }
          }
        }));
      },

      incrementQty: (cartId) => {
        const product = get().products[cartId];
        if (product) {
          get().updateQuantity(cartId, product.qty + 1);
        }
      },

      decrementQty: (cartId) => {
        const product = get().products[cartId];
        if (product) {
          get().updateQuantity(cartId, product.qty - 1);
        }
      },

      resetCart: () => set({
        products: {},
        orderStatus: undefined,
        trackLink: null
      }),

      setOrderStatus: (status) => set({ orderStatus: status }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setTrackLink: (link) => set({ trackLink: link }),
    }),
    {
      name: 'zatiq-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        cartExpiry: state.cartExpiry
      }),
    }
  )
);

// Selectors
export const selectTotalItems = (state: CartState) =>
  Object.values(state.products).reduce((sum, p) => sum + p.qty, 0);

export const selectTotalPrice = (state: CartState) =>
  Object.values(state.products).reduce((sum, p) => sum + (p.price * p.qty), 0);

export const selectProductsArray = (state: CartState) =>
  Object.values(state.products);
```

#### 1.4 Setup TanStack Query Provider

```typescript
// providers/QueryProvider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

### Phase 2: Theme Builder Migration

**Goal:** Migrate the BlockRenderer and dynamic theme system from `storefront.zatiqeasy`.

#### 2.1 Files to Copy from `storefront.zatiqeasy`

**Stores:**
```
src/stores/themeStore.ts      → stores/themeStore.ts
src/stores/homepageStore.ts   → stores/homepageStore.ts
src/stores/productsStore.ts   → stores/productsStore.ts
src/stores/productDetailsStore.ts → stores/productDetailsStore.ts
src/stores/aboutUsStore.ts    → stores/aboutUsStore.ts
```

**Components:**
```
src/components/BlockRenderer.tsx     → components/builder/BlockRenderer.tsx
src/components/IconRenderer.tsx      → components/builder/IconRenderer.tsx
src/components/RepeaterRenderer.tsx  → components/builder/RepeaterRenderer.tsx
src/components/SwiperRenderer.tsx    → components/builder/SwiperRenderer.tsx     // I want to use Embla Carousel overall projects
src/components/MarqueeRenderer.tsx   → components/builder/MarqueeRenderer.tsx
```

**Product Cards:**
```
src/components/products/ProductCard1.tsx  → components/products/ProductCard1.tsx
src/components/products/ProductCard2.tsx  → components/products/ProductCard2.tsx
... (all 16 variants)
```

**Hooks:**
```
src/hooks/useTheme.ts          → hooks/useTheme.ts
src/hooks/useHomepage.ts       → hooks/useHomepage.ts
src/hooks/useProducts.ts       → hooks/useProducts.ts
src/hooks/useProductDetails.ts → hooks/useProductDetails.ts
src/hooks/useAboutUs.ts        → hooks/useAboutUs.ts
```

**Utilities:**
```
src/lib/block-utils.ts → lib/block-utils.ts
src/lib/types.ts       → types/theme.types.ts
```

---

### Phase 3: Static Themes Migration

**Goal:** Migrate the 5 static themes from `storefront.zatiqeasy.com`.

#### 3.1 Theme Structure Template

For each theme (Basic, Premium, Aurora, Luxura, Sellora), create:

```
components/themes/{theme}/
├── Layout.tsx              # Theme layout wrapper
├── Header.tsx              # Theme-specific header
├── Footer.tsx              # Theme-specific footer
├── pages/
│   ├── index.ts            # Export all pages
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CategoriesPage.tsx
│   └── CheckoutPage.tsx
├── components/
│   ├── ProductCard.tsx
│   ├── CategoryCard.tsx
│   ├── Carousel.tsx
│   ├── SearchModal.tsx
│   └── ...
```

#### 3.2 Files to Copy from `storefront.zatiqeasy.com`

```
src/www/e-commerce/themes/basic/     → components/themes/basic/
src/www/e-commerce/themes/premium/   → components/themes/premium/
src/www/e-commerce/themes/aurora/    → components/themes/aurora/
src/www/e-commerce/themes/luxura/    → components/themes/luxura/
src/www/e-commerce/themes/sellora/   → components/themes/sellora/
```

#### 3.3 Theme Selector Component

```typescript
// components/ThemeSelector.tsx
'use client';

import { useShopStore } from '@/stores/shopStore';
import BuilderLayout from '@/components/builder/BuilderLayout';
import BasicLayout from '@/components/themes/basic/Layout';
import PremiumLayout from '@/components/themes/premium/Layout';
import AuroraLayout from '@/components/themes/aurora/Layout';
import LuxuraLayout from '@/components/themes/luxura/Layout';
import SelloraLayout from '@/components/themes/sellora/Layout';

const staticThemeLayouts = {
  Basic: BasicLayout,
  Premium: PremiumLayout,
  Aurora: AuroraLayout,
  Luxura: LuxuraLayout,
  Sellora: SelloraLayout,
};

export default function ThemeSelector({ children }: { children: React.ReactNode }) {
  const shopDetails = useShopStore((state) => state.shopDetails);
  const themeType = shopDetails?.shop_theme?.theme_type || 'builder';
  const themeName = shopDetails?.shop_theme?.theme_name || 'Basic';

  if (themeType === 'builder') {
    return <BuilderLayout>{children}</BuilderLayout>;
  }

  const StaticLayout = staticThemeLayouts[themeName] || BasicLayout;
  return <StaticLayout>{children}</StaticLayout>;
}
```

---

### Phase 4: E-Commerce Features Migration

**Goal:** Migrate cart, checkout, payment features from `storefront.zatiqeasy.com`.

#### 4.1 Files to Copy

**Checkout Components:**
```
src/www/e-commerce/modules/order/common-checkout-form.tsx
  → components/checkout/CommonCheckoutForm.tsx

src/www/e-commerce/modules/order/components/
  → components/checkout/
```

**Cart Components:**
```
src/www/e-commerce/components/cart/
  → components/cart/
```

**Utilities:**
```
src/lib/utils/helpers.ts          → lib/utils/delivery-charge.ts
src/lib/encrypt-decrypt.js        → lib/encrypt-decrypt.ts
```

---

### Phase 5: Landing Page System Migration

**Goal:** Migrate the 3 landing page themes (Arcadia, Nirvana, Grip).

#### 5.1 Files to Copy

```
src/www/e-commerce/modules/single-page/
├── index.tsx                    → components/landing-page/LandingPageRenderer.tsx
├── single-page-scema.ts         → types/landing-page.types.ts
├── themes/arcadia/              → components/landing-page/themes/arcadia/
├── themes/nirvana/              → components/landing-page/themes/nirvana/
├── themes/grip/                 → components/landing-page/themes/grip/
└── components/                  → components/landing-page/shared/
```

---

### Phase 6: Analytics & Utilities Migration

#### 6.1 Files to Copy

```
src/lib/utils/fpixel.util.ts     → lib/analytics/fpixel.ts
src/lib/utils/tpixel.util.ts     → lib/analytics/tpixel.ts
src/lib/utils/gtm.util.ts        → lib/analytics/gtm.ts
src/lib/utils/helpers.util.ts    → lib/utils/helpers.ts
src/lib/utils/                   → lib/utils/
```

---

## Migration Checklist

### Phase 1: Core Infrastructure
- [ ] Install dependencies (zustand, tanstack-query, axios, etc.)
- [ ] Create `types/` directory with all type definitions
- [ ] Create `stores/shopStore.ts`
- [ ] Create `stores/cartStore.ts`
- [ ] Create `stores/checkoutStore.ts`
- [ ] Setup QueryProvider
- [ ] Setup API client with encryption

### Phase 2: Theme Builder
- [ ] Copy `stores/themeStore.ts`
- [ ] Copy `stores/homepageStore.ts`
- [ ] Copy `stores/productsStore.ts`
- [ ] Copy `stores/productDetailsStore.ts`
- [ ] Copy BlockRenderer and related components
- [ ] Copy all 16 ProductCard variants
- [ ] Copy hooks (useTheme, useHomepage, etc.)
- [ ] Copy block-utils.ts

### Phase 3: Static Themes
- [ ] Create Basic theme structure
- [ ] Create Premium theme structure
- [ ] Create Aurora theme structure
- [ ] Create Luxura theme structure
- [ ] Create Sellora theme structure
- [ ] Create ThemeSelector component
- [ ] Create PageContentSelector component

### Phase 4: E-Commerce Features
- [ ] Create checkout components
- [ ] Migrate payment gateway integrations
- [ ] Migrate delivery charge calculator
- [ ] Migrate promo code validation
- [ ] Create receipt page

### Phase 5: Landing Pages
- [ ] Create landing page types
- [ ] Create landingPageStore
- [ ] Migrate Arcadia theme
- [ ] Migrate Nirvana theme
- [ ] Migrate Grip theme (with embedded checkout)
- [ ] Create LandingPageRenderer

### Phase 6: Analytics & Utilities
- [ ] Create analyticsStore
- [ ] Migrate Facebook Pixel utilities
- [ ] Migrate TikTok Pixel utilities
- [ ] Migrate GTM utilities
- [ ] Migrate helper functions
- [ ] Migrate encryption utilities

### Phase 7: Pages & Routes
- [ ] Create (shop) layout with providers
- [ ] Create home page
- [ ] Create products listing page
- [ ] Create product detail page
- [ ] Create categories pages
- [ ] Create checkout page
- [ ] Create payment confirmation page
- [ ] Create receipt page
- [ ] Create single-product landing page route
- [ ] Create static pages (about, privacy, terms)

### Phase 8: Multi-tenant Support
- [ ] Create merchant/[shopId] routes
- [ ] Setup shop identification middleware
- [ ] Test SHOPLINK mode

---

## Important Notes

### Component Compatibility

The new project uses `@base-ui/react` instead of Radix UI. When migrating:

1. **Dialog/Modal**: Use existing `alert-dialog` component
2. **Select/Dropdown**: Use existing `select` and `dropdown-menu` components
3. **Form Fields**: Use the comprehensive `field` component system
4. **Accordion**: May need to install from shadcn

### Tailwind CSS v4 Differences

The new project uses Tailwind CSS v4 with:
- **OKLch color space** for better color manipulation
- **CSS custom properties** for theming (in globals.css)
- **No separate tailwind.config.js** - configuration is inline

### What to Keep from This Project

- All 13 pre-built shadcn components in `components/ui/`
- The `lib/utils.ts` with `cn()` function
- The font setup in `layout.tsx`
- The CSS theming approach in `globals.css`

### Next.js 16 Features to Use

- **Server Components** for data fetching
- **Server Actions** for mutations (order placement)
- **Parallel Routes** for modals
- **Intercepting Routes** for cart drawer
- **Streaming** for loading states
