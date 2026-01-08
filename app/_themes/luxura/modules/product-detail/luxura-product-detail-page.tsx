"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  Minus,
  Plus,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/stores/cartStore";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { GridContainer } from "../../components/core";
import { LuxuraProductCard } from "../../components/cards";
import { SectionHeader } from "../home/sections/section-header";
import { formatPrice } from "@/lib/utils/formatting";
import { cn } from "@/lib/utils";
import type { VariantsState } from "@/types/cart.types";
import { useProductDetails, useShopInventories } from "@/hooks";
import type { Product } from "@/stores/productsStore";

export function LuxuraProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();

  // Support both 'productHandle' (merchant routes) and 'handle' (main routes)
  const productHandle = (params?.productHandle || params?.handle) as string;

  const { shopDetails } = useShopStore();
  const storeProducts = useProductsStore((state) => state.products);
  const totalCartProducts = useCartStore(selectTotalItems);

  // Fetch products if store is empty (handles page reload scenario)
  const { data: fetchedProducts } = useShopInventories(
    { shopUuid: shopDetails?.shop_uuid || "" },
    { enabled: storeProducts.length === 0 && !!shopDetails?.shop_uuid }
  );

  // Use store products if available, otherwise use fetched products
  const products = useMemo(
    () =>
      storeProducts.length > 0
        ? storeProducts
        : (fetchedProducts as Product[]) || [],
    [storeProducts, fetchedProducts]
  );
  const totalPrice = useCartStore(selectSubtotal);
  const { addProduct, removeProduct } = useCartStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const baseUrl = shopDetails?.baseUrl || "";
  const currency = shopDetails?.country_currency || "BDT";
  const hasItems = totalCartProducts > 0;

  // Use product details hook for state management (same as Basic/Premium themes)
  const {
    product,
    selectedVariants,
    quantity,
    selectVariant,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    isInStock,
  } = useProductDetails(productHandle);

  // Get related products (same category, excluding current)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.category_id === product.category_id ||
            p.categories?.some((c) =>
              product.categories?.some((pc) => pc.id === c.id)
            ))
      )
      .slice(0, 4);
  }, [products, product]);

  // Product images
  const images = useMemo((): string[] => {
    if (!product) return [];
    if (product.images?.length) {
      return product.images.filter((img): img is string => !!img);
    }
    return product.image_url ? [product.image_url] : [];
  }, [product]);

  // Get cart products for this product - subscribe to products state to track cart changes
  // Then filter to get only this product's cart items (same as Basic/Premium themes)
  const allCartProducts = useCartStore((state) => state.products);
  const cartProducts = useMemo(
    () =>
      product?.id
        ? Object.values(allCartProducts).filter(
            (p) => p.id === Number(product.id)
          )
        : [],
    [product, allCartProducts]
  );
  const isInCartDirect = cartProducts.length > 0;
  const cartQty = cartProducts.reduce((acc, p) => acc + (p.qty || 0), 0);

  // Helper to check if two variant selections match (same as Basic/Premium themes)
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

  // Transform selectedVariants to VariantsState format for comparison (same as Basic theme)
  const selectedVariantsAsState = useMemo(() => {
    const state: VariantsState = {};
    Object.entries(selectedVariants).forEach(([key, variant]) => {
      state[Number(key)] = {
        variant_type_id: Number(key),
        variant_id: variant.id,
        price: variant.price || 0,
        variant_name: variant.name,
        image_url: variant.image_url,
      };
    });
    return state;
  }, [selectedVariants]);

  // Find matching cart item based on variants (same as Basic theme)
  const matchingCartItem = useMemo(() => {
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

  // Sync quantity with matching cart item (same as Basic theme)
  const matchingCartQty = matchingCartItem?.qty ?? 0;
  useEffect(() => {
    if (matchingCartQty > 0) {
      setQuantity(matchingCartQty);
    } else {
      setQuantity(1);
    }
  }, [matchingCartQty, setQuantity]);

  // Restore selected variants from cart (when product page loads)
  // This ensures the variants that were added to cart are pre-selected
  useEffect(() => {
    if (
      !product ||
      !product.variant_types ||
      product.variant_types.length === 0
    ) {
      return;
    }

    // Find the first cart item for this product
    const firstCartItem = cartProducts[0];
    if (!firstCartItem?.selectedVariants) {
      return;
    }

    // Restore each variant from the cart
    Object.entries(firstCartItem.selectedVariants).forEach(
      ([variantTypeId, variantState]) => {
        const typeId = Number(variantTypeId);
        const variantId = variantState.variant_id;

        // Find the variant in the product's variant types
        const variantType = product.variant_types?.find(
          (vt) => vt.id === typeId
        );
        if (variantType?.variants) {
          const variant = variantType.variants.find((v) => v.id === variantId);
          if (variant) {
            selectVariant(typeId, variant);
          }
        }
      }
    );
  }, [product, cartProducts, selectVariant]);

  // Check stock (use hook's isInStock)
  const isOutOfStock = !isInStock;

  // Calculate price with variants (same as Basic theme)
  const currentPrice = useMemo(() => {
    const basePrice = product?.price || 0;
    const variantPrice = Object.values(selectedVariants).reduce(
      (sum, v) => sum + (v.price || 0),
      0
    );
    return basePrice + variantPrice;
  }, [product, selectedVariants]);

  // Handle add to cart (same as Basic/Premium themes)
  const handleAddToCart = useCallback(() => {
    if (!product || !isInStock) return;

    // Check if all mandatory variants are selected
    if (product.variant_types && product.variant_types.length > 0) {
      const mandatoryVariants = product.variant_types.filter(
        (vt) => vt.is_mandatory
      );
      const allMandatorySelected = mandatoryVariants.every(
        (vt) => selectedVariants[vt.id]
      );

      if (!allMandatorySelected) {
        alert("Please select all required variants");
        return;
      }
    }

    // For products already in cart (matching selected variants), remove old cart item first
    if (matchingCartItem) {
      removeProduct(matchingCartItem.cartId);
    }

    // Transform selectedVariants to match VariantState structure
    const transformedVariants: VariantsState = {};
    Object.entries(selectedVariants).forEach(([key, variant]) => {
      transformedVariants[Number(key)] = {
        variant_type_id: Number(key),
        variant_id: variant.id,
        price: variant.price || 0,
        variant_name: variant.name,
        image_url: variant.image_url,
      };
    });

    addProduct({
      ...product,
      id: Number(product.id),
      price: currentPrice,
      image_url: images[0] || "",
      qty: quantity,
      selectedVariants: transformedVariants,
      total_inventory_sold: 0,
      categories: product.categories ?? [],
      variant_types: product.variant_types ?? [],
      stocks: product.stocks ?? [],
      reviews: [],
    } as unknown as Parameters<typeof addProduct>[0]);
  }, [
    product,
    isInStock,
    matchingCartItem,
    removeProduct,
    addProduct,
    currentPrice,
    images,
    quantity,
    selectedVariants,
  ]);

  // Handle buy now (same as Basic theme)
  const handleBuyNow = useCallback(() => {
    if (!product || !isInStock) return;

    // If not in cart, add it first
    if (!matchingCartItem) {
      // Check if all mandatory variants are selected
      if (product.variant_types && product.variant_types.length > 0) {
        const mandatoryVariants = product.variant_types.filter(
          (vt) => vt.is_mandatory
        );
        const allMandatorySelected = mandatoryVariants.every(
          (vt) => selectedVariants[vt.id]
        );

        if (!allMandatorySelected) {
          alert("Please select all required variants");
          return;
        }
      }

      // Transform selectedVariants to match VariantState structure
      const transformedVariants: VariantsState = {};
      Object.entries(selectedVariants).forEach(([key, variant]) => {
        transformedVariants[Number(key)] = {
          variant_type_id: Number(key),
          variant_id: variant.id,
          price: variant.price || 0,
          variant_name: variant.name,
          image_url: variant.image_url,
        };
      });

      // Add product to cart
      addProduct({
        ...product,
        id: Number(product.id),
        price: currentPrice,
        image_url: images[0] || "",
        qty: quantity,
        selectedVariants: transformedVariants,
        total_inventory_sold: 0,
        categories: product.categories ?? [],
        variant_types: product.variant_types ?? [],
        stocks: product.stocks ?? [],
        reviews: [],
      } as unknown as Parameters<typeof addProduct>[0]);
    }

    router.push(`${baseUrl}/checkout`);
  }, [
    product,
    isInStock,
    matchingCartItem,
    router,
    baseUrl,
    selectedVariants,
    currentPrice,
    images,
    quantity,
    addProduct,
  ]);

  // Navigate to product
  const navigateProductDetails = useCallback(
    (id: number | string) => {
      router.push(`${baseUrl}/products/${id}`);
    },
    [router, baseUrl]
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="container pb-20 py-8">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              {images[selectedImageIndex] && (
                <Image
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors",
                      selectedImageIndex === index
                        ? "border-blue-zatiq"
                        : "border-transparent"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-2xl md:text-3xl font-bold text-blue-600">
                {formatPrice(currentPrice, currency)}
              </span>
              {product.old_price && product.old_price > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.old_price, currency)}
                  </span>
                  <span className="bg-red-100 text-red-600 text-sm font-medium px-2 py-1 rounded">
                    {Math.round(
                      ((product.old_price - product.price) /
                        product.old_price) *
                        100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            {isOutOfStock ? (
              <p className="text-red-500 font-medium">{t("out_of_stock")}</p>
            ) : (
              <p className="text-green-600 font-medium">{t("in_stock")}</p>
            )}

            {/* Already in Cart Message */}
            {isInCartDirect && (
              <p className="text-sm text-blue-600 font-medium">
                Already in your cart ({cartQty})
              </p>
            )}

            {/* Variants */}
            {product.variant_types?.map((variantType) => (
              <div key={variantType.id} className="space-y-3">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {variantType.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variantType.variants?.map((variant) => {
                    const isSelected =
                      selectedVariants[variantType.id]?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => selectVariant(variantType.id, variant)}
                        className={cn(
                          "px-4 py-2 rounded-lg border transition-colors",
                          isSelected
                            ? "border-blue-zatiq bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-300 hover:border-blue-zatiq"
                        )}
                      >
                        {variant.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {t("quantity")}
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="text-xl font-medium w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-colors",
                  isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-zatiq text-white hover:bg-blue-600"
                )}
              >
                <ShoppingCart size={20} />
                {isInCartDirect ? t("update_cart") : t("add_to_cart")}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={cn(
                  "flex-1 py-4 rounded-xl font-medium border-2 transition-colors",
                  isOutOfStock
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-blue-zatiq text-blue-zatiq hover:bg-blue-50 dark:hover:bg-blue-900/20"
                )}
              >
                {t("buy_now")}
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-6 border-t">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  {t("description")}
                </h3>
                <div
                  className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <SectionHeader text={t("related_products")} link="/products" />
            <GridContainer>
              {relatedProducts.map((p) => (
                <LuxuraProductCard
                  key={p.id}
                  product={p}
                  onNavigate={() => navigateProductDetails(p.id)}
                />
              ))}
            </GridContainer>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        onClick={() => router.push(`${baseUrl}/checkout`)}
        showCartFloatingBtn={hasItems}
        totalPrice={totalPrice}
        totalProducts={totalCartProducts}
        theme="Luxura"
      />
    </>
  );
}

export default LuxuraProductDetailPage;
