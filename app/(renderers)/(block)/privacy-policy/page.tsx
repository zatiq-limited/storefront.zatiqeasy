"use client";

import { useShopStore } from "@/stores/shopStore";
import { useShopCustomPages } from "@/hooks/useShopCustomPages";
import PrivacyPageRenderer from "@/components/renderers/page-renderer/privacy-page-renderer";
import { PageLoading } from "@/components/shared/page-loading";
import type { Section } from "@/lib/types";
import "react-quill/dist/quill.snow.css";

// Default privacy policy sections
const sections: Section[] = [
  {
    id: "privacy-hero-1",
    type: "privacy-hero-1",
    enabled: true,
    settings: {
      headline: "Privacy Policy",
      subheadline: "Your Privacy Matters",
      description:
        "We are committed to protecting your personal information and your right to privacy.",
      lastUpdated: "December 21, 2024",
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
          content: `
            <p>We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us for support.</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, phone number, shipping and billing addresses</li>
              <li><strong>Payment Information:</strong> Credit card numbers, banking details (processed securely through our payment providers)</li>
              <li><strong>Account Information:</strong> Username, password, purchase history, and preferences</li>
            </ul>
          `,
        },
        {
          title: "How We Use Your Information",
          content: `
            <p>We use the information we collect to:</p>
            <ul>
              <li><strong>Process Transactions:</strong> Complete purchases, process payments, and deliver products to you</li>
              <li><strong>Communicate With You:</strong> Send order confirmations, shipping updates, and respond to inquiries</li>
              <li><strong>Personalize Experience:</strong> Recommend products based on your preferences and shopping history</li>
            </ul>
          `,
        },
        {
          title: "Information Sharing and Disclosure",
          content: `
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only with trusted service providers who assist in operating our website.</p>
          `,
        },
        {
          title: "Data Security",
          content: `
            <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            <ul>
              <li><strong>SSL Encryption:</strong> All data transmitted between your browser and our servers is encrypted</li>
              <li><strong>Secure Payment Processing:</strong> We use PCI-compliant payment processors</li>
            </ul>
          `,
        },
        {
          title: "Cookies and Tracking",
          content: `
            <p>We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie preferences through your browser settings.</p>
          `,
        },
        {
          title: "Your Rights and Choices",
          content: `
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
            </ul>
          `,
        },
        {
          title: "Contact Us",
          content: `
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <p><strong>Email:</strong> privacy@example.com<br/><strong>Phone:</strong> +1 (555) 123-4567</p>
          `,
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
  return (
    <main className="zatiq-privacy-policy-page">
      <PrivacyPageRenderer sections={sections} />
    </main>
  );
}
