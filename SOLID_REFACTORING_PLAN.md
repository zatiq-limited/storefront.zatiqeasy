# SOLID Principles Refactoring Plan

## 📋 Current Issues & SOLID Violations

### 1. **Single Responsibility Principle (SRP) Violations**

#### Issue: Mixed Responsibilities in Files

```
lib/
├── block-utils.ts (607 lines!) - Handles parsing, rendering, binding, conditions
├── settings-utils.ts - Only snake_case conversion
├── orders/order-manager.ts - Handles orders, delivery, payments, notifications
```

**Problems:**

- `block-utils.ts` is doing too much (parsing, binding, conditions, styles, events)
- `order-manager.ts` mixing order creation, delivery calculation, payment handling
- Stores mixing data fetching with state management

---

### 2. **Open/Closed Principle (OCP) Violations**

#### Issue: Hard-coded Payment Methods

```typescript
// lib/payments/utils.ts
const names: Record<PaymentType, string> = {
  [PaymentType.BKASH]: "bKash",
  [PaymentType.NAGAD]: "Nagad",
  // Adding new payment requires editing this file
};
```

**Problems:**

- Can't add new payment methods without modifying existing code
- Payment logic scattered across multiple files
- No plugin architecture for payment gateways

---

### 3. **Liskov Substitution Principle (LSP) Issues**

#### Issue: Inconsistent Store Interfaces

```typescript
// Some stores have data, loading, error
// Others just have data
// No common base interface
```

**Problems:**

- Stores don't follow consistent patterns
- Can't substitute one store for another
- No standard error handling across stores

---

### 4. **Interface Segregation Principle (ISP) Violations**

#### Issue: Fat Utility Modules

```typescript
// lib/utils exports EVERYTHING
export * from "./cn";
export * from "./formatting";
export * from "./validation";
export * from "./delivery";
export * from "./encrypt-decrypt";
export * from "./storage";
// ... consumers import everything even if they need one function
```

**Problems:**

- Tight coupling - changing one utility affects all consumers
- Large bundle sizes - importing unused code
- No clear boundaries between utility domains

---

### 5. **Dependency Inversion Principle (DIP) Violations**

#### Issue: Direct Dependencies on Concrete Implementations

```typescript
// Components directly import axios, zustand stores
import { useCartStore } from "@/stores";
import axios from "@/lib/api/axios.config";
```

**Problems:**

- Hard to test (can't mock stores easily)
- Tight coupling to specific state management
- Can't swap implementations

---

## 🎯 Proposed Refactoring Structure

### Phase 1: Reorganize by Domain (Feature-Based Architecture)

```
src/
├── app/                           # Next.js App Router
│
├── features/                      # Domain-driven features
│   ├── cart/
│   │   ├── components/
│   │   │   ├── cart-drawer.tsx
│   │   │   ├── cart-item.tsx
│   │   │   └── cart-summary.tsx
│   │   ├── hooks/
│   │   │   ├── useCart.ts
│   │   │   ├── useCartTotals.ts
│   │   │   └── useAddToCart.ts
│   │   ├── store/
│   │   │   └── cartStore.ts
│   │   ├── types/
│   │   │   └── cart.types.ts
│   │   ├── services/
│   │   │   └── cartService.ts
│   │   └── index.ts              # Public API
│   │
│   ├── checkout/
│   │   ├── components/
│   │   │   ├── checkout-form.tsx
│   │   │   ├── contact-section.tsx
│   │   │   ├── delivery-section.tsx
│   │   │   └── payment-section.tsx
│   │   ├── hooks/
│   │   │   ├── useCheckout.ts
│   │   │   └── useDeliveryCalculation.ts
│   │   ├── store/
│   │   │   └── checkoutStore.ts
│   │   ├── types/
│   │   │   └── checkout.types.ts
│   │   ├── services/
│   │   │   ├── orderService.ts
│   │   │   └── deliveryService.ts
│   │   ├── utils/
│   │   │   └── delivery-calculator.ts
│   │   └── index.ts
│   │
│   ├── payments/
│   │   ├── components/
│   │   │   └── payment-method-selector.tsx
│   │   ├── gateways/
│   │   │   ├── base/
│   │   │   │   ├── PaymentGateway.interface.ts
│   │   │   │   └── BasePaymentGateway.ts
│   │   │   ├── bkash/
│   │   │   │   ├── BkashGateway.ts
│   │   │   │   └── BkashPaymentForm.tsx
│   │   │   ├── nagad/
│   │   │   │   ├── NagadGateway.ts
│   │   │   │   └── NagadPaymentForm.tsx
│   │   │   └── cod/
│   │   │       └── CODGateway.ts
│   │   ├── services/
│   │   │   ├── PaymentService.ts
│   │   │   └── PaymentGatewayFactory.ts
│   │   ├── types/
│   │   │   └── payment.types.ts
│   │   ├── hooks/
│   │   │   └── usePayment.ts
│   │   └── index.ts
│   │
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── shop/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   │
│   └── theme/
│       ├── components/
│       ├── hooks/
│       ├── store/
│       ├── services/
│       ├── types/
│       └── index.ts
│
├── shared/                        # Shared across features
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── form/                 # Form components
│   │   ├── layout/               # Layout components
│   │   └── feedback/             # Toasts, alerts, etc.
│   │
│   ├── hooks/
│   │   ├── usePagination.ts
│   │   ├── useDebounce.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── utils/
│   │   ├── format/
│   │   │   ├── currency.ts
│   │   │   ├── date.ts
│   │   │   └── string.ts
│   │   ├── validation/
│   │   │   ├── phone.ts
│   │   │   ├── email.ts
│   │   │   └── address.ts
│   │   ├── storage/
│   │   │   ├── localStorage.ts
│   │   │   └── indexedDB.ts
│   │   └── cn.ts
│   │
│   ├── types/
│   │   ├── common.types.ts
│   │   └── api.types.ts
│   │
│   └── constants/
│       ├── routes.ts
│       ├── api-endpoints.ts
│       └── config.ts
│
├── core/                          # Core infrastructure
│   ├── api/
│   │   ├── client/
│   │   │   ├── ApiClient.ts      # Abstract base
│   │   │   ├── RestClient.ts     # REST implementation
│   │   │   └── types.ts
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   ├── error.interceptor.ts
│   │   │   └── encryption.interceptor.ts
│   │   ├── config/
│   │   │   └── api.config.ts
│   │   └── index.ts
│   │
│   ├── encryption/
│   │   ├── EncryptionService.interface.ts
│   │   ├── CryptoJSEncryption.ts
│   │   └── index.ts
│   │
│   ├── storage/
│   │   ├── Storage.interface.ts
│   │   ├── LocalStorageAdapter.ts
│   │   ├── IndexedDBAdapter.ts
│   │   └── index.ts
│   │
│   ├── i18n/
│   │   ├── config.ts
│   │   └── translations/
│   │
│   └── providers/
│       ├── QueryProvider.tsx
│       └── I18nProvider.tsx
│
└── lib/                           # Legacy support (deprecated)
    └── ... (keep for backward compatibility)
```

---

## 🔧 Detailed Refactoring Steps

### Step 1: Extract Payment Gateway Strategy Pattern

**Current Problem:** Hard-coded payment methods everywhere

**Solution:** Payment Gateway Strategy Pattern

```typescript
// core/payments/interfaces/PaymentGateway.interface.ts
export interface IPaymentGateway {
  readonly name: string;
  readonly type: PaymentType;

  initialize(config: PaymentConfig): Promise<void>;
  processPayment(data: PaymentData): Promise<PaymentResult>;
  verifyPayment(transactionId: string): Promise<PaymentVerification>;
  cancel(transactionId: string): Promise<void>;
}

// core/payments/base/BasePaymentGateway.ts
export abstract class BasePaymentGateway implements IPaymentGateway {
  abstract readonly name: string;
  abstract readonly type: PaymentType;

  protected config?: PaymentConfig;

  async initialize(config: PaymentConfig): Promise<void> {
    this.config = config;
    await this.onInitialize();
  }

  protected abstract onInitialize(): Promise<void>;

  abstract processPayment(data: PaymentData): Promise<PaymentResult>;
  abstract verifyPayment(transactionId: string): Promise<PaymentVerification>;

  async cancel(transactionId: string): Promise<void> {
    // Default implementation
    throw new Error("Cancellation not supported");
  }
}

// features/payments/gateways/bkash/BkashGateway.ts
export class BkashGateway extends BasePaymentGateway {
  readonly name = "bKash";
  readonly type = PaymentType.BKASH;

  protected async onInitialize(): Promise<void> {
    // bKash-specific initialization
  }

  async processPayment(data: PaymentData): Promise<PaymentResult> {
    // bKash-specific payment processing
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    // bKash-specific verification
  }
}

// features/payments/services/PaymentGatewayFactory.ts
export class PaymentGatewayFactory {
  private gateways = new Map<PaymentType, IPaymentGateway>();

  register(gateway: IPaymentGateway): void {
    this.gateways.set(gateway.type, gateway);
  }

  create(type: PaymentType): IPaymentGateway {
    const gateway = this.gateways.get(type);
    if (!gateway) {
      throw new Error(`Payment gateway ${type} not registered`);
    }
    return gateway;
  }
}

// Usage - easily add new payment methods!
const factory = new PaymentGatewayFactory();
factory.register(new BkashGateway());
factory.register(new NagadGateway());
factory.register(new CODGateway());

// In components
const gateway = factory.create(selectedPaymentType);
await gateway.processPayment(paymentData);
```

---

### Step 2: Extract Store Base with Standard Interface

**Current Problem:** Inconsistent store patterns

**Solution:** Base store with standard patterns

```typescript
// core/store/BaseStore.interface.ts
export interface IBaseStore<T> {
  data: T | null;
  loading: boolean;
  error: string | null;

  fetch(): Promise<void>;
  reset(): void;
  setError(error: string): void;
}

// core/store/createBaseStore.ts
export function createBaseStore<T>(name: string, fetchFn: () => Promise<T>) {
  return create<IBaseStore<T>>((set) => ({
    data: null,
    loading: false,
    error: null,

    fetch: async () => {
      set({ loading: true, error: null });
      try {
        const data = await fetchFn();
        set({ data, loading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Unknown error",
          loading: false,
        });
      }
    },

    reset: () => set({ data: null, loading: false, error: null }),
    setError: (error: string) => set({ error }),
  }));
}

// features/products/store/productsStore.ts
import { createBaseStore } from "@/core/store/createBaseStore";
import { fetchProducts } from "../services/productService";

export const useProductsStore = createBaseStore("products", fetchProducts);
```

---

### Step 3: Split Large Utility Files

**Current Problem:** `block-utils.ts` is 607 lines, doing everything

**Solution:** Domain-specific utility modules

```typescript
// features/blocks/utils/
├── parser/
│   ├── wrapperParser.ts        # parseWrapper
│   ├── bindingParser.ts        # parseBinding
│   └── index.ts
├── evaluator/
│   ├── conditionEvaluator.ts   # evaluateCondition
│   ├── bindingResolver.ts      # resolveBinding
│   └── index.ts
├── style/
│   ├── styleBuilder.ts         # buildStyles
│   ├── classNameBuilder.ts     # buildClassName
│   └── index.ts
└── event/
    ├── eventHandler.ts         # handleBlockEvent
    └── index.ts

// Each file < 100 lines, single responsibility
```

---

### Step 4: Dependency Injection for Services

**Current Problem:** Direct axios imports, hard to test

**Solution:** Service layer with DI

```typescript
// core/api/client/ApiClient.interface.ts
export interface IApiClient {
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
}

// core/api/client/AxiosClient.ts
export class AxiosClient implements IApiClient {
  constructor(
    private readonly baseURL: string,
    private readonly encryption: IEncryptionService
  ) {}

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    // Implementation
  }
  // ... other methods
}

// features/products/services/ProductService.ts
export class ProductService {
  constructor(private readonly apiClient: IApiClient) {}

  async getProducts(): Promise<Product[]> {
    return this.apiClient.get<Product[]>("/products");
  }
}

// Dependency injection setup
import { container } from "@/core/di";

container.register(
  "ApiClient",
  () =>
    new AxiosClient(process.env.NEXT_PUBLIC_API_URL!, new CryptoJSEncryption())
);

container.register(
  "ProductService",
  () => new ProductService(container.resolve("ApiClient"))
);

// Usage in components
const productService = container.resolve<ProductService>("ProductService");
```

---

### Step 5: Feature-Based Module Exports

**Current Problem:** Everything exported from root, tight coupling

**Solution:** Explicit feature APIs

```typescript
// features/cart/index.ts - PUBLIC API
export { CartDrawer } from "./components/cart-drawer";
export { useCart } from "./hooks/useCart";
export type { CartItem, Cart } from "./types/cart.types";
// Don't export internal implementation details!

// features/cart/services/cartService.ts - PRIVATE
// Only used internally within cart feature

// features/checkout/index.ts
export { CheckoutForm } from "./components/checkout-form";
export { useCheckout } from "./hooks/useCheckout";
export type { CheckoutData } from "./types/checkout.types";

// app/checkout/page.tsx
import { CheckoutForm } from "@/features/checkout";
// Can't accidentally import internal cart service!
```

---

## 📊 Migration Strategy

### Phase 1: Core Infrastructure (Week 1)

- [ ] Create `core/` directory structure
- [ ] Implement `IApiClient` interface and AxiosClient
- [ ] Implement `IEncryptionService` and CryptoJSEncryption
- [ ] Implement `IStorage` adapters
- [ ] Create base store factory

### Phase 2: Payment Gateway Refactoring (Week 2)

- [ ] Create `IPaymentGateway` interface
- [ ] Implement BasePaymentGateway
- [ ] Migrate BkashGateway to new pattern
- [ ] Migrate NagadGateway to new pattern
- [ ] Migrate CODGateway to new pattern
- [ ] Create PaymentGatewayFactory
- [ ] Update payment components to use factory

### Phase 3: Feature Extraction - Cart (Week 3)

- [ ] Create `features/cart/` structure
- [ ] Move cart components
- [ ] Move cart hooks
- [ ] Move cart store (use base store)
- [ ] Create cart service
- [ ] Define cart public API
- [ ] Update imports across codebase

### Phase 4: Feature Extraction - Checkout (Week 4)

- [ ] Create `features/checkout/` structure
- [ ] Move checkout components
- [ ] Move checkout hooks
- [ ] Move checkout store
- [ ] Extract delivery service
- [ ] Extract order service
- [ ] Define checkout public API

### Phase 5: Split Block Utils (Week 5)

- [ ] Create `features/blocks/utils/` structure
- [ ] Extract parser utilities
- [ ] Extract evaluator utilities
- [ ] Extract style utilities
- [ ] Extract event utilities
- [ ] Update all imports
- [ ] Delete old `lib/block-utils.ts`

### Phase 6: Remaining Features (Week 6-8)

- [ ] Extract products feature
- [ ] Extract shop feature
- [ ] Extract theme feature
- [ ] Extract collections feature

### Phase 7: Shared Utilities Cleanup (Week 9)

- [ ] Move generic utilities to `shared/utils/`
- [ ] Create domain-specific utility modules
- [ ] Remove `lib/utils.ts` barrel exports
- [ ] Update all imports

### Phase 8: Testing & Cleanup (Week 10)

- [ ] Add unit tests for all services
- [ ] Add integration tests for features
- [ ] Remove deprecated files
- [ ] Update documentation
- [ ] Performance audit

---

## 🎯 Benefits After Refactoring

### 1. **Single Responsibility**

✅ Each module has one clear purpose
✅ Easy to understand and maintain
✅ Files < 200 lines

### 2. **Open/Closed**

✅ Add new payment methods without changing existing code
✅ Plugin architecture for gateways
✅ Extensible through interfaces

### 3. **Liskov Substitution**

✅ All stores follow same interface
✅ All API clients interchangeable
✅ Consistent error handling

### 4. **Interface Segregation**

✅ Import only what you need
✅ Clear public APIs per feature
✅ Smaller bundle sizes

### 5. **Dependency Inversion**

✅ Depend on interfaces, not implementations
✅ Easy to test with mocks
✅ Flexible architecture

---

## 📝 Quick Wins (Do First)

### 1. Move Block Utils (High Impact, Low Risk)

```bash
# Split 607-line file into focused modules
mkdir -p features/blocks/utils/{parser,evaluator,style,event}
# ... move functions to appropriate modules
```

### 2. Create Payment Gateway Pattern (High Value)

```bash
# Makes adding payment methods trivial
mkdir -p features/payments/gateways/{base,bkash,nagad,cod}
# Implement interface and factory
```

### 3. Standardize Stores (Immediate Benefit)

```bash
# Use base store factory for consistency
# All stores get loading/error states automatically
```

---

## 🚨 Breaking Changes to Watch

1. **Import paths will change**

   - Old: `import { cn } from "@/lib/utils"`
   - New: `import { cn } from "@/shared/utils/cn"`

2. **Store interfaces will change**

   - All stores will have `data`, `loading`, `error`
   - May need to update components

3. **Payment components will change**
   - Use gateway factory instead of direct imports

---

## 📚 Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [Strategy Pattern](https://refactoring.guru/design-patterns/strategy)

---

**Last Updated**: December 23, 2024
**Status**: Ready for implementation
**Priority**: High - Will significantly improve maintainability
