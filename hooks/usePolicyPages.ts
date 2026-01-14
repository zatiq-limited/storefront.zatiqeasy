"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Fetch privacy policy page data
 */
async function fetchPrivacyPolicy() {
  const res = await fetch("/api/storefront/v1/page/privacy-policy");
  if (!res.ok) throw new Error("Failed to fetch privacy policy page");
  return res.json();
}

/**
 * Fetch return policy page data
 */
async function fetchReturnPolicy() {
  const res = await fetch("/api/storefront/v1/page/return-policy");
  if (!res.ok) throw new Error("Failed to fetch return policy page");
  return res.json();
}

/**
 * Fetch terms and conditions page data
 */
async function fetchTermsAndConditions() {
  const res = await fetch("/api/storefront/v1/page/terms-and-conditions");
  if (!res.ok) throw new Error("Failed to fetch terms and conditions page");
  return res.json();
}

/**
 * Hook to fetch privacy policy page sections
 */
export function usePrivacyPolicyPage(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["privacyPolicyPage"],
    queryFn: fetchPrivacyPolicy,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch return policy page sections
 */
export function useReturnPolicyPage(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["returnPolicyPage"],
    queryFn: fetchReturnPolicy,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch terms and conditions page sections
 */
export function useTermsAndConditionsPage(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["termsAndConditionsPage"],
    queryFn: fetchTermsAndConditions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}
