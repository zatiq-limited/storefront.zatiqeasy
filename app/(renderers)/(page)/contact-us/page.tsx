"use client";

import { useEffect } from "react";
import { useContactUs } from "@/hooks";
import { useContactUsStore } from "@/stores/contactUsStore";
import ContactPageRenderer from "@/components/renderers/page-renderer/contact-page-renderer";
import type { Section } from "@/lib/types";

export default function ContactUsPage() {
  const { contactUs } = useContactUsStore();
  const { isLoading, error } = useContactUs();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading contact page...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Error Loading Contact Page
          </h2>
          <p className="text-gray-600 mb-6">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // Extract sections from contactUs data
  const pageData = (contactUs as Record<string, unknown>)?.data || contactUs || {};
  const sections = ((pageData as Record<string, unknown>)?.sections || []) as Section[];

  return (
    <main className="zatiq-contact-us-page">
      <ContactPageRenderer sections={sections} />
    </main>
  );
}