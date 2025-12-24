"use client";

import React from "react";
import Link from "next/link";
import { useShopStore } from "@/stores/shopStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { cn } from "@/lib/utils";

interface LuxuraCategoryCardProps {
  id: number | string;
  name: string;
  image_url?: string;
  isOnSale?: boolean;
  className?: string;
}

export function LuxuraCategoryCard({
  id,
  name,
  image_url,
  isOnSale,
  className,
}: LuxuraCategoryCardProps) {
  const { shopDetails } = useShopStore();
  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <Link
      href={`${baseUrl}/categories/${id}?selected_category=${id}`}
      className={cn(
        "group relative block rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-[420/360]",
        className
      )}
    >
      {/* Image */}
      {image_url ? (
        <FallbackImage
          src={image_url}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* On Sale Badge */}
      {isOnSale && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          On Sale
        </div>
      )}

      {/* Category Name */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white text-lg md:text-xl font-bold line-clamp-2">
          {name}
        </h3>
      </div>
    </Link>
  );
}

export default LuxuraCategoryCard;
