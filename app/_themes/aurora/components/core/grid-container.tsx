"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GridContainerProps {
  children: ReactNode;
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
}

export function GridContainer({
  children,
  className,
  columns = { mobile: 2, desktop: 4 },
  gap = 5,
}: GridContainerProps) {
  const gapClass = `gap-${gap}`;
  const mobileColsClass = `grid-cols-${columns.mobile || 2}`;
  const desktopColsClass = `lg:grid-cols-${columns.desktop || 4}`;

  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-5", className)}>
      {children}
    </div>
  );
}

export default GridContainer;
