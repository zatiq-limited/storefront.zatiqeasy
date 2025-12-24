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
        "text-xl md:text-4xl xl:text-5xl leading-snug lg:leading-[57.50px]",
        "text-black dark:text-blue-zatiq font-bold mb-6 md:mb-9",
        className
      )}
    >
      {text}
    </h2>
  );
}

export default SectionHeader;
