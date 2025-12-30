"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";
import { GridContainer } from "../../../components/core";
import { AuroraProductCard } from "../../../components/cards";
import { FallbackImage } from "@/components/ui/fallback-image";
import SectionHeader from "./section-header";
import ViewAllButton from "../../../../../../components/shared/view-all-button";
import type { Product } from "@/stores/productsStore";

interface SelectedCategory {
  id: number;
  name: string;
  banner_url?: string;
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
  const { products: allProducts } = useProductsStore();

  const baseUrl = shopDetails?.baseUrl || "";
  const selectedCategories: SelectedCategory[] =
    (shopDetails?.shop_theme
      ?.selected_categories as unknown as SelectedCategory[]) || [];

  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <div className="px-4 md:px-0">
      {selectedCategories.map((category, index) => {
        // Filter products that belong to this category
        const filteredProducts = allProducts.filter((product) =>
          product?.categories?.some((cat) => cat?.id === category?.id)
        );

        if (filteredProducts.length === 0) {
          return null;
        }

        return (
          <div
            key={category.id}
            className="w-full flex flex-col gap-12 md:gap-15 xl:gap-28 mt-12 md:mt-15 xl:mt-28 first:mt-0"
          >
            {/* Category Banner */}
            {category?.banner_url && (
              <div>
                <FallbackImage
                  src={category.banner_url}
                  alt={category.name}
                  height={380}
                  width={1300}
                  className="w-full aspect-335/150 md:aspect-1300/380 object-cover rounded-lg md:rounded-none"
                />
              </div>
            )}

            {/* Products Grid */}
            <div>
              <SectionHeader text={category.name} />

              <GridContainer>
                {filteredProducts.slice(0, 4).map((product) => (
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
          </div>
        );
      })}
    </div>
  );
}

export default AuroraSelectedProductsSection;
