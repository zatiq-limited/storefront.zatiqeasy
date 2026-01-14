"use client";

import { useShopStore } from "@/stores/shopStore";
import { useShopCustomPages } from "@/hooks/useShopCustomPages";
import { usePrivacyPolicyPage } from "@/hooks/usePolicyPages";
import PrivacyPolicyPageRenderer from "@/components/renderers/page-renderer/privacy-policy-page-renderer";
import { PageLoading } from "@/components/shared/page-loading";
import type { Section } from "@/lib/types";
import "react-quill/dist/quill.snow.css";

// Default privacy policy sections (fallback if API returns no sections)
const defaultSections: Section[] = [
  {
    id: "privacy-hero-1",
    type: "privacy-hero-1",
    enabled: true,
    settings: {
      headline: "Privacy Policy",
      subheadline: "Your Privacy Matters",
      description:
        "We are committed to protecting your personal information and your right to privacy.",
      lastUpdated: new Date().toLocaleDateString(),
      showBreadcrumb: true,
    },
  },
  {
    id: "privacy-content-1",
    type: "privacy-content-1",
    enabled: true,
    settings: {
      contentSections: JSON.stringify([
        {
          title: "Information We Collect",
          content: `<p>We collect information you provide directly to us.</p>`,
        },
        {
          title: "Contact Us",
          content: `<p>If you have any questions about this Privacy Policy, please contact us.</p>`,
        },
      ]),
    },
  },
];

export default function PrivacyPolicyPage() {
  const { shopDetails } = useShopStore();

  // Determine theme mode
  const isLegacyTheme = shopDetails?.legacy_theme ?? true;
  const shopId = shopDetails?.id?.toString();

  // Fetch custom pages for legacy themes
  const { data: customPages, isLoading: isLoadingCustomPages } =
    useShopCustomPages(shopId || "", {
      enabled: !!shopId && isLegacyTheme,
    });

  // Fetch page data from Theme API for theme builder mode
  const { data: pageData, isLoading: isLoadingPageData } = usePrivacyPolicyPage(
    {
      enabled: !isLegacyTheme,
    }
  );

  // ========================================
  // STATIC THEME MODE (legacy_theme = true)
  // ========================================
  if (isLegacyTheme) {
    // Loading state
    if (!shopDetails || isLoadingCustomPages) {
      return <PageLoading />;
    }

    const privacyPolicyContent = customPages?.privacy_policy;

    if (!privacyPolicyContent) {
      return (
        <div className="container pt-16 pb-10">
          <div className="rounded-xl py-4">
            <p className="text-gray-600 dark:text-gray-400">
              No privacy policy available.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="container pt-16 pb-10">
        <div className="rounded-xl py-4">
          <div
            className="ql-editor dark:text-gray-200 text-black-2 ql-snow px-0!"
            dangerouslySetInnerHTML={{ __html: privacyPolicyContent }}
          />
        </div>
      </div>
    );
  }

  // ========================================
  // THEME BUILDER MODE (legacy_theme = false)
  // ========================================

  // Loading state for theme builder
  if (isLoadingPageData) {
    return <PageLoading />;
  }

  // Extract sections from API response or use defaults
  const apiData = pageData?.data || pageData;
  const sections =
    (apiData as { sections?: Section[] })?.sections || defaultSections;

  return (
    <main className="zatiq-privacy-policy-page">
      <PrivacyPolicyPageRenderer sections={sections} />
    </main>
  );
}
