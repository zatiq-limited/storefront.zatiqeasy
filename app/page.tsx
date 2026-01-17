import { fetchHomepageSSR } from "@/lib/api/server-fetchers";
import { HomepageClient } from "@/components/homepage/homepage-client";

/**
 * HomePage Component (Server Component)
 *
 * This is a Server Component that fetches homepage data during SSR.
 * This eliminates client-side data fetching delays and improves LCP.
 *
 * NOTE: Theme routing is handled by ThemeRouter component in the layout.
 * - If legacy_theme === true: ThemeRouter renders static theme, this returns null
 * - If legacy_theme === false: This renders Theme Builder content via HomepageClient
 */
export default async function HomePage() {
  // Fetch homepage data server-side (during SSR)
  const { homepage, isLegacyTheme } = await fetchHomepageSSR();

  // Legacy mode: ThemeRouter already rendered the static theme, skip this
  if (isLegacyTheme) {
    return null;
  }

  // No homepage data available
  if (!homepage) {
    return null;
  }

  console.log("Rendering Theme Builder homepage with SSR data:", homepage);

  // Render Theme Builder homepage with SSR data
  return <HomepageClient homepage={homepage} />;
}
