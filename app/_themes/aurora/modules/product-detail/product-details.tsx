"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Minus, Plus, Share2, Heart } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore } from "@/stores/cartStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { cn, getInventoryThumbImageUrl } from "@/lib/utils";
import type { Product, VariantType, Variant } from "@/stores/productsStore";
import type { VariantsState, VariantState } from "@/types/cart.types";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const { addProduct, getProductsByInventoryId } = useCartStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<VariantsState>({});

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
  } = product;

  const countryCurrency = shopDetails?.country_currency || "BDT";
  const baseUrl = shopDetails?.baseUrl || "";

  // All product images
  const allImages = useMemo(() => {
    const imgs = [...(images || [])];
    if (image_url && !imgs.includes(image_url)) {
      imgs.unshift(image_url);
    }
    return imgs.filter(Boolean);
  }, [images, image_url]);

  // Check if product is in cart
  const cartProducts = getProductsByInventoryId(Number(id));
  const isInCart = cartProducts.length > 0;

  // Check stock status
  const isStockOut = product.quantity === 0;

  // Calculate discount
  const hasDiscount = (old_price ?? 0) > (price ?? 0);
  const discountPercentage = hasDiscount
    ? Math.round(((old_price! - price!) / old_price!) * 100)
    : 0;

  // Handle variant selection
  const handleVariantSelect = (variantType: VariantType, variant: Variant) => {
    const variantState: VariantState = {
      variant_type_id: variantType.id,
      variant_id: variant.id,
      price: variant.price,
      variant_name: variant.name,
      variant_type_name: variantType.title,
      image_url: variant.image_url ?? undefined,
    };
    setSelectedVariants((prev) => ({
      ...prev,
      [variantType.id || variantType.title]: variantState,
    }));
  };

  // Handle quantity change
  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= (product.quantity || 999)) {
      setQuantity(newQty);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (isStockOut) return;

    const productRecord = product as unknown as Record<string, unknown>;
    addProduct({
      ...product,
      id: Number(id),
      image_url: allImages[0] || image_url,
      qty: quantity,
      selectedVariants,
      total_inventory_sold: (productRecord.total_inventory_sold as number) ?? 0,
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
      const productRecord = product as unknown as Record<string, unknown>;
      addProduct({
        ...product,
        id: Number(id),
        image_url: allImages[0] || image_url,
        qty: quantity,
        selectedVariants,
        total_inventory_sold: (productRecord.total_inventory_sold as number) ?? 0,
        categories: product.categories ?? [],
        variant_types: product.variant_types ?? [],
        stocks: product.stocks ?? [],
        reviews: (productRecord.reviews as Array<unknown>) ?? [],
      } as Parameters<typeof addProduct>[0]);
    }

    router.push(`${baseUrl}/checkout`);
  };

  return (
    <div className="aurora-product-details py-6 md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <FallbackImage
                src={getInventoryThumbImageUrl(allImages[selectedImage] || "")}
                alt={name || "Product"}
                fill
                className="object-cover"
                priority
              />

              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-blue-zatiq text-white text-sm font-medium rounded-full">
                    -{discountPercentage}%
                  </span>
                </div>
              )}

              {/* Out of Stock */}
              {isStockOut && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                      selectedImage === index
                        ? "border-blue-zatiq"
                        : "border-transparent hover:border-gray-300"
                    )}
                  >
                    <FallbackImage
                      src={getInventoryThumbImageUrl(img)}
                      alt={`${name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-blue-zatiq">
                {countryCurrency} {price?.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-500 line-through">
                  {countryCurrency} {old_price?.toLocaleString()}
                </span>
              )}
            </div>

            {/* Short Description */}
            {short_description && (
              <p className="text-gray-600 dark:text-gray-400">{short_description}</p>
            )}

            {/* Variants */}
            {variant_types && variant_types.length > 0 && (
              <div className="space-y-4">
                {variant_types.map((variantType) => (
                  <div key={variantType.id || variantType.title}>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {variantType.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {variantType.variants?.map((variant) => {
                        const isSelected =
                          selectedVariants[variantType.id || variantType.title]?.variant_id ===
                          variant.id;
                        return (
                          <button
                            key={variant.id}
                            onClick={() => handleVariantSelect(variantType, variant)}
                            className={cn(
                              "px-4 py-2 rounded-lg border transition-all",
                              isSelected
                                ? "border-blue-zatiq bg-blue-zatiq/10 text-blue-zatiq"
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
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t("quantity")}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[50px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isStockOut}
                className="flex-1 py-3 px-6 border-2 border-blue-zatiq text-blue-zatiq rounded-lg font-semibold hover:bg-blue-zatiq/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isStockOut ? t("out_of_stock") : t("add_to_cart")}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isStockOut}
                className="flex-1 py-3 px-6 bg-blue-zatiq text-white rounded-lg font-semibold hover:bg-blue-zatiq/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("buy_now")}
              </button>
            </div>

            {/* Share & Wishlist */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-zatiq">
                <Share2 size={20} />
                <span>{t("share")}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500">
                <Heart size={20} />
                <span>{t("wishlist")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        {description && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("description")}
            </h2>
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
