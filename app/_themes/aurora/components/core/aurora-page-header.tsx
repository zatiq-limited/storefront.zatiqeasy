"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AuroraPageHeaderProps {
  titleElement: React.ReactNode;
  number?: number;
  subtitle?: string;
  className?: string;
}

export function AuroraPageHeader({
  titleElement,
  number,
  subtitle,
  className,
}: AuroraPageHeaderProps) {
  return (
    <h1
      className={cn(
        "text-[38px] md:text-[64px] font-normal text-blue-zatiq",
        className
      )}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {titleElement}
      {(number ?? 0) > 0 && (
        <span className="text-[18px] md:text-[30px] text-gray-400 ml-2">
          ({number} {subtitle || "items"})
        </span>
      )}
    </h1>
  );
}

export default AuroraPageHeader;
