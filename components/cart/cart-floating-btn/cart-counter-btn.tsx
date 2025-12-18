"use client";

import { useCartStore } from "@/stores";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartCounterBtnProps {
  className?: string;
  showCount?: boolean;
  countPosition?: "top-right" | "bottom-right";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export function CartCounterBtn({
  className,
  showCount = true,
  countPosition = "top-right",
  size = "md",
  variant = "default",
}: CartCounterBtnProps) {
  const totalItems = useCartStore(selectTotalItems);
  const cartIsEmpty = useCartStore(selectCartIsEmpty);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const countPositionClasses = {
    "top-right": "-top-2 -right-2",
    "bottom-right": "-bottom-2 -right-2",
  };

  return (
    <div className="relative">
      <button
        className={cn(
          "relative rounded-full flex items-center justify-center transition-colors",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        aria-label="Shopping cart"
      >
        <ShoppingCart className={iconSizes[size]} />
        {showCount && !cartIsEmpty && totalItems > 0 && (
          <span
            className={cn(
              "absolute flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground",
              countPositionClasses[countPosition]
            )}
          >
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </button>
    </div>
  );
}