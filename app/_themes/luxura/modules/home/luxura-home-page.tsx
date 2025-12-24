"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/stores/cartStore";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import type { Product } from "@/stores/productsStore";

// Dynamic imports for performance
const LuxuraHeroSection = dynamic(
  () => import("./sections/luxura-hero-section"),
  { ssr: false }
);

const LuxuraCategorySection = dynamic(
  () => import("./sections/luxura-category-section"),
  { ssr: false }
);

const LuxuraNewArrivalsSection = dynamic(
  () => import("./sections/luxura-new-arrivals-section"),
  { ssr: false }
);

const LuxuraFeaturedProductsSection = dynamic(
  () => import("./sections/luxura-featured-products-section"),
  { ssr: false }
);

const LuxuraSelectedProductsByCategorySection = dynamic(
  () => import("./sections/luxura-selected-products-by-category-section"),
  { ssr: false }
);

const VariantSelectorModal = dynamic(
  () => import("@/components/products/variant-selector-modal").then(mod => ({ default: mod.VariantSelectorModal })),
  { ssr: false }
);

export function LuxuraHomePage() {
  const router = useRouter();
  const { shopDetails } = useShopStore();
  const totalProducts = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const baseUrl = shopDetails?.baseUrl || "";
  const selectedInventories = (shopDetails?.shop_theme as unknown as { selected_inventories?: Product[] })?.selected_inventories || [];
  const onSaleInventories = (shopDetails?.shop_theme as unknown as { on_sale_inventories?: Product[] })?.on_sale_inventories || [];
  const hasItems = totalProducts > 0;

  // Navigate to product detail
  const navigateProductDetails = useCallback(
    (id: number | string) => {
      router.push(`${baseUrl}/products/${id}`);
    },
    [router, baseUrl]
  );

  // Navigate to checkout
  const handleCheckout = useCallback(() => {
    router.push(`${baseUrl}/checkout`);
  }, [router, baseUrl]);

  return (
    <>
      {/* Variant Selector Modal */}
      <VariantSelectorModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Main Content - Luxura uses larger spacing (84px on desktop) */}
      <div className="flex flex-col py-[24px] md:py-[60px] xl:py-[84px] gap-[36px] md:gap-[60px] xl:gap-[84px]">
        {/* Hero Section with Sidebar Categories - Premium width 78% */}
        <div className="w-[95%] md:w-[95%] lg:w-[78%] mx-auto flex flex-col gap-8 lg:gap-20">
          <LuxuraHeroSection />
          <LuxuraCategorySection />
        </div>

        {/* New Arrivals Section */}
        <LuxuraNewArrivalsSection
          setSelectedProduct={setSelectedProduct}
          navigateProductDetails={navigateProductDetails}
        />

        {/* Featured Products & Flash Sale */}
        <div className="w-[95%] md:w-[90%] lg:w-[78%] mx-auto flex flex-col gap-[48px] md:gap-[60px] xl:gap-[84px]">
          {/* Featured Products */}
          {(selectedInventories as Product[]).length > 0 && (
            <LuxuraFeaturedProductsSection
              products={selectedInventories as Product[]}
              setSelectedProduct={setSelectedProduct}
              navigateProductDetails={navigateProductDetails}
              title="featured_products"
            />
          )}

          {/* Flash Sale / On Sale Products */}
          {(onSaleInventories as Product[]).length > 0 && (
            <LuxuraFeaturedProductsSection
              products={onSaleInventories as Product[]}
              setSelectedProduct={setSelectedProduct}
              navigateProductDetails={navigateProductDetails}
              title="flash_sale"
            />
          )}
        </div>

        {/* Selected Products by Category */}
        <LuxuraSelectedProductsByCategorySection
          setSelectedProduct={setSelectedProduct}
          navigateProductDetails={navigateProductDetails}
        />
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        onClick={handleCheckout}
        showCartFloatingBtn={hasItems}
        theme="Luxura"
        totalPrice={totalPrice}
        totalProducts={totalProducts}
      />
    </>
  );
}

export default LuxuraHomePage;
