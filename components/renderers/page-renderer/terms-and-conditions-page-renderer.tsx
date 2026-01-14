"use client";

import type { Section } from "@/lib/types";
import {
  TermsHero1,
  TermsHero2,
  TermsContent1,
  TermsContent2,
} from "@/components/renderers/page-renderer/page-components/terms-and-policy";

interface TermsPageRendererProps {
  sections: Section[];
}

export default function TermsAndConditionsPageRenderer({
  sections,
}: TermsPageRendererProps) {
  const renderSection = (section: Section) => {
    if (!section.enabled) return null;

    const { type, settings = {} } = section;

    switch (type) {
      case "terms-hero-1":
        return <TermsHero1 key={section.id} settings={settings} />;

      case "terms-hero-2":
        return <TermsHero2 key={section.id} settings={settings} />;

      case "terms-content-1":
        return <TermsContent1 key={section.id} settings={settings} />;

      case "terms-content-2":
        return <TermsContent2 key={section.id} settings={settings} />;

      default:
        console.warn(`Unknown terms section type: ${type}`);
        return null;
    }
  };

  return <>{sections.map(renderSection)}</>;
}
