"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, useCheckoutStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ContactSection } from "./contact-section";
import { ShippingAddressSection } from "./shipping-address-section";
import { DeliveryZoneSection } from "./delivery-zone-section";
import { PaymentOptionsSection } from "./payment-options-section";
import { OrderSummarySection } from "./order-summary-section";
import { Loader2, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutFormProps {
  className?: string;
  onSubmit?: (orderData: any) => void;
}

export function CheckoutForm({ className, onSubmit }: CheckoutFormProps) {
  const router = useRouter();
  const cartProducts = useCartStore(selectCartProducts);
  const subtotal = useCartStore(selectSubtotal);
  const { acceptedTerms, setAcceptedTerms } = useCheckoutStore();

  const [orderNote, setOrderNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple delivery charge calculation (this should be more sophisticated in production)
  const calculateDeliveryCharge = () => {
    const { selectedDeliveryZone } = useCheckoutStore.getState();
    const charges: Record<string, number> = {
      "Inside City": 50,
      "Suburb": 80,
      "Outside City": 120,
      "Others": 150,
    };
    return charges[selectedDeliveryZone] || 150;
  };

  const deliveryCharge = calculateDeliveryCharge();
  const grandTotal = subtotal + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Gather order data
      const orderData = {
        items: cartProducts,
        subtotal,
        deliveryCharge,
        grandTotal,
        note: orderNote,
        acceptedTerms,
        // Add other checkout store data as needed
        ...useCheckoutStore.getState(),
      };

      if (onSubmit) {
        await onSubmit(orderData);
      } else {
        // Default behavior: proceed to payment confirmation
        // In a real app, you'd submit this to your API
        console.log("Order data:", orderData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Navigate to payment confirmation
        router.push("/payment-confirm");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadyToCheckout = () => {
    const {
      fullPhoneNumber,
      selectedDivision,
      selectedDistrict,
      selectedUpazila,
      selectedPaymentMethod,
      acceptedTerms,
    } = useCheckoutStore.getState();

    return (
      cartProducts.length > 0 &&
      fullPhoneNumber.length >= 10 &&
      selectedDivision &&
      selectedDistrict &&
      selectedUpazila &&
      selectedPaymentMethod &&
      acceptedTerms
    );
  };

  if (cartProducts.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-4">
          Add some products to your cart to proceed with checkout
        </p>
        <Button onClick={() => router.push("/shop")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <ContactSection />
          <ShippingAddressSection />
          <DeliveryZoneSection />
          <PaymentOptionsSection />

          {/* Order Notes */}
          <div className="space-y-2">
            <label htmlFor="order-note" className="text-sm font-medium">
              Order Notes (Optional)
            </label>
            <Textarea
              id="order-note"
              placeholder="Any special instructions for your order..."
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2 p-4 bg-muted/50 rounded-lg">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            />
            <div className="space-y-1">
              <label
                htmlFor="terms"
                className="text-sm font-medium cursor-pointer"
              >
                I agree to the Terms and Conditions
              </label>
              <p className="text-xs text-muted-foreground">
                By placing this order, you agree to our{" "}
                <a href="/terms" className="underline hover:text-foreground">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline hover:text-foreground">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <OrderSummarySection deliveryCharge={deliveryCharge} />

            <Separator className="my-6" />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!isReadyToCheckout() || isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              By placing this order, you confirm that you have read and agree to our terms.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}