import { useQuery } from "@tanstack/react-query";
import { useThemeStore } from "@/stores/themeStore";
import { useEffect } from "react";

async function fetchTheme() {
  const res = await fetch("/api/storefront/v1/theme");
  if (!res.ok) throw new Error("Failed to fetch theme");
  return res.json();
}

export function useTheme() {
  const { setTheme } = useThemeStore();

  const query = useQuery({
    queryKey: ["theme"],
    queryFn: fetchTheme,
    staleTime: Infinity, // Never refetch, static data --> Data only refetches on page reload (browser refresh)
  });

  // Sync to Zustand when data changes
  useEffect(() => {
    if (query.data) {
      console.log("Theme API Response:", query.data);
      setTheme(query.data);
    }
  }, [query.data, setTheme]);

  return query;
}