"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { SelloraCategoryCard } from "../../../components/cards";

interface Category {
  id: number | string;
  name: string;
  image_url?: string;
}

export function OurCollectionSection() {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();

  const baseUrl = shopDetails?.baseUrl || "";

  // Get selected categories from theme
  const categories = (shopDetails?.shop_theme as unknown as { selected_categories?: Category[] })?.selected_categories?.slice(0, 6) || [];

  if (categories.length === 0) return null;

  return (
    <div className="container py-10 sm:py-14">
      {/* Header with View All */}
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <h2
          className="text-2xl md:text-3xl font-semibold text-foreground"
          style={{ letterSpacing: "4%" }}
        >
          {t("our_collections") || "Our Collections"}
        </h2>
        <Link
          href={`${baseUrl}/categories`}
          className="flex items-center gap-2 text-sm md:text-base font-semibold text-foreground hover:text-blue-zatiq dark:hover:text-blue-zatiq transition-colors group"
        >
          {t("view_all")}
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
        {categories.map((category) => (
          <SelloraCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

export default OurCollectionSection;
