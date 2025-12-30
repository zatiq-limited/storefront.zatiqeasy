"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GridContainerProps {
  children: ReactNode;
  className?: string;
}

export function GridContainer({ children, className }: GridContainerProps) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-5", className)}>
      {children}
    </div>
  );
}

export default GridContainer;
