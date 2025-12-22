"use client";

import { useContactUs } from "@/hooks";
import { useContactUsStore } from "@/stores/contactUsStore";
import BlockRenderer from "@/components/renderers/block-renderer";

export default function ContactUsPage() {
  const { contactUs } = useContactUsStore();
  const { isLoading, error } = useContactUs();

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
        <p>Error loading contact us page</p>
      </main>
    );
  }

  // Extract sections from contact data
  const pageData = (contactUs as Record<string, unknown>)?.data || contactUs || {};
  const sections = (pageData as Record<string, unknown>)?.sections || [];

  return (
    <main className="zatiq-contact-us-page">
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