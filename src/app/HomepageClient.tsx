'use client';

/**
 * ========================================
 * HOMEPAGE CLIENT COMPONENT
 * ========================================
 *
 * Client component for rendering homepage sections
 */

import BlockRenderer from "@/components/BlockRenderer";

interface HomepageClientProps {
  sections: any[];
}

export function HomepageClient({ sections }: HomepageClientProps) {
  return (
    <>
      {sections.map((section: any) => {
        // Get the first block from each section
        const block = section.blocks?.[0];
        if (!block || !section.enabled) return null;

        return (
          <BlockRenderer
            key={section.id || block.id}
            block={block}
            data={block.data || {}}
          />
        );
      })}
    </>
  );
}
