"use client";

import { useQuery } from "@tanstack/react-query";
import { useHomepageStore } from "@/stores/homepageStore";
import { useEffect } from "react";
import { CACHE_TIMES, DEFAULT_QUERY_OPTIONS, API_ROUTES } from "@/lib/constants";

async function fetchHomepage() {
  const res = await fetch(API_ROUTES.PAGE_HOME);
  if (!res.ok) throw new Error("Failed to fetch homepage");
  return res.json();
}

export function useHomepage() {
  const { setHomepage } = useHomepageStore();

  const query = useQuery({
    queryKey: ["homepage"],
    queryFn: fetchHomepage,
    ...CACHE_TIMES.STATIC,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Sync to Zustand when data changes
  useEffect(() => {
    if (query.data) {
      setHomepage(query.data);
    }
  }, [query.data, setHomepage]);

  return query;
}
