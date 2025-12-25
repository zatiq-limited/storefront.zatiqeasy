"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Minus, Plus, Play, Download, ChevronLeft } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/stores/cartStore";
import { useProductsStore } from "@/stores/productsStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import {
  cn,
  getInventoryThumbImageUrl,
  getDetailPageImageUrl,
} from "@/lib/utils";
import { GridContainer } from "../../components/core";
import { PremiumProductCard } from "../../components/cards";
import { ProductPricing, ProductVariants } from "./sections";
import type { Product } from "@/stores/productsStore";
import type { VariantsState, VariantState } from "@/types/cart.types";

interface PremiumProductDetailPageProps {
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

export function PremiumProductDetailPage({
  product,
}: PremiumProductDetailPageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const { addProduct, getProductsByInventoryId, removeProduct } =
    useCartStore();
  const allProducts = useProductsStore((state) => state.products);
  const totalCartItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isShowVideo, setIsShowVideo] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const {
    id,
    name,
    price = 0,
    old_price,
    images = [],
    image_url,
    short_description,
    description,
    variant_types = [],
    custom_fields,
    warranty,
    video_link,
    image_variant_type_id,
  } = product;

  const baseUrl = shopDetails?.baseUrl || "";
  const hasItems = totalCartItems > 0;

  // Don't show video by default - only show if user clicks
  useEffect(() => {
    if (!video_link) {
      setIsShowVideo(false);
    }
  }, [video_link]);

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

  // Compute default variants (select first variant of each mandatory type) - matches old project
  const defaultVariants = useMemo<VariantsState>(() => {
    if (variant_types && variant_types.length > 0) {
      const defaults: VariantsState = {};
      variant_types.forEach((type) => {
        if (type.variants && type.variants.length > 0 && type.is_mandatory) {
          const firstVariant = type.variants[0];
          if (firstVariant?.id !== undefined && firstVariant?.id !== null) {
            defaults[type.id] = {
              variant_type_id: type.id,
              variant_id: firstVariant.id,
              price: firstVariant.price,
              variant_name: firstVariant.name,
              image_url: firstVariant.image_url ?? undefined,
            };
          }
        }
      });
      return defaults;
    }
    return {};
  }, [variant_types]);

  // Check if product is in cart
  const cartProducts = getProductsByInventoryId(Number(id));
  const isInCart = cartProducts.length > 0;
  const cartQty = cartProducts.reduce((acc, p) => acc + (p.qty || 0), 0);
  const firstCartItem = cartProducts[0];

  // Helper to check if two variant selections match (similar to old project's isSameVariantsCombination)
  const isSameVariantsCombination = useCallback(
    (variants1: VariantsState, variants2: VariantsState): boolean => {
      const keys1 = Object.keys(variants1);
      const keys2 = Object.keys(variants2);
      if (keys1.length !== keys2.length) return false;
      return keys1.every((key) => {
        const v1 = variants1[key];
        const v2 = variants2[key];
        return v1?.variant_id === v2?.variant_id;
      });
    },
    []
  );

  // Initialize selected variants - matches old project logic
  // 1. Use lazy initializer to get initial value
  // 2. If first cart item exists with variants, use its selectedVariants
  // 3. Otherwise use defaultVariants (first variant of each mandatory type)
  const [selectedVariants, setSelectedVariants] = useState<VariantsState>(
    () => {
      if (
        firstCartItem &&
        Object.keys(firstCartItem.selectedVariants || {}).length > 0
      ) {
        return firstCartItem.selectedVariants;
      }
      return defaultVariants;
    }
  );

  // Find cart item that matches current selected variants (after selectedVariants is declared)
  const matchingCartItem = useMemo(() => {
    if (cartProducts.length === 0) return null;
    // For non-variant products, return first cart item
    if (!variant_types || variant_types.length === 0) {
      return cartProducts[0];
    }
    // For variant products, find matching selected variants
    return (
      cartProducts.find((item) =>
        isSameVariantsCombination(item.selectedVariants || {}, selectedVariants)
      ) || null
    );
  }, [
    cartProducts,
    selectedVariants,
    variant_types,
    isSameVariantsCombination,
  ]);

  // Sync quantity with matching cart item - matches old project logic
  // Use matchingCartItem?.qty in dependency to detect actual value changes
  const matchingCartQty = matchingCartItem?.qty ?? 0;
  useEffect(() => {
    if (matchingCartQty > 0) {
      setQuantity(matchingCartQty);
    } else {
      setQuantity(1);
    }
  }, [matchingCartQty]);

  // Check stock status
  const isStockOut = product.quantity === 0;
  const isStockNotAvailable = isStockOut || quantity >= (product.quantity || 0);

  // Calculate pricing
  const currentPrice = price || 0;
  const regularPrice = old_price || price || 0;
  const hasSavePrice = (old_price ?? 0) > (price ?? 0);
  const savePrice = hasSavePrice ? old_price! - price! : 0;

  // Related products (same category, excluding current product)
  const relatedProducts = useMemo(() => {
    if (!product.categories || product.categories.length === 0) return [];
    const categoryIds = product.categories.map((c) => c.id);
    return allProducts
      .filter(
        (p) =>
          p.id !== product.id &&
          p.categories?.some((c) => categoryIds.includes(c.id))
      )
      .slice(0, 10);
  }, [allProducts, product]);

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

  // Handle add to cart / update cart
  const handleAddToCart = useCallback(() => {
    if (isStockOut) return;

    // For products already in cart (matching selected variants), remove old cart item first
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
      link.download = `${name}-image-${selectedImageIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }, [allowDownload, selectedImageUrl, name, selectedImageIndex]);

  // Navigate to product detail
  const navigateProductDetails = useCallback(
    (productId: number | string) => {
      router.push(`${baseUrl}/products/${productId}`);
    },
    [router, baseUrl]
  );

  // Action button label
  const actionButtonLabel = isInCart ? t("update_cart") : t("add_to_cart");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
            {allImages.length > 0 && (
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
                {allImages.map((img, key) => (
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
                      <FallbackImage
                        src={getDetailPageImageUrl(selectedImageUrl)}
                        width={512}
                        height={512}
                        priority={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 50vw"
                        className="w-full max-h-225 object-contain transition ease-in duration-500"
                        alt={name || "Product"}
                      />
                    )
                  )}

                  {/* Image Action Buttons */}
                  {allImages.length > 0 &&
                    !isShowVideo &&
                    allowDownload &&
                    selectedImageUrl && (
                      <div className="absolute top-2 right-2 z-10 flex gap-2">
                        <button
                          onClick={handleDownloadImage}
                          className="bg-blue-zatiq/15 backdrop-blur-sm p-3 rounded-full cursor-pointer hover:bg-blue-zatiq/25 transition-all duration-200 shadow-lg"
                          aria-label="Download image"
                          type="button"
                        >
                          <Download className="text-white dark:text-gray-700 w-5 h-5 md:w-7 md:h-7" />
                        </button>
                      </div>
                    )}

                  {/* Mobile Thumbnail Strip */}
                  <div className="xl:hidden flex px-1">
                    {allImages.length > 0 && (
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
                        {allImages.map((img, key) => (
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
                  {isStockOut && (
                    <span className="-mt-4 text-sm font-medium text-red-500">
                      {t("out_of_stock")}
                    </span>
                  )}

                  {/* Pricing */}
                  <div className="flex flex-col gap-7.5">
                    <div className="flex items-end gap-2">
                      <ProductPricing
                        currentPrice={currentPrice}
                        regularPrice={regularPrice}
                        hasSavePrice={hasSavePrice}
                        savePrice={savePrice}
                        showOldPrice={true}
                        unitName={product.unit_name}
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
                      {cartQty > 0 && (
                        <div>
                          <p className="text-sm text-blue-zatiq font-medium">
                            {t("already_in_cart")} ({cartQty})
                          </p>
                        </div>
                      )}

                      {/* Variants */}
                      <ProductVariants
                        variantTypes={variant_types}
                        selectedVariants={selectedVariants}
                        onSelectVariant={handleVariantSelect}
                        onImageChange={setSelectedImageIndex}
                        images={allImages}
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
                        onClick={() => handleQuantityChange(-1)}
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
                          if (val >= 1 && val <= (product.quantity || 999)) {
                            setQuantity(val);
                          }
                        }}
                        className="flex-1 text-center bg-transparent outline-none"
                        min={1}
                        max={product.quantity || 999}
                      />
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={isStockNotAvailable}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      disabled={isStockNotAvailable}
                      onClick={handleAddToCart}
                      className="h-11 sm:h-14 md:w-1/2 text-center text-sm md:text-base font-medium uppercase disabled:bg-black-disabled w-full border-[1.2px] border-blue-zatiq text-blue-zatiq disabled:text-white disabled:border-black-disabled cursor-pointer"
                    >
                      {actionButtonLabel}
                    </button>
                  </div>

                  {/* Buy Now Button */}
                  <button
                    disabled={isStockNotAvailable}
                    onClick={handleBuyNow}
                    className="p-3 h-11 sm:h-14 text-center text-sm md:text-base font-medium disabled:bg-black-disabled uppercase transition-colors duration-150 w-full bg-blue-zatiq border-[1.2px] border-blue-zatiq text-white disabled:text-white disabled:border-black-disabled mt-2 dark:text-black-full cursor-pointer"
                  >
                    {t("buy_now")}
                  </button>

                  {/* Stock Warning */}
                  {isStockNotAvailable && !isStockOut && (
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
        {relatedProducts.length > 0 && (
          <div className="mt-12 md:mt-16">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t("related_products")}
            </h2>
            <GridContainer columns={{ mobile: 2, tablet: 3, desktop: 5 }}>
              {relatedProducts.map((relatedProduct) => (
                <PremiumProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onNavigate={() => navigateProductDetails(relatedProduct.id)}
                />
              ))}
            </GridContainer>
          </div>
        )}
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
