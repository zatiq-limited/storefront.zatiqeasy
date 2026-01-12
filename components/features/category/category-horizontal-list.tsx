"use client";

import { useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useProductsStore, Category } from "@/stores/productsStore";
import { useShopStore } from "@/stores";
import { useShopCategories } from "@/hooks";
import { ArrowLeftCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FallbackImage } from "@/components/ui/fallback-image";
import {
  useShallowSearchParams,
  shallowReplace,
} from "@/lib/utils/shallow-routing";

interface CategoryHorizontalListProps {
  className?: string;
  fromCategory?: boolean;
}

/**
 * CategoryHorizontalList Component
 * Matches sidebar-category.tsx functionality with horizontal card design
 * Uses URL params as single source of truth:
 * - category_id: tracks which parent's subcategories we're viewing (navigation)
 * - selected_category: tracks the selected category for filtering products
 */

// Loading Skeleton
const HorizontalCategorySkeleton = () => (
  <div className="flex gap-1.5 overflow-x-auto pb-2 md:pb-0 animate-pulse">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="w-25 min-w-25 md:w-37.5 md:min-w-37.5 aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg m-1 md:m-2"
      />
    ))}
  </div>
);

export function CategoryHorizontalList({
  className,
  fromCategory,
}: CategoryHorizontalListProps) {
  const router = useRouter();
  const searchParams = useShallowSearchParams(); // Use custom hook for instant updates
  const pathname = usePathname();
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

  // URL params - matching sidebar-category
  const categoryIdParam = searchParams.get("category_id");
  const selectedCategory =
    searchParams.get("selected_category") || searchParams.get("category");

  // For fromCategory mode, extract category ID from pathname
  const categoryIdFromPath = useMemo(() => {
    if (!fromCategory) return null;
    const pathParts = pathname.split("/");
    const categoriesIndex = pathParts.indexOf("categories");
    if (categoriesIndex !== -1 && pathParts[categoriesIndex + 1]) {
      return pathParts[categoriesIndex + 1];
    }
    return null;
  }, [fromCategory, pathname]);

  // Get current root category from URL (derived from category_id param or path)
  const currentRootCategory = useMemo(() => {
    const categoryId = fromCategory ? categoryIdFromPath : categoryIdParam;
    if (!categoryId) return null;
    return categories.find((cat) => String(cat.id) === categoryId) || null;
  }, [fromCategory, categoryIdFromPath, categoryIdParam, categories]);

  // Get the visible category list based on current root
  const categoryList = useMemo(() => {
    if (currentRootCategory?.id) {
      return categories.filter(
        (cat) => String(cat.parent_id) === String(currentRootCategory.id)
      );
    }
    return categories.filter((cat) => !cat.parent_id);
  }, [currentRootCategory, categories]);

  // Get the selected category object (for showing the name when a subcategory is selected)
  const selectedCategoryObject = useMemo(() => {
    if (!selectedCategory) return null;
    return (
      categories.find((cat) => String(cat.id) === selectedCategory) || null
    );
  }, [selectedCategory, categories]);

  // Determine which category name to display (selected subcategory takes priority)
  const displayCategory = useMemo(() => {
    // If a subcategory is selected (different from the route category), show its name
    if (
      fromCategory &&
      selectedCategoryObject &&
      categoryIdFromPath !== selectedCategory
    ) {
      return selectedCategoryObject;
    }
    // Otherwise show the root category from the path
    return currentRootCategory;
  }, [
    fromCategory,
    selectedCategoryObject,
    categoryIdFromPath,
    selectedCategory,
    currentRootCategory,
  ]);

  // Handle category click - matching sidebar-category's handleCategoryClick
  const handleCategoryClick = useCallback(
    (category: Category) => {
      // Check if this category has subcategories
      const hasSubcategories = categories.some(
        (cat) => String(cat.parent_id) === String(category.id)
      );

      // Special case: fromCategory mode
      if (fromCategory) {
        const categoriesPath = `${baseUrl}/categories`;

        if (hasSubcategories) {
          // Category with subcategories: navigate to category route (full navigation needed)
          router.push(`${categoriesPath}/${category.id}`);
        } else {
          // Leaf category (subcategory): stay on current route, set only selected_category
          // Remove category_id since this is a leaf - only selected_category should be in URL
          // Use shallow update to avoid RSC refetch
          const params = new URLSearchParams(searchParams.toString());
          params.delete("category_id"); // Remove parent's category_id
          params.set("selected_category", String(category.id));
          shallowReplace(`${pathname}?${params.toString()}`);
        }
        return;
      }

      // Regular mode: stay on current page and update URL params
      // Use shallow update for instant category switching
      const params = new URLSearchParams(searchParams.toString());
      params.set("selected_category", String(category.id));

      // Include category_id if:
      // 1. Category has subcategories, OR
      // 2. Category has a parent (it's a subcategory itself)
      if (hasSubcategories || category.parent_id) {
        params.set("category_id", String(category.id));
      } else {
        // Root level leaf category: only selected_category
        params.delete("category_id");
      }

      shallowReplace(`${pathname}?${params.toString()}`);
    },
    [fromCategory, baseUrl, categories, router, searchParams, pathname]
  );

  // Handle back button - matching sidebar-category's handleBackBtn
  const handleBackBtn = useCallback(() => {
    // Special case: fromCategory mode
    if (fromCategory) {
      const categoriesPath = `${baseUrl}/categories`;
      if (currentRootCategory?.parent_id) {
        router.push(`${categoriesPath}/${currentRootCategory.parent_id}`);
      } else {
        router.push(categoriesPath);
      }
      return;
    }

    // Regular mode: stay on current page and update URL params
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
  }, [
    fromCategory,
    baseUrl,
    currentRootCategory,
    router,
    searchParams,
    pathname,
  ]);

  // Handle "All [Category]" click - matching sidebar-category's handleAllCategoryClick
  const handleAllCategoryClick = useCallback(
    (category: Category | null) => {
      if (fromCategory) {
        const categoriesPath = `${baseUrl}/categories`;
        if (category) {
          router.push(`${categoriesPath}/${category.id}`);
        } else {
          router.push(categoriesPath);
        }
        return;
      }

      // Regular mode: stay on current page and update URL params
      // Use shallow update to avoid RSC refetch
      const params = new URLSearchParams(searchParams.toString());

      if (category) {
        params.set("category_id", String(category.id));
        params.set("selected_category", String(category.id));
        shallowReplace(`${pathname}?${params.toString()}`);
      } else {
        // Clear category params
        params.delete("category_id");
        params.delete("selected_category");
        const queryString = params.toString();
        shallowReplace(queryString ? `${pathname}?${queryString}` : pathname);
      }
    },
    [fromCategory, baseUrl, router, searchParams, pathname]
  );

  // Handle "All products" click - clear category filters, stay on current page
  const handleAllProductsClick = useCallback(() => {
    // Use shallow update to avoid RSC refetch
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category_id");
    params.delete("selected_category");
    const queryString = params.toString();
    shallowReplace(queryString ? `${pathname}?${queryString}` : pathname);
  }, [searchParams, pathname]);

  // Show skeleton while loading
  if (isLoading && storeCategories.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <HorizontalCategorySkeleton />
      </div>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Show category name when in fromCategory mode (shows selected subcategory name if one is selected) */}
      {fromCategory && displayCategory && (
        <div className="flex items-center gap-2 mb-3">
          {/* Back button - shown when a subcategory is selected */}
          {selectedCategoryObject &&
            categoryIdFromPath !== selectedCategory && (
              <button
                onClick={() => {
                  // Clear selected_category param to go back to parent category view
                  // Use shallow update to avoid RSC refetch
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("selected_category");
                  const queryString = params.toString();
                  shallowReplace(
                    queryString ? `${pathname}?${queryString}` : pathname
                  );
                }}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Back to parent category"
              >
                <ArrowLeftCircle className="w-6 h-6 md:w-7 md:h-7 text-gray-700 dark:text-gray-300" />
              </button>
            )}
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
            {displayCategory.name}
          </h2>
        </div>
      )}
      <div className="flex overflow-y-hidden overflow-x-auto pb-2 gap-1.5 scroll-mb-1 category-x-scrollbar">
        {/* Show "All [Parent Category]" card with back button when viewing subcategories */}
        {currentRootCategory?.id && !fromCategory ? (
          <div
            key={currentRootCategory.id}
            className={cn(
              "w-25 min-w-25! md:w-37.5 md:min-w-37.5! aspect-square relative cursor-pointer rounded-lg outline-solid outline-4 m-1 md:m-2",
              {
                "outline-blue-zatiq":
                  selectedCategory === String(currentRootCategory.id),
                "outline-white":
                  selectedCategory !== String(currentRootCategory.id),
              }
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Click on "All [Category]" - matching sidebar behavior
              handleAllCategoryClick(currentRootCategory);
            }}
          >
            <FallbackImage
              src={currentRootCategory.image_url ?? ""}
              alt="image"
              height={310}
              width={310}
              className="h-full w-full rounded-lg object-cover"
            />
            <div className="absolute bottom-0 w-full bg-linear-to-t from-black/80 to-transparent pt-5 pl-2 lg:pl-3 pb-1 lg:pb-2 rounded-lg">
              <h3 className="bottom-2 lg:bottom-3 text-white text-sm md:text-base font-medium line-clamp-2 leading-none">
                All {currentRootCategory.name}
              </h3>
            </div>
            {/* Back button */}
            <div
              className="absolute top-1 left-1 md:top-2 md:left-3 text-red-500"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleBackBtn();
              }}
            >
              <ArrowLeftCircle className="w-5 md:w-6" />
            </div>
          </div>
        ) : (
          /* "All products/categories" card - shown when viewing root categories */
          <div
            key="all"
            className={cn(
              "w-25 bg-blue-zatiq/25 min-w-25! md:w-37.5 md:min-w-37.5! aspect-square relative cursor-pointer rounded-lg outline-solid outline-4 m-1 md:m-2",
              {
                "outline-blue-zatiq": !selectedCategory,
                "outline-gray-500 dark:outline-black-2": selectedCategory,
              }
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (fromCategory) {
                handleAllCategoryClick(null);
              } else {
                handleAllProductsClick();
              }
            }}
          >
            {shopDetails?.image_url ? (
              <Image
                src={shopDetails.image_url}
                alt="image"
                height={310}
                width={310}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <div className="h-full w-full rounded-lg bg-transparent" />
            )}
            <div className="absolute bottom-0 w-full bg-linear-to-t from-black/50 to-transparent pt-5 pl-2 lg:pl-3 pb-1 lg:pb-2 rounded-lg">
              <h3 className="bottom-2 text-white text-[16px] md:text-[28px] font-medium whitespace-pre-line">
                {fromCategory ? "All\ncategories" : "All\nproducts"}
              </h3>
            </div>
          </div>
        )}

        {/* Category/Subcategory cards */}
        {categoryList?.map((category) => (
          <div
            key={category.id}
            className={cn(
              "w-25 min-w-25! md:w-37.5 md:min-w-37.5! aspect-square relative cursor-pointer rounded-lg outline-solid outline-4 m-1 md:m-2",
              {
                "outline-blue-zatiq": selectedCategory === String(category.id),
                "outline-gray-500 dark:outline-black-2":
                  selectedCategory !== String(category.id),
              }
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCategoryClick(category);
            }}
          >
            <FallbackImage
              src={category.image_url ?? ""}
              alt="image"
              height={310}
              width={310}
              className="h-full w-full rounded-lg object-cover"
            />
            <div className="absolute bottom-0 w-full bg-linear-to-t from-black/80 to-transparent pt-5 pl-2 lg:pl-3 pb-1 lg:pb-2 rounded-lg">
              <h3 className="bottom-2 lg:bottom-3 text-white text-sm md:text-base font-medium line-clamp-2 leading-none">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Export as default
export default CategoryHorizontalList;
