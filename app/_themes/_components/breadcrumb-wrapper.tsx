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
  const theme = shopDetails?.shop_theme?.theme_name;
  const baseUrl = shopDetails?.baseUrl || "";

  // Don't show breadcrumb on home page
  const isHomePage =
    pathname === baseUrl || pathname === "/" || pathname === baseUrl + "/";

  // Don't show for Basic and Sellora themes (as per old project)
  if (theme === "Basic" || theme === "Sellora") {
    return null;
  }

  // Don't show on home page
  if (isHomePage) {
    return null;
  }

  // Don't show on Aurora products page (as per old project line 173)
  if (theme === "Aurora" && pathname.includes("/products")) {
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
