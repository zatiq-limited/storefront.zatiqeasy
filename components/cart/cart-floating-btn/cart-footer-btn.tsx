"use client";

import { useCartStore } from "@/stores";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CartFooterBtnProps {
  className?: string;
  showTotal?: boolean;
  totalPosition?: "left" | "right";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "secondary";
  onClick?: () => void;
}

export function CartFooterBtn({
  className,
  showTotal = true,
  totalPosition = "right",
  size = "md",
  variant = "default",
  onClick,
}: CartFooterBtnProps) {
  const totalItems = useCartStore(selectTotalItems);
  const subtotal = useCartStore(selectSubtotal);
  const cartIsEmpty = useCartStore(selectCartIsEmpty);

  const sizeClasses = {
    sm: "h-10 px-3 text-sm",
    md: "h-12 px-4",
    lg: "h-14 px-6 text-lg",
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (cartIsEmpty) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn(
          "w-full justify-start",
          sizeClasses[size],
          className
        )}
        onClick={onClick}
        disabled
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Cart is empty
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "w-full justify-between",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <ShoppingCart className="mr-2 h-4 w-4" />
        <span className="font-medium">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
      </div>
      {showTotal && (
        <span className="font-bold">{formatPrice(subtotal)}</span>
      )}
    </Button>
  );
}