"use client";

import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { CommonCheckoutForm } from "@/components/features/checkout";
import PageHeader from "@/components/shared/page-header";

export default function MerchantCheckoutPage() {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const themeName = shopDetails?.shop_theme?.theme_name || "";

  // Only show PageHeader for Sellora theme
  const isSellora = themeName.toLowerCase() === "sellora";

  return (
    <main className="pb-12 lg:pb-21 pt-6 md:pt-9">
      <div className="container">
        {isSellora && (
          <PageHeader
            titleElement={t("place_order")}
            className="mb-6 md:mb-9"
          />
        )}
        <CommonCheckoutForm />
      </div>
    </main>
  );
}
