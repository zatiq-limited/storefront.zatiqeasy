"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";

interface ProductPricingProps {
  currentPrice: number;
  regularPrice?: number;
  hasSavePrice?: boolean;
  savePrice?: number;
  showOldPrice?: boolean;
  unitName?: string;
}

export function ProductPricing({
  currentPrice,
  regularPrice = 0,
  hasSavePrice = false,
  savePrice = 0,
  showOldPrice = true,
  unitName,
}: ProductPricingProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const countryCurrency = shopDetails?.country_currency || "BDT";

  return (
    <div className="flex items-start flex-col">
      <p className="text-[#9CA3AF] dark:text-gray-200 font-medium leading-normal">
        {t("price")}
      </p>
      <div className="flex items-center gap-1 xl:gap-3 leading-normal">
        <span className="text-[16px] text-[#4B5563] dark:text-gray-200 lg:text-2xl font-bold min-w-fit">
          {currentPrice?.toLocaleString() || "0.00"} {countryCurrency}
        </span>
        {unitName && (
          <span className="text-base text-[#4B5563] dark:text-gray-200">
            {unitName}
          </span>
        )}
        {hasSavePrice && showOldPrice && (
          <>
            <span className="text-sm text-[#8E8E8E] dark:text-gray-300 min-w-fit line-through">
              {regularPrice?.toLocaleString()} {countryCurrency}
            </span>
            <span className="px-[10px] pb-[8px] pt-[9px] bg-blue-zatiq rounded-full text-white dark:text-black-18 text-center text-xs md:text-[16px]">
              {t("save")} {savePrice?.toLocaleString()} {countryCurrency}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductPricing;
