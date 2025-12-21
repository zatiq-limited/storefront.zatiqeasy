"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProductSkeletonProps {
  className?: string;
  showImage?: boolean;
  showTitle?: boolean;
  showPrice?: boolean;
  showButton?: boolean;
  variant?: "card" | "list" | "grid";
}

/**
 * Product Skeleton Component
 * Loading placeholder for product cards
 */
export function ProductSkeleton({
  className,
  showImage = true,
  showTitle = true,
  showPrice = true,
  showButton = true,
  variant = "card",
}: ProductSkeletonProps) {
  const baseClasses = "bg-gray-200 dark:bg-gray-700 animate-pulse rounded";
  const imageClasses = variant === "list" ? "w-24 h-24" : "w-full h-48 sm:h-52";

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden",
        variant === "list" ? "flex gap-4 p-4" : "flex flex-col",
        className
      )}
    >
      {/* Image Skeleton */}
      {showImage && <div className={cn(baseClasses, imageClasses)} />}

      {/* Content */}
      <div
        className={cn(
          "flex-1 space-y-3",
          variant === "list" ? "flex-1" : "p-4 pt-3"
        )}
      >
        {/* Title Skeleton */}
        {showTitle && (
          <div className="space-y-2">
            <div className={cn(baseClasses, "h-4 w-3/4")} />
            <div className={cn(baseClasses, "h-4 w-1/2")} />
          </div>
        )}

        {/* Price Skeleton */}
        {showPrice && (
          <div className="flex items-center gap-2">
            <div className={cn(baseClasses, "h-6 w-20")} />
            <div className={cn(baseClasses, "h-4 w-16")} />
          </div>
        )}

        {/* Button Skeleton */}
        {showButton && (
          <div className={cn(baseClasses, "h-10 w-full mt-auto")} />
        )}
      </div>
    </div>
  );
}

// Category Skeleton
interface CategorySkeletonProps {
  className?: string;
  count?: number;
}

export function CategorySkeleton({
  className,
  count = 4,
}: CategorySkeletonProps) {
  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-2", className)}>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="shrink-0 flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 min-w-25"
        >
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}

// List Skeleton
export function ListSkeleton({ className, count = 5 }: CategorySkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-1/2" />
          </div>
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}

// Export all skeletons
export { ProductSkeleton as default };
