"use client";

import React from "react";

interface ProductPricingProps {
  currentPrice: number;
  hasSavePrice: boolean;
  regularPrice: number;
  showOldPrice?: boolean;
  savePrice: number;
  currency: string;
}

export const ProductPricing = ({
  currentPrice,
  hasSavePrice,
  regularPrice,
  showOldPrice = true,
  savePrice,
  currency,
}: ProductPricingProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl font-semibold min-w-fit text-black dark:text-gray-200">
        {currentPrice.toLocaleString() || "0.00"} {currency}
      </span>
      {hasSavePrice && (
        <>
          {showOldPrice && (
            <span className="text-sm text-[#8E8E8E] dark:text-gray-300 min-w-fit line-through">
              {regularPrice.toLocaleString()} {currency}
            </span>
          )}
          {showOldPrice && (
            <span className="px-2 py-0.5 bg-blue-600 rounded-full text-white text-xs">
              Save {savePrice.toLocaleString()} {currency}
            </span>
          )}
        </>
      )}
    </div>
  );
};
