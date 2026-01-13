"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useLandingStore } from "@/stores/landingStore";
import { useCartStore } from "@/stores/cartStore";
import { useShopStore } from "@/stores/shopStore";
import {
  LandingProductProvider,
  useLandingProduct,
} from "../../context/landing-product-context";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { getThemeColors } from "@/lib/utils";
import type { SingleProductPage } from "@/types/landing-page.types";
import type { Product } from "@/stores/productsStore";

import {
  ArcadiaNavbar,
  ArcadiaTopCarousel,
  ArcadiaFeatured,
  ArcadiaProductVideo,
  ArcadiaBuyNow,
  ArcadiaStandalone,
  ArcadiaProductImages,
  ArcadiaProductPricing,
  ArcadiaCheckoutRedirect,
  ArcadiaFooter,
} from "./components";

interface ArcadiaLandingPageProps {
  landingData: SingleProductPage;
}

// Inner component that uses the landing product context
function ArcadiaLandingContent({ landingData }: ArcadiaLandingPageProps) {
  const { product, defaultVariants, productActionController } =
    useLandingProduct();
  const { products: cartProducts, addProduct } = useCartStore();
  const { shopDetails } = useShopStore();
  const { primaryColor } = useLandingStore();

  // Variant modal state
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  // Get theme data
  const themeData = landingData.theme_data?.[0];

  // Filter content by type
  const topBanners = useMemo(() => {
    return themeData?.banners?.filter((b) => b.type === "TOP") || [];
  }, [themeData?.banners]);

  const featuredBanners = useMemo(() => {
    return themeData?.banners?.filter((b) => b.type === "FEATURED") || [];
  }, [themeData?.banners]);

  const showcaseBanners = useMemo(() => {
    return themeData?.banners?.filter((b) => b.type === "SHOWCASE") || [];
  }, [themeData?.banners]);

  const standaloneBanner = useMemo(() => {
    return themeData?.banners?.find((b) => b.type === "STANDALONE") || null;
  }, [themeData?.banners]);

  const productVideos = useMemo(() => {
    return themeData?.product_videos || [];
  }, [themeData?.product_videos]);

  // Get cart products list
  const cartProductsList = Object.values(cartProducts);
  const baseUrl = shopDetails?.baseUrl || "";

  // Handle Buy Now click - Arcadia redirects to checkout
  const handleBuyNow = useCallback(
    (link: string | null) => {
      if (link === "buy-now") {
        // Check if product has multiple variant types that need selection
        const variantTypes = product?.variant_types || [];
        const mandatoryTypes = variantTypes.filter((t) => t.is_mandatory);

        if (
          mandatoryTypes.length > 1 ||
          (mandatoryTypes.length === 1 &&
            (mandatoryTypes[0].variants?.length || 0) > 1)
        ) {
          // Open variant modal for selection
          setIsVariantModalOpen(true);
        } else {
          // Add to cart and redirect to checkout
          if (cartProductsList.length === 0) {
            addProduct({
              ...product!,
              id: Number(product!.id),
              image_url: product!.images?.[0] || product!.image_url,
              qty: 1,
              selectedVariants: defaultVariants,
              price: product!.price,
              total_inventory_sold: 0,
              categories: product!.categories ?? [],
              variant_types: product!.variant_types ?? [],
              stocks: product!.stocks ?? [],
              reviews: [],
            } as Parameters<typeof addProduct>[0]);
          }
          window.location.href = `${baseUrl}/checkout`;
        }
      } else if (link) {
        // External link
        window.open(link, "_blank", "noopener,noreferrer");
      }
    },
    [product, addProduct, defaultVariants, cartProductsList.length, baseUrl]
  );

  // Handle variant selection complete - redirect to checkout
  const handleVariantSelect = useCallback(() => {
    setIsVariantModalOpen(false);
    window.location.href = `${baseUrl}/checkout`;
  }, [baseUrl]);

  // Apply dynamic CSS colors
  useEffect(() => {
    if (primaryColor) {
      const colors = getThemeColors(primaryColor, "landing-primary");
      Object.entries(colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }

    // Cleanup on unmount
    return () => {
      const colors = getThemeColors("#541DFF", "landing-primary");
      Object.entries(colors).forEach(([key]) => {
        document.documentElement.style.removeProperty(key);
      });
    };
  }, [primaryColor]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Arcadia Navbar */}
      <ArcadiaNavbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Carousel */}
        <div className="container mx-auto">
          <ArcadiaTopCarousel content={topBanners} onBuyNow={handleBuyNow} />
        </div>

        {/* Featured Sections */}
        {featuredBanners.length > 0 && (
          <div className="container">
            <ArcadiaFeatured
              content={featuredBanners}
              onBuyNow={handleBuyNow}
            />
          </div>
        )}

        {/* Product Video */}
        {productVideos.length > 0 && (
          <ArcadiaProductVideo
            content={productVideos}
            onBuyNow={handleBuyNow}
          />
        )}

        {/* Showcase/Buy Now Section */}
        {showcaseBanners.length > 0 && (
          <div className="container">
            <ArcadiaBuyNow content={showcaseBanners} onBuyNow={handleBuyNow} />
          </div>
        )}

        {/* Standalone Section */}
        {standaloneBanner && (
          <ArcadiaStandalone
            content={standaloneBanner}
            onBuyNow={handleBuyNow}
          />
        )}

        {/* Product Images */}
        {themeData?.product_image && (
          <div className="container">
            <ArcadiaProductImages content={themeData.product_image} />
          </div>
        )}

        {/* Product Pricing (Flash Sale) */}
        <ArcadiaProductPricing onBuyNow={handleBuyNow} />

        {/* Checkout Redirect CTA */}
        <ArcadiaCheckoutRedirect />
      </main>

      {/* Footer */}
      <ArcadiaFooter />

      {/* Variant Selector Modal */}
      {product && (
        <VariantSelectorModal
          isOpen={isVariantModalOpen}
          onClose={() => setIsVariantModalOpen(false)}
          product={
            product as unknown as Parameters<
              typeof VariantSelectorModal
            >[0]["product"]
          }
          onAddToCart={handleVariantSelect}
        />
      )}
    </div>
  );
}

// Main Arcadia Landing Page component
export function ArcadiaLandingPage({ landingData }: ArcadiaLandingPageProps) {
  // Convert inventory to Product type for the context
  const product = landingData.inventory as unknown as Product;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return (
    <LandingProductProvider product={product}>
      <ArcadiaLandingContent landingData={landingData} />
    </LandingProductProvider>
  );
}

export default ArcadiaLandingPage;
