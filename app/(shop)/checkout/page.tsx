"use client";

import Link from "next/link";
import { Shield, Truck, RefreshCw } from "lucide-react";
import { CommonCheckoutForm } from "@/components/features/checkout";
import { useTranslation } from "react-i18next";

export default function CheckoutPage() {
  const { t } = useTranslation();

  const trustBadges = [
    {
      icon: Shield,
      titleKey: "secure_payment",
      descriptionKey: "secure_payment_desc",
    },
    {
      icon: Truck,
      titleKey: "fast_delivery",
      descriptionKey: "fast_delivery_desc",
    },
    {
      icon: RefreshCw,
      titleKey: "easy_returns",
      descriptionKey: "easy_returns_desc",
    },
  ];

  return (
    <div className="container">
      {/* Header */}
      <div className="my-8">
        <h1 className="text-3xl font-bold">{t("checkout")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("complete_your_order")}
        </p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {trustBadges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-4 bg-muted/50 rounded-lg border-blue-zatiq/50 border`}
            >
              <Icon className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium text-sm">{t(badge.titleKey)}</div>
                <div className="text-xs text-muted-foreground">
                  {t(badge.descriptionKey)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Form */}
      <CommonCheckoutForm />

      {/* Footer Info */}
      <div className="my-12 pt-8 border-t text-center text-sm text-muted-foreground">
        {/* <p className="mb-2">
          {t("need_help")}{" "}
          <a href="tel:+8801234567890" className="text-primary hover:underline">
            +880 1234 567 890
          </a>
        </p> */}
        <p>
          {t("by_placing_order")}{" "}
          <Link href="/terms-and-conditions" className="text-primary hover:underline">
            {t("terms_of_service")}
          </Link>{" "}
          {t("and")}{" "}
          <Link href="/privacy-policy" className="text-primary hover:underline">
            {t("privacy_policy_link")}
          </Link>
        </p>
      </div>
    </div>
  );
}
