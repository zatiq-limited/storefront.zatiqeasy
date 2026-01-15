"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  Play,
} from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";
import { ImageLightbox } from "@/components/products/image-lightbox";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/stores/cartStore";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { SoldUnits } from "@/components/products/sold-units";
import { CustomerReviews } from "@/components/products/customer-reviews";
import TrustCard from "../../components/trust-card";
import CartQtyControl from "@/components/features/cart/shared/cart-qty-control";
import { GridContainer } from "../../components/core";
import { LuxuraProductCard } from "../../components/cards";
import { SectionHeader } from "../home/sections/section-header";
import { formatPrice, titleCase } from "@/lib/utils/formatting";
import {
  cn,
  getDetailPageImageUrl,
  getInventoryThumbImageUrl,
} from "@/lib/utils";
import { getThemeData } from "@/lib/utils/theme-constants";
import { FallbackImage } from "@/components/ui/fallback-image";
import { useProductDetails, useShopInventories } from "@/hooks";
import type { Product } from "@/stores/productsStore";

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

interface LuxuraProductDetailPageProps {
  handle?: string;
}

export function LuxuraProductDetailPage({
  handle: propHandle,
}: LuxuraProductDetailPageProps = {}) {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();

  // Get product handle from props first, then params
  const productHandle =
    propHandle ||
    ((params?.productHandle || params?.handle || "") as string);

  const { shopDetails } = useShopStore();
  const storeProducts = useProductsStore((state) => state.products);
  const totalCartProducts = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  // Fetch products if store is empty (handles page reload scenario)
  const { data: fetchedProducts } = useShopInventories(
    { shopUuid: shopDetails?.shop_uuid || "" },
    {
      enabled: storeProducts.length === 0 && !!shopDetails?.shop_uuid,
      sortByStock: false,
    }
  );

  // Use store products if available, otherwise use fetched products
  const products = useMemo(
    () =>
      storeProducts.length > 0
        ? storeProducts
        : (fetchedProducts as Product[]) || [],
    [storeProducts, fetchedProducts]
  );

  // ============================================
  // Use centralized hook - all common logic is here
  // ============================================
  const {
    product,
    selectedVariants,
    quantity,
    selectVariant,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    // Centralized handlers
    handleAddToCart,
    handleBuyNow,
    // Centralized objects
    pricing,
    cartInfo,
    stockInfo,
    // Images
    productImages,
    // Shop settings
    baseUrl,
    currency,
  } = useProductDetails(productHandle);

  // Local UI state only
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isShowVideo, setIsShowVideo] = useState(false);

  const allowDownload = Boolean(
    (
      shopDetails?.metadata?.settings?.shop_settings as
        | { enable_product_image_download?: boolean }
        | undefined
    )?.enable_product_image_download
  );
  const hasItems = totalCartProducts > 0;

  // Get related products (same category, excluding current)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.category_id === product.category_id ||
            p.categories?.some((c) =>
              product.categories?.some((pc) => pc.id === c.id)
            ))
      )
      .slice(0, 4);
  }, [products, product]);

  // Video link for product
  const video_link = useMemo(() => product?.video_link, [product?.video_link]);
  const videoId = useMemo(
    () => extractVideoId(video_link || ""),
    [video_link]
  );

  // Type-safe access to product extended properties
  const productRecord = product as unknown as Record<string, unknown>;
  const totalInventorySold =
    (productRecord?.total_inventory_sold as number) ?? 0;
  const initialProductSold =
    (productRecord?.initial_product_sold as number) ?? 0;

  // Pixel tracking for product view
  useEffect(() => {
    if (!product) return;

    // Facebook Pixel tracking
    if (typeof window !== "undefined") {
      const win = window as unknown as {
        fbq?: (
          command: string,
          eventName: string,
          data?: Record<string, unknown>
        ) => void;
      };
      if (win.fbq) {
        win.fbq("track", "ViewContent", {
          content_name: product.name,
          content_ids: [product.id?.toString()],
          content_type: "product",
          value: product.price,
          currency: shopDetails?.country_currency || "USD",
        });
      }
    }

    // Google Tag Manager tracking
    if (typeof window !== "undefined") {
      const win = window as unknown as { dataLayer?: unknown[] };
      if (win.dataLayer) {
        win.dataLayer.push({
          event: "view_item",
          ecommerce: {
            items: [
              {
                item_id: product.id?.toString(),
                item_name: product.name,
                price: product.price,
                currency: shopDetails?.country_currency || "USD",
              },
            ],
          },
        });
      }
    }

    // TikTok Pixel tracking
    if (typeof window !== "undefined") {
      const win = window as unknown as {
        ttq?: { track: (event: string, data: Record<string, unknown>) => void };
      };
      if (win.ttq) {
        win.ttq.track("ViewContent", {
          content_id: product.id?.toString(),
          content_name: product.name,
          content_type: "product",
          price: product.price,
          currency: shopDetails?.country_currency || "USD",
        });
      }
    }
  }, [product, shopDetails?.country_currency]);

  // Navigate to product
  const navigateProductDetails = useCallback(
    (id: number | string) => {
      router.push(`${baseUrl}/products/${id}`);
    },
    [router, baseUrl]
  );

  // Handle download image
  const handleDownloadImage = useCallback(
    async (imageUrl: string, index: number) => {
      if (!allowDownload || !imageUrl || !product) return;

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
        link.download = `${product.name}-image-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
      }
    },
    [allowDownload, product]
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <>
      {/* Image Lightbox */}
      <ImageLightbox
        product={{
          images: productImages,
          name: product.name || "",
        }}
        open={lightboxOpen}
        setOpen={setLightboxOpen}
        selectedImageIdx={selectedImageIndex}
      />

      <div className="container pb-20 py-8">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              {isShowVideo && video_link ? (
                <div className="w-full h-full bg-black z-50 flex items-center justify-center border rounded-xl md:rounded-3xl">
                  {video_link && (
                    <iframe
                      width="1280"
                      height="720"
                      src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
                      title={product.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="w-full max-h-75 md:max-h-125 object-contain transition ease-in duration-500 rounded-xl md:rounded-3xl"
                    />
                  )}
                </div>
              ) : (
                productImages[selectedImageIndex] && (
                  <FallbackImage
                    src={getDetailPageImageUrl(productImages[selectedImageIndex])}
                    width={512}
                    height={512}
                    className="w-full max-h-225 object-contain transition ease-in duration-500 rounded-xl md:rounded-3xl"
                    alt={product.name}
                    onClick={() => setLightboxOpen(true)}
                  />
                )
              )}

              {/* Zoom & Download Buttons - Only show when NOT showing video */}
              {!isShowVideo && productImages[selectedImageIndex] && (
                <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                  {/* Zoom Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxOpen(true);
                    }}
                    className="bg-blue-zatiq/15 backdrop-blur-sm p-3 rounded-full cursor-pointer hover:bg-blue-zatiq/25 transition-all duration-200 shadow-lg"
                    aria-label="Zoom image"
                    type="button"
                  >
                    <ZoomIn className="text-white dark:text-gray-700 w-5 h-5 md:w-7 md:h-7" />
                  </button>

                  {/* Download Button */}
                  {allowDownload && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadImage(
                          productImages[selectedImageIndex],
                          selectedImageIndex
                        );
                      }}
                      className="bg-blue-zatiq/15 backdrop-blur-sm p-3 rounded-full cursor-pointer hover:bg-blue-zatiq/25 transition-all duration-200 shadow-lg"
                      aria-label="Download image"
                      type="button"
                    >
                      <Download className="text-white dark:text-gray-700 w-5 h-5 md:w-7 md:h-7" />
                    </button>
                  )}
                </div>
              )}

              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? productImages.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === productImages.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex px-1 mt-2 md:mt-3">
              {productImages.length > 0 && (
                <ul className="flex gap-2 flex-wrap mt-2">
                  {/* Video Thumbnail */}
                  {video_link && videoId && (
                    <div
                      onClick={() => {
                        setIsShowVideo(true);
                      }}
                      className={cn(
                        "w-[50px] min-w-[50px] h-[50px] sm:min-w-[75px] sm:h-[75px] sm:w-[75px] relative overflow-hidden ring ring-transparent p-1 cursor-pointer",
                        isShowVideo ? "ring-blue-zatiq!" : ""
                      )}
                    >
                      <FallbackImage
                        src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                        alt="Product video"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-lg md:rounded-xl"
                      />
                      <Play
                        size={16}
                        className="absolute top-1/2 left-1/2 text-white translate-x-[-50%] translate-y-[-50%]"
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
                      className="w-[50px] min-w-[50px] h-[50px] sm:min-w-[75px] sm:h-[75px] sm:w-[75px] relative overflow-hidden ring-3 ring-transparent p-1 cursor-pointer"
                    >
                      <FallbackImage
                        alt={`${product.name}_img_${key}`}
                        src={getInventoryThumbImageUrl(img)}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-lg md:rounded-xl"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Details Section (Desktop) - INSIDE image column */}
            <div className="text-sm mt-[40px] hidden xl:block">
              {(product.custom_fields || product.warranty) && (
                <div className="bg-blue-zatiq/10 dark:bg-black-18 border border-blue-zatiq/50 dark:border-gray-700 px-5 py-5 text-black-1.2 dark:text-white mb-4 rounded-xl md:rounded-3xl">
                  <h4 className="font-medium text-sm text-[#4B5563] dark:text-gray-300">
                    Details:
                  </h4>
                  <ul className="mt-3 tracking-[-0.24px] capitalize">
                    {product.custom_fields &&
                      Object.keys(product.custom_fields).map(
                        (key: string, idx: number) => (
                          <li key={idx} className="grid grid-cols-5 gap-6">
                            <div className="col-span-2 text-[#6B7280] dark:text-gray-100">
                              {key}
                            </div>
                            <div className="col-span-3 text-right text-[#374151] dark:text-gray-100">
                              {
                                (
                                  product.custom_fields as Record<
                                    string,
                                    string
                                  >
                                )[key]
                              }
                            </div>
                          </li>
                        )
                      )}
                    {product.warranty && (
                      <li className="grid grid-cols-5 gap-6">
                        <div className="col-span-2 text-[#6B7280] dark:text-gray-400">
                          Warranty
                        </div>
                        <div className="col-span-3 text-right text-[#374151] dark:text-gray-100">
                          {product.warranty}
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {product.description && (
                <div className="ql-snow">
                  <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <h1
              className="text-[20px] md:text-4xl text-blue-zatiq"
              style={{
                fontFamily: getThemeData(shopDetails?.shop_theme?.theme_name)
                  ?.secondaryFont,
              }}
            >
              {titleCase(product.name)}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-2">
              <span className="text-2xl md:text-3xl font-bold text-blue-600">
                {formatPrice(pricing.currentPrice, currency)}
              </span>
              {pricing.hasDiscount && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(pricing.regularPrice, currency)}
                  </span>
                  <span className="bg-red-100 text-red-600 text-sm font-medium px-2 py-1 rounded">
                    {pricing.discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Sold Units */}
            <SoldUnits
              showSoldCount={shopDetails?.show_product_sold_count ?? false}
              initialSold={initialProductSold}
              totalSold={totalInventorySold}
            />

            {/* Already in Cart Message */}
            {cartInfo.isInCart && (
              <p className="text-sm text-blue-600 font-medium">
                Already in your cart ({cartInfo.cartQty})
              </p>
            )}

            {/* Variants */}
            {product.variant_types?.map((variantType) => (
              <div key={variantType.id} className="space-y-3">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {variantType.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variantType.variants?.map((variant) => {
                    const isSelected =
                      selectedVariants[variantType.id]?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => selectVariant(variantType.id, variant)}
                        className={cn(
                          "px-4 py-2 rounded-lg border transition-colors",
                          isSelected
                            ? "border-blue-zatiq bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-300 hover:border-blue-zatiq"
                        )}
                      >
                        {variant.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Trust Card */}
            <div>
              <TrustCard />
            </div>

            {/* Quantity & Actions */}
            <div className="w-full my-6 mt-12">
              <div className="flex flex-col md:flex-row md:items-center items-start gap-4 w-full pb-2">
                <CartQtyControl
                  qty={quantity}
                  subQty={decrementQuantity}
                  sumQty={incrementQuantity}
                  disableSubBtn={quantity <= 1}
                  disableSumBtn={stockInfo.isStockOut}
                  maxStock={product.quantity}
                  onQtyChange={setQuantity}
                  className="px-3 py-1.5 md:w-1/2 border-[1.2px] border-blue-zatiq w-full bg-transparent rounded-lg md:rounded-xl"
                />

                <button
                  disabled={stockInfo.isStockOut}
                  onClick={handleAddToCart}
                  className="md:w-1/2 text-center p-3 text-sm md:text-base font-medium capitalize disabled:bg-black-disabled w-full border-[1.2px] border-blue-zatiq text-blue-zatiq disabled:text-white disabled:border-black-disabled rounded-lg md:rounded-xl cursor-pointer"
                >
                  {cartInfo.isInCart ? t("update_cart") : t("add_to_cart")}
                </button>
              </div>

              <button
                disabled={stockInfo.isStockOut}
                onClick={handleBuyNow}
                className="p-3 mt-2 text-center text-sm md:text-base font-medium disabled:bg-black-disabled capitalize transition-colors duration-150 w-full bg-blue-zatiq border-[1.2px] border-blue-zatiq text-white dark:text-black-full disabled:text-white disabled:border-black-disabled rounded-lg md:rounded-xl cursor-pointer"
              >
                {t("buy_now")}
              </button>

              {stockInfo.isStockOut && (
                <p className="text-sm font-medium text-red-500 mt-3">
                  No more items remaining!
                </p>
              )}
            </div>

            {/* Mobile Details Section */}
            <div className="w-full text-sm xl:hidden block">
              {(product.custom_fields || product.warranty) && (
                <div className="bg-[#F4F4F5] dark:bg-gray-800 border border-black-4 dark:border-gray-700 px-5 py-5 text-black-1.2 dark:text-white mb-4">
                  <h4 className="font-medium text-sm text-[#4B5563] dark:text-gray-300">
                    Details:
                  </h4>
                  <ul className="mt-3 tracking-[-0.24px] capitalize">
                    {product.custom_fields &&
                      Object.keys(product.custom_fields).map(
                        (key: string, idx: number) => (
                          <li key={idx} className="grid grid-cols-5 gap-6">
                            <div className="col-span-2 text-[#6B7280] dark:text-gray-400">
                              {key}
                            </div>
                            <div className="col-span-3 text-right text-[#374151] dark:text-gray-100">
                              {
                                (
                                  product.custom_fields as Record<
                                    string,
                                    string
                                  >
                                )[key]
                              }
                            </div>
                          </li>
                        )
                      )}
                    {product.warranty && (
                      <li className="grid grid-cols-5 gap-6">
                        <div className="col-span-2 text-[#6B7280] dark:text-gray-400">
                          Warranty
                        </div>
                        <div className="col-span-3 text-right text-[#374151] dark:text-gray-100">
                          {product.warranty}
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {product.description && (
                <div className="ql-snow">
                  <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <CustomerReviews reviews={product?.reviews ?? []} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <SectionHeader text={t("related_products")} link="/products" />
            <GridContainer>
              {relatedProducts.map((p) => (
                <LuxuraProductCard
                  key={p.id}
                  product={p}
                  onNavigate={() => navigateProductDetails(p.id)}
                />
              ))}
            </GridContainer>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        onClick={() => router.push(`${baseUrl}/checkout`)}
        showCartFloatingBtn={hasItems}
        totalPrice={totalPrice}
        totalProducts={totalCartProducts}
        theme="Luxura"
      />
    </>
  );
}

export default LuxuraProductDetailPage;
