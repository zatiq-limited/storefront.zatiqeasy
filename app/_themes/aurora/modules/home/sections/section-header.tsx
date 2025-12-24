"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  text: string;
  className?: string;
}

export function SectionHeader({ text, className }: SectionHeaderProps) {
  return (
    <h2
      className={cn(
        "text-center text-[38px] md:text-[64px] leading-snug",
        "text-[#4B5563] dark:text-blue-zatiq font-normal",
        "mb-12 md:mb-16 xl:mb-[84px]",
        className
      )}
    >
      {text}
    </h2>
  );
}

export default SectionHeader;
