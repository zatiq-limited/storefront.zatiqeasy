# CLAUDE.md - Project Memory

This file contains comprehensive documentation for the Zatiq Storefront project to help Claude understand the codebase.

---

## Project Overview

**Name:** Zatiq Storefront (storefront.zatiqeasy)
**Type:** Multi-tenant e-commerce storefront
**Framework:** Next.js 16 with App Router
**Language:** TypeScript 5
**Styling:** Tailwind CSS 4

| Metric | Count |
|--------|-------|
| TypeScript Files | 518 |
| Static Themes | 5 |
| API Routes | 25 |
| Zustand Stores | 12 |
| Custom Hooks | 21 |
| UI Components | 32 |

---

## Rendering Flow: Request → Response

```
Request comes in
    │
    ├─ proxy.ts (subdomain/domain detection)
    │   └─ Identifies shop: *.zatiqeasy.com, *.zatiq.app, etc.
    │
    ├─ next.config.ts (rewrites/redirects)
    │   ├─ STANDALONE mode: Custom domain routing
    │   └─ DEV mode: /merchant/[shopId] routing
    │
    ├─ app/layout.tsx (Server Component)
    │   ├─ Fetches shop profile server-side
    │   ├─ Sets up providers (Query, i18n, Toast)
    │   └─ Wraps with ShopProvider
    │
    ├─ ThemeRouter (Client Component)
    │   ├─ Checks legacy_theme flag
    │   │
    │   ├─ If legacy_theme === true:
    │   │   └─ Renders static theme (Basic, Aurora, Premium, Luxura, Sellora)
    │   │
    │   └─ If legacy_theme === false:
    │       └─ Renders BlockRenderer (JSON-to-React dynamic rendering)
    │
    └─ Page renders with header/footer from ThemeLayout
```

---

## Key Configuration Files

### next.config.ts

**Location:** `/next.config.ts`

**Features:**
- Image optimization with remote patterns (CloudFront, Cloudinary, Unsplash, Zatiq domains)
- Turbopack enabled for faster builds
- 1-year immutable cache for `_next/static`
- Webpack alias: `@` maps to root directory

**Environment-based Rewrites:**

**STANDALONE mode (Production):**
- `/robots.txt` → `/api/robots.txt`
- `/r/:path*` → `/receipt/:path`
- `/merchant/:path*` → `/404`
- Query param redirects: `?product=X` → `/products/:product`

**DEV mode (Development):**
- `/categories/:path*` → `/404`
- `/r/:path*` → `/receipt/:path`
- `/:shopId(\\d+)/:path*` → `/merchant/:shopId/:path*`
- Merchant query params: `/merchant/:path?product=X` → `/merchant/:path/products/:product`

### proxy.ts

**Location:** `/proxy.ts`

**Purpose:** Handle subdomain and custom domain routing for multi-tenant shops

**Supported Domains:**
- `*.zatiqeasy.com`
- `*.zatiq.app`
- `*.bdsite.net`
- `*.myecom.site`
- `*.sellbd.shop`
- `*.sell-bazar.com`

**Skips proxy for:** `_next`, `/api/`, static files, media files

---

## App Directory Structure

```
app/
├── layout.tsx              # Root server layout (shop detection, providers)
├── page.tsx                # Homepage (theme router entry point)
├── favicon.ico
├── globals.css
│
├── (shop)/                 # Route group for shop pages
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   └── payment-confirm/page.tsx
│
├── (renderers)/            # Route group for theme builder pages
│   ├── (page)/
│   │   ├── products/page.tsx
│   │   ├── products/[handle]/page.tsx
│   │   ├── collections/page.tsx
│   │   └── collections/[slug]/page.tsx
│   └── (block)/
│       ├── about-us/page.tsx
│       ├── contact-us/page.tsx
│       └── privacy-policy/page.tsx
│
├── merchant/[shopId]/      # Multi-tenant merchant routes
│   ├── layout.tsx
│   ├── page.tsx
│   ├── products/
│   ├── products/[productHandle]/
│   ├── categories/
│   ├── categories/[category]/
│   ├── single-product/[slug]/
│   ├── checkout/
│   ├── about-us/
│   ├── privacy-policy/
│   ├── return-policy/
│   └── terms-and-conditions/
│
├── receipt/[receiptId]/    # Order receipt page
│
├── _themes/                # Static theme implementations
│   ├── basic/
│   ├── aurora/
│   ├── premium/
│   ├── luxura/
│   ├── sellora/
│   └── landing/
│
├── _layouts/               # Layout components
│   ├── theme/layout.tsx    # Global header/footer (theme builder mode)
│   └── home/layout.tsx
│
├── providers/              # Context providers
│
├── lib/                    # Utilities
│
└── api/                    # 25 API route handlers
    ├── storefront/v1/
    │   ├── profile/route.ts
    │   ├── inventories/route.ts
    │   ├── categories/route.ts
    │   ├── products/route.ts
    │   ├── products/[handle]/route.ts
    │   ├── collections/route.ts
    │   ├── collections/[slug]/route.ts
    │   ├── theme/route.ts
    │   ├── divisions/route.ts
    │   ├── landing/[slug]/route.ts
    │   └── page/
    │       ├── home/route.ts
    │       ├── products/route.ts
    │       ├── product-details/route.ts
    │       ├── collections/route.ts
    │       ├── collection-details/route.ts
    │       ├── about-us/route.ts
    │       └── contact-us/route.ts
    ├── orders/
    │   ├── create/route.ts
    │   ├── [receiptId]/route.ts
    │   ├── verify-phone/route.ts
    │   └── promo-code/route.ts
    ├── webhooks/
    │   ├── aamarpay/confirm/route.ts
    │   └── nagad/confirm/route.ts
    ├── contact/route.ts
    └── download-image/route.ts
```

---

## Dual Theme System

### Theme Detection Logic

```typescript
// Shop profile contains:
{
  legacy_theme: boolean,        // true = static themes, false = theme builder
  shop_theme: {
    theme_name: "Basic" | "Aurora" | "Premium" | "Luxura" | "Sellora"
  },
  theme_color: {
    primary_color: "#hexcode"
  },
  singleProductTheme?: boolean  // for landing pages
}
```

### Static Themes (legacy_theme === true)

**Location:** `app/_themes/`

| Theme | Description |
|-------|-------------|
| Basic | Minimal, lightweight theme |
| Aurora | Modern, colorful theme |
| Premium | Feature-rich premium theme |
| Luxura | Luxury/high-end theme |
| Sellora | Modern e-commerce with scroll-based header |

**Theme Structure:**
```
_themes/[theme-name]/
├── index.ts              # Theme exports and metadata
├── theme.config.ts       # Color/spacing configuration
├── modules/              # Page-level components
│   ├── home/
│   ├── products/
│   ├── category/
│   └── product-detail/
└── components/           # Reusable theme components
    ├── header/
    ├── footer/
    ├── cards/
    ├── carousel/
    └── sections/
```

### Theme Builder (legacy_theme === false)

**Component:** `components/renderers/block-renderer/index.tsx`

**Features:**
- V3.0 schema with 50+ block types
- Recursive JSON-to-React rendering
- Supports: repeaters, swipers, marquees, icons, custom elements
- LZ-compressed JSON from backend API
- Dynamic event binding and data templating

---

## Page Rendering: Static Theme vs Theme Builder

### Decision Point

```
Shop Profile
    │
    └─ legacy_theme: boolean
        ├─ true  → Static Themes (Basic, Aurora, Premium, Luxura, Sellora)
        └─ false → Theme Builder (BlockRenderer with JSON schema)
```

### 1. Homepage Rendering

**Route:** `/` or `/merchant/[shopId]`

```
Request → app/layout.tsx (Server)
    │
    └─ AppWrapper (Client)
        │
        └─ ThemeRouter (Client) ← checks legacy_theme
            │
            ├─ IF legacy_theme === true && isHomepageRoute:
            │   └─ ConditionalThemeHandler
            │       └─ SelloraHomePage (or other static theme)
            │           • Fetches inventories/categories via hooks
            │           • Renders HeroCarousel, OurCollection, FeaturedProducts
            │
            └─ IF legacy_theme === false:
                └─ ThemeLayout (renders header/footer from API)
                    └─ app/page.tsx
                        └─ useHomepage() → fetches homepage.json
                        └─ BlockRenderer (renders sections from JSON)
```

**Static Theme (Sellora):** `app/_themes/sellora/modules/home/sellora-home-page.tsx`
```typescript
useShopInventories({ shopUuid: shopDetails?.shop_uuid });
useShopCategories({ shopUuid: shopDetails?.shop_uuid });

<HeroCarousel tag="primary" />
<OurCollectionSection />
<FeaturedProductsSection />
<OnSaleSection />
```

**Theme Builder:** `app/page.tsx`
```typescript
// Returns null if legacy_theme + homepage (ThemeRouter handles it)
if (isLegacyTheme && isHomepageRoute) return null;

// Theme Builder: Render BlockRenderer with JSON sections
const sections = homepage?.data?.sections || [];
return sections.map((section) => <BlockRenderer block={section.blocks[0]} />);
```

### 2. Products Page Rendering

**Route:** `/products`

```
Request → app/(renderers)/(page)/products/page.tsx (Server)
    │
    └─ ProductsClient (Client)
        │
        ├─ IF legacy_theme === true:
        │   └─ SelloraAllProducts (or theme-specific component)
        │       • useShopInventories() → fetches products
        │       • Client-side filtering, sorting, pagination
        │       • Renders product grid with theme-specific cards
        │
        └─ IF legacy_theme === false:
            └─ useProductsPage() → fetches page config from API
            └─ ProductsPageRenderer (renders sections from API config)
```

**Static Theme:** `app/(renderers)/(page)/products/products-client.tsx`
```typescript
const STATIC_THEME_PRODUCTS_COMPONENTS = {
  Basic: BasicAllProducts,
  Aurora: AuroraAllProducts,
  Sellora: SelloraAllProducts,
};

if (isLegacyTheme) {
  return <StaticProductsComponent />;
}
```

**Theme Builder:**
```typescript
return (
  <ProductsPageRenderer
    sections={pageSections}
    products={products}
    pagination={pagination}
    filters={filters}
  />
);
```

### 3. Product Details Page Rendering

**Route:** `/products/[handle]`

```
Request → app/(renderers)/(page)/products/[handle]/page.tsx (Server)
    │
    └─ ProductDetailsClient (Client)
        │
        ├─ useProductDetails(handle) → fetches product + page config
        │
        ├─ IF legacy_theme === true:
        │   └─ Switch by themeName:
        │       • Basic: <BasicProductDetailPage handle={handle} />
        │       • Sellora: <SelloraProductDetailPage handle={handle} />
        │       • Premium: <PremiumProductDetailPage product={product} />
        │
        └─ IF legacy_theme === false:
            └─ ProductDetailsPageRenderer
                • Renders sections: breadcrumb, detail, reviews, related
```

**Static Theme:** `app/(renderers)/(page)/products/[handle]/product-details-client.tsx`
```typescript
if (isLegacyTheme) {
  switch (themeName) {
    case "Basic": return <BasicProductDetailPage handle={handle} />;
    case "Sellora": return <SelloraProductDetailPage handle={handle} />;
    case "Premium": return <PremiumProductDetailPage product={product} />;
  }
}
```

**Theme Builder:**
```typescript
const defaultSections = [
  { id: "product_breadcrumb", type: "product-breadcrumb-1" },
  { id: "product_detail", type: "product-detail-1" },
  { id: "customer_reviews", type: "customer-reviews-1" },
  { id: "related_products", type: "related-products-1" },
];

return (
  <ProductDetailsPageRenderer
    sections={pageSections}
    product={product}
    selectedVariants={selectedVariants}
    quantity={quantity}
  />
);
```

### Page Rendering Summary Table

| Page | Route | Static Theme Component | Theme Builder Renderer |
|------|-------|------------------------|------------------------|
| Homepage | `/` | `app/_themes/[theme]/modules/home/[theme]-home-page.tsx` | `app/page.tsx` + `BlockRenderer` |
| Products | `/products` | `app/_themes/[theme]/modules/products/[theme]-all-products.tsx` | `ProductsPageRenderer` |
| Product Detail | `/products/[handle]` | `app/_themes/[theme]/modules/product-detail/[theme]-product-detail-page.tsx` | `ProductDetailsPageRenderer` |

### Header/Footer Handling

| Mode | Header/Footer Source |
|------|---------------------|
| **Static Theme** | `ConditionalThemeHandler` renders theme-specific header/footer from `_themes/[theme]/components/` |
| **Theme Builder** | `ThemeLayout` renders header/footer via `BlockRenderer` from `theme.json` globalSections |

### Key Files for Page Rendering

| File | Purpose |
|------|---------|
| `components/theme-router.tsx` | Routes between static themes and theme builder |
| `components/app-wrapper.tsx` | Wraps routes with ThemeRouter + ThemeLayout |
| `app/_layouts/theme/layout.tsx` | Renders theme builder header/footer |
| `app/lib/conditional-theme-handler.tsx` | Applies CSS theme colors + static theme header/footer |
| `app/(renderers)/(page)/products/products-client.tsx` | Products page routing |
| `app/(renderers)/(page)/products/[handle]/product-details-client.tsx` | Product detail routing |
| `components/renderers/page-renderer/products-page-renderer.tsx` | Theme builder products renderer |
| `components/renderers/page-renderer/product-details-page-renderer.tsx` | Theme builder product detail renderer |

---

## API Integration: Static Theme vs Theme Builder

### API Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SHARED APIs                                     │
│            (Used by BOTH Static Themes AND Theme Builder)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Products Data    │  /api/storefront/v1/inventories                         │
│  Categories       │  /api/storefront/v1/categories                          │
│  Single Product   │  /api/storefront/v1/products/[handle]                   │
│  Collections      │  /api/storefront/v1/collections                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
┌───────────────────────────────┐   ┌───────────────────────────────────────┐
│      STATIC THEMES            │   │         THEME BUILDER                  │
│   (legacy_theme = true)       │   │      (legacy_theme = false)            │
├───────────────────────────────┤   ├───────────────────────────────────────┤
│ • Uses hardcoded layouts      │   │ • Fetches PAGE CONFIG from Theme API  │
│ • Components: SelloraHomePage │   │ • Uses BlockRenderer for dynamic UI   │
│   BasicAllProducts, etc.      │   │ • Header/Footer from theme.json       │
│ • No page config API calls    │   │                                       │
└───────────────────────────────┘   │  Additional APIs:                     │
                                    │  • /api/storefront/v1/theme           │
                                    │  • /api/storefront/v1/page/home       │
                                    │  • /api/storefront/v1/page/products   │
                                    │  • /api/storefront/v1/page/product-   │
                                    │    details                            │
                                    └───────────────────────────────────────┘
```

### Shared APIs (Both Modes Use These)

| API Endpoint | Hook | External Backend | Purpose |
|--------------|------|------------------|---------|
| `POST /api/storefront/v1/inventories` | `useShopInventories()` | `POST /api/v1/live/inventories` | Fetch all products |
| `POST /api/storefront/v1/categories` | `useShopCategories()` | `POST /api/v1/live/filtered_categories` | Fetch categories |
| `GET /api/storefront/v1/products/[handle]` | `useProductDetails()` | Product endpoint | Fetch single product |
| `GET /api/storefront/v1/collections` | `useCollections()` | Collections endpoint | Fetch collections |

**Example - Products Flow (Same for Both Modes):**
```
Component (SelloraAllProducts OR ProductsPageRenderer)
    │
    └─ useShopInventories({ shopUuid })
        │
        └─ fetch('/api/storefront/v1/inventories')
            │
            └─ apiClient.post('/api/v1/live/inventories', { identifier: shop_uuid })
                │
                └─ https://easybill.zatiq.tech/api/v1/live/inventories
                    │
                    └─ Returns: Product[] (name, price, images, variants, stock, etc.)
```

### Theme Builder Only APIs (Page Configuration)

| API Endpoint | Hook | External Source | Purpose |
|--------------|------|-----------------|---------|
| `GET /api/storefront/v1/theme` | `useTheme()` | Theme API: `/theme/core/:shopId` | Global sections (header, footer) |
| `GET /api/storefront/v1/page/home` | `useHomepage()` | Theme API: `/theme/home/:shopId` | Homepage sections/blocks |
| `GET /api/storefront/v1/page/products` | `useProductsPage()` | Theme API: `/theme/products/:shopId` | Products page layout |
| `GET /api/storefront/v1/page/product-details` | `useProductDetails()` | Theme API: `/theme/productDetails/:shopId` | Product detail sections |

**Theme API Server:** `THEME_API_URL` (default: `http://localhost:4321/api`)

**Data Format:** LZ-compressed JSON, decompressed via `LZString.decompressFromUTF16()`

### API Call Comparison by Page

#### Homepage

| Mode | API Calls |
|------|-----------|
| **Static Theme** | `useShopInventories()` + `useShopCategories()` |
| **Theme Builder** | `useHomepage()` + `useTheme()` + `useShopInventories()` + `useShopCategories()` |

```typescript
// Static Theme (SelloraHomePage)
useShopInventories({ shopUuid });  // Fetch products for featured sections
useShopCategories({ shopUuid });   // Fetch categories for collection section

// Theme Builder (app/page.tsx + ThemeLayout)
useTheme();                        // Fetch header/footer config (globalSections)
useHomepage();                     // Fetch homepage sections (hero, products, etc.)
useShopInventories({ shopUuid });  // Same - fetch products for dynamic blocks
useShopCategories({ shopUuid });   // Same - fetch categories
```

#### Products Page

| Mode | API Calls |
|------|-----------|
| **Static Theme** | `useShopInventories()` + `useShopCategories()` |
| **Theme Builder** | `useProductsPage()` + `useShopInventories()` + `useShopCategories()` |

```typescript
// Static Theme (SelloraAllProducts)
useShopInventories({ shopUuid });  // Fetch products
useShopCategories({ shopUuid });   // Fetch categories for sidebar

// Theme Builder (ProductsClient → ProductsPageRenderer)
useProductsPage();                 // Fetch page layout/sections from Theme API
useShopInventories({ shopUuid });  // Same - fetch actual products
useShopCategories({ shopUuid });   // Same - fetch categories
```

#### Product Details Page

| Mode | API Calls |
|------|-----------|
| **Static Theme** | `useProductDetails(handle)` → productQuery only |
| **Theme Builder** | `useProductDetails(handle)` → productQuery + pageConfigQuery |

```typescript
// Static Theme (SelloraProductDetailPage)
const { product, isLoading } = useProductDetails(handle);
// Only fetches: /api/storefront/v1/products/[handle]

// Theme Builder (ProductDetailsClient → ProductDetailsPageRenderer)
const { product, sections, isLoading, isPageConfigLoading } = useProductDetails(handle);
// Fetches BOTH:
// 1. /api/storefront/v1/products/[handle] (product data)
// 2. /api/storefront/v1/page/product-details (page sections config)
```

### External Backend APIs

**Base URL:** `https://easybill.zatiq.tech`

| Endpoint | Method | Encryption | Purpose |
|----------|--------|------------|---------|
| `/api/v1/live/profile` | POST | Yes (AES) | Shop profile |
| `/api/v1/live/inventories` | POST | Yes (AES) | Products/inventories |
| `/api/v1/live/filtered_categories` | POST | Yes (AES) | Categories |
| `/api/v1/live/receipts` | POST | Yes (AES) | Create order |
| `/api/v1/live/pendingPayment` | POST | Yes (AES) | Process payment |

### Theme API Server

**Base URL:** `THEME_API_URL` (default: `http://localhost:4321/api`)

| Endpoint | Purpose |
|----------|---------|
| `GET /theme/core/:shopId` | Design system, header, footer |
| `GET /theme/home/:shopId` | Homepage sections |
| `GET /theme/products/:shopId` | Products page layout |
| `GET /theme/productDetails/:shopId` | Product details sections |
| `GET /theme/collections/:shopId` | Collections page |
| `GET /theme/about/:shopId` | About page |
| `GET /theme/contact/:shopId` | Contact page |

### Key Insight: Data vs Layout Separation

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCT DATA                                  │
│         (Same source for both modes)                            │
├─────────────────────────────────────────────────────────────────┤
│  Source: easybill.zatiq.tech                                    │
│  Contains: name, price, images, variants, stock, categories     │
│  Hook: useShopInventories(), useProductDetails()                │
│  Used by: BOTH Static Themes AND Theme Builder                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    PAGE LAYOUT/CONFIG                            │
│         (Theme Builder only)                                     │
├─────────────────────────────────────────────────────────────────┤
│  Source: Theme API Server (localhost:4321 or deployed)          │
│  Contains: sections, blocks, styling, component types           │
│  Hook: useTheme(), useHomepage(), useProductsPage()             │
│  Used by: Theme Builder ONLY (BlockRenderer)                    │
│  Static themes have hardcoded layouts in components             │
└─────────────────────────────────────────────────────────────────┘
```

### Hook Usage Summary

| Hook | Static Theme | Theme Builder | API Endpoint |
|------|--------------|---------------|--------------|
| `useShopInventories()` | ✅ | ✅ | `/api/storefront/v1/inventories` |
| `useShopCategories()` | ✅ | ✅ | `/api/storefront/v1/categories` |
| `useProductDetails()` | ✅ (product only) | ✅ (product + pageConfig) | `/api/storefront/v1/products/[handle]` |
| `useTheme()` | ❌ | ✅ | `/api/storefront/v1/theme` |
| `useHomepage()` | ❌ | ✅ | `/api/storefront/v1/page/home` |
| `useProductsPage()` | ❌ | ✅ | `/api/storefront/v1/page/products` |
| `useCollections()` | ✅ | ✅ | `/api/storefront/v1/collections` |

---

## Data Fetching Architecture

### Flow Diagram

```
React Component
    │
    └─ Custom Hook (e.g., useShopInventories)
        │
        └─ React Query (TanStack Query v5)
            │
            └─ Next.js API Route (/api/storefront/v1/*)
                │
                └─ API Client (lib/api/client.ts)
                    │
                    ├─ AES Encryption (for sensitive endpoints)
                    │
                    └─ External Backend: https://easybill.zatiq.tech
```

### API Client

**Location:** `lib/api/client.ts`

**Features:**
- Centralized fetch-based API client (axios-like interface)
- Base URL: `process.env.NEXT_PUBLIC_API_URL`
- Automatic AES encryption/decryption for specific endpoints
- Auth token management via localStorage (`zatiq_auth_token`)
- Headers: Device-Type, Application-Type, User-Agent

### Services

**Location:** `lib/api/services/`

| Service | Purpose |
|---------|---------|
| `shop.service.ts` | Shop profile, products, categories |
| `order.service.ts` | Order/receipt operations (with retry logic) |
| `payment.service.ts` | Payment gateway operations |
| `otp.service.ts` | Phone verification |
| `contact.service.ts` | Contact form submissions |
| `analytics.service.ts` | Event tracking |

### Encryption

**Location:** `lib/utils/encrypt-decrypt.ts`

**Technology:** CryptoJS AES with CBC mode

**Encrypted Endpoints:**
- `/api/v1/live/receipts` (order creation)
- `/api/v1/live/pendingPayment` (payment processing)
- `/api/v1/live/inventories` (products)
- `/api/v1/receipts/view/` (receipt details)

---

## State Management

### Zustand Stores

**Location:** `stores/`

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `shopStore.ts` | Shop profile, theme, currency, UI state | Session |
| `cartStore.ts` | Cart items (24h expiry) | localStorage |
| `checkoutStore.ts` | Address, payment method, promo code | Session |
| `productsStore.ts` | Product list, filters, pagination | Session |
| `productDetailsStore.ts` | Single product details | Session |
| `themeStore.ts` | Theme configuration | Session |
| `homepageStore.ts` | Homepage sections | Session |
| `aboutUsStore.ts` | About page content | Session |
| `contactUsStore.ts` | Contact form data | Session |
| `landingStore.ts` | Landing page state | Session |
| `analyticsStore.ts` | GTM, Pixel, TikTok config | Session |

### Custom Hooks

**Location:** `hooks/`

**Data Fetching:**
- `useTheme()` - Fetch theme JSON
- `useHomepage()` - Fetch homepage sections
- `useProducts()` - Product listing with pagination
- `useProductDetails()` - Single product data
- `useShopProfile()` - Shop metadata
- `useShopInventories()` - Product inventory
- `useShopCategories()` - Categories listing
- `useCheckout()` - Checkout flow
- `useCollections()` - Collection data
- `useLandingPage()` - Landing page data

**Utilities:**
- `useCartTotals()` - Cart calculations
- `usePriceFormatting()` - Price formatting
- `useAddToCart()` - Add to cart logic
- `useCartFloat()` - Floating cart state
- `use-media-query()` - Responsive breakpoints

---

## Component Architecture

### Directory Structure

```
components/
├── ui/                    # 32 base UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── select.tsx
│   ├── checkbox.tsx
│   ├── radio-group.tsx
│   ├── dropdown-menu.tsx
│   ├── popover.tsx
│   ├── badge.tsx
│   ├── card.tsx
│   ├── scroll-area.tsx
│   ├── command.tsx
│   ├── combobox.tsx
│   ├── input-otp.tsx
│   ├── country-dropdown.tsx
│   ├── language-switcher.tsx
│   ├── pagination.tsx
│   └── icons/
│
├── shared/                # 13 reusable components
│   ├── add-to-cart-button.tsx
│   ├── breadcrumb.tsx
│   ├── price-display.tsx
│   ├── product-badge.tsx
│   ├── product-image.tsx
│   ├── page-header.tsx
│   ├── page-loading.tsx
│   ├── error-component.tsx
│   └── skeletons/
│
├── features/              # Feature-specific components
│   ├── cart/
│   ├── category/
│   ├── checkout/
│   └── payments/
│
├── products/              # Product-specific components
│   └── variant-selector-modal.tsx
│
├── renderers/             # Theme builder system
│   ├── block-renderer/
│   │   ├── index.tsx
│   │   └── block-components/
│   └── page-renderer/
│
├── theme-router.tsx       # Client-side theme routing
└── app-wrapper.tsx        # Route-aware wrapper
```

### Key Patterns

**CVA (Class Variance Authority):**
```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", outline: "...", ghost: "..." },
    size: { xs: "...", sm: "...", default: "...", lg: "..." }
  }
})
```

**Framer Motion Animations:**
```typescript
<AnimatePresence mode="wait">
  <motion.div initial="initial" animate="animate" exit="exit" variants={variants}>
    {/* Content */}
  </motion.div>
</AnimatePresence>
```

**Hook-Based Data Fetching:**
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['products', params],
  queryFn: () => productService.getProducts(params),
  staleTime: 60 * 1000,
});
```

---

## Caching Strategy

### React Query Cache

**Location:** `lib/constants/cache.ts`

| Data Type | Stale Time | GC Time |
|-----------|------------|---------|
| PRODUCTS | 1 min | 5 min |
| PRODUCT_DETAIL | 2 min | 10 min |
| COLLECTIONS | 1 min | 5 min |
| PAGE_CONFIG | 5 min | 30 min |
| SHOP_PROFILE | 5 min | 30 min |
| SHOP_INVENTORIES | 1 min | 5 min |
| SHOP_CATEGORIES | 2 min | 10 min |
| STATIC | Infinity | Infinity |

### API Response Cache

```typescript
// Cache headers set in API routes
headers: {
  'Cache-Control': 's-maxage=120, stale-while-revalidate=600'
}
```

---

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://easybill.zatiq.tech

# Encryption
NEXT_PUBLIC_ENCRYPTION_KEY=b3817f6f8bb8e5ed1c16c4c578f9ed8e

# System Environment (DEV | SHOPLINK | STANDALONE)
NEXT_PUBLIC_SYSTEM_ENV=DEV

# Cache Timeout
NEXT_PUBLIC_CAHCETIMEOUT=10000

# Shop ID for local development
NEXT_PUBLIC_DEV_SHOP_ID=47366

# Theme API
THEME_API_URL=http://localhost:4321/api
NEXT_PUBLIC_THEME_API_URL=http://localhost:4321/api
```

---

## Provider Hierarchy

```
RootLayout (Server)
├─ QueryProvider (React Query - Client)
├─ I18nProvider (i18n - Client)
├─ ShopProvider (Shop context - Hybrid)
└─ AppWrapper (Route-aware - Client)
    └─ ThemeRouter (Theme detection - Client)
        ├─ ConditionalThemeHandler (Static theme)
        └─ ThemeLayout (Global layout - Client)
            └─ Page Component
```

---

## Key File Locations Reference

| What | Where |
|------|-------|
| Next.js config | `next.config.ts` |
| Proxy logic | `proxy.ts` |
| Root layout | `app/layout.tsx` |
| Theme router | `components/theme-router.tsx` |
| App wrapper | `components/app-wrapper.tsx` |
| API client | `lib/api/client.ts` |
| Services | `lib/api/services/*.ts` |
| API types | `lib/api/types.ts` |
| Encryption | `lib/utils/encrypt-decrypt.ts` |
| Theme API | `lib/api/theme-api.ts` |
| Stores | `stores/*.ts` |
| Custom hooks | `hooks/*.ts` |
| Static themes | `app/_themes/` |
| Block renderer | `components/renderers/block-renderer/` |
| UI components | `components/ui/` |
| Shared components | `components/shared/` |
| Feature components | `components/features/` |
| Cache constants | `lib/constants/cache.ts` |
| Type definitions | `types/*.ts` |
| Tailwind config | `tailwind.config.ts` |
| i18n config | `ni18n.config.ts` |

---

## Tech Stack

### Core
- **Next.js 16.0.10** - React framework
- **React 19.2.1** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling

### State Management
- **Zustand 5** - Client state
- **TanStack React Query 5** - Server state

### UI & Animation
- **Base UI** - Unstyled components
- **Radix UI** - Headless primitives
- **CVA** - Component variants
- **Framer Motion** - Animations
- **Lucide React** - Icons (561+)

### Forms & Validation
- **React Hook Form 7** - Form handling
- **Zod 4** - Schema validation

### Utilities
- **crypto-js** - Encryption
- **lz-string** - Compression
- **i18next / next-intl** - Internationalization
- **nanoid** - Unique IDs
- **fuse.js** - Fuzzy search
- **libphonenumber-js** - Phone parsing

### Carousels & Media
- **Swiper** - Carousel/slider
- **Embla Carousel** - Alternative carousel
- **Yet Another React Lightbox** - Image lightbox

### Notifications
- **React Hot Toast** - Toast notifications

---

## Common Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production
pnpm start

# Lint
pnpm lint

# Type check
npx tsc --noEmit
```

---

## Notes for Development

1. **Theme Detection:** Always check `legacy_theme` flag from shop profile to determine rendering mode
2. **API Encryption:** Sensitive endpoints require AES encryption - use `encryptData()` / `decryptData()`
3. **Multi-tenant:** Shop is identified via subdomain, custom domain, or `/merchant/[shopId]` route
4. **Cart Expiry:** Cart items expire after 24 hours (configured in cartStore)
5. **No Middleware:** Project does not use Next.js middleware - routing handled via next.config.ts rewrites
6. **Image Optimization:** Disabled (`unoptimized: true`) for static export capability

---

## External Backend API Endpoints

Base URL: `https://easybill.zatiq.tech`

```
POST /api/v1/live/profile           - Shop profile (encrypted)
POST /api/v1/live/inventories       - Products (encrypted)
POST /api/v1/live/filtered_categories - Categories (encrypted)
POST /api/v1/live/receipts          - Create order (encrypted)
GET  /api/v1/live/receipts/:id      - Receipt details (encrypted)
PATCH /api/v1/live/receipts/:id     - Update order
POST /api/v1/live/pendingPayment    - Process payment (encrypted)
GET  /api/v1/receipts/view/:id      - Receipt view (encrypted)
POST /api/v1/live/payment/verify/:txn - Verify payment
```

---

## Payment Gateways

Supported payment methods:
- **bKash** - Mobile payment
- **Nagad** - Mobile payment
- **AamarPay** - Payment gateway
- **COD** - Cash on delivery

Webhooks:
- `/api/webhooks/aamarpay/confirm`
- `/api/webhooks/nagad/confirm`
