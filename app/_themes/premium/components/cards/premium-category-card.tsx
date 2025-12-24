"use client";

import React from "react";
import Link from "next/link";
import { useShopStore } from "@/stores/shopStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { cn } from "@/lib/utils";

interface Category {
  id: number | string;
  name: string;
  image_url?: string;
}

interface PremiumCategoryCardProps {
  category: Category;
  isLarge?: boolean; // For featured category 2x2 grid
  className?: string;
}

export function PremiumCategoryCard({
  category,
  isLarge = false,
  className,
}: PremiumCategoryCardProps) {
  const { shopDetails } = useShopStore();
  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <Link
      href={`${baseUrl}/categories/${category.id}?selected_category=${category.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl",
        isLarge ? "aspect-square" : "aspect-[3/4]",
        className
      )}
    >
      {/* Background Image */}
      <FallbackImage
        src={category.image_url || ""}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Category Name */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className={cn(
          "font-bold text-white",
          isLarge ? "text-xl md:text-2xl" : "text-base md:text-lg"
        )}>
          {category.name}
        </h3>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-blue-zatiq/0 group-hover:bg-blue-zatiq/20 transition-colors duration-300" />
    </Link>
  );
}

export default PremiumCategoryCard;
