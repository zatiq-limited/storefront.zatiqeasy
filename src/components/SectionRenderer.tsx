/**
 * ========================================
 * SECTION RENDERER
 * ========================================
 *
 * Renders multiple sections (for templates/pages)
 */

import React from "react";
import ComponentRenderer from "./ComponentRenderer";
import type { Section } from "../lib/types";

interface SectionRendererProps {
  sections: Section[];
  className?: string;
  product?: any;
}

/**
 * Section Renderer
 * Template এর সব sections কে render করে
 */
export default function SectionRenderer({
  sections,
  className = "",
  product,
}: SectionRendererProps) {
  return (
    <div className={`zatiq-sections ${className}`}>
      {sections.map((section) => (
        <ComponentRenderer
          key={section.id}
          section={section}
          product={product}
          client="load"
        />
      ))}
    </div>
  );
}
