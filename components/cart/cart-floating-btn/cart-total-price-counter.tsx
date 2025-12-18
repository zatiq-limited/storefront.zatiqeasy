"use client";

import { useCartStore } from "@/stores";
import { cn } from "@/lib/utils";

interface CartTotalPriceCounterProps {
  className?: string;
  showItems?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal";
  currency?: string;
}

export function CartTotalPriceCounter({
  className,
  showItems = true,
  size = "md",
  variant = "default",
  currency = "BDT",
}: CartTotalPriceCounterProps) {
  const totalItems = useCartStore(selectTotalItems);
  const subtotal = useCartStore(selectSubtotal);
  const cartIsEmpty = useCartStore(selectCartIsEmpty);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (cartIsEmpty) {
    return (
      <div className={cn("text-muted-foreground", sizeClasses[size], className)}>
        Cart is empty
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("font-medium", sizeClasses[size], className)}>
        {formatPrice(subtotal)}
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", sizeClasses[size], className)}>
      {showItems && (
        <div className="text-sm text-muted-foreground">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </div>
      )}
      <div className="font-semibold text-lg">
        {formatPrice(subtotal)}
      </div>
    </div>
  );
}