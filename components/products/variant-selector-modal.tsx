"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useShopStore } from "@/stores/shopStore";
import type { VariantsState } from "@/types/cart.types";
import type { Product } from "@/stores/productsStore";
import type {
  Variant as ProductStoreVariant,
  VariantType as ProductStoreVariantType,
} from "@/stores/productsStore";

interface VariantSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart?: () => void;
}

export function VariantSelectorModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
}: VariantSelectorModalProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { addProduct, getProductsByInventoryId, updateQuantity } =
    useCartStore();
  const shopDetails = useShopStore((state) => state.shopDetails);

  const [selectedVariants, setSelectedVariants] = useState<VariantsState>({});
  const [qty, setQty] = useState(1);

  // Get existing cart products for this inventory
  const cartProducts = useMemo(() => {
    if (!product) return [];
    return getProductsByInventoryId(Number(product.id));
  }, [product, getProductsByInventoryId]);

  // Check if product is already in cart with current variant selection
  const existingCartProduct = useMemo(() => {
    return cartProducts.find((cartProduct) => {
      const selectedKeys = Object.keys(selectedVariants);
      const cartKeys = Object.keys(cartProduct.selectedVariants || {});
      if (selectedKeys.length !== cartKeys.length) return false;
      if (selectedKeys.length === 0) return true; // Both have no variants
      return selectedKeys.every(
        (key) =>
          cartProduct.selectedVariants?.[key]?.variant_id ===
          selectedVariants[key]?.variant_id
      );
    });
  }, [cartProducts, selectedVariants]);

  // Reset state when modal opens with new product
  useEffect(() => {
    if (!isOpen || !product) return;

    const initializeState = () => {
      // Set default variants for mandatory variant types
      const defaultVariants: VariantsState = {};
      product.variant_types?.forEach((variantType) => {
        if (variantType.is_mandatory && variantType.variants.length > 0) {
          const firstVariant = variantType.variants[0];
          defaultVariants[variantType.id] = {
            variant_type_id: variantType.id,
            variant_id: firstVariant.id,
            price: firstVariant.price,
            variant_name: firstVariant.name,
            variant_type_name: variantType.title,
            image_url: firstVariant.image_url || undefined,
          };
        }
      });

      // Use the first cart product for this inventory (if any) as the initial state
      // This ensures we start with whatever variant is already in cart
      const firstCartProduct = cartProducts[0];
      if (firstCartProduct) {
        setSelectedVariants(
          firstCartProduct.selectedVariants &&
            Object.keys(firstCartProduct.selectedVariants).length > 0
            ? firstCartProduct.selectedVariants
            : defaultVariants
        );
        setQty(firstCartProduct.qty || 1);
      } else {
        setSelectedVariants(defaultVariants);
        setQty(1);
      }
    };

    initializeState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product?.id, cartProducts]);

  // Sync quantity when variants change to match cart
  useEffect(() => {
    if (!isOpen) return;

    if (existingCartProduct) {
      // Product with this variant combination exists in cart - use its quantity
      setQty(existingCartProduct.qty || 1);
    } else {
      // No product with this variant combination in cart - reset to 1
      setQty(1);
    }
  }, [isOpen, existingCartProduct]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!product) return 0;
    const additionalPrice = Object.values(selectedVariants).reduce(
      (sum, variant) => sum + (variant?.price || 0),
      0
    );
    return product.price + additionalPrice;
  }, [product, selectedVariants]);

  const regularPrice = useMemo(() => {
    if (!product || !product.old_price) return null;
    const additionalPrice = Object.values(selectedVariants).reduce(
      (sum, variant) => sum + (variant?.price || 0),
      0
    );
    return product.old_price + additionalPrice;
  }, [product, selectedVariants]);

  // Calculate available stock
  const availableStock = useMemo(() => {
    if (!product) return 0;

    if (product.is_stock_manage_by_variant && product.stocks?.length) {
      // Get the variant IDs from selected mandatory variants
      const variantIds = Object.values(selectedVariants)
        .map((v) => v.variant_id)
        .sort((a, b) => a - b);
      const combination = JSON.stringify(variantIds);
      const stock = product.stocks.find((s) => s.combination === combination);
      return stock?.quantity || 0;
    }

    return product.quantity;
  }, [product, selectedVariants]);

  // Check if all mandatory variants are selected
  const isMandatoryVariantsSelected = useMemo(() => {
    if (!product?.variant_types) return true;
    return product.variant_types
      .filter((vt) => vt.is_mandatory)
      .every((vt) => selectedVariants[vt.id]);
  }, [product, selectedVariants]);

  const existingQty = existingCartProduct?.qty || 0;
  const remainingStock = Math.max(availableStock - existingQty, 0);
  const isStockAvailable = remainingStock > 0;
  const canAddToCart =
    isMandatoryVariantsSelected &&
    isStockAvailable &&
    qty > 0 &&
    qty <= remainingStock;
  const disableIncrement = qty >= remainingStock;
  const quantityInputMax = remainingStock > 0 ? remainingStock : 1;

  const handleVariantSelect = (
    variantType: ProductStoreVariantType,
    variant: ProductStoreVariant
  ) => {
    setSelectedVariants((prev) => {
      const isSelected = prev[variantType.id]?.variant_id === variant.id;

      // If not mandatory and already selected, deselect it
      if (!variantType.is_mandatory && isSelected) {
        const newVariants = { ...prev };
        delete newVariants[variantType.id];
        return newVariants;
      }

      // Select the variant
      return {
        ...prev,
        [variantType.id]: {
          variant_type_id: variantType.id,
          variant_id: variant.id,
          price: variant.price,
          variant_name: variant.name,
          variant_type_name: variantType.title,
          image_url: variant.image_url || undefined,
        },
      };
    });
  };

  const handleAddToCart = () => {
    if (!product || !canAddToCart) return;

    // Get variant image if available
    const variantImage = Object.values(selectedVariants).find(
      (v) => v.image_url
    )?.image_url;

    // Cast Product to CartProduct structure
    const cartProduct = {
      id: Number(product.id),
      shop_id: product.shop_id || 0,
      name: product.name,
      handle: product.slug,
      image_url: variantImage || product.image_url || "",
      images: product.images,
      price: totalPrice,
      quantity: product.quantity,
      old_price: product.old_price || 0,
      is_active: product.is_active ?? true,
      has_variant: product.has_variant || false,
      categories: product.categories || [],
      variant_types: product.variant_types || [],
      stocks: product.stocks || [],
      is_stock_manage_by_variant: product.is_stock_manage_by_variant || false,
      reviews: product.reviews || [],
      total_inventory_sold: 0,
      description: product.description,
      short_description: product.short_description,
      video_link: product.video_link,
      qty,
      selectedVariants,
    };

    if (existingCartProduct?.cartId) {
      if (existingQty !== qty) {
        const newQty = Math.min(qty, availableStock);
        updateQuantity(existingCartProduct.cartId, newQty);
      }
    } else {
      addProduct(cartProduct as Parameters<typeof addProduct>[0]);
    }

    onAddToCart?.();
    onClose();
  };

  const handleBuyNow = () => {
    if (!product || !canAddToCart) return;

    // Get variant image if available
    const variantImage = Object.values(selectedVariants).find(
      (v) => v.image_url
    )?.image_url;

    // Cast Product to CartProduct structure
    const cartProduct = {
      id: Number(product.id),
      shop_id: product.shop_id || 0,
      name: product.name,
      handle: product.slug,
      image_url: variantImage || product.image_url || "",
      images: product.images,
      price: totalPrice,
      quantity: product.quantity,
      old_price: product.old_price || 0,
      is_active: product.is_active ?? true,
      has_variant: product.has_variant || false,
      categories: product.categories || [],
      variant_types: product.variant_types || [],
      stocks: product.stocks || [],
      is_stock_manage_by_variant: product.is_stock_manage_by_variant || false,
      reviews: product.reviews || [],
      total_inventory_sold: 0,
      description: product.description,
      short_description: product.short_description,
      video_link: product.video_link,
      qty,
      selectedVariants,
    };

    if (existingCartProduct?.cartId) {
      if (existingQty !== qty) {
        const newQty = Math.min(qty, availableStock);
        updateQuantity(existingCartProduct.cartId, newQty);
      }
    } else {
      addProduct(cartProduct as Parameters<typeof addProduct>[0]);
    }

    onClose();

    const checkoutPath = shopDetails?.baseUrl
      ? `${shopDetails.baseUrl}/checkout`
      : `/checkout`;

    router.push(checkoutPath);
  };

  if (!product) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-xl p-0 gap-0 rounded-xl">
        <DialogHeader className="p-6 pb-4 space-y-0 border-b border-blue-zatiq/20">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-blue-zatiq pr-8">
            {product.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Select product variants and quantity
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Pricing */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-normal text-muted-foreground">
                Price
              </span>
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalPrice.toLocaleString()} BDT
              </span>
              {regularPrice && regularPrice > totalPrice && (
                <>
                  <span className="text-base text-muted-foreground line-through">
                    {regularPrice.toLocaleString()} BDT
                  </span>
                  <span className="text-sm font-medium text-white bg-blue-zatiq px-2.5 py-1 rounded">
                    Save {(regularPrice - totalPrice).toLocaleString()} BDT
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Variant Selection */}
          <div className="space-y-5">
            {product.variant_types?.map((variantType) => (
              <div key={variantType.id} className="space-y-3">
                <label className="text-sm font-normal text-gray-900 dark:text-gray-200">
                  {variantType.title}
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {variantType.variants.map((variant) => {
                    const isSelected =
                      selectedVariants[variantType.id]?.variant_id ===
                      variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() =>
                          handleVariantSelect(variantType, variant)
                        }
                        className={cn(
                          "px-5 py-2 rounded-md border transition-all duration-200 text-sm font-medium",
                          isSelected
                            ? "bg-blue-zatiq/10 dark:bg-blue-zatiq/20 border-blue-zatiq text-gray-900 dark:text-white"
                            : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-zatiq"
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

          {/* Stock Warning */}
          {!isStockAvailable && (
            <div className="text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              No more items remaining!
            </div>
          )}

          {/* Quantity Control & Actions */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex h-12 items-center border-[1.2px] border-blue-zatiq rounded-lg overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1}
                className="px-3 py-2 hover:bg-blue-zatiq/10 dark:hover:bg-blue-zatiq/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="h-4 w-4 text-blue-zatiq" />
              </button>
              <input
                type="number"
                value={qty}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setQty(Math.max(1, Math.min(quantityInputMax, value)));
                }}
                className="w-12 text-center font-medium bg-transparent focus:outline-none text-gray-900 dark:text-white"
                min="1"
                max={quantityInputMax}
              />
              <button
                onClick={() => setQty(Math.min(quantityInputMax, qty + 1))}
                disabled={disableIncrement}
                className="px-3 py-2 hover:bg-blue-zatiq/10 dark:hover:bg-blue-zatiq/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4 text-blue-zatiq" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              variant="outline"
              className="flex-1 h-12 text-sm font-semibold uppercase border border-blue-zatiq text-blue-zatiq hover:bg-blue-zatiq/10 dark:hover:bg-blue-zatiq/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {existingCartProduct ? t("update_cart") : t("add_to_cart")}
            </Button>
          </div>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            disabled={!canAddToCart}
            className="flex h-12 items-center justify-center gap-2 px-5 bg-black-1-1 rounded-lg text-sm md:text-base text-white font-medium disabled:bg-black-disabled transition-all duration-300 uppercase w-full hover:shadow-lg hover:shadow-black-full/20 transform hover:scale-[1.02] cursor-pointer"
          >
            <ShoppingCart size={18} />
            {t("buy_now")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
