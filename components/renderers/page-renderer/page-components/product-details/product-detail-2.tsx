/**
 * Product Detail 2
 * Modern layout with vertical thumbnails and tabs
 * Thumbnail position: left by default
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Product, Variant } from "@/stores/productsStore";
import { useAddToCart } from "@/hooks/useAddToCart";

interface ProductDetail2Props {
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

interface ProductDetail2Settings {
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
  accentColor?: string;
  buyNowGradientStart?: string;
  buyNowGradientEnd?: string;
  buyNowTextColor?: string;
  whatsappBgColor?: string;
  whatsappTextColor?: string;
  priceColor?: string;
  oldPriceColor?: string;
  discountBadgeColor?: string;
}

export default function ProductDetail2({
  settings = {},
  product,
  selectedVariants,
  quantity,
  computedPrice,
  onSelectVariant,
  onQuantityChange,
  onIncrementQuantity,
  onDecrementQuantity,
}: ProductDetail2Props) {
  const s = convertSettingsKeys<ProductDetail2Settings>(settings);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "shipping"
  >("description");
  const { addToCart } = useAddToCart();
  const [isAdding, setIsAdding] = useState(false);

  // Settings with defaults
  const showBrand = s.showBrand !== false;
  const showSku = s.showSku !== false;
  const showRating = s.showRating !== false;
  const showVariants = s.showVariants !== false;
  const showDescription = s.showDescription !== false;
  const showSpecifications = s.showSpecifications !== false;
  const showShipping = s.showShipping !== false;
  const showAddToCart = s.showAddToCart !== false;
  const showBuyNow = s.showBuyNow !== false;
  const showWhatsApp = s.showWhatsAppBuy !== false;
  const showWishlist = s.showWishlist !== false;
  const thumbnailPosition = s.thumbnailPosition || "left";

  // Colors
  const accentColor = s.accentColor || "#7C3AED";
  const buyNowGradientStart = s.buyNowGradientStart || "#F97316";
  const buyNowGradientEnd = s.buyNowGradientEnd || "#EF4444";
  const buyNowTextColor = s.buyNowTextColor || "#FFFFFF";
  const whatsappBgColor = s.whatsappBgColor || "#25D366";
  const whatsappTextColor = s.whatsappTextColor || "#FFFFFF";
  const priceColor = s.priceColor || "#7C3AED";
  const oldPriceColor = s.oldPriceColor || "#9CA3AF";
  const discountBadgeColor = s.discountBadgeColor || "#7C3AED";

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
    sm: "w-16 h-16 sm:w-16 sm:h-16",
    md: "w-16 h-16 sm:w-20 sm:h-20",
    lg: "w-20 h-20 sm:w-24 sm:h-24",
  };

  const thumbnailSize = thumbnailSizes[s.thumbnailSize || "md"];

  // Render thumbnails
  const renderThumbnails = () => (
    <div
      className={`flex gap-3 ${
        thumbnailPosition === "left" || thumbnailPosition === "right"
          ? "flex-col"
          : "flex-row overflow-x-auto pb-2"
      }`}
    >
      {images.map((img, index) => (
        <button
          key={index}
          onClick={() => setSelectedImageIndex(index)}
          className={`${thumbnailSize} relative rounded-lg overflow-hidden border-2 transition-all shrink-0 ring-2 ring-transparent hover:ring-purple-500`}
          style={{
            borderColor:
              selectedImageIndex === index ? accentColor : "transparent",
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
            <div className="flex gap-4">
              {/* Left Thumbnails */}
              {(thumbnailPosition === "left" ||
                thumbnailPosition === "right") &&
                images.length > 1 && (
                  <div
                    className={
                      thumbnailPosition === "right" ? "order-2" : "order-1"
                    }
                  >
                    {renderThumbnails()}
                  </div>
                )}

              <div
                className={`flex-1 ${
                  thumbnailPosition === "right" ? "order-1" : "order-2"
                }`}
              >
                {/* Top Thumbnails */}
                {thumbnailPosition === "top" &&
                  images.length > 1 && (
                    <div className="mb-4">{renderThumbnails()}</div>
                  )}

                {/* Main Image */}
                <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg group">
                  <Image
                    src={getDisplayImage()}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                  {discount && (
                    <div
                      className="absolute top-4 left-4 px-3 py-1.5 text-white text-sm font-bold rounded-full"
                      style={{ backgroundColor: accentColor }}
                    >
                      {discount}% OFF
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
          <div className="space-y-6">
            {/* Brand & SKU */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              {showBrand && product.brand && (
                <span
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: accentColor, letterSpacing: "0.05em" }}
                >
                  {product.brand}
                </span>
              )}
              {showSku && product.product_code && (
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  SKU: {product.product_code}
                </span>
              )}
            </div>

            {/* Title with gradient effect */}
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {product.name}
            </h1>

            {/* Rating */}
            {showRating && product.review_summary && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.review_summary!.average_rating)
                          ? "text-yellow-400"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span
                  className="text-lg font-semibold"
                  style={{ color: accentColor }}
                >
                  {product.review_summary.average_rating.toFixed(1)}
                </span>
                <span className="text-gray-500">
                  ({product.review_summary.total_reviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 py-4">
              <span
                className="text-4xl font-bold"
                style={{ color: priceColor }}
              >
                ৳{computedPrice.toLocaleString()}
              </span>
              {product.old_price && product.old_price > product.price && (
                <span
                  className="text-2xl line-through"
                  style={{ color: oldPriceColor }}
                >
                  ৳{product.old_price.toLocaleString()}
                </span>
              )}
              {discount && (
                <span
                  className="px-3 py-1 text-sm font-bold rounded-full text-white"
                  style={{ backgroundColor: discountBadgeColor }}
                >
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-gray-600 leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Variants */}
            {showVariants &&
              product.variant_types &&
              product.variant_types.length > 0 && (
                <div className="space-y-4">
                  {product.variant_types.map((variantType) => (
                    <div key={variantType.id}>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">
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
                              className={`px-4 py-2 border-2 rounded-lg text-sm transition-all ${
                                hasImage ? "p-1" : ""
                              }`}
                              style={{
                                borderColor: isSelected
                                  ? accentColor
                                  : "#E5E7EB",
                                backgroundColor: isSelected
                                  ? `${accentColor}15`
                                  : "transparent",
                                color: isSelected ? accentColor : "#374151",
                              }}
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

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">
                Quantity:
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={onDecrementQuantity}
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
                  value={quantity}
                  onChange={(e) =>
                    onQuantityChange(parseInt(e.target.value) || 1)
                  }
                  className="w-16 h-10 text-center border-2 border-gray-300 rounded-lg font-semibold"
                />
                <button
                  onClick={onIncrementQuantity}
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
            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
              {/* Primary Actions Row: Add to Cart + WhatsApp + Wishlist */}
              <div className="flex gap-2 sm:gap-3">
                {showAddToCart && (
                  <button
                    onClick={() => {
                      setIsAdding(true);
                      addToCart(product as unknown as import("@/types").InventoryProduct, quantity, selectedVariants as unknown as import("@/types").VariantsState);
                      setTimeout(() => setIsAdding(false), 500);
                    }}
                    disabled={product.quantity === 0 || isAdding}
                    className="flex-1 py-3 sm:py-4 text-sm sm:text-base text-white font-semibold rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                    style={{ background: `linear-gradient(to right, ${accentColor}, #4F46E5)` }}
                  >
                    {isAdding ? "Adding..." : "Add to Cart"}
                  </button>
                )}
                {showWhatsApp && (
                  <button
                    disabled={product.quantity === 0}
                    className="flex-1 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
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
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                )}
                {showWishlist && (
                  <button className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-all group">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-pink-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Buy Now Button - Full Width */}
              {showBuyNow && (
                <button
                  disabled={product.quantity === 0}
                  className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                  style={{
                    background: `linear-gradient(to right, ${buyNowGradientStart}, ${buyNowGradientEnd})`,
                    color: buyNowTextColor,
                  }}
                >
                  Buy Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section - Full Width Below Grid */}
        {(showDescription || showSpecifications || showShipping) && (
          <div className="border-t mt-8 md:mt-12">
            {/* Tab Headers */}
            <div className="flex border-b overflow-x-auto">
              {showDescription && product.description && (
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-4 py-3 text-xs sm:px-6 sm:py-4 sm:text-sm font-semibold transition-colors relative whitespace-nowrap ${
                    activeTab === "description"
                      ? ""
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={activeTab === "description" ? { color: accentColor } : {}}
                >
                  Description
                  {activeTab === "description" && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </button>
              )}
              {showSpecifications &&
                product.custom_fields &&
                Object.keys(product.custom_fields).length > 0 && (
                  <button
                    onClick={() => setActiveTab("specifications")}
                    className={`px-4 py-3 text-xs sm:px-6 sm:py-4 sm:text-sm font-semibold transition-colors relative whitespace-nowrap ${
                      activeTab === "specifications"
                        ? ""
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    style={
                      activeTab === "specifications" ? { color: accentColor } : {}
                    }
                  >
                    Specifications
                    {activeTab === "specifications" && (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{ backgroundColor: accentColor }}
                      />
                    )}
                  </button>
                )}
              {showShipping && (
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`px-4 py-3 text-xs sm:px-6 sm:py-4 sm:text-sm font-semibold transition-colors relative whitespace-nowrap ${
                    activeTab === "shipping"
                      ? ""
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={activeTab === "shipping" ? { color: accentColor } : {}}
                >
                  Shipping & Returns
                  {activeTab === "shipping" && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="py-4 sm:py-6">
              {activeTab === "description" && product.description && (
                <div
                  className="prose prose-sm sm:prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

              {activeTab === "specifications" &&
                product.custom_fields &&
                Object.keys(product.custom_fields).length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    {Object.entries(product.custom_fields).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-2 px-3 sm:py-3 sm:px-4 bg-gray-50 rounded-lg"
                      >
                        <span className="text-xs sm:text-sm text-gray-600">
                          {key}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              {activeTab === "shipping" && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm sm:text-base text-blue-800">
                      {product.warranty || "30 days return policy"}
                    </p>
                  </div>
                  {!product.isApplyDefaultDeliveryCharge &&
                    product.specific_delivery_charges && (
                      <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50">
                          <p className="text-xs sm:text-sm mb-0.5 sm:mb-1 text-gray-500">
                            Dhaka
                          </p>
                          <p className="text-base sm:text-lg font-bold text-gray-900">
                            ৳{product.specific_delivery_charges.Dhaka}
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50">
                          <p className="text-xs sm:text-sm mb-0.5 sm:mb-1 text-gray-500">
                            Outside Dhaka
                          </p>
                          <p className="text-base sm:text-lg font-bold text-gray-900">
                            ৳{product.specific_delivery_charges.Others}
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
