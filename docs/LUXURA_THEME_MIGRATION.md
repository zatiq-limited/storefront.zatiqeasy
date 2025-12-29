# Luxura Theme Migration Guide

**Version:** 1.0  
**Date:** December 24, 2025  
**Migration Target:** Next.js 16 App Router with Modern Architecture

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Migration Analysis](#pre-migration-analysis)
3. [Architecture Comparison](#architecture-comparison)
4. [Migration Strategy](#migration-strategy)
5. [Phase 1: Theme Structure Setup](#phase-1-theme-structure-setup)
6. [Phase 2: Layout Components](#phase-2-layout-components)
7. [Phase 3: Page Modules](#phase-3-page-modules)
8. [Phase 4: Shared Components](#phase-4-shared-components)
9. [Phase 5: Styling & Theme Configuration](#phase-5-styling--theme-configuration)
10. [Phase 6: Testing & Validation](#phase-6-testing--validation)
11. [Functionality Mapping](#functionality-mapping)
12. [Design Specifications](#design-specifications)

---

## Overview

This guide outlines the complete migration of the **Luxura Theme** from the old Next.js Pages Router project (`storefront.zatiqeasy.com`) to the new Next.js 16 App Router project (`storefront.zatiqeasy`).

### Migration Goals

- ✅ **100% Design Match** - Pixel-perfect recreation of Luxura theme UI/UX
- ✅ **Reuse Existing Functionality** - Leverage all working features from Basic theme
- ✅ **Modern Architecture** - Implement using App Router, Server Components, and React Query
- ✅ **Type Safety** - Full TypeScript coverage with strict types
- ✅ **Performance** - Optimize for Core Web Vitals and fast page loads

### Luxura Theme Identity

**Luxura** is a **premium e-commerce theme** featuring:

- 🎨 Sidebar category navigation with hero carousel
- 🏪 Trust badges and brand elements
- 📦 New arrivals, featured products, and flash sale sections
- 🎯 Selected products by category
- 📱 Premium mobile experience with shadow cards
- 🎭 Swiper-based carousels with custom navigation
- 💎 Elegant card designs with rounded corners

---

## Pre-Migration Analysis

### Old Project Structure (Pages Router)

```
storefront.zatiqeasy.com/src/www/e-commerce/themes/luxura/
├── components/
│   ├── aurora-carousel-slider.tsx    # Legacy carousel (not used in main flow)
│   ├── luxura-page-header.tsx        # Page header component
│   ├── category-card.tsx             # Category display card
│   ├── grid-container.tsx            # Grid layout wrapper
│   ├── language-toggler.tsx          # Language switcher
│   ├── related-products.tsx          # Related products section
│   ├── trust-card.tsx                # Trust/feature badges
│   ├── swiper-nav-buttons.tsx        # Custom swiper navigation
│   └── index.ts
├── layout/
│   ├── header.tsx                    # Luxura header with mobile nav
│   └── footer.tsx                    # Luxura footer
└── modules/
    ├── luxura-all-products.tsx       # All products page
    ├── luxura-all-categories.tsx     # All categories page
    ├── order/
    │   └── checkout.module.tsx       # Checkout page
    ├── search/
    │   ├── search-component.tsx
    │   ├── search-dropdown.tsx
    │   └── search-modal.tsx
    └── shop-home-page/
        ├── sections/
        │   ├── luxura-home-hero-section.tsx                      # Hero with sidebar categories
        │   ├── luxura-home-category-section.tsx                  # Category grid
        │   ├── luxura-home-new-arrivals-section.tsx             # New arrivals products
        │   ├── luxura-home-featured-products-section.tsx        # Featured products
        │   ├── luxura-home-selected-category-section.tsx        # Selected category
        │   ├── luxura-home-selected-products-by-category-section.tsx
        │   ├── luxura-productcard.tsx                           # Product card
        │   ├── inventory-cart-product-modifier-modal.tsx        # Variant selector
        │   ├── inventory-categories.tsx                         # Categories display
        │   ├── inventory-search.tsx                             # Search component
        │   ├── product-details.tsx                              # Product detail sections
        │   ├── product-pricing.tsx                              # Pricing display
        │   ├── product-variants.tsx                             # Variant selector
        │   ├── section-header.tsx                               # Section title with view all
        │   └── view-all-button.tsx                              # View all button
        ├── luxura-home-page.module.tsx                          # Main home page
        ├── luxura-product-page.module.tsx                       # Product detail page
        └── luxura-category-page-module.tsx                      # Category page
```

### New Project Target Structure (App Router)

```
storefront.zatiqeasy/app/_themes/luxura/
├── components/
│   ├── luxura-page-header.tsx
│   ├── luxura-category-card.tsx
│   ├── luxura-grid-container.tsx
│   ├── luxura-language-toggler.tsx
│   ├── luxura-related-products.tsx
│   ├── luxura-trust-card.tsx
│   ├── luxura-swiper-nav-buttons.tsx
│   └── luxura-mobile-nav.tsx
├── layout/
│   ├── luxura-header.tsx
│   └── luxura-footer.tsx
└── modules/
    ├── home/
    │   ├── luxura-home-page.tsx
    │   └── sections/
    │       ├── luxura-hero-section.tsx              # Hero + Sidebar Categories
    │       ├── luxura-category-section.tsx          # Category grid
    │       ├── luxura-new-arrivals-section.tsx      # New arrivals
    │       ├── luxura-featured-products-section.tsx # Featured/Flash Sale (reusable)
    │       ├── luxura-selected-category-section.tsx # Selected category
    │       └── luxura-selected-products-by-category-section.tsx
    ├── products/
    │   ├── luxura-products-page.tsx                 # All products
    │   └── sections/
    │       ├── luxura-product-grid.tsx
    │       └── luxura-product-filters.tsx
    ├── product-detail/
    │   ├── luxura-product-detail-page.tsx
    │   └── sections/
    │       ├── luxura-product-gallery.tsx
    │       ├── luxura-product-info.tsx
    │       ├── luxura-product-description.tsx
    │       ├── luxura-product-pricing.tsx
    │       ├── luxura-product-variants.tsx
    │       └── luxura-related-products-section.tsx
    ├── category/
    │   ├── luxura-category-page.tsx
    │   └── sections/
    │       ├── luxura-category-header.tsx
    │       └── luxura-category-products.tsx
    ├── search/
    │   ├── luxura-search-modal.tsx
    │   ├── luxura-search-dropdown.tsx
    │   └── luxura-search-component.tsx
    └── checkout/
        └── luxura-checkout.tsx
```

---

## Architecture Comparison

### Old Architecture (Pages Router)

```tsx
// Old: Pages Router with Context API
pages/[shopId]/index.tsx
  → LuxuraHomePageModule (Client Component)
    → usePageProps() hook
    → useCartContext() hook
    → useProductContext() hook
    → Dynamic navigation with router.push()
```

### New Architecture (App Router)

```tsx
// New: App Router with Server Components + React Query
app/merchant/[shopId]/(shop)/page.tsx (Server Component)
  → LuxuraHomePage (Client Component)
    → useShopProfile() hook (React Query)
    → useShopInventories() hook (React Query)
    → useCartStore() hook (Zustand)
    → Navigation with Next.js Link
```

**Key Differences:**

| Aspect               | Old (Pages Router)       | New (App Router)                |
| -------------------- | ------------------------ | ------------------------------- |
| **Rendering**        | All client-side          | Server + Client components      |
| **Data Fetching**    | Context API + useEffect  | React Query + Server Components |
| **State Management** | Context API              | Zustand stores                  |
| **Routing**          | `useRouter().push()`     | `<Link>` components             |
| **API Calls**        | Direct `apiClient` calls | API routes → External API       |
| **Carousel**         | Swiper with refs         | Swiper with modern config       |
| **Types**            | Loose typing             | Strict TypeScript               |
| **Caching**          | Manual                   | React Query + Next.js cache     |

---

## Migration Strategy

### Phase Overview

```
Phase 1: Structure Setup (Day 1)
  ↓
Phase 2: Layout Components (Day 1-2)
  ↓
Phase 3: Page Modules (Day 2-4)
  ↓
Phase 4: Shared Components (Day 4-5)
  ↓
Phase 5: Styling & Configuration (Day 5-6)
  ↓
Phase 6: Testing & Validation (Day 6-7)
```

### Migration Principles

1. **Reuse First** - Leverage existing functionality from Basic theme
2. **Design Match** - Luxura UI/UX should be pixel-perfect
3. **Modern Patterns** - Use App Router best practices
4. **Type Safety** - No `any` types, strict TypeScript
5. **Performance** - Optimize for Core Web Vitals

---

## Phase 1: Theme Structure Setup

### Step 1.1: Create Directory Structure

```bash
# Create Luxura theme directories
mkdir -p app/_themes/luxura/components
mkdir -p app/_themes/luxura/layout
mkdir -p app/_themes/luxura/modules/home/sections
mkdir -p app/_themes/luxura/modules/products/sections
mkdir -p app/_themes/luxura/modules/product-detail/sections
mkdir -p app/_themes/luxura/modules/category/sections
mkdir -p app/_themes/luxura/modules/search
mkdir -p app/_themes/luxura/modules/checkout
```

### Step 1.2: Create Theme Configuration

**File:** `app/_themes/luxura/config.ts`

```typescript
/**
 * Luxura Theme Configuration
 * Premium e-commerce theme with sidebar navigation and elegant design
 */

export const luxuraThemeConfig = {
  name: "luxura",
  displayName: "Luxura",
  version: "2.0.0",

  // Color System
  colors: {
    primary: {
      DEFAULT: "#3B82F6", // Blue
      light: "#60A5FA",
      dark: "#2563EB",
      contrast: "#FFFFFF",
    },
    secondary: {
      DEFAULT: "#8B5CF6", // Purple
      light: "#A78BFA",
      dark: "#7C3AED",
    },
    accent: {
      DEFAULT: "#10B981", // Green
      light: "#34D399",
      dark: "#059669",
    },
    background: {
      DEFAULT: "#FFFFFF",
      dark: "#0F172A",
      muted: "#F8FAFC",
    },
    text: {
      DEFAULT: "#1E293B",
      muted: "#64748B",
      light: "#94A3B8",
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: "'Helvetica Now', sans-serif",
      secondary: "'Inter', sans-serif",
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },
  },

  // Spacing System
  spacing: {
    xs: "8px",
    sm: "16px",
    md: "24px",
    lg: "36px", // Luxura specific
    xl: "60px", // Luxura specific
    "2xl": "84px", // Luxura specific
  },

  // Layout
  layout: {
    container: {
      maxWidth: "1440px",
      width: {
        mobile: "95%",
        tablet: "90%",
        desktop: "78%", // Luxura premium width
      },
      padding: {
        mobile: "16px",
        tablet: "24px",
        desktop: "0",
      },
    },
    header: {
      height: {
        mobile: "70px",
        desktop: "80px",
      },
    },
    sidebar: {
      width: "25%",
      height: {
        lg: "420px",
        xl: "600px",
      },
    },
    hero: {
      height: {
        mobile: "280px",
        sm: "320px",
        md: "360px",
        lg: "420px",
        xl: "600px",
      },
    },
  },

  // Components
  components: {
    card: {
      borderRadius: "12px",
      shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
      hoverShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    },
    productCard: {
      aspectRatio: "420/360", // Luxura specific
      borderRadius: "12px",
    },
    button: {
      borderRadius: "8px",
      padding: {
        sm: "8px 16px",
        md: "12px 24px",
        lg: "16px 32px",
      },
    },
    input: {
      borderRadius: "8px",
      height: "44px",
    },
    sidebarCategory: {
      background: "white",
      shadow: "md",
      borderRadius: "12px",
      overflow: "auto",
    },
  },

  // Swiper Configuration
  swiper: {
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    navigation: true,
    loop: true,
    rewind: true,
  },

  // Breakpoints (matches Tailwind)
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

export type LuxuraThemeConfig = typeof luxuraThemeConfig;
```

### Step 1.3: Create Theme Types

**File:** `app/_themes/luxura/types.ts`

```typescript
import { Product } from "@/types/shop.types";

export interface LuxuraThemeSettings {
  theme: "luxura";
  theme_mode: "light" | "dark";
  primary_color: string;
  secondary_color: string;
  enable_buy_now_on_product_card: boolean;
  singleProductTheme: boolean;
  selected_inventories?: Product[]; // Featured products
  on_sale_inventories?: Product[]; // Flash sale products
  selected_category_inventories?: {
    category_id: number;
    category_name: string;
    products: Product[];
  }[];
  carousels: LuxuraCarouselSlide[];
}

export interface LuxuraPageProps {
  theme: "luxura";
  shopId: string;
}

export interface LuxuraCarouselSlide {
  id: string | number;
  image_url: string;
  title?: string;
  sub_title?: string;
  button_text?: string;
  button_link?: string;
  tag?: "primary" | "secondary";
}

export interface LuxuraSearchProps {
  isOpen: boolean;
  onClose: () => void;
  searchText?: string;
}

export interface LuxuraProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  showBuyNow?: boolean;
  isSale?: boolean;
}

export interface LuxuraSectionHeaderProps {
  title: string;
  viewAllLink?: string;
  showViewAll?: boolean;
}

export interface LuxuraTrustCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
```

---

## Phase 2: Layout Components

### Step 2.1: Luxura Header

**File:** `app/_themes/luxura/layout/luxura-header.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore } from "@/stores/cartStore";
import { useCartTotals } from "@/hooks";
import { cn } from "@/lib/utils";
import { useWindowScroll } from "@/hooks";
import { LuxuraSearchModal } from "../modules/search/luxura-search-modal";
import { LuxuraLanguageToggler } from "../components/luxura-language-toggler";
import { LuxuraMobileNav } from "../components/luxura-mobile-nav";

export const LuxuraHeader = () => {
  const { shopDetails, isSearchModalOpen, setSearchModalOpen } = useShopStore();
  const { totalProducts } = useCartTotals();
  const { y: scrollY } = useWindowScroll();
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [langValue, setLangValue] = useState(
    shopDetails?.default_language_code ?? "en"
  );
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale) setLangValue(storedLocale);
  }, []);

  const baseUrl = shopDetails?.baseUrl || "";
  const isDark = shopDetails?.shop_theme?.theme_mode === "dark";

  return (
    <>
      {/* Search Modal */}
      {isSearchModalOpen && (
        <LuxuraSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          searchText={searchText}
        />
      )}

      {/* Mobile Navigation */}
      <LuxuraMobileNav
        isOpen={showMobileNav}
        onClose={() => setShowMobileNav(false)}
      />

      {/* Header */}
      <header
        className={cn(
          "h-[70px] md:h-[80px] sticky w-full top-0 left-0",
          "bg-white dark:bg-black-18 lg:text-black-1.2 text-white z-100",
          "flex items-center justify-center shadow-sm transition-shadow duration-150",
          "md:border-b dark:border-b-black-2",
          {
            "shadow-md": scrollY > 20,
          }
        )}
      >
        <div className="relative w-[97%] lg:w-[78%] bg-white dark:bg-black-18 flex items-center justify-center">
          <nav className="premium-layout-width items-center flex justify-center w-full">
            <div className="w-full flex items-center justify-between">
              {/* Left: Mobile Menu + Logo */}
              <div className="flex items-center gap-2">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileNav(!showMobileNav)}
                  className="lg:hidden items-center justify-center flex p-4 bg-white shadow-luxura-header rounded-lg"
                  aria-label="Open menu"
                >
                  <Menu size={20} className="text-black-2" />
                </button>

                {/* Logo */}
                <div>
                  {shopDetails?.image_url ? (
                    <Link href={baseUrl || "/"}>
                      <Image
                        height={60}
                        width={200}
                        alt={shopDetails.shop_name || "Shop"}
                        src={shopDetails.image_url}
                        className="max-h-[54px] md:max-h-[60px] w-auto max-w-[170px] object-contain"
                        priority
                      />
                    </Link>
                  ) : (
                    <Link
                      href={baseUrl || "/"}
                      className="text-[22px] lg:text-[28px] font-bold block"
                    >
                      <h1 className="text-black-2 dark:text-gray-100">
                        {shopDetails?.shop_name || "Shop"}
                      </h1>
                    </Link>
                  )}
                </div>
              </div>

              {/* Right: Search + Cart + Language */}
              <div className="flex items-center gap-3 lg:gap-4">
                {/* Search */}
                <button
                  className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  onClick={() => setSearchModalOpen(true)}
                  aria-label="Search"
                >
                  <Search
                    className="text-black-1.1 dark:text-gray-200"
                    strokeWidth={2}
                  />
                </button>

                {/* Cart */}
                <Link
                  href={`${baseUrl}/cart`}
                  className="items-center relative justify-center flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ShoppingCart className="text-black-1.1 dark:text-gray-200" />
                  {totalProducts > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-zatiq font-bold text-[10px] rounded-full p-2 text-white w-5 h-5 flex items-center justify-center">
                      {totalProducts}
                    </span>
                  )}
                </Link>

                {/* Language Toggle */}
                <LuxuraLanguageToggler
                  langValue={langValue}
                  setLangValue={setLangValue}
                  className="hidden lg:flex"
                />
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default LuxuraHeader;
```

### Step 2.2: Luxura Footer

**File:** `app/_themes/luxura/layout/luxura-footer.tsx`

```typescript
"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useTranslation } from "react-i18next";

export const LuxuraFooter = () => {
  const { shopDetails } = useShopStore();
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();
  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-800 mt-auto">
      <div className="w-[95%] md:w-[90%] lg:w-[78%] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shop Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{shopDetails?.shop_name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {shopDetails?.details ||
                "Your trusted online shopping destination"}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {shopDetails?.social_links?.facebook && (
                <Link
                  href={shopDetails.social_links.facebook}
                  target="_blank"
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <Facebook size={18} />
                </Link>
              )}
              {shopDetails?.social_links?.instagram && (
                <Link
                  href={shopDetails.social_links.instagram}
                  target="_blank"
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <Instagram size={18} />
                </Link>
              )}
              {shopDetails?.social_links?.twitter && (
                <Link
                  href={shopDetails.social_links.twitter}
                  target="_blank"
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <Twitter size={18} />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t("quick_links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`${baseUrl}/`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseUrl}/products`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {t("products")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseUrl}/categories`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {t("categories")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseUrl}/about`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {t("about_us")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t("customer_service")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`${baseUrl}/contact`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {t("contact_us")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseUrl}/shipping`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {t("shipping_info")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseUrl}/returns`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {t("returns_exchanges")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseUrl}/faq`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {t("faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t("contact")}</h3>
            <ul className="space-y-3">
              {shopDetails?.shop_email && (
                <li className="flex items-start gap-2">
                  <Mail
                    size={18}
                    className="text-gray-600 dark:text-gray-400 mt-0.5"
                  />
                  <a
                    href={`mailto:${shopDetails.shop_email}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {shopDetails.shop_email}
                  </a>
                </li>
              )}
              {shopDetails?.shop_phone && (
                <li className="flex items-start gap-2">
                  <Phone
                    size={18}
                    className="text-gray-600 dark:text-gray-400 mt-0.5"
                  />
                  <a
                    href={`tel:${shopDetails.shop_phone}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {shopDetails.shop_phone}
                  </a>
                </li>
              )}
              {shopDetails?.address && (
                <li className="flex items-start gap-2">
                  <MapPin
                    size={18}
                    className="text-gray-600 dark:text-gray-400 mt-0.5"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {shopDetails.address}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} {shopDetails?.shop_name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href={`${baseUrl}/privacy`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
              >
                {t("privacy_policy")}
              </Link>
              <Link
                href={`${baseUrl}/terms`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
              >
                {t("terms_of_service")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LuxuraFooter;
```

---

## Phase 3: Page Modules

### Step 3.1: Luxura Home Page

**File:** `app/_themes/luxura/modules/home/luxura-home-page.tsx`

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
const LuxuraHeroSection = dynamic(
  () => import("./sections/luxura-hero-section"),
  { ssr: false }
);

const LuxuraCategorySection = dynamic(
  () => import("./sections/luxura-category-section"),
  { ssr: false }
);

const LuxuraNewArrivalsSection = dynamic(
  () => import("./sections/luxura-new-arrivals-section"),
  { ssr: false }
);

const LuxuraFeaturedProductsSection = dynamic(
  () => import("./sections/luxura-featured-products-section"),
  { ssr: false }
);

const LuxuraSelectedCategorySection = dynamic(
  () => import("./sections/luxura-selected-category-section"),
  { ssr: false }
);

const LuxuraSelectedProductsByCategorySection = dynamic(
  () => import("./sections/luxura-selected-products-by-category-section"),
  { ssr: false }
);

const InventoryCartProductModifierModal = dynamic(
  () => import("@/components/features/cart/variant-selector-modal"),
  { ssr: false }
);

export function LuxuraHomePage() {
  const router = useRouter();
  const { shopDetails } = useShopStore();
  const { totalPrice, totalProducts, hasItems } = useCartTotals();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const baseUrl = shopDetails?.baseUrl || "";
  const selectedInventories =
    shopDetails?.shop_theme?.selected_inventories || [];
  const onSaleInventories = shopDetails?.shop_theme?.on_sale_inventories || [];

  const navigateToProduct = (id: number) => {
    router.push(`${baseUrl}/products/${id}`);
  };

  return (
    <>
      {/* Variant Selector Modal */}
      <InventoryCartProductModifierModal
        selectedProduct={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Main Content */}
      <div className="flex flex-col py-[24px] md:py-[60px] xl:py-[84px] gap-[36px] md:gap-[60px] xl:gap-[84px]">
        {/* Hero Section with Sidebar Categories */}
        <div className="w-[95%] md:w-[95%] lg:w-[78%] mx-auto flex flex-col gap-8 lg:gap-20">
          <LuxuraHeroSection />
          <LuxuraCategorySection />
        </div>

        {/* New Arrivals */}
        <LuxuraNewArrivalsSection
          setSelectedProduct={setSelectedProduct}
          navigateProductDetails={navigateToProduct}
        />

        {/* Featured Products & Flash Sale */}
        <div className="w-[95%] md:w-[90%] lg:w-[78%] mx-auto flex flex-col gap-[48px] md:gap-[60px] xl:gap-[84px]">
          {/* Featured Products */}
          {selectedInventories.length > 0 && (
            <LuxuraFeaturedProductsSection
              products={selectedInventories}
              setSelectedProduct={setSelectedProduct}
              navigateProductDetails={navigateToProduct}
              title="featured_products"
            />
          )}

          {/* Selected Category Section */}
          <LuxuraSelectedCategorySection />

          {/* Flash Sale */}
          {onSaleInventories.length > 0 && (
            <LuxuraFeaturedProductsSection
              products={onSaleInventories}
              setSelectedProduct={setSelectedProduct}
              navigateProductDetails={navigateToProduct}
              title="flash_sale"
            />
          )}
        </div>

        {/* Selected Products by Category */}
        <LuxuraSelectedProductsByCategorySection
          setSelectedProduct={setSelectedProduct}
          navigateProductDetails={navigateToProduct}
        />
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        onClick={() => router.push(`${baseUrl}/checkout`)}
        showCartFloatingBtn={hasItems}
        theme="Luxura"
        totalPrice={totalPrice}
        totalProducts={totalProducts}
      />
    </>
  );
}

export default LuxuraHomePage;
```

### Step 3.2: Hero Section with Sidebar Categories

**File:** `app/_themes/luxura/modules/home/sections/luxura-hero-section.tsx`

```typescript
"use client";

import { useRef } from "react";
import { useShopStore } from "@/stores/shopStore";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { SidebarCategory } from "@/components/features/category/sidebar-category";
import { LuxuraSwiperNavButton } from "../../../components/luxura-swiper-nav-buttons";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

export function LuxuraHeroSection() {
  const { shopDetails } = useShopStore();
  const { t } = useTranslation();
  const swiperRef = useRef<SwiperType>();

  const carousels =
    shopDetails?.shop_theme?.carousels?.filter((c) => c.tag === "primary") ||
    [];

  return (
    <div className="flex gap-6 items-stretch">
      {/* Sidebar Categories - Desktop Only */}
      <div className="hidden lg:block w-[25%] bg-white dark:bg-black-zatiq lg:h-[420px] xl:h-[600px] overflow-auto shadow-md border rounded-xl">
        <SidebarCategory />
      </div>

      {/* Hero Carousel */}
      <div className="w-full lg:max-w-[75%] overflow-hidden">
        <div className="w-full bg-blue-zatiq h-[280px] sm:h-[320px] md:h-[360px] lg:h-[420px] xl:h-[600px] rounded-xl relative">
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            slidesPerView={1}
            loop={true}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            rewind={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Navigation]}
            className="rounded-xl h-full"
          >
            {carousels.map((item, index) => (
              <SwiperSlide
                onClick={() =>
                  item.button_link && window.open(item.button_link)
                }
                className={`${item?.button_link ? "cursor-pointer" : ""}`}
                key={index}
              >
                <div className="w-full h-full flex items-center relative">
                  {/* Text Overlay */}
                  {(item.title || item.sub_title) && (
                    <div className="w-1/2 p-3 md:p-5 lg:p-8 xl:pl-12 relative z-20 h-full flex flex-col justify-center bg-linear-to-r from-white/50 to-transparent">
                      {item?.title && (
                        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-none line-clamp-2">
                          {item.title}
                        </h1>
                      )}
                      {item?.sub_title && (
                        <p className="line-clamp-3 mt-3 md:mt-4 xl:mt-5">
                          {item.sub_title}
                        </p>
                      )}
                      {item?.button_link && (
                        <div className="mt-4 md:mt-6 xl:mt-8">
                          <button
                            onClick={() => window.open(item.button_link)}
                            className="bg-black-full/75 px-5 py-2 text-xs md:text-sm xl:text-base rounded-md xl:rounded-xl text-white hover:bg-black-full transition"
                          >
                            {item?.button_text || "Shop Now"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Background Image */}
                  <Image
                    src={item.image_url || ""}
                    alt={item.title || "Carousel"}
                    fill
                    className="object-cover absolute inset-0 rounded-xl"
                    priority={index === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <LuxuraSwiperNavButton swiperRef={swiperRef} />
        </div>
      </div>
    </div>
  );
}

export default LuxuraHeroSection;
```

---

## Functionality Mapping

### Reusable Hooks from Basic Theme

| Functionality   | Hook                   | Location                       | Usage in Luxura               |
| --------------- | ---------------------- | ------------------------------ | ----------------------------- |
| Shop Profile    | `useShopProfile()`     | `/hooks/useShopProfile.ts`     | ✅ Header, Footer             |
| Products List   | `useShopInventories()` | `/hooks/useShopInventories.ts` | ✅ All product displays       |
| Categories      | `useShopCategories()`  | `/hooks/useShopCategories.ts`  | ✅ Category sections, Sidebar |
| Product Details | `useProductDetails()`  | `/hooks/useProductDetails.ts`  | ✅ Product detail page        |
| Cart Management | `useCartTotals()`      | `/hooks/useCartTotals.ts`      | ✅ Cart display, Header       |
| Add to Cart     | `useAddToCart()`       | `/hooks/useAddToCart.ts`       | ✅ Product cards              |
| Checkout        | `useCheckout()`        | `/hooks/useCheckout.ts`        | ✅ Checkout flow              |
| Window Scroll   | `useWindowScroll()`    | `/hooks/useWindowScroll.ts`    | ✅ Header shadow on scroll    |

### Reusable Components from Basic Theme

| Component            | Location                                               | Luxura Adaptation        |
| -------------------- | ------------------------------------------------------ | ------------------------ |
| CartFloatingBtn      | `/components/features/cart-floating-btn.tsx`           | Use Luxura theme prop    |
| SidebarCategory      | `/components/features/category/sidebar-category.tsx`   | ✅ Direct use in hero    |
| SearchComponent      | `/components/features/search/`                         | Wrap in Luxura modal     |
| CategoryCard         | `/components/features/category-card.tsx`               | Style with Luxura design |
| PriceDisplay         | `/components/shared/price-display.tsx`                 | ✅ Direct use            |
| LoadingSpinner       | `/components/shared/loading-spinner.tsx`               | ✅ Direct use            |
| VariantSelectorModal | `/components/features/cart/variant-selector-modal.tsx` | ✅ Direct use            |

---

## Design Specifications

### Luxura Theme Visual Identity

**Primary Colors:**

- Primary Blue: `#3B82F6`
- Accent Purple: `#8B5CF6`
- Success Green: `#10B981`

**Typography:**

- Headings: Helvetica Now (Bold)
- Body: Helvetica Now (Regular)
- Size Scale: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 48px

**Spacing:**

- Section Gaps: 36px (mobile), 60px (tablet), 84px (desktop)
- Card Padding: 16px (mobile), 24px (desktop)
- Container Width: 95% (mobile), 90% (tablet), 78% (desktop - premium)

**Component Styles:**

- Border Radius: 8px (buttons), 12px (cards)
- Product Card Aspect: 420/360 (unique to Luxura)
- Shadows: shadow-md on sidebar, shadow-luxura-header on mobile menu
- Transitions: 150ms ease-in-out

### Layout Specifications

**Header:**

- Height: 70px (mobile), 80px (desktop)
- Sticky positioning
- Shadow on scroll (scrollY > 20)
- Premium width: 78% on desktop
- Mobile menu with shadow card

**Hero Section:**

- Height: 280px (mobile) → 320px (sm) → 360px (md) → 420px (lg) → 600px (xl)
- Sidebar: 25% width, rounded-xl, shadow-md
- Swiper with custom navigation buttons
- Auto-play: 2000ms delay
- Text overlay with gradient background

**Product Cards:**

- Aspect ratio: 420:360 (Luxura specific)
- Rounded corners: 12px (rounded-lg on mobile, rounded-xl on desktop)
- Hover effect: Scale image 1.05x
- Shadow: subtle base, stronger on hover
- Buy Now button support (configurable)

**Sidebar Categories:**

- Background: white / dark:black-zatiq
- Height: 420px (lg) / 600px (xl)
- Shadow: md
- Border radius: 12px
- Overflow: auto

**Grid System:**

- Products: 2 cols (mobile), 3 cols (tablet), 4 cols (desktop)
- Categories: 2 cols (mobile), 3 cols (tablet), 6 cols (desktop)
- Gap: 24px (base), responsive

**Section Spacing:**

- Top/Bottom: 24px (mobile), 60px (tablet), 84px (desktop)
- Between sections: 36px (mobile), 60px (tablet), 84px (desktop)

---

## File Migration Checklist

| Legacy File                                                      | New File                                                                 | Status |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------ | ------ |
| `layout/header.tsx`                                              | `layout/luxura-header.tsx`                                               | ⬜     |
| `layout/footer.tsx`                                              | `layout/luxura-footer.tsx`                                               | ⬜     |
| `components/luxura-page-header.tsx`                              | `components/luxura-page-header.tsx`                                      | ⬜     |
| `components/category-card.tsx`                                   | `components/luxura-category-card.tsx`                                    | ⬜     |
| `components/grid-container.tsx`                                  | `components/luxura-grid-container.tsx`                                   | ⬜     |
| `components/language-toggler.tsx`                                | `components/luxura-language-toggler.tsx`                                 | ⬜     |
| `components/related-products.tsx`                                | `components/luxura-related-products.tsx`                                 | ⬜     |
| `components/trust-card.tsx`                                      | `components/luxura-trust-card.tsx`                                       | ⬜     |
| `components/swiper-nav-buttons.tsx`                              | `components/luxura-swiper-nav-buttons.tsx`                               | ⬜     |
| `modules/search/search-modal.tsx`                                | `modules/search/luxura-search-modal.tsx`                                 | ⬜     |
| `modules/search/search-dropdown.tsx`                             | `modules/search/luxura-search-dropdown.tsx`                              | ⬜     |
| `modules/search/search-component.tsx`                            | `modules/search/luxura-search-component.tsx`                             | ⬜     |
| `sections/luxura-productcard.tsx`                                | `components/luxura-product-card.tsx`                                     | ⬜     |
| `sections/section-header.tsx`                                    | `modules/home/sections/section-header.tsx`                               | ⬜     |
| `sections/view-all-button.tsx`                                   | `modules/home/sections/view-all-button.tsx`                              | ⬜     |
| `sections/luxura-home-hero-section.tsx`                          | `modules/home/sections/luxura-hero-section.tsx`                          | ⬜     |
| `sections/luxura-home-category-section.tsx`                      | `modules/home/sections/luxura-category-section.tsx`                      | ⬜     |
| `sections/luxura-home-new-arrivals-section.tsx`                  | `modules/home/sections/luxura-new-arrivals-section.tsx`                  | ⬜     |
| `sections/luxura-home-featured-products-section.tsx`             | `modules/home/sections/luxura-featured-products-section.tsx`             | ⬜     |
| `sections/luxura-home-selected-category-section.tsx`             | `modules/home/sections/luxura-selected-category-section.tsx`             | ⬜     |
| `sections/luxura-home-selected-products-by-category-section.tsx` | `modules/home/sections/luxura-selected-products-by-category-section.tsx` | ⬜     |
| `sections/product-details.tsx`                                   | `modules/product-detail/sections/product-details.tsx`                    | ⬜     |
| `sections/product-pricing.tsx`                                   | `modules/product-detail/sections/product-pricing.tsx`                    | ⬜     |
| `sections/product-variants.tsx`                                  | `modules/product-detail/sections/product-variants.tsx`                   | ⬜     |
| `sections/inventory-categories.tsx`                              | `modules/category/sections/category-grid.tsx`                            | ⬜     |
| `sections/inventory-search.tsx`                                  | `modules/search/luxura-search-results.tsx`                               | ⬜     |
| `luxura-home-page.module.tsx`                                    | `modules/home/luxura-home-page.tsx`                                      | ⬜     |
| `luxura-product-page.module.tsx`                                 | `modules/product-detail/luxura-product-detail-page.tsx`                  | ⬜     |
| `luxura-category-page-module.tsx`                                | `modules/category/luxura-category-page.tsx`                              | ⬜     |
| `luxura-all-products.tsx`                                        | `modules/products/luxura-all-products.tsx`                               | ⬜     |
| `luxura-all-categories.tsx`                                      | `modules/category/luxura-all-categories.tsx`                             | ⬜     |
| `order/checkout.module.tsx`                                      | `modules/checkout/luxura-checkout.tsx`                                   | ⬜     |

---

## Context to Zustand Migration

### Old Context Usage → New Zustand Store

| Legacy Context                          | New Zustand Store                              | Property/Method    |
| --------------------------------------- | ---------------------------------------------- | ------------------ |
| `usePageProps().shopDetails`            | `useShopStore().shopDetails`                   | Shop information   |
| `useShopContext().country_currency`     | `useShopStore().shopDetails?.country_currency` | Currency           |
| `useShopContext().baseUrl`              | `useShopStore().shopDetails?.baseUrl`          | Base URL           |
| `useShopContext().isSearchModalOpen`    | `useShopStore().isSearchModalOpen`             | Search modal state |
| `useShopContext().setIsSearchModalOpen` | `useShopStore().setSearchModalOpen`            | Toggle search      |
| `useCartContext().addCartProduct`       | `useCartStore().addProduct`                    | Add to cart        |
| `useCartContext().totalProducts`        | `useCartStore(selectTotalItems)`               | Total items        |
| `useCartContext().totalPrice`           | `useCartStore(selectSubtotal)`                 | Subtotal           |
| `useCartContext().getCartProducts`      | `useCartStore().getProductsByInventoryId`      | Get cart items     |
| `useProductContext().isStockOut`        | Custom hook or component logic                 | Stock status       |

---

## Quick Reference: Import Mappings

```typescript
// Old imports → New imports

// Contexts → Stores
"@app/lib/contexts" → "@/stores/shopStore"
"@app/www/context" → "@/stores/cartStore", "@/stores/productsStore"

// Router
"next/router" → "next/navigation"
"useRouter().push()" → "router.push()" or "<Link>"

// Utils
"@app/lib/utils" → "@/lib/utils"
"getShopImageUrl()" → Direct use of image_url
"getInventoryThumbImageUrl()" → Direct use of images[0] || image_url

// Components
"@app/www/e-commerce/components/FallbackImage" → "next/image" (Image)
"@app/www/e-commerce/components/cart-floating-btn" → "@/components/features/cart/cart-floating-btn"
"@app/www/e-commerce/modules/category" → "@/components/features/category"

// Icons
"lucide-react" → Same (already using)

// Hooks
"@app/lib/hooks" → "@/hooks"
"useWindowScroll" → "@/hooks/useWindowScroll"

// Swiper
"swiper/react" → Same
"swiper/modules" → Same
```

---

## Luxura Unique Features

### 1. **Sidebar Categories in Hero**

Unlike Aurora which shows categories as a separate section, Luxura integrates categories as a sidebar alongside the hero carousel.

```tsx
<div className="flex gap-6">
  <div className="w-[25%]">
    <SidebarCategory />
  </div>
  <div className="w-[75%]">
    <HeroCarousel />
  </div>
</div>
```

### 2. **Premium Layout Width (78%)**

Luxura uses a narrower, more premium container width on desktop (78% vs 90% in other themes).

### 3. **Product Card Aspect Ratio (420:360)**

Luxura uses a unique aspect ratio for product cards: `420/360` instead of the standard `244/304`.

### 4. **Shadow Card Mobile Menu**

Mobile menu button has a distinctive shadow effect: `shadow-luxura-header`.

### 5. **Trust Cards**

Luxura includes trust/feature badges component to build credibility.

### 6. **Swiper Custom Navigation**

Uses custom navigation buttons component (`LuxuraSwiperNavButton`) for carousel controls.

### 7. **New Arrivals Section**

Dedicated section for new arrivals with full-width layout.

### 8. **Section Spacing (84px)**

Larger desktop spacing (84px) compared to other themes for a more spacious, premium feel.

---

## Testing Checklist

### Component Testing

- [ ] Header renders with logo, search, cart, language toggle
- [ ] Mobile menu opens/closes correctly
- [ ] Footer displays all sections and links
- [ ] Hero carousel auto-rotates and displays images with text overlays
- [ ] Sidebar categories display and are scrollable
- [ ] Product cards show image, name, price, add to cart, buy now
- [ ] Search modal opens and filters products
- [ ] Trust cards display with icons and text
- [ ] Swiper navigation buttons work
- [ ] Dark mode styling applies correctly

### Functionality Testing

- [ ] Add to cart functionality works
- [ ] Buy now button redirects to checkout
- [ ] Variant selection modal works for products with variants
- [ ] Cart quantity controls work (increment/decrement)
- [ ] Navigation between pages works
- [ ] Language toggle switches translations
- [ ] Search functionality filters products
- [ ] Carousel navigation (next/prev) works
- [ ] Auto-play carousel works

### Data Flow Testing

- [ ] Shop details load from Zustand store
- [ ] Cart persists to localStorage
- [ ] Products load via React Query
- [ ] Featured products display correctly
- [ ] On-sale products display correctly
- [ ] Categories display in sidebar and grid
- [ ] New arrivals section displays
- [ ] Selected products by category display

### Responsive Testing

- [ ] Mobile layout (< 640px) - No sidebar, full-width hero
- [ ] Small mobile (640px - 768px) - Adjusted heights
- [ ] Tablet layout (768px - 1024px) - 90% width
- [ ] Desktop layout (> 1024px) - 78% width, sidebar visible
- [ ] Sidebar categories visible only on lg+ screens
- [ ] Hero heights: 280px → 320px → 360px → 420px → 600px
- [ ] Grid layouts adjust correctly
- [ ] Mobile menu accessible only on mobile

### Visual Testing

- [ ] Product card aspect ratio 420:360
- [ ] Border radius 12px on cards
- [ ] Shadow effects on sidebar and mobile menu
- [ ] Premium width (78%) on desktop
- [ ] Section spacing (84px) on desktop
- [ ] Rounded corners on all cards (rounded-xl)
- [ ] Gradient text overlay on hero
- [ ] Custom swiper navigation styling

---

## Next Steps

1. **Review this document** - Ensure all stakeholders agree on the approach
2. **Set up directory structure** - Create all folders (Phase 1)
3. **Implement layouts** - Header and Footer (Phase 2)
4. **Build page modules** - Home, Products, Product Detail (Phase 3)
5. **Create components** - Hero, Cards, Search, Swiper Nav (Phase 4)
6. **Apply styling** - Match Luxura design 100% (Phase 5)
7. **Test thoroughly** - Validate all functionality (Phase 6)

---

**Document Status:** ✅ Complete  
**Ready for Implementation:** Yes  
**Estimated Timeline:** 6-7 days for full migration

**Key Differences from Aurora:**

- Sidebar categories in hero section
- 78% premium container width
- 420:360 product card aspect ratio
- Shadow-based mobile menu
- Trust cards component
- 84px section spacing
- New arrivals dedicated section
