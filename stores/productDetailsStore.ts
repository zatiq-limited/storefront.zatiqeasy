import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Product, Variant } from "./productsStore";

interface SelectedVariants {
  [variantTypeId: number]: Variant;
}

// Type for the store state
type ProductDetailsStoreState = Pick<
  ProductDetailsState,
  | "product"
  | "isLoading"
  | "error"
  | "productDetailsPageConfig"
  | "selectedVariants"
  | "quantity"
  | "computedPrice"
>;

interface ProductDetailsState {
  // Current product
  product: Product | null;
  isLoading: boolean;
  error: string | null;

  // Product details page config
  productDetailsPageConfig: Record<string, unknown> | null;

  // Selected variants
  selectedVariants: SelectedVariants;
  quantity: number;

  // Computed price based on selected variants
  computedPrice: number;

  // Actions
  setProduct: (product: Product | null) => void;
  setProductDetailsPageConfig: (config: Record<string, unknown>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  selectVariant: (variantTypeId: number, variant: Variant) => void;
  setQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  reset: () => void;
  resetVariants: () => void;
}

export const useProductDetailsStore = create<ProductDetailsState>()(
  devtools(
    (set, get) => ({
      product: null,
      isLoading: false,
      error: null,
      productDetailsPageConfig: null,
      selectedVariants: {},
      quantity: 1,
      computedPrice: 0,

      setProduct: (product) => {
        const basePrice = product?.price || 0;

        // Auto-select first variant of mandatory variant types
        const autoSelectedVariants: SelectedVariants = {};
        if (product?.variant_types && product.variant_types.length > 0) {
          product.variant_types.forEach((variantType) => {
            if (variantType.is_mandatory && variantType.variants?.length > 0) {
              autoSelectedVariants[variantType.id] = variantType.variants[0];
            }
          });
        }

        // Calculate price with auto-selected variants
        const variantPrice = Object.values(autoSelectedVariants).reduce(
          (sum, v) => sum + (v.price || 0),
          0
        );

        set({
          product,
          computedPrice: basePrice + variantPrice,
          selectedVariants: autoSelectedVariants,
        });
      },

      setProductDetailsPageConfig: (config) =>
        set({ productDetailsPageConfig: config }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      selectVariant: (variantTypeId, variant) => {
        const state = get();
        const newSelectedVariants = {
          ...state.selectedVariants,
          [variantTypeId]: variant,
        };

        // Calculate new price
        const basePrice = state.product?.price || 0;
        const variantPrice = Object.values(newSelectedVariants).reduce(
          (sum, v) => sum + (v.price || 0),
          0
        );

        set({
          selectedVariants: newSelectedVariants,
          computedPrice: basePrice + variantPrice,
        });
      },

      setQuantity: (quantity) => set({ quantity: Math.max(1, quantity) }),

      incrementQuantity: () =>
        set((state) => ({ quantity: state.quantity + 1 })),

      decrementQuantity: () =>
        set((state) => ({ quantity: Math.max(1, state.quantity - 1) })),

      reset: () =>
        set({
          product: null,
          isLoading: false,
          error: null,
          selectedVariants: {},
          quantity: 1,
          computedPrice: 0,
        }),

      resetVariants: () =>
        set((state) => ({
          selectedVariants: {},
          quantity: 1,
          computedPrice: state.product?.price || 0,
        })),
    }),
    { name: "product-details-store" }
  )
);

// Selectors - use these to prevent unnecessary re-renders
export const selectProduct = (state: ProductDetailsStoreState) => state.product;
export const selectIsLoading = (state: ProductDetailsStoreState) =>
  state.isLoading;
export const selectError = (state: ProductDetailsStoreState) => state.error;
export const selectSelectedVariants = (state: ProductDetailsStoreState) =>
  state.selectedVariants;
export const selectQuantity = (state: ProductDetailsStoreState) =>
  state.quantity;
export const selectComputedPrice = (state: ProductDetailsStoreState) =>
  state.computedPrice;
export const selectProductDetailsPageConfig = (
  state: ProductDetailsStoreState
) => state.productDetailsPageConfig;
