# Theme Builder API Documentation

## Overview

The Theme Builder is a comprehensive page builder system for the Zatiq eCommerce platform that allows merchants to create custom storefront pages using predefined section templates. This system replaces the legacy theme system while maintaining backward compatibility.

### Key Features

- **Single Theme Per Shop**: Each shop has exactly one custom theme (hasOne relationship)
- **Immediate Save**: Changes are saved immediately (no draft mode)
- **System Templates**: Section templates are managed by Zatiq admins only
- **Version History**: Last 10 versions are kept for rollback capability
- **S3 Asset Storage**: All uploaded assets are stored on Amazon S3
- **Caching**: Aggressive caching with tag-based invalidation

---

## Architecture

### Database Schema

```
┌─────────────────┐       ┌──────────────────────┐
│     shops       │       │   custom_themes      │
│─────────────────│       │──────────────────────│
│ id              │◄──────│ shop_id (UNIQUE, FK) │
│ legacy_theme    │       │ name                 │
│ ...             │       │ version              │
└─────────────────┘       │ global_settings      │
        │                 │ global_sections      │
        │                 │ templates            │
        │                 └──────────┬───────────┘
        │                            │
        │                            │ 1:N
        │                            ▼
        │                 ┌──────────────────────┐
        │                 │ custom_theme_pages   │
        │                 │──────────────────────│
        │                 │ custom_theme_id (FK) │
        │                 │ page_type            │
        │                 │ name                 │
        │                 │ sections             │
        │                 │ seo                  │
        │                 │ is_enabled           │
        │                 └──────────────────────┘
        │
        │                 ┌──────────────────────┐
        │       1:N       │ custom_theme_versions│
        │                 │──────────────────────│
        │                 │ custom_theme_id (FK) │
        │                 │ version              │
        │                 │ snapshot (full data) │
        │                 │ change_summary       │
        │                 │ created_by           │
        │                 └──────────────────────┘
        │
        │       1:N       ┌──────────────────────┐
        └────────────────►│    theme_assets      │
                          │──────────────────────│
                          │ shop_id (FK)         │
                          │ type (image/font)    │
                          │ name                 │
                          │ url (S3 URL)         │
                          │ metadata             │
                          └──────────────────────┘

┌─────────────────────────────┐
│ theme_section_templates     │  (System-wide, no shop relation)
│─────────────────────────────│
│ type (UNIQUE)               │
│ category                    │
│ name                        │
│ default_settings            │
│ default_blocks              │
│ schema                      │
└─────────────────────────────┘
```

### Service Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Controllers                          │
├─────────────────┬─────────────────┬─────────────────────────┤
│ CustomTheme     │ CustomThemePage │ ThemeSectionTemplate    │
│ Controller      │ Controller      │ Controller              │
├─────────────────┴─────────────────┴─────────────────────────┤
│                         Services                            │
├─────────────────┬─────────────────┬─────────────────────────┤
│ ThemeService    │ ThemeVersion    │ ThemeDataTransformer    │
│ (CRUD, Cache)   │ Service         │ (Validation)            │
├─────────────────┴─────────────────┴─────────────────────────┤
│                         Models                              │
├─────────────────┬─────────────────┬─────────────────────────┤
│ CustomTheme     │ CustomThemePage │ ThemeSectionTemplate    │
│ ThemeAsset      │ CustomTheme     │                         │
│                 │ Version         │                         │
├─────────────────┴─────────────────┴─────────────────────────┤
│                        Database                             │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

```
Request → Controller → Policy (Auth) → Service → Model → Database
                                          ↓
                                       Cache
                                          ↓
Response ← Resource ← Controller ← Service
```

---

## Caching Strategy

### Cache Keys

| Cache Key | TTL | Description |
|-----------|-----|-------------|
| `custom_theme_{shop_id}` | 24 hours | Full theme data |
| `custom_theme_page_{shop_id}_{page_type}` | 24 hours | Individual page |
| `theme_section_templates` | 1 week | All section templates |
| `theme_section_templates_{category}` | 1 week | Templates by category |

### Cache Tags

All theme-related caches use the tag: `ctag_custom_theme_shop_{shop_id}`

This allows flushing all caches for a shop with a single operation.

### Cache Invalidation

Cache is automatically invalidated via Observers:

**CustomThemeObserver**:
- `updated`: Clears theme cache and flushes all shop theme tags
- `deleted`: Same as updated

**CustomThemePageObserver**:
- `saved`: Clears specific page cache and full theme cache
- `deleted`: Same as saved

### Cache Flow Example

```
1. First Request: GET /api/v1/custom-themes
   → Cache MISS
   → Query database
   → Store in cache with tag
   → Return response

2. Second Request: GET /api/v1/custom-themes
   → Cache HIT
   → Return cached data (no DB query)

3. Update Request: PUT /api/v1/custom-themes
   → Update database
   → Observer triggers
   → Flush cache tag (all related caches)

4. Next Request: GET /api/v1/custom-themes
   → Cache MISS (was invalidated)
   → Query database
   → Store in cache
   → Return response
```

---

## S3 Asset Storage

### Configuration

Assets are stored on S3 with the following structure:

```
s3://bucket-name/
└── theme-assets/
    └── {shop_id}/
        ├── image/
        │   └── {uuid}.{ext}
        ├── font/
        │   └── {uuid}.{ext}
        └── icon/
            └── {uuid}.{ext}
```

### Metadata Storage

When an asset is uploaded, the following metadata is stored:

```json
{
  "s3_path": "theme-assets/123/image/abc-def-123.jpg",
  "file_size": 245678,
  "mime_type": "image/jpeg",
  "original_name": "hero-banner.jpg",
  "extension": "jpg",
  "width": 1920,
  "height": 1080
}
```

For external URLs (not uploaded):
```json
{
  "external": true
}
```

### Asset Deletion

When an asset is deleted:
1. Check if `s3_path` exists in metadata
2. Check if NOT marked as `external`
3. Delete file from S3
4. Delete database record

---

## API Endpoints

### Base URL

All authenticated endpoints: `/api/v1/custom-themes`
Public storefront endpoints: `/api/v1/storefront`

### Authentication

All `/api/v1/custom-themes/*` routes require authentication via Bearer token.

```
Authorization: Bearer {token}
```

---

## Theme Management

### Get Shop's Theme

Retrieves the current theme for the authenticated user's shop.

```
GET /api/v1/custom-themes
```

**Response (200 - Theme exists):**
```json
{
  "success": true,
  "message": "Theme retrieved successfully",
  "data": {
    "id": 1,
    "shop_id": 123,
    "name": "My Store Theme",
    "version": "1.0.3",
    "global_settings": {
      "colors": {
        "primary": "#3B82F6",
        "secondary": "#6B7280",
        "accent": "#f59e0b",
        "background": "#FFFFFF",
        "text": "#111827",
        "error": "#ef4444",
        "success": "#10b981"
      },
      "fonts": {
        "heading": "Inter",
        "body": "Inter"
      },
      "border_radius": {
        "small": "0.25rem",
        "medium": "0.5rem",
        "large": "1rem",
        "full": "9999px"
      },
      "component_styles": {
        "product_card": {
          "image_ratio": "3:4",
          "show_second_image": true,
          "show_quick_add": true,
          "show_wishlist": true,
          "show_rating": true
        },
        "buttons": {
          "primary_style": "filled",
          "border_radius": "medium"
        }
      }
    },
    "global_sections": {
      "announcement": {
        "enabled": true,
        "type": "announcement-bar-1",
        "settings": {
          "text": "Free shipping on orders over $50!",
          "background_color": "#3B82F6",
          "text_color": "#FFFFFF"
        }
      },
      "header": {
        "enabled": true,
        "type": "navbar-1",
        "settings": {
          "sticky": true,
          "show_search": true,
          "show_cart": true
        }
      },
      "footer": {
        "enabled": true,
        "type": "footer-1",
        "settings": {}
      }
    },
    "templates": {
      "home": "default",
      "products": "grid",
      "productDetails": "default"
    },
    "created_at": "2025-12-31T10:00:00.000000Z",
    "updated_at": "2025-12-31T12:30:00.000000Z"
  }
}
```

**Response (200 - No theme):**
```json
{
  "success": true,
  "message": "No theme found",
  "data": null
}
```

---

### Create Theme

Creates a new theme for the shop. Only one theme per shop is allowed.

```
POST /api/v1/custom-themes
```

**Request Body:**
```json
{
  "name": "My Store Theme",
  "global_settings": {
    "colors": {
      "primary": "#3B82F6",
      "secondary": "#6B7280"
    },
    "fonts": {
      "heading": "Poppins",
      "body": "Open Sans"
    }
  },
  "global_sections": {
    "header": {
      "enabled": true,
      "type": "navbar-1",
      "settings": {
        "sticky": true
      }
    }
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Theme created successfully",
  "data": {
    "id": 1,
    "shop_id": 123,
    "name": "My Store Theme",
    "version": "1.0.0",
    "global_settings": {
      "colors": {
        "primary": "#3B82F6",
        "secondary": "#6B7280",
        "accent": "#f59e0b",
        "background": "#FFFFFF",
        "text": "#111827",
        "error": "#ef4444",
        "success": "#10b981"
      },
      "fonts": {
        "heading": "Poppins",
        "body": "Open Sans"
      },
      "border_radius": {
        "small": "0.25rem",
        "medium": "0.5rem",
        "large": "1rem",
        "full": "9999px"
      },
      "component_styles": {}
    },
    "global_sections": {
      "header": {
        "enabled": true,
        "type": "navbar-1",
        "settings": {
          "sticky": true
        }
      }
    },
    "templates": {},
    "created_at": "2025-12-31T10:00:00.000000Z",
    "updated_at": "2025-12-31T10:00:00.000000Z"
  }
}
```

**Response (422 - Theme exists):**
```json
{
  "success": false,
  "message": "Theme already exists for this shop"
}
```

---

### Update Theme

Updates the shop's theme global settings and/or sections.

```
PUT /api/v1/custom-themes
```

**Request Body:**
```json
{
  "name": "Updated Theme Name",
  "global_settings": {
    "colors": {
      "primary": "#10B981",
      "secondary": "#6B7280",
      "accent": "#f59e0b",
      "background": "#FFFFFF",
      "text": "#111827"
    },
    "fonts": {
      "heading": "Roboto",
      "body": "Roboto"
    }
  },
  "global_sections": {
    "announcement": {
      "enabled": true,
      "type": "announcement-bar-1",
      "settings": {
        "text": "Summer Sale - 20% Off!",
        "background_color": "#10B981"
      }
    },
    "header": {
      "enabled": true,
      "type": "navbar-2",
      "settings": {
        "sticky": true,
        "transparent_on_home": true
      }
    },
    "footer": {
      "enabled": true,
      "type": "footer-2",
      "settings": {}
    }
  },
  "templates": {
    "home": "default",
    "products": "list"
  },
  "create_version": true,
  "version_summary": "Changed primary color and header style"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | No | Theme display name |
| global_settings | object | No | Global style settings |
| global_sections | object | No | Header, footer, announcement |
| templates | object | No | Page type to template mappings |
| create_version | boolean | No | Create version snapshot (default: false) |
| version_summary | string | No | Description for version history |

**Response (200):**
```json
{
  "success": true,
  "message": "Theme updated successfully",
  "data": {
    "id": 1,
    "shop_id": 123,
    "name": "Updated Theme Name",
    "version": "1.0.1",
    "global_settings": { ... },
    "global_sections": { ... },
    "templates": { ... },
    "created_at": "2025-12-31T10:00:00.000000Z",
    "updated_at": "2025-12-31T14:00:00.000000Z"
  }
}
```

---

### Delete Theme

Soft deletes the shop's theme.

```
DELETE /api/v1/custom-themes
```

**Response (200):**
```json
{
  "success": true,
  "message": "Theme deleted successfully",
  "data": []
}
```

---

### Bulk Save Theme (Recommended)

**This is the primary endpoint used by the theme builder.** It performs an atomic transaction that saves the theme global settings and all pages in a single request.

```
POST /api/v1/custom-themes/bulk-save
```

**Request Body:**
```json
{
  "name": "My Store Theme",
  "global_settings": {
    "colors": {
      "primary": "#3B82F6",
      "secondary": "#6B7280",
      "accent": "#f59e0b",
      "background": "#FFFFFF",
      "text": "#111827",
      "error": "#ef4444",
      "success": "#10b981"
    },
    "fonts": {
      "heading": "Inter",
      "body": "Inter"
    },
    "border_radius": {
      "small": "0.25rem",
      "medium": "0.5rem",
      "large": "1rem",
      "full": "9999px"
    },
    "component_styles": {}
  },
  "global_sections": {
    "announcement": {
      "enabled": true,
      "type": "announcement-bar-1",
      "settings": {}
    },
    "header": {
      "enabled": true,
      "type": "navbar-1",
      "settings": {}
    },
    "footer": {
      "enabled": true,
      "type": "footer-1",
      "settings": {}
    }
  },
  "pages": [
    {
      "page_type": "home",
      "name": "Home",
      "is_enabled": true,
      "sections": [
        {
          "id": "hero_abc123",
          "type": "hero-1",
          "enabled": true,
          "settings": {
            "title": "Welcome"
          },
          "blocks": []
        }
      ]
    },
    {
      "page_type": "products",
      "name": "Products",
      "is_enabled": true,
      "sections": []
    }
  ],
  "create_version": false,
  "version_summary": "Updated homepage hero section"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | No | Theme display name |
| global_settings | object | No | Global style settings |
| global_sections | object | No | Header, footer, announcement |
| pages | array | No | Array of page data to save |
| create_version | boolean | No | **Key flag**: Create version snapshot (default: false) |
| version_summary | string | No | Description for version history |

#### Save vs Publish (create_version flag)

The `create_version` flag determines the difference between "Save" and "Publish" operations:

| Operation | `create_version` | Use Case |
|-----------|------------------|----------|
| **Save** | `false` | Quick saves during active editing. No version history entry created. |
| **Publish** | `true` | When ready to go live. Creates a rollback point in version history. |

**Frontend Implementation:**
```javascript
// Save button (quick save, no version)
const saveTheme = () => bulkSave({ ...themeData, create_version: false });

// Publish button (create version for rollback)
const publishTheme = () => bulkSave({
  ...themeData,
  create_version: true,
  version_summary: "Published from theme builder"
});
```

**Response (200):**
```json
{
  "success": true,
  "message": "Theme saved successfully",
  "data": {
    "id": 1,
    "shop_id": 123,
    "name": "My Store Theme",
    "version": "1.0.4",
    "global_settings": { ... },
    "global_sections": { ... },
    "templates": { ... },
    "pages": [
      {
        "id": 1,
        "page_type": "home",
        "name": "Home",
        "sections": [ ... ]
      }
    ],
    "created_at": "2025-12-31T10:00:00.000000Z",
    "updated_at": "2025-12-31T18:00:00.000000Z"
  }
}
```

**Note:** This endpoint automatically creates the theme if it doesn't exist, making it ideal for the initial setup flow.

---

### Get Full Theme (with Pages)

Retrieves the theme with all enabled pages included.

```
GET /api/v1/custom-themes/full
```

**Response (200):**
```json
{
  "success": true,
  "message": "Theme retrieved successfully",
  "data": {
    "id": 1,
    "shop_id": 123,
    "name": "My Store Theme",
    "version": "1.0.3",
    "global_settings": { ... },
    "global_sections": { ... },
    "templates": { ... },
    "pages": [
      {
        "id": 1,
        "page_type": "home",
        "name": "Home",
        "slug": null,
        "is_enabled": true,
        "sections": [ ... ],
        "seo": { ... }
      },
      {
        "id": 2,
        "page_type": "products",
        "name": "Products",
        "slug": null,
        "is_enabled": true,
        "sections": [ ... ],
        "seo": { ... }
      }
    ],
    "created_at": "2025-12-31T10:00:00.000000Z",
    "updated_at": "2025-12-31T14:00:00.000000Z"
  }
}
```

---

## Version Management

### Get Version History

Retrieves the last 10 versions of the theme.

```
GET /api/v1/custom-themes/versions
```

**Response (200):**
```json
{
  "success": true,
  "message": "Versions retrieved successfully",
  "data": [
    {
      "id": 3,
      "version": "1.0.3",
      "change_summary": "Updated header to sticky",
      "created_by": {
        "id": 1,
        "name": "John Doe"
      },
      "created_at": "2025-12-31T14:00:00.000000Z"
    },
    {
      "id": 2,
      "version": "1.0.2",
      "change_summary": "Changed primary color",
      "created_by": {
        "id": 1,
        "name": "John Doe"
      },
      "created_at": "2025-12-31T12:00:00.000000Z"
    },
    {
      "id": 1,
      "version": "1.0.1",
      "change_summary": "Initial customization",
      "created_by": {
        "id": 1,
        "name": "John Doe"
      },
      "created_at": "2025-12-31T10:00:00.000000Z"
    }
  ]
}
```

---

### Rollback to Version

Restores the theme to a previous version state.

```
POST /api/v1/custom-themes/rollback/{versionId}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Theme rolled back successfully",
  "data": {
    "id": 1,
    "shop_id": 123,
    "name": "My Store Theme",
    "version": "1.0.2",
    "global_settings": { ... },
    "global_sections": { ... },
    "templates": { ... },
    "created_at": "2025-12-31T10:00:00.000000Z",
    "updated_at": "2025-12-31T15:00:00.000000Z"
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "Version not found"
}
```

---

## Page Management

### List All Pages

Retrieves all pages for the theme.

```
GET /api/v1/custom-themes/pages
```

**Query Parameters:**
- `filter[page_type]`: Filter by page type
- `filter[is_enabled]`: Filter by enabled status (0 or 1)
- `sort`: Sort by field (e.g., `-created_at`, `name`)

**Response (200):**
```json
{
  "success": true,
  "message": "Pages retrieved successfully",
  "data": [
    {
      "id": 1,
      "page_type": "home",
      "name": "Home",
      "slug": null,
      "is_enabled": true,
      "sections": [...],
      "seo": {
        "title": "Welcome to My Store",
        "description": "Shop the latest products"
      },
      "created_at": "2025-12-31T10:00:00.000000Z",
      "updated_at": "2025-12-31T10:00:00.000000Z"
    },
    {
      "id": 2,
      "page_type": "products",
      "name": "All Products",
      "slug": null,
      "is_enabled": true,
      "sections": [...],
      "seo": {...},
      "created_at": "2025-12-31T10:00:00.000000Z",
      "updated_at": "2025-12-31T10:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 2
  }
}
```

---

### Get Page by Type

Retrieves a specific page by its type.

```
GET /api/v1/custom-themes/pages/{pageType}
```

**Valid Page Types:**
- `home`
- `products`
- `productDetails`
- `collections`
- `collectionDetails`
- `about`
- `contact`
- `privacyPolicy`
- `checkout`
- `landing`

**Response (200):**
```json
{
  "success": true,
  "message": "Page retrieved successfully",
  "data": {
    "id": 1,
    "page_type": "home",
    "name": "Home",
    "slug": null,
    "is_enabled": true,
    "sections": [
      {
        "id": "hero_abc123",
        "type": "hero-1",
        "enabled": true,
        "settings": {
          "background_image": "https://s3.../hero.jpg",
          "title": "Welcome to Our Store",
          "subtitle": "Discover amazing products",
          "button_text": "Shop Now",
          "button_link": "/products"
        },
        "blocks": []
      },
      {
        "id": "featured_def456",
        "type": "featured-products-1",
        "enabled": true,
        "settings": {
          "title": "Featured Products",
          "products_count": 8,
          "columns": 4
        },
        "blocks": []
      },
      {
        "id": "banner_ghi789",
        "type": "promotional-banner-1",
        "enabled": true,
        "settings": {
          "image": "https://s3.../banner.jpg",
          "title": "Summer Sale",
          "description": "Up to 50% off"
        },
        "blocks": []
      }
    ],
    "seo": {
      "title": "Welcome to My Store",
      "description": "Shop the latest products at great prices",
      "og": {
        "title": "My Store - Home",
        "description": "Shop the latest products",
        "image": "https://s3.../og-image.jpg"
      },
      "twitter": {
        "card": "summary_large_image"
      }
    },
    "created_at": "2025-12-31T10:00:00.000000Z",
    "updated_at": "2025-12-31T14:00:00.000000Z"
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "Page not found"
}
```

---

### Update Page (Upsert)

Creates or updates a page. If the page doesn't exist, it will be created.

```
PUT /api/v1/custom-themes/pages/{pageType}
```

**Request Body:**
```json
{
  "name": "Home Page",
  "is_enabled": true,
  "sections": [
    {
      "id": "hero_abc123",
      "type": "hero-1",
      "enabled": true,
      "settings": {
        "background_image": "https://s3.../hero.jpg",
        "title": "Welcome to Our Store",
        "subtitle": "Discover amazing products",
        "button_text": "Shop Now",
        "button_link": "/products",
        "overlay_opacity": 0.3
      },
      "blocks": []
    },
    {
      "id": "featured_def456",
      "type": "featured-products-1",
      "enabled": true,
      "settings": {
        "title": "Featured Products",
        "products_count": 8,
        "columns": 4,
        "show_price": true,
        "show_rating": true
      },
      "blocks": []
    }
  ],
  "seo": {
    "title": "My Store - Home",
    "description": "Welcome to our online store. Shop the latest products.",
    "og": {
      "title": "My Store",
      "description": "Shop amazing products",
      "image": "https://s3.../og-home.jpg"
    }
  },
  "create_version": true,
  "version_summary": "Updated hero section and added featured products"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | No | Page display name |
| is_enabled | boolean | No | Whether page is active |
| sections | array | No | Array of section configurations |
| seo | object | No | SEO metadata |
| create_version | boolean | No | Create version snapshot |
| version_summary | string | No | Description for version |

**Response (200):**
```json
{
  "success": true,
  "message": "Page updated successfully",
  "data": {
    "id": 1,
    "page_type": "home",
    "name": "Home Page",
    "slug": null,
    "is_enabled": true,
    "sections": [...],
    "seo": {...},
    "created_at": "2025-12-31T10:00:00.000000Z",
    "updated_at": "2025-12-31T16:00:00.000000Z"
  }
}
```

---

### Update Page Sections Only

Updates only the sections array without affecting other page properties.

```
PUT /api/v1/custom-themes/pages/{pageType}/sections
```

**Request Body:**
```json
{
  "sections": [
    {
      "id": "hero_abc123",
      "type": "hero-1",
      "enabled": true,
      "settings": {
        "title": "New Title",
        "subtitle": "New Subtitle"
      },
      "blocks": []
    }
  ],
  "create_version": true,
  "version_summary": "Reordered sections"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Page sections updated successfully",
  "data": {
    "id": 1,
    "page_type": "home",
    "name": "Home Page",
    "sections": [...],
    "seo": {...}
  }
}
```

---

### Delete Page

Deletes a page from the theme.

```
DELETE /api/v1/custom-themes/pages/{pageType}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Page deleted successfully",
  "data": []
}
```

---

## Section Templates

Section templates are system-managed and read-only for merchants.

### List All Templates

```
GET /api/v1/theme-section-templates
```

**Query Parameters:**
- `filter[category]`: Filter by category
- `filter[is_active]`: Filter by active status
- `sort`: Sort field (default: `sort_order`)

**Response (200):**
```json
{
  "success": true,
  "message": "Templates retrieved successfully",
  "data": [
    {
      "type": "hero-1",
      "category": "hero",
      "name": "Hero Banner - Full Width",
      "description": "Full-width hero section with background image, title, and CTA button",
      "thumbnail": "https://s3.../thumbnails/hero-1.jpg",
      "default_settings": {
        "background_image": "",
        "title": "Welcome to Our Store",
        "subtitle": "Discover amazing products",
        "button_text": "Shop Now",
        "button_link": "/products",
        "overlay_color": "#000000",
        "overlay_opacity": 0.3,
        "text_color": "#FFFFFF",
        "text_alignment": "center",
        "min_height": "500px"
      },
      "default_blocks": [],
      "schema": {
        "settings": [
          {
            "id": "background_image",
            "type": "image",
            "label": "Background Image"
          },
          {
            "id": "title",
            "type": "text",
            "label": "Title"
          }
        ]
      }
    },
    {
      "type": "featured-products-1",
      "category": "products",
      "name": "Featured Products Grid",
      "description": "Display featured products in a responsive grid",
      "thumbnail": "https://s3.../thumbnails/featured-1.jpg",
      "default_settings": {
        "title": "Featured Products",
        "products_count": 8,
        "columns": 4,
        "show_price": true,
        "show_rating": true,
        "show_quick_add": true
      },
      "default_blocks": [],
      "schema": {...}
    }
  ]
}
```

---

### Get Template by Type

```
GET /api/v1/theme-section-templates/{type}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Template retrieved successfully",
  "data": {
    "type": "hero-1",
    "category": "hero",
    "name": "Hero Banner - Full Width",
    "description": "Full-width hero section with background image",
    "thumbnail": "https://s3.../thumbnails/hero-1.jpg",
    "default_settings": {...},
    "default_blocks": [],
    "schema": {...}
  }
}
```

---

### List Templates by Category

```
GET /api/v1/theme-section-templates/categories/{category}
```

**Valid Categories:**
- `hero`
- `products`
- `collections`
- `content`
- `testimonials`
- `gallery`
- `newsletter`
- `navigation`
- `footer`
- `promotional`
- `features`
- `custom`

**Response (200):**
```json
{
  "success": true,
  "message": "Templates retrieved successfully",
  "data": [
    {
      "type": "hero-1",
      "category": "hero",
      "name": "Hero Banner - Full Width",
      ...
    },
    {
      "type": "hero-2",
      "category": "hero",
      "name": "Hero Slider",
      ...
    }
  ]
}
```

---

## Theme Assets

### List Assets

```
GET /api/v1/theme-assets
```

**Query Parameters:**
- `filter[type]`: Filter by type (image, font, icon)
- `filter[name]`: Search by name
- `sort`: Sort field (default: `-created_at`)
- `paginate`: Items per page (default: 20)

**Response (200):**
```json
{
  "success": true,
  "message": "Assets retrieved successfully",
  "data": [
    {
      "id": 1,
      "type": "image",
      "name": "Hero Banner",
      "url": "https://s3.amazonaws.com/bucket/theme-assets/123/image/abc-123.jpg",
      "metadata": {
        "s3_path": "theme-assets/123/image/abc-123.jpg",
        "file_size": 245678,
        "mime_type": "image/jpeg",
        "original_name": "hero-banner.jpg",
        "extension": "jpg",
        "width": 1920,
        "height": 1080,
        "alt_text": "Summer collection hero banner"
      },
      "created_at": "2025-12-31T10:00:00.000000Z",
      "updated_at": "2025-12-31T10:00:00.000000Z"
    }
  ],
  "links": {...},
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 15
  }
}
```

---

### Upload Asset

```
POST /api/v1/theme-assets
Content-Type: multipart/form-data
```

**Request Body (File Upload):**
```
file: [binary file data]
type: image
name: Hero Banner (optional)
metadata[alt_text]: Summer collection banner (optional)
```

**Request Body (External URL):**
```json
{
  "url": "https://example.com/image.jpg",
  "type": "image",
  "name": "External Image",
  "metadata": {
    "alt_text": "External image description"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | file | Required if no url | File to upload |
| url | string | Required if no file | External URL |
| type | string | Yes | image, font, or icon |
| name | string | No | Display name (defaults to filename) |
| metadata | object | No | Additional metadata |

**Validation:**
- File types: jpeg, png, jpg, gif, svg, webp, woff, woff2, ttf, otf, ico
- Max file size: 10MB

**Response (201):**
```json
{
  "success": true,
  "message": "Asset uploaded successfully",
  "data": {
    "id": 2,
    "type": "image",
    "name": "Hero Banner",
    "url": "https://s3.amazonaws.com/bucket/theme-assets/123/image/def-456.jpg",
    "metadata": {
      "s3_path": "theme-assets/123/image/def-456.jpg",
      "file_size": 189234,
      "mime_type": "image/jpeg",
      "original_name": "hero.jpg",
      "extension": "jpg",
      "width": 1920,
      "height": 800,
      "alt_text": "Summer collection banner"
    },
    "created_at": "2025-12-31T16:00:00.000000Z",
    "updated_at": "2025-12-31T16:00:00.000000Z"
  }
}
```

---

### Get Asset

```
GET /api/v1/theme-assets/{id}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Asset retrieved successfully",
  "data": {
    "id": 1,
    "type": "image",
    "name": "Hero Banner",
    "url": "https://s3.amazonaws.com/bucket/theme-assets/123/image/abc-123.jpg",
    "metadata": {...},
    "created_at": "2025-12-31T10:00:00.000000Z",
    "updated_at": "2025-12-31T10:00:00.000000Z"
  }
}
```

---

### Update Asset

```
PUT /api/v1/theme-assets/{id}
```

**Request Body:**
```json
{
  "name": "Updated Asset Name",
  "metadata": {
    "alt_text": "Updated alt text description"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Asset updated successfully",
  "data": {
    "id": 1,
    "type": "image",
    "name": "Updated Asset Name",
    "url": "https://s3.amazonaws.com/bucket/theme-assets/123/image/abc-123.jpg",
    "metadata": {
      "s3_path": "theme-assets/123/image/abc-123.jpg",
      "file_size": 245678,
      "mime_type": "image/jpeg",
      "original_name": "hero-banner.jpg",
      "extension": "jpg",
      "width": 1920,
      "height": 1080,
      "alt_text": "Updated alt text description"
    },
    "created_at": "2025-12-31T10:00:00.000000Z",
    "updated_at": "2025-12-31T17:00:00.000000Z"
  }
}
```

---

### Delete Asset

```
DELETE /api/v1/theme-assets/{id}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Asset deleted successfully",
  "data": []
}
```

**Note:** When deleting an uploaded asset (not external URL), the file is also deleted from S3.

---

## Public Storefront Endpoints

These endpoints are used by the storefront to fetch theme data. They do not require authentication but require shop identification.

### Get Theme

```
POST /api/v1/live/theme
```

**Request Body (one of):**
```json
{
  "shop_id": 123
}
```
```json
{
  "subdomain": "mystore"
}
```
```json
{
  "domain": "mystore.com"
}
```

**Response (200 - Custom Theme):**
```json
{
  "success": true,
  "message": "Theme retrieved successfully",
  "data": {
    "global_settings": {...},
    "global_sections": {...},
    "templates": {...}
  }
}
```

**Response (200 - Legacy Theme):**
```json
{
  "success": false,
  "message": "Shop uses legacy theme system",
  "legacy_theme": true
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "Shop not found"
}
```

---

### Get Full Theme with Pages

```
POST /api/v1/live/theme/full
```

**Request Body:**
```json
{
  "shop_id": 123
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Theme retrieved successfully",
  "data": {
    "global_settings": {...},
    "global_sections": {
      "announcement": {...},
      "header": {...},
      "footer": {...}
    },
    "templates": {...},
    "pages": [
      {
        "page_type": "home",
        "name": "Home",
        "sections": [...],
        "seo": {...}
      },
      {
        "page_type": "products",
        "name": "Products",
        "sections": [...],
        "seo": {...}
      }
    ]
  }
}
```

---

### Get Specific Page

```
POST /api/v1/live/theme/page/{pageType}
```

**Request Body:**
```json
{
  "shop_id": 123
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Page retrieved successfully",
  "data": {
    "page_type": "home",
    "name": "Home",
    "sections": [
      {
        "id": "hero_abc123",
        "type": "hero-1",
        "enabled": true,
        "settings": {...},
        "blocks": []
      }
    ],
    "seo": {
      "title": "Welcome to My Store",
      "description": "Shop amazing products"
    }
  }
}
```

---

## Section Structure

Each section in a page follows this structure:

```json
{
  "id": "unique_section_id",
  "type": "section-template-type",
  "enabled": true,
  "settings": {
    "setting_key": "value"
  },
  "blocks": [
    {
      "id": "unique_block_id",
      "type": "block-type",
      "settings": {
        "block_setting_key": "value"
      }
    }
  ]
}
```

### Section ID Generation

Section IDs should be generated client-side using the format:
```
{section_type}_{random_string}
```

Example: `hero-1_abc123`, `featured-products-1_def456`

### Block Structure

Blocks are sub-components within a section. For example, a slider section might have multiple slide blocks:

```json
{
  "id": "slider_abc123",
  "type": "hero-slider-1",
  "enabled": true,
  "settings": {
    "auto_play": true,
    "interval": 5000
  },
  "blocks": [
    {
      "id": "slide_1",
      "type": "slide",
      "settings": {
        "image": "https://s3.../slide1.jpg",
        "title": "Summer Collection",
        "button_text": "Shop Now",
        "button_link": "/collections/summer"
      }
    },
    {
      "id": "slide_2",
      "type": "slide",
      "settings": {
        "image": "https://s3.../slide2.jpg",
        "title": "New Arrivals",
        "button_text": "Discover",
        "button_link": "/collections/new"
      }
    }
  ]
}
```

---

## Error Responses

### Validation Error (422)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "global_settings.colors.primary": [
      "The primary color must be a valid hex color."
    ],
    "sections.0.type": [
      "The section type is required."
    ]
  }
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "Theme not found"
}
```

### Unauthorized (403)

```json
{
  "success": false,
  "message": "You are not authorized to perform this action."
}
```

### Unauthenticated (401)

```json
{
  "message": "Unauthenticated."
}
```

---

## Available Section Templates

The system comes with 17 pre-seeded section templates:

| Type | Category | Name |
|------|----------|------|
| hero-1 | hero | Hero Banner - Full Width |
| hero-2 | hero | Hero Slider |
| hero-3 | hero | Hero Split - Image Right |
| featured-products-1 | products | Featured Products Grid |
| product-carousel-1 | products | Product Carousel |
| collection-list-1 | collections | Collection List Grid |
| collection-banner-1 | collections | Collection Banner |
| rich-text-1 | content | Rich Text Section |
| image-with-text-1 | content | Image with Text |
| video-1 | content | Video Section |
| testimonials-1 | testimonials | Testimonials Carousel |
| testimonials-2 | testimonials | Testimonials Grid |
| image-gallery-1 | gallery | Image Gallery Grid |
| newsletter-1 | newsletter | Newsletter Signup |
| announcement-bar-1 | navigation | Announcement Bar |
| navbar-1 | navigation | Navigation Bar - Standard |
| footer-1 | footer | Footer - Standard |

---

## Legacy Theme Support

Shops can be configured to use either the legacy theme system or the new custom theme builder. This is controlled by the `legacy_theme` boolean column on the `shops` table.

### Checking Theme Mode

When fetching theme data via public endpoints, the API checks the `legacy_theme` flag:

- If `legacy_theme = true`: Returns legacy theme indicator
- If `legacy_theme = false`: Returns custom theme data

### Frontend Handling

```javascript
const response = await fetch('/api/v1/live/theme', {
  method: 'POST',
  body: JSON.stringify({ shop_id: shopId })
});

const data = await response.json();

if (data.legacy_theme) {
  // Use legacy theme rendering
  renderLegacyTheme();
} else if (data.success) {
  // Use custom theme builder
  renderCustomTheme(data.data);
}
```

---

## Rate Limiting

Public storefront endpoints are subject to rate limiting:
- 60 requests per minute per IP

Authenticated endpoints follow standard API rate limits:
- 120 requests per minute per user

---

## Best Practices

### 1. Version Management

Create versions before making significant changes:

```javascript
// Update with version
await updateTheme({
  global_settings: newSettings,
  create_version: true,
  version_summary: "Updated brand colors for holiday season"
});
```

### 2. Incremental Updates

Use the sections-only endpoint for frequent section reordering:

```javascript
// Only update sections (faster, less data)
await updatePageSections('home', {
  sections: reorderedSections
});
```

### 3. Asset Management

Always upload assets to S3 via the assets API rather than embedding base64 data:

```javascript
// Upload asset first
const asset = await uploadAsset(file, 'image');

// Then use the URL in sections
section.settings.background_image = asset.url;
```

### 4. Caching Awareness

Theme data is cached for 24 hours. After updates, the cache is automatically invalidated. For immediate visibility on the storefront, no action is needed.