# Project Organization & Cleanup Guide

## 📊 Current State Analysis

### Project Statistics

- **Total TypeScript Files**: 277
- **Total Directories**: 63
- **Package Manager**: pnpm
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React + TailwindCSS + shadcn/ui

---

## 🚨 Critical Issues Identified

### 1. **Duplicate Encryption Utilities**

**Problem**: Two different encryption implementations exist:

- `/lib/encrypt-decrypt.ts` - Simple base64 encoding (insecure, demo only)
- `/lib/utils/encrypt-decrypt.ts` - Proper CryptoJS AES encryption

**Impact**: Inconsistent usage across the codebase, security risks.

**Files Using Each**:

- **lib/utils/encrypt-decrypt.ts** (CORRECT - CryptoJS AES):

  - `components/features/checkout/contact-section.tsx`
  - `app/api/orders/create/route.ts`
  - `app/api/orders/verify-phone/route.ts`
  - `app/api/orders/promo-code/route.ts`

- **lib/encrypt-decrypt.ts** (INCORRECT - base64):
  - Imported in old project files only

**Action Required**: ✅ KEEP `lib/utils/encrypt-decrypt.ts`, ❌ DELETE `lib/encrypt-decrypt.ts`

---

### 2. **Duplicate Utils Files**

**Problem**: Three utils locations:

- `/lib/utils.ts` - Main utils with `cn()` function + re-exports
- `/lib/utils/index.ts` - Only exports validation and delivery
- `/lib/utils/` directory - Actual implementation files

**Current Structure**:

```
lib/
├── utils.ts (110 lines - cn, titleCase, applyOpacityToHexColor, etc.)
│   └── Re-exports from utils/ directory
└── utils/
    ├── index.ts (8 lines - exports validation & delivery only)
    ├── validation.ts
    ├── delivery.ts
    ├── encrypt-decrypt.ts
    ├── storage.ts
    ├── storage.util.ts
    ├── bangla-to-latin.ts
    └── subscription-utils.ts
```

**Problem Analysis**:

- `lib/utils.ts` has general utilities AND re-exports
- `lib/utils/index.ts` only exports 2 modules (incomplete)
- Mixed import patterns: `@/lib/utils` vs `@/lib/utils/validation`

**Action Required**: Consolidate into single organized structure

---

### 3. **Duplicate Storage Utilities**

**Problem**: Two storage files:

- `/lib/utils/storage.ts`
- `/lib/utils/storage.util.ts`

**Action Required**: Merge into one file, remove duplicate

---

### 4. **Unused Dependencies**

Based on `depcheck` analysis, the following dependencies are **NOT USED** anywhere:

#### Dependencies to Remove:

```bash
pnpm remove @hookform/resolvers \
  embla-carousel-react \
  fuse.js \
  next-intl \
  ni18n \
  shadcn \
  tw-animate-css \
  uuid \
  zod
```

#### DevDependencies to Remove:

```bash
pnpm remove -D @tailwindcss/postcss
```

**Why These Are Safe to Remove**:

- ✅ **@hookform/resolvers**: Not using form validation schemas
- ✅ **embla-carousel-react**: No carousel components found
- ✅ **fuse.js**: No fuzzy search implementation
- ✅ **next-intl**: Using custom i18n solution (ni18n.config.ts)
- ✅ **ni18n**: Using custom translation system
- ✅ **shadcn**: CLI tool, not needed in dependencies
- ✅ **tw-animate-css**: Using TailwindCSS built-in animations
- ✅ **uuid**: No UUID generation in codebase
- ✅ **zod**: Not using schema validation
- ✅ **@tailwindcss/postcss**: Not needed with current PostCSS setup

---

## 🎯 Recommended Project Structure

### Ideal Next.js 16+ App Router Structure

```
storefront.zatiqeasy/
├── app/                          # Next.js App Router
│   ├── (routes)/                # Route groups
│   │   ├── (shop)/             # Shop-related routes
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── payment-confirm/
│   │   ├── (page)/             # Dynamic page renderer
│   │   └── (block)/            # Dynamic block renderer
│   ├── api/                    # API routes
│   │   ├── orders/
│   │   ├── shops/
│   │   ├── storefront/
│   │   └── webhooks/
│   ├── receipt/[receiptId]/   # Receipt page
│   ├── merchant/              # Merchant dashboard
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── features/              # Feature-based components
│   │   ├── cart/             # Cart feature
│   │   │   ├── cart-drawer.tsx
│   │   │   ├── cart-item.tsx
│   │   │   └── cart-summary.tsx
│   │   ├── checkout/         # Checkout feature
│   │   │   ├── common-checkout-form.tsx
│   │   │   ├── contact-section.tsx
│   │   │   └── delivery-section.tsx
│   │   ├── payments/         # Payment feature
│   │   └── category/         # Category feature
│   │
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── renderers/            # Dynamic content renderers
│   │   └── block-renderer/
│   │
│   ├── shared/               # Shared components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── ...
│   │
│   └── pagination/           # Pagination components
│
├── lib/                      # Core library code
│   ├── api/                 # API client & configs
│   │   ├── axios.config.ts
│   │   ├── shop.ts
│   │   └── otp.ts
│   │
│   ├── configs/             # Configuration files
│   │   ├── api.config.ts
│   │   └── api-client.ts
│   │
│   ├── constants/           # Constants & enums
│   │   ├── index.ts
│   │   ├── urls.ts
│   │   ├── cache.ts
│   │   └── delivery.ts
│   │
│   ├── features/            # Feature-specific logic
│   │   ├── payments/
│   │   │   ├── encryption.ts
│   │   │   ├── api.ts
│   │   │   ├── utils.ts
│   │   │   └── types.ts
│   │   └── orders/
│   │       ├── delivery-calculation.ts
│   │       └── order-manager.ts
│   │
│   ├── i18n/               # Internationalization
│   │   ├── config.ts
│   │   └── translations.ts
│   │
│   ├── utils/              # Shared utilities
│   │   ├── index.ts        # Central export
│   │   ├── cn.ts           # Tailwind merge utility
│   │   ├── validation.ts   # Validation utilities
│   │   ├── encryption.ts   # Encryption utilities
│   │   ├── storage.ts      # Storage utilities
│   │   ├── delivery.ts     # Delivery utilities
│   │   ├── formatting.ts   # String/number formatting
│   │   └── bangla-to-latin.ts
│   │
│   ├── block-utils.ts      # Block rendering utilities
│   ├── settings-utils.ts   # Settings utilities
│   └── types.ts            # Shared types
│
├── hooks/                   # Custom React hooks
│   ├── index.ts            # Central export
│   ├── useCart.ts
│   ├── useCheckout.ts
│   ├── useProducts.ts
│   ├── useShopProfile.ts
│   └── ...
│
├── stores/                  # Zustand stores
│   ├── index.ts            # Central export
│   ├── cartStore.ts
│   ├── checkoutStore.ts
│   ├── shopStore.ts
│   └── ...
│
├── types/                   # TypeScript types
│   ├── index.ts            # Central export
│   ├── cart.types.ts
│   ├── checkout.types.ts
│   ├── order.types.ts
│   ├── shop.types.ts
│   └── ...
│
├── data/                    # Static data & configs
│   ├── index.ts
│   ├── config/
│   ├── constants/
│   └── api-responses/
│
├── providers/               # React context providers
│   ├── QueryProvider.tsx
│   └── I18nProvider.tsx
│
└── public/                  # Static assets
    ├── locales/
    ├── images/
    └── fonts/
```

---

## 🔧 Step-by-Step Reorganization Plan

### Phase 1: Remove Unused Dependencies (Immediate)

```bash
# Navigate to project
cd /home/sumon7866/Projects/Zatiq/project-migration/storefront.zatiqeasy

# Remove unused dependencies
pnpm remove @hookform/resolvers embla-carousel-react fuse.js next-intl ni18n shadcn tw-animate-css uuid zod

# Remove unused devDependencies
pnpm remove -D @tailwindcss/postcss

# Clean install
pnpm install
```

**Expected savings**: ~15-20MB in node_modules

---

### Phase 2: Consolidate Encryption Utilities

#### Step 1: Delete duplicate encryption file

```bash
rm lib/encrypt-decrypt.ts
```

#### Step 2: Update imports (if any still reference old file)

Search and replace:

- FROM: `@/lib/encrypt-decrypt`
- TO: `@/lib/utils/encrypt-decrypt`

---

### Phase 3: Consolidate Storage Utilities

#### Step 1: Merge storage files

Review both files:

- `lib/utils/storage.ts`
- `lib/utils/storage.util.ts`

Choose the most complete one, merge functionality, delete the other.

---

### Phase 4: Reorganize Utils Structure

**Current Messy State**:

```
lib/utils.ts (contains cn, titleCase, etc. + re-exports)
lib/utils/index.ts (minimal exports)
lib/utils/validation.ts
lib/utils/delivery.ts
...
```

**Proposed Clean Structure**:

```
lib/
├── utils/
│   ├── index.ts           # Central export for ALL utilities
│   ├── cn.ts              # Tailwind merge (cn function)
│   ├── formatting.ts      # titleCase, applyOpacityToHexColor, etc.
│   ├── validation.ts      # Phone validation, form validation
│   ├── encryption.ts      # Encryption/decryption (rename from encrypt-decrypt.ts)
│   ├── storage.ts         # LocalStorage utilities (merged)
│   ├── delivery.ts        # Delivery calculations
│   ├── bangla-to-latin.ts # Bangla digit conversion
│   └── subscription-utils.ts # Subscription utilities
```

#### Action Steps:

1. **Create `lib/utils/cn.ts`**:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

2. **Create `lib/utils/formatting.ts`**:
   Move `titleCase`, `applyOpacityToHexColor`, and other formatting functions from `lib/utils.ts`

3. **Rename `encrypt-decrypt.ts` to `encryption.ts`** (more semantic)

4. **Update `lib/utils/index.ts`** to export everything:

```typescript
// Core utilities
export * from "./cn";
export * from "./formatting";

// Feature utilities
export * from "./validation";
export * from "./encryption";
export * from "./storage";
export * from "./delivery";
export * from "./bangla-to-latin";
export * from "./subscription-utils";
```

5. **Delete `lib/utils.ts`** (no longer needed)

6. **Update all imports**:

- FROM: `import { cn } from "@/lib/utils"`
- TO: `import { cn } from "@/lib/utils"` (works because utils/index.ts re-exports)
- No breaking changes needed!

---

### Phase 5: Reorganize Features

**Current State**:

```
lib/payments/         # Payment-specific logic
lib/orders/          # Order-specific logic
```

**Proposed**:

```
lib/features/
├── payments/
│   ├── encryption.ts    # Move from lib/payments/
│   ├── api.ts
│   ├── utils.ts
│   └── types.ts
└── orders/
    ├── delivery-calculation.ts
    ├── order-manager.ts
    └── types.ts
```

**Benefits**:

- Clear separation of feature logic
- Easier to find related code
- Better scalability for new features

---

### Phase 6: Clean Up Console Logs

Search for and remove debugging console logs:

```bash
# Find all console.log statements
grep -r "console.log" --include="*.ts" --include="*.tsx" .
```

**Files to clean**:

1. `components/features/checkout/common-checkout-form.tsx`

   - Remove: `console.log("Validation check:", ...)`
   - Remove: `console.log("Order response:", ...)`

2. `lib/payments/api.ts`

   - Remove: `console.log("Decrypted API Response:", ...)`
   - Remove: `console.log("Receipt details response:", ...)`

3. `app/receipt/[receiptId]/page.tsx`
   - Remove: `console.log("Receipt response:", ...)`

**Keep console.error** for error handling in production.

---

## 📋 File Deletion Checklist

### ❌ Files to Delete

1. **Duplicate Encryption**:

   - [ ] `/lib/encrypt-decrypt.ts`

2. **Duplicate Storage** (after merging):

   - [ ] `/lib/utils/storage.util.ts` OR `/lib/utils/storage.ts` (keep one)

3. **After Utils Reorganization**:
   - [ ] `/lib/utils.ts` (move content to utils/ subdirectory)

### ⚠️ Files to Review

These files exist but may not be used. Review before deleting:

1. **`lib/settings-utils.ts`** - Check if settings management is used
2. **`lib/block-utils.ts`** - Check if block rendering uses this
3. **`app/test-api.js`** - Test file, likely can be deleted
4. **`INTEGRATION_PLAN copy.md`** - Duplicate documentation

---

## 🎨 Best Practices Moving Forward

### 1. **File Naming Conventions**

✅ **DO**:

- `user-profile.tsx` (kebab-case for components)
- `useUserProfile.ts` (camelCase for hooks)
- `UserProfile.types.ts` (PascalCase.types for types)
- `api-client.ts` (kebab-case for utilities)

❌ **DON'T**:

- `UserProfile.tsx` (PascalCase files)
- `user_profile.ts` (snake_case)
- `storage.util.ts` (redundant .util suffix)

### 2. **Import Organization**

Always use absolute imports with path aliases:

```typescript
// ✅ GOOD
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks";

// ❌ BAD
import { cn } from "../../lib/utils";
import { Button } from "../components/ui/button";
```

### 3. **Component Organization**

```typescript
// ✅ GOOD - Feature-based
components/
├── features/
│   ├── checkout/
│   │   ├── common-checkout-form.tsx
│   │   ├── contact-section.tsx
│   │   └── delivery-section.tsx

// ❌ BAD - Type-based
components/
├── forms/
│   └── checkout-form.tsx
├── sections/
│   ├── contact-section.tsx
│   └── delivery-section.tsx
```

### 4. **Barrel Exports (index.ts)**

Use index.ts files to simplify imports:

```typescript
// hooks/index.ts
export * from "./useCart";
export * from "./useCheckout";
export * from "./useProducts";

// Usage
import { useCart, useCheckout } from "@/hooks";
```

### 5. **Type Organization**

Group related types in feature-specific files:

```typescript
// types/cart.types.ts
export interface CartItem { ... }
export interface CartState { ... }
export type CartAction = ...;

// types/index.ts
export * from "./cart.types";
export * from "./checkout.types";
export * from "./order.types";
```

---

## 🚀 Implementation Timeline

### Week 1: Cleanup

- [ ] Day 1: Remove unused dependencies
- [ ] Day 2: Delete duplicate encryption file
- [ ] Day 3: Merge storage utilities
- [ ] Day 4: Remove console.logs
- [ ] Day 5: Delete unused test files

### Week 2: Reorganization

- [ ] Day 1-2: Consolidate utils structure
- [ ] Day 3-4: Move features to lib/features/
- [ ] Day 5: Update all imports

### Week 3: Testing

- [ ] Day 1-2: Test all features
- [ ] Day 3-4: Fix any broken imports
- [ ] Day 5: Code review & documentation

---

## 📊 Expected Benefits

### Before Cleanup:

- 277 TypeScript files
- ~350MB node_modules
- Inconsistent import patterns
- Duplicate utilities
- 9 unused dependencies

### After Cleanup:

- ~265 TypeScript files (-12 duplicates)
- ~330MB node_modules (-20MB)
- Consistent imports using `@/` aliases
- Single source of truth for utilities
- Clean dependency tree
- Better developer experience

---

## 🛠️ Automated Cleanup Scripts

### Script 1: Remove Unused Dependencies

```bash
#!/bin/bash
# cleanup-deps.sh

cd /home/sumon7866/Projects/Zatiq/project-migration/storefront.zatiqeasy

echo "Removing unused dependencies..."
pnpm remove @hookform/resolvers embla-carousel-react fuse.js next-intl ni18n shadcn tw-animate-css uuid zod

echo "Removing unused devDependencies..."
pnpm remove -D @tailwindcss/postcss

echo "Reinstalling..."
pnpm install

echo "✅ Cleanup complete!"
```

### Script 2: Find Console Logs

```bash
#!/bin/bash
# find-console-logs.sh

echo "Finding console.log statements..."
grep -rn "console.log" --include="*.ts" --include="*.tsx" app/ components/ lib/ hooks/ stores/ | grep -v "node_modules"
```

### Script 3: Find Unused Imports

```bash
#!/bin/bash
# find-unused-imports.sh

echo "Analyzing unused imports..."
npx eslint . --ext .ts,.tsx --max-warnings=0 --no-ignore --rule 'no-unused-vars: error'
```

---

## 📚 Additional Resources

### Next.js Best Practices

- [Next.js Project Structure](https://nextjs.org/docs/app/building-your-application/routing/colocation)
- [React Component Patterns](https://react.dev/learn/thinking-in-react)

### Code Organization

- Feature-based organization > Type-based
- Colocation principle: Keep related code together
- Single Responsibility Principle for files

### Performance

- Use dynamic imports for large components
- Implement proper code splitting
- Optimize barrel exports (only export what's used)

---

## ✅ Completion Checklist

After completing this guide, verify:

- [ ] All unused dependencies removed
- [ ] No duplicate encryption files
- [ ] Storage utilities consolidated
- [ ] Utils properly organized in subdirectory
- [ ] All console.log statements removed (except errors)
- [ ] All imports use `@/` path aliases
- [ ] All tests passing
- [ ] Build succeeds: `pnpm build`
- [ ] Development server works: `pnpm dev`
- [ ] Production build works
- [ ] No TypeScript errors
- [ ] No ESLint warnings

---

## 🆘 Troubleshooting

### Issue: Import errors after reorganization

**Solution**: Use find & replace to update import paths:

```bash
# Example: Update encryption imports
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/@\/lib\/encrypt-decrypt/@\/lib\/utils\/encryption/g' {} +
```

### Issue: Build fails after dependency removal

**Solution**: Check if any dynamic imports reference removed packages:

```bash
grep -r "embla-carousel\|fuse.js\|uuid" --include="*.ts" --include="*.tsx" .
```

### Issue: Missing types after cleanup

**Solution**: Ensure types/index.ts exports all type files:

```typescript
// types/index.ts
export * from "./cart.types";
export * from "./checkout.types";
// ... all other types
```

---

## 📞 Support

If you encounter issues during reorganization:

1. **Backup first**: `git commit -am "Pre-reorganization backup"`
2. **Make changes incrementally**: One phase at a time
3. **Test after each change**: `pnpm build && pnpm dev`
4. **Document changes**: Update this file with any adjustments

---

**Last Updated**: December 23, 2024
**Project**: storefront.zatiqeasy
**Status**: Ready for implementation
