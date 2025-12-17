# Next.js Migration Plan: Zatiq Storefront

## Project Overview

| Current | Target |
|---------|--------|
| Astro 5.15.9 + React 19 | Next.js 15 + React 19 |
| `/home/sumon7866/Zatiq/zatiq-easy/storefront.zatiqeasy` | New Next.js Project |

---

## Migration Inventory Summary

| Category | Files | Migration Effort |
|----------|-------|------------------|
| **Pages** | 13 `.astro` files | Convert to App Router |
| **Zatiq Components** | 118 files (21 categories) | Copy as-is (React) |
| **Core Renderers** | 11 files | Minor updates |
| **Block Renderers** | 5 files | Copy as-is |
| **UI Components** | 5 files | Copy as-is |
| **Utilities** | 5 files | Minor updates |
| **Providers** | 1 file | Already Next.js compatible |
| **Data/Mock** | 24 files | Copy as-is |
| **Styles** | 1 file | Copy as-is |
| **Total** | ~183 files | |

---

## Phase 1: Project Setup

### 1.1 Create Next.js Project

```bash
# Create new Next.js 15 project
npx create-next-app@latest zatiq-storefront-nextjs \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd zatiq-storefront-nextjs
```

### 1.2 Install Dependencies

```bash
# UI Libraries
pnpm add @radix-ui/react-select @radix-ui/react-slot
pnpm add lucide-react

# Carousel & Animation
pnpm add embla-carousel-react embla-carousel-autoplay
pnpm add swiper
pnpm add canvas-confetti

# Utilities
pnpm add clsx tailwind-merge class-variance-authority

# Types
pnpm add -D @types/canvas-confetti
```

### 1.3 Configure Path Aliases

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@lib/*": ["./src/lib/*"],
      "@data/*": ["./src/data/*"],
      "@styles/*": ["./src/styles/*"],
      "@providers/*": ["./src/providers/*"]
    }
  }
}
```

### 1.4 Project Structure

```
zatiq-storefront-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx        # Products listing
│   │   │   └── [handle]/
│   │   │       └── page.tsx    # Product detail
│   │   ├── collections/
│   │   │   ├── page.tsx        # Collections listing
│   │   │   └── [handle]/
│   │   │       └── page.tsx    # Collection detail
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   ├── about-us/
│   │   │   └── page.tsx
│   │   ├── contact-us/
│   │   │   └── page.tsx
│   │   ├── privacy-policy/
│   │   │   └── page.tsx
│   │   ├── order-success/
│   │   │   └── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   └── not-found.tsx       # 404 page
│   │
│   ├── components/
│   │   ├── BlockRenderer.tsx
│   │   ├── ComponentRenderer.tsx
│   │   ├── DynamicPageRenderer.tsx
│   │   ├── ProductsPageRenderer.tsx
│   │   ├── ProductDetailsPageRenderer.tsx
│   │   ├── CollectionsPageRenderer.tsx
│   │   ├── CollectionDetailsPageRenderer.tsx
│   │   ├── CheckoutPageRenderer.tsx
│   │   ├── SectionRenderer.tsx
│   │   ├── TemplateRenderer.tsx
│   │   ├── ThemeLayout.tsx
│   │   │
│   │   ├── block-renderers/
│   │   │   ├── IconRenderer.tsx
│   │   │   ├── MarqueeRenderer.tsx
│   │   │   ├── RepeaterRenderer.tsx
│   │   │   ├── SwiperRenderer.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── carousel.tsx
│   │   │   └── marquee.tsx
│   │   │
│   │   └── zatiq/              # 118 feature components
│   │       ├── about-us/
│   │       ├── announcement-bars/
│   │       ├── badges/
│   │       ├── brands/
│   │       ├── categories/
│   │       ├── checkout/
│   │       ├── collection-details/
│   │       ├── collections/
│   │       ├── contact-us/
│   │       ├── custom-sections/
│   │       ├── footers/
│   │       ├── heroes/
│   │       ├── payment-status/
│   │       ├── privacy-policy/
│   │       ├── product-cards/
│   │       ├── product-collection/
│   │       ├── product-details/
│   │       ├── product-tabs/
│   │       ├── products-page/
│   │       ├── reviews/
│   │       ├── social-feed/
│   │       └── static-banners/
│   │
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── block-utils.ts
│   │   ├── component-registry.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── providers/
│   │   └── ThemeProvider.tsx
│   │
│   ├── data/
│   │   ├── api-responses/      # 22 JSON files
│   │   ├── mock-theme.ts
│   │   └── mock-products.ts
│   │
│   └── styles/
│       └── globals.css
│
├── public/
│   └── assets/                 # Images from src/assets
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Phase 2: Copy Portable Files (No Changes Required)

### 2.1 Direct Copy - React Components

These files work in Next.js without modification:

```bash
# Zatiq Components (118 files)
cp -r storefront.zatiqeasy/src/components/zatiq/* nextjs-project/src/components/zatiq/

# UI Components (5 files)
cp -r storefront.zatiqeasy/src/components/ui/* nextjs-project/src/components/ui/

# Block Renderers (5 files)
cp -r storefront.zatiqeasy/src/components/block-renderers/* nextjs-project/src/components/block-renderers/
```

### 2.2 Direct Copy - Utilities

```bash
# Lib files (5 files)
cp storefront.zatiqeasy/src/lib/types.ts nextjs-project/src/lib/
cp storefront.zatiqeasy/src/lib/utils.ts nextjs-project/src/lib/
cp storefront.zatiqeasy/src/lib/block-utils.ts nextjs-project/src/lib/
cp storefront.zatiqeasy/src/lib/component-registry.ts nextjs-project/src/lib/
```

### 2.3 Direct Copy - Data Files

```bash
# Mock data and API responses
cp -r storefront.zatiqeasy/src/data/* nextjs-project/src/data/
```

### 2.4 Direct Copy - Assets

```bash
# Move to public folder for Next.js
cp -r storefront.zatiqeasy/src/assets/* nextjs-project/public/assets/
```

---

## Phase 3: Files Requiring Minor Updates

### 3.1 Core Renderers - Add 'use client'

These files need `'use client'` directive at top:

| File | Change Required |
|------|-----------------|
| `BlockRenderer.tsx` | Add `'use client'` |
| `ComponentRenderer.tsx` | Add `'use client'` |
| `DynamicPageRenderer.tsx` | Add `'use client'` |
| `ProductsPageRenderer.tsx` | Add `'use client'` |
| `ProductDetailsPageRenderer.tsx` | Add `'use client'` |
| `CollectionsPageRenderer.tsx` | Add `'use client'` |
| `CollectionDetailsPageRenderer.tsx` | Add `'use client'` |
| `CheckoutPageRenderer.tsx` | Add `'use client'` |
| `SectionRenderer.tsx` | Add `'use client'` |
| `TemplateRenderer.tsx` | Add `'use client'` |
| `ThemeLayout.tsx` | Add `'use client'` |

**Example:**
```typescript
// Before (Astro)
import React from 'react';
...

// After (Next.js)
'use client';

import React from 'react';
...
```

### 3.2 ThemeProvider - Already Compatible

The `ThemeProvider.tsx` already has `'use client'` directive - copy as-is.

### 3.3 API Client - Update for Server Actions

```typescript
// src/lib/api-client.ts

// BEFORE: Environment variables with PUBLIC_ prefix
const API_URL = import.meta.env.PUBLIC_API_URL;
const SHOP_ID = import.meta.env.PUBLIC_SHOP_ID;

// AFTER: Next.js environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SHOP_ID = process.env.NEXT_PUBLIC_SHOP_ID;

// For server-only (API routes/Server Actions):
const API_SECRET = process.env.API_SECRET_KEY; // No NEXT_PUBLIC_ prefix
```

### 3.4 Environment Variables

Create `.env.local`:
```bash
# Public (exposed to browser)
NEXT_PUBLIC_API_URL=https://api.zatiq.com
NEXT_PUBLIC_SHOP_ID=shop_demo_12345
NEXT_PUBLIC_CDN_URL=https://cdn.zatiq.com

# Private (server-only)
API_SECRET_KEY=sk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
```

---

## Phase 4: Convert Astro Pages to Next.js

### 4.1 Page Conversion Map

| Astro Page | Next.js Route | Type |
|------------|---------------|------|
| `pages/index.astro` | `app/page.tsx` | Server Component |
| `pages/products.astro` | `app/products/page.tsx` | Server Component |
| `pages/products/[handle].astro` | `app/products/[handle]/page.tsx` | Server Component |
| `pages/collections.astro` | `app/collections/page.tsx` | Server Component |
| `pages/collections/[handle].astro` | `app/collections/[handle]/page.tsx` | Server Component |
| `pages/checkout.astro` | `app/checkout/page.tsx` | Server Component |
| `pages/about-us.astro` | `app/about-us/page.tsx` | Server Component |
| `pages/contact-us.astro` | `app/contact-us/page.tsx` | Server Component |
| `pages/privacy-policy.astro` | `app/privacy-policy/page.tsx` | Server Component |
| `pages/order-success.astro` | `app/order-success/page.tsx` | Server Component |
| `pages/search.astro` | `app/search/page.tsx` | Server Component |
| `pages/404.astro` | `app/not-found.tsx` | Server Component |

### 4.2 Conversion Examples

#### Homepage

```typescript
// BEFORE: src/pages/index.astro
---
import Layout from '../layouts/main.astro';
import { getHomepageData } from '../lib/api-client';
import DynamicPageRenderer from '../components/DynamicPageRenderer';

const pageData = await getHomepageData();
---
<Layout title="Home">
  <DynamicPageRenderer page={pageData} client:load />
</Layout>

// AFTER: src/app/page.tsx
import { getHomepageData } from '@/lib/api-client';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export default async function HomePage() {
  const pageData = await getHomepageData();

  return <DynamicPageRenderer page={pageData} />;
}

// Metadata
export const metadata = {
  title: 'Home | Zatiq Store',
  description: 'Welcome to Zatiq Store',
};
```

#### Products Page (with Search Params)

```typescript
// BEFORE: src/pages/products.astro
---
import Layout from '../layouts/main.astro';
import { getProductsPageData } from '../lib/api-client';

const url = new URL(Astro.request.url);
const page = Number(url.searchParams.get('page')) || 1;
const category = url.searchParams.get('category') || '';
const sort = url.searchParams.get('sort') || '';
const search = url.searchParams.get('search') || '';

const pageData = await getProductsPageData({ page, category, sort, search });
---
<Layout title="Products">
  <ProductsPageRenderer data={pageData} client:load />
</Layout>

// AFTER: src/app/products/page.tsx
import { getProductsPageData } from '@/lib/api-client';
import ProductsPageRenderer from '@/components/ProductsPageRenderer';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = params.category || '';
  const sort = params.sort || '';
  const search = params.search || '';

  const pageData = await getProductsPageData({ page, category, sort, search });

  return <ProductsPageRenderer data={pageData} />;
}

export const metadata = {
  title: 'Products | Zatiq Store',
};
```

#### Dynamic Product Page

```typescript
// BEFORE: src/pages/products/[handle].astro
---
export const prerender = false;
import Layout from '../../layouts/main.astro';
import { getProductData } from '../../lib/api-client';

const { handle } = Astro.params;
const pageData = await getProductData(handle);

if (!pageData) {
  return Astro.redirect('/404');
}
---
<Layout title={pageData.product?.name || 'Product'}>
  <ProductDetailsPageRenderer data={pageData} client:load />
</Layout>

// AFTER: src/app/products/[handle]/page.tsx
import { notFound } from 'next/navigation';
import { getProductData } from '@/lib/api-client';
import ProductDetailsPageRenderer from '@/components/ProductDetailsPageRenderer';

interface PageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { handle } = await params;
  const pageData = await getProductData(handle);

  if (!pageData) {
    notFound();
  }

  return <ProductDetailsPageRenderer data={pageData} />;
}

// Dynamic metadata
export async function generateMetadata({ params }: PageProps) {
  const { handle } = await params;
  const pageData = await getProductData(handle);

  return {
    title: `${pageData?.product?.name || 'Product'} | Zatiq Store`,
    description: pageData?.product?.description,
  };
}
```

### 4.3 Root Layout

```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { getTheme } from '@/lib/api-client';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Zatiq Store',
  description: 'Your one-stop shop',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 4.4 404 Page

```typescript
// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-lg">Page not found</p>
      <Link href="/" className="mt-6 text-blue-600 hover:underline">
        Go back home
      </Link>
    </div>
  );
}
```

---

## Phase 5: Loading & Error States

### 5.1 Loading States

```typescript
// src/app/products/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
}
```

### 5.2 Error Boundaries

```typescript
// src/app/products/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-primary text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
```

---

## Phase 6: Server Actions (Security Enhancement)

### 6.1 Cart Actions

```typescript
// src/app/actions/cart.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function addToCart(productId: string, quantity: number) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('cart_token')?.value;

  const response = await fetch(`${process.env.API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_SECRET_KEY}`,
      'X-Cart-Token': cartToken || '',
    },
    body: JSON.stringify({ productId, quantity }),
  });

  const data = await response.json();

  // Set cart token in httpOnly cookie
  if (data.cartToken) {
    cookieStore.set('cart_token', data.cartToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  revalidatePath('/cart');
  return data;
}

export async function removeFromCart(itemId: string) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('cart_token')?.value;

  const response = await fetch(`${process.env.API_URL}/cart/remove`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_SECRET_KEY}`,
      'X-Cart-Token': cartToken || '',
    },
    body: JSON.stringify({ itemId }),
  });

  revalidatePath('/cart');
  return response.json();
}
```

### 6.2 Checkout Actions

```typescript
// src/app/actions/checkout.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function processCheckout(formData: FormData) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('cart_token')?.value;

  if (!cartToken) {
    throw new Error('No cart found');
  }

  const checkoutData = {
    email: formData.get('email'),
    shippingAddress: {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      address: formData.get('address'),
      city: formData.get('city'),
      postcode: formData.get('postcode'),
    },
    paymentMethod: formData.get('paymentMethod'),
  };

  const response = await fetch(`${process.env.API_URL}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_SECRET_KEY}`,
      'X-Cart-Token': cartToken,
    },
    body: JSON.stringify(checkoutData),
  });

  const result = await response.json();

  if (result.success) {
    // Clear cart cookie
    cookieStore.delete('cart_token');
    redirect(`/order-success?orderId=${result.orderId}`);
  }

  return result;
}
```

---

## Phase 7: Middleware (Security)

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  // Protected routes check
  const protectedPaths = ['/checkout', '/account'];
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    const cartToken = request.cookies.get('cart_token');
    if (!cartToken && request.nextUrl.pathname === '/checkout') {
      return NextResponse.redirect(new URL('/cart', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## Migration Checklist

### Phase 1: Setup
- [ ] Create Next.js project
- [ ] Install dependencies
- [ ] Configure path aliases
- [ ] Set up environment variables

### Phase 2: Copy Files
- [ ] Copy zatiq components (118 files)
- [ ] Copy UI components (5 files)
- [ ] Copy block renderers (5 files)
- [ ] Copy utilities (5 files)
- [ ] Copy data files (24 files)
- [ ] Copy assets to public/

### Phase 3: Update Files
- [ ] Add 'use client' to renderers (11 files)
- [ ] Update API client environment variables
- [ ] Update ThemeProvider if needed

### Phase 4: Convert Pages
- [ ] Homepage
- [ ] Products page
- [ ] Product detail page [handle]
- [ ] Collections page
- [ ] Collection detail page [handle]
- [ ] Checkout page
- [ ] About Us page
- [ ] Contact Us page
- [ ] Privacy Policy page
- [ ] Order Success page
- [ ] Search page
- [ ] 404 page

### Phase 5: Add Next.js Features
- [ ] Loading states
- [ ] Error boundaries
- [ ] Root layout with ThemeProvider

### Phase 6: Security
- [ ] Create Server Actions for cart
- [ ] Create Server Actions for checkout
- [ ] Set up middleware

### Phase 7: Testing
- [ ] Test all pages render correctly
- [ ] Test dynamic routes
- [ ] Test search params
- [ ] Test cart functionality
- [ ] Test checkout flow
- [ ] Performance testing

---

## File Count Summary

| Category | Count | Action |
|----------|-------|--------|
| Direct Copy (no changes) | 147 files | `cp` |
| Minor Update ('use client') | 11 files | Add directive |
| Convert (Astro → Next.js) | 13 pages | Rewrite |
| New Files (Next.js specific) | ~10 files | Create |
| **Total** | **~181 files** | |

---

## Estimated Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Setup | 2-4 hours | None |
| Phase 2: Copy Files | 1-2 hours | Phase 1 |
| Phase 3: Update Files | 2-4 hours | Phase 2 |
| Phase 4: Convert Pages | 1-2 days | Phase 3 |
| Phase 5: Loading/Error | 2-4 hours | Phase 4 |
| Phase 6: Security | 4-8 hours | Phase 4 |
| Phase 7: Testing | 1-2 days | All phases |
| **Total** | **~1-2 weeks** | |

---

## Post-Migration Enhancements

1. **Image Optimization**: Use `next/image` for all images
2. **Font Optimization**: Use `next/font` for web fonts
3. **ISR**: Add `revalidate` for product/collection pages
4. **Analytics**: Add Vercel Analytics
5. **Authentication**: Integrate NextAuth.js when needed
6. **PWA**: Add service worker for offline support

---

## Related Documentation

- **Theme Rendering**: `THEME_RENDERING_DOCS.md` (this project)
- **Theme Builder System**: `/merchant-panel/THEME_BUILDER_DOCUMENTATION.md`
- **Theme Builder Quick Ref**: `/merchant-panel/lib/modules/theme-builder/CLAUDE.md`
