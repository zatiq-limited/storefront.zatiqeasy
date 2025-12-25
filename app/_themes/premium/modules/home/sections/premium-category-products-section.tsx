"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { GridContainer } from "../../../components/core";
import { PremiumProductCard } from "../../../components/cards";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { Product } from "@/stores/productsStore";

interface CategoryProductsData {
  category_id: number;
  category_name: string;
  category_image?: string;
  products?: Product[];
  inventories?: Product[];
}

interface PremiumCategoryProductsSectionProps {
  setSelectedProduct: (product: Product | null) => void;
  navigateProductDetails: (id: number | string) => void;
}

export function PremiumCategoryProductsSection({
  setSelectedProduct,
  navigateProductDetails,
}: PremiumCategoryProductsSectionProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();

  const baseUrl = shopDetails?.baseUrl || "";

  // Get selected category inventories from shop theme
  const selectedCategoryInventories: CategoryProductsData[] =
    ((shopDetails?.shop_theme as unknown as { selected_category_inventories?: CategoryProductsData[] })?.selected_category_inventories) || [];

  if (selectedCategoryInventories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12 md:space-y-16">
      {selectedCategoryInventories.map((categoryData) => {
        const products = categoryData.products || categoryData.inventories || [];

        if (products.length === 0) return null;

        return (
          <div key={categoryData.category_id}>
            {/* Category Banner (if available) */}
            {categoryData.category_image && (
              <div className="relative h-32 md:h-40 lg:h-48 rounded-xl overflow-hidden mb-6">
                <FallbackImage
                  src={categoryData.category_image}
                  alt={categoryData.category_name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-white px-6">
                    {categoryData.category_name}
                  </h2>
                </div>
              </div>
            )}

            {/* Section Header (if no banner) */}
            {!categoryData.category_image && (
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  {categoryData.category_name}
                </h2>
                <Link
                  href={`${baseUrl}/categories/${categoryData.category_id}?selected_category=${categoryData.category_id}`}
                  className="hidden md:flex items-center gap-1 text-blue-zatiq hover:text-blue-600 font-medium text-sm transition-colors"
                >
                  {t("view_all")}
                  <ChevronRight size={18} />
                </Link>
              </div>
            )}

            {/* Products Grid */}
            <GridContainer columns={{ mobile: 2, tablet: 3, desktop: 5 }}>
              {products.slice(0, 10).map((product) => (
                <PremiumProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={() => setSelectedProduct(product)}
                  onNavigate={() => navigateProductDetails(product.id)}
                />
              ))}
            </GridContainer>

            {/* View All Button (Mobile) */}
            <div className="mt-4 md:hidden">
              <Link
                href={`${baseUrl}/categories/${categoryData.category_id}?selected_category=${categoryData.category_id}`}
                className="block w-full text-center py-3 bg-blue-zatiq text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t("view_all")} {categoryData.category_name}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PremiumCategoryProductsSection;
