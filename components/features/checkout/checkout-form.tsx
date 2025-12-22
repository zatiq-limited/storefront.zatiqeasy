"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, useCheckoutStore, selectCartProducts, selectSubtotal } from "@/stores";
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
import { createOrder } from "@/lib/payments/api";
import { PaymentType, OrderStatus } from "@/lib/payments/types";
import { validatePhoneNumber } from "@/lib/payments/utils";

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
      // Get checkout data from store
      const checkoutState = useCheckoutStore.getState();

      // Validate required fields
      if (!checkoutState.customerName || !checkoutState.fullPhoneNumber || !checkoutState.fullAddress) {
        throw new Error('Please fill in all required fields');
      }

      if (!validatePhoneNumber(checkoutState.fullPhoneNumber)) {
        throw new Error('Please enter a valid phone number');
      }

      if (cartProducts.length === 0) {
        throw new Error('Your cart is empty');
      }

      // Prepare order items (matching old project structure)
      const receiptItems = cartProducts.map(item => {
        // Get variant info from selectedVariants
        const variantValues = Object.values(item.selectedVariants || {});
        const firstVariant = variantValues[0];
        const variantNames = variantValues.map(v => v.variant_name).join(', ');

        return {
          name: item.name,
          price: item.price * item.qty,
          image_url: item.image_url,
          inventory_id: item.id,
          qty: item.qty,
          variants: item.selectedVariants ? Object.values(item.selectedVariants)
            .filter(v => v?.variant_type_id && v?.variant_id)
            .map(v => ({
              variant_type_id: v!.variant_type_id,
              variant_id: v!.variant_id,
            })) : [],
        };
      });

      // Convert payment method string to PaymentType enum
      const paymentMethodToType = (method: string): PaymentType => {
        const mapping: Record<string, PaymentType> = {
          'cod': PaymentType.COD,
          'bkash': PaymentType.BKASH,
          'nagad': PaymentType.NAGAD,
          'aamarpay': PaymentType.AAMARPAY,
          'self_mfs': PaymentType.SELF_MFS,
        };
        return mapping[method] || PaymentType.COD;
      };

      // Create order payload (exact match to old project)
      const orderPayload = {
        shop_id: 1, // This should come from shop context
        customer_name: checkoutState.customerName,
        customer_phone: checkoutState.fullPhoneNumber,
        customer_address: checkoutState.fullAddress,
        delivery_charge: deliveryCharge,
        tax_amount: 0,
        total_amount: grandTotal,
        payment_type: paymentMethodToType(checkoutState.selectedPaymentMethod || 'cod'),
        pay_now_amount: grandTotal,
        receipt_items: receiptItems,
        type: "Online" as const,
        status: OrderStatus.ORDER_PLACED,
        note: orderNote,
      };

      // Create order (API call to match old project)
      const response = await createOrder(orderPayload);

      if (response.success && response.data) {
        // Clear cart on successful order (matching old project)
        useCartStore.getState().clearCart();

        // Handle payment redirect (exact match to old project)
        if (response.data.payment_url) {
          // For gateway payments (bKash, Nagad, AamarPay)
          // This matches: window.location.replace(deriptedData.payment_url)
          console.log('Redirecting to payment:', response.data.payment_url);
          window.location.replace(response.data.payment_url);
        } else if (response.data.receipt_url) {
          // For COD or successful orders
          router.push(`/payment-confirm?status=success&receipt_url=${response.data.receipt_url}`);
        } else {
          // Fallback to receipt page
          router.push(`/receipt/${response.data.receipt_id}`);
        }
      } else {
        throw new Error(response.error || 'Failed to create order');
      }

      if (onSubmit) {
        await onSubmit(orderPayload);
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.message || 'Failed to place order. Please try again.');
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