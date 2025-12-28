"use client";

import { useShopStore } from "@/stores/shopStore";

interface PageHeaderProps {
  titleElement: React.ReactNode;
  number?: number;
  subtitle?: string;
  className?: string;
}

export function PageHeader({
  titleElement,
  number,
  subtitle,
  className = "",
}: PageHeaderProps) {
  const { shopDetails } = useShopStore();

  return (
    <h1
      className={`text-[38px] md:text-[64px] font-normal text-blue-zatiq ${className}`}
    >
      {titleElement}
      {(number ?? 0) > 0 && (
        <span className="text-[18px] md:text-[30px] text-[#9CA3AF] ml-2">
          ({number} {subtitle})
        </span>
      )}
    </h1>
  );
}

export default PageHeader;
