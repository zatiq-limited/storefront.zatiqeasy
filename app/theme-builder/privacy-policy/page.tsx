/**
 * ========================================
 * THEME BUILDER - PRIVACY POLICY PAGE
 * ========================================
 *
 * Renders the privacy policy page using theme builder's published sections
 * via the PrivacyPageRenderer.
 */

"use client";

import { useThemeBuilder } from "@/hooks/useThemeBuilder";
import PrivacyPageRenderer from "@/components/renderers/page-renderer/privacy-page-renderer";
import type { Section } from "@/lib/types";

export default function ThemeBuilderPrivacyPolicyPage() {
  const { privacyPolicyPage, isLoading, error } = useThemeBuilder();

  // Loading state
  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading privacy policy...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error loading privacy policy
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </main>
    );
  }

  // Get sections from theme builder
  const sections = (privacyPolicyPage?.data?.sections || []) as Section[];

  // Empty state
  if (sections.length === 0) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Privacy Policy Not Configured
          </h2>
          <p className="text-gray-600">
            No sections have been published for the privacy policy page yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="zatiq-theme-builder-privacy-policy-page min-h-screen bg-white">
      <PrivacyPageRenderer sections={sections} />
    </main>
  );
}
