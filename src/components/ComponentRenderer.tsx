/**
 * ========================================
 * COMPONENT RENDERER
 * ========================================
 *
 * Dynamic component rendering based on API response
 * Supports both section object and direct props
 */

import React from "react";
import { getComponent } from "../lib/component-registry";
import type { Section } from "../lib/types";

interface ComponentRendererProps {
  // Option 1: Pass section object (homepage.json style)
  section?: Section;

  // Option 2: Pass props directly (theme.json style)
  type?: string;
  settings?: any;
  blocks?: any[];
  products?: any[];
  posts?: any[];
  reviews?: any[];
  testimonials?: any[];
  tabs?: any[];
  enabled?: boolean;

  // Global settings for font inheritance
  globalSettings?: any;

  client?: "load" | "visible" | "idle" | "only";
  [key: string]: any; // Allow spread props
}

/**
 * Component Renderer
 * API response থেকে component type অনুযায়ী dynamic rendering করে
 */
export default function ComponentRenderer(props: ComponentRendererProps) {
  const { section, type: directType, client = "load", globalSettings, ...restProps } = props;

  // Determine if using section object or direct props
  const componentType = section?.type || directType;
  const enabled = section?.enabled !== false && restProps.enabled !== false;
  const componentId = section?.id || `component-${componentType}`;

  // Check if explicitly disabled
  if (!enabled) {
    return null;
  }

  if (!componentType) {
    console.error("ComponentRenderer: No component type provided");
    return null;
  }

  // Get component from registry
  const Component = getComponent(componentType);

  // Component not found - show error in development
  if (!Component) {
    if (import.meta.env.DEV) {
      return (
        <div className="bg-red-50 border border-red-200 rounded p-4 my-4">
          <p className="text-red-800 font-semibold">
            Component not found: {componentType}
          </p>
          <p className="text-red-600 text-sm mt-1">
            Make sure the component is registered in component-registry.ts
          </p>
        </div>
      );
    }
    return null;
  }

  // Prepare props for component
  let componentProps: any = {};

  if (section) {
    // Using section object (homepage.json style)
    componentProps = {
      ...section.settings,
      settings: section.settings,
      blocks: section.blocks,
      products: section.products,
      posts: section.posts,
      reviews: section.reviews,
      testimonials: section.testimonials,
      tabs: section.tabs,
    };
  } else {
    // Using direct props (theme.json style)
    const {
      settings,
      blocks,
      products,
      posts,
      reviews,
      testimonials,
      tabs,
      enabled,
      ...spreadProps
    } = restProps;
    componentProps = {
      ...settings,
      ...spreadProps,
      settings,
      blocks,
      products,
      posts,
      reviews,
      testimonials,
      tabs,
    };
  }

  // Resolve font inheritance: if fontFamily is "inherit", use global font
  if (globalSettings?.typography?.fontFamily) {
    if (componentProps.fontFamily === "inherit") {
      componentProps.fontFamily = globalSettings.typography.fontFamily;
    }
    // Also check in settings object if it exists
    if (componentProps.settings?.fontFamily === "inherit") {
      componentProps.settings.fontFamily = globalSettings.typography.fontFamily;
    }
  }

  // Render component with all data
  return (
    <div
      data-section-id={componentId}
      data-section-type={componentType}
      className="zatiq-section"
    >
      <Component {...componentProps} />
    </div>
  );
}
