"use client";

import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "filled" | "outlined" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface AddToCartButtonProps {
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Button text (default: "Add to Cart") */
  text?: string;
  /** Button variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether to show loading state */
  loading?: boolean;
  /** Custom background color */
  bgColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Custom border color (for outlined variant) */
  borderColor?: string;
  /** Whether to show cart icon */
  showIcon?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// Size classes
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 sm:h-12 px-4 text-sm sm:text-base gap-2",
  lg: "h-12 sm:h-14 px-6 text-base sm:text-lg gap-2",
};

/**
 * Shared AddToCartButton component
 * Consistent add to cart button across product cards
 */
export function AddToCartButton({
  onClick,
  text = "Add to Cart",
  variant = "outlined",
  size = "md",
  disabled = false,
  loading = false,
  bgColor,
  textColor,
  borderColor,
  showIcon = true,
  fullWidth = true,
  className,
}: AddToCartButtonProps) {
  // Determine colors based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "filled":
        return {
          backgroundColor: bgColor || "#3B82F6",
          color: textColor || "#FFFFFF",
          borderColor: borderColor || "transparent",
        };
      case "outlined":
        return {
          backgroundColor: bgColor || "#FFFFFF",
          color: textColor || "#1F2937",
          borderColor: borderColor || "#EEEEEE",
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: textColor || "#3B82F6",
          borderColor: "transparent",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <button
      className={cn(
        "flex items-center justify-center rounded border font-normal transition-all duration-300",
        "hover:opacity-90 active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      style={{
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderColor: styles.borderColor,
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled && !loading) {
          onClick?.(e);
        }
      }}
      disabled={disabled || loading}
      aria-label={text}
    >
      {loading ? (
        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <>
          {text}
          {showIcon && <ShoppingCart className="w-4 h-4" />}
        </>
      )}
    </button>
  );
}

export default AddToCartButton;
