/**
 * Route Prefix Context Provider
 * 
 * Provides a route prefix to all child components, enabling them to construct
 * URLs that stay within the current context (e.g., /theme-builder vs /).
 * 
 * Usage:
 * - Wrap layout with <RoutePrefixProvider prefix="/theme-builder">
 * - In components: const { routePrefix } = useRoutePrefix();
 * - Use in links: href={`${routePrefix}/products/${handle}`}
 */

"use client";

import { createContext, useContext, ReactNode } from "react";

interface RoutePrefixContextValue {
  /** The route prefix (e.g., "/theme-builder" or "") */
  routePrefix: string;
  /** Helper to build a full path with the prefix */
  buildPath: (path: string) => string;
}

const RoutePrefixContext = createContext<RoutePrefixContextValue>({
  routePrefix: "",
  buildPath: (path) => path,
});

interface RoutePrefixProviderProps {
  children: ReactNode;
  /** Route prefix to prepend to all paths (e.g., "/theme-builder") */
  prefix?: string;
}

export function RoutePrefixProvider({
  children,
  prefix = "",
}: RoutePrefixProviderProps) {
  const buildPath = (path: string): string => {
    // Ensure path starts with /
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    // Combine prefix with path, avoiding double slashes
    return `${prefix}${normalizedPath}`;
  };

  return (
    <RoutePrefixContext.Provider value={{ routePrefix: prefix, buildPath }}>
      {children}
    </RoutePrefixContext.Provider>
  );
}

export function useRoutePrefix(): RoutePrefixContextValue {
  return useContext(RoutePrefixContext);
}

export default RoutePrefixProvider;
