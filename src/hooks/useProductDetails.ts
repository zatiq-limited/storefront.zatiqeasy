import { useQuery } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { useProductDetailsStore } from "@/stores/productDetailsStore";
import type { Product, Variant } from "@/stores/productsStore";

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

  // Product query
  const productQuery = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProduct(handle),
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetVariants();
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

    const mandatoryTypes = product.variant_types.filter((vt) => vt.is_mandatory);
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
