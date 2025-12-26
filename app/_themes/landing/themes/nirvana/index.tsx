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
import { CustomerReviews } from "@/components/products/customer-reviews";
import type { SingleProductPage } from "@/types/landing-page.types";
import type { Product, Review } from "@/stores/productsStore";

import {
  NirvanaNavbar,
  NirvanaTopCarousel,
  NirvanaStaticBanner,
  NirvanaFocusedInfo,
  NirvanaFeatures,
  NirvanaHighlightedInfo,
  NirvanaProductVideo,
  NirvanaProductImages,
  NirvanaProductPricing,
  NirvanaFooter,
} from "./components";

interface NirvanaLandingPageProps {
  landingData: SingleProductPage;
}

// Inner component that uses the landing product context
function NirvanaLandingContent({ landingData }: NirvanaLandingPageProps) {
  const { product, defaultVariants } = useLandingProduct();
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

  const standaloneBanner = useMemo(() => {
    return themeData?.banners?.find((b) => b.type === "STANDALONE") || null;
  }, [themeData?.banners]);

  const textOnlyContent = useMemo(() => {
    return themeData?.banners?.filter((b) => b.type === "TEXTONLY") || [];
  }, [themeData?.banners]);

  const textContent = useMemo(() => {
    return themeData?.banners?.filter((b) => b.type === "TEXT") || [];
  }, [themeData?.banners]);

  const imageBanner = useMemo(() => {
    return themeData?.banners?.find((b) => b.type === "IMAGE_BANNER") || null;
  }, [themeData?.banners]);

  const simpleFeatures = useMemo(() => {
    return themeData?.features?.find((f) => f.type === "SIMPLE") || null;
  }, [themeData?.features]);

  const productVideos = useMemo(() => {
    return themeData?.product_videos || null;
  }, [themeData?.product_videos]);

  const productImages = useMemo(() => {
    return themeData?.product_image || null;
  }, [themeData?.product_image]);

  const productReviews = (landingData.inventory?.reviews || []) as Review[];

  // Get cart products list
  const cartProductsList = Object.values(cartProducts);
  const baseUrl = shopDetails?.baseUrl || "";

  // Handle Buy Now click - Nirvana redirects to checkout
  const handleBuyNow = useCallback(
    (link: string | null) => {
      if (link === "buy-now" || !link) {
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
          if (cartProductsList.length === 0 && product) {
            addProduct({
              ...product,
              id: Number(product.id),
              image_url: product.images?.[0] || product.image_url,
              qty: 1,
              selectedVariants: defaultVariants,
              price: product.price,
              total_inventory_sold: 0,
              categories: product.categories ?? [],
              variant_types: product.variant_types ?? [],
              stocks: product.stocks ?? [],
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
    <div className="min-h-screen flex flex-col font-sans text-gray-900 leading-snug">
      {/* Navbar */}
      <NirvanaNavbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Carousel */}
        <div className="container mx-auto">
          <NirvanaTopCarousel content={topBanners} />
        </div>

        {/* Conditional rendering based on product video presence */}
        {productVideos ? (
          <>
            <NirvanaProductVideo
              content={productVideos}
              onBuyNow={handleBuyNow}
            />
            <NirvanaStaticBanner content={standaloneBanner} />
            <NirvanaFocusedInfo
              content={textOnlyContent[0]}
              onBuyNow={handleBuyNow}
            />
          </>
        ) : (
          <>
            <NirvanaStaticBanner content={standaloneBanner} />
            <NirvanaFocusedInfo
              content={textOnlyContent[0]}
              onBuyNow={handleBuyNow}
            />
          </>
        )}

        {/* Features Section */}
        {simpleFeatures && <NirvanaFeatures content={simpleFeatures} />}

        {/* Highlighted Information */}
        <NirvanaHighlightedInfo
          content={textContent[0]}
          onBuyNow={handleBuyNow}
        />

        {/* Product Images */}
        <NirvanaProductImages content={productImages} />

        {/* Product Pricing */}
        <NirvanaProductPricing
          product={landingData.inventory}
          content={imageBanner}
          onBuyNow={handleBuyNow}
        />

        {/* Customer Reviews */}
        {productReviews.length > 0 && (
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-4xl md:text-6xl font-extrabold text-center bg-linear-to-r from-landing-primary to-landing-secondary bg-clip-text text-transparent mb-12">
              Customer Reviews
            </h2>
            <CustomerReviews reviews={productReviews} />
          </div>
        )}
      </main>

      {/* Footer */}
      <NirvanaFooter />

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

// Main Nirvana Landing Page component
export function NirvanaLandingPage({ landingData }: NirvanaLandingPageProps) {
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
      <NirvanaLandingContent landingData={landingData} />
    </LandingProductProvider>
  );
}

export default NirvanaLandingPage;
