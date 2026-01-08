"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { SelloraProductCard } from "../../../components/cards";
import type { Product } from "@/stores/productsStore";

interface FeaturedProductsSectionProps {
  setSelectedProduct: (product: Product | null) => void;
  navigateProductDetails: (id: number | string) => void;
}

export function FeaturedProductsSection({
  setSelectedProduct,
  navigateProductDetails,
}: FeaturedProductsSectionProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();

  const baseUrl = shopDetails?.baseUrl || "";

  // Get featured products from theme
  const featuredProducts = (shopDetails?.shop_theme as unknown as { selected_inventories?: Product[] })?.selected_inventories?.slice(0, 8) || [];

  if (featuredProducts.length === 0) return null;

  return (
    <div className="container py-10 sm:py-14">
      {/* Header with View All */}
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <h2
          className="text-2xl md:text-3xl font-semibold text-foreground"
          style={{ letterSpacing: "4%" }}
        >
          {t("new_arrival_sale") || "New Arrival Sale"}
        </h2>
        <Link
          href={`${baseUrl}/products`}
          className="flex items-center gap-2 text-sm md:text-base font-semibold text-foreground hover:text-blue-zatiq dark:hover:text-blue-zatiq transition-colors group"
        >
          {t("view_all")}
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {featuredProducts.map((product) => (
          <SelloraProductCard
            key={product.id}
            product={product}
            onNavigate={() => navigateProductDetails(product.id)}
            onSelectProduct={() => setSelectedProduct(product)}
          />
        ))}
      </div>
    </div>
  );
}

export default FeaturedProductsSection;
