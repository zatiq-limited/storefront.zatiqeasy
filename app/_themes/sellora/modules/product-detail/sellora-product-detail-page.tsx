"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Minus, Plus, ZoomIn, Download } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/stores/cartStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { ImageLightbox } from "@/components/products/image-lightbox";
import { cn, titleCase, getDetailPageImageUrl } from "@/lib/utils";
import { useProductDetails } from "@/hooks";
import { SelloraThemeWrapper } from "../../components/sellora-theme-wrapper";
import {
  ProductPricing,
  ProductVariants,
  DescriptionDetails,
  CustomerReviews,
  RelatedProducts,
} from "./sections";

interface SelloraProductDetailPageProps {
  handle: string;
}

// Extract YouTube video ID from URL (supports regular, shorts, and embed URLs)
function extractVideoId(url: string): string | null {
  if (!url) return null;

  // Handle YouTube Shorts URLs: youtube.com/shorts/VIDEO_ID
  const shortsPattern = /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;
  let match = url.match(shortsPattern);
  if (match && match[1]) return match[1];

  // Handle short URLs: youtu.be/VIDEO_ID
  const shortUrlPattern = /youtu\.be\/([a-zA-Z0-9_-]{11})/;
  match = url.match(shortUrlPattern);
  if (match && match[1]) return match[1];

  // Handle regular URLs: youtube.com/watch?v=VIDEO_ID
  const longUrlPattern = /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
  match = url.match(longUrlPattern);
  if (match && match[1]) return match[1];

  // Handle embed URLs: youtube.com/embed/VIDEO_ID
  const embedPattern = /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/;
  match = url.match(embedPattern);
  if (match && match[1]) return match[1];

  // Fallback pattern for other YouTube URL formats
  const fallbackPattern =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  match = url.match(fallbackPattern);
  return match ? match[1] : null;
}

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
  </div>
);

export function SelloraProductDetailPage({
  handle,
}: SelloraProductDetailPageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const totalCartItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  // Use centralized product details hook
  const {
    product,
    isLoading,
    error,
    selectedVariantsAsState,
    quantity,
    pricing,
    cartInfo,
    stockInfo,
    productImages,
    baseUrl,
    selectVariant,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    handleAddToCart: addToCart,
    handleBuyNow: buyNow,
  } = useProductDetails(handle);

  // Local UI state only
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasItems = totalCartItems > 0;

  // Check if download is allowed
  const allowDownload = Boolean(
    (
      shopDetails?.metadata?.settings?.shop_settings as
        | { enable_product_image_download?: boolean }
        | undefined
    )?.enable_product_image_download
  );

  // Video ID for YouTube
  const videoId = useMemo(
    () => extractVideoId(product?.video_link || ""),
    [product?.video_link]
  );

  // Category IDs for related products
  const categoryIds = useMemo(
    () => (product?.categories || []).map((c) => c.id),
    [product?.categories]
  );

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    if (stockInfo.isStockOut) return;
    addToCart();
  }, [stockInfo.isStockOut, addToCart]);

  // Handle buy now
  const handleBuyNow = useCallback(() => {
    if (stockInfo.isStockOut) return;
    buyNow();
  }, [stockInfo.isStockOut, buyNow]);

  // Handle download image
  const handleDownloadImage = useCallback(
    async (imageUrl: string, index: number) => {
      if (!allowDownload || !imageUrl) return;

      try {
        const proxyUrl = `/api/download-image?url=${encodeURIComponent(
          imageUrl
        )}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) throw new Error("Download failed");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${product?.name}-image-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
      }
    },
    [allowDownload, product?.name]
  );

  // Action button label
  const actionButtonLabel = cartInfo.isInCart
    ? t("update_cart")
    : t("add_to_cart");

  // Show loading state
  if (isLoading || !product) {
    return <LoadingFallback />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Product
          </h2>
          <p className="text-gray-600">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const {
    id,
    name = "",
    variant_types = [],
    video_link,
    reviews,
    categories = [],
    image_variant_type_id,
    unit_name,
  } = product;

  return (
    <SelloraThemeWrapper>
      {/* Image Lightbox */}
      <ImageLightbox
        product={{
          images: productImages.map((img) => getDetailPageImageUrl(img)),
          name: name || "",
        }}
        open={lightboxOpen}
        setOpen={setLightboxOpen}
        selectedImageIdx={selectedImageIndex}
      />

      {/* Main Product Section */}
      <div className="container grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 pt-10 sm:pt-20 lg:items-start">
        {/* Left Side - Images Grid */}
        <div className="lg:col-span-3 flex flex-col lg:flex-row gap-3 sm:gap-4 py-6 sm:py-8 lg:py-10">
          {productImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {productImages.map((img, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "relative w-full aspect-3/4 bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer group transition-all duration-200",
                    selectedImageIndex === idx &&
                      "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900"
                  )}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setLightboxOpen(true);
                  }}
                >
                  <FallbackImage
                    src={getDetailPageImageUrl(img)}
                    width={600}
                    height={800}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    alt={`${name} - Image ${idx + 1}`}
                  />

                  {/* Selected indicator (top-left) */}
                  {selectedImageIndex === idx && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-1.5 shadow-lg z-20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Action Buttons (top-right, always visible) */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                    {/* Download Button */}
                    {allowDownload && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDownloadImage(img, idx);
                        }}
                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
                        aria-label="Download image"
                        type="button"
                      >
                        <Download className="w-5 h-5 text-foreground" />
                      </button>
                    )}
                  </div>

                  {/* Zoom icon on hover overlay (center) */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 dark:bg-gray-800/90 p-2.5 rounded-full">
                        <ZoomIn className="w-5 h-5 text-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Product Info (Sticky) */}
        <div className="lg:col-span-2 px-0 lg:px-12 2xl:px-16 flex flex-col lg:sticky lg:top-20 lg:self-start">
          {/* Category Name */}
          <div className="mb-3 sm:mb-4">
            {categories[0]?.name && (
              <p className="text-xs sm:text-sm font-normal text-[#9C9B9B] mb-1.5 sm:mb-2 sm:pt-2">
                {categories[0].name}
              </p>
            )}

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-2">
              {titleCase(name)}
            </h1>

            {/* Stock Out Badge */}
            {stockInfo.isStockOut && (
              <span className="inline-block text-xs sm:text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2.5 sm:px-3 py-1 rounded">
                {t("out_of_stock") || "Out of stock"}
              </span>
            )}
          </div>

          {/* Pricing */}
          <div className="mb-4 sm:mb-5 md:mb-8">
            <ProductPricing
              currentPrice={pricing.currentPrice}
              regularPrice={pricing.regularPrice}
              hasSavePrice={pricing.hasDiscount}
              savePrice={pricing.savePrice}
              showOldPrice={true}
              unitName={unit_name}
            />
          </div>

          {/* Product Variants */}
          {variant_types.length > 0 && (
            <div className="mb-6 sm:mb-7 md:mb-8">
              <ProductVariants
                variantTypes={variant_types}
                selectedVariants={selectedVariantsAsState}
                onSelectVariant={(variantTypeId, variantState) => {
                  selectVariant(Number(variantTypeId), {
                    id: variantState.variant_id,
                    name: variantState.variant_name,
                    price: variantState.price || 0,
                    image_url: variantState.image_url,
                  });
                }}
                onImageChange={setSelectedImageIndex}
                images={productImages}
                imageVariantTypeId={image_variant_type_id ?? undefined}
              />
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3">
              {/* Quantity Control */}
              <div className="flex-1 flex items-center justify-between min-h-12 sm:min-h-14 px-4 bg-transparent border-2 border-gray-300 dark:border-gray-700 rounded-md">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 rounded"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    if (val >= 1 && val <= (stockInfo.stockQuantity || 999)) {
                      setQuantity(val);
                    }
                  }}
                  className="w-12 text-center bg-transparent outline-none text-foreground font-medium"
                  min={1}
                  max={stockInfo.stockQuantity || 999}
                />
                <button
                  onClick={incrementQuantity}
                  disabled={stockInfo.isStockNotAvailable}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 rounded"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                disabled={stockInfo.isStockNotAvailable}
                onClick={handleAddToCart}
                className="flex-1 min-h-12 sm:min-h-14 p-2 sm:p-2.5 md:p-3 cursor-pointer text-base text-foreground font-medium capitalize rounded-md disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed border-2 border-gray-300 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                {actionButtonLabel}
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              disabled={stockInfo.isStockNotAvailable}
              onClick={handleBuyNow}
              className="w-full min-h-12 sm:min-h-14 p-2 sm:p-2.5 md:p-3 cursor-pointer text-base font-medium capitalize rounded-md disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed bg-foreground text-background hover:bg-foreground/90 transition-colors border-2 border-foreground"
            >
              {t("buy_now") || "Buy Now"}
            </button>

            {/* Stock Warning */}
            {stockInfo.isStockNotAvailable && !stockInfo.isStockOut && (
              <p className="text-xs sm:text-sm font-medium text-red-500 mt-2">
                {t("no_more_items_remaining") || "No more items remaining!"}
              </p>
            )}
          </div>

          {/* Description & Details Accordion */}
          <div className="pb-6 sm:pb-8 lg:pb-10">
            <DescriptionDetails product={product} />
          </div>
        </div>
      </div>

      {/* Product Video Section */}
      {video_link && (
        <div className="container py-6 sm:py-8 lg:py-10">
          <h2 className="text-2xl md:text-3xl font-normal text-black dark:text-white mb-4 sm:mb-6">
            {t("product_video") || "Product Video"}
          </h2>
          <div className="relative max-w-7xl mx-auto aspect-video bg-black rounded-lg overflow-hidden">
            {videoId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
                title={name || "Product video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0"
              />
            ) : (
              <video
                src={video_link}
                controls
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}

      {/* Customer Reviews */}
      {reviews && reviews.length > 0 && (
        <div className="container py-6 sm:py-8 lg:py-10">
          <CustomerReviews
            reviews={
              reviews as {
                name?: string;
                description?: string;
                images?: string[];
                rating?: number;
                created_at?: string;
              }[]
            }
          />
        </div>
      )}

      {/* Related Products */}
      <RelatedProducts currentProductId={id!} categoryIds={categoryIds} />

      {/* Floating Cart Button */}
      <CartFloatingBtn
        showCartFloatingBtn={hasItems}
        totalProducts={totalCartItems}
        totalPrice={totalPrice}
        onClick={() => router.push(`${baseUrl}/checkout`)}
        theme="Sellora"
      />
    </SelloraThemeWrapper>
  );
}

export default SelloraProductDetailPage;
