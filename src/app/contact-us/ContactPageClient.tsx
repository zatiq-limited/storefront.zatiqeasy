'use client';

import BlockRenderer from "@/components/BlockRenderer";

interface ContactPageClientProps {
  sections: any[];
}

export function ContactPageClient({ sections }: ContactPageClientProps) {
  return (
    <>
      {sections.map((section: any) => {
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
