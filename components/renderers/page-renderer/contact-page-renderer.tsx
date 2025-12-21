"use client";

import React from "react";
import type { Section } from "@/lib/types";
import {
  ContactHero1,
  ContactHero2,
  ContactInfo1,
  ContactInfo2,
  ContactMap1,
  ContactMap2,
  ContactForm1,
  ContactForm2,
} from "@/components/contact";

interface ContactPageRendererProps {
  sections: Section[];
}

export default function ContactPageRenderer({ sections }: ContactPageRendererProps) {
  const renderSection = (section: Section) => {
    if (!section.enabled) return null;

    const { type, settings = {} } = section;

    switch (type) {
      case "contact-hero-1":
        return <ContactHero1 key={section.id} settings={settings} />;

      case "contact-hero-2":
        return <ContactHero2 key={section.id} settings={settings} />;

      case "contact-info-1":
        return <ContactInfo1 key={section.id} settings={settings} />;

      case "contact-info-2":
        return <ContactInfo2 key={section.id} settings={settings} />;

      case "contact-map-1":
        return <ContactMap1 key={section.id} settings={settings} />;

      case "contact-map-2":
        return <ContactMap2 key={section.id} settings={settings} />;

      case "contact-form-1":
        return <ContactForm1 key={section.id} settings={settings} />;

      case "contact-form-2":
        return <ContactForm2 key={section.id} settings={settings} />;

      default:
        console.warn(`Unknown contact section type: ${type}`);
        return null;
    }
  };

  return (
    <>
      {sections.map((section) => renderSection(section))}
    </>
  );
}