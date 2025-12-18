/**
 * ========================================
 * HOME PAGE
 * ========================================
 *
 * Route: /
 * Content: Sections from homepage.json
 *
 * Note: Announcement, Header, and Footer are automatically rendered
 * by ThemeProvider in layout.tsx
 */

'use client';

import React from 'react';
import DynamicPageRenderer, { extractPageData } from '@/components/DynamicPageRenderer';
import { useTheme } from '@/providers/ThemeProvider';

// Import page JSON
import homepageJson from '@/data/api-responses/homepage.json';

export default function HomePage() {
  const { globalData, eventHandlers } = useTheme();

  // Extract page data
  const page = extractPageData(homepageJson as any);

  if (!page) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-red-500">Failed to load homepage data</p>
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
