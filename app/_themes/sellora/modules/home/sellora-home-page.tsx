"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useShopStore } from "@/stores/shopStore";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/stores/cartStore";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { HeroCarousel } from "../../components/carousel";
import {
  OurCollectionSection,
  FeaturedProductsSection,
  OnSaleSection,
} from "./sections";
import type { Product } from "@/stores/productsStore";

interface Carousel {
  tag?: string;
  image_url: string;
  title?: string;
  sub_title?: string;
  button_text?: string;
  button_link?: string;
}

export function SelloraHomePage() {
  const router = useRouter();
  const { shopDetails } = useShopStore();
  const totalProducts = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const baseUrl = shopDetails?.baseUrl || "";
  const hasItems = totalProducts > 0;

  // Get carousels
  const carousels =
    (shopDetails?.shop_theme as unknown as { carousels?: Carousel[] })
      ?.carousels || [];
  const hasSecondaryCarousel = carousels.some((c) => c.tag === "secondary");
  const hasOnSale =
    (shopDetails?.shop_theme as unknown as { on_sale_inventories?: Product[] })
      ?.on_sale_inventories?.length ?? 0 > 0;

  // Navigate to product details
  const navigateProductDetails = useCallback(
    (id: number | string) => {
      router.push(`${baseUrl}/products/${id}`);
    },
    [router, baseUrl]
  );

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  return (
    <div>
      {/* Variant Selector Modal */}
      <VariantSelectorModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={handleCloseModal}
      />

      {/* Hero Carousel */}
      {carousels.length > 0 && <HeroCarousel tag="primary" />}

      {/* Category Section */}
      <OurCollectionSection />

      {/* Featured Products */}
      <div className="container flex flex-col">
        <FeaturedProductsSection
          setSelectedProduct={setSelectedProduct}
          navigateProductDetails={navigateProductDetails}
        />

        {/* Secondary Carousel */}
        {hasSecondaryCarousel && (
          <div className="px-0">
            <HeroCarousel tag="secondary" />
          </div>
        )}

        {/* On Sale Section */}
        {hasOnSale && (
          <OnSaleSection
            setSelectedProduct={setSelectedProduct}
            navigateProductDetails={navigateProductDetails}
          />
        )}
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        showCartFloatingBtn={hasItems}
        totalProducts={totalProducts}
        totalPrice={totalPrice}
        onClick={() => router.push(`${baseUrl}/checkout`)}
        theme="Sellora"
      />
    </div>
  );
}

export default SelloraHomePage;
