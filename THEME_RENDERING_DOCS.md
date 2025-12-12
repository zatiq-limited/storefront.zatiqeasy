# Zatiq Storefront - Theme Rendering Documentation

> **Purpose:** Quick reference for understanding how the storefront renders themes exported from the Merchant Panel's Theme Builder.

---

## Overview

The storefront uses a **JSON-driven dynamic rendering** system. Theme configuration is exported from the Merchant Panel as JSON files and rendered using React components.

**Main documentation:** See `/merchant-panel/THEME_BUILDER_DOCUMENTATION.md` for complete system documentation.

---

## Data Files

Located in `src/data/api-responses/`:

| File                   | Content                                           |
| ---------------------- | ------------------------------------------------- |
| `theme.json`           | Global settings, navbar, footer, announcement bar |
| `homepage.json`        | Homepage sections                                 |
| `products.json`        | Products page sections                            |
| `collections.json`     | Collections page sections                         |
| `product-details.json` | Product detail page                               |
| `checkout.json`        | Checkout page                                     |

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

_See `/merchant-panel/THEME_BUILDER_DOCUMENTATION.md` for complete documentation._
