"use client";

import type { Section } from "@/lib/types";
import {
  PrivacyHero1,
  PrivacyHero2,
  PrivacyContent1,
  PrivacyContent2,
} from "@/components/renderers/page-renderer/page-components/privacy-policy";

interface PrivacyPageRendererProps {
  sections: Section[];
}

export default function PrivacyPolicyPageRenderer({
  sections,
}: PrivacyPageRendererProps) {
  const renderSection = (section: Section) => {
    if (!section.enabled) return null;

    const { type, settings = {} } = section;

    switch (type) {
      case "privacy-hero-1":
        return <PrivacyHero1 key={section.id} settings={settings} />;

      case "privacy-hero-2":
        return <PrivacyHero2 key={section.id} settings={settings} />;

      case "privacy-content-1":
        return <PrivacyContent1 key={section.id} settings={settings} />;

      case "privacy-content-2":
        return <PrivacyContent2 key={section.id} settings={settings} />;

      default:
        console.warn(`Unknown privacy section type: ${type}`);
        return null;
    }
  };

  return <>{sections.map(renderSection)}</>;
}
