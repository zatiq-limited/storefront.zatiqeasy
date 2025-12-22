"use client";

import { UseFormRegister } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShoppingCart, Tag, Check } from "lucide-react";
import { useCheckoutStore } from "@/stores";

type OrderSummarySectionProps = {
  totalPrice: number;
  discountAmount: number;
  totaltax: number;
  deliveryCharge: number;
  grandTotal: number;
  country_currency: string;
  profile: any;
  promoCodeSearch: string;
  setPromoCodeSearch: (value: string) => void;
  promoCodeMessage: string;
  isPromoLoading: boolean;
  isLoading: boolean;
  shopId: string;
  promoCodeMutate: () => void;
  isFullOnlinePayment: boolean;
  handleChange: (field: string, value: any) => void;
  getPayNowAmount: () => number;
  selectedPaymentMethod: string;
  isAceeptTermsAndCondition: boolean;
  setIsAceeptTermsAndCondition: (value: boolean) => void;
  products: any;
  register: UseFormRegister<any>;
  showTermsError?: boolean;
  setShowTermsError?: (value: boolean) => void;
  isDisabled?: boolean;
};

export function OrderSummarySection({
  totalPrice,
  discountAmount,
  totaltax,
  deliveryCharge,
  grandTotal,
  country_currency,
  profile,
  promoCodeSearch,
  setPromoCodeSearch,
  promoCodeMessage,
  isPromoLoading,
  isLoading,
  shopId,
  promoCodeMutate,
  isFullOnlinePayment,
  handleChange,
  getPayNowAmount,
  selectedPaymentMethod,
  isAceeptTermsAndCondition,
  setIsAceeptTermsAndCondition,
  products,
  register,
  showTermsError,
  setShowTermsError,
  isDisabled = false,
}: OrderSummarySectionProps) {
  // Convert products object to array for calculations
  const cartProducts = Object.values(products || {});
  const totalItems: number = cartProducts.reduce((sum: number, item: any) => sum + (item.qty || 1), 0);

  // Check if promo code is enabled
  const isPromoCodeEnabled = true; // Can be configurable from shop settings

  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: country_currency || "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPaymentMethodLabel = () => {
    const labels: Record<string, string> = {
      cod: "Cash on Delivery",
      bkash: "bKash Payment",
      nagad: "Nagad",
      aamarpay: "AamarPay",
      partial_payment: "Partial Payment",
      self_mfs: "Mobile Banking",
    };
    return labels[selectedPaymentMethod] || selectedPaymentMethod;
  };

  return (
    <div className={`sticky top-4 space-y-4 ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Items Summary */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </div>

            {cartProducts.slice(0, 3).map((product: any) => (
              <div key={product.cartId || product.id} className="flex justify-between text-sm">
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

          {/* Promo Code Section */}
          {isPromoCodeEnabled && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter promo code"
                    value={promoCodeSearch}
                    onChange={(e) => setPromoCodeSearch(e.target.value)}
                    className="pl-10"
                    disabled={isPromoLoading}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={promoCodeMutate}
                  disabled={!promoCodeSearch || isPromoLoading}
                  className="whitespace-nowrap"
                >
                  {isPromoLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
              {promoCodeMessage && (
                <div className={cn(
                  "text-xs px-2 py-1 rounded",
                  promoCodeMessage.includes("successfully") || promoCodeMessage.includes("applied")
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                  {promoCodeMessage}
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            {deliveryCharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Charge</span>
                <span>{formatPrice(deliveryCharge)}</span>
              </div>
            )}

            {totaltax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(totaltax)}</span>
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

          {/* Order Notes */}
          <div className="space-y-2">
            <label htmlFor="order_note" className="text-sm font-medium">
              Order Notes (Optional)
            </label>
            <textarea
              id="order_note"
              placeholder="Any special instructions for your order..."
              {...register("order_note")}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading || isDisabled}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : selectedPaymentMethod === "cod" ? (
          "Place Order"
        ) : isFullOnlinePayment ? (
          `Pay ${formatPrice(getPayNowAmount())}`
        ) : (
          `Pay ${formatPrice(getPayNowAmount())} Now`
        )}
      </Button>

      <div className="text-xs text-muted-foreground text-center">
        By placing this order, you confirm that you have read and agree to our terms.
      </div>
    </div>
  );
}