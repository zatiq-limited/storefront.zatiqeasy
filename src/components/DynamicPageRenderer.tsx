'use client';

/**
 * ========================================
 * DYNAMIC PAGE RENDERER
 * ========================================
 *
 * Renders page sections from homepage.json (or other page JSONs)
 * Uses V3.0 Schema BlockRenderer for dynamic rendering
 */

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BlocksRenderer, type Block } from './BlockRenderer';

// Types
export interface PageSection {
  id: string;
  type: string;
  enabled: boolean;
  settings: Record<string, unknown>;
  blocks: Block[];
}

export interface PageData {
  template: string;
  sections: PageSection[];
  seo?: {
    title: string;
    description: string;
    canonical?: string;
    og?: Record<string, string>;
    twitter?: Record<string, string>;
  };
}

export interface DynamicPageRendererProps {
  page: PageData;
  globalData?: Record<string, unknown>;
  className?: string;
}

/**
 * Dynamic Page Renderer Component
 * Renders all sections from a page JSON using V3.0 Schema blocks
 */
export default function DynamicPageRenderer({
  page,
  globalData = {},
  className = '',
}: DynamicPageRendererProps) {
  const router = useRouter();

  // Filter enabled sections
  const enabledSections = useMemo(() => {
    return page.sections.filter(section => section.enabled !== false);
  }, [page.sections]);

  // Event handlers for page-level actions
  const eventHandlers = useMemo(() => ({
    navigate: (url: string) => {
      if (url.startsWith('http')) {
        window.open(url, '_blank');
      } else {
        router.push(url);
      }
    },
    toggleDrawer: (target: string) => {
      console.log('Toggle drawer:', target);
      // This would typically be handled by a global state manager
    },
    search: (query: string) => {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    },
    sliderPrev: (target: string) => {
      console.log('Slider prev:', target);
    },
    sliderNext: (target: string) => {
      console.log('Slider next:', target);
    },
    sliderGoto: (index: number) => {
      console.log('Slider goto:', index);
    },
  }), [router]);

  return (
    <div className={`zatiq-page zatiq-page-${page.template} ${className}`}>
      {enabledSections.map((section) => (
        <PageSection
          key={section.id}
          section={section}
          globalData={globalData}
          eventHandlers={eventHandlers}
        />
      ))}
    </div>
  );
}

/**
 * Individual Page Section Component
 */
interface PageSectionProps {
  section: PageSection;
  globalData: Record<string, unknown>;
  eventHandlers: {
    navigate?: (url: string) => void;
    toggleDrawer?: (target: string) => void;
    search?: (query: string) => void;
    sliderPrev?: (target: string) => void;
    sliderNext?: (target: string) => void;
    sliderGoto?: (index: number) => void;
  };
}

function PageSection({ section, globalData, eventHandlers }: PageSectionProps) {
  // Merge section settings and data from blocks
  const sectionData = useMemo(() => {
    // If blocks have data attribute, use that as primary data source
    const firstBlock = section.blocks?.[0];
    const blockData = firstBlock?.data as Record<string, unknown> || {};

    return {
      ...globalData,
      ...section.settings,
      ...blockData,
    };
  }, [globalData, section.settings, section.blocks]);

  if (!section.blocks || section.blocks.length === 0) {
    return null;
  }

  return (
    <section
      id={section.id}
      data-section-type={section.type}
      className="zatiq-section"
    >
      <BlocksRenderer
        blocks={section.blocks}
        data={sectionData}
        eventHandlers={eventHandlers}
      />
    </section>
  );
}

/**
 * Helper to extract page data from API response
 */
export function extractPageData(response: { success: boolean; data: PageData }): PageData | null {
  if (response.success && response.data) {
    return response.data;
  }
  return null;
}

/**
 * Render a single section by ID (useful for partial updates)
 */
export function SectionRenderer({
  section,
  globalData = {},
  className = '',
}: {
  section: PageSection;
  globalData?: Record<string, unknown>;
  className?: string;
}) {
  const router = useRouter();

  const eventHandlers = useMemo(() => ({
    navigate: (url: string) => {
      if (url.startsWith('http')) {
        window.open(url, '_blank');
      } else {
        router.push(url);
      }
    },
  }), [router]);

  const sectionData = useMemo(() => {
    const firstBlock = section.blocks?.[0];
    const blockData = firstBlock?.data as Record<string, unknown> || {};

    return {
      ...globalData,
      ...section.settings,
      ...blockData,
    };
  }, [globalData, section.settings, section.blocks]);

  if (!section.blocks || section.blocks.length === 0) {
    return null;
  }

  return (
    <section
      id={section.id}
      data-section-type={section.type}
      className={`zatiq-section ${className}`}
    >
      <BlocksRenderer
        blocks={section.blocks}
        data={sectionData}
        eventHandlers={eventHandlers}
      />
    </section>
  );
}
