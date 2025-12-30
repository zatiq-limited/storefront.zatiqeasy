"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useShopStore } from "@/stores/shopStore";
import type { Product } from "@/stores/productsStore";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/stores/cartStore";
import { useShopInventories, useShopCategories } from "@/hooks";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { PremiumCarouselSlider } from "../../components/carousel";

// Dynamic imports for sections
const PremiumCategorySection = dynamic(
  () =>
    import("./sections/premium-category-section").then(
      (mod) => mod.PremiumCategorySection
    ),
  { ssr: false }
);

const PremiumFeaturedProductsSection = dynamic(
  () =>
    import("./sections/premium-featured-products-section").then(
      (mod) => mod.PremiumFeaturedProductsSection
    ),
  { ssr: false }
);

const PremiumCategoryProductsSection = dynamic(
  () =>
    import("./sections/premium-category-products-section").then(
      (mod) => mod.PremiumCategoryProductsSection
    ),
  { ssr: false }
);

export function PremiumHomePage() {
  const router = useRouter();
  const { shopDetails } = useShopStore();
  const totalProducts = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  // Fetch products and categories to populate the store
  useShopInventories(
    { shopUuid: shopDetails?.shop_uuid ?? "" },
    { enabled: !!shopDetails?.shop_uuid }
  );

  useShopCategories(
    { shopUuid: shopDetails?.shop_uuid ?? "" },
    { enabled: !!shopDetails?.shop_uuid }
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const baseUrl = shopDetails?.baseUrl || "";
  const selectedInventories =
    (shopDetails?.shop_theme as unknown as { selected_inventories?: Product[] })
      ?.selected_inventories || [];
  const hasItems = totalProducts > 0;

  // Navigate to product detail
  const navigateProductDetails = useCallback(
    (id: number | string) => {
      router.push(`${baseUrl}/products/${id}`);
    },
    [router, baseUrl]
  );

  // Close variant selector modal
  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Carousel Slider */}
      <div className="w-[96vw] md:w-full mx-auto relative">
        <PremiumCarouselSlider />
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="flex flex-col pt-12 md:pt-15 xl:pt-21 gap-12 md:gap-15 xl:gap-21">
          {/* Categories Section */}
          <PremiumCategorySection showHeader={true} />

          {/* Featured Products Section */}
          <PremiumFeaturedProductsSection
            products={selectedInventories.slice(0, 10)}
            setSelectedProduct={setSelectedProduct}
            navigateProductDetails={navigateProductDetails}
          />

          {/* Category-Based Products Sections */}
          <PremiumCategoryProductsSection
            setSelectedProduct={setSelectedProduct}
            navigateProductDetails={navigateProductDetails}
          />
        </div>
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        showCartFloatingBtn={hasItems}
        totalProducts={totalProducts}
        totalPrice={totalPrice}
        onClick={() => router.push(`${baseUrl}/checkout`)}
        theme="Premium"
      />

      {/* Variant Selector Modal */}
      {selectedProduct && (
        <VariantSelectorModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default PremiumHomePage;
