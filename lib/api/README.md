# Centralized API Structure

## Overview

All external API calls are now centralized in `lib/api/` with a clean, service-based architecture. This provides:

- ✅ **Single Source of Truth** - One API client configuration
- ✅ **Type Safety** - Shared TypeScript types
- ✅ **Consistent Patterns** - Standardized request/response handling
- ✅ **Automatic Encryption** - Built into axios interceptors
- ✅ **Better Maintainability** - Easy to find and update API calls
- ✅ **Testing Ready** - Mock services instead of scattered calls

## Directory Structure

```
lib/api/
├── index.ts                      # Main export (use this!)
├── client.ts                     # Configured axios instance
├── types.ts                      # Shared API types
├── services/                     # Feature-based services
│   ├── shop.service.ts           # Shop profile, products, categories
│   ├── order.service.ts          # Order/receipt operations
│   ├── payment.service.ts        # Payment gateway
│   ├── otp.service.ts            # Phone verification
│   ├── contact.service.ts        # Contact form
│   └── analytics.service.ts      # Event tracking
├── shop.ts                       # @deprecated - backward compat
└── otp.ts                        # @deprecated - backward compat
```

## Usage Guide

### Import Services

```typescript
// ✅ Recommended: Import specific services
import { shopService, orderService, paymentService } from "@/lib/api";

// ✅ Alternative: Import all
import * as api from "@/lib/api";

// ❌ Old way (still works but deprecated)
import { fetchShopProfile } from "@/lib/api/shop";
```

### Example: Shop Service

```typescript
import { shopService } from "@/lib/api";

// Get shop profile
const profile = await shopService.getProfile({
  shop_id: "123",
  // OR
  domain: "example.com",
  // OR
  subdomain: "myshop",
});

// Get products
const products = await shopService.getProducts({
  shop_uuid: "abc-123",
  ids: ["1", "2", "3"], // optional filter
});

// Get categories
const categories = await shopService.getCategories({
  shop_uuid: "abc-123",
});
```

### Example: Order Service

```typescript
import { orderService } from "@/lib/api";

// Create order (automatically encrypted)
const result = await orderService.createOrder({
  shop_id: 123,
  customer_name: "John Doe",
  customer_phone: "+8801712345678",
  customer_address: "Dhaka, Bangladesh",
  delivery_charge: 60,
  tax_amount: 0,
  total_amount: 1060,
  payment_type: "bkash",
  pay_now_amount: 1060,
  receipt_items: [
    {
      inventory_id: 1,
      name: "Product Name",
      quantity: 1,
      price: 1000,
      total_price: 1000,
    },
  ],
});

if (result.success) {
  // Redirect to payment gateway
  window.location.href = result.data.payment_url;
}

// Get order details
const order = await orderService.getReceipt("receipt-123");
```

### Example: Payment Service

```typescript
import { paymentService } from "@/lib/api";

// Process payment
const result = await paymentService.processPayment({
  receipt_id: "123",
  payment_type: "bkash",
  amount: 1060,
  mfs_payment_phone: "+8801712345678",
});

// Verify payment
const verification = await paymentService.verifyPayment("txn-123");

// Get payment methods
const methods = await paymentService.getPaymentMethods(shopId);
```

### Example: OTP Service

```typescript
import { otpService } from "@/lib/api";

// Send OTP
const sendResult = await otpService.sendOTP({
  shop_id: 123,
  phone: "+8801712345678",
});

// Verify OTP
const verifyResult = await otpService.verifyOTP({
  shop_id: 123,
  phone: "+8801712345678",
  otp: "123456",
});

// Resend OTP
const resendResult = await otpService.resendOTP({
  shop_id: 123,
  phone: "+8801712345678",
});
```

### Example: Analytics Service

```typescript
import { analyticsService } from "@/lib/api";

// Track page view
await analyticsService.trackPageView(
  shopId,
  window.location.href,
  document.title
);

// Track product view
await analyticsService.trackProductView(
  shopId,
  productId,
  "Product Name",
  1000
);

// Track add to cart
await analyticsService.trackAddToCart(
  shopId,
  productId,
  "Product Name",
  1000,
  2 // quantity
);

// Track purchase
await analyticsService.trackPurchase(shopId, orderId, 1060, "bkash");
```

## Using in React Query Hooks

### Before (Old Pattern)

```typescript
// ❌ Old way - direct fetch in hooks
export function useShopProfile(params: { shop_id: string }) {
  return useQuery({
    queryKey: ["shop-profile", params],
    queryFn: async () => {
      const response = await fetch("/api/v1/live/profile", {
        method: "POST",
        body: JSON.stringify(params),
      });
      return response.json();
    },
  });
}
```

### After (New Pattern)

```typescript
// ✅ New way - use centralized service
import { shopService } from "@/lib/api";

export function useShopProfile(params: { shop_id: string }) {
  return useQuery({
    queryKey: ["shop-profile", params],
    queryFn: () => shopService.getProfile(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

## API Client Configuration

The centralized API client (`lib/api/client.ts`) handles:

- ✅ **Base URL**: From `NEXT_PUBLIC_API_URL` environment variable
- ✅ **Headers**: Automatically adds required headers
- ✅ **Encryption**: Automatic for specific endpoints
- ✅ **Decryption**: Automatic response decryption
- ✅ **Auth Tokens**: Adds Bearer token if available
- ✅ **Error Handling**: Standardized error responses

### Encrypted Endpoints

These endpoints automatically encrypt/decrypt:

- `/api/v1/live/receipts` (order creation)
- `/api/v1/live/pendingPayment` (payment processing)
- `/api/v1/live/inventories` (products)

## Next.js API Routes (`app/api/`)

**Purpose**: Server-side operations only

- ✅ `app/api/orders/create/route.ts` - Server-side order proxy
- ✅ `app/api/webhooks/*` - Payment webhooks (server-only)
- ✅ `app/api/storefront/*` - SSR data fetching (optional)

**Do NOT use Next.js API routes for client-callable APIs**. Use the centralized services in `lib/api/services/` instead.

## Migration Guide

### Step 1: Update Imports

```typescript
// Before
import { fetchShopProfile } from "@/lib/api/shop";
import { sendOTP } from "@/lib/api/otp";

// After
import { shopService, otpService } from "@/lib/api";
```

### Step 2: Update Function Calls

```typescript
// Before
const profile = await fetchShopProfile({ shop_id: "123" });
const result = await sendOTP({ shop_id: 123, phone: "+8801712345678" });

// After
const profile = await shopService.getProfile({ shop_id: "123" });
const result = await otpService.sendOTP({
  shop_id: 123,
  phone: "+8801712345678",
});
```

### Step 3: Update React Query Hooks

```typescript
// Before
const { data } = useQuery(["shop-profile"], () =>
  fetchShopProfile({ shop_id: "123" })
);

// After
const { data } = useQuery(["shop-profile"], () =>
  shopService.getProfile({ shop_id: "123" })
);
```

## Benefits

### 1. Single Configuration Point

```typescript
// All API calls use the same client with consistent config
// No more scattered axios instances or fetch calls
```

### 2. Automatic Encryption

```typescript
// Encryption happens automatically for configured endpoints
// No need to manually encrypt/decrypt in every function
const order = await orderService.createOrder(payload);
// ✅ Payload is automatically encrypted
// ✅ Response is automatically decrypted
```

### 3. Type Safety

```typescript
// All request/response types are defined in lib/api/types.ts
import type { ShopProfile, CreateOrderPayload } from "@/lib/api";
```

### 4. Easier Testing

```typescript
// Mock entire services instead of individual functions
jest.mock("@/lib/api", () => ({
  shopService: {
    getProfile: jest.fn(),
    getProducts: jest.fn(),
  },
}));
```

### 5. Better Developer Experience

```typescript
// IDE autocomplete for all services and their methods
shopService. // ← IDE shows: getProfile, getProducts, getCategories
orderService. // ← IDE shows: createOrder, getReceipt, updateOrderStatus
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=https://api.zatiqeasy.com

# Optional (use defaults if not set)
NEXT_PUBLIC_PAYMENT_API_URL=https://easybill.zatiq.tech/api/v1
NEXT_PUBLIC_OTP_API_URL=/api/otp
```

## Error Handling

All services return consistent error responses:

```typescript
const result = await orderService.createOrder(payload);

if (result.success) {
  // Success
  console.log(result.data);
} else {
  // Error
  console.error(result.error);
}
```

## Next Steps

1. ✅ **Phase 1 Complete**: Centralized API structure created
2. ⏳ **Phase 2**: Update all hooks to use new services
3. ⏳ **Phase 3**: Remove old duplicate API client files
4. ⏳ **Phase 4**: Update Next.js API routes (keep only server-side operations)

## Questions?

See `API_STRUCTURE_PLAN.md` for detailed architecture documentation.
