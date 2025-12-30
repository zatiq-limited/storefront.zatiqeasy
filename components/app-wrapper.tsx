/**
 * App Wrapper Component
 *
 * Client component that conditionally wraps children with ThemeRouter and ThemeLayout
 * based on the current route. For merchant routes, the merchant layout handles wrapping.
 */

"use client";

import { usePathname } from "next/navigation";
import { ThemeRouter } from "@/components/theme-router";
import ThemeLayout from "@/app/_layouts/theme/layout";

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const pathname = usePathname();

  // Don't wrap with ThemeRouter and ThemeLayout for merchant routes
  // The merchant layout handles its own wrapping
  const isMerchantRoute = pathname?.startsWith("/merchant/");

  if (isMerchantRoute) {
    return <>{children}</>;
  }

  // For root route and other routes, use ThemeRouter and ThemeLayout
  return (
    <ThemeRouter>
      <ThemeLayout>{children}</ThemeLayout>
    </ThemeRouter>
  );
}
