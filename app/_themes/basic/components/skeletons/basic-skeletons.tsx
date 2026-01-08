"use client";

import { ProductSkeleton } from "@/components/shared/skeletons/product-skeleton";

/**
 * Sidebar Category Skeleton
 * Loading placeholder for the category sidebar
 */
export const SidebarCategorySkeleton = () => (
  <div className="animate-pulse">
    {/* Header skeleton */}
    <div className="px-5 py-4 bg-gray-100 dark:bg-gray-800">
      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-32" />
    </div>
    {/* All products skeleton */}
    <div className="pl-7 py-4 pr-5 border-t">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
    </div>
    {/* Category items skeleton */}
    {[80, 65, 90, 70, 85, 60].map((width, index) => (
      <div
        key={index}
        className="pl-7 py-4 pr-5 border-t flex justify-between items-center"
      >
        <div
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
          style={{ width: `${width}%` }}
        />
        {index % 3 === 0 && (
          <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded-full" />
        )}
      </div>
    ))}
  </div>
);

/**
 * Horizontal Category Skeleton
 * Loading placeholder for horizontal category list (mobile)
 */
export const HorizontalCategorySkeleton = () => (
  <div className="flex gap-3 overflow-x-auto px-5 py-2 animate-pulse">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="shrink-0 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"
        style={{ width: `${70 + (index % 3) * 20}px` }}
      />
    ))}
  </div>
);

/**
 * Products Grid Skeleton
 * Loading placeholder for the products grid
 */
export const ProductsGridSkeleton = () => (
  <div>
    {/* Header skeleton */}
    <div className="px-4 h-13.75 bg-white dark:bg-gray-800 rounded-xl mb-3 border border-gray-200 dark:border-gray-600 flex items-center justify-between animate-pulse">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32" />
    </div>
    {/* Products grid skeleton */}
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-4">
      {[...Array(12)].map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  </div>
);

/**
 * Search Skeleton
 * Loading placeholder for the search bar
 */
export const SearchSkeleton = () => (
  <div className="mx-5 mt-5 animate-pulse">
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
  </div>
);

/**
 * Full Page Skeleton
 * Loading placeholder for the entire Basic theme page layout
 */
export const BasicPageSkeleton = () => (
  <>
    {/* Mobile Search Skeleton */}
    <div className="block md:hidden">
      <SearchSkeleton />
    </div>

    {/* Main Content Grid */}
    <div className="container grid xl:grid-cols-5 gap-5 py-2">
      {/* Sidebar Skeleton */}
      <div className="overflow-hidden -mr-5 xl:overflow-auto xl:mr-0 xl:bg-white dark:xl:bg-black-27 xl:rounded-xl xl:border xl:border-black-4 dark:xl:border-none xl:h-[calc(100vh-120px)] xl:sticky xl:top-25 xl:left-0 xl:self-start col-span-full xl:col-span-1">
        {/* Categories Label - Desktop only */}
        <li className="mx-4 mt-4 mb-4 hidden font-medium text-black-2 dark:text-gray-300 xl:block list-none">
          Categories
        </li>

        {/* Desktop Sidebar Skeleton */}
        <div className="hidden xl:block">
          <SidebarCategorySkeleton />
        </div>

        {/* Mobile Horizontal Categories Skeleton */}
        <div className="block xl:hidden">
          <HorizontalCategorySkeleton />
        </div>
      </div>

      {/* Main Content - Products Skeleton */}
      <div className="xl:col-span-4">
        <ProductsGridSkeleton />
      </div>
    </div>
  </>
);

