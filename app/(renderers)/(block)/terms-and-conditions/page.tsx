"use client";

import React from "react";
import { useShopStore } from "@/stores/shopStore";
import { useShopCustomPages } from "@/hooks/useShopCustomPages";
import TermsPageRenderer from "@/components/renderers/page-renderer/terms-page-renderer";
import { PageLoading } from "@/components/shared/page-loading";
import type { Section } from "@/lib/types";
import "react-quill/dist/quill.snow.css";

// Default terms and conditions sections
const sections: Section[] = [
  {
    id: "terms-hero-1",
    type: "terms-hero-1",
    enabled: true,
    settings: {
      headline: "Terms and Conditions",
      subheadline: "Legal Agreement",
      description:
        "Please read these terms and conditions carefully before using our services.",
      lastUpdated: "December 21, 2024",
      showBreadcrumb: true,
    },
  },
  {
    id: "terms-content-1",
    type: "terms-content-1",
    enabled: true,
    settings: {
      contentSections: JSON.stringify([
        {
          title: "Agreement to Terms",
          content: `
            <p>By accessing or using our website and services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.</p>
            <ul>
              <li><strong>Acceptance:</strong> Your use of the service constitutes acceptance of these terms</li>
              <li><strong>Updates:</strong> We may modify these terms at any time with notice</li>
              <li><strong>Age Requirement:</strong> You must be at least 18 years old to use our services</li>
            </ul>
          `,
        },
        {
          title: "Use of Services",
          content: `
            <p>Our services are provided for lawful purposes only. You agree to use our services in accordance with all applicable laws and regulations.</p>
            <ul>
              <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account</li>
              <li><strong>Prohibited Activities:</strong> You may not use our services for illegal activities or to harm others</li>
              <li><strong>Content Ownership:</strong> All content on our platform remains our intellectual property</li>
            </ul>
          `,
        },
        {
          title: "Orders and Payments",
          content: `
            <p>When you place an order through our platform, you agree to the following terms:</p>
            <ul>
              <li><strong>Pricing:</strong> All prices are displayed in local currency and include applicable taxes</li>
              <li><strong>Payment:</strong> Payment must be made at the time of order placement</li>
              <li><strong>Order Confirmation:</strong> Orders are confirmed only after successful payment processing</li>
              <li><strong>Order Cancellation:</strong> We reserve the right to cancel orders for any reason</li>
            </ul>
          `,
        },
        {
          title: "Shipping and Delivery",
          content: `
            <p>We strive to deliver your orders in a timely manner. Please review our shipping policies:</p>
            <ul>
              <li><strong>Delivery Times:</strong> Estimated delivery times are provided at checkout</li>
              <li><strong>Shipping Costs:</strong> Shipping costs vary based on location and order size</li>
              <li><strong>Risk of Loss:</strong> Risk of loss transfers to you upon delivery to the carrier</li>
            </ul>
          `,
        },
        {
          title: "Limitation of Liability",
          content: `
            <p>To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.</p>
            <ul>
              <li><strong>No Warranty:</strong> Services are provided "as is" without warranties of any kind</li>
              <li><strong>Maximum Liability:</strong> Our liability is limited to the amount paid for the specific product or service</li>
            </ul>
          `,
        },
        {
          title: "Governing Law",
          content: `
            <p>These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is registered, without regard to its conflict of law provisions.</p>
          `,
        },
        {
          title: "Contact Information",
          content: `
            <p>If you have any questions about these Terms and Conditions, please contact us:</p>
            <p><strong>Email:</strong> legal@example.com<br/><strong>Phone:</strong> +1 (555) 123-4567</p>
          `,
        },
      ]),
    },
  },
];

export default function TermsAndConditionsPage() {
  const { shopDetails } = useShopStore();

  // Determine theme mode
  const isLegacyTheme = shopDetails?.legacy_theme ?? true;
  const shopId = shopDetails?.id?.toString();

  // Fetch custom pages for legacy themes
  const { data: customPages, isLoading } = useShopCustomPages(shopId || "", {
    enabled: !!shopId && isLegacyTheme,
  });

  // ========================================
  // STATIC THEME MODE (legacy_theme = true)
  // ========================================
  if (isLegacyTheme) {
    // Loading state
    if (!shopDetails || isLoading) {
      return <PageLoading />;
    }

    const termsContent = customPages?.terms_and_condition;

    if (!termsContent) {
      return (
        <div className="container pt-16 pb-10">
          <div className="rounded-xl py-4">
            <p className="text-gray-600 dark:text-gray-400">
              No terms and conditions available.
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
            dangerouslySetInnerHTML={{ __html: termsContent }}
          />
        </div>
      </div>
    );
  }

  // ========================================
  // THEME BUILDER MODE (legacy_theme = false)
  // ========================================
  return (
    <main className="zatiq-terms-page">
      <TermsPageRenderer sections={sections} />
    </main>
  );
}
