"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, MessagesSquare, Tags, Truck } from "lucide-react";

export function TrustFeaturesBar() {
  const { t } = useTranslation();

  const trustFeatures = [
    {
      icon: ShieldCheck,
      title: t("shop_with_confidence") || "Shop with Confidence",
      description:
        t("trusted_by_happy_customers") || "Trusted by happy customers",
    },
    {
      icon: MessagesSquare,
      title: t("best_deals_fast_delivery") || "Best Deals, Fast Delivery",
      description: t("express_shipping") || "Express shipping available",
    },
    {
      icon: Tags,
      title: t("trusted_online_store") || "Trusted Online Store",
      description:
        t("quality_products_expert_support") ||
        "Quality products & expert support",
    },
    {
      icon: Truck,
      title: t("shop_smart_save_more") || "Shop Smart, Save More",
      description:
        t("exclusive_deals_top_quality") || "Exclusive deals & top quality",
    },
  ];

  return (
    <div className="bg-black text-white">
      <div className="container py-10">
        <div className="flex flex-col w-auto sm:flex-row sm:flex-wrap lg:flex-nowrap items-center justify-center sm:justify-between gap-6 sm:gap-8 lg:gap-10">
          {trustFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 sm:gap-4 lg:gap-5 w-fit sm:w-[calc(50%-1rem)] lg:w-auto lg:flex-1 max-w-sm sm:max-w-none"
              >
                <div className="shrink-0">
                  <Icon
                    className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base mb-1 text-white">
                    {feature.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-normal text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TrustFeaturesBar;
