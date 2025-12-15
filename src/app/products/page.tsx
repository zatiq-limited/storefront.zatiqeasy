/**
 * ========================================
 * PRODUCTS PAGE
 * ========================================
 *
 * Route: /products
 * Uses Settings-Based approach (not Block Renderer)
 *
 * Note: Announcement, Header, and Footer are automatically rendered
 * by ThemeProvider in layout.tsx
 */

'use client';

import React, { useMemo } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

// Import page JSON (settings only, no blocks)
import productsPageJson from '@/data/api-responses/products-page.json';
// Import mock data for products and categories
import productsData from '@/data/api-responses/products.json';
import categoriesData from '@/data/api-responses/category.json';

// Import Settings-Based components
import { ProductsHero1, ProductsHero2, ProductsLayout } from '@/components/zatiq/products-page';

// Types for sections
interface PageSection {
  id: string;
  type: string;
  enabled?: boolean;
  settings: Record<string, unknown>;
}

export default function ProductsPage() {
  const { globalData } = useTheme();

  // Extract sections from JSON
  const sections = useMemo(() => {
    if (!productsPageJson?.success || !productsPageJson?.data?.sections) {
      return [];
    }
    return productsPageJson.data.sections.filter(
      (section: PageSection) => section.enabled !== false
    );
  }, []);

  // Extract products and categories from mock data
  const products = useMemo(() => {
    return productsData?.data?.products || [];
  }, []);

  const categories = useMemo(() => {
    return categoriesData?.data?.categories || [];
  }, []);

  // Find specific sections by type
  const heroSection = useMemo(() => {
    return sections.find((s: PageSection) => s.type.startsWith('products-hero'));
  }, [sections]);

  const layoutSection = useMemo(() => {
    return sections.find((s: PageSection) => s.type === 'products-layout');
  }, [sections]);

  if (sections.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-red-500">Failed to load products page data</p>
      </div>
    );
  }

  // Render hero component based on type
  const renderHero = () => {
    if (!heroSection) return null;

    const heroProps = {
      settings: heroSection.settings,
      productCount: products.length,
    };

    switch (heroSection.type) {
      case 'products-hero-1':
        return <ProductsHero1 {...heroProps} />;
      case 'products-hero-2':
        return <ProductsHero2 {...heroProps} />;
      default:
        return <ProductsHero1 {...heroProps} />;
    }
  };

  return (
    <div className="zatiq-page zatiq-page-products">
      {/* Hero Section */}
      {renderHero()}

      {/* Products Layout Section */}
      {layoutSection && (
        <ProductsLayout
          settings={layoutSection.settings as any}
          products={products}
          categories={categories}
          currency={globalData?.currency as string || 'BDT'}
        />
      )}
    </div>
  );
}
