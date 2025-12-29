"use client";

import { CommonCheckoutForm } from "@/components/features/checkout/common-checkout-form";
import { useLandingStore } from "@/stores/landingStore";

interface GripCheckoutFormProps {
  onOrderPlaced?: (orderId: string, trackLink?: string) => void;
}

export function GripCheckoutForm({ onOrderPlaced }: GripCheckoutFormProps) {
  const { setOrderPlaced, orderPlaced } = useLandingStore();

  // If order is placed, don't show the form
  if (orderPlaced) {
    return null;
  }

  // Handle order completion - update landing store to show order status
  const handleOrderComplete = (result: {
    orderId: string;
    trackLink?: string;
    receiptUrl?: string;
  }) => {
    // Update landing store to show order status
    setOrderPlaced(result.orderId, result.trackLink);

    // Call parent callback if provided
    if (onOrderPlaced) {
      onOrderPlaced(result.orderId, result.trackLink);
    }

    // Scroll to top to show the order status
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="checkout-form-section"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:pt-16 lg:pt-24 xl:pt-28"
    >
      <div className="border border-[#00000041] dark:border-gray-400 rounded-2xl px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-8">
        {/* Section Header */}
        <h2 className="text-2xl lg:text-3xl max-w-2xl mx-auto dark:text-white font-bold text-center mb-6 lg:mb-8">
          To place your order, please complete the form below with accurate
          information.
        </h2>

        {/* Checkout Form */}
        <CommonCheckoutForm
          preventRedirect
          onOrderComplete={handleOrderComplete}
          showVariantSelector={true}
        />
      </div>
    </section>
  );
}

export default GripCheckoutForm;
