"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { GridContainer } from "../../../components/core";
import { AuroraProductCard } from "../../../components/cards";
import SectionHeader from "./section-header";
import ViewAllButton from "../../../../../../components/shared/view-all-button";
import type { Product } from "@/stores/productsStore";

interface AuroraFeaturedProductsSectionProps {
  setSelectedProduct: (product: Product | null) => void;
  navigateProductDetails: (id: number | string) => void;
}

export function AuroraFeaturedProductsSection({
  setSelectedProduct,
  navigateProductDetails,
}: AuroraFeaturedProductsSectionProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();

  const baseUrl = shopDetails?.baseUrl || "";
  // Use selected_inventories for featured products section (matches old Aurora theme)
  const featuredProducts: Product[] = (
    (shopDetails?.shop_theme?.selected_inventories as unknown as Product[]) ||
    []
  ).slice(0, 8);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="px-4 md:px-0">
      <SectionHeader text={t("featured_products")}  className="mb-12 md:mb-16 xl:mb-21"/>

      <GridContainer>
        {featuredProducts.map((product) => (
          <AuroraProductCard
            key={product.id}
            product={product}
            onSelectProduct={() => setSelectedProduct(product)}
            onNavigate={() => navigateProductDetails(product.id)}
          />
        ))}
      </GridContainer>

      <ViewAllButton link={`${baseUrl}/products`} text={t("view_more")} />
    </div>
  );
}

export default AuroraFeaturedProductsSection;
