# API Structure Reorganization Plan

## Current Problems

1. **Scattered API Calls**: API calls are made from multiple locations:

   - `lib/api/` - Shop, OTP functions
   - `lib/payments/api.ts` - Payment functions
   - `hooks/` - Direct fetch calls in hooks
   - `app/api/` - Next.js API routes (server-side)
   - Various components making direct fetch calls

2. **Multiple API Clients**:

   - `lib/api/axios.config.ts` - Axios instance
   - `lib/configs/api.config.ts` - Another axios instance
   - `lib/configs/api-client.ts` - Yet another axios instance
   - Direct `fetch()` calls in hooks

3. **Inconsistent Patterns**:
   - Some use axios with encryption
   - Some use raw fetch
   - Different error handling approaches
   - Mixed Next.js API routes vs direct external API calls

## Proposed Solution: Centralized API Architecture

### 1. Single Source of Truth for API Configuration

```
lib/api/
├── index.ts              # Main export barrel
├── client.ts             # Configured axios instance
├── types.ts              # Shared API types
├── constants.ts          # API endpoints constants
├── services/             # Feature-based API services
│   ├── shop.service.ts   # Shop-related APIs
│   ├── product.service.ts # Product APIs
│   ├── order.service.ts  # Order/receipt APIs
│   ├── payment.service.ts # Payment gateway APIs
│   ├── otp.service.ts    # OTP verification
│   ├── contact.service.ts # Contact form
│   └── analytics.service.ts # Analytics tracking
└── utils/
    ├── encryption.ts     # Request/response encryption
    ├── error-handler.ts  # Centralized error handling
    └── interceptors.ts   # Axios interceptors
```

### 2. Next.js API Routes (`app/api/`)

**Purpose**: Server-side proxies and server-only operations

- Forward requests to external API with encryption
- Handle webhooks
- Server-side data transformation
- Protect sensitive API keys

### 3. Migration Strategy

**Phase 1: Consolidate API Clients** ✅ (Do Now)

- Merge `lib/api/axios.config.ts`, `lib/configs/api.config.ts`, `lib/configs/api-client.ts`
- Create single `lib/api/client.ts` with proper configuration
- Update all imports to use new client

**Phase 2: Create API Services** ✅ (Do Now)

- Move all API functions to feature-based services
- Standardize request/response patterns
- Implement consistent error handling

**Phase 3: Update Hooks** (After Phase 2)

- Update React Query hooks to use new services
- Remove direct fetch calls
- Ensure all hooks use centralized API services

**Phase 4: Organize Next.js API Routes** (After Phase 2)

- Keep only necessary server-side operations
- Remove redundant client-callable APIs
- Document which routes are for webhooks vs client calls

## Implementation Details

### API Client Configuration

```typescript
// lib/api/client.ts
import axios from "axios";
import { encryptRequest, decryptResponse } from "./utils/encryption";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Device-Type": "Web",
    "Application-Type": "Online_Shop",
  },
});

// Request interceptor for encryption
apiClient.interceptors.request.use(
  (config) => {
    // Add encryption for specific endpoints
    if (config.data && shouldEncrypt(config.url)) {
      config.data = encryptRequest(config.data);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for decryption
apiClient.interceptors.response.use(
  (response) => {
    // Decrypt response if needed
    if (shouldDecrypt(response.config.url)) {
      response.data = decryptResponse(response.data);
    }
    return response;
  },
  (error) => {
    return handleApiError(error);
  }
);
```

### Service Pattern

```typescript
// lib/api/services/shop.service.ts
import { apiClient } from "../client";
import type { ShopProfile, Product, Category } from "../types";

export const shopService = {
  async getProfile(params: {
    shop_id?: string;
    domain?: string;
    subdomain?: string;
  }): Promise<ShopProfile> {
    const { data } = await apiClient.post<{ data: ShopProfile }>(
      "/api/v1/live/profile",
      params
    );
    return data.data;
  },

  async getProducts(params: {
    shop_uuid: string;
    ids?: string[];
  }): Promise<Product[]> {
    const { data } = await apiClient.post<{ data: Product[] }>(
      "/api/v1/live/inventories",
      params
    );
    return data.data;
  },

  async getCategories(params: { shop_uuid: string }): Promise<Category[]> {
    const { data } = await apiClient.post<{ data: Category[] }>(
      "/api/v1/live/categories",
      params
    );
    return data.data;
  },
};
```

### Usage in Hooks

```typescript
// hooks/useShopProfile.ts
import { useQuery } from "@tanstack/react-query";
import { shopService } from "@/lib/api";

export function useShopProfile(params: { shop_id?: string }) {
  return useQuery({
    queryKey: ["shop-profile", params],
    queryFn: () => shopService.getProfile(params),
    staleTime: 1000 * 60 * 5,
  });
}
```

## File Cleanup Actions

### Files to Consolidate

1. ✅ Delete `lib/configs/api-client.ts` (duplicate)
2. ✅ Delete `lib/api/axios.config.ts` (duplicate)
3. ✅ Keep `lib/configs/api.config.ts` → Rename to `lib/api/client.ts`
4. ✅ Move `lib/api/shop.ts` → `lib/api/services/shop.service.ts`
5. ✅ Move `lib/api/otp.ts` → `lib/api/services/otp.service.ts`
6. ✅ Move `lib/payments/api.ts` → `lib/api/services/payment.service.ts`

### Next.js API Routes to Keep

- `app/api/orders/create/route.ts` - Server-side order processing
- `app/api/webhooks/*` - Payment webhooks (server-only)
- `app/api/storefront/*` - SSR data fetching (if needed)

### Next.js API Routes to Remove (if calling from client)

- Move client-callable logic to `lib/api/services/`
- Keep only server-side operations in `app/api/`

## Benefits

1. ✅ **Single Source of Truth**: One API client, one configuration
2. ✅ **Type Safety**: Centralized types and interfaces
3. ✅ **Consistent Error Handling**: Standardized across all API calls
4. ✅ **Easier Testing**: Mock services instead of scattered fetch calls
5. ✅ **Better Developer Experience**: Clear service boundaries
6. ✅ **Maintainability**: Easy to find and update API calls
7. ✅ **Performance**: Proper caching and request deduplication

## Next Steps

1. ✅ Consolidate API clients into `lib/api/client.ts`
2. ✅ Create service files in `lib/api/services/`
3. ✅ Update all imports across the project
4. ⏳ Test all API calls work correctly
5. ⏳ Remove old duplicate files
6. ⏳ Update documentation
