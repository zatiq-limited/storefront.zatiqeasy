import { useQuery } from "@tanstack/react-query";
import { usePrivacyPolicyStore } from "@/stores/privacyPolicyStore";
import { useEffect } from "react";
import { CACHE_TIMES, DEFAULT_QUERY_OPTIONS, API_ROUTES } from "@/lib/constants";

async function fetchPrivacyPolicy() {
  const res = await fetch(API_ROUTES.PAGE_PRIVACY_POLICY);
  if (!res.ok) throw new Error("Failed to fetch privacy policy page");
  return res.json();
}

export function usePrivacyPolicy() {
  const { setPrivacyPolicy } = usePrivacyPolicyStore();

  const query = useQuery({
    queryKey: ["privacyPolicy"],
    queryFn: fetchPrivacyPolicy,
    ...CACHE_TIMES.STATIC,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Sync to Zustand when data changes
  useEffect(() => {
    if (query.data) {
      setPrivacyPolicy(query.data);
    }
  }, [query.data, setPrivacyPolicy]);

  return query;
}