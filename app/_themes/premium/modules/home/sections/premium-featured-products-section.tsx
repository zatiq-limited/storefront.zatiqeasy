"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { PremiumProductCard } from "../../../components/cards";
import { SectionHeader } from "./section-header";
import { ViewAllButton } from "./view-all-button";
import type { Product } from "@/stores/productsStore";

interface PremiumFeaturedProductsSectionProps {
  products?: Product[];
  setSelectedProduct: (product: Product | null) => void;
  navigateProductDetails: (id: number | string) => void;
  title?: string;
}

export function PremiumFeaturedProductsSection({
  products,
  setSelectedProduct,
  navigateProductDetails,
  title = "featured_products",
}: PremiumFeaturedProductsSectionProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();

  const baseUrl = shopDetails?.baseUrl || "";

  // Use provided products or get from shop theme
  const featuredProducts: Product[] = products ||
    ((shopDetails?.shop_theme as unknown as { selected_inventories?: Product[] })?.selected_inventories?.slice(0, 10)) ||
    [];

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[24px] lg:gap-[44px]">
      <SectionHeader
        title={t(title)}
        buttonLink={`${baseUrl}/products`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
        {featuredProducts.map((product) => (
          <PremiumProductCard
            key={product.id}
            product={product}
            onSelectProduct={() => setSelectedProduct(product)}
            onNavigate={() => navigateProductDetails(product.id)}
          />
        ))}
      </div>

      <ViewAllButton
        button_text={t("view_all_products")}
        button_link={`${baseUrl}/products`}
      />
    </div>
  );
}

export default PremiumFeaturedProductsSection;
