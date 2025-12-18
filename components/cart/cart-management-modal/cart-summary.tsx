"use client";

import { useCartStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface CartSummaryProps {
  className?: string;
  showCheckoutButton?: boolean;
  checkoutButtonLabel?: string;
  onCheckout?: () => void;
  showDeliveryCharge?: boolean;
  deliveryCharge?: number;
}

export function CartSummary({
  className,
  showCheckoutButton = true,
  checkoutButtonLabel = "Proceed to Checkout",
  onCheckout,
  showDeliveryCharge = false,
  deliveryCharge = 0,
}: CartSummaryProps) {
  const subtotal = useCartStore(selectSubtotal);
  const totalItems = useCartStore(selectTotalItems);
  const cartIsEmpty = useCartStore(selectCartIsEmpty);

  const total = subtotal + deliveryCharge;

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
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        Your cart is empty
      </div>
    );
  }

  return (
    <div className={cn("p-4 space-y-4", className)}>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {showDeliveryCharge && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Charge</span>
              <span>{formatPrice(deliveryCharge)}</span>
            </div>
            <Separator />
          </>
        )}

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        <Button
          className="w-full"
          size="lg"
          onClick={onCheckout}
        >
          {checkoutButtonLabel}
        </Button>
      )}

      <div className="text-xs text-muted-foreground text-center">
        Prices include all applicable taxes
      </div>
    </div>
  );
}