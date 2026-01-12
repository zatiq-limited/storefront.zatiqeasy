"use client";

import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { useCartTotals, useShopCategories, useShopInventories } from "@/hooks";
import { useShopStore } from "@/stores";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  HorizontalCategorySkeleton,
  ProductsGridSkeleton,
  SearchSkeleton,
  SidebarCategorySkeleton,
} from "../../components/skeletons";
import { useTranslation } from "react-i18next";

// Dynamic imports for better performance
const CategoryHorizontalList = dynamic(
  () => import("@/components/features/category/category-horizontal-list"),
  {
    ssr: false,
    loading: () => <HorizontalCategorySkeleton />,
  }
);

const SidebarCategory = dynamic(
  () => import("@/components/features/category/sidebar-category"),
  {
    ssr: false,
    loading: () => <SidebarCategorySkeleton />,
  }
);

const InventorySearch = dynamic(() => import("./sections/inventory-search"), {
  ssr: false,
  loading: () => <SearchSkeleton />,
});

const InventoryProducts = dynamic(
  () => import("./sections/inventory-products"),
  {
    ssr: false,
    loading: () => <ProductsGridSkeleton />,
  }
);

/**
 * Basic Homepage Module
 * Main landing page with category sidebar and product grid
 */
export function BasicHomePage() {
  const router = useRouter();
  const { shopDetails } = useShopStore();
  const { t } = useTranslation();
  const { totalPrice, totalProducts, hasItems } = useCartTotals();

  // Fetch products and categories to populate the store
  // sortByStock: false to preserve original API order
  useShopInventories(
    { shopUuid: shopDetails?.shop_uuid ?? "" },
    { enabled: !!shopDetails?.shop_uuid, sortByStock: false }
  );

  useShopCategories(
    { shopUuid: shopDetails?.shop_uuid ?? "" },
    { enabled: !!shopDetails?.shop_uuid }
  );

  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <>
      {/* Mobile Search - Hidden on desktop */}
      <div className="block md:hidden">
        <InventorySearch className="mt-5" />
      </div>

      {/* Main Content Grid */}
      <div className="container grid xl:grid-cols-5 gap-5 py-2">
        {/* Sidebar - Categories */}
        <div className="overflow-hidden -mr-5 xl:overflow-auto xl:mr-0 xl:bg-white dark:xl:bg-black-27 xl:rounded-xl xl:border xl:border-black-4 dark:xl:border-none xl:h-[calc(100vh-120px)] xl:sticky xl:top-25 xl:left-0 xl:self-start col-span-full xl:col-span-1">
          {/* Categories Label - Desktop only */}
          <li className="mx-4 mt-4 mb-4 hidden font-medium text-black-2 dark:text-gray-300 xl:block">
            {t("categories_label")}
          </li>

          {/* Desktop Sidebar */}
          <div className="hidden xl:block">
            <SidebarCategory isBasic />
          </div>

          {/* Mobile Horizontal Categories */}
          <div className="block xl:hidden">
            <CategoryHorizontalList />
          </div>
        </div>

        {/* Main Content - Products */}
        <div className="xl:col-span-4">
          <InventoryProducts />
        </div>
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        onClick={() => router.push(`${baseUrl}/checkout`)}
        showCartFloatingBtn={hasItems}
        totalPrice={totalPrice}
        totalProducts={totalProducts}
        theme="Basic"
      />
    </>
  );
}

export default BasicHomePage;
