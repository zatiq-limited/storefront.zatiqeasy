# Zatiq Storefront Integration Plan

## Executive Summary

This document outlines the strategy to integrate the **static theme system** from `storefront.zatiqeasy.com` into the **theme builder system** in `storefront.zatiqeasy`, creating a unified hybrid architecture that supports both approaches.

---

## Current State Analysis

### New Project: `storefront.zatiqeasy` (Target)

| Aspect               | Current State                                  |
| -------------------- | ---------------------------------------------- |
| **Framework**        | **Next.js 16.0.10** with App Router            |
| **React**            | **React 19.2.1**                               |
| **State Management** | **Zustand 5.0.9**                              |
| **Data Fetching**    | **TanStack Query v5.90.12**                    |
| **Styling**          | **Tailwind CSS v4**                            |
| **Theme System**     | JSON Schema-driven BlockRenderer (V3.0 Schema) |
| **TypeScript**       | Yes (TypeScript 5)                             |
| **Carousel**         | Swiper 12.0.3, Embla Carousel 8.6.0            |
| **Icons**            | Lucide React 0.561.0                           |
| **UI Primitives**    | Radix UI (Select, Slot)                        |

**Key Features:**

- Dynamic UI rendering from JSON API responses via BlockRenderer
- V3.0 Schema rendering with data binding (bind_content, bind_src, bind_href, etc.)
- BlockRenderer supports: repeaters, swipers, marquees, icons, conditions, events
- Section-based page configuration
- **16 product card variants** (ProductCard1 through ProductCard16)
- **2 pagination styles**, **2 sidebar styles**, **2 hero styles**
- Global sections (announcement, header, announcementAfterHeader, footer) from JSON
- DrawerContext for managing toggle states across block hierarchy
- Event system: navigate, toggle_drawer, toggle_theme, search, slider controls

**Existing Stores (5 total):**

- `themeStore.ts` - Theme JSON data (globalSections, templates)
- `homepageStore.ts` - Homepage JSON data (sections)
- `productsStore.ts` - Products list, filters (page, limit, category, search, sort), pagination
- `productDetailsStore.ts` - Single product, variants, quantity, computedPrice
- `aboutUsStore.ts` - About Us page data

**Existing Hooks (5 total):**

- `useTheme()` - Fetch theme config (staleTime: Infinity)
- `useHomepage()` - Fetch homepage config
- `useProducts()` - Products with filtering, pagination, sorting
- `useProductDetails(handle)` - Single product with variants, stock management
- `useAboutUs()` - About Us page

**Pages (App Router):**

- `/` - Homepage
- `/products` - Products listing
- `/products/[handle]` - Product details
- `/about-us` - About Us

**API Routes:**

- `GET /api/storefront/v1/theme` - Theme configuration
- `GET /api/storefront/v1/products` - Products with filters
- `GET /api/storefront/v1/products/[handle]` - Single product
- `GET /api/storefront/v1/page/home` - Homepage config
- `GET /api/storefront/v1/page/products` - Products page config
- `GET /api/storefront/v1/page/product-details` - Product details config
- `GET /api/storefront/v1/page/about-us` - About Us config

**Total Source Files:** ~60+ TypeScript files

---

### Old Project: `storefront.zatiqeasy.com` (Source)

| Aspect               | Current State                                             |
| -------------------- | --------------------------------------------------------- |
| **Framework**        | **Next.js 14.2.33** with Pages Router                     |
| **React**            | **React 18.3.1**                                          |
| **State Management** | **React Context API** (6 contexts)                        |
| **Data Fetching**    | **TanStack Query v4.42.0**                                |
| **Styling**          | **Tailwind CSS v4.1.17**                                  |
| **Theme System**     | 5 Static Themes (Basic, Premium, Aurora, Luxura, Sellora) |
| **TypeScript**       | Yes (TypeScript 5.9.3)                                    |
| **Forms**            | React Hook Form 7.68.0                                    |
| **i18n**             | ni18n + react-i18next                                     |
| **Phone Validation** | libphonenumber-js                                         |
| **Encryption**       | crypto-js                                                 |

**Key Features:**

- Pre-built theme components per theme (5 complete themes)
- Multi-tenant support (SHOPLINK/STANDALONE modes)
- Complete e-commerce flow (Cart, Checkout, Payment, Receipt)
- Analytics integration (Facebook Pixel, GTM, TikTok Pixel, Firebase)
- Payment gateways (bKash, AamarPay, COD, zatiq_seller_pay, self_mfs)
- i18n support (English `en`, Bengali `bn`)
- Encrypted API communication (AES encryption)
- Single-product landing pages (Nirvana, Arcadia, Grip themes)
- Visitor tracking with 24-hour expiry
- Cart auto-expiry (1 day)
- Promo code validation
- Weight-based delivery charges
- Phone verification with OTP

**Existing Contexts (6 total):**

- `ShopContext` - Shop profile, visitor tracking, language settings
- `CartContext` - Cart state with localStorage persistence, order placement with retry
- `CheckoutContext` - Form state (react-hook-form), delivery zones, promo codes, tax calculation
- `InventoryContext` - Products, categories, filtering (Fuse.js search), price ranges
- `ProductContext` - Variant selection, stock management, pricing calculation
- `GTMPixelContext` - Facebook Pixel, GTM, TikTok Pixel, Firebase Analytics

**Total Source Files:** **445 TypeScript/JavaScript files**

**Pages (37 page files):**

- `/` - Home (with single product landing page support)
- `/products` - All products
- `/products/[productId]` - Product detail
- `/categories` - All categories
- `/categories/[category]` - Category products
- `/checkout` - Checkout with delivery/payment
- `/payment-confirm` - Payment confirmation
- `/receipt/[id]` - Order receipt
- `/about-us`, `/privacy-policy`, `/terms-and-conditions`, `/return-policy`
- `/single-product/[slug]` - Custom landing pages
- `/merchant/[shopId]/*` - Multi-tenant routes (13 routes)
- `/api/*` - API routes (sitemaps, robots, facebook-feed, image download)

---

## Architecture Decision

### Hybrid Theme System

The integrated system will support **two theme modes**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ZATIQ STOREFRONT                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────┐     ┌─────────────────────────────┐   │
│  │   THEME BUILDER     │     │     STATIC THEMES           │   │
│  │   (JSON-Driven)     │     │   (Pre-built Components)    │   │
│  ├─────────────────────┤     ├─────────────────────────────┤   │
│  │ - BlockRenderer     │     │ - Basic                     │   │
│  │ - Dynamic sections  │     │ - Premium                   │   │
│  │ - API-configured    │     │ - Aurora                    │   │
│  │ - Full flexibility  │     │ - Luxura                    │   │
│  │                     │     │ - Sellora                   │   │
│  └─────────────────────┘     └─────────────────────────────┘   │
│             │                           │                       │
│             └───────────┬───────────────┘                       │
│                         ▼                                       │
│          ┌─────────────────────────────┐                        │
│          │    SHARED INFRASTRUCTURE    │                        │
│          ├─────────────────────────────┤                        │
│          │ - Zustand Stores            │                        │
│          │ - TanStack Query            │                        │
│          │ - Types & Interfaces        │                        │
│          │ - API Layer                 │                        │
│          │ - Utilities                 │                        │
│          │ - Analytics                 │                        │
│          │ - Payment Integration       │                        │
│          └─────────────────────────────┘                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Theme Selection Logic

```typescript
// The theme_type determines which rendering system to use
type ThemeType = "builder" | "static";

interface ShopTheme {
  theme_type: ThemeType;
  // For builder themes
  theme_json?: ZatiqTheme;
  // For static themes
  theme_name?: "Basic" | "Premium" | "Aurora" | "Luxura" | "Sellora";
  theme_mode?: "light" | "dark";
}
```

---

## Target Directory Structure

```
storefront.zatiqeasy/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── (shop)/                       # Shop route group
│   │   │   ├── layout.tsx                # Shop layout with providers
│   │   │   ├── page.tsx                  # Home page
│   │   │   ├── products/
│   │   │   │   ├── page.tsx              # Products listing
│   │   │   │   └── [handle]/
│   │   │   │       └── page.tsx          # Product detail
│   │   │   ├── categories/
│   │   │   │   ├── page.tsx              # All categories
│   │   │   │   └── [category]/
│   │   │   │       └── page.tsx          # Category products
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx              # Checkout page
│   │   │   ├── payment-confirm/
│   │   │   │   └── page.tsx              # Payment confirmation
│   │   │   ├── receipt/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx          # Order receipt
│   │   │   ├── about-us/
│   │   │   │   └── page.tsx
│   │   │   ├── privacy-policy/
│   │   │   │   └── page.tsx
│   │   │   ├── terms-and-conditions/
│   │   │   │   └── page.tsx
│   │   │   └── return-policy/
│   │   │       └── page.tsx
│   │   ├── merchant/                     # Multi-tenant routes
│   │   │   └── [shopId]/
│   │   │       └── ...                   # Same structure as (shop)
│   │   ├── single-product/               # Landing pages
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── api/                          # Route handlers
│   │   │   └── storefront/
│   │   │       └── v1/
│   │   │           ├── theme/
│   │   │           ├── page/
│   │   │           ├── products/
│   │   │           └── ...
│   │   └── layout.tsx                    # Root layout
│   │
│   ├── components/
│   │   ├── BlockRenderer.tsx             # Theme builder renderer
│   │   ├── ThemeSelector.tsx             # NEW: Chooses between builder/static
│   │   ├── builder/                      # Theme builder components
│   │   │   ├── IconRenderer.tsx
│   │   │   ├── RepeaterRenderer.tsx
│   │   │   ├── SwiperRenderer.tsx
│   │   │   ├── MarqueeRenderer.tsx
│   │   │   └── ...
│   │   ├── products/                     # Shared product components
│   │   │   ├── ProductCard1.tsx
│   │   │   ├── ProductCard2.tsx
│   │   │   └── ... (16 cards)
│   │   ├── themes/                       # NEW: Static theme components
│   │   │   ├── basic/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── HomePage.tsx
│   │   │   │   └── ...
│   │   │   ├── premium/
│   │   │   ├── aurora/
│   │   │   ├── luxura/
│   │   │   └── sellora/
│   │   ├── checkout/                     # NEW: Checkout components
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── DeliverySection.tsx
│   │   │   ├── PaymentSection.tsx
│   │   │   ├── OrderSummary.tsx
│   │   │   └── PromoCodeSection.tsx
│   │   ├── cart/                         # NEW: Cart components
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartFloatingButton.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── shared/                       # Shared UI components
│   │   │   ├── ImageLightbox.tsx
│   │   │   ├── CustomerReviews.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchModal.tsx
│   │   │   └── ...
│   │   └── ui/                           # Shadcn UI components
│   │
│   ├── stores/                           # Zustand stores
│   │   ├── themeStore.ts                 # Existing
│   │   ├── homepageStore.ts              # Existing
│   │   ├── productsStore.ts              # Existing
│   │   ├── productDetailsStore.ts        # Existing
│   │   ├── shopStore.ts                  # NEW: Shop profile
│   │   ├── cartStore.ts                  # NEW: Cart state
│   │   ├── checkoutStore.ts              # NEW: Checkout state
│   │   ├── inventoryStore.ts             # NEW: Inventory filters
│   │   └── analyticsStore.ts             # NEW: Analytics state
│   │
│   ├── hooks/
│   │   ├── useTheme.ts                   # Existing
│   │   ├── useHomepage.ts                # Existing
│   │   ├── useProducts.ts                # Existing
│   │   ├── useProductDetails.ts          # Existing
│   │   ├── useShop.ts                    # NEW: Shop data
│   │   ├── useCart.ts                    # NEW: Cart operations
│   │   ├── useCheckout.ts                # NEW: Checkout operations
│   │   ├── usePlaceOrder.ts              # NEW: Order placement
│   │   ├── usePromoCode.ts               # NEW: Promo validation
│   │   └── useAnalytics.ts               # NEW: Analytics events
│   │
│   ├── lib/
│   │   ├── types.ts                      # Existing + extended
│   │   ├── block-utils.ts                # Existing
│   │   ├── api/
│   │   │   ├── axios.config.ts           # NEW: Axios setup
│   │   │   └── endpoints.ts              # NEW: API endpoints
│   │   ├── utils/
│   │   │   ├── helpers.ts                # NEW: Utility functions
│   │   │   ├── delivery-charge.ts        # NEW: Delivery calculation
│   │   │   ├── theme-colors.ts           # NEW: Theme color utils
│   │   │   └── currency.ts               # NEW: Currency formatting
│   │   ├── analytics/
│   │   │   ├── fpixel.ts                 # NEW: Facebook Pixel
│   │   │   ├── tpixel.ts                 # NEW: TikTok Pixel
│   │   │   └── gtm.ts                    # NEW: Google Tag Manager
│   │   └── encrypt-decrypt.ts            # NEW: API encryption
│   │
│   ├── providers/
│   │   ├── QueryProvider.tsx             # Existing
│   │   ├── ShopProvider.tsx              # NEW: Shop context
│   │   ├── AnalyticsProvider.tsx         # NEW: Analytics wrapper
│   │   └── ThemeProvider.tsx             # NEW: Theme selection
│   │
│   └── types/                            # NEW: Organized types
│       ├── shop.types.ts
│       ├── cart.types.ts
│       ├── inventory.types.ts
│       ├── order.types.ts
│       ├── checkout.types.ts
│       └── analytics.types.ts
│
├── public/
│   └── locales/                          # i18n translations
│       ├── en/
│       │   └── translation.json
│       └── bn/
│           └── translation.json
│
└── ... config files
```

---

## Migration Phases

### Phase 1: Core Infrastructure (Foundation)

**Goal:** Set up shared infrastructure that both theme systems will use.

#### 1.1 Types Migration

Copy and organize types from old project:

```typescript
// src/types/shop.types.ts
export interface ShopProfile {
  id: number;
  shop_uuid: string;
  shop_name: string;
  shop_phone: string;
  image_url?: string;
  favicon_url?: string;
  address: string;
  vat_tax: number;
  specific_delivery_charges: Record<string, number>;
  others_delivery_charge: number;
  payment_methods?: string[];
  shop_theme: ShopTheme;
  // ... rest of fields
}

export interface ShopTheme {
  id: number;
  theme_type: "builder" | "static";
  // For static themes
  theme_name?: "Basic" | "Premium" | "Aurora" | "Luxura" | "Sellora";
  theme_mode?: "light" | "dark";
  // For builder themes
  theme_json?: ZatiqTheme;
  // Common
  enable_buy_now_on_product_card: boolean;
  on_sale_inventories: InventoryProduct[];
  selected_categories: SelectedCategory[];
  carousels: Carousel[];
}
```

#### 1.2 API Layer Setup

```typescript
// src/lib/api/axios.config.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Device-Type": "Web",
    "Application-Type": "Online_Shop",
  },
});

// Add encryption interceptors
apiClient.interceptors.request.use((config) => {
  // Encrypt payload if needed
  return config;
});

apiClient.interceptors.response.use((response) => {
  // Decrypt response if needed
  return response;
});
```

#### 1.3 Core Zustand Stores

```typescript
// src/stores/shopStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShopProfile } from "@/types/shop.types";

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
  shopLanguage: "en",

  setShopDetails: (details) => set({ shopDetails: details }),
  setSearchModalOpen: (open) => set({ isSearchModalOpen: open }),
  setShopLanguage: (lang) => set({ shopLanguage: lang }),
}));
```

```typescript
// src/stores/cartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartProduct } from "@/types/cart.types";
import { nanoid } from "nanoid";

interface CartState {
  products: Record<string, CartProduct>;
  cartExpiry: string | null;
  orderStatus: "success" | "error" | undefined;
  isLoading: boolean;
  trackLink: string | null;

  // Actions
  addProduct: (product: CartProduct) => void;
  removeProduct: (cartId: string) => void;
  updateQuantity: (cartId: string, qty: number) => void;
  incrementQty: (cartId: string) => void;
  decrementQty: (cartId: string) => void;
  resetCart: () => void;
  setOrderStatus: (status: "success" | "error" | undefined) => void;
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
        const cartId = nanoid();
        set((state) => ({
          products: {
            ...state.products,
            [cartId]: { ...product, cartId },
          },
          cartExpiry:
            Object.keys(state.products).length === 0
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
            cartExpiry:
              Object.keys(newProducts).length === 0 ? null : state.cartExpiry,
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
            [cartId]: { ...state.products[cartId], qty },
          },
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

      resetCart: () =>
        set({
          products: {},
          orderStatus: undefined,
          trackLink: null,
        }),

      setOrderStatus: (status) => set({ orderStatus: status }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setTrackLink: (link) => set({ trackLink: link }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        cartExpiry: state.cartExpiry,
      }),
    }
  )
);

// Selectors
export const selectTotalItems = (state: CartState) =>
  Object.values(state.products).reduce((sum, p) => sum + p.qty, 0);

export const selectTotalPrice = (state: CartState) =>
  Object.values(state.products).reduce((sum, p) => sum + p.price * p.qty, 0);

export const selectProductsArray = (state: CartState) =>
  Object.values(state.products);
```

---

### Phase 2: Theme Selection System

**Goal:** Create a unified system that selects between builder and static themes.

#### 2.1 Theme Selector Component

```typescript
// src/components/ThemeSelector.tsx
"use client";

import { useShopStore } from "@/stores/shopStore";
import ThemeLayout from "@/app/_layouts/theme/layout";

// Static theme imports
import BasicLayout from "@/components/themes/basic/Layout";
import PremiumLayout from "@/components/themes/premium/Layout";
import AuroraLayout from "@/components/themes/aurora/Layout";
import LuxuraLayout from "@/components/themes/luxura/Layout";
import SelloraLayout from "@/components/themes/sellora/Layout";

interface ThemeSelectorProps {
  children: React.ReactNode;
}

const staticThemeLayouts = {
  Basic: BasicLayout,
  Premium: PremiumLayout,
  Aurora: AuroraLayout,
  Luxura: LuxuraLayout,
  Sellora: SelloraLayout,
};

export default function ThemeSelector({ children }: ThemeSelectorProps) {
  const shopDetails = useShopStore((state) => state.shopDetails);

  const themeType = shopDetails?.shop_theme?.theme_type || "builder";
  const themeName = shopDetails?.shop_theme?.theme_name || "Basic";

  // Use Theme Builder (JSON-driven)
  if (themeType === "builder") {
    return <ThemeLayout>{children}</ThemeLayout>;
  }

  // Use Static Theme (Pre-built components)
  const StaticLayout = staticThemeLayouts[themeName] || BasicLayout;
  return <StaticLayout shopDetails={shopDetails}>{children}</StaticLayout>;
}
```

#### 2.2 Page Content Selector

```typescript
// src/components/PageContentSelector.tsx
"use client";

import { useShopStore } from "@/stores/shopStore";

// Builder page renderers
import HomepageRenderer from "@/components/HomepageRenderer";
import ProductsPageRenderer from "@/components/ProductsPageRenderer";
import ProductDetailsPageRenderer from "@/components/ProductDetailsPageRenderer";

// Static theme page components
import * as BasicPages from "@/components/themes/basic/pages";
import * as PremiumPages from "@/components/themes/premium/pages";
import * as AuroraPages from "@/components/themes/aurora/pages";
import * as LuxuraPages from "@/components/themes/luxura/pages";
import * as SelloraPages from "@/components/themes/sellora/pages";

const staticThemePages = {
  Basic: BasicPages,
  Premium: PremiumPages,
  Aurora: AuroraPages,
  Luxura: LuxuraPages,
  Sellora: SelloraPages,
};

interface PageContentSelectorProps {
  pageType: "home" | "products" | "product-detail" | "categories" | "checkout";
  // Props passed from the page
  [key: string]: unknown;
}

export default function PageContentSelector({
  pageType,
  ...props
}: PageContentSelectorProps) {
  const shopDetails = useShopStore((state) => state.shopDetails);

  const themeType = shopDetails?.shop_theme?.theme_type || "builder";
  const themeName = shopDetails?.shop_theme?.theme_name || "Basic";

  if (themeType === "builder") {
    // Use JSON-driven renderers
    switch (pageType) {
      case "home":
        return <HomepageRenderer {...props} />;
      case "products":
        return <ProductsPageRenderer {...props} />;
      case "product-detail":
        return <ProductDetailsPageRenderer {...props} />;
      default:
        return null;
    }
  }

  // Use Static theme components
  const ThemePages = staticThemePages[themeName] || staticThemePages.Basic;

  switch (pageType) {
    case "home":
      return <ThemePages.HomePage {...props} />;
    case "products":
      return <ThemePages.ProductsPage {...props} />;
    case "product-detail":
      return <ThemePages.ProductDetailPage {...props} />;
    case "categories":
      return <ThemePages.CategoriesPage {...props} />;
    case "checkout":
      return <ThemePages.CheckoutPage {...props} />;
    default:
      return null;
  }
}
```

---

### Phase 3: Static Theme Components Migration

**Goal:** Migrate all 5 static themes from the old project.

#### 3.1 Theme Structure

Each static theme should follow this structure:

```
src/components/themes/basic/
├── Layout.tsx              # Theme layout (header, footer wrapper)
├── Header.tsx              # Theme-specific header
├── Footer.tsx              # Theme-specific footer
├── pages/
│   ├── index.ts            # Export all pages
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CategoriesPage.tsx
│   ├── CheckoutPage.tsx
│   └── ...
├── components/
│   ├── ProductCard.tsx
│   ├── CategoryCard.tsx
│   ├── Carousel.tsx
│   ├── SearchModal.tsx
│   └── ...
└── styles/
    └── theme.css           # Theme-specific styles
```

#### 3.2 Example: Basic Theme Layout

```typescript
// src/components/themes/basic/Layout.tsx
"use client";

import { ReactNode } from "react";
import type { ShopProfile } from "@/types/shop.types";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchModal from "./components/SearchModal";

interface BasicLayoutProps {
  children: ReactNode;
  shopDetails: ShopProfile | null;
}

export default function BasicLayout({
  children,
  shopDetails,
}: BasicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar Message */}
      {shopDetails?.message_on_top && (
        <div className="bg-primary text-white text-center py-2 text-sm">
          {shopDetails.message_on_top}
        </div>
      )}

      {/* Header */}
      <Header shopDetails={shopDetails} />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer shopDetails={shopDetails} />

      {/* Global Components */}
      <CartDrawer />
      <SearchModal />
    </div>
  );
}
```

#### 3.3 Example: Basic Theme HomePage

```typescript
// src/components/themes/basic/pages/HomePage.tsx
"use client";

import { useShopStore } from "@/stores/shopStore";
import { useInventoryStore } from "@/stores/inventoryStore";
import ProductCard from "../components/ProductCard";
import CategorySection from "../components/CategorySection";
import Carousel from "../components/Carousel";

export default function HomePage() {
  const shopDetails = useShopStore((state) => state.shopDetails);
  const products = useInventoryStore((state) => state.products);

  const shopTheme = shopDetails?.shop_theme;
  const carousels = shopTheme?.carousels || [];
  const selectedCategories = shopTheme?.selected_categories || [];
  const onSaleProducts = shopTheme?.on_sale_inventories || [];

  return (
    <div className="basic-theme-home">
      {/* Carousel Section */}
      {carousels.length > 0 && (
        <section className="mb-8">
          <Carousel slides={carousels} />
        </section>
      )}

      {/* Categories Section */}
      {selectedCategories.length > 0 && (
        <section className="container mx-auto px-4 mb-8">
          <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {selectedCategories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* On Sale Products */}
      {onSaleProducts.length > 0 && (
        <section className="container mx-auto px-4 mb-8">
          <h2 className="text-2xl font-bold mb-4">On Sale</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {onSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">All Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.slice(0, 20).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

---

### Phase 4: E-Commerce Features Migration

**Goal:** Migrate all e-commerce functionality (Cart, Checkout, Payment, Orders).

#### 4.1 Checkout Store

```typescript
// src/stores/checkoutStore.ts
import { create } from "zustand";
import type {
  Division,
  District,
  Upazila,
  PromoCode,
} from "@/types/checkout.types";

interface CheckoutState {
  // Location
  selectedDivision: string;
  selectedDistrict: string;
  selectedUpazila: string;
  selectedDeliveryZone: string;

  // Location data
  divisions: Division[];
  districts: Record<string, District[]>;
  upazilas: Record<string, Record<string, Upazila[]>>;

  // Payment
  selectedPaymentMethod: string;
  isFullOnlinePayment: boolean;

  // Promo
  promoCode: PromoCode | null;
  promoCodeSearch: string;
  promoCodeMessage: string;
  discountAmount: number;

  // Customer
  fullPhoneNumber: string;
  countryCallingCode: string;

  // Terms
  acceptedTerms: boolean;

  // Actions
  setSelectedDivision: (division: string) => void;
  setSelectedDistrict: (district: string) => void;
  setSelectedUpazila: (upazila: string) => void;
  setSelectedDeliveryZone: (zone: string) => void;
  setDivisions: (divisions: Division[]) => void;
  setSelectedPaymentMethod: (method: string) => void;
  setPromoCode: (code: PromoCode | null) => void;
  setDiscountAmount: (amount: number) => void;
  setPromoCodeMessage: (message: string) => void;
  setFullPhoneNumber: (phone: string) => void;
  setAcceptedTerms: (accepted: boolean) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  selectedDivision: "",
  selectedDistrict: "",
  selectedUpazila: "",
  selectedDeliveryZone: "Others",
  divisions: [],
  districts: {},
  upazilas: {},
  selectedPaymentMethod: "cod",
  isFullOnlinePayment: true,
  promoCode: null,
  promoCodeSearch: "",
  promoCodeMessage: "",
  discountAmount: 0,
  fullPhoneNumber: "",
  countryCallingCode: "+880",
  acceptedTerms: false,

  setSelectedDivision: (division) =>
    set({
      selectedDivision: division,
      selectedDistrict: "",
      selectedUpazila: "",
    }),
  setSelectedDistrict: (district) =>
    set({
      selectedDistrict: district,
      selectedUpazila: "",
    }),
  setSelectedUpazila: (upazila) => set({ selectedUpazila: upazila }),
  setSelectedDeliveryZone: (zone) => set({ selectedDeliveryZone: zone }),
  setDivisions: (divisions) => {
    const districts: Record<string, District[]> = {};
    const upazilas: Record<string, Record<string, Upazila[]>> = {};

    divisions.forEach((div) => {
      districts[div.name] = div.districts || [];
      upazilas[div.name] = {};
      div.districts?.forEach((dist) => {
        upazilas[div.name][dist.name] = dist.upazilas || [];
      });
    });

    set({ divisions, districts, upazilas });
  },
  setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),
  setPromoCode: (code) => set({ promoCode: code }),
  setDiscountAmount: (amount) => set({ discountAmount: amount }),
  setPromoCodeMessage: (message) => set({ promoCodeMessage: message }),
  setFullPhoneNumber: (phone) => set({ fullPhoneNumber: phone }),
  setAcceptedTerms: (accepted) => set({ acceptedTerms: accepted }),
  resetCheckout: () =>
    set({
      selectedDivision: "",
      selectedDistrict: "",
      selectedUpazila: "",
      selectedDeliveryZone: "Others",
      selectedPaymentMethod: "cod",
      promoCode: null,
      promoCodeSearch: "",
      promoCodeMessage: "",
      discountAmount: 0,
      fullPhoneNumber: "",
      acceptedTerms: false,
    }),
}));
```

#### 4.2 Checkout Hook

```typescript
// src/hooks/useCheckout.ts
import { useMemo } from "react";
import { useShopStore } from "@/stores/shopStore";
import {
  useCartStore,
  selectProductsArray,
  selectTotalPrice,
} from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { calculateDeliveryCharge } from "@/lib/utils/delivery-charge";

export function useCheckout() {
  const shopDetails = useShopStore((state) => state.shopDetails);
  const cartProducts = useCartStore(selectProductsArray);
  const cartTotal = useCartStore(selectTotalPrice);

  const {
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    selectedDeliveryZone,
    selectedPaymentMethod,
    promoCode,
    discountAmount,
  } = useCheckoutStore();

  // Calculate delivery charge
  const deliveryCharge = useMemo(() => {
    if (!shopDetails) return 0;

    return calculateDeliveryCharge({
      shopDetails,
      products: cartProducts,
      selectedDivision,
      selectedDistrict,
      selectedUpazila,
      selectedDeliveryZone,
    });
  }, [
    shopDetails,
    cartProducts,
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    selectedDeliveryZone,
  ]);

  // Calculate tax
  const taxAmount = useMemo(() => {
    const vatRate = shopDetails?.vat_tax || 0;
    return (cartTotal * vatRate) / 100;
  }, [cartTotal, shopDetails?.vat_tax]);

  // Calculate grand total
  const grandTotal = useMemo(() => {
    return cartTotal + deliveryCharge + taxAmount - discountAmount;
  }, [cartTotal, deliveryCharge, taxAmount, discountAmount]);

  // Calculate advance payment (if applicable)
  const advancePayment = useMemo(() => {
    if (!shopDetails || selectedPaymentMethod !== "partial_payment") {
      return grandTotal;
    }

    const advanceType = shopDetails.advance_payment_type;
    const fixedAmount = shopDetails.advanced_payment_fixed_amount || 0;
    const percentage = shopDetails.advanced_payment_percentage || 0;

    if (advanceType === "fixed") {
      return Math.min(fixedAmount, grandTotal);
    } else if (advanceType === "percentage") {
      return (grandTotal * percentage) / 100;
    }

    return grandTotal;
  }, [shopDetails, selectedPaymentMethod, grandTotal]);

  return {
    // Amounts
    subtotal: cartTotal,
    deliveryCharge,
    taxAmount,
    discountAmount,
    grandTotal,
    advancePayment,

    // Products
    products: cartProducts,

    // Shop
    shopDetails,

    // State
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    selectedDeliveryZone,
    selectedPaymentMethod,
    promoCode,
  };
}
```

#### 4.3 Place Order Hook

```typescript
// src/hooks/usePlaceOrder.ts
import { useMutation } from "@tanstack/react-query";
import { useCartStore } from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useShopStore } from "@/stores/shopStore";
import { apiClient } from "@/lib/api/axios.config";
import { encryptData } from "@/lib/encrypt-decrypt";
import { trackPurchase } from "@/lib/analytics/fpixel";

interface OrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  division: string;
  district: string;
  upazila: string;
  delivery_zone: string;
  payment_method: string;
  note?: string;
  promo_code_id?: number;
  products: Array<{
    inventory_id: number;
    quantity: number;
    selected_variants: Record<string, unknown>;
  }>;
}

export function usePlaceOrder() {
  const resetCart = useCartStore((state) => state.resetCart);
  const setOrderStatus = useCartStore((state) => state.setOrderStatus);
  const setTrackLink = useCartStore((state) => state.setTrackLink);
  const resetCheckout = useCheckoutStore((state) => state.resetCheckout);
  const shopDetails = useShopStore((state) => state.shopDetails);

  return useMutation({
    mutationFn: async (payload: OrderPayload) => {
      const response = await apiClient.post("/api/v1/live/receipts", {
        payload: encryptData({
          ...payload,
          shop_id: shopDetails?.id,
        }),
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Track purchase event
      trackPurchase({
        value: data.total_amount,
        currency: shopDetails?.country_currency || "BDT",
        content_ids: variables.products.map((p) => p.inventory_id.toString()),
      });

      // Update state
      setOrderStatus("success");
      setTrackLink(data.track_link);
      resetCart();
      resetCheckout();
    },
    onError: () => {
      setOrderStatus("error");
    },
  });
}
```

---

### Phase 5: Analytics Integration

**Goal:** Migrate Facebook Pixel, GTM, and TikTok Pixel integrations.

#### 5.1 Analytics Store

```typescript
// src/stores/analyticsStore.ts
import { create } from "zustand";

interface AnalyticsState {
  pixelId: string | null;
  pixelAccessToken: string | null;
  gtmId: string | null;
  tiktokPixelId: string | null;
  hasPixelAccess: boolean;
  hasGTMAccess: boolean;
  hasTikTokAccess: boolean;

  setPixelConfig: (config: {
    pixelId?: string;
    accessToken?: string;
    hasAccess?: boolean;
  }) => void;
  setGTMConfig: (config: { gtmId?: string; hasAccess?: boolean }) => void;
  setTikTokConfig: (config: { pixelId?: string; hasAccess?: boolean }) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  pixelId: null,
  pixelAccessToken: null,
  gtmId: null,
  tiktokPixelId: null,
  hasPixelAccess: false,
  hasGTMAccess: false,
  hasTikTokAccess: false,

  setPixelConfig: (config) =>
    set({
      pixelId: config.pixelId,
      pixelAccessToken: config.accessToken,
      hasPixelAccess: config.hasAccess ?? false,
    }),
  setGTMConfig: (config) =>
    set({
      gtmId: config.gtmId,
      hasGTMAccess: config.hasAccess ?? false,
    }),
  setTikTokConfig: (config) =>
    set({
      tiktokPixelId: config.pixelId,
      hasTikTokAccess: config.hasAccess ?? false,
    }),
}));
```

#### 5.2 Facebook Pixel Utility

```typescript
// src/lib/analytics/fpixel.ts
import { useAnalyticsStore } from "@/stores/analyticsStore";

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const pageview = () => {
  const { hasPixelAccess, pixelId } = useAnalyticsStore.getState();
  if (!hasPixelAccess || !pixelId) return;

  window.fbq("track", "PageView");
};

export const trackEvent = (
  name: string,
  options: Record<string, unknown> = {}
) => {
  const { hasPixelAccess, pixelId } = useAnalyticsStore.getState();
  if (!hasPixelAccess || !pixelId) return;

  window.fbq("track", name, options);
};

export const trackViewContent = (product: {
  id: string;
  name: string;
  price: number;
  currency: string;
}) => {
  trackEvent("ViewContent", {
    content_name: product.name,
    content_ids: [product.id],
    content_type: "product",
    value: product.price,
    currency: product.currency,
  });
};

export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  currency: string;
}) => {
  trackEvent("AddToCart", {
    content_name: product.name,
    content_ids: [product.id],
    content_type: "product",
    value: product.price * product.quantity,
    currency: product.currency,
  });
};

export const trackInitiateCheckout = (options: {
  value: number;
  currency: string;
  content_ids: string[];
}) => {
  trackEvent("InitiateCheckout", options);
};

export const trackPurchase = (options: {
  value: number;
  currency: string;
  content_ids: string[];
}) => {
  trackEvent("Purchase", options);
};
```

#### 5.3 Analytics Provider

```typescript
// src/providers/AnalyticsProvider.tsx
"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useShopStore } from "@/stores/shopStore";
import { useAnalyticsStore } from "@/stores/analyticsStore";
import { pageview } from "@/lib/analytics/fpixel";

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shopDetails = useShopStore((state) => state.shopDetails);
  const {
    setPixelConfig,
    setGTMConfig,
    setTikTokConfig,
    hasPixelAccess,
    pixelId,
  } = useAnalyticsStore();

  // Initialize analytics config from shop details
  useEffect(() => {
    if (shopDetails) {
      setPixelConfig({
        pixelId: shopDetails.pixel_id,
        accessToken: shopDetails.pixel_access_token,
        hasAccess: shopDetails.hasPixelAccess,
      });
      setGTMConfig({
        gtmId: shopDetails.gtm_id,
        hasAccess: shopDetails.hasGTMAccess,
      });
      setTikTokConfig({
        pixelId: shopDetails.tiktok_pixel_id,
        hasAccess: shopDetails.hasTikTokPixelAccess,
      });
    }
  }, [shopDetails, setPixelConfig, setGTMConfig, setTikTokConfig]);

  // Track page views
  useEffect(() => {
    pageview();
  }, [pathname, searchParams]);

  return (
    <>
      {/* Facebook Pixel */}
      {hasPixelAccess && pixelId && (
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
            `,
          }}
        />
      )}
      {children}
    </>
  );
}
```

---

### Phase 6: Utility Functions Migration

**Goal:** Migrate helper functions, delivery calculations, and other utilities.

#### 6.1 Delivery Charge Calculator

```typescript
// src/lib/utils/delivery-charge.ts
import type { ShopProfile, CartProduct } from "@/types";

interface DeliveryChargeParams {
  shopDetails: ShopProfile;
  products: CartProduct[];
  selectedDivision: string;
  selectedDistrict: string;
  selectedUpazila: string;
  selectedDeliveryZone: string;
}

export function calculateDeliveryCharge({
  shopDetails,
  products,
  selectedDivision,
  selectedDistrict,
  selectedUpazila,
  selectedDeliveryZone,
}: DeliveryChargeParams): number {
  // Check if all products have free delivery
  const allFreeDelivery = products.every(
    (p) =>
      p.isApplyDefaultDeliveryCharge === false &&
      !p.specific_delivery_charges &&
      !p.others_delivery_charge
  );

  if (allFreeDelivery) return 0;

  // Get delivery zone
  const deliveryZone = getDeliveryZone({
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    selectedDeliveryZone,
    shopDetails,
  });

  // Calculate base delivery charge
  let baseCharge = 0;

  if (shopDetails.specific_delivery_charges?.[deliveryZone]) {
    baseCharge = shopDetails.specific_delivery_charges[deliveryZone];
  } else {
    baseCharge = shopDetails.others_delivery_charge || 0;
  }

  // Calculate product-specific charges
  let productCharge = 0;
  products.forEach((product) => {
    if (product.isApplyDefaultDeliveryCharge !== false) {
      return; // Uses shop default
    }

    if (product.specific_delivery_charges?.[deliveryZone]) {
      productCharge +=
        product.specific_delivery_charges[deliveryZone] * product.qty;
    } else if (product.others_delivery_charge) {
      productCharge += product.others_delivery_charge * product.qty;
    }
  });

  return baseCharge + productCharge;
}

function getDeliveryZone({
  selectedDivision,
  selectedDistrict,
  selectedUpazila,
  selectedDeliveryZone,
  shopDetails,
}: {
  selectedDivision: string;
  selectedDistrict: string;
  selectedUpazila: string;
  selectedDeliveryZone: string;
  shopDetails: ShopProfile;
}): string {
  const specificCharges = shopDetails.specific_delivery_charges || {};

  // Check specific delivery zone first
  if (selectedDeliveryZone && specificCharges[selectedDeliveryZone]) {
    return selectedDeliveryZone;
  }

  // Check division > district > upazila
  const possibleZones = [
    selectedUpazila,
    selectedDistrict,
    selectedDivision,
  ].filter(Boolean);

  for (const zone of possibleZones) {
    if (specificCharges[zone]) {
      return zone;
    }
  }

  return "Others";
}
```

#### 6.2 Currency Formatting

```typescript
// src/lib/utils/currency.ts
const currencySymbols: Record<string, string> = {
  BDT: "৳",
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

export function getCurrencySymbol(currency: string): string {
  return currencySymbols[currency] || currency;
}

export function formatPrice(
  price: number,
  currency: string = "BDT",
  options: { showSymbol?: boolean; decimals?: number } = {}
): string {
  const { showSymbol = true, decimals = 0 } = options;
  const symbol = showSymbol ? getCurrencySymbol(currency) : "";

  const formatted = price.toLocaleString("en-BD", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${symbol}${formatted}`;
}
```

---

## File-by-File Migration Checklist

### Priority 1: Core Infrastructure

| File (Old)                    | File (New)                 | Status |
| ----------------------------- | -------------------------- | ------ |
| `types/shop-profile.type.ts`  | `types/shop.types.ts`      |        |
| `types/inventory.type.ts`     | `types/inventory.types.ts` |        |
| `types/cart.type.ts`          | `types/cart.types.ts`      |        |
| `types/order.type.ts`         | `types/order.types.ts`     |        |
| `types/misc.type.ts`          | `types/common.types.ts`    |        |
| `lib/configs/axios.config.ts` | `lib/api/axios.config.ts`  |        |
| `lib/encrypt-decrypt.js`      | `lib/encrypt-decrypt.ts`   |        |

### Priority 2: Stores (Context → Zustand)

| Context (Old)           | Store (New)                    | Status |
| ----------------------- | ------------------------------ | ------ |
| `shop.context.tsx`      | `stores/shopStore.ts`          |        |
| `cart-context.tsx`      | `stores/cartStore.ts`          |        |
| `checkout-context.tsx`  | `stores/checkoutStore.ts`      |        |
| `inventory-context.tsx` | `stores/inventoryStore.ts`     |        |
| `product-context.tsx`   | (Keep as hook/component state) |        |
| `pixel.context.tsx`     | `stores/analyticsStore.ts`     |        |

### Priority 3: Utilities

| File (Old)                  | File (New)                     | Status |
| --------------------------- | ------------------------------ | ------ |
| `lib/utils/helpers.util.ts` | `lib/utils/helpers.ts`         |        |
| `lib/utils/helpers.ts`      | `lib/utils/delivery-charge.ts` |        |
| `lib/utils/fpixel.util.ts`  | `lib/analytics/fpixel.ts`      |        |
| `lib/utils/tpixel.util.ts`  | `lib/analytics/tpixel.ts`      |        |
| `lib/utils/gtm.util.ts`     | `lib/analytics/gtm.ts`         |        |

### Priority 4: Static Theme Components

For each theme (Basic, Premium, Aurora, Luxura, Sellora):

| Component Type    | Files to Create                                         |
| ----------------- | ------------------------------------------------------- |
| Layout            | `components/themes/{theme}/Layout.tsx`                  |
| Header            | `components/themes/{theme}/Header.tsx`                  |
| Footer            | `components/themes/{theme}/Footer.tsx`                  |
| HomePage          | `components/themes/{theme}/pages/HomePage.tsx`          |
| ProductsPage      | `components/themes/{theme}/pages/ProductsPage.tsx`      |
| ProductDetailPage | `components/themes/{theme}/pages/ProductDetailPage.tsx` |
| CheckoutPage      | `components/themes/{theme}/pages/CheckoutPage.tsx`      |
| ProductCard       | `components/themes/{theme}/components/ProductCard.tsx`  |
| CategoryCard      | `components/themes/{theme}/components/CategoryCard.tsx` |
| Carousel          | `components/themes/{theme}/components/Carousel.tsx`     |
| SearchModal       | `components/themes/{theme}/components/SearchModal.tsx`  |

### Priority 5: Shared Components

| Component          | Location                                   | Status |
| ------------------ | ------------------------------------------ | ------ |
| CartDrawer         | `components/cart/CartDrawer.tsx`           |        |
| CartItem           | `components/cart/CartItem.tsx`             |        |
| CartFloatingButton | `components/cart/CartFloatingButton.tsx`   |        |
| CheckoutForm       | `components/checkout/CheckoutForm.tsx`     |        |
| DeliverySection    | `components/checkout/DeliverySection.tsx`  |        |
| PaymentSection     | `components/checkout/PaymentSection.tsx`   |        |
| PromoCodeSection   | `components/checkout/PromoCodeSection.tsx` |        |
| ImageLightbox      | `components/shared/ImageLightbox.tsx`      |        |
| CustomerReviews    | `components/shared/CustomerReviews.tsx`    |        |

### Priority 6: Hooks

| Hook            | Purpose                  | Status |
| --------------- | ------------------------ | ------ |
| `useShop`       | Fetch shop profile       |        |
| `useCart`       | Cart operations          |        |
| `useCheckout`   | Checkout calculations    |        |
| `usePlaceOrder` | Order placement mutation |        |
| `usePromoCode`  | Promo validation         |        |
| `useAnalytics`  | Analytics event tracking |        |

### Priority 7: Pages

| Route                    | Page File                                   | Status |
| ------------------------ | ------------------------------------------- | ------ |
| `/`                      | `app/(shop)/page.tsx`                       |        |
| `/products`              | `app/(shop)/products/page.tsx`              |        |
| `/products/[handle]`     | `app/(shop)/products/[handle]/page.tsx`     |        |
| `/categories`            | `app/(shop)/categories/page.tsx`            |        |
| `/categories/[category]` | `app/(shop)/categories/[category]/page.tsx` |        |
| `/checkout`              | `app/(shop)/checkout/page.tsx`              |        |
| `/payment-confirm`       | `app/(shop)/payment-confirm/page.tsx`       |        |
| `/receipt/[id]`          | `app/(shop)/receipt/[id]/page.tsx`          |        |
| `/about-us`              | `app/(shop)/about-us/page.tsx`              |        |
| `/privacy-policy`        | `app/(shop)/privacy-policy/page.tsx`        |        |
| `/terms-and-conditions`  | `app/(shop)/terms-and-conditions/page.tsx`  |        |

---

## API Response Integration

The new project uses mock API routes that return JSON data. You'll need to:

1. **Update API routes** to call the actual backend with encryption
2. **Update type definitions** to match actual API responses
3. **Add `theme_type` field** to shop profile response

### Example: Updated Theme API Response

```json
{
  "success": true,
  "data": {
    "theme_type": "static",
    "theme_name": "Premium",
    "theme_mode": "light",
    "primary_color": "#541DFF",
    "enable_buy_now_on_product_card": true,
    "carousels": [...],
    "selected_categories": [...],
    "on_sale_inventories": [...],
    "new_arrival_inventories": [...]
  }
}
```

OR for builder themes:

```json
{
  "success": true,
  "data": {
    "theme_type": "builder",
    "global_sections": {
      "announcement": {...},
      "header": {...},
      "footer": {...}
    },
    "templates": {...}
  }
}
```

---

## Phase 7: Single-Product Landing Page System Migration

**Goal:** Migrate the landing page system with its 3 themes (Arcadia, Nirvana, Grip) and embedded checkout.

### 7.1 Directory Structure

```
src/
├── app/
│   ├── (shop)/
│   │   └── single-product/
│   │       └── [slug]/
│   │           └── page.tsx           # Landing page route (standalone)
│   └── merchant/
│       └── [shopId]/
│           └── single-product/
│               └── [slug]/
│                   └── page.tsx       # Landing page route (multi-tenant)
│
├── components/
│   └── landing-page/
│       ├── LandingPageRenderer.tsx    # Theme selector for landing pages
│       ├── shared/
│       │   ├── ProductImages.tsx
│       │   ├── LandingNavbar.tsx
│       │   ├── CustomerReviews.tsx
│       │   └── icons/
│       ├── themes/
│       │   ├── arcadia/
│       │   │   ├── index.tsx
│       │   │   ├── ArcadiaTopCarousel.tsx
│       │   │   ├── ArcadiaFeatured.tsx
│       │   │   ├── ArcadiaProductVideo.tsx
│       │   │   ├── ArcadiaProductBuyNow.tsx
│       │   │   ├── ArcadiaStandalone.tsx
│       │   │   ├── ArcadiaProductImages.tsx
│       │   │   ├── ArcadiaProductPricing.tsx
│       │   │   ├── ArcadiaProductDetails.tsx
│       │   │   └── ArcadiaFooter.tsx
│       │   ├── nirvana/
│       │   │   ├── index.tsx
│       │   │   ├── NirvanaTopNavbar.tsx
│       │   │   ├── NirvanaTopCarousel.tsx
│       │   │   ├── NirvanaStaticBanner.tsx
│       │   │   ├── NirvanaFocusedInfo.tsx
│       │   │   ├── NirvanaFeaturesContent.tsx
│       │   │   ├── NirvanaHighlightedInfo.tsx
│       │   │   ├── NirvanaProductImages.tsx
│       │   │   ├── NirvanaProductPricing.tsx
│       │   │   ├── NirvanaProductDetails.tsx
│       │   │   ├── NirvanaProductVideo.tsx
│       │   │   └── NirvanaFooter.tsx
│       │   └── grip/
│       │       ├── index.tsx          # Includes auto-add to cart logic
│       │       ├── GripTopCarousel.tsx
│       │       ├── GripFeatured.tsx
│       │       ├── GripFeaturedImageBanner.tsx
│       │       ├── GripProductVideo.tsx
│       │       ├── GripProductBuyNow.tsx
│       │       ├── GripStandalone.tsx
│       │       ├── GripProductImages.tsx
│       │       ├── EmbeddedCheckout.tsx  # Embedded checkout form
│       │       └── GripFooter.tsx
│       └── checkout/
│           ├── CommonCheckoutForm.tsx
│           ├── ContactSection.tsx
│           ├── ShippingAddressSection.tsx
│           ├── DeliveryZoneSection.tsx
│           ├── PaymentOptionsSection.tsx
│           ├── OrderSummarySection.tsx
│           └── OrderStatus.tsx
│
├── stores/
│   └── landingPageStore.ts            # Landing page specific state
│
├── hooks/
│   └── useLandingPage.ts              # Landing page data fetching
│
└── types/
    └── landing-page.types.ts          # Landing page types
```

### 7.2 Landing Page Types

```typescript
// src/types/landing-page.types.ts
export enum ContentType {
  TOP = "TOP",
  FEATURED = "FEATURED",
  SHOWCASE = "SHOWCASE",
  STANDALONE = "STANDALONE",
  TEXT = "TEXT",
  TEXTONLY = "TEXTONLY",
  IMAGE_BANNER = "IMAGE_BANNER",
}

export enum SingleProductTheme {
  Arcadia = "Arcadia",
  Nirvana = "Nirvana",
  Grip = "Grip",
}

export interface ContentInterface {
  image_url: string | null;
  title: string | null;
  tag: string | null;
  subtitle: string | null;
  type: ContentType | string;
  description: string | null;
  button_text: string | null;
  link: string | null;
}

export interface ProductVideoInterface {
  video_url: string;
  type: "TOP" | "FEATURED";
  title: string | null;
  description: string | null;
  button_text: string | null;
  link: string | null;
}

export interface FeatureInterface {
  title: string | null;
  subtitle: string | null;
  type: "SIMPLE";
  content: ContentInterface[];
}

export interface SingleProductThemeData {
  theme_name?: SingleProductTheme;
  show_product_details?: boolean;
  banners: ContentInterface[] | null;
  color?: {
    primary_color: string;
    secondary_color: string;
  };
  features?: FeatureInterface[] | null;
  product_videos: ProductVideoInterface[] | null;
  product_image: {
    title: string | null;
    type: "SIMPLE";
    content: string[];
  } | null;
  message_on_top?: string;
}

export interface SingleProductPage {
  id: number;
  page_title: string;
  page_description: string;
  slug: string;
  theme_name: SingleProductTheme;
  theme_data: SingleProductThemeData[];
  inventory: InventoryProduct;
  shop_id: number;
}
```

### 7.3 Landing Page Store

```typescript
// src/stores/landingPageStore.ts
import { create } from "zustand";
import type { SingleProductPage } from "@/types/landing-page.types";

interface LandingPageState {
  pageData: SingleProductPage | null;
  primaryColor: string;
  secondaryColor: string;

  setPageData: (data: SingleProductPage) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
}

export const useLandingPageStore = create<LandingPageState>((set) => ({
  pageData: null,
  primaryColor: "#541DFF",
  secondaryColor: "#FFFF00",

  setPageData: (data) => {
    const themeData = data.theme_data?.[0];
    set({
      pageData: data,
      primaryColor: themeData?.color?.primary_color || "#541DFF",
      secondaryColor: themeData?.color?.secondary_color || "#FFFF00",
    });
  },
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setSecondaryColor: (color) => set({ secondaryColor: color }),
}));
```

### 7.4 Landing Page Renderer

```typescript
// src/components/landing-page/LandingPageRenderer.tsx
"use client";

import { useEffect } from "react";
import { useLandingPageStore } from "@/stores/landingPageStore";
import { ProductContextProvider } from "@/contexts/ProductContext";
import { getThemeColors, getThemeColor } from "@/lib/utils/theme-colors";
import TopbarMessage from "@/components/shared/TopbarMessage";

// Theme components
import Arcadia from "./themes/arcadia";
import Nirvana from "./themes/nirvana";
import Grip from "./themes/grip";

interface LandingPageRendererProps {
  pageData: SingleProductPage;
}

export default function LandingPageRenderer({
  pageData,
}: LandingPageRendererProps) {
  const setPageData = useLandingPageStore((state) => state.setPageData);
  const themeName = pageData?.theme_name;
  const themeData = pageData?.theme_data?.[0];
  const messageOnTop = themeData?.message_on_top;

  // Initialize store and set theme colors
  useEffect(() => {
    setPageData(pageData);

    // Apply CSS custom properties for landing page colors
    const primaryColor = themeData?.color?.primary_color;
    const secondaryColor = themeData?.color?.secondary_color;

    const primaryColors = getThemeColors(
      getThemeColor(primaryColor ?? "#541DFF"),
      "landing-primary"
    );
    const secondaryColors = getThemeColors(
      getThemeColor(secondaryColor ?? "#FFFF00"),
      "landing-secondary"
    );

    Object.entries(primaryColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    Object.entries(secondaryColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [pageData, setPageData, themeData]);

  return (
    <div className="w-screen">
      <ProductContextProvider baseProduct={pageData?.inventory}>
        {/* Top message banner */}
        {messageOnTop && (
          <div className="bg-primary sticky top-0 z-50">
            <TopbarMessage message={messageOnTop} />
          </div>
        )}

        {/* Theme-specific content */}
        {themeName === "Arcadia" && <Arcadia pageData={pageData} />}
        {themeName === "Nirvana" && <Nirvana pageData={pageData} />}
        {themeName === "Grip" && <Grip pageData={pageData} />}
      </ProductContextProvider>
    </div>
  );
}
```

### 7.5 Grip Theme with Auto-Add to Cart & Embedded Checkout

```typescript
// src/components/landing-page/themes/grip/index.tsx
"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import type { SingleProductPage } from "@/types/landing-page.types";

// Grip-specific components
import GripNavbar from "./GripNavbar";
import GripTopCarousel from "./GripTopCarousel";
import GripFeatured from "./GripFeatured";
import GripFeaturedImageBanner from "./GripFeaturedImageBanner";
import GripProductVideo from "./GripProductVideo";
import GripProductBuyNow from "./GripProductBuyNow";
import GripStandalone from "./GripStandalone";
import GripProductImages from "./GripProductImages";
import GripFooter from "./GripFooter";
import EmbeddedCheckout from "./EmbeddedCheckout";

interface GripProps {
  pageData: SingleProductPage;
}

export default function Grip({ pageData }: GripProps) {
  const { addProduct, products } = useCartStore();
  const product = pageData?.inventory;
  const themeData = pageData?.theme_data?.[0];

  // Extract banner types from theme data
  const topContent = themeData?.banners?.filter((b) => b.type === "TOP");
  const featuredContent = themeData?.banners?.filter(
    (b) => b.type === "FEATURED"
  );
  const imageBanners = themeData?.banners?.filter(
    (b) => b.type === "IMAGE_BANNER"
  );
  const showcaseContent = themeData?.banners?.filter(
    (b) => b.type === "SHOWCASE"
  );
  const standaloneContent = themeData?.banners?.find(
    (b) => b.type === "STANDALONE"
  );
  const productVideoContent = themeData?.product_videos;

  // Check if product is already in cart
  const productInCart = Object.values(products).find(
    (p) => p.id === product?.id
  );

  // Auto-add product to cart on page load
  useEffect(() => {
    if (!product || productInCart) return;

    const shouldAutoAdd = (() => {
      // No variants - check stock
      if (!product.variant_types?.length) {
        return product.quantity > 0;
      }
      // Single variant type - find one with stock
      if (product.variant_types.length === 1) {
        return product.stocks?.some((s) => s.quantity > 0);
      }
      // Multiple variant types - don't auto-add
      return false;
    })();

    if (shouldAutoAdd) {
      // Prepare default variants for single variant type products
      const defaultVariants: Record<string, any> = {};

      if (product.variant_types?.length === 1) {
        const variantType = product.variant_types[0];
        if (variantType.variants.length && variantType.is_mandatory) {
          // Find variant with stock
          let selectedVariant = variantType.variants[0];

          if (product.is_stock_manage_by_variant && product.stocks) {
            for (const variant of variantType.variants) {
              const hasStock = product.stocks.find(
                (s) => s.combination.includes(`${variant.id}`) && s.quantity > 0
              );
              if (hasStock) {
                selectedVariant = variant;
                break;
              }
            }
          }

          defaultVariants[variantType.id] = {
            variant_type_id: variantType.id,
            variant_id: selectedVariant.id,
            price: selectedVariant.price,
            variant_name: selectedVariant.name,
            image_url: selectedVariant.image_url || product.images?.[0],
          };
        }
      }

      // Calculate price with variant additions
      const additionalPrice = Object.values(defaultVariants).reduce(
        (sum: number, v: any) => sum + (v?.price || 0),
        0
      );

      addProduct({
        ...product,
        qty: 1,
        cartId: `landing-${product.id}`,
        selectedVariants: defaultVariants,
        price: product.price + additionalPrice,
        image_url: product.images?.[0] || product.image_url,
      });
    }
  }, [product, productInCart, addProduct]);

  return (
    <div className="mx-auto bg-white dark:bg-black">
      <GripNavbar />
      <GripTopCarousel content={topContent} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {imageBanners && <GripFeaturedImageBanner content={imageBanners} />}
        {featuredContent && <GripFeatured content={featuredContent} />}
      </div>

      <GripProductVideo content={productVideoContent} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <GripProductBuyNow content={showcaseContent} />
      </div>

      <GripStandalone content={standaloneContent} />
      <GripProductImages />

      {/* Embedded Checkout Form */}
      <EmbeddedCheckout />

      <GripFooter />
    </div>
  );
}
```

### 7.6 Embedded Checkout Component

```typescript
// src/components/landing-page/themes/grip/EmbeddedCheckout.tsx
"use client";

import { CheckoutProvider } from "@/contexts/CheckoutContext";
import CommonCheckoutForm from "@/components/landing-page/checkout/CommonCheckoutForm";
import OrderStatus from "@/components/landing-page/checkout/OrderStatus";

export default function EmbeddedCheckout() {
  return (
    <div
      id="checkout-form-section"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:pt-16 lg:pt-24"
    >
      <div className="border border-gray-200 dark:border-gray-700 rounded-2xl px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-8">
        <h2 className="text-2xl lg:text-3xl max-w-2xl mx-auto dark:text-white font-bold text-center mb-6 lg:mb-8">
          To place your order, please complete the form below with accurate
          information.
        </h2>

        <CheckoutProvider>
          <CommonCheckoutForm />
        </CheckoutProvider>

        <OrderStatus />
      </div>
    </div>
  );
}
```

### 7.7 Landing Page Server Component

```typescript
// src/app/(shop)/single-product/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPageRenderer from "@/components/landing-page/LandingPageRenderer";
import { getSingleProductPage, getDivisions } from "@/lib/api/landing-page";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const pageData = await getSingleProductPage(params.slug);

  if (!pageData) {
    return { title: "Not Found" };
  }

  return {
    title: pageData.page_title,
    description: pageData.page_description,
    openGraph: {
      title: pageData.page_title,
      description: pageData.page_description,
      images: pageData.inventory?.images?.[0]
        ? [{ url: pageData.inventory.images[0] }]
        : undefined,
    },
  };
}

export default async function SingleProductPage({ params }: PageProps) {
  const pageData = await getSingleProductPage(params.slug);

  if (!pageData) {
    notFound();
  }

  // Fetch divisions for Bangladesh checkout
  let divisions = [];
  // if (shopDetails.country_code === 'BD') {
  //   divisions = await getDivisions();
  // }

  return <LandingPageRenderer pageData={pageData} />;
}
```

### 7.8 Landing Page Migration Checklist

| Component (Old)             | Component (New)                                | Priority |
| --------------------------- | ---------------------------------------------- | -------- |
| `single-page-scema.ts`      | `types/landing-page.types.ts`                  | High     |
| `single-product.module.tsx` | Server component + LandingPageRenderer         | High     |
| `themes/arcadia/index.tsx`  | `landing-page/themes/arcadia/index.tsx`        | High     |
| `themes/nirvana/index.tsx`  | `landing-page/themes/nirvana/index.tsx`        | High     |
| `themes/grip/index.tsx`     | `landing-page/themes/grip/index.tsx`           | High     |
| All Arcadia components      | `landing-page/themes/arcadia/`                 | Medium   |
| All Nirvana components      | `landing-page/themes/nirvana/`                 | Medium   |
| All Grip components         | `landing-page/themes/grip/`                    | Medium   |
| `common-checkout-form.tsx`  | `landing-page/checkout/CommonCheckoutForm.tsx` | High     |
| Checkout section components | `landing-page/checkout/`                       | Medium   |
| Shared product images       | `landing-page/shared/ProductImages.tsx`        | Medium   |

---

## Testing Strategy

1. **Unit Tests:** Test stores, hooks, and utilities
2. **Integration Tests:** Test theme selection, cart flow, checkout flow
3. **E2E Tests:** Full user journey for both theme types
4. **Visual Regression:** Compare static themes before/after migration
5. **Landing Page Tests:** Test all 3 landing themes (Arcadia, Nirvana, Grip)
6. **Embedded Checkout Tests:** Verify auto-add to cart and checkout flow in Grip theme

---

## Deployment Considerations

1. **Environment Variables:** Migrate all env vars from old project
2. **Build Configuration:** Update `next.config.js` for image domains
3. **Analytics:** Verify pixel/GTM integration in production
4. **Multi-tenant:** Test SHOPLINK mode with multiple shops
5. **Caching:** Configure proper cache headers for static assets

---

## Summary

This integration plan provides a clear path to:

1. **Keep** the existing theme builder functionality (JSON-driven UI)
2. **Add** all 5 static themes from the old project
3. **Migrate** all e-commerce features (Cart, Checkout, Payment)
4. **Integrate** analytics (Facebook Pixel, GTM, TikTok Pixel)
5. **Support** multi-tenant architecture

The hybrid architecture allows shops to choose between:

- **Theme Builder:** Full customization via JSON configuration
- **Static Themes:** Pre-built, optimized themes with consistent UX

Both options share the same underlying infrastructure (stores, hooks, utilities), ensuring maintainability and code reuse.

---

## Updated Migration Plan - Current State Analysis (December 2024)

### Current Migration Status

**✅ COMPLETED (100%):**

- Theme Builder system with BlockRenderer V3.0
- 16 product card variants with proper naming conventions
- Core Zustand stores (cart, checkout, analytics, shop, theme, homepage, products, productDetails, aboutUs)
- Product and collection display systems
- API integration layer with TanStack React Query
- Mock data structure for development
- **Cart UI Components** - Complete cart system with floating buttons, modals, and sidebars
- **Checkout Flow Components** - Full checkout implementation with all sections and validation
- **Payment Gateway UI Components** - All 5 payment methods (bKash, Nagad, AamarPay, COD, Self MFS)
- **E-commerce Pages** - Cart, checkout, and payment confirmation pages
- **Cart and Checkout Hooks** - useCartFloat, useAddToCart hooks in main hooks directory
- **Proper Component Organization** - Hooks in /hooks, components properly structured

**⚠️ PARTIALLY COMPLETE (Frontend Only):**

- **Payment Gateway Backend Integration** - UI components exist but all are MOCK implementations
- **Analytics Integration** - Analytics store and types complete, but no actual tracking implementations
- **Order Management** - No real order creation or management APIs

**❌ MISSING - TO BE MIGRATED:**

- **Real Payment Gateway APIs** - bKash, Nagad, AamarPay actual SDK integrations
- **Order Management System** - Order creation, tracking, and receipt generation
- **Static Themes** (Basic, Premium, Aurora, Luxura, Sellora)
- **Landing Page Themes** (Arcadia, Nirvana, Grip)
- **Real Analytics Implementation** - Facebook Pixel, GTM, TikTok actual tracking
- **Internationalization** (Bengali language support)
- **User Authentication System**

### Current Component Structure

The project follows kebab-case naming conventions:

```
components/
├── cart/                    # ✅ COMPLETE - All cart UI components implemented
│   ├── cart-floating-btn/   # Floating cart buttons with counters
│   ├── cart-management-modal/ # Cart modal and item components
│   ├── shared/              # Cart sidebar and shared components
│   └── index.ts
├── checkout/               # ✅ COMPLETE - Full checkout flow implemented
│   ├── checkout-form.tsx    # Main checkout container
│   ├── contact-section.tsx # Customer contact information
│   ├── shipping-address-section.tsx # Address with Bangladesh locations
│   ├── delivery-zone-section.tsx # Delivery zone selection
│   ├── payment-options-section.tsx # Payment method selection
│   ├── order-summary-section.tsx # Order review and totals
│   └── index.ts
├── payments/                # ✅ COMPLETE - All 5 payment gateway UI components
│   ├── payment-method-selector.tsx # Payment method selection
│   └── gateways/            # Individual payment gateway components
│       ├── bkash-payment.tsx # bKash payment (MOCK)
│       ├── nagad-payment.tsx # Nagad payment (MOCK)
│       ├── aamarpay-payment.tsx # AamarPay payment (MOCK)
│       ├── self-mfs-payment.tsx # Self MFS payment (MOCK)
│       └── cod-payment.tsx # Cash on delivery
├── themes/                  # ✅ COMPLETE - Theme builder system ready
├── products/                # ✅ COMPLETE
│   └── product-cards/       # 16 variants (product-card-1.tsx)
├── collections/             # ✅ COMPLETE
├── renderers/                # ✅ COMPLETE
│   ├── block-renderer/
│   └── page-renderer/
└── ui/                      # ✅ COMPLETE (shadcn components)
```

### Hook Structure

```
hooks/
├── useTheme.ts              # ✅ Existing
├── useHomepage.ts           # ✅ Existing
├── useProducts.ts           # ✅ Existing
├── useProductDetails.ts     # ✅ Existing
├── useAboutUs.ts            # ✅ Existing
├── useCollections.ts        # ✅ Existing
├── useCartFloat.ts          # ✅ NEW - Cart modal/sidebar state management
├── useAddToCart.ts          # ✅ NEW - Add products to cart with callbacks
└── index.ts                 # ✅ Updated with all exports
```

### User Preferences

- **Payment Gateways**: All 5 gateways (bKash, Nagad, AamarPay, COD, Self MFS) - ✅ FRONTEND COMPLETE
- **Theme System**: Hybrid approach (Builder + Static) - READY FOR STATIC THEMES
- **Component Naming**: ✅ kebab-case (e.g., `cart-floating-btn`) - PROPERLY IMPLEMENTED
- **Hook Organization**: ✅ Hooks in /hooks directory - PROPERLY IMPLEMENTED

## Updated Phase Status

### ✅ PHASE 1: Core Infrastructure - COMPLETED

- Dependencies, types, stores, query provider - 100% DONE

### ✅ PHASE 2: Cart System - COMPLETED

- Cart UI components (floating buttons, modals, sidebar) - 100% DONE
- Cart hooks (useCartFloat, useAddToCart) - 100% DONE
- Cart pages (/cart) - 100% DONE

### ✅ PHASE 3: Checkout Flow - COMPLETED

- All checkout form components - 100% DONE
- Checkout page (/checkout) - 100% DONE
- Payment confirmation page (/payment-confirm) - 100% DONE
- Bangladesh location integration - 100% DONE

### ⚠️ PHASE 4: Payment Gateway Integration - FRONTEND ONLY

- ✅ All 5 payment UI components created - 100% DONE
- ❌ **ALL PAYMENTS ARE MOCK IMPLEMENTATIONS** - NEEDS REAL API INTEGRATION

### ❌ PHASE 5: Static Themes - NOT STARTED

- Basic, Premium, Aurora, Luxura, Sellora themes - 0% DONE

### ❌ PHASE 6: Landing Page Themes - NOT STARTED

- Arcadia, Nirvana, Grip landing pages - 0% DONE

### ⚠️ PHASE 7: Analytics Integration - FOUNDATION ONLY

- ✅ Analytics store and types - 100% DONE
- ❌ No actual tracking implementations (Facebook Pixel, GTM, TikTok) - 0% DONE

---

## Migration Implementation Plan

### ✅ Phase 1: Core Cart System - COMPLETED

**Status**: 100% DONE
**What Was Implemented**:

```
components/cart/
├── cart-floating-btn/
│   ├── cart-counter-btn.tsx       # ✅ Mobile floating button with counter
│   ├── cart-footer-btn.tsx         # ✅ Desktop footer cart button
│   └── cart-total-price-counter.tsx # ✅ Price display component
├── cart-management-modal/
│   ├── cart-item.tsx              # ✅ Individual cart item component
│   ├── cart-summary.tsx            # ✅ Cart totals and summary
│   └── index.tsx                  # ✅ Main cart modal
├── shared/
│   └── cart-sidebar.tsx            # ✅ Slide-out cart sidebar
└── index.ts                       # ✅ Main exports
```

**Hooks Created**:

```
hooks/
├── useCartFloat.ts               # ✅ Cart modal/sidebar state management
├── useAddToCart.ts               # ✅ Add products to cart with callbacks
└── index.ts                      # ✅ Updated with all exports
```

### ✅ Phase 2: Complete Checkout Flow - COMPLETED

**Status**: 100% DONE
**What Was Implemented**:

```
components/checkout/
├── checkout-form.tsx              # ✅ Main checkout form container
├── contact-section.tsx            # ✅ Customer contact information
├── shipping-address-section.tsx   # ✅ Address form with validation
├── delivery-zone-section.tsx       # ✅ Bangladesh location zones
├── payment-options-section.tsx     # ✅ Payment method selection
├── order-summary-section.tsx       # ✅ Order review and totals
└── index.ts                       # ✅ Main exports
```

**Pages Created**:

```
app/(shop)/
├── cart/page.tsx                    # ✅ Dedicated shopping cart page
├── checkout/page.tsx                # ✅ Checkout flow page
└── payment-confirm/page.tsx         # ✅ Payment confirmation page
```

### ⚠️ Phase 3: Payment Gateway Frontend - COMPLETED (MOCK ONLY)

**Status**: UI 100% DONE, Backend 0% DONE
**What Was Implemented**:

```
components/payments/
├── payment-method-selector.tsx      # ✅ Choose payment method
├── gateways/
│   ├── bkash-payment.tsx          # ✅ bKash payment (MOCK)
│   ├── nagad-payment.tsx          # ✅ Nagad payment (MOCK)
│   ├── aamarpay-payment.tsx       # ✅ AamarPay payment (MOCK)
│   ├── self-mfs-payment.tsx       # ✅ Self MFS payment (MOCK)
│   └── cod-payment.tsx            # ✅ Cash on delivery
└── index.ts                       # ✅ Main exports
```

**⚠️ CRITICAL ISSUE**: All payment components are MOCK implementations only - NO REAL API INTEGRATION

### Phase 4: Real Payment Gateway Backend Integration - PENDING

**Priority**: IMMEDIATE (Business Critical)
**What Needs to Be Done**:

- Real bKash SDK integration
- Real Nagad SDK integration
- Real AamarPay SDK integration
- Order creation and management APIs
- Payment verification webhooks
- Secure server-side payment processing

### Phase 5: Static Themes Migration - PENDING

**Priority**: MEDIUM
**What Needs to Be Done**:

- Migrate 5 static themes (Basic, Premium, Aurora, Luxura, Sellora)
- Theme selector component
- Integration with existing BlockRenderer system

### Phase 6: Landing Page Themes - PENDING

**Priority**: MEDIUM
**What Needs to Be Done**:

- Migrate 3 landing themes (Arcadia, Nirvana, Grip)
- Single-product landing page functionality
- Embedded checkout for landing pages

### Phase 7: Analytics Implementation - PENDING

**Priority**: LOW
**What Needs to Be Done**:

- Facebook Pixel actual tracking implementation
- Google Tag Manager integration
- TikTok Pixel tracking
- Analytics provider component

### Phase 4: Static Themes Migration (Priority: MEDIUM)

**Duration**: 5-7 days
**Theme Structure**:

```
components/themes/
├── basic/
│   ├── basic-header.tsx
│   ├── basic-footer.tsx
│   ├── basic-product-card.tsx
│   ├── basic-home-page.tsx
│   ├── basic-products-page.tsx
│   └── index.ts
├── premium/
├── aurora/
├── luxura/
└── sellora/
```

**Implementation Notes**:

- Each theme as complete, self-contained component set
- Compatible with existing BlockRenderer system
- Theme selector component to switch between themes
- Maintain builder system alongside static themes
- Follow existing kebab-case naming

### Phase 5: Landing Page Themes (Priority: MEDIUM)

**Duration**: 3-4 days
**Landing Pages to Migrate**:

```
components/landing-pages/
├── arcadia/
│   ├── arcadia-hero.tsx
│   ├── arcadia-featured.tsx
│   └── arcadia-products.tsx
├── nirvana/
│   ├── nirvana-hero.tsx
│   ├── nirvana-features.tsx
│   └── nirvana-content.tsx
└── grip/
    ├── grip-hero.tsx
    ├── grip-embedded-checkout.tsx
    └── grip-auto-add-cart.tsx
```

**Special Features**:

- Grip theme includes auto-add to cart functionality
- Embedded checkout forms in landing pages
- Product-specific, single-product focus
- Integration with existing cart and checkout systems

### Phase 6: Analytics Integration (Priority: LOW)

**Duration**: 2-3 days
**Components to Create**:

```
components/analytics/
├── facebook-pixel.tsx              # Facebook Pixel events
├── google-tag-manager.tsx           # GTM integration
├── tiktok-pixel.tsx                # TikTok advertising
└── index.ts

hooks/
└── use-analytics.ts                 # Analytics tracking hooks
```

**Integration Points**:

- ✅ `stores/analyticsStore.ts` - Framework exists
- Track: PageView, AddToCart, InitiateCheckout, Purchase
- Bangladesh market specific events
- E-commerce conversion tracking

### Phase 7: Internationalization (Priority: LOW)

**Duration**: 2-3 days
**Files to Create**:

```
messages/
├── en.json                         # English translations
└── bn.json                         # Bengali translations

components/
└── language-switcher.tsx            # Language toggle component

lib/
└── i18n-config.ts                  # i18n configuration
```

**Implementation Notes**:

- Leverage existing `next-intl` dependency
- Bangladesh primary language support (Bengali)
- Language switcher component
- Translate all user-facing components

## Technical Implementation Details

### Naming Convention Compliance

All new components MUST follow kebab-case:

- ✅ `cart-floating-btn` (not `CartFloatingButton`)
- ✅ `checkout-form` (not `CheckoutForm`)
- ✅ `bkash-payment` (not `BkashPayment`)
- ✅ `basic-header` (not `BasicHeader`)

### Store Integration Strategy

1. **Cart Store**: ✅ Complete - only needs UI components
2. **Checkout Store**: ✅ Basic exists - needs full checkout flow
3. **Analytics Store**: ✅ Framework exists - needs integration
4. **Theme Store**: ✅ Integrated with builder - extend for static themes

### Hybrid Theme System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ZATIQ STOREFRONT                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐     ┌─────────────────────────────┐   │
│  │   THEME BUILDER     │     │     STATIC THEMES           │   │
│  │   (JSON-Driven)     │     │   (Pre-built Components)    │   │
│  ├─────────────────────┤     ├─────────────────────────────┤   │
│  │ - BlockRenderer     │     │ - Basic                     │   │
│  │ - Dynamic sections  │     │ - Premium                   │   │
│  │ - API-configured    │     │ - Aurora                    │   │
│  │ - Full flexibility  │     │ - Luxura                    │   │
│  │                     │     │ - Sellora                   │   │
│  └─────────────────────┘     └─────────────────────────────┘   │
│             │                           │                       │
│             └───────────┬───────────────┘                       │
│                         ▼                                       │
│              ┌─────────────────────────────────┴─────┐            │
│              │       COMPONENT REGISTRY            │            │
│              │  Theme Builder | Static Themes |   │        │
│              └─────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### File Migration Path Matrix

| Source (storefront.zatiqeasy.com)          | Target (storefront.zatiqeasy.dev)          | Priority |
| ------------------------------------------ | ------------------------------------------ | -------- |
| `/src/www/e-commerce/components/cart/`     | `/components/cart/`                        | HIGH     |
| `/src/www/e-commerce/modules/order/`       | `/components/checkout/`                    | HIGH     |
| `/src/www/e-commerce/themes/basic/`        | `/components/themes/basic/`                | MEDIUM   |
| `/src/www/e-commerce/themes/premium/`      | `/components/themes/premium/`              | MEDIUM   |
| `/src/www/e-commerce/themes/aurora/`       | `/components/themes/aurora/                | MEDIUM   |
| `/src/www/e-commerce/themes/luxura/`       | `/components/themes/luxura/                | MEDIUM   |
| `/src/www/e-commerce/themes/sellora/`      | `/components/themes/sellora/               | MEDIUM   |
| `/src/www/e-commerce/modules/single-page/` | `/components/landing-pages/`               | MEDIUM   |
| `/src/lib/utils/fpixel.util.ts`            | `/components/analytics/facebook-pixel.tsx` | LOW      |
| `/src/www/context/`                        | Convert to Zustand stores                  | LOW      |

## Success Metrics

### Functional Requirements

- ✅ Complete e-commerce workflow (Add to Cart → Checkout → Payment → Order Confirmation)
- ✅ All 5 payment gateways functional (bKash, Nagad, AamarPay, COD, Self MFS)
- ✅ Theme selector allowing choice between builder and static themes
- ✅ All static themes (Basic, Premium, Aurora, Luxura, Sellora) fully functional
- ✅ Landing page themes (Arcadia, Nirdvana, Grip) with embedded checkout

### Technical Requirements

- ✅ Zero breaking changes to existing theme builder functionality
- ✅ All components follow kebab-case naming convention
- ✅ TypeScript type safety maintained throughout
- ✅ Performance optimized (bundle size analysis)

### User Experience

- ✅ Seamless cart management with responsive design
- ✅ Intuitive checkout flow with multiple payment options
- ✅ Professional theme selection and switching
- ✅ Bangladesh-specific payment methods fully integrated
- ✅ Mobile-first responsive design throughout

## Implementation Timeline

**Week 1**: Cart UI components + basic checkout flow
**Week 2**: Payment gateway integrations + testing
**Week 3**: Static themes migration + theme selector
**Week 4**: Landing pages + analytics integration + i18n support
**Week 5**: Testing, optimization, and deployment

This updated plan provides a clear, phased approach to complete the Zatiq storefront migration while maintaining existing functionality and following established coding conventions.
