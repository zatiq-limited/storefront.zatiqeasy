'use client';

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
  paymentMethods?: any[];
  deliveryOptions?: any[];
  currency?: string;
}

/**
 * Section Renderer
 * Template এর সব sections কে render করে
 */
export default function SectionRenderer({
  sections,
  className = "",
  product,
  paymentMethods,
  deliveryOptions,
  currency,
}: SectionRendererProps) {
  return (
    <div className={`zatiq-sections ${className}`}>
      {sections.map((section) => (
        <ComponentRenderer
          key={section.id}
          section={section}
          product={product}
          paymentMethods={paymentMethods}
          deliveryOptions={deliveryOptions}
          currency={currency}
          client="load"
        />
      ))}
    </div>
  );
}
