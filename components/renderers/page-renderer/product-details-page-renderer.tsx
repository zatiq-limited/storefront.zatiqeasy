/**
 * ========================================
 * PRODUCT DETAILS PAGE RENDERER
 * ========================================
 *
 * Renders product detail page sections dynamically based on JSON configuration
 * Optimized for Next.js with React Query caching
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Section } from "@/lib/types";
import type {
  Product,
  Variant,
  // VariantType,
  Review,
} from "@/stores/productsStore";
// import { convertSettingsKeys } from "@/lib/settings-utils";

interface ProductDetailsPageRendererProps {
  sections: Section[];
  product: Product;
  selectedVariants: Record<number, Variant>;
  quantity: number;
  computedPrice: number;
  onSelectVariant: (variantTypeId: number, variant: Variant) => void;
  onQuantityChange: (quantity: number) => void;
  onIncrementQuantity: () => void;
  onDecrementQuantity: () => void;
  className?: string;
}

// Product Breadcrumb Component
function ProductBreadcrumb({
  settings = {},
  product,
}: {
  settings?: Record<string, unknown>;
  product: Product;
}) {
  const showHome = settings.show_home !== false;
  const showCategory = settings.show_category !== false;
  const linkColor = (settings.link_color as string) || "#6B7280";
  const activeColor = (settings.active_color as string) || "#2563EB";
  const iconColor = (settings.icon_color as string) || "#9CA3AF";

  const breadcrumbs = [
    ...(showHome ? [{ label: "Home", href: "/" }] : []),
    { label: "Products", href: "/products" },
    ...(showCategory && product.categories?.[0]
      ? [
          {
            label: product.categories[0].name,
            href: `/products?category=${product.categories[0].id}`,
          },
        ]
      : []),
    { label: product.name, href: "#" },
  ];

  return (
    <nav className="bg-gray-50 border-b" aria-label="Breadcrumb">
      <div className="container mx-auto px-4 2xl:px-0 py-3">
        <ol className="flex items-center flex-wrap gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 mx-2"
                  style={{ color: iconColor }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span
                  className="font-medium line-clamp-1"
                  style={{ color: activeColor }}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: linkColor }}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

// Product Detail Component
function ProductDetail({
  settings = {},
  product,
  selectedVariants,
  quantity,
  computedPrice,
  onSelectVariant,
  onQuantityChange,
  onIncrementQuantity,
  onDecrementQuantity,
}: {
  settings?: Record<string, unknown>;
  product: Product;
  selectedVariants: Record<number, Variant>;
  quantity: number;
  computedPrice: number;
  onSelectVariant: (variantTypeId: number, variant: Variant) => void;
  onQuantityChange: (quantity: number) => void;
  onIncrementQuantity: () => void;
  onDecrementQuantity: () => void;
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const showBrand = settings.show_brand !== false;
  const showSku = settings.show_sku !== false;
  const showRating = settings.show_rating !== false;
  const showStock = settings.show_stock !== false;
  const showVariants = settings.show_variants !== false;
  const showDescription = settings.show_description !== false;
  const showSpecifications = settings.show_specifications !== false;
  const showShipping = settings.show_shipping !== false;
  const showAddToCart = settings.show_add_to_cart !== false;
  const showBuyNow = settings.show_buy_now !== false;
  const showWhatsApp = settings.show_whats_app_buy !== false;
  const showWishlist = settings.show_wishlist !== false;

  const accentColor = (settings.accent_color as string) || "#3B82F6";
  const priceColor = (settings.price_color as string) || "#7C3AED";
  const oldPriceColor = (settings.old_price_color as string) || "#9CA3AF";
  const buyNowGradientStart =
    (settings.buy_now_gradient_start as string) || "#3B82F6";
  const buyNowGradientEnd =
    (settings.buy_now_gradient_end as string) || "#8B5CF6";
  const buyNowTextColor = (settings.buy_now_text_color as string) || "#FFFFFF";
  const whatsappBgColor = (settings.whatsapp_bg_color as string) || "#25D366";
  const whatsappTextColor =
    (settings.whatsapp_text_color as string) || "#FFFFFF";

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

  return (
    <div className="container mx-auto px-4 2xl:px-0 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div
            className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-zoom-in"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <Image
              src={getDisplayImage()}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-300 ${
                isZoomed ? "scale-150" : ""
              }`}
              priority
            />
            {discount && (
              <span
                className="absolute top-4 left-4 px-3 py-1.5 text-white text-sm font-bold rounded-lg"
                style={{ backgroundColor: accentColor }}
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

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-blue-500"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand */}
          {showBrand && product.brand && (
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              {product.brand}
            </p>
          )}

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          {/* Rating */}
          {showRating && product.review_summary && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
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
              <span className="text-sm text-gray-600">
                {product.review_summary.average_rating.toFixed(1)} (
                {product.review_summary.total_reviews} reviews)
              </span>
            </div>
          )}

          {/* SKU */}
          {showSku && product.product_code && (
            <p className="text-sm text-gray-500">SKU: {product.product_code}</p>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold" style={{ color: priceColor }}>
              ৳{computedPrice.toLocaleString()}
            </span>
            {product.old_price && (
              <span
                className="text-xl line-through"
                style={{ color: oldPriceColor }}
              >
                ৳{product.old_price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {showStock && (
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.quantity > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span
                className={`text-sm ${
                  product.quantity > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.quantity > 0
                  ? `In Stock (${product.quantity} available)`
                  : "Out of Stock"}
              </span>
            </div>
          )}

          {/* Short Description */}
          {showDescription && product.short_description && (
            <p className="text-gray-600">{product.short_description}</p>
          )}

          {/* Variants */}
          {showVariants &&
            product.variant_types &&
            product.variant_types.length > 0 && (
              <div className="space-y-4">
                {product.variant_types.map((variantType) => (
                  <div key={variantType.id}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {variantType.title}
                      {variantType.is_mandatory && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <div className="flex flex-wrap gap-2">
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
                            className={`relative px-4 py-2 rounded-lg border-2 transition-all ${
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-400"
                            } ${hasImage ? "p-1" : ""}`}
                          >
                            {hasImage ? (
                              <div className="w-12 h-12 relative rounded overflow-hidden">
                                <Image
                                  src={variant.image_url!}
                                  alt={variant.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <span className="text-sm font-medium">
                                {variant.name}
                                {variant.price > 0 && (
                                  <span className="text-xs text-gray-500 ml-1">
                                    (+৳{variant.price})
                                  </span>
                                )}
                              </span>
                            )}
                            {isSelected && (
                              <div
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: accentColor }}
                              >
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={onDecrementQuantity}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
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
                value={quantity}
                onChange={(e) =>
                  onQuantityChange(parseInt(e.target.value) || 1)
                }
                className="w-20 h-10 text-center border border-gray-300 rounded-lg"
              />
              <button
                onClick={onIncrementQuantity}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
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
          <div className="space-y-3">
            <div className="flex gap-3">
              {showAddToCart && (
                <button
                  disabled={product.quantity === 0}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold border-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  Add to Cart
                </button>
              )}
              {showWishlist && (
                <button className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-6 h-6 text-gray-600"
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
                className="w-full py-3 px-6 rounded-lg font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(to right, ${buyNowGradientStart}, ${buyNowGradientEnd})`,
                  color: buyNowTextColor,
                }}
              >
                Buy Now
              </button>
            )}

            {showWhatsApp && (
              <button
                className="w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{
                  backgroundColor: whatsappBgColor,
                  color: whatsappTextColor,
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Order via WhatsApp
              </button>
            )}
          </div>

          {/* Shipping Info */}
          {showShipping && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <h4 className="font-semibold text-gray-900">
                Delivery Information
              </h4>
              {product.isApplyDefaultDeliveryCharge ? (
                <p className="text-sm text-gray-600">
                  Standard delivery charges apply
                </p>
              ) : product.specific_delivery_charges ? (
                <div className="text-sm text-gray-600 space-y-1">
                  {Object.entries(product.specific_delivery_charges).map(
                    ([location, charge]) => (
                      <p key={location}>
                        {location}: ৳{charge}
                      </p>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">Free delivery</p>
              )}
              {product.warranty && (
                <p className="text-sm text-gray-600">{product.warranty}</p>
              )}
            </div>
          )}

          {/* Specifications */}
          {showSpecifications &&
            product.custom_fields &&
            Object.keys(product.custom_fields).length > 0 && (
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Specifications
                </h4>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(product.custom_fields).map(([key, value]) => (
                    <div key={key} className="flex">
                      <dt className="text-sm text-gray-500 w-32 shrink-0">
                        {key}
                      </dt>
                      <dd className="text-sm text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
        </div>
      </div>

      {/* Full Description */}
      {showDescription && product.description && (
        <div className="mt-12 border-t pt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Product Description
          </h3>
          <div className="prose max-w-none text-gray-600">
            {product.description}
          </div>
        </div>
      )}
    </div>
  );
}

// Customer Reviews Component
function CustomerReviews({
  settings = {},
  reviews = [],
  reviewSummary,
}: {
  settings?: Record<string, unknown>;
  reviews?: Review[];
  reviewSummary?: Product["review_summary"];
}) {
  const title = (settings.title as string) || "Customer Reviews";
  const showRatingSummary = settings.show_rating_summary !== false;
  const showReviewImages = settings.show_review_images !== false;
  const limit = (settings.limit as number) || 6;
  const titleColor = (settings.title_color as string) || "#111827";
  const starColor = (settings.star_color as string) || "#FBBF24";

  const displayedReviews = reviews.slice(0, limit);

  if (!reviews.length) return null;

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 2xl:px-0">
        <h2 className="text-2xl font-bold mb-8" style={{ color: titleColor }}>
          {title}
        </h2>

        {showRatingSummary && reviewSummary && (
          <div className="bg-white rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-900">
                {reviewSummary.average_rating.toFixed(1)}
              </p>
              <div className="flex items-center justify-center mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6"
                    style={{
                      color:
                        i < Math.floor(reviewSummary.average_rating)
                          ? starColor
                          : "#D1D5DB",
                    }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Based on {reviewSummary.total_reviews} reviews
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  {review.reviewer_type === "verified_buyer" && (
                    <span className="text-xs text-green-600 font-medium">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4"
                      style={{
                        color: i < review.rating ? starColor : "#D1D5DB",
                      }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm">{review.description}</p>
              {showReviewImages &&
                review.images &&
                review.images.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {review.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-16 h-16 relative rounded-lg overflow-hidden"
                      >
                        <Image
                          src={img}
                          alt="Review image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Related Products Component
function RelatedProducts({
  settings = {},
  products = [],
}: {
  settings?: Record<string, unknown>;
  products?: Product[];
}) {
  const title = (settings.title as string) || "You May Also Like";
  const subtitle =
    (settings.subtitle as string) || "Discover more products you'll love";
  const limit = (settings.limit as number) || 8;
  const titleColor = (settings.title_color as string) || "#111827";
  const subtitleColor = (settings.subtitle_color as string) || "#6B7280";
  // const buttonBgColor = (settings.button_bg_color as string) || "#3B82F6";
  // const buttonTextColor = (settings.button_text_color as string) || "#FFFFFF";

  const displayedProducts = products.slice(0, limit);

  if (!products.length) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 2xl:px-0">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold" style={{ color: titleColor }}>
            {title}
          </h2>
          <p className="text-sm mt-2" style={{ color: subtitleColor }}>
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => {
            const handle =
              product.product_code?.toLowerCase() || product.id.toString();
            const discount =
              product.old_price && product.old_price > product.price
                ? Math.round(
                    ((product.old_price - product.price) / product.old_price) *
                      100
                  )
                : null;

            return (
              <Link
                key={product.id}
                href={`/products/${handle}`}
                className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100"
              >
                <div className="aspect-square overflow-hidden bg-gray-100 relative">
                  <Image
                    src={product.image_url || ""}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {discount && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">
                      ৳{product.price.toLocaleString()}
                    </span>
                    {product.old_price && (
                      <span className="text-sm text-gray-500 line-through">
                        ৳{product.old_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function ProductDetailsPageRenderer({
  sections,
  product,
  selectedVariants,
  quantity,
  computedPrice,
  onSelectVariant,
  onQuantityChange,
  onIncrementQuantity,
  onDecrementQuantity,
  className = "",
}: ProductDetailsPageRendererProps) {
  const renderSection = (section: Section) => {
    if (section.enabled === false) return null;

    switch (true) {
      case section.type.includes("product-breadcrumb"):
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ProductBreadcrumb settings={section.settings} product={product} />
          </div>
        );

      case section.type.includes("product-detail"):
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ProductDetail
              settings={section.settings}
              product={product}
              selectedVariants={selectedVariants}
              quantity={quantity}
              computedPrice={computedPrice}
              onSelectVariant={onSelectVariant}
              onQuantityChange={onQuantityChange}
              onIncrementQuantity={onIncrementQuantity}
              onDecrementQuantity={onDecrementQuantity}
            />
          </div>
        );

      case section.type.includes("customer-reviews"):
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <CustomerReviews
              settings={section.settings}
              reviews={product.reviews}
              reviewSummary={product.review_summary}
            />
          </div>
        );

      case section.type.includes("related-products"):
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <RelatedProducts
              settings={section.settings}
              products={product.related_products}
            />
          </div>
        );

      default:
        if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "development") {
          return (
            <div
              key={section.id}
              className="bg-yellow-50 border border-yellow-200 rounded p-4 my-4"
            >
              <p className="text-yellow-800 font-semibold">
                Component not found: {section.type}
              </p>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className={`zatiq-product-details-page ${className}`}>
      {sections.map(renderSection)}
    </div>
  );
}
