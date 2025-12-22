"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useProductsStore, Category } from "@/stores/productsStore";
import { useShopStore } from "@/stores";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarCategoryProps {
  setShowMobileNav?: (value: boolean) => void;
  isBasic?: boolean;
}

/**
 * SidebarCategory Component
 * Matches old project's implementation from sidebar-category.tsx
 * Uses parent_id from categories for navigation (like CategoryHorizontalList)
 */
export function SidebarCategory({
  setShowMobileNav,
  isBasic,
}: SidebarCategoryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { categories } = useProductsStore();
  const { shopDetails } = useShopStore();

  const baseUrl = shopDetails?.baseUrl || "";

  // URL params - matching old project and CategoryHorizontalList
  const categoryIdParam = searchParams.get("category_id"); // Parent category for navigation
  const selectedCategory =
    searchParams.get("selected_category") || searchParams.get("category");

  // Page detection
  const isProductsPage = pathname.endsWith("products");
  const isCategoryPage = pathname.endsWith("categories");

  // Get current root category from URL (derived from category_id param)
  const currentRootCategory = useMemo(() => {
    if (!categoryIdParam) return null;
    return categories.find((cat) => String(cat.id) === categoryIdParam) || null;
  }, [categoryIdParam, categories]);

  // Get the visible category list based on current root
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

  // Build URL with params
  const buildUrl = useCallback(
    (params: {
      category_id?: string | null;
      selected_category?: string | null;
    }) => {
      const url = new URL(baseUrl || "/", window.location.origin);

      if (params.category_id) {
        url.searchParams.set("category_id", params.category_id);
      }
      if (params.selected_category) {
        url.searchParams.set("selected_category", params.selected_category);
      }

      return url.pathname + url.search;
    },
    [baseUrl]
  );

  // Handle category click
  const handleCategoryClick = useCallback(
    (category: Category) => {
      const hasSubcategories = categories.some(
        (cat) => String(cat.parent_id) === String(category.id)
      );

      if (hasSubcategories) {
        router.push(
          `${baseUrl}/categories/${category.id}?selected_category=${category.id}&category_id=${category.id}`
        );
      } else {
        router.push(
          `${baseUrl}?category_id=${currentRootCategory?.id}&selected_category=${category.id}`
        );
      }

      setShowMobileNav?.(false);
    },
    [categories, currentRootCategory, baseUrl, router, setShowMobileNav]
  );

  // Handle back button
  const handleBackBtn = useCallback(() => {
    if (currentRootCategory?.parent_id) {
      // Go to parent's parent
      const parentCategory = categories.find(
        (cat) => String(cat.id) === String(currentRootCategory.parent_id)
      );
      if (parentCategory) {
        router.push(
          buildUrl({
            category_id: String(parentCategory.id),
            selected_category: String(parentCategory.id),
          })
        );
      } else {
        router.push(baseUrl || "/");
      }
    } else {
      // Go back to root
      router.push(baseUrl || "/");
    }
  }, [currentRootCategory, categories, router, buildUrl, baseUrl]);

  // Handle "All [Category]" click
  const handleAllCategoryClick = useCallback(
    (category: Category | null) => {
      if (category) {
        // Include URL params like old project does
        router.push(
          `${baseUrl}/categories/${category.id}?selected_category=${category.id}&category_id=${category.id}`
        );
        setShowMobileNav?.(false);
      } else {
        router.push(`${baseUrl}/categories`);
        setShowMobileNav?.(false);
      }
    },
    [baseUrl, router, setShowMobileNav]
  );

  // Handle "All products" click
  const handleAllProductsClick = useCallback(() => {
    setShowMobileNav?.(false);
    router.push(`${baseUrl}/products`);
  }, [baseUrl, router, setShowMobileNav]);

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

      {/* All [Category] link */}
      {(!isBasic || currentRootCategory?.id) && categoryList.length > 0 && (
        <div
          className={`pl-7 py-4 pr-5 border-t last:border-b flex justify-between items-center cursor-pointer hover:bg-gray-200 ${
            isCategoryPage ? "bg-gray-200" : ""
          }`}
          onClick={() => handleAllCategoryClick(currentRootCategory)}
        >
          <p className="text-sm font-semibold text-foreground">
            All {currentRootCategory ? currentRootCategory.name : "category"}
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
