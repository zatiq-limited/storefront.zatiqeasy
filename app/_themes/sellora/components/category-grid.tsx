"use client";

import Link from "next/link";
import { FallbackImage } from "@/components/ui/fallback-image";
import { useShopStore } from "@/stores/shopStore";

type CategoryGridProps = {
  category: {
    id: number | string;
    name: string;
    image_url?: string | null;
  };
};

export function CategoryGrid({ category }: CategoryGridProps) {
  const { shopDetails } = useShopStore();
  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <Link
      href={`${baseUrl}/categories/${category.id}`}
      className="group relative overflow-hidden aspect-[1/1.3] rounded-none shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Category Image */}
      <FallbackImage
        src={category?.image_url ?? "/images/default.webp"}
        alt={category?.name}
        width={386}
        height={502}
        className="w-full h-full object-top object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Category Name */}
      <div className="absolute inset-0 flex items-end justify-center bottom-5 sm:bottom-8">
        <h3
          className="text-white text-2xl md:text-3xl font-normal px-4 text-center drop-shadow-lg"
          style={{ letterSpacing: "4%" }}
        >
          {category?.name}
        </h3>
      </div>
    </Link>
  );
}

export default CategoryGrid;
