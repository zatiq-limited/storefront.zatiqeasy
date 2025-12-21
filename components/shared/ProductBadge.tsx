"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "sale" | "new" | "featured" | "out-of-stock" | "custom";
type BadgePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface ProductBadgeProps {
  /** Badge text content */
  text: string;
  /** Badge variant for preset styles */
  variant?: BadgeVariant;
  /** Badge position */
  position?: BadgePosition;
  /** Custom background color (overrides variant) */
  bgColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

// Preset colors for variants
const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  sale: { bg: "#F55157", text: "#FFFFFF" },
  new: { bg: "#10B981", text: "#FFFFFF" },
  featured: { bg: "#3B82F6", text: "#FFFFFF" },
  "out-of-stock": { bg: "#EF4444", text: "#FFFFFF" },
  custom: { bg: "#6B7280", text: "#FFFFFF" },
};

// Position classes
const positionClasses: Record<BadgePosition, string> = {
  "top-left": "top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4",
  "top-right": "top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4",
  "bottom-left": "bottom-2 left-2 sm:bottom-3 sm:left-3 lg:bottom-4 lg:left-4",
  "bottom-right": "bottom-2 right-2 sm:bottom-3 sm:right-3 lg:bottom-4 lg:right-4",
};

// Size classes
const sizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "px-1.5 py-0.5 text-[8px] sm:text-[10px]",
  md: "px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-3 lg:py-1 text-[10px] sm:text-xs lg:text-sm",
  lg: "px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm lg:text-base",
};

/**
 * Shared ProductBadge component
 * Displays badges for product status (sale, new, featured, out of stock)
 */
export function ProductBadge({
  text,
  variant = "custom",
  position = "top-left",
  bgColor,
  textColor,
  size = "md",
  className,
}: ProductBadgeProps) {
  const colors = variantColors[variant];
  const finalBgColor = bgColor || colors.bg;
  const finalTextColor = textColor || colors.text;

  return (
    <div
      className={cn(
        "absolute rounded font-normal z-10",
        positionClasses[position],
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: finalBgColor,
        color: finalTextColor,
      }}
    >
      {text}
    </div>
  );
}

export default ProductBadge;
