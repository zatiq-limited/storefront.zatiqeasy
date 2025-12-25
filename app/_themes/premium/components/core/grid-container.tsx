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
  columns = { mobile: 2, tablet: 3, desktop: 5 },
}: GridContainerProps) {
  // Build grid classes based on column configuration
  const gridCols = cn(
    columns.mobile === 2 && "grid-cols-2",
    columns.mobile === 3 && "grid-cols-3",
    columns.tablet === 3 && "md:grid-cols-3",
    columns.tablet === 4 && "md:grid-cols-4",
    columns.desktop === 4 && "lg:grid-cols-4",
    columns.desktop === 5 && "lg:grid-cols-5",
  );

  return (
    <div
      className={cn(
        "grid gap-3 md:gap-4 lg:gap-5",
        gridCols,
        className
      )}
    >
      {children}
    </div>
  );
}

export default GridContainer;
