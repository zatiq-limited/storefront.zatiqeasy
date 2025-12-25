"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Minus, Plus, ZoomIn, Download, Play } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore } from "@/stores/cartStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import {
  cn,
  getInventoryThumbImageUrl,
  getDetailPageImageUrl,
} from "@/lib/utils";
import type { Product, VariantType, Variant } from "@/stores/productsStore";
import type { VariantsState, VariantState } from "@/types/cart.types";
import { CustomerReviews } from "@/components/products/customer-reviews";
import AuroraRelatedProducts from "@/app/_themes/aurora/components/product-details/aurora-related-products";
import { ProductVariants } from "@/components/products/product-variants";

interface ProductDetailsProps {
  product: Product;
}

// Trust Card Icons
const SecureIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="38"
      height="43"
      viewBox="0 0 38 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M34.9304 4.21495L19.5962 0.372115C19.4267 0.341782 19.2531 0.341782 19.0836 0.372115C18.942 0.351103 18.798 0.351103 18.6565 0.372115L3.23684 4.21495C2.25915 4.45493 1.39924 5.02705 0.8091 5.83018C0.218964 6.63331 -0.0633858 7.61573 0.0119631 8.60377L0.90895 20.1743C1.26819 24.7641 2.89929 29.1695 5.62519 32.9122C8.35108 36.655 12.0676 39.592 16.3713 41.4044L18.2507 42.2024C18.4875 42.2994 18.7416 42.3494 18.9982 42.3494C19.2548 42.3494 19.5088 42.2994 19.7457 42.2024L21.6251 41.4044C25.9288 39.592 29.6453 36.655 32.3712 32.9122C35.0971 29.1695 36.7282 24.7641 37.0874 20.1743L37.9844 8.60377C38.0686 7.63808 37.8104 6.67348 37.2538 5.87356C36.6972 5.07364 35.8763 4.48765 34.9304 4.21495ZM27.007 16.5624L18.4643 24.9621C18.2657 25.1589 18.0295 25.3151 17.7693 25.4217C17.509 25.5284 17.2299 25.5832 16.9479 25.5832C16.666 25.5832 16.3868 25.5284 16.1266 25.4217C15.8663 25.3151 15.6301 25.1589 15.4316 24.9621L11.1602 20.7623C10.7581 20.3668 10.5321 19.8305 10.5321 19.2713C10.5321 18.7121 10.7581 18.1758 11.1602 17.7804C11.5624 17.385 12.1078 17.1628 12.6766 17.1628C13.2453 17.1628 13.7907 17.385 14.1929 17.7804L16.9479 20.5103L23.9743 13.5806C24.3765 13.1851 24.9219 12.963 25.4906 12.963C26.0594 12.963 26.6048 13.1851 27.007 13.5806C27.4091 13.976 27.6351 14.5123 27.6351 15.0715C27.6351 15.6307 27.4091 16.167 27.007 16.5624Z"
        fill="#9CA3AF"
      />
    </svg>
  );
};

const Satisfaction = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="43"
      height="43"
      viewBox="0 0 43 43"
      fill="none"
    >
      <path
        d="M21.9108 13.618L21.9543 13.7115C22.046 13.9095 22.2308 14.0485 22.4448 14.0813L22.7053 14.1213C23.3905 14.2266 23.6713 15.0614 23.1891 15.5594L22.9457 15.8108C22.8019 15.9596 22.7362 16.1688 22.7694 16.374L22.809 16.6182C22.9232 17.323 22.1735 17.8484 21.5499 17.5006L21.4508 17.4453C21.3526 17.3909 21.2446 17.3633 21.136 17.3633C21.0273 17.3633 20.9194 17.3909 20.8211 17.4453L20.722 17.5006C20.0985 17.8484 19.3487 17.323 19.463 16.6182L19.5026 16.374C19.5357 16.1688 19.4707 15.9603 19.3263 15.8108L19.0825 15.559C18.6004 15.0611 18.881 14.2265 19.5661 14.121L19.8285 14.0806C20.0425 14.0485 20.2266 13.9095 20.3189 13.7115L20.3625 13.618C20.6689 12.9601 21.6044 12.9601 21.9108 13.618Z"
        fill="#9CA3AF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.3601 4.00302H40.0302C41.5054 4.00302 42.6989 5.19659 42.6989 6.67171V12.0091C42.6989 16.0621 39.4131 19.348 35.3601 19.348H35.296C34.6862 25.7928 29.7044 30.9541 23.351 31.8654V37.3616H28.0212C29.4963 37.3616 30.6899 38.5551 30.6899 40.0302V42.0318C30.6899 42.4007 30.3916 42.6989 30.0227 42.6989H12.6762C12.3073 42.6989 12.0091 42.4007 12.0091 42.0318V40.0302C12.0091 38.5551 13.2026 37.3616 14.6778 37.3616H19.348V31.8654C12.9945 30.9541 8.01272 25.7928 7.40293 19.348H7.33888C3.28582 19.348 0 16.0621 0 12.0091V6.67171C0 5.19659 1.19357 4.00302 2.66868 4.00302H7.33888V2.66868C7.33888 1.19357 8.53245 0 10.0076 0H32.6914C34.1665 0 35.3601 1.19357 35.3601 2.66868V4.00302ZM4.00302 8.00605V12.0091C4.00302 13.8518 5.49615 15.3449 7.33888 15.3449V8.00605H4.00302ZM24.3958 16.1956L26.4947 14.0426C26.6695 13.8631 26.7302 13.6016 26.6508 13.3641C26.5714 13.1266 26.3659 12.9545 26.1191 12.9164L23.2442 12.4774L21.9526 9.72668C21.8425 9.49251 21.607 9.34306 21.3488 9.34306C21.0906 9.34306 20.8551 9.49184 20.745 9.72668L19.4534 12.4774L16.5785 12.9164C16.3317 12.9545 16.1269 13.1266 16.0468 13.3641C15.9667 13.6016 16.0268 13.8625 16.2016 14.0419L18.3005 16.1949L17.8035 19.2399C17.7621 19.4921 17.8688 19.7456 18.0777 19.893C18.2865 20.0405 18.5614 20.0558 18.7855 19.9317L21.3481 18.5153L23.9107 19.9317C24.0115 19.9878 24.1229 20.0151 24.2336 20.0151C24.3684 20.0151 24.5038 19.9738 24.6186 19.8937C24.8268 19.7463 24.9342 19.4927 24.8928 19.2405L24.3958 16.1956ZM35.3601 15.3449C37.2028 15.3449 38.6959 13.8518 38.6959 12.0091V8.00605H35.3601V15.3449Z"
        fill="#9CA3AF"
      />
    </svg>
  );
};

const PrivacyIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="34"
      height="43"
      viewBox="0 0 34 43"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.29873 10.9376C7.29873 5.11407 11.9394 0.349365 17.6112 0.349365C23.2831 0.349365 27.9237 5.11407 27.9237 10.9376V15.1729H29.5737C31.8425 15.1729 33.6987 17.0543 33.6987 19.3539V38.1684C33.6987 40.4679 31.8425 42.3494 29.5737 42.3494H4.82373C2.55498 42.3494 0.69873 40.4679 0.69873 38.1684V19.3539C0.69873 17.0543 2.55498 15.1729 4.82373 15.1729H7.29873V10.9376ZM11.4237 15.1729H23.7987V10.9376C23.7987 7.44348 21.0144 4.58466 17.6112 4.58466C14.2081 4.58466 11.4237 7.44348 11.4237 10.9376V15.1729ZM11.4237 27.9376C11.4237 29.5757 12.0756 31.1467 13.236 32.305C14.3964 33.4633 15.9702 34.1141 17.6112 34.1141C19.2523 34.1141 20.8261 33.4633 21.9865 32.305C23.1468 31.1467 23.7987 29.5757 23.7987 27.9376C23.7987 26.2995 23.1468 24.7285 21.9865 23.5702C20.8261 22.4119 19.2523 21.7611 17.6112 21.7611C15.9702 21.7611 14.3964 22.4119 13.236 23.5702C12.0756 24.7285 11.4237 26.2995 11.4237 27.9376Z"
        fill="#9CA3AF"
      />
    </svg>
  );
};

// Extract video ID from YouTube URL
const extractVideoId = (url: string): string => {
  if (!url) return "";
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
  );
  return match ? match[1] : "";
};

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const { addProduct, getProductsByInventoryId } = useCartStore();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<
      number,
      { id: number; name: string; price?: number; image_url?: string | null }
    >
  >({});
  const [isShowVideo, setIsShowVideo] = useState(false);
  const [openLightbox, setOpenLightbox] = useState(false);

  const {
    id,
    name,
    price,
    old_price,
    images = [],
    image_url,
    short_description,
    description,
    variant_types = [],
    custom_fields,
    warranty,
    video_link,
  } = product;

  const countryCurrency = shopDetails?.country_currency || "BDT";
  const baseUrl = shopDetails?.baseUrl || "";
  const allowDownload =
    shopDetails?.metadata?.settings?.shop_settings
      ?.enable_product_image_download ?? false;
  const showProductSoldCount = shopDetails?.show_product_sold_count ?? false;

  const productRecord = product as unknown as Record<string, unknown>;
  const totalInventorySold =
    (productRecord.total_inventory_sold as number) ?? 0;
  const initialProductSold =
    (productRecord.initial_product_sold as number) ?? 0;

  // All product images
  const allImages = useMemo(() => {
    const imgs = [...(images || [])];
    if (image_url && !imgs.includes(image_url)) {
      imgs.unshift(image_url);
    }
    return imgs.filter(Boolean);
  }, [images, image_url]);

  // Get selected image URL
  const selectedImageUrl = useMemo(() => {
    return allImages[selectedImageIdx] || image_url || "";
  }, [allImages, selectedImageIdx, image_url]);

  // Auto-select first variant of each type on initial load
  useEffect(() => {
    if (variant_types && variant_types.length > 0) {
      const initialVariants: Record<
        number,
        { id: number; name: string; price?: number; image_url?: string | null }
      > = {};

      variant_types.forEach((variantType) => {
        if (variantType.variants && variantType.variants.length > 0) {
          // Select the first variant of each type
          const firstVariant = variantType.variants[0];
          initialVariants[variantType.id] = {
            id: firstVariant.id,
            name: firstVariant.name,
            price: firstVariant.price,
            image_url: firstVariant.image_url,
          };
        }
      });

      setSelectedVariants(initialVariants);
    }
  }, [variant_types]);

  // Check if product is in cart
  const cartProducts = getProductsByInventoryId(Number(id));
  const isInCart = cartProducts.length > 0;

  // Check stock status
  const isStockOut = (product.quantity ?? 0) <= 0;
  const isStockNotAvailable = isStockOut;

  // Calculate pricing
  const hasDiscount = (old_price ?? 0) > (price ?? 0);
  const savePrice = hasDiscount ? old_price! - price! : 0;
  const currentPrice = price ?? 0;
  const regularPrice = old_price ?? 0;

  // Handle variant selection
  const handleVariantSelect = (
    variantTypeId: number,
    variant: {
      id: number;
      name: string;
      price?: number;
      image_url?: string | null;
    },
    canToggle: boolean
  ) => {
    setSelectedVariants((prev) => {
      const isSelected = prev[variantTypeId]?.id === variant.id;
      if (canToggle && isSelected) {
        // Remove variant if already selected and can toggle
        const newVariants = { ...prev };
        delete newVariants[variantTypeId];
        return newVariants;
      }
      // Add or update variant
      return {
        ...prev,
        [variantTypeId]: variant,
      };
    });
  };

  // Handle image update from variant selection
  const handleImageUpdate = (imageUrl: string) => {
    const indx = allImages.findIndex((img) => img === imageUrl);
    if (indx !== -1) {
      setSelectedImageIdx(indx);
      setIsShowVideo(false);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (product.quantity && newQuantity > product.quantity) return;
    setQuantity(newQuantity);
  };

  const sumQty = () => {
    handleQuantityChange(quantity + 1);
  };

  const subQty = () => {
    handleQuantityChange(quantity - 1);
  };

  const disableSub = quantity <= 1;
  const disableSum =
    product.quantity !== undefined && quantity >= product.quantity;

  // Handle download
  const handleDownload = async (imageUrl: string, index: number) => {
    if (!allowDownload) return;
    try {
      const proxyUrl = `/api/download-image?url=${encodeURIComponent(
        imageUrl
      )}`;
      const response = await fetch(proxyUrl);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
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
      alert("Failed to download image. Please try again.");
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (isStockOut) return;

    // Transform selectedVariants to match VariantState structure
    const transformedVariants: Record<number, VariantState> = {};
    Object.entries(selectedVariants).forEach(([key, variant]) => {
      transformedVariants[Number(key)] = {
        variant_type_id: Number(key),
        variant_id: variant.id,
        price: variant.price ?? 0,
        variant_name: variant.name,
        variant_type_name:
          variant_types?.find((vt) => vt.id === Number(key))?.title || "",
        image_url: variant.image_url ?? undefined,
      };
    });

    addProduct({
      ...product,
      id: Number(id),
      image_url: selectedImageUrl || allImages[0] || image_url,
      qty: quantity,
      selectedVariants: transformedVariants,
      total_inventory_sold: totalInventorySold,
      categories: product.categories ?? [],
      variant_types: product.variant_types ?? [],
      stocks: product.stocks ?? [],
      reviews: (productRecord.reviews as Array<unknown>) ?? [],
    } as Parameters<typeof addProduct>[0]);
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (isStockOut) return;

    if (!isInCart) {
      handleAddToCart();
    }

    router.push(`${baseUrl}/checkout`);
  };

  const actionButtonLabel = isInCart ? t("update_cart") : t("add_to_cart");

  return (
    <>
      <div className="flex items-start xl:flex-row flex-col gap-6.5 pt-6 pb-12 md:pb-21">
        {/* Vertical Thumbnail Sidebar (Desktop only) */}
        <div className="overflow-auto xl:w-[10%] xl:h-[calc(100vh-120px)] xl:flex hidden xl:pl-1">
          {allImages && allImages.length > 0 && (
            <ul className="flex flex-col gap-2 mt-2 w-full pb-1">
              {video_link && (
                <div
                  className={cn(
                    "relative w-22.5 h-29 p-1 ring-[1px] ring-transparent bg-[#E4E4E7] dark:bg-transparent cursor-pointer",
                    {
                      "ring-blue-zatiq": isShowVideo,
                    }
                  )}
                  onClick={() => setIsShowVideo(true)}
                >
                  <FallbackImage
                    src={`https://img.youtube.com/vi/${extractVideoId(
                      video_link
                    )}/0.jpg`}
                    alt="Video thumbnail"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                  <Play
                    size={20}
                    className="absolute top-1/2 left-1/2 text-white translate-x-[-50%] translate-y-[-50%]"
                  />
                </div>
              )}
              {allImages.map((img, key) => (
                <li
                  role="button"
                  onClick={() => {
                    setIsShowVideo(false);
                    setSelectedImageIdx(key);
                  }}
                  key={key}
                  className={cn(
                    "w-22.5 h-29 p-1 ring-[1px] ring-transparent bg-[#E4E4E7] dark:bg-transparent cursor-pointer",
                    {
                      "ring-blue-zatiq":
                        key === selectedImageIdx && !isShowVideo,
                    }
                  )}
                >
                  <FallbackImage
                    alt={`${name}_img_${key}`}
                    src={getInventoryThumbImageUrl(img)}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main Content Area */}
        <div className="xl:w-[90%] w-full pt-1">
          <div className="w-full flex xl:flex-row flex-col items-start gap-5 xl:gap-7.5 h-full rounded-xl">
            {/* Left Side: Image Gallery (639px on desktop) */}
            <div className="w-full xl:w-160">
              <div className="relative">
                {/* Main Image or Video */}
                {isShowVideo && video_link ? (
                  <div className="w-full h-full bg-black z-50 flex items-center justify-center border">
                    <iframe
                      width="1280"
                      height="720"
                      src={`https://www.youtube.com/embed/${extractVideoId(
                        video_link
                      )}?rel=0&autoplay=1`}
                      title={name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="w-full max-h-75 md:max-h-125 object-contain transition ease-in duration-500"
                    />
                  </div>
                ) : (
                  selectedImageUrl && (
                    <FallbackImage
                      src={getDetailPageImageUrl(selectedImageUrl)}
                      width={512}
                      height={512}
                      className="w-full max-h-225 object-contain transition ease-in duration-500"
                      alt={name}
                    />
                  )
                )}

                {/* Zoom and Download Buttons */}
                {allImages && !isShowVideo && (
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <button
                      onClick={() => setOpenLightbox(true)}
                      className="bg-blue-zatiq/15 backdrop-blur-sm p-3 rounded-full cursor-pointer hover:bg-blue-zatiq/25 transition-all duration-200 shadow-lg"
                      aria-label="Zoom image"
                      type="button"
                    >
                      <ZoomIn className="text-white dark:text-gray-700 w-5 h-5 md:w-7 md:h-7" />
                    </button>
                    {allowDownload && selectedImageUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDownload(
                            getDetailPageImageUrl(selectedImageUrl),
                            selectedImageIdx
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

                {/* Mobile Horizontal Thumbnails */}
                <div className="xl:hidden flex px-1">
                  {allImages && allImages.length > 0 && (
                    <ul className="flex gap-2 flex-wrap mt-2">
                      {video_link && (
                        <div
                          className={cn(
                            "w-12.5 min-w-12.5 h-12.5 sm:min-w-18.75 sm:h-18.75 sm:w-18.75 relative overflow-hidden ring ring-transparent p-1 cursor-pointer",
                            {
                              "ring-blue-zatiq": isShowVideo,
                            }
                          )}
                          onClick={() => setIsShowVideo(true)}
                        >
                          <FallbackImage
                            src={`https://img.youtube.com/vi/${extractVideoId(
                              video_link
                            )}/0.jpg`}
                            alt="Video thumbnail"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                          <Play
                            size={16}
                            className="absolute top-1/2 left-1/2 text-white translate-x-[-50%] translate-y-[-50%]"
                          />
                        </div>
                      )}
                      {allImages.map((img, key) => (
                        <li
                          role="button"
                          onClick={() => {
                            setIsShowVideo(false);
                            setSelectedImageIdx(key);
                          }}
                          key={key}
                          className={cn(
                            "w-12.5 min-w-12.5 h-12.5 sm:min-w-18.75 sm:h-18.75 sm:w-18.75 relative overflow-hidden ring-3 ring-transparent p-1 cursor-pointer",
                            {
                              "ring-blue-zatiq":
                                key === selectedImageIdx && !isShowVideo,
                            }
                          )}
                        >
                          <FallbackImage
                            alt={`${name}_img_${key}`}
                            src={getInventoryThumbImageUrl(img)}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Custom Fields and Description (Desktop) */}
                <div className="text-sm mt-10 hidden xl:block">
                  {(custom_fields || warranty) && (
                    <div className="bg-blue-zatiq/10 dark:bg-black-18 border border-blue-zatiq/50 dark:border-gray-700 px-5 py-5 text-black-1.2 dark:text-white mb-4">
                      <h4 className="font-medium text-sm text-[#4B5563] dark:text-gray-300">
                        Details:
                      </h4>
                      <ul className="mt-3 tracking-[-0.24px] capitalize">
                        {custom_fields &&
                          Object.keys(custom_fields).map((key, idx) => (
                            <li key={idx} className="grid grid-cols-5 gap-6">
                              <div className="col-span-2 text-[#6B7280] dark:text-gray-100">
                                {key}
                              </div>
                              <div className="col-span-3 text-right text-[#374151] dark:text-gray-100">
                                {custom_fields[key]}
                              </div>
                            </li>
                          ))}
                        {warranty && (
                          <li className="grid grid-cols-5 gap-6">
                            <div className="col-span-2 text-[#6B7280] dark:text-gray-400">
                              Warranty
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
                        className="ql-editor"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Product Info */}
            <div className="flex flex-col flex-1 w-full">
              <div className="grid gap-4.5">
                {/* Product Title */}
                <h1 className="text-[20px] md:text-4xl text-blue-zatiq">
                  {name}
                </h1>

                {/* Out of Stock Warning */}
                {isStockOut && (
                  <span className="-mt-4 text-sm font-medium text-red-500">
                    Out of stock
                  </span>
                )}

                <div className="flex flex-col gap-7.5">
                  {/* Product Pricing */}
                  <div className="flex items-end gap-2">
                    <div className="flex items-start flex-col">
                      <p className="text-[#9CA3AF] dark:text-gray-200 font-medium leading-normal">
                        {t("price")}
                      </p>
                      <div className="flex items-center gap-1 xl:gap-3 leading-normal">
                        <span className="text-[16px] text-[#4B5563] dark:text-gray-200 lg:text-2xl font-bold min-w-fit">
                          {currentPrice.toLocaleString() || "0.00"}{" "}
                          {countryCurrency}
                        </span>
                        {hasDiscount && (
                          <>
                            <span className="text-sm text-[#8E8E8E] dark:text-gray-300 min-w-fit line-through">
                              {regularPrice.toLocaleString()} {countryCurrency}
                            </span>
                            <span className="px-2.5 pb-2 pt-2.25 bg-blue-zatiq rounded-full text-white dark:text-black-18 text-center text-xs md:text-[16px]">
                              Save {savePrice.toLocaleString()}{" "}
                              {countryCurrency}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sold Units */}
                  {showProductSoldCount &&
                    initialProductSold + totalInventorySold > 0 && (
                      <div>
                        <span className="px-4 py-2 pt-2.25 bg-blue-zatiq opacity-80 rounded-full text-white dark:text-black-18 text-center text-[12px] md:text-[16px]">
                          {t("sold_units")}{" "}
                          {initialProductSold + totalInventorySold}
                        </span>
                      </div>
                    )}

                  {/* Already in Cart Message */}
                  <div className="flex flex-col gap-4.5">
                    {isInCart && (
                      <div>
                        <p className="text-sm text-blue-zatiq font-medium">
                          Already in your cart
                        </p>
                      </div>
                    )}

                    {/* Product Variants */}
                    {variant_types && variant_types.length > 0 && (
                      <ProductVariants
                        variantTypes={variant_types}
                        selectedVariants={selectedVariants}
                        onSelectVariant={handleVariantSelect}
                        onImageUpdate={handleImageUpdate}
                        imageVariantTypeId={
                          product.image_variant_type_id ?? undefined
                        }
                      />
                    )}
                  </div>
                </div>

                {/* Trust Card */}
                <div>
                  <div className="w-full mt-7.5 border-y border-gray-300 dark:border-gray-500 py-2 md:py-3 flex flex-wrap justify-center xl:justify-start gap-4 sm:gap-6 md:gap-9">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4.5">
                      <SecureIcon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                      <p className="text-[12px] sm:text-sm text-gray-600 dark:text-gray-300">
                        Secure <br />{" "}
                        <span className="font-medium">Checkout</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4.5">
                      <Satisfaction className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                      <p className="text-[12px] sm:text-sm text-gray-600 dark:text-gray-300">
                        Satisfaction <br />{" "}
                        <span className="font-medium">Guaranteed</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4.5">
                      <PrivacyIcon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                      <p className="text-[12px] sm:text-sm text-gray-600 dark:text-gray-300">
                        Privacy <br />{" "}
                        <span className="font-medium">Protected</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity and Action Buttons */}
              <div className="w-full my-6 mt-12">
                <div className="flex flex-col md:flex-row md:items-center items-start gap-4 w-full pb-2">
                  {/* Cart Quantity Control */}
                  <div className="flex items-center justify-between gap-4 text-blue-zatiq dark:text-white px-3 py-3 md:w-1/2 w-full bg-transparent border-[1.2px] border-blue-zatiq">
                    <button
                      type="button"
                      className="cursor-pointer disabled:opacity-50"
                      onClick={subQty}
                      disabled={disableSub}
                    >
                      <Minus className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        handleQuantityChange(value);
                      }}
                      className="font-medium text-sm md:text-base text-center w-12 md:w-16 border-0 focus:outline-none focus:ring-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                      max={product.quantity}
                    />
                    <button
                      type="button"
                      className="cursor-pointer disabled:opacity-50"
                      onClick={sumQty}
                      disabled={disableSum || isStockNotAvailable}
                    >
                      <Plus className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    disabled={isStockNotAvailable}
                    onClick={handleAddToCart}
                    className="md:w-1/2 text-center p-3 text-sm md:text-base font-medium capitalize disabled:bg-black-disabled w-full border-[1.2px] border-blue-zatiq text-blue-zatiq disabled:text-white disabled:border-black-disabled cursor-pointer"
                  >
                    {actionButtonLabel}
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  disabled={isStockNotAvailable}
                  onClick={handleBuyNow}
                  className="p-3 mt-2 text-center text-sm md:text-base font-medium disabled:bg-black-disabled capitalize transition-colors duration-150 w-full bg-blue-zatiq border-[1.2px] border-blue-zatiq text-white dark:text-black-full disabled:text-white disabled:border-black-disabled cursor-pointer"
                >
                  {t("buy_now")}
                </button>

                {isStockNotAvailable && (
                  <p className="text-sm font-medium text-red-500 mt-3">
                    No more items remaining!
                  </p>
                )}
              </div>

              {/* Custom Fields and Description (Mobile) */}
              <div className="w-full text-sm xl:hidden block">
                {(custom_fields || warranty) && (
                  <div className="bg-[#F4F4F5] dark:bg-gray-800 border border-black-4 dark:border-gray-700 px-5 py-5 text-black-1.2 dark:text-white mb-4">
                    <h4 className="font-medium text-sm text-[#4B5563] dark:text-gray-300">
                      Details:
                    </h4>
                    <ul className="mt-3 tracking-[-0.24px] capitalize">
                      {custom_fields &&
                        Object.keys(custom_fields).map((key, idx) => (
                          <li key={idx} className="grid grid-cols-5 gap-6">
                            <div className="col-span-2 text-[#6B7280] dark:text-gray-400">
                              {key}
                            </div>
                            <div className="col-span-3 text-right text-[#374151] dark:text-gray-100">
                              {custom_fields[key]}
                            </div>
                          </li>
                        ))}
                      {warranty && (
                        <li className="grid grid-cols-5 gap-6">
                          <div className="col-span-2 text-[#6B7280] dark:text-gray-400">
                            Warranty
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
                      className="ql-editor"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <CustomerReviews reviews={product.reviews} />
      )}

      {/* Related Products */}
      <AuroraRelatedProducts ignoreProductId={id} currentProduct={product} />
    </>
  );
}

export default ProductDetails;
