"use client";

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
  const { shopDetails } = useShopStore();
  const currency = shopDetails?.country_currency || "৳";

  return (
    <div className="flex items-start flex-col">
      <div className="flex items-center gap-1 leading-normal">
        <span className="text-sm text-foreground lg:text-2xl font-normal min-w-fit">
          {currency} {currentPrice.toLocaleString() || "0.00"}
        </span>
        {unitName && (
          <span className="text-base text-foreground">{unitName}</span>
        )}
        {hasSavePrice && (
          <>
            {showOldPrice && regularPrice && (
              <span className="text-sm text-muted-foreground min-w-fit line-through">
                {currency} {regularPrice.toLocaleString()}
              </span>
            )}
            {showOldPrice && regularPrice && savePrice > 0 && (
              <span className="ml-3 px-3 py-1 bg-red-500/70 rounded-full text-white text-center text-xs">
                Save {savePrice.toLocaleString()} {currency} (
                {((savePrice / regularPrice) * 100).toFixed(0)}%)
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductPricing;
