"use client";

import { useCartStore } from "@/stores/cartStore";
import { useShopStore } from "@/stores/shopStore";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { cn, getInventoryThumbImageUrl } from "@/lib/utils";
import { AnimateChangeInHeight } from "@/components/ui/animate-height";
import { FallbackImage } from "@/components/ui/fallback-image";
import { CartQtyControl } from "@/features/cart/shared/cart-qty-control";
import type { CartProduct, VariantsState } from "@/types";

interface CommonCheckoutCartDetailsProps {
  showVariantSelector?: boolean;
}

export function CommonCheckoutCartDetails({
  showVariantSelector = false,
}: CommonCheckoutCartDetailsProps) {
  const { t } = useTranslation();
  const {
    products,
    removeProduct,
    incrementQty,
    decrementQty,
    updateQuantity,
    updateVariants,
  } = useCartStore();
  const { shopDetails } = useShopStore();

  const initialCartItemLimit = 3;
  const [cartItemLimit, setCartItemLimit] = useState(initialCartItemLimit);

  const productsArray = useMemo(
    () => Object.values(products || {}),
    [products]
  );
  const baseUrl = shopDetails?.baseUrl || "";
  const country_currency = shopDetails?.country_currency || "BDT";

  if (!productsArray || productsArray.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="border rounded-lg bg-white dark:bg-transparent">
        <AnimateChangeInHeight>
          {productsArray && productsArray.length > 0 ? (
            <ul className="h-full w-full">
              {productsArray
                .slice(0, cartItemLimit)
                .map((cartProduct: CartProduct) => (
                  <React.Fragment key={cartProduct?.cartId || cartProduct?.id}>
                    <SingleCartItem
                      cartProduct={cartProduct}
                      baseUrl={baseUrl}
                      country_currency={country_currency}
                      showVariantSelector={showVariantSelector}
                      removeProduct={removeProduct}
                      incrementQty={incrementQty}
                      decrementQty={decrementQty}
                      updateQuantity={updateQuantity}
                      updateVariants={updateVariants}
                    />
                  </React.Fragment>
                ))}
            </ul>
          ) : (
            <div className="pt-4">
              <h2 className="text-xl font-medium text-center dark:text-gray-300">
                {t("no_items")}
              </h2>
            </div>
          )}
          {productsArray.length > 0 ? (
            <Link
              href={`${baseUrl}/products`}
              className="flex items-center gap-3 text-blue-zatiq dark:text-white text-sm p-5"
            >
              <Plus className="h-5 w-5" />
              {t("add_more_items")}
            </Link>
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-2 p-5">
              <Link
                href={`${baseUrl}/products`}
                className="w-full px-0 md:px-4 py-3 text-lg border border-blue-zatiq text-blue-zatiq font-medium transition-colors duration-150 text-center truncate"
              >
                {t("add_more_items")}
              </Link>
            </div>
          )}
          {productsArray.length > initialCartItemLimit && (
            <button
              type="button"
              className="flex items-center justify-center gap-4 bg-gray-200 dark:bg-gray-500 py-3 rounded-b-lg cursor-pointer w-full"
              onClick={() => {
                setCartItemLimit(
                  cartItemLimit === initialCartItemLimit
                    ? productsArray.length
                    : initialCartItemLimit
                );
              }}
            >
              <span className="text-gray-600 dark:text-gray-200 text-base md:text-lg font-medium">
                See {cartItemLimit === initialCartItemLimit ? "More" : "Less"}
              </span>
              <div className="bg-white dark:bg-gray-200 h-7 w-7 flex justify-center items-center rounded-full">
                {cartItemLimit === initialCartItemLimit ? (
                  <ChevronDown />
                ) : (
                  <ChevronUp />
                )}
              </div>
            </button>
          )}
        </AnimateChangeInHeight>
      </div>
    </div>
  );
}

interface SingleCartItemProps {
  cartProduct: CartProduct;
  baseUrl: string;
  country_currency: string;
  showVariantSelector?: boolean;
  removeProduct: (cartId: string) => void;
  incrementQty: (cartId: string) => void;
  decrementQty: (cartId: string) => void;
  updateQuantity: (cartId: string, qty: number) => void;
  updateVariants: (
    cartId: string,
    variants: VariantsState,
    newPrice?: number
  ) => void;
}

const SingleCartItem: React.FC<SingleCartItemProps> = ({
  cartProduct,
  baseUrl,
  country_currency,
  showVariantSelector = false,
  removeProduct,
  incrementQty,
  decrementQty,
  updateQuantity,
  updateVariants,
}) => {
  const [stockErrorMessage, setStockErrorMessage] = useState<string | null>(
    null
  );

  // Helper function to check if a variant combination has stock
  const checkVariantStock = useCallback(
    (variantTypeId: number, variantId: number) => {
      // If stock is not managed by variant, return true (available)
      if (
        !cartProduct.is_stock_manage_by_variant ||
        !cartProduct.stocks ||
        cartProduct.stocks.length === 0
      ) {
        return { available: true, stock: cartProduct.quantity };
      }

      // Build the variant combination with the new selection
      const tempSelectedVariants = {
        ...cartProduct.selectedVariants,
        [variantTypeId]: { variant_id: variantId },
      };

      // Get all mandatory variant IDs in sorted order
      const variantCombination: number[] = [];
      cartProduct.variant_types?.forEach((vType) => {
        if (vType.is_mandatory) {
          const selectedVar = tempSelectedVariants[vType.id];
          if (selectedVar?.variant_id) {
            variantCombination.push(selectedVar.variant_id);
          }
        }
      });

      variantCombination.sort((a, b) => a - b);
      const combinationString = JSON.stringify(variantCombination);

      // Find matching stock
      const matchingStock = cartProduct.stocks.find(
        (stock) => stock.combination === combinationString
      );

      return {
        available: matchingStock ? matchingStock.quantity > 0 : false,
        stock: matchingStock?.quantity ?? 0,
      };
    },
    [cartProduct]
  );

  // Auto-hide error message after 3 seconds
  useEffect(() => {
    if (stockErrorMessage) {
      const timer = setTimeout(() => {
        setStockErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stockErrorMessage]);

  // Handle variant selection change
  const handleVariantChange = (variantTypeId: number, variantId: number) => {
    const variantType = cartProduct.variant_types?.find(
      (vt) => vt.id === variantTypeId
    );
    const selectedVariant = variantType?.variants.find(
      (v) => v.id === variantId
    );

    if (!selectedVariant || !variantType) return;

    // Check if this variant combination has stock
    const stockCheck = checkVariantStock(variantTypeId, variantId);

    if (!stockCheck.available) {
      setStockErrorMessage("No more items remaining!");
      return;
    }

    // Clear any existing error message
    setStockErrorMessage(null);

    // Update selected variants
    const updatedSelectedVariants = {
      ...cartProduct.selectedVariants,
      [variantTypeId]: {
        variant_type_id: variantTypeId,
        variant_id: variantId,
        price: selectedVariant.price,
        variant_name: selectedVariant.name,
        image_url: selectedVariant.image_url || cartProduct.image_url,
      },
    };

    // Calculate new price with variant additions
    const additionalPrice = Object.values(updatedSelectedVariants).reduce(
      (a, b) => a + (b?.price || 0),
      0
    );
    const basePrice =
      cartProduct.price -
      Object.values(cartProduct.selectedVariants || {}).reduce(
        (a, b) => a + (b?.price || 0),
        0
      );
    const newPrice = basePrice + additionalPrice;

    // Update the cart product variants and price
    updateVariants(cartProduct.cartId, updatedSelectedVariants, newPrice);
  };

  // Calculate max available stock
  const maxStock = useMemo(() => {
    if (
      cartProduct.is_stock_manage_by_variant &&
      cartProduct.stocks?.length > 0
    ) {
      // Find the stock entry for the selected variants
      const selectedVariantIds = Object.values(
        cartProduct.selectedVariants || {}
      )
        .filter((v) => v)
        .map((v) => v.variant_id);

      if (selectedVariantIds.length > 0) {
        // Find matching stock by checking if all selected variant IDs are in the combination
        const matchingStock = cartProduct.stocks.find((stock) => {
          return selectedVariantIds.every((variantId) =>
            stock.combination.includes(`${variantId}`)
          );
        });

        return matchingStock?.quantity ?? cartProduct.quantity;
      }
    }

    // Default to product quantity if no variant-based stock management
    return cartProduct.quantity;
  }, [cartProduct]);

  // Check if increment should be disabled
  const isCartIncrementDisabled = cartProduct.qty >= maxStock;

  return (
    <li
      key={cartProduct?.cartId}
      className="overflow-hidden flex bg-white dark:bg-transparent py-3 mx-3 border-b dark:border-none gap-2 sm:gap-4"
    >
      <div className="w-28 min-w-28 md:w-36 md:min-w-36 aspect-140/180 relative object-cover">
        <FallbackImage
          src={getInventoryThumbImageUrl(cartProduct?.image_url)}
          alt={cartProduct?.name}
          width={144}
          height={179}
          className="w-full h-full object-cover rounded-lg md:rounded-xl"
        />
      </div>
      <div className="flex items-center justify-center w-full py-2">
        <div className="flex flex-col md:justify-normal md:h-auto justify-between h-full gap-3 w-full px-1 py-2">
          <div className="flex items-center justify-between w-full">
            <Link
              href={`${baseUrl}/products/${cartProduct?.id}?c_id=${cartProduct?.cartId}`}
              className="text-[18px] md:text-[20px] font-[450] max-w-[70%] line-clamp-2 text-black-zatiq dark:text-gray-200 flex-wrap"
            >
              {cartProduct?.name}
            </Link>
            <span className=" text-sm md:text-[20px] text-gray-700 dark:text-gray-200 font-medium m-0">
              {(cartProduct?.price * cartProduct?.qty).toLocaleString()}{" "}
              {country_currency}
            </span>
          </div>

          {/* Product Variants */}
          <div className="pb-1">
            {cartProduct?.variant_types &&
              cartProduct?.variant_types.length > 0 && (
                <div className="flex flex-col gap-2">
                  {showVariantSelector ? (
                    <>
                      {/* Show variant selector for landing page */}
                      {cartProduct.variant_types.map((variantType) => (
                        <div
                          key={variantType.id}
                          className="flex flex-col gap-1"
                        >
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            {variantType.title}:
                          </span>
                          <div className="flex gap-2 flex-wrap">
                            {variantType.variants.map((variant) => {
                              const selectedVariant =
                                cartProduct.selectedVariants?.[variantType.id];
                              const isSelected =
                                selectedVariant?.variant_id === variant.id ||
                                (selectedVariant &&
                                  "id" in selectedVariant &&
                                  selectedVariant.id === variant.id);

                              // Check stock availability for this variant
                              const stockCheck = checkVariantStock(
                                variantType.id,
                                variant.id
                              );
                              const isOutOfStock = !stockCheck.available;

                              return (
                                <button
                                  key={variant.id}
                                  type="button"
                                  onClick={() =>
                                    handleVariantChange(
                                      variantType.id,
                                      variant.id
                                    )
                                  }
                                  // disabled={isOutOfStock}
                                  className={cn(
                                    "px-3 py-1 text-[12px] font-medium capitalize rounded-full border transition-all",
                                    isSelected
                                      ? "bg-blue-zatiq text-white border-blue-zatiq"
                                      : isOutOfStock
                                      ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed line-through"
                                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-blue-zatiq"
                                  )}
                                  title={isOutOfStock ? "Out of stock" : ""}
                                >
                                  {variant.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      {/* Stock Error Message */}
                      {stockErrorMessage && (
                        <div className="text-sm font-medium text-red-500 bg-red-500/10 p-2 rounded-md">
                          {stockErrorMessage}
                        </div>
                      )}
                    </>
                  ) : (
                    // Show selected variants only for checkout
                    <div className="flex uppercase gap-1 flex-wrap">
                      <ul className="flex gap-1 md:gap-3 flex-wrap items-center justify-start md:justify-center">
                        {Object.values(cartProduct?.selectedVariants || {})
                          .filter((variant) => variant)
                          .map((variant) => {
                            const variantKey =
                              variant.variant_id ||
                              ("id" in variant && typeof variant.id === "number"
                                ? variant.id
                                : 0);
                            const variantName =
                              variant.variant_name ||
                              ("name" in variant &&
                              typeof variant.name === "string"
                                ? variant.name
                                : "");

                            return (
                              <li
                                role="button"
                                key={variantKey}
                                className={cn(
                                  "flex items-center justify-center text-gray-700 dark:text-gray-200 text-[12px] font-medium px-3 py-0.75 pt-1 capitalize bg-blue-zatiq/10 rounded-full"
                                )}
                              >
                                <span className="">{variantName}</span>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Product Quantity Control */}
          <div className="w-full flex items-center justify-between gap-2 md:gap-4 bg-white dark:bg-transparent">
            <div className="h-full p-1 w-fit md:rounded-none bg-transparent border-[1.2px] border-blue-zatiq">
              <CartQtyControl
                qty={cartProduct?.qty}
                maxStock={maxStock}
                disableSumBtn={isCartIncrementDisabled}
                sumQty={() => incrementQty(cartProduct?.cartId)}
                subQty={() => decrementQty(cartProduct?.cartId)}
                onQtyChange={(newQty: number) => {
                  updateQuantity(cartProduct?.cartId, newQty);
                }}
              />
            </div>
            <button
              onClick={() => removeProduct(cartProduct?.cartId)}
              className="text-zinc-600 cursor-pointer"
              aria-label="Remove item from cart"
            >
              <Trash2 className="w-5 h-5 text-red-500 dark:text-gray-200" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};
