# Theme Routing System Documentation

## Overview

The storefront supports two distinct rendering systems that are automatically selected based on the `legacy_theme` flag in the shop profile:

| Mode | `legacy_theme` | Rendering | Description |
|------|----------------|-----------|-------------|
| **Legacy Static Themes** | `true` | Pre-built React components | Hardcoded themes (Basic, Aurora, Luxura, Premium, Sellora) |
| **Theme Builder** | `false` | Dynamic JSON rendering | V3.0 Schema with BlockRenderer components |

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         REQUEST FLOW                                │
└─────────────────────────────────────────────────────────────────────┘

User Request (URL)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Root Layout (app/layout.tsx)                                      │
│  ├─ Server: getShopIdentifier() - Extract shop from hostname       │
│  ├─ Server: shopService.getProfile() - Fetch shop with legacy_theme│
│  ├─ ShopProvider - Sync shopDetails to Zustand store               │
│  └─ AppWrapper - Route-based conditional wrapping                  │
└─────────────────────────────────────────────────────────────────────┘
        │
        ├──────────────────────┬──────────────────────┐
        ▼                      ▼
┌──────────────────┐  ┌──────────────────────────────┐
│ Root Route (/)   │  │ Merchant Route (/merchant/[id])│
│                  │  │                              │
│ AppWrapper:      │  │ AppWrapper:                  │
│ ✓ ThemeRouter    │  │ ✗ No wrapping               │
│ ✓ ThemeLayout    │  │ (Merchant layout handles)    │
└──────────────────┘  └──────────────────────────────┘
        │                      │
        ▼                      ▼
┌──────────────────┐  ┌──────────────────────────────┐
│ ThemeRouter      │  │ Merchant Layout              │
│ - Checks route   │  │ - Checks legacy_theme        │
│ - Checks legacy  │  │ - Wraps accordingly          │
└──────────────────┘  └──────────────────────────────┘
        │                      │
        └──────────┬───────────┘
                   ▼
        ┌──────────────────────┐
        │ ThemeRouter          │
        │                      │
        │ legacy=true:         │
        │  → Static component  │
        │                      │
        │ legacy=false:        │
        │  → children (page.tsx)│
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ page.tsx             │
        │                      │
        │ legacy=true:         │
        │  → null (bypass)     │
        │                      │
        │ legacy=false:        │
        │  → BlockRenderer     │
        └──────────────────────┘
```

## Component Responsibilities

### 1. Root Layout (`app/layout.tsx`)

**Location:** `app/layout.tsx`

**Responsibilities:**
- Extract shop identifier from hostname (domain/subdomain)
- Fetch shop profile with `legacy_theme` flag
- Provide shop context via `ShopProvider`
- Route-based wrapping via `AppWrapper`

**Key Code:**
```typescript
// Server-side shop identification
const shopIdentifier = await getShopIdentifier();
const shopProfile = await shopService.getProfile(shopIdentifier);

// Client-side conditional wrapping
<ShopProvider initialShopData={shopProfile}>
  <AppWrapper>{children}</AppWrapper>
</ShopProvider>
```

### 2. AppWrapper (`components/app-wrapper.tsx`)

**Location:** `components/app-wrapper.tsx`

**Responsibilities:**
- Check if current route is a merchant route (`/merchant/*`)
- For merchant routes: Pass through (merchant layout handles wrapping)
- For other routes: Wrap with `ThemeRouter` + `ThemeLayout`

**Key Code:**
```typescript
const isMerchantRoute = pathname?.startsWith("/merchant/");

if (isMerchantRoute) {
  return <>{children}</>; // No wrapping
}

return (
  <ThemeRouter>
    <ThemeLayout>{children}</ThemeLayout>
  </ThemeRouter>
);
```

### 3. ThemeRouter (`components/theme-router.tsx`)

**Location:** `components/theme-router.tsx`

**Responsibilities:**
- Check `legacy_theme` flag from Zustand store
- Detect if current route is a homepage
- Route to appropriate rendering system

**Logic Flow:**
```typescript
const isLegacyTheme = shopDetails?.legacy_theme ?? true;
const isHomepageRoute = pathname === "/" || /^\/merchant\/[^/]+$/.test(pathname);

// Case 1: Legacy mode + Homepage → Render static theme
if (isLegacyTheme && isHomepageRoute) {
  return <ConditionalThemeHandler><StaticThemeComponent /></ConditionalThemeHandler>;
}

// Case 2: Legacy mode + Non-homepage → Wrap with theme context
if (isLegacyTheme) {
  return <ConditionalThemeHandler>{children}</ConditionalThemeHandler>;
}

// Case 3: Theme Builder mode → Pass through
return <>{children}</>;
```

### 4. ThemeLayout (`app/_layouts/theme/layout.tsx`)

**Location:** `app/_layouts/theme/layout.tsx`

**Responsibilities:**
- Render theme builder global sections (announcement, header, footer)
- Only renders when `legacy_theme === false`
- Wraps page content

**Key Code:**
```typescript
const shouldRenderThemeBuilderHeader = !isLegacyTheme;

{shouldRenderThemeBuilderHeader && (
  <>
    <BlockRenderer block={announcementBlock} />
    <BlockRenderer block={headerBlock} />
    {children}
    <BlockRenderer block={footerBlock} />
  </>
)}
```

### 5. Page Components

**Locations:**
- `app/page.tsx` - Root homepage
- `app/merchant/[shopId]/page.tsx` - Merchant homepage

**Responsibilities:**
- Check `legacy_theme` and route type
- Return `null` when `ThemeRouter` handles rendering
- Render BlockRenderer content for theme builder mode

**Key Code:**
```typescript
const isLegacyTheme = shopDetails?.legacy_theme ?? true;
const isHomepageRoute = pathname === "/" || /^\/merchant\/[^/]+$/.test(pathname);

// Legacy mode + Homepage: ThemeRouter handles it
if (isLegacyTheme && isHomepageRoute) {
  return null;
}

// Theme Builder mode: Render blocks
return <main>{sections.map(s => <BlockRenderer block={s.block} />)}</main>;
```

## Shop Identification

### Methods

| Method | ShopIdentifier Object | Example URL | Detection |
|--------|---------------------|-------------|-----------|
| Subdomain | `{ subdomain: "techyboy.sellbd.shop" }` | `http://techyboy.sellbd.shop/` | Hostname matches pattern |
| Custom Domain | `{ domain: "tofa.com.bd" }` | `http://tofa.com.bd/` | Non-localhost hostname |
| Localhost (Dev) | `{ shop_id: "2" }` | `http://localhost:3000/` | `NEXT_PUBLIC_DEV_SHOP_ID` env var |
| Merchant Route | N/A (from URL) | `http://localhost:3000/merchant/2` | URL path parsing |

### Shop Identifier Utility

**Location:** `lib/utils/shop-identifier.ts`

```typescript
export async function getShopIdentifier(): Promise<ShopIdentifier> {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // Check for subdomain
  if (host.includes(".zatiqeasy.com") || /* other patterns */) {
    return { subdomain: host };
  }

  // Check for localhost with DEV_SHOP_ID
  if (host.includes("localhost")) {
    const devShopId = process.env.NEXT_PUBLIC_DEV_SHOP_ID;
    if (devShopId) return { shop_id: devShopId };
  }

  // Custom domain
  return { domain: host };
}
```

## Route Behavior Matrix

| Route | `legacy_theme` | ThemeRouter | ThemeLayout | page.tsx | Final Output |
|-------|----------------|-------------|------------|----------|--------------|
| `/` | `true` | Static Theme | Bypassed | `null` | Static Theme Component |
| `/` | `false` | Children | Header/Footer | BlockRenderer | Theme Builder |
| `/merchant/2` | `true` | Static Theme | Bypassed | `null` | Static Theme Component |
| `/merchant/2` | `false` | Children | Header/Footer | BlockRenderer | Theme Builder |
| `/merchant/2/products` | `true` | Wrapped with Context | Bypassed | Page Content | Static + Page |
| `/merchant/2/products` | `false` | Children | Header/Footer | Page Content | Theme Builder + Page |

## Static Theme Components

| Theme Name | Component | Location |
|------------|-----------|----------|
| Basic | `BasicHomePage` | `app/_themes/basic/index.tsx` |
| Aurora | `AuroraHomePage` | `app/_themes/aurora/index.tsx` |
| Luxura | `LuxuraHomePage` | `app/_themes/luxura/index.tsx` |
| Premium | `PremiumHomePage` | `app/_themes/premium/index.tsx` |
| Sellora | `SelloraHomePage` | `app/_themes/sellora/index.tsx` |

## Theme Builder Data Structure

### Homepage Data
```typescript
interface HomepageData {
  data: {
    sections: Array<{
      id: string;
      enabled: boolean;
      blocks: Array<{
        type: string;  // e.g., "hero", "product-grid", "banner"
        data: Record<string, unknown>;
      }>;
    }>;
  };
}
```

### Global Sections (Theme Data)
```typescript
interface ThemeData {
  data: {
    global_sections: {
      announcement?: ThemeSection;
      header?: ThemeSection;
      announcement_after_header?: ThemeSection;
      footer?: ThemeSection;
    };
  };
}

interface ThemeSection {
  enabled: boolean;
  blocks: Block[];
}
```

## Zustand Store Integration

### ShopProfile Type
**Location:** `types/shop.types.ts`

```typescript
export interface ShopProfile {
  id: string;
  shop_name: string;
  shop_uuid: string;
  legacy_theme?: boolean;  // KEY FLAG
  shop_theme?: {
    theme_name: string;  // "Basic", "Aurora", etc.
  };
  // ... other fields
}
```

### Shop Store Selector
**Location:** `stores/shopStore.ts`

```typescript
export const selectIsLegacyTheme = (state: ShopState & ShopActions) =>
  state.shopDetails?.legacy_theme ?? true;  // Default: true
```

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_DEV_SHOP_ID` | Shop ID for localhost development | `NEXT_PUBLIC_DEV_SHOP_ID=2` |
| `NEXT_PUBLIC_APP_URL` | Base URL for metadata | `NEXT_PUBLIC_APP_URL=http://localhost:3000` |
| `NEXT_PUBLIC_SYSTEM_ENV` | System mode | `NEXT_PUBLIC_SYSTEM_ENV=STANDALONE` |

## Debug Logging

Each component logs its state for debugging:

```typescript
// Root Layout
console.log("RootLayout - shopIdentifier:", shopIdentifier);

// ThemeRouter
console.log("ThemeRouter - pathname:", pathname, "isLegacyTheme:", isLegacyTheme);

// ThemeLayout
console.log("ThemeLayout - isLegacyTheme:", isLegacyTheme);

// page.tsx
console.log("page.tsx - pathname:", pathname, "isLegacyTheme:", isLegacyTheme);
```

## Migration Guide

### Adding a New Static Theme

1. Create theme component in `app/_themes/[theme-name]/index.tsx`
2. Export as named component: `export function ThemeNameHomePage()`
3. Add to `STATIC_THEME_COMPONENTS` in `components/theme-router.tsx`:
```typescript
const STATIC_THEME_COMPONENTS = {
  // ... existing themes
  ThemeName: ThemeNameHomePage,
};
```

### Adding a New Block Type

1. Create block renderer in `components/renderers/blocks/[block-type].tsx`
2. Register in `components/renderers/block-renderer.tsx`
3. Add block type to schema

## Troubleshooting

### Issue: Header/footer appearing twice
**Cause:** Double wrapping by root layout and merchant layout
**Solution:** `AppWrapper` checks for merchant routes and skips wrapping

### Issue: Static theme showing for `legacy_theme: false`
**Cause:** `page.tsx` or `ThemeRouter` not checking `legacy_theme` correctly
**Solution:** Ensure both components check `shopDetails?.legacy_theme`

### Issue: Shop not loading on localhost
**Cause:** Missing `NEXT_PUBLIC_DEV_SHOP_ID` environment variable
**Solution:** Set `NEXT_PUBLIC_DEV_SHOP_ID=2` in `.env.local`

### Issue: Theme not switching after shop change
**Cause:** Zustand store not updating with new `shopDetails`
**Solution:** Check `ShopProvider` useEffect and `setShopDetails` call

## Files Modified/Created

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with shop identification |
| `app/_layouts/theme/layout.tsx` | Theme builder header/footer |
| `components/app-wrapper.tsx` | Route-based conditional wrapping |
| `components/theme-router.tsx` | Theme routing logic |
| `app/page.tsx` | Root homepage |
| `app/merchant/[shopId]/layout.tsx` | Merchant layout |
| `app/merchant/[shopId]/page.tsx` | Merchant homepage |
| `lib/utils/shop-identifier.ts` | Shop identification utility |
| `types/shop.types.ts` | ShopProfile type with `legacy_theme` |
| `stores/shopStore.ts` | Shop state management |

## Related Documentation

- [PROJECT_SUMMARY.md](../PROJECT_SUMMARY.md) - Complete project overview
- [CLAUDE.md](../.claude/CLAUDE.md) - Project instructions for Claude
- Next.js 16 App Router: https://nextjs.org/docs/app
- Zustand: https://zustand-demo.pmnd.rs/
