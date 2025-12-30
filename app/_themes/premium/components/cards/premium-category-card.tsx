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
  isLarge?: boolean;
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
      href={`${baseUrl}/categories/${category.id}`}
      className={cn(
        "flex flex-col items-center justify-center relative aspect-square",
        isLarge ? "xl:h-[640px] xl:col-span-2 xl:row-span-2" : "xl:h-[310px]",
        className
      )}
    >
      <FallbackImage
        src={category.image_url || ""}
        alt={category.name}
        height={100}
        width={140}
        className="w-full rounded-lg lg:rounded-none object-cover aspect-square"
      />
      <div className="absolute bottom-0 w-full bg-linear-to-t from-black/50 to-transparent pt-5 pl-3 lg:pl-6 pb-2 lg:pb-3 rounded-lg lg:rounded-none">
        <h3 className="bottom-2 lg:bottom-3 text-white text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}

export default PremiumCategoryCard;
