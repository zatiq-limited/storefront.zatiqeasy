"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export function GridContainer({
  children,
  className,
  columns = { mobile: 2, tablet: 3, desktop: 4 },
}: GridContainerProps) {
  const getGridCols = () => {
    const colsMap: Record<number, string> = {
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
    };

    const mdColsMap: Record<number, string> = {
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
      5: "md:grid-cols-5",
    };

    const lgColsMap: Record<number, string> = {
      2: "lg:grid-cols-2",
      3: "lg:grid-cols-3",
      4: "lg:grid-cols-4",
      5: "lg:grid-cols-5",
    };

    return cn(
      colsMap[columns.mobile || 2],
      mdColsMap[columns.tablet || 3],
      lgColsMap[columns.desktop || 4]
    );
  };

  return (
    <div className={cn("grid gap-3 sm:gap-5", getGridCols(), className)}>
      {children}
    </div>
  );
}

export default GridContainer;
