"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { GridContainer } from "../../../components/core";
import { LuxuraProductCard } from "../../../components/cards";
import { SectionHeader } from "./section-header";
import type { Product } from "@/stores/productsStore";

interface LuxuraNewArrivalsSectionProps {
  setSelectedProduct: (product: Product | null) => void;
  navigateProductDetails: (id: number | string) => void;
}

export function LuxuraNewArrivalsSection({
  setSelectedProduct,
  navigateProductDetails,
}: LuxuraNewArrivalsSectionProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();

  // Get new arrivals from shop theme
  const newArrivals: Product[] =
    (shopDetails?.shop_theme?.new_arrival_inventories as unknown as Product[])?.slice(0, 8) ||
    [];

  if (newArrivals.length === 0) {
    return null;
  }

  return (
    <div className="w-[95%] md:w-[90%] lg:w-[78%] mx-auto">
      <SectionHeader
        text={t("new_arrivals")}
        link="/products"
      />

      <GridContainer>
        {newArrivals.map((product) => (
          <LuxuraProductCard
            key={product.id}
            product={product}
            onSelectProduct={() => setSelectedProduct(product)}
            onNavigate={() => navigateProductDetails(product.id)}
          />
        ))}
      </GridContainer>
    </div>
  );
}

export default LuxuraNewArrivalsSection;
