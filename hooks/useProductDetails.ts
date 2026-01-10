"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useCallback, useRef } from "react";
import { useProductDetailsStore } from "@/stores/productDetailsStore";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/stores/productsStore";

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
  const {
    setProduct,
    setProductDetailsPageConfig,
    setLoading,
    setError,
    selectVariant,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    resetVariants,
    selectedVariants,
    quantity,
    computedPrice,
  } = useProductDetailsStore();

  // Cart store for auto-selecting variants
  const cartProducts = useCartStore((state) => state.products);

  // Track if we've already synced variants from cart (to avoid infinite loops)
  const hasInitializedFromCart = useRef(false);

  // Product query
  const productQuery = useQuery({
    queryKey: ["product", handle],
    queryFn: () => {
      return fetchProduct(handle);
    },
    enabled: !!handle,
    staleTime: 1000 * 60 * 2, // 2 minutes - product data changes less frequently
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Product details page config query
  const pageConfigQuery = useQuery({
    queryKey: ["product-details-page-config"],
    queryFn: fetchProductDetailsPageConfig,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });

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

  // Auto-select variants from cart if product is already in cart
  useEffect(() => {
    const product = productQuery.data?.data?.product;
    if (!product || hasInitializedFromCart.current) return;

    const productId = typeof product.id === "string" ? parseInt(product.id, 10) : product.id;

    // Find this product in cart
    const cartItem = Object.values(cartProducts).find((item) => item.id === productId);

    if (cartItem && cartItem.selectedVariants && Object.keys(cartItem.selectedVariants).length > 0) {
      hasInitializedFromCart.current = true;

      // Auto-select each variant from cart
      Object.entries(cartItem.selectedVariants).forEach(([variantTypeId, cartVariant]) => {
        // Find the variant in the product's variant_types
        const variantType = product.variant_types?.find(
          (vt) => vt.id === Number(variantTypeId)
        );
        if (variantType) {
          const variant = variantType.variants.find(
            (v) => v.id === cartVariant.variant_id
          );
          if (variant) {
            selectVariant(Number(variantTypeId), variant);
          }
        }
      });

      // Also set the quantity from cart
      if (cartItem.qty) {
        setQuantity(cartItem.qty);
      }
    } else {
      // Product not in cart, mark as initialized anyway to avoid re-running
      hasInitializedFromCart.current = true;
    }
  }, [productQuery.data, cartProducts, selectVariant, setQuantity]);

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

  // Check if current variant combination is in stock
  const isInStock = useCallback(() => {
    const product = productQuery.data?.data?.product;
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
  }, [productQuery.data, selectedVariants]);

  // Get stock quantity for current selection
  const getStockQuantity = useCallback(() => {
    const product = productQuery.data?.data?.product;
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
  }, [productQuery.data, selectedVariants]);

  // Check if all mandatory variants are selected
  const allMandatoryVariantsSelected = useCallback(() => {
    const product = productQuery.data?.data?.product;
    if (!product?.variant_types?.length) return true;

    const mandatoryTypes = product.variant_types.filter(
      (vt) => vt.is_mandatory
    );
    return mandatoryTypes.every((vt) => selectedVariants[vt.id]);
  }, [productQuery.data, selectedVariants]);

  // Get variant image (for color/image variants)
  const getVariantImage = useCallback(() => {
    const product = productQuery.data?.data?.product;
    if (!product?.image_variant_type_id) return product?.image_url || "";

    const imageVariant = selectedVariants[product.image_variant_type_id];
    return imageVariant?.image_url || product.image_url || "";
  }, [productQuery.data, selectedVariants]);

  return {
    // Queries
    productQuery,
    pageConfigQuery,

    // Data
    product: productQuery.data?.data?.product || null,
    sections: pageConfigQuery.data?.data?.sections || [],
    seo: pageConfigQuery.data?.data?.seo || {},

    // State
    isLoading: productQuery.isLoading,
    isPageConfigLoading: pageConfigQuery.isLoading,
    error: productQuery.error,
    notFound: productQuery.error?.message === "Product not found",

    // Variant state
    selectedVariants,
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

    // Computed helpers
    isInStock: isInStock(),
    stockQuantity: getStockQuantity(),
    allMandatoryVariantsSelected: allMandatoryVariantsSelected(),
    variantImage: getVariantImage(),
  };
}
