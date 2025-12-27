"use client";

import { useTranslation } from "react-i18next";

export type SortOption = "" | "price_asc" | "price_desc";

type SortBySectionProps = {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
};

export function SortBySection({
  selectedSort,
  onSortChange,
}: SortBySectionProps) {
  const { t } = useTranslation();

  const handleClear = () => {
    onSortChange("");
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
      <div className="flex items-center justify-between mb-3 sm:mb-5">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          {t("sort_by")}
        </h3>
        <button
          onClick={handleClear}
          className="text-foreground transition-colors cursor-pointer"
          aria-label="Clear sort filter"
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
        <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
          <input
            type="radio"
            name="sortBy"
            checked={selectedSort === ""}
            onChange={() => onSortChange("")}
            className="w-4 h-4 cursor-pointer appearance-none border-2 border-[#DADADA] bg-[#DADADA] rounded-full relative checked:bg-[#DADADA] checked:border-[#DADADA] after:content-['✓'] after:absolute after:text-black after:text-[8px] after:font-bold after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 checked:after:opacity-100"
          />
          <span className="text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">
            {t("default")}
          </span>
        </label>
        <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
          <input
            type="radio"
            name="sortBy"
            checked={selectedSort === "price_asc"}
            onChange={() => onSortChange("price_asc")}
            className="w-4 h-4 cursor-pointer appearance-none border-2 border-[#DADADA] bg-[#DADADA] rounded-full relative checked:bg-[#DADADA] checked:border-[#DADADA] after:content-['✓'] after:absolute after:text-black after:text-[8px] after:font-bold after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 checked:after:opacity-100"
          />
          <span className="text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">
            {t("price_low_to_high")}
          </span>
        </label>
        <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
          <input
            type="radio"
            name="sortBy"
            checked={selectedSort === "price_desc"}
            onChange={() => onSortChange("price_desc")}
            className="w-4 h-4 cursor-pointer appearance-none border-2 border-[#DADADA] bg-[#DADADA] rounded-full relative checked:bg-[#DADADA] checked:border-[#DADADA] after:content-['✓'] after:absolute after:text-black after:text-[8px] after:font-bold after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 checked:after:opacity-100"
          />
          <span className="text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">
            {t("price_high_to_low")}
          </span>
        </label>
      </div>
    </div>
  );
}

export default SortBySection;
