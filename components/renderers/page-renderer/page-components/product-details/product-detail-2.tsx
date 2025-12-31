import React, { useState } from 'react';
import type { Product, Variant } from '@/stores/productsStore';

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
  galleryPosition?: string;
  thumbnailPosition?: string;
  accentColor?: string;
  buyNowGradientStart?: string;
  buyNowGradientEnd?: string;
  buyNowTextColor?: string;
  whatsappBgColor?: string;
  whatsappTextColor?: string;
  priceColor?: string;
  oldPriceColor?: string;
  discountBadgeColor?: string;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
}

interface ProductDetail2Props {
  settings: ProductDetail2Settings;
  product: Product;
  selectedVariants: Record<number, Variant>;
  quantity: number;
  computedPrice: number;
  onSelectVariant: (variantTypeId: number, variant: Variant) => void;
  onQuantityChange: (quantity: number) => void;
  onIncrementQuantity: () => void;
  onDecrementQuantity: () => void;
}

const ProductDetail2 = ({
  settings,
  product,
  selectedVariants,
  quantity,
  computedPrice,
  onSelectVariant,
  onQuantityChange,
  onIncrementQuantity,
  onDecrementQuantity,
}: ProductDetail2Props) => {
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
    galleryPosition = 'left',
    thumbnailPosition = 'left',
    accentColor = '#7C3AED',
    buyNowGradientStart = '#F97316',
    buyNowGradientEnd = '#EF4444',
    buyNowTextColor = '#FFFFFF',
    whatsappBgColor = '#25D366',
    whatsappTextColor = '#FFFFFF',
    priceColor = '#7C3AED',
    oldPriceColor = '#9CA3AF',
    discountBadgeColor = '#7C3AED',
    viewMode = 'desktop',
  } = settings;
  // Helper to check current view mode
  const isMobile = viewMode === 'mobile';
  const isTablet = viewMode === 'tablet';

  // Helper to get container padding class based on viewMode (NO breakpoints)
  const getContainerPaddingClass = () => {
    if (isMobile) return 'px-4';
    if (isTablet) return 'px-6';
    return 'px-4';
  };

  // Get section padding based on viewMode (NO breakpoints)
  const getSectionPaddingClass = () => {
    if (isMobile) return 'py-4';
    if (isTablet) return 'py-6';
    return 'py-4';
  };

  // Get grid layout based on viewMode (NO breakpoints)
  const getGridLayoutClass = () => {
    if (isMobile) return 'grid-cols-1';
    if (isTablet) return 'grid-cols-1';
    return 'grid-cols-2';
  };

  // Get title size based on viewMode (NO breakpoints)
  const getTitleSizeClass = () => {
    if (isMobile) return 'text-xl';
    if (isTablet) return 'text-2xl';
    return 'text-3xl';
  };

  // Get price size based on viewMode (NO breakpoints)
  const getPriceSizeClass = () => {
    if (isMobile) return 'text-2xl';
    if (isTablet) return 'text-3xl';
    return 'text-4xl';
  };

  // Get old price size based on viewMode (NO breakpoints)
  const getOldPriceSizeClass = () => {
    if (isMobile) return 'text-base';
    if (isTablet) return 'text-lg';
    return 'text-xl';
  };

  // Get star size based on viewMode (NO breakpoints)
  const getStarSizeClass = () => {
    if (isMobile) return 'w-4 h-4';
    return 'w-5 h-5';
  };

  // Get button padding based on viewMode (NO breakpoints)
  const getButtonPaddingClass = () => {
    if (isMobile) return 'py-3';
    return 'py-4';
  };

  // Get text size based on viewMode (NO breakpoints)
  const getTextSizeClass = () => {
    if (isMobile) return 'text-sm';
    return 'text-base';
  };

  // Get spacing based on viewMode (NO breakpoints)
  const getSpacingClass = () => {
    if (isMobile) return 'space-y-4';
    return 'space-y-6';
  };

  // Get gallery padding based on viewMode (NO breakpoints)
  const getGalleryPaddingClass = () => {
    if (isMobile) return 'p-0';
    if (isTablet) return 'p-6';
    return 'p-8';
  };

  // Get product info padding based on viewMode (NO breakpoints)
  const getProductInfoPaddingClass = () => {
    if (isMobile) return 'py-4';
    if (isTablet) return 'p-6';
    return 'p-8';
  };

  // Get thumbnail size based on viewMode (NO breakpoints)
  const getThumbnailSizeClass = () => {
    if (isMobile) return 'w-14 h-14';
    if (isTablet) return 'w-16 h-16';
    return 'w-20 h-20';
  };

  // Get thumbnail grid based on viewMode (NO breakpoints)
  const getThumbnailGridClass = () => {
    if (isMobile) return 'grid-cols-4 gap-1.5';
    if (isTablet) return 'grid-cols-4 gap-2';
    return 'grid-cols-3 gap-3';
  };

  // Get tab content padding based on viewMode (NO breakpoints)
  const getTabContentPaddingClass = () => {
    if (isMobile) return 'p-4';
    if (isTablet) return 'p-6';
    return 'p-8';
  };

  const [mainImage, setMainImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  // Use real product images
  const images = product.images || [];

  const discountPercent = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  const handleVariantSelect = (variantTypeId, variantId) => {
    setSelectedVariants((prev) => ({ ...prev, [variantTypeId]: variantId }));
  };

  // Render thumbnails based on position
  const renderThumbnails = (position) => {
    // Horizontal thumbnails (top or bottom)
    if (position === 'bottom' || position === 'top') {
      return (
        <div className={`grid ${getThumbnailGridClass()} ${position === 'top' ? 'mb-4' : 'mt-4'}`}>
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setMainImage(index)}
              className={`aspect-square bg-white rounded-xl overflow-hidden border-2 transition-all ${
                mainImage === index
                  ? 'shadow-lg'
                  : 'border-transparent hover:border-purple-300'
              }`}
              style={mainImage === index ? { borderColor: accentColor } : {}}
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

    // Left or Right vertical thumbnails (only show on desktop)
    if (isMobile) return null;

    return (
      <div className={`flex flex-col gap-3 ${position === 'right' ? 'order-2' : 'order-1'}`}>
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(index)}
            className={`${getThumbnailSizeClass()} aspect-square bg-white rounded-xl overflow-hidden border-2 transition-all ${
              mainImage === index
                ? 'shadow-lg'
                : 'border-transparent hover:border-purple-300'
            }`}
            style={mainImage === index ? { borderColor: accentColor } : {}}
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
    <div className={`${getGalleryPaddingClass()} ${(thumbnailPosition === 'bottom' || thumbnailPosition === 'top' || isMobile) ? '' : 'flex gap-4'}`}>
      {/* Side Thumbnails (Left) */}
      {thumbnailPosition === 'left' && !isMobile && renderThumbnails('left')}

      {/* Main Image */}
      <div className={`${(thumbnailPosition === 'bottom' || thumbnailPosition === 'top' || isMobile) ? '' : 'flex-1'} ${thumbnailPosition === 'left' && !isMobile ? 'order-2' : thumbnailPosition === 'right' && !isMobile ? 'order-1' : ''}`}>
        {/* Top Thumbnails */}
        {thumbnailPosition === 'top' && renderThumbnails('top')}

        <div className={`aspect-square bg-white ${isMobile ? 'rounded-xl' : 'rounded-2xl'} overflow-hidden shadow-inner relative`}>
          <img
            src={images[mainImage]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {discountPercent > 0 && (
            <div
              className={`absolute ${isMobile ? 'top-2 left-2 px-2.5 py-1 text-xs' : 'top-4 left-4 px-4 py-2 text-sm'} text-white rounded-full font-bold shadow-lg`}
              style={{ background: `linear-gradient(to right, ${discountBadgeColor}, #4F46E5)` }}
            >
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Bottom Thumbnails or Mobile thumbnails */}
        {(thumbnailPosition === 'bottom' || isMobile) && (
          <div className={`flex gap-1.5 mt-3 overflow-x-auto pb-2`}>
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(index)}
                className={`${getThumbnailSizeClass()} shrink-0 rounded-lg overflow-hidden border-2 ${
                  mainImage === index ? '' : 'border-transparent'
                }`}
                style={mainImage === index ? { borderColor: accentColor } : {}}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Side Thumbnails (Right) */}
      {thumbnailPosition === 'right' && !isMobile && renderThumbnails('right')}
    </div>
  );

  // Render product info section
  const renderProductInfo = () => (
    <div className={`${getProductInfoPaddingClass()} ${getSpacingClass()}`}>
      {/* Brand & SKU */}
      <div className={`flex items-center flex-wrap ${isMobile ? 'gap-2' : 'gap-3'}`}>
        {showBrand && product.brand && (
          <span
            className={`${isMobile ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'} font-semibold rounded-full uppercase`}
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            {product.brand}
          </span>
        )}
        {showSku && product.product_code && (
          <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400`}>SKU: {product.product_code}</span>
        )}
      </div>

      {/* Title */}
      <h1 className={`${getTitleSizeClass()} font-bold text-gray-900 leading-tight`}>
        {product.name}
      </h1>

      {/* Rating */}
      {showRating && product.review_summary && (
        <div className={`flex items-center flex-wrap ${isMobile ? 'gap-1.5' : 'gap-3'}`}>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`${getStarSizeClass()} ${
                  i < Math.floor(product.review_summary.average_rating)
                    ? 'text-yellow-400'
                    : 'text-gray-200'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
            {product.review_summary.average_rating.toFixed(1)}
          </span>
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400`}>
            ({product.review_summary.total_reviews} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className={`flex items-baseline flex-wrap ${isMobile ? 'gap-2 py-3' : 'gap-4 py-4'} border-y border-gray-100`}>
        <span
          className={`${getPriceSizeClass()} font-bold`}
          style={{
            background: `linear-gradient(to right, ${priceColor}, #4F46E5)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ৳{product.price?.toLocaleString()}
        </span>
        {product.old_price && (
          <span className={`${getOldPriceSizeClass()} line-through`} style={{ color: oldPriceColor }}>
            ৳{product.old_price?.toLocaleString()}
          </span>
        )}
      </div>

      {/* Short Description */}
      {product.short_description && (
        <p className={`${getTextSizeClass()} text-gray-600 leading-relaxed`}>{product.short_description}</p>
      )}

      {/* Variants */}
      {showVariants && product.variant_types && product.variant_types.length > 0 && (
        <div className={isMobile ? 'space-y-3' : 'space-y-4'}>
          {product.variant_types.map((variantType) => (
            <div key={variantType.id}>
              <label className={`block ${isMobile ? 'text-xs mb-2' : 'text-sm mb-3'} font-semibold text-gray-900`}>
                {variantType.title}
                {variantType.is_mandatory && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className={`flex flex-wrap ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
                {variantType.variants.map((variant) => {
                  const isSelected = selectedVariants[variantType.id] === variant.id;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantSelect(variantType.id, variant.id)}
                      className={`${isMobile ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'} rounded-full font-medium transition-all ${
                        isSelected
                          ? 'text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                      }`}
                      style={isSelected ? { backgroundColor: accentColor } : {}}
                    >
                      {variant.name}
                      {variant.price > 0 && (
                        <span className="ml-1 opacity-75">+৳{variant.price}</span>
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
        <div className={`flex items-center flex-wrap ${isMobile ? 'gap-2' : 'gap-3'}`}>
          {product.quantity > 0 ? (
            <>
              <div className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} bg-green-500 rounded-full animate-pulse`} />
              <span className={`${getTextSizeClass()} text-green-700 font-medium`}>In Stock</span>
              {product.quantity <= 10 && (
                <span className={`text-orange-600 ${isMobile ? 'text-xs py-0.5' : 'text-sm py-1'} bg-orange-50 px-2 rounded-full`}>
                  Only {product.quantity} left!
                </span>
              )}
            </>
          ) : (
            <>
              <div className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} bg-red-500 rounded-full`} />
              <span className={`${getTextSizeClass()} text-red-700 font-medium`}>Out of Stock</span>
            </>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className={isMobile ? 'space-y-3 pt-3' : 'space-y-4 pt-4'}>
        {/* Primary Actions Row */}
        <div className={`flex ${isMobile ? 'gap-2' : 'gap-3'}`}>
          {showAddToCart && (
            <button
              disabled={product.quantity === 0}
              className={`flex-1 ${getButtonPaddingClass()} ${getTextSizeClass()} text-white font-semibold ${isMobile ? 'rounded-xl' : 'rounded-2xl'} transition-all shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none`}
              style={{ background: `linear-gradient(to right, ${accentColor}, #4F46E5)` }}
            >
              Add to Cart
            </button>
          )}
          {showWhatsAppBuy && (
            <button
              disabled={product.quantity === 0}
              className={`flex-1 ${getButtonPaddingClass()} ${getTextSizeClass()} font-semibold ${isMobile ? 'rounded-xl' : 'rounded-2xl'} transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2`}
              style={{ backgroundColor: whatsappBgColor, color: whatsappTextColor }}
            >
              <svg
                className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>
          )}
          {showWishlist && (
            <button className={`${isMobile ? 'p-3 rounded-xl' : 'p-4 rounded-2xl'} border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-all group`}>
              <svg
                className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-gray-400 group-hover:text-pink-500 transition-colors`}
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
            className={`w-full ${getButtonPaddingClass()} ${getTextSizeClass()} font-semibold ${isMobile ? 'rounded-xl' : 'rounded-2xl'} transition-all shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none`}
            style={{ background: `linear-gradient(to right, ${buyNowGradientStart}, ${buyNowGradientEnd})`, color: buyNowTextColor }}
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  );

  return (
    <section className={getSectionPaddingClass()}>
      <div className={`container mx-auto ${getContainerPaddingClass()}`}>
        <div className={`bg-white ${isMobile ? 'rounded-2xl' : 'rounded-3xl'} overflow-hidden`}>
          <div className={`grid ${getGridLayoutClass()}`}>
            {/* Dynamic Gallery Position */}
            {galleryPosition === 'left' ? (
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
            <div className="flex border-b overflow-x-auto">
              {showDescription && product.description && (
                <button
                  onClick={() => setActiveTab('description')}
                  className={`${isMobile ? 'px-3 py-3 text-xs' : 'px-6 py-4 text-sm'} font-semibold transition-colors relative whitespace-nowrap ${
                    activeTab === 'description'
                      ? ''
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={activeTab === 'description' ? { color: accentColor } : {}}
                >
                  Description
                  {activeTab === 'description' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: accentColor }} />
                  )}
                </button>
              )}
              {showSpecifications && product.custom_fields && Object.keys(product.custom_fields).length > 0 && (
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`${isMobile ? 'px-3 py-3 text-xs' : 'px-6 py-4 text-sm'} font-semibold transition-colors relative whitespace-nowrap ${
                    activeTab === 'specs'
                      ? ''
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={activeTab === 'specs' ? { color: accentColor } : {}}
                >
                  Specifications
                  {activeTab === 'specs' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: accentColor }} />
                  )}
                </button>
              )}
              {showShipping && (
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`${isMobile ? 'px-3 py-3 text-xs' : 'px-6 py-4 text-sm'} font-semibold transition-colors relative whitespace-nowrap ${
                    activeTab === 'shipping'
                      ? ''
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={activeTab === 'shipping' ? { color: accentColor } : {}}
                >
                  Shipping & Returns
                  {activeTab === 'shipping' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: accentColor }} />
                  )}
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className={getTabContentPaddingClass()}>
              {activeTab === 'description' && product.description && (
                <div className={`prose ${isMobile ? 'prose-sm' : ''} max-w-none text-gray-600`}>{product.description}</div>
              )}

              {activeTab === 'specs' && product.custom_fields && (
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-4'}`}>
                  {Object.entries(product.custom_fields).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex justify-between ${isMobile ? 'py-2 px-3' : 'py-3 px-4'} bg-gray-50 rounded-lg`}
                    >
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>{key}</span>
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-900`}>{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className={isMobile ? 'space-y-3' : 'space-y-4'}>
                  <div className={`flex items-start ${isMobile ? 'gap-2 p-3' : 'gap-3 p-4'} bg-blue-50 ${isMobile ? 'rounded-lg' : 'rounded-xl'}`}>
                    <svg className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-blue-600 shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className={`${getTextSizeClass()} text-blue-800`}>{product.warranty || '30 days return policy'}</p>
                  </div>
                  {!product.isApplyDefaultDeliveryCharge && product.specific_delivery_charges && (
                    <div className={`grid grid-cols-2 ${isMobile ? 'gap-2' : 'gap-4'}`}>
                      <div className={`${isMobile ? 'p-3 rounded-lg' : 'p-4 rounded-xl'} bg-gray-50`}>
                        <p className={`${isMobile ? 'text-xs mb-0.5' : 'text-sm mb-1'} text-gray-500`}>Dhaka</p>
                        <p className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900`}>
                          ৳{product.specific_delivery_charges.Dhaka}
                        </p>
                      </div>
                      <div className={`${isMobile ? 'p-3 rounded-lg' : 'p-4 rounded-xl'} bg-gray-50`}>
                        <p className={`${isMobile ? 'text-xs mb-0.5' : 'text-sm mb-1'} text-gray-500`}>Outside Dhaka</p>
                        <p className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900`}>
                          ৳{product.specific_delivery_charges.Others}
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
