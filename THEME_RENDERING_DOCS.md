# Zatiq Storefront - Theme Rendering Documentation

> **Purpose:** Quick reference for understanding how the storefront renders themes exported from the Merchant Panel's Theme Builder.

---

## Overview

The storefront uses **two rendering approaches** depending on the component type:

1. **Block Renderer** - For static/design-driven components (announcement, header, footer, homepage sections)
2. **Settings-Based Components** - For interactive/data-driven components (products page, cart, checkout)

**Main documentation:** See `/merchant-panel/THEME_BUILDER_DOCUMENTATION.md` for complete system documentation.

---

## Rendering Approaches

### Block Renderer Approach

**Used for:** Announcement Bar, Header, Footer, Homepage sections (Hero, Categories, Banners)

```
JSON with blocks[] → BlockRenderer → Rendered UI
```

- Full UI structure defined in JSON
- No React components needed in storefront
- Uses `bind_*` for data binding
- Handles simple interactivity (navigation, toggles)

### Settings-Based Approach

**Used for:** Products Page, Product Details, Collections, Cart, Checkout

```
JSON with settings{} → React Components → Rendered UI
```

- Only configuration exported from merchant panel
- Pre-built React components in storefront
- Handles complex state (filters, search, forms)
- Fetches data from API at runtime

### Quick Decision Guide

| Question | Block Renderer | Settings-Based |
|----------|---------------|----------------|
| Does it need complex state (filters, forms)? | No | Yes |
| Is data fetched from API? | No | Yes |
| Is UI structure the customization? | Yes | No |
| Does it need search/sort/pagination? | No | Yes |

---

## Data Files

Located in `src/data/api-responses/`:

| File                   | Content                                           | Rendering Approach |
| ---------------------- | ------------------------------------------------- | ------------------ |
| `theme.json`           | Global settings, navbar, footer, announcement bar | Block Renderer |
| `homepage.json`        | Homepage sections (hero, categories, banners)     | Block Renderer |
| `products-page.json`   | Products page layout settings                     | Settings-Based |
| `collections.json`     | Collections page sections                         | Mixed |
| `product-details.json` | Product detail page                               | Settings-Based |
| `checkout.json`        | Checkout page                                     | Settings-Based |

---

## Core Components

### 1. DynamicPageRenderer

**File:** `src/components/DynamicPageRenderer.tsx`

Renders a full page from JSON data.

```tsx
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import homepageData from "@/data/api-responses/homepage.json";

export default function HomePage() {
  return <DynamicPageRenderer page={homepageData.data} />;
}
```

**Props:**

- `page: PageData` - Page JSON with sections array
- `globalData?: Record<string, unknown>` - Shared data
- `className?: string` - Additional CSS classes

### 2. BlockRenderer

**File:** `src/components/BlockRenderer.tsx`

Recursively renders individual blocks from JSON.

**Exports:**

- `BlockRenderer` - Single block (creates DrawerContext)
- `BlocksRenderer` - Multiple blocks (shared DrawerContext)

### 3. Special Renderers

Located in `src/components/block-renderers/`:

| Renderer           | Block Type | Purpose           |
| ------------------ | ---------- | ----------------- |
| `RepeaterRenderer` | `repeater` | Iterate arrays    |
| `SwiperRenderer`   | `swiper`   | Carousels/sliders |
| `MarqueeRenderer`  | `marquee`  | Scrolling text    |
| `IconRenderer`     | `icon`     | SVG icons         |

---

## Block Schema Quick Reference

### Basic Block

```json
{
  "wrapper": "div#id.class1.class2",
  "class": "tailwind classes",
  "style": { "background_color": "#fff" },
  "content": "Static text",
  "blocks": [
    /* child blocks */
  ]
}
```

### With Bindings

```json
{
  "wrapper": "h2",
  "bind_content": "category.title",
  "bind_style": { "color": "title_color" }
}
```

### Repeater

```json
{
  "type": "repeater",
  "source": "products",
  "iterator": "product",
  "template": {
    "wrapper": "div",
    "bind_content": "product.name"
  }
}
```

### Conditional

```json
{
  "wrapper": "span",
  "condition": { "field": "label", "op": "not_empty" },
  "bind_content": "label"
}
```

### With Events

```json
{
  "wrapper": "button",
  "events": {
    "on_click": { "action": "navigate", "target": "/products" }
  }
}
```

---

## Utility Functions

**File:** `src/lib/block-utils.ts`

| Function                                             | Purpose                                      |
| ---------------------------------------------------- | -------------------------------------------- |
| `parseWrapper(wrapper)`                              | Extract tag, id, classes from wrapper string |
| `resolveBinding(path, data, context)`                | Resolve binding path to value                |
| `evaluateCondition(condition, data, context)`        | Check if condition is met                    |
| `convertStyleToCSS(style, data, context)`            | Convert snake_case to camelCase              |
| `createEventHandler(event, data, context, handlers)` | Create event callback                        |
| `generateBlockKey(block, index)`                     | Generate React key                           |
| `getBlockType(block)`                                | Determine block type                         |

---

## Adding New Features

### New Block Type

1. Add type detection in `getBlockType()` in `block-utils.ts`
2. Create renderer in `block-renderers/`
3. Add case in `BlockRendererInternal` switch statement

### New Binding Type

1. Add property to Block interface in `BlockRenderer.tsx`
2. Handle in `BlockRendererInternal` rendering logic

### New Event Action

1. Add to `eventHandlers` interface in `BlockRenderer.tsx`
2. Handle in `createEventHandler()` in `block-utils.ts`
3. Pass handler from `DynamicPageRenderer`

---

## Debugging

### Common Issues

**Block not rendering:**

```tsx
// Add logging in BlockRendererInternal
console.log("Block:", block);
console.log("Merged data:", mergedData);
console.log(
  "Condition result:",
  evaluateCondition(block.condition, mergedData, context)
);
```

**Binding not resolving:**

```tsx
// Check resolveBinding output
console.log("Binding path:", block.bind_content);
console.log(
  "Resolved value:",
  resolveBinding(block.bind_content, mergedData, context)
);
```

**Drawer/toggle not working:**

```tsx
// Check DrawerContext
console.log("Drawer states:", drawerStates);
console.log("Target ID:", targetId);
```

---

## Settings-Based Components

### How It Works

Settings-based components receive configuration from JSON but render using pre-built React components with full state management.

**Flow:**
```
1. Merchant Panel → Export settings JSON (no blocks)
2. Storefront Page → Load JSON, fetch API data
3. React Component → Receive settings + data as props
4. Component → Manage state, render UI
```

### Products Page Example

**JSON Structure (products-page.json):**
```json
{
  "type": "products-layout",
  "settings": {
    "columns": 4,
    "showSidebar": true,
    "sidebarType": "products-sidebar-1",
    "cardType": "card-7",
    "paginationType": "products-pagination-1",
    "filterBarBgColor": "#FFFFFF",
    "cardButtonBgColor": "#3B82F6"
  }
}
```

**Page Component:**
```tsx
// app/products/page.tsx
import { ProductsLayout, ProductsHero2 } from '@/components/zatiq/products-page';
import pageJson from '@/data/api-responses/products-page.json';

export default async function ProductsPage() {
  const products = await fetchProducts(); // API call
  const categories = await fetchCategories();

  const heroSection = pageJson.data.sections.find(s => s.type.startsWith('products-hero'));
  const layoutSection = pageJson.data.sections.find(s => s.type === 'products-layout');

  return (
    <>
      <ProductsHero2 settings={heroSection.settings} productCount={products.length} />
      <ProductsLayout
        settings={layoutSection.settings}
        products={products}
        categories={categories}
      />
    </>
  );
}
```

### Available Settings-Based Components

Located in `src/components/zatiq/`:

| Directory | Components | Purpose |
|-----------|------------|---------|
| `products-page/` | ProductsHero1/2, ProductsLayout, ProductsSidebar1/2, ProductsPagination1/2, ProductsGrid1/2 | Products listing |
| `product-details-page/` | ProductDetail1/2, RelatedProducts1/2, CustomerReviews1/2 | Product detail |
| `collections/` | CollectionsHero1/2, CollectionsGrid1/2 | Collections listing |
| `collection-details/` | CollectionBanner1/2, CollectionProducts1/2 | Collection detail |
| `checkout-page/` | CheckoutHero1/2/3, CheckoutContent1/2/3 | Checkout flow |
| `product-cards/` | ProductCards1-16 | Card variants |

### Component Registry

Components are registered for dynamic loading:

```tsx
// lib/component-registry.ts
const componentRegistry = {
  'products-sidebar-1': ProductsSidebar1,
  'products-sidebar-2': ProductsSidebar2,
  'products-pagination-1': ProductsPagination1,
  'products-pagination-2': ProductsPagination2,
  'product-card-1': ProductCards1,
  // ... etc
};

export function getComponent(type: string) {
  return componentRegistry[type] || null;
}
```

**Usage in ProductsLayout:**
```tsx
const SidebarComponent = getComponent(settings.sidebarType); // 'products-sidebar-1'
const CardComponent = getComponent(`product-card-${settings.cardType.replace('card-', '')}`);

return (
  <div>
    {SidebarComponent && <SidebarComponent categories={categories} ... />}
    <div className="grid">
      {products.map(p => <CardComponent key={p.id} {...p} />)}
    </div>
  </div>
);
```

---

## Adding New Components

### Adding a Block Renderer Component

1. **Merchant Panel:** Create block builder in `utils/export/`
2. **Register:** Add to `section-transforms.ts`
3. **Storefront:** Nothing needed - BlockRenderer handles automatically

### Adding a Settings-Based Component

1. **Merchant Panel:** Define settings schema in `utils/components/`
2. **Storefront:** Create React component in `components/zatiq/`
3. **Register:** Add to component registry
4. **Page:** Import and use with settings + API data

### Choosing the Right Approach

**Use Block Renderer when:**
- UI structure is the primary customization
- Content is static or embedded in JSON
- Simple interactivity (links, toggles)
- No API data needed at runtime

**Use Settings-Based when:**
- Complex state management needed
- API data required (products, cart, user)
- Search, filter, sort, pagination
- Forms with validation
- Multiple composable sub-components

---

## File Structure

```
src/
├── components/
│   ├── BlockRenderer.tsx          # Block rendering (announcement, header, footer, home)
│   ├── DynamicPageRenderer.tsx    # Page-level rendering
│   ├── block-renderers/           # Special block types
│   │   ├── RepeaterRenderer.tsx
│   │   ├── SwiperRenderer.tsx
│   │   ├── MarqueeRenderer.tsx
│   │   └── IconRenderer.tsx
│   └── zatiq/                     # Settings-based components
│       ├── products-page/
│       │   ├── index.tsx
│       │   ├── ProductsLayout.tsx
│       │   ├── ProductsHero1.tsx
│       │   ├── ProductsHero2.tsx
│       │   ├── ProductsSidebar1.tsx
│       │   ├── ProductsSidebar2.tsx
│       │   └── ...
│       ├── product-cards/
│       │   ├── ProductCards1.tsx
│       │   ├── ProductCards2.tsx
│       │   └── ... (1-16)
│       ├── product-details-page/
│       ├── collections/
│       ├── checkout-page/
│       └── ...
├── data/
│   └── api-responses/
│       ├── theme.json             # Block Renderer
│       ├── homepage.json          # Block Renderer
│       ├── products-page.json     # Settings-Based
│       └── ...
└── lib/
    ├── block-utils.ts             # Block rendering utilities
    └── component-registry.ts      # Settings-based component registry
```

---

_See `/merchant-panel/THEME_BUILDER_DOCUMENTATION.md` for complete documentation._

_Last Updated: December 15, 2025_
