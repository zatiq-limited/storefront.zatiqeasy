"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Minus, Plus, Play, Download, ChevronLeft, ZoomIn } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/stores/cartStore";
import { useProductDetails } from "@/hooks/useProductDetails";
import { FallbackImage } from "@/components/ui/fallback-image";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { ImageLightbox } from "@/components/products/image-lightbox";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import {
  cn,
  getInventoryThumbImageUrl,
  getDetailPageImageUrl,
} from "@/lib/utils";
import { ProductPricing, ProductVariants } from "./sections";
import PremiumRelatedProducts from "../../components/product-details/premium-related-products";
import type { Product } from "@/stores/productsStore";

interface PremiumProductDetailPageProps {
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

export function PremiumProductDetailPage({
  handle,
}: PremiumProductDetailPageProps) {
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

  // Local UI state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isShowVideo, setIsShowVideo] = useState(false);
  const [selectedRelatedProduct, setSelectedRelatedProduct] =
    useState<Product | null>(null);

  const hasItems = totalCartItems > 0;

  // Don't show video by default - only show if user clicks
  useEffect(() => {
    if (!product?.video_link) {
      setIsShowVideo(false);
    }
  }, [product?.video_link]);

  // Check if download is allowed
  const allowDownload = Boolean(
    (
      shopDetails?.metadata?.settings?.shop_settings as
        | { enable_product_image_download?: boolean }
        | undefined
    )?.enable_product_image_download
  );

  // Selected image URL
  const selectedImageUrl = useMemo(() => {
    return productImages[selectedImageIndex] || product?.image_url || "";
  }, [productImages, selectedImageIndex, product?.image_url]);

  // Video ID for YouTube
  const videoId = useMemo(
    () => extractVideoId(product?.video_link || ""),
    [product?.video_link]
  );

  // Handle add to cart / update cart
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
  const handleDownloadImage = useCallback(async () => {
    if (!allowDownload || !selectedImageUrl) return;

    try {
      const proxyUrl = `/api/download-image?url=${encodeURIComponent(
        selectedImageUrl
      )}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${product?.name}-image-${selectedImageIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }, [allowDownload, selectedImageUrl, product?.name, selectedImageIndex]);

  // Navigate to product detail
  const navigateProductDetails = useCallback(
    (productId: number | string) => {
      router.push(`${baseUrl}/products/${productId}`);
    },
    [router, baseUrl]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-zatiq" />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            {t("product_not_found")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t("product_not_found_desc")}
          </p>
        </div>
      </div>
    );
  }

  const {
    id,
    name,
    short_description,
    description,
    variant_types = [],
    custom_fields,
    warranty,
    video_link,
    image_variant_type_id,
    unit_name,
  } = product;

  // Action button label
  const actionButtonLabel = cartInfo.isInCart
    ? t("update_cart")
    : t("add_to_cart");

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Variant Selector Modal for Related Products */}
      <VariantSelectorModal
        product={selectedRelatedProduct}
        isOpen={!!selectedRelatedProduct}
        onClose={() => setSelectedRelatedProduct(null)}
      />

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

      <div className="container py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-zatiq transition-colors"
          >
            <ChevronLeft size={20} />
            {t("back")}
          </button>
        </div>

        {/* Main Product Section */}
        <div className="flex items-start xl:flex-row flex-col gap-6.5">
          {/* Desktop Vertical Thumbnail Strip */}
          <div className="overflow-auto xl:w-[10%] h-auto xl:flex hidden xl:pl-1">
            {productImages.length > 0 && (
              <ul className="flex flex-col gap-2 mt-2 w-full pb-1">
                {/* Video Thumbnail */}
                {video_link && videoId && (
                  <div
                    className={cn(
                      "relative w-22.5 h-29 p-1 ring-[1px] ring-transparent bg-[#E4E4E7] dark:bg-transparent cursor-pointer",
                      isShowVideo && "ring-blue-zatiq"
                    )}
                    onClick={() => setIsShowVideo(true)}
                  >
                    <FallbackImage
                      src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                      alt="Video thumbnail"
                      width={200}
                      height={200}
                      sizes="90px"
                      className="w-full h-full object-cover"
                    />
                    <Play
                      size={20}
                      className="absolute top-1/2 left-1/2 text-white -translate-x-1/2 -translate-y-1/2"
                    />
                  </div>
                )}

                {/* Image Thumbnails */}
                {productImages.map((img, key) => (
                  <li
                    role="button"
                    onClick={() => {
                      setIsShowVideo(false);
                      setSelectedImageIndex(key);
                    }}
                    key={key}
                    className={cn(
                      "cursor-pointer w-22.5 h-29 p-1 ring-[1px] ring-transparent bg-[#E4E4E7] dark:bg-transparent",
                      key === selectedImageIndex &&
                        !isShowVideo &&
                        "ring-blue-zatiq"
                    )}
                  >
                    <FallbackImage
                      alt={`${name}_img_${key}`}
                      src={getInventoryThumbImageUrl(img)}
                      width={200}
                      height={200}
                      sizes="90px"
                      className="w-full h-full object-cover"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Main Content */}
          <div className="xl:w-[90%] w-full pt-1">
            <div className="w-full flex xl:flex-row flex-col items-start gap-5 xl:gap-7.5 h-full rounded-xl">
              {/* Image/Video Section */}
              <div className="w-full xl:w-160">
                <div className="relative">
                  {/* Video Player */}
                  {isShowVideo && video_link && videoId ? (
                    <div className="w-full h-full bg-black z-50 flex items-center justify-center border">
                      <iframe
                        width="1280"
                        height="720"
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
                        title={name || "Product video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full max-h-75 md:max-h-125 object-contain transition ease-in duration-500"
                      />
                    </div>
                  ) : (
                    /* Main Image */
                    selectedImageUrl && (
                      <div
                        className="cursor-pointer"
                        onClick={() => setLightboxOpen(true)}
                      >
                        <FallbackImage
                          src={getDetailPageImageUrl(selectedImageUrl)}
                          width={512}
                          height={512}
                          priority={true}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 50vw"
                          className="w-full max-h-225 object-contain transition ease-in duration-500"
                          alt={name || "Product"}
                        />
                      </div>
                    )
                  )}

                  {/* Image Action Buttons */}
                  {productImages.length > 0 && !isShowVideo && selectedImageUrl && (
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                      {/* Zoom Button */}
                      <button
                        onClick={() => setLightboxOpen(true)}
                        className="bg-blue-zatiq/15 backdrop-blur-sm p-3 rounded-full cursor-pointer hover:bg-blue-zatiq/25 transition-all duration-200 shadow-lg"
                        aria-label="Zoom image"
                        type="button"
                      >
                        <ZoomIn className="text-white dark:text-gray-700 w-5 h-5 md:w-7 md:h-7" />
                      </button>

                      {/* Download Button */}
                      {allowDownload && (
                        <button
                          onClick={handleDownloadImage}
                          className="bg-blue-zatiq/15 backdrop-blur-sm p-3 rounded-full cursor-pointer hover:bg-blue-zatiq/25 transition-all duration-200 shadow-lg"
                          aria-label="Download image"
                          type="button"
                        >
                          <Download className="text-white dark:text-gray-700 w-5 h-5 md:w-7 md:h-7" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Mobile Thumbnail Strip */}
                  <div className="xl:hidden flex px-1">
                    {productImages.length > 0 && (
                      <ul className="flex gap-2 flex-wrap mt-2">
                        {video_link && videoId && (
                          <div
                            className={cn(
                              "w-12.5 min-w-12.5 h-12.5 sm:min-w-18.75 sm:h-18.75 sm:w-18.75 relative overflow-hidden ring ring-transparent p-1 cursor-pointer",
                              isShowVideo && "ring-blue-zatiq"
                            )}
                            onClick={() => setIsShowVideo(true)}
                          >
                            <FallbackImage
                              src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                              alt="Video thumbnail"
                              width={200}
                              height={200}
                              sizes="75px"
                              className="w-full h-full object-cover"
                            />
                            <Play
                              size={16}
                              className="absolute top-1/2 left-1/2 text-white -translate-x-1/2 -translate-y-1/2"
                            />
                          </div>
                        )}
                        {productImages.map((img, key) => (
                          <li
                            role="button"
                            onClick={() => {
                              setIsShowVideo(false);
                              setSelectedImageIndex(key);
                            }}
                            key={key}
                            className={cn(
                              "w-12.5 min-w-12.5 h-12.5 sm:min-w-18.75 sm:h-18.75 sm:w-18.75 relative overflow-hidden ring-3 ring-transparent p-1",
                              key === selectedImageIndex &&
                                !isShowVideo &&
                                "ring-blue-zatiq"
                            )}
                          >
                            <FallbackImage
                              alt={`${name}_img_${key}`}
                              src={getInventoryThumbImageUrl(img)}
                              width={200}
                              height={200}
                              sizes="75px"
                              className="w-full h-full object-cover"
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Desktop Product Details & Description */}
                  <div className="text-sm mt-10 hidden xl:block">
                    {/* Custom Fields */}
                    {(custom_fields || warranty) && (
                      <div className="bg-blue-zatiq/10 dark:bg-black-18 border border-blue-zatiq/50 dark:border-gray-700 px-5 py-5 text-black-1.2 dark:text-white mb-4">
                        <h4 className="font-medium text-sm text-[#4B5563] dark:text-gray-300">
                          {t("details")}:
                        </h4>
                        <ul className="mt-3 tracking-[-0.24px] capitalize">
                          {custom_fields &&
                            Object.keys(custom_fields).map((key, idx) => (
                              <li key={idx} className="grid grid-cols-5 gap-6">
                                <div className="col-span-2 text-[#6B7280] dark:text-gray-100">
                                  {key}
                                </div>
                                <div className="col-span-3 text-right text-[#374151] dark:text-gray-100">
                                  {
                                    (custom_fields as Record<string, string>)[
                                      key
                                    ]
                                  }
                                </div>
                              </li>
                            ))}
                          {warranty && (
                            <li className="grid grid-cols-5 gap-6">
                              <div className="col-span-2 text-[#6B7280] dark:text-gray-400">
                                {t("warranty")}
                              </div>
                              <div className="col-span-3 text-right text-[#374151] dark:text-gray-100">
                                {warranty}
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Description */}
                    {description && (
                      <div className="ql-snow">
                        <div
                          className="ql-editor prose dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Info Section */}
              <div className="flex flex-col flex-1 w-full">
                <div className="grid gap-4.5">
                  {/* Title */}
                  <h1 className="text-[20px] md:text-4xl text-blue-zatiq capitalize">
                    {name}
                  </h1>

                  {/* Stock Status */}
                  {stockInfo.isStockOut && (
                    <span className="-mt-4 text-sm font-medium text-red-500">
                      {t("out_of_stock")}
                    </span>
                  )}

                  {/* Pricing */}
                  <div className="flex flex-col gap-7.5">
                    <div className="flex items-end gap-2">
                      <ProductPricing
                        currentPrice={pricing.currentPrice}
                        regularPrice={pricing.regularPrice}
                        hasSavePrice={pricing.hasDiscount}
                        savePrice={pricing.savePrice}
                        showOldPrice={true}
                        unitName={unit_name}
                      />
                    </div>

                    {/* Short Description */}
                    {short_description && (
                      <p className="text-gray-600 dark:text-gray-400">
                        {short_description}
                      </p>
                    )}

                    {/* Already in Cart Notice */}
                    <div className="flex flex-col gap-4.5">
                      {cartInfo.cartQty > 0 && (
                        <div>
                          <p className="text-sm text-blue-zatiq font-medium">
                            {t("already_in_cart")} ({cartInfo.cartQty})
                          </p>
                        </div>
                      )}

                      {/* Variants */}
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
                        imageVariantTypeId={image_variant_type_id}
                      />
                    </div>
                  </div>
                </div>

                {/* Quantity & Action Buttons */}
                <div className="w-full my-6 mt-12">
                  <div className="flex md:items-center items-start gap-4 w-full pb-2">
                    {/* Quantity Control */}
                    <div className="flex items-center p-3 h-11 sm:h-14 md:w-1/2 w-full border-[1.2px] border-blue-zatiq">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
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
                        className="flex-1 text-center bg-transparent outline-none"
                        min={1}
                        max={stockInfo.stockQuantity || 999}
                      />
                      <button
                        onClick={incrementQuantity}
                        disabled={stockInfo.isStockNotAvailable}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      disabled={stockInfo.isStockNotAvailable}
                      onClick={handleAddToCart}
                      className="h-11 sm:h-14 md:w-1/2 text-center text-sm md:text-base font-medium uppercase disabled:bg-black-disabled w-full border-[1.2px] border-blue-zatiq text-blue-zatiq disabled:text-white disabled:border-black-disabled cursor-pointer"
                    >
                      {actionButtonLabel}
                    </button>
                  </div>

                  {/* Buy Now Button */}
                  <button
                    disabled={stockInfo.isStockNotAvailable}
                    onClick={handleBuyNow}
                    className="p-3 h-11 sm:h-14 text-center text-sm md:text-base font-medium disabled:bg-black-disabled uppercase transition-colors duration-150 w-full bg-blue-zatiq border-[1.2px] border-blue-zatiq text-white disabled:text-white disabled:border-black-disabled mt-2 dark:text-black-full cursor-pointer"
                  >
                    {t("buy_now")}
                  </button>

                  {/* Stock Warning */}
                  {stockInfo.isStockNotAvailable && !stockInfo.isStockOut && (
                    <p className="text-sm font-medium text-red-500 mt-3">
                      {t("no_more_items_remaining")}
                    </p>
                  )}
                </div>

                {/* Mobile Product Details & Description */}
                <div className="text-sm xl:hidden block">
                  {(custom_fields || warranty) && (
                    <div className="bg-[#F4F4F5] dark:bg-gray-800 border border-black-4 dark:border-gray-700 px-5 py-5 text-black-1.2 dark:text-white mb-4">
                      <h4 className="font-medium text-sm text-[#4B5563] dark:text-gray-300">
                        {t("details")}:
                      </h4>
                      <ul className="mt-3 tracking-[-0.24px] capitalize">
                        {custom_fields &&
                          Object.keys(custom_fields).map((key, idx) => (
                            <li key={idx} className="grid grid-cols-5 gap-6">
                              <div className="col-span-2 text-[#6B7280] dark:text-gray-400">
                                {key}
                              </div>
                              <div className="col-span-3 text-right text-[#374151] dark:text-gray-100">
                                {(custom_fields as Record<string, string>)[key]}
                              </div>
                            </li>
                          ))}
                        {warranty && (
                          <li className="grid grid-cols-5 gap-6">
                            <div className="col-span-2 text-[#6B7280] dark:text-gray-400">
                              {t("warranty")}
                            </div>
                            <div className="col-span-3 text-right text-[#374151] dark:text-gray-100">
                              {warranty}
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {description && (
                    <div className="ql-snow">
                      <div
                        className="ql-editor prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <PremiumRelatedProducts
          ignoreProductId={id}
          currentProduct={product}
          onSelectProduct={setSelectedRelatedProduct}
          onNavigate={navigateProductDetails}
        />
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        showCartFloatingBtn={hasItems}
        totalProducts={totalCartItems}
        totalPrice={totalPrice}
        onClick={() => router.push(`${baseUrl}/checkout`)}
        theme="Premium"
      />
    </div>
  );
}

export default PremiumProductDetailPage;
