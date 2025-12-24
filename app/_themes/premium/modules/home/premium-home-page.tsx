"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/stores/cartStore";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";

// Dynamic imports for sections
const PremiumCategorySection = dynamic(
  () => import("./sections/premium-category-section").then((mod) => mod.PremiumCategorySection),
  { ssr: false }
);

const PremiumFeaturedProductsSection = dynamic(
  () => import("./sections/premium-featured-products-section").then((mod) => mod.PremiumFeaturedProductsSection),
  { ssr: false }
);

const PremiumCategoryProductsSection = dynamic(
  () => import("./sections/premium-category-products-section").then((mod) => mod.PremiumCategoryProductsSection),
  { ssr: false }
);

export function PremiumHomePage() {
  const router = useRouter();
  const { shopDetails } = useShopStore();
  const products = useProductsStore((state) => state.products);
  const totalProducts = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const baseUrl = shopDetails?.baseUrl || "";
  const selectedInventories = (shopDetails?.shop_theme as unknown as { selected_inventories?: Product[] })?.selected_inventories || [];
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="w-[95%] md:w-[90%] lg:w-[85%] max-w-[1400px] mx-auto py-6 md:py-10 lg:py-14">
        <div className="space-y-10 md:space-y-14 lg:space-y-16">
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
