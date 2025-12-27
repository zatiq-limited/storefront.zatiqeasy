"use client";

import { X, Square, SquareCheckBig } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { PriceRange } from "./price-filter-section";

type Props = {
  showMobileFilter: boolean;
  setShowMobileFilter: (value: boolean) => void;
  priceRanges: PriceRange[];
  selectedRange: PriceRange | null;
  onRangeSelect: (range: PriceRange | null) => void;
};

export function MobilePriceFilter({
  showMobileFilter,
  setShowMobileFilter,
  priceRanges,
  selectedRange,
  onRangeSelect,
}: Props) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const currency = shopDetails?.country_currency || "৳";

  const handleRangeSelect = (range: PriceRange) => () => {
    if (selectedRange?.id === range.id) {
      onRangeSelect(null);
    } else {
      onRangeSelect(range);
    }
    setShowMobileFilter(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`lg:hidden w-full bg-black/50 fixed top-0 right-0 h-full z-[1000] ${
          showMobileFilter ? "flex" : "hidden"
        }`}
        onClick={() => setShowMobileFilter(false)}
      />

      {/* Filter Panel */}
      <div
        className={`fixed top-0 right-0 z-[1001] w-[300px] bg-white dark:bg-black-27 h-full p-6 transition-transform duration-300 ${
          showMobileFilter ? "translate-x-0 lg:hidden" : "translate-x-full"
        }`}
      >
        <div className="pb-4 border-b border-b-gray-600 flex items-center justify-between">
          <h1 className="text-gray-700 dark:text-gray-200 text-2xl leading-tight">
            {t("filter")}
          </h1>
          <button onClick={() => setShowMobileFilter(false)}>
            <X size={24} className="text-red-500 cursor-pointer" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-gray-700 dark:text-gray-200 text-xl mt-7">
            {t("price")}
          </p>
          <div className="flex flex-col gap-2">
            {priceRanges.map((range) => (
              <div key={range.id} className="flex gap-3">
                <button onClick={handleRangeSelect(range)}>
                  {selectedRange?.id === range.id ? (
                    <SquareCheckBig
                      size={16}
                      className="text-black-2 dark:text-gray-200"
                    />
                  ) : (
                    <Square
                      size={16}
                      className="text-black-2 dark:text-gray-200"
                    />
                  )}
                </button>
                <p className="text-gray-700 dark:text-gray-200 text-base">
                  {currency} {range.min} - {currency} {range.max}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default MobilePriceFilter;
