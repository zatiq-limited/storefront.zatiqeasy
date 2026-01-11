"use client";

import { useSyncExternalStore, useMemo } from "react";
import { useSearchParams } from "next/navigation";

// Global state for shallow URL updates - triggers re-renders without RSC refetch
const shallowUpdateListeners: Set<() => void> = new Set();

/**
 * Subscribe to shallow URL updates
 */
export function subscribeToShallowUpdates(callback: () => void) {
  shallowUpdateListeners.add(callback);
  return () => {
    shallowUpdateListeners.delete(callback);
  };
}

/**
 * Shallow URL update that doesn't trigger RSC refetches
 * Uses window.history.replaceState for instant navigation
 * Notifies all subscribers to re-read URL params
 */
export function shallowReplace(url: string) {
  window.history.replaceState(window.history.state, "", url);
  // Notify all subscribers to re-read URL params
  shallowUpdateListeners.forEach((callback) => callback());
}

// Subscribe function for useSyncExternalStore
function subscribeToUrlChanges(callback: () => void) {
  // Subscribe to our shallow updates
  const unsubscribeShallow = subscribeToShallowUpdates(callback);

  // Subscribe to browser back/forward navigation
  window.addEventListener("popstate", callback);

  return () => {
    unsubscribeShallow();
    window.removeEventListener("popstate", callback);
  };
}

// Get current URL search string (client-side)
function getUrlSnapshot() {
  return window.location.search;
}

// Get URL search string for SSR (returns empty, will be hydrated)
function getServerSnapshot() {
  return "";
}

/**
 * Custom hook that reads search params and updates on shallow URL changes
 * This is needed because Next.js useSearchParams() doesn't react to history.replaceState
 *
 * Uses useSyncExternalStore for proper React 18 subscription pattern
 *
 * Usage:
 * ```
 * const searchParams = useShallowSearchParams();
 * const category = searchParams.get("selected_category");
 * ```
 */
export function useShallowSearchParams() {
  // Get Next.js search params (for SSR hydration and full navigations)
  const nextSearchParams = useSearchParams();
  const nextParamsString = nextSearchParams.toString();

  // Subscribe to URL changes (shallow updates + popstate)
  const urlSearchString = useSyncExternalStore(
    subscribeToUrlChanges,
    getUrlSnapshot,
    getServerSnapshot
  );

  // Use the URL search string, falling back to Next.js params for SSR
  const searchString = urlSearchString || nextParamsString;

  // Memoize the URLSearchParams object
  return useMemo(
    () => new URLSearchParams(searchString),
    [searchString]
  );
}

/**
 * Helper to create a URL with updated search params
 */
export function createUrlWithParams(
  pathname: string,
  params: URLSearchParams
): string {
  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}
