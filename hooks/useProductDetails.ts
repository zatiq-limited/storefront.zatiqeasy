"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProductDetailsStore } from "@/stores/productDetailsStore";
import { useCartStore } from "@/stores/cartStore";
import { useShopStore } from "@/stores/shopStore";
import type { Product } from "@/stores/productsStore";
import type { VariantsState, CartProduct } from "@/types/cart.types";
import { CACHE_TIMES, DEFAULT_QUERY_OPTIONS } from "@/lib/constants";

interface ProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

interface ProductDetailsPageConfigResponse {
  success: boolean;
  data: {
    template: string;
    sections: Array<{
      id: string;
      type: string;
      enabled: boolean;
      settings: Record<string, unknown>;
    }>;
    seo: Record<string, unknown>;
  };
}

// Pricing information calculated from product and variants
export interface ProductPricing {
  currentPrice: number;
  regularPrice: number;
  variantPriceTotal: number;
  hasDiscount: boolean;
  savePrice: number;
  discountPercentage: number;
}

// Cart-related information for the product
export interface ProductCartInfo {
  isInCart: boolean;
  cartQty: number;
  matchingCartItem: CartProduct | null;
  cartProducts: CartProduct[];
}

// Stock-related information
export interface ProductStockInfo {
  isStockMaintain: boolean;
  isInStock: boolean;
  isStockOut: boolean;
  stockQuantity: number;
  isStockNotAvailable: boolean;
}

// Fetch single product by handle
async function fetchProduct(handle: string): Promise<ProductResponse> {
  const res = await fetch(`/api/storefront/v1/products/${handle}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Product not found");
    }
    throw new Error("Failed to fetch product");
  }
  return res.json();
}

// Fetch product details page configuration
async function fetchProductDetailsPageConfig(): Promise<ProductDetailsPageConfigResponse> {
  const res = await fetch("/api/storefront/v1/page/product-details");
  if (!res.ok) throw new Error("Failed to fetch product details page config");
  return res.json();
}

export function useProductDetails(handle: string) {
  const router = useRouter();
  const { shopDetails } = useShopStore();
  const {
    setProduct,
    setProductDetailsPageConfig,
    setLoading,
    setError,
    selectVariant: storeSelectVariant,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    resetVariants,
    selectedVariants,
    quantity,
    computedPrice,
  } = useProductDetailsStore();

  // Cart store
  const allCartProducts = useCartStore((state) => state.products);
  const addProductToCart = useCartStore((state) => state.addProduct);
  const removeProductFromCart = useCartStore((state) => state.removeProduct);

  // Track if we've already synced variants from cart (to avoid infinite loops)
  const hasInitializedFromCart = useRef(false);

  // Get existing product from store for initialData (prevents loading state on navigation)
  const storeProduct = useProductDetailsStore((state) => state.product);
  const hasStoreProduct = storeProduct && storeProduct.slug === handle;

  // Shop settings
  const baseUrl = shopDetails?.baseUrl || "";
  const currency = shopDetails?.country_currency || "BDT";
  const isStockMaintain = shopDetails?.isStockMaintain !== false;

  // Product query
  const productQuery = useQuery({
    queryKey: ["product", handle],
    queryFn: () => {
      return fetchProduct(handle);
    },
    enabled: !!handle,
    // Use store product as initial data if it matches current handle
    initialData: hasStoreProduct
      ? { success: true, data: { product: storeProduct } }
      : undefined,
    ...CACHE_TIMES.PRODUCT_DETAIL,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Get existing page config from store
  const storePageConfig = useProductDetailsStore(
    (state) => state.productDetailsPageConfig
  );
  const hasStorePageConfig =
    storePageConfig && Object.keys(storePageConfig).length > 0;

  // Product details page config query
  const pageConfigQuery = useQuery({
    queryKey: ["product-details-page-config"],
    queryFn: fetchProductDetailsPageConfig,
    initialData: hasStorePageConfig
      ? {
          success: true,
          data: storePageConfig as ProductDetailsPageConfigResponse["data"],
        }
      : undefined,
    ...CACHE_TIMES.PAGE_CONFIG,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Current product
  const product = productQuery.data?.data?.product || null;

  // Sync product to store
  useEffect(() => {
    if (productQuery.data?.data?.product) {
      setProduct(productQuery.data.data.product);
    }
    setLoading(productQuery.isLoading);
    if (productQuery.error) {
      setError((productQuery.error as Error).message);
    } else {
      setError(null);
    }
  }, [
    productQuery.data,
    productQuery.isLoading,
    productQuery.error,
    setProduct,
    setLoading,
    setError,
  ]);

  // Sync page config to store
  useEffect(() => {
    if (pageConfigQuery.data?.data) {
      setProductDetailsPageConfig(
        pageConfigQuery.data.data as Record<string, unknown>
      );
    }
  }, [pageConfigQuery.data, setProductDetailsPageConfig]);

  // ============================================
  // CENTRALIZED: selectedVariantsAsState
  // Transform selectedVariants to VariantsState format
  // ============================================
  const selectedVariantsAsState = useMemo((): VariantsState => {
    const state: VariantsState = {};
    Object.entries(selectedVariants).forEach(([key, variant]) => {
      state[Number(key)] = {
        variant_type_id: Number(key),
        variant_id: variant.id,
        price: variant.price || 0,
        variant_name: variant.name,
        variant_type_name:
          product?.variant_types?.find((vt) => vt.id === Number(key))?.title ||
          "",
        image_url: variant.image_url,
      };
    });
    return state;
  }, [selectedVariants, product?.variant_types]);

  // ============================================
  // CENTRALIZED: Cart Products for this product
  // ============================================
  const cartProducts = useMemo(
    (): CartProduct[] =>
      product?.id
        ? Object.values(allCartProducts).filter(
            (p) => p.id === Number(product.id)
          )
        : [],
    [product, allCartProducts]
  );

  // ============================================
  // CENTRALIZED: isSameVariantsCombination helper
  // ============================================
  const isSameVariantsCombination = useCallback(
    (variants1: VariantsState, variants2: VariantsState): boolean => {
      const keys1 = Object.keys(variants1);
      const keys2 = Object.keys(variants2);
      if (keys1.length !== keys2.length) return false;
      return keys1.every((key) => {
        const v1 = variants1[key];
        const v2 = variants2[key];
        return v1?.variant_id === v2?.variant_id;
      });
    },
    []
  );

  // ============================================
  // CENTRALIZED: Matching Cart Item
  // ============================================
  const matchingCartItem = useMemo((): CartProduct | null => {
    if (cartProducts.length === 0) return null;
    // For non-variant products, return first cart item
    if (!product?.variant_types || product.variant_types.length === 0) {
      return cartProducts[0];
    }
    // For variant products, find matching selected variants
    return (
      cartProducts.find((item) =>
        isSameVariantsCombination(
          item.selectedVariants || {},
          selectedVariantsAsState
        )
      ) || null
    );
  }, [
    cartProducts,
    product,
    isSameVariantsCombination,
    selectedVariantsAsState,
  ]);

  // Cart info derived values
  const isInCart = cartProducts.length > 0;
  const cartQty = cartProducts.reduce((acc, p) => acc + (p.qty || 0), 0);

  // ============================================
  // CENTRALIZED: Sync quantity with cart
  // ============================================
  const matchingCartQty = matchingCartItem?.qty ?? 0;
  useEffect(() => {
    if (matchingCartQty > 0) {
      setQuantity(matchingCartQty);
    } else {
      setQuantity(1);
    }
  }, [matchingCartQty, setQuantity]);

  // Auto-select variants from cart if product is already in cart
  useEffect(() => {
    if (!product || hasInitializedFromCart.current) return;

    const productId =
      typeof product.id === "string" ? parseInt(product.id, 10) : product.id;

    // Find this product in cart
    const cartItem = Object.values(allCartProducts).find(
      (item) => item.id === productId
    );

    if (
      cartItem &&
      cartItem.selectedVariants &&
      Object.keys(cartItem.selectedVariants).length > 0
    ) {
      hasInitializedFromCart.current = true;

      // Auto-select each variant from cart
      Object.entries(cartItem.selectedVariants).forEach(
        ([variantTypeId, cartVariant]) => {
          // Find the variant in the product's variant_types
          const variantType = product.variant_types?.find(
            (vt) => vt.id === Number(variantTypeId)
          );
          if (variantType) {
            const variant = variantType.variants.find(
              (v) => v.id === cartVariant.variant_id
            );
            if (variant) {
              storeSelectVariant(Number(variantTypeId), variant);
            }
          }
        }
      );

      // Also set the quantity from cart
      if (cartItem.qty) {
        setQuantity(cartItem.qty);
      }
    } else {
      // Product not in cart, mark as initialized anyway to avoid re-running
      hasInitializedFromCart.current = true;
    }
  }, [product, allCartProducts, storeSelectVariant, setQuantity]);

  // Reset the initialization flag when handle changes (new product)
  useEffect(() => {
    hasInitializedFromCart.current = false;
  }, [handle]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetVariants();
      hasInitializedFromCart.current = false;
    };
  }, [resetVariants]);

  // ============================================
  // CENTRALIZED: Stock Calculations
  // ============================================
  const getStockQuantity = useCallback((): number => {
    if (!product) return 0;

    if (!product.has_variant || !product.variant_types?.length) {
      return product.quantity || 0;
    }

    if (product.is_stock_manage_by_variant && product.stocks?.length) {
      const selectedIds = Object.values(selectedVariants).map((v) => v.id);
      if (selectedIds.length === 0) return product.quantity || 0;

      const combination = JSON.stringify(selectedIds.sort((a, b) => a - b));
      const stock = product.stocks.find(
        (s) => JSON.stringify(JSON.parse(s.combination).sort()) === combination
      );
      return stock?.quantity || 0;
    }

    return product.quantity || 0;
  }, [product, selectedVariants]);

  const checkIsInStock = useCallback((): boolean => {
    if (!product) return false;

    // If no variants, check main quantity
    if (!product.has_variant || !product.variant_types?.length) {
      return (product.quantity || 0) > 0;
    }

    // If stock is managed by variant, check stock combination
    if (product.is_stock_manage_by_variant && product.stocks?.length) {
      const selectedIds = Object.values(selectedVariants).map((v) => v.id);
      if (selectedIds.length === 0) return true; // No selection yet

      const combination = JSON.stringify(selectedIds.sort((a, b) => a - b));
      const stock = product.stocks.find(
        (s) => JSON.stringify(JSON.parse(s.combination).sort()) === combination
      );
      return stock ? stock.is_active && stock.quantity > 0 : false;
    }

    return (product.quantity || 0) > 0;
  }, [product, selectedVariants]);

  const stockQuantity = getStockQuantity();
  const isInStockValue = checkIsInStock();
  const isStockOut = isStockMaintain && !isInStockValue;
  const isStockNotAvailable =
    isStockMaintain && (!isInStockValue || quantity >= stockQuantity);

  // Stock info object
  const stockInfo: ProductStockInfo = useMemo(
    () => ({
      isStockMaintain,
      isInStock: isInStockValue,
      isStockOut,
      stockQuantity,
      isStockNotAvailable,
    }),
    [isStockMaintain, isInStockValue, isStockOut, stockQuantity, isStockNotAvailable]
  );

  // ============================================
  // CENTRALIZED: Pricing Calculations
  // ============================================
  const pricing: ProductPricing = useMemo(() => {
    const basePrice = product?.price || 0;
    const oldPrice = product?.old_price || 0;

    const variantPriceTotal = Object.values(selectedVariants).reduce(
      (sum, v) => sum + (v.price || 0),
      0
    );

    const currentPrice = basePrice + variantPriceTotal;
    const regularPrice = oldPrice > 0 ? oldPrice + variantPriceTotal : currentPrice;
    const hasDiscount = oldPrice > 0 && oldPrice > basePrice;
    const savePrice = hasDiscount ? oldPrice - basePrice : 0;
    const discountPercentage = hasDiscount
      ? Math.round((savePrice / oldPrice) * 100)
      : 0;

    return {
      currentPrice,
      regularPrice,
      variantPriceTotal,
      hasDiscount,
      savePrice,
      discountPercentage,
    };
  }, [product?.price, product?.old_price, selectedVariants]);

  // Cart info object
  const cartInfo: ProductCartInfo = useMemo(
    () => ({
      isInCart,
      cartQty,
      matchingCartItem,
      cartProducts,
    }),
    [isInCart, cartQty, matchingCartItem, cartProducts]
  );

  // ============================================
  // CENTRALIZED: Variant Selection
  // ============================================
  const selectVariant = useCallback(
    (
      variantTypeId: number,
      variant: {
        id: number;
        name: string;
        price?: number;
        image_url?: string | null;
      }
    ) => {
      // Ensure price has a default value of 0 if undefined
      storeSelectVariant(variantTypeId, {
        ...variant,
        price: variant.price ?? 0,
      });
    },
    [storeSelectVariant]
  );

  // Check if all mandatory variants are selected
  const allMandatoryVariantsSelected = useCallback((): boolean => {
    if (!product?.variant_types?.length) return true;

    const mandatoryTypes = product.variant_types.filter(
      (vt) => vt.is_mandatory
    );
    return mandatoryTypes.every((vt) => selectedVariants[vt.id]);
  }, [product, selectedVariants]);

  // Get variant image (for color/image variants)
  const getVariantImage = useCallback((): string => {
    if (!product?.image_variant_type_id) return product?.image_url || "";

    const imageVariant = selectedVariants[product.image_variant_type_id];
    return imageVariant?.image_url || product.image_url || "";
  }, [product, selectedVariants]);

  // ============================================
  // CENTRALIZED: Add to Cart Handler
  // ============================================
  const handleAddToCart = useCallback((): boolean => {
    if (!product || !isInStockValue) return false;

    // Check if all mandatory variants are selected
    if (product.variant_types && product.variant_types.length > 0) {
      const mandatoryVariants = product.variant_types.filter(
        (vt) => vt.is_mandatory
      );
      const allSelected = mandatoryVariants.every(
        (vt) => selectedVariants[vt.id]
      );

      if (!allSelected) {
        alert("Please select all required variants");
        return false;
      }
    }

    // For products already in cart (matching selected variants), remove old cart item first
    if (matchingCartItem) {
      removeProductFromCart(matchingCartItem.cartId);
    }

    // Add product to cart
    addProductToCart({
      ...product,
      id: Number(product.id),
      price: pricing.currentPrice,
      image_url: product.images?.[0] || product.image_url || "",
      qty: quantity,
      selectedVariants: selectedVariantsAsState,
      total_inventory_sold: (product as unknown as Record<string, unknown>)
        .total_inventory_sold as number || 0,
      categories: product.categories ?? [],
      variant_types: product.variant_types ?? [],
      stocks: product.stocks ?? [],
      reviews: (product as unknown as Record<string, unknown>).reviews as Array<unknown> ?? [],
    } as unknown as Parameters<typeof addProductToCart>[0]);

    return true;
  }, [
    product,
    isInStockValue,
    selectedVariants,
    matchingCartItem,
    removeProductFromCart,
    addProductToCart,
    pricing.currentPrice,
    quantity,
    selectedVariantsAsState,
  ]);

  // ============================================
  // CENTRALIZED: Buy Now Handler
  // ============================================
  const handleBuyNow = useCallback((): boolean => {
    if (!product || !isInStockValue) return false;

    // If not in cart with matching variants, add it first
    if (!matchingCartItem) {
      const added = handleAddToCart();
      if (!added) return false;
    }

    // Navigate to checkout
    router.push(`${baseUrl}/checkout`);
    return true;
  }, [product, isInStockValue, matchingCartItem, handleAddToCart, router, baseUrl]);

  // ============================================
  // CENTRALIZED: Product Images
  // ============================================
  const productImages = useMemo((): string[] => {
    if (!product) return [];
    const imgs: string[] = [];
    if (product.images?.length) {
      imgs.push(...product.images.filter((img): img is string => !!img));
    }
    if (product.image_url && !imgs.includes(product.image_url)) {
      imgs.unshift(product.image_url);
    }
    return imgs;
  }, [product]);

  // ============================================
  // Return everything
  // ============================================
  return {
    // Queries
    productQuery,
    pageConfigQuery,

    // Data
    product,
    sections: pageConfigQuery.data?.data?.sections || [],
    seo: pageConfigQuery.data?.data?.seo || {},

    // State
    isLoading: productQuery.isLoading,
    isPageConfigLoading: pageConfigQuery.isLoading,
    error: productQuery.error,
    notFound: productQuery.error?.message === "Product not found",

    // Variant state
    selectedVariants,
    selectedVariantsAsState, // Pre-transformed for cart operations
    quantity,
    computedPrice:
      computedPrice || productQuery.data?.data?.product?.price || 0,

    // Actions
    selectVariant,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    resetVariants,
    refetch: productQuery.refetch,

    // Centralized handlers
    handleAddToCart,
    handleBuyNow,

    // Computed helpers
    isInStock: isInStockValue,
    stockQuantity,
    allMandatoryVariantsSelected: allMandatoryVariantsSelected(),
    variantImage: getVariantImage(),

    // Centralized objects
    pricing,
    cartInfo,
    stockInfo,

    // Images
    productImages,

    // Shop settings
    baseUrl,
    currency,

    // Helper functions (for custom use cases)
    isSameVariantsCombination,
  };
}
