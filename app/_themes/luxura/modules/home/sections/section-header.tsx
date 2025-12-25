"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  text: string;
  viewAllLink?: string;
  showViewAll?: boolean;
  className?: string;
  centered?: boolean;
}

export function SectionHeader({
  text,
  viewAllLink,
  showViewAll = true,
  className,
  centered = false,
}: SectionHeaderProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex items-center mb-6 md:mb-8",
        centered ? "justify-center" : "justify-between",
        className
      )}
    >
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
        {text}
      </h2>

      {showViewAll && viewAllLink && !centered && (
        <Link
          href={viewAllLink}
          className="flex items-center gap-1 text-blue-zatiq hover:text-blue-600 transition-colors text-sm md:text-base font-medium"
        >
          {t("view_more")}
          <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}

export default SectionHeader;
