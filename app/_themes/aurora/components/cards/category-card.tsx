"use client";

import React from "react";
import Link from "next/link";
import { FallbackImage } from "@/components/ui/fallback-image";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  link: string;
  imgUrl: string;
  name: string;
  className?: string;
}

export function CategoryCard({ link, imgUrl, name, className }: CategoryCardProps) {
  return (
    <Link
      href={link}
      className={cn(
        "flex flex-col items-center justify-center relative aspect-square xl:h-[310px] group",
        className
      )}
    >
      {/* Category Image */}
      <FallbackImage
        src={imgUrl || ""}
        alt={name || "Category"}
        height={310}
        width={310}
        className="w-full rounded-lg lg:rounded-none object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
      />

      {/* Category Name Overlay */}
      <div className="absolute left-3 right-3 bottom-3 w-auto bg-black/75 p-2 md:p-3 lg:p-4 rounded-lg lg:rounded-none transition-all duration-300 group-hover:bg-blue-zatiq">
        <h3 className="text-center text-white text-sm sm:text-base lg:text-lg font-bold truncate">
          {name}
        </h3>
      </div>
    </Link>
  );
}

export default CategoryCard;
