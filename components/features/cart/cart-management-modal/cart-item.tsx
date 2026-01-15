"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/stores";
import type { CartProduct } from "@/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CartItemProps {
  product: CartProduct;
  className?: string;
  showImage?: boolean;
  showVariants?: boolean;
  compact?: boolean;
}

export function CartItem({
  product,
  className,
  showImage = true,
  showVariants = true,
  compact = false,
}: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const { updateQuantity, removeProduct } = useCartStore();

  const handleQuantityChange = (newQty: number) => {
    if (newQty <= 0) {
      setIsRemoving(true);
      setTimeout(() => {
        removeProduct(product.cartId);
      }, 200);
    } else {
      updateQuantity(product.cartId, newQty);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeProduct(product.cartId);
    }, 200);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderVariantDisplay = () => {
    if (!showVariants || !product.selectedVariants) return null;

    const variants = Object.values(product.selectedVariants);
    if (variants.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
        {variants.map((variant) => (
          <span
            key={`${variant.variant_type_id}-${variant.variant_id}`}
            className="bg-muted px-2 py-1 rounded"
          >
            {variant.variant_name}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex gap-3 p-3 border-b last:border-b-0 transition-all duration-200",
        isRemoving && "opacity-50 scale-95",
        className
      )}
    >
      {showImage && (
        <div className="shrink-0">
          <div
            className={cn(
              "relative overflow-hidden rounded border bg-muted",
              compact ? "h-12 w-12" : "h-16 w-16"
            )}
          >
            <Image
              src={product.image_url || product.images?.[0] || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes={compact ? "48px" : "64px"}
            />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-medium truncate",
                compact ? "text-sm" : "text-base"
              )}
            >
              {product.name}
            </h3>
            {renderVariantDisplay()}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-semibold text-sm">
              {formatPrice(product.price)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              aria-label="Remove item from cart"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Qty:</span>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(product.qty - 1)}
                className="h-7 w-7 p-0"
                disabled={product.qty <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-3 text-sm font-medium min-w-8 text-center">
                {product.qty}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(product.qty + 1)}
                className="h-7 w-7 p-0"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="text-sm font-medium">
            {formatPrice(product.price * product.qty)}
          </div>
        </div>
      </div>
    </div>
  );
}
