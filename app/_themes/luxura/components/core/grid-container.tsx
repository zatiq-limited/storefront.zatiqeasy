"use client";

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
        "grid grid-cols-2 md:grid-cols-3 gap-5",
        is4Column && "xl:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export default GridContainer;
