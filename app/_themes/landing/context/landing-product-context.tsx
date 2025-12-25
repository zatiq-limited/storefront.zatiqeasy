"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useCartStore } from "@/stores/cartStore";
import { useShopStore } from "@/stores/shopStore";
import { useTranslation } from "react-i18next";
import type { Product, VariantType, Stock } from "@/stores/productsStore";
import type { VariantsState, VariantState } from "@/types/cart.types";

// Product pricing type
interface ProductPricingType {
  additionalPrice: number;
  currentPrice: number;
  regularPrice: number;
  hasSavePrice: boolean;
  showOldPrice: boolean;
  savePrice: number;
  unitName: string;
}

// Product action controller
interface ProductActionController {
  qty: number;
  subQty: () => void;
  sumQty: () => void;
  disableSub: boolean;
  handleProductCartAction: (option?: { img_url?: string }) => void;
  actionButtonLabel: string;
}

// Cart product type from cart store
type CartProduct = ReturnType<typeof useCartStore.getState>["products"][string];

// Context value type
interface LandingProductContextValue {
  product: Product;
  selectedVariants: VariantsState;
  defaultVariants: VariantsState;
  productPricing: ProductPricingType;
  productActionController: ProductActionController;
  cartProducts: CartProduct[];
  totalInCart: number;
  isStockOut: boolean;
  isStockNotAvailable: boolean;
  isStockManageByVariant: boolean;
  selectedCombination: string;
  selectedCombinationStock: number;
  onSelectVariants: (args: VariantState, options?: { canToggle?: boolean }) => void;
  setQty: React.Dispatch<React.SetStateAction<number>>;
  scrollToCheckout: () => void;
}

const LandingProductContext = createContext<LandingProductContextValue | null>(null);

interface LandingProductProviderProps {
  children: React.ReactNode;
  product: Product;
}

export function LandingProductProvider({
  children,
  product: baseProduct,
}: LandingProductProviderProps) {
  const { t } = useTranslation();
  const { addProduct, getProductsByInventoryId } = useCartStore();
  const { shopDetails } = useShopStore();

  // Check if stock management is enabled
  const isStockMaintain = shopDetails?.metadata?.settings?.shop_settings
    ? (shopDetails.metadata.settings.shop_settings as { is_stock_maintain?: boolean })?.is_stock_maintain ?? true
    : true;

  // Get cart products for this inventory
  const cartProducts = getProductsByInventoryId(Number(baseProduct.id));
  const totalInCart = cartProducts.reduce((sum, p) => sum + (p.qty || 0), 0);

  // Build default variants from mandatory variant types
  const defaultVariants = useMemo(() => {
    if (baseProduct?.variant_types && baseProduct.variant_types.length > 0) {
      const defaults: VariantsState = {};
      baseProduct.variant_types.forEach((type) => {
        if (type.variants?.length && type.is_mandatory) {
          defaults[type.id] = {
            variant_type_id: type.id,
            variant_id: type.variants[0].id,
            price: type.variants[0].price,
            variant_name: type.variants[0].name,
            image_url: type.variants[0].image_url || undefined,
          };
        }
      });
      return defaults;
    }
    return {};
  }, [baseProduct]);

  // State
  const [selectedVariants, setSelectedVariants] = useState<VariantsState>(
    cartProducts.length > 0 ? cartProducts[0].selectedVariants || defaultVariants : defaultVariants
  );
  const [qty, setQty] = useState(1);
  const [selectedCombination, setSelectedCombination] = useState("");
  const [selectedCombinationStock, setSelectedCombinationStock] = useState(0);

  // Is stock managed by variant
  const isStockManageByVariant = baseProduct.is_stock_manage_by_variant ?? false;

  // Get variant combination for stock checking
  const getVariantCombination = useCallback(() => {
    if (!baseProduct.variant_types) return "";

    const variantIds: number[] = [];
    baseProduct.variant_types.forEach((type) => {
      if (type.is_mandatory && selectedVariants[type.id]) {
        variantIds.push(selectedVariants[type.id].variant_id);
      }
    });
    return JSON.stringify(variantIds.sort((a, b) => a - b));
  }, [baseProduct.variant_types, selectedVariants]);

  // Update combination when variants change
  useEffect(() => {
    const combination = getVariantCombination();
    setSelectedCombination(combination);

    if (isStockManageByVariant && baseProduct.stocks) {
      const stock = baseProduct.stocks.find((s) => s.combination === combination);
      setSelectedCombinationStock(stock?.quantity ?? 0);
    }
  }, [selectedVariants, getVariantCombination, isStockManageByVariant, baseProduct.stocks]);

  // Stock status
  const isStockOut = baseProduct.quantity === 0;
  const isStockNotAvailable = useMemo(() => {
    if (!isStockMaintain) return false;
    if (isStockManageByVariant) {
      return qty > selectedCombinationStock;
    }
    return qty > (baseProduct.quantity || 0);
  }, [isStockMaintain, isStockManageByVariant, qty, selectedCombinationStock, baseProduct.quantity]);

  // Pricing calculations
  const productPricing: ProductPricingType = useMemo(() => {
    const additionalPrice = Object.values(selectedVariants).reduce(
      (sum, v) => sum + (v?.price || 0),
      0
    );

    const currentPrice = (baseProduct.price || 0) + additionalPrice;
    const regularPrice = (baseProduct.old_price || baseProduct.price || 0) + additionalPrice;
    const hasSavePrice = regularPrice > currentPrice;

    return {
      additionalPrice,
      currentPrice,
      regularPrice,
      hasSavePrice,
      showOldPrice: true,
      savePrice: hasSavePrice ? regularPrice - currentPrice : 0,
      unitName: baseProduct.unit_name || "",
    };
  }, [baseProduct.price, baseProduct.old_price, baseProduct.unit_name, selectedVariants]);

  // Handle variant selection
  const onSelectVariants = useCallback(
    (args: VariantState, options?: { canToggle?: boolean }) => {
      setSelectedVariants((prev) => {
        // If can toggle and already selected, remove it
        if (options?.canToggle && prev[args.variant_type_id]?.variant_id === args.variant_id) {
          const newState = { ...prev };
          delete newState[args.variant_type_id];
          return newState;
        }

        return {
          ...prev,
          [args.variant_type_id]: args,
        };
      });
    },
    []
  );

  // Quantity controls
  const subQty = useCallback(() => {
    setQty((prev) => Math.max(1, prev - 1));
  }, []);

  const sumQty = useCallback(() => {
    const maxQty = isStockManageByVariant ? selectedCombinationStock : (baseProduct.quantity || 999);
    setQty((prev) => Math.min(maxQty, prev + 1));
  }, [isStockManageByVariant, selectedCombinationStock, baseProduct.quantity]);

  // Add to cart action
  const handleProductCartAction = useCallback(
    (option?: { img_url?: string }) => {
      if (isStockOut || isStockNotAvailable) return;

      const productRecord = baseProduct as unknown as Record<string, unknown>;
      addProduct({
        ...baseProduct,
        id: Number(baseProduct.id),
        image_url: option?.img_url || baseProduct.images?.[0] || baseProduct.image_url,
        qty,
        selectedVariants,
        price: productPricing.currentPrice,
        total_inventory_sold: (productRecord.total_inventory_sold as number) ?? 0,
        categories: baseProduct.categories ?? [],
        variant_types: baseProduct.variant_types ?? [],
        stocks: baseProduct.stocks ?? [],
        reviews: (productRecord.reviews as Array<unknown>) ?? [],
      } as Parameters<typeof addProduct>[0]);
    },
    [isStockOut, isStockNotAvailable, baseProduct, qty, selectedVariants, productPricing.currentPrice, addProduct]
  );

  // Scroll to checkout section
  const scrollToCheckout = useCallback(() => {
    document.getElementById("checkout-form-section")?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  // Action button label
  const isInCart = cartProducts.length > 0;
  const actionButtonLabel = isInCart ? t("update_cart") : t("add_to_cart");

  // Product action controller
  const productActionController: ProductActionController = useMemo(
    () => ({
      qty,
      subQty,
      sumQty,
      disableSub: qty <= 1,
      handleProductCartAction,
      actionButtonLabel,
    }),
    [qty, subQty, sumQty, handleProductCartAction, actionButtonLabel]
  );

  // Context value
  const value: LandingProductContextValue = useMemo(
    () => ({
      product: baseProduct,
      selectedVariants,
      defaultVariants,
      productPricing,
      productActionController,
      cartProducts,
      totalInCart,
      isStockOut,
      isStockNotAvailable,
      isStockManageByVariant,
      selectedCombination,
      selectedCombinationStock,
      onSelectVariants,
      setQty,
      scrollToCheckout,
    }),
    [
      baseProduct,
      selectedVariants,
      defaultVariants,
      productPricing,
      productActionController,
      cartProducts,
      totalInCart,
      isStockOut,
      isStockNotAvailable,
      isStockManageByVariant,
      selectedCombination,
      selectedCombinationStock,
      onSelectVariants,
      scrollToCheckout,
    ]
  );

  return (
    <LandingProductContext.Provider value={value}>
      {children}
    </LandingProductContext.Provider>
  );
}

// Custom hook to use the context
export function useLandingProduct() {
  const context = useContext(LandingProductContext);
  if (!context) {
    throw new Error("useLandingProduct must be used within a LandingProductProvider");
  }
  return context;
}

export type { LandingProductContextValue, ProductPricingType, ProductActionController };
