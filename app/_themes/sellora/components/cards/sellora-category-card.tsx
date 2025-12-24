"use client";

import React from "react";
import Link from "next/link";
import { useShopStore } from "@/stores/shopStore";
import { FallbackImage } from "@/components/ui/fallback-image";

interface Category {
  id: number | string;
  name: string;
  image_url?: string;
}

interface SelloraCategoryCardProps {
  category: Category;
}

export function SelloraCategoryCard({ category }: SelloraCategoryCardProps) {
  const { shopDetails } = useShopStore();
  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <Link
      href={`${baseUrl}/categories/${category.id}?selected_category=${category.id}`}
      className="group relative block overflow-hidden rounded-lg aspect-[4/5]"
    >
      {/* Background Image */}
      <FallbackImage
        src={category.image_url || ""}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Category Name */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-semibold text-white text-base md:text-lg">
          {category.name}
        </h3>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-blue-zatiq/0 group-hover:bg-blue-zatiq/20 transition-colors duration-300" />
    </Link>
  );
}

export default SelloraCategoryCard;
