"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCartStore, useShopStore } from "@/stores";

// Dynamic imports for better performance (matching old project pattern)
const CategoryHorizontalList = dynamic(
  () => import("@/app/components/category/category-horizontal-list"),
  { ssr: false }
);

const SidebarCategory = dynamic(
  () => import("@/app/components/category/sidebar-category"),
  { ssr: false }
);

const InventorySearch = dynamic(() => import("./sections/inventory-search"), {
  ssr: false,
});

const InventoryProducts = dynamic(
  () => import("./sections/inventory-products"),
  { ssr: false }
);

const ProductDetails = dynamic(() => import("./sections/product-details"), {
  ssr: false,
});

// Import CartFloatingBtn component
import { CartFloatingBtn } from "@/components/cart/cart-floating-btn";

interface BasicHomePageProps {
  initialProductId?: string;
}

/**
 * Basic Homepage Module
 * Migrated from the old project to match exactly
 */
export function BasicHomePage({ initialProductId }: BasicHomePageProps) {
  const router = useRouter();

  // Get shop details
  const { shopDetails } = useShopStore();

  // Get cart state directly from store (avoiding selector caching issues)
  const products = useCartStore((state) => state.products);

  // Calculate values in useMemo to avoid recalculation on every render
  const { totalPrice, totalProducts } = useMemo(() => {
    const productList = Object.values(products);
    return {
      totalPrice: productList.reduce((sum, p) => sum + p.price * p.qty, 0),
      totalProducts: productList.reduce((sum, p) => sum + p.qty, 0),
    };
  }, [products]);

  // Determine if white-labeled (from old project logic)
  const isWhiteLeveled =
    typeof window !== "undefined" &&
    !window.location.pathname.includes("/merchant/");
  const baseUrl = shopDetails?.baseUrl || "/";

  return (
    <>
      {/* Mobile Search - Hidden on desktop (matching old project: windowWidth < breakpoints.md.min) */}
      <div className="block md:hidden">
        <InventorySearch className="mt-5" />
      </div>

      {/* Main Content Grid (exact match to old project) */}
      <div className="container grid xl:grid-cols-5 gap-5 py-2">
        {/* Sidebar - Categories (exact styling from old project) */}
        <div className="overflow-hidden -mr-5 xl:overflow-auto xl:mr-0 xl:bg-white dark:xl:bg-black-27 xl:rounded-xl xl:border xl:border-black-4 dark:xl:border-none xl:h-[calc(100vh-120px)] xl:sticky xl:top-25 xl:left-0 xl:self-start col-span-full xl:col-span-1">
          {/* Categories Label - Only visible on desktop */}
          <li className="mx-4 mt-4 mb-4 hidden font-medium text-black-2 dark:text-gray-300 xl:block">
            Categories
          </li>

          {/* Desktop Sidebar (hidden xl:block) */}
          <div className="hidden xl:block">
            <SidebarCategory isBasic />
          </div>

          {/* Mobile Horizontal Categories (block xl:hidden) */}
          <div className="block xl:hidden">
            <CategoryHorizontalList />
          </div>
        </div>

        {/* Main Content - Products (xl:col-span-4) */}
        <div className="xl:col-span-4">
          <InventoryProducts />
        </div>
      </div>

      {/* Floating Cart Button (matching old project) */}
      <CartFloatingBtn
        onClick={() => {
          router.push(`${baseUrl}/checkout`);
        }}
        showCartFloatingBtn={totalProducts > 0}
        totalPrice={totalPrice}
        totalProducts={totalProducts}
        theme="Basic"
      />
    </>
  );
}

// Export the component as default
export default BasicHomePage;

// Export types for external use
export type { BasicHomePageProps };
