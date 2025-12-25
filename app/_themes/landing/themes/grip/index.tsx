"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLandingStore } from "@/stores/landingStore";
import { useCartStore } from "@/stores/cartStore";
import { useShopStore } from "@/stores/shopStore";
import { LandingProductProvider, useLandingProduct } from "../../context/landing-product-context";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { getThemeColors } from "@/lib/utils";
import type {
  SingleProductPage,
  ContentType,
  ContentInterface,
  ProductVideoType,
} from "@/types/landing-page.types";
import type { Product } from "@/stores/productsStore";

import {
  GripNavbar,
  GripTopCarousel,
  GripFeatured,
  GripImageBanner,
  GripProductVideo,
  GripBuyNow,
  GripStandalone,
  GripProductImages,
  GripCheckoutForm,
  GripOrderStatus,
  GripFooter,
} from "./components";

interface GripLandingPageProps {
  landingData: SingleProductPage;
}

// Inner component that uses the landing product context
function GripLandingContent({ landingData }: GripLandingPageProps) {
  const { product, defaultVariants, productActionController, scrollToCheckout } = useLandingProduct();
  const { products: cartProducts, addProduct } = useCartStore();
  const { shopDetails } = useShopStore();
  const { primaryColor, orderPlaced } = useLandingStore();

  // Variant modal state
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [hasAutoAdded, setHasAutoAdded] = useState(false);

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

  const imageBanners = useMemo(() => {
    return themeData?.banners?.filter((b) => b.type === "IMAGE_BANNER") || [];
  }, [themeData?.banners]);

  const featuredVideo = useMemo(() => {
    return themeData?.product_videos?.find((v) => v.type === "FEATURED") || null;
  }, [themeData?.product_videos]);

  // Get cart products for this inventory
  const cartProductsList = Object.values(cartProducts);

  // Check if product should auto-add to cart
  const shouldAutoAdd = useMemo(() => {
    // Already added
    if (cartProductsList.length > 0) return false;

    // Don't auto-add if no product
    if (!product) return false;

    // Don't auto-add if already done
    if (hasAutoAdded) return false;

    // Check variant complexity
    const variantTypes = product.variant_types || [];

    // If no variants, auto-add
    if (variantTypes.length === 0) return true;

    // If only one variant type with one option, auto-add
    if (variantTypes.length === 1 && variantTypes[0].variants?.length === 1) {
      return true;
    }

    // If all mandatory variants have defaults, auto-add
    const mandatoryTypes = variantTypes.filter((t) => t.is_mandatory);
    if (mandatoryTypes.length === 0) return true;

    // For simple products with mandatory defaults set
    if (mandatoryTypes.every((t) => t.variants && t.variants.length > 0)) {
      return true;
    }

    return false;
  }, [product, cartProductsList.length, hasAutoAdded]);

  // Auto-add product to cart on mount (Grip theme feature)
  useEffect(() => {
    if (shouldAutoAdd && product && !orderPlaced) {
      // Add product with default variants
      addProduct({
        ...product,
        id: Number(product.id),
        image_url: product.images?.[0] || product.image_url,
        qty: 1,
        selectedVariants: defaultVariants,
        price: product.price,
        total_inventory_sold: (product as unknown as { total_inventory_sold?: number }).total_inventory_sold ?? 0,
        categories: product.categories ?? [],
        variant_types: product.variant_types ?? [],
        stocks: product.stocks ?? [],
        reviews: [],
      } as Parameters<typeof addProduct>[0]);

      setHasAutoAdded(true);
    }
  }, [shouldAutoAdd, product, addProduct, defaultVariants, orderPlaced]);

  // Handle Buy Now click
  const handleBuyNow = useCallback(
    (link: string | null) => {
      if (link === "buy-now" || link === "checkout") {
        // Check if product has multiple variant types that need selection
        const variantTypes = product?.variant_types || [];
        const mandatoryTypes = variantTypes.filter((t) => t.is_mandatory);

        if (mandatoryTypes.length > 1 || (mandatoryTypes.length === 1 && (mandatoryTypes[0].variants?.length || 0) > 1)) {
          // Open variant modal for selection
          setIsVariantModalOpen(true);
        } else {
          // Add to cart and scroll to checkout
          if (cartProductsList.length === 0) {
            productActionController.handleProductCartAction();
          }
          scrollToCheckout();
        }
      } else if (link) {
        // External link
        window.open(link, "_blank", "noopener,noreferrer");
      }
    },
    [product?.variant_types, productActionController, scrollToCheckout, cartProductsList.length]
  );

  // Handle variant selection complete
  const handleVariantSelect = useCallback(() => {
    setIsVariantModalOpen(false);
    scrollToCheckout();
  }, [scrollToCheckout]);

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
    <div className="min-h-screen flex flex-col">
      {/* Message on Top */}
      {themeData?.message_on_top && (
        <div className="bg-landing-primary text-white text-center py-2 px-4 text-sm">
          {themeData.message_on_top}
        </div>
      )}

      {/* Navbar */}
      <GripNavbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Carousel */}
        {topBanners.length > 0 && (
          <GripTopCarousel content={topBanners} onBuyNow={handleBuyNow} />
        )}

        {/* Featured Sections */}
        {featuredBanners.length > 0 && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <GripFeatured content={featuredBanners} onBuyNow={handleBuyNow} />
          </div>
        )}

        {/* Image Banner (first) */}
        {imageBanners.length > 0 && (
          <GripImageBanner content={imageBanners[0]} />
        )}

        {/* Product Video */}
        {featuredVideo && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <GripProductVideo content={featuredVideo} onBuyNow={handleBuyNow} />
          </div>
        )}

        {/* Showcase/Buy Now Section */}
        {showcaseBanners.length > 0 && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <GripBuyNow content={showcaseBanners} onBuyNow={handleBuyNow} />
          </div>
        )}

        {/* Image Banner (second) */}
        {imageBanners.length > 1 && (
          <GripImageBanner content={imageBanners[1]} />
        )}

        {/* Standalone Section */}
        {standaloneBanner && (
          <GripStandalone content={standaloneBanner} onBuyNow={handleBuyNow} />
        )}

        {/* Product Images */}
        {themeData?.product_image && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <GripProductImages content={themeData.product_image} />
          </div>
        )}

        {/* Order Status (shown after successful order) */}
        <GripOrderStatus />

        {/* Checkout Form (embedded) */}
        <GripCheckoutForm />
      </main>

      {/* Footer */}
      <GripFooter />

      {/* Variant Selector Modal */}
      {product && (
        <VariantSelectorModal
          isOpen={isVariantModalOpen}
          onClose={() => setIsVariantModalOpen(false)}
          product={product as unknown as Parameters<typeof VariantSelectorModal>[0]["product"]}
          onAddToCart={handleVariantSelect}
        />
      )}
    </div>
  );
}

// Main Grip Landing Page component
export function GripLandingPage({ landingData }: GripLandingPageProps) {
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
      <GripLandingContent landingData={landingData} />
    </LandingProductProvider>
  );
}

export default GripLandingPage;
