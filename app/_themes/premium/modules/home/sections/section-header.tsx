"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SectionHeaderProps {
  text: string;
  viewAllLink?: string;
  showViewAll?: boolean;
}

export function SectionHeader({
  text,
  viewAllLink,
  showViewAll = true,
}: SectionHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
        {text}
      </h2>

      {showViewAll && viewAllLink && (
        <Link
          href={viewAllLink}
          className="hidden md:flex items-center gap-1 text-blue-zatiq hover:text-blue-600 font-medium text-sm transition-colors"
        >
          {t("view_all")}
          <ChevronRight size={18} />
        </Link>
      )}
    </div>
  );
}

export default SectionHeader;
