"use client";

import type { Section } from "@/lib/types";
import {
  ReturnPolicyHero1,
  ReturnPolicyHero2,
  ReturnPolicyContent1,
  ReturnPolicyContent2,
} from "@/components/renderers/page-renderer/page-components/return-policy";

interface ReturnPolicyPageRendererProps {
  sections: Section[];
}

export default function ReturnPolicyPageRenderer({
  sections,
}: ReturnPolicyPageRendererProps) {
  const renderSection = (section: Section) => {
    if (!section.enabled) return null;

    const { type, settings = {} } = section;

    switch (type) {
      case "return-policy-hero-1":
      case "return-hero-1":
        return <ReturnPolicyHero1 key={section.id} settings={settings} />;

      case "return-policy-hero-2":
      case "return-hero-2":
        return <ReturnPolicyHero2 key={section.id} settings={settings} />;

      case "return-policy-content-1":
      case "return-content-1":
        return <ReturnPolicyContent1 key={section.id} settings={settings} />;

      case "return-policy-content-2":
      case "return-content-2":
        return <ReturnPolicyContent2 key={section.id} settings={settings} />;

      default:
        console.warn(`Unknown return policy section type: ${type}`);
        return null;
    }
  };

  return <>{sections.map(renderSection)}</>;
}
