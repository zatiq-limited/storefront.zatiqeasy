# API Architecture Guide: Client vs Server Patterns

## Overview

This guide explains the dual API pattern used in this project: **API Routes** for client components and **Service Methods** for server components.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Two Server-Side Execution Contexts](#two-server-side-execution-contexts)
3. [When to Use What](#when-to-use-what)
4. [Common Misconceptions](#common-misconceptions)
5. [Real-World Examples](#real-world-examples)
6. [Architecture Diagram](#architecture-diagram)

---

## Core Concepts

### Where Code Runs

| Location                             | Execution Environment | Purpose                             |
| ------------------------------------ | --------------------- | ----------------------------------- |
| `/app/api/**/*.ts`                   | Server (Node.js)      | HTTP endpoints for browser to call  |
| `/lib/api/services/**/*.ts`          | Server (Node.js)      | Reusable functions for internal use |
| `/hooks/**/*.ts` with `"use client"` | Browser               | React hooks for client components   |
| `/app/**/layout.tsx` (default)       | Server (Next.js SSR)  | Server components for rendering     |

### Key Principle

**All API routes are server-side, but they serve different purposes than service methods.**

---

## Two Server-Side Execution Contexts

### Option 1: API Routes (HTTP Endpoint)

**Flow:**

```
Browser → fetch("/api/storefront/v1/inventories") → API Route (Server) → External API
```

**Characteristics:**

- Creates an HTTP endpoint
- Called from browser via `fetch()`
- Adds an extra network hop
- **Hides external API URLs from browser DevTools**

**Example:**

```typescript
// app/api/storefront/v1/inventories/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { data } = await apiClient.post("/api/v1/live/inventories", body);
  return NextResponse.json({ success: true, data: data.data });
}
```

### Option 2: Service Methods (Direct Function Call)

**Flow:**

```
Server Component → shopService.getProducts() → External API
```

**Characteristics:**

- Direct function call (no HTTP request)
- Used only in server components
- Faster (no extra network hop)
- No browser involvement

**Example:**

```typescript
// lib/api/services/shop.service.ts
export const shopService = {
  async getProducts(params: { shop_uuid: string }) {
    const { data } = await apiClient.post("/api/v1/live/inventories", {
      identifier: params.shop_uuid,
    });
    return data?.data || null;
  },
};
```

---

## When to Use What

### ✅ Use API Routes (`fetch()`) When:

1. **Client Components (Hooks)**

   ```tsx
   "use client";

   export function useShopInventories() {
     return useQuery({
       queryFn: async () => {
         const response = await fetch("/api/storefront/v1/inventories", {
           method: "POST",
           body: JSON.stringify({ shop_uuid }),
         });
         return response.json();
       },
     });
   }
   ```

   **Result**: External URL hidden in browser network tab ✅

2. **Client-Side Interactivity**
   - Form submissions from browser
   - User actions (clicks, searches)
   - Real-time data fetching in React components

### ✅ Use Service Methods (`shopService`) When:

1. **Server Components**

   ```tsx
   // app/merchant/[shopId]/layout.tsx
   export default async function Layout({ params }) {
     const { shopId } = await params;

     // Direct call - no HTTP overhead
     const shopProfile = await shopService.getProfile({ shop_id: shopId });

     return <div>{shopProfile?.shop_name}</div>;
   }
   ```

   **Result**: Faster, no extra HTTP request ✅

2. **Server-Side Operations**
   - `generateMetadata()` - SEO data
   - `generateStaticParams()` - Static generation
   - Server Actions
   - API route implementations

---

## Common Misconceptions

### ❌ Misconception 1: "API routes are client-side"

**Reality**: API routes run on the server. They create HTTP endpoints that the browser can call.

```
Browser (client) → fetch() → API Route (server) → External API (server)
```

### ❌ Misconception 2: "I can use shopService in client hooks"

**Problem**: This exposes the external API URL!

```tsx
"use client";
import { shopService } from "@/lib/api/services/shop.service";

export function useProducts() {
  return useQuery({
    queryFn: async () => {
      // ❌ This runs in the BROWSER
      // Browser makes direct request to https://easybill.zatiq.tech
      const products = await shopService.getProducts({ shop_uuid });
      return products;
    },
  });
}
```

**Network Tab Shows:**

```
❌ https://easybill.zatiq.tech/api/v1/live/inventories (EXPOSED!)
```

**Correct Approach:**

```tsx
"use client";

export function useProducts() {
  return useQuery({
    queryFn: async () => {
      // ✅ Browser calls your API route
      const response = await fetch("/api/storefront/v1/inventories", {
        method: "POST",
        body: JSON.stringify({ shop_uuid }),
      });
      return response.json();
    },
  });
}
```

**Network Tab Shows:**

```
✅ localhost:3000/api/storefront/v1/inventories (HIDDEN!)
```

### ❌ Misconception 3: "Server components should use API routes"

**Problem**: Unnecessary performance overhead

```tsx
// ❌ Bad: Server calling its own HTTP endpoint
export default async function Layout() {
  const response = await fetch(
    "http://localhost:3000/api/storefront/v1/profile",
    {
      method: "POST",
      body: JSON.stringify({ shop_id }),
    }
  );
  const profile = await response.json();
}

// ✅ Good: Direct function call
export default async function Layout() {
  const profile = await shopService.getProfile({ shop_id });
}
```

---

## Real-World Examples

### Example 1: Product Listing (Client Component)

```tsx
// hooks/useShopInventories.ts
"use client";
import { useQuery } from "@tanstack/react-query";

export function useShopInventories(params: { shopUuid: string }) {
  return useQuery({
    queryKey: ["shop-inventories", params.shopUuid],
    queryFn: async () => {
      // ✅ Fetch from API route (hides external URL)
      const response = await fetch("/api/storefront/v1/inventories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_uuid: params.shopUuid }),
      });

      const result = await response.json();
      return result.data;
    },
  });
}
```

```typescript
// app/api/storefront/v1/inventories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // ✅ Server-side call to external API
  const { data } = await apiClient.post("/api/v1/live/inventories", {
    identifier: body.shop_uuid,
  });

  return NextResponse.json({ success: true, data: data.data });
}
```

**Flow:**

```
ProductsPage (browser)
  → useShopInventories (browser)
  → fetch("/api/storefront/v1/inventories") (HTTP from browser)
  → API Route (server)
  → apiClient (server)
  → https://easybill.zatiq.tech (hidden from browser)
```

### Example 2: Shop Profile (Server Component)

```tsx
// app/merchant/[shopId]/layout.tsx
import { shopService } from "@/lib/api/services/shop.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;

  // ✅ Direct service call (no HTTP overhead)
  const shopProfile = await shopService.getProfile({ shop_id: shopId });

  return {
    title: `${shopProfile?.shop_name} | Zatiq Store`,
    description: shopProfile?.details,
  };
}

export default async function MerchantLayout({ params, children }) {
  const { shopId } = await params;

  // ✅ Direct service call again
  const shopProfile = await shopService.getProfile({ shop_id: shopId });

  return <ShopProvider profile={shopProfile}>{children}</ShopProvider>;
}
```

**Flow:**

```
Next.js Server
  → MerchantLayout.generateMetadata() (server)
  → shopService.getProfile() (server function call)
  → apiClient (server)
  → https://easybill.zatiq.tech (server-to-server)

No browser involvement, no network tab, no HTTP overhead!
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         BROWSER                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Client Components ("use client")                          │
│  ┌─────────────────────────────────┐                       │
│  │  useShopInventories.ts          │                       │
│  │  useShopCategories.ts           │                       │
│  │  useShopProfile.ts              │                       │
│  └─────────────┬───────────────────┘                       │
│                │ fetch()                                    │
│                │ (HTTP Request)                             │
└────────────────┼────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      YOUR SERVER                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  API Routes (HTTP Endpoints)                                │
│  ┌─────────────────────────────────┐                       │
│  │ /api/storefront/v1/inventories  │                       │
│  │ /api/storefront/v1/categories   │                       │
│  │ /api/storefront/v1/profile      │                       │
│  └─────────────┬───────────────────┘                       │
│                │                                            │
│                │ apiClient.post()                           │
│                │                                            │
│                ▼                                            │
│  ┌──────────────────────────────────┐                      │
│  │      Service Methods             │                      │
│  │  ┌────────────────────────────┐  │                      │
│  │  │ shopService.getProfile()   │◄─┼─── Server Components│
│  │  │ shopService.getProducts()  │  │     (layout.tsx)    │
│  │  │ shopService.getCategories()│  │                      │
│  │  └────────────┬───────────────┘  │                      │
│  │               │                   │                      │
│  └───────────────┼───────────────────┘                      │
│                  │ apiClient.post()                         │
│                  │                                          │
└──────────────────┼──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│               EXTERNAL API                                  │
│         https://easybill.zatiq.tech                         │
│                                                             │
│  POST /api/v1/live/inventories                              │
│  POST /api/v1/live/filtered_categories                      │
│  POST /api/v1/live/profile                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Decision Matrix

| Scenario                     | Use API Route  | Use Service Method  |
| ---------------------------- | -------------- | ------------------- |
| Client hook needs data       | ✅ Yes         | ❌ No (exposes URL) |
| Server component needs data  | ❌ No (slower) | ✅ Yes              |
| generateMetadata()           | ❌ No          | ✅ Yes              |
| Form submission from browser | ✅ Yes         | ❌ No               |
| generateStaticParams()       | ❌ No          | ✅ Yes              |
| Want to hide external URLs   | ✅ Yes         | Only if server-side |

---

## Benefits Summary

### API Routes Benefits:

1. **Security**: Hide external API URLs from browser
2. **Middleware**: Add authentication, rate limiting, caching
3. **Transformation**: Modify request/response before sending to client
4. **Secrets**: Keep API keys server-side

### Service Methods Benefits:

1. **Performance**: No extra HTTP request overhead
2. **Reusability**: Share logic across server components
3. **Type Safety**: Full TypeScript support
4. **Consistency**: Same error handling and patterns
5. **SEO**: Fast data fetching for generateMetadata()

---

## Key Takeaways

1. **API routes are server-side** - they just expose HTTP endpoints
2. **Client components must use API routes** to hide external URLs
3. **Server components should use service methods** for better performance
4. **Never use `shopService` in client components** - it exposes the external API
5. **Both patterns are valid** - use the right tool for the right context

---

## Related Files

- API Routes: `/app/api/storefront/v1/**/*.ts`
- Service Methods: `/lib/api/services/shop.service.ts`
- Client Hooks: `/hooks/useShop*.ts`
- Server Components: `/app/merchant/[shopId]/layout.tsx`
- API Client: `/lib/api/client.ts`

---

**Last Updated**: December 24, 2025
