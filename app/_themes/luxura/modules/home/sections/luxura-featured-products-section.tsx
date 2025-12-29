"use client";

import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { GridContainer } from "../../../components/core";
import { LuxuraProductCard } from "../../../components/cards";
import { SectionHeader } from "./section-header";
import type { Product } from "@/stores/productsStore";

interface LuxuraFeaturedProductsSectionProps {
  products?: Product[];
  setSelectedProduct: (product: Product | null) => void;
  navigateProductDetails: (id: number | string) => void;
  title?: string;
}

export function LuxuraFeaturedProductsSection({
  products,
  setSelectedProduct,
  navigateProductDetails,
  title = "featured_products",
}: LuxuraFeaturedProductsSectionProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();

  // Use provided products or get from shop theme
  const featuredProducts: Product[] = products ||
    ((shopDetails?.shop_theme as unknown as { selected_inventories?: Product[] })?.selected_inventories?.slice(0, 8)) ||
    [];

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="px-4 md:px-0">
      <SectionHeader
        text={t(title)}
        link="/products"
        viewMoreTextKey="view_all"
      />

      <GridContainer>
        {featuredProducts.map((product) => (
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

export default LuxuraFeaturedProductsSection;
