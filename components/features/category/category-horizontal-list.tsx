"use client";

import { useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useProductsStore, Category } from "@/stores/productsStore";
import { useShopStore } from "@/stores";
import { useShopCategories } from "@/hooks";
import { ArrowLeftCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FallbackImage } from "@/components/ui/fallback-image";

interface CategoryHorizontalListProps {
  className?: string;
  fromCategory?: boolean;
}

/**
 * CategoryHorizontalList Component
 * Matches old project's implementation from category-horizontal-list.tsx
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
  const searchParams = useSearchParams();
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

  // URL params - matching old project
  const categoryIdParam = searchParams.get("category_id"); // Parent category for navigation
  const selectedCategory =
    searchParams.get("selected_category") || searchParams.get("category"); // For filtering

  // For fromCategory mode, extract category ID from pathname (e.g., /merchant/123/categories/456 -> 456)
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
    // For fromCategory mode, use path-based category ID
    const categoryId = fromCategory ? categoryIdFromPath : categoryIdParam;
    if (!categoryId) return null;
    return categories.find((cat) => String(cat.id) === categoryId) || null;
  }, [fromCategory, categoryIdFromPath, categoryIdParam, categories]);

  // Get the visible category list based on current root
  const categoryList = useMemo(() => {
    if (currentRootCategory?.id) {
      // Show subcategories of current root
      return categories.filter(
        (cat) => String(cat.parent_id) === String(currentRootCategory.id)
      );
    }
    // Show only root categories (parent_id is null or undefined)
    return categories.filter((cat) => !cat.parent_id);
  }, [currentRootCategory, categories]);

  // Build URL with params - preserve current pathname (e.g., /products, /categories)
  const buildUrl = useCallback(
    (params: {
      category_id?: string | null;
      selected_category?: string | null;
    }) => {
      // Use current pathname instead of baseUrl to preserve route
      // e.g., /merchant/5286/products stays as /merchant/5286/products
      const basePath = pathname || baseUrl || "/";
      const url = new URL(basePath, window.location.origin);

      // Clear existing search params first
      url.searchParams.delete("category_id");
      url.searchParams.delete("selected_category");

      if (params.category_id) {
        url.searchParams.set("category_id", params.category_id);
      }
      if (params.selected_category) {
        url.searchParams.set("selected_category", params.selected_category);
      }

      return url.pathname + url.search;
    },
    [pathname, baseUrl]
  );

  // Handle category selection - matching old project's handleSelectCategory
  const handleSelectCategory = useCallback(
    (categoryId: string | number | null) => {
      // Special case: fromCategory mode uses route-based navigation
      if (fromCategory) {
        const categoriesPath = `${baseUrl}/categories`;

        // Go back to parent (id === -1)
        if (categoryId === -1) {
          if (currentRootCategory?.parent_id) {
            // Go to parent's parent
            router.push(`${categoriesPath}/${currentRootCategory.parent_id}`);
          } else {
            // Go back to all categories
            router.push(categoriesPath);
          }
          return;
        }

        // Show all categories (id === null)
        if (categoryId === null) {
          router.push(categoriesPath);
          return;
        }

        // Navigate to specific category route
        const categoryIdStr = String(categoryId);
        router.push(`${categoriesPath}/${categoryIdStr}`);
        return;
      }

      // Regular mode (products page): use URL params
      // Go back to parent (id === -1)
      if (categoryId === -1) {
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
          // Go back to root (no params)
          router.push(baseUrl || "/");
        }
        return;
      }

      // Show all products (id === null)
      if (categoryId === null) {
        router.push(baseUrl || "/");
        return;
      }

      // Find the category
      const categoryIdStr = String(categoryId);
      const foundCategory = categories.find(
        (cat) => String(cat.id) === categoryIdStr
      );

      if (foundCategory) {
        /** Old logic to check for subcategories before deciding params
         * 
         * 
         * 
        // Check if this category has subcategories
        const hasSubcategories = categories.some(
          (cat) => String(cat.parent_id) === String(foundCategory.id)
        );

        if (hasSubcategories) {
          // Has subcategories - drill down to show them
          // ONLY set category_id for navigation, DON'T set selected_category (no product filtering yet)
          router.push(
            buildUrl({
              category_id: categoryIdStr,
              selected_category: null, // Don't filter products when drilling down
            })
          );
        } else {
          // No subcategories (leaf) - filter products, keep current navigation
          router.push(
            buildUrl({
              category_id: categoryIdParam, // Keep current parent
              selected_category: categoryIdStr, // Filter products by this category
            })
          );
        }
         * 
         * 
         * 
         */

        // Set both category_id and selected_category when selecting any category
        router.push(
          buildUrl({
            category_id: categoryIdStr,
            selected_category: categoryIdStr,
          })
        );
      } else {
        router.push(buildUrl({ selected_category: categoryIdStr }));
      }
    },
    [fromCategory, baseUrl, categories, currentRootCategory, router, buildUrl]
  );

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
      <div className="flex overflow-y-hidden overflow-x-auto pb-2 gap-1.5 md:pb-0 scroll-mb-1 category-x-scrollbar">
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
              // Click on "All [Category]" filters by this category
              router.push(
                buildUrl({
                  category_id: String(currentRootCategory.id),
                  selected_category: String(currentRootCategory.id),
                })
              );
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
                handleSelectCategory(-1);
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
              handleSelectCategory(null);
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
              handleSelectCategory(category.id);
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
