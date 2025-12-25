"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { GridContainer } from "../../../components/core";
import { LuxuraProductCard } from "../../../components/cards";
import { SectionHeader } from "./section-header";
import type { Product } from "@/stores/productsStore";

interface SelectedCategoryInventory {
  category_id: number;
  category_name: string;
  products?: Product[];
  inventories?: Product[];
}

interface LuxuraSelectedProductsByCategorySectionProps {
  setSelectedProduct: (product: Product | null) => void;
  navigateProductDetails: (id: number | string) => void;
}

export function LuxuraSelectedProductsByCategorySection({
  setSelectedProduct,
  navigateProductDetails,
}: LuxuraSelectedProductsByCategorySectionProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();

  const baseUrl = shopDetails?.baseUrl || "";

  // Get selected category inventories from shop theme
  const selectedCategoryInventories: SelectedCategoryInventory[] =
    ((shopDetails?.shop_theme as unknown as { selected_category_inventories?: SelectedCategoryInventory[] })?.selected_category_inventories) || [];

  if (selectedCategoryInventories.length === 0) {
    return null;
  }

  return (
    <div className="w-[95%] md:w-[90%] lg:w-[78%] mx-auto flex flex-col gap-[36px] md:gap-[60px] xl:gap-[84px]">
      {selectedCategoryInventories.map((categoryData) => {
        const products = categoryData.products || categoryData.inventories || [];

        if (products.length === 0) return null;

        return (
          <div key={categoryData.category_id}>
            <SectionHeader
              text={categoryData.category_name}
              viewAllLink={`${baseUrl}/categories/${categoryData.category_id}?selected_category=${categoryData.category_id}`}
              showViewAll={true}
            />

            <GridContainer>
              {products.slice(0, 8).map((product) => (
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
      })}
    </div>
  );
}

export default LuxuraSelectedProductsByCategorySection;
