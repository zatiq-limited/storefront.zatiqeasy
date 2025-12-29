"use client";

import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";

export interface PriceRange {
  id: number;
  min: number;
  max: number;
}

type PriceFilterSectionProps = {
  priceRanges: PriceRange[];
  selectedRange: PriceRange | null;
  onRangeSelect: (range: PriceRange | null) => void;
};

export function PriceFilterSection({
  priceRanges,
  selectedRange,
  onRangeSelect,
}: PriceFilterSectionProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const currency = shopDetails?.country_currency || "৳";

  const handleRangeSelect = (range: PriceRange | null) => () => {
    if (selectedRange?.id === range?.id || !range) {
      onRangeSelect(null);
    } else {
      onRangeSelect(range);
    }
  };

  if (priceRanges.length === 0) return null;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
      <div className="flex items-center justify-between mb-3 sm:mb-5">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          {t("price")}
        </h3>
        <button
          onClick={handleRangeSelect(null)}
          className="text-foreground transition-colors cursor-pointer"
          aria-label="Clear price filter"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
          >
            <path
              d="M4 8H12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div className="space-y-2">
        {priceRanges.map((range) => (
          <label
            key={range.id}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
          >
            <input
              type="radio"
              name="priceRange"
              checked={selectedRange?.id === range.id}
              onChange={handleRangeSelect(range)}
              className="w-4 h-4 cursor-pointer appearance-none border-2 border-[#DADADA] bg-[#DADADA] rounded-full relative checked:bg-[#DADADA] checked:border-[#DADADA] after:content-['✓'] after:absolute after:text-black after:text-[8px] after:font-bold after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 checked:after:opacity-100"
            />
            <span className="text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">
              {currency}
              {range.min} - {currency}
              {range.max}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default PriceFilterSection;
