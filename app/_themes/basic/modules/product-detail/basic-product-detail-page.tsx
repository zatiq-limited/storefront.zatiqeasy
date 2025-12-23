"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ZoomIn, Download, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductPricing } from "@/components/products/product-pricing";
import { ProductDescription } from "@/components/products/product-description";
import { ProductVariants } from "@/components/products/product-variants";
import { ImageLightbox } from "@/components/products/image-lightbox";
import { AnimateChangeInHeight } from "@/components/ui/animate-change-height";
import { RelatedProducts } from "@/components/products/related-products";
import { CustomerReviews } from "@/components/products/customer-reviews";
import { useProductDetails, useCartTotals } from "@/hooks";
import { useCartStore } from "@/stores/cartStore";
import { useShopStore } from "@/stores/shopStore";
import { CartFloatingBtn } from "@/features/cart/cart-floating-btn";
import { InventorySearch } from "@/app/_themes/basic/modules/home/sections/inventory-search";
import CartQtyControl from "@/components/features/cart/shared/cart-qty-control";

// Dynamic import for SidebarCategory (same as basic-home-page)
const SidebarCategory = dynamic(
  () => import("@/features/category/sidebar-category"),
  { ssr: false }
);

interface BasicProductDetailPageProps {
  handle: string;
}

// Extract YouTube video ID from URL
const extractVideoId = (url: string) => {
  if (!url) return null;
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

// Title case helper
const titleCase = (str: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const BasicProductDetailPage = ({
  handle,
}: BasicProductDetailPageProps) => {
  const router = useRouter();
  const { shopDetails } = useShopStore();
  const { addProduct, updateQuantity } = useCartStore();
  const { totalPrice, totalProducts, hasItems } = useCartTotals();

  const baseUrl = shopDetails?.baseUrl || "";

  const {
    product,
    productQuery,
    error,
    selectedVariants,
    quantity,
    selectVariant,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    isInStock,
    stockQuantity,
  } = useProductDetails(handle);

  const [open, setOpen] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isShowVideo, setIsShowVideo] = useState(false);

  const currency = shopDetails?.country_currency || "BDT";
  const allowDownload = false; // Feature not yet implemented

  // Selected image URL
  const selectedImageUrl = useMemo(() => {
    if (product?.images && product.images.length !== 0) {
      return product.images[selectedImageIdx] || product.image_url || "";
    }
    return product?.image_url || "";
  }, [product, selectedImageIdx]);

  // Product pricing
  const productPricing = useMemo(() => {
    const basePrice = product?.price || 0;
    const oldPrice = product?.old_price || 0;
    const variantPrice =
      Object.values(selectedVariants).reduce(
        (sum, v) => sum + (v.price || 0),
        0
      ) || 0;

    const currentPrice = basePrice + variantPrice;
    const regularPrice = oldPrice ? oldPrice + variantPrice : currentPrice;
    const savePrice = regularPrice - currentPrice;
    const hasSavePrice = savePrice > 0 && oldPrice > 0;

    return {
      currentPrice,
      regularPrice,
      savePrice,
      hasSavePrice,
    };
  }, [product, selectedVariants]);

  // Stock status
  // stockQuantity is already from hook
  // isInStock is already from hook
  const isStockOut = !isInStock;
  const isStockNotAvailable = !isInStock || quantity >= stockQuantity;

  // Check if product with same variant combination is already in cart
  const cartProducts = useCartStore((state) => state.products);
  const cartItems = useMemo(() => Object.values(cartProducts), [cartProducts]);
  const productInCart = useMemo(() => {
    if (!product?.id) return null;

    // Find cart item with matching product ID and variant combination
    return cartItems.find((item) => {
      if (item.id !== product.id) return false;

      // If no variants selected, just match by product ID
      if (!selectedVariants || Object.keys(selectedVariants).length === 0) {
        return (
          !item.selectedVariants ||
          Object.keys(item.selectedVariants).length === 0
        );
      }

      // Compare variant combinations
      const selectedIds = Object.keys(selectedVariants).sort().join("-");
      const cartIds = item.selectedVariants
        ? Object.keys(item.selectedVariants).sort().join("-")
        : "";

      return (
        selectedIds === cartIds &&
        Object.keys(selectedVariants).every(
          (key) =>
            selectedVariants[Number(key)]?.id ===
            item.selectedVariants?.[Number(key)]?.variant_id
        )
      );
    });
  }, [cartItems, product?.id, selectedVariants]);

  // Add to cart action
  const handleAddToCart = useCallback(() => {
    if (!product || !isInStock) return;

    // Check if all mandatory variants are selected
    if (product.variant_types && product.variant_types.length > 0) {
      const mandatoryVariants = product.variant_types.filter(
        (vt) => vt.is_mandatory
      );
      const allMandatorySelected = mandatoryVariants.every(
        (vt) => selectedVariants[vt.id]
      );

      if (!allMandatorySelected) {
        alert("Please select all required variants");
        return;
      }
    }

    // Check if this exact variant combination already exists in cart
    if (productInCart?.cartId) {
      // Update existing cart item quantity
      updateQuantity(productInCart.cartId, productInCart.qty + quantity);
    } else {
      // Transform selectedVariants to match VariantState structure
      const transformedVariants: Record<
        number,
        {
          variant_type_id: number;
          variant_id: number;
          price: number;
          variant_name: string;
          image_url?: string | null;
        }
      > = {};
      Object.entries(selectedVariants).forEach(([key, variant]) => {
        transformedVariants[Number(key)] = {
          variant_type_id: Number(key),
          variant_id: variant.id,
          price: variant.price,
          variant_name: variant.name,
          image_url: variant.image_url,
        };
      });

      // Add new product to cart
      addProduct({
        ...product,
        qty: quantity,
        selectedVariants: transformedVariants,
        image_url: selectedImageUrl,
      } as unknown as Parameters<typeof addProduct>[0]);
    }
  }, [
    product,
    quantity,
    selectedVariants,
    selectedImageUrl,
    addProduct,
    isInStock,
    productInCart,
    updateQuantity,
  ]);

  // Buy Now action
  const handleBuyNow = useCallback(() => {
    if (!product || !isInStock) return;

    // Check if all mandatory variants are selected
    if (product.variant_types && product.variant_types.length > 0) {
      const mandatoryVariants = product.variant_types.filter(
        (vt) => vt.is_mandatory
      );
      const allMandatorySelected = mandatoryVariants.every(
        (vt) => selectedVariants[vt.id]
      );

      if (!allMandatorySelected) {
        alert("Please select all required variants");
        return;
      }
    }

    // Check if this exact variant combination already exists in cart
    if (productInCart?.cartId) {
      // Update existing cart item quantity
      updateQuantity(productInCart.cartId, quantity);
    } else {
      // Transform selectedVariants to match VariantState structure
      const transformedVariants: Record<
        number,
        {
          variant_type_id: number;
          variant_id: number;
          price: number;
          variant_name: string;
          image_url?: string | null;
        }
      > = {};
      Object.entries(selectedVariants).forEach(([key, variant]) => {
        transformedVariants[Number(key)] = {
          variant_type_id: Number(key),
          variant_id: variant.id,
          price: variant.price,
          variant_name: variant.name,
          image_url: variant.image_url,
        };
      });

      // Add new product to cart
      addProduct({
        ...product,
        qty: quantity,
        selectedVariants: transformedVariants,
        image_url: selectedImageUrl,
      } as unknown as Parameters<typeof addProduct>[0]);
    }

    // Navigate to checkout
    router.push(`${baseUrl}/checkout`);
  }, [
    product,
    quantity,
    selectedVariants,
    selectedImageUrl,
    addProduct,
    isInStock,
    productInCart,
    updateQuantity,
    router,
    baseUrl,
  ]);

  // Action button label
  const actionButtonLabel = useMemo(() => {
    if (productInCart) {
      return "Update Cart";
    }
    return "Add to Cart";
  }, [productInCart]);

  // Handle download
  const handleDownload = async (imageUrl: string, index: number) => {
    if (!allowDownload) return;

    try {
      const proxyUrl = `/api/download-image?url=${encodeURIComponent(
        imageUrl
      )}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      alert("Failed to download image. Please try again.");
    }
  };

  // Handle variant selection
  const handleSelectVariant = (
    variantTypeId: number,
    variant: {
      id: number;
      name: string;
      price?: number;
      image_url?: string | null;
    }
  ) => {
    const variantType = product?.variant_types?.find(
      (vt) => vt.id === variantTypeId
    );
    const foundVariant = variantType?.variants.find((v) => v.id === variant.id);
    if (!foundVariant) return;

    selectVariant(variantTypeId, foundVariant);
    setIsShowVideo(false);
  };

  // Handle image update from variant selection
  const handleImageUpdate = (imageUrl: string) => {
    if (product?.images) {
      const index = product.images.findIndex((img) => img === imageUrl);
      if (index !== -1) {
        setSelectedImageIdx(index);
      }
    }
  };

  if (productQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {typeof error === "string"
              ? error
              : error?.message || "Product not found"}
          </p>
          <button
            onClick={() => router.push(baseUrl || "/")}
            className="px-4 py-2 bg-blue-zatiq text-white rounded-lg hover:bg-blue-zatiq/90"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // add an skeleton
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Shop Name Header - Mobile Only */}
      {shopDetails?.image_url && (
        <Link
          href={baseUrl}
          className="text-[28px] font-bold text-black-1.2 dark:text-gray-200 cursor-pointer flex items-center gap-[197.594px] mx-5 mt-6 xl:hidden"
        >
          <h2>{shopDetails.shop_name}</h2>
        </Link>
      )}

      {/* Search Bar - Mobile Only */}
      <div className="md:hidden">
        <InventorySearch className="mt-5" />
      </div>

      {/* Main Layout with Sidebar */}
      <div className="container grid grid-cols-1 xl:grid-cols-5 gap-5 p-5">
        {/* Left Sidebar - Categories */}
        <div className="overflow-hidden -mr-5 xl:overflow-auto xl:mr-0 xl:bg-white dark:xl:bg-black-27 xl:rounded-xl xl:border xl:border-black-4 dark:xl:border-none xl:h-[calc(100vh-120px)] xl:sticky xl:top-25 xl:left-0 xl:self-start col-span-full xl:col-span-1">
          {/* Categories Label - Desktop only */}
          <li className="mx-4 mt-4 mb-4 hidden font-medium text-black-2 dark:text-gray-300 xl:block list-none">
            Categoriess
          </li>

          {/* Desktop Sidebar */}
          <div className="hidden xl:block">
            <SidebarCategory isBasic />
          </div>
        </div>

        {/* Main Content - Product Details */}
        <div className="col-span-1 xl:col-span-4">
          <div className="block sm:p-5 max-w-full sm:bg-white sm:dark:bg-black-27 h-full rounded-xl sm:border sm:border-black-4 sm:dark:border-gray-600">
            <ImageLightbox
              open={open}
              setOpen={setOpen}
              selectedImageIdx={selectedImageIdx}
              product={product}
            />
            <div className="flex flex-col xl:flex-row items-start gap-5">
              {/* Image Gallery */}
              <div className="w-full xl:w-125">
                <div className="relative">
                  {isShowVideo && product?.video_link ? (
                    <div className="w-full h-full bg-black z-50 flex items-center justify-center border">
                      {product?.video_link && (
                        <iframe
                          width="1280"
                          height="720"
                          src={`https://www.youtube.com/embed/${extractVideoId(
                            product?.video_link
                          )}?rel=0&autoplay=1`}
                          title={product?.name}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          className="w-full max-h-75 md:max-h-100 object-contain transition ease-in duration-500"
                        ></iframe>
                      )}
                    </div>
                  ) : (
                    <Image
                      src={selectedImageUrl}
                      width={512}
                      height={512}
                      className="rounded-xl w-full max-h-100 md:max-h-125 object-contain"
                      alt={product?.name}
                    />
                  )}

                  {product?.images && !isShowVideo && (
                    <>
                      <div
                        onClick={() => {
                          setOpen(true);
                        }}
                        className="absolute bg-blue-zatiq/15 p-3 rounded-full top-2 right-2 z-10 cursor-pointer"
                      >
                        <ZoomIn className="text-white dark:text-black-full w-5 h-5 md:w-7 md:h-7" />
                      </div>
                      {allowDownload && selectedImageUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(selectedImageUrl, selectedImageIdx);
                          }}
                          className="absolute bg-blue-zatiq/15 p-3 rounded-full bottom-2 right-2 z-10 cursor-pointer hover:bg-blue-zatiq/25 transition-colors"
                          aria-label="Download image"
                        >
                          <Download className="text-white dark:text-black-full w-5 h-5 md:w-7 md:h-7" />
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 0 && (
                  <ul className="flex gap-2 flex-wrap mt-2">
                    {product?.video_link && (
                      <div
                        className={cn(
                          "w-12.5 min-w-12.5 h-12.5 sm:min-w-18.75 sm:h-18.75 sm:w-18.75 relative rounded-lg overflow-hidden ring ring-transparent cursor-pointer",
                          {
                            "ring-blue-zatiq": isShowVideo,
                          }
                        )}
                        onClick={() => setIsShowVideo(true)}
                      >
                        <Image
                          src={`https://img.youtube.com/vi/${extractVideoId(
                            product?.video_link ?? ""
                          )}/0.jpg`}
                          alt=""
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
                    {product.images.map((img, key) => (
                      <li
                        role="button"
                        onClick={() => {
                          setIsShowVideo(false);
                          setSelectedImageIdx(key);
                        }}
                        key={key}
                        className={cn(
                          "w-12.5 min-w-12.5 h-12.5 sm:min-w-18.75 sm:h-18.75 sm:w-18.75 relative rounded-lg overflow-hidden ring-3 ring-transparent",
                          {
                            "ring-blue-zatiq":
                              key === selectedImageIdx && !isShowVideo,
                          }
                        )}
                      >
                        <Image
                          alt={`${product.name}_img_${key}`}
                          src={img}
                          width={200}
                          height={200}
                          className="w-full rounded-lg object-cover"
                        />
                      </li>
                    ))}
                  </ul>
                )}

                {/* Description - Hidden on XL */}
                <div className="hidden xl:block">
                  <ProductDescription product={product} />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col pt-6 flex-1 w-full">
                <div className="grid gap-6">
                  <h1 className="text-[20px] md:text-2xl font-medium text-black-full dark:text-gray-300">
                    {titleCase(product?.name)}
                  </h1>

                  {isStockOut && (
                    <span className="-mt-4 text-sm font-medium text-red-500">
                      Out of stock
                    </span>
                  )}

                  <div className="flex items-end gap-2">
                    <ProductPricing {...productPricing} currency={currency} />
                  </div>

                  <div>
                    <AnimateChangeInHeight>
                      {!!productInCart && (
                        <p className="text-sm text-blue-zatiq font-medium">
                          Already in your cart
                        </p>
                      )}
                    </AnimateChangeInHeight>
                  </div>

                  {/* Product Variants */}
                  {product.variant_types &&
                    product.variant_types.length > 0 && (
                      <ProductVariants
                        variantTypes={
                          product.variant_types as unknown as Array<{
                            id: number;
                            title: string;
                            variants: Array<{
                              id: number;
                              name: string;
                              price?: number;
                              image_url?: string;
                            }>;
                            is_mandatory: boolean;
                          }>
                        }
                        selectedVariants={selectedVariants}
                        onSelectVariant={handleSelectVariant}
                        onImageUpdate={handleImageUpdate}
                        imageVariantTypeId={
                          product.image_variant_type_id || undefined
                        }
                      />
                    )}
                </div>

                {/* Quantity and Actions */}
                <div className="w-full my-6">
                  <div className="flex flex-col items-start gap-4">
                    <CartQtyControl
                      disableSumBtn={isStockNotAvailable}
                      disableSubBtn={quantity <= 1}
                      qty={quantity}
                      subQty={decrementQuantity}
                      sumQty={incrementQuantity}
                      maxStock={
                        product?.is_stock_manage_by_variant
                          ? stockQuantity
                          : product?.quantity
                      }
                      onQtyChange={(value: number) => {
                        setQuantity(value);
                      }}
                      className="border border-blue-zatiq rounded-lg px-2.5 py-1"
                    />
                    {isStockNotAvailable && (
                      <span className="text-sm font-medium text-red-500">
                        No more items remaining!
                      </span>
                    )}

                    {/* Add/Update Cart Button && Buy Now Button */}
                    <button
                      disabled={isStockNotAvailable}
                      onClick={handleAddToCart}
                      className="flex-1 p-4 bg-white dark:bg-transparent rounded-lg text-sm font-medium disabled:bg-black-disabled transition-colors duration-150 w-full border-2 border-blue-zatiq text-blue-zatiq disabled:text-white disabled:border-black-disabled cursor-pointer"
                    >
                      {actionButtonLabel}
                    </button>
                    <button
                      disabled={isStockNotAvailable}
                      onClick={handleBuyNow}
                      className="flex-1 p-4 bg-blue-zatiq rounded-lg text-sm text-white font-medium disabled:bg-black-disabled transition-colors duration-150 w-full cursor-pointer"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                {/* Description - Visible on XL */}
                <div className="xl:hidden block">
                  <ProductDescription product={product} />
                </div>
              </div>
            </div>

            {/* Customer Reviews Section - Before related products */}
            {(product?.reviews?.length ?? 0) > 0 && (
              <div className="max-w-full h-fit pt-12 pb-3">
                <CustomerReviews reviews={product?.reviews ?? []} />
              </div>
            )}

            {/* Related Products Section - Under product info */}
            {product && (
              <div className="mt-8">
                <RelatedProducts currentProduct={product} baseUrl={baseUrl} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        onClick={() => router.push(`${baseUrl}/checkout`)}
        showCartFloatingBtn={hasItems}
        totalPrice={totalPrice}
        totalProducts={totalProducts}
        theme="Basic"
      />
    </>
  );
};
