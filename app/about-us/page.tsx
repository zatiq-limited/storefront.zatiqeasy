"use client";

import { useAboutUs } from "@/hooks";
import { useAboutUsStore } from "@/stores/aboutUsStore";
import BlockRenderer from "@/components/renderers/block-renderer";

export default function AboutUsPage() {
  const { aboutUs } = useAboutUsStore();
  const { isLoading, error } = useAboutUs();

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <p>Error loading about us page</p>
      </main>
    );
  }

  // Extract sections from aboutUs data
  const pageData = (aboutUs as Record<string, unknown>)?.data || aboutUs || {};
  const sections = (pageData as Record<string, unknown>)?.sections || [];

  return (
    <main className="zatiq-about-us-page">
      {(sections as Array<Record<string, unknown>>).map((section, index) => {
        // Get the first block from each section
        const block = (section.blocks as Array<Record<string, unknown>>)?.[0];
        if (!block || !section.enabled) return null;

        return (
          <BlockRenderer
            key={(section.id as string) || `section-${index}`}
            block={
              block as import("@/components/renderers/block-renderer").Block
            }
            data={(block.data as Record<string, unknown>) || {}}
          />
        );
      })}
    </main>
  );
}
