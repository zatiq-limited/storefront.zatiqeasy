"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";

// Dynamic imports for checkout components
const CheckoutForm = dynamic(
  () => import("@/components/features/checkout/common-checkout-form").then(mod => ({ default: mod.CommonCheckoutForm })),
  { ssr: false }
);

const OrderStatus = dynamic(
  () => import("@/components/features/checkout/common-checkout-cart-details").then(mod => ({ default: mod.CommonCheckoutCartDetails })),
  { ssr: false }
);

// Aurora Page Header Component
function AuroraPageHeader({
  titleElement,
  className,
}: {
  titleElement: string;
  className?: string;
}) {
  return (
    <h1
      className={`text-xl md:text-4xl xl:text-5xl leading-snug lg:leading-[57.50px] text-black dark:text-blue-zatiq font-bold ${className}`}
    >
      {titleElement}
    </h1>
  );
}

export function AuroraCheckout() {
  const { t } = useTranslation();

  return (
    <div className="pb-12 lg:pb-20 pt-6 w-full mx-auto px-4 md:px-0">
      {/* Page Header */}
      <AuroraPageHeader titleElement={t("place_order")} className="mb-6" />

      {/* Checkout Form */}
      <CheckoutForm />

      {/* Order Status (for tracking existing orders) */}
      <OrderStatus />
    </div>
  );
}

export default AuroraCheckout;
