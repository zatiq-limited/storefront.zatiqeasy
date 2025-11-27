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
    galleryPosition?: "left" | "right";
    thumbnailPosition?: "bottom" | "left" | "top" | "right";
    thumbnailSize?: "sm" | "md" | "lg";
  };
  product: Product;
  currency?: string;
}

const ProductDetail1: React.FC<ProductDetail1Props> = ({
  settings = {},
  product,
  currency = "৳",
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
    galleryPosition = "left",
    thumbnailPosition = "bottom",
    thumbnailSize = "md",
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
    sm: { vertical: "w-12 h-12", grid: "grid-cols-6 gap-2" },
    md: { vertical: "w-16 h-16", grid: "grid-cols-4 gap-3" },
    lg: { vertical: "w-20 h-20", grid: "grid-cols-3 gap-4" },
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
    <div className="space-y-6">
      {/* Brand & SKU */}
      <div className="flex items-center justify-between">
        {showBrand && product.brand && (
          <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
            {product.brand}
          </span>
        )}
        {showSku && product.product_code && (
          <span className="text-xs text-gray-500">SKU: {product.product_code}</span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>

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
            {product.review_summary.average_rating.toFixed(1)} ({product.review_summary.total_reviews} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-gray-900">
          {currency}{product.price?.toLocaleString()}
        </span>
        {product.old_price && (
          <>
            <span className="text-2xl text-gray-500 line-through">
              {currency}{product.old_price?.toLocaleString()}
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>

      {/* Short Description */}
      {product.short_description && (
        <p className="text-gray-600 leading-relaxed">{product.short_description}</p>
      )}

      {/* Variants */}
      {showVariants && product.variant_types && product.variant_types.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          {product.variant_types.map((variantType) => (
            <div key={variantType.id}>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {variantType.title}
                {variantType.is_mandatory && <span className="text-red-500">*</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {variantType.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variantType.id, variant.id)}
                    className={`px-4 py-2 border-2 rounded-lg transition-all ${
                      selectedVariants[variantType.id] === variant.id
                        ? "border-blue-500 bg-blue-50"
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
        <div className="flex items-center gap-2">
          {product.quantity > 0 ? (
            <>
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-700 font-medium">In Stock</span>
              {product.quantity <= 10 && (
                <span className="text-orange-600 text-sm">(Only {product.quantity} left!)</span>
              )}
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-700 font-medium">Out of Stock</span>
            </>
          )}
        </div>
      )}

      {/* Add to Cart */}
      <div className="flex gap-3 pt-4">
        <button
          disabled={product.quantity === 0}
          className="flex-1 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
        <button
          className="px-6 py-4 border-2 border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all"
          title="Add to Wishlist"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
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
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${
            galleryPosition === "right" ? "lg:flex-row-reverse" : ""
          }`}
        >
          {galleryPosition === "left" ? (
            <>
              <div>{renderGallery()}</div>
              <div>{renderProductInfo()}</div>
            </>
          ) : (
            <>
              <div>{renderProductInfo()}</div>
              <div>{renderGallery()}</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail1;
