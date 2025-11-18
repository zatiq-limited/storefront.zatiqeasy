/**
 * ========================================
 * COMPONENT RENDERER
 * ========================================
 *
 * Dynamic component rendering based on API response
 */

import React from "react";
import { getComponent } from "../lib/component-registry";
import type { Section } from "../lib/types";

interface ComponentRendererProps {
  section: Section;
  client?: "load" | "visible" | "idle" | "only";
}

/**
 * Component Renderer
 * API response থেকে component type অনুযায়ী dynamic rendering করে
 */
export default function ComponentRenderer({
  section,
  client = "load",
}: ComponentRendererProps) {
  // Check if section is enabled
  if (!section.enabled) {
    return null;
  }

  // Get component from registry
  const Component = getComponent(section.type);

  // Component not found - show error in development
  if (!Component) {
    if (import.meta.env.DEV) {
      return (
        <div className="bg-red-50 border border-red-200 rounded p-4 my-4">
          <p className="text-red-800 font-semibold">
            Component not found: {section.type}
          </p>
          <p className="text-red-600 text-sm mt-1">
            Make sure the component is registered in component-registry.ts
          </p>
        </div>
      );
    }
    return null;
  }

  // Render component with settings and blocks
  return (
    <div
      data-section-id={section.id}
      data-section-type={section.type}
      className="zatiq-section"
    >
      <Component {...section.settings} blocks={section.blocks} />
    </div>
  );
}
