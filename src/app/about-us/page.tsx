/**
 * ========================================
 * ABOUT US PAGE
 * ========================================
 */

import { getAboutPageData } from "@/api/server";
import { AboutPageClient } from "./AboutPageClient";

export default async function AboutPage() {
  const pageData = await getAboutPageData();
  const sections = pageData?.sections || [];

  return (
    <main className="zatiq-about-page">
      <AboutPageClient sections={sections} />
    </main>
  );
}

export const metadata = {
  title: "About Us | Zatiq Store",
  description: "Learn more about us",
};
