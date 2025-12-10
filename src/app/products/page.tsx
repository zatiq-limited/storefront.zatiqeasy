/**
 * ========================================
 * PRODUCTS PAGE
 * ========================================
 *
 * Route: /products
 * Content: Sections from products-page.json
 *
 * Note: Announcement, Header, and Footer are automatically rendered
 * by ThemeProvider in layout.tsx
 */

'use client';

import React from 'react';
import DynamicPageRenderer, { extractPageData } from '@/components/DynamicPageRenderer';
import { useTheme } from '@/providers/ThemeProvider';

// Import page JSON
import productsPageJson from '@/data/api-responses/products-page.json';

export default function ProductsPage() {
  const { globalData } = useTheme();

  // Extract page data
  const page = extractPageData(productsPageJson as any);

  if (!page) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-red-500">Failed to load products page data</p>
      </div>
    );
  }

  return (
    <DynamicPageRenderer
      page={page}
      globalData={globalData}
    />
  );
}
