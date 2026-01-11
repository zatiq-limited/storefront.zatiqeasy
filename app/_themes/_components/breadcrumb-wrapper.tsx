"use client";

import { Breadcrumb } from "@/components/shared/breadcrumb";
import { usePathname } from "next/navigation";
import { useShopStore } from "@/stores/shopStore";

/**
 * BreadcrumbWrapper Component
 * Conditionally renders breadcrumb based on theme and route
 * Matches old project's layout.component.tsx breadcrumb logic
 */
export function BreadcrumbWrapper() {
  const pathname = usePathname();
  const { shopDetails } = useShopStore();
  const baseUrl = shopDetails?.baseUrl || "";
  const isLegacyTheme = shopDetails?.legacy_theme ?? true;

  // Don't show breadcrumb for legacy themes
  // Legacy themes handle their own breadcrumbs internally
  if (isLegacyTheme) {
    return null;
  }

  // Don't show breadcrumb on home page
  const isHomePage =
    pathname === baseUrl || pathname === "/" || pathname === baseUrl + "/";

  if (isHomePage) {
    return null;
  }

  // Don't show on landing pages (single-product routes)
  // Landing pages (Grip, Arcadia, Nirvana) have their own navbar and layout
  if (pathname.includes("/single-product/")) {
    return null;
  }

  return (
    <div className="container w-full">
      <Breadcrumb
        homeElement="Home"
        separator={<span className="text-gray-400">›</span>}
        activeClasses="text-blue-zatiq font-bold"
        containerClasses="flex items-center mt-6 md:mt-[44px]"
        listClasses="text-[#9CA3AF] text-sm md:text-[16px] font-normal hover:underline max-w-[200px] md:max-w-[250px] text-ellipsis line-clamp-1"
        capitalizeLinks
      />
    </div>
  );
}
