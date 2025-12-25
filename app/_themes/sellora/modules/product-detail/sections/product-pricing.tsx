"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";

interface ProductPricingProps {
  currentPrice: number;
  regularPrice?: number;
  hasSavePrice: boolean;
  savePrice: number;
  showOldPrice?: boolean;
  unitName?: string;
}

export function ProductPricing({
  currentPrice,
  regularPrice,
  hasSavePrice,
  savePrice,
  showOldPrice = true,
  unitName,
}: ProductPricingProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const currency = shopDetails?.country_currency || "$";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-end gap-3">
        {/* Current Price */}
        <span className="text-2xl sm:text-3xl font-bold text-foreground">
          {currency}
          {currentPrice.toFixed(2)}
          {unitName && (
            <span className="text-sm font-normal text-gray-500 ml-1">
              /{unitName}
            </span>
          )}
        </span>

        {/* Old Price (strikethrough) */}
        {showOldPrice && hasSavePrice && regularPrice && (
          <span className="text-lg sm:text-xl text-gray-400 line-through">
            {currency}
            {regularPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* Savings */}
      {hasSavePrice && savePrice > 0 && (
        <span className="text-sm font-medium text-green-600 dark:text-green-400">
          {t("save")} {currency}
          {savePrice.toFixed(2)}
        </span>
      )}
    </div>
  );
}

export default ProductPricing;
