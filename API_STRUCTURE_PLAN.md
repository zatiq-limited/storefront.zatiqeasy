# API Architecture Guide & Best Practices

> **Status**: ✅ Phase 1-4 Complete | ✅ Performance Optimization Complete | 📋 Continuous Improvement Plan
> **Last Updated**: January 13, 2026

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Implementation Status](#implementation-status)
3. [Best Practices & Guidelines](#best-practices--guidelines)
4. [Improvement Roadmap](#improvement-roadmap)
5. [Code Examples](#code-examples)

---

## Architecture Overview

### Current Architecture (Implemented ✅)

We've successfully implemented a **centralized, service-oriented API architecture** with:

- ✅ Single API client with encryption/decryption
- ✅ Feature-based service layer
- ✅ Next.js API routes as BFF (Backend for Frontend)
- ✅ React Query hooks for data fetching
- ✅ Type-safe API responses
- ✅ Proper cache strategies

### Directory Structure (Implemented ✅)

```
lib/
├── api/
│   ├── client.ts              # ✅ Axios instance with interceptors
│   ├── types.ts               # ✅ API type definitions
│   └── services/              # ✅ Feature-based services
│       ├── shop.service.ts
│       ├── order.service.ts
│       ├── payment.service.ts
│       ├── otp.service.ts
│       ├── contact.service.ts
│       └── analytics.service.ts
├── constants/
│   ├── cache.ts               # ✅ React Query cache config
│   ├── urls.ts                # ✅ API routes
│   └── index.ts
└── utils/
    └── encrypt-decrypt.ts     # ✅ Encryption utilities

app/api/storefront/v1/          # ✅ Next.js API Routes (BFF)
├── profile/route.ts
├── inventories/route.ts
├── categories/route.ts
├── products/
│   ├── route.ts
│   └── [handle]/route.ts
├── collections/
│   ├── route.ts
│   └── [slug]/route.ts
└── page/                       # Page configuration endpoints
    ├── home/route.ts
    ├── products/route.ts
    ├── collections/route.ts
    ├── product-details/route.ts
    └── collection-details/route.ts

hooks/                          # ✅ React Query hooks
├── useShopProfile.ts
├── useShopInventories.ts
├── useShopCategories.ts
├── useProductDetails.ts
├── useProducts.ts
└── useCollections.ts
```

### Data Flow Patterns

#### Pattern 1: Client Component → API Route → External API

```
[Browser]
   ↓ fetch('/api/storefront/v1/inventories')
[Next.js API Route]
   ↓ apiClient.post('/api/v1/live/inventories')
   ↓ (Auto-encrypt via interceptor)
[External API]
   ↓ Encrypted response
[Interceptor]
   ↓ Auto-decrypt
[API Route]
   ↓ JSON response
[React Query Hook]
   ↓ Cache & state management
[Component]
```

**Use for**: Client components, dynamic data, user-specific data

#### Pattern 2: Server Component → Service → External API

```
[Server Component]
   ↓ shopService.getProfile()
   ↓ apiClient.post('/api/v1/live/profile')
[External API]
   ↓ Direct server-to-server
[Component Render]
```

**Use for**: SSR, static generation, server-only data

---

## Implementation Status

### ✅ Phase 1: Consolidate API Clients (COMPLETE)

- ✅ Created `lib/api/client.ts` with single Axios instance
- ✅ Configured base URL, timeout, headers
- ✅ Implemented request/response interceptors
- ✅ Automatic encryption/decryption for specific endpoints
- ✅ Centralized error handling

### ✅ Phase 2: Create API Services (COMPLETE)

- ✅ `shop.service.ts` - Profile, products, categories
- ✅ `order.service.ts` - Order creation, receipt fetching
- ✅ `payment.service.ts` - Payment processing, gateway methods
- ✅ `otp.service.ts` - OTP send, verify, resend
- ✅ `contact.service.ts` - Contact form submission
- ✅ `analytics.service.ts` - Event tracking

### ✅ Phase 3: Next.js API Routes (COMPLETE)

- ✅ `/api/storefront/v1/profile` - Shop profile
- ✅ `/api/storefront/v1/inventories` - Products
- ✅ `/api/storefront/v1/categories` - Categories
- ✅ `/api/storefront/v1/products` - Products listing
- ✅ `/api/storefront/v1/products/[handle]` - Product detail
- ✅ `/api/storefront/v1/collections` - Collections
- ✅ `/api/storefront/v1/collections/[slug]` - Collection detail
- ✅ Page configuration endpoints (home, products, etc.)

### ✅ Phase 4: React Query Hooks (COMPLETE)

- ✅ Standardized hooks with React Query
- ✅ Proper cache configurations in `lib/constants/cache.ts`
- ✅ Default query options with retry logic
- ✅ Store synchronization with Zustand

---

## Best Practices & Guidelines

### 🔒 Security Best Practices

#### 1. Environment Variable Validation ⚠️ PRIORITY

**Current Issue:**

```typescript
// lib/api/client.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://easybill.zatiq.tech";
```

**Best Practice:**

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

if (!API_BASE_URL) {
  throw new Error(
    "❌ NEXT_PUBLIC_API_URL is required in environment variables"
  );
}
if (!ENCRYPTION_KEY) {
  throw new Error(
    "❌ NEXT_PUBLIC_ENCRYPTION_KEY is required in environment variables"
  );
}
```

**Action**: Add validation at application startup

#### 2. Input Validation with Zod ⚠️ PRIORITY

**Current Issue**: Manual validation, no schema enforcement

**Best Practice:**

```typescript
// lib/api/schemas.ts
import { z } from "zod";

export const InventoriesRequestSchema = z.object({
  shop_uuid: z.string().uuid("Invalid shop UUID format"),
  ids: z.array(z.string()).optional(),
});

export const ProfileRequestSchema = z
  .object({
    shop_id: z.union([z.string(), z.number()]).optional(),
    domain: z.string().url("Invalid domain format").optional(),
    subdomain: z.string().min(1).optional(),
  })
  .refine((data) => data.shop_id || data.domain || data.subdomain, {
    message: "At least one identifier is required",
  });

// Usage in API route:
// app/api/storefront/v1/inventories/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validated = InventoriesRequestSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validated.error.format(),
        },
        { status: 400 }
      );
    }

    const { shop_uuid, ids } = validated.data;
    // ... rest of logic
  } catch (error) {
    // ...
  }
}
```

**Action**: Install Zod, create schemas, validate all API routes

#### 3. Rate Limiting ⚠️ PRIORITY

**Current Issue**: No rate limiting on public endpoints

**Best Practice:**

```typescript
// lib/api/rate-limit.ts
import { LRUCache } from "lru-cache";

type RateLimitOptions = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export function rateLimit(options?: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (limit: number, token: string) => {
      const tokenCount = (tokenCache.get(token) as number) || 0;

      if (tokenCount >= limit) {
        return { success: false, remaining: 0 };
      }

      tokenCache.set(token, tokenCount + 1);
      return {
        success: true,
        remaining: limit - tokenCount - 1,
      };
    },
  };
}

// Usage:
// app/api/storefront/v1/inventories/route.ts
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  const { success, remaining } = limiter.check(10, ip); // 10 requests per minute

  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": "0",
          "Retry-After": "60",
        },
      }
    );
  }

  // ... rest of logic
}
```

**Action**: Implement rate limiting on all public API routes

### 📊 Error Handling Best Practices

#### 1. Standardized API Responses

**Create response helpers:**

```typescript
// lib/api/response-helpers.ts
import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: unknown;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export function apiSuccess<T>(
  data: T,
  meta?: ApiSuccessResponse<T>["meta"],
  options?: { status?: number; headers?: Record<string, string> }
) {
  return NextResponse.json<ApiSuccessResponse<T>>(
    { success: true, data, ...(meta && { meta }) },
    {
      status: options?.status || 200,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    }
  );
}

export function apiError(
  error: string,
  options?: {
    status?: number;
    code?: string;
    details?: unknown;
    headers?: Record<string, string>;
  }
) {
  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error,
      ...(options?.code && { code: options.code }),
      ...(options?.details && { details: options.details }),
    },
    {
      status: options?.status || 500,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    }
  );
}

// Usage:
export async function POST(request: NextRequest) {
  try {
    const data = await fetchData();
    return apiSuccess(data, { total: data.length });
  } catch (error) {
    return apiError("Failed to fetch data", {
      status: 500,
      code: "FETCH_ERROR",
    });
  }
}
```

#### 2. Result Type Pattern for Services

**Current**: Services return `null` on error (loses context)

**Better**: Use Result type

```typescript
// lib/api/result.ts
export type Result<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export function success<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function failure<E = Error>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Usage in service:
// lib/api/services/shop.service.ts
import { Result, success, failure } from "../result";

export const shopService = {
  async getProfile(params: ProfileParams): Promise<Result<ShopProfile>> {
    try {
      const { data } = await apiClient.post("/api/v1/live/profile", params);

      if (!data?.data?.id) {
        return failure(new Error("Shop not found"));
      }

      return success(data.data);
    } catch (error) {
      return failure(error as Error);
    }
  },
};

// Usage in component/hook:
const result = await shopService.getProfile(params);
if (result.ok) {
  console.log("Profile:", result.data);
} else {
  console.error("Error:", result.error.message);
}
```

### 🎯 Performance Best Practices

#### 1. Cache Strategy (Already Implemented ✅)

```typescript
// lib/constants/cache.ts
export const CACHE_TIMES = {
  PRODUCTS: { staleTime: 1 * 60 * 1000, gcTime: 5 * 60 * 1000 },
  PRODUCT_DETAIL: { staleTime: 2 * 60 * 1000, gcTime: 10 * 60 * 1000 },
  STATIC: { staleTime: Infinity, gcTime: Infinity },
  // ...
};
```

**Good job!** Cache times are well-differentiated.

#### 2. InitialData from Zustand Store (Implemented ✅)

**Pattern:** Use Zustand store data as `initialData` for React Query to enable instant page transitions.

```typescript
// hooks/useShopInventories.ts - REFERENCE IMPLEMENTATION
const { products: storeProducts } = useProductsStore();
const hasStoreData = storeProducts && storeProducts.length > 0;

const query = useQuery({
  queryKey: ["shop-inventories", params.shopUuid, params.ids],
  queryFn: async () => { /* fetch logic */ },
  enabled: enabled && !!params.shopUuid,
  // Use store data as initial data to prevent loading state on navigation
  initialData: hasStoreData ? storeProducts : undefined,
  ...CACHE_TIMES.SHOP_INVENTORIES,
  ...DEFAULT_QUERY_OPTIONS,
});

// Sync to Zustand store when data changes
useEffect(() => {
  if (syncToStore && query.data && query.data.length > 0) {
    setProducts(query.data as Product[]);
  }
}, [query.data, syncToStore, setProducts]);
```

**Hooks with initialData optimization:**
- ✅ `useShopInventories` - Uses products from `useProductsStore`
- ✅ `useShopCategories` - Uses categories from `useProductsStore`
- ✅ `useProductDetails` - Uses product from `useProductDetailsStore`
- ✅ `useProducts` - Uses products/pagination from `useProductsStore`
- ✅ `useHomepage` - Uses homepage from `useHomepageStore`
- ✅ `useTheme` - Uses theme from `useThemeStore`

**Benefits:**
1. Instant data display when navigating between pages
2. No loading spinners for already-loaded data
3. Data remains fresh via background refetch (staleTime)

#### 2. ISR (Incremental Static Regeneration) ✅

```typescript
// app/api/storefront/v1/products/route.ts
export const revalidate = 60; // Revalidate every 60 seconds
```

**Recommendation**: Consider dynamic revalidation based on data type:

- Real-time data (inventory): 30-60s
- Semi-static (categories): 5-10 minutes
- Static (theme config): 30 minutes

#### 3. Request Deduplication

**Add to API client:**

```typescript
// lib/api/client.ts
import axios from "axios";
import {
  throttleAdapterEnhancer,
  cacheAdapterEnhancer,
} from "axios-extensions";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  adapter: throttleAdapterEnhancer(
    cacheAdapterEnhancer(axios.defaults.adapter!, {
      enabledByDefault: false, // Only cache explicitly
      cacheFlag: "useCache",
    })
  ),
});

// Usage:
apiClient.get("/endpoint", { useCache: true, ttl: 1000 * 60 });
```

### 📝 Observability Best Practices

#### 1. Structured Logging

**Replace console.error with structured logging:**

```typescript
// lib/utils/logger.ts
type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
      environment: process.env.NEXT_PUBLIC_SYSTEM_ENV,
    };

    if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "production") {
      // Send to logging service (Datadog, LogRocket, etc.)
      console.log(JSON.stringify(logEntry));
    } else {
      // Pretty print in development
      console[level === "error" ? "error" : "log"](
        `[${level.toUpperCase()}] ${message}`,
        context
      );
    }
  }

  debug(message: string, context?: LogContext) {
    this.log("debug", message, context);
  }

  info(message: string, context?: LogContext) {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log("warn", message, context);
  }

  error(message: string, error?: Error, context?: LogContext) {
    this.log("error", message, {
      ...context,
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      },
    });
  }
}

export const logger = new Logger();

// Usage:
// lib/api/client.ts
import { logger } from "@/lib/utils/logger";

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error("API request failed", error, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);
```

#### 2. Request ID Tracking

**Add to middleware:**

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export function middleware(request: NextRequest) {
  const requestId = uuidv4();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-request-id", requestId);

  return response;
}

export const config = {
  matcher: "/api/:path*",
};

// Use in API routes:
export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id");
  logger.info("Processing request", { requestId });
  // ...
}
```

### 🧪 Testing Best Practices

#### 1. Mock API Services

```typescript
// lib/api/services/__mocks__/shop.service.ts
export const shopService = {
  getProfile: vi.fn(),
  getProducts: vi.fn(),
  getCategories: vi.fn(),
};

// __tests__/hooks/useShopProfile.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { useShopProfile } from "@/hooks/useShopProfile";
import { shopService } from "@/lib/api/services/shop.service";

vi.mock("@/lib/api/services/shop.service");

describe("useShopProfile", () => {
  it("fetches shop profile successfully", async () => {
    const mockProfile = { id: 1, shop_name: "Test Shop" };
    vi.mocked(shopService.getProfile).mockResolvedValue({
      ok: true,
      data: mockProfile,
    });

    const { result } = renderHook(() => useShopProfile({ shop_id: "1" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockProfile);
  });
});
```

---

## Improvement Roadmap

### 🔴 High Priority (Do First)

- [ ] **Add Zod validation** to all API routes
  - Install: `pnpm add zod`
  - Create: `lib/api/schemas.ts`
  - Apply to all routes in `app/api/storefront/v1/`
- [ ] **Implement rate limiting**
  - Install: `pnpm add lru-cache`
  - Create: `lib/api/rate-limit.ts`
  - Apply to public endpoints
- [ ] **Add environment variable validation**

  - Create: `lib/config/env.ts`
  - Validate at startup in `app/layout.tsx`

- [ ] **Standardize API responses**
  - Create: `lib/api/response-helpers.ts`
  - Update all API routes to use helpers

### 🟡 Medium Priority (Do Next)

- [ ] **Implement structured logging**

  - Create: `lib/utils/logger.ts`
  - Replace all `console.error` with logger
  - Add request ID tracking

- [ ] **Add Result type to services**

  - Create: `lib/api/result.ts`
  - Update all services to return `Result<T>`
  - Update hooks to handle Result type

- [ ] **Add API route tests**

  - Test each route with valid/invalid inputs
  - Test error handling
  - Test rate limiting

- [ ] **Add request/response logging**
  - Log all API calls in development
  - Log errors in production
  - Add performance metrics

### 🟢 Low Priority (Nice to Have)

- [ ] **API documentation with OpenAPI**

  - Install: `pnpm add swagger-jsdoc swagger-ui-react`
  - Generate docs from JSDoc comments
  - Serve at `/api/docs`

- [ ] **Request retry with exponential backoff** (Already in React Query ✅)

  - Already implemented in `DEFAULT_QUERY_OPTIONS`
  - Consider adding to apiClient for non-Query requests

- [ ] **API versioning strategy**

  - Current: `/api/storefront/v1/`
  - Plan for v2 migration path

- [ ] **Differentiated timeouts**
  - Fast endpoints: 5s
  - Medium endpoints: 15s
  - Slow endpoints: 30s

---

## Code Examples

### Complete API Route Example (Best Practices)

```typescript
// app/api/storefront/v1/inventories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiClient } from "@/lib/api/client";
import { apiSuccess, apiError } from "@/lib/api/response-helpers";
import { logger } from "@/lib/utils/logger";
import { rateLimit } from "@/lib/api/rate-limit";

// Revalidate every 2 minutes
export const revalidate = 120;

// Input validation schema
const InventoriesRequestSchema = z.object({
  shop_uuid: z.string().uuid("Invalid shop UUID format"),
  ids: z.array(z.string()).optional(),
});

// Rate limiter: 10 requests per minute per IP
const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id");

  try {
    // Rate limiting
    const ip = request.ip ?? "127.0.0.1";
    const { success: rateLimitOk, remaining } = limiter.check(10, ip);

    if (!rateLimitOk) {
      logger.warn("Rate limit exceeded", { ip, requestId });
      return apiError("Rate limit exceeded", {
        status: 429,
        code: "RATE_LIMIT_EXCEEDED",
        headers: {
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": "0",
          "Retry-After": "60",
        },
      });
    }

    // Parse and validate input
    const body = await request.json();
    const validated = InventoriesRequestSchema.safeParse(body);

    if (!validated.success) {
      logger.warn("Validation failed", {
        errors: validated.error.format(),
        requestId,
      });
      return apiError("Validation failed", {
        status: 400,
        code: "VALIDATION_ERROR",
        details: validated.error.format(),
      });
    }

    const { shop_uuid, ids } = validated.data;

    // Build endpoint with query params
    const endpoint = `/api/v1/live/inventories${
      ids && ids.length > 0 ? `?filter[id]=${ids.join(",")}` : ""
    }`;

    logger.info("Fetching inventories", {
      shop_uuid,
      idsCount: ids?.length,
      requestId,
    });

    // Call external API (encryption handled by interceptor)
    const { data } = await apiClient.post(endpoint, {
      identifier: shop_uuid,
    });

    // Return success response
    return apiSuccess(data.data || [], {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
        "X-RateLimit-Remaining": remaining.toString(),
        "X-Request-ID": requestId || "",
      },
    });
  } catch (error) {
    logger.error("Failed to fetch inventories", error as Error, { requestId });

    return apiError("Failed to fetch inventories", {
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      headers: {
        "Cache-Control": "no-store",
        "X-Request-ID": requestId || "",
      },
    });
  }
}
```

### Complete Service Example (Best Practices)

```typescript
// lib/api/services/shop.service.ts
import { apiClient } from "../client";
import { Result, success, failure } from "../result";
import type { ShopProfile, Product, Category } from "../types";
import { logger } from "@/lib/utils/logger";

export const shopService = {
  /**
   * Fetch shop profile by identifier
   * @returns Result with ShopProfile or Error
   */
  async getProfile(params: {
    shop_id?: string | number;
    domain?: string;
    subdomain?: string;
  }): Promise<Result<ShopProfile>> {
    try {
      logger.debug("Fetching shop profile", { params });

      const { data } = await apiClient.post<{ data: ShopProfile }>(
        "/api/v1/live/profile",
        params
      );

      if (!data?.data?.id) {
        return failure(new Error("Shop not found"));
      }

      logger.debug("Shop profile fetched successfully", {
        shop_id: data.data.id,
      });

      return success(data.data);
    } catch (error) {
      logger.error("Failed to fetch shop profile", error as Error, { params });
      return failure(error as Error);
    }
  },

  /**
   * Fetch shop products/inventories
   * Note: Uses 'identifier' key as expected by API
   */
  async getProducts(params: {
    shop_uuid: string;
    ids?: string[];
  }): Promise<Result<Product[]>> {
    try {
      const endpoint = `/api/v1/live/inventories${
        params.ids && params.ids.length > 0
          ? `?filter[id]=${params.ids.join(",")}`
          : ""
      }`;

      const { data } = await apiClient.post<{ data: Product[] }>(endpoint, {
        identifier: params.shop_uuid,
      });

      return success(data?.data || []);
    } catch (error) {
      logger.error("Failed to fetch products", error as Error, { params });
      return failure(error as Error);
    }
  },

  /**
   * Fetch shop categories
   */
  async getCategories(params: {
    shop_uuid: string;
    ids?: string[];
  }): Promise<Result<Category[]>> {
    try {
      const endpoint = `/api/v1/live/filtered_categories${
        params.ids && params.ids.length > 0
          ? `?filter[id]=${params.ids.join(",")}`
          : ""
      }`;

      const { data } = await apiClient.post<{ data: Category[] }>(endpoint, {
        identifier: params.shop_uuid,
      });

      return success(data?.data || []);
    } catch (error) {
      logger.error("Failed to fetch categories", error as Error, { params });
      return failure(error as Error);
    }
  },
};
```

### Complete Hook Example (Best Practices)

```typescript
// hooks/useShopProfile.ts
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { shopService } from "@/lib/api/services/shop.service";
import { useShopStore } from "@/stores";
import { CACHE_TIMES, DEFAULT_QUERY_OPTIONS } from "@/lib/constants";
import { logger } from "@/lib/utils/logger";

interface UseShopProfileParams {
  shop_id?: string | number;
  domain?: string;
  subdomain?: string;
}

export function useShopProfile(params: UseShopProfileParams) {
  const { setShopDetails } = useShopStore();

  const query = useQuery({
    queryKey: ["shop-profile", params],
    queryFn: async () => {
      const result = await shopService.getProfile(params);

      if (!result.ok) {
        logger.warn("Failed to fetch shop profile in hook", {
          error: result.error.message,
        });
        throw result.error;
      }

      return result.data;
    },
    enabled: !!(params.shop_id || params.domain || params.subdomain),
    ...CACHE_TIMES.SHOP_PROFILE,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Sync to Zustand store
  useEffect(() => {
    if (query.data) {
      setShopDetails(query.data);
    }
  }, [query.data, setShopDetails]);

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
```

---

## Migration Checklist

### Immediate Actions (This Week)

- [ ] Install dependencies:

  ```bash
  pnpm add zod lru-cache uuid
  pnpm add -D @types/uuid
  ```

- [ ] Create new utility files:

  - [ ] `lib/api/schemas.ts` - Zod validation schemas
  - [ ] `lib/api/response-helpers.ts` - Standardized responses
  - [ ] `lib/api/rate-limit.ts` - Rate limiting
  - [ ] `lib/api/result.ts` - Result type pattern
  - [ ] `lib/utils/logger.ts` - Structured logging
  - [ ] `lib/config/env.ts` - Environment validation

- [ ] Update existing files:
  - [ ] Add validation to all API routes
  - [ ] Add rate limiting to public endpoints
  - [ ] Replace `console.error` with `logger`
  - [ ] Update services to return `Result<T>`

### Testing Actions

- [ ] Test all API routes with invalid inputs
- [ ] Test rate limiting works correctly
- [ ] Test error responses are consistent
- [ ] Test Zod validation catches issues

### Documentation Actions

- [ ] Document all API endpoints
- [ ] Add JSDoc comments to services
- [ ] Create API usage examples
- [ ] Update README with new patterns

---

## Architecture Scorecard

| Category                   | Current Score | Target | Status                         |
| -------------------------- | ------------- | ------ | ------------------------------ |
| **Separation of Concerns** | 9/10          | 10/10  | ✅ Excellent                   |
| **Security**               | 7/10          | 9/10   | 🟡 Needs validation            |
| **Performance**            | 9/10          | 9/10   | ✅ Excellent (initialData opt) |
| **Error Handling**         | 7/10          | 9/10   | 🟡 Can improve                 |
| **Type Safety**            | 9/10          | 10/10  | ✅ Excellent                   |
| **Maintainability**        | 9/10          | 9/10   | ✅ Excellent (CACHE_TIMES)     |
| **Scalability**            | 7/10          | 9/10   | 🟡 Needs rate limiting         |
| **Observability**          | 5/10          | 8/10   | 🔴 Needs logging               |
| **Testing**                | 4/10          | 8/10   | 🔴 Needs tests                 |
| **Documentation**          | 7/10          | 8/10   | ✅ Good (updated)              |

**Overall: 7.8/10** → **Target: 8.5/10**

### Recent Improvements (January 2026)

1. ✅ **InitialData Optimization**: Added `initialData` from Zustand stores to 6 hooks for instant page transitions
2. ✅ **Centralized Cache Times**: Replaced hardcoded cache times with `CACHE_TIMES` constants in all hooks
3. ✅ **Service Consistency**: Updated `contact.service.ts` and `analytics.service.ts` to use centralized `apiClient`
4. ✅ **QueryProvider Optimization**: Removed global `staleTime` to let per-query `CACHE_TIMES` take effect

---

## Summary

### ✅ What's Working Well

1. **Centralized API Client** - Single source of truth ⭐⭐⭐
2. **Service Layer** - Clean, organized, reusable ⭐⭐⭐
3. **BFF Pattern** - Next.js API routes properly used ⭐⭐
4. **Cache Strategy** - Well-configured with CACHE_TIMES constants ⭐⭐⭐
5. **Type Safety** - Comprehensive TypeScript interfaces ⭐⭐⭐
6. **Encryption** - Automatic and transparent ⭐⭐
7. **React Query** - Proper hooks with initialData optimization ⭐⭐⭐
8. **Instant Navigation** - InitialData from Zustand prevents loading states ⭐⭐⭐

### ⚠️ Priority Improvements Needed

1. **Input Validation** - Add Zod schemas (1-2 days)
2. **Rate Limiting** - Prevent abuse (1 day)
3. **Env Validation** - Fail fast on missing vars (2 hours)
4. **Structured Logging** - Better observability (1 day)
5. **Response Standardization** - Consistent API contracts (1 day)

### 📈 Long-term Improvements

1. API documentation (OpenAPI/Swagger)
2. Comprehensive test coverage
3. Request/response monitoring
4. Performance metrics tracking
5. Error rate alerting

---

## References

- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/important-defaults)
- [Zod Validation](https://zod.dev/)
- [API Security Checklist](https://github.com/shieldfy/API-Security-Checklist)
- [Rate Limiting Strategies](https://stripe.com/blog/rate-limiters)

---

**Last Updated**: January 13, 2026
**Maintained By**: Development Team
**Version**: 2.1
