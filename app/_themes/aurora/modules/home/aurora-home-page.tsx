"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/stores/cartStore";
import { useShopInventories, useShopCategories } from "@/hooks";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import type { Product } from "@/stores/productsStore";

// Dynamic imports for performance
const AuroraCarouselSlider = dynamic(
  () => import("../../components/carousel/aurora-carousel-slider"),
  { ssr: false }
);

const AuroraCategorySection = dynamic(
  () => import("./sections/aurora-category-section"),
  { ssr: false }
);

const AuroraFeaturedProductsSection = dynamic(
  () => import("./sections/aurora-featured-products-section"),
  { ssr: false }
);

const AuroraOnSaleSection = dynamic(
  () => import("./sections/aurora-onsale-section"),
  { ssr: false }
);

const AuroraSelectedProductsSection = dynamic(
  () => import("./sections/aurora-selected-products-section"),
  { ssr: false }
);

const VariantSelectorModal = dynamic(
  () => import("@/components/products/variant-selector-modal").then(mod => ({ default: mod.VariantSelectorModal })),
  { ssr: false }
);

export function AuroraHomePage() {
  const router = useRouter();
  const { shopDetails } = useShopStore();
  const totalProducts = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

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

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const baseUrl = shopDetails?.baseUrl || "";
  const onSaleInventories = shopDetails?.shop_theme?.on_sale_inventories || [];
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
    <div className="aurora-home-page">
      {/* Variant Selector Modal */}
      <VariantSelectorModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Primary Carousel/Banner */}
      <AuroraCarouselSlider tag="primary" />

      {/* Main Content Sections */}
      <div className="container flex flex-col py-12 md:py-15 xl:py-28 gap-12 md:gap-15 xl:gap-28">
        {/* Categories Section */}
        <AuroraCategorySection />

        {/* Featured Products Section */}
        <AuroraFeaturedProductsSection
          setSelectedProduct={setSelectedProduct}
          navigateProductDetails={navigateProductDetails}
        />

        {/* Secondary Carousel/Banner */}
        <AuroraCarouselSlider tag="secondary" />

        {/* On Sale Products Section */}
        {onSaleInventories.length > 0 && (
          <AuroraOnSaleSection
            setSelectedProduct={setSelectedProduct}
            navigateProductDetails={navigateProductDetails}
          />
        )}

        {/* Selected Products by Category */}
        <AuroraSelectedProductsSection
          setSelectedProduct={setSelectedProduct}
          navigateProductDetails={navigateProductDetails}
        />
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        onClick={handleCheckout}
        showCartFloatingBtn={hasItems}
        theme="Aurora"
        totalPrice={totalPrice}
        totalProducts={totalProducts}
      />
    </div>
  );
}

export default AuroraHomePage;
