# Claude Code Instructions for Zatiq Storefront

> Read this file first when working on this project.

## Project Context

This folder contains a **completed e-commerce storefront migration**:
- **NEW (Target)**: `storefront.zatiqeasy/` - Next.js 16 + React 19 + Zustand
- **OLD (Reference)**: `storefront.zatiqeasy.com/` - Next.js 14 + React 18 + Context API

**The migration is complete.** The new project has 486 files and all features have been migrated.

## Quick Facts

| Aspect | Value |
|--------|-------|
| Primary Project | `storefront.zatiqeasy/` |
| Framework | Next.js 16.0.10 (App Router) |
| React | 19.2.1 |
| State | Zustand 5.0.9 (12 stores) |
| Styling | Tailwind CSS v4 |
| Themes | 6 static + 3 landing |
| Payment Gateways | 5 (bKash, AamarPay, Nagad, COD, Self MFS) |
| Languages | English, Bengali |

## Where to Find Things

| Looking for... | Location |
|---------------|----------|
| Themes | `storefront.zatiqeasy/app/_themes/` |
| Zustand Stores | `storefront.zatiqeasy/stores/` |
| Custom Hooks | `storefront.zatiqeasy/hooks/` |
| Components | `storefront.zatiqeasy/components/` |
| API Routes | `storefront.zatiqeasy/app/api/` |
| Types | `storefront.zatiqeasy/types/` |
| Utilities | `storefront.zatiqeasy/lib/` |
| Payment Code | `storefront.zatiqeasy/components/features/payments/` |
| Checkout Code | `storefront.zatiqeasy/components/features/checkout/` |
| Cart Code | `storefront.zatiqeasy/components/features/cart/` |
| Landing Pages | `storefront.zatiqeasy/app/_themes/landing/themes/` |

## Theme Names

**Static Themes:** Aurora, Basic, Premium, Luxura, Sellora
**Landing Themes:** Arcadia, Grip, Nirvana

## Key Stores

- `cartStore` - Shopping cart state
- `checkoutStore` - Checkout form & delivery
- `shopStore` - Shop profile & theme selection
- `productsStore` - Product listing with filters
- `productDetailsStore` - Single product with variants
- `analyticsStore` - Pixel/GTM configuration
- `landingStore` - Landing page state

## Features NOT Implemented

- User authentication/login
- User accounts/order history
- Wishlist/favorites
- Product reviews (write)
- Admin dashboard UI

## Full Documentation

See `PROJECT_SUMMARY.md` in this folder for complete details including:
- All 24 API endpoints
- All 20 hooks
- All 12 stores
- Complete directory structure
- Feature implementation status
