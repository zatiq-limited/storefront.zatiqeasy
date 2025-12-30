"use client";

import React from "react";
import Link from "next/link";
import { useShopStore } from "@/stores/shopStore";
import { FallbackImage } from "@/components/ui/fallback-image";

interface LandingNavbarProps {
  className?: string;
}

export function LandingNavbar({ className = "" }: LandingNavbarProps) {
  const { shopDetails } = useShopStore();

  const shopName = shopDetails?.shop_name || "Store";
  const logoUrl = shopDetails?.image_url;
  const baseUrl = shopDetails?.baseUrl || "/";

  return (
    <nav
      className={`w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 md:h-20">
          {/* Logo */}
          <Link href={baseUrl} className="flex items-center gap-2">
            {logoUrl ? (
              <FallbackImage
                src={logoUrl}
                alt={shopName}
                width={120}
                height={48}
                className="h-10 md:h-12 w-auto object-contain"
              />
            ) : (
              <span className="text-xl md:text-2xl font-bold text-foreground">
                {shopName}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;
