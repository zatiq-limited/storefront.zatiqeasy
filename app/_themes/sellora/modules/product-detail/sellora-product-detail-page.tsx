"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
import type { VariantsState, VariantState } from "@/types/cart.types";

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
  const fallbackPattern = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
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
  const { addProduct, removeProduct } = useCartStore();
  const totalCartItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  // Fetch product details using hook
  const { product, isLoading, error } = useProductDetails(handle);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Track if we've already initialized variants (to avoid re-running)
  const hasInitializedVariants = useRef(false);
  const [selectedVariants, setSelectedVariants] = useState<VariantsState>({});

  // Extract product properties with defaults - wrap in useMemo for performance
  const id = useMemo(() => product?.id, [product?.id]);
  const name = useMemo(() => product?.name || "", [product?.name]);
  const price = useMemo(() => product?.price ?? 0, [product?.price]);
  const old_price = useMemo(() => product?.old_price, [product?.old_price]);
  const images = useMemo(() => product?.images ?? [], [product?.images]);
  const image_url = useMemo(() => product?.image_url, [product?.image_url]);
  const variant_types = useMemo(
    () => product?.variant_types ?? [],
    [product?.variant_types]
  );
  const video_link = useMemo(() => product?.video_link, [product?.video_link]);
  const reviews = useMemo(() => product?.reviews, [product?.reviews]);
  const categories = useMemo(
    () => product?.categories ?? [],
    [product?.categories]
  );
  const image_variant_type_id = useMemo(
    () => product?.image_variant_type_id,
    [product?.image_variant_type_id]
  );

  const baseUrl = shopDetails?.baseUrl || "";
  const hasItems = totalCartItems > 0;

  // Check if download is allowed
  const allowDownload = Boolean(
    (
      shopDetails?.metadata?.settings?.shop_settings as
        | { enable_product_image_download?: boolean }
        | undefined
    )?.enable_product_image_download
  );

  // All product images
  const allImages = useMemo(() => {
    const imgs = [...(images || [])];
    if (image_url && !imgs.includes(image_url)) {
      imgs.unshift(image_url);
    }
    return imgs.filter(Boolean);
  }, [images, image_url]);

  // Selected image URL
  const selectedImageUrl = useMemo(() => {
    return allImages[selectedImageIndex] || image_url || "";
  }, [allImages, selectedImageIndex, image_url]);

  // Video ID for YouTube
  const videoId = useMemo(() => extractVideoId(video_link || ""), [video_link]);

  // Get cart products for this product - subscribe to products state to track cart changes
  // Then filter to get only this product's cart items (reactive approach like basic/premium themes)
  const allCartProducts = useCartStore((state) => state.products);
  const cartProducts = useMemo(
    () =>
      id
        ? Object.values(allCartProducts).filter((p) => p.id === Number(id))
        : [],
    [id, allCartProducts]
  );
  const isInCart = cartProducts.length > 0;

  // For non-variant products, find the cart item directly
  // For variant products, find the matching variant combination
  const matchingCartItem = useMemo(() => {
    if (cartProducts.length === 0) return null;
    // For non-variant products, return first cart item
    if (!variant_types || variant_types.length === 0) {
      return cartProducts[0];
    }
    // For variant products, find matching selected variants
    return (
      cartProducts.find((item) => {
        const itemVariants = item.selectedVariants || {};
        const selectedKeys = Object.keys(selectedVariants);
        const itemKeys = Object.keys(itemVariants);
        if (selectedKeys.length !== itemKeys.length) return false;
        return selectedKeys.every((key) => {
          const numKey = Number(key);
          return (
            selectedVariants[numKey]?.variant_id ===
            itemVariants[numKey]?.variant_id
          );
        });
      }) || null
    );
  }, [cartProducts, selectedVariants, variant_types]);

  // Sync quantity with matching cart item
  // Use matchingCartItem?.qty in dependency to detect actual value changes
  const matchingCartQty = matchingCartItem?.qty ?? 0;
  useEffect(() => {
    if (matchingCartQty > 0) {
      setQuantity(matchingCartQty);
    } else {
      setQuantity(1);
    }
  }, [matchingCartQty]);

  // Check if stock maintenance is enabled (default to true if undefined)
  const isStockMaintain = shopDetails?.isStockMaintain !== false;
  // Check stock status - only if stock maintenance is enabled
  const isStockOut = isStockMaintain && product?.quantity === 0;
  const isStockNotAvailable =
    isStockMaintain && (isStockOut || quantity >= (product?.quantity || 0));

  // Calculate pricing
  const currentPrice = price || 0;
  const regularPrice = old_price || price || 0;
  const hasSavePrice = (old_price ?? 0) > (price ?? 0);
  const savePrice = hasSavePrice ? old_price! - price! : 0;

  // Category IDs for related products
  const categoryIds = useMemo(() => categories.map((c) => c.id), [categories]);

  // Handle variant selection
  const handleVariantSelect = useCallback(
    (variantTypeId: number | string, variantState: VariantState) => {
      setSelectedVariants((prev) => ({
        ...prev,
        [variantTypeId]: variantState,
      }));
    },
    []
  );

  // Auto-select variants when product loads
  // Priority: 1. From cart (if product is in cart), 2. First variant of each mandatory type
  useEffect(() => {
    if (!product || !variant_types || variant_types.length === 0 || hasInitializedVariants.current) {
      return;
    }

    // Find the first cart item for this product
    const firstCartItem = cartProducts[0];

    if (firstCartItem?.selectedVariants && Object.keys(firstCartItem.selectedVariants).length > 0) {
      // Restore variants from cart
      hasInitializedVariants.current = true;
      Object.entries(firstCartItem.selectedVariants).forEach(
        ([variantTypeId, variantState]) => {
          const typeId = Number(variantTypeId);
          const variantId = variantState.variant_id;

          // Find the variant in the product's variant types
          const variantType = variant_types.find((vt) => vt.id === typeId);
          if (variantType?.variants) {
            const variant = variantType.variants.find((v) => v.id === variantId);
            if (variant) {
              handleVariantSelect(typeId, {
                variant_type_id: variantState.variant_type_id,
                variant_id: variantId,
                price: variantState.price || 0,
                variant_name: variantState.variant_name || variant.name || "",
                image_url: variant.image_url || undefined,
              });
            }
          }
        }
      );
    } else {
      // Auto-select first variant of each mandatory type (like Basic theme)
      hasInitializedVariants.current = true;
      variant_types.forEach((variantType) => {
        if (variantType.is_mandatory && variantType.variants?.length > 0) {
          const firstVariant = variantType.variants[0];
          handleVariantSelect(variantType.id, {
            variant_type_id: variantType.id,
            variant_id: firstVariant.id,
            price: firstVariant.price || 0,
            variant_name: firstVariant.name || "",
            image_url: firstVariant.image_url || undefined,
          });
        }
      });
    }
  }, [product, cartProducts, variant_types, handleVariantSelect]);

  // Reset initialization flag when handle/product changes
  useEffect(() => {
    hasInitializedVariants.current = false;
  }, [handle]);

  // Handle quantity change
  const handleQuantityChange = useCallback(
    (delta: number) => {
      const newQty = quantity + delta;
      if (newQty >= 1 && newQty <= (product?.quantity || 999)) {
        setQuantity(newQty);
      }
    },
    [quantity, product?.quantity]
  );

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    if (isStockOut || !product) return;

    // For products already in cart (matching selected variants), remove old cart item first
    // Same logic as premium theme
    if (matchingCartItem) {
      removeProduct(matchingCartItem.cartId);
    }

    const productRecord = product as unknown as Record<string, unknown>;
    addProduct({
      ...product,
      id: Number(id),
      image_url: selectedImageUrl || image_url,
      qty: quantity,
      selectedVariants,
      total_inventory_sold: (productRecord.total_inventory_sold as number) ?? 0,
      categories: product.categories ?? [],
      variant_types: product.variant_types ?? [],
      stocks: product.stocks ?? [],
      reviews: (productRecord.reviews as Array<unknown>) ?? [],
    } as Parameters<typeof addProduct>[0]);
  }, [
    isStockOut,
    product,
    id,
    selectedImageUrl,
    image_url,
    quantity,
    selectedVariants,
    matchingCartItem,
    removeProduct,
    addProduct,
  ]);

  // Handle buy now
  const handleBuyNow = useCallback(() => {
    if (isStockOut) return;

    if (!isInCart) {
      handleAddToCart();
    }

    router.push(`${baseUrl}/checkout`);
  }, [isStockOut, isInCart, handleAddToCart, router, baseUrl]);

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
        link.download = `${name}-image-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
      }
    },
    [allowDownload, name]
  );

  // Action button label
  const actionButtonLabel = isInCart ? t("update_cart") : t("add_to_cart");

  // Show loading state - AFTER all hooks
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

  return (
    <SelloraThemeWrapper>
      {/* Image Lightbox */}
      <ImageLightbox
        product={{
          images: allImages.map((img) => getDetailPageImageUrl(img)),
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
          {allImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {allImages.map((img, idx) => (
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
            {isStockOut && (
              <span className="inline-block text-xs sm:text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2.5 sm:px-3 py-1 rounded">
                {t("out_of_stock") || "Out of stock"}
              </span>
            )}
          </div>

          {/* Pricing */}
          <div className="mb-4 sm:mb-5 md:mb-8">
            <ProductPricing
              currentPrice={currentPrice}
              regularPrice={regularPrice}
              hasSavePrice={hasSavePrice}
              savePrice={savePrice}
              showOldPrice={true}
              unitName={product.unit_name}
            />
          </div>

          {/* Product Variants */}
          {variant_types.length > 0 && (
            <div className="mb-6 sm:mb-7 md:mb-8">
              <ProductVariants
                variantTypes={variant_types}
                selectedVariants={selectedVariants}
                onSelectVariant={handleVariantSelect}
                onImageChange={setSelectedImageIndex}
                images={allImages}
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
                  onClick={() => handleQuantityChange(-1)}
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
                    if (val >= 1 && val <= (product.quantity || 999)) {
                      setQuantity(val);
                    }
                  }}
                  className="w-12 text-center bg-transparent outline-none text-foreground font-medium"
                  min={1}
                  max={product.quantity || 999}
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={isStockNotAvailable}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 rounded"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                disabled={isStockNotAvailable}
                onClick={handleAddToCart}
                className="flex-1 min-h-12 sm:min-h-14 p-2 sm:p-2.5 md:p-3 cursor-pointer text-base text-foreground font-medium capitalize rounded-md disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed border-2 border-gray-300 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                {actionButtonLabel}
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              disabled={isStockNotAvailable}
              onClick={handleBuyNow}
              className="w-full min-h-12 sm:min-h-14 p-2 sm:p-2.5 md:p-3 cursor-pointer text-base font-medium capitalize rounded-md disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed bg-foreground text-background hover:bg-foreground/90 transition-colors border-2 border-foreground"
            >
              {t("buy_now") || "Buy Now"}
            </button>

            {/* Stock Warning */}
            {isStockNotAvailable && !isStockOut && (
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
