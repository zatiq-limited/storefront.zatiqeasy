"use client";

import { CommonCheckoutForm } from "@/components/features/checkout";

/**
 * Merchant Checkout Page
 * Uses the new CommonCheckoutForm matching the design from the old project
 */
export default function MerchantCheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CommonCheckoutForm />
    </div>
  );
}
