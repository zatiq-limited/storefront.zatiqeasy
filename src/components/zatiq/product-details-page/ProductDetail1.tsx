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

interface ProductDetail1Props {
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
    thumbnailPosition?: "bottom" | "left" | "top" | "right";
    thumbnailSize?: "sm" | "md" | "lg";
    buyNowGradientStart?: string;
    buyNowGradientEnd?: string;
    buyNowTextColor?: string;
  };
  product: Product;
  currency?: string;
  whatsappNumber?: string;
}

const ProductDetail1: React.FC<ProductDetail1Props> = ({
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
    thumbnailPosition = "bottom",
    thumbnailSize = "md",
    buyNowGradientStart = "#F97316",
    buyNowGradientEnd = "#EF4444",
    buyNowTextColor = "#FFFFFF",
  } = settings;

  const [mainImage, setMainImage] = useState(product.image_url);
  const [selectedVariants, setSelectedVariants] = useState<Record<number, number>>({});

  const discountPercent = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  const handleVariantSelect = (variantTypeId: number, variantId: number) => {
    setSelectedVariants((prev) => ({ ...prev, [variantTypeId]: variantId }));
  };

  const isVerticalThumbnails = thumbnailPosition === "left" || thumbnailPosition === "right";

  const thumbnailSizeClasses = {
    sm: { vertical: "w-12 h-12 sm:w-14 sm:h-14", grid: "grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2" },
    md: { vertical: "w-14 h-14 sm:w-16 sm:h-16", grid: "grid-cols-4 gap-2 sm:gap-3" },
    lg: { vertical: "w-16 h-16 sm:w-20 sm:h-20", grid: "grid-cols-3 gap-3 sm:gap-4" },
  };

  const renderThumbnails = () => (
    product.images && product.images.length > 1 ? (
      <div className={`${isVerticalThumbnails ? "flex flex-col gap-3" : `grid ${thumbnailSizeClasses[thumbnailSize].grid}`}`}>
        {product.images.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(img)}
            className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
              mainImage === img ? "border-blue-500" : "border-transparent hover:border-blue-300"
            } ${isVerticalThumbnails ? thumbnailSizeClasses[thumbnailSize].vertical : ""}`}
          >
            <img
              src={img}
              alt={`${product.name} - Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    ) : null
  );

  const renderGallery = () => (
    <div className={`${isVerticalThumbnails ? "flex gap-4" : ""}`}>
      {/* Thumbnails - Left Position */}
      {thumbnailPosition === "left" && renderThumbnails()}

      <div className="flex-1">
        {/* Thumbnails - Top Position */}
        {thumbnailPosition === "top" && (
          <div className="mb-4">
            {renderThumbnails()}
          </div>
        )}

        {/* Main Image */}
        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnails - Bottom Position */}
        {thumbnailPosition === "bottom" && (
          <div className="mt-4">
            {renderThumbnails()}
          </div>
        )}
      </div>

      {/* Thumbnails - Right Position */}
      {thumbnailPosition === "right" && renderThumbnails()}
    </div>
  );

  const renderProductInfo = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Brand & SKU */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {showBrand && product.brand && (
          <span className="text-xs sm:text-sm font-medium text-blue-600 uppercase tracking-wide">
            {product.brand}
          </span>
        )}
        {showSku && product.product_code && (
          <span className="text-[10px] sm:text-xs text-gray-500">SKU: {product.product_code}</span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>

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
            {product.review_summary.average_rating.toFixed(1)} ({product.review_summary.total_reviews} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline flex-wrap gap-2 sm:gap-3 py-3 sm:py-4 border-y border-gray-100">
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          {currency}{product.price?.toLocaleString()}
        </span>
        {product.old_price && (
          <>
            <span className="text-lg sm:text-xl md:text-2xl text-gray-400 line-through">
              {currency}{product.old_price?.toLocaleString()}
            </span>
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-red-100 text-red-700 text-xs sm:text-sm font-bold rounded-full">
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>

      {/* Short Description */}
      {product.short_description && (
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{product.short_description}</p>
      )}

      {/* Variants */}
      {showVariants && product.variant_types && product.variant_types.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          {product.variant_types.map((variantType) => (
            <div key={variantType.id}>
              <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                {variantType.title}
                {variantType.is_mandatory && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {variantType.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variantType.id, variant.id)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 border-2 rounded-lg text-sm transition-all ${
                      selectedVariants[variantType.id] === variant.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    {variant.name}
                    {variant.price > 0 && (
                      <span className="text-xs text-gray-500 ml-1">+{currency}{variant.price}</span>
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
        <div className="flex items-center flex-wrap gap-2">
          {product.quantity > 0 ? (
            <>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm sm:text-base text-green-700 font-medium">In Stock</span>
              {product.quantity <= 10 && (
                <span className="text-orange-600 text-xs sm:text-sm bg-orange-50 px-2 py-0.5 rounded-full">
                  Only {product.quantity} left!
                </span>
              )}
            </>
          ) : (
            <>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
              <span className="text-sm sm:text-base text-red-700 font-medium">Out of Stock</span>
            </>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 sm:space-y-3 pt-4">
        {/* Primary Actions Row */}
        <div className="flex gap-2 sm:gap-3">
          {showAddToCart && (
            <button
              disabled={product.quantity === 0}
              className="flex-1 py-3 sm:py-4 text-sm sm:text-base bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Add to Cart
            </button>
          )}
          {showWhatsAppBuy && (
            <button
              disabled={product.quantity === 0}
              onClick={() => {
                const message = encodeURIComponent(
                  `Hi, I'm interested in buying:\n\n*${product.name}*\nPrice: ${currency}${product.price?.toLocaleString()}\n\nPlease confirm availability.`
                );
                window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
              }}
              className="flex-1 py-3 sm:py-4 text-sm sm:text-base bg-[#25D366] hover:bg-[#20BA5C] text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
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
              className="p-3 sm:p-4 border-2 border-gray-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all group"
              title="Add to Wishlist"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            style={{
              background: product.quantity === 0
                ? '#9CA3AF'
                : `linear-gradient(to right, ${buyNowGradientStart}, ${buyNowGradientEnd})`,
              color: buyNowTextColor,
            }}
          >
            Buy Now
          </button>
        )}
      </div>

      {/* Accordion Sections */}
      <div className="space-y-2 pt-6 border-t">
        {/* Description */}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="pb-4 text-gray-600 leading-relaxed">{product.description}</div>
          </details>
        )}

        {/* Specifications */}
        {showSpecifications && product.custom_fields && Object.keys(product.custom_fields).length > 0 && (
          <details className="group">
            <summary className="flex items-center justify-between py-4 cursor-pointer font-semibold text-gray-900 border-t">
              <span>Specifications</span>
              <svg
                className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="pb-4">
              <dl className="space-y-2">
                {Object.entries(product.custom_fields).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-600">{key}</dt>
                    <dd className="font-medium text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </details>
        )}

        {/* Shipping & Returns */}
        {showShipping && (
          <details className="group">
            <summary className="flex items-center justify-between py-4 cursor-pointer font-semibold text-gray-900 border-t">
              <span>Shipping & Returns</span>
              <svg
                className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="pb-4 space-y-3 text-sm text-gray-600">
              <p>• {product.warranty || "30 days return policy"}</p>
              {!product.isApplyDefaultDeliveryCharge && product.specific_delivery_charges && (
                <>
                  <p>• Dhaka: {currency}{product.specific_delivery_charges.Dhaka}</p>
                  <p>• Outside Dhaka: {currency}{product.specific_delivery_charges.Others}</p>
                </>
              )}
              {product.isApplyDefaultDeliveryCharge && <p>• Standard delivery charges apply</p>}
            </div>
          </details>
        )}
      </div>
    </div>
  );

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start ${
            galleryPosition === "right" ? "lg:flex-row-reverse" : ""
          }`}
        >
          {galleryPosition === "left" ? (
            <>
              <div className="lg:sticky lg:top-4">{renderGallery()}</div>
              <div>{renderProductInfo()}</div>
            </>
          ) : (
            <>
              <div>{renderProductInfo()}</div>
              <div className="lg:sticky lg:top-4">{renderGallery()}</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail1;
