/**
 * ========================================
 * CONTACT PAGE RENDERER
 * ========================================
 *
 * Renders contact page sections dynamically based on JSON configuration
 * Direct component rendering system like products
 */

"use client";

import type { Section } from "@/lib/types";
import ContactHero1 from "@/components/zatiq/contact-us/ContactHero1";
import ContactHero2 from "@/components/zatiq/contact-us/ContactHero2";
import ContactForm1 from "@/components/zatiq/contact-us/ContactForm1";
import ContactForm2 from "@/components/zatiq/contact-us/ContactForm2";
import ContactInfo1 from "@/components/zatiq/contact-us/ContactInfo1";
import ContactInfo2 from "@/components/zatiq/contact-us/ContactInfo2";
import ContactMap1 from "@/components/zatiq/contact-us/ContactMap1";
import ContactMap2 from "@/components/zatiq/contact-us/ContactMap2";

interface ContactPageRendererProps {
  sections: Section[];
  className?: string;
}

// Component mapping
const componentMap: Record<string, React.ComponentType<any>> = {
  "contact-hero-1": ContactHero1,
  "contact-hero-2": ContactHero2,
  "contact-form-1": ContactForm1,
  "contact-form-2": ContactForm2,
  "contact-info-1": ContactInfo1,
  "contact-info-2": ContactInfo2,
  "contact-map-1": ContactMap1,
  "contact-map-2": ContactMap2,
};

const ContactPageRenderer: React.FC<ContactPageRendererProps> = ({
  sections,
  className = ""
}) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <main className={`zatiq-contact-page ${className}`}>
      {sections.map((section, index) => {
        if (!section.enabled) return null;

        const Component = componentMap[section.type];

        if (!Component) {
          console.warn(`Unknown contact component type: ${section.type}`);
          return null;
        }

        return (
          <Component
            key={section.id || `section-${index}`}
            settings={section.settings || {}}
            blocks={section.blocks || []}
          />
        );
      })}
    </main>
  );
};

export default ContactPageRenderer;