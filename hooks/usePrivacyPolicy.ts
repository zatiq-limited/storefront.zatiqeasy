"use client";

import { useQuery } from "@tanstack/react-query";
import { usePrivacyPolicyStore } from "@/stores/privacyPolicyStore";
import { useEffect } from "react";

async function fetchPrivacyPolicy() {
  const res = await fetch("/api/storefront/v1/page/privacy-policy");
  if (!res.ok) throw new Error("Failed to fetch privacy policy page");
  return res.json();
}

export function usePrivacyPolicy() {
  const { setPrivacyPolicy } = usePrivacyPolicyStore();

  const query = useQuery({
    queryKey: ["privacyPolicy"],
    queryFn: fetchPrivacyPolicy,
    staleTime: Infinity,
  });

  // Sync to Zustand when data changes
  useEffect(() => {
    if (query.data) {
      console.log("Privacy Policy API Response:", query.data);
      setPrivacyPolicy(query.data);
    }
  }, [query.data, setPrivacyPolicy]);

  return query;
}
