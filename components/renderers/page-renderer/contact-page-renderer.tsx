/**
 * ========================================
 * CONTACT PAGE RENDERER
 * ========================================
 *
 * Renders contact page sections dynamically based on JSON configuration
 */

"use client";

import type { Section } from "@/lib/types";
import ContactHero1 from "@/components/renderers/page-renderer/page-components/contact/contact-hero-1";
import ContactHero2 from "@/components/renderers/page-renderer/page-components/contact/contact-hero-2";
import ContactInfo1 from "@/components/renderers/page-renderer/page-components/contact/contact-info-1";
import ContactInfo2 from "@/components/renderers/page-renderer/page-components/contact/contact-info-2";
import ContactForm1 from "@/components/renderers/page-renderer/page-components/contact/contact-form-1";
import ContactForm2 from "@/components/renderers/page-renderer/page-components/contact/contact-form-2";
import ContactMap1 from "@/components/renderers/page-renderer/page-components/contact/contact-map-1";
import ContactMap2 from "@/components/renderers/page-renderer/page-components/contact/contact-map-2";
import BlockRenderer from "@/components/renderers/block-renderer";

interface ContactPageRendererProps {
  sections: Section[];
  className?: string;
}

export default function ContactPageRenderer({
  sections,
  className = "",
}: ContactPageRendererProps) {
  const renderSection = (section: Section) => {
    if (section.enabled === false) return null;

    switch (section.type) {
      case "contact-hero-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ContactHero1 settings={section.settings || {}} />
          </div>
        );

      case "contact-hero-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ContactHero2 settings={section.settings || {}} />
          </div>
        );

      case "contact-info-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ContactInfo1 settings={section.settings || {}} />
          </div>
        );

      case "contact-info-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ContactInfo2 settings={section.settings || {}} />
          </div>
        );

      case "contact-form-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ContactForm1 settings={section.settings || {}} />
          </div>
        );

      case "contact-form-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ContactForm2 settings={section.settings || {}} />
          </div>
        );

      case "contact-map-1":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ContactMap1 settings={section.settings || {}} />
          </div>
        );

      case "contact-map-2":
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <ContactMap2 settings={section.settings || {}} />
          </div>
        );

      case "custom-sections":
        // Custom sections use BlockRenderer for V3.0 Schema blocks
        const block = section.blocks?.[0];
        if (!block) return null;
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
          >
            <BlockRenderer
              block={block as unknown as import("@/components/renderers/block-renderer").Block}
              data={{}}
            />
          </div>
        );

      default:
        if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
          return (
            <div
              key={section.id}
              className="bg-yellow-50 border border-yellow-200 rounded p-4 my-4"
            >
              <p className="text-yellow-800 font-semibold">
                Component not found: {section.type}
              </p>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className={`zatiq-contact-page ${className}`}>
      {sections.map(renderSection)}
    </div>
  );
}
