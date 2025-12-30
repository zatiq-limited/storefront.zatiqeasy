"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useShopStore } from "@/stores";
import { useCartTotals } from "@/hooks";
import { CartFloatingBtn } from "@/features/cart/cart-floating-btn";

// Dynamic imports for better performance
const CategoryHorizontalList = dynamic(
  () => import("@/features/category/category-horizontal-list"),
  { ssr: false }
);

const SidebarCategory = dynamic(
  () => import("@/features/category/sidebar-category"),
  { ssr: false }
);

const InventorySearch = dynamic(() => import("./sections/inventory-search"), {
  ssr: false,
});

const InventoryProducts = dynamic(
  () => import("./sections/inventory-products"),
  { ssr: false }
);

/**
 * Basic Category Page Module
 * Category page with sidebar and product grid
 */
export function BasicCategoryPage() {
  const router = useRouter();
  const { shopDetails } = useShopStore();
  const { totalPrice, totalProducts, hasItems } = useCartTotals();

  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <>
      {/* Mobile Search - Hidden on desktop */}
      <div className="block md:hidden">
        <InventorySearch className="mt-5" />
      </div>

      {/* Main Content Grid */}
      <div className="container grid xl:grid-cols-5 gap-2 py-5">
        {/* Sidebar - Categories */}
        <div className="overflow-hidden -mr-5 xl:overflow-auto xl:mr-0 xl:bg-white dark:xl:bg-black-27 xl:rounded-xl xl:border xl:border-black-4 dark:xl:border-none xl:h-[calc(100vh-120px)] xl:sticky xl:top-25 xl:left-0 xl:self-start col-span-full xl:col-span-1">
          {/* Categories Label - Desktop only */}
          <li className="mx-4 mt-4 mb-4 hidden font-medium text-black-2 dark:text-gray-300 xl:block">
            Categories
          </li>

          {/* Desktop Sidebar */}
          <div className="hidden xl:block">
            <SidebarCategory isBasic />
          </div>

          {/* Mobile Horizontal Categories */}
          <div className="block xl:hidden">
            <CategoryHorizontalList fromCategory={true} />
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

export default BasicCategoryPage;
