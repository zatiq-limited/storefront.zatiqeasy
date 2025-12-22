"use client";

import { usePrivacyPolicy } from "@/hooks";
import { usePrivacyPolicyStore } from "@/stores/privacyPolicyStore";
import BlockRenderer from "@/components/renderers/block-renderer";

export default function PrivacyPolicyPage() {
  const { privacyPolicy } = usePrivacyPolicyStore();
  const { isLoading, error } = usePrivacyPolicy();

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
        <p>Error loading privacy policy page</p>
      </main>
    );
  }

  // Extract sections from privacy policy data
  const pageData = (privacyPolicy as Record<string, unknown>)?.data || privacyPolicy || {};
  const sections = (pageData as Record<string, unknown>)?.sections || [];

  return (
    <main className="zatiq-privacy-policy-page">
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