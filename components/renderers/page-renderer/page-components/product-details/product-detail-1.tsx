import React, { useState } from 'react';
import type { Product, Variant } from '@/stores/productsStore';

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
  galleryPosition?: string;
  thumbnailPosition?: string;
  thumbnailSize?: string;
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
  brandColor?: string;
  variantActiveColor?: string;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
}

interface ProductDetail1Props {
  settings: ProductDetail1Settings;
  product: Product;
  selectedVariants: Record<number, Variant>;
  quantity: number;
  computedPrice: number;
  onSelectVariant: (variantTypeId: number, variant: Variant) => void;
  onQuantityChange: (quantity: number) => void;
  onIncrementQuantity: () => void;
  onDecrementQuantity: () => void;
}

const ProductDetail1 = ({
  settings,
  product,
  selectedVariants,
  quantity,
  computedPrice,
  onSelectVariant,
  onQuantityChange,
  onIncrementQuantity,
  onDecrementQuantity,
}: ProductDetail1Props) => {
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
    thumbnailPosition = 'bottom',
    thumbnailSize = 'md',
    addToCartBgColor = '#2563EB',
    addToCartTextColor = '#FFFFFF',
    buyNowGradientStart = '#F97316',
    buyNowGradientEnd = '#EF4444',
    buyNowTextColor = '#FFFFFF',
    whatsappBgColor = '#25D366',
    whatsappTextColor = '#FFFFFF',
    priceColor = '#111827',
    oldPriceColor = '#9CA3AF',
    discountBadgeColor = '#DC2626',
    brandColor = '#2563EB',
    variantActiveColor = '#2563EB',
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
    if (isMobile) return 'py-6';
    if (isTablet) return 'py-8';
    return 'py-12';
  };

  // Get grid layout based on viewMode (NO breakpoints)
  const getGridLayoutClass = () => {
    if (isMobile) return 'grid-cols-1 gap-6';
    if (isTablet) return 'grid-cols-1 gap-8';
    return 'grid-cols-2 gap-12';
  };

  // Get title size based on viewMode (NO breakpoints)
  const getTitleSizeClass = () => {
    if (isMobile) return 'text-2xl';
    if (isTablet) return 'text-3xl';
    return 'text-4xl';
  };

  // Get price size based on viewMode (NO breakpoints)
  const getPriceSizeClass = () => {
    if (isMobile) return 'text-2xl';
    if (isTablet) return 'text-3xl';
    return 'text-4xl';
  };

  // Get old price size based on viewMode (NO breakpoints)
  const getOldPriceSizeClass = () => {
    if (isMobile) return 'text-lg';
    if (isTablet) return 'text-xl';
    return 'text-2xl';
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

  // Get thumbnail grid based on viewMode (NO breakpoints)
  const getThumbnailGridClass = () => {
    if (isMobile) return 'grid-cols-4 gap-2';
    if (isTablet) return 'grid-cols-5 gap-2';
    return 'grid-cols-4 gap-3';
  };

  // Get thumbnail size based on viewMode (NO breakpoints)
  const getThumbnailSizeClass = () => {
    if (isMobile) return 'w-14 h-14';
    if (isTablet) return 'w-16 h-16';
    return 'w-16 h-16';
  };

  // Get text size for description based on viewMode (NO breakpoints)
  const getTextSizeClass = () => {
    if (isMobile) return 'text-sm';
    return 'text-base';
  };

  // Get spacing based on viewMode (NO breakpoints)
  const getSpacingClass = () => {
    if (isMobile) return 'space-y-4';
    return 'space-y-6';
  };

  const [mainImage, setMainImage] = useState(0);

  // Use real product images
  const images = product.images || [];

  const discountPercent = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  const handleVariantSelect = (variantTypeId: number, variantId: number) => {
    const variant = product.variant_types
      ?.find(vt => vt.id === variantTypeId)
      ?.variants.find(v => v.id === variantId);
    if (variant) {
      onSelectVariant(variantTypeId, variant);
    }
  };

  const isVerticalThumbnails = thumbnailPosition === 'left' || thumbnailPosition === 'right';

  const renderThumbnails = () =>
    images.length > 1 ? (
      <div
        className={`${isVerticalThumbnails ? 'flex flex-col gap-3' : `grid ${getThumbnailGridClass()}`}`}
      >
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(index)}
            className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
              mainImage === index ? 'border-blue-500' : 'border-transparent hover:border-blue-300'
            } ${isVerticalThumbnails ? getThumbnailSizeClass() : ''}`}
            style={mainImage === index ? { borderColor: variantActiveColor } : {}}
          >
            <img src={img} alt={`${product.name} - Image ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    ) : null;

  const renderGallery = () => (
    <div className={`${isVerticalThumbnails && !isMobile ? 'flex gap-4' : ''}`}>
      {/* Thumbnails - Left Position (only on desktop/tablet) */}
      {thumbnailPosition === 'left' && !isMobile && renderThumbnails()}

      <div className="flex-1">
        {/* Thumbnails - Top Position */}
        {thumbnailPosition === 'top' && <div className="mb-4">{renderThumbnails()}</div>}

        {/* Main Image */}
        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
          <img src={images[mainImage]} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Thumbnails - Bottom Position */}
        {(thumbnailPosition === 'bottom' || (isVerticalThumbnails && isMobile)) && (
          <div className="mt-4">{renderThumbnails()}</div>
        )}
      </div>

      {/* Thumbnails - Right Position (only on desktop/tablet) */}
      {thumbnailPosition === 'right' && !isMobile && renderThumbnails()}
    </div>
  );

  const renderProductInfo = () => (
    <div className={getSpacingClass()}>
      {/* Brand & SKU */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {showBrand && product.brand && (
          <span
            className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium uppercase tracking-wide`}
            style={{ color: brandColor }}
          >
            {product.brand}
          </span>
        )}
        {showSku && product.product_code && (
          <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500`}>SKU: {product.product_code}</span>
        )}
      </div>

      {/* Title */}
      <h1 className={`${getTitleSizeClass()} font-bold text-gray-900 leading-tight`}>{product.name}</h1>

      {/* Rating */}
      {showRating && product.review_summary && (
        <div className={`flex items-center flex-wrap ${isMobile ? 'gap-2' : 'gap-4'}`}>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`${getStarSizeClass()} ${
                  i < Math.floor(product.review_summary.average_rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
            {product.review_summary.average_rating.toFixed(1)} ({product.review_summary.total_reviews} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className={`flex items-baseline flex-wrap ${isMobile ? 'gap-2 py-3' : 'gap-3 py-4'} border-y border-gray-100`}>
        <span className={`${getPriceSizeClass()} font-bold`} style={{ color: priceColor }}>
          ৳{product.price?.toLocaleString()}
        </span>
        {product.old_price && (
          <>
            <span className={`${getOldPriceSizeClass()} line-through`} style={{ color: oldPriceColor }}>
              ৳{product.old_price?.toLocaleString()}
            </span>
            <span
              className={`${isMobile ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'} text-white font-bold rounded-full`}
              style={{ backgroundColor: discountBadgeColor }}
            >
              {discountPercent}% OFF
            </span>
          </>
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
              <label className={`block ${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-900 mb-2`}>
                {variantType.title}
                {variantType.is_mandatory && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className={`flex flex-wrap ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
                {variantType.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variantType.id, variant.id)}
                    className={`${isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} border-2 rounded-lg text-sm transition-all ${
                      selectedVariants[variantType.id] === variant.id
                        ? 'text-white'
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                    style={
                      selectedVariants[variantType.id] === variant.id
                        ? { borderColor: variantActiveColor, backgroundColor: variantActiveColor }
                        : {}
                    }
                  >
                    {variant.name}
                    {variant.price > 0 && <span className="text-xs ml-1 opacity-75">+৳{variant.price}</span>}
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
              <div className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} bg-green-500 rounded-full animate-pulse`} />
              <span className={`${getTextSizeClass()} text-green-700 font-medium`}>In Stock</span>
              {product.quantity <= 10 && (
                <span className={`text-orange-600 ${isMobile ? 'text-xs' : 'text-sm'} bg-orange-50 px-2 py-0.5 rounded-full`}>
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
      <div className={`${isMobile ? 'space-y-2' : 'space-y-3'} pt-4`}>
        {/* Primary Actions Row */}
        <div className={`flex ${isMobile ? 'gap-2' : 'gap-3'}`}>
          {showAddToCart && (
            <button
              className={`flex-1 ${getButtonPaddingClass()} ${getTextSizeClass()} font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg`}
              style={{ backgroundColor: addToCartBgColor, color: addToCartTextColor }}
            >
              Add to Cart
            </button>
          )}
          {showWhatsAppBuy && (
            <button
              className={`flex-1 ${getButtonPaddingClass()} ${getTextSizeClass()} font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2`}
              style={{ backgroundColor: whatsappBgColor, color: whatsappTextColor }}
            >
              <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>
          )}
          {showWishlist && (
            <button
              className={`${isMobile ? 'p-3' : 'p-4'} border-2 border-gray-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all group`}
              title="Add to Wishlist"
            >
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
            className={`w-full ${getButtonPaddingClass()} ${getTextSizeClass()} font-semibold rounded-xl transition-all shadow-md hover:shadow-lg`}
            style={{
              background: `linear-gradient(to right, ${buyNowGradientStart}, ${buyNowGradientEnd})`,
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
              <p>• {product.warranty || '30 days return policy'}</p>
              {!product.isApplyDefaultDeliveryCharge && product.specific_delivery_charges && (
                <>
                  <p>• Dhaka: ৳{product.specific_delivery_charges.Dhaka}</p>
                  <p>• Outside Dhaka: ৳{product.specific_delivery_charges.Others}</p>
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
    <section className={getSectionPaddingClass()}>
      <div className={`container mx-auto ${getContainerPaddingClass()}`}>
        <div className={`grid ${getGridLayoutClass()} items-start`}>
          {galleryPosition === 'left' ? (
            <>
              <div className={!isMobile ? 'sticky top-4' : ''}>{renderGallery()}</div>
              <div>{renderProductInfo()}</div>
            </>
          ) : (
            <>
              <div>{renderProductInfo()}</div>
              <div className={!isMobile ? 'sticky top-4' : ''}>{renderGallery()}</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail1;
