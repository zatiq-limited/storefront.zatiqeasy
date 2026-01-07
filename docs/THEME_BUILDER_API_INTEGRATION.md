# Theme Builder API Integration Guide

## Overview

This document describes the API integration between the **Merchant Panel Theme Builder** and the **Storefront** for rendering custom themes.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MERCHANT PANEL                               │
│  Theme Builder (Zustand + React)                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Saves via: POST /api/v1/custom-themes/bulk-save             │   │
│  │ (Authenticated - Bearer token from merchant session)         │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      LARAVEL BACKEND API                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Merchant Endpoints (Authenticated):                          │   │
│  │   /api/v1/custom-themes                                      │   │
│  │   /api/v1/custom-themes/bulk-save                            │   │
│  │   /api/v1/custom-themes/pages/{pageType}                     │   │
│  │                                                               │   │
│  │ Storefront Endpoints (Public - shop_id based):               │   │
│  │   POST /api/v1/live/theme          ← Returns legacy_theme flag│  │
│  │   GET  /api/v1/live/custom-themes/full?shop_id={id}          │   │
│  │   GET  /api/v1/live/custom-themes/pages/{type}?shop_id={id}  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          STOREFRONT                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 1. Fetches shop profile → checks legacy_theme flag           │   │
│  │ 2. If legacy_theme=true → Static theme (Sellora, etc.)       │   │
│  │ 3. If legacy_theme=false → Theme Builder rendering           │   │
│  │    - Fetches theme.json (global settings/sections)           │   │
│  │    - Fetches page configs (home.json, products.json, etc.)   │   │
│  │    - Renders via PageRenderers (not BlockRenderer)           │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Backend API Endpoints Required

### 1. Theme Mode Detection (Existing)

**Endpoint:** `POST /api/v1/live/theme`

**Request:**
```json
{
  "shop_id": 47366
}
```

**Response:**
```json
{
  "success": true,
  "legacy_theme": false,
  "data": {
    "global_settings": {
      "colors": {
        "primary": "#3B82F6",
        "secondary": "#6B7280",
        "accent": "#f59e0b",
        "background": "#FFFFFF",
        "text": "#111827"
      },
      "fonts": {
        "heading": "Inter",
        "body": "Inter"
      }
    },
    "global_sections": {
      "announcement": {
        "enabled": true,
        "type": "announcement-bar-1",
        "settings": { ... },
        "blocks": []
      },
      "header": {
        "enabled": true,
        "type": "navbar-1",
        "settings": { ... },
        "blocks": []
      },
      "footer": {
        "enabled": true,
        "type": "footer-1",
        "settings": { ... },
        "blocks": []
      }
    }
  }
}
```

### 2. Full Theme with All Pages (NEW - Required)

**Endpoint:** `GET /api/v1/live/custom-themes/full`

**Query Parameters:**
- `shop_id` (required): The shop's ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "shop_id": 47366,
    "name": "My Custom Theme",
    "version": "1.0.0",
    "global_settings": {
      "colors": { ... },
      "fonts": { ... },
      "border_radius": { ... }
    },
    "global_sections": {
      "announcement": { "enabled": true, "type": "announcement-bar-1", "settings": { ... } },
      "header": { "enabled": true, "type": "navbar-1", "settings": { ... } },
      "footer": { "enabled": true, "type": "footer-1", "settings": { ... } }
    },
    "pages": [
      {
        "id": 1,
        "page_type": "home",
        "name": "Home",
        "slug": null,
        "is_enabled": true,
        "sections": [
          {
            "id": "hero-1-abc123",
            "type": "hero-1",
            "enabled": true,
            "settings": {
              "slides": [...],
              "auto_advance": true,
              "advance_interval": 5000
            },
            "blocks": []
          },
          {
            "id": "category-1-def456",
            "type": "category-1",
            "enabled": true,
            "settings": {
              "title": "Shop by Category",
              "categories": [...]
            },
            "blocks": []
          }
        ],
        "seo": { "title": "Home", "description": "..." }
      },
      {
        "id": 2,
        "page_type": "products",
        "name": "Products",
        "is_enabled": true,
        "sections": [
          {
            "id": "products-hero-1-ghi789",
            "type": "products-hero-1",
            "enabled": true,
            "settings": { ... }
          },
          {
            "id": "products-layout-1-jkl012",
            "type": "products-layout-1",
            "enabled": true,
            "settings": {
              "columns": 4,
              "card_type": "card-1",
              "show_sidebar": true,
              "sidebar_position": "left"
            }
          }
        ]
      }
      // ... other pages
    ]
  }
}
```

### 3. Get Specific Page (NEW - Required)

**Endpoint:** `GET /api/v1/live/custom-themes/pages/{pageType}`

**Path Parameters:**
- `pageType`: One of `home`, `products`, `productDetails`, `collections`, `collectionDetails`, `about`, `contact`, `privacyPolicy`, `checkout`

**Query Parameters:**
- `shop_id` (required): The shop's ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "page_type": "products",
    "name": "Products",
    "is_enabled": true,
    "sections": [
      {
        "id": "products-hero-1-abc123",
        "type": "products-hero-1",
        "enabled": true,
        "settings": {
          "background_color": "#F9FAFB",
          "title_color": "#111827",
          "show_breadcrumb": true
        },
        "blocks": []
      },
      {
        "id": "products-layout-1-def456",
        "type": "products-layout-1",
        "enabled": true,
        "settings": {
          "columns": 4,
          "gap": 6,
          "card_type": "card-1",
          "show_sidebar": true,
          "sidebar_position": "left",
          "sidebar_type": "products-sidebar-1",
          "pagination_type": "products-pagination-1",
          "products_per_page": 20,
          "show_search": true,
          "show_sort": true,
          "show_view_toggle": true,
          "default_view": "grid"
        },
        "blocks": []
      }
    ],
    "seo": {
      "title": "All Products",
      "description": "Browse our complete collection"
    }
  }
}
```

## Section Type Mapping

The theme builder uses these section types, which map directly to storefront page renderer components:

### Home Page Sections
| Theme Builder Type | Storefront Component |
|-------------------|---------------------|
| `hero-1` to `hero-4` | Homepage Hero (via home page) |
| `category-1` to `category-6` | Category Section |
| `static-banner-1` to `static-banner-4` | Static Banner |
| `badges-1` to `badges-3` | Trust Badges |
| `reviews-1` to `reviews-3` | Customer Reviews |
| `brands-1` to `brands-4` | Brand Logos |
| `special-offers-1` | Special Offers Slider |

### Products Page Sections
| Theme Builder Type | Storefront Component |
|-------------------|---------------------|
| `products-hero-1` | `ProductsHero1` |
| `products-hero-2` | `ProductsHero2` |
| `products-layout-1` | `ProductsLayout` (with settings) |

### Product Details Page Sections
| Theme Builder Type | Storefront Component |
|-------------------|---------------------|
| `product-breadcrumb-1/2` | Product Breadcrumb |
| `product-detail-1/2` | Product Detail |
| `customer-reviews-1/2` | Customer Reviews |
| `related-products-1/2` | Related Products |

### Collections Page Sections
| Theme Builder Type | Storefront Component |
|-------------------|---------------------|
| `collections-hero-1/2` | `CollectionsHero1/2` |
| `collections-grid-1/2` | `CollectionsGrid1/2` |

### Collection Details Page Sections
| Theme Builder Type | Storefront Component |
|-------------------|---------------------|
| `collection-breadcrumb-1/2` | Collection Breadcrumb |
| `collection-banner-1/2` | Collection Banner |
| `collection-products-1/2` | Collection Products |
| `collection-subcategories-1/2` | Collection Subcategories |

### Global Sections
| Theme Builder Type | Storefront Component |
|-------------------|---------------------|
| `announcement-bar-1/2/3` | Announcement Bar |
| `navbar-1/2/3/4` | Navigation Header |
| `footer-1/2` | Footer |

## Laravel Controller Implementation

Here's a sample implementation for the Laravel backend:

### CustomThemeLiveController.php

```php
<?php

namespace App\Http\Controllers\Api\V1\Live;

use App\Http\Controllers\Controller;
use App\Models\CustomTheme;
use App\Models\CustomThemePage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CustomThemeLiveController extends Controller
{
    /**
     * Get full theme with all pages for storefront
     */
    public function getFullTheme(Request $request): JsonResponse
    {
        $request->validate([
            'shop_id' => 'required|integer|exists:shops,id',
        ]);

        $theme = CustomTheme::with('pages')
            ->where('shop_id', $request->shop_id)
            ->first();

        if (!$theme) {
            return response()->json([
                'success' => false,
                'message' => 'No custom theme found for this shop',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $theme->id,
                'shop_id' => $theme->shop_id,
                'name' => $theme->name,
                'version' => $theme->version,
                'global_settings' => $theme->global_settings,
                'global_sections' => $theme->global_sections,
                'pages' => $theme->pages->map(fn($page) => [
                    'id' => $page->id,
                    'page_type' => $page->page_type,
                    'name' => $page->name,
                    'slug' => $page->slug,
                    'is_enabled' => $page->is_enabled,
                    'sections' => $page->sections ?? [],
                    'seo' => $page->seo,
                ]),
            ],
        ]);
    }

    /**
     * Get specific page config for storefront
     */
    public function getPage(Request $request, string $pageType): JsonResponse
    {
        $request->validate([
            'shop_id' => 'required|integer|exists:shops,id',
        ]);

        $theme = CustomTheme::where('shop_id', $request->shop_id)->first();

        if (!$theme) {
            return response()->json([
                'success' => false,
                'message' => 'No custom theme found',
            ], 404);
        }

        $page = CustomThemePage::where('custom_theme_id', $theme->id)
            ->where('page_type', $pageType)
            ->first();

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => "Page '{$pageType}' not found",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $page->id,
                'page_type' => $page->page_type,
                'name' => $page->name,
                'slug' => $page->slug,
                'is_enabled' => $page->is_enabled,
                'sections' => $page->sections ?? [],
                'seo' => $page->seo,
            ],
        ]);
    }
}
```

### Routes (api.php)

```php
// Live/Public endpoints for storefront (no auth required)
Route::prefix('live')->group(function () {
    // Existing endpoints
    Route::post('/theme', [ThemeLiveController::class, 'getTheme']);
    Route::post('/profile', [ProfileLiveController::class, 'getProfile']);
    Route::post('/inventories', [InventoryLiveController::class, 'getInventories']);
    Route::post('/filtered_categories', [CategoryLiveController::class, 'getCategories']);

    // NEW: Custom theme endpoints for theme builder
    Route::get('/custom-themes/full', [CustomThemeLiveController::class, 'getFullTheme']);
    Route::get('/custom-themes/pages/{pageType}', [CustomThemeLiveController::class, 'getPage']);
});
```

## Storefront Integration

### Update theme-api.ts

The storefront's `lib/api/theme-api.ts` should be updated to use the new endpoints:

```typescript
// lib/api/theme-api.ts

const LIVE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://easybill.zatiq.tech/api/v1/live';

export interface ThemeFullResponse {
  success: boolean;
  data: {
    id: number;
    shop_id: number;
    name: string;
    version: string;
    global_settings: GlobalSettings;
    global_sections: GlobalSections;
    pages: PageData[];
  };
}

export interface PageResponse {
  success: boolean;
  data: PageData;
}

/**
 * Get full theme with all pages for storefront
 */
export async function getFullTheme(shopId: number): Promise<ThemeFullResponse['data'] | null> {
  try {
    const response = await fetch(
      `${LIVE_API_URL}/custom-themes/full?shop_id=${shopId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Device-Type': 'Web',
          'Application-Type': 'Online_Shop',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch theme: ${response.status}`);
    }

    const data: ThemeFullResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching full theme:', error);
    return null;
  }
}

/**
 * Get specific page config for storefront
 */
export async function getPageConfig(
  shopId: number,
  pageType: string
): Promise<PageData | null> {
  try {
    const response = await fetch(
      `${LIVE_API_URL}/custom-themes/pages/${pageType}?shop_id=${shopId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Device-Type': 'Web',
          'Application-Type': 'Online_Shop',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch page: ${response.status}`);
    }

    const data: PageResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching ${pageType} page:`, error);
    return null;
  }
}
```

### Update API Routes

Update the Next.js API routes to proxy to the backend:

```typescript
// app/api/storefront/v1/page/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getShopIdFromRequest } from '@/lib/utils/shop-identifier';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://easybill.zatiq.tech/api/v1/live';

export async function GET(request: NextRequest) {
  try {
    const shopId = await getShopIdFromRequest(request);

    if (!shopId) {
      return NextResponse.json(
        { success: false, error: 'Shop not found' },
        { status: 404 }
      );
    }

    const response = await fetch(
      `${API_URL}/custom-themes/pages/products?shop_id=${shopId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Device-Type': 'Web',
          'Application-Type': 'Online_Shop',
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products page config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page config' },
      { status: 500 }
    );
  }
}
```

## Data Flow Summary

```
1. User visits storefront
   │
2. RootLayout fetches shop profile
   │
   ├── legacy_theme = true  → Render Sellora/Aurora/etc.
   │
   └── legacy_theme = false → Theme Builder Mode
       │
       3. Fetch /api/v1/live/theme
       │   → Returns global_settings + global_sections
       │
       4. ThemeLayout renders:
       │   - Announcement bar (from global_sections.announcement)
       │   - Header (from global_sections.header)
       │   - {children}
       │   - Footer (from global_sections.footer)
       │
       5. Page Component fetches page-specific config:
       │   - Homepage: /api/v1/live/custom-themes/pages/home
       │   - Products: /api/v1/live/custom-themes/pages/products
       │   - etc.
       │
       6. PageRenderer (e.g., ProductsPageRenderer) renders sections:
          │
          For each section in page.sections:
            - section.type === "products-hero-1" → <ProductsHero1 />
            - section.type === "products-layout-1" → <ProductsLayout />
            - etc.
```

## Checklist

### Backend (Laravel)

- [ ] Create `CustomThemeLiveController`
- [ ] Add route `GET /api/v1/live/custom-themes/full`
- [ ] Add route `GET /api/v1/live/custom-themes/pages/{pageType}`
- [ ] Ensure no authentication required (shop_id based access)
- [ ] Add proper CORS headers for storefront domain
- [ ] Test endpoints with sample shop data

### Storefront (Next.js)

- [ ] Update `lib/api/theme-api.ts` with new functions
- [ ] Update/create API routes in `app/api/storefront/v1/`
- [ ] Update hooks (`useProductsPage`, `useHomepage`, etc.)
- [ ] Test theme builder rendering mode
- [ ] Verify all section types render correctly

### Theme Builder (Merchant Panel)

- [ ] Ensure section types match storefront expectations
- [ ] Test save/publish flow
- [ ] Verify data format consistency

## Testing

1. Create a theme in the merchant panel with all sections
2. Save/publish the theme
3. Toggle `legacy_theme` to `false` for the shop
4. Visit the storefront
5. Verify each page renders correctly with the custom theme
