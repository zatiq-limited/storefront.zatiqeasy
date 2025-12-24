"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { GridContainer } from "../../../components/core";
import { AuroraProductCard } from "../../../components/cards";
import SectionHeader from "./section-header";
import ViewAllButton from "./view-all-button";
import type { Product } from "@/stores/productsStore";

interface SelectedCategory {
  id: number;
  name: string;
  products?: Product[];
}

interface AuroraSelectedProductsSectionProps {
  setSelectedProduct: (product: Product | null) => void;
  navigateProductDetails: (id: number | string) => void;
}

export function AuroraSelectedProductsSection({
  setSelectedProduct,
  navigateProductDetails,
}: AuroraSelectedProductsSectionProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();

  const baseUrl = shopDetails?.baseUrl || "";
  const selectedCategories: SelectedCategory[] =
    (shopDetails?.shop_theme?.selected_categories as unknown as SelectedCategory[]) || [];

  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <div className="px-4 md:px-0 space-y-12 md:space-y-15 xl:space-y-28">
      {selectedCategories.map((category) => {
        const products = category.products?.slice(0, 8) || [];

        if (products.length === 0) {
          return null;
        }

        return (
          <div key={category.id}>
            <SectionHeader text={category.name} />

            <GridContainer>
              {products.map((product) => (
                <AuroraProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={() => setSelectedProduct(product)}
                  onNavigate={() => navigateProductDetails(product.id)}
                />
              ))}
            </GridContainer>

            <ViewAllButton
              link={`${baseUrl}/categories/${category.id}`}
              text={t("view_more")}
            />
          </div>
        );
      })}
    </div>
  );
}

export default AuroraSelectedProductsSection;
