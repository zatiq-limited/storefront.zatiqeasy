import { useQuery } from "@tanstack/react-query";
import { useThemeStore } from "@/stores/themeStore";
import { useEffect } from "react";
import { CACHE_TIMES, DEFAULT_QUERY_OPTIONS, API_ROUTES } from "@/lib/constants";

async function fetchTheme() {
  const res = await fetch(API_ROUTES.THEME);
  if (!res.ok) throw new Error("Failed to fetch theme");
  return res.json();
}

export function useTheme() {
  const { setTheme } = useThemeStore();

  const query = useQuery({
    queryKey: ["theme"],
    queryFn: fetchTheme,
    ...CACHE_TIMES.STATIC,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Sync to Zustand when data changes
  useEffect(() => {
    if (query.data) {
      setTheme(query.data);
    }
  }, [query.data, setTheme]);

  return query;
}