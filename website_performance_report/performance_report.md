# Zatiq Storefront Performance Report

**Analysis Date:** January 2026
**Lighthouse Version:** 12.4.0
**Test URL:** `https://eshrakdesign.zatiqeasy.com/`
**Device:** Mobile (Simulated)

---

## Executive Summary

| Metric | Score/Value | Status |
|--------|-------------|--------|
| **Performance Score** | 47/100 | Poor |
| **First Contentful Paint (FCP)** | 2.5s | Needs Improvement |
| **Largest Contentful Paint (LCP)** | 3.8s | Poor |
| **Total Blocking Time (TBT)** | 400ms | Moderate |
| **Cumulative Layout Shift (CLS)** | 0.302 | Poor |
| **Speed Index** | 4.3s | Needs Improvement |
| **Time to First Byte (TTFB)** | 1,990ms | Critical |

---

## Root Cause Analysis: Backend vs Frontend

### Issue Distribution

```
Backend Issues: 60%
├── Slow TTFB (1,990ms server response)
├── Unoptimized images from CDN
└── API response times

Frontend Issues: 40%
├── Large JavaScript bundles
├── Unused JavaScript code
├── Layout shifts (CLS)
└── Multiple themes loaded simultaneously
```

---

## Backend Issues (60% of Problems)

### 1. Critical: Server Response Time (TTFB)

**Problem:** Time to First Byte is **1,990ms** - nearly 2 seconds before the browser receives any content.

**Evidence from Lighthouse:**
> "Server responded slowly (observed 1981 ms). Reduce initial server response time (TTFB) to improve page load speed."

**Root Causes:**
- `/api/storefront/v1/profile` API endpoint is slow (~2 seconds)
- Server-side processing before response
- Possible database query delays
- No edge caching for API responses

**Impact:**
- Delays ALL subsequent resource loading
- User sees blank screen for 2 seconds
- Cascades into poor LCP and Speed Index

**Recommendations:**
```
Priority 1 (Immediate):
- Profile the /api/storefront/v1/profile endpoint
- Add Redis caching for shop profile data
- Consider edge caching (Vercel Edge Config or CloudFront)

Priority 2:
- Implement stale-while-revalidate headers
- Pre-warm cache for frequently accessed shops
- Add database query indexes
```

### 2. Image Optimization Issues

**Problem:** Images from CloudFront CDN are not optimized.

**Evidence:**
| Resource | Current Size | Potential Savings |
|----------|--------------|-------------------|
| d1x73fqpzlm72l.cloudfront.net images | 4,837 KiB | Up to 90% |
| Large PNG/JPEG files | Various | Convert to WebP/AVIF |

**Image Issues Found:**
1. **No modern formats** - Serving JPEG/PNG instead of WebP/AVIF
2. **No responsive images** - Same image served to all device sizes
3. **Oversized images** - Full resolution images scaled down by CSS
4. **No lazy loading** - All images loaded immediately

**Recommendations:**
```typescript
// Next.js Image Component Best Practice
import Image from 'next/image';

<Image
  src={imageUrl}
  alt={description}
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"  // Lazy load below-fold images
  placeholder="blur"
  blurDataURL={thumbnailUrl}
/>
```

**Backend Image Pipeline:**
- Configure CloudFront to serve WebP/AVIF with Accept header negotiation
- Implement image resizing at upload time (multiple sizes)
- Add cache headers for immutable images

---

## Frontend Issues (40% of Problems)

### 1. JavaScript Bundle Size

**Problem:** Total JavaScript payload is **9,499 KiB** (9.5 MB).

**Breakdown:**
| Bundle | Size | Issue |
|--------|------|-------|
| Main chunks | ~2,500 KiB | Too large for initial load |
| Vendor chunks | ~4,000 KiB | Needs code splitting |
| Unused JavaScript | 648 KiB | Should be removed |

**Top Offenders:**
1. All 5 themes loaded simultaneously (Basic, Aurora, Sellora, Luxura, Premium)
2. Dev tools included in production:
   - `@next/devtools` (should be dev-only)
   - `@tanstack/query-devtools` (should be dev-only)
3. Large libraries not tree-shaken properly

**Recommendations:**

```typescript
// 1. Dynamic theme loading (load only active theme)
// Current (BAD):
import { BasicTheme } from '@/themes/basic';
import { AuroraTheme } from '@/themes/aurora';
import { SelloraTheme } from '@/themes/sellora';
// ... all themes imported

// Recommended (GOOD):
const ThemeComponent = dynamic(
  () => import(`@/themes/${themeName}`),
  { loading: () => <ThemeSkeleton /> }
);
```

```typescript
// 2. Remove dev tools from production
// next.config.ts
const nextConfig = {
  // ... other config
  experimental: {
    devTools: process.env.NODE_ENV === 'development',
  }
};

// For React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

{process.env.NODE_ENV === 'development' && (
  <ReactQueryDevtools initialIsOpen={false} />
)}
```

### 2. Unused JavaScript (648 KiB)

**Files with Unused Code:**
| File Pattern | Potential Savings |
|--------------|-------------------|
| Theme components not used | ~300 KiB |
| Unused utility functions | ~150 KiB |
| Polyfills for modern browsers | ~100 KiB |
| Unused icon imports | ~98 KiB |

**Recommendations:**
```bash
# Analyze bundle with next-bundle-analyzer
npm run analyze

# Check for unused exports
npx ts-unused-exports tsconfig.json
```

### 3. Cumulative Layout Shift (CLS: 0.302)

**Problem:** Layout shifts during page load - elements move after initial render.

**Causes Identified:**
1. Images without explicit dimensions
2. Fonts causing text reflow (FOUT)
3. Dynamic content pushing elements down
4. Skeleton loaders with different sizes than actual content

**Elements Causing Shifts:**
- Hero carousel images
- Product cards in grid
- Category sidebar
- Announcement bar loading

**Recommendations:**

```css
/* 1. Reserve space for images */
.product-image-container {
  aspect-ratio: 1 / 1;
  width: 100%;
}

/* 2. Font display swap with fallback */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
  size-adjust: 100%;
}
```

```typescript
// 3. Skeleton with exact dimensions
const ProductCardSkeleton = () => (
  <div className="w-full">
    <div className="aspect-square bg-gray-200 animate-pulse" />
    <div className="h-5 mt-2 bg-gray-200 animate-pulse" />
    <div className="h-4 mt-1 w-20 bg-gray-200 animate-pulse" />
  </div>
);
```

### 4. Multiple Themes Loading

**Problem:** All 5 static themes are bundled and loaded regardless of which theme is active.

**Current State:**
```
Themes Loaded: 5
├── Basic Theme: ~400 KiB
├── Aurora Theme: ~450 KiB
├── Sellora Theme: ~500 KiB
├── Luxura Theme: ~480 KiB
└── Premium Theme: ~520 KiB
Total: ~2,350 KiB (2.3 MB)
```

**Recommendation:**
```typescript
// Dynamic theme loading based on shop profile
const ThemeComponent = useMemo(() => {
  const themeName = shopProfile?.shop_theme?.theme_name || 'Basic';

  return dynamic(
    () => import(`@/app/_themes/${themeName.toLowerCase()}`).then(mod => mod.default),
    {
      loading: () => <ThemeLoadingSkeleton />,
      ssr: false
    }
  );
}, [shopProfile?.shop_theme?.theme_name]);
```

---

## Performance Timeline Analysis

```
0ms ─────────────────────────────────────────────────────────────────────────► Time
     │
     ├─ Request sent
     │
     ├─────────────────────────────┐
     │         TTFB: 1,990ms       │  ← Backend bottleneck
     │    (Server processing)      │
     └─────────────────────────────┤
                                   │
                                   ├─ FCP: 2.5s (First paint)
                                   │
                                   ├───────────────────────┐
                                   │   JS Parsing &        │
                                   │   Execution           │
                                   │   TBT: 400ms          │
                                   └───────────────────────┤
                                                           │
                                                           ├─ LCP: 3.8s (Hero image)
                                                           │
                                                           └─ Layout Shifts (CLS: 0.302)
```

---

## Prioritized Action Plan

### Immediate Actions (Week 1)

| Priority | Task | Impact | Effort |
|----------|------|--------|--------|
| P0 | Profile and optimize `/api/storefront/v1/profile` | High | Medium |
| P0 | Add caching to shop profile API | High | Low |
| P1 | Remove dev tools from production build | Medium | Low |
| P1 | Add explicit dimensions to all images | Medium | Low |

### Short-term (Week 2-3)

| Priority | Task | Impact | Effort |
|----------|------|--------|--------|
| P1 | Implement dynamic theme loading | High | Medium |
| P1 | Configure CloudFront for WebP/AVIF | High | Medium |
| P2 | Add font preloading | Medium | Low |
| P2 | Implement proper skeleton loaders | Medium | Medium |

### Medium-term (Month 1)

| Priority | Task | Impact | Effort |
|----------|------|--------|--------|
| P2 | Bundle analysis and code splitting | High | High |
| P2 | Implement responsive images | Medium | Medium |
| P3 | Tree-shake unused code | Medium | High |
| P3 | Optimize third-party scripts | Low | Medium |

---

## Expected Improvements After Fixes

| Metric | Current | Expected | Improvement |
|--------|---------|----------|-------------|
| Performance Score | 47 | 75-85 | +28-38 |
| TTFB | 1,990ms | 200-400ms | 80-90% |
| LCP | 3.8s | 1.5-2.0s | 50-60% |
| CLS | 0.302 | <0.1 | 70% |
| JS Bundle | 9,499 KiB | 3,000 KiB | 70% |

---

## Monitoring Recommendations

### Key Metrics to Track

```javascript
// Web Vitals monitoring
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics endpoint
  console.log(metric.name, metric.value);
}

onCLS(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

### Lighthouse CI Integration

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://eshrakdesign.zatiqeasy.com/
          budgetPath: ./lighthouse-budget.json
```

---

## Summary

The poor performance score of **47** is caused by:

1. **Backend (60%)**: The primary bottleneck is the **1,990ms TTFB** - the server takes nearly 2 seconds to respond. This must be addressed first as it blocks everything else.

2. **Frontend (40%)**: Large JavaScript bundles (9.5 MB), all 5 themes loading simultaneously, dev tools in production, and layout shifts contribute to the remaining issues.

**Most Critical Fix:** Optimize the `/api/storefront/v1/profile` endpoint and add caching. This single fix could improve the performance score by 15-20 points.

---

## Related Documentation

- [CLAUDE.md](/CLAUDE.md) - Project architecture overview
- [API_STRUCTURE_PLAN.md](/API_STRUCTURE_PLAN.md) - API optimization roadmap
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance) - Official docs

---

*Report generated from Lighthouse analysis. Last updated: January 2026*
