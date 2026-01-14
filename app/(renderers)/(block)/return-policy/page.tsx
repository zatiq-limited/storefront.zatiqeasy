"use client";

import { useShopStore } from "@/stores/shopStore";
import { useShopCustomPages } from "@/hooks/useShopCustomPages";
import { useReturnPolicyPage } from "@/hooks/usePolicyPages";
import ReturnPolicyPageRenderer from "@/components/renderers/page-renderer/return-policy-page-renderer";
import { PageLoading } from "@/components/shared/page-loading";
import type { Section } from "@/lib/types";
import "react-quill/dist/quill.snow.css";

// Default return policy sections (fallback if API returns no sections)
const defaultSections: Section[] = [
  {
    id: "return-policy-hero-1",
    type: "return-policy-hero-1",
    enabled: true,
    settings: {
      headline: "Return and Cancellation Policy",
      subheadline: "Easy Returns",
      description:
        "We want you to be completely satisfied with your purchase. Learn about our return and cancellation policies.",
      lastUpdated: "December 21, 2024",
      showBreadcrumb: true,
    },
  },
  {
    id: "return-policy-content-1",
    type: "return-policy-content-1",
    enabled: true,
    settings: {
      contentSections: JSON.stringify([
        {
          title: "Return Policy Overview",
          content: `
            <p>We accept returns within 7 days of delivery for most items. To be eligible for a return, your item must be unused and in the same condition that you received it.</p>
            <ul>
              <li><strong>Return Window:</strong> 7 days from delivery date</li>
              <li><strong>Condition:</strong> Items must be unused, unworn, and in original packaging</li>
              <li><strong>Proof of Purchase:</strong> Receipt or order confirmation required</li>
            </ul>
          `,
        },
        {
          title: "How to Initiate a Return",
          content: `
            <p>To start a return, please follow these steps:</p>
            <ul>
              <li><strong>Step 1:</strong> Contact our customer service team via email or phone</li>
              <li><strong>Step 2:</strong> Provide your order number and reason for return</li>
              <li><strong>Step 3:</strong> Wait for return authorization and shipping instructions</li>
              <li><strong>Step 4:</strong> Ship the item back using the provided label or your preferred carrier</li>
            </ul>
          `,
        },
        {
          title: "Refund Process",
          content: `
            <p>Once we receive your returned item, we will inspect it and notify you of the status of your refund.</p>
            <ul>
              <li><strong>Processing Time:</strong> Refunds are processed within 5-7 business days</li>
              <li><strong>Refund Method:</strong> Refunds will be issued to the original payment method</li>
              <li><strong>Shipping Costs:</strong> Original shipping costs are non-refundable unless the return is due to our error</li>
            </ul>
          `,
        },
        {
          title: "Cancellation Policy",
          content: `
            <p>You may cancel your order under the following conditions:</p>
            <ul>
              <li><strong>Before Shipping:</strong> Orders can be cancelled for a full refund before they are shipped</li>
              <li><strong>After Shipping:</strong> Once shipped, orders cannot be cancelled but may be returned</li>
              <li><strong>Custom Orders:</strong> Custom or personalized items cannot be cancelled once production begins</li>
            </ul>
          `,
        },
        {
          title: "Non-Returnable Items",
          content: `
            <p>The following items cannot be returned:</p>
            <ul>
              <li>Perishable goods (food, flowers, etc.)</li>
              <li>Personal care items and cosmetics</li>
              <li>Intimate apparel and swimwear</li>
              <li>Gift cards and downloadable products</li>
              <li>Items marked as "Final Sale" or "Non-Returnable"</li>
            </ul>
          `,
        },
        {
          title: "Damaged or Defective Items",
          content: `
            <p>If you receive a damaged or defective item, please contact us immediately:</p>
            <ul>
              <li><strong>Report Within:</strong> 48 hours of delivery</li>
              <li><strong>Documentation:</strong> Please provide photos of the damage</li>
              <li><strong>Resolution:</strong> We will offer a replacement or full refund including shipping costs</li>
            </ul>
          `,
        },
        {
          title: "Contact Us",
          content: `
            <p>For any questions about our return and cancellation policy, please reach out to us:</p>
            <p><strong>Email:</strong> returns@example.com<br/><strong>Phone:</strong> +1 (555) 123-4567<br/><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM</p>
          `,
        },
      ]),
    },
  },
];

export default function ReturnPolicyPage() {
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
  const { data: pageData, isLoading: isLoadingPageData } = useReturnPolicyPage({
    enabled: !isLegacyTheme,
  });

  // ========================================
  // STATIC THEME MODE (legacy_theme = true)
  // ========================================
  if (isLegacyTheme) {
    // Loading state
    if (!shopDetails || isLoadingCustomPages) {
      return <PageLoading />;
    }

    const returnPolicyContent = customPages?.return_and_cancellation_policy;

    if (!returnPolicyContent) {
      return (
        <div className="container pt-16 pb-10">
          <div className="rounded-xl py-4">
            <p className="text-gray-600 dark:text-gray-400">
              No return and cancellation policy available.
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
            dangerouslySetInnerHTML={{ __html: returnPolicyContent }}
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
  
  console.log("Return Policy Page Sections:", sections);

  return (
    <main className="zatiq-return-policy-page">
      <ReturnPolicyPageRenderer sections={sections} />
    </main>
  );
}
