/**
 * ========================================
 * PRIVACY POLICY PAGE
 * ========================================
 */

import { getPrivacyPolicyPageData } from "@/api/server";
import { PrivacyPolicyClient } from "./PrivacyPolicyClient";

export default async function PrivacyPolicyPage() {
  const pageData = await getPrivacyPolicyPageData();
  const sections = pageData?.sections || [];

  return (
    <main className="zatiq-privacy-page">
      <PrivacyPolicyClient sections={sections} />
    </main>
  );
}

export const metadata = {
  title: "Privacy Policy | Zatiq Store",
  description: "Our privacy policy",
};
