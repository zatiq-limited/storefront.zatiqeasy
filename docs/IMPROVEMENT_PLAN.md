# Storefront.zatiqeasy - Project Improvement Plan

**Last Updated:** December 23, 2025  
**Status:** Migration Phase Complete, Enhancement Phase In Progress

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Completed Work](#completed-work)
3. [Current Architecture](#current-architecture)
4. [Improvement Roadmap](#improvement-roadmap)
5. [Critical Issues](#critical-issues)
6. [Code Quality Standards](#code-quality-standards)
7. [Testing Strategy](#testing-strategy)
8. [Security Guidelines](#security-guidelines)
9. [Performance Optimization](#performance-optimization)
10. [Monitoring & Analytics](#monitoring--analytics)

---

## 📖 Project Overview

### Tech Stack

- **Framework:** Next.js 16.0.10 (App Router with Turbopack)
- **Language:** TypeScript
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod
- **UI Components:** Radix UI + Shadcn/ui
- **Styling:** Tailwind CSS
- **Data Fetching:** TanStack Query (React Query)
- **Payment Integration:** Multiple gateways (bKash, Nagad, AamarPay, COD)

### Project Structure

```
storefront.zatiqeasy/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Core library code
│   ├── api/               # ✅ Centralized API services
│   ├── utils/             # Utility functions
│   └── payments/          # Payment utilities
├── stores/                # Zustand stores
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
└── public/                # Static assets
```

---

## ✅ Completed Work

### Phase 1: API Centralization (COMPLETE)

#### What Was Done

1. **Created Centralized API Structure**

   - Location: `lib/api/`
   - Single axios instance with interceptors
   - Encryption/decryption handled automatically
   - Modular service layer architecture

2. **Migrated Services**

   - ✅ Shop Service (`lib/api/services/shop.service.ts`)
   - ✅ Order Service (`lib/api/services/order.service.ts`)
   - ✅ Payment Service (`lib/api/services/payment.service.ts`)
   - ✅ OTP Service (`lib/api/services/otp.service.ts`)
   - ✅ Contact Service (`lib/api/services/contact.service.ts`)
   - ✅ Analytics Service (`lib/api/services/analytics.service.ts`)

3. **Updated All Components**

   - 9 payment gateway components updated
   - Order manager migrated
   - Receipt page updated
   - API routes updated

4. **Removed Duplicates**
   - Deleted 3 duplicate API client files
   - Removed backward compatibility wrappers
   - Cleaned up unused imports

#### Benefits Achieved

- **Single Source of Truth:** All API calls go through centralized services
- **Type Safety:** Comprehensive TypeScript types for all API operations
- **Maintainability:** Easy to update API endpoints and logic
- **Consistency:** Uniform error handling and encryption
- **Developer Experience:** Clear import paths and autocomplete

---

## 🏗️ Current Architecture

### API Service Layer

```typescript
// Import pattern
import { shopService, paymentService, orderService } from "@/lib/api";

// Usage
const profile = await shopService.getProfile({ shop_id: "123" });
const order = await orderService.createOrder(payload);
const payment = await paymentService.createOrder(orderPayload);
```

### Service Structure

```
lib/api/
├── client.ts              # Axios instance + interceptors
├── types.ts               # All API types
├── index.ts               # Main exports
└── services/
    ├── shop.service.ts        # Products, categories, shop data
    ├── order.service.ts       # Order operations
    ├── payment.service.ts     # Payment & receipt operations
    ├── otp.service.ts         # Phone verification
    ├── contact.service.ts     # Contact forms
    └── analytics.service.ts   # Event tracking
```

### Encryption Flow

```
Request → Interceptor (encrypt) → API → Response → Interceptor (decrypt)
```

All encryption/decryption is handled automatically in axios interceptors.

---

## 🚀 Improvement Roadmap

### 🔴 Phase 2: Critical Fixes (Week 1)

#### Priority: IMMEDIATE

1. **Fix Unused Variables**

   ```typescript
   // File: lib/utils/storage.ts:150
   // Current (WRONG):
   for (const [shopId, store] of storeCache.entries()) {

   // Fixed:
   for (const [_shopId, store] of storeCache.entries()) {
   // OR
   for (const [, store] of storeCache.entries()) {
   ```

2. **Clean Up Unused Imports**

   ```bash
   # Run ESLint auto-fix
   pnpm lint --fix
   ```

3. **Environment Variable Validation**

   Create `lib/config/env.ts`:

   ```typescript
   const requiredEnvVars = [
     "NEXT_PUBLIC_API_URL",
     "NEXT_PUBLIC_ENCRYPTION_KEY",
   ] as const;

   // Validate on app startup
   requiredEnvVars.forEach((key) => {
     if (!process.env[key]) {
       throw new Error(`Missing required environment variable: ${key}`);
     }
   });

   export const config = {
     api: {
       baseUrl: process.env.NEXT_PUBLIC_API_URL!,
       timeout: parseInt(process.env.NEXT_PUBLIC_CACHE_TIMEOUT || "10000"),
     },
     encryption: {
       key: process.env.NEXT_PUBLIC_ENCRYPTION_KEY!,
     },
     system: {
       env: process.env.NEXT_PUBLIC_SYSTEM_ENV as "SHOPLINK" | "STANDALONE" | "development",
       theme: process.env.NEXT_PUBLIC_THEME_NAME || "Basic",
     },
   } as const;
   ```

4. **Implement Structured Logging**

   Create `lib/utils/logger.ts`:

   ```typescript
   type LogLevel = "debug" | "info" | "warn" | "error";

   class Logger {
     private isDev = process.env.NEXT_PUBLIC_SYSTEM_ENV === "development";

     private shouldLog(level: LogLevel): boolean {
       if (!this.isDev && level === "debug") return false;
       return true;
     }

     debug(message: string, data?: unknown) {
       if (this.shouldLog("debug")) {
         console.debug(`🔍 [DEBUG] ${message}`, data);
       }
     }

     info(message: string, data?: unknown) {
       if (this.shouldLog("info")) {
         console.info(`ℹ️ [INFO] ${message}`, data);
       }
     }

     warn(message: string, data?: unknown) {
       if (this.shouldLog("warn")) {
         console.warn(`⚠️ [WARN] ${message}`, data);
       }
     }

     error(message: string, error?: unknown) {
       if (this.shouldLog("error")) {
         console.error(`❌ [ERROR] ${message}`, error);
         // TODO: Send to error tracking service (Sentry)
       }
     }

     // Payment-specific logging
     payment(action: string, data?: unknown) {
       this.info(`💳 Payment: ${action}`, data);
     }

     // Order-specific logging
     order(action: string, data?: unknown) {
       this.info(`📦 Order: ${action}`, data);
     }
   }

   export const logger = new Logger();
   ```

   **Usage:**

   ```typescript
   // Replace all console.log/error with:
   import { logger } from "@/lib/utils/logger";

   logger.info("User logged in", { userId: "123" });
   logger.error("Failed to create order", error);
   logger.payment("Order created", { orderId: "456" });
   ```

---

### 🟡 Phase 3: Code Quality (Week 2)

#### 1. Add Error Boundaries

Create `app/error.tsx`:

```typescript
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/utils/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Application error", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          We apologize for the inconvenience. Please try again.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 mb-4">Error ID: {error.digest}</p>
        )}
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}
```

Create `components/shared/error-boundary.tsx`:

```typescript
"use client";

import React, { Component, ReactNode } from "react";
import { logger } from "@/lib/utils/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("React Error Boundary caught error", {
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <h3 className="text-red-900 font-semibold">Something went wrong</h3>
            <p className="text-red-700 text-sm mt-1">
              {this.state.error?.message}
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

#### 2. Setup Pre-commit Hooks

```bash
# Install dependencies
pnpm add -D husky lint-staged

# Initialize husky
pnpm exec husky init
```

Create `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

Update `package.json`:

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

#### 3. Stricter ESLint Configuration

Update `eslint.config.mjs`:

```javascript
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

export default [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",

      // React
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // General
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",

      // Import organization
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],
    },
  },
];
```

---

### 🟢 Phase 4: Testing Infrastructure (Week 3-4)

#### 1. Setup Vitest

```bash
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: [
        "node_modules/",
        ".next/",
        "coverage/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/types/",
      ],
    },
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

Create `vitest.setup.ts`:

```typescript
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));
```

#### 2. Example Tests

**Unit Test - Payment Service**

Create `lib/api/services/__tests__/payment.service.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { paymentService } from "../payment.service";
import { apiClient } from "../../client";
import { PaymentType } from "@/lib/payments/types";

vi.mock("../../client");

describe("PaymentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createOrder", () => {
    it("should create order successfully", async () => {
      const mockResponse = {
        data: {
          payment_url: "https://payment.example.com",
          receipt_id: "123",
          receipt_url: "/receipt/123",
          data: {
            receipt_id: "123",
            total_amount: 1000,
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const payload = {
        shop_id: 1,
        customer_name: "Test User",
        customer_phone: "+8801712345678",
        customer_address: "Test Address",
        delivery_charge: 50,
        tax_amount: 10,
        total_amount: 1060,
        payment_type: PaymentType.COD,
        pay_now_amount: 1060,
        receipt_items: [
          {
            inventory_id: 1,
            name: "Test Product",
            quantity: 2,
            price: 500,
            total_price: 1000,
          },
        ],
      };

      const result = await paymentService.createOrder(payload);

      expect(result.success).toBe(true);
      expect(result.data?.payment_url).toBe("https://payment.example.com");
      expect(result.data?.receipt_id).toBe("123");
      expect(apiClient.post).toHaveBeenCalledWith(
        "/api/v1/live/receipts",
        payload
      );
    });

    it("should handle errors gracefully", async () => {
      vi.mocked(apiClient.post).mockRejectedValue(new Error("Network error"));

      const payload = {
        shop_id: 1,
        customer_name: "Test User",
        customer_phone: "+8801712345678",
        customer_address: "Test Address",
        delivery_charge: 50,
        tax_amount: 10,
        total_amount: 1060,
        payment_type: PaymentType.COD,
        pay_now_amount: 1060,
        receipt_items: [],
      };

      const result = await paymentService.createOrder(payload);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("getReceiptDetails", () => {
    it("should fetch receipt details", async () => {
      const mockReceipt = {
        receipt_id: "123",
        customer_name: "Test User",
        total_amount: 1000,
        status: "completed",
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockReceipt },
      });

      const result = await paymentService.getReceiptDetails("123");

      expect(result.success).toBe(true);
      expect(result.data?.receipt_id).toBe("123");
    });
  });
});
```

**Integration Test - Order Flow**

Create `__tests__/integration/order-flow.test.tsx`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CheckoutPage from "@/app/(shop)/checkout/page";

describe("Order Flow Integration", () => {
  it("should complete full checkout flow", async () => {
    const queryClient = new QueryClient();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <CheckoutPage />
      </QueryClientProvider>
    );

    // Fill out customer information
    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, "Test User");

    const phoneInput = screen.getByLabelText(/phone/i);
    await user.type(phoneInput, "01712345678");

    // Select payment method
    const codButton = screen.getByText(/cash on delivery/i);
    await user.click(codButton);

    // Submit order
    const submitButton = screen.getByRole("button", { name: /place order/i });
    await user.click(submitButton);

    // Verify success
    await waitFor(() => {
      expect(
        screen.getByText(/order placed successfully/i)
      ).toBeInTheDocument();
    });
  });
});
```

#### 3. Testing Scripts

Update `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

#### 4. Testing Best Practices

**What to Test:**

- ✅ API service functions
- ✅ Utility functions (formatting, validation)
- ✅ Custom hooks
- ✅ Critical user flows (checkout, payment)
- ✅ Error handling scenarios

**What NOT to Test:**

- ❌ Third-party libraries
- ❌ Simple component renders
- ❌ Types/interfaces
- ❌ Configuration files

**Coverage Goals:**

- Services: 80%+
- Utilities: 90%+
- Components: 60%+
- Overall: 70%+

---

### 🔵 Phase 5: Security Enhancements (Week 5)

#### 1. Secure Environment Variables

**Update `.env.example`:**

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://easybill.zatiq.tech

# Encryption (IMPORTANT: Generate your own key)
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXT_PUBLIC_ENCRYPTION_KEY=REPLACE_WITH_YOUR_GENERATED_KEY

# System Configuration
NEXT_PUBLIC_SYSTEM_ENV=SHOPLINK
NEXT_PUBLIC_THEME_NAME=Basic

# Cache Configuration
NEXT_PUBLIC_CACHE_TIMEOUT=10000

# NEVER COMMIT YOUR ACTUAL .env FILE
# Add .env to .gitignore
```

**Security Checklist:**

- [ ] Never commit `.env` files
- [ ] Rotate encryption keys every 90 days
- [ ] Use environment-specific keys (dev/staging/prod)
- [ ] Store production keys in secure vault (Vercel Env Vars)

#### 2. Implement Rate Limiting

Create `middleware.ts`:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter (use Redis in production)
const rateLimit = new Map<string, { count: number; reset: number }>();

// Cleanup old entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.reset) {
      rateLimit.delete(key);
    }
  }
}, 60000);

export function middleware(request: NextRequest) {
  // Only rate limit API routes
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const ip =
    request.ip ?? request.headers.get("x-forwarded-for") ?? "anonymous";
  const now = Date.now();
  const limit = rateLimit.get(ip);

  const RATE_LIMIT = 100; // requests per minute
  const WINDOW = 60000; // 1 minute

  if (limit && now < limit.reset) {
    if (limit.count >= RATE_LIMIT) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil((limit.reset - now) / 1000)),
        },
      });
    }
    limit.count++;
  } else {
    rateLimit.set(ip, { count: 1, reset: now + WINDOW });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
```

#### 3. Input Validation & Sanitization

Create `lib/utils/validation.ts`:

```typescript
import { z } from "zod";

// Phone number validation
export const phoneSchema = z
  .string()
  .regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid Bangladesh phone number");

// Email validation
export const emailSchema = z.string().email("Invalid email address").max(254);

// Name validation (prevent XSS)
export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters");

// Sanitize HTML input
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove < and >
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .trim();
}

// Validate order amount
export const amountSchema = z
  .number()
  .positive("Amount must be positive")
  .max(1000000, "Amount too large")
  .multipleOf(0.01, "Invalid amount format");
```

#### 4. Security Headers

Update `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
```

---

### ⚡ Phase 6: Performance Optimization (Week 6)

#### 1. Request Deduplication

Create `lib/api/dedup.ts`:

```typescript
const pendingRequests = new Map<string, Promise<any>>();

export async function dedupRequest<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  // If request is already pending, return existing promise
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  // Create new request
  const promise = fn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}

// Usage in service
export const shopService = {
  async getProfile(params: { shop_id: string }) {
    return dedupRequest(`shop-${params.shop_id}`, async () => {
      const { data } = await apiClient.post("/shop/profile", params);
      return data;
    });
  },
};
```

#### 2. Response Caching

Create `lib/api/cache.ts`:

```typescript
import { unstable_cache } from "next/cache";
import { shopService } from "./services/shop.service";

// Cache shop profile for 1 hour
export const getCachedShopProfile = unstable_cache(
  async (shopId: string) => {
    return shopService.getProfile({ shop_id: shopId });
  },
  ["shop-profile"],
  {
    revalidate: 3600, // 1 hour
    tags: ["shop"],
  }
);

// Cache products for 5 minutes
export const getCachedProducts = unstable_cache(
  async (shopId: string, categoryId?: string) => {
    return shopService.getProducts({
      identifier: shopId,
      category_id: categoryId,
    });
  },
  ["shop-products"],
  {
    revalidate: 300, // 5 minutes
    tags: ["products"],
  }
);
```

#### 3. Image Optimization

Update `next.config.ts`:

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "easybill.zatiq.tech",
      },
      {
        protocol: "https",
        hostname: "**.zatiq.tech",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

**Usage:**

```typescript
import Image from "next/image";

// Always use Next.js Image component
<Image
  src={product.image_url}
  alt={product.name}
  width={300}
  height={300}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>;
```

#### 4. Bundle Optimization

Update `next.config.ts`:

```typescript
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "framer-motion",
    ],
  },

  webpack: (config, { isServer }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: "vendor",
            chunks: "all",
            test: /node_modules/,
            priority: 20,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    return config;
  },
};
```

#### 5. Performance Monitoring

```bash
pnpm add @vercel/analytics @vercel/speed-insights
```

Update `app/layout.tsx`:

```typescript
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## 📊 Monitoring & Analytics

### Error Tracking with Sentry

```bash
pnpm add @sentry/nextjs
```

Create `sentry.client.config.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  environment: process.env.NEXT_PUBLIC_SYSTEM_ENV,

  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }
    return event;
  },
});
```

### Custom Analytics Events

Create `lib/analytics/events.ts`:

```typescript
import { analyticsService } from "@/lib/api";

export const trackEvent = async (
  event: string,
  properties?: Record<string, unknown>
) => {
  // Track in your backend
  await analyticsService.trackEvent({
    event_name: event,
    properties,
    timestamp: new Date().toISOString(),
  });

  // Also track with Vercel Analytics
  if (typeof window !== "undefined" && window.va) {
    window.va("track", event, properties);
  }
};

// Predefined events
export const analytics = {
  // E-commerce events
  productViewed: (productId: string, productName: string) => {
    trackEvent("Product Viewed", { productId, productName });
  },

  addedToCart: (productId: string, quantity: number, price: number) => {
    trackEvent("Added to Cart", { productId, quantity, price });
  },

  checkoutStarted: (total: number, itemCount: number) => {
    trackEvent("Checkout Started", { total, itemCount });
  },

  orderCompleted: (orderId: string, total: number, paymentMethod: string) => {
    trackEvent("Order Completed", { orderId, total, paymentMethod });
  },

  paymentFailed: (reason: string) => {
    trackEvent("Payment Failed", { reason });
  },
};
```

---

## 📝 Code Quality Standards

### 1. TypeScript Guidelines

**Use strict types:**

```typescript
// ❌ BAD
const data: any = await fetchData();

// ✅ GOOD
interface UserData {
  id: string;
  name: string;
  email: string;
}
const data: UserData = await fetchData();
```

**Avoid optional chaining abuse:**

```typescript
// ❌ BAD
const value = data?.user?.profile?.settings?.theme;

// ✅ GOOD
const theme = data?.user?.profile?.settings?.theme ?? "default";
// OR provide proper type guards
```

### 2. Component Structure

```typescript
// 1. Imports (grouped)
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { shopService } from "@/lib/api";
import { logger } from "@/lib/utils/logger";

// 2. Types
interface Props {
  shopId: string;
  className?: string;
}

// 3. Component
export function ShopCard({ shopId, className }: Props) {
  // a. Hooks
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // b. Event handlers
  const handleClick = () => {
    logger.info("Shop card clicked", { shopId });
    router.push(`/shop/${shopId}`);
  };

  // c. Effects
  useEffect(() => {
    // ...
  }, []);

  // d. Render
  return <Card className={className}>{/* ... */}</Card>;
}
```

### 3. Naming Conventions

- **Components:** PascalCase (`UserProfile.tsx`)
- **Utilities:** camelCase (`formatPrice.ts`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Types/Interfaces:** PascalCase (`UserProfile`, `ApiResponse`)
- **Files:** kebab-case (`user-profile.tsx`, `api-client.ts`)

### 4. File Organization

```typescript
// Group related code together
// ❌ BAD - scattered
import { shopService } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// ✅ GOOD - grouped
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { shopService } from "@/lib/api";
```

---

## 🎯 Action Items Checklist

### Immediate (This Week)

- [ ] Fix unused variables in storage.ts
- [ ] Run `pnpm lint --fix` to clean up imports
- [ ] Create `lib/config/env.ts` for environment validation
- [ ] Create `lib/utils/logger.ts` and replace console.log
- [ ] Update error handling to use logger

### Week 2

- [ ] Add error boundaries (`app/error.tsx`)
- [ ] Setup husky and lint-staged
- [ ] Update ESLint configuration
- [ ] Create component error boundary wrapper
- [ ] Document all TODO items with Jira tickets

### Week 3-4

- [ ] Setup Vitest
- [ ] Write tests for payment service
- [ ] Write tests for order service
- [ ] Write tests for shop service
- [ ] Add integration tests for checkout flow
- [ ] Achieve 50%+ test coverage

### Week 5

- [ ] Update `.env.example` with security notes
- [ ] Implement rate limiting middleware
- [ ] Add input validation schemas
- [ ] Configure security headers
- [ ] Security audit of sensitive data handling

### Week 6

- [ ] Implement request deduplication
- [ ] Add response caching for read operations
- [ ] Optimize images with Next.js Image
- [ ] Configure bundle optimization
- [ ] Add Vercel Analytics
- [ ] Setup Sentry for error tracking

### Ongoing

- [ ] Code reviews for all PRs
- [ ] Update documentation as features evolve
- [ ] Monitor performance metrics
- [ ] Review and address TODOs
- [ ] Refactor complex components (>200 lines)

---

## 📚 Additional Resources

### Documentation to Create

1. `docs/API.md` - API service documentation
2. `docs/ARCHITECTURE.md` - System architecture overview
3. `docs/CONTRIBUTING.md` - Contribution guidelines
4. `docs/DEPLOYMENT.md` - Deployment procedures
5. `docs/TROUBLESHOOTING.md` - Common issues and solutions

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Best Practices](https://typescript-eslint.io/)
- [React Testing Library](https://testing-library.com/react)
- [Vitest Documentation](https://vitest.dev/)
- [Web Security Best Practices](https://owasp.org/)

---

## 🔄 Review & Update

This document should be reviewed and updated:

- **Weekly:** During sprint planning
- **Monthly:** Architecture review
- **Quarterly:** Major version updates
- **As Needed:** When adding new features/services

**Last Review:** December 23, 2025  
**Next Review:** January 1, 2026  
**Document Owner:** Senior Engineering Team

---

## ✅ Success Metrics

### Code Quality

- TypeScript errors: 0
- ESLint warnings: <10
- Test coverage: >70%
- Code duplication: <5%

### Performance

- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.5s
- Bundle size: <200KB (first load)

### Security

- No critical vulnerabilities
- No hardcoded secrets
- All inputs validated
- Rate limiting active

### Developer Experience

- Build time: <30s
- Hot reload: <2s
- Type checking: <10s
- All tests pass in CI/CD

---

**Document Version:** 1.0  
**Created:** December 23, 2025  
**Status:** Active
