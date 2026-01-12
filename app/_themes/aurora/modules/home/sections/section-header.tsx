"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { getThemeData } from "@/lib/utils/theme-constants";
import { useShopStore } from "@/stores/shopStore";

interface SectionHeaderProps {
  text: string;
  className?: string;
}

export function SectionHeader({ text, className }: SectionHeaderProps) {
  const { shopDetails } = useShopStore();

  // Get theme data for fontFamily
  const themeData = getThemeData(shopDetails?.shop_theme?.theme_name);

  return (
    <h2
      className={cn(
        "text-center text-[38px] md:text-[64px] leading-snug",
        "text-[#4B5563] dark:text-blue-zatiq font-normal",
        className
      )}
      style={{ fontFamily: themeData.secondaryFont || themeData.fontFamily }}
    >
      {text}
    </h2>
  );
}

export default SectionHeader;
