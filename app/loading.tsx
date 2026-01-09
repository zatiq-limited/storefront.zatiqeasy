/**
 * Root App Loading State
 * Displayed while the homepage is loading (route-level Suspense)
 */

import { FullPageLoader } from "@/components/shared/skeletons/page-skeletons";

export default function RootLoading() {
  return <FullPageLoader />;
}
