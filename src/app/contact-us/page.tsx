/**
 * ========================================
 * CONTACT US PAGE
 * ========================================
 */

import { getContactPageData } from "@/api/server";
import { ContactPageClient } from "./ContactPageClient";

export default async function ContactPage() {
  const pageData = await getContactPageData();
  const sections = pageData?.sections || [];

  return (
    <main className="zatiq-contact-page">
      <ContactPageClient sections={sections} />
    </main>
  );
}

export const metadata = {
  title: "Contact Us | Zatiq Store",
  description: "Get in touch with us",
};
