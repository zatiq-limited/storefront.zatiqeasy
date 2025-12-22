"use client";

import { useContactUs } from "@/hooks";
import { useContactUsStore } from "@/stores/contactUsStore";
import ContactPageRenderer from "@/components/renderers/page-renderer/contact-page-renderer";
import type { Section } from "@/lib/types";

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
    <ContactPageRenderer
      sections={sections as Section[]}
    />
  );
}