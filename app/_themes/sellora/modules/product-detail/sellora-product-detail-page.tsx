"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Minus, Plus, ZoomIn, Download, Play } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/stores/cartStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { ImageLightbox } from "@/components/products/image-lightbox";
import { cn, titleCase, getDetailPageImageUrl } from "@/lib/utils";
import {
  ProductPricing,
  ProductVariants,
  DescriptionDetails,
  CustomerReviews,
  RelatedProducts,
} from "./sections";
import type { Product } from "@/stores/productsStore";
import type { VariantsState, VariantState } from "@/types/cart.types";

interface SelloraProductDetailPageProps {
  product: Product;
}

// Extract YouTube video ID from URL
function extractVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : null;
}

export function SelloraProductDetailPage({ product }: SelloraProductDetailPageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const { addProduct, getProductsByInventoryId } = useCartStore();
  const totalCartItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<VariantsState>({});

  const {
    id,
    name,
    price = 0,
    old_price,
    images = [],
    image_url,
    description,
    variant_types = [],
    custom_fields,
    warranty,
    video_link,
    reviews,
    categories = [],
    image_variant_type_id,
  } = product;

  const baseUrl = shopDetails?.baseUrl || "";
  const hasItems = totalCartItems > 0;

  // Check if download is allowed
  const allowDownload = Boolean(
    (shopDetails?.metadata?.settings?.shop_settings as { enable_product_image_download?: boolean } | undefined)?.enable_product_image_download
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

  // Check if product is in cart
  const cartProducts = getProductsByInventoryId(Number(id));
  const isInCart = cartProducts.length > 0;
  const cartQty = cartProducts.reduce((acc, p) => acc + (p.qty || 0), 0);

  // Check stock status
  const isStockOut = product.quantity === 0;
  const isStockNotAvailable = isStockOut || quantity >= (product.quantity || 0);

  // Calculate pricing
  const currentPrice = price || 0;
  const regularPrice = old_price || price || 0;
  const hasSavePrice = (old_price ?? 0) > (price ?? 0);
  const savePrice = hasSavePrice ? (old_price! - price!) : 0;

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

  // Handle quantity change
  const handleQuantityChange = useCallback(
    (delta: number) => {
      const newQty = quantity + delta;
      if (newQty >= 1 && newQty <= (product.quantity || 999)) {
        setQuantity(newQty);
      }
    },
    [quantity, product.quantity]
  );

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    if (isStockOut) return;

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
  const handleDownloadImage = useCallback(async (imageUrl: string, index: number) => {
    if (!allowDownload || !imageUrl) return;

    try {
      const proxyUrl = `/api/download-image?url=${encodeURIComponent(imageUrl)}`;
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
  }, [allowDownload, name]);

  // Action button label
  const actionButtonLabel = isInCart ? t("update_cart") : t("add_to_cart");

  return (
    <>
      {/* Image Lightbox */}
      <ImageLightbox
        product={{ images: allImages.map((img) => getDetailPageImageUrl(img)), name: name || "" }}
        open={lightboxOpen}
        setOpen={setLightboxOpen}
        selectedImageIdx={selectedImageIndex}
      />

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 px-3 sm:px-4 xl:px-0 pt-10 sm:pt-20 lg:items-start">
        {/* Left Side - Images Grid */}
        <div className="lg:col-span-3 py-6 sm:py-8 lg:py-10">
          {allImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "relative w-full aspect-[3/4] bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer group transition-all duration-200",
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

                  {/* Zoom icon on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 dark:bg-gray-800/90 p-2.5 rounded-full">
                        <ZoomIn className="w-5 h-5 text-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Download button */}
                  {allowDownload && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDownloadImage(img, idx);
                      }}
                      className="cursor-pointer absolute bottom-2 right-2 bg-white/90 dark:bg-gray-800/90 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white dark:hover:bg-gray-700"
                      aria-label="Download image"
                      type="button"
                    >
                      <Download className="w-5 h-5 text-foreground" />
                    </button>
                  )}

                  {/* Selected indicator */}
                  {selectedImageIndex === idx && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1.5 shadow-lg">
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Product Info (Sticky) */}
        <div className="lg:col-span-2 px-0 lg:px-8 xl:px-12 flex flex-col lg:sticky lg:top-20 lg:self-start">
          {/* Category Name */}
          {categories[0]?.name && (
            <p className="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400 mb-1.5 sm:mb-2">
              {categories[0].name}
            </p>
          )}

          {/* Product Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-3">
            {titleCase(name)}
          </h1>

          {/* Stock Out Badge */}
          {isStockOut && (
            <span className="inline-block text-xs sm:text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2.5 sm:px-3 py-1 rounded mb-3">
              {t("out_of_stock") || "Out of stock"}
            </span>
          )}

          {/* Pricing */}
          <div className="mb-5 sm:mb-6">
            <ProductPricing
              currentPrice={currentPrice}
              regularPrice={regularPrice}
              hasSavePrice={hasSavePrice}
              savePrice={savePrice}
              showOldPrice={true}
              unitName={product.unit_name}
            />
          </div>

          {/* Already in Cart Notice */}
          {cartQty > 0 && (
            <div className="mb-4 p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">
                ✓ {t("already_in_cart") || "Already in cart"} ({cartQty})
              </p>
            </div>
          )}

          {/* Product Variants */}
          {variant_types.length > 0 && (
            <div className="mb-6 sm:mb-7">
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
          <div className="mb-4 sm:mb-5">
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
            <DescriptionDetails
              description={description}
              customFields={custom_fields as Record<string, string>}
              warranty={warranty}
            />
          </div>
        </div>
      </div>

      {/* Product Video Section */}
      {video_link && videoId && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 xl:px-0 py-8 sm:py-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6">
            {t("product_video") || "Product Video"}
          </h2>
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              title={name || "Product video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0"
            />
          </div>
        </div>
      )}

      {/* Customer Reviews */}
      {reviews && reviews.length > 0 && (
        <div className="py-6 sm:py-8 lg:py-10 px-3 sm:px-4 xl:px-0">
          <CustomerReviews reviews={reviews as { name?: string; description?: string; images?: string[]; rating?: number; created_at?: string }[]} />
        </div>
      )}

      {/* Related Products */}
      <RelatedProducts
        currentProductId={id}
        categoryIds={categoryIds}
      />

      {/* Floating Cart Button */}
      <CartFloatingBtn
        showCartFloatingBtn={hasItems}
        totalProducts={totalCartItems}
        totalPrice={totalPrice}
        onClick={() => router.push(`${baseUrl}/checkout`)}
        theme="Sellora"
      />
    </>
  );
}

export default SelloraProductDetailPage;
