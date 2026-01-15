"use client";

import { useEffect } from "react";
import BlockRenderer, { Block } from "@/components/renderers/block-renderer";
import { useHomepageStore } from "@/stores/homepageStore";
import { PageData } from "@/lib/api/theme-api";
import Heading1 from "@/components/renderers/page-renderer/page-components/headings/heading-1";

interface HomepageClientProps {
  /** Homepage data from SSR */
  homepage: PageData;
}

/**
 * Client component for rendering homepage with BlockRenderer
 * Receives SSR data as props for instant rendering
 */
export function HomepageClient({ homepage }: HomepageClientProps) {
  const { setHomepage } = useHomepageStore();

  // Sync SSR data to Zustand store for consistency with other components
  useEffect(() => {
    if (homepage) {
      setHomepage({ data: homepage });
    }
  }, [homepage, setHomepage]);

  // Extract sections from homepage data
  const sections = homepage?.sections || [];

  // Don't render anything when no sections exist
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <main className="zatiq-homepage">
      {sections.map((section, index) => {
        // Skip disabled sections
        if (!section.enabled) return null;

        const sectionType = section.type;
        const sectionId = section.id || `section-${index}`;

        // Handle heading sections that may have empty blocks but settings
        if (sectionType === "heading-1") {
          return (
            <div
              key={sectionId}
              data-section-id={sectionId}
              data-section-type={sectionType}
            >
              <Heading1 settings={section.settings || {}} />
            </div>
          );
        }

        // For other sections, get the first block
        const block = section.blocks?.[0];
        if (!block) return null;

        return (
          <BlockRenderer
            key={sectionId}
            block={block as unknown as Block}
            data={(block as unknown as Record<string, unknown>).data as Record<string, unknown> || {}}
          />
        );
      })}
    </main>
  );
}
