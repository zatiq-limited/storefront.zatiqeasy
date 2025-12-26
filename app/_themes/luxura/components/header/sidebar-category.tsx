"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";
import type { Category } from "@/types";

type Props = {
  setShowMobileNav?: (value: boolean) => void;
  isBasic?: boolean;
};

const SidebarCategory = ({ setShowMobileNav, isBasic }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { shopDetails } = useShopStore();
  const categories = useProductsStore((state) => state.categories);

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [currentRootCategory, setCurrentRootCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isProductsPage, setIsProductsPage] = useState<boolean>(false);
  const [isCategoryPage, setIsCategoryPage] = useState<boolean>(false);

  const baseUrl = shopDetails?.baseUrl || "";

  // Flatten categories list for navigation
  const flattenList = useMemo(() => {
    const tempList: Category[] = [];
    function addData(category: Category) {
      tempList.push(category);
      for (let i = 0; i < (category?.sub_categories?.length ?? 0); i++) {
        if (category?.sub_categories?.[i]) {
          addData(category.sub_categories[i]);
        }
      }
    }
    categories?.forEach((item: Category) => {
      addData(item);
    });
    return tempList;
  }, [categories]);

  useEffect(() => {
    const categoryId = searchParams.get("selected_category");
    if (categoryId) {
      const nestedCategoryLocal: number[] = [];
      categoryId.split(",").forEach((item: string) => {
        if (item) nestedCategoryLocal.push(parseInt(item));
      });
      const item = flattenList.find(
        (cat) => cat.id === nestedCategoryLocal[nestedCategoryLocal.length - 1]
      );
      if (item?.parent_id) {
        setCurrentRootCategory(
          flattenList.find((i) => i.id === item.parent_id) || null
        );
      } else {
        setCurrentRootCategory(null);
      }
    } else {
      setCurrentRootCategory(null);
    }
    setSelectedCategory(Number(categoryId) || null);
    setIsProductsPage(window.location.pathname.endsWith("products"));
    setIsCategoryPage(window.location.pathname.includes("categories"));
  }, [searchParams, flattenList]);

  useEffect(() => {
    if (currentRootCategory) {
      setCategoryList(currentRootCategory.sub_categories || []);
    } else {
      setCategoryList(categories?.filter((item) => !item.parent_id) || []);
    }
  }, [currentRootCategory, categories]);

  const handleCategoryClick = (category: Category) => {
    if (category.sub_categories && category.sub_categories.length > 0) {
      setCurrentRootCategory(category);
    } else {
      router.push(`${baseUrl}/categories/${category.id}?selected_category=${category.id}`);
      setShowMobileNav?.(false);
    }
  };

  const handleBackBtn = () => {
    if (currentRootCategory) {
      const parentItem = flattenList.find(
        (item: Category) => item.id === currentRootCategory.parent_id
      );
      if (parentItem) {
        setCategoryList(parentItem.sub_categories || []);
        setCurrentRootCategory(parentItem);
      } else {
        setCategoryList(categories?.filter((item) => !item.parent_id) || []);
        setCurrentRootCategory(null);
      }
    }
  };

  const handleAllCategoryClick = (category: Category | null) => {
    if (category) {
      router.push(`${baseUrl}/categories/${category.id}?selected_category=${category.id}`);
    } else {
      router.push(`${baseUrl}/categories`);
    }
    setShowMobileNav?.(false);
  };

  return (
    <div>
      {/* Category List Header */}
      {!currentRootCategory?.id && (
        <div className={`hover:bg-gray-200 dark:hover:bg-gray-700 ${isProductsPage ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
          <div className="px-5 py-4 bg-gray-100 dark:bg-gray-800 flex items-center">
            <span className="w-full font-bold text-lg dark:text-white">
              Category List
            </span>
          </div>
          <div
            onClick={() => {
              setShowMobileNav?.(false);
              router.push(`${baseUrl}/products`);
            }}
            className="pl-7 py-4 pr-5 border-t dark:border-gray-700 last:border-b flex justify-between items-center cursor-pointer"
          >
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              All products
            </p>
          </div>
        </div>
      )}

      {/* Back Button + Current Category Name */}
      {currentRootCategory && (
        <div className="px-3 py-4 bg-gray-100 dark:bg-gray-800 flex items-center">
          <button
            className="h-7 w-7 min-w-[28px] flex justify-center items-center bg-gray-200 dark:bg-gray-600 cursor-pointer rounded-full"
            onClick={handleBackBtn}
          >
            <ChevronLeft className="text-black dark:text-white h-5" />
          </button>
          <span className="w-full font-bold text-lg ml-3 dark:text-white">
            {currentRootCategory.name}
          </span>
        </div>
      )}

      {/* All Category Link */}
      {(!isBasic || currentRootCategory?.id) && categoryList && (
        <div
          className={`pl-7 py-4 pr-5 border-t dark:border-gray-700 last:border-b flex justify-between items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
            isCategoryPage && !selectedCategory ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          onClick={() => handleAllCategoryClick(currentRootCategory)}
        >
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            All {currentRootCategory ? currentRootCategory.name : "category"}
          </p>
        </div>
      )}

      {/* Category Items */}
      {categoryList &&
        categoryList.map((item: Category, index: number) => (
          <div
            key={index}
            className={`pl-7 py-4 pr-5 border-t dark:border-gray-700 last:border-b flex justify-between items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
              selectedCategory === item.id ? "bg-gray-200 dark:bg-gray-700" : ""
            }`}
            onClick={() => handleCategoryClick(item)}
          >
            <p
              className={`text-sm font-semibold ${
                item.sub_categories && item.sub_categories.length > 0
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              {item.name}
            </p>
            {item.sub_categories && item.sub_categories.length > 0 && (
              <button className="h-7 w-7 min-w-[28px] flex justify-center items-center bg-gray-200 dark:bg-gray-600 cursor-pointer rounded-full">
                <ChevronRight className="text-black dark:text-white h-5" />
              </button>
            )}
          </div>
        ))}
    </div>
  );
};

export { SidebarCategory };
export default SidebarCategory;
