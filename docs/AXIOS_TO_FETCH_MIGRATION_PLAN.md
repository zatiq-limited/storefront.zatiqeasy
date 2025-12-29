# Axios to Fetch Migration Plan

## Overview

This document outlines the plan to migrate from `axios` to native `fetch` API in the storefront project.

**Current Status:** Using axios v1.13.2
**Target:** Native fetch API with crypto-js for encryption

---

## Current State Analysis

### Dependencies

```json
{
  "axios": "^1.13.2",
  "crypto-js": "^4.2.0"
}
```

### Files Using apiClient

| File | Type | Methods Used |
|------|------|--------------|
| `app/api/storefront/v1/categories/route.ts` | Server API Route | `apiClient.post()` |
| `app/api/storefront/v1/inventories/route.ts` | Server API Route | `apiClient.post()` |
| `app/api/storefront/v1/products/[handle]/route.ts` | Server API Route | `apiClient.get()` |
| `app/api/storefront/v1/profile/route.ts` | Server API Route | `apiClient.post()` |
| `app/api/storefront/v1/landing/[slug]/route.ts` | Server API Route | `apiClient.post()` |
| `app/api/orders/verify-phone/route.ts` | Server API Route | `apiClient.post()` |
| `lib/api/services/payment.service.ts` | Service | `get()`, `post()` (10 methods) |

### Encrypted Endpoints

The following endpoints require encryption/decryption:

- `/api/v1/live/receipts`
- `/api/v1/live/pendingPayment`
- `/api/v1/live/inventories`
- `/api/v1/receipts/view/`

---

## Critical Issues Identified

### Issue 1: Node.js crypto Dependency

**File:** `lib/utils/encrypt-decrypt.ts`

```typescript
import crypto from "crypto";  // ❌ Server-only, doesn't work in browser
const hash = crypto.createHash("sha256");
hash.update("");
const hashedIv = hash.digest("hex");
```

**Problem:** Using Node.js `crypto` module causes issues when code runs in different contexts (server vs client).

**Solution:** Use `crypto-js` for all crypto operations:

```typescript
import CryptoJS from "crypto-js";  // ✅ Works everywhere
const hashedIv = CryptoJS.SHA256("").toString();
```

### Issue 2: Decryption Logic Assumes All Responses Are Encrypted

The external API only encrypts **successful** responses. Error responses return plain JSON.

**Current wrong approach:**
```typescript
// ❌ Tries to decrypt everything
if (shouldDecrypt(endpoint)) {
  const decrypted = decryptData(data);  // Fails on error responses
}
```

**Correct approach:**
```typescript
// ✅ Only decrypt if payload exists
if (shouldDecrypt(endpoint) && data.payload) {
  const decrypted = decryptData(data.payload);
  return decrypted;
}
return data;  // Return as-is if no payload
```

---

## Migration Plan

### Phase 1: Fix Encryption/Decryption Utility

**File:** `lib/utils/encrypt-decrypt.ts`

**Changes:**
1. Remove `import crypto from "crypto"`
2. Replace `crypto.createHash("sha256")` with `CryptoJS.SHA256()`
3. Ensure all operations use `crypto-js` only

**Before:**
```typescript
import CryptoJS from "crypto-js";
import crypto from "crypto";

export function decryptData(encryptedData: string): unknown {
  const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";
  const hash = crypto.createHash("sha256");  // ❌ Node.js only
  hash.update("");
  const hashedIv = hash.digest("hex");
  const ENCRYPTION_IV = hashedIv.slice(0, 16);
  // ...
}
```

**After:**
```typescript
import CryptoJS from "crypto-js";

export function decryptData(encryptedData: string): unknown {
  const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";
  const hashedIv = CryptoJS.SHA256("").toString();  // ✅ Works everywhere
  const ENCRYPTION_IV = hashedIv.slice(0, 16);
  // ...
}
```

### Phase 2: Create Fetch-Based API Client

**File:** `lib/api/client.ts`

**Interface to maintain:**
```typescript
export const apiClient = {
  get<T>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>>
  post<T>(url: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<T>>
  put<T>(url: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<T>>
  patch<T>(url: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<T>>
  delete<T>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>>
}
```

**Key implementation details:**

1. **Response wrapper:** Maintain `{ data: T }` return format
2. **Encryption:** Check `shouldEncrypt()` before sending
3. **Decryption:** Only decrypt if `response.data.payload` exists
4. **Auth:** Add `Authorization` header from localStorage
5. **Error handling:** Throw errors with status, statusText, data

**Skeleton:**
```typescript
import { encryptData, decryptData } from "@/lib/utils/encrypt-decrypt";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://easybill.zatiq.tech";

function getDefaultHeaders() {
  return {
    "Content-Type": "application/json",
    "Device-Type": "Web",
    "Application-Type": "Online_Shop",
    Referer: "https://shop.zatiqeasy.com",
    "User-Agent": typeof window !== "undefined" ? window.navigator.userAgent : "NextJS Server",
  };
}

function shouldEncrypt(url?: string): boolean {
  if (!url) return false;
  const encryptedEndpoints = [
    "/api/v1/live/receipts",
    "/api/v1/live/pendingPayment",
    "/api/v1/live/inventories",
    "/api/v1/receipts/view/",
  ];
  return encryptedEndpoints.some((endpoint) => url.includes(endpoint));
}

async function fetchWrapper<T>(
  method: string,
  endpoint: string,
  data?: unknown,
  options?: RequestInit
): Promise<{ data: T }> {
  // 1. Build URL
  const url = `${API_BASE_URL}${endpoint}`;

  // 2. Prepare body (encrypt if needed)
  let body: BodyInit | undefined;
  if (data && shouldEncrypt(endpoint)) {
    const encrypted = encryptData(data as Record<string, unknown>);
    body = JSON.stringify({ payload: encrypted });
  } else if (data) {
    body = JSON.stringify(data);
  }

  // 3. Prepare headers
  const headers = {
    ...getDefaultHeaders(),
    ...(options?.headers || {}),
  };

  // Add auth token
  const token = typeof window !== "undefined"
    ? localStorage.getItem("zatiq_auth_token")
    : null;
  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  // 4. Fetch
  const response = await fetch(url, {
    method,
    headers,
    body,
    ...options,
  });

  // 5. Parse response
  const responseData = await response.json();

  // 6. Decrypt if needed
  let finalData = responseData;
  if (shouldEncrypt(endpoint) && responseData?.payload) {
    finalData = decryptData(responseData.payload);
  }

  // 7. Handle errors
  if (!response.ok) {
    const error = new Error(response.statusText) as any;
    error.status = response.status;
    error.data = finalData;
    throw error;
  }

  return { data: finalData as T };
}

export const apiClient = {
  get: <T>(url: string, options?: RequestInit) => fetchWrapper<T>("GET", url, undefined, options),
  post: <T>(url: string, data?: unknown, options?: RequestInit) => fetchWrapper<T>("POST", url, data, options),
  put: <T>(url: string, data?: unknown, options?: RequestInit) => fetchWrapper<T>("PUT", url, data, options),
  patch: <T>(url: string, data?: unknown, options?: RequestInit) => fetchWrapper<T>("PATCH", url, data, options),
  delete: <T>(url: string, options?: RequestInit) => fetchWrapper<T>("DELETE", url, undefined, options),
};
```

### Phase 3: Update Route Handlers

No changes needed in route handlers - they use `apiClient` which maintains the same interface:

```typescript
// This stays the same
const { data } = await apiClient.post(endpoint, { identifier: shop_uuid });
if (!data?.data) { ... }
```

### Phase 4: Update Payment Service

No changes needed - same interface maintained:

```typescript
// This stays the same
const { data } = await apiClient.post("/api/v1/live/receipts", payload);
return { success: true, data };
```

### Phase 5: Remove Axios Dependency

```bash
pnpm remove axios
```

---

## Testing Checklist

Before considering the migration complete:

- [ ] Categories API returns data correctly
- [ ] Inventories API returns data correctly
- [ ] Product details API returns data correctly
- [ ] Profile API returns data correctly
- [ ] Payment flow works (create order, process payment)
- [ ] Encrypted endpoints decrypt correctly
- [ ] Error responses (401, 403, 500) are handled properly
- [ ] Auth token is added to requests
- [ ] Build succeeds: `pnpm build`
- [ ] TypeScript passes: `npx tsc --noEmit`

---

## Rollback Plan

If issues occur:

1. Revert `lib/api/client.ts` to axios version
2. Revert `lib/utils/encrypt-decrypt.ts` to original
3. Run: `pnpm add axios@^1.13.2`

---

## Files to Modify

| File | Changes |
|------|---------|
| `lib/utils/encrypt-decrypt.ts` | Replace Node.js crypto with crypto-js |
| `lib/api/client.ts` | Replace axios with fetch |
| `package.json` | Remove axios dependency |

---

## Estimated Impact

- **Bundle size:** ~50KB reduction (gzipped)
- **Build time:** No change
- **Runtime performance:** Negligible difference
- **Maintenance:** Reduced external dependency

---

## Recommendation

**Keep axios** unless there's a specific requirement to remove it:

- It's working perfectly
- Old project also uses axios
- Low risk
- Small bundle impact

Proceed with migration only if:
1. Reducing bundle size is critical
2. Removing dependencies is a project requirement
3. Native fetch is preferred for consistency
