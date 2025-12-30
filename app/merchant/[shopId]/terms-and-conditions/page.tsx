"use client";

import { useParams } from "next/navigation";
import { useShopCustomPages } from "@/hooks/useShopCustomPages";
import { PageLoading } from "@/components/shared/page-loading";
import "react-quill/dist/quill.snow.css";

/**
 * Merchant Terms and Conditions Page
 * Matches old project: themes/basic/modules/shop-pages/terms_and_condition.module.tsx
 */
export default function MerchantTermsAndConditionsPage() {
  const params = useParams();
  const shopId = params?.shopId as string;

  // Fetch custom pages (terms_and_condition content)
  const { data: customPages, isLoading } = useShopCustomPages(shopId);

  // Loading state
  if (isLoading) {
    return <PageLoading />;
  }

  const termsContent = customPages?.terms_and_condition;

  if (!termsContent) {
    return (
      <div className="container pt-16 pb-10">
        <div className="rounded-xl max-w-7xl mx-auto p-4">
          <p className="text-gray-600 dark:text-gray-400">
            No terms and conditions available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container pt-16 pb-10">
      <div className="rounded-xl max-w-7xl mx-auto p-4">
        <div
          className="ql-editor dark:text-gray-200 text-black-2 ql-snow"
          dangerouslySetInnerHTML={{ __html: termsContent }}
        />
      </div>
    </div>
  );
}
