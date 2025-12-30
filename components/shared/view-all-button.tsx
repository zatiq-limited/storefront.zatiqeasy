"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getThemeData } from "@/lib/utils/theme-constants";
import { useShopStore } from "@/stores";

interface ViewAllButtonProps {
  link: string;
  text: string;
  className?: string;
}

export function ViewAllButton({ link, text, className }: ViewAllButtonProps) {
  const { shopDetails } = useShopStore();

  // Get theme data for fontFamily
  const themeData = getThemeData(shopDetails?.shop_theme?.theme_name);
  return (
    <div
      className={cn("flex justify-center mt-8", className)}
      style={{ fontFamily: themeData.secondaryFont || themeData.fontFamily }}
    >
      <Link
        href={link}
        className="px-6 py-3 border border-blue-zatiq text-blue-zatiq rounded-lg hover:bg-blue-zatiq hover:text-white transition-all duration-200 font-medium"
      >
        {text}
      </Link>
    </div>
  );
}

export default ViewAllButton;
