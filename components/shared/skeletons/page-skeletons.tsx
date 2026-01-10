"use client";

import { cn } from "@/lib/utils";

/**
 * Height constants for layout calculations
 * Header: 64px (h-16) on both mobile and desktop
 * Footer: ~300px on mobile, ~250px on desktop (approximate)
 */
const HEADER_HEIGHT = "64px";
const FOOTER_HEIGHT_MOBILE = "300px";
const FOOTER_HEIGHT_DESKTOP = "200px";

/**
 * Base Skeleton component with pulse animation
 */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-gray-200 dark:bg-gray-700 animate-pulse rounded",
        className
      )}
    />
  );
}

/**
 * Minimal Page Loader
 * A clean, professional loading indicator for theme builder pages
 */
export function PageLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        className
      )}
      style={{
        minHeight: `calc(100vh - ${HEADER_HEIGHT} - ${FOOTER_HEIGHT_MOBILE})`,
      }}
    >
      <style jsx>{`
        @media (min-width: 768px) {
          div {
            min-height: calc(100vh - ${HEADER_HEIGHT} - ${FOOTER_HEIGHT_DESKTOP}) !important;
          }
        }
      `}</style>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gray-900 dark:border-t-white animate-spin" />
        </div>
      </div>
    </div>
  );
}

/**
 * Full Page Loader
 * A clean, professional loading indicator for full page layouts (with header/footer)
 */
export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gray-900 dark:border-t-white animate-spin" />
        </div>
      </div>
    </div>
  );
}

/**
 * Header/Navbar Skeleton
 * Loading placeholder for the site header
 */
export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Skeleton className="h-8 w-32" />

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full md:hidden" />
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Footer Skeleton
 * Loading placeholder for the site footer
 */
export function FooterSkeleton() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>

          {/* Links columns */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-5 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Theme Layout Skeleton
 * Full page skeleton with header and footer
 */
export function ThemeLayoutSkeleton({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderSkeleton />
      {children || (
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </main>
      )}
      <FooterSkeleton />
    </div>
  );
}

/**
 * Hero Section Skeleton
 * Loading placeholder for hero/banner sections
 */
export function HeroSkeleton() {
  return (
    <section className="relative bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 w-32 rounded-lg" />
            <Skeleton className="h-12 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Product Card Skeleton
 * Loading placeholder for product cards
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Content wrapper for mid-layout skeletons
 * Calculates proper height accounting for header and footer
 */
function ContentSkeletonWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("w-full", className)}
      style={{
        minHeight: `calc(100vh - ${HEADER_HEIGHT} - ${FOOTER_HEIGHT_MOBILE})`,
      }}
    >
      <style jsx>{`
        @media (min-width: 768px) {
          div {
            min-height: calc(100vh - ${HEADER_HEIGHT} - ${FOOTER_HEIGHT_DESKTOP}) !important;
          }
        }
      `}</style>
      {children}
    </div>
  );
}

/**
 * Products Grid Skeleton
 * Loading placeholder for products listing page
 * Uses calculated height for content area (accounts for header/footer)
 */
export function ProductsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ContentSkeletonWrapper>
      <div className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(count)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
    </ContentSkeletonWrapper>
  );
}

/**
 * Product Detail Skeleton
 * Loading placeholder for product detail page
 * Uses calculated height for content area (accounts for header/footer)
 */
export function ProductDetailSkeleton() {
  return (
    <ContentSkeletonWrapper>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image gallery */}
          <div className="space-y-4">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>

            {/* Variants */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-16" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-16 rounded-lg" />
                <Skeleton className="h-10 w-16 rounded-lg" />
                <Skeleton className="h-10 w-16 rounded-lg" />
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-5 w-12" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-16" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
            </div>

            {/* Description */}
            <div className="space-y-3 pt-6 border-t">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Related products */}
        <div className="mt-16">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </ContentSkeletonWrapper>
  );
}

/**
 * Homepage Skeleton
 * Loading placeholder for the homepage (full page layout)
 */
export function HomepageSkeleton() {
  return (
    <ContentSkeletonWrapper>
      {/* Hero section */}
      <HeroSkeleton />

      {/* Categories section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-4">
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured products section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner section */}
      <section className="container mx-auto px-4 py-12">
        <Skeleton className="w-full h-48 md:h-64 rounded-xl" />
      </section>
    </ContentSkeletonWrapper>
  );
}

/**
 * Collection Card Skeleton
 * Loading placeholder for collection cards
 */
export function CollectionCardSkeleton() {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Skeleton className="w-full aspect-[4/3]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <Skeleton className="h-6 w-3/4 bg-gray-400" />
        <Skeleton className="h-4 w-1/2 bg-gray-400" />
      </div>
    </div>
  );
}

/**
 * Collections Grid Skeleton
 * Loading placeholder for collections page
 * Uses calculated height for content area (accounts for header/footer)
 */
export function CollectionsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ContentSkeletonWrapper>
      <div className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-5 w-80 md:w-96 mx-auto" />
        </div>

        {/* Collections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(count)].map((_, i) => (
            <CollectionCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </ContentSkeletonWrapper>
  );
}

/**
 * Content Page Skeleton
 * Loading placeholder for content pages like About Us, Contact, etc.
 * Uses calculated height for content area (accounts for header/footer)
 */
export function ContentPageSkeleton() {
  return (
    <ContentSkeletonWrapper>
      <div className="container mx-auto px-4 py-12">
        {/* Page header */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-48 mx-auto mb-4" />
          <Skeleton className="h-5 w-80 md:w-96 mx-auto" />
        </div>

        {/* Content sections */}
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Skeleton className="w-full h-64 rounded-xl" />

          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </ContentSkeletonWrapper>
  );
}

/**
 * Landing Page Skeleton
 * Loading placeholder for single product landing pages (full page layout)
 */
export function LandingPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <HeaderSkeleton />

      {/* Hero with product */}
      <section className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <Skeleton className="h-10 md:h-12 w-3/4" />
              <Skeleton className="h-5 md:h-6 w-full" />
              <Skeleton className="h-5 md:h-6 w-2/3" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-12 md:h-14 w-full sm:w-40 rounded-lg" />
                <Skeleton className="h-12 md:h-14 w-full sm:w-40 rounded-lg" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Skeleton className="w-full aspect-square rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <Skeleton className="h-8 w-48 mx-auto mb-8 md:mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center space-y-4">
              <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto" />
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-full aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSkeleton />
    </div>
  );
}
