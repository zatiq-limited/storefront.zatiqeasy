# Aurora Theme Migration Documentation

## Overview

This document provides a comprehensive guide for migrating the **Aurora Theme** from the legacy Pages Router project (`storefront.zatiqeasy.com`) to the new App Router project (`storefront.zatiqeasy`).

---

## Table of Contents

1. [Source Analysis](#1-source-analysis)
2. [Target Structure](#2-target-structure)
3. [Migration Mapping](#3-migration-mapping)
4. [Step-by-Step Migration](#4-step-by-step-migration)
5. [Component Migration Guide](#5-component-migration-guide)
6. [Context to Zustand Migration](#6-context-to-zustand-migration)
7. [API Integration](#7-api-integration)
8. [Testing Checklist](#8-testing-checklist)

---

## 1. Source Analysis

### 1.1 Aurora Theme Location (Legacy)

```
src/www/e-commerce/themes/aurora/
├── components/
│   ├── aurora-carousel-slider.tsx    # Hero carousel slider
│   ├── aurora-page-header.tsx        # Page header component
│   ├── category-card.tsx             # Category display card
│   ├── grid-container.tsx            # Grid layout wrapper
│   ├── language-toggler.tsx          # Language switcher
│   ├── relatedProducts.tsx           # Related products section
│   └── trust-card.tsx                # Trust badges
├── layout/
│   ├── header.tsx                    # Aurora header with navigation
│   └── footer.tsx                    # Aurora footer
└── modules/
    ├── order/
    │   └── checkout.module.tsx       # Checkout page
    ├── search/
    │   ├── search-component.tsx
    │   ├── search-dropdown.tsx
    │   └── search-modal.tsx
    └── shop-home-page/
        ├── sections/
        │   ├── aurora-home-category-section.tsx
        │   ├── aurora-home-featured-products-section.tsx
        │   ├── aurora-home-onsale-section.tsx
        │   ├── aurora-home-selected-products-by-category-section.tsx
        │   ├── aurora-productcard.tsx
        │   ├── inventory-cart-product-modifier-modal.tsx
        │   ├── inventory-categories.tsx
        │   ├── inventory-search.tsx
        │   ├── product-details.tsx
        │   ├── product-pricing.tsx
        │   ├── product-variants.tsx
        │   ├── section-header.tsx
        │   └── view-all-button.tsx
        ├── aurora-home-page.module.tsx
        ├── aurora-product-page.module.tsx
        └── aurora-category-page-module.tsx
```

### 1.2 Key Dependencies (Legacy)

| Dependency | Usage |
|------------|-------|
| `usePageProps` | Shop details context |
| `useShopContext` | Shop state context |
| `useCartContext` | Cart operations |
| `useInventoryContext` | Products/inventory data |
| `useProductContext` | Single product state |
| `useRouter` (next/router) | Pages Router navigation |
| `framer-motion` | Animations |
| `lucide-react` | Icons |
| `react-i18next` | Translations |

---

## 2. Target Structure

### 2.1 New Aurora Theme Location

```
app/_themes/aurora/
├── components/
│   ├── core/
│   │   ├── index.ts
│   │   └── topbar-message.tsx
│   ├── footer/
│   │   ├── footer.tsx
│   │   └── index.ts
│   ├── header/
│   │   ├── header.tsx
│   │   └── index.ts
│   ├── cards/
│   │   ├── aurora-product-card.tsx
│   │   ├── category-card.tsx
│   │   └── index.ts
│   ├── carousel/
│   │   ├── aurora-carousel-slider.tsx
│   │   └── index.ts
│   └── search/
│       ├── search-modal.tsx
│       ├── search-dropdown.tsx
│       └── index.ts
├── hooks/
│   └── index.ts
├── modules/
│   ├── home/
│   │   ├── sections/
│   │   │   ├── aurora-category-section.tsx
│   │   │   ├── aurora-featured-products-section.tsx
│   │   │   ├── aurora-onsale-section.tsx
│   │   │   ├── aurora-selected-products-section.tsx
│   │   │   ├── section-header.tsx
│   │   │   └── view-all-button.tsx
│   │   ├── aurora-home-page.tsx
│   │   └── index.ts
│   ├── product-detail/
│   │   ├── aurora-product-detail-page.tsx
│   │   ├── product-details.tsx
│   │   └── index.ts
│   ├── category/
│   │   ├── aurora-category-page.tsx
│   │   └── index.ts
│   ├── products/
│   │   ├── aurora-all-products.tsx
│   │   └── index.ts
│   └── checkout/
│       ├── aurora-checkout.tsx
│       └── index.ts
├── index.ts                          # Theme exports & config
└── theme.config.ts                   # Extended configuration
```

---

## 3. Migration Mapping

### 3.1 Context → Zustand Store Mapping

| Legacy Context | New Zustand Store | Import |
|----------------|-------------------|--------|
| `usePageProps` → `shopDetails` | `useShopStore` | `@/stores/shopStore` |
| `useShopContext` | `useShopStore` | `@/stores/shopStore` |
| `useCartContext` | `useCartStore` | `@/stores/cartStore` |
| `useInventoryContext` | `useProductsStore` | `@/stores/productsStore` |
| `useProductContext` | `useProductDetailsStore` | `@/stores/productDetailsStore` |

### 3.2 Router Migration

| Legacy (Pages Router) | New (App Router) |
|-----------------------|------------------|
| `import { useRouter } from 'next/router'` | `import { useRouter } from 'next/navigation'` |
| `router.query` | `useSearchParams()` |
| `router.push({ pathname, query })` | `router.push(url)` |
| `router.pathname` | `usePathname()` |

### 3.3 Data Fetching Migration

| Legacy Pattern | New Pattern |
|----------------|-------------|
| `getServerSideProps` | React Query + API Routes |
| Direct context access | `useProducts()`, `useHomepage()` hooks |
| Prop drilling | Zustand stores |

---

## 4. Step-by-Step Migration

### Step 1: Create Theme Directory Structure

```bash
mkdir -p app/_themes/aurora/{components/{core,footer,header,cards,carousel,search},hooks,modules/{home/sections,product-detail,category,products,checkout}}
```

### Step 2: Create Theme Index File

Create `app/_themes/aurora/index.ts`:

```typescript
/**
 * Aurora Theme - Zatiq Storefront
 * A modern, elegant theme with dynamic carousels and rich UI
 */

import { StaticTheme } from "@/types/theme";

export const AuroraTheme: StaticTheme = {
  id: "aurora",
  name: "aurora",
  displayName: "Aurora Theme",
  description: "Modern and elegant design with dynamic carousels and smooth animations",
  version: "1.0.0",
  author: "Zatiq Team",
  category: "premium",
  isDefault: false,
  isPremium: true,
  supportsDarkMode: true,

  config: {
    colors: {
      // Aurora Primary - Blue Zatiq
      primary: "#3B82F6",        // blue-zatiq
      primaryHover: "#2563EB",
      primaryLight: "#DBEAFE",
      primaryDark: "#1E40AF",

      // Secondary colors
      secondary: "#6B7280",
      secondaryHover: "#4B5563",
      secondaryLight: "#F3F4F6",
      secondaryDark: "#374151",

      // Accent colors
      accent: "#10B981",
      accentHover: "#059669",

      // Semantic colors
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",

      // Neutral colors
      background: "#FFFFFF",
      foreground: "#1F2937",
      muted: "#F3F4F6",
      mutedForeground: "#6B7280",
      border: "#E5E7EB",
      input: "#FFFFFF",
      ring: "#3B82F6",

      // Text colors
      textPrimary: "#1F2937",
      textSecondary: "#6B7280",
      textMuted: "#9CA3AF",
      textInverse: "#FFFFFF",

      // Surface colors
      surface: "#FFFFFF",
      surfaceVariant: "#F9FAFB",
      surfaceHover: "#F3F4F6",

      // Dark mode overrides
      darkBackground: "#18181B",    // black-18
      darkSurface: "#27272A",       // black-27
      darkBorder: "#3F3F46",
    },

    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      "3xl": "4rem",
      "4xl": "6rem",
    },

    fonts: {
      primary: "Helvetica Now Text, Inter, system-ui, sans-serif",
      secondary: "Inter, system-ui, sans-serif",
      mono: "JetBrains Mono, Consolas, monospace",
      display: "Helvetica Now Text, system-ui, sans-serif",
      body: "Helvetica Now Text, system-ui, sans-serif",
      heading: "Helvetica Now Text, system-ui, sans-serif",
    },

    borderRadius: {
      none: "0",
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      full: "9999px",
    },
  },

  // Component mappings (dynamic imports)
  components: {
    Header: () => import("./components/header/header"),
    Footer: () => import("./components/footer/footer"),
    CarouselSlider: () => import("./components/carousel/aurora-carousel-slider"),
    SearchModal: () => import("./components/search/search-modal"),
    ProductCard: () => import("./components/cards/aurora-product-card"),
    CategoryCard: () => import("./components/cards/category-card"),

    // Shared components
    HeightAnimation: () => import("@/components/shared/animations/height-animation"),
    LazyAnimation: () => import("@/components/shared/animations/lazy-animation"),
  },

  // Module mappings
  modules: {
    "aurora-home-page": () => import("./modules/home/aurora-home-page"),
    "aurora-category-page": () => import("./modules/category/aurora-category-page"),
    "aurora-product-detail-page": () => import("./modules/product-detail/aurora-product-detail-page"),
    "aurora-all-products": () => import("./modules/products/aurora-all-products"),
    "aurora-checkout": () => import("./modules/checkout/aurora-checkout"),
  },

  // Theme styles
  styles: {
    globals: `
/* Aurora Theme - Global Styles */
:root {
  --aurora-primary: #3B82F6;
  --aurora-primary-hover: #2563EB;
  --aurora-dark-bg: #18181B;
  --aurora-dark-surface: #27272A;
}

/* Aurora specific scrollbar */
.aurora-theme::-webkit-scrollbar {
  width: 6px;
}

.aurora-theme::-webkit-scrollbar-thumb {
  background: var(--aurora-primary);
  border-radius: 3px;
}
    `,
    components: `
/* Aurora Theme - Component Styles */

/* Aurora Product Card */
.aurora-product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.aurora-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* Aurora Carousel */
.aurora-carousel {
  position: relative;
}

.aurora-carousel .slide-indicator {
  background: rgba(255, 255, 255, 0.5);
  transition: background 0.3s ease;
}

.aurora-carousel .slide-indicator.active {
  background: var(--aurora-primary);
}

/* Aurora Button */
.aurora-btn-primary {
  background: var(--aurora-primary);
  color: white;
  border: 1px solid var(--aurora-primary);
  transition: all 0.2s ease;
}

.aurora-btn-primary:hover {
  background: var(--aurora-primary-hover);
  border-color: var(--aurora-primary-hover);
}

.aurora-btn-outline {
  background: transparent;
  color: var(--aurora-primary);
  border: 1px solid var(--aurora-primary);
  transition: all 0.2s ease;
}

.aurora-btn-outline:hover {
  background: var(--aurora-primary);
  color: white;
}
    `,
    utilities: `
/* Aurora Theme - Utility Classes */

.text-blue-zatiq {
  color: var(--aurora-primary);
}

.bg-blue-zatiq {
  background-color: var(--aurora-primary);
}

.border-blue-zatiq {
  border-color: var(--aurora-primary);
}

/* Aurora Grid */
.aurora-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

@media (min-width: 1024px) {
  .aurora-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Aurora Aspect Ratios */
.aspect-244-304 {
  aspect-ratio: 244 / 304;
}

.aspect-335-151 {
  aspect-ratio: 335 / 151;
}

.aspect-1920-720 {
  aspect-ratio: 1920 / 720;
}
    `,
  },

  preview: {
    image: "/themes/aurora/preview.png",
    thumbnail: "/themes/aurora/thumbnail.png",
    demoUrl: "https://demo.zatiq.com/themes/aurora",
  },

  dependencies: ["lucide-react", "clsx", "tailwind-merge", "framer-motion"],
};

export default AuroraTheme;

// Export components
export { AuroraHomePage } from "./modules/home/aurora-home-page";
export { AuroraCategoryPage } from "./modules/category/aurora-category-page";
export { AuroraProductDetailPage } from "./modules/product-detail/aurora-product-detail-page";
```

### Step 3: Create Theme Config File

Create `app/_themes/aurora/theme.config.ts`:

```typescript
/**
 * Aurora Theme Extended Configuration
 */

import { AuroraTheme } from './index';

export const auroraThemeConfig = {
  mode: 'both',

  components: {
    Header: {
      className: 'h-[70px] md:h-[80px] sticky w-full top-0 left-0 bg-white dark:bg-black-18 z-100 shadow-sm',
      style: {
        position: 'sticky',
        top: 0,
        zIndex: 100
      },
      props: {
        showCart: true,
        showSearch: true,
        showLanguageToggle: true
      }
    },

    ProductCard: {
      className: 'aurora-product-card',
      props: {
        showAddToCart: true,
        showBuyNow: true,
        imageAspectRatio: '244/304',
        lazyLoad: true
      }
    },

    CarouselSlider: {
      props: {
        autoPlay: true,
        interval: 4000,
        showTitle: true
      }
    },

    Footer: {
      sections: ['quickLinks', 'contactUs', 'followUs'],
      props: {
        showPaymentMethods: true,
        showPoweredBy: true
      }
    }
  },

  cssVariables: {
    ...AuroraTheme.config.colors,
    'header-height': '80px',
    'mobile-header-height': '70px',
    'carousel-aspect-desktop': '1920/720',
    'carousel-aspect-mobile': '335/151',
    'product-card-aspect': '244/304',
  },

  customCSS: `
/* Aurora Theme Custom CSS */

/* Dark mode support */
.dark .aurora-header {
  background-color: var(--aurora-dark-bg);
  border-bottom: none;
}

.dark .aurora-footer {
  background-color: var(--aurora-dark-surface);
}

/* Aurora specific animations */
@keyframes aurora-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.aurora-animate-in {
  animation: aurora-fade-in 0.3s ease-out;
}
  `
};

export default auroraThemeConfig;
```

---

## 5. Component Migration Guide

### 5.1 Header Component Migration

**Legacy:** `src/www/e-commerce/themes/aurora/layout/header.tsx`
**New:** `app/_themes/aurora/components/header/header.tsx`

```typescript
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore, selectTotalItems } from "@/stores/cartStore";
import { useWindowScroll } from "@/hooks";
import { FallbackImage } from "@/components/ui/fallback-image";
import { AuroraShoppingCart } from "./aurora-shopping-cart";
import LanguageToggler from "./language-toggler";
import SearchModal from "../search/search-modal";
import MobileNav from "./mobile-nav";

export function AuroraHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  // Zustand stores (replaces contexts)
  const { shopDetails, isSearchModalOpen, setSearchModalOpen } = useShopStore();
  const totalProducts = useCartStore(selectTotalItems);

  // Local state
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [langValue, setLangValue] = useState(shopDetails?.default_language_code ?? "en");
  const { y: scrollY } = useWindowScroll();

  const baseUrl = shopDetails?.baseUrl || "";
  const primaryColor = shopDetails?.theme_color?.primary_color ?? "#3B82F6";
  const isDark = shopDetails?.shop_theme?.theme_mode === "dark";

  useEffect(() => {
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale) setLangValue(storedLocale);
  }, []);

  return (
    <>
      {isSearchModalOpen && (
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />
      )}

      <MobileNav
        isOpen={showMobileNav}
        onClose={() => setShowMobileNav(false)}
      />

      <header
        className={cn(
          "h-[70px] md:h-[80px] sticky w-full top-0 left-0",
          "bg-white dark:bg-black-18 z-100 flex items-center justify-center",
          "shadow-sm transition-shadow duration-150 md:border-b dark:border-none",
          { "shadow-md": scrollY > 20 }
        )}
      >
        <nav className="w-full items-center flex px-4 relative">
          <div className="flex items-center justify-between w-full relative">
            {/* Mobile Menu Button */}
            <div
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="font-bold cursor-pointer lg:hidden flex items-center absolute justify-center bg-blue-zatiq/25 rounded-full p-2"
            >
              <Menu size={20} className="text-blue-zatiq" />
            </div>

            {/* Logo */}
            <div className="flex items-center justify-center lg:justify-start w-full">
              {shopDetails?.image_url ? (
                <Link href={baseUrl || "/"}>
                  <FallbackImage
                    height={60}
                    width={200}
                    alt={shopDetails.shop_name}
                    src={shopDetails.image_url}
                    className="max-h-[54px] md:max-h-[60px] w-auto max-w-[170px] object-contain"
                  />
                </Link>
              ) : (
                <Link href={baseUrl || "/"} className="text-[22px] lg:text-[28px] font-bold">
                  <h1 className="text-black-2 dark:text-gray-200">
                    {shopDetails?.shop_name}
                  </h1>
                </Link>
              )}

              {/* Desktop Navigation */}
              <div className="lg:flex font-medium items-center justify-center w-full dark:text-gray-200 gap-[38px] hidden text-[16px] uppercase leading-[20px]">
                <Link href={`${baseUrl}/products`}>{t("products")}</Link>
                <Link href={`${baseUrl}/categories`}>{t("categories")}</Link>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 absolute lg:relative right-0">
              {/* Cart */}
              <button
                onClick={() => router.push(`${baseUrl}/checkout`)}
                className="items-center relative justify-center flex p-2 rounded-full cursor-pointer"
              >
                <AuroraShoppingCart
                  fill={totalProducts > 0 ? primaryColor : isDark ? "#E5E7EB" : "#4B5563"}
                />
                {totalProducts > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-zatiq font-bold text-[10px] rounded-full p-2 text-white w-5 h-5 flex items-center justify-center">
                    {totalProducts}
                  </span>
                )}
              </button>

              {/* Search */}
              <button
                className="cursor-pointer"
                onClick={() => setSearchModalOpen(!isSearchModalOpen)}
              >
                <Search className="text-black-1.1 dark:text-gray-200" strokeWidth={2} />
              </button>

              {/* Language Toggle */}
              <LanguageToggler
                langValue={langValue}
                setLangValue={setLangValue}
                i18n={i18n}
                className="hidden lg:flex"
              />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default AuroraHeader;
```

### 5.2 Product Card Migration

**Legacy:** `src/www/e-commerce/themes/aurora/modules/shop-home-page/sections/aurora-productcard.tsx`
**New:** `app/_themes/aurora/components/cards/aurora-product-card.tsx`

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore } from "@/stores/cartStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { LazyAnimation } from "@/components/shared/animations/lazy-animation";
import { CartQtyControl } from "@/components/features/cart/cart-qty-control";
import type { Product } from "@/types";

interface AuroraProductCardProps extends Product {
  onNavigate: () => void;
  onSelectProduct: () => void;
  isSale?: boolean;
}

const productCartAnimateVariants = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "-100%" },
};

export function AuroraProductCard({
  id,
  name,
  price,
  old_price,
  image_url,
  images,
  variant_types,
  onNavigate,
  onSelectProduct,
  isSale = false,
  ...rest
}: AuroraProductCardProps) {
  const router = useRouter();
  const { t } = useTranslation();

  // Zustand stores
  const { shopDetails } = useShopStore();
  const {
    addProduct,
    getProductsByInventoryId,
    incrementQty,
    decrementQty
  } = useCartStore();

  const countryCurrency = shopDetails?.country_currency || "BDT";
  const baseUrl = shopDetails?.baseUrl || "";
  const buyNowEnabled = shopDetails?.shop_theme?.enable_buy_now_on_product_card ?? false;

  const cartProducts = getProductsByInventoryId(id);
  const totalInCart = cartProducts.reduce((sum, p) => sum + p.qty, 0);
  const isStockOut = rest.quantity === 0 && rest.is_stock_maintain;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (variant_types?.length) {
      onSelectProduct();
      return;
    }

    addProduct({
      id,
      name,
      price,
      old_price,
      image_url: images?.[0] || image_url,
      variant_types,
      images,
      qty: 1,
      selectedVariants: {},
      ...rest,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (rest.has_variant) {
      onSelectProduct();
      return;
    }
    if (totalInCart < 1) {
      handleAddToCart(e);
    }
    router.push(`${baseUrl}/checkout`);
  };

  return (
    <div key={id}>
      <div role="button" onClick={onNavigate} className="cursor-pointer">
        {/* Product Image */}
        <div className="relative w-full aspect-[244/304]">
          <FallbackImage
            src={images?.[0] || image_url || ""}
            fill
            alt={name}
            className="w-full aspect-[244/304] object-cover rounded-lg md:rounded-none"
          />

          {isStockOut && (
            <div className="absolute w-full py-2 top-[50%] translate-y-[-50%] text-sm text-center bg-black/60 text-white backdrop-blur-sm">
              Out of Stock
            </div>
          )}

          {/* Sale/Discount Badge */}
          {isSale ? (
            <div className="absolute top-2 md:top-[14px] left-2 md:left-[14px]">
              <span className="px-[12px] py-[6px] bg-blue-zatiq rounded-full text-white text-xs">
                Sale
              </span>
            </div>
          ) : (old_price ?? 0) > (price ?? 0) && (
            <div className="absolute top-2 md:top-[14px] left-2 md:left-[14px]">
              <span className="px-[10px] py-[6px] bg-blue-zatiq rounded-full text-white text-xs">
                Save {((old_price ?? 0) - (price ?? 0)).toLocaleString()} {countryCurrency}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="text-gray-700 dark:text-gray-200 text-base font-normal leading-[18px] max-w-[95%] h-[48px] mb-3 mt-6">
          <p className="line-clamp-2 text-base font-medium capitalize">{name}</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="dark:text-blue-zatiq text-base font-medium leading-[18px]">
            {countryCurrency} {price}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Add to Cart / Qty Control */}
        <div className="w-full max-h-[38px] h-[38px] overflow-hidden">
          <LazyAnimation>
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={cartProducts.length}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                variants={productCartAnimateVariants}
                className={`flex items-center justify-center h-full rounded-lg md:rounded-none border border-blue-zatiq text-blue-zatiq group ${
                  isStockOut && "bg-gray-200 border-none text-gray-500"
                }`}
              >
                {totalInCart > 0 ? (
                  <CartQtyControl
                    className="gap-4"
                    qty={totalInCart}
                    disableSumBtn={isStockOut}
                    sumQty={() => {
                      if (variant_types?.length) {
                        onSelectProduct();
                        return;
                      }
                      incrementQty(cartProducts[0].cartId);
                    }}
                    subQty={() => {
                      if (variant_types?.length) {
                        onSelectProduct();
                        return;
                      }
                      decrementQty(cartProducts[0].cartId);
                    }}
                  />
                ) : (
                  <button
                    disabled={isStockOut}
                    className="w-full text-sm sm:text-base capitalize font-medium disabled:cursor-not-allowed cursor-pointer"
                    onClick={handleAddToCart}
                  >
                    {isStockOut ? t("out_of_stock") : t("add_to_cart")}
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </LazyAnimation>
        </div>

        {/* Buy Now Button */}
        {buyNowEnabled && (
          <div className="w-full max-h-[38px] h-[38px] overflow-hidden">
            <div
              className={`flex items-center justify-center h-full rounded-lg md:rounded-none border border-blue-zatiq text-white dark:text-black-18 bg-blue-zatiq group font-semibold ${
                isStockOut && "bg-gray-200 border-none text-gray-500"
              }`}
            >
              <button
                disabled={isStockOut}
                className="w-full text-sm sm:text-base capitalize font-medium disabled:cursor-not-allowed disabled:text-gray-500 cursor-pointer"
                onClick={handleBuyNow}
              >
                {isStockOut ? t("out_of_stock") : t("buy_now")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuroraProductCard;
```

### 5.3 Home Page Module Migration

**Legacy:** `src/www/e-commerce/themes/aurora/modules/shop-home-page/aurora-home-page.module.tsx`
**New:** `app/_themes/aurora/modules/home/aurora-home-page.tsx`

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useShopStore } from "@/stores/shopStore";
import { useCartTotals } from "@/hooks/useCartTotals";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import type { Product } from "@/types";

// Dynamic imports for performance
const AuroraCarouselSlider = dynamic(
  () => import("../../components/carousel/aurora-carousel-slider"),
  { ssr: false }
);

const AuroraCategorySection = dynamic(
  () => import("./sections/aurora-category-section"),
  { ssr: false }
);

const AuroraFeaturedProductsSection = dynamic(
  () => import("./sections/aurora-featured-products-section"),
  { ssr: false }
);

const AuroraOnSaleSection = dynamic(
  () => import("./sections/aurora-onsale-section"),
  { ssr: false }
);

const AuroraSelectedProductsSection = dynamic(
  () => import("./sections/aurora-selected-products-section"),
  { ssr: false }
);

const InventoryCartProductModifierModal = dynamic(
  () => import("@/components/features/cart/variant-selector-modal"),
  { ssr: false }
);

export function AuroraHomePage() {
  const router = useRouter();
  const { shopDetails } = useShopStore();
  const { totalPrice, totalProducts, hasItems } = useCartTotals();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const baseUrl = shopDetails?.baseUrl || "";
  const onSaleInventories = shopDetails?.shop_theme?.on_sale_inventories || [];

  const navigateToProduct = (id: number) => {
    router.push(`${baseUrl}/products/${id}`);
  };

  return (
    <div>
      {/* Variant Selector Modal */}
      <InventoryCartProductModifierModal
        selectedProduct={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Primary Carousel */}
      <AuroraCarouselSlider tag="primary" />

      {/* Main Content */}
      <div className="flex flex-col py-[48px] md:py-[60px] xl:py-[112px] gap-[48px] md:gap-[60px] xl:gap-[112px]">
        {/* Categories */}
        <AuroraCategorySection />

        {/* Featured Products */}
        <AuroraFeaturedProductsSection
          setSelectedProduct={setSelectedProduct}
          navigateProductDetails={navigateToProduct}
        />

        {/* Secondary Carousel */}
        <AuroraCarouselSlider tag="secondary" />

        {/* On Sale Products */}
        {onSaleInventories.length > 0 && (
          <AuroraOnSaleSection
            setSelectedProduct={setSelectedProduct}
            navigateProductDetails={navigateToProduct}
          />
        )}

        {/* Selected Products by Category */}
        <AuroraSelectedProductsSection
          setSelectedProduct={setSelectedProduct}
          navigateProductDetails={navigateToProduct}
        />
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        onClick={() => router.push(`${baseUrl}/checkout`)}
        showCartFloatingBtn={hasItems}
        theme="Aurora"
        totalPrice={totalPrice}
        totalProducts={totalProducts}
      />
    </div>
  );
}

export default AuroraHomePage;
```

---

## 6. Context to Zustand Migration

### 6.1 Legacy Context Usage

```typescript
// Legacy: Multiple context imports
import { usePageProps, useShopContext } from "@app/lib/contexts";
import { useCartContext, useInventoryContext, useProductContext } from "@app/www/context";

const Component = () => {
  const { shopDetails } = usePageProps();
  const { country_currency, baseUrl } = useShopContext();
  const { addCartProduct, totalProducts, totalPrice } = useCartContext();
  const { inventoryProducts, isLoading } = useInventoryContext();
};
```

### 6.2 New Zustand Store Usage

```typescript
// New: Zustand store imports
import { useShopStore } from "@/stores/shopStore";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/stores/cartStore";
import { useProductsStore } from "@/stores/productsStore";

const Component = () => {
  // Shop store
  const { shopDetails } = useShopStore();
  const countryCurrency = shopDetails?.country_currency || "BDT";
  const baseUrl = shopDetails?.baseUrl || "";

  // Cart store with selectors
  const { addProduct } = useCartStore();
  const totalProducts = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  // Products store
  const { products, isLoading } = useProductsStore();
};
```

### 6.3 Migration Checklist

| Context Hook | Zustand Store | Selector |
|--------------|---------------|----------|
| `usePageProps().shopDetails` | `useShopStore().shopDetails` | - |
| `useShopContext().country_currency` | `useShopStore().shopDetails?.country_currency` | `selectCurrency` |
| `useShopContext().baseUrl` | `useShopStore().shopDetails?.baseUrl` | - |
| `useCartContext().addCartProduct` | `useCartStore().addProduct` | - |
| `useCartContext().totalProducts` | `useCartStore(selectTotalItems)` | `selectTotalItems` |
| `useCartContext().totalPrice` | `useCartStore(selectSubtotal)` | `selectSubtotal` |
| `useCartContext().getCartProducts` | `useCartStore().getProductsByInventoryId` | - |
| `useInventoryContext().inventoryProducts` | `useProductsStore().products` | - |
| `useInventoryContext().isLoading` | `useProductsStore().isLoading` | - |

---

## 7. API Integration

### 7.1 Create Aurora-specific API Routes (if needed)

Most data will use the existing API routes. However, Aurora-specific endpoints can be added:

```typescript
// app/api/storefront/v1/theme/aurora/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Return Aurora-specific theme configuration
  return NextResponse.json({
    success: true,
    data: {
      theme: "aurora",
      carousels: [],
      featuredCategories: [],
      onSaleProducts: [],
    },
  });
}
```

### 7.2 Use Existing Hooks

```typescript
// Reuse existing hooks - they work for all themes
import { useHomepage } from "@/hooks/useHomepage";
import { useProducts } from "@/hooks/useProducts";
import { useProductDetails } from "@/hooks/useProductDetails";
import { useShopProfile } from "@/hooks/useShopProfile";
import { useShopCategories } from "@/hooks/useShopCategories";
```

---

## 8. Testing Checklist

### 8.1 Component Testing

- [ ] Header renders correctly with logo, navigation, cart, search
- [ ] Footer displays quick links, contact info, social links
- [ ] Product cards show image, name, price, add to cart
- [ ] Carousel auto-rotates and displays images
- [ ] Search modal opens and filters products
- [ ] Mobile navigation works correctly
- [ ] Dark mode styling applies correctly

### 8.2 Functionality Testing

- [ ] Add to cart functionality works
- [ ] Buy now button redirects to checkout
- [ ] Variant selection modal works for products with variants
- [ ] Cart quantity controls work (increment/decrement)
- [ ] Navigation between pages works
- [ ] Language toggle switches translations
- [ ] Price filtering works on products page
- [ ] Sort functionality works

### 8.3 Data Flow Testing

- [ ] Shop details load from Zustand store
- [ ] Cart persists to localStorage
- [ ] Products load via React Query
- [ ] Featured products display correctly
- [ ] Categories display correctly
- [ ] On-sale products show when available

### 8.4 Responsive Testing

- [ ] Mobile layout (< 768px)
- [ ] Tablet layout (768px - 1024px)
- [ ] Desktop layout (> 1024px)
- [ ] Carousel aspect ratios
- [ ] Grid layouts adjust correctly

---

## File Migration Checklist

| Legacy File | New File | Status |
|-------------|----------|--------|
| `layout/header.tsx` | `components/header/header.tsx` | ⬜ |
| `layout/footer.tsx` | `components/footer/footer.tsx` | ⬜ |
| `components/aurora-carousel-slider.tsx` | `components/carousel/aurora-carousel-slider.tsx` | ⬜ |
| `components/category-card.tsx` | `components/cards/category-card.tsx` | ⬜ |
| `components/grid-container.tsx` | `components/grid-container.tsx` | ⬜ |
| `components/language-toggler.tsx` | `components/header/language-toggler.tsx` | ⬜ |
| `modules/search/search-modal.tsx` | `components/search/search-modal.tsx` | ⬜ |
| `modules/search/search-dropdown.tsx` | `components/search/search-dropdown.tsx` | ⬜ |
| `sections/aurora-productcard.tsx` | `components/cards/aurora-product-card.tsx` | ⬜ |
| `sections/section-header.tsx` | `modules/home/sections/section-header.tsx` | ⬜ |
| `sections/view-all-button.tsx` | `modules/home/sections/view-all-button.tsx` | ⬜ |
| `sections/aurora-home-category-section.tsx` | `modules/home/sections/aurora-category-section.tsx` | ⬜ |
| `sections/aurora-home-featured-products-section.tsx` | `modules/home/sections/aurora-featured-products-section.tsx` | ⬜ |
| `sections/aurora-home-onsale-section.tsx` | `modules/home/sections/aurora-onsale-section.tsx` | ⬜ |
| `sections/aurora-home-selected-products-by-category-section.tsx` | `modules/home/sections/aurora-selected-products-section.tsx` | ⬜ |
| `sections/product-details.tsx` | `modules/product-detail/product-details.tsx` | ⬜ |
| `sections/product-pricing.tsx` | `modules/product-detail/product-pricing.tsx` | ⬜ |
| `sections/product-variants.tsx` | `modules/product-detail/product-variants.tsx` | ⬜ |
| `aurora-home-page.module.tsx` | `modules/home/aurora-home-page.tsx` | ⬜ |
| `aurora-product-page.module.tsx` | `modules/product-detail/aurora-product-detail-page.tsx` | ⬜ |
| `aurora-category-page-module.tsx` | `modules/category/aurora-category-page.tsx` | ⬜ |
| `aurora-all-products.tsx` | `modules/products/aurora-all-products.tsx` | ⬜ |
| `order/checkout.module.tsx` | `modules/checkout/aurora-checkout.tsx` | ⬜ |

---

## Quick Reference: Import Mappings

```typescript
// Old imports → New imports

// Contexts → Stores
"@app/lib/contexts" → "@/stores/shopStore"
"@app/www/context" → "@/stores/cartStore", "@/stores/productsStore"

// Router
"next/router" → "next/navigation"

// Utils
"@app/lib/utils" → "@/lib/utils"

// Components
"@app/www/e-commerce/components/FallbackImage" → "@/components/ui/fallback-image"
"@app/www/e-commerce/components/pagination" → "@/components/pagination"
"@app/www/e-commerce/components/cart-floating-btn" → "@/components/features/cart/cart-floating-btn"

// Icons
"@app/assets/icons" → "@/components/ui/icons" or "lucide-react"

// Fonts
"@app/assets/local-fonts" → Use next/font in layout
```

---

## Notes

1. **Dark Mode**: Aurora theme has built-in dark mode support using `dark:` Tailwind classes
2. **Animations**: Uses `framer-motion` for cart animations and transitions
3. **Translations**: Uses `react-i18next` - ensure translations are in `public/locales/`
4. **Primary Color**: Uses `blue-zatiq` as the primary accent color (`#3B82F6`)
5. **Grid Layout**: Uses a 2-column mobile, 4-column desktop grid pattern

---

*Last Updated: December 2024*
*Version: 1.0.0*
