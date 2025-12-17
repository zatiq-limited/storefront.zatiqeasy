/**
 * ========================================
 * COLLECTIONS PAGE
 * ========================================
 *
 * Collections listing page
 */

import { getCollectionsPageData } from "@/api/server";
import CollectionsPageRenderer from "@/components/CollectionsPageRenderer";

export default async function CollectionsPage() {
  const pageData = await getCollectionsPageData();

  return (
    <CollectionsPageRenderer
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections={(pageData?.sections || []) as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collections={(pageData?.collections || []) as any}
    />
  );
}

export const metadata = {
  title: "Collections | Zatiq Store",
  description: "Browse our collections",
};
