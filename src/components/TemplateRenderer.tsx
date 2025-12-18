/**
 * ========================================
 * TEMPLATE RENDERER
 * ========================================
 *
 * Main template rendering component
 */

import React from "react";
import SectionRenderer from "./SectionRenderer";
import type { Template } from "../lib/types";

interface TemplateRendererProps {
  template: Template;
  className?: string;
}

/**
 * Template Renderer
 * পুরো template কে render করে (homepage, product page, etc.)
 */
export default function TemplateRenderer({
  template,
  className = "",
}: TemplateRendererProps) {
  return (
    <main
      className={`zatiq-template zatiq-template-${template.layout} ${className}`}
    >
      <SectionRenderer sections={template.sections} />
    </main>
  );
}
