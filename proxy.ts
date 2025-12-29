import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 Proxy (formerly Middleware)
 * Handles subdomain and custom domain routing
 */
export function proxy(request: NextRequest) {
  const { pathname, host } = request.nextUrl;

  // Skip proxy for static files, API routes, and _next
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/static/") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Check if it's a subdomain or custom domain (not localhost)
  const isSubdomain =
    host.includes(".zatiqeasy.com") ||
    host.includes(".zatiq.app") ||
    host.includes(".bdsite.net") ||
    host.includes(".myecom.site") ||
    host.includes(".sellbd.shop") ||
    host.includes(".sell-bazar.com");

  const isCustomDomain =
    !host.includes("localhost") && !host.includes("127.0.0.1") && !isSubdomain;

  // If it's a subdomain or custom domain, allow the root route
  if ((isSubdomain || isCustomDomain) && pathname === "/") {
    return NextResponse.next();
  }

  // For localhost without /merchant/[shopId], pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
