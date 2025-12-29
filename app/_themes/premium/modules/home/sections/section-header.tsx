"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores";
import { getThemeData } from "@/lib/utils/theme-constants";

interface SectionHeaderProps {
  title: string;
  buttonLink: string;
}

export function SectionHeader({ title, buttonLink }: SectionHeaderProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const themeData = getThemeData(shopDetails?.shop_theme?.theme_name);

  return (
    <div className="flex justify-between items-center lg:justify-center">
      <h2
        className="text-center text-black dark:text-blue-zatiq text-[20px] md:text-[36px] xl:text-[46px] font-bold leading-snug lg:leading-[57.50px]"
        style={{ fontFamily: themeData.secondaryFont || themeData.fontFamily }}
      >
        {title}
      </h2>
      <Link
        href={buttonLink}
        className="bg-blue-zatiq px-3.5 py-2 rounded-lg text-white dark:text-black flex items-center justify-center gap-1 lg:hidden"
      >
        <p className="text-sm leading-tight whitespace-nowrap pt-0.75">
          {t("view_all")}
        </p>
        <ChevronRight className="h-5 w-5" />
      </Link>
    </div>
  );
}

export default SectionHeader;
