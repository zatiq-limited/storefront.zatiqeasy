"use client";

import { useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useProductsStore, Category } from "@/stores/productsStore";
import { useShopStore } from "@/stores";
import { useShopCategories } from "@/hooks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useShallowSearchParams,
  shallowReplace,
} from "@/lib/utils/shallow-routing";

interface SidebarCategoryProps {
  setShowMobileNav?: (value: boolean) => void;
  isBasic?: boolean;
}

/**
 * SidebarCategory Component
 * Uses URL params as single source of truth (matching category-horizontal-list.tsx):
 * - category_id: tracks which parent's subcategories we're viewing (navigation)
 * - selected_category: tracks the selected category for filtering products
 */
export function SidebarCategory({
  setShowMobileNav,
  isBasic,
}: SidebarCategoryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useShallowSearchParams(); // Use custom hook for instant updates
  const storeCategories = useProductsStore((state) => state.categories);
  const { shopDetails } = useShopStore();

  // Fetch categories if store is empty (handles page reload scenario)
  const { data: fetchedCategories, isLoading } = useShopCategories(
    { shopUuid: shopDetails?.shop_uuid || "" },
    { enabled: storeCategories.length === 0 && !!shopDetails?.shop_uuid }
  );

  // Use store categories if available, otherwise use fetched categories
  const categories = useMemo(
    () =>
      storeCategories.length > 0
        ? storeCategories
        : (fetchedCategories as Category[]) || [],
    [storeCategories, fetchedCategories]
  );

  const baseUrl = shopDetails?.baseUrl || "";

  // URL params - matching category-horizontal-list.tsx
  const categoryIdParam = searchParams.get("category_id");
  const selectedCategory =
    searchParams.get("selected_category") || searchParams.get("category");

  // Page detection
  const isProductsPage = pathname.endsWith("products");

  // Get current root category from URL (derived from category_id param)
  const currentRootCategory = useMemo(() => {
    if (!categoryIdParam) return null;
    return categories.find((cat) => String(cat.id) === categoryIdParam) || null;
  }, [categoryIdParam, categories]);

  // Get the visible category list based on current drill-down
  const categoryList = useMemo(() => {
    if (currentRootCategory?.id) {
      // Show subcategories of current root (categories where parent_id matches)
      return categories.filter(
        (cat) => String(cat.parent_id) === String(currentRootCategory.id)
      );
    }
    // Show only root categories (parent_id is null or undefined)
    return categories.filter((cat) => !cat.parent_id);
  }, [currentRootCategory, categories]);

  // Handle category click - matching category-horizontal-list.tsx logic
  const handleCategoryClick = useCallback(
    (category: Category) => {
      const hasSubcategories = categories.some(
        (cat) => String(cat.parent_id) === String(category.id)
      );

      if (hasSubcategories) {
        // Category has subcategories - drill down using URL params
        // Use shallow update for instant category switching
        const params = new URLSearchParams(searchParams.toString());
        params.set("category_id", String(category.id));
        params.set("selected_category", String(category.id));
        shallowReplace(`${pathname}?${params.toString()}`);
      } else {
        // Leaf category - apply filter
        if (isBasic) {
          // Basic theme: stay on current page and update params
          const params = new URLSearchParams(searchParams.toString());
          params.set("selected_category", String(category.id));
          // Keep category_id if we're inside a parent category
          if (currentRootCategory?.id) {
            params.set("category_id", String(currentRootCategory.id));
          } else if (category.parent_id) {
            params.set("category_id", String(category.parent_id));
          } else {
            // Root level leaf category: only selected_category
            params.delete("category_id");
          }
          shallowReplace(`${pathname}?${params.toString()}`);
        } else {
          // Luxura/other themes: navigate to category page with filtering
          const parentId = currentRootCategory?.id || category.parent_id;
          router.push(
            `${baseUrl}/categories/${category.id}?selected_category=${category.id}${parentId ? `&category_id=${parentId}` : ""}`
          );
        }
        setShowMobileNav?.(false);
      }
    },
    [categories, currentRootCategory, baseUrl, router, setShowMobileNav, searchParams, pathname, isBasic]
  );

  // Handle back button - go up one level using URL params
  const handleBackBtn = useCallback(() => {
    // Use shallow update to avoid RSC refetch
    const params = new URLSearchParams(searchParams.toString());

    if (currentRootCategory?.parent_id) {
      // Go to parent category
      params.set("category_id", String(currentRootCategory.parent_id));
      params.set("selected_category", String(currentRootCategory.parent_id));
      shallowReplace(`${pathname}?${params.toString()}`);
    } else {
      // Go back to root - clear category params
      params.delete("category_id");
      params.delete("selected_category");
      const queryString = params.toString();
      shallowReplace(queryString ? `${pathname}?${queryString}` : pathname);
    }
  }, [currentRootCategory, searchParams, pathname]);

  // Handle "All [Category]" click - filter by parent category
  const handleAllCategoryClick = useCallback(
    (category: Category | null) => {
      if (category) {
        if (isBasic) {
          // Basic theme: stay on current page and update params
          // Use shallow update to avoid RSC refetch
          const params = new URLSearchParams(searchParams.toString());
          params.set("selected_category", String(category.id));
          params.set("category_id", String(category.id));
          shallowReplace(`${pathname}?${params.toString()}`);
        } else {
          // Other themes: navigate to category page with filtering
          router.push(
            `${baseUrl}/categories/${category.id}?selected_category=${category.id}&category_id=${category.id}`
          );
        }
        setShowMobileNav?.(false);
      } else {
        router.push(`${baseUrl}/categories`);
        setShowMobileNav?.(false);
      }
    },
    [baseUrl, router, setShowMobileNav, isBasic, searchParams, pathname]
  );

  // Handle "All products" click - clear category filters
  const handleAllProductsClick = useCallback(() => {
    if (isBasic) {
      // Basic theme: stay on current page and clear category params
      // Use shallow update to avoid RSC refetch
      const params = new URLSearchParams(searchParams.toString());
      params.delete("category_id");
      params.delete("selected_category");
      const queryString = params.toString();
      shallowReplace(queryString ? `${pathname}?${queryString}` : pathname);
    } else {
      // Other themes: navigate to products page
      router.push(`${baseUrl}/products`);
    }
    setShowMobileNav?.(false);
  }, [baseUrl, router, setShowMobileNav, isBasic, searchParams, pathname]);

  // Show skeleton while loading
  if (isLoading && storeCategories.length === 0) {
    return (
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
  }

  if (!categories.length) {
    return null;
  }

  return (
    <div>
      {/* Header when no root category selected */}
      {!currentRootCategory?.id && (
        <div
          className={`hover:bg-gray-200 ${isProductsPage ? "bg-gray-200" : ""}`}
        >
          <div className="px-5 py-4 bg-gray-100 dark:bg-white flex items-center">
            <span className="w-full font-bold text-lg">{`Category List`}</span>
          </div>
          <div
            onClick={handleAllProductsClick}
            className="pl-7 py-4 pr-5 border-t last:border-b flex justify-between items-center cursor-pointer"
          >
            <p className="text-sm font-semibold text-foreground">
              All products
            </p>
          </div>
        </div>
      )}

      {/* Back button and current category header */}
      {currentRootCategory && (
        <div className="px-3 py-4 bg-gray-100 flex items-center">
          <button
            className="h-7 w-7 min-w-7 flex justify-center items-center bg-gray-200 cursor-pointer rounded-full"
            onClick={handleBackBtn}
          >
            <ChevronLeft className="text-black h-5" />
          </button>
          <span className="w-full font-bold text-lg ml-3">
            {currentRootCategory.name}
          </span>
        </div>
      )}

      {/* All [Category] link - shown when inside a category with subcategories */}
      {currentRootCategory?.id && categoryList.length > 0 && (
        <div
          className={`pl-7 py-4 pr-5 border-t last:border-b flex justify-between items-center cursor-pointer hover:bg-gray-200 ${
            selectedCategory === String(currentRootCategory.id) ? "bg-gray-200" : ""
          }`}
          onClick={() => handleAllCategoryClick(currentRootCategory)}
        >
          <p className="text-sm font-semibold text-foreground">
            All {currentRootCategory.name}
          </p>
        </div>
      )}

      {/* Category list */}
      {categoryList.map((item: Category, index: number) => {
        // Check if this category has subcategories
        const hasSubcategories = categories.some(
          (cat) => String(cat.parent_id) === String(item.id)
        );

        return (
          <div
            key={item.id || index}
            className={`pl-7 py-4 pr-5 border-t last:border-b flex justify-between items-center cursor-pointer hover:bg-gray-200 ${
              selectedCategory === String(item.id) ? "bg-gray-200" : ""
            }`}
            onClick={() => handleCategoryClick(item)}
          >
            <p
              className={`text-sm font-semibold ${
                hasSubcategories ? "dark:text-white" : "text-foreground"
              }`}
            >
              {item.name}
            </p>
            {hasSubcategories && (
              <button className="h-7 w-7 min-w-7 flex justify-center items-center bg-gray-200 cursor-pointer rounded-full">
                <ChevronRight className="text-black h-5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Export as default
export default SidebarCategory;
