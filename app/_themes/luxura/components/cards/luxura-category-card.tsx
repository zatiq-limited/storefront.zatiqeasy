"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
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
  isOnSale = true,
  className,
}: LuxuraCategoryCardProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <Link
      href={`${baseUrl}/categories/${id}?selected_category=${id}&category_id=${id}`}
      className={cn(
        "flex flex-col items-center justify-center aspect-square shadow-lg relative",
        className
      )}
    >
      {/* Image */}
      <FallbackImage
        src={image_url ?? ""}
        alt={name}
        height={100}
        width={140}
        className="w-full rounded-lg object-cover aspect-square"
      />
      {/* Bottom Overlay with Category Name */}
      <div className="absolute bottom-0 w-full bg-blue-zatiq/75 px-3 py-2 md:px-5 md:py-3 lg:py-4 lg:px-6 rounded-lg">
        <h3 className="text-white text-sm sm:text-base lg:text-lg font-medium">
          {isOnSale ? (
            <>
              {t("on_sale")} <br />
              <span className="line-clamp-1">{name}</span>
            </>
          ) : (
            <span className="line-clamp-1 text-center">{name}</span>
          )}
        </h3>
      </div>
    </Link>
  );
}

export default LuxuraCategoryCard;
