"use client";

import React from "react";
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
      className="py-10 md:py-16 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Complete Your Order
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Fill in your details below to place your order
          </p>
        </div>

        {/* Checkout Form */}
        <div className="max-w-6xl mx-auto">
          <CommonCheckoutForm
            preventRedirect
            onOrderComplete={handleOrderComplete}
          />
        </div>
      </div>
    </section>
  );
}

export default GripCheckoutForm;
