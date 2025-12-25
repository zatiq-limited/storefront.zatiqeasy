"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
  is4Column?: boolean;
}

export function GridContainer({
  children,
  className,
  is4Column = false,
}: GridContainerProps) {
  return (
    <div
      className={cn(
        "grid gap-4 md:gap-6",
        is4Column
          ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export default GridContainer;
