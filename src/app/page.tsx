/**
 * ========================================
 * HOMEPAGE
 * ========================================
 *
 * Fetches data from API and renders sections dynamically
 * Uses BlockRenderer for V3.0 Schema rendering
 */

import { getHomepageData } from "@/api/server";
import { HomepageClient } from "./HomepageClient";

export default async function HomePage() {
  // Fetch homepage data from API
  const homepageData = await getHomepageData();

  // Handle null case and extract data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageData = (homepageData as any)?.data || homepageData || {};
  const sections = pageData?.sections || [];

  return (
    <main className="zatiq-homepage">
      <HomepageClient sections={sections} />
    </main>
  );
}

// Dynamic metadata based on SEO from API
export async function generateMetadata() {
  const homepageData = await getHomepageData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = homepageData as any;
  const seo = data?.seo || data?.data?.seo || {};

  return {
    title: seo?.title || "Home | Zatiq Store",
    description: seo?.description || "Shop the latest fashion trends",
    openGraph: {
      title: seo?.og?.title || seo?.title || "Home | Zatiq Store",
      description: seo?.og?.description || seo?.description,
      images: seo?.og?.image ? [seo.og.image] : [],
    },
  };
}
