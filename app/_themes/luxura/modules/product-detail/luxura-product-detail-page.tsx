"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/stores/cartStore";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { GridContainer } from "../../components/core";
import { LuxuraProductCard } from "../../components/cards";
import { SectionHeader } from "../home/sections/section-header";
import { formatPrice } from "@/lib/utils/formatting";
import { cn } from "@/lib/utils";
import type { VariantsState, VariantState } from "@/types/cart.types";

export function LuxuraProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();

  const productHandle = params?.productHandle as string;

  const { shopDetails } = useShopStore();
  const products = useProductsStore((state) => state.products);
  const totalCartProducts = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);
  const { addProduct, removeProduct } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<{
    id: number;
    name: string;
    price?: number;
  } | null>(null);

  const baseUrl = shopDetails?.baseUrl || "";
  const currency = shopDetails?.country_currency || "BDT";
  const hasItems = totalCartProducts > 0;

  // Find product by handle/id
  const product = useMemo(() => {
    return products.find(
      (p) => String(p.id) === productHandle || (p as unknown as { handle?: string }).handle === productHandle
    );
  }, [products, productHandle]);

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
  // Then filter to get only this product's cart items (reactive approach like basic/premium themes)
  const allCartProducts = useCartStore((state) => state.products);
  const cartProducts = useMemo(
    () =>
      product?.id
        ? Object.values(allCartProducts).filter((p) => p.id === Number(product.id))
        : [],
    [product?.id, allCartProducts]
  );
  const cartQuantity = cartProducts.reduce((acc, p) => acc + (p.qty || 0), 0);
  const isInCart = cartProducts.length > 0;

  // For non-variant products, find the cart item directly
  // For variant products, find the matching variant combination
  const matchingCartItem = useMemo(() => {
    if (cartProducts.length === 0) return null;
    // For non-variant products, return first cart item
    if (!product?.variant_types || product.variant_types.length === 0) {
      return cartProducts[0];
    }
    // For variant products with selectedVariant, find matching
    if (selectedVariant) {
      return cartProducts.find((item) => {
        const itemVariants = item.selectedVariants || {};
        return Object.values(itemVariants).some(
          (v) => v.variant_id === selectedVariant.id
        );
      }) || null;
    }
    return cartProducts[0];
  }, [cartProducts, selectedVariant, product?.variant_types]);

  // Sync quantity with matching cart item
  // Use matchingCartItem?.qty in dependency to detect actual value changes
  const matchingCartQty = matchingCartItem?.qty ?? 0;
  useEffect(() => {
    if (matchingCartQty > 0) {
      setQuantity(matchingCartQty);
    }
  }, [matchingCartQty]);

  // Check stock
  const isOutOfStock = product?.quantity === 0;

  // Calculate price with variant
  const currentPrice = selectedVariant?.price || product?.price || 0;

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    if (!product || isOutOfStock) return;

    // For products already in cart (matching selected variants), remove old cart item first
    // Same logic as premium theme
    if (matchingCartItem) {
      removeProduct(matchingCartItem.cartId);
    }

    // Build selected variants if any
    const selectedVariants: VariantsState = {};
    if (selectedVariant) {
      selectedVariants[selectedVariant.id] = {
        variant_type_id: selectedVariant.id,
        variant_id: selectedVariant.id,
        price: selectedVariant.price || product.price,
        variant_name: selectedVariant.name,
      };
    }

    addProduct({
      ...product,
      id: Number(product.id),
      price: currentPrice,
      image_url: images[0] || "",
      qty: quantity,
      selectedVariants,
      total_inventory_sold: 0,
      categories: product.categories ?? [],
      variant_types: product.variant_types ?? [],
      stocks: product.stocks ?? [],
      reviews: [],
    } as unknown as Parameters<typeof addProduct>[0]);
  }, [product, isOutOfStock, matchingCartItem, removeProduct, addProduct, currentPrice, images, quantity, selectedVariant]);

  // Handle buy now
  const handleBuyNow = useCallback(() => {
    if (!product || isOutOfStock) return;

    if (!isInCart) {
      handleAddToCart();
    }

    router.push(`${baseUrl}/checkout`);
  }, [product, isOutOfStock, isInCart, handleAddToCart, router, baseUrl]);

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
      <div className="pb-20 w-[95%] md:w-[90%] lg:w-[78%] mx-auto py-8">
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
                      ((product.old_price - product.price) / product.old_price) * 100
                    )}% OFF
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
            {isInCart && (
              <p className="text-sm text-blue-600 font-medium">
                Already in your cart ({cartQuantity})
              </p>
            )}

            {/* Variants */}
            {product.variant_types?.map((variantType) => (
              <div key={variantType.id} className="space-y-3">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {variantType.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variantType.variants?.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={cn(
                        "px-4 py-2 rounded-lg border transition-colors",
                        selectedVariant?.id === variant.id
                          ? "border-blue-zatiq bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 hover:border-blue-zatiq"
                      )}
                    >
                      {variant.name}
                    </button>
                  ))}
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
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
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
                {isInCart ? t("update_cart") : t("add_to_cart")}
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
            <SectionHeader
              text={t("related_products")}
              link="/products"
            />
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
