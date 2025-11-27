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
    galleryPosition?: "left" | "right";
    thumbnailPosition?: "bottom" | "left" | "right" | "top";
    thumbnailSize?: "sm" | "md" | "lg";
  };
  product: Product;
  currency?: string;
}

const ProductDetail2: React.FC<ProductDetail2Props> = ({
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
    thumbnailPosition = "left",
    thumbnailSize = "md",
  } = settings;

  const [mainImage, setMainImage] = useState(product.image_url);
  const [selectedVariants, setSelectedVariants] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "shipping">("description");

  const discountPercent = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  const handleVariantSelect = (variantTypeId: number, variantId: number) => {
    setSelectedVariants((prev) => ({ ...prev, [variantTypeId]: variantId }));
  };

  const thumbnailSizeClasses = {
    sm: { vertical: "w-14", grid: "grid-cols-6 gap-2", mobile: "w-12 h-12" },
    md: { vertical: "w-20", grid: "grid-cols-4 gap-3", mobile: "w-16 h-16" },
    lg: { vertical: "w-24", grid: "grid-cols-3 gap-4", mobile: "w-20 h-20" },
  };

  // Render thumbnails based on position
  const renderThumbnails = (position: "left" | "right" | "bottom" | "top") => {
    if (!product.images || product.images.length <= 1) return null;

    // Horizontal thumbnails (top or bottom)
    if (position === "bottom" || position === "top") {
      return (
        <div className={`grid ${thumbnailSizeClasses[thumbnailSize].grid} ${position === "top" ? "mb-4" : "mt-4"}`}>
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
      <div className={`hidden md:flex flex-col gap-3 ${thumbnailSizeClasses[thumbnailSize].vertical} ${position === "right" ? "order-2" : "order-1"}`}>
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
    <div className={`p-6 lg:p-8 ${(thumbnailPosition === "bottom" || thumbnailPosition === "top") ? "" : "flex gap-4"}`}>
      {/* Side Thumbnails (Left) */}
      {thumbnailPosition === "left" && renderThumbnails("left")}

      {/* Main Image */}
      <div className={`${(thumbnailPosition === "bottom" || thumbnailPosition === "top") ? "" : "flex-1"} ${thumbnailPosition === "left" ? "order-2" : thumbnailPosition === "right" ? "order-1" : ""}`}>
        {/* Top Thumbnails */}
        {thumbnailPosition === "top" && renderThumbnails("top")}

        <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-inner relative">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {discountPercent > 0 && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Bottom Thumbnails */}
        {thumbnailPosition === "bottom" && renderThumbnails("bottom")}

        {/* Mobile Thumbnails (always at bottom on mobile) */}
        {product.images && product.images.length > 1 && thumbnailPosition !== "bottom" && thumbnailPosition !== "top" && (
          <div className="md:hidden flex gap-2 mt-4 overflow-x-auto pb-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(img)}
                className={`${thumbnailSizeClasses[thumbnailSize].mobile} shrink-0 rounded-lg overflow-hidden border-2 ${
                  mainImage === img ? "border-purple-500" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
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
    <div className="p-6 lg:p-8 space-y-6">
      {/* Brand & SKU */}
      <div className="flex items-center gap-3">
        {showBrand && product.brand && (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full uppercase">
            {product.brand}
          </span>
        )}
        {showSku && product.product_code && (
          <span className="text-xs text-gray-400">SKU: {product.product_code}</span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      {showRating && product.review_summary && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
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
          <span className="text-sm text-gray-600">
            {product.review_summary.average_rating.toFixed(1)}
          </span>
          <span className="text-sm text-gray-400">
            ({product.review_summary.total_reviews} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-4 py-4 border-y border-gray-100">
        <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          {currency}{product.price?.toLocaleString()}
        </span>
        {product.old_price && (
          <span className="text-xl text-gray-400 line-through">
            {currency}{product.old_price?.toLocaleString()}
          </span>
        )}
      </div>

      {/* Short Description */}
      {product.short_description && (
        <p className="text-gray-600 leading-relaxed">{product.short_description}</p>
      )}

      {/* Variants */}
      {showVariants && product.variant_types && product.variant_types.length > 0 && (
        <div className="space-y-4">
          {product.variant_types.map((variantType) => (
            <div key={variantType.id}>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                {variantType.title}
                {variantType.is_mandatory && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {variantType.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variantType.id, variant.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      selectedVariants[variantType.id] === variant.id
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    }`}
                  >
                    {variant.name}
                    {variant.price > 0 && (
                      <span className="ml-1 opacity-75">+{currency}{variant.price}</span>
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
        <div className="flex items-center gap-3">
          {product.quantity > 0 ? (
            <>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 font-medium">In Stock</span>
              {product.quantity <= 10 && (
                <span className="text-orange-600 text-sm bg-orange-50 px-2 py-1 rounded-full">
                  Only {product.quantity} left!
                </span>
              )}
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-red-700 font-medium">Out of Stock</span>
            </>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          disabled={product.quantity === 0}
          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Add to Cart
        </button>
        <button className="p-4 border-2 border-gray-200 rounded-2xl hover:border-pink-500 hover:bg-pink-50 transition-all group">
          <svg
            className="w-6 h-6 text-gray-400 group-hover:text-pink-500 transition-colors"
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
      </div>
    </div>
  );

  return (
    <section className="py-8 md:py-4">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        <div className="bg-white rounded-3xl overflow-hidden">
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
            <div className="flex border-b">
              {showDescription && product.description && (
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-6 py-4 text-sm font-semibold transition-colors relative ${
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
              {showSpecifications && product.custom_fields && Object.keys(product.custom_fields).length > 0 && (
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`px-6 py-4 text-sm font-semibold transition-colors relative ${
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
                  className={`px-6 py-4 text-sm font-semibold transition-colors relative ${
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
            <div className="p-6 lg:p-8">
              {activeTab === "description" && product.description && (
                <div className="prose max-w-none text-gray-600">{product.description}</div>
              )}

              {activeTab === "specs" && product.custom_fields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.custom_fields).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between py-3 px-4 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-600">{key}</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                    <svg className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-blue-800">{product.warranty || "30 days return policy"}</p>
                  </div>
                  {!product.isApplyDefaultDeliveryCharge && product.specific_delivery_charges && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">Dhaka</p>
                        <p className="text-lg font-bold text-gray-900">
                          {currency}{product.specific_delivery_charges.Dhaka}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">Outside Dhaka</p>
                        <p className="text-lg font-bold text-gray-900">
                          {currency}{product.specific_delivery_charges.Others}
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
