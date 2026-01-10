/**
 * Products Page Loading State
 * Displayed while the products page is loading (route-level Suspense)
 */

import { PageLoader } from "@/components/shared/skeletons/page-skeletons";

export default function ProductsLoading() {
  return <PageLoader />;
}
