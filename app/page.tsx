"use client";

import { useHomepage } from "@/hooks";
import { useHomepageStore } from "@/stores/homepageStore";
import { useShopStore } from "@/stores";
import BlockRenderer from "@/components/renderers/block-renderer";
import { ShopIdInput } from "./components/shop-id-input";
import { ShopProvider } from "./providers/shop-provider";
import { ConditionalLayoutWrapper } from "./_layouts/conditional-layout-wrapper";

export default function HomePage() {
  const { shopProfile } = useShopStore();
  const { homepage } = useHomepageStore();
  const { isLoading, error } = useHomepage();

  // If no shop profile in store, show shop ID input
  if (!shopProfile) {
    return <ShopIdInput />;
  }

  // Wrap content with ShopProvider and ConditionalLayoutWrapper
  return (
    <ShopProvider initialShopData={shopProfile}>
      <ConditionalLayoutWrapper>
        <HomePageContent
          homepage={homepage}
          isLoading={isLoading}
          error={error}
        />
      </ConditionalLayoutWrapper>
    </ShopProvider>
  );
}

function HomePageContent({
  homepage,
  isLoading,
  error,
}: {
  homepage: unknown;
  isLoading: boolean;
  error: unknown;
}) {
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
        <p>Error loading homepage data</p>
      </main>
    );
  }

  // Extract sections from homepage data
  const pageData =
    (homepage as Record<string, unknown>)?.data || homepage || {};
  const sections = (pageData as Record<string, unknown>)?.sections || [];

  return (
    <main className="zatiq-homepage">
      {(sections as Array<Record<string, unknown>>).map((section, index) => {
        // Get the first block from each section
        const block = (section.blocks as Array<Record<string, unknown>>)?.[0];
        if (!block || !section.enabled) return null;

        return (
          <BlockRenderer
            key={(section.id as string) || `section-${index}`}
            block={
              block as import("@/components/renderers/block-renderer").Block
            }
            data={(block.data as Record<string, unknown>) || {}}
          />
        );
      })}
    </main>
  );
}
