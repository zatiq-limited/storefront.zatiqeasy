"use client";

import { useQuery } from "@tanstack/react-query";
import { useAboutUsStore } from "@/stores/aboutUsStore";
import { useEffect } from "react";
import { CACHE_TIMES, DEFAULT_QUERY_OPTIONS, API_ROUTES } from "@/lib/constants";

async function fetchAboutUs() {
  const res = await fetch(API_ROUTES.PAGE_ABOUT_US);
  if (!res.ok) throw new Error("Failed to fetch about us page");
  return res.json();
}

export function useAboutUs() {
  const { setAboutUs } = useAboutUsStore();

  const query = useQuery({
    queryKey: ["aboutUs"],
    queryFn: fetchAboutUs,
    ...CACHE_TIMES.STATIC,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Sync to Zustand when data changes
  useEffect(() => {
    if (query.data) {
      setAboutUs(query.data);
    }
  }, [query.data, setAboutUs]);

  return query;
}
