"use client";

import { useParams } from "next/navigation";
import { useShopCustomPages } from "@/hooks/useShopCustomPages";
import { PageLoading } from "@/components/shared/page-loading";
import "react-quill/dist/quill.snow.css";

/**
 * Merchant Return and Cancellation Policy Page
 * Matches old project: themes/basic/modules/shop-pages/return_and_cancellation.module.tsx
 */
export default function MerchantReturnPolicyPage() {
  const params = useParams();
  const shopId = params?.shopId as string;

  // Fetch custom pages (return_and_cancellation_policy content)
  const { data: customPages, isLoading } = useShopCustomPages(shopId);

  // Loading state
  if (isLoading) {
    return <PageLoading />;
  }

  const returnPolicyContent = customPages?.return_and_cancellation_policy;

  if (!returnPolicyContent) {
    return (
      <div className="container pt-16 pb-10">
        <div className="rounded-xl max-w-7xl mx-auto p-4">
          <p className="text-gray-600 dark:text-gray-400">
            No return and cancellation policy available.
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
          dangerouslySetInnerHTML={{ __html: returnPolicyContent }}
        />
      </div>
    </div>
  );
}
