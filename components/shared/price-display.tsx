"use client";

import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  /** Current price */
  price: number;
  /** Original/compare price (for showing discount) */
  comparePrice?: number | null;
  /** Currency symbol or code (default: BDT) */
  currency?: string;
  /** Price text color */
  priceColor?: string;
  /** Compare price text color */
  comparePriceColor?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
  /** Show prices inline or stacked */
  layout?: "inline" | "stacked";
}

/**
 * Shared PriceDisplay component
 * Handles price formatting with currency and compare price
 */
export function PriceDisplay({
  price,
  comparePrice,
  currency = "BDT",
  priceColor = "#F55157",
  comparePriceColor = "#9CA3AF",
  size = "md",
  className,
  layout = "inline",
}: PriceDisplayProps) {
  const hasDiscount = comparePrice && comparePrice > price;

  // Size-based classes
  const sizeClasses = {
    sm: {
      price: "text-sm font-medium",
      compare: "text-xs",
    },
    md: {
      price: "text-sm sm:text-base lg:text-lg font-medium",
      compare: "text-[10px] sm:text-xs lg:text-sm",
    },
    lg: {
      price: "text-lg sm:text-xl lg:text-2xl font-bold",
      compare: "text-sm sm:text-base",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={cn(
        layout === "inline"
          ? "flex items-center gap-1 sm:gap-2"
          : "flex flex-col",
        className
      )}
    >
      {/* Current Price */}
      <span className={classes.price} style={{ color: priceColor }}>
        {price.toLocaleString()} {currency}
      </span>

      {/* Compare Price (strikethrough) */}
      {hasDiscount && (
        <span
          className={cn(classes.compare, "line-through")}
          style={{ color: comparePriceColor }}
        >
          {comparePrice!.toLocaleString()} {currency}
        </span>
      )}
    </div>
  );
}

export default PriceDisplay;
