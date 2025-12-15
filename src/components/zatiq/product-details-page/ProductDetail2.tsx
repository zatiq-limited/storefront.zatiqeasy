import React, { useState } from "react";

interface VariantType {
  id: number;
  title: string;
  is_mandatory: boolean;
  variants: Array<{
    id: number;
    name: string;
    price: number;
  }>;
}

interface Product {
  id: number;
  name: string;
  product_code?: string;
  price: number;
  old_price?: number | null;
  image_url: string;
  images?: string[];
  brand?: string;
  quantity: number;
  description?: string;
  short_description?: string;
  warranty?: string;
  custom_fields?: Record<string, string>;
  variant_types?: VariantType[];
  review_summary?: {
    average_rating: number;
    total_reviews: number;
  };
  isApplyDefaultDeliveryCharge?: boolean;
  specific_delivery_charges?: {
    Dhaka: number;
    Others: number;
  };
}

interface ProductDetail2Props {
  settings?: {
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
  };
  product: Product;
  currency?: string;
  whatsappNumber?: string;
}

const ProductDetail2: React.FC<ProductDetail2Props> = ({
  settings = {},
  product,
  currency = "৳",
  whatsappNumber = "",
}) => {
  const {
    showBrand = true,
    showSku = true,
    showRating = true,
    showStock = true,
    showVariants = true,
    showDescription = true,
    showSpecifications = true,
    showShipping = true,
    showAddToCart = true,
    showBuyNow = true,
    showWhatsAppBuy = true,
    showWishlist = true,
    galleryPosition = "left",
    thumbnailPosition = "left",
    thumbnailSize = "md",
    accentColor = "#2563EB",
    buyNowGradientStart = "#D946EF",
    buyNowGradientEnd = "#2563EB",
    buyNowTextColor = "#FFFFFF",
    whatsappBgColor = "#25D366",
    whatsappTextColor = "#FFFFFF",
    priceColor = "#7C3AED",
    oldPriceColor = "#9CA3AF",
    discountBadgeColor = "#7C3AED",
  } = settings;

  const [mainImage, setMainImage] = useState(product.image_url);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<number, number>
  >({});
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "shipping"
  >("description");

  const discountPercent = product.old_price
    ? Math.round(
        ((product.old_price - product.price) / product.old_price) * 100
      )
    : 0;

  const handleVariantSelect = (variantTypeId: number, variantId: number) => {
    setSelectedVariants((prev) => ({ ...prev, [variantTypeId]: variantId }));
  };

  const thumbnailSizeClasses = {
    sm: {
      vertical: "w-12 sm:w-14",
      grid: "grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1.5 sm:gap-2",
      mobile: "w-10 h-10 sm:w-12 sm:h-12",
    },
    md: {
      vertical: "w-16 sm:w-20",
      grid: "grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3",
      mobile: "w-14 h-14 sm:w-16 sm:h-16",
    },
    lg: {
      vertical: "w-18 sm:w-24",
      grid: "grid-cols-3 gap-2 sm:gap-4",
      mobile: "w-16 h-16 sm:w-20 sm:h-20",
    },
  };

  // Render thumbnails based on position
  const renderThumbnails = (position: "left" | "right" | "bottom" | "top") => {
    if (!product.images || product.images.length <= 1) return null;

    // Horizontal thumbnails (top or bottom)
    if (position === "bottom" || position === "top") {
      return (
        <div
          className={`grid ${thumbnailSizeClasses[thumbnailSize].grid} ${
            position === "top" ? "mb-4" : "mt-4"
          }`}
        >
          {product.images.map((img, index) => (
            <button
              key={index}
              onClick={() => setMainImage(img)}
              className={`aspect-square bg-white rounded-xl overflow-hidden border-2 transition-all ${
                mainImage === img
                  ? "border-purple-500 shadow-lg"
                  : "border-transparent hover:border-purple-300"
              }`}
            >
              <img
                src={img}
                alt={`${product.name} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      );
    }

    // Left or Right vertical thumbnails
    return (
      <div
        className={`hidden md:flex flex-col gap-3 ${
          thumbnailSizeClasses[thumbnailSize].vertical
        } ${position === "right" ? "order-2" : "order-1"}`}
      >
        {product.images.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(img)}
            className={`aspect-square bg-white rounded-xl overflow-hidden border-2 transition-all ${
              mainImage === img
                ? "border-purple-500 shadow-lg"
                : "border-transparent hover:border-purple-300"
            }`}
          >
            <img
              src={img}
              alt={`${product.name} - ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    );
  };

  // Render gallery section
  const renderGallery = () => (
    <div
      className={`p-0 sm:p-6 lg:p-8 ${
        thumbnailPosition === "bottom" || thumbnailPosition === "top"
          ? ""
          : "flex gap-2 sm:gap-4"
      }`}
    >
      {/* Side Thumbnails (Left) */}
      {thumbnailPosition === "left" && renderThumbnails("left")}

      {/* Main Image */}
      <div
        className={`${
          thumbnailPosition === "bottom" || thumbnailPosition === "top"
            ? ""
            : "flex-1"
        } ${
          thumbnailPosition === "left"
            ? "order-2"
            : thumbnailPosition === "right"
            ? "order-1"
            : ""
        }`}
      >
        {/* Top Thumbnails */}
        {thumbnailPosition === "top" && renderThumbnails("top")}

        <div className="aspect-square bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-inner relative">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {discountPercent > 0 && (
            <div
              className="absolute top-2 left-2 sm:top-4 sm:left-4 text-white px-2.5 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg"
              style={{ backgroundColor: discountBadgeColor }}
            >
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Bottom Thumbnails */}
        {thumbnailPosition === "bottom" && renderThumbnails("bottom")}

        {/* Mobile Thumbnails (always at bottom on mobile) */}
        {product.images &&
          product.images.length > 1 &&
          thumbnailPosition !== "bottom" &&
          thumbnailPosition !== "top" && (
            <div className="md:hidden flex gap-1.5 sm:gap-2 mt-3 sm:mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`${
                    thumbnailSizeClasses[thumbnailSize].mobile
                  } shrink-0 rounded-lg overflow-hidden border-2 ${
                    mainImage === img
                      ? "border-purple-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
      </div>

      {/* Side Thumbnails (Right) */}
      {thumbnailPosition === "right" && renderThumbnails("right")}
    </div>
  );

  // Render product info section
  const renderProductInfo = () => (
    <div className="py-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {/* Brand & SKU */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-3">
        {showBrand && product.brand && (
          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-purple-100 text-purple-700 text-[10px] sm:text-xs font-semibold rounded-full uppercase">
            {product.brand}
          </span>
        )}
        {showSku && product.product_code && (
          <span className="text-[10px] sm:text-xs text-gray-400">
            SKU: {product.product_code}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      {showRating && product.review_summary && (
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
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
          <span className="text-xs sm:text-sm text-gray-600">
            {product.review_summary.average_rating.toFixed(1)}
          </span>
          <span className="text-xs sm:text-sm text-gray-400">
            ({product.review_summary.total_reviews} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline flex-wrap gap-2 sm:gap-4 py-3 sm:py-4 border-y border-gray-100">
        <span
          className="text-2xl sm:text-3xl md:text-4xl font-bold"
          style={{ color: priceColor }}
        >
          {currency}
          {product.price?.toLocaleString()}
        </span>
        {product.old_price && (
          <span
            className="text-base sm:text-lg md:text-xl line-through"
            style={{ color: oldPriceColor }}
          >
            {currency}
            {product.old_price?.toLocaleString()}
          </span>
        )}
      </div>

      {/* Short Description */}
      {product.short_description && (
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
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
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                  {variantType.title}
                  {variantType.is_mandatory && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {variantType.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() =>
                        handleVariantSelect(variantType.id, variant.id)
                      }
                      className={`px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                        selectedVariants[variantType.id] === variant.id
                          ? "bg-purple-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                      }`}
                    >
                      {variant.name}
                      {variant.price > 0 && (
                        <span className="ml-1 opacity-75">
                          +{currency}
                          {variant.price}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Stock Status */}
      {showStock && (
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {product.quantity > 0 ? (
            <>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm sm:text-base text-green-700 font-medium">
                In Stock
              </span>
              {product.quantity <= 10 && (
                <span className="text-orange-600 text-xs sm:text-sm bg-orange-50 px-2 py-0.5 sm:py-1 rounded-full">
                  Only {product.quantity} left!
                </span>
              )}
            </>
          ) : (
            <>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
              <span className="text-sm sm:text-base text-red-700 font-medium">
                Out of Stock
              </span>
            </>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
        {/* Primary Actions Row */}
        <div className="flex gap-2 sm:gap-3">
          {showAddToCart && (
            <button
              disabled={product.quantity === 0}
              className="flex-1 py-3 sm:py-4 text-sm sm:text-base text-white font-semibold rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-xl hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
              style={{
                backgroundColor:
                  product.quantity === 0 ? "#9CA3AF" : accentColor,
              }}
            >
              Add to Cart
            </button>
          )}
          {showWhatsAppBuy && (
            <button
              disabled={product.quantity === 0}
              onClick={() => {
                const message = encodeURIComponent(
                  `Hi, I'm interested in buying:\n\n*${
                    product.name
                  }*\nPrice: ${currency}${product.price?.toLocaleString()}\n\nPlease confirm availability.`
                );
                window.open(
                  `https://wa.me/${whatsappNumber}?text=${message}`,
                  "_blank"
                );
              }}
              className="flex-1 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-xl hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              style={{
                backgroundColor:
                  product.quantity === 0 ? "#9CA3AF" : whatsappBgColor,
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
              WhatsApp
            </button>
          )}
          {showWishlist && (
            <button
              className="p-3 sm:p-4 border-2 rounded-xl sm:rounded-2xl hover:bg-opacity-10 transition-all group"
              style={{ borderColor: accentColor }}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 transition-colors"
                style={{ color: accentColor }}
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

        {/* Buy Now Button */}
        {showBuyNow && (
          <button
            disabled={product.quantity === 0}
            className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            style={{
              background:
                product.quantity === 0
                  ? "#9CA3AF"
                  : `linear-gradient(to right, ${buyNowGradientStart}, ${buyNowGradientEnd})`,
              color: buyNowTextColor,
            }}
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  );

  return (
    <section className="py-4 sm:py-6 md:py-4">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Dynamic Gallery Position */}
            {galleryPosition === "left" ? (
              <>
                {renderGallery()}
                {renderProductInfo()}
              </>
            ) : (
              <>
                {renderProductInfo()}
                {renderGallery()}
              </>
            )}
          </div>

          {/* Tabs Section */}
          <div className="border-t">
            {/* Tab Headers */}
            <div className="flex border-b overflow-x-auto scrollbar-hide">
              {showDescription && product.description && (
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors relative whitespace-nowrap ${
                    activeTab === "description"
                      ? "text-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Description
                  {activeTab === "description" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                  )}
                </button>
              )}
              {showSpecifications &&
                product.custom_fields &&
                Object.keys(product.custom_fields).length > 0 && (
                  <button
                    onClick={() => setActiveTab("specs")}
                    className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors relative whitespace-nowrap ${
                      activeTab === "specs"
                        ? "text-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Specifications
                    {activeTab === "specs" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                    )}
                  </button>
                )}
              {showShipping && (
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors relative whitespace-nowrap ${
                    activeTab === "shipping"
                      ? "text-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Shipping & Returns
                  {activeTab === "shipping" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                  )}
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              {activeTab === "description" && product.description && (
                <div className="prose prose-sm sm:prose max-w-none text-gray-600">
                  {product.description}
                </div>
              )}

              {activeTab === "specs" && product.custom_fields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                  {Object.entries(product.custom_fields).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between py-2 sm:py-3 px-3 sm:px-4 bg-gray-50 rounded-lg"
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
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                          <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
                            Dhaka
                          </p>
                          <p className="text-base sm:text-lg font-bold text-gray-900">
                            {currency}
                            {product.specific_delivery_charges.Dhaka}
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                          <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
                            Outside Dhaka
                          </p>
                          <p className="text-base sm:text-lg font-bold text-gray-900">
                            {currency}
                            {product.specific_delivery_charges.Others}
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail2;
