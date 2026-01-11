"use client";

import { useParams } from "next/navigation";
import { useShopCustomPages } from "@/hooks/useShopCustomPages";
import { PageLoading } from "@/components/shared/page-loading";
import "react-quill/dist/quill.snow.css";

/**
 * Merchant Privacy Policy Page
 * Matches old project: themes/basic/modules/shop-pages/privacy-policy.module.tsx
 */
export default function MerchantPrivacyPolicyPage() {
  const params = useParams();
  const shopId = params?.shopId as string;

  // Fetch custom pages (privacy_policy content)
  const { data: customPages, isLoading } = useShopCustomPages(shopId);

  // Loading state
  if (isLoading) {
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
