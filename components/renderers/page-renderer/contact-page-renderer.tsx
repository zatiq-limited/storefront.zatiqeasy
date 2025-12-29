"use client";

import React from "react";
import type { Section } from "@/lib/types";
import BlockRenderer from "@/components/renderers/block-renderer";
import type { Block } from "@/components/renderers/block-renderer";
import type { SectionBlock } from "@/lib/api/services/theme-builder.service";

interface ContactPageRendererProps {
  sections: Section[];
}

/**
 * Contact Page Renderer
 * Uses BlockRenderer to render V3.0 block schema sections
 * Same pattern as About page renderer
 */
export default function ContactPageRenderer({ sections }: ContactPageRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        // Skip disabled sections
        if (!section.enabled) return null;

        // Get the first block from each section (V3.0 block schema)
        const block = (section.blocks as unknown as SectionBlock[])?.[0];
        if (!block) return null;

        return (
          <BlockRenderer
            key={section.id || `section-${index}`}
            block={block as Block}
            data={(block.data as Record<string, unknown>) || {}}
          />
        );
      })}
    </>
  );
}
