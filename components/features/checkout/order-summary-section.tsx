"use client";

import { useCartStore, useCheckoutStore } from "@/stores";
import { useCartTotals } from "@/hooks";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OrderSummarySectionProps {
  className?: string;
  deliveryCharge?: number;
  taxAmount?: number;
}

export function OrderSummarySection({
  className,
  deliveryCharge = 0,
  taxAmount = 0,
}: OrderSummarySectionProps) {
  // Get cart totals using the custom hook (prevents infinite loop)
  const { products, totalPrice: subtotal, totalProducts } = useCartTotals();

  const { discountAmount, selectedPaymentMethod } = useCheckoutStore();

  // Convert products object to array for calculations
  const cartProducts = Object.values(products);

  const grandTotal = subtotal + deliveryCharge + taxAmount - discountAmount;

  // Alias for consistency with the variable name used in the component
  const totalItems = totalProducts;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPaymentMethodLabel = () => {
    const labels: Record<string, string> = {
      cod: "Cash on Delivery",
      bkash: "bKash Payment",
      aamarpay: "AamarPay",
      partial_payment: "Partial Payment",
      self_mfs: "Mobile Banking",
    };
    return labels[selectedPaymentMethod] || selectedPaymentMethod;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items Summary */}
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </div>

          {cartProducts.slice(0, 3).map((product) => (
            <div key={product.cartId} className="flex justify-between text-sm">
              <span className="truncate flex-1 mr-2">
                {product.name} {product.qty > 1 && `(${product.qty}x)`}
              </span>
              <span className="font-medium whitespace-nowrap">
                {formatPrice(product.price * product.qty)}
              </span>
            </div>
          ))}

          {cartProducts.length > 3 && (
            <div className="text-sm text-muted-foreground">
              +{cartProducts.length - 3} more items
            </div>
          )}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {deliveryCharge > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Charge</span>
              <span>{formatPrice(deliveryCharge)}</span>
            </div>
          )}

          {taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(taxAmount)}</span>
            </div>
          )}

          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatPrice(grandTotal)}</span>
        </div>

        {/* Payment Method */}
        <div className="pt-2">
          <div className="text-sm text-muted-foreground mb-1">Payment Method</div>
          <div className="text-sm font-medium">{getPaymentMethodLabel()}</div>
        </div>

        {/* Notes */}
        {selectedPaymentMethod === "cod" && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
            You will pay {formatPrice(grandTotal)} when you receive your order.
          </div>
        )}

        {selectedPaymentMethod === "partial_payment" && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
            You can pay a portion now and the rest on delivery.
          </div>
        )}
      </CardContent>
    </Card>
  );
}