"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { GridContainer } from "../../../components/core";
import { AuroraProductCard } from "../../../components/cards";
import SectionHeader from "./section-header";
import ViewAllButton from "../../../../../../components/shared/view-all-button";
import type { Product } from "@/stores/productsStore";

interface AuroraOnSaleSectionProps {
  setSelectedProduct: (product: Product | null) => void;
  navigateProductDetails: (id: number | string) => void;
}

export function AuroraOnSaleSection({
  setSelectedProduct,
  navigateProductDetails,
}: AuroraOnSaleSectionProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();

  const baseUrl = shopDetails?.baseUrl || "";
  const onSaleProducts: Product[] = (
    (shopDetails?.shop_theme?.on_sale_inventories as unknown as Product[]) || []
  ).slice(0, 8);

  if (onSaleProducts.length === 0) {
    return null;
  }

  return (
    <div className="px-4 md:px-0">
      <SectionHeader text={t("on_sale")} />

      <GridContainer>
        {onSaleProducts.map((product) => (
          <AuroraProductCard
            key={product.id}
            product={product}
            onSelectProduct={() => setSelectedProduct(product)}
            onNavigate={() => navigateProductDetails(product.id)}
            isSale
          />
        ))}
      </GridContainer>

      <ViewAllButton link={`${baseUrl}/products`} text={t("view_more")} />
    </div>
  );
}

export default AuroraOnSaleSection;
