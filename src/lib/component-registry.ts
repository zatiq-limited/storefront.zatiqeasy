/**
 * ========================================
 * ZATIQ COMPONENT REGISTRY
 * ========================================
 *
 * এই file এ সব headless components কে register করা হয়েছে
 * যাতে API response থেকে component-type দিয়ে dynamically render করা যায়
 */

import type { ComponentType } from "react";

// Import all components from local zatiq components folder
import { Hero1, Hero2, Hero3, Hero4 } from "@/components/zatiq/heroes";
import {
  Navbar1,
  Navbar2,
  Navbar3,
  Navbar4,
} from "@/components/zatiq/navbars";
import {
  Category1,
  Category2,
  Category3,
  Category4,
} from "@/components/zatiq/category";
// Category5 and Category6 are default exports
import Category5 from "@/components/zatiq/category/Category5";
import Category6 from "@/components/zatiq/category/Category6";
import {
  ProductCards1,
  ProductCards2,
  ProductCards3,
  ProductCards4,
  ProductCards5,
  ProductCards6,
  ProductCards7,
  ProductCards8,
} from "@/components/zatiq/product-cards";
import { Footers1, Footers2 } from "@/components/zatiq/footers";
import { Reviews1, Reviews2, Reviews3 } from "@/components/zatiq/reviews";
import { Brands1, Brands2, Brands3 } from "@/components/zatiq/brands";
import {
  SpecialOffersSlider1,
  SpecialOffersSlider2,
  SpecialOffersSlider3,
  SpecialOffersSlider4,
  SpecialOffersSlider5,
} from "@/components/zatiq/special-offers-slider";
import { Badges1, Badges2, Badges3 } from "@/components/zatiq/badges";
import {
  AnnouncementBar1,
  AnnouncementBar2,
  AnnouncementBar3,
} from "@/components/zatiq/announcement-bars";
import {
  StaticBanner1,
  StaticBanner2,
  StaticBanner3,
  StaticBanner4,
} from "@/components/zatiq/static-banner";

import {
  PaymentStatus1,
  PaymentStatus2,
} from "@/components/zatiq/payment-status";
import { ProductTabs1, ProductTabs2 } from "../components/zatiq/product-tabs";
import { ProductCollection1, ProductCollection2 } from "@/components/zatiq/product-collection";
import { SocialFeed1, SocialFeed2 } from "@/components/zatiq/social-feed";
import { CustomSections } from "@/components/zatiq/custom-sections";
import {
  ProductsHero1,
  ProductsHero2,
  ProductsFilter1,
  ProductsFilter2,
  ProductsSidebar1,
  ProductsSidebar2,
  ProductsGrid1,
  ProductsGrid2,
  ProductsPagination1,
  ProductsPagination2,
  ProductsLayout1,
  ProductsLayout2,
  ProductsContent1,
  ProductsEmpty1,
} from "@/components/zatiq/products-page";

// Product Details Page Components
import ProductBreadcrumb1 from "@/components/zatiq/product-details-page/ProductBreadcrumb1";
import ProductBreadcrumb2 from "@/components/zatiq/product-details-page/ProductBreadcrumb2";
import ProductDetail1 from "@/components/zatiq/product-details-page/ProductDetail1";
import ProductDetail2 from "@/components/zatiq/product-details-page/ProductDetail2";
import CustomerReviews1 from "@/components/zatiq/product-details-page/CustomerReviews1";
import CustomerReviews2 from "@/components/zatiq/product-details-page/CustomerReviews2";
import RelatedProducts1 from "@/components/zatiq/product-details-page/RelatedProducts1";
import RelatedProducts2 from "@/components/zatiq/product-details-page/RelatedProducts2";

// Collections Page Components
import {
  CollectionsHero1,
  CollectionsHero2,
  CollectionsGrid1,
  CollectionsGrid2,
} from "@/components/zatiq/collections";

// Collection Details Page Components
import {
  CollectionBreadcrumb1,
  CollectionBreadcrumb2,
  CollectionBanner1,
  CollectionBanner2,
  CollectionProducts1,
  CollectionProducts2,
} from "@/components/zatiq/collection-details";

// About Page Components
import {
  AboutHero1,
  AboutHero2,
  AboutStory1,
  AboutStory2,
  AboutValues1,
  AboutValues2,
  AboutTeam1,
  AboutTeam2,
} from "@/components/zatiq/about";


/**
 * Component Registry
 * API থেকে যে component-type আসবে সেই অনুযায়ী component render করার জন্য
 */
export const ZATIQ_COMPONENTS: Record<string, ComponentType<any>> = {
  // Announcement Bars (3 variants)
  "announcement-bar-1": AnnouncementBar1,
  "announcement-bar-2": AnnouncementBar2,
  "announcement-bar-3": AnnouncementBar3,

  // Navbars (4 variants)
  "navbar-1": Navbar1,
  "navbar-2": Navbar2,
  "navbar-3": Navbar3,
  "navbar-4": Navbar4,

  // Heroes (4 variants)
  "hero-1": Hero1,
  "hero-2": Hero2,
  "hero-3": Hero3,
  "hero-4": Hero4,

  // Static Banners (5 variants)
  "static-banner-1": StaticBanner1,
  "static-banner-2": StaticBanner2,
  "static-banner-3": StaticBanner3,
  "static-banner-4": StaticBanner4,

  // Categories (6 variants)
  "category-1": Category1,
  "category-2": Category2,
  "category-3": Category3,
  "category-4": Category4,
  "category-5": Category5,
  "category-6": Category6,

  // Product Cards (8 variants)
  "product-card-1": ProductCards1,
  "product-card-2": ProductCards2,
  "product-card-3": ProductCards3,
  "product-card-4": ProductCards4,
  "product-card-5": ProductCards5,
  "product-card-6": ProductCards6,
  "product-card-7": ProductCards7,
  "product-card-8": ProductCards8,

  // Special Offers Sliders (5 variants)
  "special-offers-slider-1": SpecialOffersSlider1,
  "special-offers-slider-2": SpecialOffersSlider2,
  "special-offers-slider-3": SpecialOffersSlider3,
  "special-offers-slider-4": SpecialOffersSlider4,
  "special-offers-slider-5": SpecialOffersSlider5,

  // Badges (3 variants)
  "badges-1": Badges1,
  "badges-2": Badges2,
  "badges-3": Badges3,

  // Reviews (3 variants)
  "reviews-1": Reviews1,
  "reviews-2": Reviews2,
  "reviews-3": Reviews3,

  // Brands (3 variants)
  "brands-1": Brands1,
  "brands-2": Brands2,
  "brands-3": Brands3,

  // Footers (2 variants)
  "footer-1": Footers1,
  "footer-2": Footers2,

  // Payment Status (2 variants)
  "payment-status-1": PaymentStatus1,
  "payment-status-2": PaymentStatus2,

  // Product Tabs (2 variants)
  "product-tabs-1": ProductTabs1,
  "product-tabs-2": ProductTabs2,

  // Product Collections (2 variants)
  "product-collection-1": ProductCollection1,
  "product-collection-2": ProductCollection2,

  // Social Feed (2 variants)
  "social-feed-1": SocialFeed1,
  "social-feed-2": SocialFeed2,

  // Custom Sections (2 variants - same component, different settings)
  "custom-sections-1": CustomSections,
  "custom-sections-2": CustomSections,
  // Products Page Components
  "products-hero-1": ProductsHero1,
  "products-hero-2": ProductsHero2,
  "products-filter-1": ProductsFilter1,
  "products-filter-2": ProductsFilter2,
  "products-sidebar-1": ProductsSidebar1,
  "products-sidebar-2": ProductsSidebar2,
  "products-grid-1": ProductsGrid1,
  "products-grid-2": ProductsGrid2,
  "products-pagination-1": ProductsPagination1,
  "products-pagination-2": ProductsPagination2,
  "products-layout-1": ProductsLayout1,
  "products-layout-2": ProductsLayout2,
  "products-content-1": ProductsContent1,
  "products-empty-1": ProductsEmpty1,

  // Product Details Page Components
  "product-breadcrumb-1": ProductBreadcrumb1,
  "product-breadcrumb-2": ProductBreadcrumb2,
  "product-detail-1": ProductDetail1,
  "product-detail-2": ProductDetail2,
  "customer-reviews-1": CustomerReviews1,
  "customer-reviews-2": CustomerReviews2,
  "related-products-1": RelatedProducts1,
  "related-products-2": RelatedProducts2,

  // Collections Page Components
  "collections-hero-1": CollectionsHero1,
  "collections-hero-2": CollectionsHero2,
  "collections-grid-1": CollectionsGrid1,
  "collections-grid-2": CollectionsGrid2,

  // Collection Details Page Components
  "collection-breadcrumb-1": CollectionBreadcrumb1,
  "collection-breadcrumb-2": CollectionBreadcrumb2,
  "collection-banner-1": CollectionBanner1,
  "collection-banner-2": CollectionBanner2,
  "collection-products-1": CollectionProducts1,
  "collection-products-2": CollectionProducts2,

  // About Page Components (2 variants each)
  "about-hero-1": AboutHero1,
  "about-hero-2": AboutHero2,
  "about-story-1": AboutStory1,
  "about-story-2": AboutStory2,
  "about-values-1": AboutValues1,
  "about-values-2": AboutValues2,
  "about-team-1": AboutTeam1,
  "about-team-2": AboutTeam2,
};

/**
 * Get component by type
 * @param componentType - Component type from API (e.g., 'hero-1', 'navbar-2')
 * @returns React Component or null if not found
 */
export function getComponent(componentType: string): ComponentType<any> | null {
  return ZATIQ_COMPONENTS[componentType] || null;
}

/**
 * Check if component exists
 */
export function hasComponent(componentType: string): boolean {
  return componentType in ZATIQ_COMPONENTS;
}

/**
 * Get all available component types
 */
export function getAvailableComponents(): string[] {
  return Object.keys(ZATIQ_COMPONENTS);
}
