/**
 * Product Detail 1
 * Classic layout with gallery and product information
 * Thumbnail position: bottom by default
 */

"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Product, Variant } from "@/stores/productsStore";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useCartStore } from "@/stores/cartStore";

interface ProductDetail1Props {
  settings?: Record<string, unknown>;
  product: Product;
  selectedVariants: Record<number, Variant>;
  quantity: number;
  computedPrice: number;
  onSelectVariant: (variantTypeId: number, variant: Variant) => void;
  onQuantityChange: (quantity: number) => void;
  onIncrementQuantity: () => void;
  onDecrementQuantity: () => void;
}

interface ProductDetail1Settings {
  showBrand?: boolean;
  showSku?: boolean;
  showRating?: boolean;
  showStock?: boolean;
  showVariants?: boolean;
  showDescription?: boolean;
  showSpecifications?: boolean;
  showShipping?: boolean;
  showAddToCart?: boolean;
  showBuyNow?: boolean;
  showWhatsAppBuy?: boolean;
  showWishlist?: boolean;
  galleryPosition?: "left" | "right";
  thumbnailPosition?: "bottom" | "left" | "right" | "top";
  thumbnailSize?: "sm" | "md" | "lg";
  brandColor?: string;
  variantActiveColor?: string;
  addToCartBgColor?: string;
  addToCartTextColor?: string;
  buyNowGradientStart?: string;
  buyNowGradientEnd?: string;
  buyNowTextColor?: string;
  whatsappBgColor?: string;
  whatsappTextColor?: string;
  priceColor?: string;
  oldPriceColor?: string;
  discountBadgeColor?: string;
}

export default function ProductDetail1({
  settings = {},
  product,
  selectedVariants,
  quantity,
  computedPrice,
  onSelectVariant,
  onQuantityChange,
  onIncrementQuantity,
  onDecrementQuantity,
}: ProductDetail1Props) {
  const s = convertSettingsKeys<ProductDetail1Settings>(settings);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useAddToCart();
  const [isAdding, setIsAdding] = useState(false);

  // Cart state subscription for instant updates
  const cartProducts = useCartStore((state) => state.products);
  const incrementQty = useCartStore((state) => state.incrementQty);
  const decrementQty = useCartStore((state) => state.decrementQty);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  // Find matching cart item based on product and selected variants
  const cartItem = useMemo(() => {
    const productId = typeof product.id === "string" ? parseInt(product.id, 10) : product.id;
    const selectedVariantIds = Object.values(selectedVariants)
      .map((v) => v.id)
      .sort((a, b) => a - b);

    return Object.values(cartProducts).find((item) => {
      if (item.id !== productId) return false;

      const cartVariantIds = Object.values(item.selectedVariants || {})
        .map((v) => v.variant_id)
        .sort((a, b) => a - b);

      // Match if same product and same variant selection
      return JSON.stringify(selectedVariantIds) === JSON.stringify(cartVariantIds);
    });
  }, [cartProducts, product.id, selectedVariants]);

  // Use cart quantity if product is in cart, otherwise use local quantity
  const displayQuantity = cartItem ? cartItem.qty : quantity;
  const isInCart = !!cartItem;

  // Calculate available stock based on variant selection
  const availableStock = useMemo(() => {
    // For variant products with stock managed by variant
    if (product.is_stock_manage_by_variant && product.stocks?.length) {
      const selectedVariantIds = Object.values(selectedVariants)
        .map((v) => v.id)
        .sort((a, b) => a - b);

      if (selectedVariantIds.length === 0) {
        return product.quantity ?? 0;
      }

      // Find matching stock for this variant combination
      const stock = product.stocks.find((s) => {
        try {
          const combination = JSON.parse(s.combination);
          const sortedCombination = [...combination].sort((a: number, b: number) => a - b);
          return JSON.stringify(sortedCombination) === JSON.stringify(selectedVariantIds);
        } catch {
          return false;
        }
      });

      return stock?.quantity ?? 0;
    }

    // For non-variant products or products without variant stock management
    return product.quantity ?? 0;
  }, [product, selectedVariants]);

  // Handle quantity changes - update cart directly if in cart
  const handleIncrement = useCallback(() => {
    if (isInCart && cartItem) {
      if (cartItem.qty >= availableStock) {
        toast.error("Maximum stock reached!", {
          duration: 2000,
          position: "bottom-right",
        });
        return;
      }
      incrementQty(cartItem.cartId);
    } else {
      if (quantity >= availableStock) {
        toast.error("Maximum stock reached!", {
          duration: 2000,
          position: "bottom-right",
        });
        return;
      }
      onIncrementQuantity();
    }
  }, [isInCart, cartItem, availableStock, quantity, incrementQty, onIncrementQuantity]);

  const handleDecrement = useCallback(() => {
    if (isInCart && cartItem) {
      decrementQty(cartItem.cartId);
    } else {
      onDecrementQuantity();
    }
  }, [isInCart, cartItem, decrementQty, onDecrementQuantity]);

  const handleQuantityChange = useCallback((newQty: number) => {
    if (isInCart && cartItem) {
      const validQty = Math.max(1, Math.min(newQty, availableStock));
      if (newQty > availableStock) {
        toast.error(`Only ${availableStock} items available!`, {
          duration: 2000,
          position: "bottom-right",
        });
      }
      updateQuantity(cartItem.cartId, validQty);
    } else {
      const validQty = Math.max(1, Math.min(newQty, availableStock));
      if (newQty > availableStock) {
        toast.error(`Only ${availableStock} items available!`, {
          duration: 2000,
          position: "bottom-right",
        });
      }
      onQuantityChange(validQty);
    }
  }, [isInCart, cartItem, availableStock, updateQuantity, onQuantityChange]);

  // Settings with defaults
  const showBrand = s.showBrand !== false;
  const showSku = s.showSku !== false;
  const showRating = s.showRating !== false;
  const showStock = s.showStock !== false;
  const showVariants = s.showVariants !== false;
  const showDescription = s.showDescription !== false;
  const showSpecifications = s.showSpecifications !== false;
  const showShipping = s.showShipping !== false;
  const showAddToCart = s.showAddToCart !== false;
  const showBuyNow = s.showBuyNow !== false;
  const showWhatsApp = s.showWhatsAppBuy !== false;
  const showWishlist = s.showWishlist !== false;
  const thumbnailPosition = s.thumbnailPosition || "bottom";

  // Colors
  const brandColor = s.brandColor || "#2563EB";
  const variantActiveColor = s.variantActiveColor || "#2563EB";
  const addToCartBgColor = s.addToCartBgColor || "#2563EB";
  const addToCartTextColor = s.addToCartTextColor || "#FFFFFF";
  const buyNowGradientStart = s.buyNowGradientStart || "#F97316";
  const buyNowGradientEnd = s.buyNowGradientEnd || "#EF4444";
  const buyNowTextColor = s.buyNowTextColor || "#FFFFFF";
  const whatsappBgColor = s.whatsappBgColor || "#25D366";
  const whatsappTextColor = s.whatsappTextColor || "#FFFFFF";
  const priceColor = s.priceColor || "#111827";
  const oldPriceColor = s.oldPriceColor || "#9CA3AF";
  const discountBadgeColor = s.discountBadgeColor || "#DC2626";

  // Product data
  const images = (
    product.images?.length ? product.images : [product.image_url]
  ).filter((img): img is string => !!img);

  const discount =
    product.old_price && product.old_price > product.price
      ? Math.round(
          ((product.old_price - product.price) / product.old_price) * 100
        )
      : null;

  // Get variant image if available
  const getDisplayImage = (): string => {
    if (
      product.image_variant_type_id &&
      selectedVariants[product.image_variant_type_id]?.image_url
    ) {
      return selectedVariants[product.image_variant_type_id].image_url!;
    }
    return images[selectedImageIndex] || "";
  };

  // Thumbnail size classes
  const thumbnailSizes = {
    sm: "w-14 h-14 sm:w-16 sm:h-16",
    md: "w-16 h-16 sm:w-20 sm:h-20",
    lg: "w-20 h-20 sm:w-24 sm:h-24",
  };

  const thumbnailSize = thumbnailSizes[s.thumbnailSize || "md"];

  // Render thumbnails
  const renderThumbnails = () => (
    <div
      className={`flex gap-2 sm:gap-3 ${
        thumbnailPosition === "left" || thumbnailPosition === "right"
          ? "flex-col"
          : "flex-row overflow-x-auto pb-2"
      }`}
    >
      {images.map((img, index) => (
        <button
          key={index}
          onClick={() => setSelectedImageIndex(index)}
          className={`${thumbnailSize} relative rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
            selectedImageIndex === index
              ? "border-blue-500 ring-2 ring-blue-200"
              : "border-transparent hover:border-gray-300"
          }`}
          style={{
            borderColor:
              selectedImageIndex === index ? variantActiveColor : undefined,
          }}
        >
          <Image
            src={img}
            alt={`${product.name} - Image ${index + 1}`}
            fill
            className="object-cover"
          />
        </button>
      ))}
    </div>
  );

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4 2xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Image Gallery */}
          <div className="lg:sticky lg:top-4">
            <div
              className={`flex ${
                thumbnailPosition === "left"
                  ? "flex-row gap-4"
                  : thumbnailPosition === "right"
                  ? "flex-row-reverse gap-4"
                  : "flex-col"
              }`}
            >
              {/* Left/Right Thumbnails */}
              {(thumbnailPosition === "left" ||
                thumbnailPosition === "right") &&
                images.length > 1 &&
                renderThumbnails()}

              <div className="flex-1">
                {/* Top Thumbnails */}
                {thumbnailPosition === "top" &&
                  images.length > 1 && (
                    <div className="mb-4">{renderThumbnails()}</div>
                  )}

                {/* Main Image */}
                <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={getDisplayImage()}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {discount && (
                    <span
                      className="absolute top-4 left-4 px-3 py-1.5 text-white text-sm font-bold rounded-full"
                      style={{ backgroundColor: discountBadgeColor }}
                    >
                      {discount}% OFF
                    </span>
                  )}
                  {product.quantity === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xl font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Thumbnails */}
                {thumbnailPosition === "bottom" &&
                  images.length > 1 && (
                    <div className="mt-4">{renderThumbnails()}</div>
                  )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Brand & SKU */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              {showBrand && product.brand && (
                <span
                  className="text-xs sm:text-sm font-medium uppercase tracking-wide"
                  style={{ color: brandColor }}
                >
                  {product.brand}
                </span>
              )}
              {showSku && product.product_code && (
                <span className="text-xs text-gray-500">
                  SKU: {product.product_code}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-gray-900">
              {product.name}
            </h1>

            {/* Rating */}
            {showRating && product.review_summary && (
              <div className="flex items-center flex-wrap gap-2 sm:gap-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < Math.floor(product.review_summary!.average_rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600">
                  {product.review_summary.average_rating.toFixed(1)} (
                  {product.review_summary.total_reviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline flex-wrap gap-2 sm:gap-3 py-3 sm:py-4 border-y border-gray-100">
              <span
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{ color: priceColor }}
              >
                ৳{computedPrice.toLocaleString()}
              </span>
              {product.old_price && product.old_price > product.price && (
                <span
                  className="text-lg sm:text-xl md:text-2xl line-through"
                  style={{ color: oldPriceColor }}
                >
                  ৳{product.old_price.toLocaleString()}
                </span>
              )}
              {discount && (
                <span
                  className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-bold rounded-full text-white"
                  style={{ backgroundColor: discountBadgeColor }}
                >
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Short Description */}
            {showDescription && product.short_description && (
              <p className="text-sm sm:text-base leading-relaxed text-gray-600">
                {product.short_description}
              </p>
            )}

            {/* Variants */}
            {showVariants &&
              product.variant_types &&
              product.variant_types.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  {product.variant_types.map((variantType) => (
                    <div key={variantType.id}>
                      <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-900">
                        {variantType.title}
                        {variantType.is_mandatory && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {variantType.variants.map((variant) => {
                          const isSelected =
                            selectedVariants[variantType.id]?.id === variant.id;
                          const hasImage = !!variant.image_url;

                          return (
                            <button
                              key={variant.id}
                              onClick={() =>
                                onSelectVariant(variantType.id, variant)
                              }
                              className={`px-3 py-1.5 sm:px-4 sm:py-2 border-2 rounded-lg text-sm transition-all ${
                                hasImage ? "p-1" : ""
                              }`}
                              style={{
                                borderColor: isSelected
                                  ? variantActiveColor
                                  : "#E5E7EB",
                                backgroundColor: isSelected
                                  ? `${variantActiveColor}10`
                                  : "transparent",
                              }}
                            >
                              {hasImage ? (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 relative rounded overflow-hidden">
                                  <Image
                                    src={variant.image_url!}
                                    alt={variant.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <span>
                                  {variant.name}
                                  {variant.price > 0 && (
                                    <span className="text-xs text-gray-500 ml-1">
                                      (+৳{variant.price})
                                    </span>
                                  )}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {/* Stock Status */}
            {showStock && (
              <div className="flex items-center flex-wrap gap-2">
                {product.quantity > 0 ? (
                  <>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm sm:text-base font-medium text-green-600">
                      In Stock
                    </span>
                    {product.quantity < 11 && (
                      <span className="text-orange-600 text-xs sm:text-sm bg-orange-50 px-2 py-0.5 rounded-full">
                        Only {product.quantity} left!
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
                    <span className="text-sm sm:text-base font-medium text-red-600">
                      Out of Stock
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">
                Quantity:
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecrement}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  min="1"
                  value={displayQuantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  className="w-16 h-10 text-center border-2 border-gray-300 rounded-lg font-semibold"
                />
                <button
                  onClick={handleIncrement}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 sm:space-y-3 pt-4">
              <div className="flex gap-2 sm:gap-3">
                {showAddToCart && (
                  <button
                    onClick={() => {
                      if (isInCart && cartItem) {
                        // Already in cart - quantity is managed by the quantity controls
                        return;
                      }
                      setIsAdding(true);
                      addToCart(product as unknown as import("@/types").InventoryProduct, displayQuantity, selectedVariants as unknown as import("@/types").VariantsState);
                      setTimeout(() => setIsAdding(false), 500);
                    }}
                    disabled={product.quantity === 0 || isAdding}
                    className="flex-1 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
                    style={{
                      backgroundColor: isInCart ? "#22c55e" : addToCartBgColor,
                      color: addToCartTextColor,
                    }}
                  >
                    {isAdding ? "Adding..." : isInCart ? "✓ In Cart" : "Add to Cart"}
                  </button>
                )}
                {showWhatsApp && (
                  <button
                    disabled={product.quantity === 0}
                    className="flex-1 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: whatsappBgColor,
                      color: whatsappTextColor,
                    }}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>WhatsApp</span>
                  </button>
                )}
                {showWishlist && (
                  <button
                    className="p-3 sm:p-4 border-2 border-gray-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all group"
                    title="Add to Wishlist"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-pink-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {showBuyNow && (
                <button
                  disabled={product.quantity === 0}
                  className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  style={{
                    background: `linear-gradient(to right, ${buyNowGradientStart}, ${buyNowGradientEnd})`,
                    color: buyNowTextColor,
                  }}
                >
                  Buy Now
                </button>
              )}
            </div>

            {/* Description & Specifications (Accordion) */}
            <div className="space-y-2 pt-6 border-t">
              {showDescription && product.description && (
                <details className="group" open>
                  <summary className="flex items-center justify-between py-4 cursor-pointer font-semibold text-gray-900">
                    <span>Product Description</span>
                    <svg
                      className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div
                    className="pb-4 leading-relaxed prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </details>
              )}

              {showSpecifications &&
                product.custom_fields &&
                Object.keys(product.custom_fields).length > 0 && (
                  <details className="group">
                    <summary className="flex items-center justify-between py-4 cursor-pointer font-semibold border-t text-gray-900">
                      <span>Specifications</span>
                      <svg
                        className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="pb-4">
                      <dl className="space-y-2">
                        {Object.entries(product.custom_fields).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between py-2 border-b border-gray-100"
                            >
                              <dt className="text-gray-600">{key}</dt>
                              <dd className="font-medium text-gray-900">
                                {value}
                              </dd>
                            </div>
                          )
                        )}
                      </dl>
                    </div>
                  </details>
                )}

              {showShipping && (
                <details className="group">
                  <summary className="flex items-center justify-between py-4 cursor-pointer font-semibold border-t text-gray-900">
                    <span>Shipping & Returns</span>
                    <svg
                      className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="pb-4 space-y-3 text-sm text-gray-600">
                    <p>• {product.warranty || "30 days return policy"}</p>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
